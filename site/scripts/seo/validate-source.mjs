import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import { diagnostic, printDiagnostics, summarize, writeJson } from "./diagnostics.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
export const siteRoot = path.resolve(scriptDirectory, "../..");
export const repositoryRoot = path.resolve(siteRoot, "..");

async function exists(file) {
  try { await access(file); return true; } catch { return false; }
}

export function parseFrontmatter(source, file) {
  if (!source.startsWith("---\n") && !source.startsWith("---\r\n")) {
    throw new Error(`${file}: front matter must start on the first line`);
  }
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error(`${file}: front matter has no closing delimiter`);
  return { data: parse(match[1]) ?? {}, body: source.slice(match[0].length) };
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

function validDate(value) {
  if (value instanceof Date) return !Number.isNaN(value.valueOf());
  if (typeof value !== "string" && typeof value !== "number") return false;
  return !Number.isNaN(new Date(value).valueOf());
}

async function markdownFiles(directory, exclude = []) {
  if (!(await exists(directory))) return [];
  return (await readdir(directory, { recursive: true }))
    .filter((name) => /\.mdx?$/.test(name) && !exclude.includes(name))
    .map((name) => path.join(directory, name));
}

function sourceEntry(type, absoluteFile, data, body, root) {
  const file = path.relative(root, absoluteFile);
  const filenameId = path.basename(absoluteFile).replace(/\.mdx?$/, "");
  return { type, absoluteFile, file, filenameId, id: text(data.id) || filenameId, data, body };
}

async function loadEntries(root) {
  const definitions = [
    ["episode", path.join(root, "docs/episodes"), ["episode-roadmap.md"]],
    ["decision", path.join(root, "docs/adrs"), []],
    ["principle", path.join(root, "site/src/content/principles"), []],
    ["pattern", path.join(root, "site/src/content/patterns"), []],
    ["experiment", path.join(root, "site/src/content/experiments"), []]
  ];
  const entries = [];
  const diagnostics = [];
  for (const [type, directory, excluded] of definitions) {
    for (const absoluteFile of await markdownFiles(directory, excluded)) {
      const file = path.relative(root, absoluteFile);
      try {
        const source = await readFile(absoluteFile, "utf8");
        const { data, body } = parseFrontmatter(source, file);
        entries.push(sourceEntry(type, absoluteFile, data, body, root));
      } catch (error) {
        diagnostics.push(diagnostic("error", file, "frontmatter-parse", error.message));
      }
    }
  }
  return { entries, diagnostics };
}

function addRequired(entry, diagnostics) {
  if (!text(entry.data.title)) {
    diagnostics.push(diagnostic("error", entry.file, "required-title", "Add a non-blank front matter title."));
  }
  const description = text(entry.data.summary) || text(entry.data.description);
  if (!description) {
    diagnostics.push(diagnostic("error", entry.file, "required-description", "Add a non-blank summary or description in front matter."));
  } else if (description.length < 50 || description.length > 180) {
    diagnostics.push(diagnostic("warning", entry.file, "description-length-guidance", `Description is ${description.length} characters; review its clarity rather than editing solely to meet a character count.`));
  }
  if (!entry.id) diagnostics.push(diagnostic("error", entry.file, "required-id", "Add a stable page identifier."));
}

function validateDates(entry, diagnostics) {
  const applicable = entry.type === "episode"
    ? ["published", "date", "updated"]
    : entry.type === "principle" ? ["published", "updated"]
    : entry.type === "decision" ? ["decided"]
    : entry.type === "experiment" ? ["started", "updated"] : [];
  for (const field of applicable) {
    const value = entry.data[field];
    if (value === undefined || value === null || value === false) continue;
    if (!validDate(value)) diagnostics.push(diagnostic("error", entry.file, "invalid-date", `Front matter field '${field}' is not a valid date.`));
  }
}

async function validateAssets(entry, diagnostics, root) {
  for (const field of ["image", "thumbnail"]) {
    const value = text(entry.data[field]);
    if (!value || /^https?:\/\//.test(value)) continue;
    const target = value.startsWith("/")
      ? path.join(root, "site/public", value)
      : path.resolve(path.dirname(entry.absoluteFile), value);
    if (!(await exists(target))) diagnostics.push(diagnostic("error", entry.file, "missing-local-asset", `The ${field} '${value}' does not exist at ${path.relative(root, target)}.`));
  }
  if (entry.type === "episode" && text(entry.data.thumbnail) && !text(entry.data.thumbnail_alt)) {
    diagnostics.push(diagnostic("error", entry.file, "missing-thumbnail-alt", "Add meaningful thumbnail_alt text; do not derive it from the filename."));
  }

  for (const match of entry.body.matchAll(/!\[([^\]]*)\]\(([^ )]+)(?:\s+[^)]*)?\)/g)) {
    const [, alt, url] = match;
    if (!alt.trim()) diagnostics.push(diagnostic("error", entry.file, "missing-image-alt", `Markdown image '${url}' has blank alt text. Add meaningful text or use an explicit decorative image in Astro.`));
    if (!/^https?:\/\//.test(url) && !url.startsWith("#")) {
      const target = url.startsWith("/") ? path.join(root, "site/public", url) : path.resolve(path.dirname(entry.absoluteFile), url);
      if (!(await exists(target))) diagnostics.push(diagnostic("error", entry.file, "missing-markdown-asset", `Markdown image '${url}' does not exist at ${path.relative(root, target)}.`));
    }
  }
}

async function validateRepositoryPaths(entry, diagnostics, root) {
  for (const field of ["repository_paths", "repository_assets"]) {
    for (const value of entry.data[field] ?? []) {
      if (typeof value !== "string" || !value.trim()) {
        diagnostics.push(diagnostic("error", entry.file, "invalid-repository-path", `The '${field}' entry must be a non-blank repository-relative path.`));
        continue;
      }
      const target = path.resolve(root, value);
      if (!target.startsWith(`${root}${path.sep}`) || !(await exists(target))) {
        diagnostics.push(diagnostic("error", entry.file, "invalid-repository-path", `Repository path '${value}' does not exist inside this repository.`));
      }
    }
  }
}

function validateRelationships(entries, diagnostics) {
  const ids = {
    episodes: new Set(entries.filter(({ type }) => type === "episode").flatMap((entry) => [entry.id, entry.filenameId])),
    decisions: new Set(entries.filter(({ type }) => type === "decision").flatMap((entry) => [entry.id, entry.filenameId])),
    principles: new Set(entries.filter(({ type }) => type === "principle").flatMap((entry) => [entry.id, entry.filenameId])),
    patterns: new Set(entries.filter(({ type }) => type === "pattern").flatMap((entry) => [entry.id, entry.filenameId])),
    experiments: new Set(entries.filter(({ type }) => type === "experiment").flatMap((entry) => [entry.id, entry.filenameId]))
  };
  const fields = { related_episodes: "episodes", related_decisions: "decisions", related_principles: "principles", related_patterns: "patterns", related_experiments: "experiments" };
  for (const entry of entries) {
    for (const [field, collection] of Object.entries(fields)) {
      for (const reference of entry.data[field] ?? []) {
        const id = typeof reference === "string" ? reference : reference?.id;
        if (!ids[collection].has(id)) diagnostics.push(diagnostic("error", entry.file, "invalid-related-content", `'${field}' references '${id}', which is not a real ${collection} identifier.`));
      }
    }
  }
}

function validateDuplicates(entries, diagnostics) {
  for (const [field, severity] of [["title", "error"], ["description", "warning"]]) {
    const values = new Map();
    for (const entry of entries) {
      const value = field === "description" ? text(entry.data.summary) || text(entry.data.description) : text(entry.data.title);
      if (!value) continue;
      const normalized = value.toLocaleLowerCase("en-GB").replace(/\s+/g, " ");
      values.set(normalized, [...(values.get(normalized) ?? []), entry]);
    }
    for (const group of values.values()) {
      if (group.length < 2) continue;
      for (const entry of group) diagnostics.push(diagnostic(severity, entry.file, `duplicate-${field}`, `${field[0].toUpperCase()}${field.slice(1)} duplicates ${group.filter((other) => other !== entry).map(({ file }) => file).join(", ")}.`));
    }
  }
}

function validateEpisodes(entries, diagnostics) {
  const episodes = entries.filter(({ type }) => type === "episode");
  const sequences = new Map();
  for (const entry of episodes) {
    const sequence = entry.data.sequence ?? entry.data.episode;
    if (!Number.isInteger(sequence) || sequence < 0) diagnostics.push(diagnostic("error", entry.file, "invalid-episode-sequence", "Set sequence (or legacy episode) to a non-negative integer."));
    else sequences.set(sequence, [...(sequences.get(sequence) ?? []), entry]);
    const season = entry.data.season;
    if (!((typeof season === "string" && season.trim()) || (Number.isInteger(season) && season > 0))) diagnostics.push(diagnostic("error", entry.file, "invalid-episode-season", "Set season to a non-blank label or positive integer."));
    if (entry.data.published !== false && !validDate(entry.data.published)) diagnostics.push(diagnostic("error", entry.file, "invalid-publication-date", "Published Episodes require a valid 'published' date; use false only for unpublished work."));
  }
  for (const [sequence, group] of sequences) {
    if (group.length < 2) continue;
    for (const entry of group) diagnostics.push(diagnostic("error", entry.file, "duplicate-episode-sequence", `Episode sequence ${sequence} is also used by ${group.filter((other) => other !== entry).map(({ file }) => file).join(", ")}.`));
  }
}

async function validateStaticPages(root, diagnostics) {
  const directory = path.join(root, "site/src/pages");
  const files = (await readdir(directory, { recursive: true })).filter((name) => name.endsWith(".astro") && !name.includes("["));
  let inspected = 0;
  for (const name of files) {
    const file = path.join(directory, name);
    const source = await readFile(file, "utf8");
    if (!/<(?:BaseLayout|ArticleLayout)\b/.test(source)) continue;
    inspected += 1;
    if (name === "index.astro") continue;
    const opening = source.match(/<(?:BaseLayout|ArticleLayout)\b[\s\S]*?>/)?.[0] ?? "";
    if (!/\btitle=(?:"[^"]+"|'[^']+'|\{[^}]+\})/.test(opening)) diagnostics.push(diagnostic("error", path.relative(root, file), "required-title", "The static page layout must receive a non-blank title."));
    if (!/\bdescription=(?:"[^"]+"|'[^']+'|\{[^}]+\})/.test(opening)) diagnostics.push(diagnostic("error", path.relative(root, file), "required-description", "The static page layout must receive a non-blank description."));
  }
  return inspected;
}

export async function validateSource({ root = repositoryRoot } = {}) {
  const { entries, diagnostics } = await loadEntries(root);
  for (const entry of entries) {
    addRequired(entry, diagnostics);
    validateDates(entry, diagnostics);
    await validateAssets(entry, diagnostics, root);
    await validateRepositoryPaths(entry, diagnostics, root);
  }
  validateRelationships(entries, diagnostics);
  validateDuplicates(entries, diagnostics);
  validateEpisodes(entries, diagnostics);
  const staticPagesInspected = await validateStaticPages(root, diagnostics);
  return { diagnostics, entries, sourceFilesInspected: entries.length + staticPagesInspected };
}

async function main() {
  const reportFile = path.resolve(siteRoot, process.env.SEO_SOURCE_REPORT ?? "reports/seo-source.json");
  const result = await validateSource();
  const report = { generatedAt: new Date().toISOString(), ...summarize(result.diagnostics), sourceFilesInspected: result.sourceFilesInspected, diagnostics: result.diagnostics };
  await writeJson(reportFile, report);
  printDiagnostics(result.diagnostics);
  process.exitCode = report.errors ? 1 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
