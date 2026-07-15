import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { AssetRegistry, validateRegistryDocument } from "../../../../runtime/assets/index.mjs";
import { localAsset, testAssetManager } from "./helpers.mjs";

test("asset manager resolves, fetches, checks and describes logical assets", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "asset-manager-"));
  fs.mkdirSync(path.join(root, "media"));
  fs.writeFileSync(path.join(root, "media/narration.wav"), "audio", "utf8");
  const manager = testAssetManager(root, [localAsset("episode-0001-narration-v1", "media/narration.wav", "narration")]);

  assert.equal(manager.resolve("episode-0001-narration-v1"), path.join(root, "media/narration.wav"));
  assert.equal(manager.fetch("episode-0001-narration-v1"), path.join(root, "media/narration.wav"));
  assert.equal(manager.exists("episode-0001-narration-v1"), true);
  assert.equal(manager.metadata("episode-0001-narration-v1").sizeBytes, 5);
});

test("asset registry rejects duplicate IDs and local paths cannot escape their root", () => {
  const asset = localAsset("companion-v1-neutral", "../outside.png", "companion");
  assert.throws(() => validateRegistryDocument({ version: 1, assets: [asset, asset] }), /duplicate asset ID/);

  const root = fs.mkdtempSync(path.join(os.tmpdir(), "asset-manager-"));
  const manager = testAssetManager(root, [asset]);
  assert.throws(() => manager.resolve(asset.id), /escapes the provider root/);
});

test("asset registry reports unknown logical IDs", () => {
  const registry = new AssetRegistry({ registryPath: "test", document: { version: 1, assets: [] } });
  assert.throws(() => registry.require("missing-asset"), /Unknown asset ID/);
});
