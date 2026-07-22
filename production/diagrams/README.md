# D2 Diagrams

D2 is the canonical source format for reusable Articulate architectural diagrams. SVG is the shared delivery format for the journal website, video production and review artefacts.

## Structure

```text
production/diagrams/
|-- styles/articulate.d2       # Small shared visual foundation
`-- sources/
    |-- knowledge/             # Knowledge structures and examples
    `-- reasoning/             # Reasoning flows, layers and maps

site/public/diagrams/              # Generated, committed shared SVGs
```

Sources are organised by enduring architectural concept rather than by the episode that first uses them. An episode-specific diagram may live below `sources/episodes/<episode>/`, but reusable diagrams should move into a conceptual area. Each diagram remains deliberately readable and can override shared classes locally.

Every diagram is represented by a `type: diagram` entry in `production/assets/registry.yaml`. The entry binds its stable logical ID to its D2 `source` and generated SVG `location`. This extends the existing asset model rather than introducing a second manifest.

## Install D2

Install the official D2 CLI using the instructions at <https://d2lang.com/tour/install>. Production commands never install system dependencies. Confirm that `d2 --version` succeeds on `PATH`.

The renderer fixes the ELK layout engine, D2 theme ID, padding and non-sketch rendering convention. Pin the D2 CLI version in CI or a production environment when byte-for-byte output stability across machines is required.

## Render and validate

```bash
make diagrams-validate
make diagrams-render
make diagram-render DIAGRAM=knowledge-reasoning-flow
```

Validation discovers all `.d2` files under `sources/`, requires each one to have exactly one registry entry, checks registry paths and renders every source to a temporary directory. Rendering creates output directories and replaces generated SVGs safely. A D2 parse or layout failure is reported with the diagram ID. Never edit an SVG in `site/public/diagrams/`; change its D2 source and regenerate it.

## Website use

Generated SVGs live in Astro's existing public directory, which also leaves them resolvable by the production asset provider. With the current GitHub Pages base path, episode Markdown references a generated diagram as:

```markdown
![Knowledge reasoning flow](/articulate/diagrams/knowledge-reasoning-flow.svg)
```

The initial Episode 8 ASCII blocks are retained until the generated diagrams receive editorial review. Once approved, replace each block deliberately and retain useful prose as the accessible explanation.

## Video use

The global registry makes each generated SVG resolvable through `AssetManager`. A static diagram scene uses the existing declarative scene configuration with the new diagram kind:

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

The episode asset register should still record the episode-local usage (`A008`) for provenance and review. `diagramAssetId` identifies the reusable binary input. Validation resolves it through `AssetManager`, requires its registry type to be `diagram`, and the renderer embeds the SVG in the 1920×1080 frame.

## Choreography boundary

The D2 source describes diagram semantics: concepts and their relationships. A future storyboard capability should describe audience experience: node and edge reveals, path highlights, dimming and camera focus. That choreography belongs in scene/timeline metadata and should address stable diagram element identities; it must not be encoded by creating presentation-specific copies of the semantic source.
