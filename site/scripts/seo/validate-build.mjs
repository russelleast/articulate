import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { load } from "cheerio";
import { diagnostic, printDiagnostics, summarize, writeReport } from "./diagnostics.mjs";
import { repositoryRoot, siteRoot, validateSource } from "./validate-source.mjs";

export const productionOrigin = "https://russelleast.github.io";
export const productionBasePath = "/articulate";
export const productionBaseUrl = `${productionOrigin}${productionBasePath}`;

async function exists(file) {
  try { await access(file); return true; } catch { return false; }
}

function value($, selector, attribute = "content") {
  return $(selector).map((_, element) => ($(element).attr(attribute) ?? "").trim()).get();
}

function requireExactlyOne(values, file, rule, label, diagnostics) {
  if (values.length !== 1) {
    diagnostics.push(diagnostic("error", file, rule, `Expected exactly one ${label}; found ${values.length}.`));
    return undefined;
  }
  if (!values[0]) diagnostics.push(diagnostic("error", file, rule, `${label} must not be blank.`));
  return values[0];
}

function duplicateProperties($, file, diagnostics) {
  const properties = new Map();
  $("meta[property^='og:']").each((_, element) => {
    const property = $(element).attr("property");
    properties.set(property, (properties.get(property) ?? 0) + 1);
  });
  for (const [property, count] of properties) {
    if (count > 1) diagnostics.push(diagnostic("error", file, "duplicate-open-graph", `Open Graph property '${property}' appears ${count} times.`));
  }
}

function validateRobotsMeta($, file, diagnostics) {
  for (const content of value($, "meta[name='robots']")) {
    const directives = content.toLowerCase().split(",").map((part) => part.trim()).filter(Boolean);
    const valid = new Set(["index", "noindex", "follow", "nofollow", "noarchive", "nosnippet", "noimageindex", "notranslate"]);
    for (const directive of directives) {
      if (!valid.has(directive) && !/^(max-snippet|max-image-preview|max-video-preview|unavailable_after):/.test(directive)) {
        diagnostics.push(diagnostic("error", file, "invalid-robots-directive", `Robots directive '${directive}' is not recognised by the validator.`));
      }
    }
    if (directives.includes("index") && directives.includes("noindex")) diagnostics.push(diagnostic("error", file, "invalid-robots-directive", "Robots metadata contains both index and noindex."));
    if (directives.includes("follow") && directives.includes("nofollow")) diagnostics.push(diagnostic("error", file, "invalid-robots-directive", "Robots metadata contains both follow and nofollow."));
  }
}

export function validateHtmlDocument(html, file = "index.html") {
  const $ = load(html);
  const diagnostics = [];
  requireExactlyOne($("title").map((_, element) => $(element).text().trim()).get(), file, "html-title", "HTML title", diagnostics);
  requireExactlyOne(value($, "meta[name='description']"), file, "meta-description", "meta description", diagnostics);
  const canonical = requireExactlyOne(value($, "link[rel='canonical']", "href"), file, "canonical-url", "canonical URL", diagnostics);
  if (canonical) {
    let parsed;
    try { parsed = new URL(canonical); } catch { diagnostics.push(diagnostic("error", file, "canonical-absolute", `Canonical URL '${canonical}' is not absolute.`)); }
    if (parsed) {
      if (parsed.origin !== productionOrigin) diagnostics.push(diagnostic("error", file, "canonical-origin", `Canonical URL must use ${productionOrigin}; found ${parsed.origin}.`));
      const occurrences = parsed.pathname.split("/").filter(Boolean).filter((part) => part === "articulate").length;
      if (occurrences !== 1 || !parsed.pathname.startsWith(`${productionBasePath}/`)) diagnostics.push(diagnostic("error", file, "canonical-base-path", `Canonical URL must contain /articulate/ exactly once; found '${canonical}'.`));
    }
  }

  for (const property of ["og:title", "og:description", "og:url", "og:type", "og:image"]) {
    const item = requireExactlyOne(value($, `meta[property='${property}']`), file, `open-graph-${property.slice(3)}`, property, diagnostics);
    if ((property === "og:url" || property === "og:image") && item) {
      try { new URL(item); } catch { diagnostics.push(diagnostic("error", file, `open-graph-${property.slice(3)}-absolute`, `${property} must be absolute; found '${item}'.`)); }
    }
  }
  duplicateProperties($, file, diagnostics);

  for (const name of ["twitter:card", "twitter:title", "twitter:description", "twitter:image"]) {
    requireExactlyOne(value($, `meta[name='${name}']`), file, `twitter-${name.slice(8)}`, name, diagnostics);
  }

  const structuredTypes = [];
  $("script[type='application/ld+json']").each((_, element) => {
    try {
      const parsed = JSON.parse($(element).text());
      for (const item of Array.isArray(parsed) ? parsed : [parsed]) if (item?.["@type"]) structuredTypes.push(item["@type"]);
    } catch (error) { diagnostics.push(diagnostic("error", file, "malformed-json-ld", `JSON-LD is not parseable: ${error.message}`)); }
  });
  if (value($, "meta[property='og:type']").includes("article") && !structuredTypes.some((type) => ["Article", "TechArticle", "CreativeWork"].includes(type))) diagnostics.push(diagnostic("error", file, "missing-structured-data", "Article-like pages must emit Article, TechArticle, or CreativeWork JSON-LD from existing page metadata."));
  validateRobotsMeta($, file, diagnostics);

  $("img").each((_, element) => {
    const alt = $(element).attr("alt");
    const decorative = alt === "" && ($(element).attr("role") === "presentation" || $(element).attr("aria-hidden") === "true");
    if ((alt === undefined || alt.trim() === "") && !decorative) diagnostics.push(diagnostic("error", file, "missing-image-alt", `Image '${$(element).attr("src") ?? "without src"}' needs meaningful alt text or explicit decorative semantics.`));
  });

  const googleTags = $("script[src*='googletagmanager.com/gtag/js']").length;
  const clarityTags = $("script").filter((_, element) => /clarity\.ms\/tag\//.test($(element).html() ?? "") || /clarity\.ms\/tag\//.test($(element).attr("src") ?? "")).length;
  if (googleTags > 1) diagnostics.push(diagnostic("error", file, "duplicate-ga4", `Google tag script appears ${googleTags} times and can duplicate page views.`));
  if (clarityTags > 1) diagnostics.push(diagnostic("error", file, "duplicate-clarity", `Microsoft Clarity script appears ${clarityTags} times and can duplicate sessions.`));

  return { diagnostics, canonical, analytics: { googleTags, clarityTags }, noindex: value($, "meta[name='robots']").some((item) => /(?:^|,)\s*noindex\b/i.test(item)), $ };
}

function outputTarget(dist, pathname) {
  let relative = pathname.replace(new RegExp(`^${productionBasePath}/?`), "").replace(/^\//, "");
  if (!relative) relative = "index.html";
  else if (relative.endsWith("/")) relative += "index.html";
  return path.join(dist, relative);
}

async function validateLinksAndAssets(pages, dist, diagnostics) {
  for (const page of pages) {
    const { $, file } = page;
    for (const element of $("a[href], link[href], img[src], script[src], source[src], iframe[src]").toArray()) {
      const attribute = element.name === "a" || element.name === "link" ? "href" : "src";
      const raw = ($(element).attr(attribute) ?? "").trim();
      if (!raw || raw.startsWith("#") || /^(mailto:|tel:|data:|javascript:)/i.test(raw)) continue;
      let url;
      try { url = new URL(raw, productionBaseUrl + "/"); } catch { diagnostics.push(diagnostic("error", file, "internal-link-invalid", `Cannot parse ${attribute} '${raw}'.`)); continue; }
      if (url.origin !== productionOrigin && !raw.startsWith("/")) continue;
      if (url.pathname.includes("/articulate/articulate/")) diagnostics.push(diagnostic("error", file, "internal-link-duplicate-base", `Internal URL '${raw}' contains /articulate/articulate/.`));
      if (!url.pathname.startsWith(`${productionBasePath}/`) && url.pathname !== productionBasePath) {
        diagnostics.push(diagnostic("error", file, "internal-link-base-path", `Internal URL '${raw}' omits the GitHub Pages /articulate/ base path.`));
        continue;
      }
      const target = outputTarget(dist, url.pathname);
      if (!(await exists(target))) {
        diagnostics.push(diagnostic("error", file, element.name === "a" ? "internal-link-broken" : "missing-generated-asset", `Generated ${attribute} '${raw}' resolves to missing output '${path.relative(dist, target)}'.`));
        continue;
      }
      if (url.hash && target.endsWith(".html")) {
        const targetHtml = await readFile(target, "utf8");
        const targetDocument = load(targetHtml);
        const id = decodeURIComponent(url.hash.slice(1));
        if (id && targetDocument(`[id='${id.replaceAll("'", "\\'")}']`).length === 0) diagnostics.push(diagnostic("error", file, "internal-link-fragment", `Fragment '${url.hash}' in '${raw}' does not exist in ${path.relative(dist, target)}.`));
      }
    }
  }
}

async function validateSitemap(dist, pages, sourceEntries, diagnostics) {
  const indexFile = path.join(dist, "sitemap-index.xml");
  if (!(await exists(indexFile))) {
    diagnostics.push(diagnostic("error", "dist/sitemap-index.xml", "missing-sitemap", "Production build did not generate sitemap-index.xml."));
    return { urls: [], status: "Missing" };
  }
  const sitemapIndex = load(await readFile(indexFile, "utf8"), { xmlMode: true });
  const sitemapUrls = sitemapIndex("loc").map((_, element) => sitemapIndex(element).text().trim()).get();
  const urls = [];
  for (const sitemapUrl of sitemapUrls) {
    let parsed;
    try { parsed = new URL(sitemapUrl); } catch { diagnostics.push(diagnostic("error", "dist/sitemap-index.xml", "sitemap-index-absolute-url", `Sitemap index URL '${sitemapUrl}' is not absolute.`)); continue; }
    if (parsed.origin !== productionOrigin || !parsed.pathname.startsWith(`${productionBasePath}/`) || parsed.pathname.includes("/articulate/articulate/")) diagnostics.push(diagnostic("error", "dist/sitemap-index.xml", "sitemap-index-production-url", `Sitemap index URL '${sitemapUrl}' must use the production origin and /articulate/ exactly once.`));
    const file = outputTarget(dist, parsed.pathname).replace(/index\.html$/, "");
    const xmlFile = file.endsWith(".xml") ? file : path.join(dist, path.basename(parsed.pathname));
    if (!(await exists(xmlFile))) {
      diagnostics.push(diagnostic("error", "dist/sitemap-index.xml", "missing-sitemap-part", `Referenced sitemap '${sitemapUrl}' was not generated.`));
      continue;
    }
    const xml = load(await readFile(xmlFile, "utf8"), { xmlMode: true });
    urls.push(...xml("url > loc").map((_, element) => xml(element).text().trim()).get());
  }
  const seen = new Set();
  for (const url of urls) {
    let parsed;
    try { parsed = new URL(url); } catch { diagnostics.push(diagnostic("error", "dist/sitemap-0.xml", "sitemap-absolute-url", `Sitemap URL '${url}' is not absolute.`)); continue; }
    const count = parsed.pathname.split("/").filter((part) => part === "articulate").length;
    if (parsed.origin !== productionOrigin || count !== 1 || !parsed.pathname.startsWith(`${productionBasePath}/`)) diagnostics.push(diagnostic("error", "dist/sitemap-0.xml", "sitemap-production-url", `Sitemap URL '${url}' must use the production origin and /articulate/ exactly once.`));
    if (seen.has(url)) diagnostics.push(diagnostic("error", "dist/sitemap-0.xml", "sitemap-duplicate-url", `Sitemap URL '${url}' appears more than once.`));
    seen.add(url);
  }
  const indexableCanonicals = pages.filter(({ noindex }) => !noindex).map(({ canonical }) => canonical).filter(Boolean);
  for (const canonical of indexableCanonicals) if (!seen.has(canonical)) diagnostics.push(diagnostic("error", "dist/sitemap-0.xml", "sitemap-missing-page", `Indexable page '${canonical}' is absent from the sitemap.`));
  for (const canonical of pages.filter(({ noindex }) => noindex).map(({ canonical }) => canonical).filter(Boolean)) if (seen.has(canonical)) diagnostics.push(diagnostic("error", "dist/sitemap-0.xml", "sitemap-nonindexable-page", `Explicitly non-indexable page '${canonical}' must be excluded from the sitemap.`));
  for (const entry of sourceEntries.filter(({ type, data }) => ["episode", "decision", "principle"].includes(type) && (type !== "episode" || (data.published !== false && !["draft", "planned"].includes(data.status))))) {
    const route = entry.type === "episode" ? `episodes/${entry.filenameId}` : entry.type === "decision" ? `decisions/${entry.id}` : `principles/${entry.filenameId}`;
    const expected = `${productionBaseUrl}/${route}/`;
    if (!seen.has(expected)) diagnostics.push(diagnostic("error", entry.file, "sitemap-missing-content", `Expected published content URL '${expected}' is absent from the sitemap.`));
  }
  return { urls, status: diagnostics.some(({ rule }) => rule.startsWith("sitemap-") || rule === "missing-sitemap") ? "Invalid" : `Valid (${urls.length} unique URLs)` };
}

async function validateRobots(dist, diagnostics) {
  const file = path.join(dist, "robots.txt");
  if (!(await exists(file))) {
    diagnostics.push(diagnostic("error", "dist/robots.txt", "missing-robots", "Production build did not generate robots.txt."));
    return "Missing";
  }
  const content = await readFile(file, "utf8");
  if (!/^User-agent:\s*\*/mi.test(content)) diagnostics.push(diagnostic("error", "dist/robots.txt", "robots-user-agent", "robots.txt needs a public user-agent group."));
  if (/^Disallow:\s*\/articulate\/?\s*$/mi.test(content)) diagnostics.push(diagnostic("error", "dist/robots.txt", "robots-blocks-site", "robots.txt blocks the /articulate/ public site."));
  const sitemap = content.match(/^Sitemap:\s*(\S+)\s*$/mi)?.[1];
  if (sitemap !== `${productionBaseUrl}/sitemap-index.xml`) diagnostics.push(diagnostic("error", "dist/robots.txt", "robots-sitemap", `robots.txt must reference ${productionBaseUrl}/sitemap-index.xml; found '${sitemap ?? "nothing"}'.`));
  if (/localhost|127\.0\.0\.1/.test(content)) diagnostics.push(diagnostic("error", "dist/robots.txt", "robots-development-url", "robots.txt must not contain a local development URL."));
  return diagnostics.some(({ file }) => file === "dist/robots.txt") ? "Invalid" : "Valid and references the production sitemap";
}

export async function validateBuild({ root = repositoryRoot, dist = path.join(siteRoot, "dist") } = {}) {
  const diagnostics = [];
  const files = (await readdir(dist, { recursive: true })).filter((name) => name.endsWith(".html"));
  const pages = [];
  for (const name of files) {
    const html = await readFile(path.join(dist, name), "utf8");
    // Search Console verification files use an .html suffix but are tokens, not indexable documents.
    if (!/<html(?:\s|>)/i.test(html)) continue;
    const result = validateHtmlDocument(html, `dist/${name}`);
    diagnostics.push(...result.diagnostics);
    pages.push({ file: `dist/${name}`, ...result });
  }
  await validateLinksAndAssets(pages, dist, diagnostics);
  const source = await validateSource({ root });
  const sitemap = await validateSitemap(dist, pages, source.entries, diagnostics);
  const robots = await validateRobots(dist, diagnostics);
  const analyticsPresent = pages.filter(({ analytics }) => analytics.googleTags || analytics.clarityTags).length;
  return {
    diagnostics,
    pagesInspected: pages.length,
    statuses: {
      canonical: diagnostics.some(({ rule }) => rule.startsWith("canonical-")) ? "Invalid" : "Valid on every inspected page",
      structuredData: diagnostics.some(({ rule }) => rule === "malformed-json-ld" || rule === "missing-structured-data") ? "Invalid or missing structured data found" : "All emitted JSON-LD parses successfully and article-like pages use a suitable type",
      sitemap: sitemap.status,
      robots,
      internalLinks: diagnostics.some(({ rule }) => rule.startsWith("internal-link")) ? "Broken links found" : "All generated internal links and fragments resolve",
      assets: diagnostics.some(({ rule }) => rule.includes("asset")) ? "Missing assets found" : "All generated local assets resolve",
      analytics: diagnostics.some(({ rule }) => rule === "duplicate-ga4" || rule === "duplicate-clarity") ? "Duplicate scripts found" : `No duplicates; analytics detected on ${analyticsPresent}/${pages.length} pages`,
      externalLinks: "Not fetched; external availability is deliberately non-blocking"
    }
  };
}

async function readSourceReport(file) {
  try { return JSON.parse(await readFile(file, "utf8")); } catch { return { sourceFilesInspected: 0, diagnostics: [diagnostic("warning", path.relative(siteRoot, file), "source-report-missing", "Source report was unavailable; run npm run validate:seo:source first.")] }; }
}

async function main() {
  const sourceFile = path.resolve(siteRoot, process.env.SEO_SOURCE_REPORT ?? "reports/seo-source.json");
  const jsonFile = path.resolve(siteRoot, process.env.SEO_REPORT_JSON ?? "reports/seo-report.json");
  const markdownFile = path.resolve(siteRoot, process.env.SEO_REPORT_MARKDOWN ?? "reports/seo-report.md");
  const source = await readSourceReport(sourceFile);
  let build;
  try { build = await validateBuild(); } catch (error) { build = { diagnostics: [diagnostic("error", "dist", "build-output-unavailable", `Cannot inspect production output: ${error.message}`)], pagesInspected: 0, statuses: {} }; }
  const diagnostics = [...source.diagnostics, ...build.diagnostics];
  const report = { generatedAt: new Date().toISOString(), ...summarize(diagnostics), pagesInspected: build.pagesInspected, sourceFilesInspected: source.sourceFilesInspected, diagnostics, statuses: build.statuses };
  await writeReport(report, jsonFile, markdownFile);
  printDiagnostics(diagnostics);
  console.log(`SEO report: ${path.relative(siteRoot, markdownFile)} and ${path.relative(siteRoot, jsonFile)}`);
  process.exitCode = report.errors ? 1 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
