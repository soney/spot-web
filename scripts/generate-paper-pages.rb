#!/usr/bin/env ruby
# frozen_string_literal: true

require "yaml"
require "fileutils"

root = File.expand_path("..", __dir__)
publications_path = File.join(root, "_data", "publications.yaml")
papers_dir = File.join(root, "_papers")

unless File.exist?(publications_path)
  warn "Publications data file not found: #{publications_path}"
  exit 1
end

publications = YAML.safe_load(
  File.read(publications_path),
  permitted_classes: [Date, Time],
  aliases: true
)

unless publications.is_a?(Array)
  warn "Expected top-level array in #{publications_path}"
  exit 1
end

FileUtils.mkdir_p(papers_dir)

written = 0
publications.each do |pub|
  next unless pub.is_a?(Hash)

  id = pub["id"]&.to_s&.strip
  next if id.nil? || id.empty?

  front_matter = {
    "layout" => "paper",
    "title" => pub["title"],
    "pub_id" => id,
    "nav" => "research",
    "permalink" => "/papers/#{id}/"
  }

  file_path = File.join(papers_dir, "#{id}.md")
  content = +"---\n"
  content << front_matter.to_yaml.sub(/\A---\s*\n/, "")
  content << "---\n"

  File.write(file_path, content)
  written += 1
end

puts "Wrote #{written} paper pages to #{papers_dir}"
