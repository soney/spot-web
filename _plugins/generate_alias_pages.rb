# frozen_string_literal: true

# Generates the vanity-URL redirect pages that people.yaml `aliases:`
# declare: /<alias>/ redirects to /people/<id>/, and /<alias>/cv/ to
# /people/<id>/cv/ when _data/cvs/<id>.yaml gives that person a CV. This is
# what makes from.so/me and from.so/me/cv follow steve_oney around by
# configuration instead of by a hand-written stub at the repo root -- the
# me.html and Steve_Oney.html this replaced hardcoded their targets.
#
# Each page is a PageWithoutAFile whose whole content is one redirect.html
# include, exactly what the hand-written stubs carried: meta refresh,
# canonical link, JS fallback, visible link. The CV redirect preserves the
# query string, because the CV's checkbox toggles live there
# (?students=true) and links with them set have been shared. /oney_cv/ is
# not an alias -- it predates them and redirects from the repo root
# (oney_cv.html) for the same reason.
#
# An alias is a URL segment taken verbatim (Steve_Oney keeps its capitals).
# Two people claiming one alias is warned about and the first in file order
# wins, matching duplicate-id handling elsewhere; an alias colliding with a
# real page surfaces through Jekyll's own destination-conflict warning. An
# alias on a person without `use_local_homepage: true` is warned about too:
# its target page is then never generated, and the redirect would land on a
# 404 -- the same failure README.md documents for clearing the flag.
module Jekyll
  class AliasPageGenerator < Generator
    safe true

    def generate(site)
      seen = {}
      Array(site.data["people"]).each do |person|
        next unless person.is_a?(Hash)

        aliases = Array(person["aliases"]).map { |a| a.to_s.strip }.reject(&:empty?)
        next if aliases.empty?

        id = person["id"].to_s
        name = [person["given_name"], person["family_name"]].compact.join(" ").strip
        name = id if name.empty?
        unless person["use_local_homepage"] == true
          Jekyll.logger.warn "AliasPageGenerator:",
                             "#{id.inspect} has aliases but not `use_local_homepage: true`; " \
                             "/#{aliases.first}/ will redirect to a page that is never generated"
        end

        aliases.each do |alias_slug|
          if seen[alias_slug]
            Jekyll.logger.warn "AliasPageGenerator:",
                               "alias #{alias_slug.inspect} is claimed by both " \
                               "#{seen[alias_slug].inspect} and #{id.inspect}; keeping the first"
            next
          end
          seen[alias_slug] = id

          site.pages << redirect_page(site, alias_slug, "/people/#{id}/",
                                      "link to #{name}'s page", false)
          next unless site.data["cvs"].is_a?(Hash) && site.data["cvs"].key?(id)

          site.pages << redirect_page(site, "#{alias_slug}/cv", "/people/#{id}/cv/",
                                      "link to #{name}'s CV", true)
        end
      end
    end

    private

    def redirect_page(site, slug, to, label, preserve_query)
      page = PageWithoutAFile.new(site, site.source, slug, "index.html")
      page.data["permalink"] = "/#{slug}/"
      # A redirect is not a page to index: its canonical link already credits
      # the target, and jekyll-sitemap would otherwise list both URLs.
      page.data["sitemap"] = false
      preserve = preserve_query ? " preserve_query=true" : ""
      page.content = "{% include redirect.html to=\"#{to}\" label=\"#{label}\"#{preserve} %}\n"
      page
    end
  end
end
