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
  paper: "#f4f0e8",
  ink: "#172028",
  muted: "#8fa2aa",
  blue: "#55798b",
  paleBlue: "#dbe8eb",
  rust: "#a65d3f",
  dark: "#0d1820",
  darker: "#091218",
  line: "#6f858e"
});

await fs.mkdir(sourceDir, { recursive: true });
await fs.mkdir(previewDir, { recursive: true });

const companionBuffer = await fs.readFile(companionPath);
const companionData = `data:image/png;base64,${companionBuffer.toString("base64")}`;
const sourceSvg = thumbnail(companionSourceHref);
const renderSvg = thumbnail(companionData);
const pngPath = path.join(here, "episode-0004-thumbnail.png");
const sourcePath = path.join(sourceDir, "episode-0004-thumbnail.svg");
const previewPath = path.join(previewDir, "episode-0004-thumbnail-240.png");
const compactPreviewPath = path.join(previewDir, "episode-0004-thumbnail-160.png");
const safeAreaPath = path.join(previewDir, "episode-0004-thumbnail-safe-area.png");

await fs.writeFile(sourcePath, sourceSvg);
await sharp(Buffer.from(renderSvg), { density: 144 }).resize(width, height).png().toFile(pngPath);
await sharp(pngPath).resize(240, 135).png().toFile(previewPath);
await sharp(pngPath).resize(160, 90).png().toFile(compactPreviewPath);

const png = await fs.readFile(pngPath);
const href = `data:image/png;base64,${png.toString("base64")}`;
await sharp(Buffer.from(safeAreaPreview(href)), { density: 144 }).resize(width, height).png().toFile(safeAreaPath);
await renderContactSheet(href);

console.log(`Episode 0004 thumbnail: ${relative(pngPath)}`);
console.log(`Editable source: ${relative(sourcePath)}`);
console.log(`Small-size preview: ${relative(previewPath)}`);
console.log(`Compact preview: ${relative(compactPreviewPath)}`);
console.log(`Safe-area preview: ${relative(safeAreaPath)}`);

function thumbnail(companion) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="field" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${palette.darker}"/>
      <stop offset=".58" stop-color="${palette.dark}"/>
      <stop offset="1" stop-color="#132833"/>
    </linearGradient>
    <radialGradient id="warm"><stop offset="0" stop-color="#b78360" stop-opacity=".30"/><stop offset="1" stop-color="#b78360" stop-opacity="0"/></radialGradient>
    <radialGradient id="cool"><stop offset="0" stop-color="#497b91" stop-opacity=".30"/><stop offset="1" stop-color="#497b91" stop-opacity="0"/></radialGradient>
    <radialGradient id="system-glow"><stop offset="0" stop-color="#dbe8eb" stop-opacity=".58"/><stop offset=".46" stop-color="#7fb4c7" stop-opacity=".19"/><stop offset="1" stop-color="#7fb4c7" stop-opacity="0"/></radialGradient>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#000" flood-opacity=".42"/></filter>
    <filter id="soft-shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000" flood-opacity=".30"/></filter>
    <filter id="node-glow" x="-80%" y="-100%" width="260%" height="300%"><feDropShadow dx="0" dy="0" stdDeviation="9" flood-color="#9fd6e7" flood-opacity=".62"/></filter>
    <pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse"><path d="M 42 0 L 0 0 0 42" fill="none" stroke="${palette.line}" stroke-opacity=".11"/></pattern>
  </defs>
  <rect width="1280" height="720" fill="url(#field)"/>
  <rect width="1280" height="720" fill="url(#grid)"/>
  <ellipse cx="230" cy="610" rx="510" ry="300" fill="url(#cool)"/>
  <ellipse cx="1075" cy="250" rx="430" ry="350" fill="url(#warm)"/>
  ${brandMarker()}
  <g transform="translate(-52 105)" filter="url(#shadow)">
    <ellipse cx="250" cy="548" rx="208" ry="28" fill="#020608" opacity=".46"/>
    ${companionImage(companion, 0, 0, 500, 570)}
  </g>
  <g transform="translate(430 125)">
    <rect x="0" y="-25" width="112" height="6" rx="3" fill="${palette.rust}"/>
    <text x="0" y="62" font-family="Inter,Arial,sans-serif" font-size="72" font-weight="800" letter-spacing="-2.8" fill="${palette.paper}">FEATURES</text>
    <text x="0" y="137" font-family="Inter,Arial,sans-serif" font-size="70" font-weight="800" letter-spacing="-2.8" fill="${palette.rust}">AREN'T ENOUGH</text>
  </g>
  <g transform="translate(522 330)" filter="url(#soft-shadow)">
    <rect width="693" height="326" rx="24" fill="#101d24" fill-opacity=".94" stroke="#36515e" stroke-width="2"/>
    <text x="28" y="35" font-family="Inter,Arial,sans-serif" font-size="13" font-weight="700" fill="${palette.rust}" letter-spacing="2">SYSTEM CHARACTERISTICS</text>
    ${characteristicsDiagram()}
  </g>
</svg>`;
}

function characteristicsDiagram() {
  const centre = { x: 276, y: 126, w: 166, h: 82 };
  const nodes = [
    { x: 38, y: 70, w: 132, label: "TRUST", edge: "#a65d3f", strong: true },
    { x: 486, y: 70, w: 164, label: "RELIABILITY", edge: "#55798b" },
    { x: 505, y: 206, w: 145, label: "PERFORMANCE", edge: "#55798b" },
    { x: 276, y: 239, w: 166, label: "SCALABILITY", edge: "#55798b" },
    { x: 38, y: 206, w: 178, label: "OBSERVABILITY", edge: "#a65d3f", strong: true }
  ];
  const centreCx = centre.x + centre.w / 2;
  const centreCy = centre.y + centre.h / 2;
  const connectors = nodes.map((node) => {
    const nodeCx = node.x + node.w / 2;
    const nodeCy = node.y + 28;
    const width = node.strong ? 4 : 2.5;
    const opacity = node.strong ? 1 : .78;
    return `<line x1="${nodeCx}" y1="${nodeCy}" x2="${centreCx}" y2="${centreCy}" stroke="${node.edge}" stroke-width="${width}" stroke-linecap="round" opacity="${opacity}"/>`;
  }).join("");
  const labels = nodes.map((node) => `<g>
    <rect x="${node.x}" y="${node.y}" width="${node.w}" height="56" rx="13" fill="#172a34" stroke="${node.strong ? palette.rust : palette.line}" stroke-width="${node.strong ? 3 : 2}"/>
    <text x="${node.x + node.w / 2}" y="${node.y + 35}" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="13" font-weight="750" fill="${palette.paper}" letter-spacing=".55">${node.label}</text>
  </g>`).join("");
  return `${connectors}
    <ellipse cx="${centreCx}" cy="${centreCy}" rx="156" ry="106" fill="url(#system-glow)"/>
    ${labels}
    <g filter="url(#node-glow)">
      <rect x="${centre.x}" y="${centre.y}" width="${centre.w}" height="${centre.h}" rx="18" fill="${palette.paleBlue}" stroke="${palette.rust}" stroke-width="4"/>
      <text x="${centreCx}" y="${centre.y + 37}" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="17" font-weight="800" fill="${palette.ink}" letter-spacing=".9">AI SYSTEM</text>
      <text x="${centreCx}" y="${centre.y + 59}" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="10" font-weight="700" fill="${palette.blue}" letter-spacing="1.25">OPERABLE BY DESIGN</text>
    </g>`;
}

function brandMarker() {
  return `<g transform="translate(76 54)">
    <text font-family="Inter,Arial,sans-serif" font-size="17" font-weight="700" fill="${palette.paper}" letter-spacing="5">ARTICULATE</text>
    <text x="1" y="22" font-family="Inter,Arial,sans-serif" font-size="9" font-weight="600" fill="${palette.blue}" letter-spacing="2.1">AI-NATIVE ARCHITECTURE JOURNAL</text>
  </g>
  <g transform="translate(1112 49)">
    <rect width="92" height="38" rx="19" fill="#192a33" stroke="#47616d"/>
    <text x="46" y="25" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="14" font-weight="800" fill="${palette.paper}" letter-spacing="1.3">EP. 4</text>
  </g>`;
}

function companionImage(href, x, y, imageWidth, imageHeight) {
  return `<svg x="${x}" y="${y}" width="${imageWidth}" height="${imageHeight}" viewBox="377 48 917 976" preserveAspectRatio="xMidYMid meet" overflow="visible"><image href="${href}" width="1536" height="1024"/></svg>`;
}

function safeAreaPreview(imageHref) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
    <image href="${imageHref}" width="1280" height="720"/>
    <rect x="52" y="28" width="1176" height="664" rx="16" fill="none" stroke="${palette.paper}" stroke-width="3" stroke-dasharray="12 10" opacity=".9"/>
    <rect x="924" y="101" width="304" height="68" rx="12" fill="${palette.darker}" fill-opacity=".78"/>
    <text x="1076" y="130" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="13" font-weight="700" fill="${palette.paper}" letter-spacing="1.2">SAFE-AREA REVIEW</text>
    <text x="1076" y="151" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="11" fill="${palette.muted}">52 px horizontal · 28 px vertical</text>
  </svg>`;
}

async function renderContactSheet(imageHref) {
  const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="820" viewBox="0 0 1600 820">
    <rect width="1600" height="820" fill="#0b151c"/>
    <text x="48" y="55" font-family="Inter,Arial,sans-serif" font-size="28" font-weight="800" fill="${palette.paper}">EPISODE 0004 · THUMBNAIL REVIEW</text>
    <text x="48" y="86" font-family="Inter,Arial,sans-serif" font-size="16" fill="${palette.muted}">1280 × 720 source · 240 px browsing size · 160 px compact size</text>
    <text x="48" y="132" font-family="Inter,Arial,sans-serif" font-size="13" font-weight="700" fill="${palette.rust}" letter-spacing="1.5">SOURCE DISPLAYED AT 768 × 432</text>
    <image href="${imageHref}" x="48" y="152" width="768" height="432"/>
    <text x="880" y="132" font-family="Inter,Arial,sans-serif" font-size="13" font-weight="700" fill="${palette.rust}">240 × 135 · 18.75%</text>
    <image href="${imageHref}" x="880" y="152" width="240" height="135"/>
    <text x="1180" y="132" font-family="Inter,Arial,sans-serif" font-size="13" font-weight="700" fill="${palette.rust}">160 × 90 · 12.5%</text>
    <image href="${imageHref}" x="1180" y="152" width="160" height="90"/>
    <text x="880" y="352" font-family="Inter,Arial,sans-serif" font-size="13" font-weight="700" fill="${palette.rust}">VISUAL ORDER</text>
    <text x="880" y="388" font-family="Inter,Arial,sans-serif" font-size="19" font-weight="700" fill="${palette.paper}">Headline → system → Companion → EP. 4</text>
    <text x="880" y="426" font-family="Inter,Arial,sans-serif" font-size="15" fill="${palette.muted}">Five qualities constrain the system; Trust and Observability carry emphasis.</text>
    <text x="48" y="650" font-family="Inter,Arial,sans-serif" font-size="13" font-weight="700" fill="${palette.rust}">SAFE AREA</text>
    <rect x="48" y="674" width="1200" height="86" rx="12" fill="#101d24" stroke="#36515e"/>
    <text x="76" y="709" font-family="Inter,Arial,sans-serif" font-size="16" fill="${palette.paper}">Brand, headline, Companion face, episode identifier and every characteristic label remain inside the safe inset.</text>
    <text x="76" y="737" font-family="Inter,Arial,sans-serif" font-size="14" fill="${palette.muted}">Headline remains the dominant readable element at 12.5%; labels are intentionally secondary.</text>
  </svg>`;
  await fs.writeFile(path.join(sourceDir, "episode-0004-thumbnail-contact-sheet.svg"), sheet.replaceAll(imageHref, "../episode-0004-thumbnail.png"));
  await sharp(Buffer.from(sheet), { density: 144 }).resize(1600, 820).png().toFile(path.join(here, "episode-0004-thumbnail-contact-sheet.png"));
}

function relative(filePath) {
  return path.relative(repoRoot, filePath).replaceAll(path.sep, "/");
}
