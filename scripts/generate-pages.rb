#!/usr/bin/env ruby
# frozen_string_literal: true

# Regenerates the Jekyll collection stubs (_papers, _people_pages) from the
# YAML data files. Each output directory is wiped and rebuilt, so removing an
# entry from the data also removes its page. Stubs are front-matter only; the
# paper/person layouts pull all real content from site.data at build time.

require "yaml"
require "fileutils"
require "date"

ROOT = File.expand_path("..", __dir__)

COLLECTIONS = [
  {
    label: "paper",
    data_file: "publications.yaml",
    output_dir: "_papers",
    filter: ->(_pub) { true },
    front_matter: lambda { |pub, id|
      {
        "layout" => "paper",
        "title" => pub["title"],
        "pub_id" => id,
        "nav" => "research",
        "permalink" => "/papers/#{id}/"
      }
    }
  },
  {
    label: "person",
    data_file: "people.yaml",
    output_dir: "_people_pages",
    filter: ->(person) { person["use_local_homepage"] == true },
    front_matter: lambda { |person, id|
      full_name = [person["given_name"], person["family_name"]].compact.join(" ").strip
      {
        "layout" => "person",
        "title" => full_name.empty? ? id : full_name,
        "person_id" => id,
        "nav" => "team",
        "permalink" => "/people/#{id}/"
      }
    }
  }
].freeze

COLLECTIONS.each do |collection|
  data_path = File.join(ROOT, "_data", collection[:data_file])
  output_dir = File.join(ROOT, collection[:output_dir])

  unless File.exist?(data_path)
    warn "Data file not found: #{data_path}"
    exit 1
  end

  records = YAML.safe_load(
    File.read(data_path),
    permitted_classes: [Date, Time],
    aliases: true
  )

  unless records.is_a?(Array)
    warn "Expected top-level array in #{data_path}"
    exit 1
  end

  FileUtils.rm_rf(output_dir)
  FileUtils.mkdir_p(output_dir)

  written = 0
  records.each do |record|
    next unless record.is_a?(Hash)
    next unless collection[:filter].call(record)

    id = record["id"]&.to_s&.strip
    next if id.nil? || id.empty?

    front_matter = collection[:front_matter].call(record, id)
    content = +"---\n"
    content << front_matter.to_yaml.sub(/\A---\s*\n/, "")
    content << "---\n"

    File.write(File.join(output_dir, "#{id}.md"), content)
    written += 1
  end

  puts "Wrote #{written} #{collection[:label]} pages to #{output_dir}"
end
