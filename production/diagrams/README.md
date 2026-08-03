# Reusable Architectural Diagrams

D2 is the canonical source format for architectural relationships, conceptual decomposition and capability models. PlantUML activity diagrams are used for governed flows, decisions and feedback loops. SVG is the shared interchange format for the journal website, video production and review artefacts. Publication styling is applied after notation rendering so diagram semantics do not depend on where the diagram will appear.

## Structure

```text
production/diagrams/
|-- styles/articulate.d2       # Small shared visual foundation
`-- sources/
    |-- knowledge/             # Knowledge structures and examples
    |-- reasoning/             # Reasoning flows, layers and maps

production/episodes/<episode>/diagrams/
|-- <diagram>.{d2,puml}        # Episode-owned semantic source
`-- <diagram>.svg              # Deterministic review/video rendering

site/public/diagrams/              # Generated, committed shared SVGs
```

Shared sources are organised by enduring architectural concept rather than by the episode that first uses them. Episode-specific diagrams live with the episode's production artefacts; reusable diagrams should move into a conceptual area. Each diagram remains deliberately readable and can override shared classes locally.

Every diagram is represented by a `type: diagram` entry in `production/assets/registry.yaml`. The entry binds its stable logical ID and `format` (`d2` or `plantuml`) to its semantic `source` and generated SVG `location`. This extends the existing asset model rather than introducing a second manifest.

## Install the notation renderers

Install the official D2 CLI using the instructions at <https://d2lang.com/tour/install>. Production commands never install system dependencies. Confirm that `d2 --version` succeeds on `PATH`.

Install PlantUML using the instructions at <https://plantuml.com/starting> when the registry contains PlantUML sources. Confirm that `plantuml -version` succeeds on `PATH`.

The renderer fixes the ELK layout engine, D2 theme ID, padding and non-sketch rendering convention for D2, and SVG pipe output with UTF-8 input for PlantUML. Pin both CLI versions in CI or a production environment when byte-for-byte output stability across machines is required.

## Render and validate

```bash
make diagrams-validate
make diagrams-render
make diagram-render DIAGRAM=knowledge-reasoning-flow
```

Validation discovers shared `.d2` and `.puml` files under `sources/` and also validates every diagram source registered elsewhere, including episode-local sources. Rendering creates output directories and replaces generated SVGs safely. A notation parse or layout failure is reported with the diagram ID. Never edit generated SVG; change its semantic source and regenerate it.

## Website use

Generated SVGs live in Astro's existing public directory, which also leaves them resolvable by the production asset provider. Episode Markdown uses a deployment-neutral public path:

```markdown
![Knowledge reasoning flow](/diagrams/knowledge-reasoning-flow.svg)
```

Astro's Markdown configuration adds the configured `base` during rendering, so the example becomes `/articulate/diagrams/knowledge-reasoning-flow.svg` on GitHub Pages without embedding that deployment detail in the canonical Episode. The pre-development, check, and build publication step scans published Episodes and requires every `/diagrams/<diagram-id>.svg` reference to match a registry entry with both its D2 source and generated SVG present. The site build then copies `site/public/diagrams/` into the final static output.

VS Code Markdown Preview resolves root-relative image URLs against a preview origin rather than Astro's public directory and base-path transform, so these images do not appear in its standalone preview. This is expected: use `npm run dev` in `site/` to preview the canonical publication result. Do not add `/articulate` to source Markdown or duplicate SVGs beside Episodes to accommodate the editor preview.

When publishing an Episode with a diagram:

1. author or update reusable D2 or PlantUML under `production/diagrams/sources/<concept>/`; move an episode-local diagram there before publishing it as a shared website asset;
2. run `make diagrams-render` from the repository root (never edit the SVG directly);
3. reference the shared SVG as `/diagrams/<diagram-id>.svg` in the Episode;
4. run the site check and build, which validate the reference and publish the static asset.

Reusable diagrams stay in the shared namespace and can be referenced by any number of Episodes. Episode-owned diagrams use an `episode-<episode>-` asset ID and set the registry's `episode` field. An absent registry entry, D2 source, or generated SVG fails the publication step before Astro builds.

## Video use

The global registry makes each generated SVG resolvable through `AssetManager`. When that shared SVG enters the video runtime, the `video-dark` publication profile normalises it before scene composition. The committed website SVG is not modified.

```text
Diagram source
  -> notation SVG renderer
  -> shared standalone SVG
  -> video-dark profile
  -> normalised transparent SVG
  -> Focus Canvas viewport
```

The profile contract requires a positive root `viewBox` and produces deterministic `image/svg+xml` with:

- a transparent outer background;
- `data-articulate-diagram-profile="video-dark"` and a profile version;
- dark-video palette roles for visible nodes, labels and connectors;
- preserved SVG masks and renderer support structures;
- `xMidYMid meet` aspect-ratio behaviour;
- a stable padded viewport and an 18-pixel minimum text target at 1080p.

The contract is renderer-neutral. The current adapter removes D2's page rectangle; a future notation renderer can supply its own canvas-removal adapter and then use the same normalised SVG and Focus Canvas contract.

A static diagram scene uses the existing declarative scene configuration:

```json
{
  "id": "S008",
  "kind": "diagram",
  "diagramAssetId": "knowledge-reasoning-flow",
  "headline": "Retrieval becomes part of reasoning",
  "support": "Choose the knowledge access method required by the question.",
  "companion": false,
  "assetIds": ["A008"],
  "transition": "cut"
}
```

The episode asset register should still record the episode-local usage (`A008`) for provenance and review. `diagramAssetId` identifies the reusable binary input. Validation resolves it through `AssetManager`, requires its registry type to be `diagram`, applies the same profile used during rendering, and fails malformed SVG before frame generation.

The 18-pixel value is a publication target, not permission to enlarge text independently of its rendered nodes. If a dense source cannot meet it in the selected Focus Canvas viewport, simplify the diagram, split the scene or choose a more suitable D2 layout.

## Choreography boundary

The notation source describes diagram semantics: concepts, relationships or process flow. A version 2 scene plan describes audience experience through progressive states and phrase-aligned beats that address stable renderer element IDs where supported. The pre-render validator checks those references. The current pilot renderer uses a deterministic full-state SVG; state SVG generation or renderer-controlled visibility can evolve behind this contract without moving choreography into the semantic source.
