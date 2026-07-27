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
  white: "#fffdfa",
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
const pngPath = path.join(here, "episode-0003-thumbnail.png");
const previewPath = path.join(previewDir, "episode-0003-thumbnail-240.png");
const safeAreaPath = path.join(previewDir, "episode-0003-thumbnail-safe-area.png");

await fs.writeFile(path.join(sourceDir, "episode-0003-thumbnail.svg"), sourceSvg);
await sharp(Buffer.from(renderSvg), { density: 144 }).resize(width, height).png().toFile(pngPath);
await sharp(pngPath).resize(240, 135).png().toFile(previewPath);

const png = await fs.readFile(pngPath);
const href = `data:image/png;base64,${png.toString("base64")}`;
await sharp(Buffer.from(safeAreaPreview(href)), { density: 144 }).resize(width, height).png().toFile(safeAreaPath);
await renderContactSheet(href);

console.log(`Episode 0003 thumbnail: ${relative(pngPath)}`);
console.log(`Editable source: ${relative(path.join(sourceDir, "episode-0003-thumbnail.svg"))}`);
console.log(`Safe-area preview: ${relative(safeAreaPath)}`);
console.log(`Small-size preview: ${relative(previewPath)}`);

function thumbnail(companion) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="field" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${palette.darker}"/>
      <stop offset=".58" stop-color="${palette.dark}"/>
      <stop offset="1" stop-color="#132833"/>
    </linearGradient>
    <radialGradient id="warm"><stop offset="0" stop-color="#b78360" stop-opacity=".34"/><stop offset="1" stop-color="#b78360" stop-opacity="0"/></radialGradient>
    <radialGradient id="cool"><stop offset="0" stop-color="#497b91" stop-opacity=".31"/><stop offset="1" stop-color="#497b91" stop-opacity="0"/></radialGradient>
    <radialGradient id="intelligence-glow"><stop offset="0" stop-color="#dbe8eb" stop-opacity=".72"/><stop offset=".42" stop-color="#7fb4c7" stop-opacity=".28"/><stop offset="1" stop-color="#7fb4c7" stop-opacity="0"/></radialGradient>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#000" flood-opacity=".4"/></filter>
    <filter id="soft-shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000" flood-opacity=".28"/></filter>
    <filter id="node-glow" x="-80%" y="-100%" width="260%" height="300%"><feDropShadow dx="0" dy="0" stdDeviation="11" flood-color="#9fd6e7" flood-opacity=".82"/></filter>
    <pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse"><path d="M 42 0 L 0 0 0 42" fill="none" stroke="${palette.line}" stroke-opacity=".11"/></pattern>
  </defs>
  <rect width="1280" height="720" fill="url(#field)"/>
  <rect width="1280" height="720" fill="url(#grid)"/>
  <ellipse cx="245" cy="610" rx="530" ry="300" fill="url(#cool)"/>
  <ellipse cx="1070" cy="235" rx="430" ry="340" fill="url(#warm)"/>
  ${brandMarker()}
  <g transform="translate(-48 104)" filter="url(#shadow)">
    <ellipse cx="248" cy="548" rx="206" ry="28" fill="#020608" opacity=".46"/>
    ${companionImage(companion, 0, 0, 500, 570)}
  </g>
  <g transform="translate(430 120)">
    <rect x="0" y="-22" width="112" height="6" rx="3" fill="${palette.rust}"/>
    <text x="0" y="68" font-family="Inter,Arial,sans-serif" font-size="76" font-weight="800" letter-spacing="-2.6" fill="${palette.paper}">AI-NATIVE</text>
    <text x="0" y="145" font-family="Inter,Arial,sans-serif" font-size="76" font-weight="800" letter-spacing="-2.6" fill="${palette.rust}">SYSTEMS</text>
    <text x="3" y="205" font-family="Inter,Arial,sans-serif" font-size="30" font-weight="700" fill="${palette.paper}">Architecture,</text>
    <text x="3" y="240" font-family="Inter,Arial,sans-serif" font-size="30" font-weight="700" fill="${palette.muted}">Not Features</text>
  </g>
  <g transform="translate(425 390)" filter="url(#soft-shadow)">
    <rect width="790" height="266" rx="24" fill="#101d24" fill-opacity=".94" stroke="#36515e" stroke-width="2"/>
    <text x="28" y="34" font-family="Inter,Arial,sans-serif" font-size="13" font-weight="700" fill="${palette.rust}" letter-spacing="2">APPLICATION RUNTIME</text>
    ${runtimeArchitecture()}
  </g>
</svg>`;
}

function runtimeArchitecture() {
  const nodes = [
    { x: 34, y: 62, w: 128, label: "APPLICATION" },
    { x: 216, y: 62, w: 120, label: "SERVICES" },
    { x: 632, y: 62, w: 124, label: "CONTEXT" },
    { x: 632, y: 176, w: 124, label: "KNOWLEDGE" },
    { x: 216, y: 176, w: 120, label: "TOOLS" },
    { x: 34, y: 176, w: 128, label: "MEMORY" }
  ];
  const centre = { x: 402, y: 120, w: 164, h: 72 };
  const paths = nodes.map((node) => {
    const nodeCx = node.x + node.w / 2;
    const nodeCy = node.y + 29;
    const centreCx = centre.x + centre.w / 2;
    const centreCy = centre.y + centre.h / 2;
    return `<path d="M ${nodeCx} ${nodeCy} C ${(nodeCx + centreCx) / 2} ${nodeCy}, ${(nodeCx + centreCx) / 2} ${centreCy}, ${centreCx} ${centreCy}" fill="none" stroke="${palette.blue}" stroke-width="3" stroke-linecap="round"/>`;
  }).join("");
  const nodeMarkup = nodes.map((node) => `<g>
    <rect x="${node.x}" y="${node.y}" width="${node.w}" height="58" rx="13" fill="#172a34" stroke="#6f858e" stroke-width="2"/>
    <text x="${node.x + node.w / 2}" y="${node.y + 36}" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="12" font-weight="700" fill="${palette.paper}" letter-spacing=".6">${node.label}</text>
  </g>`).join("");
  return `${paths}${nodeMarkup}
    <ellipse cx="484" cy="156" rx="154" ry="92" fill="url(#intelligence-glow)"/>
    <g filter="url(#node-glow)">
      <rect x="${centre.x}" y="${centre.y}" width="${centre.w}" height="${centre.h}" rx="18" fill="${palette.paleBlue}" stroke="${palette.rust}" stroke-width="4"/>
      <text x="484" y="151" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="15" font-weight="800" fill="${palette.ink}" letter-spacing=".8">INTELLIGENCE</text>
      <text x="484" y="172" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="10" font-weight="700" fill="#55798b" letter-spacing="1">RUNTIME CAPABILITY</text>
    </g>`;
}

function brandMarker() {
  return `<g transform="translate(76 54)">
    <text font-family="Inter,Arial,sans-serif" font-size="17" font-weight="700" fill="${palette.paper}" letter-spacing="5">ARTICULATE</text>
    <text x="1" y="22" font-family="Inter,Arial,sans-serif" font-size="9" font-weight="600" fill="${palette.blue}" letter-spacing="2.1">AI-NATIVE ARCHITECTURE JOURNAL</text>
  </g>`;
}

function companionImage(href, x, y, imageWidth, imageHeight) {
  return `<svg x="${x}" y="${y}" width="${imageWidth}" height="${imageHeight}" viewBox="377 48 917 976" preserveAspectRatio="xMidYMid meet" overflow="visible"><image href="${href}" width="1536" height="1024"/></svg>`;
}

function safeAreaPreview(imageHref) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
    <image href="${imageHref}" width="1280" height="720"/>
    <rect x="52" y="28" width="1176" height="664" rx="16" fill="none" stroke="#f4f0e8" stroke-width="3" stroke-dasharray="12 10" opacity=".9"/>
    <rect x="930" y="44" width="298" height="70" rx="12" fill="#091218" fill-opacity=".7"/>
    <text x="1079" y="75" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="13" font-weight="700" fill="#f4f0e8" letter-spacing="1.2">SAFE-AREA REVIEW</text>
    <text x="1079" y="96" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="11" fill="#8fa2aa">52 px horizontal · 28 px vertical</text>
  </svg>`;
}

async function renderContactSheet(imageHref) {
  const sheet = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="820" viewBox="0 0 1600 820">
    <rect width="1600" height="820" fill="#0b151c"/>
    <text x="48" y="55" font-family="Inter,Arial,sans-serif" font-size="28" font-weight="800" fill="${palette.paper}">EPISODE 0003 · THUMBNAIL REVIEW</text>
    <text x="48" y="86" font-family="Inter,Arial,sans-serif" font-size="16" fill="${palette.muted}">1280 × 720 source · 240 px browsing size · safe-area overlay</text>
    <text x="48" y="132" font-family="Inter,Arial,sans-serif" font-size="13" font-weight="700" fill="${palette.rust}" letter-spacing="1.5">SOURCE DISPLAYED AT 768 × 432</text>
    <image href="${imageHref}" x="48" y="152" width="768" height="432"/>
    <text x="880" y="132" font-family="Inter,Arial,sans-serif" font-size="13" font-weight="700" fill="${palette.rust}">240 × 135</text>
    <image href="${imageHref}" x="880" y="152" width="240" height="135"/>
    <text x="880" y="352" font-family="Inter,Arial,sans-serif" font-size="13" font-weight="700" fill="${palette.rust}">VISUAL CHECK</text>
    <text x="880" y="388" font-family="Inter,Arial,sans-serif" font-size="19" font-weight="700" fill="${palette.paper}">Companion → headline → Intelligence → runtime</text>
    <text x="880" y="426" font-family="Inter,Arial,sans-serif" font-size="15" fill="${palette.muted}">No chat UI · no prompt windows · architecture-first</text>
    <text x="48" y="650" font-family="Inter,Arial,sans-serif" font-size="13" font-weight="700" fill="${palette.rust}">SAFE AREA</text>
    <rect x="48" y="674" width="768" height="86" rx="12" fill="#101d24" stroke="#36515e"/>
    <text x="76" y="709" font-family="Inter,Arial,sans-serif" font-size="16" fill="${palette.paper}">All critical branding, headline, Companion face and Intelligence label remain inside the 52 × 28 px inset.</text>
    <text x="76" y="737" font-family="Inter,Arial,sans-serif" font-size="14" fill="${palette.muted}">The runtime panel may extend toward the edge without placing essential text beneath platform overlays.</text>
  </svg>`;
  await fs.writeFile(path.join(sourceDir, "episode-0003-thumbnail-contact-sheet.svg"), sheet.replaceAll(imageHref, "../episode-0003-thumbnail.png"));
  await sharp(Buffer.from(sheet), { density: 144 }).resize(1600, 820).png().toFile(path.join(here, "episode-0003-thumbnail-contact-sheet.png"));
}

function relative(filePath) {
  return path.relative(repoRoot, filePath).replaceAll(path.sep, "/");
}
