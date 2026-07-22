import { access, copyFile, mkdir, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = path.resolve(siteRoot, "..");
const episodesRoot = path.join(repositoryRoot, "docs", "episodes");
const publicRoot = path.join(siteRoot, "public");
const registryPath = path.join(repositoryRoot, "production", "assets", "registry.yaml");
const thumbnailPattern = /^\/media\/episodes\/(\d{4})\/([^/]+\.png)$/;
const diagramPattern = /^\/diagrams\/([a-z0-9-]+\.svg)$/;

const entries = await readdir(episodesRoot, { withFileTypes: true });
const staged = [];
const referencedDiagrams = new Map();
const registry = JSON.parse(await readFile(registryPath, "utf8"));
const diagramsByPublishedPath = new Map(
  registry.assets
    .filter((asset) => asset.type === "diagram")
    .map((asset) => [publishedDiagramPath(asset), asset])
);

for (const entry of entries) {
  if (!entry.isFile() || !entry.name.endsWith(".md")) continue;

  const document = await readFile(path.join(episodesRoot, entry.name), "utf8");
  const frontMatter = document.match(/^---\s*\n([\s\S]*?)\n---/u)?.[1];
  const isPublished = frontMatter && !/^published:\s*false\s*$/mu.test(frontMatter);
  const thumbnail = frontMatter?.match(/^thumbnail:\s*(\S+)\s*$/mu)?.[1];

  if (isPublished) {
    for (const match of document.matchAll(/!\[[^\]]*\]\((\/diagrams\/[^\s)]+)(?:\s+["'][^"']*["'])?\)/gu)) {
      const diagramPath = match[1];
      if (!diagramPattern.test(diagramPath)) {
        throw new Error(`${entry.name}: diagram must use /diagrams/<diagram-id>.svg`);
      }
      referencedDiagrams.set(diagramPath, entry.name);
    }
  }

  if (!thumbnail) continue;

  const match = thumbnail.match(thumbnailPattern);
  if (!match) {
    throw new Error(
      `${entry.name}: thumbnail must use /media/episodes/<four-digit episode>/<png filename>`
    );
  }

  const [, episode, filename] = match;
  const source = path.join(
    repositoryRoot,
    "production",
    "episodes",
    episode,
    "publication",
    "thumbnail",
    filename
  );
  const destination = path.join(publicRoot, thumbnail.slice(1));

  await mkdir(path.dirname(destination), { recursive: true });
  await copyFile(source, destination);
  staged.push(path.relative(repositoryRoot, source));
}

for (const [diagramPath, episode] of referencedDiagrams) {
  const asset = diagramsByPublishedPath.get(diagramPath);
  if (!asset) {
    throw new Error(`${episode}: ${diagramPath} has no diagram entry in production/assets/registry.yaml`);
  }

  await requireFile(path.join(repositoryRoot, asset.source), `${episode}: D2 source for ${diagramPath}`);
  await requireFile(path.join(repositoryRoot, asset.location), `${episode}: generated asset for ${diagramPath}`);
}

console.log(
  `Staged ${staged.length} episode thumbnail${staged.length === 1 ? "" : "s"} and validated ` +
  `${referencedDiagrams.size} published diagram asset${referencedDiagrams.size === 1 ? "" : "s"}.`
);

function publishedDiagramPath(asset) {
  const location = asset.location.replaceAll(path.sep, "/");
  const prefix = "site/public";
  if (!location.startsWith(`${prefix}/`)) {
    throw new Error(`${asset.id}: published diagram location must be below site/public`);
  }
  return location.slice(prefix.length);
}

async function requireFile(file, label) {
  try {
    await access(file);
  } catch {
    throw new Error(`${label} does not exist: ${path.relative(repositoryRoot, file)}`);
  }
}
