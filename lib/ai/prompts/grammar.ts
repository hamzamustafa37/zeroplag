/**
 * Grammar check prompts — version controlled
 * Version: 1.0.0
 */

export const GRAMMAR_PROMPT_VERSION = "grammar-v1.0.0";

export const GRAMMAR_SYSTEM_PROMPT = `You are a precise grammar checker. Analyze text for grammar, spelling, punctuation, and style issues.

CRITICAL: Return ONLY valid JSON. No markdown, no explanation outside JSON.

Response format:
{
  "errors": [
    {
      "original": "the misspelled word or phrase",
      "suggestion": "the corrected version",
      "explanation": "brief reason for the correction",
      "position": { "start": 0, "end": 4 },
      "severity": "error" | "warning" | "info"
    }
  ]
}

Severity guide:
- "error": grammar errors, misspellings, subject-verb disagreement
- "warning": punctuation issues, awkward phrasing, passive voice
- "info": style suggestions, word choice improvements` as const;

export const GRAMMAR_USER_PROMPT = (text: string) =>
  `Analyze the following text for grammar, spelling, and style issues:\n\n${text}` as const;

export const GRAMMAR_MODEL = "claude-sonnet-4-6" as const;
export const GRAMMAR_MAX_TOKENS = 4096;
export const GRAMMAR_TEMPERATURE = 0.1;
