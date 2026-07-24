import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
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

test("Episode 0000 publishes companion media while keeping the journal article", async () => {
  const home = await output("index.html");
  const episode = await output("episodes/preface/index.html");

  assert.match(home, /class="responsive-video"/);
  assert.match(home, /youtube-nocookie\.com\/embed\/2PkyWAlfS_w/);
  assert.match(home, /Read the written introduction/);
  assert.match(episode, /episode-0000-thumbnail-a-companion-led\.png/);
  assert.match(episode, /Watch this Episode on YouTube/);
  assert.match(episode, /The journal article below\s+remains the canonical written version/);
});

test("the home page features the selected Episode with separate watch and read actions", async () => {
  const home = await output("index.html");

  assert.match(home, /<h2 id="latest-episode">What is Articulate\?<\/h2>/);
  assert.match(home, /episode-0002-thumbnail\.png/);
  assert.match(home, /href="https:\/\/youtu\.be\/sZ4VwMCKIlA"/);
  assert.match(home, /href="\/articulate\/episodes\/0002-what-is-articulate\/"/);
});

for (const episode of [
  "0006-ai-assisted-development",
  "0007-the-knowledge-model",
  "0008-agentic-rag-and-knowledge-reasoning"
]) {
  test(`${episode} is published in the journal`, async () => {
    const listing = await output("episodes/index.html");
    const page = await output(`episodes/${episode}/index.html`);

    assert.match(listing, new RegExp(`href="/articulate/episodes/${episode}/"`));
    assert.match(page, /<meta property="article:published_time" content="2026-07-22T00:00:00.000Z"/);
  });
}

const episodeDiagrams = {
  "0006-ai-assisted-development": [
    "episode-0006-layered-context-model.svg",
    "episode-0006-architect-review-workflow.svg"
  ],
  "0007-the-knowledge-model": ["knowledge-graph-example.svg"],
  "0008-agentic-rag-and-knowledge-reasoning": [
    "knowledge-reasoning-flow.svg",
    "knowledge-reasoning-layer.svg",
    "reasoning-before-agents.svg",
    "knowledge-graph-example.svg",
    "reasoning-map-example.svg"
  ]
};

for (const [episode, diagrams] of Object.entries(episodeDiagrams)) {
  test(`${episode} publishes its registered diagrams with the GitHub Pages base path`, async () => {
    const page = await output(`episodes/${episode}/index.html`);

    for (const diagram of diagrams) {
      assert.match(page, new RegExp(`src="/articulate/diagrams/${diagram}"`));
      await access(new URL(`../dist/diagrams/${diagram}`, import.meta.url));
    }
  });
}

for (const episode of [
  {
    slug: "0001-why-articulate-exists",
    thumbnail: "episode-0001-thumbnail-a-fragmented-architecture.png",
    youtubeUrl: "https://youtu.be/NISywkx-xW0"
  },
  {
    slug: "0002-what-is-articulate",
    thumbnail: "episode-0002-thumbnail.png",
    youtubeUrl: "https://youtu.be/sZ4VwMCKIlA"
  }
]) {
  test(`${episode.slug} exposes its production video artwork without replacing the written Episode`, async () => {
    const listing = await output("episodes/index.html");
    const page = await output(`episodes/${episode.slug}/index.html`);

    assert.match(listing, new RegExp(episode.thumbnail));
    assert.match(listing, new RegExp(episode.youtubeUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
    assert.match(listing, new RegExp(`href="/articulate/episodes/${episode.slug}/"`));
    assert.match(page, new RegExp(episode.thumbnail));
    assert.match(page, /Watch this Episode on YouTube/);
    await access(new URL(`../dist/media/episodes/${episode.slug.slice(0, 4)}/${episode.thumbnail}`, import.meta.url));
  });
}

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

test("architectural principles publish as a first-class, bidirectionally related content type", async () => {
  const index = await output("principles/index.html");
  const principle = await output("principles/coherence-before-size/index.html");
  const episode = await output("episodes/0004-system-characteristics-the-properties-every-system-needs/index.html");

  assert.match(index, /Architectural Principles/);
  assert.match(index, /href="\/articulate\/principles\/coherence-before-size\/"/);
  assert.match(await output("index.html"), /href="\/articulate\/principles\/">Principles<\/a>/);
  assert.match(principle, /Coherence Before Size/);
  assert.match(principle, /Keep responsibilities coherent/);
  assert.match(
    principle,
    /href="\/articulate\/episodes\/0004-system-characteristics-the-properties-every-system-needs\/"/
  );
  assert.match(episode, /Related Material/);
  assert.match(episode, /href="\/articulate\/principles\/coherence-before-size\/"/);
});
