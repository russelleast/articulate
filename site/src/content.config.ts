import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

const lifecycleStatus = z.enum([
  "draft",
  "exploratory",
  "current",
  "partially-revised",
  "superseded",
  "historical"
]);

const repositoryPath = z.string().min(1);

const episodes = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/episodes" }),
  schema: z.object({
    id: z.string().min(1),
    title: z.string(),
    summary: z.string(),
    published: z.coerce.date(),
    updated: z.coerce.date(),
    status: lifecycleStatus,
    sequence: z.number().int().positive(),
    season: z.string(),
    topics: z.array(z.string()).default([]),
    questions: z.array(z.string()).default([]),
    related_patterns: z.array(reference("patterns")).default([]),
    related_decisions: z.array(reference("decisions")).default([]),
    related_experiments: z.array(reference("experiments")).default([]),
    repository_paths: z.array(repositoryPath).default([]),
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

export const collections = { episodes, patterns, decisions, experiments };
