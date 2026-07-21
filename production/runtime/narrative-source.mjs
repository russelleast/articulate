import fs from "node:fs";
import path from "node:path";

export function episodeNumber(episodeId) {
  const match = String(episodeId).match(/(?:episode-)?(\d{4})$/);
  if (!match) throw new Error(`Episode id must end with four digits: ${episodeId}`);
  return match[1];
}

export function conventionalNarrativePath(episodeId) {
  return `production/episodes/${episodeNumber(episodeId)}/narrative.md`;
}

export function resolveEpisodeSources({ repoRoot, episode }) {
  if (!episode?.journalSource) {
    throw new Error(`Episode ${episode?.id ?? "unknown"} must declare episode.journalSource`);
  }

  const conventionalPath = conventionalNarrativePath(episode.id);
  const narrativeSource = episode.narrativeSource ?? conventionalPath;
  const isLegacy = narrativeSource !== conventionalPath;

  if (isLegacy && episode.narrativeSourceConvention !== "legacy") {
    throw new Error(
      `Episode ${episode.id} narration must resolve to ${conventionalPath}; ` +
      `older productions must explicitly set episode.narrativeSourceConvention to "legacy"`
    );
  }

  const journalPath = path.resolve(repoRoot, episode.journalSource);
  const narrativePath = path.resolve(repoRoot, narrativeSource);
  if (!fs.existsSync(journalPath)) throw new Error(`Missing written journal source: ${episode.journalSource}`);
  if (!fs.existsSync(narrativePath)) throw new Error(`Missing spoken narrative source: ${narrativeSource}`);

  return {
    journalSource: episode.journalSource,
    journalPath,
    narrativeSource,
    narrativePath,
    narrativeConvention: isLegacy ? "legacy" : "narrative.md"
  };
}
