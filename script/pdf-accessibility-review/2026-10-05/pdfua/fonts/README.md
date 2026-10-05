# Myers 2013 font embedding candidates

On October 5, 2026, the user chose “commit with that one exception,” accepting
the original Myers PDF's four unembedded-font and missing-PDF/UA-identification
findings to preserve its appearance. Neither the Nimbus nor Tinos/Arimo
candidate is installed or published, and no PDF/UA declaration is added to
Myers. The accepted PDF remains unchanged at SHA-256
`5896c2425f702d93a96791e1c9a64f4d21ecb837f40ab81dff5cd4b297976222`.
The candidate evidence below is retained for reference; it is not the installed file.

The four original font resources are used by the document. Removing them would
lose text. Different PDF readers substitute different font programs, so embedding
one fixed set cannot retain both of the original tested renderings.

Two candidate font sets were embedded without changing any page-content stream,
page geometry, text, annotation, or native tag-tree object. All four pages were
compared at 144 DPI in MuPDF 1.28.2 and Poppler 26.01.0:

| Embedded programs | MuPDF original appearance | Poppler original appearance |
| --- | --- | --- |
| Tinos Regular/Bold/Italic and Arimo Bold | Changed font shapes | Pixel-identical on all four pages |
| Nimbus Roman Regular/Bold/Italic and Nimbus Sans Bold | Pixel-identical on all four pages | Changed font shapes |

The candidates retain the original text positions and widths. This is font
embedding, not outlining or rasterization. The Nimbus programs are the exact
unchanged CFF bytes used by MuPDF's original fallback rendering. Their names and
SHA-256 hashes are recorded in `nimbus-candidate-integrity.json`.

A supplemental page-1 check using the system LibreOffice PDFium library changed
with either candidate. That library is not the Chrome build; this check does not
establish how Chrome renders the final file. See `pdfium-check.json`.

`embedding-experiments.json` records the initial embedding experiments.
`final-candidate-verification.json` records candidates with matching font names
and temporary PDF/UA-1 identification metadata. Both pass all 106 automated
veraPDF 1.30.2 PDF/UA-1 rules; complete validator output is retained here. These
validator passes do not establish semantic accuracy or full accessibility.

`nimbus-candidate-integrity.json` describes the font-only candidate before any
PDF/UA identification is added. Only original objects 66–73, the four font
dictionaries and their descriptors, change. Four CFF streams and one incremental
cross-reference stream are appended. All existing object numbers, every other
original object and stream, XMP metadata, annotations, tag content, and extracted
text remain unchanged. The native structural validator and comparison against a
hash-rebound source-tag archive pass.

`embed_nimbus.py` reproduces the font-only operation using PyMuPDF 1.28.2. It is
bound to the reviewed source SHA-256 and writes a separate candidate. The script
is evidence of the operation, not part of the site build. The PDF/UA review's
final report records the user's accepted font/PDF-UA exception and the unchanged
original file. The user did not authorize an appearance-changing installation.

Font licensing and provenance are recorded in `font-provenance.json`. The
[URW license](https://github.com/ArtifexSoftware/urw-base35-fonts/blob/master/LICENSE)
explicitly permits embedding the Nimbus programs in PDF documents. The Tinos and
Arimo programs installed on the review machine carry SIL Open Font License 1.1 notices and unrestricted
embedding bits in their own font tables.
