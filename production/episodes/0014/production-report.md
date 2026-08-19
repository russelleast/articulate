# Episode 0014 Production Report

## Outcome

Episode 14 has been produced as a 689.355-second presenter-led video using the recorded narrator video as the timing, wording, picture and audio authority.

## Editorial treatment

Seventeen scenes present knowledge evolution as governed architectural behaviour. The episode begins with claims as current belief, introduces continual information and the stale-versus-untrustworthy tension, then keeps PostgreSQL and MongoDB visible together to show why new information cannot immediately replace accepted knowledge.

The proposed-knowledge responsibilities lead into reconciliation and preserved uncertainty. PostgreSQL, MongoDB and DynamoDB then become Once Was, As Is and To Be views over one evolving history. Baselines are shown as viewpoints over a connected Knowledge Model. A separate timeline distinguishes human approval from acceptance, and accepted claims assemble into a small Order Service architecture before the conclusion establishes knowledge evolution as a capability.

The final presenter sequence changes the question from “What is the architecture?” to “Is this a good architecture?” and bridges to Episode 15, Architectural Assurance.

## Publication assets

- Final video: `production/episodes/0014/output/episode-0014-final.mp4`
- English subtitles: `production/episodes/0014/output/episode-0014-final.srt`
- YouTube thumbnail: `production/episodes/0014/publication/thumbnail/episode-0014-thumbnail.png`
- Thumbnail message: `KNOWLEDGE EVOLVES`

## Validation

- Episode contract: 17 scenes, complete 689.355-second recording coverage, no timing gaps or overlaps
- Video: H.264, 1920×1080, 30 fps, 689.367-second encoded duration
- Audio: AAC stereo, 48 kHz, −15.8 LUFS integrated loudness, 4.1 LU loudness range and −1.3 dBFS true peak
- Subtitles: local Whisper word timestamps corrected against the recorded delivery; 182 non-overlapping cues; maximum two lines and 42 characters per line
- Diagrams: seven deterministic SVG compositions with semantic D2 sources
- Visual review: complete scene and 15-second temporal contact sheets inspected; long pipeline labels wrapped with consistent internal padding, presenter key retains dark clothing, and no clipping, overlapping labels, obscured arrowheads or unintended blank frames were found
- Thumbnail review: full-size, 320×180 and 160×90 previews inspected
- Episode-specific validation: passed with no errors
- Runtime regression suite: 82 tests passed

## Deviations

There are no deviations from the established video rules. The diagrams use complete architectural states, while progressive conceptual responsibility is expressed through the existing Focus Canvas and restrained scene sequence. The narrator remains present for orientation, bridges, reflection and conclusion.

The shared `assets-validate` command remains blocked by the pre-existing unavailable `episode-0001-presenter-v2` asset. Episode 14’s registered presenter and diagram assets resolve successfully through its renderer validation.

No ADR is required for this production work; it applies the accepted media architecture.
