#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { resolveEpisodeSources } from "./narrative-source.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const args = process.argv.slice(2);
const episode = valueAfter(args, "--episode");
const journalSource = valueAfter(args, "--journal");

if (!episode || !journalSource) {
  console.error("Usage: node production/runtime/narrative-source-cli.mjs --episode 0002 --journal docs/episodes/0002-what-is-articulate.md");
  process.exitCode = 2;
} else {
  try {
    const sources = resolveEpisodeSources({ repoRoot, episode: { id: episode, journalSource } });
    console.log(sources.narrativeSource);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

function valueAfter(values, flag) {
  const index = values.indexOf(flag);
  return index >= 0 ? values[index + 1] : null;
}
