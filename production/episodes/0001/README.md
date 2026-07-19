# Episode 0001 Production

This is the production working area for Episode 0001, "Why Articulate Exists".

Canonical source: [`docs/episodes/0001-why-articulate-exists.md`](../../../docs/episodes/0001-why-articulate-exists.md)

Episode 0001 opens the Articulate series. The production treatment should therefore introduce the journal, the architectural problem and the role of AI-native exploration without overstating the maturity of the project.

## Artefacts

- [`production-plan.md`](production-plan.md)
- [`storyboard.md`](storyboard.md)
- [`narration-script.md`](narration-script.md)
- [`scene-list.yaml`](scene-list.yaml)
- [`asset-register.yaml`](asset-register.yaml)
- [`notes.md`](notes.md)
- [`reviews/production-baseline-delta.md`](reviews/production-baseline-delta.md) — Episode 0001 Rough Cut 02 versus the published Episode 0000 production baseline
- [`reviews/rough-cut-03.md`](reviews/rough-cut-03.md) — three-way editorial assessment of the baseline upgrade

## Production Position

The episode is essay-like, but it still needs video because it establishes the series. The video should combine companion-led opening and closing, restrained title and section slides, visual storytelling, architectural sketches, repository or journal views, and carefully selected text fragments.

## Rough Cut 01

The first complete rough cut uses the selected recorded narration as its timing authority. The registry resolves `episode-0001-narration-v1` to the approved 9:10.366 master recording; the renderer preserves that complete recording and does not copy it into generated output storage.

The production path is:

```text
Canonical episode
    → selected recorded narration
    → narration analysis and editorial timing markers
    → synchronised scene list
    → deterministic authored scene frames
    → FFmpeg assembly
    → rough-cut video and editorial review artefacts
```

Run from the repository root:

```sh
make assets-validate
make episode-0001-analyse
make episode-0001-validate
make episode-0001-render
make episode-0001-review
```

The render command produces the review frames and contact sheet as part of a complete run. The final review command is safe to use when only the review artefacts need to be regenerated from an existing MP4.

Generated media stays outside Git:

- rough cut: `production/episodes/0001/output/episode-0001-rough-cut-01.mp4`;
- review frames and contact sheet: `production/episodes/0001/output/review/rough-cut-01/`;
- render manifest, asset manifest, provenance and timing report: `production/episodes/0001/generated/rough-cut-01/`.

Committed timing and reproduction inputs are under `production/episodes/0001/production/`. The renderer resolves the existing scene vocabulary through the shared [Visual Grammar runtime profile](../../runtime/renderer/README.md), then uses reusable compositions and layout primitives without changing the Companion placement, scene order or timing architecture.

## Rough Cut 03

Rough Cut 03 applies the published Episode 0000 production language to Episode 0001 while preserving its approved narration and nineteen narration-derived scene boundaries. It uses the shared Studio, Whiteboard, Workspace and Focus environments, authored progression in every scene, a declarative shot hierarchy for long editorial beats and restrained motion-only Companion presence in seven scenes.

Run from the repository root:

```sh
make episode-0001-rough-cut-03-prepare
make episode-0001-rough-cut-03-validate
make episode-0001-rough-cut-03-render
make episode-0001-rough-cut-03-review
```

Outputs remain outside Git:

- cut: `production/episodes/0001/output/episode-0001-rough-cut-03.mp4`;
- temporal and per-scene review package: `production/episodes/0001/output/review/rough-cut-03/`;
- render, asset, timing and provenance manifests: `production/episodes/0001/generated/rough-cut-03/`.

The committed production authority is `production/rough-cut-03-config.json`; generated Companion performance timelines are committed beneath `production/rough-cut-03-companion/` so the render can be reproduced and audited without speech generation.
