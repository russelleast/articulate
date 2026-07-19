import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "../../../../..");
const sharp = require(path.join(repoRoot, "site/node_modules/sharp"));

const width = 1280;
const height = 720;
const sourceDir = path.join(here, "source");
const previewDir = path.join(here, "previews");
const companionPath = path.join(repoRoot, "production/assets/companion/v1/companion-neutral.png");
const companionSourceHref = "../../../../../assets/companion/v1/companion-neutral.png";

const palette = Object.freeze({
  paper: "#f4f0e8",
  ink: "#172028",
  muted: "#8fa2aa",
  blue: "#55798b",
  paleBlue: "#dbe8eb",
  rust: "#a65d3f",
  green: "#547064",
  white: "#fffdfa",
  dark: "#0d1820",
  darker: "#091218",
  line: "#6f858e"
});

const variants = [
  { id: "a", slug: "companion-led", label: "A · COMPANION-LED" },
  { id: "b", slug: "architecture-led", label: "B · ARCHITECTURE-LED" },
  { id: "c", slug: "balanced", label: "C · BALANCED" }
];

await fs.mkdir(sourceDir, { recursive: true });
await fs.mkdir(previewDir, { recursive: true });

const companionBuffer = await fs.readFile(companionPath);
const companionData = `data:image/png;base64,${companionBuffer.toString("base64")}`;

for (const variant of variants) {
  const sourceSvg = renderVariant(variant.id, companionSourceHref);
  const renderSvg = renderVariant(variant.id, companionData);
  const stem = `episode-0000-thumbnail-${variant.id}-${variant.slug}`;
  const svgPath = path.join(sourceDir, `${stem}.svg`);
  const pngPath = path.join(here, `${stem}.png`);
  await fs.writeFile(svgPath, sourceSvg);
  await sharp(Buffer.from(renderSvg), { density: 144 }).resize(width, height).png().toFile(pngPath);
  await sharp(pngPath).resize(320, 180).png().toFile(path.join(previewDir, `${stem}-320.png`));
  await sharp(pngPath).resize(160, 90).png().toFile(path.join(previewDir, `${stem}-160.png`));
}

await renderContactSheet();

function renderVariant(id, companion) {
  const composition = id === "a"
    ? companionLed(companion)
    : id === "b"
      ? architectureLed(companion)
      : balanced(companion);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="field" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${palette.darker}"/>
      <stop offset="0.58" stop-color="${palette.dark}"/>
      <stop offset="1" stop-color="#132833"/>
    </linearGradient>
    <radialGradient id="warm" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#b78360" stop-opacity=".34"/>
      <stop offset="1" stop-color="#b78360" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="cool" cx="50%" cy="50%" r="50%">
      <stop offset="0" stop-color="#497b91" stop-opacity=".31"/>
      <stop offset="1" stop-color="#497b91" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="paper-surface" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#fffdf8"/>
      <stop offset="1" stop-color="#ebe7dd"/>
    </linearGradient>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#000" flood-opacity=".38"/>
    </filter>
    <filter id="soft-shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000" flood-opacity=".28"/>
    </filter>
    <pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse">
      <path d="M 42 0 L 0 0 0 42" fill="none" stroke="#6f858e" stroke-opacity=".11" stroke-width="1"/>
    </pattern>
    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="${palette.blue}"/>
    </marker>
  </defs>
  <rect width="1280" height="720" fill="url(#field)"/>
  <rect width="1280" height="720" fill="url(#grid)"/>
  <ellipse cx="1060" cy="260" rx="430" ry="360" fill="url(#warm)"/>
  <ellipse cx="250" cy="610" rx="530" ry="300" fill="url(#cool)"/>
  ${composition}
  ${brandMarker()}
</svg>`;
}

function companionLed(companion) {
  return `
  <path d="M 78 595 C 250 500, 475 525, 620 405" fill="none" stroke="${palette.blue}" stroke-opacity=".28" stroke-width="2"/>
  <g opacity=".48">${architectureMotif(80, 500, 500, 135)}</g>
  <g>${headline(76, 151, 630, ["BUILDING", "AI-NATIVE", "ARCHITECTURE"], 72)}</g>
  <g transform="translate(735 40)" filter="url(#shadow)">
    <ellipse cx="288" cy="622" rx="250" ry="32" fill="#020608" opacity=".48"/>
    ${companionImage(companion, 0, 0, 575, 612)}
  </g>
  <g transform="translate(894 584)" filter="url(#soft-shadow)">
    <rect width="286" height="72" rx="14" fill="${palette.paper}"/>
    <circle cx="38" cy="36" r="10" fill="${palette.rust}"/>
    <text x="62" y="30" font-family="Inter,Arial,sans-serif" font-size="15" font-weight="700" fill="${palette.ink}" letter-spacing="1.6">WORKING SURFACE</text>
    <text x="62" y="52" font-family="Inter,Arial,sans-serif" font-size="14" fill="${palette.blue}">ideas → decisions → evidence</text>
  </g>`;
}

function architectureLed(companion) {
  return `
  <g transform="translate(52 114)" filter="url(#shadow)">
    <rect width="820" height="515" rx="28" fill="url(#paper-surface)"/>
    <rect x="18" y="18" width="784" height="479" rx="20" fill="none" stroke="#cbc8bf"/>
    <text x="55" y="66" font-family="Inter,Arial,sans-serif" font-size="14" font-weight="700" fill="${palette.rust}" letter-spacing="2.2">ARCHITECTURAL WORKING SURFACE</text>
    ${architectureMotif(60, 300, 600, 150, true)}
  </g>
  <g transform="translate(795 30)" filter="url(#soft-shadow)">
    ${companionImage(companion, 0, 0, 425, 452)}
  </g>
  <g transform="translate(735 350)">
    <rect x="0" y="0" width="495" height="294" rx="24" fill="#101d24" fill-opacity=".93" stroke="#36515e" stroke-width="2"/>
    ${headline(30, 48, 440, ["BUILDING", "AI-NATIVE", "ARCHITECTURE"], 55)}
  </g>`;
}

function balanced(companion) {
  return `
  <g transform="translate(22 82)" filter="url(#shadow)">
    <ellipse cx="260" cy="570" rx="220" ry="28" fill="#020608" opacity=".42"/>
    ${companionImage(companion, 0, 0, 535, 570)}
  </g>
  <g transform="translate(500 105)" filter="url(#soft-shadow)">
    <rect width="712" height="518" rx="28" fill="${palette.paper}"/>
    <rect x="20" y="20" width="672" height="478" rx="20" fill="none" stroke="#cecac0"/>
    <text x="52" y="62" font-family="Inter,Arial,sans-serif" font-size="14" font-weight="700" fill="${palette.rust}" letter-spacing="2.2">ARTICULATE JOURNAL · EP 0000</text>
    ${headline(50, 94, 620, ["BUILDING", "AI-NATIVE", "ARCHITECTURE"], 59, true)}
    ${architectureMotif(52, 355, 608, 105, true)}
  </g>`;
}

function headline(x, y, maxWidth, lines, fontSize, dark = false) {
  const fill = dark ? palette.ink : palette.paper;
  const lineHeight = fontSize * 1.02;
  return `<g transform="translate(${x} ${y})">
    <rect x="0" y="-21" width="112" height="6" rx="3" fill="${palette.rust}"/>
    ${lines.map((line, index) => `<text x="0" y="${index * lineHeight + fontSize}" font-family="Inter,Arial,sans-serif" font-size="${fontSize}" font-weight="800" letter-spacing="-2.2" fill="${index === 1 ? palette.rust : fill}"${index === 2 ? ` textLength="${Math.min(maxWidth, maxWidth * 0.98)}" lengthAdjust="spacingAndGlyphs"` : ""}>${line}</text>`).join("\n")}
  </g>`;
}

function architectureMotif(x, y, motifWidth, motifHeight, onPaper = false) {
  const nodeFill = onPaper ? palette.white : "#182b35";
  const nodeStroke = onPaper ? "#9aabb1" : palette.line;
  const textFill = onPaper ? palette.ink : palette.paper;
  const scale = motifWidth / 700;
  const cy = motifHeight / 2;
  const nodes = [
    { x: 0, w: 118, label: "PROBLEM" },
    { x: 160, w: 128, label: "PRINCIPLES" },
    { x: 330, w: 145, label: "CAPABILITIES" },
    { x: 520, w: 180, label: "ARCHITECTURE" }
  ];
  return `<g transform="translate(${x} ${y}) scale(${scale})">
    ${nodes.slice(0, -1).map((node, index) => `<line x1="${node.x + node.w}" y1="${cy}" x2="${nodes[index + 1].x - 12}" y2="${cy}" stroke="${palette.blue}" stroke-width="3" marker-end="url(#arrow)"/>`).join("")}
    ${nodes.map((node, index) => `<g>
      <rect x="${node.x}" y="${cy - 35}" width="${node.w}" height="70" rx="14" fill="${index === 3 && onPaper ? palette.paleBlue : nodeFill}" stroke="${index === 3 ? palette.rust : nodeStroke}" stroke-width="2"/>
      <text x="${node.x + node.w / 2}" y="${cy + 5}" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="16" font-weight="700" letter-spacing=".8" fill="${index === 3 && onPaper ? palette.ink : textFill}">${node.label}</text>
    </g>`).join("")}
  </g>`;
}

function brandMarker() {
  return `<g transform="translate(76 54)">
    <text x="0" y="0" font-family="Inter,Arial,sans-serif" font-size="17" font-weight="700" fill="${palette.paper}" letter-spacing="5">ARTICULATE</text>
    <text x="1" y="22" font-family="Inter,Arial,sans-serif" font-size="9" font-weight="600" fill="${palette.blue}" letter-spacing="2.1">AI-NATIVE ARCHITECTURE JOURNAL</text>
  </g>
  <g transform="translate(1120 49)">
    <rect width="84" height="36" rx="18" fill="#192a33" stroke="#47616d"/>
    <text x="42" y="23" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="13" font-weight="700" fill="${palette.paper}" letter-spacing="1.2">0000</text>
  </g>`;
}

function companionImage(href, x, y, imageWidth, imageHeight) {
  return `<svg x="${x}" y="${y}" width="${imageWidth}" height="${imageHeight}" viewBox="377 48 917 976" preserveAspectRatio="xMidYMid meet" overflow="visible">
    <image href="${href}" x="0" y="0" width="1536" height="1024"/>
  </svg>`;
}

async function renderContactSheet() {
  const sheetWidth = 1600;
  const sheetHeight = 1320;
  const rowTop = 150;
  const rowHeight = 390;
  const fullWidth = 640;
  const fullHeight = 360;
  const sourceItems = [];
  const renderItems = [];

  for (let index = 0; index < variants.length; index += 1) {
    const variant = variants[index];
    const stem = `episode-0000-thumbnail-${variant.id}-${variant.slug}`;
    const png = await fs.readFile(path.join(here, `${stem}.png`));
    const pngData = `data:image/png;base64,${png.toString("base64")}`;
    const sourceHref = `../${stem}.png`;
    const y = rowTop + index * rowHeight;
    sourceItems.push(...contactSheetRow(variant.label, sourceHref, y, fullWidth, fullHeight));
    renderItems.push(...contactSheetRow(variant.label, pngData, y, fullWidth, fullHeight));
  }

  const contactSheetSvg = (items) => `<svg xmlns="http://www.w3.org/2000/svg" width="${sheetWidth}" height="${sheetHeight}" viewBox="0 0 ${sheetWidth} ${sheetHeight}">
    <rect width="100%" height="100%" fill="#0b151c"/>
    <text x="48" y="50" font-family="Inter,Arial,sans-serif" font-size="28" font-weight="800" fill="${palette.paper}">EPISODE 0000 · THUMBNAIL SIZE REVIEW</text>
    <text x="48" y="82" font-family="Inter,Arial,sans-serif" font-size="16" fill="${palette.muted}">Full comparison · 320 px browsing size · 160 px compact size</text>
    <text x="48" y="110" font-family="Inter,Arial,sans-serif" font-size="13" fill="${palette.rust}" letter-spacing="1.5">1280 × 720 SOURCE (DISPLAYED AT 640)</text>
    <text x="740" y="110" font-family="Inter,Arial,sans-serif" font-size="13" fill="${palette.rust}" letter-spacing="1.5">320 × 180</text>
    <text x="1115" y="110" font-family="Inter,Arial,sans-serif" font-size="13" fill="${palette.rust}" letter-spacing="1.5">160 × 90</text>
    ${items.join("\n")}
  </svg>`;
  await fs.writeFile(path.join(sourceDir, "episode-0000-thumbnail-contact-sheet.svg"), contactSheetSvg(sourceItems));
  await sharp(Buffer.from(contactSheetSvg(renderItems)), { density: 144 }).resize(sheetWidth, sheetHeight).png().toFile(path.join(here, "episode-0000-thumbnail-contact-sheet.png"));
}

function contactSheetRow(label, href, y, fullWidth, fullHeight) {
  return [
    `<text x="48" y="${y - 10}" font-family="Inter,Arial,sans-serif" font-size="24" font-weight="700" fill="${palette.paper}" letter-spacing="1.3">${label}</text>`,
    `<image href="${href}" x="48" y="${y}" width="${fullWidth}" height="${fullHeight}"/>`,
    `<image href="${href}" x="740" y="${y + 55}" width="320" height="180"/>`,
    `<image href="${href}" x="1115" y="${y + 100}" width="160" height="90"/>`
  ];
}
