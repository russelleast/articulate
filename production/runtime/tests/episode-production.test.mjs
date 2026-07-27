import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  segmentNarrative,
  validateProductionEpisode,
  validateStoryboard
} from "../episode-production.mjs";

test("segments the spoken narrative rather than the written episode", () => {
  const segments = segmentNarrative([
    "# Title",
    "",
    "First spoken paragraph.",
    "",
    "Second spoken paragraph.",
    "",
    "## A visible heading",
    "",
    "Final spoken paragraph."
  ].join("\n"));

  assert.deepEqual(segments, [
    { id: "N001", text: "First spoken paragraph." },
    { id: "N002", text: "Second spoken paragraph." },
    { id: "N003", text: "Final spoken paragraph." }
  ]);
});

test("validates storyboard references against narrative segments", () => {
  const result = validateStoryboard({
    storyboard: storyboard([{ id: "S001", narrative_segments: ["N001-N002"] }]),
    segments: segmentNarrative("One.\n\nTwo."),
    episodeId: "0003",
    journalSource: "docs/episodes/0003.md",
    narrativeSource: "production/episodes/0003/narrative.md"
  });
  assert.deepEqual(result.errors, []);

  const invalid = validateStoryboard({
    storyboard: storyboard([{ id: "S001", narrative_segments: ["N003"] }]),
    segments: segmentNarrative("One.\n\nTwo."),
    episodeId: "0003",
    journalSource: "docs/episodes/0003.md",
    narrativeSource: "production/episodes/0003/narrative.md"
  });
  assert.match(invalid.errors.join("\n"), /unknown narrative segment "N003"/);
});

test("requires complete storyboard coverage of the spoken narrative", () => {
  const result = validateStoryboard({
    storyboard: storyboard([{ id: "S001", narrative_segments: ["N001"] }]),
    segments: segmentNarrative("One.\n\nTwo."),
    episodeId: "0003",
    journalSource: "docs/episodes/0003.md",
    narrativeSource: "production/episodes/0003/narrative.md"
  });
  assert.match(result.errors.join("\n"), /does not cover narrative segments: N002/);
});

test("aligns final scene timing to recorded audio", () => {
  const document = storyboard([
    { id: "S001", narrative_segments: ["N001"], start_seconds: 0, end_seconds: 4 },
    { id: "S002", narrative_segments: ["N002"], start_seconds: 4, end_seconds: 10 }
  ]);
  document.timing = { authority: "recorded-audio", audio_duration_seconds: 10 };

  const valid = validateStoryboard({
    storyboard: document,
    segments: segmentNarrative("One.\n\nTwo."),
    episodeId: "0003",
    journalSource: "docs/episodes/0003.md",
    narrativeSource: "production/episodes/0003/narrative.md"
  });
  assert.deepEqual(valid.errors, []);

  const invalid = validateStoryboard({
    storyboard: document,
    segments: segmentNarrative("One.\n\nTwo."),
    episodeId: "0003",
    journalSource: "docs/episodes/0003.md",
    narrativeSource: "production/episodes/0003/narrative.md",
    audioDurationSeconds: 11
  });
  assert.match(invalid.errors.join("\n"), /recorded narration ends at 11/);
});

test("validates the required production directory structure", () => {
  const repoRoot = fixture();
  write(repoRoot, "docs/episodes/0003.md", "# Written\n");
  write(repoRoot, "production/episodes/0003/narrative.md", "Spoken paragraph.\n");
  write(repoRoot, "production/episodes/0003/storyboard.yaml", JSON.stringify(
    storyboard([{ id: "S001", narrative_segments: ["N001"] }])
  ));

  const missing = validateProductionEpisode({
    repoRoot,
    episodeId: "0003",
    journalSource: "docs/episodes/0003.md"
  });
  assert.match(missing.errors.join("\n"), /scenes\/.*audio\/.*output\//s);

  for (const directory of ["scenes", "audio", "output"]) {
    fs.mkdirSync(path.join(repoRoot, "production/episodes/0003", directory), { recursive: true });
  }
  const valid = validateProductionEpisode({
    repoRoot,
    episodeId: "0003",
    journalSource: "docs/episodes/0003.md"
  });
  assert.equal(valid.valid, true);
});

test("legacy render configurations remain explicit and outside the new storyboard contract", () => {
  const repoRoot = fixture();
  write(repoRoot, "docs/episodes/0001.md", "# Written\n");
  write(repoRoot, "production/episodes/0001/narration-script.md", "Legacy spoken text.\n");

  assert.throws(
    () => validateProductionEpisode({
      repoRoot,
      episodeId: "0001",
      journalSource: "docs/episodes/0001.md"
    }),
    /Missing spoken narrative source/
  );
});

function storyboard(scenes) {
  return {
    version: 1,
    episode: {
      id: "0003",
      written_source: "docs/episodes/0003.md",
      narrative_source: "production/episodes/0003/narrative.md"
    },
    timing: { authority: "planning-estimate", audio_duration_seconds: null },
    scenes
  };
}

function fixture() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "articulate-production-"));
}

function write(root, relativePath, contents) {
  const filePath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents);
}
