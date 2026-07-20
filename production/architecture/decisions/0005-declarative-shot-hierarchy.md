# ADR 0005: Declarative Shot Hierarchy

- Status: Accepted
- Date: 2026-07-19

## Context

The declarative scene timeline gives individual visual events stable, narration-relative timing. Episode 0001 Rough Cut 03 showed a second editorial need: long scenes contain several intelligible beats, but a flat event list does not expose those beats to reviewers or manifests. Splitting them into new scenes would change approved narration-derived boundaries; adding scripts or renderer-specific animation would weaken determinism and ownership.

## Decision

Allow a scene to declare an ordered `shots` collection. Each shot has a stable ID, label and scene-relative start. Events inside it use offsets relative to the shot. Before validation and rendering, the runtime flattens those events into the existing scene timeline and resolves them to integer frames.

```text
Narration-derived scene
    → declarative editorial shots
    → shot-relative events
    → flattened scene timeline
    → validated frame state
    → deterministic renderer
```

Shots group editorial intent; they do not select arbitrary renderer code, add media cuts or alter scene timing. Episode configuration owns shot labels and offsets. The timeline runtime continues to own event semantics and validation. The Visual Grammar continues to own visual treatment and motion policy. Manifests retain both the authored hierarchy and flattened event provenance.

## Consequences

- Long scenes can expose meaningful internal beats without changing narration boundaries.
- Review artefacts can sample shot starts as well as event states.
- Event IDs, shot IDs and offsets fail validation before rendering.
- A shot may not overlap the following shot, and its events may not escape the containing scene.
- Existing flat timelines remain valid and unchanged.
- Shots are not a general animation language, nested composition system or substitute for storyboard scenes.

## Alternatives considered

- Add more storyboard scenes: rejected because Episode 0001's approved boundaries are narration-derived.
- Keep one flat event list: rejected because it hides editorial grouping in long scenes and weakens review evidence.
- Add imperative scene scripts: rejected because they mix editorial intent with runtime behaviour and undermine deterministic validation.
- Encode subclips in FFmpeg: rejected because it duplicates timing and composition ownership outside the declarative production model.
