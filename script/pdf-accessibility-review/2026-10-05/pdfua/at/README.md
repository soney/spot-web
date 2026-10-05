# Fresh Firefox accessibility-interface checks

Three fresh Firefox 156.0.1 PDF.js sessions read the final PDF/UA-repaired files on October 5, 2026. Each used a separate D-Bus session, virtual X display, and temporary browser profile and configuration. The user's browser/profile was not accessed. `results.json` and the compressed accessible-document captures bind these observations to the exact current PDF hashes.

All three samples pass:

- Notebook Table 1: all 40 cell texts, 13 header roles, and 27 data-cell row/column header relationships match the source-reviewed expectations. Table 2 remains 14 rows by 4 columns.
- Promises/Pitfalls: the setup paragraph precedes the Python `first_name`/`last_name` example, followed by Section 5.
- FireCrystal: the sentence at the bottom of page 1 continues at the start of page 2 before Figure 1. Firefox retains separate page landmarks and word-bearing objects.

These are actual reader-interface observations, not text extraction. They do not establish continuous screen-reader speech or whole-corpus accessibility. Continuous Orca playback was not rerun; the earlier audio-backend limitation remains documented in the historical [reading-order AT report](../../reading-order/repairs/group2/at/results.json).

Recheck the recorded evidence against the current PDFs:

```bash
python script/pdf-accessibility-review/2026-10-05/pdfua/at/verify_at.py
```

To capture fresh evidence, set `AT_CHECK_DIR` to a new temporary directory and run `run_at.py` separately with `notebook`, `code`, and `crosspage` under `dbus-run-session`. The local D-Bus and X sockets require execution outside the restricted sandbox. Then run `verify_at.py --captures <directory>` and `package_evidence.py <directory>`. The latter replaces these dated captures only after all sample assertions pass and binds them to the unchanged PDFs just read.
