import type { CollectionEntry } from "astro:content";

export type Episode = CollectionEntry<"episodes">;

export interface EpisodeSeason {
  id: string;
  name: string;
  description: string;
  order: number;
  episodes: Episode[];
}

export function latestPublishedEpisode(episodes: Episode[]): Episode | undefined {
  return [...episodes]
    .filter((episode) => episode.data.isPublished && episode.data.sequence > 0)
    .sort((a, b) => b.data.sequence - a.data.sequence)[0];
}

export function latestPublishedVideo(episodes: Episode[]): Episode | undefined {
  return [...episodes]
    .filter((episode) => episode.data.isPublished && episode.data.youtube_url && episode.data.thumbnail)
    .sort((a, b) => b.data.sequence - a.data.sequence)[0];
}

const seasonDefinitions = [
  {
    id: "season-1",
    aliases: ["1", "foundations"],
    name: "Season 1 — Foundations",
    description: "Establishing the problem, the AI-native design frame, and the architectural method that guides Articulate.",
    order: 1
  },
  {
    id: "season-2",
    aliases: ["2", "architectural-intelligence", "knowledge-model"],
    name: "Season 2 — Architectural Intelligence",
    description: "Building the Knowledge Model and connecting architectural knowledge, reasoning, runtime responsibilities, and governed evolution.",
    order: 2
  }
] as const;

export function groupEpisodesBySeason(episodes: Episode[]): EpisodeSeason[] {
  const groups = new Map<string, EpisodeSeason>();

  for (const episode of episodes) {
    const rawSeason = episode.data.season.trim().toLowerCase();
    const definition = seasonDefinitions.find((candidate) => candidate.aliases.includes(rawSeason as never));
    const id = definition?.id ?? `season-${rawSeason.replace(/[^a-z0-9]+/g, "-")}`;
    const group = groups.get(id) ?? {
      id,
      name: definition?.name ?? `Season ${episode.data.season}`,
      description: definition?.description ?? "A continuing phase in the evolution of Articulate.",
      order: definition?.order ?? (Number.parseInt(rawSeason, 10) || Number.MAX_SAFE_INTEGER),
      episodes: []
    };

    group.episodes.push(episode);
    groups.set(id, group);
  }

  return [...groups.values()]
    .map((season) => ({
      ...season,
      episodes: season.episodes.sort((a, b) => a.data.sequence - b.data.sequence)
    }))
    .sort((a, b) => a.order - b.order);
}
