# frozen_string_literal: true

# Provides the two Liquid filters that read _data/teaching.yaml, the single
# source behind the CV's Teaching section and a person page's:
#
#   {{ site.data.teaching | teaching_entries: "steve_oney" }}       the CV's list
#   {{ site.data.teaching | teaching_page_entries: "steve_oney" }}  the page's list
#
# Both filter on the entry's `person` (a people.yaml id) and keep file order,
# which is the display order on both pages.
#
# The page list is the CV list minus two things, because a CV is exhaustive and
# a homepage is not: an entry marked `cv_only: true`, and an entry whose last
# year falls before the file's `page_since`.
#
# This is Ruby rather than Liquid because of that cutoff. The year has to be
# read out of prose dates -- "Fall 2007 & Spring 2008", "Fall 2025, Fall 2026",
# "Spring 2005" -- and out of a `date_end: present` with no digits in it at
# all, none of which Liquid can compare numerically.
module Jekyll
  module TeachingEntries
    # A four-digit year anywhere in a date string. Bounded rather than \d{4} so
    # a course number that reached the date field cannot read as a year.
    YEAR = /\b(1[89]\d{2}|2\d{3})\b/
    # date_end values meaning the course is still running, so no cutoff hides
    # it however long ago it started.
    ONGOING = ["present", "ongoing", "current"].freeze

    def teaching_entries(teaching, person_id)
      entries_for(teaching, person_id)
    end

    def teaching_page_entries(teaching, person_id)
      cutoff = teaching.is_a?(Hash) ? teaching["page_since"] : nil
      entries_for(teaching, person_id).reject do |entry|
        entry["cv_only"] == true || before_cutoff?(entry, cutoff)
      end
    end

    private

    # Takes _data/teaching.yaml whole, so `page_since` stays next to the
    # entries it applies to rather than being threaded through the templates.
    def entries_for(teaching, person_id)
      entries = teaching.is_a?(Hash) ? teaching["entries"] : teaching
      Array(entries).select { |entry| entry.is_a?(Hash) && entry["person"] == person_id }
    end

    def before_cutoff?(entry, cutoff)
      return false if cutoff.nil? || ongoing?(entry)

      year = last_year(entry)
      # An entry no year can be read out of is kept. The cutoff exists to trim
      # the tail of a list; dropping a record because its dates were written in
      # a shape this does not parse would be the silent kind of failure.
      return false if year.nil?

      year < cutoff.to_i
    end

    def ongoing?(entry)
      ONGOING.include?(entry["date_end"].to_s.strip.downcase)
    end

    # The latest year mentioned in either date field: "Fall 2025, Fall 2026"
    # is a 2026 entry, and "Spring 2005" – "Fall 2006" is a 2006 one.
    def last_year(entry)
      "#{entry["date_start"]} #{entry["date_end"]}".scan(YEAR).flatten.map(&:to_i).max
    end
  end
end

Liquid::Template.register_filter(Jekyll::TeachingEntries)
