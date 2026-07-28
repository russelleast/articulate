import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { alignSections, findPhrase } from "./transcript-alignment.mjs";

export const SCENE_ARCHETYPES = Object.freeze([
  "Narrator", "Diagram", "Whiteboard", "Repository", "Evidence", "Reflection"
]);
export const SCENE_AUTHORITIES = Object.freeze(["prescribed", "guided", "open"]);
export const TIMELINE_ACTIONS = Object.freeze([
  "reveal", "hide", "emphasise", "deemphasise", "connect", "disconnect", "replace", "transition"
]);

export function slugifySection(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function extractMarkdownSections(markdown, { includePreamble = false } = {}) {
  const lines = String(markdown).split(/\r?\n/);
  const headings = [];
  for (let index = 0; index < lines.length; index++) {
    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(lines[index]);
    if (!match) continue;
    const explicit = lines.slice(index + 1, index + 4)
      .map((line) => /<!--\s*section-id:\s*([a-z0-9-]+)\s*-->/.exec(line)?.[1])
      .find(Boolean);
    const title = match[2].replace(/\s+#+$/, "");
    headings.push({
      id: explicit ?? slugifySection(title.replace(/^Looking Ahead.*$/i, "Looking Ahead")),
      title,
      level: match[1].length,
      line: index + 1
    });
  }
  if (!includePreamble) return headings;
  return [{ id: "opening", title: "Opening", level: 1, line: 1, inferred: true }, ...headings];
}

export function buildSourceAlignment({
  transcript,
  specifications,
  writtenSections,
  narrativeSections,
  audioDurationSeconds
}) {
  const timed = alignSections(transcript, specifications, audioDurationSeconds);
  const written = new Map(writtenSections.map((section) => [section.id, section]));
  const narrative = new Map(narrativeSections.map((section) => [section.id, section]));
  const warnings = [];
  const sections = timed.sections.map((section) => {
    const specification = specifications.find((candidate) => candidate.id === section.id);
    const writtenId = specification.writtenSection ?? section.id;
    const narrativeId = specification.narrativeSection ?? section.id;
    if (!written.has(writtenId)) warnings.push(`${section.id}: written section '${writtenId}' was not detected`);
    if (!narrative.has(narrativeId)) warnings.push(`${section.id}: narrative section '${narrativeId}' was not detected`);
    if (section.confidence < 0.75) warnings.push(`${section.id}: audio anchor confidence ${section.confidence}`);
    return {
      id: section.id,
      title: specification.title,
      narrativeSegments: section.narrativeSegments,
      start: section.start,
      end: section.end,
      anchor: section.anchor,
      matchedText: section.matchedText,
      written: {
        section: writtenId,
        heading: written.get(writtenId)?.title ?? specification.writtenHeading ?? null
      },
      narrative: {
        section: narrativeId,
        heading: narrative.get(narrativeId)?.title ?? specification.title,
        segments: section.narrativeSegments
      },
      audio: {
        start: section.start,
        end: section.end,
        anchor: section.anchor,
        matchedText: section.matchedText
      },
      confidence: section.confidence,
      warnings: warnings.filter((warning) => warning.startsWith(`${section.id}:`))
    };
  });
  return {
    version: 2,
    authority: {
      semantic: "written-episode",
      delivery: "verbal-narrative",
      timing: "recorded-audio"
    },
    coverage: {
      written: coverage(writtenSections, sections.map((section) => section.written.section)),
      narrative: coverage(narrativeSections, sections.map((section) => section.narrative.section))
    },
    warnings,
    sections
  };
}

export function validateScenePlan(plan, {
  repoRoot = process.cwd(),
  alignment = null,
  requireRenderedDiagrams = false
} = {}) {
  const errors = [];
  const warnings = [];
  const manualReview = [];
  if (plan.version !== 2) errors.push("scene plan must use version 2");
  if (!plan.episode?.writtenSource || !plan.episode?.narrativeSource || !plan.episode?.audio) {
    errors.push("episode writtenSource, narrativeSource and audio are required");
  }
  if (!["draft", "approved", "changes-requested"].includes(plan.review?.status)) {
    errors.push("review.status must be draft, approved or changes-requested");
  }
  const sections = new Set((plan.sections ?? []).map((section) => section.id));
  duplicateValues((plan.sections ?? []).map((section) => section.id), "section ID", errors);
  duplicateValues((plan.scenes ?? []).map((scene) => scene.id), "scene ID", errors);
  const represented = new Set();
  const diagramIds = [];
  for (const scene of plan.scenes ?? []) {
    if (!String(scene.headline ?? "").trim()) errors.push(`${scene.id}: headline is required`);
    if (!sections.has(scene.section)) errors.push(`${scene.id}: unknown source section '${scene.section}'`);
    else represented.add(scene.section);
    const archetype = scene.archetype ?? legacyArchetype(scene.kind);
    if (!SCENE_ARCHETYPES.includes(archetype)) errors.push(`${scene.id}: unsupported archetype '${archetype}'`);
    const authority = scene.authority ?? plan.defaults?.authority ?? "guided";
    if (!SCENE_AUTHORITIES.includes(authority)) errors.push(`${scene.id}: unsupported authority '${authority}'`);
    const beats = scene.beats ?? scene.cues ?? [];
    const firstHeadlineBeat = beats.find((beat) => beat.target === "headline");
    if (
      plan.defaults?.headlineVisibility === "scene-start"
      && firstHeadlineBeat
      && ["reveal", "type"].includes(firstHeadlineBeat.action ?? "reveal")
    ) {
      errors.push(`${scene.id}: headline must be visible from scene start; use emphasise or remove its beat`);
    }
    for (const beat of beats) {
      const action = beat.action ?? "reveal";
      if (!TIMELINE_ACTIONS.includes(action)) errors.push(`${scene.id}: unsupported action '${action}'`);
      const phrase = beat.alignTo ?? beat.phrase;
      if (!phrase && !Number.isFinite(beat.at)) errors.push(`${scene.id}: beat '${beat.id ?? beat.target}' needs alignTo or at`);
      if (phrase && alignment && plan.__transcript) {
        const section = alignment.sections.find((candidate) => candidate.id === scene.section);
        if (section && !findPhrase(plan.__transcript, phrase, alignmentWindow(section))) {
          warnings.push(`${scene.id}: phrase not found '${phrase}'`);
        }
      }
    }
    for (const label of scene.labels ?? scene.items ?? []) {
      if (wordCount(label) > 7) warnings.push(`${scene.id}: label exceeds seven words '${label}'`);
    }
    if (scene.diagram) {
      diagramIds.push(scene.diagram.id);
      const source = resolve(repoRoot, scene.diagram.source);
      const rendered = resolve(repoRoot, scene.diagram.rendered);
      if (!fs.existsSync(source)) errors.push(`${scene.id}: missing D2 source ${scene.diagram.source}`);
      if (fs.existsSync(source)) {
        const elements = d2ElementIds(fs.readFileSync(source, "utf8"));
        if (scene.diagram.mode === "progressive" && !(scene.diagram.states?.length)) {
          errors.push(`${scene.id}: progressive diagram has no states`);
        }
        duplicateValues((scene.diagram.states ?? []).map((state) => state.id), `${scene.diagram.id} state ID`, errors);
        for (const state of scene.diagram.states ?? []) {
          for (const element of state.visible ?? []) {
            if (!elements.has(element)) errors.push(`${scene.id}: diagram state '${state.id}' references missing D2 element '${element}'`);
          }
        }
        for (const beat of beats.filter((candidate) => candidate.diagramTarget)) {
          if (!elements.has(beat.diagramTarget)) errors.push(`${scene.id}: beat references missing D2 element '${beat.diagramTarget}'`);
        }
      }
      if (requireRenderedDiagrams && !fs.existsSync(rendered)) errors.push(`${scene.id}: missing rendered SVG ${scene.diagram.rendered}`);
      manualReview.push(`${scene.diagram.id}: inspect SVG label routing, density and final-size readability`);
    }
  }
  for (const section of plan.sections ?? []) {
    if (!represented.has(section.id) && !section.omission?.reason) {
      errors.push(`written/narrative section '${section.id}' has no scene representation or omission reason`);
    }
  }
  duplicateValues(diagramIds, "diagram ID", errors);
  if (alignment) {
    for (const warning of alignment.warnings ?? []) warnings.push(warning);
    for (const section of alignment.sections ?? []) {
      if (section.confidence < 0.75) warnings.push(`${section.id}: low-confidence section alignment ${section.confidence}`);
    }
  }
  return { valid: errors.length === 0, errors: unique(errors), warnings: unique(warnings), manualReview: unique(manualReview) };
}

export function compileTimeline(plan, transcript, alignment, { allowDraft = false } = {}) {
  if (plan.review?.status !== "approved" && !allowDraft) {
    throw new Error("Scene plan is not approved. Review it first or pass allowDraft explicitly for a review render.");
  }
  const bySection = new Map(alignment.sections.map((section) => [section.id, section]));
  return {
    version: 2,
    generatedFrom: "production/episodes/0004/scene-plan.yaml",
    authority: {
      semantic: "written-episode",
      visual: "approved-scene-plan",
      timing: "recorded-audio"
    },
    reviewOverride: plan.review.status === "approved" ? null : "draft scene plan explicitly compiled for review",
    scenes: plan.scenes.map((scene) => {
      const section = bySection.get(scene.section);
      if (!section) throw new Error(`${scene.id}: no alignment for section '${scene.section}'`);
      const window = alignmentWindow(section);
      const duration = window.before - window.after;
      const events = (scene.beats ?? scene.cues ?? []).map((beat, index) => {
        const phrase = beat.alignTo ?? beat.phrase;
        const match = phrase ? findPhrase(transcript, phrase, window) : null;
        const at = Number.isFinite(beat.at)
          ? beat.at
          : Math.max(0, Math.min(duration - 0.04, (match?.start ?? window.after + index * 1.2) - window.after));
        return {
          id: beat.id ?? `${scene.id.toLowerCase()}-${beat.action ?? "reveal"}-${beat.target ?? index + 1}`,
          at: round(at),
          action: beat.action ?? "reveal",
          ...(beat.target ? { target: beat.target } : {}),
          ...(beat.from ? { from: beat.from } : {}),
          ...(beat.to ? { to: beat.to } : {}),
          ...(phrase ? { sourcePhrase: phrase } : {}),
          match: phrase ? {
            method: match ? (match.confidence === 1 ? "exact-or-normalised" : "fuzzy") : "section-fallback",
            confidence: round(match?.confidence ?? 0)
          } : { method: "explicit", confidence: 1 }
        };
      });
      for (const [index, connection] of (scene.connections ?? []).entries()) {
        const [from, to] = connection;
        events.push({
          id: `${scene.id.toLowerCase()}-connect-${index + 1}`,
          at: round(Math.max(
            events.find((event) => event.target === from)?.at ?? 0,
            events.find((event) => event.target === to)?.at ?? 0
          )),
          action: "connect",
          from,
          to,
          match: { method: "dependent", confidence: 1 }
        });
      }
      return {
        id: scene.id,
        section: scene.section,
        title: scene.title ?? scene.headline,
        archetype: scene.archetype ?? legacyArchetype(scene.kind),
        start: window.after,
        end: window.before,
        sources: {
          writtenSection: section.written.section,
          narrativeSection: section.narrative.section,
          narrativeSegments: section.narrative.segments
        },
        ...(scene.diagram ? { diagram: scene.diagram } : {}),
        elements: {
          headline: scene.headline,
          support: scene.support,
          labels: scene.labels ?? scene.items ?? []
        },
        transition: scene.transition,
        events
      };
    })
  };
}

export function sourceHashes(repoRoot, plan) {
  return Object.fromEntries([
    ["writtenEpisode", plan.episode.writtenSource],
    ["narrative", plan.episode.narrativeSource],
    ["audio", plan.episode.audio]
  ].map(([name, relative]) => [name, sha256(resolve(repoRoot, relative))]));
}

function alignmentWindow(section) {
  const audio = section.audio ?? section;
  return { after: audio.start, before: audio.end };
}

function coverage(sourceSections, representedIds) {
  const represented = new Set(representedIds);
  const missing = sourceSections.filter((section) => !represented.has(section.id)).map((section) => section.id);
  return { detected: sourceSections.length, represented: sourceSections.length - missing.length, missing };
}

function duplicateValues(values, label, errors) {
  const seen = new Set();
  for (const value of values) {
    if (seen.has(value)) errors.push(`duplicate ${label}: ${value}`);
    seen.add(value);
  }
}

function legacyArchetype(kind) {
  return {
    studio: "Narrator",
    diagram: "Diagram",
    whiteboard: "Whiteboard",
    workspace: "Repository",
    evidence: "Evidence",
    focus: "Reflection"
  }[kind] ?? kind;
}

function resolve(repoRoot, relative) {
  const target = path.resolve(repoRoot, relative);
  const relation = path.relative(path.resolve(repoRoot), target);
  if (relation.startsWith("..") || path.isAbsolute(relation)) throw new Error(`Path escapes repository: ${relative}`);
  return target;
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function wordCount(value) {
  return String(value).trim().split(/\s+/).filter(Boolean).length;
}

function d2ElementIds(source) {
  const ids = new Set();
  for (const line of String(source).split(/\r?\n/)) {
    const match = /^\s*([a-zA-Z_][a-zA-Z0-9_-]*):/.exec(line);
    if (match && !["direction", "grid-columns", "class", "classes", "style", "shape"].includes(match[1])) ids.add(match[1]);
  }
  return ids;
}

function unique(values) {
  return [...new Set(values)];
}

function round(value) {
  return Math.round(value * 1000) / 1000;
}
