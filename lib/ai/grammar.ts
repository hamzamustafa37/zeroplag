import { getClaudeClient, withBackoff } from "./claude";
import { stripPII, chunkText } from "@/lib/utils";
import {
  GRAMMAR_SYSTEM_PROMPT,
  GRAMMAR_USER_PROMPT,
  GRAMMAR_MODEL,
  GRAMMAR_MAX_TOKENS,
  GRAMMAR_TEMPERATURE,
} from "./prompts/grammar";

// ─── Mock (set MOCK_AI=true in .env to skip API calls) ───────────────────────

async function* mockGrammarStream(text: string): AsyncGenerator<GrammarEvent> {
  await new Promise((r) => setTimeout(r, 400));
  const words = text.split(/\s+/).filter(Boolean);

  const samples: GrammarError[] = [
    {
      original: words[0] ?? "their",
      suggestion: words[0] ? words[0].toLowerCase() : "there",
      explanation: "Consider starting sentences with a capital letter.",
      severity: "error" as const,
      position: { start: 0, end: (words[0] ?? "their").length },
    },
    {
      original: "alot",
      suggestion: "a lot",
      explanation: '"Alot" is not a word. Use "a lot" (two words).',
      severity: "error" as const,
      position: { start: Math.min(10, text.length - 4), end: Math.min(14, text.length) },
    },
    {
      original: "very unique",
      suggestion: "unique",
      explanation: '"Unique" is absolute — it cannot be modified by "very".',
      severity: "warning" as const,
      position: { start: Math.min(20, text.length - 11), end: Math.min(31, text.length) },
    },
    {
      original: "utilize",
      suggestion: "use",
      explanation: 'Prefer "use" over "utilize" for clarity.',
      severity: "info" as const,
      position: { start: Math.min(35, text.length - 7), end: Math.min(42, text.length) },
    },
  ].filter((e) => e.position.start < text.length && e.position.end <= text.length);

  for (const error of samples) {
    await new Promise((r) => setTimeout(r, 150));
    yield { type: "suggestion", data: error };
  }
  yield { type: "complete", totalErrors: samples.length };
}

export interface GrammarError {
  original: string;
  suggestion: string;
  explanation: string;
  position: { start: number; end: number };
  severity: "error" | "warning" | "info";
}

export interface GrammarEvent {
  type: "suggestion" | "complete" | "error";
  data?: GrammarError;
  error?: string;
  totalErrors?: number;
}

/** Stream grammar check events for SSE */
export async function* streamGrammarCheck(
  rawText: string,
  _documentId?: string
): AsyncGenerator<GrammarEvent> {
  if (process.env.MOCK_AI === "true") {
    yield* mockGrammarStream(rawText);
    return;
  }
  const text = stripPII(rawText);
  const chunks = chunkText(text);
  const client = getClaudeClient();
  const allErrors: GrammarError[] = [];

  for (const chunk of chunks) {
    try {
      const response = await withBackoff(() =>
        client.messages.create({
          model: GRAMMAR_MODEL,
          max_tokens: GRAMMAR_MAX_TOKENS,
          temperature: GRAMMAR_TEMPERATURE,
          system: GRAMMAR_SYSTEM_PROMPT,
          messages: [{ role: "user", content: GRAMMAR_USER_PROMPT(chunk) }],
        })
      );

      const content = response.content[0];
      if (content.type !== "text") continue;

      let parsed: { errors: GrammarError[] };
      try {
        parsed = JSON.parse(content.text);
      } catch {
        // Retry on JSON parse failure
        continue;
      }

      for (const error of parsed.errors ?? []) {
        allErrors.push(error);
        yield { type: "suggestion", data: error };
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "AI error";
      yield { type: "error", error: message };
    }
  }

  yield { type: "complete", totalErrors: allErrors.length };
}
