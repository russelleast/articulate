# Articulate Visual Grammar

- Status: canonical media guidance
- Applies to: all Articulate episodes and extracts
- Informed by: Episode 0001 Rough Cut 01

The Articulate Visual Grammar defines how architectural reasoning becomes visible over time. It is an editorial contract, not a library of templates and not a renderer specification.

Its role in media production is comparable to DCL's role in capability definition: express intent declaratively, apply it consistently, and allow implementations to evolve without making an individual episode the source of the rules.

This document refines the broader [visual language](../../production/branding/visual-language.md) and [motion language](../../production/branding/motion-language.md). Those documents establish identity; this grammar governs editorial composition, progression and rhythm.

## 1. The architectural problem

The production pipeline can deterministically synchronise authored frames with narration. That proves assembly, but it does not by itself create a visual argument.

A storyboard becomes slide-like when it treats each narration section as one completed frame:

```text
Section begins -> complete composition appears -> frame remains unchanged -> section cut
```

The problem is not insufficient animation. It is insufficient editorial state. A useful scene must identify what the viewer should understand now, what should be introduced next, and what visual evidence supports that change in understanding.

The grammar therefore separates five concerns:

```text
Problem -> Principles -> Editorial capabilities -> Scene architecture -> Runtime expression
```

- **Problem:** what the viewer is trying to understand.
- **Principles:** the values that constrain the treatment.
- **Editorial capabilities:** explanation, evidence, comparison, reflection and orientation.
- **Scene architecture:** archetype, shots, progression and transitions.
- **Runtime expression:** frames, cues, assets and renderer behaviour.

Technology begins only at the final layer.

## 2. Design philosophy

Articulate should feel like an experienced architect reasoning in public: calm, exact, evidence-led and willing to preserve uncertainty.

Every visual must do at least one of the following:

- orient the viewer;
- expose evidence;
- reveal a relationship;
- compare states or alternatives;
- show change over time;
- focus attention on a conclusion or an unresolved question;
- create a short reflective pause.

If a visual does none of these, remove it.

### Governing principles

1. **Understanding before spectacle.** Motion, imagery and composition serve comprehension.
2. **Evidence before opinion.** Prefer repository material, decisions, system signals and explicit source references to decorative claims.
3. **Diagrams before decoration.** Use structure and relationship as the primary teaching medium.
4. **Progression before replacement.** Develop a visual when the narrative develops an idea; do not cut merely because a document heading changed.
5. **One argument at a time.** A shot has one primary question and one dominant focal point.
6. **Calm does not mean static.** Calm comes from legible change, stable spatial relationships and deliberate timing.
7. **Uncertainty remains visible.** Do not use visual completion, symmetry or motion to imply confidence that the source does not support.
8. **The narration is authoritative.** On-screen text supports the spoken argument; it does not duplicate it.

## 3. Composition rules

### 3.1 Frame as working surface

Treat the frame as a shared reasoning surface, not a slide boundary. An idea may persist across several shots while its state changes.

- Keep stable elements in stable positions while relationships develop.
- Reserve the strongest contrast for the current explanatory focus.
- Allow negative space around the focus; a filled frame is not a more informative frame.
- Prefer partial, purposeful compositions to dashboards of equally weighted cards.
- Use full-frame title compositions only for the opening, closing, major acts when orientation is genuinely at risk, or an exceptional question that needs silence.
- Avoid repeating the same headline/support/grid geometry in consecutive scenes.

### 3.2 Information hierarchy

Every shot should make this order clear:

1. the object currently being discussed;
2. its relationship to the argument;
3. supporting labels or evidence;
4. provenance and production metadata.

Footer provenance may be persistent but must remain visually subordinate. Do not let an episode label, scene id or timestamp compete with the lesson.

### 3.3 Text density

Text is appropriate for exact language: names, short claims, questions, evidence excerpts and relationship labels. It is not a transcript.

- Use one headline or focal question per shot.
- Prefer labels of one to five words.
- Keep explanatory copy to one short sentence, normally no more than two lines.
- Do not place more than five equally weighted text elements on screen without progressive grouping.
- If an item needs more than two lines inside a diagram node, shorten it, enlarge the node, or reveal supporting detail separately.
- Never shrink primary text merely to preserve a crowded layout.

### 3.4 Safe composition

- Keep essential content inside a consistent title-safe area.
- Design for small-screen viewing and video compression, not only a full-resolution review frame.
- Preserve space for captions without covering diagram labels or evidence.
- Test the composition at delivery resolution and at a reduced review size.

## 4. Scene architecture

A **scene** is one coherent narrative idea. A **shot** is one visual state within that scene. A scene may contain several shots or reveal states without changing its underlying idea.

Scenes are described using editorial archetypes. Archetypes express purpose and behaviour; they do not prescribe SVG, HTML, video or any other rendering technique.

### 4.1 Narrator

**Purpose:** establish human presence, frame an episode, bridge into personal experience, or close a reflection.

**Use when:** the voice, accountability or personal origin of the argument matters more than a diagram.

**Typical duration:** 6–18 seconds for opening or closing; up to 25 seconds for a reflective bridge if the visual state changes once.

**Visual character:** asymmetrical editorial composition, generous negative space, one short idea, clear separation between the Companion and supporting material.

**Permitted motion:** a restrained entrance or departure, subtle settling movement, or a purposeful transition toward the next evidence surface.

**Transition:** dissolve or cut into the evidence or diagram being introduced. Reuse a word, shape or spatial anchor where it creates continuity.

**Companion:** permitted, but not required. The Companion must not simulate authorship or continuous delivery.

### 4.2 Diagram

**Purpose:** explain system structure, boundaries, dependencies, flows, alternatives or consequences.

**Use when:** spatial relationships make the idea clearer than prose.

**Typical duration:** 15–45 seconds, with a meaningful reveal or emphasis beat approximately every 6–12 seconds.

**Visual character:** few shapes, explicit labels, consistent semantic colour, stable geometry, visible direction and boundaries.

**Permitted motion:** progressive node and edge reveals, state changes, local emphasis, or transformation between two directly related structures.

**Transition:** preserve shared elements into the next related diagram; otherwise cut after the conclusion has had time to register.

**Companion:** absent. The diagram is the teaching surface.

### 4.3 Whiteboard

**Purpose:** make reasoning feel constructed in the moment, especially when moving from an initial condition through trade-offs to a proposed state.

**Use when:** sequence, exploration or qualification matters more than visual finish.

**Typical duration:** 20–60 seconds, broken into explicit construction stages.

**Visual character:** restrained marks, imperfect but legible placement, visible causal sequence, limited written phrases.

**Permitted motion:** drawing, connecting, grouping, revising and highlighting. The viewer must be able to follow each addition.

**Transition:** finish on a simplified conclusion, then cut or transform into evidence that tests it.

**Companion:** normally absent; a brief hand-off into or out of the whiteboard is acceptable.

### 4.4 Repository

**Purpose:** ground a claim in the actual journal, codebase, configuration or architectural record.

**Use when:** provenance, implementation reality or the distinction between source and interpretation matters.

**Typical duration:** 8–25 seconds per evidence target.

**Visual character:** authentic interface, legible crop, one highlighted region, enough surrounding context to establish location.

**Permitted motion:** a direct navigation, short controlled scroll, cursor or highlight movement, or a slow crop change between adjacent evidence. Avoid ornamental terminal activity.

**Transition:** move from the source detail to its diagrammatic interpretation, or return from an interpretation to the evidence that supports it.

**Companion:** absent; the source owns the frame.

### 4.5 Evidence

**Purpose:** inspect documents, decisions, metrics, code, traces or competing sources and show what can and cannot be concluded.

**Use when:** the argument depends on observable facts, corroboration, contradiction or incompleteness.

**Typical duration:** 10–35 seconds, depending on reading load.

**Visual character:** source identity, selective annotation, clear distinction between observation and interpretation, restrained use of multiple panes.

**Permitted motion:** reveal one source at a time, connect corroborating facts, mark disagreement, and gather evidence into a provisional conclusion.

**Transition:** evidence should lead into a relationship, judgement or unresolved question rather than disappear without consequence.

**Companion:** absent.

### 4.6 Reflection

**Purpose:** give the viewer room to absorb a conclusion, preserve uncertainty or change argumentative direction.

**Use when:** the narration becomes personal, evaluative or explicitly tentative.

**Typical duration:** 5–15 seconds. Longer reflection requires a second visual beat.

**Visual character:** reduced information, one question or conclusion, quiet composition, deliberate negative space.

**Permitted motion:** a gentle de-emphasis of prior material, a single emphasis change, or no motion at all when stillness has meaning.

**Transition:** use a clean cut, a short dissolve, or a shared motif that carries the unresolved idea forward.

**Companion:** permitted when human presence adds accountability or warmth; otherwise omit it.

## 5. Shot progression

Visual progression follows the growth of understanding, not the passage of time.

The default explanatory sequence is:

```text
Orient
  -> introduce the object or question
  -> reveal the first relationship
  -> add evidence, tension or consequence
  -> emphasise the conclusion or uncertainty
  -> hold briefly
  -> transition
```

Not every scene needs every step, but long scenes must contain more than an introduction and a hold.

### Progression rules

- Start with only the information needed for the current sentence.
- Add elements shortly before or as the narration makes them relevant.
- Keep earlier elements visible when the viewer needs them to understand a new relationship.
- De-emphasise information that remains context but is no longer the focus.
- Use a highlight to state the conclusion only after its supporting structure is visible.
- Allow 1–3 seconds for a completed diagram or important question to settle before leaving it.
- Split a scene only when the narrative idea changes. Add a shot or reveal state when only the visual focus changes.

### Progression budget

Use these as review heuristics rather than mechanical timing rules:

- under 10 seconds: one visual state is usually sufficient;
- 10–20 seconds: one state plus an emphasis or small reveal;
- 20–35 seconds: two or three meaningful states;
- over 35 seconds: at least three meaningful states, or a documented reason for deliberate stillness.

A meaningful state changes what the viewer can understand. A pulse, drift or decorative zoom does not count.

## 6. Typography

Typography should make the argument readable without turning the video into a reading exercise.

### Hierarchy

- **Opening identity:** episode title and, if needed, one framing statement.
- **Scene heading:** optional; use only when it orients, asks the focal question or names the concept being built.
- **Diagram label:** short noun or verb phrase.
- **Evidence text:** authentic excerpt at a readable crop, with selective emphasis.
- **Annotation:** concise interpretation, visually distinct from the source.
- **Provenance:** smallest tier, still legible in the delivery format.

Avoid displaying a heading, subheading and support sentence by default. Each tier must earn its place.

### Box and node layout

- Vertically centre labels within fixed-height boxes using measured rendered line height, not a manually chosen baseline.
- Calculate the complete multiline block height before positioning it.
- Apply equal optical padding above and below and consistent inline padding.
- Use a minimum internal padding of roughly one text line vertically and 0.75–1.0 text lines horizontally for primary nodes.
- Keep related nodes consistent in size when their semantic weight is equal.
- Fail layout validation when text overflows; do not silently clip or scale below the approved minimum.

Vertical alignment and text fitting should become shared layout capabilities before the renderer is generalised. Episode-specific baseline offsets are not an acceptable platform solution.

### Readability review

- Inspect real rendered output rather than SVG or layout metadata alone.
- Verify the smallest primary text at reduced playback size.
- Confirm contrast after video encoding.
- Check that captions and platform controls do not obscure essential text.
- Treat recurring overflow, baseline or density problems as platform issues rather than repairing every scene independently.

## 7. Colour

Colour communicates meaning, state and attention.

- Use the neutral paper and ink palette as the default field.
- Assign accent colours semantically within an episode: for example, evidence, risk, change or uncertainty.
- Preserve the same meaning for a colour across related scenes.
- Use saturation sparingly; the strongest accent identifies the current focus or important exception.
- Do not rely on colour alone. Pair it with labels, shape, line style or position.
- Avoid adding colours merely to distinguish every node.
- Ensure contrast survives compression and common forms of colour-vision deficiency.

### Diagram sources

Reusable architectural diagrams are authored in D2 and rendered to SVG according to [`production/diagrams/README.md`](../../production/diagrams/README.md). The shared D2 classes apply this grammar's restrained palette, hierarchy and legibility rules without preventing local overrides.

The authored diagram defines concepts and relationships. Narration-aligned reveal, emphasis, dimming and camera focus remain presentation choreography owned by the storyboard and scene timeline. A presentation need must not create a competing semantic source.

## 8. Motion

Motion communicates a change in understanding. It may reveal sequence, causality, connection, accumulation, divergence, comparison or focus.

### Appropriate motion

- building a diagram in narrated order;
- drawing a connection when its relationship is explained;
- gathering evidence into a qualified synthesis;
- showing two states diverge over time;
- transforming shared elements between related views;
- shifting emphasis from context to conclusion;
- gently entering or dismissing the Companion.

### Inappropriate motion

- continuous zoom, pan or drift without editorial meaning;
- repeated entrances for elements that could remain stable;
- decorative wipes, spins, bounces or parallax;
- animating every label independently;
- motion behind text that the viewer must read;
- motion that implies autonomous action, certainty or causality not supported by the source.

Motion must be understandable at normal speed, and essential meaning must remain available through narration, captions and the settled frame.

## 9. Transitions and sections

A transition describes the relationship between adjacent ideas. It is not punctuation automatically inserted at a Markdown heading.

Prefer:

- **cut** when the new visual is a clear next thought;
- **match cut or transformation** when the same concept changes form;
- **short dissolve** when entering or leaving reflection, uncertainty or a change in time;
- **recomposition** when existing objects become a new relationship;
- **evidence hand-off** when moving between source material and its interpretation.

Avoid decorative transition families and long transitions that delay the argument.

### Visible section titles

Keep:

- the opening episode identity;
- the closing series identity and provenance;
- an occasional act title when the viewer would otherwise lose the argument's position;
- an exceptional focal question where a pause is editorially meaningful.

Usually remove internal journal section cards. Express those boundaries through a change of archetype, an evidence-to-diagram hand-off, a completed visual state, a brief reflective beat or a change in spatial structure.

The scene list may retain source-section metadata for traceability even when no section title is visible.

## 10. Pacing and editorial rhythm

Articulate's rhythm should alternate modes of attention rather than repeat layouts:

```text
Orient -> inspect -> construct -> conclude -> reflect -> re-orient
```

This does not require rapid cutting. It requires a visible relationship between narration and visual state.

- Let evidence stay long enough to be recognised and read.
- Let diagram construction follow the narration closely enough to feel causal.
- Follow dense explanation with a simpler composition or short hold.
- Avoid more than two consecutive scenes with the same archetype and geometry unless they form one deliberate comparison.
- Use silence and stillness intentionally; document why a hold is meaningful when it exceeds the progression budget.
- Review the complete episode in continuous playback. Contact sheets reveal repetition, but only playback reveals whether delivery and visual beats agree.

## 11. Companion usage

The Companion is a visual participant in the production identity, not the author, narrator or default presenter.

Use the Companion when human-shaped presence adds something diagrams cannot:

- welcome and orientation;
- a personal origin or reflective bridge;
- acknowledgement of uncertainty or responsibility;
- closing identity and disclosure.

Do not use the Companion:

- as permanent picture-in-picture furniture;
- beside a diagram merely to fill space;
- during repository or evidence inspection;
- to perform generic gestures for every transition;
- in a way that implies Russell's likeness, authorship or autonomous judgement.

Companion appearances should normally be separated by substantial diagram or evidence sequences. Its screen-time percentage is not a target; editorial necessity is the test. Russell's recorded voice remains the authoritative human performance, and AI-generated presenter disclosure must remain clear.

## 12. Expressing editorial intent

Future storyboards should describe the desired change in viewer understanding before they describe rendering behaviour.

An optional conceptual vocabulary is:

```yaml
scene:
  archetype: Diagram
  intent: Explain
  question: How does fragmented knowledge increase uncertainty?
  rhythm: Calm
  reveal: Progressive
  emphasis:
    - Evidence sources
    - Missing relationships
    - Architectural consequence
  conclusion: The architect must reconstruct the whole from partial views.
  companion: None
  source_references:
    - docs/episodes/0001-why-articulate-exists.md#the-limits-of-todays-tools
```

Useful intent values include `Orient`, `Explain`, `Inspect`, `Compare`, `Question`, `Reflect` and `Conclude`. Useful reveal values include `Immediate`, `Progressive`, `Accumulative`, `Transformative` and `Deliberate stillness`.

This vocabulary is guidance, not a schema migration. Add fields to the operational scene-list format only after at least two episodes demonstrate a repeated need and validation or tooling would benefit. Until then, record intent in storyboard editorial notes.

## 13. Runtime capability implications

The grammar identifies capabilities that a future shared renderer should support without prescribing its implementation:

1. multiple narration-aligned shot or reveal states within one scene;
2. stable element identity across states for purposeful transformations;
3. measured text layout with vertical alignment, padding, minimum sizes and overflow failure;
4. semantic emphasis and de-emphasis;
5. caption-safe layout validation;
6. transition intent that is explicit and reviewable;
7. deterministic rendering of approved editorial cues;
8. review artefacts that expose both composition repetition and temporal progression.

Do not build a general animation framework in anticipation. Introduce the smallest reusable capability when an approved storyboard needs it, then document the boundary and test deterministic behaviour.

## 14. Episode 0001 Rough Cut 01 assessment

Rough Cut 01 succeeds as pipeline evidence. It covers the complete narration, uses deterministic authored compositions, preserves source fidelity, avoids placeholders and limits Companion presence to three editorially justified moments.

Against this grammar, its main issue is that **19 scenes are also 19 static shots**. Most compositions arrive complete and remain unchanged until the next cut. Ten scene transitions are described as section cuts in the storyboard, so the source document's structure is more visible than the argument's visual development.

### What already conforms

- The tone, palette and transitions are restrained.
- Repository material appears as evidence rather than decoration in S002.
- The Companion is sparse and appropriately concentrated in S001, S013 and S019.
- Diagrams generally preserve the episode's claims and uncertainty.
- There is no excessive camera movement or decorative animation.

### Recurring slide-deck patterns

- A repeated headline, support line and card/diagram composition dominates the contact sheet.
- Grid layouts recur in S003, S004, S006, S008, S010 and S017 with limited change in visual rhythm.
- Completed diagrams appear at scene entry rather than developing with the narration.
- S005 (42.844s), S007 (36.382s), S010 (45.030s) and S015 (39.574s) exceed the progression budget without internal visual states.
- S010 is the clearest text-density problem: five consequences carry equal weight for 45 seconds.
- S014 presents the central question as a large completed card; it needs repository or journal evidence nearby to ground the vision.
- The S012–S013 hard cut changes mode but does not visually carry the idea of human responsibility into the personal origin story.

### Recommended first conformance pass

Do not change the narration boundaries merely to create more scenes.

1. Give S005 a Whiteboard progression: current state, constraints and trade-offs, then future state.
2. Make S007's architecture and understanding visibly diverge over time.
3. Recompose S008's tool cards into S009's partial-projection structure so the transition explains the relationship.
4. Build S010 consequence by consequence, group them, then emphasise uncertainty as the conclusion.
5. Move from S012's human-context element into the S013 Companion composition using a shared visual anchor.
6. Pair S014's question with a legible repository or journal view rather than adding another abstract card.
7. Reveal the S015 reasoning order in sequence and preserve the completed chain for the conclusion.
8. Replace most visible internal section boundaries with these progressions and hand-offs; retain the opening and closing identities.

These are storyboard changes first. Renderer work should follow only where a repeated approved treatment requires a reusable capability.

## 15. Review checklist

Before approving a storyboard or rough cut, ask:

- What should the viewer understand at the beginning and end of each scene?
- Which archetype best serves that change?
- Does every shot have one dominant focus?
- Does a long scene contain meaningful visual progression?
- Is evidence distinguishable from interpretation?
- Is on-screen text shorter than the narration it supports?
- Are node labels vertically centred, padded and readable at delivery size?
- Does colour retain a consistent semantic meaning?
- Does every motion or transition communicate a relationship?
- Could an internal section card become a natural visual hand-off?
- Does each Companion appearance add human value unavailable from the primary teaching surface?
- Does uncertainty remain visible?
- Has the episode been reviewed in continuous playback as well as by contact sheet?

If the answer to a question is unclear, resolve the editorial intent before adding runtime behaviour.
