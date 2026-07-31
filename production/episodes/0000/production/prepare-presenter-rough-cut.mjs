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

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDirectory, "../../../..");
const episodeDirectory = path.join(repoRoot, "production/episodes/0000");
const planPath = path.join(episodeDirectory, "scene-plan.yaml");
const plan = readJson(planPath);
const mediaPath = path.join(repoRoot, plan.episode.audio);
const rawPath = path.join(scriptDirectory, "raw-transcription/episode-0000-presenter-whisper-base-en.json");
const selectedDurationSeconds = 147.066667;
const mediaSha256 = sha256(mediaPath);
const transcript = normaliseWhisperTranscript(readJson(rawPath), {
  audio: plan.episode.audio,
  model: "whisper.cpp base.en",
  corrections: {
    "genetic systems, AI-native applications, multi-agent architectures, durable execution,": "Agentic systems, AI-native applications, multi-agent architectures, durable execution,",
    "maintainable in a real world? That's the question behind Articulate. Articulate isn't a demo project": "maintainable in the real world? That's the question behind Articulate. Articulate isn't a demo project",
    "architect. More importantly, this journal isn't a retrospective. I'm not waiting until everything's": "architect. More importantly, this journal isn't a retrospective. I'm not waiting until everything is",
    "the best decision is to change direction because that's all part of architecture. A continuous": "the best decision is to change direction because that's part of architecture. A continuous",
    "process of learning, questioning and defining. Throughout this journal, I'll explore the principles": "process of learning, questioning and refining. Throughout this journal, I'll explore the principles",
    "against real architecture requirements and gradually build Articulate into a working platform.": "against real architectural requirements and gradually build Articulate into a working platform.",
    "Some episodes will focus on concepts. Some will follow architecture decisions from the": "Some episodes will focus on concepts. Others will follow architectural decisions from the",
    "original question through to implementation. The software is important, but the reasoning": "original question through to implementation. The software is important, but the reasoning",
    "behind the software is where I really want to preserve. If you're interested in software": "behind the software is what I really want to preserve. If you're interested in software",
    "architecture, AI-native systems will simply want to follow the design of a complex system as it": "architecture, AI-native systems, or simply want to follow the design of a complex system as it",
    "evolves, then I hope you enjoyed the journey. Welcome to the Articulate Journal.": "evolves, then I hope you'll enjoy the journey. Welcome to the Articulate Journal."
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
  audioDurationSeconds: selectedDurationSeconds
});
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
    ...(scene.compositionMode ? { compositionMode: scene.compositionMode } : {}),
    ...(scene.focusLayout ? { focusLayout: scene.focusLayout } : {}),
    ...(scene.diagramLayout ? { diagramLayout: scene.diagramLayout } : {}),
    ...(scene.diagramAssetId ? { diagramAssetId: scene.diagramAssetId } : {}),
    headline: scene.headline,
    support: scene.support,
    items: scene.items ?? [],
    ...(scene.evidence ? { evidence: scene.evidence } : {}),
    companion: false,
    assetIds: assetIdsFor(scene),
    transition: scene.transition,
    timeline: { connectorTiming: "with-destination", events },
    shots: [{ id: "section", label: section.title, at: 0, events: [] }]
  };
});

const renderConfig = {
  version: 3,
  episode: {
    id: "episode-0000",
    title: plan.episode.title,
    journalSource: plan.episode.writtenSource,
    narrativeSource: plan.episode.narrativeSource,
    narrativeSourceConvention: "legacy",
    storyboard: "production/episodes/0000/storyboard-presenter.yaml",
    timingMarkers: "production/episodes/0000/production/presenter-v2-markers.json",
    assetRegister: "production/episodes/0000/asset-register.yaml",
    scenePlan: "production/episodes/0000/scene-plan.yaml"
  },
  presenter: {
    implementation: "continuous-video",
    assetId: "episode-0000-presenter-v1",
    expectedSha256: mediaSha256,
    expectedDurationSeconds: selectedDurationSeconds,
    audio: "embedded",
    startOffsetSeconds: 0,
    endOffsetSeconds: selectedDurationSeconds,
    background: "#000000",
    framing: {
      "presenter-full": { x: 0, y: 0, width: 1920, height: 1080 },
      "presenter-focus": { x: -20, y: 641, width: 780, height: 439 }
    },
    safeCrop: {
      source: { width: 1280, height: 720, aspectRatio: "16:9" },
      note: "The complete source frame is scaled to 780x439 and anchored lower-left. Focus Canvas content begins to its right."
    }
  },
  rendering: {
    visualGrammarProfile: "articulate-visual-grammar-v2",
    productionMetadata: false
  },
  review: { includeTimelineStates: true, temporalSampleSeconds: 10 },
  output: {
    width: 1920,
    height: 1080,
    frameRate: 30,
    video: "production/episodes/0000/output/episode-0000-presenter-rough-cut-v2.mp4",
    generatedDirectory: "production/episodes/0000/generated/presenter-rough-cut-v2",
    reviewDirectory: "production/episodes/0000/output/review/presenter-rough-cut-v2",
    narrationAnalysis: "production/episodes/0000/production/presenter-v2-analysis.json"
  },
  scenes
};

const storyboard = {
  version: 2,
  episode: {
    id: "0000",
    title: plan.episode.title,
    written_source: plan.episode.writtenSource,
    narrative_source: plan.episode.narrativeSource,
    scene_plan: "production/episodes/0000/scene-plan.yaml",
    production_status: "presenter-rough-cut-v2"
  },
  timing: {
    authority: "continuous-presenter-media",
    media_duration_seconds: selectedDurationSeconds
  },
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

const timeline = compileTimeline(plan, transcript, alignment, { allowDraft: true });
timeline.transcript = "production/episodes/0000/transcript.json";
timeline.alignment = "production/episodes/0000/alignment.json";
timeline.scenePlan = "production/episodes/0000/scene-plan.yaml";

plan.__transcript = transcript;
const validation = validateScenePlan(plan, { repoRoot, alignment, requireRenderedDiagrams: false });
delete plan.__transcript;
if (!validation.valid) {
  throw new Error(`Scene-plan validation failed:\n- ${validation.errors.join("\n- ")}`);
}

writeJson(path.join(episodeDirectory, "transcript.json"), transcript);
writeJson(path.join(episodeDirectory, "alignment.json"), alignment);
writeJson(path.join(episodeDirectory, "timeline.json"), timeline);
writeJson(path.join(episodeDirectory, "storyboard-presenter.yaml"), storyboard);
writeJson(path.join(scriptDirectory, "presenter-v2-markers.json"), markers);
writeJson(path.join(scriptDirectory, "episode-config.json"), renderConfig);
writeTranscriptSrt(
  path.join(episodeDirectory, "publication/subtitles/episode-0000-en.srt"),
  transcript,
  selectedDurationSeconds
);
fs.writeFileSync(
  path.join(episodeDirectory, "publication/subtitles/episode-0000-transcript.txt"),
  `${transcript.segments.map((segment) => `[${time(segment.start)}–${time(segment.end)}] ${segment.text}`).join("\n")}\n`
);

console.log(`Episode 0000 scene plan: ${relative(planPath)}`);
console.log(`Episode 0000 transcript: ${relative(path.join(episodeDirectory, "transcript.json"))}`);
console.log(`Episode 0000 alignment: ${relative(path.join(episodeDirectory, "alignment.json"))}`);
console.log(`Episode 0000 timeline: ${relative(path.join(episodeDirectory, "timeline.json"))}`);
console.log(`Episode 0000 render config: ${relative(path.join(scriptDirectory, "episode-config.json"))}`);

function assetIdsFor(scene) {
  if (scene.kind === "presenter-focus") return ["A001", "A002"];
  if (scene.kind === "workspace") return ["A003"];
  return ["A002"];
}

function rendererAction(action) {
  return { emphasise: "emphasize", deemphasise: "deemphasize" }[action] ?? action;
}

function probeDuration(filePath) {
  return Number(run("ffprobe", [
    "-v", "error", "-show_entries", "format=duration",
    "-of", "default=nk=1:nw=1", filePath
  ], true).trim());
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

function run(command, arguments_, capture = false) {
  const result = spawnSync(command, arguments_, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: capture ? "pipe" : "inherit"
  });
  if (result.status !== 0) {
    throw new Error(`${command} failed with status ${result.status}\n${result.stderr ?? ""}`);
  }
  return result.stdout ?? "";
}
