import test from "node:test";
import assert from "node:assert/strict";
import { buildSrt, formatSrtTime } from "../src/subtitles.mjs";

test("subtitle timing is derived from scene durations", () => {
  const srt = buildSrt([
    { durationSeconds: 2.5, subtitleText: "First" },
    { durationSeconds: 3, subtitleText: "Second" }
  ], { placeholderAudio: false });

  assert.match(srt, /00:00:00,000 --> 00:00:02,500/);
  assert.match(srt, /00:00:02,500 --> 00:00:05,500/);
});

test("placeholder subtitles are explicitly labelled", () => {
  const srt = buildSrt([{ durationSeconds: 1, subtitleText: "Timing only" }], { placeholderAudio: true });
  assert.match(srt, /\[PLACEHOLDER AUDIO\] Timing only/);
});

test("SRT time formatter pads fields", () => {
  assert.equal(formatSrtTime(65.007), "00:01:05,007");
});
