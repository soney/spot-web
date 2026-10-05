# Group 2 reading-order repairs

This directory records the historical reading-order phase. Later PDF/UA changes
altered the PDF hashes; the [current summary](../../../pdfua/summary.json) and
[fresh reader-interface checks](../../../pdfua/at/README.md) supersede this
phase's file inventory and captures. The repair evidence below remains bound
to its recorded intermediate files.

`report.json` summarizes the 22 assigned PDFs (256 pages), their final hashes,
changes, and validation. `detailed-changes.json.gz` preserves the explicit node
changes and before/after sequence evidence. It also references the final PuzzleMe
footnote repair recorded by group 3. Every page retained identical rendered
pixels at 144 DPI; original drawing operators and annotations were accounted for.

`role-fixes/` records the final list-role corrections in Sifter, ConstraintJS,
and Multi-touch. Their 31 pages were checked again at 144 DPI, and every existing
stream retained identical decoded bytes. Content and annotation order and
flattened reading text were unchanged. That phase's veraPDF reports showed that
the new list-role errors were resolved; missing PDF/UA identification remained
until the later PDF/UA phase. `apply-role-fixes.py` is the exact historical repair script and depends
on the temporary shared editor and original pre-repair files; it is evidence,
not an idempotent maintenance command.

## Historical reader checks

`at/results.json` records Firefox 156.0.1's live AT-SPI objects for three
PDF samples at this phase's close. Each compressed tree contains the PDF document subtree, its file
name, and its exact PDF hash. The independent assertions check:

- Notebook Table 1: all 40 cell texts, 13 header roles, and the row and column
  header associations reported for all 27 data cells. Table 2 exposes 14×4 cells.
- Promises/Pitfalls: the introductory paragraph precedes the Python example,
  which precedes Section 5 in the actual accessible tree.
- FireCrystal: the paragraph continues from page 1 to page 2 before Figure 1.
  Firefox retains separate page landmarks; the two word-bearing accessible
  objects preserve the `through` / `code` boundary.

The first live Notebook check found words joined across physical line MCIDs.
All 40 cells received source-verified ActualText, preserving the page's pixels;
the stored final tree passes exact-text and header assertions.

Orca 50.2 recognized the PDF and generated title and heading utterances, captured
in `at/orca-generated-speech.txt`. The isolated speech backend failed audio
initialization, preventing a reliable continuous SayAll run. This is a partial
speech attempt, not a completed speech test, and these three reader samples do
not certify the entire corpus or other reading software.

The historical verifier expects those earlier PDF hashes and therefore does not
verify the current files. Use the fresh evidence and verifier instead:

```bash
python3 script/pdf-accessibility-review/2026-10-05/pdfua/at/verify_at.py
```

The following documents the historical capture setup. For current captures,
follow the [current AT instructions](../../../pdfua/at/README.md). This setup used Xvfb, DBus,
`/usr/bin/python3` with GI Atspi, and the actual Firefox binary configured in
`at/run_at.py`. The script uses private XDG directories and a temporary browser
profile, and never accesses the user's desktop or browser profile. The displays
179–181 must be free. A sandbox may require escalation to create the isolated
local DBus/display sockets.

```bash
export AT_CHECK_DIR="$(mktemp -d /tmp/spot-at-check-XXXXXX)"
for sample in notebook code crosspage; do
  dbus-run-session -- /usr/bin/python3 script/pdf-accessibility-review/2026-10-05/reading-order/repairs/group2/at/run_at.py "$sample"
done
python3 script/pdf-accessibility-review/2026-10-05/reading-order/repairs/group2/at/verify_at.py --captures "$AT_CHECK_DIR"
```

The optional `--orca` capture flag reproduces the partial speech attempt using
`orca_helpers.py`; it is not needed for the AT-SPI assertions. Fresh capture logs
stay in the temporary directory. The repository stores no PDF or image copies
in this evidence directory.
