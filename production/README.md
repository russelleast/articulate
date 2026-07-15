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
|-- runtime/        # Storage-agnostic production runtime capabilities
|-- cache/          # Ignored local copies fetched by asset providers
|-- workflow/       # Human review gates and publishing workflow
|-- experiments/    # Small vertical slices that expose production constraints
`-- episodes/       # Episode-specific production working areas
```

## Boundaries

This directory describes how production should work. It does not contain generated final media by default. Large generated assets, recordings and exports should be stored according to the asset register for each episode, with enough metadata to reproduce, review or replace them later.

Future automation should treat these files as production intent, not as an implementation schema.

## Production Assets

Production inputs are addressed by logical IDs such as `episode-0001-narration-v1` and `companion-v1-neutral`. The registry at `production/assets/registry.yaml` records each asset's type, episode, review status, checksum, provider and provider-specific location. Renderer configuration contains IDs, not storage paths.

`AssetManager` is the runtime entry point. It uses `AssetResolver` to select the provider declared by the registry. The initial `LocalAssetProvider` implements `resolve()`, `exists()`, `fetch()` and `metadata()` for files already available in the working copy. Storage locations are therefore confined to the provider boundary.

Canonical production assets are the approved versions identified by the registry; their physical storage is not part of their identity. `production/cache/` is disposable and ignored by Git. Large binary media should live in an asset provider rather than become canonical Git content. Future remote providers may fetch into this cache, but synchronisation, networking and authentication are intentionally outside the current design.

Use `make assets-list` to inspect registered assets and `make assets-validate` to validate the registry and current local availability.
