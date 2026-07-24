#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../../..");
const markers = readJson(path.join(scriptDir, "rough-cut-01-markers.json"));
const masterAudio = path.join(repoRoot, "production/episodes/0003/audio/ep3-what-is-ai-native.wav");
const narrativePath = path.join(repoRoot, "production/episodes/0003/narrative.md");
const cacheDir = path.join(repoRoot, "production/cache/episode-0003/rough-cut-01-companion");
const timelineDir = path.join(scriptDir, "rough-cut-01-companion");
const subtitleDir = path.join(repoRoot, "production/episodes/0003/publication/subtitles");
const companionSceneIds = new Set(["S001", "S008", "S017", "S019"]);

if (!fs.existsSync(masterAudio)) throw new Error(`Missing approved narration: ${masterAudio}`);
fs.mkdirSync(cacheDir, { recursive: true });
fs.mkdirSync(timelineDir, { recursive: true });
fs.mkdirSync(subtitleDir, { recursive: true });

for (const marker of markers.scenes.filter((scene) => companionSceneIds.has(scene.id))) {
  const duration = marker.endSeconds - marker.startSeconds;
  const extract = path.join(cacheDir, `${marker.id}.wav`);
  const timeline = path.join(timelineDir, `${marker.id}.json`);
  run("ffmpeg", [
    "-y", "-v", "error", "-i", masterAudio, "-ss", marker.startSeconds.toFixed(6),
    "-t", duration.toFixed(6), "-ac", "1", "-c:a", "pcm_s16le", extract
  ]);
  run("node", [
    path.join(repoRoot, "production/runtime/companion-performance-cli.mjs"), "analyse",
    "--audio", relative(extract), "--output", timeline,
    "--source-start", marker.startSeconds.toFixed(6), "--motion-profile", "longform",
    "--seed", String(3000 + Number(marker.id.slice(1)))
  ]);
}

const narrativeSections = parseSections(fs.readFileSync(narrativePath, "utf8"));
const sections = [
  ["Introduction", 0, 636.936],
  ["Looking Ahead", 636.936, markers.audioDurationSeconds]
];
const cues = [];
for (const [title, start, end] of sections) {
  const text = narrativeSections.get(title);
  if (!text) throw new Error(`Missing narrative section: ${title}`);
  const chunks = subtitleChunks(text);
  const weights = chunks.map((chunk) => Math.max(1.5, wordCount(chunk) / 2.3 + 0.32));
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let cursor = start;
  chunks.forEach((text, index) => {
    const cueEnd = index === chunks.length - 1 ? end : cursor + (end - start) * weights[index] / totalWeight;
    cues.push({ start: cursor, end: cueEnd, text });
    cursor = cueEnd;
  });
}

const srtPath = path.join(subtitleDir, "episode-0003-en.srt");
const transcriptPath = path.join(subtitleDir, "episode-0003-transcript.txt");
fs.writeFileSync(srtPath, cues.map((cue, index) => `${index + 1}\n${srtTime(cue.start)} --> ${srtTime(cue.end)}\n${wrap(cue.text)}\n`).join("\n"));
fs.writeFileSync(transcriptPath, `${[...narrativeSections.values()].join("\n\n")}\n`);

console.log(`Episode 0003 Rough Cut 01 Companion timelines: ${relative(timelineDir)}`);
console.log(`Episode 0003 subtitles: ${relative(srtPath)} (${cues.length} cues)`);

function parseSections(markdown) {
  const result = new Map();
  for (const block of markdown.split(/^## /m).slice(1)) {
    const newline = block.indexOf("\n");
    result.set(block.slice(0, newline).trim(), clean(block.slice(newline + 1)));
  }
  return result;
}

function clean(text) {
  return text.replace(/\*\*/g, "").replace(/\s+/g, " ").trim();
}

function subtitleChunks(text) {
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((item) => item.trim()).filter(Boolean) ?? [];
  return sentences.flatMap((sentence) => {
    const words = sentence.split(/\s+/);
    if (words.length <= 12) return [sentence];
    const chunks = [];
    for (let index = 0; index < words.length; index += 10) chunks.push(words.slice(index, index + 10).join(" "));
    return chunks;
  });
}

function wrap(text, width = 42) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    if (line && `${line} ${word}`.length > width) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines.join("\n");
}

function wordCount(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function srtTime(seconds) {
  const milliseconds = Math.round(seconds * 1000);
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor(milliseconds % 3600000 / 60000);
  const secs = Math.floor(milliseconds % 60000 / 1000);
  const ms = milliseconds % 1000;
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)},${String(ms).padStart(3, "0")}`;
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function relative(filePath) {
  return path.relative(repoRoot, filePath).replaceAll(path.sep, "/");
}

function run(command, args) {
  const result = spawnSync(command, args, { cwd: repoRoot, stdio: "inherit" });
  if (result.status !== 0) throw new Error(`${command} failed with status ${result.status}`);
}
