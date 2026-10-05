# PDF/UA-1 declaration review

The requested formal repairs can proceed without requiring a continuous listening session over every document. The prior corpus review covers page layout, figure/formula alternatives, semantic structure and targeted reading-order repair; fresh reader-interface checks cover selected difficult cases. This is a documented engineering review, not independent accessibility certification.

The [PDF Association's PDF/UA guide](https://pdfa.org/wp-content/uploads/2013/08/PDFUA-in-a-Nutshell-PDFUA.pdf) distinguishes programmatic checks from semantic review and recommends additional assistive-technology testing on at least a random sample of documents. It does not prescribe continuous listening to every page. [veraPDF](https://verapdf.org/home/) describes its PDF/UA coverage as machine checks, so an automated pass alone must not be described as proving all semantic requirements.

For each file lacking the declaration, append one RDF description to the existing document XMP, retaining the existing packet and all unrelated elements:

```xml
<rdf:Description rdf:about="" xmlns:pdfuaid="http://www.aiim.org/pdfua/ns/id/">
  <pdfuaid:part>1</pdfuaid:part>
</rdf:Description>
```

Use the exact `pdfuaid` prefix and namespace. Do not add `pdfuaid:rev` for PDF/UA-1, invent amendment values, change document title/creator/publication dates, or drop existing PDF/A extension schemas. The [Tagged PDF Best Practice Guide, Annex A](https://pdfa.org/download-area/publications/Tagged-PDF-Best-Practice-Guide.pdf) gives the flag; the [identification-schema guidance](https://pdfa.org/future-proofing-xmp-identification-schema/) explains the prefix and version fields. Incremental metadata updates preserve page painting content.

A read-only XMP inventory of the 74 starting files found 72 without PDF/UA identification and two with part 1 already present (CodeStream and UI Development Experiences). Only UI Development Experiences declares PDF/A (2B); its existing PDF/UA property and PDF/A extension schema should stay untouched. Thirteen additional files contain PDF/A extension containers without declaring PDF/A; preserve those containers too. [The PDF Association's joint-conformance guidance](https://pdfa.org/download-area/publications/Conforming-to-both-PDFA-%26-PDFUA.pdf) explains the extension requirement for files that declare PDF/A-1, -2, or -3 alongside PDF/UA-1.

The manual-requirement cross-check found two concrete issues that automated passes had not resolved: previously artifacted running headers/footers lacked Pagination/Header/Footer classification, and decimal ordered lists lacked ListNumbering. The accompanying plan types only verified running furniture and unambiguous numbered lists while preserving text and existing attributes. These are [Matterhorn](https://pdfa.org/download-area/publications/Matterhorn-Protocol-1-1.pdf) requirements 18-001/18-002 and 16-001. Existing visual limitations and source editorial errors remain separately documented; there is no newly demonstrated semantic blocker beyond the specific repairs recorded in the current task.
