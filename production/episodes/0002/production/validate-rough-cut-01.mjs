#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../../..");
const config = read("rough-cut-01-config.json");
const markers = read("rough-cut-01-markers.json");
const sceneById = new Map(config.scenes.map((scene) => [scene.id, scene]));
const companionIds = ["S001", "S005", "S008", "S013", "S015", "S017"];

if (markers.scenes.length !== 17) throw new Error("Episode 0002 rough cut must contain 17 editorial scenes");
if (markers.scenes[0].startSeconds !== 0 || markers.scenes.at(-1).endSeconds !== config.narration.expectedDurationSeconds) {
  throw new Error("Scene markers must cover the complete authoritative narration");
}
for (let index = 1; index < markers.scenes.length; index++) {
  if (markers.scenes[index - 1].endSeconds !== markers.scenes[index].startSeconds) throw new Error("Scene markers contain a gap or overlap");
}
if (/placeholder/i.test(JSON.stringify(config))) throw new Error("Rough-cut config contains a placeholder");

for (const sceneId of companionIds) {
  const timeline = JSON.parse(fs.readFileSync(path.resolve(repoRoot, sceneById.get(sceneId).companionPerformance.timeline), "utf8"));
  if (!timeline.layers.includes("lip-sync") || !timeline.events.some((event) => event.type === "mouth")) {
    throw new Error(`${sceneId} must contain audio-derived simplified-viseme lip sync`);
  }
  const marker = markers.scenes.find((candidate) => candidate.id === sceneId);
  if (Math.abs(timeline.source.sourceStartSeconds - marker.startSeconds) > 0.000001) throw new Error(`${sceneId} lip sync source offset is incorrect`);
}

const srtPath = path.join(repoRoot, "production/episodes/0002/publication/subtitles/episode-0002-en.srt");
const srt = fs.readFileSync(srtPath, "utf8");
const timings = [...srt.matchAll(/(\d\d:\d\d:\d\d,\d{3}) --> (\d\d:\d\d:\d\d,\d{3})/g)];
if (!timings.length || timings[0][1] !== "00:00:00,000" || timings.at(-1)[2] !== "00:06:36,846") {
  throw new Error("Subtitles must cover the complete narration timeline");
}
for (const line of srt.split("\n")) {
  if (!line.includes(" --> ") && !/^\d*$/.test(line) && line.length > 42) throw new Error(`Subtitle line exceeds 42 characters: ${line}`);
}

const companionSeconds = markers.scenes.filter((scene) => companionIds.includes(scene.id)).reduce((sum, scene) => sum + scene.endSeconds - scene.startSeconds, 0);
console.log(`Episode 0002 Rough Cut 01 validation passed: 17 scenes, six lip-sync scenes, ${companionSeconds.toFixed(3)}s Companion screen time, full subtitle coverage.`);

function read(file) { return JSON.parse(fs.readFileSync(path.resolve(scriptDir, file), "utf8")); }
