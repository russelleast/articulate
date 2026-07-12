# Production

The production system is an experimental AI-assisted publishing workflow for the Articulate Journal.

Its purpose is to help turn canonical written episodes into derived media: narration, video, slides, diagrams, demonstrations, social extracts and publication metadata. The written Markdown episode remains the source of record. Every other format is a representation of that source, shaped for a different medium and reviewed by a human before publication.

This area is deliberately technology-neutral. It defines the production architecture, content model, reusable templates, prompts, review gates and Episode working areas. It does not select avatar vendors, video tools, voice services or automation frameworks.

## Principles

- The written episode is canonical.
- Derived media must preserve the author's meaning.
- Each medium should use its strengths rather than repeat the episode verbatim.
- Generated artefacts must remain traceable to source sections.
- Human review is mandatory before publication.
- The companion is an AI-created visual presenter, not a deceptive digital clone.
- Production should be repeatable across future episodes.

## Structure

```text
production/
|-- architecture/   # Production architecture and conceptual content model
|-- branding/       # Visual and motion language for derived media
|-- companion/      # Role and design direction for the Articulate Companion
|-- templates/      # Reusable episode production templates
|-- prompts/        # AI prompt templates for production assistance
|-- workflow/       # Human review gates and publishing workflow
`-- episodes/       # Episode-specific production working areas
```

## Boundaries

This directory describes how production should work. It does not contain generated final media by default. Large generated assets, recordings and exports should be stored according to the asset register for each episode, with enough metadata to reproduce, review or replace them later.

Future automation should treat these files as production intent, not as an implementation schema.
