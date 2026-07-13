import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { validateInputs } from "../src/cli.mjs";

test("required asset validation gives an actionable error", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "validation-repo-"));
  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), "validation-output-"));
  fs.mkdirSync(path.join(repoRoot, "docs/episodes"), { recursive: true });
  fs.writeFileSync(path.join(repoRoot, "docs/episodes/source.md"), "# Source\n", "utf8");

  assert.throws(() => validateInputs({
    repoRoot,
    generatedScenesDir: outputDir,
    generatedSubtitlesDir: outputDir,
    generatedManifestsDir: outputDir,
    outputDir,
    placeholderAudio: true,
    allowDurationMismatch: false,
    config: {
      experiment: { canonicalSource: "docs/episodes/source.md" },
      assets: { companionDesignSystem: { path: "missing.png" } },
      audio: { durationToleranceSeconds: 1 },
      output: { width: 1920, height: 1080, frameRate: 25 },
      scenes: [{ id: "s1", order: 1, durationSeconds: 5, audio: "missing.wav" }]
    },
    scenes: [{ id: "s1", order: 1, durationSeconds: 5, audio: "missing.wav" }]
  }), /Missing companion design-system image/);
});

test("placeholder mode does not require narration files", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "validation-repo-"));
  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), "validation-output-"));
  fs.mkdirSync(path.join(repoRoot, "docs/episodes"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, "assets"), { recursive: true });
  fs.writeFileSync(path.join(repoRoot, "docs/episodes/source.md"), "# Source\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, "assets/companion.png"), "png", "utf8");

  const result = validateInputs({
    repoRoot,
    generatedScenesDir: outputDir,
    generatedSubtitlesDir: outputDir,
    generatedManifestsDir: outputDir,
    outputDir,
    placeholderAudio: true,
    allowDurationMismatch: false,
    config: {
      experiment: { canonicalSource: "docs/episodes/source.md" },
      assets: { companionDesignSystem: { path: "assets/companion.png" } },
      audio: { durationToleranceSeconds: 1 },
      output: { width: 1920, height: 1080, frameRate: 25 },
      scenes: [{ id: "s1", order: 1, durationSeconds: 5, audio: "missing.wav" }]
    },
    scenes: [{ id: "s1", order: 1, durationSeconds: 5, audio: "missing.wav" }]
  });

  assert.ok(Array.isArray(result.warnings));
});
