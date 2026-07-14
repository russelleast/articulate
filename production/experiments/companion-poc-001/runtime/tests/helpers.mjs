import { AssetManager, AssetRegistry, AssetResolver, LocalAssetProvider } from "../../../../runtime/assets/index.mjs";

export function testAssetManager(repoRoot, assets) {
  const registry = new AssetRegistry({
    registryPath: "in-memory-test-registry",
    document: { version: 1, assets }
  });
  const local = new LocalAssetProvider({ rootDirectory: repoRoot });
  const resolver = new AssetResolver({ registry, providers: { local } });
  return new AssetManager({ registry, resolver });
}

export function localAsset(id, location, type = "test") {
  return { id, type, status: "approved", checksum: null, location, provider: "local" };
}
