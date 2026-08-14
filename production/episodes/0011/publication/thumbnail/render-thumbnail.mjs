#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../../..");
const sharp = require(path.join(repoRoot, "site/node_modules/sharp"));
const config = JSON.parse(await fs.readFile(path.join(here, "thumbnail.config.json"), "utf8"));
const sourceDirectory = path.join(here, "source");
const previewDirectory = path.join(here, "previews");
const framePath = path.join(sourceDirectory, "episode-0011-presenter-540_000.png");
const blendedPath = path.join(sourceDirectory, "episode-0011-presenter-540_000-blended.png");
const editablePath = path.join(sourceDirectory, "episode-0011-thumbnail.svg");
const outputPath = path.join(here, "episode-0011-thumbnail.png");
await fs.mkdir(sourceDirectory, { recursive: true });
await fs.mkdir(previewDirectory, { recursive: true });

execFileSync("ffmpeg", ["-y", "-v", "error", "-ss", String(config.presenter.frameTimestampSeconds), "-i", path.resolve(here, config.presenter.sourceMedia), "-frames:v", "1", framePath]);
await createSoftCutout(framePath, blendedPath);

const { width, height } = config.canvas;
const placement = config.presenter.placement;
const presenter = await sharp(blendedPath).resize(placement.width, placement.height, { fit: "fill" }).png().toBuffer();
const cropLeft = Math.max(0, -placement.x);
const cropTop = Math.max(0, -placement.y);
const presenterLayer = await sharp(presenter).extract({
  left: cropLeft,
  top: cropTop,
  width: Math.min(placement.width - cropLeft, width - Math.max(0, placement.x)),
  height: Math.min(placement.height - cropTop, height - Math.max(0, placement.y))
}).png().toBuffer();

const background = backgroundSvg();
const foreground = foregroundSvg();
await fs.writeFile(editablePath, background.replace("</svg>", `<image href="${path.basename(blendedPath)}" x="${placement.x}" y="${placement.y}" width="${placement.width}" height="${placement.height}"/>${foreground.replace(/^<svg[^>]*>|<\/svg>$/g, "")}</svg>`));
await sharp(Buffer.from(background), { density: 144 }).resize(width, height).composite([
  { input: presenterLayer, left: Math.max(0, placement.x), top: Math.max(0, placement.y) },
  { input: Buffer.from(foreground) }
]).flatten({ background: "#081219" }).png({ compressionLevel: 9 }).toFile(outputPath);

await sharp(outputPath).resize(320, 180).png().toFile(path.join(previewDirectory, "episode-0011-thumbnail-320.png"));
await sharp(outputPath).resize(160, 90).png().toFile(path.join(previewDirectory, "episode-0011-thumbnail-160.png"));
const data = `data:image/png;base64,${(await fs.readFile(outputPath)).toString("base64")}`;
await sharp(Buffer.from(contactSheet(data)), { density: 144 }).resize(1600, 820).png().toFile(path.join(here, "episode-0011-thumbnail-contact-sheet.png"));
console.log(`Episode 0011 thumbnail: ${path.relative(repoRoot, outputPath)}`);

async function createSoftCutout(input, output) {
  const adjusted = sharp(input).modulate({ brightness: 1.04, saturation: 0.9 }).sharpen({ sigma: 0.7 });
  const { data, info } = await adjusted.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const alpha = Buffer.alloc(info.width * info.height);
  for (let pixel = 0; pixel < info.width * info.height; pixel += 1) {
    const offset = pixel * info.channels;
    const luminance = data[offset] * 0.2126 + data[offset + 1] * 0.7152 + data[offset + 2] * 0.0722;
    const progress = Math.max(0, Math.min(1, (luminance - 20) / 50));
    alpha[pixel] = Math.round(progress * progress * (3 - 2 * progress) * 255);
  }
  const feathered = await sharp(alpha, { raw: { width: info.width, height: info.height, channels: 1 } }).blur(1.6).raw().toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let pixel = 0; pixel < info.width * info.height; pixel += 1) {
    const source = pixel * info.channels;
    const target = pixel * 4;
    rgba[target] = data[source];
    rgba[target + 1] = data[source + 1];
    rgba[target + 2] = data[source + 2];
    rgba[target + 3] = feathered.data[pixel * feathered.info.channels];
  }
  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toFile(output);
}

function backgroundSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720"><defs><linearGradient id="field" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#071118"/><stop offset=".58" stop-color="#0d1820"/><stop offset="1" stop-color="#142a35"/></linearGradient><radialGradient id="cool"><stop stop-color="#4d8296" stop-opacity=".24"/><stop offset="1" stop-color="#4d8296" stop-opacity="0"/></radialGradient><pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse"><path d="M42 0H0V42" fill="none" stroke="#8fa2aa" stroke-opacity=".105"/></pattern></defs><rect width="1280" height="720" fill="url(#field)"/><rect width="1280" height="720" fill="url(#grid)"/><ellipse cx="210" cy="560" rx="520" ry="330" fill="url(#cool)"/></svg>`;
}

function foregroundSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720"><defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#c77a58"/></marker></defs><g transform="translate(64 75)"><text font-family="Inter,Arial,sans-serif" font-size="18" font-weight="750" fill="#f4f0e8" letter-spacing="5.2">ARTICULATE</text><text y="23" font-family="Inter,Arial,sans-serif" font-size="9" font-weight="650" fill="#6f95a5" letter-spacing="2.1">AI-NATIVE ARCHITECTURE JOURNAL</text></g><g transform="translate(1125 60)"><rect width="95" height="34" rx="17" fill="#172a34" stroke="#55798b"/><text x="47.5" y="22" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="12" font-weight="750" fill="#f4f0e8" letter-spacing="1.4">EP 11</text></g><path d="M514 147H1190" stroke="#55798b" opacity=".42"/><g transform="translate(566 170)"><rect y="-19" width="96" height="6" rx="3" fill="#a65d3f"/><text y="34" font-family="Inter,Arial,sans-serif" font-size="14" font-weight="750" letter-spacing="2.4" fill="#8fa2aa">${config.episode.eyebrow}</text><text y="105" font-family="Inter,Arial,sans-serif" font-size="54" font-weight="800" letter-spacing="-1.8" fill="#f4f0e8">${config.episode.headline[0]}</text><text y="176" font-family="Inter,Arial,sans-serif" font-size="68" font-weight="850" letter-spacing="-2" fill="#c77a58">${config.episode.headline[1]}</text></g><g transform="translate(590 485)" font-family="Inter,Arial,sans-serif"><rect width="178" height="62" rx="15" fill="#38261f" stroke="#a65d3f" stroke-width="2"/><text x="89" y="38" text-anchor="middle" font-size="19" font-weight="850" fill="#f4f0e8">MEMORY?</text><path d="M198 31H258" fill="none" stroke="#c77a58" stroke-width="4" marker-end="url(#arrow)"/><g transform="translate(282)"><rect width="125" height="62" rx="14" fill="#18313a" stroke="#55798b"/><rect x="141" width="125" height="62" rx="14" fill="#18313a" stroke="#55798b"/><rect x="282" width="125" height="62" rx="14" fill="#18313a" stroke="#55798b"/><text x="62" y="38" text-anchor="middle" font-size="15" font-weight="750" fill="#dbe8eb">KNOWLEDGE</text><text x="203" y="38" text-anchor="middle" font-size="15" font-weight="750" fill="#dbe8eb">CONTEXT</text><text x="344" y="38" text-anchor="middle" font-size="15" font-weight="750" fill="#dbe8eb">EXECUTION</text></g></g></svg>`;
}

function contactSheet(imageHref) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="820"><rect width="1600" height="820" fill="#081219"/><text x="48" y="55" font-family="Inter,Arial,sans-serif" font-size="27" font-weight="800" fill="#f4f0e8">EPISODE 0011 · THUMBNAIL REVIEW</text><text x="48" y="88" font-family="Inter,Arial,sans-serif" font-size="15" fill="#8fa2aa">Full composition · 25% scale · mobile scale</text><image href="${imageHref}" x="48" y="150" width="960" height="540"/><image href="${imageHref}" x="1060" y="150" width="320" height="180"/><image href="${imageHref}" x="1060" y="408" width="160" height="90"/><text x="48" y="742" font-family="Inter,Arial,sans-serif" font-size="14" fill="#8fa2aa">Presenter left · memory decomposition · mobile-safe question</text></svg>`;
}
