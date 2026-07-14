import path from "node:path";
import { AssetManager } from "./asset-manager.mjs";
import { AssetRegistry } from "./asset-registry.mjs";
import { AssetResolver } from "./asset-resolver.mjs";
import { LocalAssetProvider } from "./local-asset-provider.mjs";

export { AssetManager } from "./asset-manager.mjs";
export { AssetProvider } from "./asset-provider.mjs";
export { AssetRegistry, validateRegistryDocument } from "./asset-registry.mjs";
export { AssetResolver } from "./asset-resolver.mjs";
export { LocalAssetProvider } from "./local-asset-provider.mjs";

export function createLocalAssetManager({ repoRoot, registryPath = path.join(repoRoot, "production/assets/registry.yaml") }) {
  const registry = new AssetRegistry({ registryPath });
  const local = new LocalAssetProvider({ rootDirectory: repoRoot });
  const resolver = new AssetResolver({ registry, providers: { local } });
  return new AssetManager({ registry, resolver });
}
