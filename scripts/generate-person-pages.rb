#!/usr/bin/env ruby
# frozen_string_literal: true

require "yaml"
require "fileutils"
require "date"

root = File.expand_path("..", __dir__)
people_path = File.join(root, "_data", "people.yaml")
people_pages_dir = File.join(root, "_people_pages")

unless File.exist?(people_path)
  warn "People data file not found: #{people_path}"
  exit 1
end

people = YAML.safe_load(
  File.read(people_path),
  permitted_classes: [Date, Time],
  aliases: true
)

unless people.is_a?(Array)
  warn "Expected top-level array in #{people_path}"
  exit 1
end

FileUtils.mkdir_p(people_pages_dir)

written = 0
people.each do |person|
  next unless person.is_a?(Hash)
  next unless person["use_local_homepage"] == true

  id = person["id"]&.to_s&.strip
  next if id.nil? || id.empty?

  full_name = [person["given_name"], person["family_name"]].compact.join(" ").strip
  title = full_name.empty? ? id : full_name

  front_matter = {
    "layout" => "person",
    "title" => title,
    "person_id" => id,
    "nav" => "team",
    "permalink" => "/people/#{id}/"
  }

  file_path = File.join(people_pages_dir, "#{id}.md")
  content = +"---\n"
  content << front_matter.to_yaml.sub(/\A---\s*\n/, "")
  content << "---\n"

  File.write(file_path, content)
  written += 1
end

puts "Wrote #{written} local person pages to #{people_pages_dir}"
