#!/usr/bin/env ruby
# frozen_string_literal: true

# Audits assets/pdfs/ against the `pdf:` fields in _data/publications.yaml, and
# derives the canonical filename for a record.
#
# Nothing in Jekyll validates that a `pdf:` points at a file that exists, or
# that a file in assets/pdfs/ is reachable from anywhere — both failures build
# cleanly and render as a button that 404s, or as no button at all. This is the
# check for that.
#
# Deliberately stdlib-only: it runs from a UserPromptSubmit hook on every
# prompt, so it must not pay the `bundle exec` / vendor/bundle startup cost.
#
#   ruby script/pdf_audit.rb                 # human-readable audit; exit 1 if problems
#   ruby script/pdf_audit.rb --hook          # hook JSON on problems, silent when clean
#   ruby script/pdf_audit.rb --name <pub-id> # canonical filename for one record
#   ruby script/pdf_audit.rb --verify-names  # every referenced PDF vs. its canonical name

require 'yaml'
require 'json'
require 'date'

ROOT = File.expand_path(ENV['CLAUDE_PROJECT_DIR'] || File.join(__dir__, '..'))
PDF_DIR = File.join(ROOT, 'assets', 'pdfs')

# Dropped when deriving a short title from a title with no colon in it. Only the
# words that actually show up as noise in this repo's titles; the rule is "first
# three words that carry meaning", not a general-purpose stopword list.
STOPWORDS = %w[
  a an the and or of for in on with to by from at as is are that this these their its via
  toward towards using
].freeze

def load_yaml(name)
  path = File.join(ROOT, '_data', name)
  YAML.safe_load_file(path, permitted_classes: [Date, Time], aliases: true) || []
rescue Errno::ENOENT
  []
end

# Lowercase, accents folded, everything else collapsed to single hyphens.
# Apostrophes are deleted rather than collapsed, so "Don't" is dont, not don-t.
def slug(str)
  str.to_s
     .unicode_normalize(:nfkd)
     .gsub(/\p{Mn}/, '')
     .downcase
     .delete("'’")
     .gsub(/[^a-z0-9]+/, '-')
     .gsub(/\A-+|-+\z/, '')
end

# The system name if the title has one ("Editrail: Understanding..." -> editrail,
# "Arboretum and Arbility: ..." -> arboretum-and-arbility), otherwise the first
# three meaningful words ("Simulating Human Cursor Trajectories for ..." ->
# simulating-human-cursor).
def short_title(title)
  return slug(title.split(':').first) if title.to_s.include?(':')

  words = title.to_s.split(/\s+/).map { |w| slug(w) }.reject(&:empty?)
  words.reject { |w| STOPWORDS.include?(w) }.first(3).join('-')
end

# short_name with punctuation removed, plus the year — unless the short name
# already carries the year, as the workshop venues do (CHI2025-CompUI). A few
# one-off workshop venues have no short_name; those spell out the full_name.
def venue_suffix(venue)
  name = slug(venue['short_name'] || venue['full_name'] || venue['id']).delete('-')
  year = venue['year'].to_s
  name.include?(year) ? name : "#{name}#{year}"
end

def canonical_name(pub, people, venues)
  first_author = Array(pub['authors']).first
  person = people.find { |p| p['id'] == first_author }
  venue = venues.find { |v| v['id'] == pub['venue'] }
  return nil unless person && venue

  surname = slug(person['family_name'] || person['id'])
  parts = [surname, short_title(pub['title']), venue_suffix(venue)].reject { |s| s.nil? || s.empty? }
  "#{parts.join('-')}.pdf"
end

def audit
  pubs = load_yaml('publications.yaml')
  people = load_yaml('people.yaml')
  venues = load_yaml('venues.yaml')

  referenced = {}
  dangling = []
  pubs.each do |pub|
    next unless (ref = pub['pdf'])

    referenced[File.basename(ref)] = pub
    # `pdf` is resolved relative to assets/, so that is where this must look.
    dangling << [pub['id'], ref] unless File.file?(File.join(ROOT, 'assets', ref))
  end

  on_disk = Dir.glob(File.join(PDF_DIR, '*.pdf')).map { |p| File.basename(p) }.sort
  stray = on_disk.reject { |f| referenced.key?(f) }

  { pubs: pubs, people: people, venues: venues,
    referenced: referenced, dangling: dangling, stray: stray }
end

# Which stray file belongs to which record is not worth guessing at. Instead,
# list the records that still have no `pdf:` at all, with the filename each one
# wants — a stray file is almost always destined for one of them.
def unplaced_records(result)
  result[:pubs].reject { |p| p['pdf'] }.filter_map do |pub|
    name = canonical_name(pub, result[:people], result[:venues])
    next unless name

    [pub['id'], name]
  end
end

case ARGV[0]
when '--name'
  pub_id = ARGV[1]
  abort "usage: #{$PROGRAM_NAME} --name <publication-id>" unless pub_id

  result = audit
  pub = result[:pubs].find { |p| p['id'] == pub_id }
  abort "no publication with id #{pub_id}" unless pub

  name = canonical_name(pub, result[:people], result[:venues])
  abort "cannot derive a name for #{pub_id} (unknown author or venue)" unless name

  puts name

when '--verify-names'
  result = audit
  mismatches = result[:referenced].filter_map do |file, pub|
    want = canonical_name(pub, result[:people], result[:venues])
    next if want.nil? || want == file

    [file, want]
  end
  if mismatches.empty?
    puts "all #{result[:referenced].size} referenced PDFs match the naming convention"
  else
    puts "#{mismatches.size} of #{result[:referenced].size} referenced PDFs are off-convention:"
    mismatches.each { |have, want| puts "  #{have}\n    -> #{want}" }
  end

when '--hook'
  result = audit
  exit 0 if result[:stray].empty? && result[:dangling].empty?

  lines = []
  unless result[:stray].empty?
    lines << "PDFs in assets/pdfs/ that no publications.yaml record references:"
    result[:stray].each { |f| lines << "  #{f}" }
    unplaced = unplaced_records(result)
    unless unplaced.empty?
      lines << "Records with no `pdf:` yet, and the filename each one wants:"
      unplaced.each { |id, name| lines << "  #{id} -> #{name}" }
    end
    lines << "If one of these is a paper being added, /add-paper wires it up."
  end
  unless result[:dangling].empty?
    lines << "publications.yaml records whose `pdf:` file does not exist (the button 404s):"
    result[:dangling].each { |id, ref| lines << "  #{id} -> #{ref}" }
  end

  puts JSON.generate(
    hookSpecificOutput: {
      hookEventName: 'UserPromptSubmit',
      additionalContext: lines.join("\n")
    },
    suppressOutput: true
  )

else
  result = audit
  problems = false

  unless result[:stray].empty?
    problems = true
    puts "Unreferenced PDFs in assets/pdfs/ (#{result[:stray].size}):"
    result[:stray].each { |f| puts "  #{f}" }
    puts
  end

  unless result[:dangling].empty?
    problems = true
    puts "Records pointing at a missing file (#{result[:dangling].size}):"
    result[:dangling].each { |id, ref| puts "  #{id} -> #{ref}" }
    puts
  end

  if problems
    exit 1
  else
    puts "assets/pdfs/ and publications.yaml agree (#{result[:referenced].size} PDFs)"
  end
end
