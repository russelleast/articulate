export class AssetProvider {
  resolve() {
    throw new Error("AssetProvider.resolve must be implemented by a provider");
  }

  exists() {
    throw new Error("AssetProvider.exists must be implemented by a provider");
  }

  fetch() {
    throw new Error("AssetProvider.fetch must be implemented by a provider");
  }

  metadata() {
    throw new Error("AssetProvider.metadata must be implemented by a provider");
  }
}
