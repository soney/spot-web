# frozen_string_literal: true

# Provides the `cv_records_by_date_desc` Liquid filter, which puts a CV's
# dated records -- _data/cvs/<person_id>.yaml's `supervised_students` and
# `grants`, rendered by the Advising and Grants sections -- into the order the
# rest of the CV reads in: most recent first.
#
#     {{ cv.supervised_students | cv_records_by_date_desc | cv_grouped_records: groups }}
#     {{ cv.grants | cv_records_by_date_desc }}
#
# It sorts and only sorts. Which records appear at all is cv_grouped_records.rb's
# decision downstream, so this can neither add a record nor drop one.
#
# Ruby rather than Liquid because the dates are prose, and in more than one
# shape: advising records run in academic terms ("Fall 2018" to "Spring 2024")
# or bare years ("2025") and can end in `present`, grants carry a single
# `date: 04/2017`. None of those sort as strings -- "Spring 2024" sorts under
# "Fall 2018", "10/2019" under "07/2019", and "present" under all of them.
#
# A record is placed by the most recent date it carries: its `date_end`, or the
# single `date` a grant has, or its `date_start` where the run has no end (a
# thesis committee entry is a single year). Ties break on the start date, then
# on position in the file, so records carrying the same dates keep the order
# they were written in. `present` outranks every real date, which puts ongoing
# advisees and postdocs at the top of their group, and a record no date can be
# read out of sinks to the bottom rather than landing somewhere arbitrary among
# the dated ones.
#
# The helper names are prefixed because Liquid includes every filter module
# into one object: two plugins that both define a private `sort_key` do not
# coexist, the second one loaded simply wins.
module Jekyll
  module CvRecordOrder
    # A four-digit year anywhere in a date string, bounded the same way
    # teaching_entries.rb bounds it so a stray number cannot read as a year.
    YEAR = /\b(1[89]\d{2}|2\d{3})\b/
    # date_end values meaning "still going", matching teaching_entries.rb.
    ONGOING = %w[present ongoing current].freeze
    # Academic terms as the month they start in, so that a term and a written
    # month ("04/2017") are one comparable scale: Fall 2018 sorts after Spring
    # 2018, and would sort after 04/2018 too if a list ever mixed the two.
    TERMS = { "winter" => 1, "spring" => 5, "summer" => 7, "fall" => 9 }.freeze
    TERM = /\b(#{TERMS.keys.join("|")})\b/
    # A date with a year but no month or term ("2025") ranks below every dated
    # one of that year, and a record with no readable date below every dated
    # one -- the rule venue_order.rb applies to a venue with no
    # `conference_start`.
    UNDATED_MONTH = 0
    UNDATED = -Float::INFINITY

    def cv_records_by_date_desc(records)
      Array(records)
        .each_with_index
        .sort_by { |record, index| record_sort_key(record).map { |n| -n } + [index] }
        .map(&:first)
    end

    private

    def record_sort_key(record)
      return [UNDATED, UNDATED, UNDATED, UNDATED] unless record.is_a?(Hash)

      # A grant carries one `date`; everything else carries a run.
      start = date_key(record["date_start"]) || date_key(record["date"])
      finish = date_key(record["date_end"]) || start || [UNDATED, UNDATED]
      finish + (start || finish)
    end

    # [year, month] for a date, nil for one that names no year.
    def date_key(value)
      text = value.to_s.strip.downcase
      return nil if text.empty?
      return [Float::INFINITY, Float::INFINITY] if ONGOING.include?(text)

      year = text[YEAR]
      return nil if year.nil?

      [year.to_i, month_of(text)]
    end

    # "fall 2018" -> 9 (the term's first month), "04/2017" -> 4, "2025" -> 0.
    # The term is checked first: only a leading number can be a month, and a
    # termed date has none.
    def month_of(text)
      term = text[TERM]
      return TERMS.fetch(term) if term

      month = text.split("/").first.to_i
      (1..12).cover?(month) ? month : UNDATED_MONTH
    end
  end
end

Liquid::Template.register_filter(Jekyll::CvRecordOrder)
