import { getClaudeClient, withBackoff } from "./claude";
import { stripPII, chunkText } from "@/lib/utils";
import {
  PLAGIARISM_SYSTEM_PROMPT,
  PLAGIARISM_USER_PROMPT,
  PLAGIARISM_MODEL,
  PLAGIARISM_MAX_TOKENS,
  PLAGIARISM_TEMPERATURE,
} from "./prompts/plagiarism";

export interface SourceMatch {
  sourceUrl: string;
  sourceTitle: string;
  matchText: string;
  similarity: number;
  position: { start: number; end: number };
}

export interface PlagiarismResult {
  id: string;
  status: "complete" | "error";
  score: number; // 0-100 originality
  matches: SourceMatch[];
  suspiciousSegments: Array<{
    text: string;
    reason: string;
    position: { start: number; end: number };
    confidence: number;
  }>;
  summary: string;
}

interface RunOptions {
  documentId?: string;
  sources?: string[];
}

function mockPlagiarismResult(text: string): PlagiarismResult {
  const len = text.length;
  return {
    id: crypto.randomUUID(),
    status: "complete",
    score: 74,
    matches: [
      {
        sourceUrl: "https://en.wikipedia.org/wiki/Example",
        sourceTitle: "Example — Wikipedia",
        matchText: text.slice(0, Math.min(60, len)),
        similarity: 0.82,
        position: { start: 0, end: Math.min(60, len) },
      },
      {
        sourceUrl: "https://example.com/article",
        sourceTitle: "Sample Article — Example.com",
        matchText: text.slice(Math.min(70, len - 40), Math.min(110, len)),
        similarity: 0.51,
        position: { start: Math.min(70, len - 40), end: Math.min(110, len) },
      },
    ],
    suspiciousSegments: [
      {
        text: text.slice(0, Math.min(60, len)),
        reason: "Matches content found on Wikipedia",
        position: { start: 0, end: Math.min(60, len) },
        confidence: 0.82,
      },
    ],
    summary: "2 matching sources found. Overall originality: 74%.",
  };
}

export async function runPlagiarismCheck(
  rawText: string,
  _options: RunOptions = {}
): Promise<PlagiarismResult> {
  if (process.env.MOCK_AI === "true") {
    await new Promise((r) => setTimeout(r, 800));
    return mockPlagiarismResult(rawText);
  }
  const text = stripPII(rawText);
  const chunks = chunkText(text, 50_000);
  const client = getClaudeClient();

  const allSegments: PlagiarismResult["suspiciousSegments"] = [];

  for (const chunk of chunks) {
    try {
      const response = await withBackoff(() =>
        client.messages.create({
          model: PLAGIARISM_MODEL,
          max_tokens: PLAGIARISM_MAX_TOKENS,
          temperature: PLAGIARISM_TEMPERATURE,
          system: PLAGIARISM_SYSTEM_PROMPT,
          messages: [{ role: "user", content: PLAGIARISM_USER_PROMPT(chunk) }],
        })
      );

      const content = response.content[0];
      if (content.type !== "text") continue;

      let parsed: {
        suspiciousSegments: PlagiarismResult["suspiciousSegments"];
        overallRisk: string;
        summary: string;
      };

      try {
        parsed = JSON.parse(content.text);
      } catch {
        continue;
      }

      allSegments.push(...(parsed.suspiciousSegments ?? []));
    } catch {
      // Continue with partial results on error
    }
  }

  // Score: 100 - weighted penalty for suspicious segments
  const penalty = allSegments.reduce((acc, s) => acc + s.confidence * 20, 0);
  const score = Math.max(0, Math.round(100 - penalty));

  return {
    id: crypto.randomUUID(),
    status: "complete",
    score,
    matches: [], // Web/DB search results — requires external integration
    suspiciousSegments: allSegments,
    summary:
      allSegments.length === 0
        ? "No suspicious content detected."
        : `Found ${allSegments.length} potentially suspicious segment(s).`,
  };
}
