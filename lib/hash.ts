import { createHash } from "crypto";

/** SHA-256 hash of text for cache keying */
export function hashText(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

/** Cache key combining text hash + prompt version */
export function cacheKey(text: string, promptVersion: string): string {
  return `check:${hashText(text)}:${promptVersion}`;
}
