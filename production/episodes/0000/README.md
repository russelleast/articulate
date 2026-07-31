# Episode 0000 — Welcome to the Articulate Journal

Episode 0000 is the reference production for the presenter-video model.

## Authorities

- Written journal: `docs/episodes/preface.md`
- Spoken narrative: `production/episodes/0000/0000-welcome-to-the-articulate-journal.md`
- Presenter picture and timing audio: `episode-0000-presenter-v1`
- Editable scene intent: `production/episodes/0000/scene-plan.yaml`
- Timestamped transcript: `production/episodes/0000/transcript.json`
- Cross-source alignment: `production/episodes/0000/alignment.json`
- Derived execution timeline: `production/episodes/0000/timeline.json`
- Exact render timing: `production/episodes/0000/production/presenter-v2-markers.json`
- Executable configuration: `production/episodes/0000/production/episode-config.json`

The local presenter source is expected at:

```text
production/episodes/0000/media/Ep0-pov1.mov
```

The MOV is intentionally ignored by Git. Its logical registry entry and SHA-256 checksum preserve identity and provenance.

## Production model

The complete 1280×720 recording is selected from `00:00.000` through `02:27.067`. Embedded mono audio remains attached to that continuous source. The presenter replaces the Companion in narrator scenes at a smaller 780×439 lower-left scale. Focus Canvas and Digital Workspace scenes hide the picture while embedded audio continues.

No Companion asset, performance timeline, viseme, blink or idle-motion processing is used. No physical whiteboard composition appears.

The black source background is part of the composition. Narrator scenes scale the complete frame rather than tightly cropping it, preserving gestures while keeping Focus Canvas content in a separate safe region. `presenter.compositing` applies the reusable `soft-luma-key` presenter compositor to `presenter-focus` scenes: a denoised soft luminance mask preserves the presenter and natural shadows while a feathered edge vignette dissolves the recording boundary into the Focus Canvas. Full-frame presenter footage remains opaque.

Episode 0000 follows the Episode 0004 pre-render model. Visual and editorial changes belong in `scene-plan.yaml`; `prepare-presenter-rough-cut.mjs` regenerates alignment, timeline, storyboard, markers, subtitles and renderer configuration.

## Commands

```sh
make episode-0000-presenter-analyse
make episode-0000-presenter-validate
make episode-0000-presenter-render
make episode-0000-presenter-review
```

Prepare and render:

```text
node production/episodes/0000/production/prepare-presenter-rough-cut.mjs
make episode-0000-presenter-render
```

Expected rough cut:

```text
production/episodes/0000/output/episode-0000-presenter-rough-cut-v2.mp4
```

Review frames, contact sheets, timing reports, asset manifests and provenance are generated beneath the ignored `output/review/presenter-rough-cut-v2/` and `generated/presenter-rough-cut-v2/` directories.

## Archived Companion productions

The earlier Companion configurations and rendered candidates remain in the episode directory and Git history as archived production evidence. They still use Visual Grammar v1 and remain renderable when their original local assets are present, but they are no longer the default Episode 0000 model.
