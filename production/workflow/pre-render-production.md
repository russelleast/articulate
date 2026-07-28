# Reviewable Pre-render Production

This workflow makes the cheapest useful review happen before diagram rendering and video assembly. It is an opt-in path for new or migrated episodes; existing config-driven episodes continue to render unchanged.

## Responsibilities

| Artefact | Authority and responsibility | Human editing? |
|---|---|---|
| Written episode | Architectural meaning, conceptual sequence, distinctions, arguments and conclusions | Yes; journal source |
| `narrative.md` | Words and conversational sequence intended for the viewer | Yes; delivery source |
| Recorded audio | Performed words, pauses, pacing and exact duration | Replace/re-record |
| `transcript.json` | Audio-derived timestamp evidence with segment, word and confidence data | Correct recognition errors, not timings by guess |
| `alignment.json` | Explicit mapping across written sections, narrative sections and audio intervals | Review warnings and mismatches |
| `scene-plan.yaml` | Semantic and visual production intent, archetypes, diagrams and phrase-aligned beats | **Primary review surface** |
| `.d2` and reveal metadata | Authored diagram structure and stable visual semantics | **Primary diagram surface** |
| SVG | Deterministic rendering of D2 source | Inspect; do not author |
| `timeline.json` | Exact scene bounds and action timestamps resolved from approved intent | Derived; diagnose rather than hand-edit |
| Renderer config/video | Deterministic frame execution and media assembly | Review output |

The written episode is not a transcript. The narrative is not the complete architectural source. Audio is not a visual specification. The timeline is not an editorial planning document.

## Commands and review loop

```sh
make pre-render-inspect EPISODE=0004

make pre-render-transcript EPISODE=0004 \
  RAW=production/episodes/0004/production/raw-transcription/episode-0004-whisper-base-en.json

make pre-render-align EPISODE=0004
make pre-render-plan-validate EPISODE=0004
make diagrams-render
make pre-render-timeline EPISODE=0004

# A draft may only be compiled deliberately for a review cut.
make pre-render-timeline EPISODE=0004 ALLOW_DRAFT=1 FORCE=1

make pre-render-validate EPISODE=0004
```

Episode adapters may orchestrate these stages plus companion analysis and renderer configuration. Independently runnable stages remain the contract. Regenerating alignment or the timeline does not recreate `scene-plan.yaml`; replacing existing derived files requires `FORCE=1`.

## Drafting and editing a scene plan

Start from all sources. Use the written episode to preserve conceptual order and important distinctions. Use the narrative for what the viewer hears and natural grouping. Use transcript/audio timing to test practical scene boundaries. Use the style guide for established archetypes.

Each section has a stable slug derived from its heading. An explicit `<!-- section-id: value -->` comment overrides the slug when headings are ambiguous. The same ID flows through alignment, scenes, diagrams, timeline and report. If a written section shares a scene, keep its mapping. If it is omitted, add an explicit reason.

Important architectural content defaults to `guided`; central comparisons, named principles and precise conclusions use `prescribed`; connective material may be `open`. Beats use `alignTo` phrases rather than timestamps:

```json
{
  "id": "introduce-scale-out",
  "action": "reveal",
  "target": "scale-out",
  "alignTo": "Scaling out distributes complexity"
}
```

The compiler tries exact/normalised word matching, then fuzzy ordered coverage, then a section-relative fallback. It records the method and confidence on every derived event. Low-confidence section anchors and fallback beats remain review warnings.

## D2 and progressive states

Episode-specific sources and SVGs live together at `production/episodes/<id>/diagrams/`. Import the shared semantic grammar:

```d2
...@../../../diagrams/styles/articulate
agent: "Knowledge agent" { class: agent }
capability: "Retrieve knowledge" { class: capability }
agent -> capability: provides
```

Use stable IDs for nodes and relationships. For progressive teaching, list states in the scene plan or a sidecar file and identify which stable IDs are visible. Prefer deterministic SVG state files when hiding SVG elements reliably would require renderer-specific manipulation. See the [media style guide](../style-guide/README.md) for node, edge, density, text, safe-region and motion rules.

## Validation and manual review

Validation checks coverage, duplicate IDs, supported archetypes/actions, phrase matches, diagram source/render presence and recommended label length. It reports every SVG for manual visual review because automated checks cannot reliably guarantee edge routing, non-overlap or readability at video size.

Before approval, review fidelity to every source section; diagram meaning, density, routing and final-size legibility; subtitle clearance and accessible contrast; phrase fallback warnings and transitions near dense speech; and unresolved notes.

Set `review.status` to `approved` only after that review. Git history records editorial changes; no generated timestamp is required for deterministic production.

## Migration

Older episodes continue to use their reviewed storyboard/scene list, renderer config and timeline. To opt in later:

1. add stable source identifiers where slugging is ambiguous;
2. produce a timestamped transcript and source alignment;
3. create a version 2 scene plan while retaining every section mapping;
4. move episode-specific diagram authorship to `.d2`;
5. review and approve the plan;
6. compile a version 2 timeline and point the episode adapter at it.

No global migration or renderer rewrite is required.
