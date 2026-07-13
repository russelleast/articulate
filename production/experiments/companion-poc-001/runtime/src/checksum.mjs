import crypto from "node:crypto";
import fs from "node:fs";

export function sha256File(filePath) {
  const hash = crypto.createHash("sha256");
  hash.update(fs.readFileSync(filePath));
  return hash.digest("hex");
}

export function fileRecord(filePath, repoRelativePath) {
  const stat = fs.statSync(filePath);
  return {
    path: repoRelativePath,
    bytes: stat.size,
    sha256: sha256File(filePath)
  };
}
