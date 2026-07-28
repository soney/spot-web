# SPOT Group Website (Jekyll)

This repository powers [from.so](https://from.so) using [Jekyll](https://jekyllrb.com/).

## Local development

1. Install dependencies (Ruby version is pinned in `.ruby-version`):

```bash
bundle install
npm install
```

2. Build and serve:

```bash
npm run develop
```

3. Open `http://127.0.0.1:4000`.

`jekyll serve` watches `_data/` for edits to existing entries, but the
per-paper/per-person pages are stubs generated *before* serving — so after
**adding or removing** a publication or person, restart `npm run develop` (or
run `npm run generate` in another terminal) to regenerate them.

## Deploy

Pushing to `main` deploys automatically: the GitHub Actions workflow
([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) builds the site
and publishes `_site/` to the `gh-pages` branch. Pull requests run the same
build as a check, without deploying.

Manual fallback from a local checkout:

```bash
npm run deploy
```

## How the site is put together

Almost all content lives in `_data/` as YAML; the HTML pages and layouts are
thin templates over it.

```
_data/
  publications.yaml           # one record per paper (id, title, authors, venue, pdf, ...)
  people.yaml                 # everyone who appears anywhere (group members have `membership`)
  venues.yaml                 # publication venues (id, names, year, type, homepage)
  news.yaml                   # news items, with links to people/publications by id
  clusters.yaml               # research focus areas shown on /research
  group.yaml                  # homepage overview/joining text and settings
  blog.yaml                   # /writing entries (links to Google Docs)
  leadcv.yaml                 # everything on Steve's CV that isn't a publication
  publication_types.yaml      # venue type -> CV numbering prefix (J, C, B, ...)
  cv_publication_sections.yaml# the CV's publication section headings and types
_layouts/
  default.html                # site chrome (head, navbar); used by every page but the CV
  cv.html                     # standalone shell for the CV (different fonts/styles)
  paper.html                  # /papers/<id>/ pages; looks up the pub by page.pub_id
  person.html                 # /people/<id>/ pages; looks up the person by page.person_id
_includes/                    # shared partials; each documents its parameters in a header
_papers/, _people_pages/      # GENERATED front-matter-only stubs — do not edit (gitignored)
scripts/generate-pages.rb     # regenerates those stubs from the data files
assets/                       # hand-written CSS (no preprocessor), cv.js, images, paper PDFs
```

How a paper page appears: `scripts/generate-pages.rb` writes a stub into
`_papers/` for every record in `publications.yaml`; Jekyll turns each stub
into `/papers/<id>/` via the `papers` collection, and `_layouts/paper.html`
renders the actual content by looking the record up in `site.data`. Person
pages work the same way, but only for people with `use_local_homepage: true`.

Records reference each other by `id`: a publication's `venue` must match a
venue id, and its `authors` list people ids. The `id` of a publication is also
its URL slug.

The CV (`oney_cv.html`) renders `leadcv.yaml` plus the publication data, and
numbers publications per type (J.12, C.31, ...) using the prefixes in
`publication_types.yaml`. Its interactive toggles (student authors, mentees,
paper awards) live in `assets/js/cv.js` and are driven by URL parameters.

## Adding a new paper

1. Add the _venue_ to `_data/venues.yaml` (if it doesn't already exist).
2. Ensure all the _authors_ are listed in `_data/people.yaml`.
3. Add the paper to `_data/publications.yaml`.
   - Ensure the `venue` field matches the `id` in `_data/venues.yaml`.
   - Ensure the `authors` field contains the `id` of each author in `_data/people.yaml`.
   - Put the PDF in `assets/pdfs/` and reference it as `pdf: pdfs/<file>.pdf`.
4. Run `npm run develop` to build and serve the site (restart it if it was
   already running, so the new paper page is generated).
5. Verify the paper is displayed correctly.
6. Push to `main` (or run `npm run deploy`) to publish.
