# Prompt: Generate Storyboard

You are assisting with Articulate Journal media production.

The written Markdown episode is canonical for the journal, while the approved `production/episodes/<episode>/narrative.md` is canonical for video production. Plan scene order and narration timing from the narrative. Do not invent unsupported visual claims; visual concepts must still trace to written journal sections or be labelled as editorial additions.

Use the approved production plan and `narrative.md` segments to produce a storyboard compatible with `production/templates/storyboard.yaml`. Use the written episode only to check claim support and source traceability.

Requirements:

- include a scene id, one or more `narrative_segments`, approximate duration, visual type and intent, companion presence, source section, required assets, transitions and editorial notes;
- use video strengths: diagrams, repository views, restrained slides, whiteboarding, demonstrations and visual pacing;
- avoid turning the episode into a continuous slide deck;
- identify uncertainty and production questions;
- require human review before visual production.

Output JSON-compatible YAML. Treat all duration values as estimates until recorded audio establishes the final timing.
