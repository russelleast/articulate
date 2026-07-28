# ADR 0008: Review semantic and visual intent before timeline generation

- Status: Accepted
- Date: 2026-07-28

## Context

The renderer timeline had become the first complete description of an episode's visual treatment. That placed semantic choices, visual choices, phrase timing and renderer execution detail in one artefact. A rough cut was therefore the earliest practical way to discover an omitted argument, weak visual metaphor or inappropriate scene composition.

The source authorities are different: the written episode owns architectural meaning and structure; the verbal narrative owns spoken delivery; the recording owns performed timing; diagrams own visual structure; and the renderer timeline owns exact execution.

## Decision

Introduce an optional version 2 pre-render workflow:

```text
written episode + narrative + audio + style guide
  -> transcript
  -> source alignment
  -> draft scene plan
  -> human review
  -> D2 sources and SVGs
  -> exact timeline
  -> deterministic renderer
```

`scene-plan.yaml` is the primary review surface. It records source sections, archetype, purpose, authority, diagram intent, concise labels, phrase-aligned beats and review state without exact timestamps. `alignment.json` maps written, narrative and audio authorities. `timeline.json` is derived and may be regenerated without replacing the plan.

Timeline compilation requires an approved plan by default. An explicit draft override is permitted only to produce a review render and is recorded in the generated timeline.

Episode-local D2 source is first-class. Shared semantic classes define architectural meaning; SVG remains a derived asset. Automated validation reports structural problems and identifies visual checks that still require a person.

## Consequences

- Architectural omissions and visual intent can be reviewed before rendering.
- Manual scene-plan edits survive alignment, diagram and timeline regeneration.
- Phrase timing is reproducible and low-confidence fallbacks are visible.
- The workflow adds explicit intermediate artefacts, but each has one coherent responsibility.
- Existing episode configs and timelines remain supported. Migration is opt-in through a version 2 scene plan.
- Draft review cuts remain possible without misrepresenting them as editorially approved.
