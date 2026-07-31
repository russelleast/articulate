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

execFileSync("ffmpeg", [
  "-y", "-v", "error",
  "-ss", config.presenter.frameTimestampSeconds.toFixed(3),
  "-i", sourceMedia,
  "-frames:v", "1",
  extractedFramePath
]);

await createBlendedPresenter(extractedFramePath, blendedFramePath, config.presenter.blend);
const presenterBuffer = await fs.readFile(blendedFramePath);
const presenterSourceHref = path.basename(blendedFramePath);
const editableSvg = thumbnailSvg(presenterSourceHref);

await fs.writeFile(editableSourcePath, editableSvg);
const placement = config.presenter.placement;
const resizedPresenter = await sharp(presenterBuffer)
  .resize(placement.width, placement.height, { fit: "fill" })
  .png()
  .toBuffer();
const cropLeft = Math.max(0, -placement.x);
const cropTop = Math.max(0, -placement.y);
const presenterLayer = await sharp(resizedPresenter)
  .extract({
    left: cropLeft,
    top: cropTop,
    width: Math.min(placement.width - cropLeft, width - Math.max(0, placement.x)),
    height: Math.min(placement.height - cropTop, height - Math.max(0, placement.y))
  })
  .png()
  .toBuffer();
await sharp(Buffer.from(backgroundSvg()), { density: 144 })
  .resize(width, height)
  .composite([
    {
      input: presenterLayer,
      left: Math.max(0, placement.x),
      top: Math.max(0, placement.y)
    },
    { input: Buffer.from(foregroundSvg()) }
  ])
  .flatten({ background: "#0a141b" })
  .png({ compressionLevel: 9 })
  .toFile(outputPath);
await sharp(outputPath).resize(320, 180).png().toFile(preview25Path);
await sharp(outputPath).resize(160, 90).png().toFile(previewMobilePath);

const outputBuffer = await fs.readFile(outputPath);
const outputData = `data:image/png;base64,${outputBuffer.toString("base64")}`;
await sharp(Buffer.from(safeAreaSvg(outputData)), { density: 144 })
  .resize(width, height)
  .png()
  .toFile(safeAreaPath);
await sharp(Buffer.from(contactSheetSvg(outputData)), { density: 144 })
  .resize(1600, 820)
  .png()
  .toFile(contactSheetPath);

console.log(`Episode 0000 thumbnail: ${relative(outputPath)}`);
console.log(`Presenter frame: ${relative(extractedFramePath)} @ ${config.presenter.frameTimestampSeconds.toFixed(3)}s`);
console.log(`Editable source: ${relative(editableSourcePath)}`);
console.log(`25% preview: ${relative(preview25Path)}`);
console.log(`Mobile preview: ${relative(previewMobilePath)}`);
console.log(`Safe-area preview: ${relative(safeAreaPath)}`);

async function createBlendedPresenter(inputPath, output, blend) {
  const adjusted = sharp(inputPath)
    .modulate({ brightness: 1.04, saturation: 0.9 })
    .sharpen({ sigma: 0.7 });
  const { data, info } = await adjusted.ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const alpha = Buffer.alloc(info.width * info.height);

  for (let pixel = 0; pixel < info.width * info.height; pixel += 1) {
    const sourceOffset = pixel * info.channels;
    const red = data[sourceOffset];
    const green = data[sourceOffset + 1];
    const blue = data[sourceOffset + 2];
    const luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722;
    const progress = Math.max(0, Math.min(1,
      (luminance - blend.darkThreshold) / blend.softThresholdRange
    ));
    alpha[pixel] = Math.round((progress * progress * (3 - 2 * progress)) * 255);
  }

  const feathered = await sharp(alpha, {
    raw: { width: info.width, height: info.height, channels: 1 }
  }).blur(blend.featherRadius).raw().toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);

  for (let pixel = 0; pixel < info.width * info.height; pixel += 1) {
    const sourceOffset = pixel * info.channels;
    const outputOffset = pixel * 4;
    rgba[outputOffset] = data[sourceOffset];
    rgba[outputOffset + 1] = data[sourceOffset + 1];
    rgba[outputOffset + 2] = data[sourceOffset + 2];
    rgba[outputOffset + 3] = feathered.data[pixel * feathered.info.channels];
  }

  await sharp(rgba, {
    raw: { width: info.width, height: info.height, channels: 4 }
  }).png().toFile(output);
}

function thumbnailSvg(presenterHref) {
  const placement = config.presenter.placement;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  ${backgroundContent()}
  <image href="${presenterHref}" x="${placement.x}" y="${placement.y}" width="${placement.width}" height="${placement.height}" preserveAspectRatio="xMidYMid meet"/>
  ${foregroundContent()}
</svg>`;
}

function backgroundSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    ${backgroundContent()}
  </svg>`;
}

function foregroundSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    ${foregroundContent()}
  </svg>`;
}

function backgroundContent() {
  return `<defs>
    <linearGradient id="field" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#071118"/>
      <stop offset=".58" stop-color="#0d1820"/>
      <stop offset="1" stop-color="#142a35"/>
    </linearGradient>
    <radialGradient id="cool" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#4d8296" stop-opacity=".24"/>
      <stop offset="1" stop-color="#4d8296" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="warm" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#a65d3f" stop-opacity=".17"/>
      <stop offset="1" stop-color="#a65d3f" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse">
      <path d="M 42 0 L 0 0 0 42" fill="none" stroke="#8fa2aa" stroke-opacity=".105"/>
    </pattern>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#field)"/>
  <rect width="${width}" height="${height}" fill="url(#grid)"/>
  <ellipse cx="230" cy="550" rx="520" ry="330" fill="url(#cool)"/>
  <ellipse cx="1060" cy="290" rx="390" ry="350" fill="url(#warm)"/>`;
}

function foregroundContent() {
  const [firstLine, secondLine] = config.episode.headline;
  return `<defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#55798b"/>
    </marker>
  </defs>
  ${architectureTexture()}
  <path d="M 514 147 L 1188 147" stroke="#55798b" stroke-width="1" opacity=".42"/>
  <g transform="translate(568 191)">
    <rect x="0" y="-19" width="96" height="6" rx="3" fill="#a65d3f"/>
    <text x="0" y="65" font-family="Inter,Arial,sans-serif" font-size="57" font-weight="800" letter-spacing="-2.1" fill="#f4f0e8">${escapeXml(firstLine)}</text>
    <text x="0" y="142" font-family="Inter,Arial,sans-serif" font-size="69" font-weight="800" letter-spacing="-2.5" fill="#f4f0e8">${escapeXml(secondLine)}</text>
  </g>
  <g transform="translate(572 387)">
    <circle cx="5" cy="5" r="5" fill="#a65d3f"/>
    <text x="24" y="10" font-family="Inter,Arial,sans-serif" font-size="16" font-weight="700" letter-spacing="2.2" fill="#8fa2aa">${escapeXml(config.episode.seriesLabel)}</text>
  </g>
  ${brandMarker()}`;
}

function architectureTexture() {
  const labels = ["PROBLEM", "PRINCIPLES", "CAPABILITIES", "ARCHITECTURE"];
  const widths = [85, 104, 116, 128];
  let x = 0;
  const nodes = labels.map((label, index) => {
    const currentX = x;
    x += widths[index] + 30;
    return `<g>
      ${index ? `<line x1="${currentX - 28}" y1="24" x2="${currentX - 5}" y2="24" stroke="#55798b" stroke-width="2" marker-end="url(#arrow)"/>` : ""}
      <rect x="${currentX}" y="0" width="${widths[index]}" height="48" rx="10" fill="#142832" stroke="${index === 3 ? "#a65d3f" : "#55798b"}" stroke-opacity=".68"/>
      <text x="${currentX + widths[index] / 2}" y="29" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="10" font-weight="700" letter-spacing=".6" fill="#dbe8eb">${label}</text>
    </g>`;
  }).join("");
  return `<g transform="translate(708 528)" opacity=".64">${nodes}</g>`;
}

function brandMarker() {
  return `<g transform="translate(64 75)">
    <text x="0" y="0" font-family="Inter,Arial,sans-serif" font-size="18" font-weight="750" fill="#f4f0e8" letter-spacing="5.2">ARTICULATE</text>
    <text x="1" y="23" font-family="Inter,Arial,sans-serif" font-size="9" font-weight="650" fill="#6f95a5" letter-spacing="2.1">AI-NATIVE ARCHITECTURE JOURNAL</text>
  </g>
  <g transform="translate(1134 60)">
    <rect width="80" height="34" rx="17" fill="#172a34" stroke="#55798b"/>
    <text x="40" y="22" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="12" font-weight="750" fill="#f4f0e8" letter-spacing="1.4">EP 0</text>
  </g>`;
}

function safeAreaSvg(imageHref) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
    <image href="${imageHref}" width="${width}" height="${height}"/>
    <rect x="${safeMargin}" y="${safeMargin}" width="${width - safeMargin * 2}" height="${height - safeMargin * 2}" fill="none" stroke="#f2b84b" stroke-width="3" stroke-dasharray="12 9"/>
    <rect x="1080" y="620" width="145" height="54" rx="10" fill="#000" fill-opacity=".72" stroke="#f2b84b" stroke-width="2"/>
    <text x="1152" y="652" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" fill="#f2b84b">PLAYER OVERLAY</text>
  </svg>`;
}

function contactSheetSvg(imageHref) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="820">
    <rect width="1600" height="820" fill="#081219"/>
    <text x="48" y="55" font-family="Inter,Arial,sans-serif" font-size="27" font-weight="800" fill="#f4f0e8">EPISODE 0000 · PRESENTER THUMBNAIL REVIEW</text>
    <text x="48" y="88" font-family="Inter,Arial,sans-serif" font-size="15" fill="#8fa2aa">Full composition · 25% scale · mobile scale</text>
    <text x="48" y="132" font-family="Inter,Arial,sans-serif" font-size="13" font-weight="700" fill="#a65d3f" letter-spacing="1.4">1280 × 720 SOURCE</text>
    <image href="${imageHref}" x="48" y="150" width="960" height="540"/>
    <text x="1060" y="132" font-family="Inter,Arial,sans-serif" font-size="13" font-weight="700" fill="#a65d3f" letter-spacing="1.4">320 × 180</text>
    <image href="${imageHref}" x="1060" y="150" width="320" height="180"/>
    <text x="1060" y="390" font-family="Inter,Arial,sans-serif" font-size="13" font-weight="700" fill="#a65d3f" letter-spacing="1.4">160 × 90</text>
    <image href="${imageHref}" x="1060" y="408" width="160" height="90"/>
    <text x="48" y="742" font-family="Inter,Arial,sans-serif" font-size="14" fill="#8fa2aa">Presenter frame ${config.presenter.frameTimestampSeconds.toFixed(3)}s · soft dark-background blend · ${safeMargin}px safe margin</text>
  </svg>`;
}

function escapeXml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function relative(filePath) {
  return path.relative(repoRoot, filePath);
}
