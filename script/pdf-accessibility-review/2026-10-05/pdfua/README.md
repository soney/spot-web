# Formal PDF/UA follow-up — October 5, 2026

**73 of 74 current PDFs pass veraPDF 1.30.2's PDF/UA-1 profile.** On October 5, 2026, the user accepted Myers's *Creativity Support in Authoring and Backtracking* (2013) as the one font/PDF-UA exception so its original appearance remains unchanged. Its four original fonts remain unembedded, no font candidate is installed, and the PDF does not claim PDF/UA conformance.

[Summary and final hashes](summary.json) identify the installed files. The [dated manifest](../manifest.json) combines this phase with the earlier figure, table, heading and reading-order work. The earlier phase reports retain their original hashes; they are historical evidence, not repeated tests of these final bytes.

## Repairs and identification

- Classified 8,550 verified running-header/footer artifact markers with the appropriate pagination type and header/footer subtype. Added decimal numbering attributes to 149 clearly numbered native lists. These changes affect 68 PDFs and do not change text, painting instructions or tag order. An independent object/instruction comparison checked every change; selected boundary cases were checked against the printed page. See the [reviewed plan](structure/plan.json), [independent review](structure/independent-candidate-review.json), and [installation record](structure/installed.json).
- Repaired native `ActualText` for InterState's page-8 prototype-chain example and Pandita's page-6 algorithm. The transcriptions restore source subscripts, primes, tokens and indentation without editing the printed paper. Two CMU mixed-font lines were checked against the source and cleared without changing their content. All four formerly uncertain code-layout regions are resolved. See the [code review](code/README.md).
- Added `pdfuaid:part=1` to 71 PDFs after the structural, semantic and source checks. CodeStream and UI Development Experiences already had identification and retain it. The incremental operation changes only the metadata object and preserves all existing XMP bytes and properties, including the existing PDF/A declaration and extension schema where present. [Identification proof](identification.json) records every before/after hash and changed object.

The declarations follow the combined automated and documented manual review, including source/figure checks and actual reader-interface samples. The [declaration review](structure/declaration-review.md) records the standards guidance and limitations considered. They are not external certification or a claim that all original visual limitations have been removed.

## Verification of the installed files

- All 74 pass the [native structural checks](../structure-summary.json) and [native/archive comparison](../archive-native-sync.json): 38,770 elements, 507,373 content references and 5,209 annotations. All 66 previously accepted alternative-description repairs still match the PDFs.
- [veraPDF results](../verapdf-summary.json): 73 passes; Myers retains the missing-identification and four unembedded-font findings. There are no files failing only identification.
- [Appearance comparison](../appearance-comparison.json): all 1,024 pages of the 73 changed PDFs are pixel-identical to the original baseline in both MuPDF 1.28.2 and Poppler 26.01.0 at 144 DPI. The remaining four-page Myers PDF is byte-identical. Page geometry is unchanged.
- Three [fresh Firefox accessibility-interface checks](at/README.md) pass on final file hashes: Notebook table cells and header associations, the Promises/Pitfalls Python example's position, and FireCrystal's cross-page paragraph continuation. Continuous screen-reader speech and whole-corpus assistive-technology use have not been verified.
- All 74 Markdown documents were regenerated and rendered. Their 420 images, 128 tables, 4,986 cells, 1,609 headers and 578 code elements are accounted for; 76 native code replacements are preserved. No code-whitespace review warnings remain. The [continuity check](review-continuity.json) proves that 72 document bodies and all 420 image files are unchanged from the previous reviewed versions; only two reviewed code transcriptions change. Source-PDF hash comments are updated. All nine independently reviewed Markdown samples retain their reviewed content.
- All 74 [download bundles](../download-check.json) match their source files and figure paths. The [browser check](../browser-check.json) verifies both download buttons, desktop/mobile layouts, button contrast and all 420 images in extracted packages while offline. A clean Jekyll build and the publication/PDF path audit pass. The [independent consistency check](independent-final-consistency.json) confirms every current PDF, archive, Markdown and report hash. The [site comparison](independent-site-diff.json) finds no HTML changes during this formal phase; only PDF/Markdown/ZIP bytes, the feed timestamp and PDF sitemap modification dates change.

## Accepted font/PDF-UA exception

[Font experiments and provenance](fonts/README.md) show why no tested embedding preserves every reader's prior fallback rendering. Nimbus matches all four original pages in MuPDF; Tinos/Arimo matches all four in Poppler. Both candidates pass the automated PDF/UA profile when identification is added. On October 5, 2026, the user instructed “commit with that one exception,” accepting the original Myers PDF and its remaining four unembedded-font and missing-identification findings. Neither candidate is installed or published, and no PDF/UA declaration is added to Myers.

The accepted, unchanged Myers PDF has SHA-256 `5896c2425f702d93a96791e1c9a64f4d21ecb837f40ab81dff5cd4b297976222`. This is an accepted accessibility exception for preserving appearance, not a conformance pass.

Original small text, low-contrast artwork, printed overlaps and source editorial errors remain as required by the appearance constraint. The [main review](../README.md) records these paper-specific limitations. An automated PDF/UA pass does not establish WCAG conformance or complete usability for every reader.

## Reproduction

The normal read-only corpus checks are documented in the [main review](../README.md#reproducing-checks). `tools/add_identification.py`, `tools/install_metadata.py`, the structure/code scripts and `fonts/embed_nimbus.py` preserve the specific reviewed transformations. They depend on their expected starting hashes and are not generic or repeatedly runnable repair commands. The Markdown converter and exporter remain the maintenance path described in the repository documentation.
