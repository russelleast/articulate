# Episode 0013 Production Report

## Outcome

Episode 13 has been produced as a 922.121-second presenter-led video using the recorded narrator video as the timing, wording and audio authority.

## Editorial treatment

The episode develops an eighteen-scene architectural argument. Candidate technologies first appear as credible individual options, then become four alternative runtime compositions. Microsoft Agent Framework with Temporal is treated as a strong contender; Microsoft Agent Framework with Durable Task as an attractive integrated trade-off; and LangGraph with Temporal as a clean separation with an additional owned boundary. The comparison explicitly establishes that all four architectures can satisfy the requirements before moving to composition, platform fit and optionality.

The language decision remains separate from the runtime decision. Python is presented as a strategic fit for AI/ML-facing work, C# as familiar and attractive, and Articulate as polyglot. The Dapr decision emerges through the broader platform boundary and includes its operational cost and maturity risk before ADR 0001 is accepted.

## External assets

Official project artwork is stored locally under `production/episodes/0013/assets/logos`. Sources and usage decisions are recorded in `assets/logos/SOURCES.md`. Durable Task is labelled beneath the official Microsoft Agent Framework identity; Dapr Agents and Dapr Workflows share the official Dapr project mark. No unofficial substitute artwork is used.

## Publication assets

- Final video: `production/episodes/0013/output/episode-0013-final.mp4`
- English subtitles: `production/episodes/0013/output/episode-0013-final.srt`
- YouTube thumbnail: `production/episodes/0013/publication/thumbnail/episode-0013-thumbnail.png`

## Validation

- Episode contract: 18 scenes, full 922.121-second recording coverage, no timing gaps or overlaps
- Video: H.264, 1920×1080, 30 fps, 922.133-second encoded duration
- Audio: AAC stereo, 48 kHz, −15.9 LUFS integrated loudness, 4.2 LU loudness range and −1.5 dBFS true peak
- Subtitles: local Whisper word timestamps corrected against the recorded delivery; 236 non-overlapping cues; maximum two lines and 42 characters per line
- Diagrams: seven deterministic composition SVGs with official locally stored project identities and semantic D2 sources
- Visual review: complete scene and 15-second temporal contact sheets inspected at final composition
- Thumbnail review: full-size, 320×180 and 160×90 previews inspected
- Episode-specific validation: passed with no errors
- Runtime regression suite: 82 tests passed

No ADR is required for the production work itself: this applies the accepted media architecture. The episode documents and concludes ADR 0001 in the architectural journal.
