#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { alignSections, cueTime, normaliseWhisperTranscript } from "../../../runtime/transcript-alignment.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../..");
const episodeDirectory = path.join(repoRoot, "production/episodes/0004");
const plan = readJson(path.join(episodeDirectory, "scene-plan.yaml"));
const mediaPath = path.join(repoRoot, plan.episode.presenterMedia);
const rawPath = path.join(here, "raw-transcription/episode-0004-presenter-whisper-base-en.json");
const selectedDurationSeconds = 598.333333;

const transcript = normaliseWhisperTranscript(readJson(rawPath), {
  audio: plan.episode.presenterMedia,
  model: "whisper.cpp base.en",
  corrections: {
    "In the last episode, I explained why Articulate was being designed as an AI-native system": "In the last episode, I explained why Articulate is being designed as an AI-native system",
    "Trusters expect to protect their information, respect their permissions, record important": "Users expect systems to protect their information, respect permissions, record important",
    "AI native systems introduce new questions.": "AI-native systems introduce new questions.",
    "Which tools can the agent invoke?": "Which tools can an agent invoke?",
    "Can retrieved information cross-security boundaries?": "Can retrieved information cross security boundaries?",
    "Being capable of doing something that is not the same as being authorized to do it.": "Being capable of doing something is not the same as being authorised to do it.",
    "A model provider becomes unavailable, a retrieval service times out, or a call to a tool fails,": "A model provider becomes unavailable. A retrieval service times out. A tool fails.",
    "a workflow can be interrupted.": "A workflow is interrupted.",
    "Traditionally, we measured things latency and throughput.": "Traditionally, we measured things like latency and throughput.",
    "Those still matter, but AI systems introduce a perceived performance.": "Those still matter, but AI systems also introduce perceived performance.",
    "Retrieval, cooling tools, validation, and model inference all contribute to the overall": "Retrieval, calling tools, validation and model inference all contribute to the overall",
    "Data security has also changed.": "Scalability has also changed.",
    "AI native systems introduce another question.": "AI-native systems introduce another question.",
    "Each has a focus responsibility, a smaller context, and a clearer purpose.": "Each has a focused responsibility, a smaller context and a clearer purpose.",
    "spends more effort managing its own knowledge and solving the problem.": "spends more effort managing its own knowledge than solving the problem.",
    "The goal is to create or to place complexity where it can be understood and managed.": "The goal is to place complexity where it can be understood and managed.",
    "Selfability becomes even more important once intelligence becomes part of the runtime.": "Observability becomes even more important once intelligence becomes part of the runtime.",
    "Traditional systems gives us logs, metrics, and traces.": "Traditional systems give us logs, metrics and traces.",
    "AI-native systems also need to understand prompts, retrieve knowledge, routing decisions, tools": "AI-native systems also need us to understand prompts, retrieved knowledge, routing decisions, tools",
    "You need to understand why that decision was made.": "We also need to understand why that decision was made.",
    "Another characteristic that becomes increasingly important is a volvability.": "Another characteristic that becomes increasingly important is evolvability.",
    "Empathy matters for the same reason.": "Operability matters for the same reason.",
    "Learning software engineering gives us testing, unit tests, integration, and performance tests,": "Traditional software engineering gives us testing: unit tests, integration tests and performance tests,",
    "Ultimately, that's where the next episode is really about.": "Ultimately, that's what this episode is really about.",
    "But they don't replace the foundations of software architecture they build upon them.": "But they don't replace the foundations of software architecture. They build upon them.",
    "Remember AI-native systems are still systems.": "Remember: AI-native systems are still systems.",
    "that are beginning to shape, articulate, and why thinking in terms of capabilities rather": "that are beginning to shape Articulate, and why thinking in terms of capabilities rather"
  }
});

const alignment = alignSections(transcript, plan.sections, selectedDurationSeconds);
const sections = new Map(alignment.sections.map((section) => [section.id, section]));
const scenes = plan.scenes.map((scene, index) => buildScene(scene, sections.get(scene.section), index));
const mediaDurationSeconds = probeDuration(mediaPath);

const markers = {
  version: 2,
  authority: "continuous-presenter-media",
  mediaDurationSeconds,
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
    id: "episode-0004",
    title: plan.episode.title,
    journalSource: plan.episode.writtenSource,
    narrativeSource: plan.episode.narrativeSource,
    storyboard: "production/episodes/0004/storyboard-presenter.yaml",
    timingMarkers: "production/episodes/0004/production/presenter-v1-markers.json",
    assetRegister: "production/episodes/0004/asset-register.yaml",
    scenePlan: "production/episodes/0004/scene-plan.yaml",
    timeline: "production/episodes/0004/timeline.json"
  },
  presenter: {
    implementation: "continuous-video",
    assetId: "episode-0004-presenter-v1",
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
      note: "Refreshed Episodes 0001–0003 framing: complete source scaled to 780x439 and anchored lower-left."
    }
  },
  rendering: { visualGrammarProfile: "articulate-visual-grammar-v2", productionMetadata: false },
  review: { includeTimelineStates: true, temporalSampleSeconds: 8 },
  output: {
    width: 1920,
    height: 1080,
    frameRate: 30,
    video: "production/episodes/0004/output/episode-0004-final.mp4",
    generatedDirectory: "production/episodes/0004/generated/presenter-v1",
    reviewDirectory: "production/episodes/0004/output/review/presenter-v1",
    narrationAnalysis: "production/episodes/0004/production/presenter-v1-analysis.json"
  },
  scenes
};

const storyboard = {
  version: 2,
  episode: {
    id: "0004",
    title: plan.episode.title,
    written_source: plan.episode.writtenSource,
    narrative_source: plan.episode.narrativeSource,
    scene_plan: "production/episodes/0004/scene-plan.yaml",
    production_status: "presenter-v1"
  },
  timing: { authority: "continuous-presenter-media", media_duration_seconds: selectedDurationSeconds },
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
  generatedFrom: "production/episodes/0004/scene-plan.yaml",
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
    id: "episode-0004",
    title: plan.episode.title,
    production_status: "presenter-v1",
    timing_authority: "episode-0004-presenter-v1",
    narration_duration_seconds: selectedDurationSeconds
  },
  scenes: storyboard.scenes.map((scene) => ({
    scene_id: scene.id,
    start_seconds: scene.start_seconds,
    end_seconds: scene.end_seconds,
    visual_type: scene.archetype,
    presenter_mode: scene.kind === "presenter-focus" || scene.kind === "presenter-reflection" ? "visible" : "audio-continuous",
    diagram_asset: scenes.find((item) => item.id === scene.id)?.diagramAssetId ?? null
  }))
};

writeJson(path.join(episodeDirectory, "transcript.json"), transcript);
writeJson(path.join(episodeDirectory, "alignment.json"), alignment);
writeJson(path.join(episodeDirectory, "timeline.json"), timeline);
writeJson(path.join(episodeDirectory, "episode.json"), config);
writeJson(path.join(episodeDirectory, "storyboard-presenter.yaml"), storyboard);
writeJson(path.join(episodeDirectory, "scene-list.yaml"), sceneList);
writeJson(path.join(here, "presenter-v1-markers.json"), markers);
writeJson(path.join(here, "presenter-v1-config.json"), config);
writePublicationSubtitles(transcript, selectedDurationSeconds);

console.log(`Episode 0004 render config: ${relative(path.join(episodeDirectory, "episode.json"))}`);
console.log("Episode 0004 publication duration: 00:09:58.333");

function buildScene(scene, section, index) {
  const events = [];
  for (const [eventIndex, beat] of (scene.beats ?? []).entries()) {
    const at = Math.min(section.end - section.start - 0.04, cueTime(transcript, beat.alignTo, section, eventIndex * 1.6));
    events.push({
      id: beat.id,
      at,
      action: beat.action === "emphasise" ? "emphasize" : (beat.action ?? "reveal"),
      target: beat.target,
      ...(beat.text ? { text: beat.text } : {}),
      sourcePhrase: beat.alignTo
    });
  }
  return {
    id: scene.id,
    title: scene.headline,
    kind: scene.kind,
    ...(scene.diagramAssetId ? { diagramAssetId: scene.diagramAssetId } : {}),
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

function writePublicationSubtitles(source, duration) {
  const sentences = [];
  let current = [];
  for (const segment of source.segments.filter((item) => item.text && item.start < duration)) {
    current.push(segment);
    if (/[.!?][\"']?$/.test(segment.text.trim())) {
      sentences.push(current);
      current = [];
    }
  }
  if (current.length) sentences.push(current);

  const cues = [];
  for (const sentence of sentences) {
    const text = sentence.map((segment) => segment.text).join(" ").replace(/\s+([,.;:!?])/g, "$1").replace(/\s+/g, " ").trim();
    const chunks = subtitleChunks(text);
    const start = sentence[0].start;
    const end = Math.min(duration, sentence.at(-1).end);
    const weights = chunks.map((chunk) => chunk.split(/\s+/).length);
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let elapsedWeight = 0;
    chunks.forEach((chunk, index) => {
      const cueStart = start + (end - start) * elapsedWeight / totalWeight;
      elapsedWeight += weights[index];
      const cueEnd = start + (end - start) * elapsedWeight / totalWeight;
      cues.push({ start: cueStart, end: cueEnd, text: wrapTwoLines(chunk) });
    });
  }
  for (let index = 0; index < cues.length - 1; index += 1) {
    cues[index].end = Math.min(cues[index].end, cues[index + 1].start - 0.04);
  }
  const srt = cues.map((cue, index) => `${index + 1}\n${srtTime(cue.start)} --> ${srtTime(cue.end)}\n${cue.text}\n`).join("\n");
  const transcriptText = source.segments.map((segment) => `[${time(segment.start)}–${time(segment.end)}] ${segment.text}`).join("\n");
  const subtitleDirectory = path.join(episodeDirectory, "publication/subtitles");
  fs.mkdirSync(subtitleDirectory, { recursive: true });
  fs.writeFileSync(path.join(subtitleDirectory, "episode-0004-en.srt"), srt);
  const outputSubtitle = path.join(episodeDirectory, "output/episode-0004-final.srt");
  fs.mkdirSync(path.dirname(outputSubtitle), { recursive: true });
  fs.writeFileSync(outputSubtitle, srt);
  fs.writeFileSync(path.join(subtitleDirectory, "episode-0004-transcript.txt"), `${transcriptText}\n`);
}

function subtitleChunks(text) {
  const words = text.split(/\s+/);
  const chunkCount = Math.max(1, Math.ceil(text.length / 72), Math.ceil(words.length / 10));
  const chunks = [];
  let cursor = 0;
  for (let index = 0; index < chunkCount; index += 1) {
    const remainingWords = words.length - cursor;
    const remainingChunks = chunkCount - index;
    let take = Math.ceil(remainingWords / remainingChunks);
    while (take > 1 && words.slice(cursor, cursor + take).join(" ").length > 76) take -= 1;
    while (index < chunkCount - 1 && remainingWords - take < remainingChunks - 1) take -= 1;
    chunks.push(words.slice(cursor, cursor + take).join(" "));
    cursor += take;
  }
  return chunks;
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

function probeDuration(filePath) { return Number(run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nk=1:nw=1", filePath], true).trim()); }
function readJson(filePath) { return JSON.parse(fs.readFileSync(filePath, "utf8")); }
function writeJson(filePath, value) { fs.mkdirSync(path.dirname(filePath), { recursive: true }); fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`); }
function sha256(filePath) { return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex"); }
function relative(filePath) { return path.relative(repoRoot, filePath).replaceAll(path.sep, "/"); }
function time(seconds) { const minutes = Math.floor(seconds / 60); return `${String(minutes).padStart(2, "0")}:${(seconds % 60).toFixed(3).padStart(6, "0")}`; }
function srtTime(seconds) { const total = Math.max(0, Math.round(seconds * 1000)); const hours = Math.floor(total / 3600000); const minutes = Math.floor(total % 3600000 / 60000); const secs = Math.floor(total % 60000 / 1000); const ms = total % 1000; return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")},${String(ms).padStart(3, "0")}`; }
function run(command, args, capture = false) { const result = spawnSync(command, args, { cwd: repoRoot, encoding: "utf8", stdio: capture ? "pipe" : "inherit" }); if (result.status !== 0) throw new Error(`${command} failed with status ${result.status}\n${result.stderr ?? ""}`); return result.stdout ?? ""; }
