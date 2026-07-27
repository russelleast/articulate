import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

const lifecycleStatus = z.enum([
  "draft",
  "planned",
  "exploratory",
  "current",
  "partially-revised",
  "superseded",
  "historical"
]);

const repositoryPath = z.string().min(1);

const episodes = defineCollection({
  loader: glob({ pattern: ["**/*.{md,mdx}", "!episode-roadmap.md"], base: "../docs/episodes" }),
  schema: z.object({
    id: z.string().min(1).optional(),
    episode: z.number().int().positive().optional(),
    title: z.string(),
    summary: z.string().optional(),
    description: z.string().optional(),
    published: z.union([z.literal(false), z.coerce.date()]),
    date: z.union([z.literal(null), z.coerce.date()]).optional(),
    updated: z.coerce.date().optional(),
    status: lifecycleStatus,
    sequence: z.number().int().nonnegative().optional(),
    season: z.union([z.string(), z.number().int().positive()]),
    topics: z.array(z.string()).default([]),
    questions: z.array(z.string()).default([]),
    related_principles: z.array(reference("principles")).default([]),
    related_patterns: z.array(reference("patterns")).default([]),
    related_decisions: z.array(reference("decisions")).default([]),
    related_experiments: z.array(reference("experiments")).default([]),
    repository_paths: z.array(repositoryPath).default([]),
    featured: z.boolean().default(false),
    author: z.string().min(1).optional(),
    image: z.string().min(1).optional(),
    thumbnail: z.string().min(1).optional(),
    youtube_url: z.string().url().optional()
  }).transform((data) => {
    const publicationDate = data.published === false ? null : data.published;
    const frontMatterDate = data.date instanceof Date ? data.date : null;
    const sequence = data.sequence ?? data.episode ?? 0;

    return {
      ...data,
      id: data.id ?? `episode-${sequence.toString().padStart(4, "0")}`,
      summary: data.summary ?? data.description ?? "",
      published: publicationDate ?? new Date(0),
      updated: data.updated ?? frontMatterDate ?? publicationDate ?? new Date(0),
      sequence,
      season: data.season.toString(),
      isPublished: publicationDate !== null
    };
  })
});

const principles = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/principles" }),
  schema: z.object({
    id: z.string().min(1),
    title: z.string(),
    summary: z.string(),
    status: z.enum(["proposed", "current", "revised", "retired"]).default("proposed"),
    published: z.coerce.date(),
    updated: z.coerce.date(),
    principle: z.string().min(1),
    rationale: z.string().min(1),
    consequences: z.array(z.string().min(1)).min(1),
    applies_to: z.array(z.string().min(1)).min(1),
    related_episodes: z.array(reference("episodes")).default([]),
    related_decisions: z.array(reference("decisions")).default([]),
    related_patterns: z.array(reference("patterns")).default([]),
    related_architecture: z.array(z.string().min(1)).default([]),
    featured: z.boolean().default(false)
  })
});

const patterns = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/patterns" }),
  schema: z.object({
    id: z.string().min(1),
    title: z.string(),
    summary: z.string(),
    status: z.enum(["emerging", "current", "revised", "retired"]).default("emerging"),
    maturity: z.enum(["experimental", "validated", "stable"]).default("experimental"),
    topics: z.array(z.string()).default([]),
    introduced_in: reference("episodes").optional(),
    related_decisions: z.array(reference("decisions")).default([]),
    repository_paths: z.array(repositoryPath).default([])
  })
});

const decisions = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/decisions" }),
  schema: z.object({
    id: z.string().min(1),
    title: z.string(),
    status: z.enum(["proposed", "accepted", "superseded", "rejected"]),
    decided: z.coerce.date(),
    supersedes: reference("decisions").nullable().default(null),
    superseded_by: reference("decisions").nullable().default(null),
    episode: reference("episodes").optional(),
    topics: z.array(z.string()).default([]),
    repository_paths: z.array(repositoryPath).default([])
  })
});

const experiments = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/experiments" }),
  schema: z.object({
    id: z.string().min(1),
    title: z.string(),
    summary: z.string(),
    research_question: z.string(),
    hypothesis: z.string(),
    status: z.enum(["planned", "active", "completed", "paused", "abandoned"]).default("planned"),
    started: z.coerce.date().optional(),
    updated: z.coerce.date(),
    related_episodes: z.array(reference("episodes")).default([]),
    related_decisions: z.array(reference("decisions")).default([]),
    related_patterns: z.array(reference("patterns")).default([]),
    repository_assets: z.array(repositoryPath).default([]),
    findings: z.string().optional()
  })
});

export const collections = { episodes, principles, patterns, decisions, experiments };
