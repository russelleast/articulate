import fs from "node:fs";

const ASSET_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class AssetRegistry {
  constructor({ registryPath, document = null }) {
    this.registryPath = registryPath;
    this.document = document ?? readRegistryDocument(registryPath);
    this.assets = validateRegistryDocument(this.document);
    this.assetsById = new Map(this.assets.map((asset) => [asset.id, Object.freeze({ ...asset })]));
  }

  get(assetId) {
    return this.assetsById.get(assetId) ?? null;
  }

  require(assetId) {
    const asset = this.get(assetId);
    if (!asset) throw new Error(`Unknown asset ID: ${assetId}`);
    return asset;
  }

  list() {
    return [...this.assetsById.values()].sort((a, b) => a.id.localeCompare(b.id));
  }
}

function readRegistryDocument(registryPath) {
  let raw;
  try {
    raw = fs.readFileSync(registryPath, "utf8");
  } catch (error) {
    throw new Error(`Unable to read asset registry ${registryPath}: ${error.message}`);
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`Asset registry must be JSON-compatible YAML: ${error.message}`);
  }
}

export function validateRegistryDocument(document) {
  const errors = [];
  if (!document || typeof document !== "object" || Array.isArray(document)) {
    errors.push("registry root must be an object");
  }
  if (document?.version !== 1) errors.push("version must be 1");
  if (!Array.isArray(document?.assets)) errors.push("assets must be an array");

  const ids = new Set();
  for (const [index, asset] of (document?.assets ?? []).entries()) {
    const label = asset?.id || `asset at index ${index}`;
    if (!asset || typeof asset !== "object" || Array.isArray(asset)) {
      errors.push(`${label} must be an object`);
      continue;
    }
    if (!asset.id) errors.push(`asset at index ${index} requires id`);
    else if (!ASSET_ID_PATTERN.test(asset.id)) errors.push(`${label} has an invalid logical ID`);
    else if (ids.has(asset.id)) errors.push(`duplicate asset ID: ${asset.id}`);
    ids.add(asset.id);
    if (!asset.type) errors.push(`${label} requires type`);
    if (!asset.status) errors.push(`${label} requires status`);
    if (!asset.provider) errors.push(`${label} requires provider`);
    if (!asset.location) errors.push(`${label} requires location`);
    if (asset.type === "diagram") {
      if (asset.format !== "d2") errors.push(`${label} diagram format must be d2`);
      if (!asset.source) errors.push(`${label} diagram requires source`);
      else if (!asset.source.endsWith(".d2")) errors.push(`${label} diagram source must end in .d2`);
      if (asset.location && !asset.location.endsWith(".svg")) errors.push(`${label} diagram location must end in .svg`);
    }
    if (asset.checksum != null && typeof asset.checksum !== "string") {
      errors.push(`${label} checksum must be a string or null`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Invalid asset registry:\n- ${errors.join("\n- ")}`);
  }
  return document.assets;
}
