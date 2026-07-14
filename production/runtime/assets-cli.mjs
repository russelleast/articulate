#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createLocalAssetManager } from "./assets/index.mjs";

const runtimeDirectory = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(runtimeDirectory, "../..");
const manager = createLocalAssetManager({ repoRoot });
const command = process.argv[2];

if (command === "list") {
  for (const asset of manager.list()) {
    const available = manager.exists(asset.id) ? "available" : "missing";
    console.log(`${asset.id}\t${asset.type}\t${asset.status}\t${asset.provider}\t${available}`);
  }
} else if (command === "validate") {
  const missing = manager.list().filter((asset) => !manager.exists(asset.id));
  if (missing.length > 0) {
    throw new Error(`Asset validation failed:\n- ${missing.map((asset) => `${asset.id} is unavailable from ${asset.provider}`).join("\n- ")}`);
  }
  console.log(`Asset registry validation passed for ${manager.list().length} assets.`);
} else {
  console.error("Usage: node production/runtime/assets-cli.mjs <validate|list>");
  process.exitCode = 2;
}
