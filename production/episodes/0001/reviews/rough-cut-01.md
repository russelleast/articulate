# Episode 0001 Editorial Review — Rough Cut 01

Review status: complete first-pass production review; human continuous-playback notes invited  
Canonical source: `docs/episodes/0001-why-articulate-exists.md`  
Timing authority: `episode-0001-narration-v1`

## Summary

| Measure | Result |
| --- | ---: |
| Selected narration duration | 550.365692s (09:10.366) |
| Rendered MP4 duration | 550.400000s (09:10.400) |
| Rendered audio-stream duration | 550.365011s (AAC; 0.000681s shorter than WAV probe) |
| Scene count | 19 |
| Shot count | 19 (one static editorial shot per scene) |
| Companion screen time | 64.247692s (11.67%) |
| Placeholders | 0 |
| Resolution and frame rate | 1920×1080, 25 fps |
| Render command | `make episode-0001-render` |

The 0.034-second container tail is one 25 fps frame boundary beyond the narration duration. The complete audio is present and the final 3.831 seconds intentionally retain the selected recording's trailing silence as a closing hold.

Significant warnings:

- this is a static editorial rough cut, not a release candidate;
- there is no lip-sync, facial animation or full companion animation;
- transition metadata is documented, but rough cut 01 deliberately uses restrained hard cuts;
- exact recording-derived captions are not included because no reviewed transcription exists;
- pacing observations below are based on the narration-derived timeline, generated full render and contact-sheet review; continuous human playback should add delivery-specific notes.

## Pacing Issues

- **S010, 04:07.200–04:52.230 (45.030s):** highest-priority pacing issue. A single consequence grid remains unchanged through the longest scene. Split the visual treatment into discovery/duplication first, then decisions/impact/documentation, while preserving the narration boundary.
- **S005, 01:28.719–02:11.563 (42.844s):** the current-state to future-state diagram needs a progressive reveal or a second composition at a natural internal pause. The argument is strong, but the visual reaches its conclusion too early.
- **S015, 06:59.901–07:39.475 (39.574s):** the five-step reasoning order is readable but likely benefits from staged emphasis as each level is discussed.
- **S007, 02:37.224–03:13.606 (36.382s):** the architecture/understanding divergence should visibly increase over time; as a static timeline it risks feeling slow.
- No scene is shorter than 12.872 seconds, so the cut is not visually frantic. The opening four scenes establish a useful 13–31 second rhythm before the longer explanatory diagrams begin.

## Visual Issues

- **Most static section:** S010, followed by S005. Both should be improved in the storyboard before any renderer work is considered.
- **Most important missing visual:** a current, legible capture of the public journal or repository around S014. The central question is effective, but real project evidence would ground the vision immediately after it. Asset A012 remains deferred for this reason.
- S003's capability grid is intentionally restrained, but it is generic compared with the canonical journal view in S002. Consider replacing one label with a source-grounded repository or architecture capture.
- S008 and S009 use complementary tool/projection diagrams. Their argument is clear, although using the same light-card vocabulary in consecutive scenes reduces visual contrast.
- S013 uses the Companion because the narration becomes personal and reflective. It should remain a bridge, not expand into a continuous presenter segment.
- All text is within the 1920×1080 composition and review frames show no clipping. Small footer provenance text is for editorial traceability rather than primary viewing.

## Transition Issues

- **Weakest transition:** S012 → S013 at 05:47.767. The hard cut from the human/AI responsibility diagram to the Companion correctly marks the Vision section, but lacks a visual bridge from evidence synthesis to the project's origin story.
- S008 → S009 is logically strong but visually similar. A short re-composition of the tool cards into the radial projection diagram would make the relationship explicit.
- S013 → S014 moves from personal reflection to the central question. The cut works editorially; a subtle shared question motif would make it feel intentional rather than merely sequential.
- Avoid adding decorative transitions across the episode. Only the section changes above need stronger connective logic.

## Companion Usage

- **Adds value:** S001 establishes the series, S013 provides human presence during the personal origin story, and S019 closes the journal framing.
- **Should be removed:** none in rough cut 01. The Companion is absent for 88.33% of the episode and does not compete with diagrams or evidence.
- **Possible later motion:** S013 may benefit from a very subtle hold or camera drift. S001 and S019 do not require lip-sync to serve their editorial purpose.
- Lip-sync is not required before the release candidate unless continuous playback demonstrates that the static Companion distracts from Russell's voice.

## Editorial Recommendations

### Required before release candidate

1. Split or progressively reveal S010 so its 45-second hold follows the narrated consequences.
2. Add a second beat or progressive emphasis to S005's change diagram.
3. Replace or supplement S014 with a current repository/journal capture (A012) that remains legible at video scale.
4. Review the complete cut in continuous playback and record any delivery-specific timing adjustments without altering the master narration.
5. Produce and review an exact transcript/caption file from the approved recording.

### Desirable presentation improvement

1. Animate the divergence in S007 and staged reasoning order in S015 using restrained, deterministic reveals.
2. Create a connective transformation for S008 → S009 and a shared motif for S013 → S014.
3. Increase visual contrast between consecutive grid-based scenes while preserving the calm journal language.

### Future remaster opportunity

1. Consider subtle companion motion only after the static editorial structure is approved.
2. Add richer current repository and website evidence as the public journal evolves.
3. Revisit lip-sync only as a separately justified companion capability, not as an Episode 0001 blocker.

## Platform Findings

### Blocking defects fixed

- The logical asset `episode-0001-narration-v1` resolved to the 22.161-second voice-profile excerpt rather than the selected 550.366-second Episode 0001 recording. The registry now resolves the approved full recording and records its SHA-256 checksum.
- The experiment runtime's proportional four-scene retiming could not express narration-derived Episode 0001 boundaries. A narrow episode production command now consumes explicit narration markers while preserving the established asset-manager and FFmpeg boundaries.

### Non-blocking shortcomings documented

- The current episode renderer supports static authored frames only; progressive reveals must currently become additional narration-aligned shots.
- Transition intent is reviewable in the storyboard but is not yet executed beyond cuts in rough cut 01.
- Exact recording-derived captions still require a reviewed transcription workflow.
- At 25 fps, the MP4 container ends at 550.400 seconds while the encoded audio ends at 550.365 seconds. This one-frame boundary is harmless but should remain visible in the timing report.

### Proposed future improvements

- Add deterministic intra-scene reveal cues only after S005/S010 demonstrate a repeated editorial need.
- Add an approved lightweight transcription/caption production aid without changing the canonical journal's authority.
- Keep richer transitions episode-driven and explicit rather than introducing a general animation framework prematurely.

No ADR is warranted for rough cut 01: the change adds an episode production path and fixes asset configuration without changing the Media Platform's architectural model.

## Reproduction

From the repository root:

```sh
# Deterministic WAV metadata and pause analysis
make episode-0001-analyse

# Asset resolution plus exact timing/gap/overlap validation
make assets-validate
make episode-0001-validate

# Complete rough cut; also writes manifests, provenance, timing and review artefacts
make episode-0001-render

# Regenerate review frames, contact sheet, media report and render log from the MP4
make episode-0001-review
```

Equivalent explicit commands:

```sh
node production/runtime/episode-cli.mjs analyse --config production/episodes/0001/production/rough-cut-config.json
node production/runtime/episode-cli.mjs validate --config production/episodes/0001/production/rough-cut-config.json
node production/runtime/episode-cli.mjs render --config production/episodes/0001/production/rough-cut-config.json
node production/runtime/episode-cli.mjs review --config production/episodes/0001/production/rough-cut-config.json
```

## Output Paths

- rough cut: `production/episodes/0001/output/episode-0001-rough-cut-01.mp4`;
- review frames: `production/episodes/0001/output/review/rough-cut-01/frames/`;
- contact sheet: `production/episodes/0001/output/review/rough-cut-01/contact-sheet.png`;
- media report and render log: `production/episodes/0001/output/review/rough-cut-01/`;
- render manifest, asset manifest, provenance and timing report: `production/episodes/0001/generated/rough-cut-01/`.
