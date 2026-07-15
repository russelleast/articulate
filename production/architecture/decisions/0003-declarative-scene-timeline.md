# ADR 0003: Declarative Scene Timeline

- Status: Accepted
- Date: 2026-07-14

## Context

The Media Platform rendered one complete SVG composition for each narration-derived scene. Episode 0001 review showed a repeated editorial defect: lists, questions and relationships arrived before the narration introduced them. Encoding extra FFmpeg shots would duplicate layout knowledge and make editorial intent difficult to inspect.

## Decision

Introduce a declarative temporal layer after storyboard resolution and before deterministic rendering:

```text
Canonical episode → narration timing → storyboard scene → scene timeline
→ resolved presentation plan and frame state → deterministic renderer → video
```

Timeline events address stable semantic element IDs and express scene-relative numeric offsets. The runtime validates each event and resolves seconds to integer frames before rendering. The Visual Grammar owns treatments, connector appearance and arrowheads. The episode owns event sequence and timing. Render manifests retain declarations and resolved values.

The initial vocabulary is `reveal`, `hide`, `emphasize`, `deemphasize`, `connect`, `disconnect`, `replace`, `transition` and repository-restricted `type`. Static scenes resolve to the complete legacy state.

## Consequences

- Editorial progression is reusable without scene-specific renderer branches.
- Identical content, timing, grammar, assets and renderer version produce identical frame states.
- Timeline validation can fail before expensive media assembly.
- Directional relationships consistently use grammar-approved arrowheads.
- Rendering may produce more encoded state spans than storyboard scenes; typing intentionally produces frame-indexed spans.
- Authors use stable semantic targets instead of layout coordinates.

## Alternatives considered

- Additional storyboard scenes: rejected because they change narration boundaries and duplicate scene content.
- Raw FFmpeg filters in episode data: rejected because they leak runtime implementation into editorial intent.
- General animation framework or scripting language: rejected as unnecessary capability and a determinism risk.
- Runtime speech recognition: rejected because alignment must be authored or derived before render.
