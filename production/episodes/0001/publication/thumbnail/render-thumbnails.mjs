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
const episode0000Path = path.join(repoRoot, "production/episodes/0000/publication/thumbnail/episode-0000-thumbnail-c-balanced.png");

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
  { id: "a", slug: "fragmented-architecture", label: "A · FRAGMENTED ARCHITECTURE" },
  { id: "b", slug: "missing-architecture", label: "B · THE MISSING ARCHITECTURE" },
  { id: "c", slug: "fragmentation-to-intelligence", label: "C · FRAGMENTATION TO INTELLIGENCE" }
];

await fs.mkdir(sourceDir, { recursive: true });
await fs.mkdir(previewDir, { recursive: true });

const companionBuffer = await fs.readFile(companionPath);
const companionData = `data:image/png;base64,${companionBuffer.toString("base64")}`;

for (const variant of variants) {
  const stem = `episode-0001-thumbnail-${variant.id}-${variant.slug}`;
  const sourceSvg = renderVariant(variant.id, companionSourceHref);
  const renderSvg = renderVariant(variant.id, companionData);
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
    ? fragmentedArchitecture(companion)
    : id === "b"
      ? missingArchitecture(companion)
      : fragmentationToIntelligence(companion);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  ${defs()}
  <rect width="1280" height="720" fill="url(#field)"/>
  <rect width="1280" height="720" fill="url(#grid)"/>
  <ellipse cx="1080" cy="265" rx="430" ry="360" fill="url(#warm)"/>
  <ellipse cx="240" cy="640" rx="540" ry="290" fill="url(#cool)"/>
  ${composition}
  ${brandMarker()}
</svg>`;
}

function defs() {
  return `<defs>
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
      <path d="M 42 0 L 0 0 0 42" fill="none" stroke="${palette.line}" stroke-opacity=".11" stroke-width="1"/>
    </pattern>
  </defs>`;
}

function fragmentedArchitecture(companion) {
  return `
  <g>${headline(76, 150, ["ARCHITECTURE", "IS FRAGMENTED"], 72, false, 1)}</g>
  <g transform="translate(76 380)">
    ${fragmentCard(0, 16, 142, 72, "CODE", -3)}
    ${fragmentCard(178, -8, 178, 78, "DECISIONS", 2)}
    ${fragmentCard(394, 30, 152, 72, "SYSTEMS", -2)}
    ${fragmentCard(118, 112, 156, 72, "PEOPLE", 2)}
    ${fragmentCard(326, 125, 166, 72, "EVIDENCE", -3)}
    <path d="M142 52 L171 45 M356 38 L385 56 M196 72 L205 104 M440 101 L418 120 M276 145 L316 151" fill="none" stroke="${palette.blue}" stroke-width="3" stroke-dasharray="7 10" opacity=".62"/>
    <circle cx="168" cy="46" r="5" fill="${palette.rust}"/>
    <circle cx="387" cy="57" r="5" fill="${palette.rust}"/>
    <circle cx="207" cy="105" r="5" fill="${palette.rust}"/>
  </g>
  <g transform="translate(742 52)" filter="url(#shadow)">
    <ellipse cx="285" cy="615" rx="246" ry="30" fill="#020608" opacity=".46"/>
    ${companionImage(companion, 0, 0, 570, 608)}
  </g>`;
}

function missingArchitecture(companion) {
  return `
  <g transform="translate(28 100)" filter="url(#shadow)">
    <ellipse cx="252" cy="570" rx="215" ry="28" fill="#020608" opacity=".42"/>
    ${companionImage(companion, 0, 0, 510, 545)}
  </g>
  <g transform="translate(470 102)" filter="url(#soft-shadow)">
    <rect width="742" height="522" rx="28" fill="url(#paper-surface)"/>
    <rect x="20" y="20" width="702" height="482" rx="20" fill="none" stroke="#cecac0"/>
    <text x="50" y="60" font-family="Inter,Arial,sans-serif" font-size="14" font-weight="700" fill="${palette.rust}" letter-spacing="2.2">ARTICULATE JOURNAL · EP 0001</text>
    ${headline(50, 84, ["WHERE DOES", "ARCHITECTURE", "LIVE?"], 56, true, 1)}
    <g transform="translate(48 332)">
      ${artifactNode(0, 10, 110, "CODE")}
      ${artifactNode(0, 102, 110, "DOCS")}
      ${artifactNode(510, 10, 126, "SYSTEMS")}
      ${artifactNode(510, 102, 126, "PEOPLE")}
      <path d="M126 48 C190 48 196 64 230 70 M126 140 C186 140 198 115 230 104 M494 48 C445 48 426 62 394 70 M494 140 C445 140 426 116 394 104" fill="none" stroke="${palette.blue}" stroke-width="3" stroke-dasharray="7 9" opacity=".65"/>
      <path d="M245 25 H378 Q394 25 394 41 V136 Q394 152 378 152 H245 Q229 152 229 136 V41 Q229 25 245 25 Z" fill="${palette.paleBlue}" fill-opacity=".34" stroke="${palette.rust}" stroke-width="3" stroke-dasharray="12 9"/>
      <text x="311" y="79" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="14" font-weight="700" fill="${palette.rust}" letter-spacing="1.8">THE MISSING</text>
      <text x="311" y="108" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="19" font-weight="800" fill="${palette.ink}" letter-spacing=".7">ARCHITECTURE</text>
    </g>
  </g>`;
}

function fragmentationToIntelligence(companion) {
  return `
  <g>${headline(76, 146, ["WHY", "ARTICULATE?"], 80, false, 1)}</g>
  <g transform="translate(72 382)">
    <text x="0" y="0" font-family="Inter,Arial,sans-serif" font-size="13" font-weight="700" fill="${palette.muted}" letter-spacing="2">FRAGMENTED SIGNALS</text>
    ${miniFragment(8, 40, "CODE", -4)}
    ${miniFragment(112, 108, "DOCS", 3)}
    ${miniFragment(212, 28, "ADR", 4)}
    ${miniFragment(238, 132, "TRACE", -3)}
    <path d="M82 70 L106 102 M182 117 L224 73 M276 79 L278 124" stroke="${palette.line}" stroke-width="2" stroke-dasharray="5 8" opacity=".4"/>
  </g>
  <g transform="translate(500 114)" filter="url(#shadow)">
    <ellipse cx="246" cy="545" rx="198" ry="25" fill="#020608" opacity=".4"/>
    ${companionImage(companion, 0, 0, 492, 525)}
  </g>
  <g transform="translate(880 338)">
    <text x="0" y="0" font-family="Inter,Arial,sans-serif" font-size="13" font-weight="700" fill="${palette.muted}" letter-spacing="2">ARCHITECTURAL INTELLIGENCE</text>
    <g transform="translate(0 28)" filter="url(#soft-shadow)">
      <rect width="360" height="224" rx="24" fill="${palette.paper}"/>
      <rect x="16" y="16" width="328" height="192" rx="17" fill="none" stroke="#cecac0"/>
      <path d="M75 70 L180 112 L282 65 M180 112 L282 160 M180 112 L78 164" fill="none" stroke="${palette.blue}" stroke-width="4"/>
      ${knowledgeNode(180, 112, 42, "MODEL", true)}
      ${knowledgeNode(75, 70, 31, "CODE")}
      ${knowledgeNode(282, 65, 31, "ADRS")}
      ${knowledgeNode(78, 164, 31, "EVIDENCE")}
      ${knowledgeNode(282, 160, 31, "SYSTEMS")}
    </g>
  </g>
  <path d="M350 503 C420 503 450 503 526 503" fill="none" stroke="${palette.rust}" stroke-width="4" stroke-linecap="round" opacity=".8"/>
  <path d="M888 503 C892 503 896 503 900 503" fill="none" stroke="${palette.rust}" stroke-width="4" stroke-linecap="round" opacity=".8"/>`;
}

function headline(x, y, lines, fontSize, dark = false, rustLine = 1) {
  const fill = dark ? palette.ink : palette.paper;
  const lineHeight = fontSize * 1.02;
  return `<g transform="translate(${x} ${y})">
    <rect x="0" y="-21" width="112" height="6" rx="3" fill="${palette.rust}"/>
    ${lines.map((line, index) => `<text x="0" y="${index * lineHeight + fontSize}" font-family="Inter,Arial,sans-serif" font-size="${fontSize}" font-weight="800" letter-spacing="-2.2" fill="${index === rustLine ? palette.rust : fill}">${line}</text>`).join("\n")}
  </g>`;
}

function fragmentCard(x, y, w, h, label, rotate) {
  return `<g transform="translate(${x} ${y}) rotate(${rotate} ${w / 2} ${h / 2})" filter="url(#soft-shadow)">
    <rect width="${w}" height="${h}" rx="13" fill="#172a34" stroke="${palette.line}" stroke-width="2"/>
    <rect x="14" y="15" width="38" height="4" rx="2" fill="${palette.rust}"/>
    <text x="${w / 2}" y="48" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="16" font-weight="700" fill="${palette.paper}" letter-spacing="1.2">${label}</text>
  </g>`;
}

function artifactNode(x, y, w, label) {
  return `<g transform="translate(${x} ${y})">
    <rect width="${w}" height="58" rx="12" fill="${palette.white}" stroke="#9aabb1" stroke-width="2"/>
    <text x="${w / 2}" y="36" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="14" font-weight="700" fill="${palette.ink}" letter-spacing=".8">${label}</text>
  </g>`;
}

function miniFragment(x, y, label, rotate) {
  return `<g transform="translate(${x} ${y}) rotate(${rotate} 42 24)">
    <rect width="84" height="48" rx="10" fill="#172a34" stroke="${palette.line}" stroke-width="2"/>
    <text x="42" y="30" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="12" font-weight="700" fill="${palette.paper}" letter-spacing=".7">${label}</text>
  </g>`;
}

function knowledgeNode(cx, cy, r, label, central = false) {
  const fill = central ? palette.paleBlue : palette.white;
  const stroke = central ? palette.rust : "#9aabb1";
  const fontSize = label.length > 6 ? 8 : 10;
  return `<g>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="3"/>
    <text x="${cx}" y="${cy + 4}" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="${fontSize}" font-weight="800" fill="${palette.ink}" letter-spacing=".4">${label}</text>
  </g>`;
}

function brandMarker() {
  return `<g transform="translate(76 54)">
    <text x="0" y="0" font-family="Inter,Arial,sans-serif" font-size="17" font-weight="700" fill="${palette.paper}" letter-spacing="5">ARTICULATE</text>
    <text x="1" y="22" font-family="Inter,Arial,sans-serif" font-size="9" font-weight="600" fill="${palette.blue}" letter-spacing="2.1">AI-NATIVE ARCHITECTURE JOURNAL</text>
  </g>
  <g transform="translate(1120 49)">
    <rect width="84" height="36" rx="18" fill="#192a33" stroke="#47616d"/>
    <text x="42" y="23" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="13" font-weight="700" fill="${palette.paper}" letter-spacing="1.2">0001</text>
  </g>`;
}

function companionImage(href, x, y, imageWidth, imageHeight) {
  return `<svg x="${x}" y="${y}" width="${imageWidth}" height="${imageHeight}" viewBox="377 48 917 976" preserveAspectRatio="xMidYMid meet" overflow="visible">
    <image href="${href}" x="0" y="0" width="1536" height="1024"/>
  </svg>`;
}

async function renderContactSheet() {
  const sheetWidth = 1600;
  const sheetHeight = 1750;
  const rowTop = 170;
  const rowHeight = 390;
  const fullWidth = 640;
  const fullHeight = 360;
  const sourceItems = [];
  const renderItems = [];
  const rows = [
    { label: "PUBLISHED BASELINE · EPISODE 0000", path: episode0000Path, sourceHref: "../../../../0000/publication/thumbnail/episode-0000-thumbnail-c-balanced.png" },
    ...variants.map((variant) => {
      const stem = `episode-0001-thumbnail-${variant.id}-${variant.slug}`;
      return { label: variant.label, path: path.join(here, `${stem}.png`), sourceHref: `../${stem}.png` };
    })
  ];

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    const png = await fs.readFile(row.path);
    const pngData = `data:image/png;base64,${png.toString("base64")}`;
    const y = rowTop + index * rowHeight;
    sourceItems.push(...contactSheetRow(row.label, row.sourceHref, y, fullWidth, fullHeight));
    renderItems.push(...contactSheetRow(row.label, pngData, y, fullWidth, fullHeight));
  }

  const contactSheetSvg = (items) => `<svg xmlns="http://www.w3.org/2000/svg" width="${sheetWidth}" height="${sheetHeight}" viewBox="0 0 ${sheetWidth} ${sheetHeight}">
    <rect width="100%" height="100%" fill="#0b151c"/>
    <text x="48" y="50" font-family="Inter,Arial,sans-serif" font-size="28" font-weight="800" fill="${palette.paper}">EPISODE 0001 · THUMBNAIL SIZE REVIEW</text>
    <text x="48" y="82" font-family="Inter,Arial,sans-serif" font-size="16" fill="${palette.muted}">Published series baseline · full comparison · 320 px browsing size · 160 px compact size</text>
    <text x="48" y="122" font-family="Inter,Arial,sans-serif" font-size="13" fill="${palette.rust}" letter-spacing="1.5">1280 × 720 SOURCE (DISPLAYED AT 640)</text>
    <text x="740" y="122" font-family="Inter,Arial,sans-serif" font-size="13" fill="${palette.rust}" letter-spacing="1.5">320 × 180</text>
    <text x="1115" y="122" font-family="Inter,Arial,sans-serif" font-size="13" fill="${palette.rust}" letter-spacing="1.5">160 × 90</text>
    ${items.join("\n")}
  </svg>`;

  await fs.writeFile(path.join(sourceDir, "episode-0001-thumbnail-contact-sheet.svg"), contactSheetSvg(sourceItems));
  await sharp(Buffer.from(contactSheetSvg(renderItems)), { density: 144 }).resize(sheetWidth, sheetHeight).png().toFile(path.join(here, "episode-0001-thumbnail-contact-sheet.png"));
}

function contactSheetRow(label, href, y, fullWidth, fullHeight) {
  return [
    `<text x="48" y="${y - 10}" font-family="Inter,Arial,sans-serif" font-size="24" font-weight="700" fill="${palette.paper}" letter-spacing="1.3">${label}</text>`,
    `<image href="${href}" x="48" y="${y}" width="${fullWidth}" height="${fullHeight}"/>`,
    `<image href="${href}" x="740" y="${y + 55}" width="320" height="180"/>`,
    `<image href="${href}" x="1115" y="${y + 100}" width="160" height="90"/>`
  ];
}
