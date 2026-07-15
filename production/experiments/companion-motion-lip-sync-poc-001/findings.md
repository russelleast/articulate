# Findings

## Human review 001

The first A/B/C review failed:

- B's motion was not perceptible at normal viewing speed;
- C showed a flashing mouth dot in time with the audio, but did not read as lip-sync.

Those observations supersede the initial implementation assessment. The first C visual treatment is rejected.

## Revision 002

- retained A unchanged;
- increased breathing and rare posture amplitude while keeping it below gestural movement;
- replaced thin blink marks with a complete, short eyelid closure;
- removed SVG mouth dots and renderer-drawn mouth shapes;
- introduced four deterministic facial variants derived from the approved neutral raster, changing only the mouth region;
- retained the same audio analysis, performance timeline boundary, narration and scene composition.

B and C have been rerendered for a second normal-speed review. They are candidates, not approved outcomes.

## Human review 002 and alignment correction

The second review confirmed that motion and mouth activity had become visible, but found two coordinate defects: only part of the mouth changed and the eyelids were offset. Source-raster landmark inspection showed that the animated mouth region covered 90 pixels while the actual mouth spans approximately 145 pixels, and the viewer-left eye centre was 11 Studio pixels away from its overlay.

Revision 003 expands and recentres the facial mouth region across the complete mouth, aligns the eyes independently at their measured centres, reduces eyelid height, and matches the surrounding skin tone more closely. B, C and the synchronized comparison have been rerendered again.

## Human review 003 and cosmetic refinement

The third review accepted the lip-sync timing and full-mouth movement. Remaining findings were cosmetic: the open mouth read as square, the teeth state appeared as an isolated white bar, and identical eyelid colours did not follow the face's directional lighting.

Revision 004 leaves timing and motion unchanged. Open, wide and teeth cavities now use tapered curved contours; the teeth highlight is thinner, curved and contained; and each eyelid uses a separately sampled source-skin colour with its own crease tone.

## Evaluation

| Criterion | A — baseline | B — motion only | C — motion + lip-sync |
| --- | --- | --- | --- |
| Presence | Stable but visibly static during direct address. | Revision 002 makes breathing, two irregular blinks and rare posture change visibly readable. | Retains B's presence and adds facial-state changes. |
| Naturalness | Consistent with the approved still identity. | Requires second human review; revision 001 was too subtle. | Revision 001 was rejected. Revision 002 uses raster facial variants and requires second human review. |
| Lip synchronisation | None. | None. | Revision 002 provides visible mouth shapes driven by broad speech activity; vowel/consonant identity remains approximate. |
| Identity preservation | Strong. | Strong: the approved raster remains unchanged. | Strong in the revised render because rest uses the untouched face and overlays are small. |
| Distraction | Low, although stillness can read as composited. | Low. | Low after amplitude reduction; detailed scrutiny reveals the simplified overlay model. |
| Repetition | Static rather than repetitive. | No visible blink/head loop in 16.44 seconds. Breathing remains periodic but very low amplitude. | Mouth changes are audio-derived rather than looped. |
| Uncanny valley | Low. | Low. | Moderate risk if mouth shapes are enlarged; low-to-moderate in the revised render. |
| Production fit | Existing baseline. | Fits the Articulate motion language. | Fits as an optional experiment, not yet as a platform default. |

## What worked

- The layered model maps cleanly onto the existing deterministic renderer.
- The architecture survived a failed visual treatment: motion amplitude and facial assets changed without changing scene timing or audio analysis boundaries.
- Irregular authored blinks and rare posture motion avoid an obvious mechanical loop.
- Separating analysis, timeline resolution and rendering keeps future technology choices open.
- Audio-derived timing preserves the original delivery and produces reproducible timeline data.
- The five-state vocabulary is sufficient to test rhythm without pretending to be phoneme-perfect.

## What looked unnatural

- A visibly rounded or large open mouth is too coarse at the current on-screen head size. The first C render crossed into a cartoon-like “O” and was rejected.
- The rejected flat overlay could not reproduce cheek, jaw, moustache and lip deformation from the single neutral raster.
- Signal-only classification sometimes chooses a plausible mouth activity level rather than the correct speech shape. It is not forced alignment.
- Blink overlays are constrained by the lack of clean eyelid/eye layers and should remain infrequent.

## Recommendation

Retain the declarative performance boundary. Do not apply lip-sync to the complete Episode 0000 yet.

The practical answer is:

> The first review did not prove either motion or lip-sync. Revision 002 creates a perceptible motion treatment and a genuine facial-state comparison, but adoption depends on a second normal-speed human review.

The C render should receive normal-speed human A/B review against B before any production adoption. If reviewers do not reliably prefer C, ship motion-only. Lip-sync must remain optional and scene-specific.

## Experimental facial asset refinement

Revision 002 creates a first Companion facial layer pack derived from the approved neutral asset, not a new character:

- clean rest mouth patch;
- open, wide, rounded and teeth/labiodental mouth patches;
- closed-eye patch;
- alignment coordinates and scale metadata.

These variants preserve identity better than synthetic SVG marks, but they remain experimental rather than art-directed production assets. A full pose pack or generative video model is not required for the next decision.

## Defer to Companion Motion v2

- forced alignment against the known narration text;
- calibrated facial patch assets and cross-fades;
- directional gaze only where a scene supplies a meaningful target;
- additional poses and contextual gestures from the planned production asset pack;
- jaw/cheek deformation, emotion and full-episode automation;
- any hosted or generative lip-sync provider evaluation.
