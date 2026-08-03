#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { alignSections, cueTime, normaliseWhisperTranscript } from "../../../runtime/transcript-alignment.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDirectory, "../../../..");
const episodeDirectory = path.join(repoRoot, "production/episodes/0001");
const planPath = path.join(episodeDirectory, "scene-plan.yaml");
const plan = readJson(planPath);
const mediaPath = path.join(repoRoot, plan.episode.audio);
const rawPath = path.join(scriptDirectory, "raw-transcription/episode-0001-presenter-whisper-base-en.json");
const selectedDurationSeconds = 306.000000;
const transcript = normaliseWhisperTranscript(readJson(rawPath), {
  audio: plan.episode.audio,
  model: "whisper.cpp base.en",
  corrections: {
    "But after a few hours, few days, sometimes something doesn't feel right. Some": "But after a few hours, a few days sometimes, something doesn't feel right. Some",
    "The documentation is full of free letter acronyms that no one has explained. Some pages contradict": "The documentation is full of three-letter acronyms that no one has explained. Some pages contradict",
    "diagram. We've changed it since then.\" See, we're asking another architect, then a developer,": "diagram. We've changed it since then.\" So you ask another architect, then a developer,",
    "system best. Everyone of those sources tells part of the story. None of them tell the whole": "system best. Every one of those sources tells part of the story. None of them tells the whole",
    "I think AI has changed that. Not because it can generate code. That's useful. But it": "I think AI changes that. Not because it can generate code. That's useful, but it",
    "Would we build something that helps architects understand architecture in the same way that": "Could we build something that helps architects understand architecture in the same way that",
    "architects already do? Not by replacing architects, but by replacing diagrams. By helping us": "architects already do? Not by replacing architects. Not by replacing diagrams. But by helping us",
    "clear a little more of that fog. That's what Articulated is exploring. It's an experiment.": "clear a little more of that fog. That's what Articulate is exploring. It's an experiment.",
    "It's an exploration into whether AI can help us discover, understand, and reason about": "It's an exploration into whether AI can help us discover, understand and reason about",
    "and involve complex software systems. I don't know whether that vision is achievable. That's": "and evolve complex software systems. I don't know whether that vision is achievable. That's",
    "why this is a journal. You can see the ideas, see the ones that work, the ones that don't,": "why this is a journal. You'll see the ideas that work, the ones that don't,"
  }
});
const alignment = alignSections(transcript, plan.sections, selectedDurationSeconds);
const alignmentById = new Map(alignment.sections.map((section) => [section.id, section]));
const markers = {
  version: 2,
  authority: "continuous-presenter-media",
  mediaDurationSeconds: probeDuration(mediaPath),
  selectedDurationSeconds,
  frameRate: 30,
  scenes: plan.scenes.map((scene) => {
    const section = alignmentById.get(scene.section);
    return {
      id: scene.id,
      startSeconds: section.start,
      endSeconds: section.end,
      narrationReference: `${section.title} · ${section.narrativeSegments.join(", ")}`
    };
  })
};

const scenes = plan.scenes.map((scene) => {
  const section = alignmentById.get(scene.section);
  const reveals = new Map();
  const events = [];
  for (const [index, beat] of (scene.beats ?? []).entries()) {
    const at = Math.min(section.end - section.start - 0.04, cueTime(transcript, beat.alignTo, section, index * 1.4));
    reveals.set(beat.target, at);
    events.push({
      id: beat.id,
      at,
      action: beat.action === "emphasise" ? "emphasize" : (beat.action ?? "reveal"),
      target: beat.target,
      sourcePhrase: beat.alignTo
    });
  }
  for (const [index, [from, to]] of (scene.connections ?? []).entries()) {
    events.push({
      id: `${scene.id.toLowerCase()}-connect-${index + 1}`,
      at: Math.max(reveals.get(from) ?? 0, reveals.get(to) ?? 0),
      action: "connect",
      from,
      to
    });
  }
  return {
    id: scene.id,
    title: scene.headline,
    kind: scene.kind,
    ...(scene.focusLayout ? { focusLayout: scene.focusLayout } : {}),
    headline: scene.headline,
    support: scene.support,
    items: scene.items ?? [],
    companion: false,
    assetIds: scene.kind === "presenter-focus" ? ["A017", "A018"] : ["A018"],
    transition: scene.transition,
    timeline: { connectorTiming: "with-destination", events },
    shots: [{ id: "section", label: section.title, at: 0, events: [] }]
  };
});

const renderConfig = {
  version: 3,
  episode: {
    id: "episode-0001",
    title: plan.episode.title,
    journalSource: plan.episode.writtenSource,
    narrativeSource: plan.episode.narrativeSource,
    narrativeSourceConvention: "legacy",
    storyboard: "production/episodes/0001/storyboard-presenter.yaml",
    timingMarkers: "production/episodes/0001/production/presenter-refresh-markers.json",
    assetRegister: "production/episodes/0001/asset-register.yaml",
    scenePlan: "production/episodes/0001/scene-plan.yaml"
  },
  presenter: {
    implementation: "continuous-video",
    assetId: "episode-0001-presenter-v2",
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
      "presenter-full": { x: 0, y: 0, width: 1920, height: 1080 },
      "presenter-focus": { x: -20, y: 641, width: 780, height: 439 }
    },
    safeCrop: {
      source: { width: 1280, height: 720, aspectRatio: "16:9" },
      note: "Episode 0000 framing: complete source scaled to 780x439, anchored lower-left, with Focus Canvas content reserved to the right."
    }
  },
  rendering: { visualGrammarProfile: "articulate-visual-grammar-v2", productionMetadata: false },
  review: { includeTimelineStates: true, temporalSampleSeconds: 5 },
  output: {
    width: 1920,
    height: 1080,
    frameRate: 30,
    video: "production/output/episode-0001.mp4",
    generatedDirectory: "production/episodes/0001/generated/presenter-refresh-v1",
    reviewDirectory: "production/episodes/0001/output/review/presenter-refresh-v1",
    narrationAnalysis: "production/episodes/0001/production/presenter-refresh-analysis.json"
  },
  scenes
};

const storyboard = {
  version: 2,
  episode: {
    id: "0001",
    title: plan.episode.title,
    written_source: plan.episode.writtenSource,
    narrative_source: plan.episode.narrativeSource,
    scene_plan: "production/episodes/0001/scene-plan.yaml",
    production_status: "presenter-refresh-v1"
  },
  timing: { authority: "continuous-presenter-media", media_duration_seconds: selectedDurationSeconds },
  scenes: plan.scenes.map((scene) => {
    const section = alignmentById.get(scene.section);
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

writeJson(path.join(episodeDirectory, "transcript.json"), transcript);
writeJson(path.join(episodeDirectory, "alignment.json"), alignment);
writeJson(path.join(episodeDirectory, "storyboard-presenter.yaml"), storyboard);
writeJson(path.join(scriptDirectory, "presenter-refresh-markers.json"), markers);
writeJson(path.join(scriptDirectory, "presenter-refresh-config.json"), renderConfig);
writePublicationSubtitles(transcript, selectedDurationSeconds);

console.log(`Episode 0001 scene plan: ${relative(planPath)}`);
console.log(`Episode 0001 transcript: ${relative(path.join(episodeDirectory, "transcript.json"))}`);
console.log(`Episode 0001 alignment: ${relative(path.join(episodeDirectory, "alignment.json"))}`);
console.log(`Episode 0001 render config: ${relative(path.join(scriptDirectory, "presenter-refresh-config.json"))}`);
console.log("Episode 0001 publication duration: 00:05:06.000");

function writePublicationSubtitles(source, duration) {
  const cues = [];
  for (const segment of source.segments.filter((item) => item.text)) {
    const chunks = subtitleChunks(segment.text);
    const totalWords = chunks.reduce((sum, chunk) => sum + chunk.split(/\s+/).length, 0);
    let consumed = 0;
    for (const chunk of chunks) {
      const words = chunk.split(/\s+/).length;
      const start = segment.start + (segment.end - segment.start) * consumed / totalWords;
      consumed += words;
      const end = segment.start + (segment.end - segment.start) * consumed / totalWords;
      cues.push({ start, end: Math.min(duration, Math.max(start + 0.5, end)), text: wrapTwoLines(chunk) });
    }
  }
  for (let index = 0; index < cues.length; index += 1) {
    const next = cues[index + 1];
    if (next) cues[index].end = Math.min(cues[index].end, next.start - 0.04);
  }
  const srt = cues.map((cue, index) => `${index + 1}\n${srtTime(cue.start)} --> ${srtTime(cue.end)}\n${cue.text}\n`).join("\n");
  const transcriptText = source.segments.map((segment) => `[${time(segment.start)}–${time(segment.end)}] ${segment.text}`).join("\n");
  const paths = [
    path.join(repoRoot, "production/output/episode-0001.srt"),
    path.join(episodeDirectory, "publication/subtitles/episode-0001-en.srt")
  ];
  for (const output of paths) {
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, srt);
  }
  fs.writeFileSync(path.join(episodeDirectory, "publication/subtitles/episode-0001-transcript.txt"), `${transcriptText}\n`);
}

function subtitleChunks(text) {
  const words = text.split(/\s+/);
  const chunks = [];
  let chunk = [];
  for (const word of words) {
    const candidate = [...chunk, word].join(" ");
    if (chunk.length && !canWrapTwoLines(candidate)) {
      chunks.push(chunk.join(" "));
      chunk = [word];
    } else chunk.push(word);
  }
  if (chunk.length) chunks.push(chunk.join(" "));
  return chunks;
}

function canWrapTwoLines(text) {
  if (text.length <= 42) return true;
  const words = text.split(/\s+/);
  return words.slice(1).some((_, index) => {
    const split = index + 1;
    return words.slice(0, split).join(" ").length <= 42 && words.slice(split).join(" ").length <= 42;
  });
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
  if (!best) return text;
  return `${best.first}\n${best.second}`;
}

function probeDuration(filePath) {
  return Number(run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nk=1:nw=1", filePath], true).trim());
}
function readJson(filePath) { return JSON.parse(fs.readFileSync(filePath, "utf8")); }
function writeJson(filePath, value) { fs.mkdirSync(path.dirname(filePath), { recursive: true }); fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`); }
function sha256(filePath) { return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex"); }
function relative(filePath) { return path.relative(repoRoot, filePath).replaceAll(path.sep, "/"); }
function time(seconds) { const minutes = Math.floor(seconds / 60); return `${String(minutes).padStart(2, "0")}:${(seconds % 60).toFixed(3).padStart(6, "0")}`; }
function srtTime(seconds) { const total = Math.max(0, Math.round(seconds * 1000)); const hours = Math.floor(total / 3600000); const minutes = Math.floor(total % 3600000 / 60000); const secs = Math.floor(total % 60000 / 1000); const ms = total % 1000; return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")},${String(ms).padStart(3, "0")}`; }
function run(command, args, capture = false) { const result = spawnSync(command, args, { cwd: repoRoot, encoding: "utf8", stdio: capture ? "pipe" : "inherit" }); if (result.status !== 0) throw new Error(`${command} failed with status ${result.status}\n${result.stderr ?? ""}`); return result.stdout ?? ""; }
