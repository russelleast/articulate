# Episode 0001 Editorial Review — Rough Cut 02

Review status: deterministic timeline pilot complete; continuous human playback still invited  
Canonical source: `docs/episodes/0001-why-articulate-exists.md`  
Timing authority: `episode-0001-narration-v1`

## Result

Rough Cut 02 introduces the Media Platform's declarative scene timeline without changing narration, the nineteen scene boundaries, scene order, Companion placement, episode structure or canonical journal content. Six scenes consume the new capability; thirteen scenes prove static backwards compatibility.

| Measure | Result |
| --- | ---: |
| Narration duration | 550.365692s |
| Rendered MP4 duration | 550.400000s |
| Scene count | 19 |
| Timeline scenes | 6 |
| Declared timeline events | 33 |
| Resolution and frame rate | 1920×1080 at 25 fps |
| Timing gaps / overlaps | 0 / 0 |
| Deterministic rerender SHA-256 | `3da1aa43494ce1200659a8c346e505ee86658022f60019f8ac80a58c701e459d` |

The 0.034-second video tail remains the expected 25 fps container boundary. The AAC audio stream is 550.365011 seconds and the complete selected recording remains present.

## Scene comparison

- **S002 — restrained typing experiment:** the first repository evidence claim is typed from 4.0–8.0s. The treatment makes the journal feel like an active workspace and is appropriately confined to authored repository evidence. It should remain exceptional; at four seconds it is readable without becoming the scene's subject.
- **S003 — narrated phrase:** “Not the diagrams”, “Not the documentation” and “The architecture” arrive at 3.0s, 10.0s and 17.0s. The conclusion receives grammar-approved emphasis from 22.0–27.0s. This is a substantial improvement over exposing the completed claim at scene start.
- **S004 — architectural questions:** five questions arrive individually from 2.0–22.0s and remain visible. The audience can read each question when it becomes relevant while retaining the accumulating argument.
- **S008 — excellent tools:** Confluence, Git, Terraform, Mermaid/C4 and EAM platforms arrive in a measured sequence from 3.0–19.0s. Confluence is explicitly present.
- **S009 — projections:** the centre appears first, surrounding concepts follow, then five centre-to-concept relationships are drawn from 12.0–16.0s. Each directional connector has a visible arrowhead at the semantic node boundary. The completed centre is emphasized from 19.0–22.0s.
- **S010 — fragmentation cost:** consequences arrive from 3.0–31.0s rather than holding a completed grid for 45 seconds. The concluding headline is emphasized from 36.0–40.0s without arbitrary colour changes.

No scene boundary was corrected. The configured events leave at least 3.7 seconds of completed-state hold in each pilot scene; S003 and S009 have the shortest holds and are the first candidates for continuous-playback timing review.

## Editorial comparison with Rough Cut 01

The strongest improvement is S009: the viewer now sees the projection model form, then sees directional relationships establish its meaning. S010 is the most important pacing correction because its longest static hold is replaced by five narrated beats.

The weakest treatment is S003's three-card grid. Its timing and emphasis express the requested editorial order, but the grid remains visually more card-like than the repository and radial scenes. A later grammar iteration could offer a sentence-building composition without introducing scene-specific code.

Typing improves S002 by making evidence feel authored rather than presented. It does not warrant broader use until continuous playback confirms that the character rate follows Russell's delivery. No pilot motion appears decorative in frame review. S004's five-second question cadence and S008's four-second tool cadence are deliberately calm; S009's one-second connector cadence is the fastest treatment and deserves the closest playback check.

Recommended next conversions are S005 (current state → trade-offs → future state), S007 (architecture/understanding divergence) and S015 (reasoning-order emphasis), matching the Rough Cut 01 review. They should reuse this capability only after Rough Cut 02 timing is reviewed with audio.

## Platform findings

### Defects fixed

- Complete compositions no longer have to appear at scene start.
- Radial directional relationships now have visible grammar-approved arrowheads instead of undirected lines or markers hidden beneath nodes.
- Review contact sheets sample the completed hold near scene end instead of an often-incomplete state two seconds after scene start.

### Reusable capabilities added

- semantic target catalogue and declarative event model;
- integer-frame timing resolution and state evaluation;
- reveal, hide, emphasize, deemphasize, connect, disconnect, replace, transition and repository-restricted type semantics;
- contextual timeline validation and static-scene compatibility;
- grammar-owned motion treatments and directional connector policy;
- declared/resolved timeline data in manifests and a dedicated resolution report;
- deterministic state-span assembly and frame-indexed progressive text.

### Non-blocking limitations

- Timing was authored from the existing narration-derived scene evidence and supplied review brief; the separately cited `/mnt/data/Ep1 - scene notes.docx` was not available in this workspace.
- Review has verified frames, contact sheet, media metadata and deterministic rerendering. Human continuous playback is still needed for delivery-level timing judgements.
- `transition` is semantically represented but Visual Grammar v1 still resolves it to a cut.
- Progressive text overflow is validated in its complete state; per-character geometry is safe because prefixes cannot exceed that complete authored text.

### Intentionally deferred

- easing, tweened opacity, physical movement and arbitrary drawing animation;
- runtime speech recognition or AI-generated render timing;
- a general-purpose animation or scripting framework;
- conversion of all nineteen scenes;
- broader typing use, dissolves and transformations.

## Outputs

- video: `production/episodes/0001/output/episode-0001-rough-cut-02.mp4`
- review frames and contact sheet: `production/episodes/0001/output/review/rough-cut-02/`
- render manifest: `production/episodes/0001/generated/rough-cut-02/render-manifest.json`
- timeline resolution report: `production/episodes/0001/generated/rough-cut-02/timeline-resolution-report.json`
- timing report: `production/episodes/0001/generated/rough-cut-02/timing-report.json`
