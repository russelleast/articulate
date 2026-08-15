#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { alignSections, normaliseWhisperTranscript } from "../../../runtime/transcript-alignment.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../..");
const episodeDirectory = path.join(repoRoot, "production/episodes/0012");
const plan = readJson(path.join(episodeDirectory, "scene-plan.yaml"));
const mediaPath = path.join(repoRoot, plan.episode.presenterMedia);
const rawPath = path.join(here, "raw-transcription/episode-0012-presenter-whisper-base-en.json");
const duration = Number(run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nk=1:nw=1", mediaPath]).trim());

const transcript = normaliseWhisperTranscript(readJson(rawPath), {
  audio: plan.episode.presenterMedia,
  model: "whisper.cpp base.en"
});
transcript.segments = transcript.segments.map((segment) => ({ ...segment, text: correctText(segment.text) }));
const alignment = alignSections(transcript, plan.sections, duration);
const sections = new Map(alignment.sections.map((section) => [section.id, section]));
const scenes = plan.scenes.map((scene, index) => ({
  id: scene.id,
  title: scene.headline,
  kind: scene.kind,
  ...(scene.diagramAssetId ? { diagramAssetId: scene.diagramAssetId, visualStateMode: "complete-diagram" } : {}),
  headline: scene.headline,
  support: scene.support,
  items: scene.items ?? [],
  ...(scene.id === "S015" ? { teachingLayout: "vertical-list" } : {}),
  companion: false,
  assetIds: scene.diagramAssetId ? ["A002", "A003"] : index === 0 ? ["A001", "A002"] : ["A002"],
  transition: scene.transition,
  timeline: { connectorTiming: "with-destination", events: [] },
  shots: [{ id: "section", label: sections.get(scene.section).title, at: 0, events: [] }]
}));

const markers = {
  version: 2,
  authority: "continuous-presenter-media",
  mediaDurationSeconds: duration,
  selectedDurationSeconds: duration,
  frameRate: 30,
  scenes: plan.scenes.map((scene) => {
    const section = sections.get(scene.section);
    return { id: scene.id, startSeconds: section.start, endSeconds: section.end, narrationReference: `${section.title} · ${section.narrativeSegments.join(", ")}` };
  })
};

const config = {
  version: 3,
  episode: {
    id: "episode-0012",
    title: plan.episode.title,
    journalSource: plan.episode.writtenSource,
    narrativeSource: plan.episode.narrativeSource,
    storyboard: "production/episodes/0012/storyboard.yaml",
    timingMarkers: "production/episodes/0012/production/presenter-v1-markers.json",
    assetRegister: "production/episodes/0012/asset-register.yaml",
    scenePlan: "production/episodes/0012/scene-plan.yaml",
    timeline: "production/episodes/0012/timeline.json"
  },
  presenter: {
    implementation: "continuous-video",
    assetId: "episode-0012-presenter-v1",
    expectedSha256: sha256(mediaPath),
    expectedDurationSeconds: duration,
    audio: "embedded",
    audioNormalization: { mode: "ebu-r128", integratedLoudness: -16, loudnessRange: 7, truePeak: -1.5, sampleRateHz: 48000 },
    startOffsetSeconds: 0,
    endOffsetSeconds: duration,
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
    safeCrop: { source: { width: 1280, height: 720, aspectRatio: "16:9" }, note: "Established presenter framing: complete source scaled to 780x439 and anchored lower-left." }
  },
  rendering: { visualGrammarProfile: "articulate-visual-grammar-v2", productionMetadata: false },
  review: { includeTimelineStates: true, temporalSampleSeconds: 15 },
  output: {
    width: 1920,
    height: 1080,
    frameRate: 30,
    video: "production/episodes/0012/output/episode-0012-final.mp4",
    generatedDirectory: "production/episodes/0012/generated/presenter-v1",
    reviewDirectory: "production/episodes/0012/output/review/presenter-v1",
    narrationAnalysis: "production/episodes/0012/production/presenter-v1-analysis.json"
  },
  scenes
};

const storyboard = {
  version: 2,
  episode: { id: "0012", title: plan.episode.title, written_source: plan.episode.writtenSource, narrative_source: plan.episode.narrativeSource, scene_plan: "production/episodes/0012/scene-plan.yaml", production_status: "presenter-v1" },
  timing: { authority: "recorded-audio", audio_duration_seconds: duration },
  scenes: plan.scenes.map((scene) => {
    const section = sections.get(scene.section);
    return { id: scene.id, title: scene.headline, archetype: scene.archetype, kind: scene.kind, narrative_segments: section.narrativeSegments, start_seconds: section.start, end_seconds: section.end };
  })
};
const timeline = { version: 2, generatedFrom: "production/episodes/0012/scene-plan.yaml", authority: "recorded-presenter", selectedDurationSeconds: duration, scenes: markers.scenes.map((marker, index) => ({ ...marker, archetype: plan.scenes[index].archetype, kind: plan.scenes[index].kind, transition: plan.scenes[index].transition })) };
const sceneList = { episode: { id: "episode-0012", title: plan.episode.title, production_status: "presenter-v1", timing_authority: "episode-0012-presenter-v1", narration_duration_seconds: duration }, scenes: storyboard.scenes.map((scene) => ({ scene_id: scene.id, start_seconds: scene.start_seconds, end_seconds: scene.end_seconds, visual_type: scene.archetype, presenter_mode: scene.kind === "presenter-focus" ? "visible" : "audio-continuous", diagram_asset: scenes.find((item) => item.id === scene.id)?.diagramAssetId ?? null })) };

writeJson(path.join(episodeDirectory, "transcript.json"), transcript);
writeJson(path.join(episodeDirectory, "alignment.json"), alignment);
writeJson(path.join(episodeDirectory, "timeline.json"), timeline);
writeJson(path.join(episodeDirectory, "episode.json"), config);
writeJson(path.join(episodeDirectory, "storyboard.yaml"), storyboard);
writeJson(path.join(episodeDirectory, "storyboard-presenter.yaml"), storyboard);
writeJson(path.join(episodeDirectory, "scene-list.yaml"), sceneList);
writeJson(path.join(here, "presenter-v1-markers.json"), markers);
writeJson(path.join(here, "presenter-v1-config.json"), config);
writeSubtitles(transcript, duration);
console.log(`Episode 0012 publication duration: ${duration.toFixed(3)} seconds`);

function writeSubtitles(source, mediaDuration) {
  const words = correctedWords(source);
  const groups = [];
  for (let cursor = 0; cursor < words.length;) {
    let end = Math.min(words.length - 1, cursor + 8);
    for (let candidate = cursor + 4; candidate <= end; candidate += 1) if (/[.!?]$/.test(words[candidate].text)) { end = candidate; break; }
    while (end > cursor && !canWrap(words.slice(cursor, end + 1).map((word) => word.text).join(" "))) end -= 1;
    groups.push({ start: words[cursor].start, end: words[end].end, words: words.slice(cursor, end + 1) });
    cursor = end + 1;
  }
  const cues = groups.map((group, index) => {
    const start = Math.max(index ? groups[index - 1].end + 0.04 : 0, group.start - 0.04);
    const nextStart = groups[index + 1]?.start ?? mediaDuration;
    const end = Math.min(mediaDuration, Math.max(start + 0.8, Math.min(group.end + 0.12, nextStart - 0.04)));
    return { start, end, text: wrapTwoLines(group.words.map((word) => word.text).join(" ")) };
  });
  const srt = cues.map((cue, index) => `${index + 1}\n${srtTime(cue.start)} --> ${srtTime(cue.end)}\n${cue.text}\n`).join("\n");
  const plain = words.map((word) => word.text).join(" ").replace(/\s+([,.;:!?])/g, "$1");
  const publication = path.join(episodeDirectory, "publication/subtitles");
  fs.mkdirSync(publication, { recursive: true });
  fs.mkdirSync(path.join(episodeDirectory, "output"), { recursive: true });
  fs.writeFileSync(path.join(publication, "episode-0012-en.srt"), srt);
  fs.writeFileSync(path.join(publication, "episode-0012-transcript.txt"), `${plain}\n`);
  fs.writeFileSync(path.join(episodeDirectory, "output/episode-0012-final.srt"), srt);
  fs.writeFileSync(path.join(publication, "episode-0012-subtitle-validation.md"), "# Episode 0012 Subtitle Validation\n\n- Source: final continuous presenter recording\n- Timing: local Whisper word timestamps\n- Language: British English\n- Maximum lines: two\n- Maximum line length: 42 characters\n- Terminology checked: Articulate, AI-native, Knowledge Model, ADR, durable execution and human-in-the-loop\n");
}

function correctedWords(source) {
  const words = [];
  for (const segment of source.segments) for (const token of segment.words) {
    if (token.text.startsWith("[_")) continue;
    const cleaned = token.text.replace(/[^A-Za-z0-9'-]/g, "");
    if (!cleaned) { if (words.length && /[,.!?;:]/.test(token.text)) words.at(-1).text += token.text.trim(); continue; }
    if (/^\s/.test(token.text) || !words.length) words.push({ text: cleaned, start: token.start, end: token.end });
    else { words.at(-1).text += cleaned; words.at(-1).end = token.end; }
  }
  for (const word of words) {
    const punctuation = word.text.match(/[,.!?;:]+$/)?.[0] ?? "";
    const bare = word.text.slice(0, word.text.length - punctuation.length);
    const corrected = { articulate: "Articulate", adr: "ADR", dcl: "DCL", center: "centre", centered: "centred", artifact: "artefact", artifacts: "artefacts", behavior: "behaviour", behaviors: "behaviours" }[bare.toLowerCase()];
    if (corrected) word.text = `${corrected}${punctuation}`;
  }
  replacePhrase(words, ["knowledge", "model"], ["Knowledge", "Model"]);
  replacePhrase(words, ["ai", "native"], ["AI-native"]);
  replacePhrase(words, ["human", "in", "the", "loop"], ["human-in-the-loop"]);
  replacePhrase(words, ["a", "d", "r"], ["ADR"]);
  replacePhrase(words, ["knowledge", "belongs", "to", "the", "knowledge", "of", "ainative", "architecture", "knowledge", "model"], ["Knowledge", "belongs", "to", "the", "Knowledge", "Model"]);
  replacePhrase(words, ["embedings"], ["Embeddings"]);
  replacePhrase(words, ["analyzing"], ["analysing"]);
  replacePhrase(words, ["knowledge", "models", "still", "exist"], ["Knowledge", "Model", "still", "exists"]);
  replacePhrase(words, ["they", "have", "a", "slightly", "different", "problem"], ["we", "have", "a", "slightly", "different", "problem"]);
  replacePhrase(words, ["forms", "of", "state", "that", "were", "explored", "in", "a", "previous", "episode"], ["forms", "of", "state", "I", "explored", "in", "the", "previous", "episode"]);
  replacePhrase(words, ["isnt", "simply", "another", "form", "of", "memory"], ["Execution state isn't", "simply", "another", "form", "of", "memory"]);
  replacePhrase(words, ["something", "the", "same", "notification", "twice"], ["Sending", "the", "same", "notification", "twice"]);
  replacePhrase(words, ["keeping", "a", "process", "alive", "while", "it", "waits", "is", "really", "the", "answer"], ["Keeping", "a", "process", "alive", "while", "it", "waits", "isn't", "really", "the", "answer"]);
  replacePhrase(words, ["state", "the", "agent", "originally", "reasoned", "may"], ["state", "the", "agent", "originally", "reasoned", "over", "may"]);
  replacePhrase(words, ["adr1"], ["ADR", "0001"]);
  replacePhrase(words, ["runtime", "articulates", "eventually", "uses"], ["runtime", "Articulate", "eventually", "uses"]);
  replacePhrase(words, ["which", "agent", "runtime", "articulates", "you", "to", "use"], ["which", "agent", "runtime", "Articulate", "should", "use"]);
  replacePhrase(words, ["architecture", "ill", "articulate", "actually", "needs"], ["architecture", "Articulate", "actually", "needs"]);
  return words;
}
function replacePhrase(words, wanted, replacement) {
  for (let index = 0; index <= words.length - wanted.length; index += 1) {
    const actual = words.slice(index, index + wanted.length).map((word) => word.text.toLowerCase().replace(/[^a-z0-9]/g, ""));
    if (!wanted.every((word, offset) => word === actual[offset])) continue;
    const source = words.slice(index, index + wanted.length); const start = source[0].start; const end = source.at(-1).end; const punctuation = source.at(-1).text.match(/[,.!?;:]+$/)?.[0] ?? ""; const span = Math.max(0.04, end - start);
    words.splice(index, wanted.length, ...replacement.map((text, offset) => ({ text: `${text}${offset === replacement.length - 1 ? punctuation : ""}`, start: start + span * offset / replacement.length, end: start + span * (offset + 1) / replacement.length })));
  }
}
function correctText(text) { return text.replace(/Knowledge belongs to the knowledge of AI-native architecture\. Knowledge Model/gi, "Knowledge belongs to the Knowledge Model").replace(/\bembedings\b/gi, "Embeddings").replace(/\banalyzing\b/gi, "analysing").replace(/\bknowledge models still exist\b/gi, "Knowledge Model still exists").replace(/\bADR1\b/gi, "ADR 0001").replace(/\barticulates\b/gi, "Articulate").replace(/\barticulate\b/gi, "Articulate").replace(/\bknowledge model\b/gi, "Knowledge Model").replace(/\bai native\b/gi, "AI-native").replace(/\bhuman in the loop\b/gi, "human-in-the-loop").replace(/\ba d r\b/gi, "ADR"); }
function wrapTwoLines(text) { if (text.length <= 42) return text; const words = text.split(/\s+/); let best; for (let split = 1; split < words.length; split += 1) { const first = words.slice(0, split).join(" "); const second = words.slice(split).join(" "); if (first.length <= 42 && second.length <= 42 && (!best || Math.abs(first.length - second.length) < best.score)) best = { first, second, score: Math.abs(first.length - second.length) }; } return best ? `${best.first}\n${best.second}` : text; }
function canWrap(text) { if (text.length <= 42) return true; const words = text.split(/\s+/); return words.slice(1).some((_, index) => words.slice(0, index + 1).join(" ").length <= 42 && words.slice(index + 1).join(" ").length <= 42); }
function srtTime(seconds) { const total = Math.max(0, Math.round(seconds * 1000)); return `${String(Math.floor(total / 3600000)).padStart(2, "0")}:${String(Math.floor(total % 3600000 / 60000)).padStart(2, "0")}:${String(Math.floor(total % 60000 / 1000)).padStart(2, "0")},${String(total % 1000).padStart(3, "0")}`; }
function readJson(filePath) { return JSON.parse(fs.readFileSync(filePath, "utf8")); }
function writeJson(filePath, value) { fs.mkdirSync(path.dirname(filePath), { recursive: true }); fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`); }
function sha256(filePath) { return run("shasum", ["-a", "256", filePath]).trim().split(/\s+/)[0]; }
function run(command, args) { const result = spawnSync(command, args, { cwd: repoRoot, encoding: "utf8" }); if (result.status !== 0) throw new Error(result.stderr); return result.stdout; }
