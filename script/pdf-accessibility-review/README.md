# Publication PDF accessibility review

The September 14, 2026 review covers all 73 publication PDFs (1,011 pages).
The PDFs in `assets/pdfs/` are the reviewed copies. Their existing filenames
and publication URLs are preserved. The previous versions remain in Git
history; `manifest.json` records their hashes alongside the reviewed hashes,
selected source versions, checks and remaining findings.

The review corrected native heading and paragraph structure, column order,
lists, table cells and header relationships, figure and formula alternatives,
Unicode mappings, omitted content and document metadata. Follow-up repairs
embedded missing fonts, restored code and formulas, improved contrast and
figure placement, and added table groups to 105 tables in 37 PDFs.

## Verification

All 73 reviewed copies pass the custom structural checks. veraPDF 1.30.2's
PDF/UA-1 profile reports two complete passes and 71 files whose only failure
is a missing PDF/UA identification declaration. No other profile-rule
failures remain. A declaration was not added merely to pass the validator.

Source pages and native tag trees were reviewed. Changes that preserve
appearance were checked against their selected sources with text and raster
comparisons. Intentional visual changes were checked for differences outside
their documented regions. Font substitution comparisons used MuPDF and
Poppler at 144 DPI.

Automated integration tests used Orca 50.2, Firefox 155.0.1, AT-SPI and Orca
speech logs on the final Codelets, Expresso and Codeon PDFs. They checked
sampled heading/link navigation, reading order and table-header announcements.
The HTML companions were also tested, including the XML example's reflow at
500% browser zoom. This is not a human listening study, an all-page
screen-reader test, or a blanket PDF/UA or WCAG certification.

The manifest is a dated review record, not an assertion about future PDF
replacements. Check that the current files still match it with:

```bash
ruby -rjson -rdigest -e '
  review = JSON.parse(File.read("script/pdf-accessibility-review/manifest.json"))
  review.fetch("documents").each do |doc|
    abort "Changed since review: #{doc.fetch("path")}" unless
      Digest::SHA256.file(doc.fetch("path")).hexdigest == doc.fetch("final_sha256")
  end
  puts "All #{review.fetch("files")} PDFs match the reviewed hashes"
'
ruby script/pdf_audit.rb
```

## Source choices and repairs

- **Inclusive Source Code:** the incomplete 17-page PDF was replaced with the
  intact [18-page author copy](https://andrewbegel.com/papers/pandey-chi24.pdf).
  Its layout was freshly tagged; all 75 code blocks, 65 references and three
  tables were reviewed. Prose matches apart from the page-count metadata.
- **MIT thesis:** five missing formulas on pages 37 and 43 were restored from
  handwritten corrections visible in the [MIT deposited
  scan](https://hdl.handle.net/1721.1/46009). The small XML example on pages
  47–48 also has HTML and plain-text companions in `assets/supplements/`.
- **Euclase 2009:** the repository's original four-page version was freshly
  tagged, replacing an earlier candidate with revised prose.
- **Fonts:** 19 selected files received font repairs; Euclase's original
  already embeds its fonts. Twenty-nine whitespace-only resources retain
  exact advances using self-contained blank glyphs. Ten visible resources
  in four PDFs use compatible embedded URW Nimbus fonts. These are substitutes,
  not recovered original font programs. Myers 2013 has reviewed glyph-shape
  differences under Poppler with unchanged line breaks, positions and text.
  The font license is included beside this file.
- **CMU thesis:** faint text was darkened in 1,916 text operations on 163
  pages, targeting 7:1 contrast against white. This scoped correction excludes
  figure/formula artwork. The title-page submission paragraph's reading order
  was also corrected.
- **Guiding Student AI:** the page 3 figure was resized into its own column,
  removing its overlap with body text.
- **PuzzleMe:** solid versus hollow markers distinguish incorrect and correct
  submissions without relying on red/green alone. The original image and
  event positions are retained beneath the native PDF overlays.
- **EdiTrail:** four malformed graphics-number literals were normalized.
  All 19 pages remain pixel-identical in MuPDF and Poppler at 144 DPI.

The readable Expresso table and MIT XML companions are linked from their
publication pages and exposed through the site's WebMCP publication tool.

## Remaining source findings

Two Table 14 category labels in the MIT thesis are blank in both source
versions. Their accessible labels explicitly identify the unlabeled 8,783-
and 118-example rows; the intended categories have not been guessed.

The manifest records other source/editorial issues: contradictory captions
or legends, draft publication metadata, a duplicated subsection number, a
malformed author name, an ambiguous numeric value, and a broken cross-reference.
Those research-content corrections need author review. The original tiny XML
print remains, with its complete native text available in the companions.

The full review bundle retains per-file native tag exports, rendered evidence,
repair scripts, source comparisons and screen-reader logs. This repository
keeps the delivered documents and this compact record; temporary analysis
paths and browser profiles are not part of the site.
