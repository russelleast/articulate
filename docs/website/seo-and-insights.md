# Website SEO and insights

## What the repository implements

The website has one metadata boundary: `site/src/components/Seo.astro`, used by
`BaseLayout.astro`. Page templates provide their title, description, canonical path, article dates,
topics, social image, and breadcrumb context through that layout. The component emits canonical,
Open Graph, Twitter/X, and JSON-LD metadata. A default journal image is used when a page has no
content-specific image; Episode thumbnails take precedence on Episode detail pages.

Astro is configured with the production origin `https://russelleast.github.io` and the GitHub Pages
base path `/articulate`. The sitemap integration emits `sitemap-index.xml` and `sitemap-0.xml`.
`robots.txt` permits crawling and references the sitemap. `rss.xml` contains published Episodes only.

These are publishing and discovery mechanisms. Their presence does not prove that a crawler has
discovered a page, Google has indexed it, or the page has received search impressions.

## Verify rendered output locally

From `site/`:

```sh
npm ci
npm run check
npm run build
npm run preview
```

Open a page in the browser and inspect the document `<head>`. Confirm that the title, description,
canonical URL, Open Graph URL and image all describe that specific page and use the production
`/articulate/` path. Episode, decision, and principle detail pages should also contain a
`BreadcrumbList`; published Episodes contain Article JSON-LD using their canonical dates and topics.

Inspect these build outputs directly:

- `site/dist/sitemap-index.xml`
- `site/dist/sitemap-0.xml`
- `site/dist/robots.txt`
- `site/dist/rss.xml`

Run `npm run test:publishing` after the build to verify the key routes and production URLs.

## Automated validation and reports

From `site/`, run:

```sh
npm run check
npm run validate:seo:source
npm run build
npm run validate:seo:build
npm test
```

The source command validates content and frontmatter. The generated-output command validates the
actual deployment structure: metadata, JSON-LD, canonical/base paths, sitemap, robots, internal
links, fragments, assets, image alt text, and duplicate analytics scripts. It writes
`site/reports/seo-report.md` and `site/reports/seo-report.json`.

Missing or invalid deterministic metadata, duplicate titles, broken references, missing local
files, bad generated metadata, broken internal links, sitemap/robots errors, and duplicate GA4 or
Clarity scripts are blocking. Exact duplicate descriptions and description-length guidance are
warnings. External availability and Lighthouse scores are deliberately non-blocking baselines.

The existing Pages workflow runs these checks for pull requests and `main`, adds the Markdown report
to the Actions summary, and uploads `site/reports/` as an `seo-report-<run id>` artifact before
enforcing the gate. Lighthouse audits a locally served production build, never the live site during
a pull request.

For failed canonical checks, verify the URL begins with
`https://russelleast.github.io/articulate/` and includes `articulate` exactly once. New content uses
the schemas and conventions in `site/README.md`; thumbnail-bearing Episodes require editorial
`thumbnail_alt` text rather than filename-derived text.

## Validate structured data and social previews

After deployment, submit representative public Episode and architectural-record URLs to Google's
[Rich Results Test](https://search.google.com/test/rich-results) or the
[Schema.org validator](https://validator.schema.org/). Not every valid schema type produces a rich
result.

Use the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) and
[LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/) to fetch a deployed URL and see
the Open Graph preview. Inspect the rendered `twitter:*` tags for X; X no longer provides its former
public Card Validator preview workflow. Preview services must be able to reach the deployed site and
image, so source-only or localhost checks are insufficient.

## Google Search Console

1. Create or open a Search Console property for `https://russelleast.github.io/articulate/`.
2. Set the public GitHub Actions repository variable `PUBLIC_GOOGLE_SITE_VERIFICATION` to the token
   from Google's HTML-tag verification method, then deploy and complete verification.
3. Submit `https://russelleast.github.io/articulate/sitemap-index.xml` in the Sitemaps report.
4. Use URL Inspection for discovery, crawl, canonical, and index status of an individual page.
5. Use the Page indexing report to review indexed and excluded URLs.
6. Use the Performance report to see search impressions, clicks, queries, countries, and devices.

Search Console is the authority for Google discovery, indexing, and impressions. None of those
states can be established from repository source or a successful local build.

## Analytics and website traffic

Google Analytics 4 and Microsoft Clarity are installed in the shared page head. The generated-site
validator confirms whether their scripts appear and treats more than one inclusion per page as a
deterministic error. It does not call provider APIs, verify received events, introduce analytics
configuration, or change consent behaviour. Provider dashboards remain the authority for received
traffic data.

## External configuration checklist

- GA4 and Clarity properties for website traffic reporting.
- Google Search Console property, verification variable, and sitemap submission for index and search
  reporting.
- A deployed, publicly reachable build before social-preview crawlers can fetch metadata and images.
- Time and crawler activity before discovery, indexing, impressions, or analytics events appear.
