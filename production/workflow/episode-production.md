# Episode Production Workflow

This workflow describes how a canonical written Articulate episode is deliberately adapted into spoken and visual media.

## 1. Confirm Source

Identify the canonical written journal episode under `docs/episodes/` and confirm that it is approved for adaptation. Record its path and version in the production plan.

## 2. Create Production Plan

Use the written episode to define the editorial treatment, audience, target duration, medium-specific goals, major sections, companion usage, required visual assets, risks and review gates.

## 3. Approve the Spoken Narrative

Adapt the journal article for listening and approve it at `production/episodes/<episode>/narrative.md`. This file may be AI-assisted, but it is a separately reviewed artefact that must preserve source meaning and trace important claims to the journal. It becomes the canonical text input for all later video stages.

Narratives should normally:

- welcome the viewer back to the Articulate Journal;
- state briefly what the previous episode established;
- explain how the current episode builds on it and introduce its question;
- use natural spoken language and audible transitions rather than depending on headings or lists;
- preserve the written episode's architectural reasoning;
- label unsupported later additions explicitly instead of presenting them as source claims;
- close by summarising what was established, identifying the unresolved architectural question and connecting it to the next episode.

These are editorial conventions, not fixed boilerplate. Apply them naturally and review each narrative on its own terms.

## 4. Segment the Narrative

Create deterministic paragraph segment identifiers from `narrative.md`:

```sh
make episode-production-segments \
  EPISODE=<episode> \
  JOURNAL=docs/episodes/<written-episode>.md
```

Delivery notes may annotate these segments, but they must not become a competing source of spoken words.

## 5. Draft the Narrative-Aligned Storyboard

Create `production/episodes/<episode>/storyboard.yaml` from the narrative segments. Every scene must reference one or more segment identifiers and all segments must be covered. Visuals should support what is being said with diagrams, animated relationships, architecture sketches, whiteboard sequences, conceptual comparisons, repository views, evidence and reflection. Use short labels; do not display paragraphs of narration as on-screen text.

Storyboard duration estimates support planning. They are not final timing.

## 6. Prepare Scene List and Asset Register

Turn the storyboard into an operational scene list and record all required assets in the asset register. Assets should have identifiers before they are generated, recorded or captured.

## 7. Produce Approved Assets

Create or capture companion scenes, diagrams, slides, whiteboard scenes, code demonstrations, screen recordings and supporting imagery. Record versions, sources and review notes.

## 8. Record Human Voice

Record Russell's narration from the approved `narrative.md`. Retakes and delivery changes should be reflected back into the narrative or explicit edit notes.

The approved recording establishes final duration and scene boundaries. Update the storyboard timing authority to `recorded-audio`, align every scene into a contiguous timeline, and validate it against the measured recording duration before rendering.

## 9. Validate and Assemble Rough Cut

Validate the content contract:

```sh
make episode-production-validate \
  EPISODE=<episode> \
  JOURNAL=docs/episodes/<written-episode>.md
```

Combine narration, scenes, assets, subtitles and preliminary metadata into a rough cut. The rough cut is a review artefact, not a publication candidate.

## 10. Review and Revise

Run the human review gates. Revisions should return to the earliest artefact that explains the problem: plan, script, storyboard, scene list, asset register or edit.

## 11. Prepare Publication Package

Prepare final export, transcript, captions, title, description, chapters, thumbnail, source links and companion disclosure. Subtitles and transcripts derive from the approved narrative and final recorded delivery, never by copying the journal article.

## 12. Publish

Publish only after final approval. Record publication target, date, final source references and any post-publication follow-up.
