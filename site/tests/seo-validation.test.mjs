import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { validateSource } from "../scripts/seo/validate-source.mjs";
import { validateHtmlDocument } from "../scripts/seo/validate-build.mjs";

const description = "A sufficiently descriptive summary that clearly explains the architectural subject.";

async function fixture(files) {
  const root = await mkdtemp(path.join(os.tmpdir(), "articulate-seo-"));
  await mkdir(path.join(root, "docs/episodes"), { recursive: true });
  await mkdir(path.join(root, "docs/adrs"), { recursive: true });
  await mkdir(path.join(root, "site/src/content/principles"), { recursive: true });
  await mkdir(path.join(root, "site/src/pages"), { recursive: true });
  for (const [name, content] of Object.entries(files)) {
    const file = path.join(root, name);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, content);
  }
  return root;
}

function episode(overrides = "") {
  return `---
id: episode-0001
title: Valid Episode
summary: ${description}
published: 2026-08-01
updated: 2026-08-02
status: current
sequence: 1
season: 1
${overrides}---

Episode body.
`;
}

function validHtml(extraHead = "") {
  return `<!doctype html><html><head>
    <title>Page | Articulate</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="https://russelleast.github.io/articulate/episodes/example/">
    <meta property="og:title" content="Page | Articulate">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="https://russelleast.github.io/articulate/episodes/example/">
    <meta property="og:type" content="article">
    <meta property="og:image" content="https://russelleast.github.io/articulate/image.png">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Page | Articulate">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="https://russelleast.github.io/articulate/image.png">
    <script type="application/ld+json">{"@context":"https://schema.org","@type":"Article"}</script>
    ${extraHead}
  </head><body></body></html>`;
}

test("a valid episode passes source metadata validation", async () => {
  const result = await validateSource({ root: await fixture({ "docs/episodes/0001-valid.md": episode() }) });
  assert.deepEqual(result.diagnostics, []);
});

test("missing title fails with an actionable source file and rule", async () => {
  const root = await fixture({ "docs/episodes/0001-missing-title.md": episode().replace("title: Valid Episode\n", "title: '  '\n") });
  const result = await validateSource({ root });
  assert.ok(result.diagnostics.some(({ file, rule, message }) => file.endsWith("0001-missing-title.md") && rule === "required-title" && /Add a non-blank/.test(message)));
});

test("missing description fails with an actionable message", async () => {
  const root = await fixture({ "docs/episodes/0001-missing-description.md": episode().replace(`summary: ${description}\n`, "") });
  const result = await validateSource({ root });
  assert.ok(result.diagnostics.some(({ rule, message }) => rule === "required-description" && /summary or description/.test(message)));
});

test("duplicate title is detected", async () => {
  const root = await fixture({
    "docs/episodes/0001-first.md": episode(),
    "docs/episodes/0002-second.md": episode().replace("id: episode-0001", "id: episode-0002").replace("sequence: 1", "sequence: 2")
  });
  const result = await validateSource({ root });
  assert.ok(result.diagnostics.some(({ rule }) => rule === "duplicate-title"));
});

test("missing local thumbnail is detected", async () => {
  const root = await fixture({ "docs/episodes/0001-thumbnail.md": episode("thumbnail: /media/missing.png\nthumbnail_alt: A meaningful scene\n") });
  const result = await validateSource({ root });
  assert.ok(result.diagnostics.some(({ rule, message }) => rule === "missing-local-asset" && /missing\.png/.test(message)));
});

test("generated canonical is absolute and contains /articulate/ exactly once", () => {
  const result = validateHtmlDocument(validHtml());
  assert.equal(result.canonical, "https://russelleast.github.io/articulate/episodes/example/");
  assert.equal(result.diagnostics.filter(({ rule }) => rule.startsWith("canonical-")).length, 0);
});

test("generated page requires a non-empty meta description", () => {
  const result = validateHtmlDocument(validHtml().replace(`content="${description}"`, "content=\"\""));
  assert.ok(result.diagnostics.some(({ rule }) => rule === "meta-description"));
});

test("malformed JSON-LD is detected", () => {
  const result = validateHtmlDocument(validHtml().replace('{"@context":"https://schema.org","@type":"Article"}', "{broken"));
  assert.ok(result.diagnostics.some(({ rule }) => rule === "malformed-json-ld"));
});

test("duplicate GA4 script inclusion is detected", () => {
  const scripts = '<script src="https://www.googletagmanager.com/gtag/js?id=G-ONE"></script>'.repeat(2);
  assert.ok(validateHtmlDocument(validHtml(scripts)).diagnostics.some(({ rule }) => rule === "duplicate-ga4"));
});

test("duplicate Clarity script inclusion is detected", () => {
  const scripts = '<script>t.src="https://www.clarity.ms/tag/one";</script>'.repeat(2);
  assert.ok(validateHtmlDocument(validHtml(scripts)).diagnostics.some(({ rule }) => rule === "duplicate-clarity"));
});
