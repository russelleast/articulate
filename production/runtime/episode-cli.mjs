#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { createLocalAssetManager } from "./assets/index.mjs";
import { xml } from "./renderer/layout.mjs";
import { renderSceneSvg } from "./renderer/scene-renderer.mjs";
import { resolveSceneTimeline, sceneFrameWindow, timelineChangeFrames, timelineManifestEntry, timelineStateAtFrame } from "./renderer/scene-timeline.mjs";
import { getVisualGrammarProfile, resolveScenePresentation } from "./renderer/visual-grammar.mjs";
import { companionPerformanceManifest, companionPerformanceStateAtFrame, resolveCompanionPerformance } from "./renderer/companion-performance.mjs";
import { resolveSceneShots, shotsManifestEntry } from "./renderer/scene-shots.mjs";
import { resolveEpisodeSources } from "./narrative-source.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");
const require = createRequire(import.meta.url);
const sharp = require(path.join(repoRoot, "site/node_modules/sharp"));
const DEFAULT_CONFIG = "production/episodes/0001/production/rough-cut-config.json";

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
  const sources = resolveEpisodeSources({ repoRoot, episode: config.episode });
  const grammar = getVisualGrammarProfile(config.rendering?.visualGrammarProfile);
  const markersPath = resolvePath(config.episode.timingMarkers);
  const markers = readJson(markersPath);
  const timingById = new Map(markers.scenes.map((scene) => [scene.id, scene]));
  const scenes = config.scenes.map((scene, index) => {
    const timing = timingById.get(scene.id);
    if (!timing) throw new Error(`No narration timing marker for ${scene.id}`);
    const resolved = { ...scene, ...timing, episodeId: config.episode.id, order: index + 1, durationSeconds: timing.endSeconds - timing.startSeconds, productionMetadata: config.rendering?.productionMetadata !== false };
    const shotResolution = resolveSceneShots(resolved, config.output.frameRate);
    const withPresentation = { ...shotResolution.scene, presentation: resolveScenePresentation(shotResolution.scene, grammar) };
    const resolvedTimeline = resolveSceneTimeline(withPresentation, config.output.frameRate, grammar);
    const performancePath = scene.companionPerformance?.timeline ? resolvePath(scene.companionPerformance.timeline) : null;
    const performanceDocument = performancePath ? readJson(performancePath) : null;
    const resolvedPerformance = resolveCompanionPerformance(withPresentation, performanceDocument, config.output.frameRate);
    return { ...withPresentation, resolvedTimeline, resolvedShots: shotResolution.shots, resolvedPerformance, performancePath };
  });
  const assetManager = createLocalAssetManager({ repoRoot });
  return { configPath, config, markersPath, markers, scenes, assetManager, grammar, sources };
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
  const output = resolvePath(context.config.output.narrationAnalysis);
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
  const performancePaths = Object.fromEntries(Object.entries(context.config.companion.performanceAssets ?? {}).map(([viseme, assetId]) => [viseme, context.assetManager.fetch(assetId)]));
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
  const assetRegister = fs.readFileSync(resolvePath(context.config.episode.assetRegister), "utf8");
  for (const scene of context.scenes) {
    const finalFrame = Math.max(0, sceneFrameWindow(scene, context.config.output.frameRate).frameCount - 1);
    renderSceneSvg(scene, context.config.episode, context.config.output, "", context.grammar, timelineStateAtFrame(scene, scene.resolvedTimeline, finalFrame));
    for (const assetId of scene.assetIds ?? []) {
      if (!assetRegister.includes(`asset_id: \"${assetId}\"`)) errors.push(`${scene.id} references unknown episode asset ${assetId}`);
    }
  }
  if (!fs.existsSync(companionPath)) errors.push("Companion asset does not resolve");
  if (errors.length) throw new Error(`Episode validation failed:\n- ${errors.join("\n- ")}`);
  return { audioPath, companionPath, performancePaths, duration, ffprobe, ffmpeg: executable("ffmpeg") };
}

async function render(context, validation) {
  const generatedDir = resolvePath(context.config.output.generatedDirectory);
  const framesDir = path.join(generatedDir, "frames");
  const segmentsDir = path.join(generatedDir, "segments");
  fs.mkdirSync(framesDir, { recursive: true });
  fs.mkdirSync(segmentsDir, { recursive: true });
  const companionData = `data:image/png;base64,${fs.readFileSync(validation.companionPath).toString("base64")}`;
  const performanceData = Object.fromEntries(Object.entries(validation.performancePaths ?? {}).map(([viseme, filePath]) => [viseme, `data:image/png;base64,${fs.readFileSync(filePath).toString("base64")}`]));
  const frameFiles = [];
  const segmentFiles = [];
  for (const scene of context.scenes) {
    const frameCount = sceneFrameWindow(scene, context.config.output.frameRate).frameCount;
    if (scene.motion?.companionIdle || scene.resolvedPerformance) {
      const sequenceDir = path.join(framesDir, scene.id);
      fs.mkdirSync(sequenceDir, { recursive: true });
      for (let frame = 0; frame < frameCount; frame++) {
        const pngPath = path.join(sequenceDir, `${String(frame).padStart(6, "0")}.png`);
        const state = timelineStateAtFrame(scene, scene.resolvedTimeline, frame);
        state.performance = companionPerformanceStateAtFrame(scene.resolvedPerformance, frame);
        if (state.performance && performanceData[state.performance.mouth]) state.performance.mouthData = performanceData[state.performance.mouth];
        const svg = renderSceneSvg(scene, context.config.episode, context.config.output, companionData, context.grammar, state);
        await sharp(Buffer.from(svg), { density: 144 }).resize(context.config.output.width, context.config.output.height).png().toFile(pngPath);
        frameFiles.push(pngPath);
      }
      const segmentPath = path.join(segmentsDir, `${scene.id}.mp4`);
      run(validation.ffmpeg, [
        "-y", "-framerate", String(context.config.output.frameRate), "-start_number", "0",
        "-i", path.join(sequenceDir, "%06d.png"), "-frames:v", String(frameCount),
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", "-an", segmentPath
      ]);
      segmentFiles.push(segmentPath);
      continue;
    }
    const changeFrames = timelineChangeFrames(scene.resolvedTimeline, frameCount);
    for (let index = 0; index < changeFrames.length - 1; index++) {
      const startFrame = changeFrames[index];
      const endFrame = changeFrames[index + 1];
      if (endFrame <= startFrame) continue;
      const suffix = changeFrames.length === 2 ? "" : `-${String(index + 1).padStart(3, "0")}`;
      const svgPath = path.join(framesDir, `${scene.id}${suffix}.svg`);
      const pngPath = path.join(framesDir, `${scene.id}${suffix}.png`);
      const state = timelineStateAtFrame(scene, scene.resolvedTimeline, startFrame);
      fs.writeFileSync(svgPath, renderSceneSvg(scene, context.config.episode, context.config.output, companionData, context.grammar, state));
      await sharp(svgPath, { density: 144 }).resize(context.config.output.width, context.config.output.height).png().toFile(pngPath);
      const segmentPath = path.join(segmentsDir, `${scene.id}${suffix}.mp4`);
      const frameDuration = (endFrame - startFrame) / context.config.output.frameRate;
      run(validation.ffmpeg, [
        "-y", "-loop", "1", "-t", frameDuration.toFixed(6), "-i", pngPath,
        "-r", String(context.config.output.frameRate), "-c:v", "libx264", "-preset", "veryfast",
        "-crf", "20", "-pix_fmt", "yuv420p", "-an", segmentPath
      ]);
      frameFiles.push(svgPath, pngPath);
      segmentFiles.push(segmentPath);
    }
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
  const timelinePath = path.join(generatedDir, "timeline-resolution-report.json");
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
    visualGrammar: { profile: context.grammar.id, source: context.grammar.source },
    sceneCount: context.scenes.length,
    presentationPlan: context.scenes.map((scene) => ({
      id: scene.id,
      archetype: scene.presentation.archetype,
      composition: scene.presentation.composition,
      transition: scene.presentation.transition,
      shots: shotsManifestEntry(scene.resolvedShots),
      timeline: timelineManifestEntry(scene.resolvedTimeline),
      companionPerformance: companionPerformanceManifest(scene.resolvedPerformance)
    })),
    generatedFrames: frameFiles.map(fileRecord),
    generatedSegments: segmentFiles.map(fileRecord),
    timingReport: relative(timingPath),
    timelineResolutionReport: relative(timelinePath),
    assetManifest: relative(assetManifestPath),
    provenance: relative(provenancePath)
  }, null, 2)}\n`);
  fs.writeFileSync(timelinePath, `${JSON.stringify(buildTimelineReport(context), null, 2)}\n`);
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
    const reviewPoints = context.config.review?.includeTimelineStates
      ? timelineReviewPoints(scene, context.config.output.frameRate)
      : [{ frame: null, timestamp: scene.endSeconds - Math.min(2, scene.durationSeconds / 2), label: scene.presentation.composition }];
    for (const [index, point] of reviewPoints.entries()) {
      const output = path.join(framesDir, `${scene.id}${reviewPoints.length > 1 ? `-${String(index + 1).padStart(2, "0")}` : ""}.png`);
      run(validation.ffmpeg, ["-y", "-ss", point.timestamp.toFixed(3), "-i", videoPath, "-frames:v", "1", output]);
      frames.push({ ...scene, title: point.label, path: output, timestamp: point.timestamp });
    }
  }
  const contactSvg = path.join(reviewDir, "contact-sheet.svg");
  const contactPng = path.join(reviewDir, "contact-sheet.png");
  fs.writeFileSync(contactSvg, contactSheetSvg(frames, context.grammar));
  await sharp(contactSvg, { density: 144 }).png().toFile(contactPng);
  const sceneContactDir = path.join(reviewDir, "scene-contact-sheets");
  fs.mkdirSync(sceneContactDir, { recursive: true });
  for (const scene of context.scenes) {
    const sceneFrames = frames.filter((frame) => frame.id === scene.id);
    const sceneContact = path.join(sceneContactDir, `${scene.id}.png`);
    await sharp(Buffer.from(contactSheetSvg(sceneFrames, context.grammar)), { density: 144 }).png().toFile(sceneContact);
  }
  const temporalContactSheet = context.config.review?.temporalSampleSeconds
    ? generateTemporalContactSheet(validation.ffmpeg, videoPath, reviewDir, context.config.review.temporalSampleSeconds, validation.duration)
    : null;
  const mediaReportPath = path.join(reviewDir, "media-report.json");
  fs.writeFileSync(mediaReportPath, `${JSON.stringify({
    inputNarration: fileRecord(validation.audioPath),
    outputVideo: fileRecord(videoPath),
    media: probeMedia(validation.ffprobe, videoPath),
    expectedDurationSeconds: validation.duration,
    reviewFrameCount: frames.length,
    contactSheet: relative(contactPng),
    sceneContactSheets: relative(sceneContactDir),
    temporalContactSheet: temporalContactSheet ? relative(temporalContactSheet) : null,
    warnings: [
      "Timeline motion is deterministic and editorially authored.",
      context.scenes.some((scene) => scene.resolvedPerformance?.layers.includes("lip-sync"))
        ? "Companion performance includes deterministic idle motion, authored facial motion and audio-derived simplified visemes."
        : context.scenes.some((scene) => scene.motion?.companionIdle || scene.resolvedPerformance)
        ? "Companion character motion is limited to deterministic idle, blink and posture treatments; no lip-sync is present."
        : "No lip-sync, facial animation or companion character animation is present."
    ]
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

function generateTemporalContactSheet(ffmpeg, videoPath, reviewDir, intervalSeconds, durationSeconds) {
  if (!Number.isFinite(intervalSeconds) || intervalSeconds <= 0) {
    throw new Error(`review.temporalSampleSeconds must be a positive number`);
  }
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
    throw new Error(`Review duration must be a positive number`);
  }
  const output = path.join(reviewDir, "temporal-contact-sheet.png");
  const columns = 5;
  const rows = Math.max(1, Math.ceil(Math.ceil(durationSeconds / intervalSeconds) / columns));
  run(ffmpeg, [
    "-y", "-i", videoPath,
    "-vf", `fps=1/${intervalSeconds},scale=384:216:force_original_aspect_ratio=decrease,pad=384:216:(ow-iw)/2:(oh-ih)/2,tile=${columns}x${rows}:padding=0:margin=0`,
    "-frames:v", "1", output
  ]);
  return output;
}

function timelineReviewPoints(scene, frameRate) {
  const window = sceneFrameWindow(scene, frameRate);
  const frameCount = window.frameCount;
  const reviewFrames = new Set([0]);
  for (const event of scene.resolvedTimeline.events) {
    reviewFrames.add(Math.min(frameCount - 1, event.startFrame));
    if (event.endFrame > event.startFrame) reviewFrames.add(Math.min(frameCount - 1, event.endFrame));
  }
  for (const shot of scene.resolvedShots ?? []) reviewFrames.add(Math.min(frameCount - 1, shot.startFrame));
  const points = [...reviewFrames].sort((left, right) => left - right)
    .filter((frame) => frame < frameCount)
    .map((frame, index) => ({
      frame,
      // Sample safely inside the requested state. Exact cut/event timestamps can
      // resolve to the preceding encoded frame when FFmpeg seeks between GOPs.
      timestamp: (window.startFrame + Math.min(frameCount - 1, frame + 5)) / frameRate,
      label: `state ${String(index + 1).padStart(2, "0")}`
    }));
  const finalFrame = Math.max(0, frameCount - Math.round(frameRate * 1.5));
  if (!points.some((point) => point.frame === finalFrame)) {
    points.push({ frame: finalFrame, timestamp: scene.startSeconds + finalFrame / frameRate, label: "final hold" });
  }
  return points;
}

function contactSheetSvg(frames, grammar) {
  const palette = grammar.palette;
  const height = Math.max(270, Math.ceil(frames.length / 5) * 270);
  const cells = frames.map((frame, index) => {
    const column = index % 5;
    const row = Math.floor(index / 5);
    const x = column * 384;
    const y = row * 270;
    const image = `data:image/png;base64,${fs.readFileSync(frame.path).toString("base64")}`;
    return `<image href="${image}" x="${x}" y="${y}" width="384" height="216"/><rect x="${x}" y="${y + 216}" width="384" height="54" fill="${palette.dark}"/><text x="${x + 12}" y="${y + 249}" font-size="20" fill="#ffffff">${frame.id} · ${xml(frame.title)}</text>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="${height}" viewBox="0 0 1920 ${height}"><style>text{font-family:${grammar.typography.fontFamily}}</style><rect width="1920" height="${height}" fill="${palette.dark}"/>${cells}</svg>`;
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

function buildTimelineReport(context) {
  return {
    version: 1,
    episodeId: context.config.episode.id,
    frameRate: context.config.output.frameRate,
    timingRule: "round(offsetSeconds * frameRate); state is evaluated from integer scene-relative frames",
    scenes: context.scenes.map((scene) => ({
      id: scene.id,
      durationSeconds: scene.durationSeconds,
      elementIds: scene.resolvedTimeline.elements,
      initiallyHidden: scene.resolvedTimeline.initiallyHidden,
      declaredEvents: scene.resolvedTimeline.declared,
      resolvedEvents: scene.resolvedTimeline.events,
      warnings: scene.resolvedTimeline.warnings,
      shots: shotsManifestEntry(scene.resolvedShots)
    }))
  };
}

function buildAssetManifest(context, validation) {
  return {
    narration: { assetId: context.config.narration.assetId, ...fileRecord(validation.audioPath) },
    companion: { assetId: context.config.companion.assetId, ...fileRecord(validation.companionPath) },
    companionFacialAssets: Object.entries(context.config.companion.performanceAssets ?? {}).map(([viseme, assetId]) => ({ viseme, assetId, ...fileRecord(validation.performancePaths[viseme]) })),
    companionPerformance: context.scenes.filter((scene) => scene.resolvedPerformance).map((scene) => ({
      sceneId: scene.id,
      timeline: fileRecord(scene.performancePath),
      model: companionPerformanceManifest(scene.resolvedPerformance)
    })),
    authoredVisuals: [...new Set(context.scenes.flatMap((scene) => scene.assetIds ?? []))].map((assetId) => ({ assetId, source: context.config.episode.assetRegister })),
    unresolvedAssets: [],
    placeholderCount: 0
  };
}

function buildProvenance(context, validation, videoPath) {
  const narrationSource = context.config.narration.source;
  return {
    writtenJournal: fileRecord(context.sources.journalPath),
    spokenNarrative: {
      ...fileRecord(context.sources.narrativePath),
      convention: context.sources.narrativeConvention
    },
    sceneConfiguration: fileRecord(context.configPath),
    timingMarkers: fileRecord(context.markersPath),
    narration: {
      assetId: context.config.narration.assetId,
      ...fileRecord(validation.audioPath),
      source: narrationSource ? { ...narrationSource, ...fileRecord(context.assetManager.fetch(narrationSource.assetId)) } : null,
      treatment: narrationSource
        ? `lossless PCM extract retained from ${narrationSource.startSeconds}s to ${narrationSource.endSeconds}s; AAC encode only during MP4 mux`
        : "whole recording retained; AAC encode only during MP4 mux"
    },
    companion: {
      assetId: context.config.companion.assetId,
      ...fileRecord(validation.companionPath),
      treatment: context.scenes.some((scene) => scene.resolvedPerformance?.layers.includes("lip-sync"))
        ? "approved neutral asset with deterministic layered idle, blink, posture and audio-derived simplified viseme overlays"
        : context.scenes.some((scene) => scene.motion?.companionIdle || scene.resolvedPerformance)
        ? "approved neutral asset with deterministic frame-indexed idle, blink and posture motion; no lip-sync"
        : "static neutral asset; no lip-sync or character animation"
    },
    companionPerformance: context.scenes.filter((scene) => scene.resolvedPerformance).map((scene) => ({
      sceneId: scene.id,
      timeline: fileRecord(scene.performancePath),
      model: companionPerformanceManifest(scene.resolvedPerformance)
    })),
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
