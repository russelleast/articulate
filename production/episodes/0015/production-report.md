# Episode 0015 Production Report

## Outcome

Episode 15 has been produced as a 679.579-second presenter-led video using the recorded narrator video as the timing, wording, picture and audio authority.

## Editorial treatment

Sixteen scenes move from architectural knowledge to evaluation, derived findings and accountable human judgement. The Reporting Service example first establishes the known database relationship before evaluating it against the Order Service ownership boundary and exclusive-persistence principle. The Loyalty Service example separately establishes a valid current CRM dependency before the retirement decision exposes its conflict with architectural direction.

Once Was, As Is and To Be provide temporal context without repeating Episode 14. Structural, principle and trade-off concerns lead into complementary deterministic and contextual responsibilities. Structured DCL intent is evaluated before implementation, while findings remain visibly separated from accepted knowledge and pass through human judgement. The continuous-assessment sequence reduces warning noise to one material concern before the closing reconstructs the conceptual architecture and asks whether it works when built.

## Publication assets

- Final video: `production/episodes/0015/output/episode-0015-final.mp4`
- English subtitles: `production/episodes/0015/output/episode-0015-final.srt`
- YouTube thumbnail: `production/episodes/0015/publication/thumbnail/episode-0015-thumbnail.png`
- Thumbnail message: `ARCHITECTURE ASSURANCE`

## Validation

- Episode contract: 177 narrative segments, 16 scenes, complete 679.579-second recording coverage, no timing gaps or overlaps
- Video: H.264, 1920×1080, 30 fps, 679.579-second encoded duration
- Audio: AAC stereo, 48 kHz, −15.9 LUFS integrated loudness, 4.8 LU loudness range and −1.4 dBFS true peak
- Subtitles: local Whisper word timestamps corrected against recorded delivery; 208 sequential, non-overlapping cues; maximum two lines and 42 characters per line; final question retained as one grammatical cue
- Diagrams: six Episode 15 SVG compositions backed by semantic D2 or PlantUML sources; overview and activity diagrams use landscape layouts, higher-contrast groups and larger typography for video
- Visual review: complete scene-state and 15-second temporal contact sheets inspected; progressive relationship states inspected separately; no clipping, overlapping labels, obscured arrowheads or unintended blank frames found
- Continuous technical review: the complete final MP4 decoded from start to finish without video or audio errors
- Thumbnail review: full-size, 320×180 and 160×90 previews inspected
- Episode-specific production and presenter validation: passed
- Runtime regression suite: 82 tests passed
- Diagram registry: 124 sources validated
- Site checks: Astro diagnostics, 10 SEO tests and 37 publishing tests passed

## Deviations and outstanding review

There are no deliberate deviations from the established production architecture or visual grammar. No renderer refactor or ADR was required.

Following editorial review, the Episode 14 dark-clothing presenter treatment was removed for Episode 15: the luma key now uses the white-shirt recording without an edge vignette or retained dark background. The capability, deterministic/contextual and continuous-assessment diagrams were restored and re-authored as larger landscape compositions with stronger contrast and readable terminal states. The thumbnail headline was revised to `ARCHITECTURE ASSURANCE`.

The repository-wide `./scripts/verify` reached the Python verification stage and stopped because `uv` is not installed in the environment; all preceding Node and site checks passed. Shared `assets-validate` remains blocked by the pre-existing unavailable `episode-0001-presenter-v2` asset; Episode 15 assets resolve through its renderer validation.

A final real-time human editorial playback remains recommended before publication, particularly for narrator cut rhythm, subtitle reading comfort and pronunciation review. Nothing has been published.
