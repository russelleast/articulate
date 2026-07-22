# Production

The production system is an experimental AI-assisted publishing workflow for the Articulate Journal.

Its purpose is to help adapt canonical written episodes into derived media: spoken narratives, video, slides, diagrams, demonstrations, social extracts and publication metadata. The written Markdown episode remains the journal's source of record. Video production uses a separately approved spoken adaptation at `production/episodes/<episode>/narrative.md`; it does not read the article as if article and narration were interchangeable.

This area is deliberately technology-neutral. It defines the production architecture, content model, reusable templates, prompts, review gates and Episode working areas. It does not select avatar vendors, video tools, voice services or automation frameworks.

## Principles

- The written episode is canonical for the journal.
- `narrative.md` is canonical for spoken delivery, scene planning, recordings, subtitles, and video production.
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
|-- diagrams/       # Canonical D2 diagram sources and shared styling
|-- templates/      # Reusable episode production templates
|-- prompts/        # AI prompt templates for production assistance
|-- runtime/        # Storage-agnostic production runtime capabilities
|-- cache/          # Ignored local copies fetched by asset providers
|-- workflow/       # Human review gates and publishing workflow
|-- experiments/    # Small vertical slices that expose production constraints
`-- episodes/       # Episode-specific production working areas
```

## Episode Representations

```text
Episode
|-- Written representation  -> docs/episodes/<episode>.md
|-- Spoken representation   -> production/episodes/<episode>/narrative.md
`-- Published media         -> thumbnail, YouTube URL, and generated production artefacts
```

The written article is adapted manually into the spoken narrative. Text is canonical for the journal; narrative is canonical for video production; video is an adapted representation of the episode, not a recording of the article.

New productions fail validation when `narrative.md` is missing. Episodes 0000 and 0001 predate the convention, so their existing render configurations declare an explicit `legacy` narrative source. They should gain `narrative.md` during a deliberate editorial migration; the runtime never silently falls back to `docs/episodes`.

## Boundaries

This directory describes how production should work. It does not contain generated final media by default. Large generated assets, recordings and exports should be stored according to the asset register for each episode, with enough metadata to reproduce, review or replace them later.

Future automation should treat these files as production intent, not as an implementation schema.

## Production Assets

Production inputs are addressed by logical IDs such as `episode-0001-narration-v1` and `companion-v1-neutral`. The registry at `production/assets/registry.yaml` records each asset's type, episode, review status, checksum, provider and provider-specific location. Renderer configuration contains IDs, not storage paths.

`AssetManager` is the runtime entry point. It uses `AssetResolver` to select the provider declared by the registry. The initial `LocalAssetProvider` implements `resolve()`, `exists()`, `fetch()` and `metadata()` for files already available in the working copy. Storage locations are therefore confined to the provider boundary.

Canonical production assets are the approved versions identified by the registry; their physical storage is not part of their identity. `production/cache/` is disposable and ignored by Git. Large binary media should live in an asset provider rather than become canonical Git content. Future remote providers may fetch into this cache, but synchronisation, networking and authentication are intentionally outside the current design.

Use `make assets-list` to inspect registered assets and `make assets-validate` to validate the registry and current local availability.

## Diagrams

Reusable architectural diagrams use D2 as their authored source and SVG as their shared website/video output. Sources, rendering commands, Markdown references and static storyboard integration are documented in [`production/diagrams/README.md`](diagrams/README.md). The central asset registry binds each diagram ID to both paths.
