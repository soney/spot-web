# frozen_string_literal: true

require "json"

# Builds the JSON that assets/js/webmcp.js answers WebMCP tool calls from.
#
#   {{ site | mcp_index_json }}   everything except the CV -> /assets/mcp/index.json
#   {{ site | mcp_cv_json }}      just the CV              -> /assets/mcp/cv.json
#
# Both are called from the one-line files in assets/mcp/. See the comment at the
# top of assets/js/webmcp.js for what reads them and why.
#
# The point of these files is that an agent asking "what has this group
# published about accessibility" should get an answer from the data, not from
# whatever HTML happens to be on the page the user is standing on. So the JSON
# is DENORMALIZED against the templates' own rules: author ids resolve to names,
# the venue is flattened onto each publication, and every record carries the
# path the site really links it at. A tool handler should never have to
# re-derive any of that, because re-deriving it in JavaScript is how the JSON
# and the rendered page start disagreeing.
#
# This is Ruby rather than Liquid for the usual reason plus one more: `jsonify`
# on the raw site.data would publish the internal shape of _data/ -- bare ids,
# `use_local_homepage`, headshot paths relative to assets/ -- as though it were
# an API, and every consumer would then depend on it.
#
# It calls four filters defined by the other plugins rather than reimplementing
# them: `bibtex` and `pdf_download_name` (citation.rb), `venues_by_date_desc`
# (venue_order.rb), and `cv_publication_codes` (cv_publication_codes.rb). Every
# filter module Jekyll registers is mixed into the same Liquid strainer, so at
# call time they are plain methods on `self`. Two BibTeX implementations, one
# for the page and one for the JSON, is the thing most worth not having here.
#
# INVARIANT: a path in this JSON must be one the site actually serves. The two
# rules below are among the ones AGENTS.md lists as failing silently, and they
# fail silently here too -- a person page exists only for
# `use_local_homepage: true`, and a /team anchor exists only for a person with
# a `membership`. Everyone else gets no path at all, rather than a link that
# scrolls nowhere.
module Jekyll
  module McpIndex
    # people.yaml `membership` values team.html branches on by name. Every other
    # value is either a current-member tier (group.yaml's member_order) or a
    # person /team does not render at all.
    ALUM = "alum"
    UGRAD_MS = "ugrad_ms_student"

    def mcp_index_json(_site_drop)
      data = mcp_site.data

      JSON.pretty_generate(
        "site" => {
          "name" => mcp_site.config["title"],
          "url" => "#{mcp_site.config["url"]}#{mcp_site.config["baseurl"]}",
          "description" => mcp_site.config["description"],
          "contact_email" => mcp_site.config["email"]
        },
        "group" => group_block(data),
        "research_areas" => research_areas(data),
        "publications" => publication_records(data),
        "people" => people_records(data),
        "news" => news_records(data),
        "writing" => writing_records(data)
      )
    end

    def mcp_cv_json(_site_drop)
      data = mcp_site.data
      cv = data["oney_cv"]
      return JSON.pretty_generate({}) unless cv

      # The CV numbers only the papers its subject co-authored, counting down
      # per type in venue order -- so the codes are correct only when computed
      # from exactly the set oney_cv.html renders. Computing them from every
      # publication instead would shift each one by however many papers the
      # subject is not an author on.
      subject = cv["person"]
      subject_pubs = Array(data["publications"]).select { |pub| Array(pub["authors"]).include?(subject) }
      codes = cv_publication_codes(subject_pubs, venues_by_date_desc(data["venues"]), data["publication_types"])

      JSON.pretty_generate(
        "person_id" => subject,
        "name" => cv["name"],
        "path" => "/oney_cv/",
        "affiliation" => cv["affiliation"],
        "contact" => cv["contact"],
        "education" => cv["education"],
        "professional_experience" => cv["professional_experience"],
        "grants" => cv["grants"],
        "awards" => cv["awards"],
        "invited_presentations" => cv["invited_presentations"],
        "service" => cv["service"],
        "teaching" => cv["teaching"],
        "supervised_students" => cv["supervised_students"],
        "press" => cv["press"],
        "patents" => cv["patents"],
        "publication_codes" => codes
      )
    end

    private

    # The filters are invoked as `{{ site | mcp_index_json }}`, and Liquid hands
    # over a Drop rather than the Site. The registers are the way back to the
    # real object. Named for this plugin because citation.rb already puts a
    # private `site` on the shared strainer.
    def mcp_site = @context.registers[:site]

    def group_block(data)
      group = data["group"] || {}
      affiliations = data["affiliations"] || {}
      {
        "overview" => group["overview"],
        "joining" => group["joining"],
        "announcement" => presence(group["announcement"]),
        "affiliations" => logo_list(affiliations["affiliations"]),
        "sponsors" => logo_list(affiliations["sponsors"])
      }
    end

    def logo_list(items)
      Array(items).map { |item| { "name" => item["name"], "url" => item["url"] } }
    end

    # There is deliberately no top-level "pages" list either. navigate_to_page's
    # section names are part of its published input schema, so they live in
    # assets/js/webmcp.js next to the enum that validates them; deriving them
    # from nav.yaml would put half the contract here and half there without
    # making a new tab reachable, since the enum would still reject it.
    def research_areas(data)
      Array(data["clusters"]).map do |cluster|
        {
          "id" => cluster["id"],
          "title" => cluster["title"],
          "description" => squish(cluster["description"]),
          "path" => "/research/#cluster-#{cluster["id"]}",
          "member_ids" => Array(cluster["authors"]),
          "publication_ids" => Array(cluster["papers"])
        }
      end
    end

    # Every publication list on the site walks venues in venues_by_date_desc
    # order and, within a venue, publications.yaml file order. Everything in the
    # JSON that is a list of papers comes through here, so a tool that returns
    # "the five most recent" without re-sorting agrees with /research and with
    # a person's own page. sort_by is not stable in Ruby, so the file position
    # is part of the key rather than assumed.
    def ordered_publications(data)
      order = venues_by_date_desc(data["venues"]).each_with_index.to_h { |venue, i| [venue["id"], i] }
      Array(data["publications"]).each_with_index
                                 .sort_by { |pub, i| [order.fetch(pub["venue"], order.size), i] }
                                 .map(&:first)
    end

    # There is deliberately no top-level "venues" list. Everything a tool needs
    # about a venue -- label, full name, year, type, location -- is flattened
    # onto each publication below, so a second copy would only be something to
    # keep in sync.
    def publication_records(data)
      venues_by_id = index_by_id(data["venues"])

      areas_by_pub = Hash.new { |hash, key| hash[key] = [] }
      Array(data["clusters"]).each do |cluster|
        Array(cluster["papers"]).each { |pub_id| areas_by_pub[pub_id] << cluster["id"] }
      end

      ordered_publications(data).map do |pub|
        venue = venues_by_id[pub["venue"]]
        {
          "id" => pub["id"],
          "title" => pub["title"],
          "path" => "/papers/#{pub["id"]}/",
          "year" => venue && venue["year"],
          "type" => venue && venue["type"],
          "venue" => venue && venue_label(venue),
          "venue_id" => pub["venue"],
          "venue_full_name" => venue && venue["full_name"],
          "venue_location" => venue && venue["location"],
          "authors" => author_names(pub["authors"]),
          "author_ids" => Array(pub["authors"]),
          "student_author_ids" => Array(pub["student_authors"]),
          "summary" => squish(pub["short_description"]),
          "abstract" => squish(pub["abstract"]),
          "pdf_path" => pub["pdf"] && "/assets/#{pub["pdf"]}",
          "pdf_filename" => pub["pdf"] && pdf_download_name(pub),
          "doi" => pub["doi"],
          "award" => award_label(pub),
          "bibtex" => bibtex(pub),
          "research_area_ids" => areas_by_pub[pub["id"]]
        }.compact
      end
    end

    # "UIST 2024" -- what venue_label.html renders, so a tool result and the
    # page the user is looking at name the venue the same way.
    def venue_label(venue)
      [venue["short_name"] || venue["full_name"], venue["year"]].compact.join(" ")
    end

    # The description if there is one, otherwise the raw value made readable
    # ("best_paper" -> "Best paper"). Not quite what publication_item.html
    # renders: the template pipes the description through Liquid's `capitalize`
    # too, which downcases everything after the first letter and turns
    # "Recognition for Contribution to Diversity and Inclusion" into sentence
    # case. That is the template's business; the value the group wrote is the
    # better answer to give, so this keeps its casing.
    def award_label(pub)
      award = pub["award"]
      return nil if award.nil? || award == "none"

      squish(pub["award_description"]) || award.tr("_", " ").capitalize
    end

    def people_records(data)
      # Same order as the top-level publications list, so a person's papers read
      # newest-first exactly as they do on their page -- walking
      # data["publications"] here instead would silently hand back file order.
      pubs_by_author = Hash.new { |hash, key| hash[key] = [] }
      ordered_publications(data).each do |pub|
        Array(pub["authors"]).each { |author_id| pubs_by_author[author_id] << pub["id"] }
      end

      Array(data["people"]).map do |person|
        {
          "id" => person["id"],
          "name" => full_name(person),
          "group_status" => group_status(person, data),
          "title" => one_line(person["short_bio"]),
          "bio" => person["long_bio"],
          "homepage" => person["homepage"],
          "pronouns" => person["pronouns"],
          "name_recording" => person["name_recording"] && "/assets/#{person["name_recording"]}",
          "path" => person_path(person),
          "photo_path" => person["headshot"] && "/assets/#{person["headshot"]}",
          "links" => Array(person["links"]).map { |link| { "url" => link["url"], "description" => link["description"] } },
          "publication_ids" => pubs_by_author[person["id"]]
        }.compact
      end
    end

    # The buckets /team renders, named so a tool can answer "who is in the
    # group" without its caller having to know what "ugrad_ms_student" means.
    # Someone with no membership is a co-author: they are in people.yaml so
    # their name renders on a paper, and no page lists them.
    def group_status(person, data)
      membership = presence(person["membership"])
      return "external_collaborator" if membership.nil?
      return "alum" if membership == ALUM
      return "ugrad_ms_collaborator" if membership == UGRAD_MS
      return "current_member" if Array(data.dig("group", "member_order")).include?(membership)

      # A membership in neither member_order nor the two cases above renders
      # nowhere on /team (see AGENTS.md). Say that, rather than claim a
      # standing the site does not actually show.
      "unlisted"
    end

    def person_path(person)
      return "/people/#{person["id"]}/" if person["use_local_homepage"] == true
      return "/team/##{person["id"]}" if presence(person["membership"])

      nil
    end

    # news.yaml has no per-item id, so /news is as specific as a link can get.
    # Ids that match no record are dropped: the chips for them are not rendered
    # either, and a tool result naming a paper that has no page is worse than
    # one that omits it.
    def news_records(data)
      people_by_id = index_by_id(data["people"])
      pubs_by_id = index_by_id(data["publications"])

      Array(data["news"]).sort_by { |item| item["date"].to_s }.reverse.map do |item|
        {
          "date" => item["date"],
          "text" => squish(item["description"]),
          "path" => "/news/",
          "person_ids" => Array(item["relevant_people"]).select { |id| people_by_id.key?(id) },
          "publication_ids" => Array(item["relevant_publications"]).select { |id| pubs_by_id.key?(id) }
        }
      end
    end

    def writing_records(data)
      Array(data["blog"]).sort_by { |post| post["created"].to_s }.reverse.map do |post|
        {
          "id" => post["id"],
          "title" => post["title"],
          "date" => post["created"],
          "url" => post["google_doc"],
          "authors" => author_names(post["authors"]),
          "author_ids" => Array(post["authors"])
        }.compact
      end
    end

    # "Ashley Zhang, Yan Chen, and Steve Oney" -- the joining rule in
    # author_list.html. An id with no people.yaml record renders as the raw id
    # there and does the same here, so the JSON shows the same broken-looking
    # name the page does instead of quietly hiding a bad reference.
    def author_names(ids)
      names = Array(ids).map { |id| (person = person_index[id]) ? full_name(person) : id }
      case names.size
      when 0 then nil
      when 1 then names.first
      when 2 then names.join(" and ")
      else "#{names[0..-2].join(", ")}, and #{names.last}"
      end
    end

    def person_index = @person_index ||= index_by_id(mcp_site.data["people"])

    def full_name(person) = [person["given_name"], person["family_name"]].compact.join(" ").strip

    def index_by_id(records) = Array(records).to_h { |record| [record["id"], record] }

    def presence(value) = value.nil? || value.to_s.strip.empty? ? nil : value

    # Abstracts, descriptions and news text are folded YAML scalars, so they
    # arrive carrying the source file's wrapping. Tool results are read as prose.
    def squish(value) = value.nil? ? nil : value.to_s.gsub(/\s+/, " ").strip

    # short_bio is a literal block whose line break separates role from
    # department ("Ph.D. Student" / "Michigan SI"). Squishing it would run the
    # two together, so the break becomes the comma it reads as in a sentence.
    def one_line(value) = value.nil? ? nil : value.to_s.strip.split(/\s*\n\s*/).join(", ")
  end
end

Liquid::Template.register_filter(Jekyll::McpIndex)
