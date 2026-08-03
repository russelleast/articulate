# Episode 0002 Presenter Production Report

## Result

Episode 0002 was rebuilt as a 5:58.600 presenter-led architectural essay using the new direct-to-camera recording and the Visual Grammar v2 production system established by Episodes 0000 and 0001.

The episode progresses from incomplete definitions of Articulate, through the distinction between architectural artefacts and understanding, to evolving knowledge, accountable AI collaboration, conversation as an interface and the emerging idea of Architectural Intelligence.

## Visual decisions

- Russell remains the human anchor in five scenes: the opening question, central reframing, judgement boundary, reflective uncertainty and closing definition.
- Focus Canvas scenes use progressive disclosure only where the audience needs to accumulate concepts or questions.
- Three reusable D2 diagrams carry the enduring semantic models: architectural artefacts connected by understanding, knowledge as the primary asset, and conversation as an interface to connected knowledge.
- All D2 assets use the presenter-era dark canvas and video-dark SVG profile. A first-pass pale legacy diagram surface was rejected during encoded-frame review and corrected before delivery.
- The thumbnail uses **Architectural Intelligence** because it is the episode's most distinctive and legible idea; a small artefacts-to-understanding sequence preserves the episode's core transition.

## Narration and captions

The source recording contains one clean take with no false starts or teleprompter resets. The selected window retains 00:00.000–05:58.600 and removes only unused trailing room tone. Embedded mono audio remains continuous across every visual cut.

Captions are derived from the reviewed recording rather than copied from `narrative.md`. Spoken variations such as “over the recent year”, “payment system” and “complex systems” are preserved. Obvious speech-recognition errors were corrected, terminology was standardised and long Whisper segments were reflowed into balanced punctuation-aware cues.

## Verification

- output: 1920×1080, H.264, 30 fps
- duration: 358.600 seconds
- audio: AAC mono, 48 kHz, duration aligned exactly with video
- integrated programme loudness: −16.3 LUFS
- measured loudness range: 4.2 LU
- true peak: −1.3 dBFS
- scene boundaries: contiguous integer frames, no gaps or overlaps
- runtime tests: 76 passed
- subtitles: no overlaps, maximum two lines, maximum 42 characters per line
- review: timeline-state contact sheet and 5-second encoded temporal contact sheet generated

## Reproduction

```sh
make episode-runtime-test
make episode-0002-presenter-prepare
make episode-0002-presenter-validate
make episode-0002-presenter-render
make episode-0002-presenter-review
make episode-0002-thumbnail
```

Generated render intermediates, validation manifests and review frames remain outside Git under `generated/presenter-v1/` and `output/review/presenter-v1/`. The final video and convenient matching SRT are in `output/`; the publication SRT and thumbnail remain committed production artefacts.
