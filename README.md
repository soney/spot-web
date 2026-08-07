# SPOT Group Website (Jekyll)

This repository powers [from.so](https://from.so) using [Jekyll](https://jekyllrb.com/).

## Local development

1. Install dependencies (Ruby version is pinned in `.ruby-version`):

```bash
bundle install
```

2. Build and serve:

```bash
npm run develop
```

3. Open `http://127.0.0.1:4000`.

`jekyll serve` watches `_data/`, and the per-paper and per-person pages are
generated during the build, so adding or removing a publication or person is
picked up by the running server without a restart.

## Deploy

Pushing to `main` deploys automatically: the GitHub Actions workflow
([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) builds the site
and publishes `_site/` to the `gh-pages` branch. Pull requests run the same
build as a check, without deploying. To deploy by hand, re-run that workflow
from the Actions tab (it allows `workflow_dispatch`).

**GitHub Pages must stay pointed at the `gh-pages` branch.** This repo has a
`_plugins/` directory, and Pages' own Jekyll runs in safe mode, which ignores
it. If Pages were pointed at `main` instead, the paper and person pages would
disappear and the CV's publication numbers (J.12, C.31, ...) would silently
render blank — the site would still build, just wrongly.

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
  group.yaml                  # homepage overview/joining text, member tier order, settings
  blog.yaml                   # /writing entries (links to Google Docs)
  nav.yaml                    # the navbar tabs
  affiliations.yaml           # homepage footer logos
  oney_cv.yaml                # Steve's CV: everything on it that isn't a publication
  publication_types.yaml      # venue type -> CV numbering prefix (J, C, B, ...)
  cv_publication_sections.yaml# the CV's publication section headings and types
  cv_service_groups.yaml      # the CV's Service group headings and categories
  cv_supervision_groups.yaml  # the CV's Students Supervised headings and categories
_layouts/
  default.html                # site chrome (head, navbar); used by every page but the CV
  cv.html                     # standalone shell for the CV (different fonts/styles)
  paper.html                  # /papers/<id>/ pages; looks up the pub by page.pub_id
  person.html                 # /people/<id>/ pages; looks up the person by page.person_id
_includes/                    # shared partials; each documents its parameters in a header
_plugins/
  generate_data_pages.rb      # creates the /papers/ and /people/ pages from the data
  cv_publication_codes.rb     # CV publication numbering (J.12, C.31, ...)
  cv_award_entries.rb         # merges CV awards and paper awards into one sorted list
  cv_grouped_records.rb       # buckets CV service/supervision records into display groups
assets/                       # hand-written CSS (no preprocessor), cv.js, images, paper PDFs
```

How a paper page appears: `_plugins/generate_data_pages.rb` runs during the
build and adds a page at `/papers/<id>/` for every record in
`publications.yaml`; `_layouts/paper.html` renders it by looking the record up
in `site.data`. Person pages work the same way, but only for people with
`use_local_homepage: true`. Nothing is written to disk, so there is no
generated-file step to keep in sync.

Records reference each other by `id`: a publication's `venue` must match a
venue id, and its `authors` list people ids. The `id` of a publication is also
its URL slug.

The CV (`oney_cv.html`) renders `_data/oney_cv.yaml` plus the publication data,
and numbers publications per type (J.12, C.31, ...) using the prefixes in
`publication_types.yaml`. `oney_cv.yaml` declares `person: steve_oney`, and the
publication list filters on it — so the CV can only claim papers that person
actually co-authored, not everything on the group site. It is deliberately one
person's CV rather than a template; see the comment at the top of that file.

Its interactive toggles (student authors, mentees, paper awards) are declared
by `_includes/cv_toggle.html` and driven by `assets/js/cv.js` via URL
parameters.

## Adding a new paper

1. Add the _venue_ to `_data/venues.yaml` (if it doesn't already exist).
   - `year` must be an unquoted integer; templates compare it numerically.
2. Ensure all the _authors_ are listed in `_data/people.yaml`.
   - Reuse an author's existing `id`. Adding a second record for someone who
     is already listed splits their papers from their profile, so their name
     stops linking and their student-author marking breaks.
3. Add the paper to `_data/publications.yaml`.
   - Ensure the `venue` field matches the `id` in `_data/venues.yaml`.
   - Ensure the `authors` field contains the `id` of each author in `_data/people.yaml`.
   - Put the PDF in `assets/pdfs/` and reference it as `pdf: pdfs/<file>.pdf`.
     Headshots work the same way: the file goes in `assets/images/people/` and
     `headshot:`/`focused_headshot:` are written relative to `assets/`.
4. Run `npm run develop` to build and serve the site.
5. Verify the paper is displayed correctly.
6. Push to `main` to publish.
