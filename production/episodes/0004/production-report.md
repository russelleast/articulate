# Episode 0004 Rough Cut 01 Production Report

## Result

Rough Cut 01 covers the complete 16:12 recording in 21 scenes using the Articulate Narrator, Diagram, Whiteboard, Repository and Reflection grammar. The Companion anchors the opening, scalability transition, qualities reflection and Episode 5 close. The cut is deterministic and ready for narrative, scene-selection and pacing review.

## Timing and transcript

- Timing authority: `ep4-system-characteristics.wav` (972.302902 seconds).
- Transcript engine: local `whisper.cpp` with `base.en`; no audio was uploaded.
- Transcript: 227 segments with word timing and mean token confidence.
- Section alignment: 21 ordered narrative sections, gap-free from 00:00.000 to 16:12.303.
- Phrase-aligned timeline: 121 reveal and connection events.
- Lower-confidence section anchors:
  - Scaling Up and Scaling Out — 500.080 seconds, confidence 0.714.
  - Evaluating Agent Architectures — 795.770 seconds, confidence 0.750.

The normalisation pass corrected clear speech-recognition errors such as “fails” → “feels”, “petitioning” → “partitioning”, and “placement” → “replacement”. These are transcript corrections only. No audio edits were made.

## Visual interpretation

The scene sequence includes functionality versus characteristics, architectural trade-offs, trust boundaries, reliability responses, the reasoning pipeline, infrastructure and intelligence scaling, scale-up versus scale-out, Coherence Before Size, AI-native observability, evolvability, an operational control plane, testing versus evaluation, agent-architecture evaluation, capabilities/DCL, closing qualities, and the Episode 5 hand-off.

`Coherence Before Size` uses the published Articulate principle: decomposition is driven by diverging responsibility and coherence, with routing, context, trust, evaluation and failure boundaries made explicit.

Episode 5 is named accurately as **How I Approach Solution Design and Evolving the Architecture**.

## Audio and manual review

- Audio treatment: unchanged; full recording preserved.
- Natural spoken imperfections retained, including the repeated phrasing near 13:47.
- Review the 22 transcript segments below 0.90 confidence before publication.
- Review cue wording and line breaks before publishing subtitles.
- Review whether the long Scaling the Agent System section needs an additional visual beat in Rough Cut 02.

## Validation

- Full narration represented: passed.
- All 21 narrative sections represented: passed.
- Scene timing gaps/overlaps: 0/0.
- Video stream: 972.320000 seconds; audio stream: 972.302993 seconds.
- End delta: 0.017007 seconds, below one 25 fps frame.
- Scalability includes scaling up and scaling out: passed.
- Coherence Before Size presented as an Articulate principle: passed.
- Closing points to the correct Episode 5: passed.
- Text overflow checks: passed.
- D2 overlap/readability visual QA: passed after recomposing the capability diagram horizontally.
- Runtime tests: 49 passed.

## Commands

```sh
make episode-0004-rough-cut-01-analyse
make episode-0004-rough-cut-01-render
make episode-0004-rough-cut-01-review
node --test production/runtime/tests/*.test.mjs
```

## Outputs

- Rough cut: `output/episode-0004-rough-cut-01.mp4`
- Transcript: `transcript.json`
- Subtitle file: `publication/subtitles/episode-0004-en.srt`
- Timestamped text transcript: `publication/subtitles/episode-0004-transcript.txt`
- Narrative alignment: `alignment.json`
- Editable scene plan: `scene-plan.yaml`
- Resolved timeline: `timeline.json`
- Generated storyboard: `storyboard.yaml`
- D2 sources: `../../diagrams/sources/episodes/0004/`
- Rendered SVGs: `../../../site/public/diagrams/episode-0004-*.svg`
- Review package: `output/review/rough-cut-01/`
- Render manifest and provenance: `generated/rough-cut-01/`
