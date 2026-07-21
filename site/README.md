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
npm run test:publishing
```

The production build is written to `site/dist/`.

## Content Organisation

Primary narrative content is stored in the repository documentation tree and loaded as Astro content:

```text
../docs/episodes/
```

Reference content owned by the website is stored in Astro content collections:

```text
src/content/
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

1. Create a Markdown file in `../docs/episodes/`.
2. Give it a stable `id`, such as `episode-0002`.
3. Fill in `title`, `summary`, `published`, `updated`, `status`, `sequence`, `season`, `topics`, and relationship fields.
4. Link related decisions, patterns, and experiments by their stable identifiers.
5. Add repository evidence through `repository_paths`.
6. Optionally add `thumbnail` and `youtube_url` when companion media is published.
7. Put web-facing thumbnails under `site/public/media/episodes/<episode>/`; production masters remain under `production/episodes/<episode>/publication/`.
8. Run `npm run check` and `npm run build`.

Episodes with `status: draft` are authoring content only. They are excluded from generated Episode
routes, navigation, the home page, the sitemap, and RSS. Other lifecycle statuses are public.

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
| `youtube_url` (optional URL) | companion-video link on the Episode page |

`author`, `image`, `thumbnail`, and `youtube_url` are optional to preserve compatibility with existing
Episodes. If `image` is absent, an Episode thumbnail is used for social metadata. If neither exists,
the site emits a summary card and does not invent an image URL.

The official `@astrojs/sitemap` integration generates `sitemap-index.xml` and `sitemap-0.xml` during
the production build. `src/pages/robots.txt.ts` permits normal crawling and points crawlers to that
sitemap index. `src/pages/rss.xml.ts` generates `/articulate/rss.xml` from the same published Episode
collection and excludes drafts.

## Privacy-first Analytics

Analytics is centralized in `src/components/Analytics.astro` and included by `BaseLayout.astro`.
It is disabled by default and emits no analytics network script or event API unless a supported
provider and domain are configured at build time. Plausible is the initial supported provider.

Copy `.env.example` to `.env` for local testing, or define these GitHub Actions repository variables
for production:

```text
PUBLIC_ANALYTICS_PROVIDER=plausible
PUBLIC_ANALYTICS_DOMAIN=russelleast.github.io
PUBLIC_ANALYTICS_SCRIPT_URL=https://plausible.io/js/script.js  # optional override
```

All variables are deliberately `PUBLIC_` values because Astro embeds them into the generated HTML.
They must not contain secrets. Remove `PUBLIC_ANALYTICS_PROVIDER` or `PUBLIC_ANALYTICS_DOMAIN` to
disable analytics completely.

Plausible captures its normal privacy-focused page view data, including page URL and referrer.
No advertising identifier, fingerprinting code, or user profile is added by Articulate. Episode
pages also expose provider-neutral context (`content_type`, zero-padded Episode number, and series)
through body data attributes. The integration installs a small provider-neutral API for meaningful
future events:

```js
window.articulateAnalytics?.trackEvent("Next Episode", { destination: "0004" });
```

The API merges Episode context into custom-event properties without putting Plausible calls into UI
components. No interaction events are instrumented yet; add only a small number of intentional
engagement events when their owning components and measurement questions are established. A future
provider can replace `Analytics.astro` while preserving that boundary.

## Google Search Console

1. Add the HTML-tag verification value (the token only, not the complete meta tag) as a GitHub
   Actions repository variable named `PUBLIC_GOOGLE_SITE_VERIFICATION`.
2. Rebuild and deploy. The optional verification meta tag will then appear on every HTML page.
3. Complete verification in Search Console.
4. Submit `https://russelleast.github.io/articulate/sitemap-index.xml`.

Do not commit a live verification value. As with analytics configuration, this public value is
passed into the build by `.github/workflows/deploy-site.yml`.

## GitHub Pages Deployment

The site is configured for repository-based GitHub Pages hosting:

```js
site: "https://russelleast.github.io"
base: "/articulate"
```

The workflow at `.github/workflows/deploy-site.yml` installs dependencies, runs Astro checks, builds the site, uploads `site/dist`, and deploys it using GitHub Pages.

Deployment currently runs on pushes to `main` that affect `site/**`, `docs/episodes/**`, or the workflow file. It can also be started manually with `workflow_dispatch`.
