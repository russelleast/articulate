import fs from "node:fs";

export function formatSrtTime(seconds) {
  const whole = Math.floor(seconds);
  const ms = Math.round((seconds - whole) * 1000);
  const h = Math.floor(whole / 3600);
  const m = Math.floor((whole % 3600) / 60);
  const s = whole % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
}

export function buildSrt(scenes, { placeholderAudio }) {
  let cursor = 0;
  return scenes.map((scene, index) => {
    const start = cursor;
    const end = cursor + scene.durationSeconds;
    cursor = end;
    const label = placeholderAudio ? "[PLACEHOLDER AUDIO] " : "";
    return `${index + 1}\n${formatSrtTime(start)} --> ${formatSrtTime(end)}\n${label}${scene.subtitleText}\n`;
  }).join("\n");
}

export function writeSrt(filePath, scenes, options) {
  const srt = buildSrt(scenes, options);
  fs.writeFileSync(filePath, srt, "utf8");
  return filePath;
}
