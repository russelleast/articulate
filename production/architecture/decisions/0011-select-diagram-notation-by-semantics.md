# 0011: Select Diagram Notation by Semantics

Status: accepted

## Context

ADR 0006 established reusable D2 sources and shared SVG assets for written episodes, video frames and production review. Episode 15 introduces governed processes, decisions and feedback loops alongside architectural relationships and capability decomposition. Representing every semantic form in D2 would weaken the distinction between process behaviour and conceptual structure, while a separate publication pipeline would duplicate asset ownership.

## Decision

Diagram notation is selected by the meaning being communicated. D2 remains the source format for architectural relationships, conceptual decomposition and capability models. PlantUML activity diagrams represent governed flows, decisions and feedback loops.

Both source formats use the existing shared diagram directories, logical asset registry, rendering commands and generated SVG locations. The registry records `format`, `source` and generated `location`, while SVG remains the common contract consumed by the website and video `AssetManager`. Official notation CLIs remain explicit external production dependencies and are never installed by normal commands.

This decision supersedes ADR 0006 by generalising its reusable asset model beyond a single notation without changing the shared publication and video boundary.

## Consequences

- Diagram semantics determine notation rather than the publishing destination.
- Written and video episodes reuse one semantic source and one registered SVG asset.
- The renderer validates and renders both `.d2` and `.puml` sources through one command surface.
- Production environments must provide and pin the D2 and PlantUML CLI versions used by registered sources.
- Generated SVGs remain reproducible artefacts and must not be edited directly.
