# Visual Grammar Renderer

The renderer is the deterministic runtime expression of the canonical [Articulate Visual Grammar](../../../docs/media/visual-grammar.md). The grammar remains an editorial contract; this directory contains the smallest executable projection needed by approved episodes.

```text
Storyboard scene
      |
      v
Compatibility vocabulary (`kind`, `transition`, `companion`)
      |
      v
Resolved presentation plan
  - scene archetype
  - composition strategy
  - transition semantics
      |
      v
Shared layout primitives + scene renderer
      |
      v
Deterministic SVG frame
```

## Responsibilities

- `visual-grammar.mjs` owns the selected runtime profile: safe area, palette, typography roles, spacing, composition grids, scene-kind mappings and transition semantics.
- `layout.mjs` owns deterministic text wrapping, multiline block measurement, vertical centring, padding helpers and overflow failure.
- `scene-renderer.mjs` interprets a resolved presentation plan using reusable Companion, repository, flow, grid, timeline, radial and reflection compositions.
- `episode-cli.mjs` remains responsible for episode input, asset resolution, timing validation, media assembly, manifests and review artefacts.

Episode content belongs in episode configuration. The renderer must not contain episode titles, excerpts, claims, asset-register locations or scene-specific coordinate exceptions.

## Supported Visual Grammar concepts

- Scene archetypes are resolved as `Narrator`, `Diagram`, `Repository`, `Evidence` or `Reflection`.
- Composition strategies are selected declaratively rather than through episode-specific branching.
- Typography and spacing policies are shared by all compositions.
- Fixed-height boxes use the complete multiline block height for vertical alignment.
- Text that exceeds its allowed lines fails episode validation instead of being silently clipped.
- A consistent title-safe area and reusable standard, reflection and Companion composition grids are defined by the profile.
- Transition intent is resolved into semantic and runtime behaviour. Episode 0001's existing `fade` and `section` values remain compatibility inputs and still render as deterministic cuts.
- Render manifests expose the resolved archetype, composition and transition plan for review and provenance.

## Deliberately deferred

The current renderer still creates one static shot per scene. Narration-aligned reveal states, stable element identity across shots, semantic emphasis/de-emphasis, caption-safe collision checks, actual dissolves and transformations, and temporal progression review artefacts remain future work. They should be introduced only when an approved storyboard demonstrates a repeated need.

The compatibility mapping is not a new scene-list schema. New editorial fields should still wait until repeated episode evidence justifies changing the operational content model.

## Validation

Run the platform tests and Episode 0001 validation from the repository root:

```sh
make episode-runtime-test
make episode-0001-validate
make episode-0001-render
```
