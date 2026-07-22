#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../../..");
const config = read("rough-cut-01-config.json");
const markers = read("rough-cut-01-markers.json");
const sceneById = new Map(config.scenes.map((scene) => [scene.id, scene]));
const markerById = new Map(markers.scenes.map((scene) => [scene.id, scene]));
const companionIds = ["S001", "S005", "S008", "S013", "S015", "S017"];

if (markers.scenes.length !== 17) throw new Error("Episode 0002 rough cut must contain 17 editorial scenes");
if (markers.scenes[0].startSeconds !== 0 || markers.scenes.at(-1).endSeconds !== config.narration.expectedDurationSeconds) {
  throw new Error("Scene markers must cover the complete authoritative narration");
}
for (let index = 1; index < markers.scenes.length; index++) {
  if (markers.scenes[index - 1].endSeconds !== markers.scenes[index].startSeconds) throw new Error("Scene markers contain a gap or overlap");
}
if (/placeholder/i.test(JSON.stringify(config))) throw new Error("Rough-cut config contains a placeholder");

const reviewedGlobalReveals = new Map([
  ["s1-support", 16], ["s2-title", 18], ["s2-i2", 21], ["s2-i3", 23], ["s2-i4", 24], ["s2-i5", 26], ["s2-support", 32],
  ["s5-i1", 111], ["s5-i2", 118], ["s5-i3", 121],
  ["s6-i1", 126], ["s6-i2", 129], ["s6-i3", 130], ["s6-i4", 133], ["s6-i5", 134],
  ["s7-i1", 156], ["s7-i2", 158], ["s8-i1", 185], ["s8-i2", 190],
  ["s9-i1", 209], ["s9-i2", 213], ["s9-i3", 216],
  ["s11-i1", 256], ["s11-i2", 260], ["s11-i3", 263], ["s11-i4", 267], ["s11-i5", 271],
  ["s12-title", 273], ["s12-i1", 275], ["s12-i2", 280], ["s12-i3", 281], ["s12-i4", 283], ["s12-i5", 288], ["s12-e1", 296],
  ["s13-i1", 317], ["s13-i2", 321]
]);
for (const scene of config.scenes) {
  const sceneStart = markerById.get(scene.id).startSeconds;
  for (const event of scene.shots.flatMap((shot) => shot.events.map((event) => ({ ...event, at: shot.at + event.at })))) {
    const expected = reviewedGlobalReveals.get(event.id);
    if (expected !== undefined && Math.abs(sceneStart + event.at - expected) > 0.000001) {
      throw new Error(`${event.id} must reveal at ${expected.toFixed(3)}s on the global timeline`);
    }
  }
}
for (const sceneId of ["S002", "S006"]) {
  if (sceneById.get(sceneId).shots.some((shot) => shot.events.some((event) => event.action === "connect"))) {
    throw new Error(`${sceneId} options are independent and must not use sequence connectors`);
  }
}
if (sceneById.get("S011").diagramLayout !== "capability-map") throw new Error("S011 must place Visualise beneath Explore");
if (sceneById.get("S009").items.join("|") !== "Discovery|Decisions|Solution designs") throw new Error("S009 must retain only the three reviewed source categories");
if (JSON.stringify(sceneById.get("S016")).includes("production/episodes/0002/narrative.md")) throw new Error("S016 must not expose the narrative source path");

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
