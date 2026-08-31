# frozen_string_literal: true

require "json"

# Structured data for crawlers and AI agents: the JSON-LD (schema.org) block
# and, on paper pages, the Google Scholar `citation_*` meta tags that
# _includes/structured_data.html puts in <head>.
#
#   {{ page | structured_data_jsonld }}   the <script type="application/ld+json"> for this page
#   {{ pub | scholar_meta_tags }}          the <meta name="citation_*"> tags for a publication
#
# Which page it is comes from the front matter the generators stamp: `pub_id`
# (a /papers/ page), `person_id` (/people/), `post_id` (/writing/), or a URL
# of "/" for the homepage. Any other page gets no block at all -- a listing
# page's content is the records it links to, and those carry their own data.
#
# Why Ruby: the records are built by the same `publication_record` and
# `person_record` that mcp_index.rb's JSON maps over, so a paper's authors,
# venue label, PDF path and page URL are derived exactly once for the WebMCP
# tools, this block, and (through the same filters) the rendered page. A Liquid
# template re-deriving them here would be a third copy of the rules AGENTS.md
# lists as failing silently. Those builders are private methods of McpIndex;
# every filter module is mixed into the one Liquid strainer, so from here they
# are plain methods on `self`, the same way mcp_index.rb calls `bibtex`.
#
# Google Scholar indexes a paper from its page only when the page carries the
# citation_* tags (its inclusion guidelines: citation_title, one
# citation_author per author, citation_publication_date, the venue as
# citation_conference_title or citation_journal_title, citation_pdf_url) --
# Open Graph and JSON-LD are not read for this. The date is the venue year
# alone: conference_start is the meeting's first day, not the publication
# date, and a year Scholar can trust beats a day it cannot. JSON-LD is not
# offered that choice -- see sd_iso_datetime -- so the two carry dates of
# different precision on purpose.
#
# JSON-LD is for everyone else (Google's rich results, Bing, the LLM-backed
# search engines, and any agent without WebMCP): one ScholarlyArticle per
# paper, one Person per person page, an Article per writing entry, and the
# ResearchOrganization plus WebSite on the homepage. Every node that has a
# from.so page is given that page's URL as its @id, so a paper's author nodes
# and the person's own page describe the same entity.
module Jekyll
  module StructuredData
    # venues.yaml `type` values that are meetings rather than periodicals, for
    # Scholar's conference/journal split and schema.org's PublicationEvent.
    CONFERENCE_TYPES = %w[conference workshop poster demo doctoralconsortium panel].freeze

    def structured_data_jsonld(page)
      node = jsonld_node_for(page)
      return "" if node.nil?

      # "</" inside a <script> ends the element whatever the content type, and
      # "<" generally is the one character JSON may carry that HTML must not.
      json = JSON.pretty_generate(node).gsub("<", "\\u003c")
      %(<script type="application/ld+json">\n#{json}\n</script>)
    end

    def scholar_meta_tags(pub)
      return "" unless pub.is_a?(Hash)

      record = sd_publication_record(pub)
      venue_key = CONFERENCE_TYPES.include?(record["type"]) ? "citation_conference_title" : "citation_journal_title"
      tags = [["citation_title", record["title"]]]
      Array(record["author_ids"]).each { |id| tags << ["citation_author", sd_person_name(id)] }
      tags << ["citation_publication_date", record["year"]]
      tags << [venue_key, record["venue_full_name"]] if record["venue_full_name"] && record["type"] != "preprint"
      tags << ["citation_pdf_url", sd_absolute(record["pdf_path"])]
      tags << ["citation_doi", record["doi"]]
      tags << ["citation_abstract_html_url", sd_absolute(record["path"])]
      tags << ["citation_language", "en"]
      tags.reject { |_name, value| value.nil? || value.to_s.empty? }
          .map { |name, value| %(<meta name="#{name}" content="#{sd_attr(value)}">) }
          .join("\n")
    end

    private

    def jsonld_node_for(page)
      page = page.to_h if page.respond_to?(:to_h)
      data = sd_site.data
      if (id = page["pub_id"])
        pub = Array(data["publications"]).find { |record| record["id"] == id }
        return pub && scholarly_article(sd_publication_record(pub))
      end
      if (id = page["person_id"])
        person = Array(data["people"]).find { |record| record["id"] == id }
        return person && person_node(sd_person_record(person), full: true)
      end
      if (id = page["post_id"])
        post = Array(data["blog"]).find { |record| record["id"] == id }
        return post && article(post, page["url"])
      end
      return organization_graph(data) if page["url"] == "/"

      nil
    end

    # ------------------------------------------------------------- nodes

    def scholarly_article(record)
      url = sd_absolute(record["path"])
      venue = sd_venue(record["venue_id"])
      node = {
        "@context" => "https://schema.org",
        "@type" => "ScholarlyArticle",
        "@id" => url,
        "url" => url,
        "mainEntityOfPage" => url,
        "headline" => record["title"],
        "name" => record["title"],
        "inLanguage" => "en",
        "datePublished" => sd_iso_datetime(sd_venue_date(venue)),
        "abstract" => record["abstract"],
        "description" => record["summary"],
        "author" => Array(record["author_ids"]).map { |id| author_node(id) },
        "keywords" => Array(record["research_area_ids"]).map { |id| sd_area_title(id) }.compact,
        "award" => record["award"],
        "identifier" => record["doi"] && { "@type" => "PropertyValue", "propertyID" => "DOI", "value" => record["doi"] },
        "sameAs" => record["doi"] && "https://doi.org/#{record["doi"]}",
        "encoding" => record["pdf_path"] && {
          "@type" => "MediaObject",
          "encodingFormat" => "application/pdf",
          "contentUrl" => sd_absolute(record["pdf_path"])
        },
        "isAccessibleForFree" => (true if record["pdf_path"])
      }
      node.merge!(venue_nodes(record, venue))
      sd_prune(node)
    end

    # A journal paper is part of a periodical; a conference paper was
    # published at an event. schema.org has a property for each, and the
    # distinction is the same one the Scholar tags make.
    def venue_nodes(record, venue)
      return {} unless record["venue_full_name"]

      if CONFERENCE_TYPES.include?(record["type"])
        { "publication" => {
          "@type" => "PublicationEvent",
          "name" => record["venue_full_name"],
          "alternateName" => record["venue"],
          "startDate" => sd_iso_datetime(sd_venue_date(venue)),
          "location" => record["venue_location"] && { "@type" => "Place", "name" => record["venue_location"] }
        } }
      else
        { "isPartOf" => { "@type" => "Periodical", "name" => record["venue_full_name"] } }
      end
    end

    # An author on a paper: a reference to the person's own node when they
    # have a page, else a bare Person with whatever the site knows.
    def author_node(id)
      person = sd_person_index[id]
      return { "@type" => "Person", "name" => id } if person.nil?

      person_node(sd_person_record(person), full: false)
    end

    def person_node(record, full:)
      page = record["path"] && sd_absolute(record["path"])
      person = sd_person_index[record["id"]] || {}
      # An ORCID identifies a researcher the way a DOI identifies a paper, so it
      # is written the same way this file writes a DOI: the bare identifier as
      # an `identifier` node, and its resolvable form as one more `sameAs`. It
      # is the only id here that a crawler can follow across publishers, so
      # author nodes on paper pages carry it too, not just full person pages.
      orcid = person["orcid"] && "https://orcid.org/#{person["orcid"]}"
      # Other identities of the same person elsewhere on the web: the homepage,
      # the ORCID and the http links, minus anything on this site (a from.so
      # homepage is an alias of the page itself, and /people/x/cv/ is a page,
      # not a person).
      links = Array(record["links"]).map { |link| link["url"] }
      same_as = ([record["homepage"], orcid] + links).compact.uniq
                                                     .select { |url| url.start_with?("http") }
                                                     .reject { |url| url.start_with?(sd_site.config["url"]) }
      node = {
        "@context" => ("https://schema.org" if full),
        "@type" => "Person",
        "@id" => page,
        "name" => record["name"],
        "givenName" => person["given_name"],
        "familyName" => person["family_name"],
        "url" => page || record["homepage"],
        "sameAs" => same_as,
        "identifier" => person["orcid"] && {
          "@type" => "PropertyValue", "propertyID" => "ORCID", "value" => person["orcid"]
        },
        # short_bio is "role / department" for a current member and a sentence
        # of history for everyone else ("Former ... Now ..."), so only the
        # former is a job title.
        "jobTitle" => (record["title"].split(", ").first if record["group_status"] == "current_member" && record["title"])
      }
      if full
        node["mainEntityOfPage"] = page
        node["description"] = sd_plain(record["bio"])
        node["image"] = record["photo_path"] && sd_absolute(record["photo_path"])
        node["memberOf"] = { "@id" => sd_absolute("/#organization") } if record["group_status"] == "current_member"
        node["alumniOf"] = { "@id" => sd_absolute("/#organization") } if record["group_status"] == "alum"
      end
      sd_prune(node)
    end

    def article(post, page_url)
      url = sd_absolute(page_url)
      sd_prune(
        "@context" => "https://schema.org",
        "@type" => "Article",
        "@id" => url,
        "url" => url,
        "mainEntityOfPage" => url,
        "headline" => post["title"],
        "description" => sd_plain(post["description"]),
        "datePublished" => sd_iso_datetime(post["created"]),
        "inLanguage" => "en",
        "author" => Array(post["authors"]).map { |id| author_node(id) },
        # The document itself, published from Google Docs; this page is the
        # landing page that owns the stable URL.
        "sameAs" => post["google_doc"]&.strip,
        "publisher" => { "@id" => sd_absolute("/#organization") }
      )
    end

    # The homepage: the group, with its members, and the site. @graph, so the
    # two nodes share one context and the organization keeps the @id every
    # other page points at.
    def organization_graph(data)
      config = sd_site.config
      group = data["group"] || {}
      affiliations = data["affiliations"] || {}
      members = Array(data["people"]).map { |person| sd_person_record(person) }
                                     .select { |record| record["group_status"] == "current_member" }
      org_id = sd_absolute("/#organization")
      {
        "@context" => "https://schema.org",
        "@graph" => [
          sd_prune(
            "@type" => "ResearchOrganization",
            "@id" => org_id,
            "name" => config["title"],
            "url" => sd_absolute("/"),
            "email" => config["email"],
            "description" => sd_plain(group["overview"]) || config["description"],
            "parentOrganization" => {
              "@type" => "CollegeOrUniversity",
              "name" => "University of Michigan",
              "url" => "https://umich.edu/",
              "subOrganization" => Array(affiliations["affiliations"]).map do |item|
                { "@type" => "Organization", "name" => item["name"], "url" => item["url"] }
              end
            },
            "funder" => Array(affiliations["sponsors"]).map do |item|
              { "@type" => "Organization", "name" => item["name"], "url" => item["url"] }
            end,
            "member" => members.map { |record| person_node(record, full: false) },
            "knowsAbout" => Array(data["clusters"]).map { |cluster| cluster["title"] }
          ),
          sd_prune(
            "@type" => "WebSite",
            "@id" => sd_absolute("/#website"),
            "url" => sd_absolute("/"),
            "name" => config["title"],
            "description" => config["description"],
            "inLanguage" => "en",
            "publisher" => { "@id" => org_id }
          )
        ]
      }
    end

    # ----------------------------------------------------------- helpers

    def sd_site = @context.registers[:site]

    def sd_absolute(path)
      return nil if path.nil? || path.to_s.empty?

      "#{sd_site.config["url"]}#{sd_site.config["baseurl"]}#{path}"
    end

    # Google's rich results test rejects a bare year ("Invalid datetime for
    # datePublished") and warns about a day with no zone ("Datetime property
    # datePublished is missing a timezone"), so a date reaches JSON-LD only as
    # a full ISO 8601 timestamp. Midnight UTC is a stated convention, not a
    # claim about the paper: a paper is published on a day rather than at an
    # instant, so the time of day and the offset are invented whatever we
    # write, and one convention is easier to read than a different guess per
    # venue location. The Scholar tags are unaffected -- they keep the year
    # alone, which is the date that venues.yaml can actually vouch for.
    def sd_iso_datetime(date)
      return nil if date.nil? || date.to_s.empty?

      "#{date}T00:00:00Z"
    end

    # The day a venue's papers were published, "YYYY-MM-DD", or nil when
    # venues.yaml does not know it (a journal with no `published_date`, or a
    # paper still in press). Nil is the right answer there: sd_prune drops the
    # property, and no date at all beats a date the site made up.
    #
    # A meeting is dated from `conference_start` ("M/D", not zero-padded) plus
    # the venue year. Everything else -- journals, book chapters, preprints --
    # carries `published_date` as a full ISO date, deliberately a separate
    # field: venue_order.rb and cv_award_entries.rb key on conference_start,
    # so giving one of those venues a conference_start would silently reorder
    # the publication lists and renumber the CV.
    def sd_venue_date(venue)
      return nil if venue.nil?
      return venue["published_date"].to_s if venue["published_date"]

      month, day = venue["conference_start"].to_s.split("/").map(&:to_i)
      year = venue["year"].to_i
      return nil unless year.positive? && (1..12).cover?(month) && (1..31).cover?(day)

      format("%04d-%02d-%02d", year, month, day)
    end

    # Shares the venue index sd_publication_record memoizes below.
    def sd_venue(id) = (@sd_venues ||= index_by_id(sd_site.data["venues"]))[id]

    # mcp_index.rb's builders, with the lookup tables they take built once
    # per page render (the strainer is per render, so a paper page with a
    # dozen author nodes computes each table once, not twelve times).
    def sd_publication_record(pub)
      data = sd_site.data
      @sd_venues ||= index_by_id(data["venues"])
      @sd_areas ||= areas_by_publication(data)
      publication_record(pub, @sd_venues, @sd_areas)
    end

    def sd_person_record(person)
      data = sd_site.data
      @sd_pubs_by_author ||= publications_by_author(data)
      person_record(person, data, @sd_pubs_by_author)
    end

    def sd_person_index = @sd_person_index ||= index_by_id(sd_site.data["people"])

    def sd_person_name(id)
      person = sd_person_index[id]
      person ? full_name(person) : id
    end

    def sd_area_title(id)
      cluster = Array(sd_site.data["clusters"]).find { |record| record["id"] == id }
      cluster && cluster["title"]
    end

    # Bios and descriptions carry Markdown links and emphasis for the page;
    # a description field is plain text.
    def sd_plain(text)
      return nil if text.nil?

      squish(text.to_s.gsub(/\[([^\]]*)\]\([^)]*\)/, '\1').gsub(/[*_]{1,2}([^*_]+)[*_]{1,2}/, '\1'))
    end

    def sd_attr(value) = value.to_s.gsub("&", "&amp;").gsub('"', "&quot;").gsub("<", "&lt;")

    # Drop the keys whose value the data did not supply, recursively, so the
    # output never says "award": null.
    def sd_prune(value)
      case value
      when Hash
        value.each_with_object({}) do |(key, inner), out|
          pruned = sd_prune(inner)
          out[key] = pruned unless pruned.nil? || pruned == [] || pruned == {}
        end
      when Array then value.map { |inner| sd_prune(inner) }.reject { |inner| inner.nil? || inner == [] || inner == {} }
      else value
      end
    end
  end
end

Liquid::Template.register_filter(Jekyll::StructuredData)
