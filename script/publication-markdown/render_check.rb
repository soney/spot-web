# frozen_string_literal: true

# Render local drafts for verification without generating website pages.
# Pass a temporary output directory, then give it to verify.py --rendered.
require 'json'
require 'fileutils'
require 'kramdown'
require 'kramdown-parser-gfm'

output = File.expand_path(ARGV.fetch(0, '/tmp/spot-publication-markdown-rendered'))
FileUtils.mkdir_p(output)
records = Dir.glob(File.join(__dir__, 'publications', '*.md')).sort.map do |path|
  document = Kramdown::Document.new(File.read(path), input: 'GFM', hard_wrap: false)
  rendered = File.join(output, File.basename(path, '.md') + '.html')
  File.write(rendered, document.to_html)
  { file: File.basename(path), warnings: document.warnings, html: rendered }
end
File.write(File.join(output, 'render-results.json'), JSON.pretty_generate(records) + "\n")
abort 'Markdown parser warnings require review' if records.any? { |record| record[:warnings].any? }
puts "Rendered #{records.length} drafts with no parser warnings"
