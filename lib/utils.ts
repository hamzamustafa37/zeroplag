import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Chunk text into segments for Claude's context limit */
export function chunkText(text: string, maxChars = 100_000): string[] {
  if (text.length <= maxChars) return [text];

  const chunks: string[] = [];
  // Split on sentence boundaries where possible
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];

  let current = "";
  for (const sentence of sentences) {
    if ((current + sentence).length > maxChars) {
      if (current) chunks.push(current.trim());
      current = sentence;
    } else {
      current += sentence;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

/** Strip PII before sending to AI (emails, phone numbers) */
export function stripPII(text: string): string {
  return text
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[email]")
    .replace(/\b\+?[\d\s\-().]{7,15}\d\b/g, "[phone]");
}

/** Format similarity percentage */
export function formatSimilarity(score: number): string {
  return `${Math.round(score * 100)}%`;
}

/** Format originality score (0–100) */
export function formatScore(score: number): string {
  if (score >= 80) return `${score}% original`;
  if (score >= 60) return `${score}% mostly original`;
  return `${score}% — review needed`;
}
