import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { validateInputs } from "../src/cli.mjs";
import { localAsset, testAssetManager } from "./helpers.mjs";

test("required asset validation gives an actionable error", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "validation-repo-"));
  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), "validation-output-"));
  fs.mkdirSync(path.join(repoRoot, "docs/episodes"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, "production/episodes/0001"), { recursive: true });
  fs.writeFileSync(path.join(repoRoot, "docs/episodes/source.md"), "# Source\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, "production/episodes/0001/narrative.md"), "# Narrative\n", "utf8");

  assert.throws(() => validateInputs({
    repoRoot,
    generatedScenesDir: outputDir,
    generatedSubtitlesDir: outputDir,
    generatedManifestsDir: outputDir,
    outputDir,
    placeholderAudio: true,
    allowDurationMismatch: false,
    assetManager: testAssetManager(repoRoot, [
      localAsset("companion-neutral", "assets/neutral.png"),
      localAsset("companion-reference", "missing.png")
    ]),
    config: {
      experiment: { journalSource: "docs/episodes/source.md", narrativeSource: "production/episodes/0001/narrative.md" },
      assets: { companionNeutral: { assetId: "companion-neutral" }, companionDesignSystem: { assetId: "companion-reference" } },
      audio: { durationToleranceSeconds: 1 },
      output: { width: 1920, height: 1080, frameRate: 25 },
      scenes: [{ id: "s1", order: 1, durationSeconds: 5, audioAssetId: "narration" }]
    },
    scenes: [{ id: "s1", order: 1, durationSeconds: 5, audioAssetId: "narration" }]
  }), /Missing companion design-system asset/);
});

test("placeholder mode does not require narration files", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "validation-repo-"));
  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), "validation-output-"));
  fs.mkdirSync(path.join(repoRoot, "docs/episodes"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, "production/episodes/0001"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, "assets"), { recursive: true });
  fs.writeFileSync(path.join(repoRoot, "docs/episodes/source.md"), "# Source\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, "production/episodes/0001/narrative.md"), "# Narrative\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, "assets/companion.png"), "png", "utf8");

  const result = validateInputs({
    repoRoot,
    generatedScenesDir: outputDir,
    generatedSubtitlesDir: outputDir,
    generatedManifestsDir: outputDir,
    outputDir,
    placeholderAudio: true,
    allowDurationMismatch: false,
    assetManager: testAssetManager(repoRoot, [
      localAsset("companion-neutral", "assets/neutral.png"),
      localAsset("companion-reference", "assets/companion.png")
    ]),
    config: {
      experiment: { journalSource: "docs/episodes/source.md", narrativeSource: "production/episodes/0001/narrative.md" },
      assets: { companionNeutral: { assetId: "companion-neutral" }, companionDesignSystem: { assetId: "companion-reference" } },
      audio: { durationToleranceSeconds: 1 },
      output: { width: 1920, height: 1080, frameRate: 25 },
      scenes: [{ id: "s1", order: 1, durationSeconds: 5, audioAssetId: "narration" }]
    },
    scenes: [{ id: "s1", order: 1, durationSeconds: 5, audioAssetId: "narration" }]
  });

  assert.ok(Array.isArray(result.warnings));
});

test("real-audio validation requires the canonical voice profile", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "validation-repo-"));
  const outputDir = fs.mkdtempSync(path.join(os.tmpdir(), "validation-output-"));
  fs.mkdirSync(path.join(repoRoot, "docs/episodes"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, "production/episodes/0001"), { recursive: true });
  fs.mkdirSync(path.join(repoRoot, "assets"), { recursive: true });
  fs.writeFileSync(path.join(repoRoot, "docs/episodes/source.md"), "# Source\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, "production/episodes/0001/narrative.md"), "# Narrative\n", "utf8");
  fs.writeFileSync(path.join(repoRoot, "assets/companion.png"), "png", "utf8");

  assert.throws(() => validateInputs({
    repoRoot,
    generatedScenesDir: outputDir,
    generatedSubtitlesDir: outputDir,
    generatedManifestsDir: outputDir,
    outputDir,
    placeholderAudio: false,
    allowDurationMismatch: false,
    assetManager: testAssetManager(repoRoot, [
      localAsset("companion-neutral", "assets/neutral.png"),
      localAsset("companion-reference", "assets/companion.png"),
      localAsset("episode-narration", "production/narrator/missing.wav", "narration")
    ]),
    config: {
      experiment: { journalSource: "docs/episodes/source.md", narrativeSource: "production/episodes/0001/narrative.md" },
      assets: {
        companionNeutral: { assetId: "companion-neutral" },
        companionDesignSystem: {
          assetId: "companion-reference",
          crop: { x: 0, y: 0, width: 10, height: 10 }
        }
      },
      audio: {
        durationToleranceSeconds: 1,
        realNarration: {
          assetId: "episode-narration",
          maxNarrationSeconds: 30
        }
      },
      output: { width: 1920, height: 1080, frameRate: 25 },
      scenes: [{ id: "s1", order: 1, durationSeconds: 5, audioAssetId: "episode-narration" }]
    },
    scenes: [{ id: "s1", order: 1, durationSeconds: 5, audioAssetId: "episode-narration" }]
  }, { realAudio: true }), /Missing canonical narration asset/);
});
