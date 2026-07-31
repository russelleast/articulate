import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const episodeDirectory = path.resolve(here, "../..");
const transcriptPath = path.join(episodeDirectory, "transcript.json");
const outputPath = path.join(here, "episode-0000-en.srt");
const mediaDurationSeconds = 147.1;

// Corrected against the final presenter recording. Cue order deliberately mirrors
// the recording-derived word timeline, including spoken differences from the
// written narrative such as "we are" and "I'll explore".
const cueTexts = [
  "Welcome to the Articulate Journal.",
  "I'm Russell, and I've spent most of my",
  "career designing and building software systems.",
  "Over the years, I've learned that architecture isn't",
  "really about drawing diagrams",
  "or choosing technologies.",
  "It's about making decisions",
  "and understanding the consequences of those decisions over time.",
  "Today, we are at the beginning",
  "of another major shift in our industry.",
  "Artificial intelligence isn't just changing",
  "how we write software. It's changing how we think about architecture itself.",
  "We're seeing new ideas emerge almost daily:",
  "Agentic systems. AI-native applications.",
  "Multi-agent architectures. Durable execution.",
  "Memory, reasoning and retrieval.",
  "But while the tools are evolving rapidly,",
  "one question keeps coming back to me.",
  "How do we build AI-native systems",
  "that are reliable, understandable",
  "and maintainable in the real world?",
  "That's the question behind Articulate.",
  "Articulate isn't a demo",
  "project or a proof of concept.",
  "It's a real software platform",
  "that I'm designing and building in public,",
  "with the goal of exploring what AI-native architecture looks like",
  "when you approach it as a systems architect.",
  "More importantly, this journal isn't a retrospective.",
  "I'm not waiting until everything is finished",
  "before explaining how it all works.",
  "Instead, I'm documenting the journey as it happens.",
  "The ideas, research, architectural decisions,",
  "trade-offs and mistakes, and sometimes discovering",
  "the best decision is to change direction.",
  "Because that's part of architecture:",
  "a continuous process of learning,",
  "questioning and refining.",
  "Throughout this journal, I'll explore",
  "the principles behind AI-native systems,",
  "investigate new architectural patterns,",
  "evaluate technologies against",
  "real architectural requirements,",
  "and gradually build Articulate",
  "into a working platform.",
  "Some episodes will focus on concepts.",
  "Others will follow architectural decisions",
  "from the original question through to implementation.",
  "The software is important,",
  "but the reasoning behind the software",
  "is what I really want to preserve.",
  "If you're interested in software architecture,",
  "AI-native systems, or simply want to follow",
  "the design of a complex system as it evolves,",
  "then I hope you'll enjoy the journey.",
  "Welcome to the Articulate Journal."
];

const transcript = JSON.parse(fs.readFileSync(transcriptPath, "utf8"));
const words = coalescedWords(transcript);
const cueWordCounts = cueTexts.map((text) => normalWords(text).length);
const totalCueWords = cueWordCounts.reduce((sum, count) => sum + count, 0);

if (totalCueWords !== words.length) {
  throw new Error(`Publication text has ${totalCueWords} words; timing transcript has ${words.length}`);
}

let cursor = 0;
const cues = cueTexts.map((text, index) => {
  const cueWords = words.slice(cursor, cursor + cueWordCounts[index]);
  cursor += cueWordCounts[index];
  return {
    text,
    start: cueWords[0].start,
    spokenEnd: cueWords.at(-1).end
  };
});

for (let index = 0; index < cues.length; index += 1) {
  const cue = cues[index];
  const nextStart = cues[index + 1]?.start ?? mediaDurationSeconds;
  cue.end = Math.min(
    mediaDurationSeconds,
    nextStart - (index === cues.length - 1 ? 0 : 0.08),
    Math.max(cue.start + 1, cue.spokenEnd + 0.28)
  );
  if (cue.end <= cue.start) {
    throw new Error(`Cue ${index + 1} has an invalid range`);
  }
}

const srt = cues.map((cue, index) => [
  index + 1,
  `${srtTime(cue.start)} --> ${srtTime(cue.end)}`,
  wrapTwoLines(cue.text),
  ""
].join("\n")).join("\n");

fs.writeFileSync(outputPath, `${srt}\n`);
console.log(`Episode 0000 publication SRT: ${path.relative(process.cwd(), outputPath)}`);
console.log(`Subtitle blocks: ${cues.length}`);

function coalescedWords(source) {
  const result = [];
  for (const segment of source.segments) {
    for (const token of segment.words) {
      const cleaned = token.text.replace(/[^A-Za-z0-9'-]/g, "");
      if (!cleaned) continue;
      const beginsWord = /^\s/.test(token.text) || result.length === 0;
      if (beginsWord) {
        result.push({ text: cleaned, start: token.start, end: token.end });
      } else {
        const previous = result.at(-1);
        previous.text += cleaned;
        previous.end = token.end;
      }
    }
  }
  return result;
}

function normalWords(text) {
  return text.replace(/[^A-Za-z0-9'-]+/g, " ").trim().split(/\s+/).filter(Boolean);
}

function wrapTwoLines(text, preferredWidth = 38, maximumWidth = 42) {
  if (text.length <= maximumWidth) return text;
  const words = text.split(/\s+/);
  let best = null;
  for (let split = 1; split < words.length; split += 1) {
    const first = words.slice(0, split).join(" ");
    const second = words.slice(split).join(" ");
    if (first.length > maximumWidth || second.length > maximumWidth) continue;
    const score = Math.abs(first.length - second.length)
      + Math.max(0, first.length - preferredWidth) * 2
      + Math.max(0, second.length - preferredWidth) * 2;
    if (!best || score < best.score) best = { first, second, score };
  }
  if (!best) throw new Error(`Cue cannot be wrapped to two ${maximumWidth}-character lines: ${text}`);
  return `${best.first}\n${best.second}`;
}

function srtTime(seconds) {
  const total = Math.round(seconds * 1000);
  const hours = Math.floor(total / 3_600_000);
  const minutes = Math.floor(total % 3_600_000 / 60_000);
  const secs = Math.floor(total % 60_000 / 1000);
  const milliseconds = total % 1000;
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)},${String(milliseconds).padStart(3, "0")}`;
}

function pad(value) {
  return String(value).padStart(2, "0");
}
