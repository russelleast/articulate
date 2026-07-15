# 0001: Resolve Media Through Logical Asset IDs

Status: accepted

## Context

The first media runtime embedded repository paths in scene configuration and rendering code. That coupled rendering behaviour to the current storage layout and would make a future storage change affect FFmpeg orchestration and renderer adapters.

## Decision

Production inputs are identified by stable logical asset IDs. A shared `AssetManager` resolves those IDs through an `AssetRegistry`, an `AssetResolver` and a provider selected by the registry entry. Providers implement `resolve()`, `exists()`, `fetch()` and `metadata()`.

Only `LocalAssetProvider` exists initially. It confines physical repository locations to the provider boundary. Generated render outputs remain runtime paths because they are products of the current run, not registered production inputs.

The registry is JSON-compatible YAML so the runtime can use the repository's existing dependency-free parsing approach. `production/cache/` is ignored and reserved for disposable provider-managed copies.

## Consequences

- Renderers and scene configuration depend on logical identities rather than storage layout.
- Existing assets remain in place; this decision does not migrate or synchronise them.
- Large binaries need not become canonical Git content to have a stable production identity.
- A future provider can be added behind the same contract without changing renderer code.
- Networking, authentication, cache policy and provider synchronisation remain explicit future decisions.
