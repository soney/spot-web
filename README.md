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
  blog.yaml                   # /writing entries (links to Google Docs, one page each)
  nav.yaml                    # the navbar tabs
  affiliations.yaml           # homepage footer logos
  cvs/steve_oney.yaml         # Steve's CV: everything on it that isn't a publication or a course; one file per person, named by people.yaml id
  teaching.yaml               # courses taught, by person id; feeds the CV and the person page
  publication_types.yaml      # venue type -> CV numbering prefix (J, C, B, ...)
  cv_publication_sections.yaml# the CV's publication section headings and types
  cv_service_groups.yaml      # the CV's Service group headings and categories
  cv_supervision_groups.yaml  # the CV's Students Supervised headings and categories
_layouts/
  default.html                # site chrome (head, navbar); used by every page but the CV
  cv.html                     # standalone shell for the CV (different fonts/styles)
  paper.html                  # /papers/<id>/ pages; looks up the pub by page.pub_id
  person.html                 # /people/<id>/ pages; looks up the person by page.person_id
  writing.html                # /writing/<slug>/ pages; looks up the entry by page.post_id
_includes/                    # shared partials; each documents its parameters in a header
_plugins/
  generate_data_pages.rb      # creates the /papers/, /people/ and /writing/ pages from the data
  cv_publication_codes.rb     # CV publication numbering (J.12, C.31, ...)
  cv_award_entries.rb         # merges CV awards and paper awards into one sorted list
  cv_grouped_records.rb       # buckets CV service/supervision records into display groups
  teaching_entries.rb         # one person's courses: the CV's list, and the shorter page one
  mcp_index.rb                # builds the JSON the WebMCP tools answer from
assets/                       # hand-written CSS (no preprocessor), cv.js, images, paper PDFs
  js/webmcp.js                # registers this site's tools for AI agents
  mcp/                        # one line of Liquid each; generates the tools' JSON
script/
  pdf_audit.rb                # assets/pdfs/ vs. publications.yaml; derives PDF filenames
```

`script/pdf_audit.rb` is deliberately stdlib-only Ruby (no `bundle exec`), so it
is cheap enough to run from an editor hook on every prompt.

How a paper page appears: `_plugins/generate_data_pages.rb` runs during the
build and adds a page at `/papers/<id>/` for every record in
`publications.yaml`; `_layouts/paper.html` renders it by looking the record up
in `site.data`. Person pages work the same way, but only for people with
`use_local_homepage: true`, and writing pages the same again, at
`/writing/<slug>/` for every record in `blog.yaml`. Nothing is written to disk,
so there is no generated-file step to keep in sync.

Records reference each other by `id`: a publication's `venue` must match a
venue id, and its `authors` list people ids. The `id` of a publication is also
its URL slug. Writing entries are the one exception: they carry a separate
`slug` for the URL, because those links are meant to be sent to people and so
must not move when an entry is retitled.

CV pages (`/people/<person_id>/cv/`) are generated at build time by
`_plugins/generate_cv_pages.rb`, one per `_data/cvs/<person_id>.yaml`, and
rendered by `_includes/cv_body.html` from that file plus the publication data,
numbering publications per type (J.12, C.31, ...) using the prefixes in
`publication_types.yaml`. The filename is the person: it must be a
`people.yaml` id, and the publication and teaching lists filter on it — so a
CV can only claim papers its person actually co-authored, not everything on
the group site. `/oney_cv/` is a vanity redirect to Steve's
(`/people/steve_oney/cv/`) that carries the query string through, so shared
toggle links keep working.

Teaching is filtered on that `person` the same way, out of
`_data/teaching.yaml`. That file is the single source behind both the CV's
Teaching section and the one on `/people/<id>/`, so a course is added once and
appears in both. The page gets the shorter list: `_plugins/teaching_entries.rb`
drops any entry marked `cv_only: true`, and any whose last year falls before
the file's `page_since` — see
[Adding a course you taught](#adding-a-course-you-taught).

Its interactive toggles (student authors, mentees, paper awards) are declared
by `_includes/cv_toggle.html` and driven by `assets/js/cv.js` via URL
parameters.

### WebMCP: the site's tools for AI agents

The site registers [WebMCP](https://github.com/webmachinelearning/webmcp) tools,
so a browser agent on any page can search the publications, look someone up,
read the CV, or open a page — from the data, rather than by scraping whatever
HTML happens to be on screen. Eleven tools, all in `assets/js/webmcp.js`:
`search_publications`, `get_publication`, `get_bibtex`, `list_people`,
`get_person`, `list_research_areas`, `list_news`, `get_group_info`, `get_cv`,
`navigate_to_page`, and `set_cv_display_options` (the CV page only).

The whole implementation:

```
_plugins/mcp_index.rb                builds the JSON, out of the same _data/
assets/mcp/index.json                one line of Liquid -> /assets/mcp/index.json
assets/mcp/cv.json                   ditto, for the CV
assets/js/webmcp.js                  registers the tools and answers the calls
_includes/webmcp_script.html         loads it, and tells it what page this is
_includes/webmcp_origin_trial.html   the Chrome origin-trial <meta>, if configured
```

**There is nothing to maintain per record.** `mcp_index.rb` reads `_data/` the
same way the templates do — the same venue order, the same author-name joining,
the same BibTeX filter — so adding a paper or a person puts it in the JSON
automatically. If you add a *field* that an agent should see, add it there; if
you add a *record*, you are already done.

**WebMCP is not a shipped browser feature.** It is a W3C Community Group draft,
available in Chrome only behind an origin trial. In every other browser
`document.modelContext` does not exist, so `webmcp.js` reads one property, finds
nothing, and returns — no fetch, no cost, nothing on the page changes.

from.so is enrolled in the trial: `webmcp_origin_trial_token` in `_config.yml`
holds the token, and `_includes/webmcp_origin_trial.html` renders it into the
`<head>` of both layouts. **It expires on 2026-11-17.** When it does, the tools
stop existing for the public and *nothing announces it* — the build still
succeeds, every page still renders, and no test fails. Renew it at
[developer.chrome.com/origintrials](https://developer.chrome.com/origintrials)
for `https://from.so`, or empty the setting if the trial ended because the API
shipped. The token is public by design (it is served in every page), so it
belongs in version control.

To test without a token, or after it expires, enable
`chrome://flags/#enable-webmcp-testing` → *WebMCP for testing*.

Both JSON files are generated, so neither is committed; they are ~260 KB and
~38 KB, which gzip to about 55 KB and 9 KB. Nothing is fetched until an agent
calls a tool, and the CV file only when a tool needs the CV.

## Common tasks

Every task below is a YAML edit in `_data/`. You never write an HTML file, never
run a generator script, and never restart the dev server — see
[How the site is put together](#how-the-site-is-put-together) for why.

The theme running through all six is that **a mistake here usually produces
silently wrong output rather than an error.** Jekyll does not validate that a
referenced id exists, that a referenced file exists, or that a `type` is one you
meant. The gotchas called out below are the ones that build cleanly and render
wrongly; they are worth reading even if you have done the task before.

- [Adding a paper](#adding-a-paper)
- [Adding a news item](#adding-a-news-item)
- [Adding or updating a person](#adding-or-updating-a-person)
- [Adding a writing entry](#adding-a-writing-entry)
- [Adding a course you taught](#adding-a-course-you-taught)
- [Updating a profile picture](#updating-a-profile-picture)
- [Checking your work](#checking-your-work)

### Adding a paper

You will touch, in this order:

1. `assets/pdfs/<file>.pdf` — the PDF itself
2. `_data/venues.yaml` — only if the venue isn't already there
3. `_data/people.yaml` — only for co-authors who have never appeared on the site
4. `_data/publications.yaml` — the paper record
5. (optional) `_data/news.yaml`, `_data/clusters.yaml`

**The PDF.** Drop the file in `assets/pdfs/` and rename it to
`<surname>-<short-title>-<venue><year>.pdf`. Nothing enforces the convention,
but every one of the 73 PDFs follows it, so the name is derived rather than
invented — once the record exists, ask for it:

```bash
ruby script/pdf_audit.rb --name <publication-id>
```

The three pieces are the first author's surname, the system name before the
title's colon (`CodeStream: Augmenting…` → `codestream`) or the first three
meaningful words when there is no colon (`Simulating Human Cursor Trajectories
for…` → `simulating-human-cursor`), and the venue's `short_name` stripped of
punctuation plus its year (`VL/HCC` 2025 → `vlhcc2025`), skipping the year when
the short name already carries one (`CHI2025-CompUI`).

Reference it in the record **relative to `assets/`** —
`pdf: pdfs/zhang-codestream-chi2026.pdf`. Templates build the URL as `/assets/`
+ `pdf`, so `pdf: /assets/pdfs/foo.pdf` or `pdf: assets/pdfs/foo.pdf` renders a
PDF button that 404s, with no build error. `pdf` is optional; omit it and no
button renders anywhere.

**The venue.** Look in `_data/venues.yaml` first — ids are `<venue>_<year>`
(`chi_2026`, `uist_2025`, `vl_hcc_2024`, `chi_posters_2026`). If it's there,
just reference its `id`.

| Field | Required? | What it affects |
| --- | --- | --- |
| `id` | yes | The key `publications.yaml` references via `venue:` |
| `year` | yes | Sort order everywhere, the "CHI 2026" label, the CV citation's `(2026)` |
| `type` | yes | Whether the paper shows on the site at all, and its CV section and numbering prefix |
| `full_name` | in practice | The CV citation; the site label if `short_name` is missing |
| `short_name` | in practice | The "CHI 2026" label next to the paper on the site |
| `location` | optional | Trailing "Barcelona, Spain." in the CV citation |
| `conference_start` | in practice | `M/D`, e.g. `5/10`. **Orders venues within a year** (see below) and supplies the `5/2026` date on the CV's *Awards* entries. Omit it and the venue sorts after every dated venue of its year. |
| `homepage` | optional | Makes the venue label a link |

```yaml
- id: chi_2027
  short_name: CHI
  year: 2027
  location: Denver, CO, USA
  full_name: The ACM CHI Conference on Human Factors in Computing Systems
  conference_start: 5/10
  homepage: https://chi2027.acm.org
  type: conference
```

`year` must be an **unquoted integer**. `year: "2027"` fails the build with a
message that names neither the file nor the venue:

```
Liquid Exception: Liquid error (_includes/publication_list_items.html line 31):
comparison of String with 2019 failed included in index.html
```

If you ever see that error, a venue year got quoted.

`type` must be one of the ten in `_data/publication_types.yaml`: `journal` (J),
`conference` (C), `bookchapter` (B), `poster` (P), `workshop` (W),
`doctoralconsortium` (D), `demo` (E), `panel` (A), `preprint` (R), `thesis` (T).
Anything else (say, `symposium`) is accepted silently and the paper drops out of
**every** publication list — the CV included — leaving only its `/papers/<id>/`
page. An `award` on it still shows up in the CV's *Awards* section, so the CV
credits an award for a paper it never lists.

**Where in the file.** Position barely matters — venues are sorted at build time
by `_plugins/venue_order.rb`: year descending, then `conference_start`
descending, then file position only as a tiebreak for two venues on the same
day. So put a new venue wherever it reads naturally and make sure
`conference_start` is right; that is what decides the order. A venue with no
`conference_start` sorts after every dated venue of its year.

**Every author needs a `people.yaml` id.** Search `_data/people.yaml` for each
co-author's family name **before** adding anyone; most records are external
collaborators with no `membership`. Reuse the existing id — never create a
second record for someone already listed (see
[Adding or updating a person](#adding-or-updating-a-person)). A minimal record
for a new external co-author is three lines:

```yaml
- id: dana_ruiz
  given_name: Dana
  family_name: Ruiz
  homepage: https://danaruiz.example.edu
```

An author id with no matching record is not an error: the raw string is printed
where the name should be, so `- ashly_zhang` renders literally as
`ashly_zhang`. Nothing warns you.

**The publication record**, added at the **top** of `_data/publications.yaml`
(the file is newest-first; order within a venue is file order, and the first
record of a venue gets the higher CV number):

| Field | Required? | What it affects |
| --- | --- | --- |
| `id` | yes | The `/papers/<id>/` URL, the `#pub-<id>` anchor on `/research`, and how `news.yaml`/`clusters.yaml` reference the paper |
| `title` | yes | Everywhere |
| `authors` | yes | Ordered list of `people.yaml` ids; drives author lists, person pages, and whether the CV claims the paper (it must contain `steve_oney`) |
| `venue` | yes | Must equal a `venues.yaml` `id` |
| `pdf` | optional | PDF link on the paper page, list rows, and CV. Name the file `<surname>-<short-title>-<venue><year>.pdf`; the link's download name is generated separately |
| `doi` | optional | Adds a "Publisher page" link on the paper page, and `doi`/`url` lines to the BibTeX entry. Bare identifier — `10.1145/3411763.3451617`, not the full URL |
| `student_authors` | optional | Subset of `authors`. **CV only** — underlines those names when the CV's student toggle is on |
| `abstract` | optional | Markdown body of the paper page; also the fallback list blurb, truncated to 320 chars |
| `short_description` | optional | One-paragraph blurb in list rows, overriding the truncated abstract. Not shown on the paper page |
| `award` | optional | `best_paper` (trophy icon), `honorable_mention` or `other` (ribbon). The literal string `none` means "no award" |
| `award_description` | optional | Replaces the generic award text |

The `id` convention is the lowercase title with punctuation stripped and spaces
as underscores, suffixed with the venue year. Nothing enforces it; it only has
to be unique and URL-safe. A duplicate id prints a
`DataPageGenerator: duplicate id ...; keeping the first` warning, then renders
**both** records as rows on `/research` while generating only **one** paper page
— two different titles linking to the same URL.

Award text is `award_description` if present, else `award` with underscores
turned to spaces, then run through Liquid's `capitalize`, which **downcases
everything after the first character**: `award_description: "Best Short Paper"`
renders on the site as "Best short paper". Write it sentence-case, and never
with a leading space (one existing record has one, which is why it renders as
" recognition for contribution to diversity and inclusion"). The CV prints
`award_description` verbatim, so that is the one place your capitalization
survives.

**Citations.** Every paper page shows a BibTeX entry, generated by
`_plugins/citation.rb` from the record plus its venue and authors — there is
nothing to write or keep in sync. The entry type follows the venue's `type`
(`conference` and friends become `@inproceedings`, `journal` becomes
`@article`, and so on), and the citation key is
`<surname><year><first-long-title-word>`, with an `a`/`b` suffix if two papers
would collide.

Adding a `doi` is the one thing that improves a citation by hand: it adds the
publisher link on the page and `doi`/`url` lines to the BibTeX. 55 of 73 papers
have one. The rest are workshop papers, theses, and work that is not published
yet — leave `doi` off entirely rather than guessing, because a wrong DOI on a
CV is worse than a missing one. To find one, search
[Crossref](https://search.crossref.org/) for the title and confirm the first
author and year match before pasting it in.

A full example:

```yaml
- id: threadview_tracing_ai_suggestions_through_student_code_2027
  title: "ThreadView: Tracing AI Suggestions Through Student Code"
  abstract: >-
    Instructors can see what students submitted but not where it came from. ThreadView reconstructs the provenance
    of every span of a submission, distinguishing text the student typed, text accepted from an AI assistant, and
    text pasted from elsewhere.
  short_description: >-
    Reconstructs where each part of a student's submission came from — typed, AI-accepted, or pasted — and shows it
    inline, so instructors can judge provenance without reading raw edit logs.
  authors:
    - ashley_zhang
    - xiangyu_zhou
    - maryam_arab
    - steve_oney
  student_authors:
    - ashley_zhang
    - xiangyu_zhou
  venue: chi_2027
  pdf: pdfs/threadview_chi27.pdf
  award: honorable_mention
```

Optionally announce it in `_data/news.yaml` and file it under a focus area by
adding its id to the right cluster's `papers:` list in `_data/clusters.yaml`.

Then check `/papers/<id>/`, `/research#pub-<id>`, the homepage, and
`/people/steve_oney/cv/?students=true&awards=true` — see
[Checking your work](#checking-your-work). Watch for these, all of which build
cleanly:

- **A typo in `venue:`** (`chi2027` for `chi_2027`) is completely silent. The
  paper vanishes from `/research`, the homepage, and the CV, and all that
  remains is an orphan `/papers/<id>/` page with no venue label that nothing
  links to.
- **A legal but non-conference/journal type** — workshop, poster, demo,
  doctoral consortium, panel, preprint, thesis, book chapter — puts the paper on
  the **CV only**. `/research` and the homepage list only the types in
  `publication_list_types` (`_config.yml`), which is `conference` and `journal`.
  A news chip pointing at `/research#pub-<id>` for such a paper is a dead
  anchor; the existing CHI 2026 poster already has one.
- **Adding a paper that is older than papers already listed renumbers the CV.**
  Codes count *down* from each type's total, so inserting a 2014 conference
  paper bumps the newest conference paper from C.43 to C.44 and shifts every
  newer code of that type. Anything citing "C.31" in a research statement now
  points at a different paper. Codes are stable only when you add papers newer
  than everything already listed.
- **Paper awards and student underlines are hidden on the CV by default.** They
  render only with the toggles on:
  `/people/steve_oney/cv/?students=true&awards=true`.
  Without those parameters you will think `award` and `student_authors` did
  nothing.

### Adding a news item

News is a flat list in `_data/news.yaml`. There is no `_posts/` directory and no
front matter. Two pages consume it and nothing else does: the homepage
(`index.html`, newest 4, date format `%b '%y`) and `/news/` (`news.html`, all
items, `%B %Y`). Both render each record through `_includes/news_item.html`.

Exactly four keys are read; anything else you add is silently ignored.

| Key | Required | What it does |
| --- | --- | --- |
| `date` | effectively yes | Sort key and the bold date line |
| `description` | yes | Body text, rendered as Markdown |
| `relevant_people` | no | List of `people.yaml` ids → headshot chips |
| `relevant_publications` | no | List of `publications.yaml` ids → paper chips |

```yaml
- date: "2026-09-15"
  description: >-
    [Ashley](/team#ashley_zhang) will present her paper on visualizing student-AI interaction in code at
    [UIST 2026](https://uist.acm.org/2026/) in Detroit!
  relevant_people:
    - ashley_zhang
    - yan_ru_jhou
    - yan_chen
  relevant_publications:
    - editrail_understanding_ai_usage_by_visualizing_student_ai_interaction_in_code_2026
```

Position in the file does not matter — both pages sort by `date` at render time.
Prepending is the convention only because it keeps diffs readable.

**Always use the `>-` folded form for `description`,** even for a one-liner. A
plain scalar breaks on Markdown that is also YAML syntax: a leading `[` parses
as a flow sequence, a `: ` anywhere in the text is a mapping error, and a
space-preceded `#` starts a comment that silently truncates the line. Inside the
block, wrap lines freely; the fold joins them with spaces.

**Dates sort as strings, not dates.** Both pages do
`sort: "date" | reverse`, which is correct only because every date is
zero-padded ISO `YYYY-MM-DD`. Because of the `reverse`, a malformed date floats
to the top rather than sinking:

- `"2026-9-5"` renders as "September 2026" and looks fine, but string-compares
  greater than every zero-padded date that year, so it sits above all of 2026.
- `"Sept 15, 2026"` also renders as "September 2026" and jumps to the very top
  of the list, because `"S"` > `"2"`.

Only the month and year are ever displayed, but the day still decides ordering
within a month, so pick a real one. Two items with the same date sort in
arbitrary order — Liquid's `sort` is not stable. Omitting `date` is legal and
silent: the item renders with no date line and sinks to the bottom of `/news`,
so it will never reach the homepage's top 4.

**Link group members as `[Name](/team#<id>)`, never to their personal
homepage** — `people.yaml` owns each person's external URL, and hard-coding it
here creates a second copy that goes stale. But **`/team#<id>` anchors exist
only for people who have a `membership` field**; most `people.yaml` records are
external co-authors without one, and a link to their id is a live link that
lands on `/team` and scrolls nowhere. For those people, link their homepage
inline or leave the name as plain text. (The *chips* handle this correctly —
`news_item.html` renders an unlinked `<span class="chip">` for someone with no
membership — but a Markdown link in `description` does not.)

**A typo'd id in either chip list renders nothing at all.** Both loops are
guarded with `{% if person %}` / `{% if pub %}`, so a misspelled id produces no
chip, no error, and no warning. After adding an item, count the chips on the
page against the ids you wrote. Convention is to list every group author on the
paper, not just the presenter.

### Adding or updating a person

Everything about a person lives in `_data/people.yaml`, a flat list covering
group members, alumni, student collaborators, and every external co-author who
appears in an author list.

**An `id` is a permanent handle for a human. Reuse it; never mint a second
one.** `publications.yaml` `authors:`, `news.yaml` `relevant_people:`,
`clusters.yaml` `authors:`, `/team#<id>` anchors, and `/people/<id>/` URLs all
key off it. A duplicate record splits a person's papers from their profile:
`where: "id" | first` silently takes whichever copy is earlier in the file, and
the build only warns if *both* copies set `use_local_homepage: true`.

| Field | Required | What it does |
| --- | --- | --- |
| `id` | yes | Permanent key, lowercase with underscores. The `/team#<id>` anchor and, with `use_local_homepage`, the `/people/<id>/` URL |
| `given_name` | yes | Displayed everywhere as `given_name family_name` |
| `family_name` | yes | Also the **sort key** for every list of people on the site |
| `membership` | group members only | Which tier they render in; omit for external co-authors |
| `homepage` | no | External URL: the "Homepage" breadcrumb, the name-link in the `/team` collaborator list, and the author link in publication lists |
| `pronouns` | no | e.g. `she/her`. Shown in parentheses after the name on their `/team` member row and `/people/<id>/` page. Nowhere else — not on the homepage grid, author lists, news chips, or the `/team` collaborator list |
| `name_recording` | no | Name-pronunciation audio: a path relative to `assets/`, e.g. `audio/steve_oney_name_pronunciation.mp3`. Renders a "Hear my name" breadcrumb link right after "Homepage" that plays the recording in place (no-JS fallback: the link opens the file), in the same places `pronouns` shows |
| `short_bio` | no | Two-line card caption on the homepage grid; the trailing sentence in the `/team` collaborator list and in the CV's "Other Mentees". Plain text, never Markdown |
| `long_bio` | no | The full paragraph on `/team` and `/people/<id>/`. Markdown |
| `profile` | no | A long-form profile — several paragraphs, with headings if you want them — shown only on `/people/<id>/`, below the headshot row and above their publications. Markdown. Needs `use_local_homepage: true`, or there is no page to put it on |
| `links` | no | Extra breadcrumb links after "Homepage": a list of `{url, description}`. Links to services listed in `_data/link_icons.yaml` (Google Scholar, GitHub, Twitter, LinkedIn, a `CV`, ...) get that service's icon automatically; add a rule there to cover a new service |
| `color` | no | Border color of their news-item chip. Nothing else |
| `headshot` | no | Path relative to `assets/`, e.g. `images/people/foo.jpg` |
| `focused_headshot` | no | Tight square crop for the small round news chips; falls back to `headshot` |
| `use_local_homepage` | no | `true` generates `/people/<id>/` and repoints their links to it |
| `aliases` | no | Vanity URLs, e.g. `[me, Steve_Oney]`: each entry `x` generates `/x/` redirecting to `/people/<id>/`, plus `/x/cv/` redirecting to their CV when `_data/cvs/<id>.yaml` exists (with the query string carried through, for the CV's toggle links). Entries are URL segments taken verbatim. Needs `use_local_homepage: true`, or every alias redirects to a 404 — the build warns |

Any other key is silently ignored.

**`membership` and the tiers.** `lead`, `member-postdoc`, and `member` appear on
the homepage grid and under "Current Members" on `/team`, in the order given by
`member_order` in `_data/group.yaml`; within a tier, order is alphabetical by
`family_name` and there is no per-person override. `alum` appears only in
`/team`'s "Ph.D. and Postdoc Alumni" section — that heading is hard-coded and
there is no separate postdoc-alum tier, so a departing postdoc becomes `alum`
too; a departing undergrad or master's student goes to
`ugrad_ms_student`, which renders as the plain bullet list under "Other
Collaborators". Omitting `membership` is correct for external co-authors.

A `membership` value that is not in `member_order` and is not `alum` or
`ugrad_ms_student` renders the person **nowhere**, with no warning — and worse,
`news_item.html` links their chip whenever `membership` is truthy, so they still
get a chip pointing at a `/team#<id>` anchor that does not exist. To add a tier,
add the string to `member_order`.

**`short_bio` vs `long_bio`** are not long and short versions of the same thing;
they render in disjoint places. `short_bio` is plain text written as a literal
block, because the homepage card CSS sets `white-space: pre-line`:

```yaml
  short_bio: |-
    Ph.D. Student
    Michigan SI
```

Nowhere else has that rule, so a two-line `short_bio` collapses into one
run-on line in the `/team` collaborator list and on the CV. Write
`ugrad_ms_student` bios as a single sentence, which is what the existing records
do. `long_bio` is markdownified and appears on `/team` and `/people/<id>/`, but
never on the homepage. In a `>-` folded `long_bio`, keep every continuation line
at the same indent — a deeper-indented line becomes a code block.

**`profile` is the long version, and it renders in exactly one place:**
`/people/<id>/`, as a full-width block under the headshot row and above their
publications. `long_bio` stays what it is — the one paragraph that introduces
them on `/team` — and the `/team` row grows a "Full profile →" link to the page
instead of growing the profile itself. That is the whole point of the split: a
profile can be as long as someone wants without `/team` turning into a wall of
text. It is Markdown, so `##` headings, lists and links all work. No record
has one today, so nothing on the site renders a profile block or a "Full
profile →" link until someone writes one.

A `profile` needs `use_local_homepage: true`, since that flag is what generates
the page. Without it the profile renders nowhere at all and `/team` looks
untouched, so the build says so:

```
DataPageGenerator: "maryam_arab" has a profile: but no page to put it on;
add `use_local_homepage: true` (bare, unquoted) to people.yaml
```

Read the `use_local_homepage` paragraph below before setting it — it also
repoints every author link on the site away from their external homepage, which
is a real trade-off for someone who maintains their own site.

**A multi-paragraph folded scalar needs two blank lines between paragraphs**, in
`profile` as in `group.yaml`'s `joining`. YAML folds a single blank line to one
`\n`, and Markdown reads one newline as a line break inside the same paragraph,
so one blank line silently runs two paragraphs into one. Headings survive it —
they are block-level and interrupt the paragraph either way — which is what
makes this hard to spot: the page keeps its structure and only the prose is
wrong. Two blank lines give the `\n\n` Markdown needs:

```yaml
  profile: >-
    ## Research


    The premise behind most of this work is that the hard part of programming
    is rarely the syntax.


    That work runs across several threads: ...
```

**Quote `color`.** `color: "#FFC14A"` is correct; unquoted, the `#` starts a
YAML comment, the field parses as null, the build succeeds, and the chip just
loses its border.

**`use_local_homepage`** is the switch that decides whether a `/people/<id>/`
page exists. Write it as a bare, unquoted `true`: the plugin compares with
`== true` while the templates only test Liquid truthiness, so
`use_local_homepage: "true"` is truthy in Liquid and false to the plugin —
every author link site-wide would point at a page that was never generated.
Setting it generates the page, repoints their `/team` "Homepage" breadcrumb at
it, and makes `_includes/author_list.html` prefer `/people/<id>/` over their
external `homepage` in every linked author list.

The flag says the local page *is* their homepage, so their own page shows no
"Homepage" breadcrumb — the link would point at the page you are already
reading. Their external `homepage` is not the fallback there either:
`steve_oney`'s is `https://from.so/Steve_Oney`, a vanity URL that redirects
straight back. If someone with this flag also keeps a real site elsewhere, put
it in `links:` with a description like `Personal site`, where it reads as one
more link rather than as a competing homepage.

`steve_oney` is the only record with the flag today, and his `aliases`
(`/me/`, `/Steve_Oney/`, plus `/me/cv/` for the CV) are meta-refresh redirects
generated from it by `_plugins/generate_alias_pages.rb` — clearing the flag
turns every alias into a redirect to a 404, which the build warns about. If
you turn it on for someone new, give them a `membership` too, or the page's
"Back to team" link lands on nothing.

**Moving someone from member to alum** is one line, `membership: member` (or
`member-postdoc`) → `membership: alum`, plus two things that do not happen
automatically:

- Their `short_bio` stops rendering anywhere (alums are not in `member_order`,
  and `member_block.html` never prints it). **Move their new title and employer
  into the first sentence of `long_bio`** or the site will keep describing them
  as a current student. This is the silent-wrong-output failure in this task.
- **Update `_data/cvs/steve_oney.yaml` by hand.** `supervised_students:` is a separate
  list matched by free-text `student_name`, with no link to the `people.yaml`
  record, so nothing propagates and nothing warns. A graduating Ph.D. advisee
  moves from `category: ongoing_advisee` to `category: dissertation_chair`, with
  `date_end` and `current_position` filled in. A departing postdoc has no
  matching category — `cv_supervision_groups.yaml` covers Ph.D. and thesis roles
  only — so there is nothing to move for them. Group headings come from
  `_data/cv_supervision_groups.yaml` and there is no catch-all, so a typo'd
  `category` makes the record vanish — that one does print a
  `cv_grouped_records:` warning.

Do **not** rename the id or delete the record; a departed member still needs to
exist for their papers to attribute correctly.

Two other data files name people by hand and are not derived from
`people.yaml`, so check whether a new member belongs in them:
`_data/clusters.yaml` (`authors:` per cluster, rendered as the "People:" line on
`/research`) and `_data/cvs/steve_oney.yaml` (`supervised_students:`).

A complete member record:

```yaml
- id: jamie_rivera
  given_name: Jamie
  family_name: Rivera
  membership: member
  homepage: https://jamierivera.example.edu/
  pronouns: they/them
  name_recording: audio/jamie_rivera_name_pronunciation.mp3
  short_bio: |-
    Ph.D. Student
    Michigan SI
  long_bio: >-
    Jamie Rivera is a Ph.D. student at the [University of Michigan School of
    Information](https://www.si.umich.edu/), advised by [Steve Oney](https://from.so/Steve_Oney).
    Jamie studies how novice programmers debug asynchronous code.
  color: "#6FA8A0"
  links:
    - url: https://scholar.google.com/citations?user=EXAMPLE
      description: Google Scholar
    - url: https://github.com/jamierivera
      description: GitHub
  headshot: images/people/jamie_rivera.jpg
  focused_headshot: images/people/jamie_rivera_focused.jpg
```

`links[].url` is emitted verbatim — it is not passed through `relative_url`.
Site-relative paths work because `baseurl` is `""`, but every link, internal
ones included, gets `target="_blank"`.

This check catches the four `people.yaml` failures that produce no build output
at all (clean output today is `checked 120 records`):

```bash
ruby -ryaml -e '
people = YAML.load_file("_data/people.yaml")
tiers = YAML.load_file("_data/group.yaml")["member_order"] + ["alum", "ugrad_ms_student", nil]
images = Dir.children("assets/images/people")
ids = Hash.new(0)
people.each do |p|
  ids[p["id"]] += 1
  warn "BAD TIER  #{p["id"]}: #{p["membership"].inspect}" unless tiers.include?(p["membership"])
  warn "NIL COLOR #{p["id"]} (quote the #hex)" if p.key?("color") && p["color"].nil?
  %w[headshot focused_headshot].each do |k|
    v = p[k].to_s
    next if v.empty?
    ok = v.start_with?("images/people/") && images.include?(File.basename(v))
    warn "BAD IMAGE #{p["id"]} #{k}: #{v}" unless ok
  end
end
ids.select { |_, n| n > 1 }.each { |id, n| warn "DUP ID    #{id} (#{n}x)" }
puts "checked #{people.size} records"
'
```

The image check compares against `Dir.children` rather than calling
`File.exist?`, so it catches a `.JPG`/`.jpg` mismatch even on a
case-insensitive filesystem, and catches a path written with a leading slash or
an `assets/` prefix.

### Adding a writing entry

Writing lives in `_data/blog.yaml`, a flat list. Each record produces two
things: a row on `/writing/`, and its own page at `/writing/<slug>/` rendered by
`_layouts/writing.html`. The prose itself stays in the Google Doc — the
generated page is a landing page that names the document, credits it, and links
out to it.

| Key | Required | What it does |
| --- | --- | --- |
| `id` | yes | Lookup key. The generated page carries it; nothing else references it |
| `slug` | effectively yes | The URL: `/writing/<slug>/`. Permanent once published |
| `title` | yes | Heading, `<title>`, and the link text on `/writing/` |
| `description` | no | One line under the title, and the link preview text |
| `created` | effectively yes | Sort key and the displayed date |
| `google_doc` | yes | Target of the "Read the document" button |
| `authors` | yes | List of `people.yaml` ids |

```yaml
- id: spot_phd_application_guide_2024-11-06
  slug: SPOT_PhD_Application_Guide
  title: SPOT PhD Application Guide
  description: The SPOT group's guide for prospective Ph.D. applicants.
  created: "2024-11-06"
  google_doc: >-
    https://docs.google.com/document/d/e/2PACX-1vQJ41KZ.../pub
  authors:
    - steve_oney
```

**The point of `slug` is that the URL is the thing you send people, so it has to
outlive edits to the entry.** `id` encodes the creation date and `title` can be
rewritten; neither is a safe basis for a URL that is already sitting in other
people's inboxes. Pick a slug that reads well in an email — the convention is
the title with spaces as underscores, keeping capitalisation, as in
`SPOT_PhD_Application_Guide` — and then treat it as permanent. Changing it later
404s every link already sent, with no build error and nothing on the site to
show for it. At least one is also hard-coded in `_data/group.yaml`'s `joining`
text, so grep before you touch one.

**Omitting `slug` is legal and silent.** The URL falls back to the `id`, so the
entry lands at `/writing/spot_phd_application_guide_2024-11-06/` — it works, it
is just not a URL anyone wants to paste. Two entries resolving to the same slug
*is* reported: `DataPageGenerator` warns and keeps the first, so the second entry
has no page while still appearing on `/writing/` with a link to the first one's.

**`google_doc` must be the published URL, not the edit URL.** Docs' "Publish to
the web" gives a `/d/e/2PACX-.../pub` link that anyone can open; a `/d/<id>/edit`
URL sends most readers to a permission-request screen instead, which builds and
renders identically. Use the `>-` folded form, as above, so the long URL can wrap.

**`created` sorts as a string,** exactly as in [Adding a news
item](#adding-a-news-item): `/writing/` does `sort: "created" | reverse`, so only
zero-padded ISO `YYYY-MM-DD` orders correctly, and a malformed date floats to the
top. Quote it.

**`description` is optional but it is what the link preview says.** Without one,
a `/writing/` URL pasted into Slack or a mail client falls back to the site-wide
description from `_config.yml`, which says nothing about the document. One
factual sentence is enough. Author ids behave as everywhere else — an id with no
`people.yaml` record renders as the raw string.

### Adding a course you taught

One record in `_data/teaching.yaml`. It is the single source behind two
sections — the CV's Teaching section and the one at the bottom of
`/people/<id>/` — so there is nothing to add in a second place, and no way for
the two to drift apart:

```yaml
  - person: steve_oney
    title: Instructor – SI 379 (Building Interactive Applications)
    institution: University of Michigan
    date_start: "2023"
    date_end: present
```

- **`person` is a people.yaml id**, and it is the whole of how a record finds
  its way onto a page. A typo is silent in the usual way: the entry renders
  nowhere, on neither the CV nor the page.
- **File order is display order**, newest first, on both. Nothing sorts these —
  the dates are prose ("Fall 2007 & Spring 2008") and there is no key to sort
  on.
- **Quote a bare year**: `date_start: "2023"`. Unquoted it is an integer, which
  still renders, but the cutoff below is the only thing that reads these and it
  is easier to keep one shape.
- `date_end: present` marks a course as still running. Nothing else means that;
  `ongoing` and `current` are accepted as synonyms and no other value is.
- `description` is Markdown, and both sections render it inline. Use the `>-`
  folded block for anything with a `[`, a `: ` or a `#` in it, as everywhere
  else in `_data/`.

**The page shows a subset of the CV's list, and there are two ways to control
it** (both applied by `_plugins/teaching_entries.rb`):

- **`page_since`**, at the top of the file, is a year: an entry whose last year
  falls before it stays on the CV only. It is 2016 today — the first Michigan
  course — so it cuts the CMU and MIT teaching and nothing else. An entry with
  `date_end: present` is never cut, whenever it started.
- **`cv_only: true`** on one record keeps that record off the page regardless
  of its dates. This is the one to reach for when the call is per-course rather
  than "everything before year N"; the cutoff is the coarse net.

The cutoff reads the years out of the date strings, taking the latest one it
finds in either field — so "Fall 2025, Fall 2026" is a 2026 entry and
`date_start: Spring 2005` / `date_end: Fall 2006` is a 2006 one. An entry it
can find no year in at all is kept rather than dropped.

The section appears on any person page whose person has records here, and does
not appear at all when they have none, so this is not Steve-specific. Neither
is the CV: each `/people/<person_id>/cv/` renders the entries for its own
person, and nothing else reads the file.

Check both after adding one: `/people/steve_oney/cv/` (the full list, in
place) and
`/people/<id>/#teaching` (the section under Publications, three columns on a
desktop). That anchor and `#publications` are the person page's two section
ids; like a `blog.yaml` slug they are links meant to be sent to people, so
treat them as permanent. The bio section keeps the person's own id, so
`/team#<id>` and `/people/<id>/#<id>` name the same person.
If a new entry is missing from the page but present on the CV, its last year is
below `page_since` — that is the mechanism working, not a bug.

### Updating a profile picture

A photo is an image file under `assets/images/people/` plus one or two path
fields on that person's `people.yaml` record. There is no image pipeline and
nothing resizes anything — Jekyll copies `assets/` verbatim and the templates
interpolate the path. The images are committed to the repo, so a photo change is
a normal commit containing a binary file plus a YAML edit.

| Field | Where it renders | Size on screen | Cropping |
| --- | --- | --- | --- |
| `headshot` | homepage People grid | square tile, ~220 CSS px | **center-cropped to a square**, and grayscale until hover |
| `headshot` | `/team` rows, including Ph.D. and Postdoc Alumni | ~165–190 CSS px | not cropped (`img-fluid`) |
| `headshot` | `/people/<id>/` | ~260–300 CSS px, **linked to the full-resolution file** | not cropped |
| `focused_headshot` | news chips on `/` and `/news` | **20×20 CSS px circle**, bordered in the person's `color` | forced to 20×20 with no `object-fit` — a non-square image is **stretched** |

Both fields are optional and every template guards with `{% if photo %}`, so a
missing image is omitted rather than erroring.

Two consequences worth internalizing. `focused_headshot` should be a **tight
crop on the face**: at 20px a shoulders-down shot is an unreadable smudge, and
on the homepage `ul.news-list.short` hides the chip's name, so the circle *is*
the entire chip. And **the fallback goes one direction only** —
`news_item.html` does `focused_headshot | default: headshot`, but `headshot` is
read raw everywhere else, so setting only `focused_headshot` leaves the homepage
grid, `/team`, and `/people/<id>/` with no photo at all. (Liquid's `default`
also fires on an empty string, so `focused_headshot: ""` falls back rather than
removing the chip image.)

**Prepare the file.** Square, JPEG or PNG, sRGB. iPhone HEIC/HEIF files are
copied into `_site` without complaint and simply do not render in browsers, so
convert first. Aim for **1000×1000 under ~500 KB** for `headshot` (the largest
display is ~300 CSS px, but `/people/<id>/` links the image to itself, so a
click should reward you with something bigger) and **400×400 under ~100 KB** for
`focused_headshot` (it displays at 20px, and `/news` emits dozens of them).
Crop to square yourself — the homepage center-crops while `/team` does not, so
an off-center face looks fine on one page and decapitated on the other:

```bash
cd /home/soney/nucode/spot-web
python3 -c "
from PIL import Image, ImageOps
im = ImageOps.exif_transpose(Image.open('/path/to/new-photo.jpg')).convert('RGB')
s = min(im.size)
im = ImageOps.fit(im, (s, s), centering=(0.5, 0.35))
im.thumbnail((1000, 1000))
im.save('assets/images/people/jamie_rivera.jpg', quality=88, optimize=True)
print(im.size)
"
```

(`exif_transpose` fixes phone-rotated photos; `centering=(0.5, 0.35)` biases the
crop toward the upper third, where a face usually is.)

**Use a new filename — do not overwrite the old file in place.** Overwriting
leaves the URL unchanged, so the browser and the GitHub Pages CDN keep serving
the old photo and the edit looks like it silently failed. Then point the record
at it, **relative to `assets/`**, with no leading slash and no `assets/` prefix:

```yaml
  headshot: images/people/jamie_rivera.jpg
  focused_headshot: images/people/jamie_rivera_focused.jpg
```

Extension case matters: several existing files end in `.JPG`, not `.jpg`, and a
mismatch works on a case-insensitive filesystem (macOS) while 404ing on
from.so. The `people.yaml` checker in
[Adding or updating a person](#adding-or-updating-a-person) compares against the
files on disk and catches both that and a wrong prefix. If an image doesn't
appear in the browser, view source: a doubled `/assets/assets/...` means the
path was written with the prefix.

Commit the image and the YAML together, and `git rm` the old file after
`grep -rn "<old-filename>" _data/` comes back empty.

**Adding a photo to someone who has none** only shows up if their `membership`
puts them somewhere that renders one. `ugrad_ms_student` is a text-only list and
the homepage grid iterates only `group.yaml`'s `member_order`, so a `headshot`
on such a record displays nowhere. It becomes visible on `/team` for the three
member tiers and for `alum`; on the homepage grid for the three member tiers
only; and on a news chip for *any* record, even one with no `membership`.

### Exporting the CV as a PDF

```bash
script/export_cv_pdf.sh                      # oney_cv.pdf in the repo root
script/export_cv_pdf.sh ~/Desktop/cv.pdf     # somewhere else
script/export_cv_pdf.sh --students --awards  # the CV page's toggles, as flags
script/export_cv_pdf.sh --person=<id> out.pdf  # another _data/cvs/ CV
```

You rarely need to run this by hand: the deploy workflow runs it on every
push to `main`, writing `_site/oney_cv.pdf`, so the live site always serves a
fresh PDF at <https://from.so/oney_cv.pdf> and the web CV's "Download PDF"
link (screen-only; print hides it so the PDF never links to itself) always
resolves. Locally that link 404s under `npm run develop` until you export
one yourself with `script/export_cv_pdf.sh _site/oney_cv.pdf` — and the next
build wipes it again.

The script builds the site, serves `_site` on a free port, and prints
`/people/steve_oney/cv/` with headless Chrome. There is no second layout to
maintain: the
`@media print` block in `assets/css/cv.css` — which reproduces the typography
of the old LaTeX CV that predates the web version (its `oneycv.cls` and
reference PDF live untracked in the maintainer's checkout, under `old-cv/`)
— is the single source of truth, so the script's output is exactly
what File > Print in Chrome produces. Printing from the browser works the
same way, and the toggles carry over: print
`/people/steve_oney/cv/?students=true&awards=true` to get the flagged
variants.

Four things worth knowing:

- **The gray page footer needs Chrome 131 or newer** — it is a CSS
  `@page` margin box, which Firefox and Safari do not implement. Printing
  from those browsers loses the footer and nothing else.
- **The Typekit webfont needs network.** Offline, the PDF falls back to a
  generic serif and looks visibly wrong.
- **Every checkbox on the CV page is a flag.** The script reads its flag
  list from `_includes/cv_body.html`'s `cv_toggle` includes at run time, so a
  new checkbox becomes a flag with no script edit (`--help` prints the
  current list). Each flag maps to its checkbox's URL parameter (`--students` to
  `?students=true`), so a flagged export shows exactly what the browser
  shows with that toggle on.
- **The default output name `oney_cv.pdf` is deliberately protected**: it is
  gitignored and in `_config.yml`'s `exclude`, because a root-level file
  with any other name would be copied into `_site` by the next build and
  published. If you pass a custom output path, keep it outside the repo —
  or inside `_site/`, which is what the deploy workflow does: Jekyll never
  copies `_site` into itself, and the next build simply wipes it.

The script detects `google-chrome`, `chromium`, or the macOS Chrome app;
`CHROME=/path/to/chrome` overrides. It retries with `--no-sandbox` only if
the first attempt fails, which containers sometimes need.

### Checking your work

First time on a machine, `bundle install` (see
[Local development](#local-development); there is no `npm install` step). Then:

```bash
npm run develop        # = bundle exec jekyll serve --livereload
```

Editing `_data/*.yaml` while the server runs regenerates the site *and* the
generated paper, person and writing pages — a brand-new record goes from 404 to
200 without a restart. Do not use `--detach`; it disables the watcher, and the
message saying so is easy to miss.

Depending on what you changed, check:

- `http://127.0.0.1:4000/papers/<id>/` — title, authors (all linked or plainly
  named, **never a raw id**), abstract, venue label, award, PDF button
- `http://127.0.0.1:4000/research#pub-<id>` — the row is in the right position
  with the right venue label, and the anchor actually scrolls to it
- `http://127.0.0.1:4000/` — "Recent Publications" (venues from
  `group.recent_pub_cutoff_year`, currently 2019, onward), the People grid, and
  the newest four news items
- `http://127.0.0.1:4000/news` — full news list, in the right order, with the
  right number of chips
- `http://127.0.0.1:4000/team` and any `#<id>` anchor you linked
- `http://127.0.0.1:4000/writing/` and the `/writing/<slug>/` page behind each
  title — the slug in the URL bar is the one you meant, and "Read the document"
  opens the Doc without a permission prompt (check it signed out, or in a
  private window; signed in as its owner, an unpublished Doc opens fine for you
  and for nobody else)
- `http://127.0.0.1:4000/people/steve_oney/cv/?students=true&awards=true` — the
  citation, its `C.n` code, the student underlines, and the award entry. Both
  toggles are off by default
- `http://127.0.0.1:4000/people/steve_oney/` — the only per-person page today.
  Its Teaching section is the same `_data/teaching.yaml` the CV renders, minus
  the entries `page_since` and `cv_only` hold back, so check a course edit in
  both places

Run a clean `bundle exec jekyll build` once and read the output. That is where
`DataPageGenerator` and `cv_grouped_records` warnings appear; they scroll past
easily during serve.

If you touched a PDF, also run the audit:

```bash
ruby script/pdf_audit.rb
```

It reports PDFs in `assets/pdfs/` that no record references, and records whose
`pdf:` names a file that does not exist. Neither is a build error — the second
renders a button that 404s — so this is the only thing that catches them.
`--verify-names` additionally checks every referenced PDF against the naming
convention. Claude Code runs the audit automatically via a `UserPromptSubmit`
hook in `.claude/settings.json`, and `/add-paper` walks the whole recipe above.

Then push to `main`; see [Deploy](#deploy).

## Working with a coding agent

`AGENTS.md` at the repo root is the instruction file for coding agents, and
`CLAUDE.md` points Claude Code at it. Both are deliberately short: they cover
the architecture and the invariants that fail silently, and point back to this
file for the task recipes above. If you change a rule here that an agent needs
to know, check whether `AGENTS.md` states it too. Both files are listed in
`exclude` in `_config.yml` so they are not published to from.so.
