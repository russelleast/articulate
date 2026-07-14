import fs from "node:fs";
import path from "node:path";
import { AssetProvider } from "./asset-provider.mjs";

export class LocalAssetProvider extends AssetProvider {
  constructor({ rootDirectory }) {
    super();
    this.rootDirectory = path.resolve(rootDirectory);
  }

  resolve(asset) {
    const resolved = path.resolve(this.rootDirectory, asset.location);
    const relative = path.relative(this.rootDirectory, resolved);
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      throw new Error(`Local asset location escapes the provider root: ${asset.id}`);
    }
    return resolved;
  }

  exists(asset) {
    return fs.existsSync(this.resolve(asset));
  }

  fetch(asset) {
    const resolved = this.resolve(asset);
    if (!fs.existsSync(resolved)) throw new Error(`Local asset is unavailable: ${asset.id}`);
    return resolved;
  }

  metadata(asset) {
    const resolved = this.resolve(asset);
    if (!fs.existsSync(resolved)) {
      return { ...asset, available: false, sizeBytes: null, modifiedAt: null };
    }
    const stat = fs.statSync(resolved);
    return {
      ...asset,
      available: true,
      sizeBytes: stat.size,
      modifiedAt: stat.mtime.toISOString()
    };
  }
}
