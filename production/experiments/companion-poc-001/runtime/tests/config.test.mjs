import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { readSceneConfig, orderedScenes, validateSceneConfigShape } from "../src/config.mjs";

const repoRoot = path.resolve(import.meta.dirname, "../../../../..");
const configPath = path.join(repoRoot, "production/experiments/companion-poc-001/runtime/config/poc-scenes.yaml");

test("scene configuration parses and keeps deterministic scene ordering", () => {
  const config = readSceneConfig(configPath);
  const scenes = orderedScenes(config);
  assert.equal(config.experiment.id, "companion-poc-001");
  assert.deepEqual(scenes.map((scene) => scene.id), [
    "scene-001-title",
    "scene-002-companion-opening",
    "scene-003-architecture-visual",
    "scene-004-companion-close"
  ]);
});

test("scene configuration validation rejects invalid durations", () => {
  assert.throws(() => validateSceneConfigShape({
    experiment: { canonicalSource: "x" },
    assets: { companionDesignSystem: { path: "x" } },
    output: { width: 1920, height: 1080, frameRate: 25 },
    scenes: [{ id: "bad", order: 1, kind: "title-card", durationSeconds: 0, audio: "x", subtitleText: "x" }]
  }), /durationSeconds must be positive/);
});
