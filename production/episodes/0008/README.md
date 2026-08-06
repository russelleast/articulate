# Episode 0008 — Knowledge Reasoning: Beyond RAG

This production adapts the canonical written episode and the approved recorded presenter delivery into the current Articulate presenter-video grammar.

## Authorities

- Written episode: `docs/episodes/0008-agentic-rag-and-knowledge-reasoning.md`
- Approved verbal narrative: `production/episodes/0008/narrative.md`
- Timing and final subtitle authority: `production/episodes/0008/ep8-editted.mp4`
- Scene contract: `production/episodes/0008/scene-plan.yaml`

## Final assets

- Video: `production/episodes/0008/output/episode-0008-final.mp4`
- Subtitles: `production/episodes/0008/output/episode-0008-final.srt`
- Thumbnail: `production/episodes/0008/publication/thumbnail/episode-0008-thumbnail.png`

## Reproduce

```sh
make episode-0008-presenter-prepare
make episode-0008-presenter-render
```

The render uses the continuous presenter recording for picture and audio, EBU R128 normalisation, the Articulate visual grammar v2, and registered D2 diagram assets. It does not use the legacy Focus Canvas treatment.
