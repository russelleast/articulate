import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
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
    assert.match(html, /<meta property="og:image" content="https:\/\/russelleast\.github\.io\/articulate\//);
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
  const article = data.find((entry) => ["Article", "TechArticle"].includes(entry["@type"]));
  assert.equal(article.headline, "Why AI-Native Systems?");
  assert.deepEqual(article.keywords, ["ai-native-architecture", "agentic-systems", "intelligent-runtime"]);
});

test("Episode 0000 publishes presenter media while keeping the journal article", async () => {
  const home = await output("index.html");
  const episode = await output("episodes/preface/index.html");

  assert.match(home, /class="responsive-video"/);
  assert.match(home, /youtube-nocookie\.com\/embed\/bPTnBevs3U8/);
  assert.match(home, /Read the written introduction/);
  assert.match(episode, /episode-0000-thumbnail\.png/);
  assert.match(episode, /Watch this Episode on YouTube/);
  assert.match(episode, /The journal article below\s+remains the canonical written version/);
});

test("the home page exposes recent Episodes beside the hero with detailed previews", async () => {
  const home = await output("index.html");

  assert.match(home, /<h2 id="latest-episodes-heading">Latest Episodes<\/h2>/);
  assert.match(home, /class="latest-episode-preview"/);
  assert.match(home, /href="\/articulate\/episodes\/0015-architectural-assurance\/"/);
  assert.match(home, /Latest video/);
  assert.match(home, /href="\/articulate\/episodes\/0010-selecting-an-agent-runtime\/"/);
  assert.match(home, /href="https:\/\/youtu\.be\/rOnui-Tj3ks"/);
  assert.doesNotMatch(home, /Current Architectural Question|>Start Here<|Architecture at a Glance/);
  assert.match(home, /An architecture journal built through evidence/);
});

for (const [episode, published] of [
  ["0006-ai-assisted-development", "2026-07-22"],
  ["0007-the-knowledge-model", "2026-07-22"],
  ["0008-agentic-rag-and-knowledge-reasoning", "2026-07-22"],
  ["0009-defining-architectural-behaviour-with-dcl", "2026-07-24"],
  ["0010-selecting-an-agent-runtime", "2026-07-30"],
  ["0011-agent-memory", "2026-07-30"],
  ["0012-durable-execution", "2026-07-30"]
]) {
  test(`${episode} is published in the journal`, async () => {
    const listing = await output("episodes/index.html");
    const page = await output(`episodes/${episode}/index.html`);

    assert.match(listing, new RegExp(`href="/articulate/episodes/${episode}/"`));
    assert.match(
      page,
      new RegExp(`<meta property="article:published_time" content="${published}T00:00:00.000Z"`)
    );
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
  ],
  "0009-defining-architectural-behaviour-with-dcl": [
    "episode-0009-conversation-to-dcl.svg",
    "episode-0009-formalised-intent.svg",
    "episode-0009-architecture-sequence.svg",
    "episode-0009-discovery-to-dcl.svg"
  ]
};

test("published Episodes are grouped by season and ordered while future Episodes stay private", async () => {
  const listing = await output("episodes/index.html");
  const seasonListing = listing.slice(listing.indexOf('<div class="season-list">'));

  assert.match(listing, /Season 1 — Foundations/);
  assert.match(listing, /Season 2 — Architectural Intelligence/);
  assert.ok(seasonListing.indexOf("0006-ai-assisted-development") < seasonListing.indexOf("0007-the-knowledge-model"));
  assert.ok(seasonListing.indexOf("0014-knowledge-evolution") < seasonListing.indexOf("0015-architectural-assurance"));
  assert.doesNotMatch(listing, /0016-impact-analysis|0017-observing-agents|0018-building-the-knowledge-service/);
  for (const slug of [
    "0016-impact-analysis-and-knowledge-reasoning",
    "0017-observing-agents",
    "0018-building-the-knowledge-service"
  ]) {
    await assert.rejects(access(new URL(`../dist/episodes/${slug}/index.html`, import.meta.url)));
  }
});

test("the Episodes index identifies the latest entry and exposes search and topic filters", async () => {
  const listing = await output("episodes/index.html");

  assert.match(listing, /<p class="eyebrow">Latest Episode<\/p>/);
  assert.match(listing, /Episode 0015 \/\s*Season 2 — Architectural Intelligence/);
  assert.match(listing, /data-episode-search/);
  assert.match(listing, /data-episode-topic/);
  assert.match(listing, /data-episode-card/);
  assert.match(listing, /No Episodes match these filters/);
});

test("decision index is concise and full ADRs publish on detail routes", async () => {
  const decisions = await output("decisions/index.html");
  const detail = await output("decisions/adr-0001/index.html");

  assert.match(decisions, /href="\/articulate\/decisions\/adr-0001\/"/);
  assert.match(decisions, /coordinate long-running, recoverable agent work/);
  assert.doesNotMatch(decisions, /id="context"|id="decision"|id="consequences"/);
  assert.match(detail, /<h2 id="context">Context<\/h2>/);
  assert.match(detail, /<h2 id="decision">Decision<\/h2>/);
  assert.match(detail, /<h2 id="consequences">Consequences<\/h2>/);
  assert.match(detail, /<h3 id="rationale">Rationale<\/h3>/);
  assert.match(detail, /<h2 id="alternatives-considered">Alternatives Considered<\/h2>/);
  assert.match(detail, /"@type":"BreadcrumbList"/);

  for (const slug of [
    "0010-selecting-an-agent-runtime",
    "0011-agent-memory",
    "0012-durable-execution"
  ]) {
    assert.match(decisions, new RegExp(`href="/articulate/episodes/${slug}/"`));
    assert.match(
      await output(`episodes/${slug}/index.html`),
      /href="\/articulate\/decisions\/adr-0001\/"/
    );
  }
});

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
    thumbnail: "episode-0001-thumbnail.png",
    youtubeUrl: "https://youtu.be/CaV96lZXLjY"
  },
  {
    slug: "0002-what-is-articulate",
    thumbnail: "episode-0002-thumbnail.png",
    youtubeUrl: "https://youtu.be/58jjv0g6Ojo"
  },
  {
    slug: "0003-why-ai-native-systems",
    thumbnail: "episode-0003-thumbnail-v2.png",
    youtubeUrl: "https://youtu.be/1V6ziCqZ4tw"
  },
  {
    slug: "0004-system-characteristics-the-properties-every-system-needs",
    thumbnail: "episode-0004-thumbnail.png",
    youtubeUrl: "https://youtu.be/vk369gRbVnc",
    videoId: "vk369gRbVnc",
    iframeTitle: "System Characteristics: The Properties Every System Needs — Articulate Journal Episode 4"
  },
  {
    slug: "0008-agentic-rag-and-knowledge-reasoning",
    thumbnail: "episode-0008-thumbnail.png",
    youtubeUrl: "https://youtu.be/rN0Sr9CYCSI",
    videoId: "rN0Sr9CYCSI",
    iframeTitle: "Knowledge Reasoning: Beyond RAG — Articulate Journal Episode 8"
  },
  {
    slug: "0009-defining-architectural-behaviour-with-dcl",
    thumbnail: "episode-0009-thumbnail.png",
    youtubeUrl: "https://youtu.be/lD9BOdSmSjA",
    videoId: "lD9BOdSmSjA",
    iframeTitle: "Defining Architectural Behaviour with DCL — Articulate Journal Episode 9"
  },
  {
    slug: "0010-selecting-an-agent-runtime",
    thumbnail: "episode-0010-thumbnail.png",
    youtubeUrl: "https://youtu.be/rOnui-Tj3ks",
    videoId: "rOnui-Tj3ks",
    iframeTitle: "ADR 0001 – Defining the Runtime Requirements — Articulate Journal Episode 10"
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
    assert.match(page, /class="responsive-video episode-media-video"/);
    if (episode.videoId) {
      assert.match(page, new RegExp(`youtube-nocookie\\.com/embed/${episode.videoId}`));
      assert.match(
        page,
        new RegExp(`title="${episode.iframeTitle}"`)
      );
    }
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
  assert.match(await output("index.html"), /href="\/articulate\/principles\/"[^>]*>\s*Principles\s*<\/a>/);
  assert.match(principle, /Coherence Before Size/);
  assert.match(principle, /Keep responsibilities coherent/);
  assert.match(
    principle,
    /href="\/articulate\/episodes\/0004-system-characteristics-the-properties-every-system-needs\/"/
  );
  assert.match(episode, /Related Material/);
  assert.match(episode, /href="\/articulate\/principles\/coherence-before-size\/"/);
});

test("all architectural record detail routes have unique metadata and breadcrumbs", async () => {
  for (const path of [
    "decisions/adr-0001/index.html",
    "decisions/adr-0002/index.html",
    "decisions/adr-0003/index.html",
    "decisions/adr-0004/index.html",
    "principles/coherence-before-size/index.html"
  ]) {
    const html = await output(path);
    assert.match(html, /<title>[^<]+ \| Articulate<\/title>/);
    assert.match(html, /<meta name="description" content="[^\"]+"/);
    assert.match(html, /"@type":"BreadcrumbList"/);
  }
});

test("primary navigation is durable and marks the active information space", async () => {
  const decisions = await output("decisions/adr-0001/index.html");
  assert.match(decisions, /href="\/articulate\/decisions\/" aria-current="page"/);
  assert.doesNotMatch(decisions, />Start Here<|>Patterns<|>Experiments</);
});

test("generated HTML contains no broken internal page links", async () => {
  const dist = new URL("../dist/", import.meta.url);
  const files = (await readdir(dist, { recursive: true }))
    .filter((path) => path.endsWith(".html"));

  for (const file of files) {
    const html = await output(file);
    for (const match of html.matchAll(/href="([^"]+)"/g)) {
      const href = match[1];
      if (!href.startsWith("/articulate/")) continue;
      const pathname = new URL(href, productionBase).pathname.replace(/^\/articulate\//, "");
      const target = pathname === "" ? "index.html" : pathname.endsWith("/") ? `${pathname}index.html` : pathname;
      await assert.doesNotReject(access(new URL(target, dist)), `${file} links to missing ${href}`);
    }
  }
});
