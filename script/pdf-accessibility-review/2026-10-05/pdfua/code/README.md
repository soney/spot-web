# Source review of four code regions

All four previously reported code warnings were reviewed against the printed pages on October 5, 2026. Two needed native Code ActualText repairs; the two CMU thesis snippets were cleared as correct. `review.json` records exact reviewed text, reasons, and before/after PDF hashes. `validation.json` records passing native/archive synchronization and structural checks for both repaired candidates. Every page in both PDFs (21 total) remained pixel-identical at 144 dpi with MuPDF.

InterState page 8 (node 389:0) now represents the printed subscripts at their correct positions with explicit underscore notation. Inferring Method Specifications page 6 (node 377:0) now attaches primes to their variables, preserves the 29 numbered lines and indentation, and retains the source spelling `root! ==`. The printed `exception_name` underscore is restored.

The CMU thesis page 169 (node 4241:0) and page 216 (node 6315:0) each mix prose and code fonts on one line. Their character pitch is not uniform, but their existing text, order, and punctuation exactly match the printed source. Neither has multiline indentation to recover. The malformed HTML example printed on page 169 is retained rather than editorially corrected.

`repair_code.py` is the exact session candidate-generation script, retained as evidence. Its temporary paths and dependency on the session editor are intentional; it is not a general maintenance command and should not be rerun against later PDF revisions. Subsequent PDF/UA metadata revisions can change PDF hashes while preserving this source review; the enclosing PDF/UA report records those transitions.
