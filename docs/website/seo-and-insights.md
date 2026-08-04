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

The existing optional analytics provider is Plausible. `site/src/components/Analytics.astro` emits
the Plausible script only when both of these public build variables are set:

```text
PUBLIC_ANALYTICS_PROVIDER=plausible
PUBLIC_ANALYTICS_DOMAIN=<the site configured in Plausible>
```

`PUBLIC_ANALYTICS_SCRIPT_URL` is an optional override for self-hosted or proxied Plausible. These
values are public configuration, not secrets. The GitHub Pages workflow passes them from GitHub
Actions repository variables. With no provider or domain, the production HTML contains no tracking
script and local development continues normally.

To see traffic, first add the deployed domain to a Plausible account and set the matching repository
variables. After deployment, confirm the script request in browser developer tools, then use that
site's Plausible dashboard for page views, visitors, referrers, entry pages, countries, and devices.
Episode context is exposed to intentional future custom events, but no custom interaction events are
currently sent.

Plausible configuration and received events cannot be verified from source alone. Likewise, GitHub
Pages' repository Traffic view is separate, limited repository traffic; it is not website analytics.

## External configuration checklist

- Plausible account and site entry, plus GitHub Actions variables, for website traffic analytics.
- Google Search Console property, verification variable, and sitemap submission for index and search
  reporting.
- A deployed, publicly reachable build before social-preview crawlers can fetch metadata and images.
- Time and crawler activity before discovery, indexing, impressions, or analytics events appear.

