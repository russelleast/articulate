# 0006: Use D2 Sources for Reusable Architectural Diagrams

Status: accepted

## Context

Architectural diagrams appear in written episodes, video frames and production reviews. ASCII sketches communicate early intent but do not provide a reusable visual source. Building diagrams directly inside episode renderers would couple their meaning to one presentation and make reuse or evolution difficult.

## Decision

D2 files are the source of truth for authored architectural diagrams. The official D2 CLI renders them deterministically into SVG using repository-defined arguments. The CLI remains an explicit external production dependency and is never installed by normal commands.

Diagram entries extend the shared logical asset registry with `format`, `source` and generated `location`. Conceptually reusable sources live under `production/diagrams/sources/<concept>/`; episode-only sources may use `sources/episodes/<episode>/`. Generated SVGs live under `site/public/diagrams/`, where Astro publishes them directly and `AssetManager` can resolve them for video.

The initial video integration embeds a complete registered SVG in a static `diagram` scene. Diagram semantics remain separate from presentation choreography. Progressive reveal, highlighting and camera behaviour are deferred to storyboard/timeline metadata.

## Consequences

- One authored source can serve the website, video and review tooling.
- Generated SVGs are reproducible and must not be edited manually.
- The repository depends on a separately installed D2 CLI; production environments should pin its version.
- Shared styling provides a starting point while local source remains easy to customise.
- Future choreography needs stable element addressing and an SVG-aware scene adapter, but does not require changing the source-of-truth decision.
