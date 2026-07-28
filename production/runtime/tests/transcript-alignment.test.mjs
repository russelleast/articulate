import test from "node:test";
import assert from "node:assert/strict";
import {
  alignSections,
  cueTime,
  normaliseWhisperTranscript
} from "../transcript-alignment.mjs";

test("normalises Whisper timing and aligns ordered narrative anchors", () => {
  const raw = {
    result: { language: "en" },
    transcription: [
      segment(0, 2, " Opening words.", [[" Opening", 0.1, 0.8], [" words", 0.9, 1.5]]),
      segment(2, 4, " Next section begins.", [[" Next", 2.1, 2.5], [" section", 2.5, 3], [" begins", 3, 3.7]])
    ]
  };
  const transcript = normaliseWhisperTranscript(raw, { audio: "episode.wav", model: "test" });
  const alignment = alignSections(transcript, [
    { id: "opening", title: "Opening", narrativeSegments: ["N001"], anchor: null },
    { id: "next", title: "Next", narrativeSegments: ["N002"], anchor: "Next section begins" }
  ], 4);

  assert.equal(alignment.sections[0].start, 0);
  assert.equal(alignment.sections[0].end, 2.1);
  assert.equal(alignment.sections[1].start, 2.1);
  assert.equal(alignment.sections[1].end, 4);
  assert.equal(cueTime(transcript, "section begins", alignment.sections[1]), 0.4);
});

function segment(from, to, text, words) {
  return {
    offsets: { from: from * 1000, to: to * 1000 },
    text,
    tokens: words.map(([text, start, end]) => ({
      text,
      offsets: { from: start * 1000, to: end * 1000 },
      p: 0.95
    }))
  };
}
