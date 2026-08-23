# frozen_string_literal: true

# Provides the `cv_award_entries` Liquid filter used by the Awards section of
# _includes/cv_body.html.
#
# The section merges two differently-shaped streams into one year-descending
# list: the plain awards in the CV's _data/cvs/ file, and the awards attached to
# publications. Liquid cannot sort a mixed collection by a computed key, so
# the template used to encode each entry as "YYYY-{A|P}{index}::::<html>",
# join them, string-sort, and split them back apart.
#
# This filter does the merge and the ordering; the template still renders both
# shapes. Each returned entry is a hash with:
#   "kind"   "award" for a CV-file award, "paper_award" for a publication's
#   "item"   the CV-file award record      (kind == "award")
#   "pub"    the publication record         (kind == "paper_award")
#   "venue"  the publication's venue record (kind == "paper_award")
#
# ORDERING: year descending, then month descending -- a November award
# precedes an April one of the same year, which is the rule venue_order.rb
# already applies to venues. Within a month, paper awards ("P") come before
# plain awards ("A"), and within each of those, REVERSE of the order the
# entries appear in the source data.
#
# The month is read out of whatever the entry renders with -- a plain award's
# `date_start` ("09/2021"), a paper award's venue `conference_start` ("10/7")
# -- so the printed dates and the order they sit in cannot disagree. An entry
# with no month to read (an award dated with a bare year, a venue with no
# `conference_start`) sorts after the dated entries of its year, again as
# venue_order.rb does.
#
# The month is the one deliberate change to an ordering that was otherwise
# inherited from the old string sort: the section used to key on the year
# alone, which left 04/2020 sitting above 08/2020. The rest is unchanged, and
# the index is zero-padded because the old encoding was not -- the old code
# sorted the whole "<key>::::<html>" string, and ":" (0x3A) sorts above every
# digit, so an index that was a prefix of another ("A1" vs "A10") compared the
# opposite way round from the keys alone. Change the ordering only as an
# intentional, reviewed content change.
module Jekyll
  module CvAwardEntries
    def cv_award_entries(awards, venues, publications)
      entries = []

      (awards || []).each_with_index do |item, i|
        year = "0000"
        if item["date_start"]
          year = item["date_start"].to_s.split("/").last
        end
        # 1-based to match the old Liquid forloop.index
        entries << {
          "sort_key" => award_sort_key(year, month_of(item["date_start"]), "A", i + 1),
          "kind" => "award",
          "item" => item
        }
      end

      pubs_by_venue = publications.group_by { |pub| pub["venue"] }
      award_index = 0
      venues.each do |venue|
        pubs_by_venue.fetch(venue["id"], []).each do |pub|
          next unless pub["award"] && pub["award"] != "none"

          year = venue["year"] || "0000"
          # 0-based to match the old Liquid award_index
          entries << {
            "sort_key" => award_sort_key(year, month_of(venue["conference_start"]), "P", award_index),
            "kind" => "paper_award",
            "pub" => pub,
            "venue" => venue
          }
          award_index += 1
        end
      end

      entries.sort_by { |e| e["sort_key"] }.reverse
    end

    private

    # "2021-09-A001". One string, reverse-sorted, each field falling through to
    # the next only on a tie -- which is why every field is fixed width.
    def award_sort_key(year, month, kind, index)
      format("%s-%02d-%s%03d", year, month, kind, index)
    end

    # The month of "09/2021" (a plain award's date_start) or of "10/7" (a
    # paper award's venue conference_start, which has no zero-padding
    # guarantee), and 0 for anything else -- a bare year, a missing field --
    # so an entry with no month sorts after its year's dated ones.
    def month_of(value)
      month = value.to_s.split("/").first.to_i
      (1..12).cover?(month) ? month : 0
    end
  end
end

Liquid::Template.register_filter(Jekyll::CvAwardEntries)
