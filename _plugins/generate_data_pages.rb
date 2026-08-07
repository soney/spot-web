# frozen_string_literal: true

# Generates the per-paper (/papers/<id>/) and per-person (/people/<id>/) pages
# straight from the YAML data, at build time.
#
# These pages are pure derived output of _data/publications.yaml and
# _data/people.yaml -- the layouts look each record back up in site.data and
# render everything themselves, so the page itself only needs to carry which
# record it is. This used to be a scripts/generate-pages.rb that wrote
# front-matter-only stub files into _papers/ and _people_pages/ before every
# build, which meant the stubs could go stale whenever you added a record
# without re-running it.
#
# NOTE: the explicit `permalink` is load-bearing. Without it Jekyll builds the
# URL from the page name and slugifies underscores to hyphens, which would
# change every paper URL and break the internal links that are built by string
# concatenation from record ids.
module Jekyll
  class DataPageGenerator < Generator
    safe true

    SOURCES = [
      {
        data_key: "publications",
        dir: "papers",
        layout: "paper",
        nav: "research",
        id_field: "pub_id",
        include: ->(_record) { true },
        title: ->(record, id) { record["title"] || id }
      },
      {
        data_key: "people",
        dir: "people",
        layout: "person",
        nav: "team",
        id_field: "person_id",
        include: ->(record) { record["use_local_homepage"] == true },
        title: lambda { |record, id|
          name = [record["given_name"], record["family_name"]].compact.join(" ").strip
          name.empty? ? id : name
        }
      }
    ].freeze

    def generate(site)
      SOURCES.each do |source|
        records = site.data[source[:data_key]]
        unless records.is_a?(Array)
          Jekyll.logger.warn "DataPageGenerator:",
                             "expected _data/#{source[:data_key]}.yaml to be a list; skipping"
          next
        end

        seen = {}
        records.each do |record|
          next unless record.is_a?(Hash)
          next unless source[:include].call(record)

          id = record["id"].to_s.strip
          next if id.empty?

          if seen[id]
            Jekyll.logger.warn "DataPageGenerator:",
                               "duplicate id #{id.inspect} in #{source[:data_key]}.yaml; keeping the first"
            next
          end
          seen[id] = true

          site.pages << build_page(site, source, record, id)
        end
      end
    end

    private

    def build_page(site, source, record, id)
      page = PageWithoutAFile.new(site, site.source, source[:dir], "#{id}.html")
      page.data["layout"] = source[:layout]
      page.data["title"] = source[:title].call(record, id)
      page.data[source[:id_field]] = id
      page.data["nav"] = source[:nav]
      page.data["permalink"] = "/#{source[:dir]}/#{id}/"
      page
    end
  end
end
