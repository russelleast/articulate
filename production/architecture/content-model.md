# Production Content Model

This content model defines the concepts used by the Articulate media production system. It is not an implementation schema. It is a shared vocabulary for future automation, review and production planning.

## Episode

Purpose: the canonical written source for an Articulate journal entry.

Required metadata: episode id, title, summary, publication status, source path, sequence, topics and update date.

Relationship to canonical episode: it is the canonical episode.

Origin: authored.

Evolution: expected to evolve through normal editorial updates, with Git preserving history.

## Production Plan

Purpose: defines how an episode will be adapted into derived media.

Required metadata: episode id, source path, audience, intended outcome, content type, target duration, narrative outline, required media, risks, dependencies, review gates and publication targets.

Relationship to canonical episode: interprets the source episode without replacing it.

Origin: authored with possible AI assistance.

Evolution: expected to evolve until approved for production.

## Narration Segment

Purpose: represents a spoken unit of the narration.

Required metadata: segment id, corresponding scene, source references, narration text, pauses, emphasis notes, pronunciation notes, on-screen text and retake notes.

Relationship to canonical episode: adapts source material for listening and must preserve meaning.

Origin: authored or AI-drafted, then recorded by a human.

Evolution: evolves through scripting, recording and edit alignment.

## Scene

Purpose: describes one visual and editorial unit in the video.

Required metadata: scene id, title, duration estimate, narration reference, visual type, companion mode, asset references, source references, transition, status and review state.

Relationship to canonical episode: visualises one or more source sections or labelled editorial additions.

Origin: assembled from authored intent and generated or recorded assets.

Evolution: expected to evolve during storyboard and edit.

## Visual Asset

Purpose: records a reusable visual, audio or supporting production element.

Required metadata: asset id, asset type, source, generation method, ownership or licence, episode section, scene usage, version, status and review notes.

Relationship to canonical episode: supports the interpretation of source material or publication context.

Origin: authored, generated, recorded, captured or assembled.

Evolution: may be replaced or versioned as production improves.

## Source Reference

Purpose: links a production choice back to its evidential basis.

Required metadata: source path, heading or section, optional excerpt, claim summary, reference type and confidence.

Relationship to canonical episode: points to the canonical material or identifies an editorial addition.

Origin: authored or extracted.

Evolution: should remain stable once approved unless the canonical episode changes.

## Companion Appearance

Purpose: defines when and how the Articulate Companion appears.

Required metadata: scene id, role, mode, disclosure requirement, visual treatment, motion notes, emotional range and source references.

Relationship to canonical episode: guides attention around source-derived material rather than adding independent authority.

Origin: generated from approved design direction and storyboard intent.

Evolution: expected to evolve across episodes while maintaining continuity.

## Slide

Purpose: provides structured visual explanation where a concise visual frame helps the viewer.

Required metadata: slide id, title, purpose, source references, on-screen text, diagram references, accessibility notes and review state.

Relationship to canonical episode: compresses or organises source concepts.

Origin: authored or assembled, with possible generated layout assistance.

Evolution: evolves during technical and editorial review.

## Diagram

Purpose: explains relationships, flow, structure or change over time.

Required metadata: diagram id, title, concept, source references, notation, assumptions, accessibility notes and review state.

Relationship to canonical episode: makes an architectural idea visible without extending the claim beyond the source.

Origin: authored or generated from source-grounded instructions.

Evolution: may evolve as the architecture or explanation changes.

## Code Demonstration

Purpose: shows repository, journal, website or runtime evidence that supports the episode.

Required metadata: demonstration id, purpose, repository path, commands or views, source references, expected result, recording notes and review state.

Relationship to canonical episode: demonstrates evidence or context mentioned by the episode.

Origin: recorded or captured.

Evolution: may change as the repository evolves.

## Publication Target

Purpose: describes a destination for released media.

Required metadata: target id, platform, required formats, title, description, links, captions, transcript, thumbnail, disclosure text, publication status and review state.

Relationship to canonical episode: points viewers back to the canonical source and preserves context.

Origin: authored and assembled.

Evolution: expected to vary by platform and update after publication.

## Review Decision

Purpose: records human approval, rejection or requested changes.

Required metadata: decision id, artefact reviewed, reviewer, date, outcome, notes, required changes and follow-up owner.

Relationship to canonical episode: protects fidelity to the source and publication quality.

Origin: authored by a reviewer.

Evolution: immutable as a decision record, though later decisions may supersede it.
