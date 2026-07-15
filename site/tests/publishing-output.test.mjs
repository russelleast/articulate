import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const productionBase = "https://russelleast.github.io/articulate";

async function output(path) {
  return readFile(new URL(`../dist/${path}`, import.meta.url), "utf8");
}

function jsonLdFrom(html) {
  const match = html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/);
  assert.ok(match, "expected a JSON-LD script");
  return JSON.parse(match[1]);
}

for (const [label, path, canonical] of [
  ["home page", "index.html", `${productionBase}/`],
  ["static page", "about/index.html", `${productionBase}/about/`],
  ["episode page", "episodes/0003-why-ai-native-systems/index.html", `${productionBase}/episodes/0003-why-ai-native-systems/`]
]) {
  test(`${label} has shared discoverability metadata`, async () => {
    const html = await output(path);
    assert.match(html, /<title>[^<]+<\/title>/);
    assert.match(html, /<meta name="description" content="[^"]+"/);
    assert.match(html, new RegExp(`<link rel="canonical" href="${canonical}"`));
    assert.match(html, /<meta property="og:title"/);
    assert.match(html, /<meta name="twitter:card"/);
    assert.doesNotThrow(() => jsonLdFrom(html));
  });
}

test("episode metadata and JSON-LD come from episode front matter", async () => {
  const html = await output("episodes/0003-why-ai-native-systems/index.html");
  assert.match(html, /<meta property="og:type" content="article"/);
  assert.match(html, /<meta property="article:published_time" content="2026-07-15T00:00:00.000Z"/);
  assert.match(html, /data-content-type="episode"/);
  assert.match(html, /data-episode="0003"/);
  assert.match(html, /data-series="foundations"/);

  const data = jsonLdFrom(html);
  const article = data.find((entry) => entry["@type"] === "Article");
  assert.equal(article.headline, "Why AI-Native Systems?");
  assert.deepEqual(article.keywords, ["ai-native-architecture", "agentic-systems", "intelligent-runtime"]);
});

test("sitemap, robots, and RSS use production URLs", async () => {
  const sitemap = await output("sitemap-0.xml");
  const robots = await output("robots.txt");
  const rss = await output("rss.xml");

  assert.match(sitemap, new RegExp(`${productionBase}/episodes/0003-why-ai-native-systems/`));
  assert.match(robots, new RegExp(`Sitemap: ${productionBase}/sitemap-index.xml`));
  assert.match(rss, new RegExp(`<link>${productionBase}/episodes/0003-why-ai-native-systems/</link>`));
  assert.doesNotMatch(rss, /localhost/);
});

test("analytics is controlled by public build configuration", async () => {
  const html = await output("index.html");
  const expected = process.env.EXPECT_ANALYTICS === "true";

  if (expected) {
    assert.match(html, /data-domain="journal.example"/);
    assert.match(html, /window\.articulateAnalytics/);
  } else {
    assert.doesNotMatch(html, /plausible\.io/);
    assert.doesNotMatch(html, /window\.articulateAnalytics/);
  }
});

test("Search Console verification is opt-in", async () => {
  const html = await output("index.html");
  const expected = process.env.EXPECT_VERIFICATION === "true";

  if (expected) {
    assert.match(html, /<meta name="google-site-verification" content="verification-test-value"/);
  } else {
    assert.doesNotMatch(html, /google-site-verification/);
  }
});
