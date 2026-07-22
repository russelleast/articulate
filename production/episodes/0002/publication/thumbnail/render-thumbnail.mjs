import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../../..");
const sharp = require(path.join(repoRoot, "site/node_modules/sharp"));
const sourceDir = path.join(here, "source");
const previewDir = path.join(here, "previews");
const companionPath = path.join(repoRoot, "production/assets/companion/v1/companion-neutral.png");
const companionSourceHref = "../../../../../assets/companion/v1/companion-neutral.png";
const width = 1280;
const height = 720;

const palette = Object.freeze({
  paper: "#f4f0e8", ink: "#172028", muted: "#8fa2aa", blue: "#55798b",
  paleBlue: "#dbe8eb", rust: "#a65d3f", white: "#fffdfa", dark: "#0d1820",
  darker: "#091218", line: "#6f858e"
});

await fs.mkdir(sourceDir, { recursive: true });
await fs.mkdir(previewDir, { recursive: true });
const companionBuffer = await fs.readFile(companionPath);
const companionData = `data:image/png;base64,${companionBuffer.toString("base64")}`;
const sourceSvg = thumbnail(companionSourceHref);
const renderSvg = thumbnail(companionData);
const pngPath = path.join(here, "episode-0002-thumbnail.png");

await fs.writeFile(path.join(sourceDir, "episode-0002-thumbnail.svg"), sourceSvg);
await sharp(Buffer.from(renderSvg), { density: 144 }).resize(width, height).png().toFile(pngPath);
await sharp(pngPath).resize(320, 180).png().toFile(path.join(previewDir, "episode-0002-thumbnail-320.png"));
await sharp(pngPath).resize(160, 90).png().toFile(path.join(previewDir, "episode-0002-thumbnail-160.png"));
await renderContactSheet(pngPath);

function thumbnail(companion) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="field" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${palette.darker}"/><stop offset=".58" stop-color="${palette.dark}"/><stop offset="1" stop-color="#132833"/></linearGradient>
    <radialGradient id="warm"><stop offset="0" stop-color="#b78360" stop-opacity=".34"/><stop offset="1" stop-color="#b78360" stop-opacity="0"/></radialGradient>
    <radialGradient id="cool"><stop offset="0" stop-color="#497b91" stop-opacity=".31"/><stop offset="1" stop-color="#497b91" stop-opacity="0"/></radialGradient>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#000" flood-opacity=".4"/></filter>
    <filter id="soft-shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000" flood-opacity=".28"/></filter>
    <pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse"><path d="M 42 0 L 0 0 0 42" fill="none" stroke="#6f858e" stroke-opacity=".11"/></pattern>
  </defs>
  <rect width="1280" height="720" fill="url(#field)"/><rect width="1280" height="720" fill="url(#grid)"/>
  <ellipse cx="1060" cy="260" rx="430" ry="360" fill="url(#warm)"/><ellipse cx="250" cy="610" rx="530" ry="300" fill="url(#cool)"/>
  ${brandMarker()}
  <g transform="translate(66 130)">
    <rect x="0" y="-23" width="112" height="6" rx="3" fill="${palette.rust}"/>
    <text x="0" y="72" font-family="Inter,Arial,sans-serif" font-size="82" font-weight="800" letter-spacing="-3" fill="${palette.paper}">WHAT IS</text>
    <text x="0" y="158" font-family="Inter,Arial,sans-serif" font-size="82" font-weight="800" letter-spacing="-3" fill="${palette.rust}">ARTICULATE?</text>
    <text x="3" y="202" font-family="Inter,Arial,sans-serif" font-size="15" font-weight="700" letter-spacing="2.2" fill="${palette.muted}">AN EXPLORATION INTO ARCHITECTURAL INTELLIGENCE</text>
  </g>
  <g transform="translate(56 438)" filter="url(#soft-shadow)">
    <rect width="630" height="190" rx="24" fill="#101d24" fill-opacity=".94" stroke="#36515e" stroke-width="2"/>
    <text x="30" y="38" font-family="Inter,Arial,sans-serif" font-size="13" font-weight="700" fill="${palette.rust}" letter-spacing="2">LIVING ARCHITECTURAL MODEL</text>
    ${modelDiagram()}
  </g>
  <g transform="translate(745 68)" filter="url(#shadow)">
    <ellipse cx="285" cy="590" rx="248" ry="31" fill="#020608" opacity=".5"/>
    ${companionImage(companion, 0, 0, 565, 600)}
  </g>
</svg>`;
}

function modelDiagram() {
  const nodes = [
    { x: 28, y: 88, w: 112, label: "UNDERSTAND" },
    { x: 166, y: 88, w: 102, label: "PRESERVE" },
    { x: 294, y: 88, w: 92, label: "REASON" },
    { x: 412, y: 88, w: 92, label: "EXPLORE" }
  ];
  return `<line x1="84" y1="132" x2="458" y2="132" stroke="${palette.blue}" stroke-width="3"/>
    ${nodes.map(({ x, y, w, label }) => `<g><rect x="${x}" y="${y}" width="${w}" height="62" rx="13" fill="${palette.white}" stroke="#91a4aa" stroke-width="2"/><text x="${x + w / 2}" y="${y + 37}" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="12" font-weight="800" fill="${palette.ink}" letter-spacing=".5">${label}</text></g>`).join("")}
    <g><circle cx="558" cy="119" r="48" fill="${palette.paleBlue}" stroke="${palette.rust}" stroke-width="3"/><text x="558" y="115" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="11" font-weight="800" fill="${palette.ink}">LIVING</text><text x="558" y="130" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="11" font-weight="800" fill="${palette.ink}">MODEL</text></g>`;
}

function brandMarker() {
  return `<g transform="translate(76 54)"><text font-family="Inter,Arial,sans-serif" font-size="17" font-weight="700" fill="${palette.paper}" letter-spacing="5">ARTICULATE</text><text x="1" y="22" font-family="Inter,Arial,sans-serif" font-size="9" font-weight="600" fill="${palette.blue}" letter-spacing="2.1">AI-NATIVE ARCHITECTURE JOURNAL</text></g>
  <g transform="translate(1120 49)"><rect width="84" height="36" rx="18" fill="#192a33" stroke="#47616d"/><text x="42" y="23" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="13" font-weight="700" fill="${palette.paper}" letter-spacing="1.2">0002</text></g>`;
}

function companionImage(href, x, y, imageWidth, imageHeight) {
  return `<svg x="${x}" y="${y}" width="${imageWidth}" height="${imageHeight}" viewBox="377 48 917 976" preserveAspectRatio="xMidYMid meet" overflow="visible"><image href="${href}" width="1536" height="1024"/></svg>`;
}

async function renderContactSheet(thumbnailPath) {
  const png = await fs.readFile(thumbnailPath);
  const href = `data:image/png;base64,${png.toString("base64")}`;
  const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="650" viewBox="0 0 1600 650"><rect width="100%" height="100%" fill="#0b151c"/><text x="48" y="55" font-family="Inter,Arial,sans-serif" font-size="28" font-weight="800" fill="${palette.paper}">EPISODE 0002 · THUMBNAIL SIZE REVIEW</text><text x="48" y="86" font-family="Inter,Arial,sans-serif" font-size="16" fill="${palette.muted}">1280 × 720 source · 320 px browsing size · 160 px compact size</text><text x="48" y="130" font-family="Inter,Arial,sans-serif" font-size="13" fill="${palette.rust}" letter-spacing="1.5">SOURCE DISPLAYED AT 640 × 360</text><image href="${href}" x="48" y="150" width="640" height="360"/><text x="740" y="130" font-family="Inter,Arial,sans-serif" font-size="13" fill="${palette.rust}">320 × 180</text><image href="${href}" x="740" y="150" width="320" height="180"/><text x="1120" y="130" font-family="Inter,Arial,sans-serif" font-size="13" fill="${palette.rust}">160 × 90</text><image href="${href}" x="1120" y="150" width="160" height="90"/></svg>`;
  await fs.writeFile(path.join(sourceDir, "episode-0002-thumbnail-contact-sheet.svg"), sheet.replaceAll(href, "../episode-0002-thumbnail.png"));
  await sharp(Buffer.from(sheet), { density: 144 }).resize(1600, 650).png().toFile(path.join(here, "episode-0002-thumbnail-contact-sheet.png"));
}
