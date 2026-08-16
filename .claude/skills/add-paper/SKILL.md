---
name: add-paper
description: Wire a paper into the site — rename its PDF to the repo convention, add the publications.yaml record, reuse the right venue and author ids, and verify the build. Use when a new paper PDF has landed in assets/pdfs/, when a record needs its `pdf:` field, or when the pdf_audit hook reports a file no record references.
---

# Adding a paper

Everything here is a YAML edit in `_data/` plus one file rename. You never write
an HTML file and never restart the dev server. `README.md` ("Adding a paper")
is the long form; this is the order of operations plus the checks.

**The reason this is a skill and not a one-liner: almost every mistake in this
repo builds cleanly and renders wrongly.** A missing author id prints the raw
id where a name goes. A `pdf:` with the wrong prefix renders a button that
404s. A second person record for someone already listed silently splits their
publication list. None of these fail the build.

## 1. Read the paper for its metadata

Open the PDF and take the title, the full author list in order, and the venue.
Do not infer the author list from the filename or from a sibling record.

## 2. Resolve the venue — reuse before you create

```bash
grep -n "^- id:" _data/venues.yaml
```

Venue ids are `<venue>_<year>` (`uist_2026`, `chi_2026`, `vl_hcc_2024`,
`chi_posters_2026`). If it exists, reference the id and move on.

If you must add one: `year` must be an **unquoted integer** (a quoted year
fails the build with a Liquid error naming neither the file nor the venue), and
`type` must be one of the ten in `_data/publication_types.yaml`. An
unrecognized `type` is accepted silently and drops the paper out of every
publication list including the CV, leaving only its `/papers/<id>/` page.

## 3. Resolve every author — reuse is mandatory

```bash
grep -n -i "<family-name>" _data/people.yaml
```

Search for each co-author by family name **before** adding anyone. Most records
are external collaborators with no `membership`. Minting a second id for
someone already listed splits their work across two identities and nothing
warns you. A new external co-author needs only `id`, `given_name`,
`family_name`, and optionally `homepage`.

## 4. Write the record

Add it at the **top** of `_data/publications.yaml` (the file is newest-first).
Leave `pdf:` off for now — step 5 fills it in.

Required: `id`, `title`, `authors`, `venue`. The `id` convention is the
lowercase title, punctuation stripped, spaces as underscores, suffixed with the
venue year. Add `student_authors` (a subset of `authors`, CV-only), `abstract`,
and `doi` when you have them.

## 5. Name and move the PDF

The filename is derived, not invented. Ask the script:

```bash
ruby script/pdf_audit.rb --name <publication-id>
```

That prints `<surname>-<short-title>-<venue><year>.pdf` — first author's
surname, the system name before the title's colon (or the first three
meaningful words when there is no colon), and the venue short name plus year.
It reproduces all 73 existing filenames, so trust it over your own guess.

Move the file with `git mv` when it is already tracked, then add the reference:

```yaml
  pdf: pdfs/<the-name-the-script-printed>.pdf
```

**Relative to `assets/`, with no leading slash.** `pdf: /assets/pdfs/foo.pdf`
and `pdf: assets/pdfs/foo.pdf` both render a button that 404s, with no build
error — the template builds the URL as `/assets/` + `pdf`.

## 6. Optionally announce it

A new paper usually wants a `_data/news.yaml` entry, and sometimes a
`_data/clusters.yaml` id. Both reference the publication by its `id`.

## 7. Verify — the build succeeding is not the check

```bash
bundle exec jekyll build
ruby script/pdf_audit.rb
```

`bundle exec` matters: `.bundle/config` points `BUNDLE_PATH` at
`vendor/bundle`, so a bare `jekyll` finds the wrong gems. Read the build output
for `DataPageGenerator` warnings (duplicate ids). The audit must come back
clean — it is what catches a `pdf:` typo, since a wrong path is not a build
error.

Then confirm the rendered result, not just the YAML:

- `_site/papers/<id>/index.html` exists and the PDF href is
  `/assets/pdfs/<file>.pdf`
- every author renders as a name, not as a raw id
- the file landed in `_site/assets/pdfs/`

For anything beyond a new record — a template or plugin touch — diff `_site`
before and after instead (recipe in `AGENTS.md`); Liquid fails soft, so that is
the only reliable check that a refactor changed nothing.

Serve with `npm run develop` at `http://127.0.0.1:4000` for a real browser
check. The CV's student underlines and paper awards are off by default:
`/people/steve_oney/cv/?students=true&awards=true`.

**Do not commit or push unless asked** — a push to `main` deploys the live site.
