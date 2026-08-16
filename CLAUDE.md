# CLAUDE.md

**Read [AGENTS.md](AGENTS.md) first — it is the canonical instruction file for
this repo.** It covers what the project is, the architecture, how to run and
verify a change, the invariants that fail silently, and how deployment works.
Everything there applies to Claude Code; this file only adds what is specific to
it. The split exists so there is one place to update when a rule changes.

The three-line version, so you do not start work with a stale assumption:
content is YAML in `_data/` and the templates are thin views over it;
`/papers/<id>/` and `/people/<id>/` are generated at build time by
`_plugins/generate_data_pages.rb`, never written to disk; and records reference
each other by `id`, where reusing an existing person's id is mandatory and
minting a second one silently splits their work.

## Claude Code specifics

- **Read the relevant recipe in `README.md` ("Common tasks") before editing
  `_data/`,** rather than inferring a record's shape from the templates or from
  the neighboring YAML. Copying the record above and changing the values is how
  the silent failures listed in `AGENTS.md` get introduced.
- **For an output-neutral change, diff `_site` before and after** (recipe in
  `AGENTS.md`). Liquid fails soft, so a template refactor that silently drops a
  field looks identical in the terminal to one that worked. This is the single
  highest-value habit in this repo, and it is cheap — the build takes under a
  second.
- **Verify in a browser, not just in `_site`.** Several failures here render as
  valid HTML: a chip whose anchor goes nowhere, an author name that is actually
  a raw id, a CV entry hidden behind a toggle. `npm run develop` serves at
  `http://127.0.0.1:4000`; drive it with the Chrome tools if they are available,
  and remember `/people/steve_oney/cv/?students=true&awards=true`.
- **Use `Grep`/`Read` to find a record.** The `_data` files are single long YAML
  lists; `grep -n "^- id:" _data/people.yaml` or a search for a family name gets
  you there faster than parsing the file.
- **`bundle exec` everything.** `.bundle/config` sets `BUNDLE_PATH` to
  `vendor/bundle`, so a bare `jekyll` will not find the right gems.
- **Do not commit or push** unless explicitly asked — a push to `main` deploys
  to the live site.
