import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { conventionalNarrativePath, resolveEpisodeSources } from "../narrative-source.mjs";

test("uses production/episodes/<episode>/narrative.md as the narration convention", () => {
  const repoRoot = fixture();
  write(repoRoot, "docs/episodes/0002.md", "# Written journal\n");
  write(repoRoot, "production/episodes/0002/narrative.md", "# Spoken narrative\n");

  const resolved = resolveEpisodeSources({
    repoRoot,
    episode: { id: "episode-0002", journalSource: "docs/episodes/0002.md" }
  });

  assert.equal(resolved.narrativeSource, "production/episodes/0002/narrative.md");
  assert.equal(resolved.narrativeConvention, "narrative.md");
  assert.notEqual(resolved.journalPath, resolved.narrativePath);
});

test("does not silently fall back to the written journal", () => {
  const repoRoot = fixture();
  write(repoRoot, "docs/episodes/0003.md", "# Written journal\n");

  assert.throws(
    () => resolveEpisodeSources({ repoRoot, episode: { id: "0003", journalSource: "docs/episodes/0003.md" } }),
    /Missing spoken narrative source/
  );
});

test("requires legacy narration paths to be explicit", () => {
  const repoRoot = fixture();
  write(repoRoot, "docs/episodes/0001.md", "# Written journal\n");
  write(repoRoot, "production/episodes/0001/narration-script.md", "# Legacy script\n");
  const episode = {
    id: "episode-0001",
    journalSource: "docs/episodes/0001.md",
    narrativeSource: "production/episodes/0001/narration-script.md"
  };

  assert.throws(() => resolveEpisodeSources({ repoRoot, episode }), /explicitly set/);
  assert.equal(
    resolveEpisodeSources({
      repoRoot,
      episode: { ...episode, narrativeSourceConvention: "legacy" }
    }).narrativeConvention,
    "legacy"
  );
});

test("normalises episode ids into the conventional path", () => {
  assert.equal(conventionalNarrativePath("0002"), "production/episodes/0002/narrative.md");
  assert.equal(conventionalNarrativePath("episode-0002"), "production/episodes/0002/narrative.md");
});

function fixture() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "articulate-narrative-"));
}

function write(root, relativePath, contents) {
  const filePath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents);
}
