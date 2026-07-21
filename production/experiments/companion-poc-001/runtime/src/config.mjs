import fs from "node:fs";
import path from "node:path";

export function readSceneConfig(configPath) {
  const raw = fs.readFileSync(configPath, "utf8");
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(`Scene configuration must be JSON-compatible YAML: ${error.message}`);
  }
  validateSceneConfigShape(parsed);
  return parsed;
}

export function validateSceneConfigShape(config) {
  const errors = [];
  if (!config || typeof config !== "object") errors.push("configuration root must be an object");
  if (!config?.experiment?.journalSource) errors.push("experiment.journalSource is required");
  if (!config?.experiment?.narrativeSource) errors.push("experiment.narrativeSource is required");
  if (!config?.assets?.companionNeutral?.assetId) errors.push("assets.companionNeutral.assetId is required");
  if (!config?.assets?.companionDesignSystem?.assetId) errors.push("assets.companionDesignSystem.assetId is required");
  if (!config?.output?.width || !config?.output?.height) errors.push("output.width and output.height are required");
  if (!Number.isInteger(config?.output?.frameRate)) errors.push("output.frameRate must be an integer");
  if (!Array.isArray(config?.scenes) || config.scenes.length === 0) errors.push("scenes must be a non-empty array");

  const ids = new Set();
  for (const scene of config?.scenes ?? []) {
    if (!scene.id) errors.push("each scene requires id");
    if (ids.has(scene.id)) errors.push(`duplicate scene id: ${scene.id}`);
    ids.add(scene.id);
    if (!Number.isInteger(scene.order)) errors.push(`${scene.id ?? "scene"} order must be an integer`);
    if (!scene.kind) errors.push(`${scene.id ?? "scene"} kind is required`);
    if (!Number.isFinite(scene.durationSeconds) || scene.durationSeconds <= 0) {
      errors.push(`${scene.id ?? "scene"} durationSeconds must be positive`);
    }
    if (!scene.subtitleText) errors.push(`${scene.id ?? "scene"} subtitleText is required`);
    if (!scene.audioAssetId) errors.push(`${scene.id ?? "scene"} audioAssetId is required`);
  }

  if (errors.length > 0) {
    throw new Error(`Invalid scene configuration:\n- ${errors.join("\n- ")}`);
  }
}

export function orderedScenes(config) {
  return [...config.scenes].sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
}

export function resolveRepoPath(repoRoot, maybeRelativePath) {
  return path.isAbsolute(maybeRelativePath) ? maybeRelativePath : path.join(repoRoot, maybeRelativePath);
}
