#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../..");
const require = createRequire(import.meta.url);
const sharp = require(path.join(repoRoot, "site/node_modules/sharp"));
const input = path.join(repoRoot, "production/assets/companion/v1/companion-neutral.png");
const outputDir = path.join(repoRoot, "production/cache/episode-0000/companion-motion-lip-sync-poc-001/facial-assets");
fs.mkdirSync(outputDir, { recursive: true });

const source = await sharp(input).png().toBuffer();
const mouth = { left: 739, top: 350, width: 90, split: 36, lowerHeight: 48, centreX: 784, centreY: 390 };
const variants = {
  open: { scaleX: 1, upperShift: -2, lowerShift: 10, rx: 25, ry: 13 },
  wide: { scaleX: 1.12, upperShift: -1, lowerShift: 6, rx: 35, ry: 8 },
  rounded: { scaleX: 0.90, upperShift: -2, lowerShift: 9, rx: 18, ry: 15 },
  teeth: { scaleX: 1.06, upperShift: -1, lowerShift: 7, rx: 29, ry: 9, teeth: true }
};

for (const [name, variant] of Object.entries(variants)) {
  const width = Math.round(mouth.width * variant.scaleX);
  const left = Math.round(mouth.centreX - width / 2);
  const upper = await sharp(source).extract({ left: mouth.left, top: mouth.top, width: mouth.width, height: mouth.split }).resize({ width, height: mouth.split, fit: "fill" }).png().toBuffer();
  const lower = await sharp(source).extract({ left: mouth.left, top: mouth.top + mouth.split, width: mouth.width, height: mouth.lowerHeight }).resize({ width, height: mouth.lowerHeight, fit: "fill" }).png().toBuffer();
  const facialSvg = `<svg width="1536" height="1024" xmlns="http://www.w3.org/2000/svg"><ellipse cx="${mouth.centreX}" cy="${mouth.centreY + 2}" rx="${variant.rx}" ry="${variant.ry}" fill="#211313" opacity=".94"/>${variant.teeth ? `<path d="M ${mouth.centreX - 24} ${mouth.centreY + 1} Q ${mouth.centreX} ${mouth.centreY + 9} ${mouth.centreX + 24} ${mouth.centreY + 1}" fill="none" stroke="#e8ddd5" stroke-width="6" stroke-linecap="round"/>` : ""}</svg>`;
  await sharp(source).composite([
    { input: Buffer.from(facialSvg), left: 0, top: 0 },
    { input: upper, left, top: mouth.top + variant.upperShift },
    { input: lower, left, top: mouth.top + mouth.split + variant.lowerShift }
  ]).png().toFile(path.join(outputDir, `companion-${name}.png`));
}
console.log(`Companion facial assets: ${outputDir}`);
