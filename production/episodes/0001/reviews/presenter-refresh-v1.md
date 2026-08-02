# Episode 0001 Presenter Refresh v1 Review

## Status

Automated production validation passed. Encoded-frame visual review passed. Final continuous human playback remains the publication gate.

## Context

Episode 0001 has been rebuilt from the updated spoken narrative and `ep01-narrator.mov` using the presenter production system established by the Episode 0000 refresh. This replaces the archived Companion cut without discarding its production evidence.

## Decision

Use the 5:06 presenter refresh as the Episode 0001 publication candidate.

- One continuous source window owns narrator picture and embedded audio.
- Five presenter scenes use the same lower-left 780×439 placement, soft-luminance key, feathering, edge vignette and dark-background treatment as Episode 0000.
- Eight Focus Canvas scenes reveal evidence in narrated order.
- Scene boundaries align with topic changes; all boundaries share an integer video frame.
- Only the established cut and fade semantics are used.
- No external SVG or white page surface is present.
- The embedded track is normalised during render to −16 LUFS with a −1.5 dBTP ceiling.
- Captions derive from the new recording and are constrained to two lines of at most 42 characters.

## Evidence

- Final video: `production/output/episode-0001.mp4`
- Final subtitles: `production/output/episode-0001.srt`
- Final thumbnail: `production/episodes/0001/publication/thumbnail/episode-0001-thumbnail.png`
- Render manifest: `production/episodes/0001/generated/presenter-refresh-v1/render-manifest.json`
- Validation report: `production/episodes/0001/generated/presenter-refresh-v1/presenter-refresh-validation-report.json`
- Encoded-frame contact sheet: `production/episodes/0001/output/review/presenter-refresh-v1/contact-sheet.png`
- Per-scene contact sheets: `production/episodes/0001/output/review/presenter-refresh-v1/scene-contact-sheets/`

The encoded output is 1920×1080 H.264 at 30 fps with continuous mono AAC, exactly 306.000 seconds. The review package contains 72 frames covering every declared visual state.

## Quality review

| Requirement | Evidence | Result |
| --- | --- | --- |
| Narrator synchronisation | Picture and audio are trimmed once from the same source clock; output streams both end at 306.000s | Passed structurally; final human playback required |
| No clipped transitions | Continuous coverage, no gaps/overlaps and shared integer-frame boundaries | Passed |
| No white SVG backgrounds | Visual Grammar v2 dark canvas only; external SVG count is zero | Passed |
| Episode 0 branding | Same grammar profile, presenter framing/compositor, palette, typography and transition vocabulary | Passed |
| Subtitle timing | Recording-derived token timings; cues stay within the selected source window with no overlaps | Passed |
| Smooth pacing | Thirteen topic scenes; non-presenter visual holds capped at 18 seconds with staged reveals | Passed |
| Thumbnail branding | Real presenter, Episode 0 layout/palette/type and evidence-to-understanding motif at 1280, 320 and 160 px | Passed |

## Final playback gate

Watch the opening, all five presenter returns and the closing for perceived lip synchronisation; listen across scene boundaries for loudness continuity; and confirm that the restrained pacing supports rather than competes with the spoken argument.
