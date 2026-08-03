# Episode 0002 Production

This is the presenter-led production area for Episode 0002, **What is Articulate?**

The episode follows Episode 0001's problem statement with the Articulate vision: architecture as evolving knowledge, AI as an accountable collaborator and conversation as an interface to architectural understanding.

## Production authority

- spoken narrative: [`narrative.md`](narrative.md)
- recorded performance: `ep02-narrator.mov`
- editorial plan: [`production-plan.md`](production-plan.md)
- narration-aligned scene model: [`scene-plan.yaml`](scene-plan.yaml)
- complete render timeline: [`production/presenter-v1-config.json`](production/presenter-v1-config.json)
- integer-frame scene boundaries: [`production/presenter-v1-markers.json`](production/presenter-v1-markers.json)
- reusable diagram sources: [`../../diagrams/sources/knowledge/`](../../diagrams/sources/knowledge/)

The clean source performance is retained continuously from 00:00.000 to 05:58.600. Picture may give way to a Focus Canvas or semantic diagram, but embedded audio never restarts. The final mux applies the same EBU R128 target and presenter soft-edge treatment as the Episode 0001 refresh.

## Reproduce

Run from the repository root:

```sh
make episode-0002-presenter-prepare
make episode-0002-presenter-validate
make episode-0002-presenter-render
make episode-0002-presenter-review
make episode-0002-thumbnail
```

Publication outputs:

- video: `production/episodes/0002/output/episode-0002-final.mp4`
- subtitles: `production/episodes/0002/publication/subtitles/episode-0002-en.srt`
- thumbnail: `production/episodes/0002/publication/thumbnail/episode-0002-thumbnail.png`
- render and validation manifests: `production/episodes/0002/generated/presenter-v1/`
- encoded-frame review: `production/episodes/0002/output/review/presenter-v1/`

The previous Episode 0002 production remains available through version-control history; this presenter production does not depend on its narration or Companion timeline.
