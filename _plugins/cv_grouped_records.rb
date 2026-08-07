# frozen_string_literal: true

# Provides the `cv_grouped_records` Liquid filter, which buckets CV records
# (oney_cv.yaml's `service` and `supervised_students`) into the display groups
# defined in _data/cv_service_groups.yaml and _data/cv_supervision_groups.yaml.
#
# A group declares the categories it collects:
#
#     - title: UMSI
#       categories: [department, umsi]
#
# and at most one group may instead declare `catch_all: true`, which collects
# every record whose category no other group claimed. The Service section has
# one; without it a record with a new or misspelled category would vanish from
# the CV with no error, which is how the old hand-rolled version behaved before
# it was made data-driven.
#
# Where there is no catch-all group (Students Supervised), an unclaimed record
# still cannot be rendered -- so warn at build time rather than dropping it
# silently.
module Jekyll
  module CvGroupedRecords
    def cv_grouped_records(records, groups)
      records = Array(records)
      groups = Array(groups)

      claimed = groups.reject { |g| g["catch_all"] }
                      .flat_map { |g| categories_for(g) }
                      .compact
                      .uniq

      unclaimed = records.reject { |r| claimed.include?(r["category"]) }
      if unclaimed.any? && groups.none? { |g| g["catch_all"] }
        unclaimed.each do |record|
          Jekyll.logger.warn "cv_grouped_records:",
                             "no group claims category #{record["category"].inspect} " \
                             "(#{record["title"] || record["student_name"]}); it will not appear on the CV"
        end
      end

      groups.map do |group|
        items =
          if group["catch_all"]
            unclaimed
          else
            cats = categories_for(group)
            records.select { |r| cats.include?(r["category"]) }
          end
        { "title" => group["title"], "items" => items }
      end
    end

    private

    def categories_for(group)
      Array(group["categories"] || group["category"])
    end
  end
end

Liquid::Template.register_filter(Jekyll::CvGroupedRecords)
