import fs from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../../..");
const sharp = require(path.join(repoRoot, "site/node_modules/sharp"));
const config = JSON.parse(await fs.readFile(path.join(here, "thumbnail.config.json"), "utf8"));
const { width, height, safeMargin } = config.canvas;
const sourceMedia = path.resolve(here, config.presenter.sourceMedia);
const extractedFramePath = path.resolve(here, config.presenter.extractedFrame);
const blendedFramePath = path.resolve(here, config.presenter.blendedFrame);
const outputPath = path.resolve(here, config.output.file);
const editableSourcePath = path.resolve(here, config.output.editableSource);
const preview25Path = path.resolve(here, config.output.preview25Percent);
const previewMobilePath = path.resolve(here, config.output.previewMobile);
const safeAreaPath = path.resolve(here, config.output.safeAreaPreview);
const contactSheetPath = path.resolve(here, config.output.contactSheet);

await fs.mkdir(path.dirname(extractedFramePath), { recursive: true });
await fs.mkdir(path.dirname(preview25Path), { recursive: true });
execFileSync("ffmpeg", ["-y", "-v", "error", "-ss", config.presenter.frameTimestampSeconds.toFixed(3), "-i", sourceMedia, "-frames:v", "1", extractedFramePath]);
await createBlendedPresenter(extractedFramePath, blendedFramePath, config.presenter.blend);
const presenterBuffer = await fs.readFile(blendedFramePath);
const presenterSourceHref = path.basename(blendedFramePath);
await fs.writeFile(editableSourcePath, thumbnailSvg(presenterSourceHref));

const placement = config.presenter.placement;
const resizedPresenter = await sharp(presenterBuffer).resize(placement.width, placement.height, { fit: "fill" }).png().toBuffer();
const cropLeft = Math.max(0, -placement.x);
const cropTop = Math.max(0, -placement.y);
const presenterLayer = await sharp(resizedPresenter).extract({
  left: cropLeft,
  top: cropTop,
  width: Math.min(placement.width - cropLeft, width - Math.max(0, placement.x)),
  height: Math.min(placement.height - cropTop, height - Math.max(0, placement.y))
}).png().toBuffer();

await sharp(Buffer.from(backgroundSvg()), { density: 144 }).resize(width, height).composite([
  { input: presenterLayer, left: Math.max(0, placement.x), top: Math.max(0, placement.y) },
  { input: Buffer.from(foregroundSvg()) }
]).flatten({ background: "#0a141b" }).png({ compressionLevel: 9 }).toFile(outputPath);
await sharp(outputPath).resize(320, 180).png().toFile(preview25Path);
await sharp(outputPath).resize(160, 90).png().toFile(previewMobilePath);

const outputBuffer = await fs.readFile(outputPath);
const outputData = `data:image/png;base64,${outputBuffer.toString("base64")}`;
await sharp(Buffer.from(safeAreaSvg(outputData)), { density: 144 }).resize(width, height).png().toFile(safeAreaPath);
await sharp(Buffer.from(contactSheetSvg(outputData)), { density: 144 }).resize(1600, 820).png().toFile(contactSheetPath);

console.log(`Episode 0001 thumbnail: ${relative(outputPath)}`);
console.log(`Presenter frame: ${relative(extractedFramePath)} @ ${config.presenter.frameTimestampSeconds.toFixed(3)}s`);
console.log(`Editable source: ${relative(editableSourcePath)}`);
console.log(`25% preview: ${relative(preview25Path)}`);
console.log(`Mobile preview: ${relative(previewMobilePath)}`);

async function createBlendedPresenter(inputPath, output, blend) {
  const adjusted = sharp(inputPath).modulate({ brightness: 1.04, saturation: 0.9 }).sharpen({ sigma: 0.7 });
  const { data, info } = await adjusted.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const alpha = Buffer.alloc(info.width * info.height);
  for (let pixel = 0; pixel < info.width * info.height; pixel += 1) {
    const offset = pixel * info.channels;
    const luminance = data[offset] * 0.2126 + data[offset + 1] * 0.7152 + data[offset + 2] * 0.0722;
    const progress = Math.max(0, Math.min(1, (luminance - blend.darkThreshold) / blend.softThresholdRange));
    alpha[pixel] = Math.round(progress * progress * (3 - 2 * progress) * 255);
  }
  const feathered = await sharp(alpha, { raw: { width: info.width, height: info.height, channels: 1 } }).blur(blend.featherRadius).raw().toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let pixel = 0; pixel < info.width * info.height; pixel += 1) {
    const sourceOffset = pixel * info.channels;
    const targetOffset = pixel * 4;
    rgba[targetOffset] = data[sourceOffset];
    rgba[targetOffset + 1] = data[sourceOffset + 1];
    rgba[targetOffset + 2] = data[sourceOffset + 2];
    rgba[targetOffset + 3] = feathered.data[pixel * feathered.info.channels];
  }
  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } }).png().toFile(output);
}

function thumbnailSvg(presenterHref) {
  const placement = config.presenter.placement;
  return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${backgroundContent()}<image href="${presenterHref}" x="${placement.x}" y="${placement.y}" width="${placement.width}" height="${placement.height}" preserveAspectRatio="xMidYMid meet"/>${foregroundContent()}</svg>`;
}
function backgroundSvg() { return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${backgroundContent()}</svg>`; }
function foregroundSvg() { return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${foregroundContent()}</svg>`; }
function backgroundContent() {
  return `<defs>
    <linearGradient id="field" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#071118"/><stop offset=".58" stop-color="#0d1820"/><stop offset="1" stop-color="#142a35"/></linearGradient>
    <radialGradient id="cool"><stop offset="0" stop-color="#4d8296" stop-opacity=".24"/><stop offset="1" stop-color="#4d8296" stop-opacity="0"/></radialGradient>
    <radialGradient id="warm"><stop offset="0" stop-color="#a65d3f" stop-opacity=".17"/><stop offset="1" stop-color="#a65d3f" stop-opacity="0"/></radialGradient>
    <pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse"><path d="M42 0H0V42" fill="none" stroke="#8fa2aa" stroke-opacity=".105"/></pattern>
  </defs><rect width="${width}" height="${height}" fill="url(#field)"/><rect width="${width}" height="${height}" fill="url(#grid)"/><ellipse cx="230" cy="550" rx="520" ry="330" fill="url(#cool)"/><ellipse cx="1060" cy="290" rx="390" ry="350" fill="url(#warm)"/>`;
}
function foregroundContent() {
  const [firstLine, secondLine] = config.episode.headline;
  return `<defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#55798b"/></marker></defs>
    <path d="M514 147H1188" stroke="#55798b" opacity=".42"/>
    <g transform="translate(568 176)"><rect y="-19" width="96" height="6" rx="3" fill="#a65d3f"/><text y="34" font-family="Inter,Arial,sans-serif" font-size="14" font-weight="750" letter-spacing="2.4" fill="#8fa2aa">${config.episode.eyebrow}</text><text y="105" font-family="Inter,Arial,sans-serif" font-size="62" font-weight="800" letter-spacing="-2.2" fill="#f4f0e8">${firstLine}</text><text y="181" font-family="Inter,Arial,sans-serif" font-size="69" font-weight="800" letter-spacing="-2.5" fill="#a65d3f">${secondLine}</text></g>
    <g transform="translate(590 500)">${evidenceModel()}</g>
    <g transform="translate(64 75)"><text font-family="Inter,Arial,sans-serif" font-size="18" font-weight="750" fill="#f4f0e8" letter-spacing="5.2">ARTICULATE</text><text y="23" font-family="Inter,Arial,sans-serif" font-size="9" font-weight="650" fill="#6f95a5" letter-spacing="2.1">AI-NATIVE ARCHITECTURE JOURNAL</text></g>
    <g transform="translate(1134 60)"><rect width="80" height="34" rx="17" fill="#172a34" stroke="#55798b"/><text x="40" y="22" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="12" font-weight="750" fill="#f4f0e8" letter-spacing="1.4">EP 1</text></g>`;
}
function evidenceModel() {
  const nodes = [
    { x: 0, width: 105, label: "EVIDENCE" },
    { x: 145, width: 105, label: "CONNECT" },
    { x: 290, width: 105, label: "REASON" },
    { x: 435, width: 155, label: "UNDERSTANDING", active: true }
  ];
  return nodes.map((node, index) => `<g>${index ? `<line x1="${node.x - 35}" y1="24" x2="${node.x - 7}" y2="24" stroke="#55798b" stroke-width="2" marker-end="url(#arrow)"/>` : ""}<rect x="${node.x}" width="${node.width}" height="48" rx="10" fill="#142832" stroke="${node.active ? "#a65d3f" : "#55798b"}" stroke-opacity=".8"/><text x="${node.x + node.width / 2}" y="29" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="10" font-weight="700" letter-spacing=".6" fill="#dbe8eb">${node.label}</text></g>`).join("");
}
function safeAreaSvg(imageHref) { return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><image href="${imageHref}" width="${width}" height="${height}"/><rect x="${safeMargin}" y="${safeMargin}" width="${width - safeMargin * 2}" height="${height - safeMargin * 2}" fill="none" stroke="#f2b84b" stroke-width="3" stroke-dasharray="12 9"/></svg>`; }
function contactSheetSvg(imageHref) { return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="820"><rect width="1600" height="820" fill="#081219"/><text x="48" y="55" font-family="Inter,Arial,sans-serif" font-size="27" font-weight="800" fill="#f4f0e8">EPISODE 0001 · PRESENTER THUMBNAIL REVIEW</text><text x="48" y="88" font-family="Inter,Arial,sans-serif" font-size="15" fill="#8fa2aa">Full composition · 25% scale · mobile scale</text><image href="${imageHref}" x="48" y="150" width="960" height="540"/><image href="${imageHref}" x="1060" y="150" width="320" height="180"/><image href="${imageHref}" x="1060" y="408" width="160" height="90"/><text x="48" y="742" font-family="Inter,Arial,sans-serif" font-size="14" fill="#8fa2aa">Presenter frame ${config.presenter.frameTimestampSeconds.toFixed(3)}s · Episode 0000 soft blend · ${safeMargin}px safe margin</text></svg>`; }
function relative(filePath) { return path.relative(repoRoot, filePath); }
