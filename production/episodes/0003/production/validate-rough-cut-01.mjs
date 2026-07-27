#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../../..");
const config = read("rough-cut-01-config.json");
const markers = read("rough-cut-01-markers.json");
const sceneById = new Map(config.scenes.map((scene) => [scene.id, scene]));
const companionIds = ["S001", "S008", "S017", "S019"];

if (markers.scenes.length !== 19) throw new Error("Episode 0003 rough cut must contain 19 editorial scenes");
if (markers.scenes[0].startSeconds !== 0 || markers.scenes.at(-1).endSeconds !== config.narration.expectedDurationSeconds) {
  throw new Error("Scene markers must cover the complete authoritative narration");
}
for (let index = 1; index < markers.scenes.length; index++) {
  if (markers.scenes[index - 1].endSeconds !== markers.scenes[index].startSeconds) {
    throw new Error("Scene markers contain a gap or overlap");
  }
}
if (/placeholder/i.test(JSON.stringify(config))) throw new Error("Rough-cut config contains a placeholder");

const agent = sceneById.get("S009");
if (agent.diagramLayout !== "agent-capability") throw new Error("S009 must use the non-crossing agent-capability layout");
if (agent.items.join("|") !== "Goal|Plan|Retrieve information|Use tools|Delegate work|Collaborate|Reflect|Maintain memory|Feedback") {
  throw new Error("S009 agent capability order must follow the narration");
}
const revealTargets = agent.shots.flatMap((shot) => shot.events)
  .filter((event) => event.action === "reveal" && event.target.startsWith("item-"))
  .map((event) => event.target);
if (revealTargets.join("|") !== agent.items.map((_, index) => `item-${index + 1}`).join("|")) {
  throw new Error("S009 agent capability reveals must follow the item sequence");
}
if (sceneById.get("S010").diagramAssetId !== "episode-0003-agent-capability") {
  throw new Error("S010 must use the registered D2 agent capability SVG");
}
if (sceneById.get("S011").kind !== "whiteboard" || sceneById.get("S011").diagramLayout !== "change-path") {
  throw new Error("S011 must use the reviewed problem-shaped agent decision path");
}
if (sceneById.get("S013").diagramLayout !== "conversation-path") {
  throw new Error("S013 must place Workflow beneath Decisions");
}

const reviewedGlobalReveals = new Map([
  ["s4-title", 140], ["s4-i1", 145], ["s4-i2", 148], ["s4-i3", 150], ["s4-i4", 156],
  ["s5-title", 180], ["s5-i1", 200], ["s5-i2", 203], ["s5-i3", 205], ["s5-i4", 206], ["s5-i5", 218],
  ["s6-i2", 240], ["s6-i3", 241], ["s6-i4", 242], ["s6-i5", 243], ["s6-i6", 245], ["s6-hub", 261],
  ["s7-title", 268], ["s7-i1", 274], ["s7-i2", 276], ["s7-i3", 286], ["s7-i4", 310],
  ["s8-i1", 335], ["s8-i2", 336],
  ["s9-title", 343], ["s9-i1", 344], ["s9-i2", 345], ["s9-i3", 347], ["s9-i4", 348],
  ["s9-i5", 349], ["s9-i6", 350], ["s9-i7", 352], ["s9-i8", 354], ["s9-i9", 355],
  ["s10-title", 360],
  ["s12-i1", 414], ["s12-i2", 417], ["s12-i3", 426], ["s12-i4", 429], ["s12-i5", 439], ["s12-i6", 443],
  ["s13-title", 468], ["s13-i1", 484], ["s13-i2", 487], ["s13-i3", 489], ["s13-i4", 495],
  ["s13-i5", 496], ["s13-support", 510],
  ["s14-title", 515], ["s14-i1", 518], ["s14-i2", 522], ["s14-i3", 525], ["s14-i4", 529],
  ["s14-i5", 537], ["s14-i6", 542], ["s14-support", 548],
  ["s15-i1", 568], ["s15-i2", 570], ["s15-i3", 571], ["s15-i4", 578], ["s15-i5", 581],
  ["s16-title", 591], ["s16-i1", 595], ["s16-i2", 598], ["s16-i3", 603], ["s16-i4", 609],
  ["s16-i5", 615], ["s16-i6", 617],
  ["s17-title", 633], ["s17-i1", 652], ["s17-i2", 656], ["s17-i3", 659],
  ["s18-i1", 671], ["s18-i2", 681], ["s18-i3", 684], ["s18-i4", 688]
]);
for (const scene of config.scenes) {
  const sceneStart = markers.scenes.find((candidate) => candidate.id === scene.id).startSeconds;
  for (const shot of scene.shots ?? []) {
    for (const event of shot.events ?? []) {
      const expected = reviewedGlobalReveals.get(event.id);
      if (expected === undefined) continue;
      const actual = sceneStart + shot.at + event.at;
      if (Math.abs(actual - expected) > 0.000001) {
        throw new Error(`${event.id} must reveal at ${clock(expected)}; got ${clock(actual)}`);
      }
    }
  }
}

for (const sceneId of companionIds) {
  const scene = sceneById.get(sceneId);
  const timeline = JSON.parse(fs.readFileSync(path.resolve(repoRoot, scene.companionPerformance.timeline), "utf8"));
  if (!timeline.layers.includes("lip-sync") || !timeline.events.some((event) => event.type === "mouth")) {
    throw new Error(`${sceneId} must contain audio-derived simplified-viseme lip sync`);
  }
  const marker = markers.scenes.find((candidate) => candidate.id === sceneId);
  if (Math.abs(timeline.source.sourceStartSeconds - marker.startSeconds) > 0.000001) {
    throw new Error(`${sceneId} lip sync source offset is incorrect`);
  }
}

const srtPath = path.join(repoRoot, "production/episodes/0003/publication/subtitles/episode-0003-en.srt");
const srt = fs.readFileSync(srtPath, "utf8");
const timings = [...srt.matchAll(/(\d\d:\d\d:\d\d,\d{3}) --> (\d\d:\d\d:\d\d,\d{3})/g)];
if (!timings.length || timings[0][1] !== "00:00:00,000" || timings.at(-1)[2] !== "00:11:56,763") {
  throw new Error("Subtitles must cover the complete narration timeline");
}
for (const line of srt.split("\n")) {
  if (!line.includes(" --> ") && !/^\d*$/.test(line) && line.length > 42) {
    throw new Error(`Subtitle line exceeds 42 characters: ${line}`);
  }
}

const companionSeconds = markers.scenes
  .filter((scene) => companionIds.includes(scene.id))
  .reduce((sum, scene) => sum + scene.endSeconds - scene.startSeconds, 0);
const companionPercent = companionSeconds / config.narration.expectedDurationSeconds * 100;
if (companionPercent < 10 || companionPercent > 15) {
  throw new Error(`Companion screen time ${companionPercent.toFixed(3)}% is outside the 10–15% editorial target`);
}

console.log(`Episode 0003 Rough Cut 01 validation passed: 19 scenes, four lip-sync scenes, ${companionSeconds.toFixed(3)}s Companion screen time (${companionPercent.toFixed(3)}%), full subtitle coverage.`);

function read(file) {
  return JSON.parse(fs.readFileSync(path.resolve(scriptDir, file), "utf8"));
}

function clock(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds - minutes * 60;
  return `${String(minutes).padStart(2, "0")}:${remainder.toFixed(3).padStart(6, "0")}`;
}
