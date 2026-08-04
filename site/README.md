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
npm run validate:seo:source
npm run build
npm run validate:seo:build
npm test
npm run test:publishing
npm run lighthouse:seo
```

The production build is written to `site/dist/`.

`validate:seo:source` checks authoring metadata and writes `reports/seo-source.json`.
`validate:seo:build` checks the generated site and merges those findings into
`reports/seo-report.md` and `reports/seo-report.json`. Run the source command before building so the
merged report is complete. `validate:seo` is a fail-fast local convenience; CI deliberately
continues far enough to upload a complete report before enforcing the gate.

## Content Organisation

Primary narrative and decision content is stored in the repository documentation tree and loaded as
Astro content:

```text
../docs/episodes/
../docs/adrs/
```

Reference content owned by the website is stored in Astro content collections:

```text
src/content/
├── principles/
├── patterns/
└── experiments/
```

Markdown and MDX are the intended authoring formats. Collection schemas are defined in `src/content.config.ts`.

## Front Matter Conventions

Use stable identifiers for relationships. Do not depend on display titles or hard-coded paths.

Episodes can relate to principles, decisions, patterns, experiments, and repository paths:

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
related_principles:
  - coherence-before-size
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

1. Create a Markdown file in `../docs/episodes/`.
2. Give it a stable `id`, such as `episode-0002`.
3. Fill in `title`, `summary`, `published`, `updated`, `status`, `sequence`, `season`, `topics`, and relationship fields.
4. Link related principles, decisions, patterns, and experiments by their stable identifiers.
5. Add repository evidence through `repository_paths`.
6. Optionally add `thumbnail` and `youtube_url` when companion media is published.
7. Keep the canonical PNG under `production/episodes/<episode>/publication/thumbnail/` and set
   `thumbnail` to `/media/episodes/<episode>/<same-filename>.png`. Site commands stage that production
   asset into `site/public`; do not edit the staged copy.
8. Run `npm run check` and `npm run build`.

## Adding an Architecture Decision

1. Create the canonical ADR in `../docs/adrs/`.
2. Add front matter with a stable display `id`, `title`, lifecycle `status`, related Episode
   references, and repository paths.
3. Add `decided` only when the ADR records a decision date; do not invent one for draft or proposed
   records.
4. Link related Episodes back to the ADR through `related_decisions`.
5. Run `npm run check`, `npm run build`, and `npm run test:publishing`.

## Adding an Architectural Principle

1. Create a Markdown or MDX file in `src/content/principles/`.
2. Give it a stable content `id` and use a stable filename; the filename becomes the route and the
   relationship identifier used by other collections.
3. Record its `title`, `summary`, lifecycle `status`, `published` and `updated` dates, concise
   `principle` statement, `rationale`, `consequences`, and `applies_to` areas.
4. Connect Episodes, decisions, and patterns with collection references. Architecture relationships
   use stable section identifiers until architecture becomes its own collection.
5. Add the reciprocal `related_principles` reference to related Episodes.
6. Run `npm run check`, `npm run build`, and `npm run test:publishing`.

Episodes with `published: false`, `status: draft`, or `status: planned` are authoring content only.
They are excluded from generated Episode routes, navigation, the home page, the sitemap, and RSS.

The Episode query boundary normalises legacy `description` to `summary`, `episode` to `sequence`,
numeric season values to strings, and missing stable IDs. For new content, prefer `id`, `sequence`,
`summary`, and a numeric season. The Episodes index maps the existing `foundations` and `1` values to
Season 1, and `2` to Season 2, without requiring a risky migration of canonical Episodes.

## Discoverability and SEO

Site-wide identity and production URL helpers live in `src/utils/site.ts`. Astro's deployment origin
and GitHub Pages repository base path remain configured in `astro.config.mjs`:

```js
site: "https://russelleast.github.io"
base: "/articulate"
```

`src/components/Seo.astro` is the single rendering boundary for HTML metadata. `BaseLayout.astro`
uses it for every indexable HTML page, so pages should provide metadata through layout properties
rather than adding tags directly to `<head>`.

Every page receives:

- a human-readable title with the Articulate identity appended once;
- a description, falling back to the global site description;
- a production canonical URL that includes the GitHub Pages base path and trailing slash;
- Open Graph and Twitter/X card metadata;
- `WebSite` JSON-LD.
- a default Open Graph/Twitter image when the content has no specific artwork.

Episode, decision, and principle detail pages add breadcrumb structured data. Episode pages use the
Episode thumbnail as their social image where available.

Episode pages additionally receive `article` Open Graph metadata and `Article` JSON-LD. The values
come from the Episode's canonical front matter:

| Front matter | Publishing output |
| --- | --- |
| `title` | title, Open Graph/Twitter title, JSON-LD headline |
| `summary` | description, Open Graph/Twitter description, JSON-LD description |
| `published` | article publication time and JSON-LD publication date |
| `updated` | article modification time and JSON-LD modification date |
| `topics` | article tags and JSON-LD keywords |
| `author` (optional) | HTML author and JSON-LD Person |
| `image` (optional) | absolute Open Graph, Twitter/X, and JSON-LD image URL |
| `thumbnail` (optional) | episode companion-video artwork and social image fallback |
| `youtube_url` (optional URL) | companion-video link on the Episode listing and page |

`author`, `image`, `thumbnail`, and `youtube_url` are optional to preserve compatibility with existing
Episodes. If `image` is absent, an Episode thumbnail is used for social metadata. If neither exists,
the site emits a summary card and does not invent an image URL.

`scripts/stage-episode-media.mjs` derives each production source from the `thumbnail` URL and copies
it before development, checking, and building. This keeps production artwork as the single editable
source while satisfying Astro's requirement that static assets exist under `site/public`.

The same publication step validates registered diagram references in published Episodes. Authors use
`/diagrams/<diagram-id>.svg`; the Markdown pipeline adds Astro's configured base path, and the build
publishes the registered generated SVG from `site/public/diagrams/`. The D2 and PlantUML source and authoring
workflow are documented in [`production/diagrams/README.md`](../production/diagrams/README.md).

The official `@astrojs/sitemap` integration generates `sitemap-index.xml` and `sitemap-0.xml` during
the production build. `src/pages/robots.txt.ts` permits normal crawling and points crawlers to that
sitemap index. `src/pages/rss.xml.ts` generates `/articulate/rss.xml` from the same published Episode
collection and excludes drafts.

### Automated SEO validation

Source errors cover missing or blank metadata, invalid dates, invalid or duplicate Episode
sequences, duplicate titles, unresolved relationships, invalid repository paths, missing local
media, and missing image or thumbnail alt text. Exact duplicate descriptions and description-length
guidance are warnings; length is never a semantic quality gate.

Generated-output errors cover title/description/canonical/Open Graph/Twitter metadata, JSON-LD,
internal routes and fragments, local assets, image accessibility, sitemap completeness, robots
rules, base-path mistakes, and duplicate GA4 or Clarity inclusion. External URLs are not fetched, so
transient third-party failures cannot block deployment.

GitHub Actions writes the main findings to the workflow summary and uploads `site/reports/` as an
`seo-report-<run id>` artifact. Deterministic errors block Pages deployment. Warnings and Lighthouse
scores remain non-blocking. If a canonical check fails, confirm the generated URL starts with
`https://russelleast.github.io/articulate/` and contains the `articulate` segment exactly once.

Submit `https://russelleast.github.io/articulate/sitemap-index.xml` to Google Search Console.

## Analytics

Google Analytics 4 and Microsoft Clarity are installed in the shared `BaseLayout.astro` head. SEO
validation only reports whether they appear and fails on duplicate inclusion, which could duplicate
page views or sessions. It does not configure analytics, add events, or alter consent behaviour. The
optional legacy provider boundary in `src/components/Analytics.astro` remains unchanged and outside
this SEO-validation capability.

## Google Search Console

1. Add the HTML-tag verification value (the token only, not the complete meta tag) as a GitHub
   Actions repository variable named `PUBLIC_GOOGLE_SITE_VERIFICATION`.
2. Rebuild and deploy. The optional verification meta tag will then appear on every HTML page.
3. Complete verification in Search Console.
4. Submit `https://russelleast.github.io/articulate/sitemap-index.xml`.

Do not commit a live verification value. As with analytics configuration, this public value is
passed into the build by `.github/workflows/deploy-site.yml`.

The complete source, output, social-preview, Search Console, and analytics verification workflow is
documented in [`../docs/website/seo-and-insights.md`](../docs/website/seo-and-insights.md). A valid
build proves output is present; it does not prove external configuration, discovery, indexing,
search impressions, or received analytics events.

## GitHub Pages Deployment

The site is configured for repository-based GitHub Pages hosting:

```js
site: "https://russelleast.github.io"
base: "/articulate"
```

The workflow at `.github/workflows/deploy-site.yml` installs dependencies, runs Astro checks, builds the site, uploads `site/dist`, and deploys it using GitHub Pages.

Deployment currently runs on pushes to `main` that affect `site/**`, `docs/episodes/**`, or the workflow file. It can also be started manually with `workflow_dispatch`.
