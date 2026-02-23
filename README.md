# SPOT Group Website (Jekyll)

This repository powers [from.so](https://from.so) using [Jekyll](https://jekyllrb.com/).

## Local development

1. Install dependencies:

```bash
bundle install
npm install
```

2. Build and serve:

```bash
npm run develop
```

3. Open `http://127.0.0.1:4000`.

## Deploy

```bash
npm run deploy
```

This builds to `_site/` and publishes via `gh-pages`.

## Adding a new paper

1. Add the _venue_ to `_data/venues.yaml` (if it doesn't already exist).
2. Ensure all the _authors_ are listed in `_data/people.yaml`.
3. Add the paper to `_data/publications.yaml`.
   - Ensure the `venue` field matches the `id` in `_data/venues.yaml`.
   - Ensure the `authors` field contains the `id` of each author in `_data/people.yaml`.
4. Run `npm run develop` to build and serve the site.
   - Note: You might need to re-run `npm run develop` to regenerate the paper _page_ (e.g., `/papers/...`)
5. Verify the paper is displayed correctly.
6. Run `npm run deploy` to deploy the site.
