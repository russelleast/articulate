# Articulate Media Style Guide

This guide is the shared visual contract between an editable scene plan, authored D2 diagrams and the deterministic renderer. It constrains visual interpretation before exact timing is generated.

## Frame and text safety

The delivery frame is 1920×1080. Keep titles inside `x=120–1800, y=72–210`, primary diagram content inside `x=120–1800, y=220–900`, and subtitles inside `x=180–1740, y=910–1030`. The renderer owns subtitles; scene composition must not repeat narration as a second subtitle layer.

Body and diagram labels must remain at least 32 px at final resolution; titles at least 48 px. Use at most one title, one short supporting statement, and seven simultaneous primary labels. Headings should be concise. Node labels should normally be two to five words, wrap only at semantic boundaries and never overlap nodes or edges. Preserve terminology from the written episode.

## Archetypes

| Archetype | Purpose and use | Layout and companion | Limits, actions and transitions |
|---|---|---|---|
| Narrator | Open, frame, bridge and conclude. Not for dense explanation. | Companion is the anchor; restrained supporting field. | One heading and one short statement. Reveal/emphasise only. Fade for episode bounds; cut at ordinary transitions. |
| Diagram | Explain relationships, flows, boundaries, comparison and causality. | Diagram dominates; companion absent or secondary. | One conceptual message, normally 5–7 primary nodes. Progressive reveal/connect preferred. Transition at a conceptual boundary. |
| Whiteboard | Develop an idea, comparison or principle step by step. Not a decorative Diagram substitute. | Constructive canvas; companion normally absent. | Reveal, connect, emphasise and replace in spoken order. Avoid simultaneous unrelated reveals. |
| Repository | Show code, DCL, files, configuration or concrete implementation evidence. | Repository surface dominates; companion optional and secondary. | Short excerpts only. Reveal or emphasise the exact evidence being discussed. |
| Evidence | Show measurements, logs, traces, evaluation or external evidence. | Evidence and provenance remain visible; interpretation is visually distinct. | Do not imply a measurement says more than it does. Prefer cut/replace between comparable states. |
| Reflection | Hold a question, trade-off, learning or uncertainty. | Visually restrained, with optional companion. | One question or conclusion. Emphasise sparingly; allow breathing room before transition. |

All archetypes require sufficient contrast, non-colour-only distinctions, readable final-size labels, subtitle clearance and time to understand the primary visual without pausing.

## Authority

- `prescribed`: reproduce the stated visual concept closely. Use for central diagrams, named principles, critical comparisons and conclusions.
- `guided`: preserve purpose and required concepts while allowing style-guide-conformant elaboration. This is the default for architectural sections.
- `open`: select an established archetype for short openings, transitions and reflections.

## Motion and timing

`reveal` introduces a concept; `emphasise` changes the interpretation of something visible; `connect` introduces a relationship; `replace` compares states in the same conceptual position; `transition` marks a conceptual boundary. Existing `hide`, `deemphasise` and `disconnect` remain supported.

Scene-plan beats align to spoken phrases. The timeline compiler tries exact/normalised matching, then fuzzy matching, then a section-relative fallback that is reported for review. Important content should appear just before or as its phrase is spoken. Prefer pauses for scene changes and avoid major transitions inside dense sentences.

## D2 semantic grammar

Import `production/diagrams/styles/articulate.d2`. Its classes intentionally distinguish:

- `agent`, `capability`, `service`, `workflow`, `data`, `external` and `human` runtime or actor concepts;
- `policy` and `constraint` governing concepts;
- `quality`, `principle` and `decision` architectural intent;
- `event`, `boundary` and `router` interaction structure;
- `evidence`, `node` and `emphasis` general presentation roles.

Prefer semantic shape and stroke differences to many colours. Use the controlled edge vocabulary: `invokes`, `routes to`, `provides`, `depends on`, `produces`, `consumes`, `constrains`, `observes`, `evaluates`, `stores`, `retrieves`, `supervises`, and `transitions to`. Active calls and flows use solid directed edges; policy/constraint relationships use dashed edges; observation and evaluation use a labelled dashed edge; emphasis may increase line weight. Always label a relationship where direction alone is ambiguous.

A standard video diagram should communicate one message with about five to seven primary nodes and no more than two hierarchy levels. Split larger ideas into progressive states. Stable D2 node/edge IDs are the reveal contract. Store state metadata beside the source when several states are needed; deterministic SVG snapshots are preferred over a bespoke animation engine.

Automated validation can confirm sources, IDs, references and some label limits. It cannot guarantee good routing or readability. Every rendered SVG requires final-size visual inspection.
