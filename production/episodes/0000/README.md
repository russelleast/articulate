# Episode 0000 Production

Written journal: [`docs/episodes/preface.md`](../../../docs/episodes/preface.md)

Legacy spoken narrative: [`0000-welcome-to-the-articulate-journal.md`](0000-welcome-to-the-articulate-journal.md). This episode predates the `narrative.md` convention; render configurations mark the exception explicitly and do not fall back to the journal article.

This is the production working area for Episode 0000, "Welcome to the Articulate Journal".

Canonical editorial source: [`0000-welcome-to-the-articulate-journal.md`](0000-welcome-to-the-articulate-journal.md)

Timing authority: the final recorded narration, registered as `episode-0000-narration-v1` and held in the ignored production cache.

Production Quality Baseline v1 established and received approval for the Architectural Studio, Companion presence, restrained idle motion, working visual surface, progressive reveals and directional relationships. The approved language is now applied across the complete episode through the Architectural Studio, Architectural Whiteboard, Digital Workspace and Focus Canvas.

Publication artwork is maintained as a first-class episode artefact under [`publication/thumbnail/`](publication/thumbnail/). The Episode 0000 thumbnail source produces three related 1280 × 720 candidates, reduced-size previews and a comparison contact sheet without modifying the approved video assets.

## Commands

```sh
make assets-validate
make episode-0000-analyse
make episode-0000-validate
make episode-0000-render
make episode-0000-review
make episode-0000-companion-performance-prepare
make episode-0000-companion-performance-validate
make episode-0000-companion-performance-render
make episode-0000-companion-performance-review
make episode-0000-final-cut-prepare
make episode-0000-final-cut-validate
make episode-0000-final-cut-render
make episode-0000-final-cut-review
make episode-0000-baseline-validate
make episode-0000-baseline-render
make episode-0000-baseline-review
```

Generated media remains outside Git:

- complete episode: `production/episodes/0000/output/episode-0000-final-v1.mp4`;
- complete review frames/contact sheet: `production/episodes/0000/output/review/final-v1/`;
- complete manifests/provenance/timing reports: `production/episodes/0000/generated/final-v1/`;
- Companion performance candidate: `production/episodes/0000/output/episode-0000-companion-performance-v1.mp4`;
- Companion performance review frames/contact sheet: `production/episodes/0000/output/review/companion-performance-v1/`;
- Companion performance manifests/provenance/timing reports: `production/episodes/0000/generated/companion-performance-v1/`;
- final-cut candidate v2: `production/episodes/0000/output/episode-0000-final-cut-candidate-v2.mp4`;
- final-cut candidate review frames/contact sheet: `production/episodes/0000/output/review/final-cut-candidate-v2/`;
- final-cut candidate manifests/provenance/timing reports: `production/episodes/0000/generated/final-cut-candidate-v2/`;
- video: `production/episodes/0000/output/episode-0000-production-quality-baseline-v1.mp4`;
- review frames/contact sheet: `production/episodes/0000/output/review/production-quality-baseline-v1/`;
- manifests/provenance/timing reports: `production/episodes/0000/generated/production-quality-baseline-v1/`.

The complete narration treatment is recorded in [`storyboard.md`](storyboard.md). The full render remains narration-authoritative and preserves the 261.848141-second master without trimming.

The Companion performance candidate extends the human-reviewed Revision 004 facial treatment only to the scenes where the Companion is already present (`S001`, `S008`, `S012`). The other ten scenes remain pixel-identical to `final-v1` at sampled review points. Scene-relative performance timelines are derived offline from lossless narration extracts with fixed seeds; the candidate does not replace `final-v1` until full-video human review is complete. See [`reviews/companion-performance-v1.md`](reviews/companion-performance-v1.md).

Final-cut candidate v2 applies the subsequent full-episode review: spoken-word reveal corrections, a 02:18 boundary correction, synchronized box-and-connector reveals, removal of unsupported copy/emphasis, and a clean Companion capability hierarchy. See [`reviews/final-cut-candidate-v2.md`](reviews/final-cut-candidate-v2.md).
