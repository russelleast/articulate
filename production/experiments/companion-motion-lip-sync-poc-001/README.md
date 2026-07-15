# Companion Motion + Lip-Sync PoC 001

## Question

Does a restrained, reusable Companion performance system materially improve the finished Articulate video?

This experiment isolates one 16.44-second section of Episode 0000 and compares the existing static treatment, restrained motion, and the same motion with audio-derived simplified lip-sync. It does not change the Companion design, narration, environment, camera, diagram content or scene timing.

## Selected sequence

- Episode scene: `S008`, “The Companion”.
- Master narration: `02:41.687–02:58.127` (`161.686939–178.126939`).
- Local duration: `00:00.000–00:16.440`.
- Spoken argument: the Companion is introduced, its relationship between architect and AI is named, and the prompt/answer transaction begins.

This is the strongest available extract because the Companion is clearly visible throughout, directly addresses the viewer, has a useful range of speech energy, and remains in one stable Studio composition. The cut stops at the existing `16.440` visual boundary before “persistent collaborator” replaces the prompt/answer model.

## Repository assessment

### Existing capability used

- approved `companion-v1-neutral` raster and the design-system character reference;
- Episode 0000 narration checksum, source offsets and scene timing authority;
- declarative scene timeline and frame-indexed state resolution;
- deterministic SVG-to-PNG scene renderer;
- existing idle breathing/translation transform;
- FFmpeg audio extraction, video assembly and media probing;
- logical asset registry, episode asset register, manifests and provenance;
- review frames and contact sheets.

### Reusable assets found

The design-system board contains reference expressions and poses, but the production registry contains only one approved runtime pose: the neutral half-body raster. There is no separate production eye, eyelid, mouth, head or gesture layer pack. The experiment therefore preserves the neutral raster and uses very small renderer-native facial overlays. It does not regenerate or redesign the Companion.

### Gaps addressed

1. A declarative Companion performance timeline, resolved independently from scene layout.
2. Deterministic blink, posture and simplified mouth states composited by the existing renderer.
3. An offline audio analyser that produces inspectable viseme timeline data from the canonical recorded voice.

No general animation engine, generative video system, online service or mandatory episode dependency was introduced.

## Architecture

```text
Episode 0000 narration extract
        ↓
offline RMS + zero-crossing analysis
        ↓
Companion performance timeline JSON
        ↓
frame-relative performance state
        ↓
existing scene renderer and FFmpeg assembly
```

The scene timeline remains responsible for visual information and diagram progression. The performance timeline is a scene-attached layer responsible only for `blink`, `head`, `gaze` and `mouth` state. Rendering consumes resolved state; it does not analyse audio or hard-code per-frame mouth changes.

## Motion design

- existing slow breathing and 2.2-pixel vertical idle motion;
- blinks at `03.120` and `10.840`, lasting `0.200` and `0.240` seconds;
- one 2.4-second head settle peaking below `0.3°`;
- one 2.2-second posture adjustment peaking below one pixel and `0.2°`;
- no gestures and no gaze change, because the selected composition supplies no purposeful gaze target near the Companion.

The authored events are irregular and deterministic. There is no repeated blink or head loop.

## Lip-sync approach

The analyser decodes the actual narration to 16 kHz mono PCM and evaluates 40 ms windows, matching the 25 fps renderer. A three-frame weighted window smooths RMS energy and zero-crossing rate. Signal thresholds classify voiced frames into `open`, `wide`, `rounded` or `teeth`; silence and low energy retain the unmodified `rest` face. Isolated non-rest frame chatter is suppressed.

The final timeline contains 90 mouth intervals plus four motion events. It is deliberately rhythm-first rather than phoneme-perfect. The first render demonstrated that a large rounded mouth immediately became uncanny, so the reviewed render uses micro-overlays that retain the original mouth texture.

## Commands

```sh
make companion-performance-poc-analyse
make companion-performance-poc-validate
make companion-performance-poc-render
```

## Outputs

- `output/A-baseline.mp4` — existing static Companion;
- `output/B-motion-only.mp4` — idle, blink and posture only;
- `output/C-motion-lip-sync.mp4` — identical motion plus simplified audio-derived visemes;
- `output/review/comparison/contact-sheet.png` — four temporal samples, with A/B/C in columns;
- per-variant review frames, contact sheets, media reports and render logs under `output/review/`;
- render, timing, asset and provenance manifests under `generated/`.

Generated media remains outside Git. The authored and derived performance timelines remain inspectable and reproducible.

## Outcome

The experiment stops at the requested review boundary. Motion-only is suitable for broader Episode 0000 production evaluation. Lip-sync is a working production experiment, not yet an approved default; see [`findings.md`](findings.md).
