import { spawnSync } from "node:child_process";
import fs from "node:fs";

export function findExecutable(name) {
  const result = spawnSync("which", [name], { encoding: "utf8" });
  if (result.status !== 0) return null;
  return result.stdout.trim() || null;
}

export function requireExecutable(name) {
  const found = findExecutable(name);
  if (!found) {
    throw new Error(`Required executable '${name}' was not found. Install ${name} and rerun the command.`);
  }
  return found;
}

export function runCommand(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: "utf8", stdio: "pipe", ...options });
  if (result.status !== 0) {
    const stderr = result.stderr?.trim();
    const stdout = result.stdout?.trim();
    throw new Error(`Command failed: ${command} ${args.join(" ")}${stderr ? `\n${stderr}` : ""}${stdout ? `\n${stdout}` : ""}`);
  }
  return result;
}

export function probeDurationSeconds(ffprobePath, mediaPath) {
  const result = runCommand(ffprobePath, [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1",
    mediaPath
  ]);
  return Number.parseFloat(result.stdout.trim());
}

export function probeVideo(ffprobePath, mediaPath) {
  const result = runCommand(ffprobePath, [
    "-v", "error",
    "-select_streams", "v:0",
    "-show_entries", "stream=width,height,duration",
    "-of", "json",
    mediaPath
  ]);
  return JSON.parse(result.stdout);
}

export function probeMedia(ffprobePath, mediaPath) {
  const result = runCommand(ffprobePath, [
    "-v", "error",
    "-show_entries", "format=duration:stream=index,codec_type,codec_name,width,height,r_frame_rate,sample_rate,channels",
    "-of", "json",
    mediaPath
  ]);
  return JSON.parse(result.stdout);
}

export function assertWritableDirectory(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
  fs.accessSync(dirPath, fs.constants.W_OK);
}
