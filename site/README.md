# Articulate Website

This directory contains the Astro source for the public Articulate website.

The site lives in `site/` to keep the narrative website source separate from future application code in `src/`, long-form repository documentation in `docs/`, and generated GitHub Pages output in `site/dist/`.

## Local Development

```sh
npm install
npm run dev
```

Useful checks:

```sh
npm run check
npm run build
```

The production build is written to `site/dist/`.

## Content Organisation

Primary content is stored in Astro content collections:

```text
src/content/
├── episodes/
├── patterns/
├── decisions/
└── experiments/
```

Markdown and MDX are the intended authoring formats. Collection schemas are defined in `src/content.config.ts`.

## Front Matter Conventions

Use stable identifiers for relationships. Do not depend on display titles or hard-coded paths.

Episodes can relate to decisions, patterns, experiments, and repository paths:

```yaml
id: episode-0001
title: Why Articulate Exists
published: 2026-07-11
updated: 2026-07-11
status: draft
sequence: 1
season: foundations
topics:
  - ai-native-architecture
related_decisions:
  - adr-0001
repository_paths:
  - README.md
```

Supported Episode statuses are:

```text
draft
exploratory
current
partially-revised
superseded
historical
```

## Adding an Episode

1. Create a Markdown file in `src/content/episodes/`.
2. Give it a stable `id`, such as `episode-0002`.
3. Fill in `title`, `summary`, `published`, `updated`, `status`, `sequence`, `season`, `topics`, and relationship fields.
4. Link related decisions, patterns, and experiments by their stable identifiers.
5. Add repository evidence through `repository_paths`.
6. Run `npm run check` and `npm run build`.

## GitHub Pages Deployment

The site is configured for repository-based GitHub Pages hosting:

```js
site: "https://russelleast.github.io"
base: "/articulate"
```

The workflow at `.github/workflows/deploy-site.yml` installs dependencies, runs Astro checks, builds the site, uploads `site/dist`, and deploys it using GitHub Pages.

Deployment currently runs on pushes to `main` that affect `site/**` or the workflow file. It can also be started manually with `workflow_dispatch`.
