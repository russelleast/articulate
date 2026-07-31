import fs from "node:fs";

export function normaliseWhisperTranscript(raw, { audio, model, corrections = {} } = {}) {
  const segments = raw.transcription.map((segment, index) => {
    const words = segment.tokens
      .filter((token) => !token.text.startsWith("[_"))
      .map((token) => ({
        start: token.offsets.from / 1000,
        end: token.offsets.to / 1000,
        text: token.text,
        confidence: round(token.p)
      }));
    const original = segment.text.trim().replace(/\s+/g, " ");
    const text = corrections[original] ?? original;
    const confidence = words.length
      ? round(words.reduce((sum, word) => sum + word.confidence, 0) / words.length)
      : null;
    return {
      id: `T${String(index + 1).padStart(4, "0")}`,
      start: segment.offsets.from / 1000,
      end: segment.offsets.to / 1000,
      text,
      confidence,
      words
    };
  });
  return {
    version: 1,
    authority: "recorded-audio",
    audio,
    engine: "whisper.cpp",
    model,
    language: raw.result.language,
    segments
  };
}

export function alignSections(transcript, specifications, audioDurationSeconds) {
  const sections = [];
  for (const [index, section] of specifications.entries()) {
    const match = Number.isFinite(section.startSeconds)
      ? {
        start: section.startSeconds,
        confidence: 1,
        matchedText: `reviewed boundary at ${section.startSeconds.toFixed(3)}s`
      }
      : index === 0
      ? { start: 0, confidence: 1, matchedText: "recording start" }
      : findPhrase(transcript, section.anchor, {
        after: sections.at(-1).start,
        before: section.maximumStart ?? audioDurationSeconds
      });
    if (!match) throw new Error(`Unable to align section '${section.title}' from anchor '${section.anchor}'`);
    sections.push({
      id: section.id,
      title: section.title,
      narrativeSegments: section.narrativeSegments,
      start: round(match.start),
      end: null,
      confidence: round(match.confidence),
      anchor: Number.isFinite(section.startSeconds) ? "reviewed-boundary" : section.anchor ?? "recording start",
      matchedText: match.matchedText
    });
  }
  sections.forEach((section, index) => {
    section.end = round(sections[index + 1]?.start ?? audioDurationSeconds);
  });
  return { version: 1, authority: "recorded-audio", sections };
}

export function cueTime(transcript, phrase, section, fallbackOffset = 0) {
  const match = findPhrase(transcript, phrase, { after: section.start, before: section.end });
  return match ? round(Math.max(0, match.start - section.start)) : round(fallbackOffset);
}

export function findPhrase(transcript, phrase, { after = 0, before = Infinity } = {}) {
  const wanted = normalWords(phrase);
  if (!wanted.length) return null;
  const timedWords = coalescedWords(transcript)
    .filter((word) => word.end >= after && word.start <= before);
  let best = null;
  const minimum = Math.max(1, wanted.length - 2);
  const maximum = wanted.length + 3;
  for (let size = minimum; size <= maximum; size++) {
    for (let index = 0; index + size <= timedWords.length; index++) {
      const window = timedWords.slice(index, index + size);
      const score = orderedCoverage(wanted, window.map((word) => word.normal));
      if (!best || score > best.confidence) {
        best = {
          start: window[0].start,
          end: window.at(-1).end,
          confidence: score,
          matchedText: window.map((word) => word.text).join(" ")
        };
      }
    }
  }
  if (best?.confidence >= 0.68) return best;
  for (const segment of transcript.segments) {
    if (segment.end < after || segment.start > before) continue;
    const words = normalWords(segment.text);
    const score = orderedCoverage(wanted, words);
    if (!best || score > best.confidence) {
      best = { start: segment.start, end: segment.end, confidence: score, matchedText: segment.text };
    }
  }
  return best && best.confidence >= 0.45 ? best : null;
}

function coalescedWords(transcript) {
  const result = [];
  for (const segment of transcript.segments) {
    for (const token of segment.words) {
      const cleaned = token.text.replace(/[^A-Za-z0-9'-]/g, "");
      if (!cleaned) continue;
      const beginsWord = /^\s/.test(token.text) || result.length === 0;
      if (beginsWord) {
        result.push({ text: cleaned, normal: cleaned.toLowerCase(), start: token.start, end: token.end });
      } else {
        const previous = result.at(-1);
        previous.text += cleaned;
        previous.normal += cleaned.toLowerCase();
        previous.end = token.end;
      }
    }
  }
  return result;
}

export function writeTranscriptSrt(filePath, transcript, audioDurationSeconds) {
  const cues = transcript.segments
    .filter((segment) => segment.text)
    .map((segment, index, all) => {
      const start = Math.max(0, segment.start);
      const inferredEnd = all[index + 1]?.start ?? audioDurationSeconds;
      const end = Math.min(audioDurationSeconds, Math.max(start + 0.04, segment.end, inferredEnd));
      return `${index + 1}\n${srtTime(start)} --> ${srtTime(end)}\n${wrap(segment.text)}\n`;
    });
  fs.mkdirSync(new URL(".", `file://${filePath}`).pathname, { recursive: true });
  fs.writeFileSync(filePath, `${cues.join("\n")}\n`);
}

function orderedCoverage(wanted, actual) {
  let cursor = 0;
  let hits = 0;
  for (const word of wanted) {
    const found = actual.indexOf(word, cursor);
    if (found >= 0) {
      hits += 1;
      cursor = found + 1;
    }
  }
  const coverage = hits / wanted.length;
  const density = hits / Math.max(actual.length, wanted.length);
  return coverage * 0.75 + density * 0.25;
}

function normalWords(text) {
  return String(text).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(/\s+/).filter(Boolean);
}

function wrap(text, width = 44) {
  const lines = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    if (line && `${line} ${word}`.length > width) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines.join("\n");
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

function round(value) {
  return Math.round(value * 1000) / 1000;
}
