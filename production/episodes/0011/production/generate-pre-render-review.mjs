#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { createLocalAssetManager } from "../../../runtime/assets/index.mjs";
import { diagramVideoDataUri } from "../../../runtime/diagrams/video-diagram-profile.mjs";
import { renderSceneSvg } from "../../../runtime/renderer/scene-renderer.mjs";
import { sceneFrameWindow, resolveSceneTimeline, timelineStateAtFrame } from "../../../runtime/renderer/scene-timeline.mjs";
import { getVisualGrammarProfile, resolveScenePresentation } from "../../../runtime/renderer/visual-grammar.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../..");
const require = createRequire(import.meta.url);
const sharp = require(path.join(repoRoot, "site/node_modules/sharp"));
const config = readJson(path.join(here, "presenter-v1-config.json"));
const markers = readJson(path.join(here, "presenter-v1-markers.json"));
const timing = new Map(markers.scenes.map((scene) => [scene.id, scene]));
const grammar = getVisualGrammarProfile(config.rendering.visualGrammarProfile);
const assets = createLocalAssetManager({ repoRoot });
const reviewDirectory = path.resolve(repoRoot, config.output.reviewDirectory, "pre-render");
const frameDirectory = path.join(reviewDirectory, "frames");
fs.mkdirSync(frameDirectory, { recursive: true });

const frames = [];
for (const [index, configured] of config.scenes.entries()) {
  const marker = timing.get(configured.id);
  const scene = {
    ...configured,
    ...marker,
    order: index + 1,
    episodeId: config.episode.id,
    durationSeconds: marker.endSeconds - marker.startSeconds,
    productionMetadata: false
  };
  scene.presentation = resolveScenePresentation(scene, grammar);
  scene.resolvedTimeline = resolveSceneTimeline(scene, config.output.frameRate, grammar);
  const window = sceneFrameWindow(scene, config.output.frameRate);
  const state = timelineStateAtFrame(scene, scene.resolvedTimeline, Math.max(0, window.frameCount - 1));
  const visual = scene.diagramAssetId ? diagramVideoDataUri(assets.fetch(scene.diagramAssetId)) : "";
  const svg = renderSceneSvg(scene, config.episode, config.output, "", grammar, state, visual);
  const output = path.join(frameDirectory, `${scene.id}.png`);
  await sharp(Buffer.from(svg)).resize(384, 216).png().toFile(output);
  frames.push({ scene, output });
}

const sceneSheet = path.join(reviewDirectory, "scene-contact-sheet.png");
await sharp(Buffer.from(contactSheetSvg(frames.map(({ scene, output }) => ({
  path: output,
  label: `${scene.id} · ${scene.headline}`,
  detail: `${clock(scene.startSeconds)}–${clock(scene.endSeconds)} · ${scene.presentation.archetype}`
}))))).png().toFile(sceneSheet);

const samples = [];
for (let seconds = 0; seconds < markers.selectedDurationSeconds; seconds += config.review.temporalSampleSeconds) {
  const match = frames.find(({ scene }) => seconds >= scene.startSeconds && seconds < scene.endSeconds) ?? frames.at(-1);
  samples.push({ path: match.output, label: clock(seconds), detail: `${match.scene.id} · ${match.scene.headline}` });
}
const temporalSheet = path.join(reviewDirectory, "temporal-contact-sheet.png");
await sharp(Buffer.from(contactSheetSvg(samples))).png().toFile(temporalSheet);

const durations = frames.map(({ scene }) => ({
  id: scene.id,
  headline: scene.headline,
  archetype: scene.presentation.archetype,
  diagramAssetId: scene.diagramAssetId ?? null,
  startSeconds: scene.startSeconds,
  endSeconds: scene.endSeconds,
  durationSeconds: Number(scene.durationSeconds.toFixed(3))
}));
const report = {
  version: 1,
  authority: "resolved Episode 11 scene configuration before video assembly",
  sceneCount: frames.length,
  temporalSampleSeconds: config.review.temporalSampleSeconds,
  maximumSceneDurationSeconds: Math.max(...durations.map((scene) => scene.durationSeconds)),
  scenesOver30Seconds: durations.filter((scene) => scene.durationSeconds > 30).map((scene) => scene.id),
  authoredDiagramSceneCount: durations.filter((scene) => scene.diagramAssetId).length,
  presenterSceneCount: durations.filter((scene) => !scene.diagramAssetId).length,
  sceneContactSheet: path.relative(repoRoot, sceneSheet),
  temporalContactSheet: path.relative(repoRoot, temporalSheet),
  scenes: durations
};
fs.writeFileSync(path.join(reviewDirectory, "review-report.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(`Pre-render scene review: ${path.relative(repoRoot, sceneSheet)}`);
console.log(`Pre-render temporal review: ${path.relative(repoRoot, temporalSheet)}`);

function contactSheetSvg(items) {
  const columns = 5;
  const cellWidth = 384;
  const cellHeight = 264;
  const rows = Math.ceil(items.length / columns);
  const cells = items.map((item, index) => {
    const x = index % columns * cellWidth;
    const y = Math.floor(index / columns) * cellHeight;
    const data = fs.readFileSync(item.path).toString("base64");
    return `<image href="data:image/png;base64,${data}" x="${x}" y="${y}" width="384" height="216"/><rect x="${x}" y="${y + 216}" width="384" height="48" fill="#071015"/><text x="${x + 10}" y="${y + 237}" font-size="14" font-weight="700" fill="#f4f0e8">${xml(item.label)}</text><text x="${x + 10}" y="${y + 255}" font-size="11" fill="#8eabb8">${xml(item.detail)}</text>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${columns * cellWidth}" height="${rows * cellHeight}" viewBox="0 0 ${columns * cellWidth} ${rows * cellHeight}"><style>text{font-family:Arial,sans-serif}</style><rect width="100%" height="100%" fill="#071015"/>${cells}</svg>`;
}

function clock(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.floor(seconds % 60);
  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}
function xml(value) { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;"); }
function readJson(filePath) { return JSON.parse(fs.readFileSync(filePath, "utf8")); }
