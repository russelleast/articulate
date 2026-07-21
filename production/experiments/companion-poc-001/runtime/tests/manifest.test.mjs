import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { buildManifest } from "../src/manifest.mjs";

test("manifest records placeholder mode and generated file checksums", () => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "manifest-repo-"));
  fs.mkdirSync(path.join(repoRoot, ".git"), { recursive: true });
  fs.writeFileSync(path.join(repoRoot, ".git", "HEAD"), "abc123\n", "utf8");
  const generated = path.join(repoRoot, "generated.txt");
  const configPath = path.join(repoRoot, "config.json");
  fs.writeFileSync(generated, "generated", "utf8");
  fs.writeFileSync(configPath, "{}", "utf8");

  const manifest = buildManifest({
    repoRoot,
    configPath,
    config: {
      runtimeVersion: "0.1.0",
      experiment: { id: "companion-poc-001", journalSource: "episode.md", narrativeSource: "narrative.md" },
      output: { width: 1920, height: 1080, frameRate: 25 },
      scenes: [{ durationSeconds: 5 }]
    },
    command: "test command",
    placeholderAudio: true,
    inputFiles: [configPath],
    generatedFiles: [generated],
    rendererResults: [],
    warnings: ["warning"],
    outputVideo: null,
    realNarration: {
      sourcePath: configPath,
      path: generated,
      sourceChecksum: "a".repeat(64),
      preparedChecksum: "b".repeat(64),
      sourceDurationSeconds: 22,
      durationSeconds: 20,
      trim: { startSeconds: 1, endSeconds: 21 },
      transformations: ["trimmed edge silence"]
    }
  });

  assert.equal(manifest.renderingMode, "placeholder-audio");
  assert.equal(manifest.placeholderAudioUsed, true);
  assert.equal(manifest.outputIdentity, "Companion PoC 001 animatic");
  assert.equal(manifest.narrationProvenance, "real human narration");
  assert.equal(manifest.writtenJournal, "episode.md");
  assert.equal(manifest.spokenNarrative, "narrative.md");
  assert.equal(manifest.companionImagery, "deterministically animated companion imagery");
  assert.equal(manifest.genuineLipSync, false);
  assert.equal(manifest.realNarration.preparedSha256, "b".repeat(64));
  assert.equal(manifest.generatedFiles.length, 1);
  assert.equal(manifest.generatedFiles[0].sha256.length, 64);
});
