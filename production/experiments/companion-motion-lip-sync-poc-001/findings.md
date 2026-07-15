# Findings

## Evaluation

| Criterion | A — baseline | B — motion only | C — motion + lip-sync |
| --- | --- | --- | --- |
| Presence | Stable but visibly static during direct address. | Improved by breathing, two irregular blinks and rare posture change. | Retains B's presence; mouth rhythm adds a small direct-address cue. |
| Naturalness | Consistent with the approved still identity. | Restrained at normal scale; motion does not compete with the board. | Natural only at micro-amplitude. The first larger rounded state was immediately cartoon-like and was rejected. |
| Lip synchronisation | None. | None. | Broad speech activity and closures follow the canonical audio; vowel/consonant identity is approximate. |
| Identity preservation | Strong. | Strong: the approved raster remains unchanged. | Strong in the revised render because rest uses the untouched face and overlays are small. |
| Distraction | Low, although stillness can read as composited. | Low. | Low after amplitude reduction; detailed scrutiny reveals the simplified overlay model. |
| Repetition | Static rather than repetitive. | No visible blink/head loop in 16.44 seconds. Breathing remains periodic but very low amplitude. | Mouth changes are audio-derived rather than looped. |
| Uncanny valley | Low. | Low. | Moderate risk if mouth shapes are enlarged; low-to-moderate in the revised render. |
| Production fit | Existing baseline. | Fits the Articulate motion language. | Fits as an optional experiment, not yet as a platform default. |

## What worked

- The layered model maps cleanly onto the existing deterministic renderer.
- Motion-only produces the clearest improvement per unit of complexity.
- Irregular authored blinks and rare posture motion avoid an obvious mechanical loop.
- Separating analysis, timeline resolution and rendering keeps future technology choices open.
- Audio-derived timing preserves the original delivery and produces reproducible timeline data.
- The five-state vocabulary is sufficient to test rhythm without pretending to be phoneme-perfect.

## What looked unnatural

- A visibly rounded or large open mouth is too coarse at the current on-screen head size. The first C render crossed into a cartoon-like “O” and was rejected.
- A flat overlay cannot reproduce cheek, jaw, moustache and lip deformation from the single neutral raster.
- Signal-only classification sometimes chooses a plausible mouth activity level rather than the correct speech shape. It is not forced alignment.
- Blink overlays are constrained by the lack of clean eyelid/eye layers and should remain infrequent.

## Recommendation

Adopt the declarative performance boundary and continue using restrained motion. Do not apply lip-sync to the complete Episode 0000 yet.

The practical answer is:

> Restrained Companion motion materially improves presence. Simplified lip-sync is viable, but with the current single neutral raster its additional benefit is modest and its uncanny-valley margin is narrow.

The C render should receive normal-speed human A/B review against B before any production adoption. If reviewers do not reliably prefer C, ship motion-only. Lip-sync must remain optional and scene-specific.

## Smallest asset refinement before wider lip-sync

Create a Companion facial layer pack derived from the approved neutral asset, not a new character:

- clean rest mouth patch;
- open, wide, rounded and teeth/labiodental mouth patches;
- closed-eye patch;
- alignment coordinates and scale metadata.

This would preserve identity while replacing synthetic SVG marks with art-directed facial pixels. A full pose pack or generative video model is not required for the next decision.

## Defer to Companion Motion v2

- forced alignment against the known narration text;
- calibrated facial patch assets and cross-fades;
- directional gaze only where a scene supplies a meaningful target;
- additional poses and contextual gestures from the planned production asset pack;
- jaw/cheek deformation, emotion and full-episode automation;
- any hosted or generative lip-sync provider evaluation.
