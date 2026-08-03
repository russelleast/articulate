#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { alignSections, cueTime, normaliseWhisperTranscript } from "../../../runtime/transcript-alignment.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../..");
const episodeDirectory = path.join(repoRoot, "production/episodes/0003");
const plan = readJson(path.join(episodeDirectory, "scene-plan.yaml"));
const mediaPath = path.join(repoRoot, plan.episode.audio);
const rawPath = path.join(here, "raw-transcription/episode-0003-presenter-whisper-base-en.json");
const selectedDurationSeconds = 456.333333;
const transcript = normaliseWhisperTranscript(readJson(rawPath), {
  audio: plan.episode.audio,
  model: "whisper.cpp base.en",
  corrections: {
    "conversational interfaces. Another, looked at architectural discovery. Others explored rag,": "conversational interfaces. Another looked at architectural discovery. Others explored RAG,",
    "build an AI native platform. I was trying to build something that could help architects discover,": "build an AI-native platform. I was trying to build something that could help architects discover,",
    "In no situations, using an LLM wasn't simply more interesting. It often felt like a better": "In those situations, using an LLM wasn't simply more interesting. It often felt like a better",
    "producing better outcomes? How do I detect when behavior starts to drift? And how should intelligent": "producing better outcomes? How do I detect when behaviour starts to drift? And how should intelligent",
    "behavior be evaluated? How could I observe and govern reasoning in production? These weren't": "behaviour be evaluated? How could I observe and govern reasoning in production? These weren't",
    "Whether Articulate truly deserves that label is something I expect this journal to test rather": "Whether Articulate truly deserves that label is something I expect this journal to test rather",
    "than simply issue. If intelligence is becoming architecturally significant,": "than simply assume. If intelligence is becoming architecturally significant,",
    "traditional architecture engineering. The system needs APIs, persistent security,": "traditional software engineering. The system needs APIs, persistence, security,",
    "about architecture. Another term that keeps constantly appearing is Agentic systems.": "about architecture. Another term that keeps constantly appearing is agentic systems.",
    "reasoning, my early experiments consistently suggested that intelligent offered a better": "reasoning, my early experiments consistently suggested that intelligence offered a better",
    "managed? How do humans remain part of that important decisions? How do we evaluate intelligent behaviour?": "managed? How do humans remain part of those important decisions? How do we evaluate intelligent behaviour?",
    "So rather than treating AI native architecture as a conclusion, I would like to treat it as a": "So rather than treating AI-native architecture as a conclusion, I would like to treat it as a"
  }
});

const alignment = alignSections(transcript, plan.sections, selectedDurationSeconds);
const sections = new Map(alignment.sections.map((section) => [section.id, section]));
const scenes = plan.scenes.map((scene) => buildScene(scene, sections.get(scene.section)));
const markers = {
  version: 2,
  authority: "continuous-presenter-media",
  mediaDurationSeconds: probeDuration(mediaPath),
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
    id: "episode-0003",
    title: plan.episode.title,
    journalSource: plan.episode.writtenSource,
    narrativeSource: plan.episode.narrativeSource,
    storyboard: "production/episodes/0003/storyboard-presenter.yaml",
    timingMarkers: "production/episodes/0003/production/presenter-v2-markers.json",
    assetRegister: "production/episodes/0003/asset-register.yaml",
    scenePlan: "production/episodes/0003/scene-plan.yaml"
  },
  presenter: {
    implementation: "continuous-video",
    assetId: "episode-0003-presenter-v2",
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
      note: "Refreshed Episodes 0001–0002 framing: complete source scaled to 780x439 and anchored lower-left."
    }
  },
  rendering: { visualGrammarProfile: "articulate-visual-grammar-v2", productionMetadata: false },
  review: { includeTimelineStates: true, temporalSampleSeconds: 8 },
  output: {
    width: 1920,
    height: 1080,
    frameRate: 30,
    video: "production/episodes/0003/output/episode-0003-final.mp4",
    generatedDirectory: "production/episodes/0003/generated/presenter-v2",
    reviewDirectory: "production/episodes/0003/output/review/presenter-v2",
    narrationAnalysis: "production/episodes/0003/production/presenter-v2-analysis.json"
  },
  scenes
};

const storyboard = {
  version: 2,
  episode: {
    id: "0003",
    title: plan.episode.title,
    written_source: plan.episode.writtenSource,
    narrative_source: plan.episode.narrativeSource,
    scene_plan: "production/episodes/0003/scene-plan.yaml",
    production_status: "presenter-v2"
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

const sceneList = {
  episode: {
    id: "episode-0003",
    title: plan.episode.title,
    production_status: "presenter-v2",
    timing_authority: "episode-0003-presenter-v2",
    narration_duration_seconds: selectedDurationSeconds
  },
  scenes: storyboard.scenes.map((scene) => ({
    scene_id: scene.id,
    start_seconds: scene.start_seconds,
    end_seconds: scene.end_seconds,
    visual_type: scene.archetype,
    presenter_mode: plan.scenes.find((item) => item.id === scene.id).kind === "presenter-focus" ? "visible-soft-luma" : "audio-continuous",
    diagram_asset: scenes.find((item) => item.id === scene.id)?.diagramAssetId ?? null
  }))
};

writeJson(path.join(episodeDirectory, "transcript.json"), transcript);
writeJson(path.join(episodeDirectory, "alignment.json"), alignment);
writeJson(path.join(episodeDirectory, "timeline.json"), { version: 1, authority: "recorded-presenter", scenes: markers.scenes });
writeJson(path.join(episodeDirectory, "storyboard-presenter.yaml"), storyboard);
writeJson(path.join(episodeDirectory, "scene-list.yaml"), sceneList);
writeJson(path.join(here, "presenter-v2-markers.json"), markers);
writeJson(path.join(here, "presenter-v2-config.json"), config);
writePublicationSubtitles(transcript, selectedDurationSeconds);

console.log(`Episode 0003 render config: ${relative(path.join(here, "presenter-v2-config.json"))}`);
console.log("Episode 0003 publication duration: 00:07:36.333");

function buildScene(scene, section) {
  const reveals = new Map();
  const events = [];
  for (const [index, beat] of (scene.beats ?? []).entries()) {
    const at = Math.min(section.end - section.start - 0.04, cueTime(transcript, beat.alignTo, section, index * 1.6));
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
    ...(scene.compositionMode ? { compositionMode: scene.compositionMode } : {}),
    ...(scene.canvasLayout ? { canvasLayout: scene.canvasLayout } : {}),
    ...(scene.diagramAssetId ? { diagramAssetId: scene.diagramAssetId } : {}),
    headline: scene.headline,
    support: scene.support,
    items: scene.items ?? [],
    ...(scene.evidence ? { evidence: scene.evidence } : {}),
    companion: false,
    assetIds: scene.diagramAssetId ? ["A002", "A003"] : scene.kind === "presenter-repository" ? ["A002", "A004"] : scene.kind === "presenter-focus" ? ["A001", "A002"] : ["A002"],
    transition: scene.transition,
    timeline: { connectorTiming: "with-destination", events },
    shots: [{ id: "section", label: section.title, at: 0, events: [] }]
  };
}

function writePublicationSubtitles(source, duration) {
  const timedWords = source.segments.filter((segment) => segment.text && segment.start < duration).flatMap((segment) => {
    const words = segment.text.split(/\s+/);
    return words.map((word, index) => ({
      text: word,
      start: segment.start + (segment.end - segment.start) * index / words.length,
      end: segment.start + (segment.end - segment.start) * (index + 1) / words.length
    }));
  });
  const groups = [];
  let group = [];
  for (const word of timedWords) {
    const candidate = [...group, word].map((item) => item.text).join(" ");
    if (group.length && (!canWrapTwoLines(candidate) || candidate.length > 78 || group.length >= 11)) {
      groups.push(group);
      group = [];
    }
    group.push(word);
    if (group.length >= 5 && /[.!?]$/.test(word.text)) {
      groups.push(group);
      group = [];
    }
  }
  if (group.length) groups.push(group);
  const cues = groups.map((words) => ({
    start: words[0].start,
    end: Math.min(duration, words.at(-1).end),
    text: wrapTwoLines(words.map((word) => word.text).join(" "))
  }));
  for (let index = 0; index < cues.length; index += 1) {
    const next = cues[index + 1];
    if (next) cues[index].end = Math.min(cues[index].end, next.start - 0.04);
  }
  const srt = cues.map((cue, index) => `${index + 1}\n${srtTime(cue.start)} --> ${srtTime(cue.end)}\n${cue.text}\n`).join("\n");
  const transcriptText = source.segments.map((segment) => `[${time(segment.start)}–${time(segment.end)}] ${segment.text}`).join("\n");
  const subtitleDirectory = path.join(episodeDirectory, "publication/subtitles");
  fs.mkdirSync(subtitleDirectory, { recursive: true });
  fs.writeFileSync(path.join(subtitleDirectory, "episode-0003-en.srt"), srt);
  const outputSubtitle = path.join(episodeDirectory, "output/episode-0003-final.srt");
  fs.mkdirSync(path.dirname(outputSubtitle), { recursive: true });
  fs.writeFileSync(outputSubtitle, srt);
  fs.writeFileSync(path.join(subtitleDirectory, "episode-0003-transcript.txt"), `${transcriptText}\n`);
}

function canWrapTwoLines(text) {
  if (text.length <= 42) return true;
  const words = text.split(/\s+/);
  return words.slice(1).some((_, index) => words.slice(0, index + 1).join(" ").length <= 42 && words.slice(index + 1).join(" ").length <= 42);
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
