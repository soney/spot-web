# SPOT Group Website (Jekyll)

This repository powers [from.so](https://from.so) using [Jekyll](https://jekyllrb.com/).

## Local development

1. Install Ruby gems:

```bash
bundle install
```

2. Build and serve:

```bash
bundle exec jekyll serve --livereload
```

3. Open `http://127.0.0.1:4000`.

## Content pipeline (Strapi export -> Jekyll `_data`)

Raw Strapi export files live under `strapi-export/`.

Run the conversion pipeline:

```bash
npm run convert:strapi
```

This will:

1. Regenerate `strapi-export/yaml_out/*.yaml` from exported JSONL.
2. Normalize content into Jekyll data files in `_data/`:
   - `people.yaml`
   - `venues.yaml`
   - `clusters.yaml`
   - `publications.yaml`
   - `blog.yaml`
   - `news.yaml`
   - `group.yaml`
   - `leadcv.yaml`

## Deploy

```bash
npm run deploy
```

This builds to `_site/` and publishes via `gh-pages`.
