# Episode 0010 — ADR 0001: Defining the Runtime Requirements

This short transitional production uses the approved presenter recording to move from the conceptual architecture to the runtime investigation.

## Authorities

- Written episode: `docs/episodes/0010-selecting-an-agent-runtime.md`
- Approved verbal narrative: `production/episodes/0010/narrative.md`
- Timing and subtitle authority: `production/episodes/0010/ep10-narrator-edited.mp4`
- Scene contract: `production/episodes/0010/scene-plan.yaml`

## Final assets

- Video: `production/episodes/0010/output/episode-0010-final.mp4`
- Subtitles: `production/episodes/0010/output/episode-0010-final.srt`
- Thumbnail: `production/episodes/0010/publication/thumbnail/episode-0010-thumbnail.png`

## Reproduce

```sh
make episode-0010-presenter-prepare
node production/episodes/0010/production/generate-pre-render-review.mjs
make episode-0010-presenter-render
make episode-0010-presenter-review
```

The main runtime model is rendered as two complete D2 diagram states. The memory transition remains deliberately unresolved and leads into Episode 11.
