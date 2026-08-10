# Episode 0009 — Defining Architectural Behaviour with DCL

This production adapts the canonical written episode and approved presenter recording into the Articulate presenter-video grammar.

## Authorities

- Written episode: `docs/episodes/0009-defining-architectural-behaviour-with-dcl.md`
- Approved verbal narrative: `production/episodes/0009/narrative.md`
- Timing and subtitle authority: `production/episodes/0009/ep09-narrative.mp4`
- Scene contract: `production/episodes/0009/scene-plan.yaml`

## Final assets

- Video: `production/episodes/0009/output/episode-0009-final.mp4`
- Subtitles: `production/episodes/0009/output/episode-0009-final.srt`
- Thumbnail: `production/episodes/0009/publication/thumbnail/episode-0009-thumbnail.png`

## Reproduce

```sh
make episode-0009-presenter-prepare
node production/episodes/0009/production/generate-pre-render-review.mjs
make episode-0009-presenter-render
make episode-0009-presenter-review
```

The conflict is rendered as one progressively fragmenting capability composition. The change sequence keeps capability intent stable while deterministic software, an AI agent and a distributed workflow replace one another as implementation choices.
