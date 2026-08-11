# frozen_string_literal: true

# Generates the per-paper (/papers/<id>/), per-person (/people/<id>/) and
# per-writing (/writing/<slug>/) pages straight from the YAML data, at build
# time.
#
# These pages are pure derived output of _data/publications.yaml,
# _data/people.yaml and _data/blog.yaml -- the layouts look each record back up
# in site.data and render everything themselves, so the page itself only needs
# to carry which record it is. This used to be a scripts/generate-pages.rb that
# wrote front-matter-only stub files into _papers/ and _people_pages/ before
# every build, which meant the stubs could go stale whenever you added a record
# without re-running it.
#
# NOTE: the explicit `permalink` is load-bearing. Without it Jekyll builds the
# URL from the page name and slugifies underscores to hyphens, which would
# change every paper URL and break the internal links that are built by string
# concatenation from record ids.
#
# A record's URL slug and its id are deliberately separate. Papers and people
# use the id for both. Writing entries carry an explicit `slug:` instead, so the
# shareable URL (/writing/SPOT_PhD_Application_Guide/) is not forced to double
# as the lookup key -- an id there encodes the date, and retitling a post must
# not silently move a URL people have already been sent. The generated page
# always carries the *id*, because that is what the layout looks the record up
# by.
module Jekyll
  class DataPageGenerator < Generator
    safe true

    # For sources whose URL is just the record id.
    IDENTITY_SLUG = ->(_record, id) { id }

    # Per source, beyond the obvious:
    #   id_field     front-matter key the layout reads to find its record
    #   slug         URL segment under dir/
    #   description  optional; fills <meta name="description"> and og:description
    #   excluded     optional; called for records `include` rejected. Returns a
    #                warning string when dropping the record loses content that
    #                has no other home on the site, nil otherwise.
    SOURCES = [
      {
        data_key: "publications",
        dir: "papers",
        layout: "paper",
        nav: "research",
        id_field: "pub_id",
        slug: IDENTITY_SLUG,
        back_url: ->(id) { "/research/#pub-#{id}" },
        back_label: "Back to research",
        include: ->(_record) { true },
        title: ->(record, id) { record["title"] || id }
      },
      {
        data_key: "people",
        dir: "people",
        layout: "person",
        nav: "team",
        id_field: "person_id",
        slug: IDENTITY_SLUG,
        back_url: ->(id) { "/team/##{id}" },
        back_label: "Back to team",
        include: ->(record) { record["use_local_homepage"] == true },
        # `profile` is the only field that renders on /people/<id>/ and nowhere
        # else, so without the page it is prose nobody can reach -- and the
        # /team row looks exactly as it did before. Catches both the missing
        # flag and the quoted `use_local_homepage: "true"`, which is truthy in
        # Liquid and false here.
        excluded: lambda { |record|
          next nil unless record["profile"]

          "#{record["id"].inspect} has a profile: but no page to put it on; " \
            "add `use_local_homepage: true` (bare, unquoted) to people.yaml"
        },
        title: lambda { |record, id|
          name = [record["given_name"], record["family_name"]].compact.join(" ").strip
          name.empty? ? id : name
        }
      },
      {
        data_key: "blog",
        dir: "writing",
        layout: "writing",
        nav: "writing",
        id_field: "post_id",
        slug: lambda { |record, id|
          slug = record["slug"].to_s.strip
          slug.empty? ? id : slug
        },
        back_url: ->(_id) { "/writing/" },
        back_label: "Back to writing",
        include: ->(_record) { true },
        title: ->(record, id) { record["title"] || id },
        description: ->(record, _id) { record["description"] }
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

        seen_ids = {}
        seen_slugs = {}
        records.each do |record|
          next unless record.is_a?(Hash)
          unless source[:include].call(record)
            warning = source[:excluded]&.call(record)
            Jekyll.logger.warn "DataPageGenerator:", warning if warning
            next
          end

          id = record["id"].to_s.strip
          next if id.empty?

          if seen_ids[id]
            Jekyll.logger.warn "DataPageGenerator:",
                               "duplicate id #{id.inspect} in #{source[:data_key]}.yaml; keeping the first"
            next
          end
          seen_ids[id] = true

          # Checked separately from the id: where slug and id can differ, two
          # records can hold distinct ids and still claim one URL, and which of
          # the two pages survives would come down to their order in the file.
          slug = source[:slug].call(record, id)
          if seen_slugs[slug]
            Jekyll.logger.warn "DataPageGenerator:",
                               "#{id.inspect} and #{seen_slugs[slug].inspect} in " \
                               "#{source[:data_key]}.yaml both resolve to " \
                               "/#{source[:dir]}/#{slug}/; keeping the first"
            next
          end
          seen_slugs[slug] = id

          site.pages << build_page(site, source, record, id, slug)
        end
      end
    end

    private

    def build_page(site, source, record, id, slug)
      page = PageWithoutAFile.new(site, site.source, source[:dir], "#{slug}.html")
      page.data["layout"] = source[:layout]
      page.data["title"] = source[:title].call(record, id)
      page.data[source[:id_field]] = id
      page.data["nav"] = source[:nav]
      page.data["permalink"] = "/#{source[:dir]}/#{slug}/"
      # Rendered in the navbar by _layouts/default.html.
      page.data["back_url"] = source[:back_url].call(id)
      page.data["back_label"] = source[:back_label]
      # Read by the meta tags in _layouts/default.html; absent means the layout
      # falls back to the site-wide description.
      description = source[:description]&.call(record, id)
      page.data["description"] = description if description
      page
    end
  end
end
