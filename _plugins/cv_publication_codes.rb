# frozen_string_literal: true

# Provides the `cv_publication_codes` Liquid filter used by
# _includes/cv_publication_items_for_types.html.
#
# Given the publication records, the venues in render order
# (year-descending), and the type -> prefix table from
# _data/publication_types.yaml, it returns a map from publication id to
# its CV numbering code ("J.12", "C.31", ...). Numbers count down from
# each type's total, so the newest publication of a type carries the
# highest number.
#
# HAZARD: because numbers count DOWN from each type's total, inserting an
# *older* publication shifts the code of every newer one of that type. A
# research statement or cover letter that cites "J.12" will quietly point at a
# different paper afterward. Codes are stable only as long as you add
# publications newer than everything already listed.
#
# This lives in Ruby because the counting needs a mutable per-type
# counter, which Liquid cannot express cleanly. Plugins are fine here:
# the site is always built with `bundle exec jekyll build` (locally or
# in CI) and the finished _site is what gets deployed.
module Jekyll
  module CvPublicationCodes
    def cv_publication_codes(publications, venues, publication_types)
      prefixes = publication_types.to_h { |t| [t["type"], t["prefix"]] }
      pubs_by_venue = publications.group_by { |pub| pub["venue"] }

      remaining = Hash.new(0)
      venues.each do |venue|
        remaining[venue["type"]] += pubs_by_venue.fetch(venue["id"], []).size
      end

      codes = {}
      venues.each do |venue|
        type = venue["type"]
        prefix = prefixes[type]
        next unless prefix

        pubs_by_venue.fetch(venue["id"], []).each do |pub|
          codes[pub["id"]] = "#{prefix}.#{remaining[type]}"
          remaining[type] -= 1
        end
      end
      codes
    end
  end
end

Liquid::Template.register_filter(Jekyll::CvPublicationCodes)
