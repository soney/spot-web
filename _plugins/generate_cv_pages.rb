# frozen_string_literal: true

# Generates /people/<person_id>/cv/ from each _data/cvs/<person_id>.yaml, at
# build time, the same way _plugins/generate_data_pages.rb builds the paper,
# person and writing pages: the page is a front-matter-only stub carrying the
# person id, and _layouts/cv.html renders everything from site.data.
#
# The filename IS the person: the key Jekyll gives the file in
# site.data["cvs"] must be a people.yaml id, because _includes/cv_body.html
# filters the shared publications and teaching data by it. That reference
# fails silently in the usual way of this repo -- a CV keyed to no person
# still builds, with an empty publication list -- so the mismatch is warned
# about here, where it is introduced.
#
# Not folded into DataPageGenerator's SOURCES table: that table iterates
# list-shaped data files whose records carry an `id`, while site.data["cvs"]
# is a hash of filename => document, so the id/slug bookkeeping there has
# nothing to check here.
module Jekyll
  class CvPageGenerator < Generator
    safe true

    def generate(site)
      cvs = site.data["cvs"]
      return if cvs.nil?
      unless cvs.is_a?(Hash)
        Jekyll.logger.warn "CvPageGenerator:", "expected _data/cvs/ to be a directory of YAML files; skipping"
        return
      end

      people_by_id = Array(site.data["people"]).select { |p| p.is_a?(Hash) }
                                               .to_h { |p| [p["id"], p] }

      cvs.sort.each do |person_id, cv|
        unless cv.is_a?(Hash)
          Jekyll.logger.warn "CvPageGenerator:", "_data/cvs/#{person_id}.yaml is not a YAML mapping; skipping"
          next
        end
        unless people_by_id.key?(person_id)
          Jekyll.logger.warn "CvPageGenerator:",
                             "_data/cvs/#{person_id}.yaml matches no people.yaml id; " \
                             "/people/#{person_id}/cv/ will render with an empty publication list"
        end

        page = PageWithoutAFile.new(site, site.source, File.join("people", person_id), "cv.html")
        page.data["layout"] = "cv"
        page.data["title"] = "#{title_name(cv, people_by_id[person_id], person_id)} - Curriculum Vitae"
        page.data["cv_person"] = person_id
        # Explicit for the same reason as in generate_data_pages.rb: without
        # it Jekyll slugifies underscores in the id to hyphens.
        page.data["permalink"] = "/people/#{person_id}/cv/"
        site.pages << page
      end
    end

    private

    def title_name(cv, person, person_id)
      return cv["name"] if cv["name"]

      name = person ? [person["given_name"], person["family_name"]].compact.join(" ").strip : ""
      name.empty? ? person_id : name
    end
  end
end
