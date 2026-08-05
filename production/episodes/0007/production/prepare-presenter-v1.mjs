#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { segmentNarrative } from "../../../runtime/episode-production.mjs";
import { alignSections, cueTime, normaliseWhisperTranscript } from "../../../runtime/transcript-alignment.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../..");
const episodeDirectory = path.join(repoRoot, "production/episodes/0007");
const plan = readJson(path.join(episodeDirectory, "scene-plan.yaml"));
const mediaPath = path.join(repoRoot, plan.episode.presenterMedia);
const rawPath = path.join(here, "raw-transcription/episode-0007-presenter-whisper-base-en.json");
const selectedDurationSeconds = probeDuration(mediaPath);

const transcript = normaliseWhisperTranscript(readJson(rawPath), {
  audio: plan.episode.presenterMedia,
  model: "whisper.cpp base.en"
});
const alignment = alignSections(transcript, plan.sections, selectedDurationSeconds);
const sections = new Map(alignment.sections.map((section) => [section.id, section]));
const scenes = plan.scenes.map((scene, index) => buildScene(scene, sections.get(scene.section), index));

const markers = {
  version: 2,
  authority: "continuous-presenter-media",
  mediaDurationSeconds: selectedDurationSeconds,
  selectedDurationSeconds,
  frameRate: 30,
  scenes: plan.scenes.map((scene) => {
    const section = sections.get(scene.section);
    return {
      id: scene.id,
      startSeconds: section.start,
      endSeconds: section.end,
      narrationReference: `${section.title} · ${section.narrativeSegments.join(", ")}`
    };
  })
};

const config = {
  version: 3,
  episode: {
    id: "episode-0007",
    title: plan.episode.title,
    journalSource: plan.episode.writtenSource,
    narrativeSource: plan.episode.narrativeSource,
    storyboard: "production/episodes/0007/storyboard.yaml",
    timingMarkers: "production/episodes/0007/production/presenter-v1-markers.json",
    assetRegister: "production/episodes/0007/asset-register.yaml",
    scenePlan: "production/episodes/0007/scene-plan.yaml",
    timeline: "production/episodes/0007/timeline.json"
  },
  presenter: {
    implementation: "continuous-video",
    assetId: "episode-0007-presenter-v1",
    expectedSha256: sha256(mediaPath),
    expectedDurationSeconds: selectedDurationSeconds,
    audio: "embedded",
    audioNormalization: {
      mode: "ebu-r128",
      integratedLoudness: -16,
      loudnessRange: 7,
      truePeak: -1.5,
      sampleRateHz: 48000
    },
    startOffsetSeconds: 0,
    endOffsetSeconds: selectedDurationSeconds,
    background: "#000000",
    compositing: {
      mode: "soft-luma-key",
      applyTo: ["presenter-focus"],
      darkThreshold: 0.12,
      softThresholdRange: 0.14,
      maskFeatherRadius: 3,
      minimumRetainedOpacity: 0,
      maskContrast: 1,
      edgeVignetteRadius: 72,
      darkHaloSuppression: 0.08,
      temporalSmoothing: 2
    },
    framing: {
      "presenter-full": { "x": 0, "y": 0, "width": 1920, "height": 1080 },
      "presenter-focus": { "x": -20, "y": 641, "width": 780, "height": 439 }
    },
    safeCrop: {
      source: { width: 1280, height: 720, aspectRatio: "16:9" },
      note: "Established presenter framing: complete source scaled to 780x439 and anchored lower-left."
    }
  },
  rendering: { visualGrammarProfile: "articulate-visual-grammar-v2", productionMetadata: false },
  review: { includeTimelineStates: true, temporalSampleSeconds: 12 },
  output: {
    width: 1920,
    height: 1080,
    frameRate: 30,
    video: "production/episodes/0007/output/episode-0007-final.mp4",
    generatedDirectory: "production/episodes/0007/generated/presenter-v1",
    reviewDirectory: "production/episodes/0007/output/review/presenter-v1",
    narrationAnalysis: "production/episodes/0007/production/presenter-v1-analysis.json"
  },
  scenes
};

const storyboard = {
  version: 2,
  episode: {
    id: "0007",
    title: plan.episode.title,
    written_source: plan.episode.writtenSource,
    narrative_source: plan.episode.narrativeSource,
    scene_plan: "production/episodes/0007/scene-plan.yaml",
    production_status: "presenter-v1"
  },
  timing: { authority: "recorded-audio", audio_duration_seconds: selectedDurationSeconds },
  scenes: plan.scenes.map((scene) => {
    const section = sections.get(scene.section);
    return {
      id: scene.id,
      title: scene.headline,
      archetype: scene.archetype,
      kind: scene.kind,
      narrative_segments: section.narrativeSegments,
      start_seconds: section.start,
      end_seconds: section.end
    };
  })
};

const timeline = {
  version: 2,
  generatedFrom: "production/episodes/0007/scene-plan.yaml",
  authority: "recorded-presenter",
  selectedDurationSeconds,
  scenes: markers.scenes.map((marker, index) => ({
    ...marker,
    archetype: plan.scenes[index].archetype,
    kind: plan.scenes[index].kind,
    transition: plan.scenes[index].transition
  }))
};

const sceneList = {
  episode: {
    id: "episode-0007",
    title: plan.episode.title,
    production_status: "presenter-v1",
    timing_authority: "episode-0007-presenter-v1",
    narration_duration_seconds: selectedDurationSeconds
  },
  scenes: storyboard.scenes.map((scene) => ({
    scene_id: scene.id,
    start_seconds: scene.start_seconds,
    end_seconds: scene.end_seconds,
    visual_type: scene.archetype,
    presenter_mode: scene.kind === "presenter-focus" ? "visible" : "audio-continuous",
    diagram_asset: scenes.find((item) => item.id === scene.id)?.diagramAssetId ?? null
  }))
};

writeJson(path.join(episodeDirectory, "transcript.json"), transcript);
writeJson(path.join(episodeDirectory, "alignment.json"), alignment);
writeJson(path.join(episodeDirectory, "timeline.json"), timeline);
writeJson(path.join(episodeDirectory, "episode.json"), config);
writeJson(path.join(episodeDirectory, "storyboard.yaml"), storyboard);
writeJson(path.join(episodeDirectory, "storyboard-presenter.yaml"), storyboard);
writeJson(path.join(episodeDirectory, "scene-list.yaml"), sceneList);
writeJson(path.join(here, "presenter-v1-markers.json"), markers);
writeJson(path.join(here, "presenter-v1-config.json"), config);
writePublicationSubtitles(transcript, alignment, selectedDurationSeconds);

console.log(`Episode 0007 render config: ${relative(path.join(episodeDirectory, "episode.json"))}`);
console.log(`Episode 0007 publication duration: ${time(selectedDurationSeconds)}`);

function buildScene(scene, section, index) {
  const events = [];
  for (const [eventIndex, beat] of (scene.beats ?? []).entries()) {
    const at = Math.min(section.end - section.start - 0.04, cueTime(transcript, beat.alignTo, section, eventIndex * 1.6));
    events.push({
      id: beat.id,
      at,
      action: beat.action === "emphasise" ? "emphasize" : (beat.action ?? "reveal"),
      ...(beat.target ? { target: beat.target } : {}),
      ...(beat.from ? { from: beat.from } : {}),
      ...(beat.to ? { to: beat.to } : {}),
      ...(beat.text ? { text: beat.text } : {}),
      sourcePhrase: beat.alignTo
    });
  }
  return {
    id: scene.id,
    title: scene.headline,
    kind: scene.kind,
    ...(scene.diagramAssetId ? { diagramAssetId: scene.diagramAssetId } : {}),
    ...(scene.compositionMode ? { compositionMode: scene.compositionMode } : {}),
    ...(scene.canvasLayout ? { canvasLayout: scene.canvasLayout } : {}),
    headline: scene.headline,
    support: scene.support,
    items: scene.items ?? [],
    ...(scene.evidence ? { evidence: scene.evidence } : {}),
    companion: false,
    assetIds: scene.diagramAssetId ? ["A002", "A003"] : scene.kind === "presenter-repository" ? ["A002", "A004"] : index === 0 ? ["A001", "A002"] : ["A002"],
    transition: scene.transition,
    timeline: { connectorTiming: "with-destination", events },
    shots: [{ id: "section", label: section.title, at: 0, events: [] }]
  };
}

function writePublicationSubtitles(source, sourceAlignment, duration) {
  const narrativeSegments = new Map(segmentNarrative(fs.readFileSync(path.join(episodeDirectory, "narrative.md"), "utf8")).map((segment) => [segment.id, segment.text]));
  const cues = [];
  for (const section of sourceAlignment.sections) {
    const ids = expandReferences(section.narrativeSegments).filter((id) => narrativeSegments.has(id));
    const canonical = ids.map((id) => narrativeSegments.get(id)).filter((text) => text !== "---").join(" ")
      .replace(/\*\*/g, "")
      .replace(/\.{3}/g, "…")
      .replace(/\s+([,.;:!?])/g, "$1")
      .replace("turn our attention to conceptual data model", "turn our attention to the conceptual data model")
      .replace("answer a this question", "answer this question");
    const canonicalWords = canonical.match(/\S+/g) ?? [];
    const timedWords = transcriptWords(source, section.start, section.end);
    const wordTimes = alignCanonicalWords(canonicalWords, timedWords, section.start, section.end);
    for (const group of subtitleGroups(canonicalWords)) {
      const start = Math.max(section.start, wordTimes[group.start].start - 0.04);
      const end = Math.min(section.end, wordTimes[group.end].end + 0.08);
      cues.push({ start, end: Math.max(start + 0.5, end), text: wrapTwoLines(group.words.join(" ")) });
    }
  }
  for (let index = 0; index < cues.length; index += 1) {
    cues[index].start = Math.max(index ? cues[index - 1].end + 0.04 : 0, cues[index].start);
    cues[index].end = Math.min(duration, index < cues.length - 1 ? Math.min(cues[index].end, cues[index + 1].start - 0.04) : cues[index].end);
    if (cues[index].end <= cues[index].start) cues[index].end = Math.min(duration, cues[index].start + 0.5);
  }
  const srt = cues.map((cue, index) => `${index + 1}\n${srtTime(cue.start)} --> ${srtTime(cue.end)}\n${cue.text}\n`).join("\n");
  const subtitleDirectory = path.join(episodeDirectory, "publication/subtitles");
  fs.mkdirSync(subtitleDirectory, { recursive: true });
  fs.writeFileSync(path.join(subtitleDirectory, "episode-0007-en.srt"), srt);
  fs.mkdirSync(path.join(episodeDirectory, "output"), { recursive: true });
  fs.writeFileSync(path.join(episodeDirectory, "output/episode-0007-final.srt"), srt);
  fs.writeFileSync(path.join(subtitleDirectory, "episode-0007-transcript.txt"), `${canonicalTranscript(narrativeSegments)}\n`);
}

function transcriptWords(source, after, before) {
  const words = [];
  for (const segment of source.segments) {
    for (const token of segment.words) {
      if (token.end < after || token.start > before) continue;
      const cleaned = token.text.replace(/[^A-Za-z0-9'-]/g, "");
      if (!cleaned) continue;
      if (/^\s/.test(token.text) || !words.length) words.push({ text: cleaned, normal: normal(cleaned), start: token.start, end: token.end });
      else {
        words.at(-1).text += cleaned;
        words.at(-1).normal += normal(cleaned);
        words.at(-1).end = token.end;
      }
    }
  }
  return words;
}

function alignCanonicalWords(canonical, timed, start, end) {
  const a = canonical.map(normal);
  const b = timed.map((word) => word.normal);
  const rows = a.length + 1;
  const cols = b.length + 1;
  const score = Array.from({ length: rows }, () => new Int16Array(cols));
  const trace = Array.from({ length: rows }, () => new Uint8Array(cols));
  for (let i = 1; i < rows; i += 1) { score[i][0] = -i; trace[i][0] = 1; }
  for (let j = 1; j < cols; j += 1) { score[0][j] = -j; trace[0][j] = 2; }
  for (let i = 1; i < rows; i += 1) {
    for (let j = 1; j < cols; j += 1) {
      const similarity = a[i - 1] === b[j - 1] ? 4 : near(a[i - 1], b[j - 1]) ? 2 : -2;
      const diagonal = score[i - 1][j - 1] + similarity;
      const up = score[i - 1][j] - 1;
      const left = score[i][j - 1] - 1;
      if (diagonal >= up && diagonal >= left) { score[i][j] = diagonal; trace[i][j] = 3; }
      else if (up >= left) { score[i][j] = up; trace[i][j] = 1; }
      else { score[i][j] = left; trace[i][j] = 2; }
    }
  }
  const mapped = Array(canonical.length).fill(null);
  let i = a.length;
  let j = b.length;
  while (i > 0 || j > 0) {
    const direction = trace[i][j];
    if (direction === 3) {
      if (a[i - 1] === b[j - 1] || near(a[i - 1], b[j - 1])) mapped[i - 1] = timed[j - 1];
      i -= 1; j -= 1;
    } else if (direction === 1) i -= 1;
    else j -= 1;
  }
  const resolved = mapped.map((value, index) => {
    if (value) return value;
    let previous = index - 1;
    while (previous >= 0 && !mapped[previous]) previous -= 1;
    let next = index + 1;
    while (next < mapped.length && !mapped[next]) next += 1;
    const low = previous >= 0 ? mapped[previous].end : start;
    const high = next < mapped.length ? mapped[next].start : end;
    const fraction = (index - previous) / Math.max(1, next - previous);
    const point = low + (high - low) * fraction;
    return { start: point, end: point + Math.min(0.35, Math.max(0.08, (high - low) / Math.max(1, next - previous))) };
  });
  return resolved;
}

function subtitleGroups(words) {
  const groups = [];
  let cursor = 0;
  while (cursor < words.length) {
    let end = Math.min(words.length - 1, cursor + 9);
    for (let candidate = cursor + 4; candidate <= end; candidate += 1) {
      if (/[.!?…][”"']?$/.test(words[candidate])) { end = candidate; break; }
    }
    while (end > cursor && words.slice(cursor, end + 1).join(" ").length > 76) end -= 1;
    groups.push({ start: cursor, end, words: words.slice(cursor, end + 1) });
    cursor = end + 1;
  }
  return groups;
}

function wrapTwoLines(text) {
  if (text.length <= 42) return text;
  const words = text.split(/\s+/);
  let best = null;
  for (let split = 1; split < words.length; split += 1) {
    const first = words.slice(0, split).join(" ");
    const second = words.slice(split).join(" ");
    if (first.length > 42 || second.length > 42) continue;
    const score = Math.abs(first.length - second.length);
    if (!best || score < best.score) best = { first, second, score };
  }
  return best ? `${best.first}\n${best.second}` : text;
}

function expandReferences(references) {
  const ids = [];
  for (const reference of references) {
    const [first, last = first] = reference.split("-");
    for (let number = Number(first.slice(1)); number <= Number(last.slice(1)); number += 1) ids.push(`N${String(number).padStart(3, "0")}`);
  }
  return ids;
}

function canonicalTranscript(segments) { return [...segments.values()].filter((text) => text !== "---").join("\n").replace(/\*\*/g, ""); }
function normal(value) { return String(value).toLowerCase().replace(/[^a-z0-9]/g, ""); }
function near(left, right) { return left.length >= 4 && right.length >= 4 && (left.startsWith(right.slice(0, 4)) || right.startsWith(left.slice(0, 4))); }
function probeDuration(filePath) { return Number(run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nk=1:nw=1", filePath], true).trim()); }
function readJson(filePath) { return JSON.parse(fs.readFileSync(filePath, "utf8")); }
function writeJson(filePath, value) { fs.mkdirSync(path.dirname(filePath), { recursive: true }); fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`); }
function sha256(filePath) { return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex"); }
function relative(filePath) { return path.relative(repoRoot, filePath).replaceAll(path.sep, "/"); }
function time(seconds) { const minutes = Math.floor(seconds / 60); return `${String(minutes).padStart(2, "0")}:${(seconds % 60).toFixed(3).padStart(6, "0")}`; }
function srtTime(seconds) { const total = Math.max(0, Math.round(seconds * 1000)); const hours = Math.floor(total / 3600000); const minutes = Math.floor(total % 3600000 / 60000); const secs = Math.floor(total % 60000 / 1000); const ms = total % 1000; return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")},${String(ms).padStart(3, "0")}`; }
function run(command, args, capture = false) { const result = spawnSync(command, args, { cwd: repoRoot, encoding: "utf8", stdio: capture ? "pipe" : "inherit" }); if (result.status !== 0) throw new Error(`${command} failed with status ${result.status}\n${result.stderr ?? ""}`); return result.stdout ?? ""; }
