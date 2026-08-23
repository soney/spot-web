# frozen_string_literal: true

# Provides the `cv_publication_codes` Liquid filter used by
# _includes/cv_publication_items_for_types.html.
#
# Given the publication records, the venues in render order
# (year-descending), the type -> prefix table from
# _data/publication_types.yaml, and the sections from
# _data/cv_publication_sections.yaml, it returns a map from publication id to
# its CV numbering code ("J.45", "C.31", ...).
#
# The letter is the paper's own type. The number is its position among
# everything numbered alongside it, counting up from the oldest, so a section
# that holds several types runs as one sequence rather than restarting at each
# one: W.1, D.2, D.3, D.4, W.5. What counts alongside what comes from the
# sections file -- each section is one numbering group.
#
# Sections marked `variant: split` are skipped when the groups are worked out,
# because they are a second view of types another section already numbers: the
# journal and conference papers are numbered together whether the CV is
# showing them in one section or two, so J.45 is J.45 either way and the
# separated view simply runs with gaps in it. A type that no section claims is
# numbered on its own.
#
# HAZARD: because numbers count UP from the oldest, inserting an *older*
# publication shifts the code of every newer one in its group -- and the group
# is now wider than the type, so adding an old workshop paper renumbers the
# posters and demos beside it too. A research statement or cover letter that
# cites "C.31" will quietly point at a different paper afterward. Codes are
# stable only as long as you add publications newer than everything already
# listed.
#
# This lives in Ruby because the counting needs a mutable per-group
# counter, which Liquid cannot express cleanly. Plugins are fine here:
# the site is always built with `bundle exec jekyll build` (locally or
# in CI) and the finished _site is what gets deployed.
module Jekyll
  module CvPublicationCodes
    def cv_publication_codes(publications, venues, publication_types, sections)
      prefixes = publication_types.to_h { |t| [t["type"], t["prefix"]] }
      group_of = publication_numbering_groups(sections)
      pubs_by_venue = publications.group_by { |pub| pub["venue"] }

      # Every paper that gets a code, in render order, with the letter and the
      # group it takes its number from. Totals and codes are both read off
      # this one list: a type that renders no code has to be missing from both
      # or it leaves a gap in the group it would have sat in, and deciding
      # that twice is how the two would come to disagree.
      numbered = venues.flat_map do |venue|
        prefix = prefixes[venue["type"]]
        next [] unless prefix

        group = group_of.fetch(venue["type"], venue["type"])
        pubs_by_venue.fetch(venue["id"], []).map { |pub| [prefix, group, pub] }
      end

      # Render order is year-descending, so the first paper of a group is the
      # one with its highest number: start each counter at the group's total
      # and come down, leaving the oldest paper of the group as its number 1.
      remaining = Hash.new(0)
      numbered.each { |_prefix, group, _pub| remaining[group] += 1 }

      codes = {}
      numbered.each do |prefix, group, pub|
        codes[pub["id"]] = "#{prefix}.#{remaining[group]}"
        remaining[group] -= 1
      end
      codes
    end

    private

    # venue type -> the key of the numbering group it counts in, out of
    # _data/cv_publication_sections.yaml. The key is the section's type list
    # rather than its title, so retitling a section cannot renumber the CV.
    # The name is prefixed because every Liquid filter module shares one
    # namespace -- see the `_plugins/` conventions in AGENTS.md.
    def publication_numbering_groups(sections)
      groups = {}
      Array(sections).each do |section|
        next if section["variant"] == "split"

        types = Array(section["types"])
        key = types.join("+")
        types.each { |type| groups[type] = key }
      end
      groups
    end
  end
end

Liquid::Template.register_filter(Jekyll::CvPublicationCodes)
