# ADR 0009: Compose episodes from continuous presenter media

- Status: Accepted
- Date: 2026-07-30

## Context

The original production model separated recorded narration from an animated Companion performance. That was appropriate for an AI-created visual narrator, but it is the wrong model for recorded human delivery. Splitting presenter footage into scene-local clips or driving it through Companion lip-sync and blink logic would create avoidable synchronisation risk and confuse two different narrator implementations.

The presenter recording contains Russell's picture and embedded audio against a black background. Scenes need to resize, position or hide the picture while preserving one uninterrupted performance clock.

## Decision

Add a `continuous-video` presenter implementation alongside the retained Companion pipeline.

- The logical presenter asset resolves through the shared asset registry.
- One configured source window supplies both picture and embedded audio.
- Scene timings use the existing global integer-frame boundary model.
- Scene composition modes determine whether presenter picture is full, left, right, overlaid or hidden.
- Hiding presenter picture never interrupts or restarts its embedded audio.
- The renderer builds deterministic Focus Canvas plates first, then performs one continuous presenter composition pass.
- Presenter episodes select Visual Grammar v2. Companion episodes remain on Visual Grammar v1 and keep their existing performance pipeline.
- The established full-frame Focus Canvas replaces the light physical whiteboard surface for new productions. Existing Digital Workspace, Diagram, Evidence and Repository scene types remain available.

## Consequences

- Lip and audio synchronisation share the source media clock across every scene transition.
- Future episodes can replace the recording and scene plan without changing renderer code.
- Archived Companion episodes remain renderable.
- Presenter sources currently require embedded audio; an independently cleaned track needs an explicit synchronisation decision before support is added.
- Composition changes are deterministic cuts in v2. Crossfaded crop interpolation remains a possible later capability, not an Episode 0000 special case.
- Large presenter recordings remain local, ignored media assets with checksums and logical registry entries rather than Git-managed binaries.
