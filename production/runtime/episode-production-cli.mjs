#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateProductionEpisode } from "./episode-production.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const args = process.argv.slice(2);
const command = args[0];
const episode = valueAfter(args, "--episode");
const journalSource = valueAfter(args, "--journal");
const audioDuration = valueAfter(args, "--audio-duration");

if (!["segments", "validate"].includes(command) || !episode || !journalSource) {
  console.error(
    "Usage: node production/runtime/episode-production-cli.mjs <segments|validate> " +
    "--episode 0003 --journal docs/episodes/0003-why-ai-native-systems.md [--audio-duration SECONDS]"
  );
  process.exitCode = 2;
} else {
  try {
    const result = validateProductionEpisode({
      repoRoot,
      episodeId: episode,
      journalSource,
      audioDurationSeconds: audioDuration === null ? undefined : Number(audioDuration)
    });
    if (command === "segments") {
      console.log(JSON.stringify({
        episodeId: result.episodeId,
        narrativeSource: result.sources.narrativeSource,
        narrativeSha256: result.narrativeSha256,
        segments: result.segments
      }, null, 2));
    } else if (!result.valid) {
      throw new Error(`Episode production validation failed:\n- ${result.errors.join("\n- ")}`);
    } else {
      console.log(
        `Episode production validation passed: ${result.episodeId}, ` +
        `${result.segments.length} narrative segments, ${result.storyboard.scenes.length} scenes.`
      );
      for (const warning of result.warnings) console.warn(`Warning: ${warning}`);
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

function valueAfter(values, flag) {
  const index = values.indexOf(flag);
  return index >= 0 ? values[index + 1] : null;
}
