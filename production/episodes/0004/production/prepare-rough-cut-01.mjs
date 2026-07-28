#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  cueTime,
  normaliseWhisperTranscript,
  writeTranscriptSrt
} from "../../../runtime/transcript-alignment.mjs";
import {
  buildSourceAlignment,
  compileTimeline,
  extractMarkdownSections,
  validateScenePlan
} from "../../../runtime/pre-render-workflow.mjs";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../../..");
const episodeDir = path.join(repoRoot, "production/episodes/0004");
const plan = readJson(path.join(episodeDir, "scene-plan.yaml"));
const audioPath = path.join(repoRoot, plan.episode.audio);
const rawPath = path.join(scriptDir, "raw-transcription/episode-0004-whisper-base-en.json");
const audioDurationSeconds = probeDuration(audioPath);
const audioSha256 = sha256(audioPath);
const transcript = normaliseWhisperTranscript(readJson(rawPath), {
  audio: plan.episode.audio,
  model: "whisper.cpp base.en",
  corrections: {
    "characteristic of AI native systems is that they often promise": "characteristic of AI-native systems is that they often optimise",
    "A streamed response that starts immediately usually fails faster than": "A streamed response that starts immediately usually feels faster than",
    "building context, receiving knowledge, selecting tools, calling those": "building context, retrieving knowledge, selecting tools, calling those",
    "background workers and petitioning. Those ideas remain just as": "background workers and partitioning. Those ideas remain just as",
    "Essentially, that simplicity starts working against us. The context": "Eventually, that simplicity starts working against us. The context",
    "AI native systems require much higher visibility. We need to understand": "AI-native systems require much richer visibility. We need to understand",
    "the intelligence behavior.": "intelligent behaviour.",
    "models that implement them. Architecture should make placement possible": "models that implement them. Architecture should make replacement possible"
  }
});
const writtenSections = extractMarkdownSections(
  fs.readFileSync(path.join(repoRoot, plan.episode.writtenSource), "utf8"),
  { includePreamble: true }
);
const narrativeSections = extractMarkdownSections(
  fs.readFileSync(path.join(repoRoot, plan.episode.narrativeSource), "utf8")
);
const alignment = buildSourceAlignment({
  transcript,
  specifications: plan.sections,
  writtenSections,
  narrativeSections,
  audioDurationSeconds
});
const alignmentById = new Map(alignment.sections.map((section) => [section.id, section]));
const markers = {
  version: 1,
  authority: "recorded-audio",
  audioDurationSeconds,
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

const scenes = plan.scenes.map((scene, index) => {
  const section = alignmentById.get(scene.section);
  const reveals = new Map();
  const events = [];
  for (const [cueIndex, cue] of (scene.beats ?? scene.cues ?? []).entries()) {
    const phrase = cue.alignTo ?? cue.phrase;
    const at = Math.min(section.end - section.start - 0.04, cueTime(transcript, phrase, section, cueIndex * 1.2));
    if (!reveals.has(cue.target)) {
      reveals.set(cue.target, at);
      events.push({
        id: cue.id ?? `${scene.id.toLowerCase()}-${cue.action ?? "reveal"}-${cue.target}`,
        at,
        action: rendererAction(cue.action ?? "reveal"),
        target: cue.target,
        sourcePhrase: phrase
      });
    }
  }
  for (const [connectionIndex, [from, to]] of (scene.connections ?? []).entries()) {
    events.push({
      id: `${scene.id.toLowerCase()}-connect-${connectionIndex + 1}`,
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
    ...(scene.studioLayout ? { studioLayout: scene.studioLayout } : {}),
    ...(scene.focusLayout ? { focusLayout: scene.focusLayout } : {}),
    ...(scene.diagramLayout ? { diagramLayout: scene.diagramLayout } : {}),
    ...(scene.diagramAssetId ? { diagramAssetId: scene.diagramAssetId } : {}),
    headline: scene.headline,
    support: scene.support,
    items: scene.items ?? [],
    ...(scene.evidence ? { evidence: scene.evidence } : {}),
    companion: scene.companion === true,
    assetIds: [`A${String(index + 1).padStart(3, "0")}`],
    transition: scene.transition,
    ...(scene.companion ? {
      motion: { companionIdle: { periodFrames: 165, translateYPixels: 3, scaleAmplitude: 0.006 } },
      companionPerformance: { timeline: `production/episodes/0004/production/rough-cut-01-companion/${scene.id}.json` }
    } : {}),
    timeline: { connectorTiming: "with-destination", events },
    shots: [{ id: "section", label: section.title, at: 0, events: [] }]
  };
});

const renderConfig = {
  version: 3,
  episode: {
    id: "episode-0004",
    title: plan.episode.title,
    journalSource: plan.episode.writtenSource,
    narrativeSource: plan.episode.narrativeSource,
    storyboard: "production/episodes/0004/storyboard.yaml",
    timingMarkers: "production/episodes/0004/production/rough-cut-01-markers.json",
    assetRegister: "production/episodes/0004/asset-register.yaml"
  },
  narration: {
    assetId: "episode-0004-narration-v1",
    expectedSha256: audioSha256,
    expectedDurationSeconds: audioDurationSeconds,
    preserveWholeRecording: true
  },
  companion: {
    assetId: "companion-v1-neutral",
    performanceAssets: {
      open: "companion-v1-mouth-open",
      wide: "companion-v1-mouth-wide",
      rounded: "companion-v1-mouth-rounded",
      teeth: "companion-v1-mouth-teeth"
    }
  },
  rendering: { visualGrammarProfile: "articulate-visual-grammar-v1", productionMetadata: false },
  review: { includeTimelineStates: true, temporalSampleSeconds: 12 },
  output: {
    width: 1920,
    height: 1080,
    frameRate: 25,
    video: "production/episodes/0004/output/episode-0004-rough-cut-01.mp4",
    generatedDirectory: "production/episodes/0004/generated/rough-cut-01",
    reviewDirectory: "production/episodes/0004/output/review/rough-cut-01",
    narrationAnalysis: "production/episodes/0004/production/narration-analysis.json"
  },
  scenes
};

const storyboard = {
  version: 1,
  episode: {
    id: "0004",
    title: plan.episode.title,
    written_source: plan.episode.writtenSource,
    narrative_source: plan.episode.narrativeSource,
    production_status: "rough-cut-01"
  },
  timing: { authority: "recorded-audio", audio_duration_seconds: audioDurationSeconds },
  scenes: plan.scenes.map((scene) => {
    const section = alignmentById.get(scene.section);
    return {
      id: scene.id,
      title: scene.headline,
      narrative_segments: section.narrativeSegments,
      start_seconds: section.start,
      end_seconds: section.end
    };
  })
};

const timeline = compileTimeline(plan, transcript, alignment, { allowDraft: true });
timeline.transcript = "production/episodes/0004/transcript.json";
timeline.alignment = "production/episodes/0004/alignment.json";
timeline.scenePlan = "production/episodes/0004/scene-plan.yaml";

plan.__transcript = transcript;
const preRenderValidation = validateScenePlan(plan, { repoRoot, alignment, requireRenderedDiagrams: false });
delete plan.__transcript;
if (!preRenderValidation.valid) {
  throw new Error(`Scene-plan validation failed:\n- ${preRenderValidation.errors.join("\n- ")}`);
}

writeJson(path.join(episodeDir, "transcript.json"), transcript);
writeJson(path.join(episodeDir, "alignment.json"), alignment);
writeJson(path.join(episodeDir, "timeline.json"), timeline);
writeJson(path.join(episodeDir, "storyboard.yaml"), storyboard);
writeJson(path.join(scriptDir, "rough-cut-01-markers.json"), markers);
writeJson(path.join(scriptDir, "rough-cut-01-config.json"), renderConfig);
writeTranscriptSrt(path.join(episodeDir, "publication/subtitles/episode-0004-en.srt"), transcript, audioDurationSeconds);
fs.writeFileSync(
  path.join(episodeDir, "publication/subtitles/episode-0004-transcript.txt"),
  `${transcript.segments.map((segment) => `[${time(segment.start)}–${time(segment.end)}] ${segment.text}`).join("\n")}\n`
);

const cacheDir = path.join(repoRoot, "production/cache/episode-0004/rough-cut-01-companion");
const performanceDir = path.join(scriptDir, "rough-cut-01-companion");
fs.mkdirSync(cacheDir, { recursive: true });
fs.mkdirSync(performanceDir, { recursive: true });
for (const marker of markers.scenes.filter((candidate) => plan.scenes.find((scene) => scene.id === candidate.id).companion)) {
  const extract = path.join(cacheDir, `${marker.id}.wav`);
  run("ffmpeg", [
    "-y", "-v", "error", "-i", audioPath, "-ss", marker.startSeconds.toFixed(3),
    "-t", (marker.endSeconds - marker.startSeconds).toFixed(3), "-ac", "1", "-c:a", "pcm_s16le", extract
  ]);
  run("node", [
    path.join(repoRoot, "production/runtime/companion-performance-cli.mjs"), "analyse",
    "--audio", relative(extract), "--output", path.join(performanceDir, `${marker.id}.json`),
    "--source-start", marker.startSeconds.toFixed(3), "--motion-profile", "longform",
    "--seed", String(4000 + Number(marker.id.slice(1)))
  ]);
}

console.log(`Episode 0004 transcript: ${relative(path.join(episodeDir, "transcript.json"))}`);
console.log(`Episode 0004 alignment: ${relative(path.join(episodeDir, "alignment.json"))}`);
console.log(`Episode 0004 timeline: ${relative(path.join(episodeDir, "timeline.json"))}`);
console.log(`Episode 0004 render config: ${relative(path.join(scriptDir, "rough-cut-01-config.json"))}`);

function probeDuration(filePath) {
  const output = run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nk=1:nw=1", filePath], true);
  return Number(output.trim());
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function sha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function relative(filePath) {
  return path.relative(repoRoot, filePath).replaceAll(path.sep, "/");
}

function time(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainder = (seconds % 60).toFixed(3).padStart(6, "0");
  return `${String(minutes).padStart(2, "0")}:${remainder}`;
}

function rendererAction(action) {
  return { emphasise: "emphasize", deemphasise: "deemphasize" }[action] ?? action;
}

function run(command, args, capture = false) {
  const result = spawnSync(command, args, { cwd: repoRoot, encoding: "utf8", stdio: capture ? "pipe" : "inherit" });
  if (result.status !== 0) throw new Error(`${command} failed with status ${result.status}\n${result.stderr ?? ""}`);
  return result.stdout ?? "";
}
