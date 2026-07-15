export class AssetManager {
  constructor({ registry, resolver }) {
    this.registry = registry;
    this.resolver = resolver;
  }

  resolve(assetId) {
    return this.resolver.resolve(assetId);
  }

  exists(assetId) {
    const asset = this.registry.require(assetId);
    return this.resolver.providerFor(asset).exists(asset);
  }

  fetch(assetId) {
    const asset = this.registry.require(assetId);
    return this.resolver.providerFor(asset).fetch(asset);
  }

  metadata(assetId) {
    const asset = this.registry.require(assetId);
    return this.resolver.providerFor(asset).metadata(asset);
  }

  list() {
    return this.registry.list();
  }
}
