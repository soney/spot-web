# October 5, 2026 publication accessibility re-audit

**Current PDF/UA results:** 73 PDFs pass veraPDF's PDF/UA-1 profile. On October 5, 2026, the user accepted Myers 2013 as the one font/PDF-UA exception to preserve its original appearance. It retains four unembedded fonts and no PDF/UA declaration; no font candidate is installed. The [PDF/UA summary](pdfua/summary.json) identifies the current files and accepted exception. All installed PDFs preserve their original appearance; an automated profile pass does not establish full accessibility.

The earlier [reading-order follow-up](reading-order/repairs/README.md) addressed all 141 recorded examples and additional issues. Its repair and reader-interface records describe that intermediate phase; the current checks below include the later PDF/UA changes.

All 74 final PDFs pass the structural checks. Sixty-six figure/equation descriptions were corrected or expanded, seven headings and five initial reading-order problems were repaired, and three data tables gained native row/cell navigation. The subsequent focused pass repaired the wider reading-order issues and rebuilt Notebook Table 1. All changes preserve the original PDF appearance. [The manifest](manifest.json) identifies the exact final files and remaining findings.

The fresh review covers all 74 publication PDFs and all 1,028 pages. Every page received a rendered layout overview. Reviewers compared all 461 extracted figure/formula image assets with their native alternatives, captions and surrounding context, enlarging ambiguous or complex material. Seven additional native nodes were checked without standalone image crops: five recovered MIT formulas, Crowd GUI’s inline circled-2 reference, and CodeStream’s CC BY logo.

The user’s requirement to preserve the original PDF appearance remains in force. Repairs change accessible semantics, reading order and alternative descriptions; source colors, printed wording, layout, omissions and overlaps stay visible as published. The individual reports record starting PDF hashes, node IDs, page coverage, evidence and proposed changes:

- [Group 1: 22 PDFs](visual-review/group-1-review.json)
- [Group 2: 27 PDFs](visual-review/group-2-review.json)
- [Group 3: 25 PDFs](visual-review/group-3-review.json)

## Findings and repair record

The review produced 66 alternative-description changes across 35 PDFs: 54 improvements and 12 corrections to inaccurate descriptions. Improvements supply diagram relationships, chart axes and trends, screenshot highlights and meaningful controls where a caption alone was insufficient. Corrections address details such as MIT baseball entities/events, the used-car mockup’s repair-history purpose, VRGit’s selected versus current version, and source-specific labels. Source caption/legend contradictions are identified rather than silently treated as research-content corrections. [Alternative repairs](alternative-repairs.json) records the applied wording and affected hashes.

Twelve structural repair operations are recorded:

| Publication | Repair |
| --- | --- |
| Colaroid | Rejoin three truncated subsection headings on pp. 9/13. |
| EdiTrail | Rejoin two subsection headings on pp. 3/9, including a missing middle phrase. |
| Co-Advisor | Give the p. 7 RQ1 subsection its corresponding H3 role. |
| VizProg | Return the p. 11 heading’s first-line continuation from the following paragraph. |
| Explore, Create, Annotate | Put the p. 1 affiliation before the abstract in reading order. |
| Sifter | Separate the p. 1 author columns into coherent author/affiliation blocks. |
| ScrapeViz | Move p. 1 notes out of the sentence they interrupt. |
| ConstraintJS | Read the author and affiliation before the opening figure. |
| Hybrid Crowd–Machine Workflow | Separate the copyright notice from the introduction paragraph. |

The exact native changes and synchronized Markdown-source changes are in [heading repairs](heading-repairs-group3.json), [additional structure repairs](structure-repairs-group2.json), and [reading-order repairs](reading-order-repairs.json). Codelets Table 1 now has 31 native cells, including 15 headers with spanning step headings and explicit associations. Its existing bitmap is preserved, with invisible semantic text supplying cell navigation. Arboretum Figure 5 now contains two native 4×4 tables with 14 headers and 18 values, tagged directly from the existing vector text. Both repairs preserve the complete data and captions in Markdown. See the [Codelets mapping](codelets-table-repair.json) and [Arboretum mapping](arboretum-table-repair.json). Newly classified notices also have registered [Note identifiers](note-id-repairs.json).

The subsequent PDF/UA phase classified 8,550 pagination artifact markers and supplied numbering attributes for 149 ordered lists. It repaired native Code ActualText in InterState and Inferring Method Specifications, and source review cleared two CMU code-layout flags without changing their text. After those checks, 71 files gained PDF/UA-1 identification; two files already had it. The [semantic changes](pdfua/structure/installed.json), [code review](pdfua/code/README.md) and [identification record](pdfua/identification.json) preserve the evidence. The four previously flagged code-spacing regions now have source-reviewed resolutions.

Markdown copies retain all figure content and reviewed descriptions. The two former table images are now three semantic tables, and reading-order repairs place small callout descriptions inline, leaving 420 local figure/equation images and 128 tables across the 74 documents. Ten reviewed crop refinements remove neighboring prose or figures while retaining complete diagrams and labels. Individual paper pages offer both Markdown and “Markdown + figures (ZIP)” downloads; publication lists and the CV do not add those controls. Extracting a ZIP keeps all image paths local. Source-PDF and publisher links still need a network connection.

All 461 previously published image URLs keep their identities. The two older table images and 39 callout images remain available for previously downloaded Markdown; current ZIPs use semantic tables and inline callout text. Only the ten reviewed crop refinements change image pixels.
[Compatibility checks](image-compatibility.json) record this separately.

## Remaining source and presentation concerns

These findings combine the three fresh review reports with unresolved source/editorial findings carried forward from the earlier [manifest](../manifest.json). Small text, faint colors and color-dependent encodings are retained to preserve appearance; alternatives provide another route to the information. Editorial contradictions and missing research labels require author/source correction. An absent item here means no additional concern was recorded in this pass, not that the publication is certified accessible.

| Publication | Remaining concern |
| --- | --- |
| [CMU thesis](../../../assets/pdfs/oney-expressing-interactivity-states-cmu2015.pdf) | Pale code, inactive fields and appendix labels; Figure 4.6 selected/unselected circles appear reversed; Figure 4.19 caption swaps chart labels. Prior p. 29 broken cross-reference remains. |
| [Multi-Click](../../../assets/pdfs/zhang-multi-click-uist2025.pdf) | Small figure labels, code and screenshots. |
| [CoCapture](../../../assets/pdfs/chen-cocapture-chi2021.pdf) | Small screenshot labels; red/green frames distinguish existing and desired interfaces. |
| [VRCopilot](../../../assets/pdfs/zhang-vrcopilot-uist2024.pdf) | Small figure and screenshot text. |
| [Challenges and Needs, 2021](../../../assets/pdfs/krosnick-understanding-challenges-needs-vlhcc2021.pdf) | Small figure and screenshot text. |
| [PuzzleMe](../../../assets/pdfs/wang-puzzleme-cscw2021.pdf) | Small screenshots; red/green execution markers. Figure 3’s Score2 ordering conflicts with the alphabetical-sort caption. |
| [ConstraintJS](../../../assets/pdfs/oney-constraintjs-uist2012.pdf) | Small figure labels and screenshot text. |
| [Callisto](../../../assets/pdfs/wang-callisto-chi2020.pdf) | Small figure labels and screenshot text. |
| [CFlow](../../../assets/pdfs/zhang-cflow-ls2024.pdf) | Small figure labels and screenshots. |
| [Accessibility Collaboration](../../../assets/pdfs/pandey-understanding-accessibility-collaboration-cscw2021.pdf) | Original magenta prose and a densely typeset participant table. |
| [Codeon](../../../assets/pdfs/chen-codeon-chi2017.pdf) | Small screenshots. Prior Table 4 conflict remains: caption says longer system-active time, while values are 165.8 seconds for Codeon and 344.4 for control. |
| [Hybrid Crowd–Machine Workflow](../../../assets/pdfs/chen-hybrid-crowd-machine-workflow-vlhcc2020.pdf) | Small figure labels and screenshot text. |
| [How Pairing Code](../../../assets/pdfs/xu-how-pairing-code-chilbw2023.pdf) | Small figure labels and screenshot text. |
| [EdCode](../../../assets/pdfs/chen-edcode-vlhcc2020.pdf) | Small figure labels and screenshot text. |
| [Inclusive Source Code](../../../assets/pdfs/pandey-inclusive-source-code-chi2024.pdf) | Original blank code panels on pp. 5, 7, 8 remain; five recovered examples are invisible native Code text. Visible appendix listings remain on pp. 13–17. |
| [RunEx](../../../assets/pdfs/zhang-runex-vlhcc2023.pdf) | Small figure labels and screenshot text. |
| [Creativity Support for Authoring](../../../assets/pdfs/myers-creativity-support-authoring-chi2013workshoponevaluationmethodsforcreativitysupportenvironments.pdf) | Small figures and four original unembedded font resources. On October 5, 2026, the user accepted the font/PDF-UA exception to preserve appearance; reader fallback-font dependence remains. No candidate is installed; see the [font comparison](pdfua/fonts/README.md). |
| [FireCrystal](../../../assets/pdfs/oney-firecrystal-vlhcc2009.pdf) | Small figure labels and screenshot text. |
| [On-Demand Collaboration](../../../assets/pdfs/chen-on-demand-collaboration-programming-msnfws2020.pdf) | Prior first-page 2018 ACM template metadata conflicts with the 2020 event record. |
| [Tracking Needs](../../../assets/pdfs/pandey-exploring-tracking-needs-pervasivehealth2019.pdf) | Prior Woodstock 2018 draft venue/date persists across all four pages despite the 2019 publication record. |
| [Co-Advisor](../../../assets/pdfs/arab-co-advisor-vlhcc2025.pdf) | Small screenshots and boxplots; Figure 6 distinguishes paired series by color. |
| [CodeStream](../../../assets/pdfs/zhang-codestream-chi2026.pdf) | Small dense code and pale gray shading; Figure 2 intentionally demonstrates unreadable clutter. |
| [EdBooks](../../../assets/pdfs/oney-edbooks-preprint2024.pdf) | P9 figure overlaps manuscript footer. Anonymous-author/DOI placeholders, p. 3 red editorial notes and p. 10 institution placeholder remain. |
| [VizProg](../../../assets/pdfs/zhang-vizprog-chi2023.pdf) | Pale map trajectories/history dots and color-dependent submission categories. |
| [Multi-Touch Gestures](../../../assets/pdfs/oney-implementing-multi-touch-gestures-chi2019.pdf) | Small colored code/gesture diagrams. Section 3.3 contains 3.2.1/3.2.2; another 3.2.2 appears under 5.1. |
| [How Data Scientists](../../../assets/pdfs/wang-how-data-scientists-cscw2019.pdf) | Activity phases use similar colors. Prior Table 5 standard deviation is printed as 0.l3, with a lowercase l; intended value needs author confirmation. |
| [Sifter](../../../assets/pdfs/chen-sifter-imx2020.pdf) | Two blue/cyan condition shades, small previews and axis labels. |
| [Think-Aloud Computing](../../../assets/pdfs/krosnick-think-aloud-computing-chi2021.pdf) | Pale widget and mini-chart labels. |
| [chat.codes](../../../assets/pdfs/oney-creating-guided-code-cscw2018.pdf) | Small faint code and gray text. January 2010 publication metadata/footers and placeholder DOI remain in the 2018 draft. |
| [SPARK](../../../assets/pdfs/yang-spark-vlhcc2025.pdf) | Figure 6 labels the darkest/high-mean category Not Used; interpretation remains ambiguous. Many screenshots/traces use pale gray text or lines. |
| [Adasa](../../../assets/pdfs/lin-adasa-uist2018.pdf) | Small raster dashboard indicators and map labels. |
| [Inferring Method Specifications](../../../assets/pdfs/pandita-inferring-method-specifications-icse2012.pdf) | Dense small source code and shadowed node diagrams. |
| [InterState](../../../assets/pdfs/oney-interstate-uist2014.pdf) | Small pale inactive/inherited properties. Figure 3 caption switches height/width. |
| [Simulating Human Cursor](../../../assets/pdfs/zhou-simulating-human-cursor-chiposters2026.pdf) | No explicit human/simulated color legend in Figures 1–3; thin pale trajectories. Equation 2 lacks a visible plus before J_tracking at the line break. |
| [Explore, Create, Annotate](../../../assets/pdfs/pandey-explore-create-annotate-chi2020.pdf) | Faint raised lines on transparent tactile-map film. |
| [Challenges and Needs, 2025](../../../assets/pdfs/zhang-understanding-challenges-needs-chi2025compui.pdf) | Small labels and red/green levels in Figure 3. |
| [ZoomBoard](../../../assets/pdfs/oney-zoomboard-chi2013.pdf) | Individual Figure 4 participant curves use color without direct labels; the mean has a thick line and diamond markers. |
| [Providing Live Feedback](../../../assets/pdfs/krosnick-providing-live-feedback-live2020.pdf) | Small screenshot. Source prose uses date23/#date-picker while the pictured example uses date21/#datepicker. |
| [Benefits and Challenges of FRP](../../../assets/pdfs/zhang-studying-benefits-challenges-vlhcc2019.pdf) | Translucent operator boxes and property labels have low contrast against the VR scene. |
| [ScrapeViz](../../../assets/pdfs/krosnick-scrapeviz-vlhcc2024.pdf) | Small preview text and color-coded groups. |
| [Playbook](../../../assets/pdfs/oney-playbook-iseud2011.pdf) | Small interface screenshot text. |
| [MIT thesis](../../../assets/pdfs/oney-natural-language-search-mit2008.pdf) | Five original formula omissions on pp. 37/43 remain, with invisible native Formula equivalents. Table 14 has two unlabeled Type cells. Figure 17 caption reverses actual axes. Appendix XML is small and pale; HTML/plain-text companions remain available. |
| [Colaroid](../../../assets/pdfs/wang-colaroid-chi2023.pdf) | Small labels in dense screenshots and participant timelines. |
| [EdiTrail](../../../assets/pdfs/zhang-editrail-uist2026.pdf) | Small screenshot/appendix-code text. P19 is blank apart from its running header. |
| [Crowd GUI](../../../assets/pdfs/chen-improving-crowd-supported-gui-chi2020.pdf) | Bar-chart conditions depend partly on color. |
| [Making End-User Development More Natural](../../../assets/pdfs/myers-making-end-user-eud2017.pdf) | Rotated Gneiss screenshot on p10; tiny or pale interface text in several screenshots. |
| [FlowMatic](../../../assets/pdfs/zhang-flowmatic-uist2020.pdf) | Small VR labels and color-coded components. |
| [VRGit](../../../assets/pdfs/zhang-vrgit-chi2023.pdf) | Figure 4b caption calls the selected branch dark red; its lower branch appears green. The alternative records this discrepancy and separates selection from the user’s current version. |
| [CodeMend](../../../assets/pdfs/rong-codemend-uist2016.pdf) | Small controls in the source figures. |
| [ConvoMap](../../../assets/pdfs/zhang-convomap-vlhcc2025.pdf) | Small semantic-map text and colored marks. |
| [ParamMacros](../../../assets/pdfs/krosnick-parammacros-vlhcc2022.pdf) | Dense small table and selector text in screenshots. |
| [Attention Patterns for Code Animations](../../../assets/pdfs/spinelli-attention-patterns-for-code-animations-px182018.pdf) | Green/yellow eye-tracking traces use different time scales across plots. |
| [Navigating Complexity](../../../assets/pdfs/arab-navigating-complexity-tse2026.pdf) | Figure 2 mislabels codebase characteristics as Table IV instead of V; dense arrows and Table VII text. Prior caption typo, missing Table VII closing parenthesis and forward-reasoning cross-reference mismatch remain. |
| [How to Support Designers](../../../assets/pdfs/ozenc-how-support-designers-chi2010.pdf) | Handwritten sketch labels and small mockup text. |
| [Expresso](../../../assets/pdfs/krosnick-expresso-vlhcc2018.pdf) | Compact evaluation-table text and numeric entries; native cells/headers and its readable companion remain available. |
| [Don’t Step on My Toes](../../../assets/pdfs/wang-dont-step-on-my-toes-ideworkshop2024.pdf) | Small colored collaborator and output annotations. |
| [What Makes a Well-Documented Notebook](../../../assets/pdfs/wang-what-makes-well-documented-chiea2021.pdf) | Compact histogram labels and logarithmic axes. |
| [VizCode demonstration](../../../assets/pdfs/yang-vizcode-lsdemos2024.pdf) | Figure 2 caption repeats code boxes inaccurately; the alternative describes student panels and the blue currently-edited-file labels. |
| [CFlow demonstration](../../../assets/pdfs/zhang-demonstration-of-cflow-lsdemos2024.pdf) | Green-to-red correctness encoding; alternative supplies the legend and selected IndentationError example. |
| [Understanding and Guiding Student AI](../../../assets/pdfs/zhang-understanding-guiding-student-ai-chi2025aeai.pdf) | Original p. 3 figure overlaps the right body column. Draft conference/DOI/reference metadata remains. |
| [Promises and Pitfalls of LLMs](../../../assets/pdfs/krosnick-promises-pitfalls-llms-chi2023compui.pdf) | Draft publication metadata placeholders remain. |
| [Redesigning Notebooks](../../../assets/pdfs/wang-redesigning-notebooks-data-husdat2019.pdf) | Prior reference 6 contains a visibly malformed author-name encoding; source correction is needed. |

## Verification and limits

Reviewers checked actual native `/Alt` values against the hash-bound tag archives, reviewed heading sequences and opening/column reading order, and compared table/header organization with rendered pages. Figure review assessed meaning and accuracy, not only whether an alternative existed. Criteria follow W3C guidance on [figure alternatives](https://www.w3.org/WAI/WCAG22/Techniques/pdf/PDF1), [reading order](https://www.w3.org/WAI/WCAG22/Techniques/pdf/PDF3), and [table structure](https://www.w3.org/WAI/WCAG22/Techniques/pdf/PDF6). All-page coverage refers to layout overview: it does not mean every prose line was read at full resolution. Table cell/value checking and detailed reading-order inspection were targeted to the documented pages and anomalies.

This pass is not an all-page screen-reader test, a human listening study, or blanket PDF/UA/WCAG certification. Three [fresh Firefox AT-SPI samples](pdfua/at/README.md) after the PDF/UA changes check the rebuilt table, Python example and cross-page paragraph sequence against current PDF hashes. Continuous Orca speech was not rerun; the earlier isolated audio-backend failure remains a limitation. Previous sampled assistive-technology tests apply only to their documented versions and scenarios. Original visual limitations and unembedded-font dependencies can remain even when structural checks pass.

Final checks:

- **Structure and archive synchronization:** all 74 pass. The native/archive comparison covers every element role, alternative, text replacement, parent and ordered content reference; all 66 accepted replacements match the PDFs. [Structural results](structure-summary.json), [archive comparison](archive-native-sync.json).
- **Appearance:** all 1,024 pages in the 73 changed PDFs are pixel-identical to the starting copies in MuPDF 1.28.2 and Poppler 26.01.0 at 144 DPI, with unchanged page geometry. Myers 2013's four pages remain byte-identical. The starting copies match the September review, so the original appearance baseline still holds. [Comparison](appearance-comparison.json).
- **PDF/UA-1 profile:** veraPDF 1.30.2 reports 73 passes. Myers 2013 is the sole remaining failure, for four original unembedded fonts and missing PDF/UA identification. The user accepted this exception on October 5, 2026, to preserve appearance; no font candidate or conformance declaration is installed. Its unchanged SHA-256 is `5896c2425f702d93a96791e1c9a64f4d21ecb837f40ab81dff5cd4b297976222`. [Results](verapdf-summary.json), [accepted exception](pdfua/README.md#accepted-fontpdf-ua-exception).
- **Reader interface:** three current Firefox 156.0.1 PDF.js samples pass: all 40 Notebook Table 1 cell names and 27 data-cell header relationships, the Promises/Pitfalls setup → Python example → following section sequence, and FireCrystal's cross-page paragraph continuation before its figure. [Current captures and assertions](pdfua/at/results.json).
- **Markdown and downloads:** all 74 render without parser warnings; every tagged content reference is consumed once. All 420 image files, 128 tables, 4,986 cells, 1,609 headers, 578 source-code elements and 76 Code ActualText strings are accounted for. No code-whitespace review warnings remain. ZIP member paths, bytes and links match the reviewed inputs. [Download checks](download-check.json), [conversion checks](../../publication-markdown/verification.json).
- **Browser:** Chrome 154.0.8037.97 downloaded both formats successfully from a paper page. All 74 extracted packages loaded all 420 images with the browser offline. Desktop and mobile layouts fit the viewport; the download button's resting, hover and focus text contrast passes in light and dark themes. [Browser checks](browser-check.json).
- **Site:** a clean Jekyll build completed without content warnings. All 74 PDF names and paths pass the repository audit. Paper-page links and WebMCP bundle paths agree; no bundle buttons appear in publication lists or CV pages.

The warnings left in the structural reports are reviewed repeated letter/number callouts and intentionally blank pages: Co-Advisor pp. 4–5, Crowd GUI p. 4, CMU p. 147, MIT pp. 2/4, and EdiTrail p. 19. Their meanings or blank-page status were checked visually.

The original visual-review records refer to the starting PDF hashes and image exports at the Git revision recorded in the manifest. Repairs and current file hashes are recorded separately. September evidence and the intermediate reading-order phase's hash-bound reports remain historical; the current PDF/UA summary and global verification reports supersede their file inventories. Figure/page contact sheets and browser screenshots are also retained in the local `pdf-accessibility-october-review` artifact folder.

### Reproducing checks

Install the Python versions listed in `tools/requirements.txt`, plus `mutool`, Poppler and veraPDF. The scripts read current PDFs; they do not alter them:

```bash
python script/pdf-accessibility-review/2026-10-05/tools/audit.py
python script/pdf-accessibility-review/2026-10-05/tools/validate_ua.py /path/to/verapdf
python script/pdf-accessibility-review/2026-10-05/tools/check_archive_native_sync.py --output /tmp/archive-native-sync.json
python script/pdf-accessibility-review/2026-10-05/tools/compare_appearance.py --baseline /path/to/pre-review-pdfs
```

Repair scripts are evidence for the specific reviewed transformations. They assert their expected starting state and are not generic or repeatedly runnable PDF repair commands. The Markdown converter and exporter remain the normal maintenance path described in the repository README.
