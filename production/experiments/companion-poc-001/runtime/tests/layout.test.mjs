import test from "node:test";
import assert from "node:assert/strict";
import { CANVAS, REGIONS, imageContain, layoutText, svgCanvas, wrapLines } from "../src/layout.mjs";
import { writeTitleCard } from "../src/visuals.mjs";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

test("composition contract is fixed 1920x1080", () => {
  assert.equal(CANVAS.width, 1920);
  assert.equal(CANVAS.height, 1080);
  assert.equal(CANVAS.aspectRatio, "16:9");
  assert.ok(REGIONS.safe.x >= 0);
  assert.ok(REGIONS.safe.x + REGIONS.safe.width <= CANVAS.width);
});

test("svg canvas declares the expected dimensions and viewBox", () => {
  const svg = svgCanvas("<g/>");
  assert.match(svg, /width="1920"/);
  assert.match(svg, /height="1080"/);
  assert.match(svg, /viewBox="0 0 1920 1080"/);
  assert.match(svg, /preserveAspectRatio="xMidYMid meet"/);
});

test("text wrapping happens at spaces and does not split words", () => {
  const result = wrapLines("Software product architectural laboratory", 230, 28, 4);
  assert.equal(result.overflow, false);
  assert.ok(result.values.length > 1);
  assert.ok(result.values.every((line) => !line.includes("architectu\n")));
  assert.ok(result.values.includes("architectural"));
});

test("text layout reduces font size before failing", () => {
  const svg = layoutText({
    text: "Why Articulate Exists",
    box: { x: 100, y: 100, width: 420, height: 80 },
    fontSize: 72,
    minFontSize: 36,
    maxLines: 1
  });
  assert.match(svg, /font-size="3[6-9]|font-size="4[0-9]|font-size="5[0-9]|font-size="6[0-9]/);
});

test("text layout fails on unsafe overflow", () => {
  assert.throws(() => layoutText({
    text: "Supercalifragilisticexpialidocious",
    box: { x: 100, y: 100, width: 80, height: 40 },
    fontSize: 30,
    minFontSize: 28,
    maxLines: 1
  }), /Text does not fit safely/);
});

test("contain image placement preserves aspect ratio inside companion region", () => {
  const placement = imageContain({
    imageHref: "asset.png",
    sourceWidth: 768,
    sourceHeight: 1024,
    box: REGIONS.companion
  });
  assert.ok(placement.x >= REGIONS.companion.x);
  assert.ok(placement.y >= REGIONS.companion.y);
  assert.ok(placement.x + placement.width <= REGIONS.companion.x + REGIONS.companion.width);
  assert.ok(placement.y + placement.height <= REGIONS.companion.y + REGIONS.companion.height);
  assert.equal(Math.round((placement.width / placement.height) * 100), 75);
});

test("title card uses the fixed 1920x1080 SVG contract", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "layout-title-"));
  const filePath = path.join(dir, "title.svg");
  writeTitleCard(filePath, { output: { width: 1920, height: 1080 } });
  const svg = fs.readFileSync(filePath, "utf8");
  assert.match(svg, /width="1920"/);
  assert.match(svg, /height="1080"/);
  assert.match(svg, /viewBox="0 0 1920 1080"/);
});
