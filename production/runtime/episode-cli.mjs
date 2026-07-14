#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { createLocalAssetManager } from "./assets/index.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");
const require = createRequire(import.meta.url);
const sharp = require(path.join(repoRoot, "site/node_modules/sharp"));
const DEFAULT_CONFIG = "production/episodes/0001/production/rough-cut-config.json";
const AUDIO_ANALYSIS = "production/episodes/0001/production/narration-analysis.json";
const PALETTE = {
  paper: "#f4f0e8", ink: "#172028", muted: "#59656d", blue: "#3d6075",
  paleBlue: "#dce7eb", rust: "#a65d3f", paleRust: "#ead8cd", green: "#547064",
  white: "#fffdfa", line: "#aeb8bc", dark: "#111920"
};

main().catch((error) => {
  console.error(error.stack ?? error.message);
  process.exitCode = 1;
});

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const configPath = resolvePath(valueAfter(args, "--config") ?? DEFAULT_CONFIG);
  if (!['analyse', 'validate', 'render', 'review'].includes(command)) {
    console.error(`Usage: node production/runtime/episode-cli.mjs <analyse|validate|render|review> [--config PATH]`);
    process.exitCode = 2;
    return;
  }
  const context = loadContext(configPath);
  if (command === "analyse") {
    const output = analyseNarration(context);
    console.log(`Narration analysis: ${relative(output)}`);
    return;
  }
  const validation = validate(context);
  if (command === "validate") {
    console.log(`Episode validation passed: ${context.scenes.length} scenes, ${validation.duration.toFixed(6)} seconds, no gaps or overlaps.`);
    return;
  }
  if (command === "render") {
    const video = await render(context, validation);
    console.log(`Rough cut: ${relative(video)}`);
    return;
  }
  const review = await generateReviewArtifacts(context, validation);
  console.log(`Review artefacts: ${relative(review)}`);
}

function loadContext(configPath) {
  const config = readJson(configPath);
  const markersPath = resolvePath(config.episode.timingMarkers);
  const markers = readJson(markersPath);
  const timingById = new Map(markers.scenes.map((scene) => [scene.id, scene]));
  const scenes = config.scenes.map((scene, index) => {
    const timing = timingById.get(scene.id);
    if (!timing) throw new Error(`No narration timing marker for ${scene.id}`);
    return { ...scene, ...timing, order: index + 1, durationSeconds: timing.endSeconds - timing.startSeconds };
  });
  const assetManager = createLocalAssetManager({ repoRoot });
  return { configPath, config, markersPath, markers, scenes, assetManager };
}

function analyseNarration(context) {
  const ffprobe = executable("ffprobe");
  const ffmpeg = executable("ffmpeg");
  const audioPath = context.assetManager.fetch(context.config.narration.assetId);
  const probe = JSON.parse(run(ffprobe, [
    "-v", "error", "-show_entries",
    "format=duration,size,bit_rate:stream=index,codec_name,codec_type,sample_rate,channels,channel_layout,duration",
    "-of", "json", audioPath
  ]).stdout);
  const duration = Number(probe.format.duration);
  const silence = mergeAdjacentSilence(detectSilence(ffmpeg, audioPath, "-42dB", 0.35), 0.05);
  const majorPauses = silence.filter((item) => item.durationSeconds >= 1.3);
  const lastPause = silence.at(-1);
  const trailingSilence = lastPause && duration - lastPause.endSeconds < 0.5
    ? duration - lastPause.startSeconds
    : 0;
  const firstPause = silence[0];
  const leadingSilence = firstPause?.startSeconds <= 0.05 ? firstPause.endSeconds : 0;
  const stream = probe.streams.find((candidate) => candidate.codec_type === "audio");
  const analysis = {
    version: 1,
    episodeId: context.config.episode.id,
    narrationAssetId: context.config.narration.assetId,
    sha256: sha256(audioPath),
    media: {
      durationSeconds: duration,
      sizeBytes: Number(probe.format.size),
      bitRate: Number(probe.format.bit_rate),
      codec: stream.codec_name,
      sampleRateHz: Number(stream.sample_rate),
      channels: stream.channels,
      channelLayout: stream.channel_layout ?? "mono"
    },
    silenceAnalysis: {
      noiseThreshold: "-42dB",
      minimumSilenceSeconds: 0.35,
      leadingSilenceSeconds: round(leadingSilence),
      trailingSilenceSeconds: round(trailingSilence),
      usableNarrationDurationSeconds: round(duration - leadingSilence - trailingSilence),
      detectedPauseCount: silence.length,
      majorPauseMinimumSeconds: 1.3,
      majorPauses
    },
    interpretation: [
      "The complete master recording is preserved for rough-cut timing; no silence was removed.",
      "Major pauses are deterministic signal evidence. Editorial section markers additionally use canonical section order and are stored in narration-markers.json.",
      "The trailing silence begins after the spoken close and remains part of the selected recording."
    ]
  };
  const output = resolvePath(AUDIO_ANALYSIS);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${JSON.stringify(analysis, null, 2)}\n`);
  return output;
}

function detectSilence(ffmpeg, audioPath, threshold, minimum) {
  const result = run(ffmpeg, ["-hide_banner", "-i", audioPath, "-af", `silencedetect=noise=${threshold}:d=${minimum}`, "-f", "null", "-"]);
  const text = `${result.stdout}\n${result.stderr}`;
  const starts = [...text.matchAll(/silence_start: ([0-9.]+)/g)].map((match) => Number(match[1]));
  const ends = [...text.matchAll(/silence_end: ([0-9.]+) \| silence_duration: ([0-9.]+)/g)];
  return ends.map((match, index) => ({
    startSeconds: round(starts[index]),
    endSeconds: round(Number(match[1])),
    durationSeconds: round(Number(match[2]))
  }));
}

function mergeAdjacentSilence(intervals, maximumGapSeconds) {
  const merged = [];
  for (const interval of intervals) {
    const previous = merged.at(-1);
    if (previous && interval.startSeconds - previous.endSeconds <= maximumGapSeconds) {
      previous.endSeconds = interval.endSeconds;
      previous.durationSeconds = round(previous.endSeconds - previous.startSeconds);
    } else {
      merged.push({ ...interval });
    }
  }
  return merged;
}

function validate(context) {
  const errors = [];
  const ffprobe = executable("ffprobe");
  executable("ffmpeg");
  const audioPath = context.assetManager.fetch(context.config.narration.assetId);
  const companionPath = context.assetManager.fetch(context.config.companion.assetId);
  const actualHash = sha256(audioPath);
  if (actualHash !== context.config.narration.expectedSha256) errors.push(`Narration checksum mismatch: ${actualHash}`);
  const duration = Number(run(ffprobe, ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", audioPath]).stdout.trim());
  if (Math.abs(duration - context.config.narration.expectedDurationSeconds) > 0.001) {
    errors.push(`Narration duration ${duration} does not match expected ${context.config.narration.expectedDurationSeconds}`);
  }
  if (context.scenes[0]?.startSeconds !== 0) errors.push("First scene must start at 0 seconds");
  for (const [index, scene] of context.scenes.entries()) {
    if (scene.endSeconds <= scene.startSeconds) errors.push(`${scene.id} has non-positive duration`);
    if (index > 0) {
      const previous = context.scenes[index - 1];
      const delta = scene.startSeconds - previous.endSeconds;
      if (Math.abs(delta) > 0.000001) errors.push(`${previous.id}/${scene.id} boundary has ${delta > 0 ? "gap" : "overlap"} ${Math.abs(delta).toFixed(6)}s`);
    }
  }
  const finalEnd = context.scenes.at(-1)?.endSeconds;
  if (Math.abs(finalEnd - duration) > 0.001) errors.push(`Storyboard ends at ${finalEnd}; narration ends at ${duration}`);
  const sceneIds = new Set(context.scenes.map((scene) => scene.id));
  if (sceneIds.size !== context.scenes.length) errors.push("Duplicate scene IDs");
  const assetRegister = fs.readFileSync(resolvePath("production/episodes/0001/asset-register.yaml"), "utf8");
  for (const scene of context.scenes) {
    for (const assetId of scene.assetIds ?? []) {
      if (!assetRegister.includes(`asset_id: \"${assetId}\"`)) errors.push(`${scene.id} references unknown episode asset ${assetId}`);
    }
  }
  if (!fs.existsSync(companionPath)) errors.push("Companion asset does not resolve");
  if (errors.length) throw new Error(`Episode validation failed:\n- ${errors.join("\n- ")}`);
  return { audioPath, companionPath, duration, ffprobe, ffmpeg: executable("ffmpeg") };
}

async function render(context, validation) {
  const generatedDir = resolvePath(context.config.output.generatedDirectory);
  const framesDir = path.join(generatedDir, "frames");
  const segmentsDir = path.join(generatedDir, "segments");
  fs.mkdirSync(framesDir, { recursive: true });
  fs.mkdirSync(segmentsDir, { recursive: true });
  const companionData = `data:image/png;base64,${fs.readFileSync(validation.companionPath).toString("base64")}`;
  const frameFiles = [];
  const segmentFiles = [];
  for (const scene of context.scenes) {
    const svgPath = path.join(framesDir, `${scene.id}.svg`);
    const pngPath = path.join(framesDir, `${scene.id}.png`);
    fs.writeFileSync(svgPath, sceneSvg(scene, context, companionData));
    await sharp(svgPath, { density: 144 }).resize(context.config.output.width, context.config.output.height).png().toFile(pngPath);
    const segmentPath = path.join(segmentsDir, `${scene.id}.mp4`);
    const frameDuration = Math.ceil(scene.durationSeconds * context.config.output.frameRate) / context.config.output.frameRate;
    run(validation.ffmpeg, [
      "-y", "-loop", "1", "-t", frameDuration.toFixed(3), "-i", pngPath,
      "-r", String(context.config.output.frameRate), "-c:v", "libx264", "-preset", "veryfast",
      "-crf", "20", "-pix_fmt", "yuv420p", "-an", segmentPath
    ]);
    frameFiles.push(svgPath, pngPath);
    segmentFiles.push(segmentPath);
  }
  const concatPath = path.join(generatedDir, "segments.txt");
  fs.writeFileSync(concatPath, `${segmentFiles.map((file) => `file '${file.replaceAll("'", "'\\''")}'`).join("\n")}\n`);
  const videoPath = resolvePath(context.config.output.video);
  fs.mkdirSync(path.dirname(videoPath), { recursive: true });
  run(validation.ffmpeg, [
    "-y", "-f", "concat", "-safe", "0", "-i", concatPath, "-i", validation.audioPath,
    "-map", "0:v:0", "-map", "1:a:0", "-t", validation.duration.toFixed(6),
    "-c:v", "libx264", "-preset", "fast", "-crf", "20", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", videoPath
  ]);
  const media = probeMedia(validation.ffprobe, videoPath);
  const timingReport = buildTimingReport(context, validation, media);
  const timingPath = path.join(generatedDir, "timing-report.json");
  fs.writeFileSync(timingPath, `${JSON.stringify(timingReport, null, 2)}\n`);
  await generateReviewArtifacts(context, validation);
  const manifestPath = path.join(generatedDir, "render-manifest.json");
  const assetManifestPath = path.join(generatedDir, "asset-manifest.json");
  const provenancePath = path.join(generatedDir, "provenance.json");
  fs.writeFileSync(assetManifestPath, `${JSON.stringify(buildAssetManifest(context, validation), null, 2)}\n`);
  fs.writeFileSync(provenancePath, `${JSON.stringify(buildProvenance(context, validation, videoPath), null, 2)}\n`);
  fs.writeFileSync(manifestPath, `${JSON.stringify({
    episodeId: context.config.episode.id,
    output: fileRecord(videoPath),
    command: `node production/runtime/episode-cli.mjs render --config ${relative(context.configPath)}`,
    frameRate: context.config.output.frameRate,
    resolution: `${context.config.output.width}x${context.config.output.height}`,
    sceneCount: context.scenes.length,
    generatedFrames: frameFiles.map(fileRecord),
    generatedSegments: segmentFiles.map(fileRecord),
    timingReport: relative(timingPath),
    assetManifest: relative(assetManifestPath),
    provenance: relative(provenancePath)
  }, null, 2)}\n`);
  return videoPath;
}

async function generateReviewArtifacts(context, validation) {
  const videoPath = resolvePath(context.config.output.video);
  if (!fs.existsSync(videoPath)) throw new Error(`Render the rough cut before review: ${relative(videoPath)}`);
  const reviewDir = resolvePath(context.config.output.reviewDirectory);
  const framesDir = path.join(reviewDir, "frames");
  fs.mkdirSync(framesDir, { recursive: true });
  const frames = [];
  for (const scene of context.scenes) {
    const timestamp = scene.startSeconds + Math.min(2, scene.durationSeconds / 2);
    const output = path.join(framesDir, `${scene.id}.png`);
    run(validation.ffmpeg, ["-y", "-ss", timestamp.toFixed(3), "-i", videoPath, "-frames:v", "1", output]);
    frames.push({ ...scene, path: output, timestamp });
  }
  const contactSvg = path.join(reviewDir, "contact-sheet.svg");
  const contactPng = path.join(reviewDir, "contact-sheet.png");
  fs.writeFileSync(contactSvg, contactSheetSvg(frames));
  await sharp(contactSvg, { density: 144 }).resize(1920, 1080).png().toFile(contactPng);
  const mediaReportPath = path.join(reviewDir, "media-report.json");
  fs.writeFileSync(mediaReportPath, `${JSON.stringify({
    inputNarration: fileRecord(validation.audioPath),
    outputVideo: fileRecord(videoPath),
    media: probeMedia(validation.ffprobe, videoPath),
    expectedDurationSeconds: validation.duration,
    reviewFrameCount: frames.length,
    contactSheet: relative(contactPng),
    warnings: ["This is an editorial rough cut with static authored frames.", "No lip-sync, facial animation or companion character animation is present."]
  }, null, 2)}\n`);
  const logPath = path.join(reviewDir, "render.log");
  fs.writeFileSync(logPath, [
    `render_command=node production/runtime/episode-cli.mjs render --config ${relative(context.configPath)}`,
    `review_command=node production/runtime/episode-cli.mjs review --config ${relative(context.configPath)}`,
    `narration_sha256=${sha256(validation.audioPath)}`,
    `scene_count=${context.scenes.length}`,
    `duration_seconds=${validation.duration}`,
    `video=${relative(videoPath)}`,
    "status=complete"
  ].join("\n") + "\n");
  return reviewDir;
}

function sceneSvg(scene, context, companionData) {
  const width = context.config.output.width;
  const height = context.config.output.height;
  const header = `<text x="112" y="90" font-size="28" fill="${PALETTE.muted}" letter-spacing="2">ARTICULATE JOURNAL · EPISODE 0001 · ${scene.id}</text>`;
  const footer = `<line x1="112" y1="996" x2="1808" y2="996" stroke="${PALETTE.line}"/><text x="112" y="1035" font-size="22" fill="${PALETTE.muted}">${xml(scene.narrationReference)}</text><text x="1808" y="1035" text-anchor="end" font-size="22" fill="${PALETTE.muted}">${time(scene.startSeconds)} — ${time(scene.endSeconds)}</text>`;
  const content = scene.companion
    ? companionScene(scene, companionData)
    : visualScene(scene);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${PALETTE.paper}"/>
  <style>text{font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif}</style>
  ${header}${content}${footer}</svg>`;
}

function companionScene(scene, companionData) {
  const title = textBlock(scene.headline, 112, 215, 900, 74, 3, PALETTE.ink, 700);
  const support = textBlock(scene.support, 112, 510, 760, 38, 4, PALETTE.blue, 400);
  const pills = (scene.items ?? []).map((item, index) => pill(item, 112 + (index % 2) * 300, 760 + Math.floor(index / 2) * 72, 270)).join("");
  return `${title}${support}${pills}<rect x="1050" y="135" width="650" height="800" rx="28" fill="${PALETTE.paleBlue}"/><image href="${companionData}" x="1060" y="150" width="630" height="780" preserveAspectRatio="xMidYMax meet"/><text x="1375" y="950" text-anchor="middle" font-size="20" fill="${PALETTE.muted}">AI-generated visual companion · static neutral asset</text>`;
}

function visualScene(scene) {
  const headline = textBlock(scene.headline, 112, 170, 1696, scene.kind === "question" ? 64 : 58, scene.kind === "question" ? 4 : 2, PALETTE.ink, 700);
  const support = textBlock(scene.support, 112, scene.kind === "question" ? 515 : 330, 1550, 32, 3, PALETTE.blue, 400);
  const y = scene.kind === "question" ? 720 : 500;
  return `${headline}${support}${kindGraphic(scene, y)}`;
}

function kindGraphic(scene, y) {
  const items = scene.items ?? [];
  if (["change", "principles", "augment", "roadmap", "contrast"].includes(scene.kind)) return flow(items, y);
  if (["fragments", "tools", "questions", "costs", "success", "capabilities"].includes(scene.kind)) return grid(items, y, scene.kind === "costs" ? PALETTE.paleRust : PALETTE.white);
  if (["timeline"].includes(scene.kind)) return timeline(items, y);
  if (["projections", "evidence"].includes(scene.kind)) return radial(items, y, scene.kind === "evidence" ? "ASSISTED SYNTHESIS" : "PARTIAL PICTURE");
  if (scene.kind === "journal") return journalWindow(items, y);
  if (scene.kind === "question") return `<rect x="400" y="760" width="1120" height="96" rx="48" fill="${PALETTE.paleRust}"/>${textBlock(items[0] ?? "", 450, 788, 1020, 28, 2, PALETTE.rust, 600, "middle")}`;
  return grid(items, y, PALETTE.white);
}

function grid(items, y, fill) {
  const columns = items.length > 4 ? 3 : 2;
  const gap = 26;
  const width = columns === 3 ? 530 : 790;
  return items.map((item, index) => {
    const x = 112 + (index % columns) * (width + gap);
    const rowY = y + Math.floor(index / columns) * 138;
    return `<rect x="${x}" y="${rowY}" width="${width}" height="108" rx="10" fill="${fill}" stroke="${PALETTE.line}"/>${textBlock(item, x + 28, rowY + 30, width - 56, 28, 2, PALETTE.ink, 500)}`;
  }).join("");
}

function flow(items, y) {
  const width = Math.min(285, (1650 - (items.length - 1) * 54) / items.length);
  return items.map((item, index) => {
    const x = 112 + index * (width + 54);
    const arrow = index < items.length - 1 ? `<text x="${x + width + 27}" y="${y + 74}" text-anchor="middle" font-size="38" fill="${PALETTE.rust}">→</text>` : "";
    return `<rect x="${x}" y="${y}" width="${width}" height="132" rx="12" fill="${index === items.length - 1 ? PALETTE.paleBlue : PALETTE.white}" stroke="${PALETTE.line}"/>${textBlock(item, x + 18, y + 38, width - 36, 27, 2, PALETTE.ink, 600, "middle")}${arrow}`;
  }).join("");
}

function timeline(items, y) {
  return `<line x1="190" y1="${y + 110}" x2="1700" y2="${y + 110}" stroke="${PALETTE.blue}" stroke-width="5"/>${items.map((item, index) => {
    const x = 240 + index * 440;
    return `<circle cx="${x}" cy="${y + 110}" r="18" fill="${index === items.length - 1 ? PALETTE.rust : PALETTE.green}"/>${textBlock(item, x - 150, y + (index % 2 ? 155 : 15), 300, 28, 2, PALETTE.ink, 600, "middle")}`;
  }).join("")}`;
}

function radial(items, y, centre) {
  const cx = 960, cy = y + 160;
  const nodes = items.map((item, index) => {
    const angle = (Math.PI * 2 * index / items.length) - Math.PI / 2;
    const x = cx + Math.cos(angle) * 600;
    const ny = cy + Math.sin(angle) * 210;
    return `<line x1="${x}" y1="${ny}" x2="${cx}" y2="${cy}" stroke="${PALETTE.line}" stroke-width="3"/><rect x="${x - 125}" y="${ny - 42}" width="250" height="84" rx="42" fill="${PALETTE.white}" stroke="${PALETTE.line}"/>${textBlock(item, x - 105, ny - 13, 210, 24, 2, PALETTE.ink, 600, "middle")}`;
  }).join("");
  return `${nodes}<circle cx="${cx}" cy="${cy}" r="135" fill="${PALETTE.paleBlue}" stroke="${PALETTE.blue}" stroke-width="3"/>${textBlock(centre, cx - 105, cy - 32, 210, 25, 3, PALETTE.blue, 700, "middle")}`;
}

function journalWindow(items, y) {
  return `<rect x="245" y="${y}" width="1430" height="355" rx="16" fill="${PALETTE.dark}"/><circle cx="290" cy="${y + 38}" r="8" fill="${PALETTE.rust}"/><circle cx="318" cy="${y + 38}" r="8" fill="${PALETTE.green}"/><text x="365" y="${y + 47}" font-size="24" fill="#c6d0d5">${xml(items[0] ?? "")}</text><text x="315" y="${y + 125}" font-size="26" fill="#8fb0c0"># Episode 0001 – Why Articulate Exists</text><text x="315" y="${y + 190}" font-size="24" fill="#e7ecee">Architecture is not difficult because systems are complex.</text><text x="315" y="${y + 235}" font-size="24" fill="#e7ecee">It is difficult because knowledge is fragmented, changing and incomplete.</text><text x="315" y="${y + 310}" font-size="22" fill="#9eaaaf">${xml(items[1] ?? "")}</text>`;
}

function contactSheetSvg(frames) {
  const cells = frames.map((frame, index) => {
    const column = index % 5;
    const row = Math.floor(index / 5);
    const x = column * 384;
    const y = row * 270;
    const image = `data:image/png;base64,${fs.readFileSync(frame.path).toString("base64")}`;
    return `<image href="${image}" x="${x}" y="${y}" width="384" height="216"/><rect x="${x}" y="${y + 216}" width="384" height="54" fill="${PALETTE.dark}"/><text x="${x + 12}" y="${y + 249}" font-size="20" fill="#ffffff">${frame.id} · ${xml(frame.title)}</text>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080"><style>text{font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif}</style><rect width="1920" height="1080" fill="${PALETTE.dark}"/>${cells}</svg>`;
}

function textBlock(text, x, y, width, fontSize, maxLines, fill, weight = 400, align = "start") {
  const maxChars = Math.max(8, Math.floor(width / (fontSize * 0.55)));
  const lines = wrapText(text, maxChars).slice(0, maxLines);
  const anchor = align === "middle" ? "middle" : "start";
  const tx = align === "middle" ? x + width / 2 : x;
  return `<text x="${tx}" y="${y}" text-anchor="${anchor}" font-size="${fontSize}" font-weight="${weight}" fill="${fill}">${lines.map((line, index) => `<tspan x="${tx}" dy="${index === 0 ? 0 : fontSize * 1.18}">${xml(line)}</tspan>`).join("")}</text>`;
}

function pill(text, x, y, width) {
  return `<rect x="${x}" y="${y}" width="${width}" height="50" rx="25" fill="${PALETTE.white}" stroke="${PALETTE.line}"/>${textBlock(text, x + 15, y + 32, width - 30, 19, 1, PALETTE.muted, 500, "middle")}`;
}

function wrapText(text, maxChars) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    if (line && `${line} ${word}`.length > maxChars) { lines.push(line); line = word; }
    else line = line ? `${line} ${word}` : word;
  }
  if (line) lines.push(line);
  return lines;
}

function buildTimingReport(context, validation, media) {
  const companionSeconds = context.scenes.filter((scene) => scene.companion).reduce((sum, scene) => sum + scene.durationSeconds, 0);
  return {
    timingAuthority: "recorded-narration",
    sourceDurationSeconds: validation.duration,
    renderedDurationSeconds: Number(media.format.duration),
    sceneCount: context.scenes.length,
    gapSeconds: 0,
    overlapSeconds: 0,
    coveredStartSeconds: context.scenes[0].startSeconds,
    coveredEndSeconds: context.scenes.at(-1).endSeconds,
    companionScreenTimeSeconds: round(companionSeconds),
    companionScreenTimePercent: round(companionSeconds / validation.duration * 100),
    placeholders: 0,
    scenes: context.scenes.map((scene) => ({ id: scene.id, startSeconds: scene.startSeconds, endSeconds: scene.endSeconds, durationSeconds: round(scene.durationSeconds), narrationReference: scene.narrationReference }))
  };
}

function buildAssetManifest(context, validation) {
  return {
    narration: { assetId: context.config.narration.assetId, ...fileRecord(validation.audioPath) },
    companion: { assetId: context.config.companion.assetId, ...fileRecord(validation.companionPath) },
    authoredVisuals: [...new Set(context.scenes.flatMap((scene) => scene.assetIds ?? []))].map((assetId) => ({ assetId, source: "production/episodes/0001/asset-register.yaml" })),
    unresolvedAssets: [],
    placeholderCount: 0
  };
}

function buildProvenance(context, validation, videoPath) {
  return {
    canonicalEpisode: fileRecord(resolvePath(context.config.episode.canonicalSource)),
    sceneConfiguration: fileRecord(context.configPath),
    timingMarkers: fileRecord(context.markersPath),
    narration: { assetId: context.config.narration.assetId, ...fileRecord(validation.audioPath), treatment: "whole recording retained; AAC encode only during MP4 mux" },
    companion: { assetId: context.config.companion.assetId, ...fileRecord(validation.companionPath), treatment: "static neutral asset; no lip-sync or character animation" },
    output: fileRecord(videoPath),
    renderer: "production/runtime/episode-cli.mjs",
    deterministicBoundary: "Scene frames and assembly are deterministic for the recorded inputs and configuration; review metadata is derived from the completed render."
  };
}

function probeMedia(ffprobe, filePath) {
  return JSON.parse(run(ffprobe, ["-v", "error", "-show_entries", "format=duration,size,bit_rate:stream=index,codec_type,codec_name,width,height,r_frame_rate,sample_rate,channels,duration", "-of", "json", filePath]).stdout);
}

function fileRecord(filePath) {
  const stat = fs.statSync(filePath);
  return { path: relative(filePath), sizeBytes: stat.size, sha256: sha256(filePath) };
}

function sha256(filePath) {
  const hash = crypto.createHash("sha256");
  hash.update(fs.readFileSync(filePath));
  return hash.digest("hex");
}

function executable(name) {
  const result = spawnSync("which", [name], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(`Required executable not found: ${name}`);
  return result.stdout.trim();
}

function run(command, args) {
  const result = spawnSync(command, args, { encoding: "utf8", maxBuffer: 50 * 1024 * 1024 });
  if (result.status !== 0) throw new Error(`Command failed: ${command} ${args.join(" ")}\n${result.stderr || result.stdout}`);
  return result;
}

function readJson(filePath) { return JSON.parse(fs.readFileSync(filePath, "utf8")); }
function resolvePath(filePath) { return path.isAbsolute(filePath) ? filePath : path.join(repoRoot, filePath); }
function relative(filePath) { return path.relative(repoRoot, filePath).replaceAll(path.sep, "/"); }
function valueAfter(args, flag) { const index = args.indexOf(flag); return index >= 0 ? args[index + 1] : null; }
function round(value) { return Number(Number(value).toFixed(6)); }
function xml(value) { return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;"); }
function time(seconds) { const minutes = Math.floor(seconds / 60); const secs = seconds - minutes * 60; return `${String(minutes).padStart(2, "0")}:${secs.toFixed(3).padStart(6, "0")}`; }
