# Current Production Engine Capabilities

- Status: descriptive architecture snapshot
- Assessed: 2026-08-06
- Scope: the executable production runtime, its asset and diagram pipelines, the version 2 pre-render workflow, and representative episode configurations
- Purpose: establish the implementation baseline before revising the Visual Grammar or writing a Production Guide

This document describes what the Articulate production engine can do now. It is not a statement of desired visual language. Where the editorial documents or schemas describe a capability that the renderer does not execute, the distinction is called out explicitly.

The shortest accurate description of the engine is:

> A deterministic, narration-timed SVG scene compositor with semantic state changes, reusable layout archetypes, continuous presenter-video composition, static authored-diagram embedding, and FFmpeg-based media assembly.

It is not currently a general animation engine, browser recorder, non-linear editor, SVG choreography engine, or camera system.

## Capability boundary

The repository contains three related but different layers:

1. **Editorial intent.** The Visual Grammar and motion guidance describe the desired audience experience, including progressive diagrams, camera focus, authentic repository evidence and dissolves.
2. **Pre-render planning.** `scene-plan.yaml`, source alignment and `timeline.json` make visual intent reviewable and can validate proposed diagram states and phrase-aligned beats.
3. **Executable rendering.** Episode configuration, timing markers, the renderer timeline and FFmpeg assembly produce the actual MP4.

The executable layer implements only a subset of the editorial layer. A term appearing in the Visual Grammar or a scene-plan schema does not by itself mean the renderer supports it.

## 1. Current Rendering Model

### Fundamental concepts

| Concept | Current meaning |
| --- | --- |
| Episode | The production unit. Its render configuration selects sources, timing markers, assets, output settings, Visual Grammar profile and ordered scenes. |
| Written episode | Semantic authority for the journal. It is an upstream source and provenance record, not a direct renderer input. |
| Spoken narrative | Delivery authority and the source used for storyboard alignment, narration, transcripts and subtitles. |
| Recorded audio | Timing authority for audio-led productions. Its measured duration must equal the complete, gap-free scene timeline. |
| Presenter media | A single continuous video source with embedded audio. A configured source window supplies both picture and sound without restarting at scene boundaries. |
| Scene | One contiguous, narration-aligned interval with a visual kind, content, transition intent and optional timeline or shots. |
| Archetype | The semantic purpose resolved from the scene kind, such as Narrator, Diagram, Repository, Evidence, Reflection, Whiteboard or Focus Canvas. The exact set differs slightly between the planning schema and executable grammar profiles. |
| Composition | The renderer-owned spatial strategy selected from the scene kind and optional `compositionMode`. Examples include presenter full-frame, presenter beside canvas, Focus Canvas, repository, evidence, flow, grid, radial and timeline compositions. |
| Shot | An editorial grouping inside a scene. A shot has a scene-relative start and contains shot-relative events. It does not create a second rendering or animation model. |
| Timeline event | A semantic state change addressed to stable element IDs such as `headline`, `support`, `item-1`, `centre`, `repository-window` or `evidence-1`. |
| Presentation state | The immutable state calculated for a scene-relative integer frame: hidden elements, emphasized elements, active connections, typed text and semantic transition value. |
| Asset | A logical registry entry resolved through a provider. Only some registered asset types have an executable rendering path. |
| Diagram | A registered D2 or PlantUML semantic source rendered to SVG, normalised for dark-video publication, then embedded as a complete image. |
| Companion | The archived AI-created narrator implementation, composed from PNG assets with an optional separate performance timeline. |
| Visual Grammar profile | Runtime policy for scene-kind resolution, typography, palette, layout grids, safe area, transition semantics and motion treatments. Version 1 supports Companion productions; version 2 supports presenter-led productions. |
| Frame | The deterministic unit of execution. Scene boundaries and event offsets are rounded to integer frames. |
| Segment | An encoded H.264 interval produced from either a held raster frame or a per-frame PNG sequence. Segments are concatenated before audio or presenter composition. |

The version 2 pre-render workflow adds source alignment, scene authority, review state, phrase-aligned beats and proposed diagram states. These are valuable production-model concepts, but the render CLI still consumes an episode render configuration and timing-marker document rather than rendering `scene-plan.yaml` directly.

### How scenes are composed

The runtime performs the following resolution:

```text
render configuration + timing markers
  -> contiguous timed scenes
  -> scene kind + Visual Grammar profile
  -> archetype + composition + transition semantics
  -> flattened shot events
  -> integer-frame timeline
  -> frame-indexed presentation state
  -> deterministic SVG composition
  -> PNG frame or held-state interval
  -> H.264 scene segments
  -> concatenated visual track
  -> narration mux or continuous presenter composition
  -> MP4 + manifests + review artefacts
```

A composition is not an arbitrary layer graph. It is a renderer function selected from a fixed vocabulary. The main reusable composition families are:

- presenter full-frame, presenter focus, presenter left/right of canvas, presenter overlay and canvas full-frame;
- Focus Canvas and legacy whiteboard/workspace/studio surfaces;
- authored diagram placement;
- synthetic repository and evidence windows;
- flow, grid, risk grid, timeline, radial and reflection layouts;
- teaching layouts including vertical paths, retrieval/reasoning comparisons, graphs, selectors, routers, capability grids, loops, layer stacks and progressions;
- archived Companion layouts.

Episode data supplies semantic content and timing. Renderer code owns coordinates, wrapping, typography, shapes, connectors and composition-specific rules. Text is measured and overflow can fail validation rather than being silently clipped.

Scene frame windows are calculated from rounded global start and end frames. This avoids cumulative audiovisual drift from independently rounded scene durations. Scenes must cover the selected audio or presenter window from start to finish without gaps or overlaps.

### How animations are defined

Animations are primarily authored as declarative events:

```json
{
  "id": "connect-source",
  "at": 5.2,
  "action": "connect",
  "from": "item-1",
  "to": "item-2"
}
```

Event times are relative to a scene, or relative to a shot before flattening. The runtime resolves seconds with `round(at * frameRate)`. It validates targets, bounds, ordering, connection endpoints, hidden-element references and incompatible overlapping actions.

Most actions do not interpolate. They change the presentation state at a frame boundary. The renderer then holds that state until the next change. Repository typing and Companion performance are exceptions that cause per-frame rendering.

There are therefore two executable motion models:

1. **Discrete semantic state changes:** reveal, hide, emphasize, connect, replace and similar operations produce a sequence of static states.
2. **Narrow frame-indexed treatments:** repository typing, Companion idle movement, blink/head performance and mouth-image substitution are evaluated on every frame.

There is no general keyframe, easing, transform, opacity-curve or arbitrary layer-animation model.

## 2. Supported Media Types

### Executable asset registry types

The shared registry currently contains these types. Registry acceptance is deliberately permissive; type-specific behaviour is enforced only at the consumer boundary.

| Registry type | How it is handled |
| --- | --- |
| `presenter-video` | Fetched as one continuous video with embedded audio. FFprobe validates streams and duration. FFmpeg trims one source window, optionally applies EBU R128 audio normalization, scales and positions the picture per scene, and can apply an opaque overlay or configurable soft luminance key. |
| `narration` | Fetched as the continuous audio authority for Companion/audio-led productions, checksum- and duration-validated, then muxed with the concatenated visual track. |
| `narration-extract` | A derived audio input handled through the same local asset mechanism when referenced by a production configuration. |
| `diagram` | Must declare `format`, semantic source and generated `.svg` location. D2 or PlantUML renders the source; the video runtime resolves the SVG, normalises it in memory and embeds it as an SVG data URI. |
| `companion` | A PNG used as the archived Companion figure. It may be held static or moved by the Companion motion pipeline. |
| `companion-facial-variant` | A PNG mouth-state replacement selected by the Companion performance timeline. Blink eyelids are drawn as an SVG overlay. |
| `companion-reference` | Stored for design provenance. It has no direct scene-rendering path. |

Episode-local `assetIds` are principally provenance references checked against the episode asset register. The render CLI does not automatically fetch or display an arbitrary asset merely because its ID appears in `assetIds`. A visual requires an explicit renderer field and consumer, such as `diagramAssetId`.

### Media and visual capability matrix

| Media or visual type | Support | Current handling and limitation |
| --- | --- | --- |
| Presenter video | Supported | One continuous source with embedded audio. Picture can be full-frame, left, right, a lower overlay, reduced in presenter-focus mode, or hidden while audio continues. There are no scene-local restarts, video cuts within the source window or animated crop changes. |
| Recorded audio | Supported | Separate narration can drive an audio-led episode; presenter productions require embedded audio. The core engine does not mix music, effects, multiple speakers or an independently cleaned presenter track. |
| Companion image | Supported, legacy | A neutral PNG plus optional mouth variants, idle motion, blink, head and simplified viseme events. It is not used in presenter-profile episodes. Gaze is represented in state but currently has no visible renderer treatment. |
| D2 | Supported as diagram source | The D2 CLI renders with fixed ELK layout, theme and padding arguments to a shared SVG. The engine embeds the complete rendered diagram. |
| PlantUML | Supported as diagram source | The PlantUML CLI renders UTF-8 source from stdin to SVG. It shares the asset and publication pipeline. The current video normaliser has a D2-specific page-background adapter but otherwise treats SVG renderer-neutrally. |
| SVG diagram | Supported under the diagram contract | Requires a registered `diagram` asset and positive root `viewBox`. It is colour-normalised, given publication metadata and placed with `xMidYMid meet`. There is no generic arbitrary-SVG scene type. |
| Arbitrary SVG | Not supported as a first-class asset | An SVG cannot be referenced generically, layered freely or animated by element ID through episode configuration. |
| PNG | Narrow support | PNG is supported for the Companion and facial variants, and as the renderer's generated intermediate frame format. There is no generic episode-authored PNG composition path. |
| Repository view | Supported as a synthetic composition | Repository and workspace scenes draw a stylised vector window from authored paths, labels and evidence excerpts. They do not capture or display a real repository UI. |
| Code window | Partially supported as synthetic evidence | Repository/workspace compositions can display short authored text and paths in a code-like panel, with optional character-by-character typing. There is no source-file loader, syntax highlighter, line-number model, diff renderer or authentic editor capture. |
| Terminal | Not supported | Terminal footage is mentioned by planning guidance but there is no terminal asset type, command runner, terminal renderer or recording compositor in the episode engine. |
| Screen recording | Not supported | The engine cannot ingest and time a generic screen recording as a scene layer. Presenter video is the only supported video input. |
| Website or application capture | Not supported by the engine | Such captures may be produced manually as production assets, but the current renderer has no first-class still-capture or browser-video path. |
| Focus Canvas | Supported as a renderer-owned surface | The engine draws structured digital teaching compositions and can place presenter video beside or over them. It is generated SVG, not a freeform canvas asset. |
| Focus overlay | Narrow support | `presenter-overlay` places the continuous presenter picture in a fixed overlay region. Timeline emphasis changes strokes/text on known semantic elements. There is no arbitrary crop, spotlight, blur, mask or region-of-interest overlay system. |
| Subtitles | Supported as sidecar production output, not core composition | Episode-specific preparation scripts derive `.srt` and transcripts from timestamped delivery, and validation scripts check ranges, overlaps, line count, line length and terminology. The render CLI neither generates nor burns captions into the MP4 and performs no caption-safe collision validation. |
| Transcript | Supported as an alignment and publication artefact | Whisper-derived word timing can feed source alignment and subtitle preparation. Runtime speech recognition is not performed during render. |
| Music and sound effects | Not supported | There is no multi-track audio timeline, ducking, fades, loudness policy by track or sound-effect cue model. |
| Static title, evidence and reflection cards | Supported | Produced from renderer-owned SVG layouts and authored strings, not imported media. |
| Review imagery | Supported as output | The engine extracts scene states, final holds and optional fixed-interval samples into contact sheets. These are review artefacts rather than scene inputs. |

## 3. Animation Capabilities

### Timeline actions

| Action | Executable behaviour | Limitation |
| --- | --- | --- |
| `reveal` | Removes a semantic element from the hidden set at the event frame. | Instant cut; no opacity or movement. |
| `hide` | Adds the target to the hidden set. | Instant cut. |
| `emphasize` | Applies composition-specific emphasis, generally an accent stroke and text colour. A duration can remove the emphasis automatically. Some teaching nodes also dim non-emphasized peers. | No animated ramp, glow or generic highlight geometry. Treatment is inconsistent by element shape/composition because it relies on renderer CSS and local markup. |
| `deemphasize` | Removes persistent emphasis. | Instant state change. |
| `connect` | Adds a persistent connector between two visible semantic elements, normally with a grammar-approved arrowhead. | Connector appears complete at once; it is not drawn progressively. Available routing depends on the selected composition. |
| `disconnect` | Removes a previously created connector. | Instant removal. |
| `replace` | Hides one semantic target and reveals another at the same frame. | No crossfade, shared-element mapping or shape interpolation. |
| `transition` | Stores a semantic transition value in presentation state. | The current scene renderer does not turn this state into visible motion. |
| `type` | Reveals authored text by character count across integer frames. | Restricted to Repository scenes unless explicitly allowed; it is not a general text animation. |

The v2 pre-render vocabulary spells `emphasise` and `deemphasise` differently from the executable timeline's `emphasize` and `deemphasize`. The planning compiler does not currently normalise that vocabulary into the render runtime, which illustrates that `timeline.json` is not yet a direct executable scene configuration.

### Transitions and motion categories

| Category | Current status |
| --- | --- |
| Reveal | Supported as a hard visibility change. |
| Fade | Accepted as a scene transition input, but resolves to a deterministic cut. There is no dissolve. |
| Replace | Supported as a same-frame hide/show operation. |
| Zoom | Not supported. |
| Highlight | Partially supported through semantic `emphasize`; no arbitrary SVG or screen-region highlighting. |
| Camera movement | Not supported. |
| Pan | Not supported. |
| Morph | Not supported. |
| Progressive builds | Supported for renderer-owned semantic elements: nodes, labels, evidence, connections and typed repository excerpts can accumulate over time. Not supported inside an authored SVG diagram. |
| Presenter movement | Scene modes can reposition or resize the continuous presenter between scenes, but the change is a cut. No interpolation occurs between framings. |
| Companion idle | Supported as a small sinusoidal vertical translation and scale treatment. |
| Companion performance | Blink envelope, head translation/rotation and mouth-image substitution are frame-indexed. This is a specialized character pipeline, not reusable object animation. |
| Directional drawing | Connections appear at an event frame with an arrowhead; stroke drawing over time is not supported. |

Scene transitions accept `cut`, `fade` and `section`. `fade` has the semantic label `dissolve`, while `fade` and `section` both render as cuts for compatibility. Segments are concatenated without overlap, so crossfades cannot occur in the current assembly model.

## 4. Diagram Pipeline

### Production flow

```text
D2 or PlantUML semantic source
  -> notation CLI
  -> generated standalone SVG
  -> logical diagram asset
  -> in-memory video-dark normalisation
  -> complete SVG data URI
  -> fixed Focus Canvas viewport
  -> scene SVG
  -> raster frame
```

D2 is used for architectural relationships, decomposition and capability models. PlantUML is used for governed flows, decisions and feedback loops. The common renderer boundary is SVG.

The `video-dark` publication profile removes the D2 page rectangle, preserves mask semantics, maps known presentation colours, declares profile/version metadata and enforces `xMidYMid meet`. This changes publication styling without changing the canonical source or committed website SVG.

### Direct answers

**Does the engine animate existing SVGs?**

No. It embeds the full normalized SVG as one `<image>` in the scene. Timeline targets do not address nodes or paths inside that image.

**Does it reconstruct diagrams?**

There are two paths:

- A standard `diagramAssetId` scene does not reconstruct the diagram. It embeds the notation renderer's full SVG.
- Renderer-owned Focus Canvas and teaching compositions reconstruct diagram-like explanations from `items`, `details`, layout selection and timeline state. In the current teaching path, the renderer may show this reconstructed progressive view and swap to the complete canonical SVG once all items are visible. That is a replacement between two representations, not animation of the authored diagram.

**Can it transition between diagram states?**

Not for authored SVG diagrams. The v2 scene-plan schema can describe `static` or `progressive` diagrams with named visible-element states, and validation checks referenced top-level D2 IDs. The current pilot renderer still uses a full-state SVG and does not generate state SVGs or apply those state declarations. Renderer-owned conceptual compositions can accumulate their own nodes and connectors, but they are not states of the authored SVG.

**Can it highlight existing SVG elements?**

No. `emphasize` addresses the outer renderer's semantic elements only. The normalized diagram is an opaque image boundary from the scene renderer's perspective.

**Can authored diagrams be treated as immutable assets?**

Yes, with an important qualification. The D2 or PlantUML source is the semantic source of truth, and generated SVGs must not be edited manually. The website SVG remains unchanged. Video applies a deterministic derived publication transform for background, palette and root attributes, so the exact SVG bytes and presentation colours are not immutable at the video boundary. The diagram can be treated as semantically immutable, but not as a pixel- or byte-immutable presentation asset.

### Diagram limitations

- No stable, renderer-neutral element-addressing contract is carried from notation source into the video runtime.
- The v2 validator's D2 ID discovery is a simple top-level source-line parser, not a full D2 semantic parser.
- PlantUML element-state validation is not implemented in the scene-plan workflow.
- The publication profile maps known colours rather than performing semantic style resolution.
- Minimum text size is a profile target, not a measured render-time guarantee.
- Dense diagrams must be simplified or split manually.
- There is no state diff, shared-element transition, camera focus, local zoom, animated edge draw or internal SVG emphasis.
- The teaching-composition-to-canonical-SVG swap risks geometry discontinuity because the two representations are laid out independently.

## 5. Architectural Strengths

### Deterministic audiovisual timing

Recorded delivery owns timing, scenes must be contiguous, and global frame rounding prevents cumulative drift. Continuous presenter picture and audio share one source clock, which is a strong foundation for lip synchronization and repeatable edits.

### Clear semantic/runtime separation

Episodes say what should change and when; the Visual Grammar profile says how it should look. Stable semantic targets keep layout coordinates and FFmpeg expressions out of episode content.

### Reviewability and provenance

The engine produces render manifests, timeline resolution reports, timing reports, asset manifests, provenance records, scene-state contact sheets and temporal contact sheets. It exposes authored intent and resolved execution rather than treating the MP4 as the only artefact.

### Strong validation before expensive rendering

The runtime checks scene continuity, duration, checksums, presenter streams, timeline bounds, hidden-element references, duplicate events, text overflow, connection validity, asset types and malformed diagram SVGs. Failures retain episode, scene, event, time and target context where possible.

### Reusable, explicit composition vocabulary

The renderer has a substantial library of architecture-oriented layouts rather than a set of episode-specific screenshots. Repository, evidence, radial, flow, graph, loop, layer and presenter/canvas compositions express recurring teaching needs with consistent typography and safe areas.

### Reusable semantic diagrams

D2 and PlantUML sources are shared across journal and video. Publication styling is separated from diagram meaning, and logical assets decouple identity from physical storage.

### Preservation of authored human performance

Presenter media is treated as a continuous performance rather than a collection of clips. Hiding the picture does not interrupt the voice, and soft-luminance composition allows the presenter to sit within the visual environment rather than always appearing in a framed panel.

### Evolution without breaking archived productions

Visual Grammar profiles preserve the older Companion pipeline while allowing presenter-led compositions to evolve. Shots were added as editorial structure without creating another animation subsystem.

## 6. Architectural Weaknesses

### The engine is stateful but not truly animated

Most visual change is a hard switch between complete SVG states. The model has no interpolation, easing, transform tracks, opacity tracks or transition overlap. This makes calm progressive explanation possible, but limits continuity and polish.

### Authored diagrams and choreography are disconnected

The engine's strongest semantic assets are treated as opaque images. Progressive diagram intent exists in schemas and documentation, but the executable runtime cannot reveal, dim, highlight, connect or focus elements within an authored SVG.

### Media ingestion is very narrow

Only presenter video, narration, diagram SVG and Companion PNGs have real consumer paths. There is no generic image, screen recording, browser capture, terminal, editor, B-roll or multi-video layer model. The registry can name assets more broadly than the renderer can use them.

### Repository and evidence scenes are illustrative rather than evidential

They look like repository or code surfaces but are reconstructed from short strings. They do not prove that the displayed text came from a particular commit, file, line range, command or browser state. This weakens the architecture's “evidence before opinion” narrative.

### Subtitles are outside the core production contract

Subtitles are produced and checked by episode-specific scripts. The renderer neither assembles the sidecar consistently nor validates caption-safe layout, so accessibility behaviour can diverge by episode.

### Planning and execution vocabularies have drifted

The version 2 scene plan, derived timeline and renderer configuration overlap without forming one end-to-end executable contract. Archetype sets differ, British and American spellings differ, progressive diagram states stop before rendering, and the render CLI still requires separately authored scene configuration and timing markers.

### Composition extensibility requires code

Semantic targeting is reusable, but adding a new layout, target family, animation treatment or authentic media type generally requires JavaScript changes. There is no general layer graph or plugin boundary for composition capabilities.

### Some behaviours are implicit in renderer layout code

Teaching layouts sometimes create connectors automatically when adjacent nodes are visible, independently of explicit `connect` events. Emphasis can dim peers in one layout but only recolour a target in another. This makes identical timeline verbs composition-dependent in ways that are not fully declared by the grammar profile.

### Transition semantics overstate runtime behaviour

`fade` is labelled as a dissolve and the editorial grammar discusses transforms and shared motifs, but assembly produces hard cuts. Reviewers must know the implementation detail to interpret configuration accurately.

### Audio is a single-program model

The engine has one narration or embedded-presenter track. It cannot express music, sound effects, independent cleanup tracks, fades, ducking, alternate languages or per-scene audio treatments.

### Rendering can be expensive

Typing and Companion motion rasterize and encode every frame. There is no retained vector animation, render cache keyed by state, or reusable media-layer encoding strategy beyond held-state segments.

## 7. Opportunities

The highest-value improvements for educational architecture videos are capabilities that strengthen understanding, evidence and continuity rather than adding decorative motion.

### 1. Make authored diagrams choreographable

Introduce a stable diagram element contract carried from D2 or PlantUML through SVG publication. The renderer should be able to apply visible, hidden, emphasized and de-emphasized states to authored elements, reveal connectors in narrated order and render named diagram states without reconstructing the diagram.

This closes the largest gap between the architectural source of truth and the teaching experience.

### 2. Add state transitions with restrained interpolation

Support a small, grammar-owned transition vocabulary: short opacity dissolve, transform between known bounds, stroke draw, emphasis fade and presenter crop interpolation. Use fixed durations and easing profiles selected by semantic intent. Avoid exposing arbitrary animation scripting in episode files.

### 3. Add a camera/focus model for large evidence surfaces

Provide declarative regions of interest with stable framing, slow pan/zoom between adjacent regions and caption-aware bounds. This would make dense diagrams, repository evidence and code readable without inventing a general virtual camera.

### 4. Introduce authentic evidence assets

Add first-class, provenance-rich repository, code, terminal, browser-still and screen-recording assets. A useful contract would include source commit, path or URL, capture command, crop, time range, redaction, expected content and review checksum. Still and video evidence should enter the same logical asset system rather than episode-specific FFmpeg code.

### 5. Unify scene plan and executable timeline

Create one compilation path from approved `scene-plan.yaml` and alignment artefacts to a versioned render plan. Normalize vocabulary, make archetype capabilities explicit, carry diagram states through compilation and eliminate manually duplicated event/timing structures.

### 6. Make subtitles a first-class output

Move SRT generation, terminology corrections, timing checks and publication placement into shared runtime capabilities. Add caption-safe layout validation and optionally produce both clean MP4 plus sidecar captions and a review-only burned-caption render.

### 7. Generalize the layer and media model carefully

Add typed layers for still image, continuous video, timed clip, authored SVG, generated composition, annotation and presenter. Each type should have explicit timing, crop, fit, provenance and allowed treatments. This would enable new media without turning episode configuration into raw FFmpeg.

### 8. Strengthen semantic emphasis

Define consistent grammar treatments for focus, context, warning, evidence, uncertainty and conclusion. Ensure `emphasize` behaves predictably across text, node, connection, diagram element, code region and video overlay, including an accessible non-colour cue.

### 9. Add an educational pacing model

Validate reading time, event density, final holds, diagram complexity and minimum rendered text size. Review tooling could flag long static intervals, overly rapid builds and labels that are technically within bounds but too small at reduced playback size.

### 10. Add a small multi-track audio model

Support an independently mastered presenter track first, with explicit synchronization to picture. Later additions could include restrained music and effects with loudness, fade and ducking policies owned by the production grammar.

## Recommended architectural sequence

Following Articulate's problem-to-runtime reasoning order, the next evolution should be:

```text
Problem
  Educational explanations cannot preserve semantic diagrams and authentic evidence
  while guiding attention over time.

Principles
  Semantic source remains authoritative; choreography is declarative; motion serves
  comprehension; evidence remains traceable; output stays deterministic and reviewable.

Capabilities
  Addressable diagram elements, named visual states, authentic evidence assets,
  restrained state transitions, camera focus and first-class captions.

Architecture
  Approved scene plan -> versioned render plan -> typed layer graph -> grammar-owned
  treatments -> deterministic frame/media compositor.

Runtime
  SVG element adapter, evidence capture adapters, state interpolator, caption-safe layout,
  multi-input FFmpeg assembly and expanded review manifests.
```

The first implementation slice should be authored-diagram element addressing plus progressive state rendering. It directly improves educational value, exercises the existing scene-plan intent, and avoids broadening the engine into a general-purpose editor before its semantic model is ready.

## Implementation sources reviewed

The principal executable and architectural sources for this assessment are:

- [`production/runtime/episode-cli.mjs`](../runtime/episode-cli.mjs)
- [`production/runtime/renderer/README.md`](../runtime/renderer/README.md)
- [`production/runtime/renderer/visual-grammar.mjs`](../runtime/renderer/visual-grammar.mjs)
- [`production/runtime/renderer/scene-timeline.mjs`](../runtime/renderer/scene-timeline.mjs)
- [`production/runtime/renderer/scene-shots.mjs`](../runtime/renderer/scene-shots.mjs)
- [`production/runtime/renderer/scene-renderer.mjs`](../runtime/renderer/scene-renderer.mjs)
- [`production/runtime/renderer/teaching-compositions.mjs`](../runtime/renderer/teaching-compositions.mjs)
- [`production/runtime/renderer/presenter-media.mjs`](../runtime/renderer/presenter-media.mjs)
- [`production/runtime/renderer/companion-performance.mjs`](../runtime/renderer/companion-performance.mjs)
- [`production/runtime/pre-render-workflow.mjs`](../runtime/pre-render-workflow.mjs)
- [`production/runtime/diagrams/diagram-runtime.mjs`](../runtime/diagrams/diagram-runtime.mjs)
- [`production/runtime/diagrams/video-diagram-profile.mjs`](../runtime/diagrams/video-diagram-profile.mjs)
- [`production/runtime/diagrams/svg-normaliser.mjs`](../runtime/diagrams/svg-normaliser.mjs)
- [`production/runtime/assets/asset-registry.mjs`](../runtime/assets/asset-registry.mjs)
- [`production/schemas/scene-plan.schema.json`](../schemas/scene-plan.schema.json)
- [`production/assets/registry.yaml`](../assets/registry.yaml)
- [`production/diagrams/README.md`](../diagrams/README.md)
- [`docs/media/visual-grammar.md`](../../docs/media/visual-grammar.md)

