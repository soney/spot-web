# frozen_string_literal: true

# Citation helpers for publication records.
#
#   {{ pub | bibtex }}              a complete BibTeX entry
#   {{ pub | pdf_download_name }}   a readable filename for the PDF link's
#                                   `download` attribute
#
# Both are derived entirely from the data already in _data/ -- authors resolve
# through people.yaml for their real names, the container title and year come
# from venues.yaml, and the entry type comes from the venue's `type`. Nothing
# here needs maintaining per paper; add a publication and its citation appears.
#
# This lives in Ruby rather than Liquid because BibTeX needs character
# escaping, brace-protection of acronyms, and de-duplication of citation keys
# across the whole corpus -- none of which Liquid can express.
module Jekyll
  module Citation
    ENTRY_TYPE = {
      "conference" => "inproceedings", "poster" => "inproceedings",
      "demo" => "inproceedings", "workshop" => "inproceedings",
      "doctoralconsortium" => "inproceedings", "panel" => "inproceedings",
      "journal" => "article", "bookchapter" => "incollection",
      "thesis" => "phdthesis", "preprint" => "misc"
    }.freeze

    # Never lead or trail a shortened title with one of these.
    STOP = %w[a an the of for and or to in on at with by using via toward
              towards from into about between across our their its this that
              as is are be].freeze

    def bibtex(pub)
      pub = pub.to_h if pub.respond_to?(:to_h)
      venue = venue_for(pub)
      type = ENTRY_TYPE[venue && venue["type"]] || "inproceedings"

      fields = []
      fields << ["author", author_field(pub["authors"] || [])]
      fields << ["title", protect_title(pub["title"])]
      container = venue && venue["full_name"]
      if container && type != "phdthesis"
        fields << [type == "article" ? "journal" : "booktitle", bib_escape(container)]
      end
      fields << ["school", bib_escape(venue["full_name"])] if type == "phdthesis" && venue && venue["full_name"]
      fields << ["year", venue && venue["year"]]
      if pub["doi"]
        fields << ["doi", pub["doi"]]
        fields << ["url", "https://doi.org/#{pub["doi"]}"]
      end
      fields.reject! { |_, v| v.nil? || v.to_s.empty? }

      width = fields.map { |k, _| k.length }.max
      "@#{type}{#{cite_key(pub)},\n" +
        fields.map { |k, v| "  #{k.ljust(width)} = {#{v}}" }.join(",\n") + "\n}"
    end

    # "Krosnick-ScrapeViz-VLHCC-2024.pdf" -- what the browser saves it as. The
    # URL is lowercase and hyphenated; this keeps the capitalisation that makes
    # a system name readable in a downloads folder.
    def pdf_download_name(pub)
      pub = pub.to_h if pub.respond_to?(:to_h)
      venue = venue_for(pub)
      author = people[(pub["authors"] || []).first]
      family = author ? author["family_name"] : "Unknown"
      vraw = (venue && (venue["short_name"] || venue["full_name"])).to_s.gsub(/[()]/, "").strip
      year = venue && venue["year"].to_s
      parts = [family.gsub(/\s+/, ""), short_title(pub["title"]).join,
               vraw.gsub(%r{[/@&\s]}, ""), (vraw.include?(year.to_s) ? "" : year)]
      parts.reject { |x| x.nil? || x.empty? }.join("-") + ".pdf"
    end

    private

    def site = @context.registers[:site]
    def venue_for(pub) = site.data["venues"].find { |v| v["id"] == pub["venue"] }
    def people = @people ||= site.data["people"].to_h { |p| [p["id"], p] }

    # These characters are syntax in BibTeX; a raw & in a venue name breaks the entry.
    def bib_escape(str) = str.to_s.gsub(/([&%$#_{}])/) { "\\#{Regexp.last_match(1)}" }

    # Braces stop BibTeX styles from lower-casing acronyms and CamelCase system
    # names. Only tokens with two capitals and no hyphen qualify, so "VRCopilot"
    # and "QWERTY" are protected but "Ultra-Small" is left alone.
    def protect_title(title)
      bib_escape(title).gsub(/\b([A-Za-z]*[A-Z][A-Za-z]*[A-Z][A-Za-z0-9]*)\b/) { "{#{Regexp.last_match(1)}}" }
    end

    def author_field(ids)
      ids.map { |id|
        person = people[id]
        person ? "#{person["family_name"]}, #{person["given_name"]}" : id.split("_").map(&:capitalize).join(" ")
      }.join(" and ")
    end

    def short_title(title)
      if title.include?(":")
        words = title.split(":").first.gsub(/[^A-Za-z0-9 -]/, "").split
      else
        words = title.gsub(/[^A-Za-z0-9 -]/, "").split
        words = words.reject { |w| STOP.include?(w.downcase) }.first(3)
      end
      words.pop while words.size > 1 && STOP.include?(words.last.downcase)
      words.shift while words.size > 1 && STOP.include?(words.first.downcase)
      words
    end

    # Keys must be unique across the corpus, so collisions get a/b/c suffixes
    # assigned in file order -- stable as long as records are appended.
    def cite_key(pub)
      @keys ||= begin
        base = {}
        site.data["publications"].each { |p| base[p["id"]] = base_key(p) }
        counts = base.values.tally
        seen = Hash.new(0)
        base.to_h { |id, k|
          seen[k] += 1
          [id, counts[k] > 1 ? k + ("a".ord + seen[k] - 1).chr : k]
        }
      end
      @keys[pub["id"]] || base_key(pub)
    end

    def base_key(pub)
      venue = venue_for(pub)
      first = people[(pub["authors"] || []).first]
      family = (first ? first["family_name"] : "anon").downcase.gsub(/[^a-z]/, "")
      word = pub["title"].split(/[:\s]/).find { |w| w.length > 3 }.to_s.downcase.gsub(/[^a-z0-9]/, "")
      "#{family}#{venue && venue["year"]}#{word}"
    end
  end
end

Liquid::Template.register_filter(Jekyll::Citation)
