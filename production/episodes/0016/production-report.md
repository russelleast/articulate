# Episode 0016 Production Report

## Outcome

Episode 16 has been produced as an 1114.446-second video using the continuous edited presenter/screen recording as the picture, wording, timing and audio authority.

## Editorial treatment

The production follows **Architecture → Running System → Reflection**. The opening establishes the implementation question and two capabilities using the established narrator and Focus Canvas grammar. The complete 39.000–1021.000 implementation walkthrough remains full-screen, uniformly scaled from 1280×720 to 1920×1080, with no crop, frame, overlays, generated cutaways, burned subtitles or artificial camera movement. The closing returns to narrator-led visual grammar and distinguishes observing distributed execution from evaluating agent intelligence.

## Publication assets

- Final video: `production/episodes/0016/output/episode-0016-final.mp4`
- English subtitles: `production/episodes/0016/output/episode-0016-final.srt`
- YouTube thumbnail: `production/episodes/0016/publication/thumbnail/episode-0016-thumbnail.png`
- Thumbnail message: `ARCHITECTURE → SOFTWARE`

## Validation

- Episode contract: 8 contiguous scenes, complete 1114.446667-second source coverage, no gaps or overlaps
- Video: H.264, 1920×1080, 30 fps, 1114.446-second encoded duration; complete video and audio decode passed
- Walkthrough fidelity: samples at 120, 600 and 1020 seconds compared with the uniformly scaled source at SSIM 0.998901, 0.999725 and 0.998159
- Audio: AAC stereo, 48 kHz, −16.0 LUFS integrated loudness, 6.4 LU loudness range and −1.2 dBFS true peak
- Subtitles: 313 sequential, non-overlapping cues; maximum two lines and 42 characters; final cue ends at 1114.110 seconds
- Terminology: corrected against the spoken delivery and narrative for Articulate, Codex, AGENTS.md, DCL, MCP, C4, Dapr, Docker Compose, Prompty, Ollama, Gemma 3, RabbitMQ, MongoDB, OpenTelemetry and Zipkin
- Visual review: scene, boundary and 30-second temporal contact sheets inspected; the walkthrough remains uninterrupted and the 39/1021-second cuts are clean
- Privacy review: sampled walkthrough frames inspected across source, diagrams, code, API documentation, MongoDB Compass and Zipkin; no credentials, secrets or unintended private information were identified
- Thumbnail review: full-size, 320×180 and 160×90 outputs generated and inspected
- Runtime regression suite: 82 tests passed
- Repository verification: Astro diagnostics, 10 SEO tests and 37 publishing tests passed; the Python stage remains blocked because `uv` is not installed

## Deviations and outstanding review

The standard renderer's eight-way continuous-source split exhausted local encoding resources for this unusually long episode. Final assembly used an equivalent two-branch FFmpeg composition from the same generated visual track and continuous source clock. The full-screen interval, final encoding settings and audio-normalisation contract are unchanged.

The canonical written Episode 16 currently uses the title “Building the Knowledge Service”, while the approved video narrative and production brief use “Building the First Architectural Slice”. No journal content was changed as part of video production. A final real-time human editorial playback remains recommended before publication. Nothing has been published.
