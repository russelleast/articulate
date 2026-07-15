export class AssetResolver {
  constructor({ registry, providers }) {
    this.registry = registry;
    this.providers = new Map(Object.entries(providers));
  }

  providerFor(asset) {
    const provider = this.providers.get(asset.provider);
    if (!provider) throw new Error(`No provider configured for '${asset.provider}' (asset: ${asset.id})`);
    return provider;
  }

  resolve(assetId) {
    const asset = this.registry.require(assetId);
    return this.providerFor(asset).resolve(asset);
  }
}
