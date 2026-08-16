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
# ORDERING: year descending; within a year, paper awards ("P") before plain
# awards ("A"), and within each of those, REVERSE of the order the entries
# appear in the source data. That is what the old string sort produced, and it
# is preserved here so the rendered CV is unchanged.
#
# The index is zero-padded, which the old encoding was not. The old code sorted
# the whole "<key>::::<html>" string, and ":" (0x3A) sorts above every digit, so
# an index that was a prefix of another ("A1" vs "A10") compared the opposite
# way round from the keys alone -- inconsistent with the rule above. No year
# currently holds such a pair, so padding leaves today's output byte-identical
# while making the rule hold for a year that grows past nine entries.
# Change the ordering only as an intentional, reviewed content change.
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
        entries << { "sort_key" => format("%s-A%03d", year, i + 1), "kind" => "award", "item" => item }
      end

      pubs_by_venue = publications.group_by { |pub| pub["venue"] }
      award_index = 0
      venues.each do |venue|
        pubs_by_venue.fetch(venue["id"], []).each do |pub|
          next unless pub["award"] && pub["award"] != "none"

          year = venue["year"] || "0000"
          # 0-based to match the old Liquid award_index
          entries << {
            "sort_key" => format("%s-P%03d", year, award_index),
            "kind" => "paper_award",
            "pub" => pub,
            "venue" => venue
          }
          award_index += 1
        end
      end

      entries.sort_by { |e| e["sort_key"] }.reverse
    end
  end
end

Liquid::Template.register_filter(Jekyll::CvAwardEntries)
