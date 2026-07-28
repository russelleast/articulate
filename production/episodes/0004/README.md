# Episode 0004 Production

Written journal: [`docs/episodes/0004-system-characteristics-the-properties-every-system-needs.md`](../../../docs/episodes/0004-system-characteristics-the-properties-every-system-needs.md)

Spoken production source: [`narrative.md`](narrative.md)

Rough Cut 01 uses the complete recorded narration as timing authority. A local `whisper.cpp` base English transcript is normalised into `transcript.json`; ordered narrative anchors produce `alignment.json`; the editable `scene-plan.yaml` generates the production storyboard, phrase-level timeline cues and render configuration.

From the repository root:

```sh
make episode-0004-rough-cut-01-analyse
make episode-0004-rough-cut-01-render
make episode-0004-rough-cut-01-review
```

The Whisper model is an ignored local preparation dependency at `production/cache/transcription/models/ggml-base.en.bin`. The raw transcription used for this cut is retained under `production/episodes/0004/production/raw-transcription/`.
