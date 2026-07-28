# Episode 0004 Pre-render Pilot Production Report

## Result

Episode 4 is the first version 2 pre-render migration. The 16:12.303 recording is represented by 21 source-aligned scenes and 12 episode-local D2 diagrams. A deterministic review rough cut was rendered from the draft scene plan using an explicit draft override; the plan remains `draft` pending human semantic and final-size visual review.

The next episode is identified as **How I Approach Solution Design and Evolving the Architecture**.

## Sources

- Written authority: `docs/episodes/0004-system-characteristics-the-properties-every-system-needs.md`
- Delivery authority: `production/episodes/0004/narrative.md`
- Timing authority: `production/episodes/0004/ep4-system-characteristics.wav`
- Style authority: `production/style-guide/archetypes.json`
- Transcript engine: local `whisper.cpp`, `base.en`, with word timing and confidence

All 21 written sections and all 21 narrative sections were detected and represented. No sections were merged or omitted. The `Quality Assurance` narrative section explicitly maps to the written `Quality Assurance: Testing and Evaluation` section.

## Alignment and timing

- Audio interval coverage: 00:00.000–16:12.303, gap-free.
- Lower-confidence section anchor: `scaling-up-and-scaling-out`, confidence 0.714.
- Phrase fallbacks: the spoken recording does not name `workflow engines`, `actor models`, or `caching` in S003 even though the written episode uses those pattern examples. They remain written-source visual context and are reported for review rather than silently assigned false phrase matches.
- Transcript corrections: clear recognition substitutions only, including “fails” → “feels”, “petitioning” → “partitioning”, and “placement” → “replacement”.
- Audio edits: none; the full recording is preserved.
- Video stream: 972.320000 seconds.
- Audio stream: 972.302993 seconds.
- End delta: 0.017007 seconds, below one 25 fps frame.

## Scene plan and diagrams

Archetypes used: Narrator, Diagram, Whiteboard, Repository and Reflection. Prescribed scenes include functionality versus characteristics, the trust chain, scaling up versus out, Coherence Before Size, capability evaluation, the architectural-qualities conclusion and the Episode 5 hand-off.

D2 sources and SVGs created:

1. functionality versus characteristics;
2. architectural patterns influencing characteristics;
3. trust across intent, reasoning, tools and outcomes;
4. the AI-native reasoning/performance pipeline;
5. scaling one agent;
6. scaling an agent system;
7. scaling up versus scaling out;
8. boundary costs under Coherence Before Size;
9. AI-native observability;
10. testing versus evaluation;
11. evaluation across an agent architecture;
12. capabilities as evaluation contracts.

`Coherence Before Size` is treated as an Articulate principle: size is not the primary criterion; responsibilities remain coherent; decomposition moves complexity; new routing, context, trust, failure and evaluation boundaries have a cost; and splitting is justified when responsibilities diverge or become harder to understand, secure, evaluate, operate or evolve.

## Validation

- Version 2 scene-plan structural validation: passed.
- Written section coverage: 21/21.
- Narrative section coverage: 21/21.
- Duplicate scene/diagram IDs: none.
- D2 source and SVG presence: passed for all 12 Episode 4 diagrams.
- D2 syntax validation: passed as part of 25 registered sources.
- Renderer timeline: 21 scenes, no gaps or overlaps.
- Runtime tests: 53 passed.
- Rough cut stream probe: passed.
- Representative frame extraction: passed.

Automated D2 overlap/readability validation is deliberately not claimed. A nine-scene sample showed coherent structure and no obvious clipping, but the denser diagrams require manual inspection at final video size.

Progressive states are explicit, validated metadata over stable D2 element IDs. The pilot renderer deliberately uses each diagram's deterministic full-state SVG; generating or switching deterministic state SVGs is the next renderer integration, rather than introducing a hidden animation system in this migration.

## Commands executed

```sh
make episode-0004-rough-cut-01-prepare
make pre-render-validate EPISODE=0004
make episode-0004-rough-cut-01-validate
node --test production/runtime/tests/*.test.mjs
node production/runtime/episode-cli.mjs render \
  --config production/episodes/0004/production/rough-cut-01-config.json
ffprobe production/episodes/0004/output/episode-0004-rough-cut-01.mp4
```

## Outputs

- Review rough cut: `output/episode-0004-rough-cut-01.mp4`
- Reviewable intent: `scene-plan.yaml`
- Cross-source alignment: `alignment.json`
- Audio-derived transcript: `transcript.json`
- Derived execution timeline: `timeline.json`
- D2 source and SVG directory: `diagrams/`
- Renderer config: `production/rough-cut-01-config.json`
- Render provenance: `generated/rough-cut-01/`
- Subtitles: `publication/subtitles/episode-0004-en.srt`

## Remaining human review

- Approve or request changes to the semantic/visual choices in `scene-plan.yaml`.
- Inspect all 12 SVGs at 1920×1080 final size, especially label size, edge routing and diagram density.
- Decide whether the three written-only S003 pattern examples should remain visible, be grouped, or be removed from the spoken cut.
- Review the 0.714 scale-up/scale-out section anchor and the 22 transcript segments below 0.90 confidence.
- Review subtitles, pacing, natural speech imperfections and the long Scaling the Agent System scene.
- Change `review.status` to `approved` only after these checks; regenerate the timeline without the draft override before a final render.
