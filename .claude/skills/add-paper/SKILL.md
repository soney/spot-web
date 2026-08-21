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

Do not invent a name from an email address or a filename. If you have only
`jtliang@cs.cmu.edu`, look the person up and confirm the full name before you
mint an id — a wrong `given_name` misnames a real person on every paper they
appear on. Follow the file's convention of dropping middle initials (Brad A.
Myers is stored as `Brad` / `Myers`).

## 4. Work out `student_authors` — always, not only when handed it

`student_authors` is a subset of `authors` naming everyone who was a **student
at the time of publication** (the CV underlines them, and includes the CV's own
subject if they were a student then). It is the one field that is easy to skip
and quietly wrong when skipped: leaving it off silently under-credits students,
and nothing warns.

So treat it as required work rather than as optional metadata. For each author,
establish status **as of the venue year**:

- **Group members** — read their `people.yaml` record. `short_bio` /
  `membership` say it outright: a `member` with "Ph.D. Student" is a student
  author; `member-postdoc`, `lead`, and an `alum` who had already graduated are
  not. Watch the date: someone who is a postdoc now may have been a student
  when an older paper appeared, and vice versa.
- **External co-authors** — check what the neighbouring papers already claim
  for them, then look them up (their homepage, lab page, or a conference
  profile from the right year). A personal page saying "Nth year Ph.D.
  student" dated near the venue year is good evidence; a faculty page is good
  evidence the other way.
- **Cross-check the paper itself.** Journal versions (TSE, TOCHI) often carry
  author biographies that state degree progress explicitly.

Record only what you actually established. If an author cannot be resolved from
the record, the paper, or the web — a co-author with no web presence is common
for undergraduate research assistants — **ask the user rather than guessing in
either direction**. They are usually a co-author and can answer in one line.
Guessing "student" falsely underlines a professor; guessing "not a student"
drops the credit the field exists to give.

## 5. Write the record

Add it at the **top** of `_data/publications.yaml` (the file is newest-first).
Leave `pdf:` off for now — step 6 fills it in.

Required: `id`, `title`, `authors`, `venue`. The `id` convention is the
lowercase title, punctuation stripped, spaces as underscores, suffixed with the
venue year. Add `abstract` and `doi` when you have them, and
`student_authors` per step 4 — do not simply omit it.

## 6. Name and move the PDF

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

## 7. Optionally announce it

A new paper usually wants a `_data/news.yaml` entry, and sometimes a
`_data/clusters.yaml` id. Both reference the publication by its `id`.

## 8. Verify — the build succeeding is not the check

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
- the CV underlines exactly the people you listed in `student_authors`, and
  its `J.n`/`C.n` codes for existing papers did not shift (they only stay put
  when the new paper is newer than everything already listed)

This one-liner catches the two author-list mistakes that build cleanly — an
author id with no `people.yaml` record, and a `student_authors` entry that is
not in `authors` (a real bug this repo has shipped before):

```bash
bundle exec ruby -ryaml -e '
pubs = YAML.load_file("_data/publications.yaml")
people = YAML.load_file("_data/people.yaml").map { |p| p["id"] }
pubs.each do |p|
  Array(p["authors"]).each { |a| warn "MISSING AUTHOR #{p["id"]}: #{a}" unless people.include?(a) }
  Array(p["student_authors"]).each { |a| warn "STUDENT NOT IN AUTHORS #{p["id"]}: #{a}" unless Array(p["authors"]).include?(a) }
end
puts "checked #{pubs.size} publications"
'
```

For anything beyond a new record — a template or plugin touch — diff `_site`
before and after instead (recipe in `AGENTS.md`); Liquid fails soft, so that is
the only reliable check that a refactor changed nothing.

Serve with `npm run develop` at `http://127.0.0.1:4000` for a real browser
check. The CV's student underlines and paper awards are off by default:
`/people/steve_oney/cv/?students=true&awards=true`.

**Do not commit or push unless asked** — a push to `main` deploys the live site.
