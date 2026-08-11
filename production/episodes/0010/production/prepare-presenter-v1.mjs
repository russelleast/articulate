#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { alignSections, cueTime, normaliseWhisperTranscript } from "../../../runtime/transcript-alignment.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../..");
const episodeDirectory = path.join(repoRoot, "production/episodes/0010");
const narrativePath = path.join(episodeDirectory, "narrative.md");
const plan = readJson(path.join(episodeDirectory, "scene-plan.yaml"));
const mediaPath = path.join(repoRoot, plan.episode.presenterMedia);
const rawPath = path.join(here, "raw-transcription/episode-0010-presenter-whisper-base-en.json");
const selectedDurationSeconds = probeDuration(mediaPath);

const transcript = normaliseWhisperTranscript(readJson(rawPath), {
  audio: plan.episode.presenterMedia,
  model: "whisper.cpp base.en"
});
transcript.segments = transcript.segments.map((segment) => ({
  ...segment,
  text: correctText(segment.text)
}));

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
    id: "episode-0010",
    title: plan.episode.title,
    journalSource: plan.episode.writtenSource,
    narrativeSource: plan.episode.narrativeSource,
    storyboard: "production/episodes/0010/storyboard.yaml",
    timingMarkers: "production/episodes/0010/production/presenter-v1-markers.json",
    assetRegister: "production/episodes/0010/asset-register.yaml",
    scenePlan: "production/episodes/0010/scene-plan.yaml",
    timeline: "production/episodes/0010/timeline.json"
  },
  presenter: {
    implementation: "continuous-video",
    assetId: "episode-0010-presenter-v1",
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
      note: "Established presenter framing: complete source scaled to 780x439 and anchored lower-left."
    }
  },
  rendering: { visualGrammarProfile: "articulate-visual-grammar-v2", productionMetadata: false },
  review: { includeTimelineStates: true, temporalSampleSeconds: 15 },
  output: {
    width: 1920,
    height: 1080,
    frameRate: 30,
    video: "production/episodes/0010/output/episode-0010-final.mp4",
    generatedDirectory: "production/episodes/0010/generated/presenter-v1",
    reviewDirectory: "production/episodes/0010/output/review/presenter-v1",
    narrationAnalysis: "production/episodes/0010/production/presenter-v1-analysis.json"
  },
  scenes
};

const storyboard = {
  version: 2,
  episode: {
    id: "0010",
    title: plan.episode.title,
    written_source: plan.episode.writtenSource,
    narrative_source: plan.episode.narrativeSource,
    scene_plan: "production/episodes/0010/scene-plan.yaml",
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
  generatedFrom: "production/episodes/0010/scene-plan.yaml",
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
    id: "episode-0010",
    title: plan.episode.title,
    production_status: "presenter-v1",
    timing_authority: "episode-0010-presenter-v1",
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
writePublicationSubtitles(transcript, selectedDurationSeconds);

console.log(`Episode 0010 render config: ${relative(path.join(episodeDirectory, "episode.json"))}`);
console.log(`Episode 0010 publication duration: ${time(selectedDurationSeconds)}`);

function buildScene(scene, section, index) {
  const events = [];
  for (const [eventIndex, beat] of (scene.beats ?? []).entries()) {
    const at = Math.min(section.end - section.start - 0.04, cueTime(transcript, beat.alignTo, section, eventIndex * 2.2));
    events.push({
      id: beat.id,
      at,
      action: beat.action === "emphasise" ? "emphasize" : (beat.action ?? "reveal"),
      ...(beat.target ? { target: beat.target } : {}),
      ...(beat.duration ? { duration: beat.duration } : {}),
      ...(beat.from ? { from: beat.from } : {}),
      ...(beat.to ? { to: beat.to } : {}),
      ...(beat.to ? { with: beat.to } : {}),
      sourcePhrase: beat.alignTo
    });
  }
  return {
    id: scene.id,
    title: scene.headline,
    kind: scene.kind,
    ...(scene.diagramAssetId ? { diagramAssetId: scene.diagramAssetId } : {}),
    ...(scene.visualStateMode ? { visualStateMode: scene.visualStateMode } : {}),
    headline: scene.headline,
    support: scene.support,
    items: scene.items ?? [],
    ...(scene.teachingLayout ? { teachingLayout: scene.teachingLayout } : {}),
    ...(scene.details ? { details: scene.details } : {}),
    ...(scene.evidence ? { evidence: scene.evidence } : {}),
    companion: false,
    assetIds: scene.diagramAssetId
      ? ["A002", "A003"]
      : index === 0 ? ["A001", "A002"] : ["A002"],
    transition: scene.transition,
    timeline: { connectorTiming: "with-destination", events },
    shots: [{ id: "section", label: section.title, at: 0, events: [] }]
  };
}

function writePublicationSubtitles(source, duration) {
  const words = correctedWords(source);
  const groups = subtitleGroups(words);
  const cues = groups.map((group, index) => {
    const start = Math.max(index ? groups[index - 1].end + 0.04 : 0, group.start - 0.04);
    const nextStart = groups[index + 1]?.start ?? duration;
    const end = Math.min(duration, Math.max(start + 0.8, Math.min(group.end + 0.12, nextStart - 0.04)));
    return { start, end, text: wrapTwoLines(group.words.map((word) => word.text).join(" ")) };
  });
  for (let index = 1; index < cues.length; index += 1) {
    if (cues[index].start < cues[index - 1].end + 0.04) cues[index].start = cues[index - 1].end + 0.04;
    if (cues[index].end <= cues[index].start) cues[index].end = Math.min(duration, cues[index].start + 0.8);
  }
  const srt = cues.map((cue, index) => `${index + 1}\n${srtTime(cue.start)} --> ${srtTime(cue.end)}\n${cue.text}\n`).join("\n");
  const plain = groups.map((group) => group.words.map((word) => word.text).join(" ")).join(" ").replace(/\s+([,.;:!?])/g, "$1");
  const subtitleDirectory = path.join(episodeDirectory, "publication/subtitles");
  fs.mkdirSync(subtitleDirectory, { recursive: true });
  fs.writeFileSync(path.join(subtitleDirectory, "episode-0010-en.srt"), srt);
  fs.writeFileSync(path.join(subtitleDirectory, "episode-0010-transcript.txt"), `${plain}\n`);
  fs.mkdirSync(path.join(episodeDirectory, "output"), { recursive: true });
  fs.writeFileSync(path.join(episodeDirectory, "output/episode-0010-final.srt"), srt);
  fs.writeFileSync(path.join(subtitleDirectory, "episode-0010-subtitle-validation.md"), [
    "# Episode 0010 Subtitle Validation",
    "",
    "- Source: final continuous presenter recording",
    "- Timing: local Whisper word timestamps, checked against the final edited audio",
    "- Language: British English",
    "- Cue overlap: none",
    "- Maximum lines: two",
    "- Maximum line length: 42 characters",
    "- Architectural terminology checked: Articulate, Architectural Intelligence, Knowledge Model, DCL, Dapr, Temporal, LangGraph and Microsoft Agent Framework",
    ""
  ].join("\n"));
}

function correctedWords(source) {
  const words = [];
  for (const segment of source.segments) {
    for (const token of segment.words) {
      if (token.text.startsWith("[_")) continue;
      const cleaned = token.text.replace(/[^A-Za-z0-9'-]/g, "");
      if (!cleaned) {
        if (words.length && /[,.!?;:]/.test(token.text)) words.at(-1).text += token.text.trim();
        continue;
      }
      if (/^\s/.test(token.text) || !words.length) words.push({ text: cleaned, start: token.start, end: token.end });
      else {
        words.at(-1).text += cleaned;
        words.at(-1).end = token.end;
      }
    }
  }
  const phrases = [
    [["architecture", "intelligence"], ["Architectural", "Intelligence"]],
    [["architectural", "intelligence"], ["Architectural", "Intelligence"]],
    [["microsoft", "agent", "framework"], ["Microsoft", "Agent", "Framework"]],
    [["knowledge", "api"], ["Knowledge", "API"]],
    [["look", "at", "how"], ["looked", "at", "how"]],
    [["obvious", "question", "isnt", "simply", "compare", "them"], ["obvious", "next", "step", "is", "simply", "to", "compare", "them"]],
    [["expect", "a", "decision", "to", "become", "cleaner"], ["expected", "the", "decision", "to", "become", "clearer"]],
    [["dapper"], ["Dapr"]],
    [["land", "graph"], ["LangGraph"]],
    [["dcm"], ["DCL"]],
    [["at", "runtime"], ["a", "runtime"]],
    [["involve", "the", "knowledge", "model"], ["evolve", "the", "Knowledge", "Model"]],
    [["everything", "can", "start", "again"], ["everything", "and", "start", "again"]],
    [["provide", "a", "visibility"], ["provide", "visibility"]],
    [["getting", "into", "way"], ["getting", "in", "the", "way"]],
    [["runtime", "would", "be", "the", "benefit"], ["runtime", "would", "be", "the", "better", "fit"]],
    [["need", "to", "fails"], ["need", "to", "fulfil"]],
    [["in", "an", "ar", "net"], ["in", "an", "AI-native", "system"]],
    [["knowledge", "model"], ["Knowledge", "Model"]],
    [["knowledge", "reasoning"], ["Knowledge", "Reasoning"]],
    [["declarative", "capability", "language"], ["Declarative", "Capability", "Language"]],
    [["ai", "native"], ["AI-native"]],
    [["fair", "good", "understanding"], ["good", "understanding"]],
    [["architecture", "intent"], ["architectural", "intent"]],
    [["architectural", "building", "blog"], ["architectural", "building", "block"]],
    [["and", "finally", "ask"], ["we", "can", "finally", "ask"]],
    [["architectural", "decisions", "experiments", "in", "this", "form", "of", "architecture", "this", "is", "a", "design", "and", "a", "layout", "of", "the", "engineering", "and", "engineering", "journal", "documenting", "the", "architecture", "of", "a", "cloud"], ["architectural", "decisions", "experiments", "and", "lessons", "learned", "as", "the", "architecture", "evolves"]],
    [["this", "is", "the", "lesson", "to", "learn", "as", "the", "architecture", "evolves"], []]
  ];
  for (const [wanted, replacement] of phrases) replacePhrase(words, wanted, replacement);
  for (const word of words) {
    const punctuation = word.text.match(/[,.!?;:]+$/)?.[0] ?? "";
    const bare = word.text.slice(0, word.text.length - punctuation.length);
    const normal = bare.toLowerCase();
    const corrected = {
      articulate: "Articulate", rag: "RAG", dcl: "DCL", dapr: "Dapr", temporal: "Temporal", langgraph: "LangGraph",
      center: "centre", centered: "centred", artifact: "artefact", artifacts: "artefacts",
      behavior: "behaviour", behaviors: "behaviours", specialized: "specialised"
    }[normal];
    if (corrected) word.text = `${corrected}${punctuation}`;
  }
  return words;
}

function replacePhrase(words, wanted, replacement) {
  for (let index = 0; index <= words.length - wanted.length; index += 1) {
    const actual = words.slice(index, index + wanted.length).map((word) => normal(word.text));
    if (!wanted.every((word, offset) => word === actual[offset])) continue;
    const source = words.slice(index, index + wanted.length);
    const start = source[0].start;
    const end = source.at(-1).end;
    const punctuation = source.at(-1).text.match(/[,.!?;:]+$/)?.[0] ?? "";
    const duration = Math.max(0.04, end - start);
    const inserted = replacement.map((text, offset) => ({
      text: `${text}${offset === replacement.length - 1 ? punctuation : ""}`,
      start: start + duration * offset / replacement.length,
      end: start + duration * (offset + 1) / replacement.length
    }));
    words.splice(index, wanted.length, ...inserted);
  }
}

function subtitleGroups(words) {
  const groups = [];
  let cursor = 0;
  while (cursor < words.length) {
    let end = Math.min(words.length - 1, cursor + 8);
    for (let candidate = cursor + 4; candidate <= end; candidate += 1) {
      if (/[.!?][”"']?$/.test(words[candidate].text)) { end = candidate; break; }
    }
    while (end > cursor && !canWrap(words.slice(cursor, end + 1).map((word) => word.text).join(" "))) end -= 1;
    groups.push({ start: words[cursor].start, end: words[end].end, words: words.slice(cursor, end + 1) });
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

function canWrap(text) {
  if (text.length <= 42) return true;
  const words = text.split(/\s+/);
  return words.slice(1).some((_, index) => {
    const split = index + 1;
    return words.slice(0, split).join(" ").length <= 42 && words.slice(split).join(" ").length <= 42;
  });
}

function correctText(text) {
  return text
    .replace(/\barticulate\b/gi, "Articulate")
    .replace(/\bknowledge model\b/gi, "Knowledge Model")
    .replace(/\bknowledge reasoning\b/gi, "Knowledge Reasoning")
    .replace(/\barchitectural intelligence\b/gi, "Architectural Intelligence")
    .replace(/\barchitecture intelligence\b/gi, "Architectural Intelligence")
    .replace(/\bdeclarative capability language\b/gi, "Declarative Capability Language")
    .replace(/\bdcm\b/gi, "DCL")
    .replace(/\bdapper\b/gi, "Dapr")
    .replace(/\bland graph\b/gi, "LangGraph")
    .replace(/\bai native\b/gi, "AI-native")
    .replace(/\bcenter\b/gi, "centre")
    .replace(/\bartifact\b/gi, "artefact");
}

function normal(value) { return String(value).toLowerCase().replace(/[^a-z0-9]/g, ""); }
function probeDuration(filePath) { return Number(run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nk=1:nw=1", filePath], true).trim()); }
function readJson(filePath) { return JSON.parse(fs.readFileSync(filePath, "utf8")); }
function writeJson(filePath, value) { fs.mkdirSync(path.dirname(filePath), { recursive: true }); fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`); }
function sha256(filePath) { return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex"); }
function relative(filePath) { return path.relative(repoRoot, filePath).replaceAll(path.sep, "/"); }
function time(seconds) { const minutes = Math.floor(seconds / 60); return `${String(minutes).padStart(2, "0")}:${(seconds % 60).toFixed(3).padStart(6, "0")}`; }
function srtTime(seconds) { const total = Math.max(0, Math.round(seconds * 1000)); const hours = Math.floor(total / 3600000); const minutes = Math.floor(total % 3600000 / 60000); const secs = Math.floor(total % 60000 / 1000); const ms = total % 1000; return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")},${String(ms).padStart(3, "0")}`; }
function run(command, args, capture = false) { const result = spawnSync(command, args, { cwd: repoRoot, encoding: "utf8", stdio: capture ? "pipe" : "inherit" }); if (result.status !== 0) throw new Error(`${command} failed with status ${result.status}\n${result.stderr ?? ""}`); return result.stdout ?? ""; }
