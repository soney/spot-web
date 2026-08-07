# frozen_string_literal: true

# Provides the `venues_by_date_desc` Liquid filter: venue records newest
# first, used everywhere publications are listed.
#
# This replaces `site.data.venues | sort: "year" | reverse`, which keyed on
# the year alone. Venues sharing a year tied, and Liquid's sort is not stable,
# so their order was a byproduct rather than a decision -- CHI 2026 (April)
# rendered above UIST 2026 (November) for no reason you could predict.
#
# The ordering is now:
#   1. year, descending
#   2. conference_start, descending -- so a November conference precedes an
#      April one in the same year
#   3. position in venues.yaml, ascending -- a deterministic tiebreak for
#      venues on the same day (e.g. a conference and its poster track), so
#      the order can never shift on its own
#
# conference_start is "M/D" with no year and no zero-padding guarantee
# ("11/2", "4/13", "09/28"), so it must be compared numerically: as strings
# "11/2" sorts before "4/13", which is exactly backwards. Venues with no
# conference_start at all (preprints, book chapters) sort after the dated
# venues of the same year.
#
# NOTE: cv_publication_codes walks venues in this order and counts down, so
# this ordering also determines the CV's J/C numbering.
module Jekyll
  module VenueOrder
    def venues_by_date_desc(venues)
      Array(venues).each_with_index.sort_by { |venue, index|
        month, day = parse_start(venue["conference_start"])
        [-venue["year"].to_i, -month, -day, index]
      }.map(&:first)
    end

    private

    # "11/2" -> [11, 2]; "09/28" -> [9, 28]; nil or unparseable -> [0, 0]
    def parse_start(value)
      return [0, 0] if value.nil?

      parts = value.to_s.split("/")
      return [0, 0] unless parts.size == 2

      [parts[0].to_i, parts[1].to_i]
    end
  end
end

Liquid::Template.register_filter(Jekyll::VenueOrder)
