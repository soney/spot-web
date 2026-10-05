# Reading-order findings before repair — October 5, 2026

**Historical findings:** this focused pass identified concerns in **68 of 74 PDFs**, with **141 recorded examples**. These findings prompted the [completed reading-order repairs](repairs/README.md). The records and hashes below describe the copies before those repairs. Six had no disruptive issue identified within this review’s limits; that was not certification of those six.

These findings supplement the earlier structure/figure review. Structurally valid tags, correct alternative descriptions and complete content coverage do not establish a coherent reading sequence. The finding reports were recorded before changing the PDFs. Keep their hashes and examples as the repair baseline; use the repair record and current October manifest for the resulting files.

## Problems identified before repair

- Floats at page or column boundaries often occur between two parts of the same sentence. Their figure descriptions, captions or tables are read before the sentence finishes. Copyright notices, footnotes and running headers cause similar interruptions. A figure between complete paragraphs is not automatically a problem and was not counted on that basis alone.
- Some content is internally reordered. In *Understanding Accessibility and Collaboration* (CSCW 2021), p. 4, node `843:0` reads numbered tenets 2 and 3 before the paragraph's introduction and tenet 1.
- Some examples or sections are misplaced. *Promises and Pitfalls of Using LLMs*, p. 2, reads the following section before the Python example introduced by the previous paragraph. VRGit p. 7 places section 3.4 before the previous paragraph's final lines.
- Some table tags follow physical text lines rather than logical cells. *What Makes a Well-Documented Notebook*, p. 5, Table 1 mixes description and example text from neighboring columns and assigns incorrect header relationships.
- Other cases include interleaved author columns, detached note markers, inline callout icons separated from the phrases they label, and math symbols in drawing order.

These are native semantic/content-order repairs that can preserve the original printed appearance. The subsequent repair pass aimed to keep each sentence and code example coherent, put figures and captions at suitable paragraph boundaries, associate notes with their references, remove repeated page furniture from the body sequence where appropriate, and reconstruct the affected logical table cells. It included fresh native-order and assistive-technology checks, plus renewed appearance comparisons and synchronized Markdown exports.

Markdown inherits much of the source order. Existing conversion joins fix some specific cases, but successful rendering, complete text preservation and working offline images do not establish coherent flow in every Markdown download either.

## Evidence and coverage

All 74 pre-repair PDF hashes were checked against the archived native tag trees. Review streams follow native child order, honor ActualText and figure/formula alternatives, and apply none of the Markdown converter's order repairs. [Extraction coverage](stream-coverage.json) accounts for every native textual content reference across all 1,028 pages. That is a coverage check, not a claim that every character was manually reviewed.

Reviewers examined document/block sequences and page/column continuations, then inspected full native operations and selected rendered pages for suspicious cases. The CMU thesis received targeted checks of chapter/appendix flow, headers and footnote/code transitions; its 227 pages were not manually reread line by line. Other per-file/group limits are explicit in the reports. Examples establish actual concerns but are not an exhaustive repair inventory. No new screen-reader playback or user study was performed in this follow-up.

- [Group 0 — 8 PDFs / 258 pages](group-0-review.json)
- [Group 1 — 21 PDFs / 257 pages](group-1-review.json)
- [Group 2 — 22 PDFs / 256 pages](group-2-review.json)
- [Group 3 — 23 PDFs / 257 pages](group-3-review.json)
- [Machine-readable findings and pre-repair PDF hashes](summary.json)

The original native streams, extraction helper and rendered evidence pages are retained in the local `pdf-reading-order-october-followup` artifact folder. This directory keeps the compact review records; the current source-tag archives contain the repaired order.

## Per-publication result before repair

“None identified” means no disruptive sequence was found in this focused review, not fully verified or accessible. The linked group report gives exact node IDs, excerpts, impact, suggested order and limits.

| Publication | Result | Recorded examples | Evidence |
| --- | --- | ---: | --- |
| ["Don't Step on My Toes": Resolving Editing Conflicts in Real-Time Collaboration in Computational Notebooks](../../../../assets/pdfs/wang-dont-step-on-my-toes-ideworkshop2024.pdf) | Needs work | 2 | [Review](group-2-review.json) |
| [A Hybrid Crowd-Machine Workflow for Program Synthesis](../../../../assets/pdfs/chen-hybrid-crowd-machine-workflow-vlhcc2020.pdf) | Needs work | 3 | [Review](group-1-review.json) |
| [Accessibility of UI Frameworks and Libraries for Programmers with Visual Impairments](../../../../assets/pdfs/pandey-accessibility-ui-frameworks-vlhcc2022.pdf) | Needs work | 1 | [Review](group-3-review.json) |
| [Adasa: A Conversational In-Vehicle Digital Assistant for Advanced Driver Assistance Features](../../../../assets/pdfs/lin-adasa-uist2018.pdf) | Needs work | 2 | [Review](group-1-review.json) |
| [Arboretum and Arbility: Improving Web Accessibility Through a Shared Browsing Architecture](../../../../assets/pdfs/oney-arboretum-and-arbility-uist2018.pdf) | Needs work | 2 | [Review](group-3-review.json) |
| [Attention Patterns for Code Animations: Using Eye Trackers to Evaluate Dynamic Code Presentation Techniques](../../../../assets/pdfs/spinelli-attention-patterns-for-code-animations-px182018.pdf) | Needs work | 4 | [Review](group-1-review.json) |
| [Callisto: Capturing the "Why" by Connecting Conversations with Computational Narratives](../../../../assets/pdfs/wang-callisto-chi2020.pdf) | Needs work | 1 | [Review](group-2-review.json) |
| [CFlow: Supporting Semantic Flow Analysis of Students' Code in Programming Problems at Scale](../../../../assets/pdfs/zhang-cflow-ls2024.pdf) | Needs work | 2 | [Review](group-3-review.json) |
| [Co-Advisor: Learning Programming Strategies in Context](../../../../assets/pdfs/arab-co-advisor-vlhcc2025.pdf) | Needs work | 4 | [Review](group-1-review.json) |
| [CoCapture: Effectively Communicating UI Behaviors on Existing Websites by Demonstrating and Remixing](../../../../assets/pdfs/chen-cocapture-chi2021.pdf) | Needs work | 3 | [Review](group-1-review.json) |
| [Codelets: Linking Interactive Documentation and Example Code in the Editor](../../../../assets/pdfs/oney-codelets-chi2012.pdf) | Needs work | 6 | [Review](group-1-review.json) |
| [CodeMend: Assisting Interactive Programming with Bimodal Embedding](../../../../assets/pdfs/rong-codemend-uist2016.pdf) | Needs work | 3 | [Review](group-1-review.json) |
| [Codeon: On-Demand Software Development Assistance](../../../../assets/pdfs/chen-codeon-chi2017.pdf) | Needs work | 1 | [Review](group-2-review.json) |
| [CodeStream: Augmenting Timelines with Code Annotation for Navigating Large Coding Histories](../../../../assets/pdfs/zhang-codestream-chi2026.pdf) | Needs work | 1 | [Review](group-2-review.json) |
| [Colaroid: A Literate Programming Approach for Authoring Explorable Multi-Stage Tutorials](../../../../assets/pdfs/wang-colaroid-chi2023.pdf) | Needs work | 3 | [Review](group-1-review.json) |
| [ConstraintJS: Programming Interactive Behaviors for the Web by Integrating Constraints and States](../../../../assets/pdfs/oney-constraintjs-uist2012.pdf) | Needs work | 2 | [Review](group-3-review.json) |
| [ConvoMap: Interactive Visualizations for Exploring Complex Conversations in Multi-Agent Systems](../../../../assets/pdfs/zhang-convomap-vlhcc2025.pdf) | Needs work | 3 | [Review](group-1-review.json) |
| [Creating Guided Code Explanations with chat.codes](../../../../assets/pdfs/oney-creating-guided-code-cscw2018.pdf) | Needs work | 1 | [Review](group-2-review.json) |
| [Creativity Support in Authoring and Backtracking](../../../../assets/pdfs/myers-creativity-support-authoring-chi2013workshoponevaluationmethodsforcreativitysupportenvironments.pdf) | None identified | 0 | [Review](group-1-review.json) |
| [Democratizing Computational Tools for Interaction Designers](../../../../assets/pdfs/oney-democratizing-computational-tools-vlhccgc2010.pdf) | None identified | 0 | [Review](group-0-review.json) |
| [Demonstration of CFlow: Supporting Semantic Flow Analysis of Students' Code in Programming Problems at Scale](../../../../assets/pdfs/zhang-demonstration-of-cflow-lsdemos2024.pdf) | Needs work | 1 | [Review](group-3-review.json) |
| [Development Tools for Interactive Behaviors](../../../../assets/pdfs/oney-development-tools-interactive-iseuddc2011.pdf) | Needs work | 1 | [Review](group-0-review.json) |
| [EDBooks: AI-Enhanced Interactive Narratives for Programming Education](../../../../assets/pdfs/oney-edbooks-preprint2024.pdf) | Needs work | 3 | [Review](group-3-review.json) |
| [EdCode: Towards Personalized Support at Scale for Remote Assistance in CS Education](../../../../assets/pdfs/chen-edcode-vlhcc2020.pdf) | Needs work | 3 | [Review](group-0-review.json) |
| [Editrail: Understanding AI Usage by Visualizing Student-AI Interaction in Code](../../../../assets/pdfs/zhang-editrail-uist2026.pdf) | Needs work | 3 | [Review](group-1-review.json) |
| [Empowering Designers with Creativity Support Tools](../../../../assets/pdfs/oney-empowering-designers-creativity-vlhccgc2009.pdf) | None identified | 0 | [Review](group-3-review.json) |
| [Euclase: A Live Development Environment with Constraints and FSMs](../../../../assets/pdfs/oney-euclase-live2013.pdf) | Needs work | 3 | [Review](group-3-review.json) |
| [Expert Crowd Support Systems for Software Developers](../../../../assets/pdfs/chen-expert-crowd-support-ci2016.pdf) | Needs work | 1 | [Review](group-1-review.json) |
| [Explore, Create, Annotate: Designing Digital Drawing Tools with Visually Impaired People](../../../../assets/pdfs/pandey-explore-create-annotate-chi2020.pdf) | Needs work | 2 | [Review](group-3-review.json) |
| [Exploring the Tracking Needs and Practices of  Recreational Athletes.](../../../../assets/pdfs/pandey-exploring-tracking-needs-pervasivehealth2019.pdf) | Needs work | 2 | [Review](group-3-review.json) |
| [Expressing Interactivity with States and Constraints](../../../../assets/pdfs/oney-expressing-interactivity-states-cmu2015.pdf) | Needs work | 4 | [Review](group-0-review.json) |
| [Expresso: Building Responsive Interfaces with Keyframes](../../../../assets/pdfs/krosnick-expresso-vlhcc2018.pdf) | Needs work | 4 | [Review](group-1-review.json) |
| [FireCrystal: Understanding Interactive Behaviors in Dynamic Web Pages](../../../../assets/pdfs/oney-firecrystal-vlhcc2009.pdf) | Needs work | 1 | [Review](group-2-review.json) |
| [FlowMatic: An Immersive Authoring Tool for Creating Interactive Scenes in Virtual Reality](../../../../assets/pdfs/zhang-flowmatic-uist2020.pdf) | Needs work | 1 | [Review](group-2-review.json) |
| [How Data Scientists Use Computational Notebooks for Real-Time Collaboration](../../../../assets/pdfs/wang-how-data-scientists-cscw2019.pdf) | Needs work | 1 | [Review](group-2-review.json) |
| [How Pairing by Code Similarity Influences Discussions in Peer Learning](../../../../assets/pdfs/xu-how-pairing-code-chilbw2023.pdf) | Needs work | 3 | [Review](group-0-review.json) |
| [How to Support Designers in Getting Hold of the Immaterial Material of Software](../../../../assets/pdfs/ozenc-how-support-designers-chi2010.pdf) | Needs work | 2 | [Review](group-1-review.json) |
| [Implementing Multi-Touch Gestures with Touch Groups and Cross Events](../../../../assets/pdfs/oney-implementing-multi-touch-gestures-chi2019.pdf) | Needs work | 1 | [Review](group-2-review.json) |
| [Improving Advising Relationships Between PhD Students and Faculty in Human-Computer Interaction](../../../../assets/pdfs/im-improving-advising-relationships-chiea2024.pdf) | Needs work | 2 | [Review](group-3-review.json) |
| [Improving Crowd-Supported GUI Testing with Structural Guidance](../../../../assets/pdfs/chen-improving-crowd-supported-gui-chi2020.pdf) | Needs work | 1 | [Review](group-3-review.json) |
| [Inferring Method Specifications from Natural Language API Descriptions](../../../../assets/pdfs/pandita-inferring-method-specifications-icse2012.pdf) | Needs work | 2 | [Review](group-3-review.json) |
| [InterState: A Language and Environment for Expressing Interface Behavior](../../../../assets/pdfs/oney-interstate-uist2014.pdf) | Needs work | 1 | [Review](group-2-review.json) |
| [Making End User Development More Natural](../../../../assets/pdfs/myers-making-end-user-eud2017.pdf) | Needs work | 2 | [Review](group-3-review.json) |
| [Multi-Click: Cross-Tab Web Automation via Action Generalization](../../../../assets/pdfs/zhang-multi-click-uist2025.pdf) | Needs work | 1 | [Review](group-2-review.json) |
| [Natural Language Search of Structured Documents](../../../../assets/pdfs/oney-natural-language-search-mit2008.pdf) | Needs work | 4 | [Review](group-1-review.json) |
| [Navigating Complexity: How Context Shapes Debugging Strategy Choices Among Expert Developers](../../../../assets/pdfs/arab-navigating-complexity-tse2026.pdf) | Needs work | 1 | [Review](group-2-review.json) |
| [On-Demand Collaboration in Programming](../../../../assets/pdfs/chen-on-demand-collaboration-programming-msnfws2020.pdf) | Needs work | 1 | [Review](group-0-review.json) |
| [ParamMacros: Creating UI Automation Leveraging End-User Natural Language Parameterization](../../../../assets/pdfs/krosnick-parammacros-vlhcc2022.pdf) | Needs work | 1 | [Review](group-2-review.json) |
| [Playbook: Revision Control & Comparison for Interactive Mockups](../../../../assets/pdfs/oney-playbook-iseud2011.pdf) | Minor marker ordering | 1 | [Review](group-3-review.json) |
| [Promises and Pitfalls of Using LLMs for Scraping Web UIs](../../../../assets/pdfs/krosnick-promises-pitfalls-llms-chi2023compui.pdf) | Needs work | 2 | [Review](group-2-review.json) |
| [PuzzleMe: Leveraging Peer Assessment for In-Class Programming Exercises](../../../../assets/pdfs/wang-puzzleme-cscw2021.pdf) | Needs work | 1 | [Review](group-2-review.json) |
| [Redesigning Notebooks for Data Science Education](../../../../assets/pdfs/wang-redesigning-notebooks-data-husdat2019.pdf) | Needs work | 2 | [Review](group-2-review.json) |
| [RunEx: Augmenting Regular-Expression Code Search with Runtime Values](../../../../assets/pdfs/zhang-runex-vlhcc2023.pdf) | Needs work | 2 | [Review](group-3-review.json) |
| [ScrapeViz: Hierarchical Representations for Web Scraping Macros](../../../../assets/pdfs/krosnick-scrapeviz-vlhcc2024.pdf) | Needs work | 2 | [Review](group-0-review.json) |
| [Sifter: A Hybrid Workflow for Theme-based Video Curation at Scale](../../../../assets/pdfs/chen-sifter-imx2020.pdf) | Needs work | 2 | [Review](group-3-review.json) |
| [Simulating Human Cursor Trajectories for Path-Sensitive GUI Evaluation](../../../../assets/pdfs/zhou-simulating-human-cursor-chiposters2026.pdf) | Needs work | 4 | [Review](group-1-review.json) |
| [SPARK: Real-Time Monitoring of Multi-Faceted Programming Exercises](../../../../assets/pdfs/yang-spark-vlhcc2025.pdf) | Needs work | 1 | [Review](group-2-review.json) |
| [Studying the Benefits and Challenges of Immersive Dataflow Programming](../../../../assets/pdfs/zhang-studying-benefits-challenges-vlhcc2019.pdf) | Needs work | 2 | [Review](group-3-review.json) |
| [Think-Aloud Computing: Supporting Rich and Low-Effort Knowledge Capture](../../../../assets/pdfs/krosnick-think-aloud-computing-chi2021.pdf) | Needs work | 1 | [Review](group-2-review.json) |
| [Toward Providing Live Feedback in Web Automation IDEs](../../../../assets/pdfs/krosnick-providing-live-feedback-live2020.pdf) | Needs work | 1 | [Review](group-2-review.json) |
| [Towards Inclusive Source Code Readability Based on the Preferences of Programmers with Visual Impairments](../../../../assets/pdfs/pandey-inclusive-source-code-chi2024.pdf) | Needs work | 3 | [Review](group-3-review.json) |
| [Towards Providing On-Demand Expert Support for Software Developers](../../../../assets/pdfs/chen-providing-on-demand-expert-chi2016.pdf) | Needs work | 1 | [Review](group-1-review.json) |
| [UI Development Experiences of Programmers with Visual Impairments in Product Teams](../../../../assets/pdfs/pandey-ui-development-experiences-edi2024.pdf) | None identified | 0 | [Review](group-1-review.json) |
| [Understanding Accessibility and Collaboration in Programming for People with Visual Impairments](../../../../assets/pdfs/pandey-understanding-accessibility-collaboration-cscw2021.pdf) | Needs work | 2 | [Review](group-3-review.json) |
| [Understanding And Guiding Student-AI Interaction In Future Programming Education](../../../../assets/pdfs/zhang-understanding-guiding-student-ai-chi2025aeai.pdf) | Needs work | 3 | [Review](group-1-review.json) |
| [Understanding Challenges and Needs of Using AI in Web Automation Systems](../../../../assets/pdfs/zhang-understanding-challenges-needs-chi2025compui.pdf) | Needs work | 1 | [Review](group-2-review.json) |
| [Understanding the Challenges and Needs of Programmers Writing Web Automation Scripts](../../../../assets/pdfs/krosnick-understanding-challenges-needs-vlhcc2021.pdf) | None identified | 0 | [Review](group-3-review.json) |
| [Visions for Euclase: Ideas for Supporting Creativity through Better Prototyping of Behaviors](../../../../assets/pdfs/oney-visions-for-euclase-workshoponcomputationalcreativitychi2009.pdf) | None identified | 0 | [Review](group-1-review.json) |
| [VizCode: A Practical Real-time Tool for In-Class Computer Programming Tutoring](../../../../assets/pdfs/yang-vizcode-lsdemos2024.pdf) | Needs work | 1 | [Review](group-2-review.json) |
| [VizProg: Identifying Misunderstandings by Visualizing Students' Coding Progress](../../../../assets/pdfs/zhang-vizprog-chi2023.pdf) | Needs work | 3 | [Review](group-1-review.json) |
| [VRCopilot: Authoring 3D Layouts with Generative Models in VR](../../../../assets/pdfs/zhang-vrcopilot-uist2024.pdf) | Needs work | 2 | [Review](group-3-review.json) |
| [VRGit: A Version Control System for Collaborative Content Creation in Virtual Reality](../../../../assets/pdfs/zhang-vrgit-chi2023.pdf) | Needs work | 2 | [Review](group-3-review.json) |
| [What Makes a Well-Documented Notebook? A Case Study of Data Scientists’ Documentation Practices in Kaggle](../../../../assets/pdfs/wang-what-makes-well-documented-chiea2021.pdf) | Needs work | 3 | [Review](group-2-review.json) |
| [ZoomBoard: A Diminutive QWERTY Soft Keyboard Using Iterative Zooming for Ultra-Small Devices](../../../../assets/pdfs/oney-zoomboard-chi2013.pdf) | Needs work | 3 | [Review](group-0-review.json) |
