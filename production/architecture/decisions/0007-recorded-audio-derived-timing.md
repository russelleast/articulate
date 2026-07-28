# 0007: Derive Draft Production Timing from Recorded Audio

Status: accepted

## Context

The spoken narrative defines editorial intent, but the recording defines the timing viewers hear. Requiring a manually authored timestamp list for every episode makes the production path slow, hard to repeat and easy to drift from the recording. Estimating timing from the written narrative has the opposite problem: it is fast, but it does not describe the actual performance.

## Decision

The recorded narration is the timing authority for a rough cut. A local transcription engine produces an inspectable transcript containing segment and word timing with confidence. Narrative sections declare short semantic anchors in canonical order. The alignment runtime locates those anchors in the transcript, derives gap-free section boundaries, and resolves scene reveals from spoken phrases.

The intermediate artefacts are committed episode intent:

- `transcript.json` records speech-derived timing and confidence;
- `alignment.json` maps narrative sections to the recording;
- `scene-plan.yaml` remains the editable visual interpretation;
- `timeline.json` records resolved scene and cue timing;
- `storyboard.yaml` satisfies the production content contract.

The generated timing is a reviewable draft. Low-confidence transcription and alignment remain visible rather than being silently treated as editorial truth. The recording is not edited by the alignment process.

## Consequences

- Future rough cuts do not require a separate hand-authored timestamp list.
- Scene changes and important labels are tied to the spoken performance.
- Editors can correct the scene plan or generated artefacts without changing the runtime.
- A local speech model is an explicit preparation dependency and its identity must be recorded.
- Transcript confidence is useful review evidence, not proof that wording is correct.
- Publication-grade subtitles may still require a human language and timing pass.
