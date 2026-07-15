import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { readSceneConfig } from "../src/config.mjs";
import { MockCompanionRenderer, StaticCompanionRenderer } from "../src/renderers.mjs";
import { createLocalAssetManager } from "../../../../runtime/assets/index.mjs";

const repoRoot = path.resolve(import.meta.dirname, "../../../../..");
const configPath = path.join(repoRoot, "production/experiments/companion-poc-001/runtime/config/poc-scenes.yaml");

test("static companion renderer reports absent lip-sync and provenance", () => {
  const config = readSceneConfig(configPath);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "companion-renderer-"));
  const assetManager = createLocalAssetManager({ repoRoot });
  const companionAsset = {
    assetId: config.assets.companionDesignSystem.assetId,
    source: "test-reference",
    dimensions: { width: 1536, height: 1024 },
    warnings: []
  };
  const renderer = new StaticCompanionRenderer({ config, assetManager, generatedScenesDir: dir, companionAsset });
  const scene = config.scenes.find((candidate) => candidate.kind === "companion");
  const result = renderer.render(scene);

  assert.equal(result.lipSync, "absent");
  assert.equal(result.resolution.width, 1920);
  assert.equal(result.provenance.source, "test-reference");
  assert.ok(result.provenance.companionAsset);
  assert.ok(fs.existsSync(result.frame));
});

test("mock renderer follows the adapter result shape", () => {
  const result = new MockCompanionRenderer().render({ id: "scene-test", durationSeconds: 4 });
  assert.equal(result.sceneId, "scene-test");
  assert.equal(result.lipSync, "mocked");
  assert.equal(result.audioStatus, "mocked");
});
