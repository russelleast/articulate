import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  buildSourceAlignment,
  compileTimeline,
  extractMarkdownSections,
  slugifySection,
  validateScenePlan
} from "../pre-render-workflow.mjs";

test("stable section IDs derive from headings and allow explicit overrides", () => {
  assert.equal(slugifySection("Scaling Up and Scaling Out"), "scaling-up-and-scaling-out");
  assert.deepEqual(extractMarkdownSections([
    "Preamble", "## Scaling Up and Scaling Out", "", "<!-- section-id: scale -->", "## Trust"
  ].join("\n")).map(({ id }) => id), ["scale", "trust"]);
});

test("alignment records written, narrative and audio authorities", () => {
  const transcript = fixtureTranscript();
  const alignment = buildSourceAlignment({
    transcript,
    specifications: [
      { id: "opening", title: "Opening", narrativeSegments: ["N001"], anchor: null },
      { id: "trust", title: "Trust", narrativeSegments: ["N002"], anchor: "Trust begins" }
    ],
    writtenSections: [{ id: "opening", title: "Opening" }, { id: "trust", title: "Trust" }],
    narrativeSections: [{ id: "opening", title: "Opening" }, { id: "trust", title: "Trust" }],
    audioDurationSeconds: 4
  });
  assert.equal(alignment.sections[1].written.heading, "Trust");
  assert.equal(alignment.sections[1].narrative.segments[0], "N002");
  assert.equal(alignment.sections[1].audio.start, 2);
  assert.deepEqual(alignment.coverage.written.missing, []);
});

test("draft plans require an explicit review-render override before timeline compilation", () => {
  const plan = fixturePlan();
  const alignment = buildSourceAlignment({
    transcript: fixtureTranscript(),
    specifications: [{ id: "opening", title: "Opening", narrativeSegments: ["N001"], anchor: null }],
    writtenSections: [{ id: "opening", title: "Opening" }],
    narrativeSections: [{ id: "opening", title: "Opening" }],
    audioDurationSeconds: 4
  });
  assert.throws(() => compileTimeline(plan, fixtureTranscript(), alignment), /not approved/);
  const timeline = compileTimeline(plan, fixtureTranscript(), alignment, { allowDraft: true });
  assert.equal(timeline.scenes[0].events[0].sourcePhrase, "Opening words");
  assert.equal(timeline.reviewOverride, "draft scene plan explicitly compiled for review");
});

test("validation catches coverage, duplicate IDs and missing diagram sources", (t) => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "pre-render-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const plan = fixturePlan();
  plan.sections.push({ id: "missing", title: "Missing" });
  plan.scenes.push({ ...plan.scenes[0], diagram: { id: "absent", source: "missing.d2", rendered: "missing.svg" } });
  const result = validateScenePlan(plan, { repoRoot: root });
  assert.equal(result.valid, false);
  assert.match(result.errors.join("\n"), /duplicate scene ID/);
  assert.match(result.errors.join("\n"), /has no scene representation/);
  assert.match(result.errors.join("\n"), /missing D2 source/);
});

function fixturePlan() {
  return {
    version: 2,
    episode: { writtenSource: "episode.md", narrativeSource: "narrative.md", audio: "episode.wav" },
    defaults: { authority: "guided" },
    review: { status: "draft" },
    sections: [{ id: "opening", title: "Opening" }],
    scenes: [{
      id: "S001", section: "opening", archetype: "Narrator", headline: "Opening",
      beats: [{ target: "headline", alignTo: "Opening words" }]
    }]
  };
}

function fixtureTranscript() {
  return {
    segments: [
      { start: 0, end: 1.8, text: "Opening words", words: [
        { start: 0, end: 0.8, text: " Opening" }, { start: 0.8, end: 1.8, text: " words" }
      ] },
      { start: 2, end: 4, text: "Trust begins", words: [
        { start: 2, end: 2.7, text: " Trust" }, { start: 2.7, end: 4, text: " begins" }
      ] }
    ]
  };
}
