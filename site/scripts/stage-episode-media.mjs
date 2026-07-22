import { copyFile, mkdir, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = path.resolve(siteRoot, "..");
const episodesRoot = path.join(repositoryRoot, "docs", "episodes");
const publicRoot = path.join(siteRoot, "public");
const thumbnailPattern = /^\/media\/episodes\/(\d{4})\/([^/]+\.png)$/;

const entries = await readdir(episodesRoot, { withFileTypes: true });
const staged = [];

for (const entry of entries) {
  if (!entry.isFile() || !entry.name.endsWith(".md")) continue;

  const document = await readFile(path.join(episodesRoot, entry.name), "utf8");
  const frontMatter = document.match(/^---\s*\n([\s\S]*?)\n---/u)?.[1];
  const thumbnail = frontMatter?.match(/^thumbnail:\s*(\S+)\s*$/mu)?.[1];

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

console.log(`Staged ${staged.length} episode thumbnail${staged.length === 1 ? "" : "s"} from production.`);
