# Visual Grammar Renderer

The renderer is the deterministic runtime expression of the canonical [Articulate Visual Grammar](../../../docs/media/visual-grammar.md). The grammar remains an editorial contract; this directory contains the smallest executable projection needed by approved episodes.

```text
Storyboard scene
      |
      v
Compatibility vocabulary (`kind`, `transition`, `companion`)
      |
      v
Declarative scene timeline
  - semantic element targets
  - scene-relative event offsets
  - optional editorial shots with shot-relative events
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
Frame-indexed presentation state
      |
      v
Deterministic SVG frame
```

## Responsibilities

- `visual-grammar.mjs` owns the selected runtime profile: safe area, palette, typography roles, spacing, composition grids, scene-kind mappings and transition semantics.
- `layout.mjs` owns deterministic text wrapping, multiline block measurement, vertical centring, padding helpers and overflow failure.
- `scene-renderer.mjs` interprets a resolved presentation plan using reusable Companion, repository, flow, grid, timeline, radial and reflection compositions.
- `scene-timeline.mjs` validates editorial events, resolves seconds to integer frames and produces immutable presentation state for a requested frame.
- `scene-shots.mjs` validates editorial shot groups and flattens their relative events into the existing scene timeline while retaining shot provenance.
- `episode-cli.mjs` remains responsible for episode input, asset resolution, timing validation, media assembly, manifests and review artefacts.

Episode content belongs in episode configuration. The renderer must not contain episode titles, excerpts, claims, asset-register locations or scene-specific coordinate exceptions.

Scene frame windows are calculated from rounded global start and end frames, not by rounding every scene duration independently. Adjacent scenes therefore share the same frame boundary and cannot accumulate audiovisual drift across a long episode.

## Supported Visual Grammar concepts

- Scene archetypes are resolved as `Narrator`, `Diagram`, `Repository`, `Evidence` or `Reflection`.
- Composition strategies are selected declaratively rather than through episode-specific branching.
- Typography and spacing policies are shared by all compositions.
- Fixed-height boxes use the complete multiline block height for vertical alignment.
- Text that exceeds its allowed lines fails episode validation instead of being silently clipped.
- A consistent title-safe area and reusable standard, reflection and Companion composition grids are defined by the profile.
- Transition intent is resolved into semantic and runtime behaviour. Episode 0001's existing `fade` and `section` values remain compatibility inputs and still render as deterministic cuts.
- Render manifests expose the resolved archetype, composition and transition plan for review and provenance.
- Motion treatments and directional connector styling remain owned by `visual-grammar.mjs`; episode timelines state what changes, never opacity curves, coordinates or FFmpeg filters.
- The Architectural Studio composition combines the approved Companion asset with a reusable working surface. `motion.companionIdle` opts a scene into deterministic frame-indexed breathing/settling motion; it does not imply lip-sync or facial animation.
- Architectural Whiteboard, Digital Workspace and Focus Canvas compositions extend the same environment language without changing the declarative scene model. Episode data selects a small layout treatment while content and timing remain episode-owned.
- Shared box connectors terminate at calculated node boundaries. Curved fan-out connectors allocate distinct source ports and approach destinations along a stable final tangent so arrowheads align cleanly.
- Review generation can include every authored timeline state when `review.includeTimelineStates` is enabled, allowing progression to be reviewed independently of the final hold.
- Long-form episodes can request a fixed-interval temporal contact sheet with `review.temporalSampleSeconds`, complementing scene-final frames with evidence of pacing across the complete render.

## Declarative scene timelines

A scene may declare a `timeline.events` array. Offsets are relative to the scene start and resolve with `round(at * frameRate)`. Optional `duration` or `end` values use the same rule. Rendering evaluates state from the resulting integer frame, never wall-clock time.

Stable targets are semantic: `headline`, `support`, `item-1` through `item-n`, `centre` for radial compositions, `repository-window`, `evidence-1` through `evidence-n`, and `companion` where applicable. Layout code remains free to reposition those elements.

```json
{
  "timeline": {
    "events": [
      { "id": "show-question", "at": 2.4, "action": "reveal", "target": "item-1" },
      { "id": "show-source", "at": 5.2, "action": "reveal", "target": "item-2" },
      { "id": "relate", "at": 7.8, "action": "connect", "from": "centre", "to": "item-2" },
      { "id": "conclude", "at": 9.0, "duration": 2.0, "action": "emphasize", "target": "centre" }
    ]
  }
}
```

Supported actions are `reveal`, `hide`, `emphasize`, `deemphasize`, `connect`, `disconnect`, `replace`, `transition` and restrained repository-oriented `type`. Reveal and typing targets begin hidden automatically. Directional connections use the grammar connector and always receive its arrowhead; set `directional: false` only when the authored relationship is genuinely non-directional.

Validation rejects duplicate event IDs, unknown targets, missing connection endpoints, negative times or durations, events beyond a scene, incompatible simultaneous target actions, premature references to hidden elements, invalid typing contexts, missing directional arrowheads and text overflow in the complete state. Errors include episode, scene, event, offset, target and reason. Scenes without timelines resolve to a complete initial state and retain legacy rendering.

Typing is intentionally restricted to the `Repository` archetype unless an episode explicitly records `allowTyping`. It reveals authored text by character count from integer frames. It is not a general heading or diagram-label treatment.

The render manifest records declared and resolved events, frame numbers, resolved times, targets, selected grammar treatments, warnings and a link to the full timeline resolution report.

## Declarative shot hierarchy

Long scenes may group events into ordered `shots`. A shot starts at a scene-relative offset; its event offsets are relative to that shot. The runtime flattens them before applying the normal timeline validation and frame resolution, so shots add editorial structure without adding a second animation system.

```json
{
  "shots": [
    {
      "id": "evidence",
      "label": "Evidence accumulates",
      "at": 8,
      "events": [
        { "id": "show-source", "at": 1, "action": "reveal", "target": "item-2" },
        { "id": "connect-source", "at": 1, "action": "connect", "from": "item-1", "to": "item-2" }
      ]
    }
  ]
}
```

Shot IDs, order, bounds and event containment are validated. The render manifest records authored and resolved shot timing, and timeline-state review includes shot starts. See [ADR 0005](../../architecture/decisions/0005-declarative-shot-hierarchy.md).

## Adding an event type safely

1. Define its editorial semantics and valid targets in `scene-timeline.mjs`.
2. Add its visual treatment policy to the Visual Grammar profile.
3. Resolve it entirely from authored data and integer frame state.
4. Add validation for incompatible state and scene-boundary failure.
5. Add state, renderer, manifest and deterministic-output tests.
6. Demonstrate a repeated editorial need before using it across episodes.

## Deliberately deferred

Motion interpolation, easing, physical movement, runtime speech recognition, actual dissolves, arbitrary scripting and a general animation framework remain out of scope. `transition` is represented semantically but the v1 grammar still resolves it to a deterministic cut. Caption-safe collision checks remain future work.

## Validation

Run the platform tests and Episode 0001 validation from the repository root:

```sh
make episode-runtime-test
make episode-0001-validate
make episode-0001-render
```
