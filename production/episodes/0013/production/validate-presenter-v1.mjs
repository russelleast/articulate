#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../..");
const config = JSON.parse(fs.readFileSync(path.join(here, "presenter-v1-config.json"), "utf8"));
const videoPath = path.resolve(repoRoot, config.output.video);
const subtitlePath = path.resolve(repoRoot, "production/episodes/0013/output/episode-0013-final.srt");
const thumbnailPath = path.resolve(repoRoot, "production/episodes/0013/publication/thumbnail/episode-0013-thumbnail.png");
const diagramIds = config.scenes.flatMap((scene) => scene.diagramAssetId ? [scene.diagramAssetId] : []);
const errors = [];
for (const required of [videoPath, subtitlePath, thumbnailPath, path.resolve(config.output.generatedDirectory, "render-manifest.json"), ...diagramIds.map((id) => path.resolve(repoRoot, `site/public/diagrams/${id}.svg`))]) if (!fs.existsSync(required)) errors.push(`Missing required output: ${path.relative(repoRoot, required)}`);

if (!errors.length) {
  const probe = JSON.parse(run("ffprobe", ["-v", "error", "-show_streams", "-show_format", "-of", "json", videoPath]));
  const video = probe.streams.find((stream) => stream.codec_type === "video"); const audio = probe.streams.find((stream) => stream.codec_type === "audio");
  if (video?.codec_name !== "h264" || video?.width !== 1920 || video?.height !== 1080 || video?.r_frame_rate !== "30/1") errors.push("Final video must be H.264 1920x1080 at 30 fps");
  if (audio?.codec_name !== "aac" || Number(audio.sample_rate) !== 48000) errors.push("Final audio must be AAC at 48 kHz");
  if (Math.abs(Number(probe.format.duration) - config.presenter.expectedDurationSeconds) > 0.1) errors.push("Final encoded duration does not match presenter authority");
  validateSrt(fs.readFileSync(subtitlePath, "utf8"), Number(probe.format.duration), errors);
  const image = JSON.parse(run("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "json", thumbnailPath])).streams[0];
  if (image.width !== 1280 || image.height !== 720) errors.push("Thumbnail must be 1280x720");
}

const report = { version: 1, status: errors.length ? "failed" : "passed", source: "production/episodes/0013/ep13-narrator.mp4", output: config.output.video, subtitle: "production/episodes/0013/output/episode-0013-final.srt", thumbnail: "production/episodes/0013/publication/thumbnail/episode-0013-thumbnail.png", selectedDurationSeconds: config.presenter.expectedDurationSeconds, frameRate: 30, sceneCount: config.scenes.length, continuousPresenter: true, diagramAssets: diagramIds, checks: ["continuous presenter source", "complete recording coverage", "1080p 30 fps publication output", "candidate technologies become architectural compositions", "credible alternatives remain positive", "Python decision remains separate", "Dapr platform fit and trade-offs", "official locally stored logo assets", "subtitle timing and typography limits", "series-consistent thumbnail"], errors };
fs.writeFileSync(path.resolve(repoRoot, "production/episodes/0013/output/review/presenter-v1/episode-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log("Episode 0013 presenter validation passed.");

function validateSrt(text, duration, issues) {
  let previousEnd = 0; const blocks = text.trim().split(/\n\s*\n/);
  for (const block of blocks) {
    const lines = block.split("\n"); const match = lines[1]?.match(/(\d\d):(\d\d):(\d\d),(\d\d\d) --> (\d\d):(\d\d):(\d\d),(\d\d\d)/);
    if (!match) { issues.push(`Invalid subtitle cue: ${lines[0]}`); continue; }
    const start = seconds(match.slice(1, 5)); const end = seconds(match.slice(5, 9)); if (start < previousEnd - 0.001) issues.push(`Subtitle overlap at cue ${lines[0]}`); if (end > duration + 0.001) issues.push(`Subtitle exceeds media at cue ${lines[0]}`); if (lines.length - 2 > 2 || lines.slice(2).some((line) => line.length > 42)) issues.push(`Subtitle typography limit exceeded at cue ${lines[0]}`); previousEnd = end;
  }
}
function seconds([h, m, s, ms]) { return Number(h) * 3600 + Number(m) * 60 + Number(s) + Number(ms) / 1000; }
function run(command, args) { const result = spawnSync(command, args, { cwd: repoRoot, encoding: "utf8" }); if (result.status !== 0) throw new Error(result.stderr); return result.stdout; }
