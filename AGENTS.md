# AGENTS.md

Instructions for coding agents working in this repository. This is the canonical
agent file; `CLAUDE.md` is a pointer to it plus a few Claude Code specifics.

## What this is

The Jekyll site for the SPOT research group at the University of Michigan,
deployed at <https://from.so>. It is a small content site: publications, people,
news, research focus areas, and one person's CV.

## Architecture

Read the "How the site is put together" section of `README.md` for the full
picture. The three facts that change how you work:

1. **Almost all content is YAML in `_data/`.** The `.html` files at the root and
   in `_layouts/`/`_includes/` are thin views over it. A content change is
   almost always a `_data/*.yaml` edit and nothing else. Do not add an HTML file
   per paper or per person.
2. **`/papers/<id>/` and `/people/<id>/` are generated at build time** by
   `_plugins/generate_data_pages.rb`. Nothing is written to disk. There is no
   `scripts/generate-pages.rb`, no `_papers/`, and no `_people_pages/` — if you
   have seen those in older docs or commit messages, they are gone. Person pages
   are generated only for records with `use_local_homepage: true`.
3. **Records reference each other by `id`.** A publication's `venue` must match
   a `venues.yaml` id; its `authors` are `people.yaml` ids; `news.yaml` and
   `clusters.yaml` reference both by id. Ids are also URL slugs.

Four Ruby plugins live in `_plugins/`: `generate_data_pages.rb`,
`cv_publication_codes.rb` (the CV's J.12/C.31 numbering),
`cv_award_entries.rb`, and `cv_grouped_records.rb`. Each opens with a comment
explaining what it does and the constraint that put it in Ruby rather than
Liquid — read it before changing one; the last three exist because Liquid
cannot express the counting, sorting, or bucketing they do.

## Running and verifying

```bash
bundle install                     # once per machine; Ruby pinned in .ruby-version
npm run develop                    # = bundle exec jekyll serve --livereload
bundle exec jekyll build           # one-shot; read the output for warnings
```

There is **no `npm install`** and no `devDependencies` — `package.json` has no
dependencies at all, only three scripts. Do not add a Node build step.

The dev server watches `_data/`, so a new record appears (including its
generated page) without a restart. Do not use `jekyll serve --detach`; it
disables auto-regeneration and says so in a line that is easy to miss.

**For any change that is supposed to be output-neutral — a refactor of a
template, an include, a plugin, or a data reshuffle — diff `_site` before and
after.** This is the only reliable check that a Liquid refactor changed nothing,
because Liquid fails soft: a mistyped variable renders as empty string, not an
error.

```bash
bundle exec jekyll build && cp -r _site /tmp/site-before
# ... make the change ...
bundle exec jekyll build && diff -r /tmp/site-before _site
```

`_site/` is gitignored, so this is safe to do at any time. The only expected
difference is the `<updated>` build timestamp in `feed.xml`; anything else is
your change. Add `-x feed.xml` if it gets in the way.

Always read the output of a clean `bundle exec jekyll build`. Warnings from
`DataPageGenerator` (duplicate ids) and `cv_grouped_records` (an unmatched
category) appear there and scroll past during serve.

Verify in the browser at `http://127.0.0.1:4000`. The CV's student-author
underlines and paper awards are **off by default** — check them at
`/oney_cv/?students=true&awards=true` or you will conclude your edit did
nothing.

## Invariants that fail silently

Nothing in this repo validates that a referenced id exists, that a referenced
file exists, or that a `type` is one you meant. These build cleanly and render
wrongly, which makes them the things to get right the first time.

- **Reuse an existing person's `id`; never create a second record for them.**
  A duplicate splits their papers from their profile: `where: "id" | first`
  silently takes whichever copy is earlier in the file, so their person page and
  the CV's author lists show only part of their work. Search `_data/people.yaml`
  by family name before adding anyone. Most records there are external
  co-authors with no `membership`.
- **An unknown author id prints the raw string** where the name should be —
  `ashly_zhang` appears verbatim in the rendered author list. No warning.
- **A typo in a publication's `venue:`** is completely silent: the paper
  disappears from `/research`, the homepage, and the CV, leaving an orphan
  `/papers/<id>/` page that nothing links to.
- **`venues.yaml` `year` must be an unquoted integer.** Templates compare it
  numerically. A quoted year fails the build with
  `comparison of String with 2019 failed`, naming neither the file nor the
  venue.
- **Asset paths in YAML are relative to `assets/`** — `pdfs/foo.pdf`,
  `images/people/foo.jpg`. Templates do `'/assets/' | append: path`. A leading
  slash or an `assets/` prefix yields a broken link or image with no build
  error. Extension case matters: several existing files are `.JPG`, and a
  mismatch works on macOS and 404s on from.so.
- **`/team#<id>` anchors exist only for people with a `membership` field.**
  Most `people.yaml` records have none. A `[Name](/team#their_id)` link for such
  a person is a live link that scrolls nowhere. A `membership` value that is not
  in `_data/group.yaml`'s `member_order` and is not `alum` or
  `ugrad_ms_student` renders the person nowhere at all — while still making
  their news chip link to that non-existent anchor.
- **The CV's publication codes shift when you insert an older paper.**
  `cv_publication_codes.rb` counts *down* from each type's total, so adding a
  2014 conference paper renumbers every newer conference paper. External
  documents citing "C.31" then point at a different paper. Say so if a change
  causes it.
- **Venue order within a year comes from `conference_start`.** Templates use the
  `venues_by_date_desc` filter (`_plugins/venue_order.rb`): year descending, then
  `conference_start` descending, then position in the file as a tiebreak. So a
  November conference precedes an April one in the same year, and a venue with no
  `conference_start` sorts after the dated ones. Give every new venue a
  `conference_start` or it will sink to the bottom of its year.
- **A venue `type` outside the ten in `_data/publication_types.yaml`** is
  accepted silently and drops the paper from every publication list, CV
  included. A legal but non-`conference`/`journal` type puts the paper on the CV
  only, because `publication_list_types` in `_config.yml` is `conference` and
  `journal`.
- **`use_local_homepage` must be a bare, unquoted `true`.** The plugin compares
  with `== true`; the templates only test Liquid truthiness. Quoted, every
  author link site-wide points at a page that was never generated.
- **Quote hex colors.** `color: #FFC14A` unquoted is a YAML comment and parses
  as null; the build succeeds and the chip loses its border.
- **Use the `>-` folded block for any Markdown-bearing YAML string** (news
  `description`, `long_bio`). A plain scalar breaks on a leading `[`, on `: `,
  and on a space-preceded `#`, which truncates the line silently.
- **`news.yaml` dates sort as strings.** `sort: "date" | reverse` is correct
  only for zero-padded ISO `YYYY-MM-DD`. A malformed date renders a plausible
  month and floats to the top of the list.

## Deployment

`.github/workflows/deploy.yml` builds on push to `main` and force-pushes `_site`
to `gh-pages`; pull requests run the same build as a check without deploying.

**GitHub Pages must stay pointed at the `gh-pages` branch.** Because this repo
has `_plugins/`, and Pages' own Jekyll runs in safe mode and ignores plugins,
pointing Pages at `main` would delete every paper and person page and blank the
CV's publication numbers — without failing the build. Never suggest switching
the Pages source, and never propose removing `_plugins/` to "make it Pages
compatible".

`_site/CNAME` is what keeps the custom domain alive across a force-push deploy;
`CNAME` is deliberately not in `_config.yml`'s `exclude`. The workflow asserts
it survived the build.

Do not commit or push unless asked.

## Task recipes

`README.md` has step-by-step guides, with real YAML and the failure modes for
each, under **Common tasks**:

- Adding a paper (PDF, venue, authors, publication record, CV effects)
- Adding a news item
- Adding or updating a person, including member → alum
- Updating a profile picture
- Checking your work

Follow those rather than reconstructing the steps from the templates, and update
them when you change something they describe.

## Conventions

- Ruby in `_plugins/` is `# frozen_string_literal: true`, plain Jekyll API, and
  uses nothing outside the two gems in the `Gemfile` (`jekyll`,
  `jekyll-feed`). Keep each file's header comment accurate when you change it.
- Each file in `_includes/` opens with a `{% comment %}` block documenting its
  parameters. Keep it accurate when you add or rename one.
- CSS in `assets/css/` is hand-written, no preprocessor.
- Prose in `_data/` and in the docs is plain and concrete, and explains why a
  rule exists when the reason is non-obvious. Match it.
- `AGENTS.md` and `CLAUDE.md` are in `_config.yml`'s `exclude` list, alongside
  `README.md`, so they are not copied into `_site` and published. If you add
  another root-level Markdown file, exclude it too.
