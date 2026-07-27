import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { conventionalNarrativePath, episodeNumber, resolveEpisodeSources } from "./narrative-source.mjs";

const REQUIRED_DIRECTORIES = ["scenes", "audio", "output"];

export function segmentNarrative(markdown) {
  const body = stripFrontMatter(String(markdown)).replace(/\r\n/g, "\n");
  const blocks = body.split(/\n\s*\n/);
  const segments = [];

  for (const block of blocks) {
    const lines = block.split("\n").map((line) => line.trim());
    if (lines.every((line) => !line) || lines.every((line) => line.startsWith("#"))) continue;
    const text = lines
      .filter((line) => line && !line.startsWith("#") && !line.startsWith("<!--"))
      .join(" ")
      .replace(/^>\s*/, "")
      .trim();
    if (!text) continue;
    segments.push({
      id: `N${String(segments.length + 1).padStart(3, "0")}`,
      text
    });
  }

  return segments;
}

export function parseStoryboard(contents, source = "storyboard.yaml") {
  try {
    return JSON.parse(contents);
  } catch (error) {
    throw new Error(
      `${source} must use the JSON-compatible YAML production schema: ${error.message}`
    );
  }
}

export function validateStoryboard({
  storyboard,
  segments,
  episodeId,
  journalSource,
  narrativeSource,
  audioDurationSeconds
}) {
  const errors = [];
  const warnings = [];
  const expectedEpisodeId = episodeNumber(episodeId);

  if (String(storyboard.episode?.id ?? "") !== expectedEpisodeId) {
    errors.push(`Storyboard episode.id must be "${expectedEpisodeId}"`);
  }
  if (storyboard.episode?.written_source !== journalSource) {
    errors.push(`Storyboard episode.written_source must be "${journalSource}"`);
  }
  if (storyboard.episode?.narrative_source !== narrativeSource) {
    errors.push(`Storyboard episode.narrative_source must be "${narrativeSource}"`);
  }

  const scenes = storyboard.scenes;
  if (!Array.isArray(scenes) || scenes.length === 0) {
    errors.push("Storyboard must contain at least one narrative-aligned scene");
    return { errors, warnings };
  }

  const knownSegments = new Set(segments.map((segment) => segment.id));
  const referencedSegments = new Set();
  const sceneIds = new Set();
  for (const [index, scene] of scenes.entries()) {
    const label = scene.id || `scene ${index + 1}`;
    if (!scene.id) errors.push(`Storyboard scene ${index + 1} must declare id`);
    else if (sceneIds.has(scene.id)) errors.push(`Duplicate storyboard scene id: ${scene.id}`);
    else sceneIds.add(scene.id);

    const references = expandSegmentReferences(scene.narrative_segments ?? [], knownSegments);
    if (references.errors.length) {
      errors.push(...references.errors.map((message) => `${label}: ${message}`));
    }
    if (references.values.length === 0) {
      errors.push(`${label} must reference at least one narrative segment`);
    }
    for (const reference of references.values) referencedSegments.add(reference);
  }

  const unreferenced = segments
    .map((segment) => segment.id)
    .filter((id) => !referencedSegments.has(id));
  if (unreferenced.length) {
    errors.push(`Storyboard does not cover narrative segments: ${unreferenced.join(", ")}`);
  }

  validateTiming(storyboard, scenes, audioDurationSeconds, errors, warnings);
  return { errors, warnings };
}

export function validateProductionEpisode({
  repoRoot,
  episodeId,
  journalSource,
  audioDurationSeconds
}) {
  const number = episodeNumber(episodeId);
  const sources = resolveEpisodeSources({
    repoRoot,
    episode: { id: number, journalSource }
  });
  const episodeDirectory = path.join(repoRoot, "production", "episodes", number);
  const errors = [];
  for (const directory of REQUIRED_DIRECTORIES) {
    if (!fs.statSync(path.join(episodeDirectory, directory), { throwIfNoEntry: false })?.isDirectory()) {
      errors.push(`Missing production directory: production/episodes/${number}/${directory}/`);
    }
  }

  const narrative = fs.readFileSync(sources.narrativePath, "utf8");
  const segments = segmentNarrative(narrative);
  if (!segments.length) errors.push(`Spoken narrative contains no recordable segments: ${sources.narrativeSource}`);

  const storyboardSource = `production/episodes/${number}/storyboard.yaml`;
  const storyboardPath = path.join(repoRoot, storyboardSource);
  if (!fs.existsSync(storyboardPath)) {
    errors.push(`Missing narrative-aligned storyboard: ${storyboardSource}`);
    return result();
  }

  let storyboard;
  try {
    storyboard = parseStoryboard(fs.readFileSync(storyboardPath, "utf8"), storyboardSource);
  } catch (error) {
    errors.push(error.message);
    return result();
  }

  const storyboardValidation = validateStoryboard({
    storyboard,
    segments,
    episodeId: number,
    journalSource,
    narrativeSource: conventionalNarrativePath(number),
    audioDurationSeconds
  });
  errors.push(...storyboardValidation.errors);

  return result(storyboardValidation.warnings, storyboard);

  function result(warnings = [], storyboard = null) {
    return {
      valid: errors.length === 0,
      errors,
      warnings,
      episodeId: number,
      episodeDirectory,
      sources,
      narrativeSha256: crypto.createHash("sha256").update(narrative).digest("hex"),
      segments,
      storyboardSource,
      storyboard
    };
  }
}

function validateTiming(storyboard, scenes, suppliedDuration, errors, warnings) {
  const timedScenes = scenes.filter((scene) =>
    Number.isFinite(scene.start_seconds) && Number.isFinite(scene.end_seconds)
  );
  const declaredDuration = storyboard.timing?.audio_duration_seconds;
  const duration = suppliedDuration ?? declaredDuration;

  if (timedScenes.length === 0) {
    warnings.push("Storyboard has planning estimates only; recorded audio must establish final scene timing");
    return;
  }
  if (timedScenes.length !== scenes.length) {
    errors.push("Final timing must define start_seconds and end_seconds for every scene");
    return;
  }
  if (storyboard.timing?.authority !== "recorded-audio") {
    errors.push('Timed storyboard must declare timing.authority as "recorded-audio"');
  }
  if (!Number.isFinite(duration)) {
    errors.push("Timed storyboard must declare timing.audio_duration_seconds or receive recorded audio duration");
    return;
  }
  if (Math.abs(timedScenes[0].start_seconds) > 0.000001) {
    errors.push("First storyboard scene must start at 0 seconds");
  }
  for (const [index, scene] of timedScenes.entries()) {
    if (scene.end_seconds <= scene.start_seconds) errors.push(`${scene.id} has non-positive duration`);
    if (index > 0) {
      const previous = timedScenes[index - 1];
      const delta = scene.start_seconds - previous.end_seconds;
      if (Math.abs(delta) > 0.000001) {
        errors.push(`${previous.id}/${scene.id} timing has a ${delta > 0 ? "gap" : "overlap"}`);
      }
    }
  }
  const finalEnd = timedScenes.at(-1).end_seconds;
  if (Math.abs(finalEnd - duration) > 0.001) {
    errors.push(`Storyboard ends at ${finalEnd}; recorded narration ends at ${duration}`);
  }
}

function expandSegmentReferences(references, knownSegments) {
  const values = [];
  const errors = [];
  if (!Array.isArray(references)) return { values, errors: ["narrative_segments must be an array"] };

  for (const reference of references) {
    const range = String(reference).match(/^(N\d{3})(?:-(N\d{3}))?$/);
    if (!range) {
      errors.push(`invalid narrative segment reference "${reference}"`);
      continue;
    }
    if (!range[2]) {
      if (!knownSegments.has(range[1])) errors.push(`unknown narrative segment "${range[1]}"`);
      else values.push(range[1]);
      continue;
    }
    const start = Number(range[1].slice(1));
    const end = Number(range[2].slice(1));
    if (end < start) {
      errors.push(`invalid descending narrative segment range "${reference}"`);
      continue;
    }
    for (let number = start; number <= end; number++) {
      const id = `N${String(number).padStart(3, "0")}`;
      if (!knownSegments.has(id)) errors.push(`unknown narrative segment "${id}"`);
      else values.push(id);
    }
  }
  return { values, errors };
}

function stripFrontMatter(markdown) {
  return markdown.replace(/^---\n[\s\S]*?\n---\n/, "");
}
