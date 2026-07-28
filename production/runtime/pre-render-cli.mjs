#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  buildSourceAlignment,
  compileTimeline,
  extractMarkdownSections,
  sourceHashes,
  validateScenePlan
} from "./pre-render-workflow.mjs";
import { normaliseWhisperTranscript } from "./transcript-alignment.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const [command, ...arguments_] = process.argv.slice(2);
const options = parseArguments(arguments_);
const episode = options.episode;
if (!episode) fail("Missing --episode <id>");
const episodeDir = path.join(repoRoot, "production/episodes", episode);
const planPath = path.join(episodeDir, "scene-plan.yaml");
const plan = readJson(planPath);
const alignmentPath = path.join(episodeDir, "alignment.json");
const transcriptPath = path.join(episodeDir, "transcript.json");

if (command === "normalise-transcript") {
  if (!options.raw) fail("normalise-transcript requires --raw <whisper-json>");
  const raw = readJson(path.resolve(repoRoot, options.raw));
  const transcript = normaliseWhisperTranscript(raw, {
    audio: plan.episode.audio,
    model: options.model ?? "whisper.cpp"
  });
  const output = options.output ?? transcriptPath;
  if (fs.existsSync(output) && options.force !== true) fail(`${relative(output)} exists; pass --force to replace it`);
  fs.writeFileSync(output, `${JSON.stringify(transcript, null, 2)}\n`);
  console.log(`Generated ${relative(output)} from timestamped audio transcription.`);
} else if (command === "inspect-sources") {
  const result = {
    version: 1,
    episode,
    hashes: sourceHashes(repoRoot, plan),
    written: extractMarkdownSections(fs.readFileSync(path.join(repoRoot, plan.episode.writtenSource), "utf8"), { includePreamble: true }),
    narrative: extractMarkdownSections(fs.readFileSync(path.join(repoRoot, plan.episode.narrativeSource), "utf8"), { includePreamble: false })
  };
  writeOrPrint(options.output, result);
} else if (command === "align-sources") {
  const transcript = readJson(transcriptPath);
  const written = extractMarkdownSections(
    fs.readFileSync(path.join(repoRoot, plan.episode.writtenSource), "utf8"),
    { includePreamble: true }
  );
  const narrative = extractMarkdownSections(
    fs.readFileSync(path.join(repoRoot, plan.episode.narrativeSource), "utf8")
  );
  const alignment = buildSourceAlignment({
    transcript,
    specifications: plan.sections,
    writtenSections: written,
    narrativeSections: narrative,
    audioDurationSeconds: probeDuration(path.join(repoRoot, plan.episode.audio))
  });
  if (fs.existsSync(alignmentPath) && options.force !== true) fail(`${relative(alignmentPath)} exists; pass --force to replace it`);
  fs.writeFileSync(alignmentPath, `${JSON.stringify(alignment, null, 2)}\n`);
  console.log(`Generated ${relative(alignmentPath)} with written, narrative and audio traceability.`);
} else if (command === "validate-plan" || command === "validate") {
  const alignment = fs.existsSync(alignmentPath) ? readJson(alignmentPath) : null;
  if (alignment && fs.existsSync(transcriptPath)) plan.__transcript = readJson(transcriptPath);
  const result = validateScenePlan(plan, {
    repoRoot,
    alignment,
    requireRenderedDiagrams: command === "validate"
  });
  delete plan.__transcript;
  printValidation(result);
  if (!result.valid) process.exitCode = 1;
} else if (command === "generate-timeline") {
  const transcript = readJson(transcriptPath);
  const alignment = readJson(alignmentPath);
  const timeline = compileTimeline(plan, transcript, alignment, { allowDraft: options["allow-draft"] === true });
  const output = options.output ?? path.join(episodeDir, "timeline.json");
  if (fs.existsSync(output) && options.force !== true) fail(`${relative(output)} exists; pass --force to replace the derived timeline`);
  fs.writeFileSync(output, `${JSON.stringify(timeline, null, 2)}\n`);
  console.log(`Generated ${relative(output)} from the preserved scene plan.`);
} else {
  fail("Usage: pre-render-cli.mjs <normalise-transcript|inspect-sources|align-sources|validate-plan|generate-timeline|validate> --episode <id> [--raw path] [--output path] [--allow-draft] [--force]");
}

function parseArguments(values) {
  const parsed = {};
  for (let index = 0; index < values.length; index++) {
    const key = values[index];
    if (!key.startsWith("--")) fail(`Unexpected argument: ${key}`);
    const name = key.slice(2);
    if (values[index + 1] && !values[index + 1].startsWith("--")) parsed[name] = values[++index];
    else parsed[name] = true;
  }
  return parsed;
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeOrPrint(output, value) {
  if (!output) console.log(JSON.stringify(value, null, 2));
  else {
    fs.writeFileSync(path.resolve(repoRoot, output), `${JSON.stringify(value, null, 2)}\n`);
    console.log(`Wrote ${output}`);
  }
}

function printValidation(result) {
  console.log(result.valid ? "Scene-plan validation passed." : "Scene-plan validation failed.");
  for (const warning of result.warnings) console.log(`WARN ${warning}`);
  for (const item of result.manualReview) console.log(`REVIEW ${item}`);
  for (const error of result.errors) console.error(`ERROR ${error}`);
}

function relative(file) {
  return path.relative(repoRoot, file).replaceAll(path.sep, "/");
}

function probeDuration(file) {
  const result = spawnSync("ffprobe", [
    "-v", "error", "-show_entries", "format=duration", "-of", "default=nk=1:nw=1", file
  ], { encoding: "utf8" });
  if (result.status !== 0) fail(`Unable to probe audio duration: ${result.stderr ?? "ffprobe failed"}`);
  return Number(result.stdout.trim());
}

function fail(message) {
  console.error(message);
  process.exit(2);
}
