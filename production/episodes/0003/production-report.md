# Episode 0003 production report

## Result

The presenter-v2 production completed successfully using `ep3-narrator.mov` as one continuous picture and embedded-audio source. The selected programme window is 456.333 seconds (13,690 frames at 30 fps).

## Visual structure

The episode uses 17 scenes. Presenter-led passages open the episode, interpret the prior experiments, restate the Articulate problem, qualify AI-powered systems, distinguish agents from architecture, preserve deterministic choices and close on the hypothesis. Full-screen Repository, Diagram and Focus Canvas scenes carry ideas that need visual space. The final question canvas deliberately becomes quieter before returning to the presenter.

The progression is gradual:

```text
Earlier experiments
  → repeated architectural alternative
  → recurring intelligent capabilities
  → architectural responsibilities
  → intelligence beside established runtime capabilities
  → AI-native as a hypothesis
```

## New reusable diagrams

- `problem-to-technology.d2`
- `deterministic-or-intelligent.d2`
- `intelligent-responsibilities.d2`
- `intelligence-runtime-capability.d2`

Each source is registered globally, rendered to `site/public/diagrams/` and normalised through the existing video-dark diagram publication profile.

## Material retained

Only the Episode 3 identity and topic were retained. The new `narrative.md` and `ep3-narrator.mov` are authoritative. Former Companion timelines, timing markers, narration assumptions, agent-capability scene structure and thumbnail production were not reused.

## Validation

- All 76 production runtime tests passed.
- Declarative episode validation passed with 17 scenes and no gaps or overlaps.
- Final media is 1920×1080, 30 fps, H.264 with 48 kHz mono AAC audio.
- Video and audio durations differ by less than one frame.
- Integrated loudness validation passed at the Episode 0002-aligned -16 LUFS target.
- The complete 13,690-frame output decoded without errors and produced no black-run or silence-run warnings.
- Captions contain corrected Articulate, AI-native and LLM terminology, stay within two 42-character lines and contain no stale former Episode 3 copy.
- Review contact sheets confirm presenter edge integration, dark canvas treatment, typography, transitions and diagram legibility at 1080p.
- The final scene explicitly states that AI-native architecture is the hypothesis the journal will test.

## Compromises and limitations

The captions use Whisper segment timing with word timing interpolated inside each segment; they are faithful to the delivered speech but are not phoneme-level forced alignment. The early proof-of-concepts are represented as restrained repository evidence because the supplied brief did not identify canonical screenshots or artefacts suitable for publication. Repository-wide diagram validation remains unavailable because PlantUML is not installed; this does not affect the four Episode 3 D2 sources, which all rendered and passed episode-level review.

## Outputs

- Final video: `production/episodes/0003/output/episode-0003-final.mp4`
- Final subtitles: `production/episodes/0003/output/episode-0003-final.srt`
- Publication subtitles: `production/episodes/0003/publication/subtitles/episode-0003-en.srt`
- YouTube thumbnail: `production/episodes/0003/publication/thumbnail/episode-0003-thumbnail.png`
- Thumbnail contact sheet: `production/episodes/0003/publication/thumbnail/episode-0003-thumbnail-contact-sheet.png`
- Review contact sheet: `production/episodes/0003/output/review/presenter-v2/contact-sheet.png`
- Temporal review: `production/episodes/0003/output/review/presenter-v2/temporal-contact-sheet.png`
- Validation report: `production/episodes/0003/generated/presenter-v2/presenter-v2-validation-report.json`
