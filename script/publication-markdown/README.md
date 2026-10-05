# Publication Markdown drafts

Local Markdown versions of all 74 publication PDFs (1,028 source pages), created on September 14 and reviewed again on October 5, 2026. These are full-text conversions with 420 local figure/equation images, 128 tables and 578 source code elements. The Markdown conversion does not change the PDFs.

Open any publication below in a GitHub-flavored Markdown reader that supports inline HTML. Each document links to its source PDF; figures are local PNG files in `figures/`. The files have no website frontmatter, and this entire directory is inside `script/`, which Jekyll already excludes.

## Conversion and review

The conversion follows the reviewed native PDF tags. It preserves headings, lists, references, links, captions, figure alternatives, code and table relationships. Prose line wraps are reflowed, attested word splits are joined conservatively, publication notices are grouped with frontmatter, and unfinished paragraph continuations are joined. Small superscripts and subscripts are positioned within their printed lines.

Complex tables use semantic HTML to preserve row headers, merged cells and explicit header relationships; two simple tables use Markdown table syntax. Code uses fenced blocks. Native Code ActualText remains exact; otherwise, whitespace is recovered conservatively from printed geometry without changing the glyph sequence. Printed line numbers remain part of the examples.

Equations use source images and reviewed text alternatives where available. Twelve narrow, source-checked transcriptions correct inline mathematics or pseudocode; fractions and indices use explicit linear notation where needed. The recovered MIT formulas and Inclusive code examples are included. Native PDF repairs reconnect the Expresso contribution across a page break and CFlow reference 54 across columns; their former Markdown-only workarounds have been retired.

All 74 documents render through the installed Kramdown GFM parser with zero warnings. Checks account for every tagged content reference exactly once, preserve all 578 code glyph sequences and 76 Code ActualText strings, verify all local images and page anchors, retain all 433 figure and 33 formula alternatives, and confirm all 128 tables, 4,986 cells and 1,609 headers in rendered HTML. Independent sample reviews cover MIT, Inclusive, VRCopilot, Codelets, Expresso, Callisto, CFlow, Cursor and the CMU thesis. The added Navigating Complexity edition was reviewed for its 270 table cells, 106 headers, 14 category bands, 234 explicit header associations, two figure alternatives, 65 headings and 62 bibliography entries.

These conversions preserve research wording and source errors; they are not an editorially proofread edition. Complex inline math, paragraph boundaries and code typography can still require review. The four earlier code-spacing flags were [reviewed against the printed source](../pdf-accessibility-review/2026-10-05/pdfua/code/README.md), and no code-whitespace review warnings remain:

| Publication | Source page | Source-review resolution |
|---|---:|---|
| [Expressing Interactivity with States and Constraints](publications/oney-expressing-interactivity-states-cmu2015.md) | 169 | Mixed font pitch; existing text, order and punctuation match the printed source. No text change. |
| [Expressing Interactivity with States and Constraints](publications/oney-expressing-interactivity-states-cmu2015.md) | 216 | Mixed font pitch; existing text, order and punctuation match the printed source. No text change. |
| [InterState: A Language and Environment for Expressing Interface Behavior](publications/oney-interstate-uist2014.md) | 8 | Native Code ActualText now places the printed subscripts correctly using explicit underscore notation. |
| [Inferring Method Specifications from Natural Language API Descriptions](publications/pandita-inferring-method-specifications-icse2012.md) | 6 | Native Code ActualText now preserves variable primes, 29 numbered lines, indentation and the printed underscore. |

## Added accepted author edition

[Navigating Complexity](publications/arab-navigating-complexity-tse2026.md) uses the 18-page accepted author PDF supplied on September 14, 2026. Its accessibility repairs preserve the original page appearance. The Markdown retains the corrected opening drop cap and the Table III caption alternative that names the two underlined scenario anchors. Native content order, publication notices and research wording remain, including adjacent overlapping introductory statements and a Figure 2 legend/table-reference inconsistency described in the figure alternative. The October reading-order repairs join paragraph continuations and place notes and floats at coherent boundaries.

When this edition was added on September 14, the previous 73 source archives, drafts, images and downloadable copies were preserved byte for byte. The October review described below subsequently updated affected copies. `verification.json` covers all 74 current drafts; `review-evidence/navigating-complexity-markdown-review.json` records the added edition. Earlier independent review evidence and `site-exclusion-check.json` describe the original 73-document snapshot of September 14, 2026, before site download integration. The earlier ZIP bundle remains that original snapshot.

## October accessibility review and offline figures

The [October PDF review](../pdf-accessibility-review/2026-10-05/README.md) checked every page layout and every figure/formula alternative. The current conversions include the 66 improved descriptions, repaired headings and reading order. Codelets Table 1 and the two results tables in Arboretum Figure 5 now render as semantic tables instead of images; all their values, units and header relationships remain. `reviewed-crops.json` binds ten tighter figure crops to the current PDF hashes. The twelve existing transcriptions were rebound after verifying their exact reviewed text in native ActualText. Crop bindings were retained only after confirming unchanged figure content and page appearance.

Individual paper pages offer both a single Markdown file, whose images use the site's canonical URLs, and a **Markdown + figures (ZIP)** download. Extracting the ZIP places the document beside its local `figures/` folder. Both preserve the same descriptions, tables and code. All 74 ZIPs were checked in an offline browser; their 420 images load without a network connection. Source-PDF and publisher links still require a connection.

Run `convert.py`, then `render_check.rb` and `verify.py`, and finally `export_downloads.py` after changing reviewed sources. The exporter checks all input hashes before writing and produces reproducible ZIPs. It rejects obsolete generated downloads so they can be reviewed before removal. These are maintenance commands; Jekyll serves the prepared downloads without a new build step.

`image-paths.json` preserves published figure filenames when native order or roles change. All 461 previously published image URLs remain available: current packages contain 420 images; 39 former callout images and two former table images remain served for earlier downloads. Current documents use inline callout descriptions and semantic tables in those places.

The September review-evidence files remain historical snapshots. `verification.json`, `manifest.json`, the per-document `review/` records and `checksums.json` describe the current conversion set.

The subsequent [native reading-order repairs](../pdf-accessibility-review/2026-10-05/reading-order/repairs/README.md) address all 141 recorded examples and additional confirmed issues. These conversions were regenerated from the repaired native order. An independent nine-document review checks the rebuilt Notebook table, Python example, CMU notes, Inclusive code, MIT transcriptions, CFlow reference 54 and ParamMacros list/footnote repairs. Coverage and rendering checks establish preservation; selected semantic checks do not constitute exhaustive proofreading or accessibility certification.

The later [PDF/UA phase](../pdf-accessibility-review/2026-10-05/pdfua/summary.json) resolved the four code-spacing flags above, classified pagination artifacts and supplied ordered-list numbering attributes. Current archives and downloads match those PDF hashes. Seventy-three PDFs pass the automated PDF/UA-1 profile. On October 5, 2026, the user accepted Myers 2013 as the one font/PDF-UA exception to preserve appearance; its PDF remains unchanged without a font candidate or conformance declaration. Three [fresh Firefox reader-interface samples](../pdf-accessibility-review/2026-10-05/pdfua/at/README.md) check current PDF table and reading-order behavior. Earlier reading-order and September reports remain historical records of their specified file versions.

## Publications

| Publication | PDF pages | Markdown |
|---|---:|---|
| "Don't Step on My Toes": Resolving Editing Conflicts in Real-Time Collaboration in Computational Notebooks | 6 | [Open](publications/wang-dont-step-on-my-toes-ideworkshop2024.md) |
| A Hybrid Crowd-Machine Workflow for Program Synthesis | 8 | [Open](publications/chen-hybrid-crowd-machine-workflow-vlhcc2020.md) |
| Accessibility of UI Frameworks and Libraries for Programmers with Visual Impairments | 10 | [Open](publications/pandey-accessibility-ui-frameworks-vlhcc2022.md) |
| Adasa: A Conversational In-Vehicle Digital Assistant for Advanced Driver Assistance Features | 12 | [Open](publications/lin-adasa-uist2018.md) |
| Arboretum and Arbility: Improving Web Accessibility Through a Shared Browsing Architecture | 13 | [Open](publications/oney-arboretum-and-arbility-uist2018.md) |
| Attention Patterns for Code Animations: Using Eye Trackers to Evaluate Dynamic Code Presentation Techniques | 6 | [Open](publications/spinelli-attention-patterns-for-code-animations-px182018.md) |
| Callisto: Capturing the "Why" by Connecting Conversations with Computational Narratives | 13 | [Open](publications/wang-callisto-chi2020.md) |
| CFlow: Supporting Semantic Flow Analysis of Students' Code in Programming Problems at Scale | 12 | [Open](publications/zhang-cflow-ls2024.md) |
| Co-Advisor: Learning Programming Strategies in Context | 12 | [Open](publications/arab-co-advisor-vlhcc2025.md) |
| CoCapture: Effectively Communicating UI Behaviors on Existing Websites by Demonstrating and Remixing | 14 | [Open](publications/chen-cocapture-chi2021.md) |
| Codelets: Linking Interactive Documentation and Example Code in the Editor | 10 | [Open](publications/oney-codelets-chi2012.md) |
| CodeMend: Assisting Interactive Programming with Bimodal Embedding | 12 | [Open](publications/rong-codemend-uist2016.md) |
| Codeon: On-Demand Software Development Assistance | 12 | [Open](publications/chen-codeon-chi2017.md) |
| CodeStream: Augmenting Timelines with Code Annotation for Navigating Large Coding Histories | 16 | [Open](publications/zhang-codestream-chi2026.md) |
| Colaroid: A Literate Programming Approach for Authoring Explorable Multi-Stage Tutorials | 22 | [Open](publications/wang-colaroid-chi2023.md) |
| ConstraintJS: Programming Interactive Behaviors for the Web by Integrating Constraints and States | 10 | [Open](publications/oney-constraintjs-uist2012.md) |
| ConvoMap: Interactive Visualizations for Exploring Complex Conversations in Multi-Agent Systems | 12 | [Open](publications/zhang-convomap-vlhcc2025.md) |
| Creating Guided Code Explanations with chat.codes | 20 | [Open](publications/oney-creating-guided-code-cscw2018.md) |
| Creativity Support in Authoring and Backtracking | 4 | [Open](publications/myers-creativity-support-authoring-chi2013workshoponevaluationmethodsforcreativitysupportenvironments.md) |
| Democratizing Computational Tools for Interaction Designers | 2 | [Open](publications/oney-democratizing-computational-tools-vlhccgc2010.md) |
| Demonstration of CFlow: Supporting Semantic Flow Analysis of Students' Code in Programming Problems at Scale | 2 | [Open](publications/zhang-demonstration-of-cflow-lsdemos2024.md) |
| Development Tools for Interactive Behaviors | 4 | [Open](publications/oney-development-tools-interactive-iseuddc2011.md) |
| EDBooks: AI-Enhanced Interactive Narratives for Programming Education | 23 | [Open](publications/oney-edbooks-preprint2024.md) |
| EdCode: Towards Personalized Support at Scale for Remote Assistance in CS Education | 5 | [Open](publications/chen-edcode-vlhcc2020.md) |
| Editrail: Understanding AI Usage by Visualizing Student-AI Interaction in Code | 19 | [Open](publications/zhang-editrail-uist2026.md) |
| Empowering Designers with Creativity Support Tools | 2 | [Open](publications/oney-empowering-designers-creativity-vlhccgc2009.md) |
| Euclase: A Live Development Environment with Constraints and FSMs | 4 | [Open](publications/oney-euclase-live2013.md) |
| Expert Crowd Support Systems for Software Developers | 4 | [Open](publications/chen-expert-crowd-support-ci2016.md) |
| Explore, Create, Annotate: Designing Digital Drawing Tools with Visually Impaired People | 12 | [Open](publications/pandey-explore-create-annotate-chi2020.md) |
| Exploring the Tracking Needs and Practices of  Recreational Athletes. | 4 | [Open](publications/pandey-exploring-tracking-needs-pervasivehealth2019.md) |
| Expressing Interactivity with States and Constraints | 227 | [Open](publications/oney-expressing-interactivity-states-cmu2015.md) |
| Expresso: Building Responsive Interfaces with Keyframes | 9 | [Open](publications/krosnick-expresso-vlhcc2018.md) |
| FireCrystal: Understanding Interactive Behaviors in Dynamic Web Pages | 4 | [Open](publications/oney-firecrystal-vlhcc2009.md) |
| FlowMatic: An Immersive Authoring Tool for Creating Interactive Scenes in Virtual Reality | 12 | [Open](publications/zhang-flowmatic-uist2020.md) |
| How Data Scientists Use Computational Notebooks for Real-Time Collaboration | 30 | [Open](publications/wang-how-data-scientists-cscw2019.md) |
| How Pairing by Code Similarity Influences Discussions in Peer Learning | 6 | [Open](publications/xu-how-pairing-code-chilbw2023.md) |
| How to Support Designers in Getting Hold of the Immaterial Material of Software | 10 | [Open](publications/ozenc-how-support-designers-chi2010.md) |
| Implementing Multi-Touch Gestures with Touch Groups and Cross Events | 12 | [Open](publications/oney-implementing-multi-touch-gestures-chi2019.md) |
| Improving Advising Relationships Between PhD Students and Faculty in Human-Computer Interaction | 4 | [Open](publications/im-improving-advising-relationships-chiea2024.md) |
| Improving Crowd-Supported GUI Testing with Structural Guidance | 13 | [Open](publications/chen-improving-crowd-supported-gui-chi2020.md) |
| Inferring Method Specifications from Natural Language API Descriptions | 11 | [Open](publications/pandita-inferring-method-specifications-icse2012.md) |
| InterState: A Language and Environment for Expressing Interface Behavior | 10 | [Open](publications/oney-interstate-uist2014.md) |
| Making End User Development More Natural | 22 | [Open](publications/myers-making-end-user-eud2017.md) |
| Multi-Click: Cross-Tab Web Automation via Action Generalization | 10 | [Open](publications/zhang-multi-click-uist2025.md) |
| Natural Language Search of Structured Documents | 48 | [Open](publications/oney-natural-language-search-mit2008.md) |
| Navigating Complexity: How Context Shapes Debugging Strategy Choices Among Expert Developers | 18 | [Open](publications/arab-navigating-complexity-tse2026.md) |
| On-Demand Collaboration in Programming | 4 | [Open](publications/chen-on-demand-collaboration-programming-msnfws2020.md) |
| ParamMacros: Creating UI Automation Leveraging End-User Natural Language Parameterization | 10 | [Open](publications/krosnick-parammacros-vlhcc2022.md) |
| Playbook: Revision Control & Comparison for Interactive Mockups | 6 | [Open](publications/oney-playbook-iseud2011.md) |
| Promises and Pitfalls of Using LLMs for Scraping Web UIs | 4 | [Open](publications/krosnick-promises-pitfalls-llms-chi2023compui.md) |
| PuzzleMe: Leveraging Peer Assessment for In-Class Programming Exercises | 24 | [Open](publications/wang-puzzleme-cscw2021.md) |
| Redesigning Notebooks for Data Science Education | 4 | [Open](publications/wang-redesigning-notebooks-data-husdat2019.md) |
| RunEx: Augmenting Regular-Expression Code Search with Runtime Values | 9 | [Open](publications/zhang-runex-vlhcc2023.md) |
| ScrapeViz: Hierarchical Representations for Web Scraping Macros | 6 | [Open](publications/krosnick-scrapeviz-vlhcc2024.md) |
| Sifter: A Hybrid Workflow for Theme-based Video Curation at Scale | 9 | [Open](publications/chen-sifter-imx2020.md) |
| Simulating Human Cursor Trajectories for Path-Sensitive GUI Evaluation | 5 | [Open](publications/zhou-simulating-human-cursor-chiposters2026.md) |
| SPARK: Real-Time Monitoring of Multi-Faceted Programming Exercises | 12 | [Open](publications/yang-spark-vlhcc2025.md) |
| Studying the Benefits and Challenges of Immersive Dataflow Programming | 5 | [Open](publications/zhang-studying-benefits-challenges-vlhcc2019.md) |
| Think-Aloud Computing: Supporting Rich and Low-Effort Knowledge Capture | 13 | [Open](publications/krosnick-think-aloud-computing-chi2021.md) |
| Toward Providing Live Feedback in Web Automation IDEs | 6 | [Open](publications/krosnick-providing-live-feedback-live2020.md) |
| Towards Inclusive Source Code Readability Based on the Preferences of Programmers with Visual Impairments | 17 | [Open](publications/pandey-inclusive-source-code-chi2024.md) |
| Towards Providing On-Demand Expert Support for Software Developers | 13 | [Open](publications/chen-providing-on-demand-expert-chi2016.md) |
| UI Development Experiences of Programmers with Visual Impairments in Product Teams | 13 | [Open](publications/pandey-ui-development-experiences-edi2024.md) |
| Understanding Accessibility and Collaboration in Programming for People with Visual Impairments | 30 | [Open](publications/pandey-understanding-accessibility-collaboration-cscw2021.md) |
| Understanding And Guiding Student-AI Interaction In Future Programming Education | 4 | [Open](publications/zhang-understanding-guiding-student-ai-chi2025aeai.md) |
| Understanding Challenges and Needs of Using AI in Web Automation Systems | 10 | [Open](publications/zhang-understanding-challenges-needs-chi2025compui.md) |
| Understanding the Challenges and Needs of Programmers Writing Web Automation Scripts | 12 | [Open](publications/krosnick-understanding-challenges-needs-vlhcc2021.md) |
| Visions for Euclase: Ideas for Supporting Creativity through Better Prototyping of Behaviors | 4 | [Open](publications/oney-visions-for-euclase-workshoponcomputationalcreativitychi2009.md) |
| VizCode: A Practical Real-time Tool for In-Class Computer Programming Tutoring | 3 | [Open](publications/yang-vizcode-lsdemos2024.md) |
| VizProg: Identifying Misunderstandings by Visualizing Students' Coding Progress | 16 | [Open](publications/zhang-vizprog-chi2023.md) |
| VRCopilot: Authoring 3D Layouts with Generative Models in VR | 13 | [Open](publications/zhang-vrcopilot-uist2024.md) |
| VRGit: A Version Control System for Collaborative Content Creation in Virtual Reality | 14 | [Open](publications/zhang-vrgit-chi2023.md) |
| What Makes a Well-Documented Notebook? A Case Study of Data Scientists’ Documentation Practices in Kaggle | 7 | [Open](publications/wang-what-makes-well-documented-chiea2021.md) |
| ZoomBoard: A Diminutive QWERTY Soft Keyboard Using Iterative Zooming for Ultra-Small Devices | 4 | [Open](publications/oney-zoomboard-chi2013.md) |

## Files and regeneration

- `publications/`: the 74 Markdown documents.
- `figures/`: source crops with descriptions in the Markdown.
- `source-tags/`: compressed, hash-bound source tag trees and metadata.
- `review/`, `manifest.json` and `verification.json`: per-file provenance and checks.
- `reviewed-*.json`: source-checked transcription, layout and word-wrap decisions.

To regenerate the drafts from the archived tags and the matching PDFs in this repository, install the versions in `requirements.txt` in a Python environment and run:

```bash
python script/publication-markdown/convert.py
```

Pass one or more PDF stems to regenerate selected documents. `prepare_sources.py` is only needed when refreshing the archived inputs from a new, complete tag-inspection index. Both source preparation and conversion check PDF hashes. A downloaded bundle can be read on its own; regeneration uses the repository PDFs.

These files remain the local conversion sources. The site serves separate downloadable copies in `assets/markdown/`, linked only from individual paper pages through their `markdown` and `markdown_bundle` fields in `_data/publications.yaml`. Refresh those copies after regenerating a conversion and its manifest:

```bash
python script/publication-markdown/export_downloads.py
```

The exporter verifies source hashes and copies the Markdown and referenced images. For the single-file download, it replaces image destinations with absolute URLs from `_config.yml`; viewing those figures requires an internet connection. The ZIP keeps local image paths and includes the referenced images for offline reading. The original drafts also retain local image paths. Conversion reports and archived tags stay here, excluded from the site. `verification.json` describes the current conversion; the October review records current download and browser checks, while the September review-evidence files remain historical.

To check rendered Markdown after regeneration:

```bash
bundle exec ruby script/publication-markdown/render_check.rb /tmp/spot-publication-markdown-rendered
python script/publication-markdown/verify.py --rendered /tmp/spot-publication-markdown-rendered
```
