# Episode 0004 Production

Written journal: [`docs/episodes/0004-system-characteristics-the-properties-every-system-needs.md`](../../../docs/episodes/0004-system-characteristics-the-properties-every-system-needs.md)

Spoken production source: [`narrative.md`](narrative.md)

Rough Cut 01 is the pilot for the version 2 reviewable pre-render workflow. The written episode is semantic authority, the verbal narrative is delivery authority, and the complete recording is timing authority. A local `whisper.cpp` base English transcript is normalised into `transcript.json`; `alignment.json` maps the recording to both written and narrative sections; the editable `scene-plan.yaml` records semantic and visual intent before the derived `timeline.json`.

The plan is intentionally marked `draft`. The current MP4 is a review render produced with an explicit draft override, not an editorially approved final.

From the repository root:

```sh
make pre-render-inspect EPISODE=0004
make pre-render-plan-validate EPISODE=0004
make pre-render-validate EPISODE=0004
make episode-0004-rough-cut-01-analyse
make episode-0004-rough-cut-01-render
make episode-0004-rough-cut-01-review
```

The Whisper model is an ignored local preparation dependency at `production/cache/transcription/models/ggml-base.en.bin`. The raw transcription used for this cut is retained under `production/episodes/0004/production/raw-transcription/`.

Episode-authored D2 sources and rendered SVGs live together in `diagrams/`. Shared node and edge semantics are defined by `production/diagrams/styles/articulate.d2` and documented in the media style guide.
