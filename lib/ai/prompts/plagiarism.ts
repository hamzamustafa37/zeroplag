/**
 * Plagiarism detection prompts — version controlled
 * Version: 1.0.0
 */

export const PLAGIARISM_PROMPT_VERSION = "plagiarism-v1.0.0";

export const PLAGIARISM_SYSTEM_PROMPT = `You are an expert plagiarism detection assistant. Analyze text for potential plagiarism indicators:
- Suspicious phrasing that sounds copied from well-known sources
- Sudden style shifts suggesting patchwork copying
- Common academic phrases without proper context
- Overly formal or technical language inconsistent with surrounding text

CRITICAL: Return ONLY valid JSON. No markdown, no explanation outside JSON.

Response format:
{
  "suspiciousSegments": [
    {
      "text": "the suspicious excerpt",
      "reason": "why this looks potentially plagiarized",
      "position": { "start": 0, "end": 100 },
      "confidence": 0.0-1.0
    }
  ],
  "overallRisk": "low" | "medium" | "high",
  "summary": "brief overall assessment"
}` as const;

export const PLAGIARISM_USER_PROMPT = (text: string) =>
  `Analyze the following text for potential plagiarism indicators:\n\n${text}` as const;

export const PARAPHRASE_SYSTEM_PROMPT = `You are an expert at detecting paraphrasing and text reuse. Compare two texts and determine if the second is a paraphrase of the first.

CRITICAL: Return ONLY valid JSON.

Response format:
{
  "isParaphrase": true | false,
  "confidence": 0.0-1.0,
  "explanation": "brief analysis",
  "similarSegments": [
    { "original": "...", "paraphrased": "...", "similarity": 0.0-1.0 }
  ]
}` as const;

export const PLAGIARISM_MODEL = "claude-sonnet-4-6" as const;
export const PLAGIARISM_MAX_TOKENS = 8192;
export const PLAGIARISM_TEMPERATURE = 0;

export const PARAPHRASE_MODEL = "claude-opus-4-6" as const;
export const PARAPHRASE_MAX_TOKENS = 4096;
export const PARAPHRASE_TEMPERATURE = 0;
