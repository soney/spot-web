# Publication PDF accessibility and appearance review

The [October 5 re-audit](2026-10-05/README.md) is the current review. It covers
every page layout and figure alternative, native reading-order and PDF/UA
repairs, and Markdown downloads with offline figures. The
[current PDF/UA summary](2026-10-05/pdfua/summary.json) records 73 veraPDF
PDF/UA-1 passes. On October 5, 2026, the user accepted Myers 2013 as the one
font/PDF-UA exception to preserve its original appearance. It retains four
unembedded fonts and no declaration; no embedding candidate is installed.
The [accepted exception](2026-10-05/pdfua/README.md#accepted-fontpdf-ua-exception)
records its unchanged hash. All installed PDFs preserve their original appearance: 1,024
pages in 73 changed PDFs are pixel-identical in both tested renderers, and
Myers's four pages remain byte-identical.

The subsequent [reading-order review](2026-10-05/reading-order/README.md)
identified sentence interruptions and misplaced or interleaved content.
The [repair record](2026-10-05/reading-order/repairs/README.md) documents that
intermediate phase. Later PDF/UA work added 71 declarations, classified 8,550
pagination artifacts, supplied numbering attributes for 149 ordered lists,
and resolved four code-layout flags with two ActualText repairs and two
source-verified clearances. Three [fresh reader-interface samples](2026-10-05/pdfua/at/README.md)
check the current files. Continuous screen-reader speech and whole-corpus
accessibility certification are outside that evidence. The October manifest
binds current files to current checks; the September evidence below is historical.

## September 14 baseline

The September 14, 2026 review covers all 74 publication PDFs (1,028 pages).
The PDFs in `assets/pdfs/` retain their original filenames and publication URLs.
The original 73 PDFs use Git revision `8bbeb3a` as their appearance baseline;
Navigating Complexity uses the original attachment supplied by the user, identified
by its hash in the manifest. Every page matches its baseline pixel for pixel in
both MuPDF 1.28.2 and Poppler 26.01.0 at 144 DPI. Page counts, MediaBox and
CropBox geometry, and rotations also match. `appearance-comparison.json` records
the original and final hashes and per-file comparison results.

Native tags provide reviewed headings, paragraphs, column order, lists,
table cells and header relationships, figure and formula alternatives,
Unicode mappings, and document metadata. The user's final requirement was to
preserve the original appearance throughout. Earlier visible contrast, chart,
figure-placement, formula and font-substitution changes were therefore removed.
Recovered content is retained as invisible tagged text where described below.

## September verification

All 74 copies pass the custom structural checks. veraPDF 1.30.2's PDF/UA-1
profile reports two complete passes, 71 files whose only failure is a missing
PDF/UA identification declaration, and one file with original unembedded fonts
plus the missing declaration. No other profile-rule failures remain. A
PDF/UA declaration was not added merely to pass the validator.

Source pages and native tag trees were reviewed. The five original editions
that replace tagged web alternatives received fresh content-to-tag mappings;
headings, tables, figures, references and original publication notices were
checked. A second review corrected copyright placement and Explore's Table 2
caption order. The final appearance comparisons cover every page in both
renderers, including these five editions. These results apply to the specified
renderers and resolution; they do not guarantee identical behavior in every
reader or on every operating system.

Earlier automated integration tests used Orca 50.2, Firefox 155.0.1, AT-SPI and
Orca speech logs on Codelets, Expresso and Codeon. Those exact PDF bytes were
unchanged within the September phase; later October repairs changed them.
The tests checked sampled heading/link navigation, reading order and
table-header announcements. The HTML companions were also tested, including XML
reflow at 500% browser zoom. This is not a human listening study, an all-page
screen-reader test, or blanket PDF/UA or WCAG certification.

The September manifest remains a dated baseline. Check current PDFs against
the October manifest:

```bash
ruby -rjson -rdigest -e '
  review = JSON.parse(File.read("script/pdf-accessibility-review/2026-10-05/manifest.json"))
  review.fetch("documents").each do |doc|
    abort "Changed since review: #{doc.fetch("path")}" unless
      Digest::SHA256.file(doc.fetch("path")).hexdigest == doc.fetch("final_sha256")
  end
  puts "All #{review.fetch("files")} PDFs match the reviewed hashes"
'
ruby script/pdf_audit.rb
```

## September source choices and appearance

- **Original editions:** VRCopilot, UI Frameworks, Crowd GUI, Explore and
  Callisto use the repository's original page content, images and
  notices with the reviewed semantics transferred onto that content. Crowd
  GUI's differently wrapped references were rebuilt from the original pages.
- **Inclusive Source Code:** the original 17-page layout is preserved. Five
  missing main-text code examples are available as invisible native Code text
  recovered from the [intact author copy](https://andrewbegel.com/papers/pandey-chi24.pdf).
  Reviewed appendix headings, code indentation, quotation blocks and reading
  order are retained. The original blank code panels remain visually blank.
- **MIT thesis:** five verified formulas are exposed through invisible native
  Formula text and alternatives, using the handwritten corrections in the
  [MIT deposited scan](https://hdl.handle.net/1721.1/46009). The original visible
  omissions remain. The XML example on pages 47–48 also has HTML and plain-text
  companions in `assets/supplements/`.
- **CMU thesis, Guiding Student AI and PuzzleMe:** original faint text, the
  page 3 figure overlap and the red/green chart encoding are preserved,
  respectively. Reviewed reading order and figure alternatives remain.
- **Fonts:** appearance-preserving embedded-font repairs remain, including VRCopilot's
  two URW Nimbus substitutes verified in both renderers. These are compatible
  substitutes, not recovered original font programs. Myers 2013
  retains four original unembedded resources because substituting font programs
  changed Poppler's glyph shapes. Its dependence on the reader's fallback fonts
  therefore remains. The license for embedded URW fonts is beside this file.
- **Euclase 2009 and EdiTrail:** the original Euclase edition is tagged.
  EdiTrail's four malformed graphics-number literals were normalized. Both
  match their originals in the complete two-renderer comparison.

The readable Expresso table and MIT XML companions remain linked from their
publication pages and exposed through the site's WebMCP publication tool.

## September findings

Navigating Complexity arrived untagged. Its 18-page copy now has reviewed
heading levels, column order, four research-question labels, 62 bibliography
entries, two figure descriptions, and seven tables with 270 cells, 14 spanning
category headers and 234 explicit header associations. The opening drop cap
reads as part of “DEBUGGING.” Table III's accessible caption names the two
anchor scenarios that the original identifies only by underlining. Repeated
IEEE notices are artifacts after an accessible first occurrence. Obsolete tag
markers inside the flowchart were removed, and its reviewed Figure description
provides the diagram's meaning.

Two unembedded Helvetica resources use compatible embedded URW NimbusSans
substitutes; both renderers confirm unchanged appearance on all 18 pages. All
font resources were embedded. The sole veraPDF finding at that phase's close was
the omitted PDF/UA declaration; October's later PDF/UA phase resolves that
finding. The original
figure/table-number inconsistencies, caption typo and missing parenthesis remain
visually unchanged and are listed in the manifest. The
[Navigating Complexity review](navigating-complexity/final-summary.json) and its
neighboring reports record the exact file hashes, structural checks, table and
figure review, and page comparisons. Its new Markdown download used that phase's
tagged PDF; the original 73 PDFs and Markdown documents were unchanged when it
was added. The later October work updated affected PDFs and conversions.

Preserving original appearance leaves the visual limitations listed above.
Two Table 14 category labels in the MIT thesis are absent in both source
versions. Accessible labels explicitly distinguish the unlabeled 8,783- and
118-example rows; their intended categories have not been guessed.

The manifest records other source/editorial issues, including contradictory
captions or legends, draft metadata, a duplicated subsection number, a malformed
author name, an ambiguous numeric value and a broken cross-reference. Those
research-content corrections need author review.

The full appearance review bundle contains per-page raster comparison results, native tag
exports, validator reports, transfer evidence and repair scripts. Earlier
visually repaired PDFs remain in Git history and the previous review artifact;
this appearance-preserving set supersedes them. The repository keeps the
reviewed PDFs and this compact record.
