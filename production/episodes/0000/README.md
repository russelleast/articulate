# Episode 0000 Production

This is the production working area for Episode 0000, "Welcome to the Articulate Journal".

Canonical editorial source: [`docs/episodes/0000-welcome-to-the-articulate-journal.md`](../../../docs/episodes/0000-welcome-to-the-articulate-journal.md)

Timing authority: the final recorded narration, registered as `episode-0000-narration-v1` and held in the ignored production cache.

The first milestone is not the complete episode. It is Production Quality Baseline v1: a reviewable 35.558-second sequence proving the Architectural Studio, Companion presence, restrained idle motion, a working visual surface, progressive reveals and directional relationships.

## Commands

```sh
make assets-validate
make episode-0000-analyse
make episode-0000-baseline-validate
make episode-0000-baseline-render
make episode-0000-baseline-review
```

Generated media remains outside Git:

- video: `production/episodes/0000/output/episode-0000-production-quality-baseline-v1.mp4`;
- review frames/contact sheet: `production/episodes/0000/output/review/production-quality-baseline-v1/`;
- manifests/provenance/timing reports: `production/episodes/0000/generated/production-quality-baseline-v1/`.

The complete episode is planned in [`storyboard.md`](storyboard.md). Production should stop after review of the baseline before applying this direction to the remaining narration.
