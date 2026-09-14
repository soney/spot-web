# Publication description review

The September 14, 2026 review checked all 74 publication records against their
linked local PDFs. Every record now has a short description: 35 were added and
39 were revised into two complete sentences describing the contribution or
method and a supported capability or finding.

Nineteen missing abstracts were added from the PDFs. Thirty-nine existing
abstracts were corrected, including transcription errors, whitespace, duplicated
text, and differences from the local PDF edition; thirteen were retained.
Two passages previously labeled as abstracts were removed because they were
editorial summaries or rearranged introductory prose. Those papers and a third
paper without a formal abstract show the short description under **Overview**:

- UI Development Experiences of Programmers with Visual Impairments in Product Teams
- Toward Providing Live Feedback in Web Automation IDEs
- Expert Crowd Support Systems for Software Developers

## Source review

`manifest.json` records every paper's PDF path and SHA-256 hash, final description
and abstract, source pages, supporting excerpts, changes, and review notes.
Page numbers refer to physical PDF pages, starting at one. The review used direct
PDF text, checked column ordering and abstract boundaries, and consulted the
methods, results, or design sections supporting each summary. Ambiguous layouts
were inspected visually. The nineteen most recent papers received an independent
second check of both their abstracts and short descriptions.

Abstracts follow the local PDF edition, with print line breaks, ligatures,
extraction artifacts, and obvious grammatical typos corrected. Publisher footers
and standalone literature-reference markers are not included in the website
abstracts. Short descriptions distinguish proposals and demonstrations from
evaluated systems, and distinguish reported perceptions from measured outcomes.

Substantive corrections include SPARK's suggested tests, Expresso's smooth versus
jump transitions, VRCopilot's study findings, ParamMacros' user-supplied parameters,
and BashOn's evaluated contribution. On-Demand Collaboration's duplicated abstract
was replaced with the single source abstract; FlowMatic, ScrapeViz, and EdCode now
use the abstracts from their PDFs.

Some PDFs contain internal inconsistencies. For example, CFlow's abstract says
participants took half the time, whereas the results report 499.06 versus 817.50
seconds. SPARK's abstract calls all sixteen study participants instructors,
whereas its methods report prior teaching experience for fifteen. The author
abstracts remain faithful to their PDFs; the short descriptions use claims
supported by the detailed results. Other source discrepancies and metadata
differences are recorded in the per-paper notes. This review does not edit the
papers themselves or their citation metadata.

## Verification

`verification.json` records the clean Jekyll build and checks of all 74 paper
pages, 123 rendered publication rows, WebMCP records, and scholarly JSON-LD.
There are 71 Abstract sections and three Overview sections. The CV page is
byte-identical to the pre-review build, and every publication field other than
`abstract` and `short_description` is unchanged.

All 74 PDFs, 74 Markdown downloads, and their checked source and figure files
remain byte-identical to the start of this description review (683 files).
The prior PDF accessibility and appearance review therefore still applies.
Markdown download buttons remain confined to individual paper pages.

`browser-verification.json` records Chrome checks at 1440- and 390-pixel widths
for the research list and three individual paper pages: Navigating Complexity,
the UI Development chapter, and VRCopilot. The pages have no horizontal layout
overflow or overlapping actions, and six actual PDF/Markdown downloads match
their source hashes. Research-list descriptions retain the existing behavior of
being visible on desktop and hidden on narrow screens; Abstract and Overview
sections remain visible on individual paper pages at both widths.

The review folder is excluded from publication by the site's existing `script`
exclusion. To check whether the PDFs still match this review:

```bash
ruby -rjson -rdigest -e '
  review = JSON.parse(File.read("script/publication-description-review/manifest.json"))
  review.fetch("documents").each do |doc|
    abort "Changed since review: #{doc.fetch("pdf")}" unless
      Digest::SHA256.file(doc.fetch("pdf")).hexdigest == doc.fetch("pdf_sha256")
  end
  puts "All #{review.fetch("publication_count")} PDFs match the reviewed hashes"
'
```
