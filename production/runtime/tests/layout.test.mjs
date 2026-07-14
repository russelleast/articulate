import assert from "node:assert/strict";
import test from "node:test";
import { centredTextBlock, layoutText } from "../renderer/layout.mjs";

test("centred text uses the complete multiline block height", () => {
  const svg = centredTextBlock(
    "Architecture knowledge",
    { x: 10, y: 20, width: 120, height: 80 },
    { fontSize: 20, weight: 500, maxLines: 2, lineHeight: 1.2, align: "middle", fill: "#000" },
    "test label"
  );

  assert.match(svg, /y="48"/);
  assert.match(svg, /dominant-baseline="middle"/);
  assert.match(svg, /dy="24"/);
});

test("text layout fails instead of clipping overflow", () => {
  assert.throws(
    () => layoutText("one two three four five", 60, { fontSize: 20, maxLines: 1 }, "test label"),
    /test label overflows/
  );
});
