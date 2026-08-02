# Episode 0001 Production

This is the production working area for Episode 0001, "Why Articulate Exists".

Written journal: [`docs/episodes/0001-why-articulate-exists.md`](../../../docs/episodes/0001-why-articulate-exists.md)

Approved spoken narrative: [`narrative.md`](narrative.md). The archived productions retain [`narration-script.md`](narration-script.md) as their explicit legacy source.

Episode 0001 opens the Articulate series. The production treatment should therefore introduce the journal, the architectural problem and the role of AI-native exploration without overstating the maturity of the project.

## Artefacts

- [`production-plan.md`](production-plan.md)
- [`storyboard.md`](storyboard.md)
- [`narration-script.md`](narration-script.md)
- [`scene-list.yaml`](scene-list.yaml)
- [`asset-register.yaml`](asset-register.yaml)
- [`notes.md`](notes.md)
- [`publication/thumbnail/`](publication/thumbnail/) — deterministic production thumbnail candidates, reduced-size previews and review evidence
- [`reviews/production-baseline-delta.md`](reviews/production-baseline-delta.md) — Episode 0001 Rough Cut 02 versus the published Episode 0000 production baseline
- [`reviews/rough-cut-03.md`](reviews/rough-cut-03.md) — three-way editorial assessment of the baseline upgrade
- [`reviews/rough-cut-04.md`](reviews/rough-cut-04.md) — targeted response to continuous-playback editorial feedback
- [`reviews/presenter-refresh-v1.md`](reviews/presenter-refresh-v1.md) — Episode 0-style presenter refresh and publication validation evidence

## Production Position

The current production is a presenter-led architectural essay. Russell's continuous camera recording anchors key questions and conclusions; the dark Focus Canvas carries staged evidence and reasoning between presenter returns. Archived Companion cuts remain reproducible but are no longer the publication candidate.

## Presenter Refresh v1

The publication candidate reworks Episode 0001 through the presenter system established by Episode 0000. The 5:06 selected source window in `ep01-narrator.mov` supplies both picture and embedded audio without scene-local restarts. Thirteen topic-aligned scenes use the Visual Grammar v2 dark canvas, Episode 0000 presenter framing and soft-luminance edge treatment, with progressive disclosure throughout the diagram scenes.

The embedded track is normalised during the final continuous mux to the declared EBU R128 profile: −16 LUFS integrated, 7 LU loudness range target and −1.5 dBTP ceiling. The master recording remains unchanged.

Run from the repository root:

```sh
make assets-validate
make episode-0001-presenter-prepare
make episode-0001-presenter-analyse
make episode-0001-presenter-render
make episode-0001-presenter-review
make episode-0001-thumbnail
```

Publication outputs:

- video: `production/output/episode-0001.mp4`;
- subtitles: `production/output/episode-0001.srt`;
- thumbnail: `publication/thumbnail/episode-0001-thumbnail.png`;
- manifests and validation: `generated/presenter-refresh-v1/`;
- encoded-frame review package: `output/review/presenter-refresh-v1/`.

The committed timing authority is `production/presenter-refresh-markers.json`; the render model is `production/presenter-refresh-config.json`; the narration-aligned editorial model is `scene-plan.yaml`.

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

## Rough Cut 04

Rough Cut 04 is a targeted editorial correction pass over RC03. It introduces narration-evidenced boundary corrections at 00:50, 04:51 and 07:14; aligns requested reveals to absolute playback timestamps; restores a missing capable-technology scene; replaces the weakest diagram treatments; and enables the existing deterministic simplified-viseme Companion performance proven by Episode 0000's production candidate.

```sh
make episode-0001-rough-cut-04-prepare
make episode-0001-rough-cut-04-validate
make episode-0001-rough-cut-04-render
make episode-0001-rough-cut-04-review
```

Outputs remain outside Git:

- cut: `production/episodes/0001/output/episode-0001-rough-cut-04.mp4`;
- temporal and per-scene review package: `production/episodes/0001/output/review/rough-cut-04/`;
- manifests and provenance: `production/episodes/0001/generated/rough-cut-04/`.

The committed authority is `production/rough-cut-04-config.json`, with corrected boundaries in `production/rough-cut-04-markers.json` and deterministic Companion performance timelines beneath `production/rough-cut-04-companion/`.
