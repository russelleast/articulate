# Episode 0004 Production Report

## Outcome

Episode 0004 has been rebuilt as a presenter-led production using the refreshed Articulate visual grammar. The presenter recording is the continuous timing and audio authority. The selected programme window is 598.333 seconds; the rendered output is 1920×1080 at 30 fps with normalised 48 kHz mono audio.

## Editorial architecture

The 16-scene timeline uses only Narrator, Diagram, Repository, Evidence and Reflection. The presenter remains in the established lower-left framing whenever visible; there are no full-frame narrator scenes. Presenter scenes establish the episode, hold the concluding reflection on a supporting canvas and bridge to Episode 0005. Architecture diagrams own the frame only while spatial relationships improve understanding. Repository and evidence scenes ground the coherence, operability and testing claims.

The sequence deliberately builds related ideas through stable progression:

- useful features → trustworthy characteristics;
- architecture choice → gain and consequence;
- trust boundary → failure recovery → reasoning performance;
- scale up → scale out → Coherence Before Size;
- technical telemetry → reasoning trace;
- testing → evaluation → trustworthy behaviour.

## Diagram decisions

D2 is used for conceptual comparisons and relationship maps. PlantUML is used for the reliability activity flow, trust boundary and multi-agent component relationship. Nine reusable sources live in `production/diagrams/sources/episodes/0004`; their generated SVGs live in the shared `site/public/diagrams` namespace and are registered as logical production assets.

## Subtitle quality

The publication SRT contains 182 sentence-aware cues. Lines are limited to 42 characters, every cue uses at most two lines, punctuation is preserved and the only cue below one second is the natural three-word question “Can we retry?” at 0.960 seconds.

## Verification

- diagram registry and renderer validation passed;
- episode validation passed with 16 contiguous scenes and no gaps or overlaps;
- all 76 production runtime tests passed;
- the complete 598.333-second MP4 rendered successfully;
- full-resolution scene frames and temporal contact sheets were inspected;
- PlantUML label contrast and trade-off connector routing were corrected after real-frame review;
- the thumbnail was reviewed at full, 320×180 and 160×90 sizes.
