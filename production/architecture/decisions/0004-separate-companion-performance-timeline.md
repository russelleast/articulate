# 0004: Separate Companion performance from scene rendering

## Status

Experimental — accepted for PoC use; lip-sync remains optional.

## Context

Episode 0000 needs a controlled comparison of static Companion presence, restrained motion and speech-driven lip-sync. The existing scene timeline already describes editorial reveals and relationships, while the renderer already supports deterministic frame-indexed idle transforms. Embedding audio analysis or mouth choices directly in scene rendering would mix production analysis, performance intent and visual composition.

## Decision

Attach an optional declarative Companion performance timeline to a scene. Resolve its `blink`, `head`, `gaze` and `mouth` events to frame-relative state before rendering. Keep audio analysis upstream so a renderer consumes only timeline state.

The first analyser is an offline deterministic signal classifier with a deliberately limited viseme vocabulary. It is an interchangeable producer of timeline data, not a mandatory renderer dependency or a commitment to a lip-sync technology.

## Consequences

- performance data is inspectable, reproducible and included in provenance;
- scenes without a performance timeline retain existing behaviour;
- future forced alignment or asset-driven approaches can replace analysis without replacing the renderer boundary;
- the scene timeline remains focused on editorial information rather than character animation;
- a single raster limits facial quality, so full-episode lip-sync is deferred pending review and a minimal facial layer pack.
