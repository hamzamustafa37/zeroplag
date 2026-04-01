# AI Integration

## Claude Usage

### Grammar Check
```
Model: claude-3-5-sonnet-20241022
Max tokens: 4096
Temperature: 0.1
System: "You are a grammar checker. Return JSON array of errors."
```

### Plagiarism Analysis
```
Model: claude-3-5-sonnet-20241022
Max tokens: 8192
Temperature: 0
System: "Analyze text for potential plagiarism. Identify suspicious phrasing."
```

### Paraphrase Detection
```
Model: claude-3-opus-20240229 (heavy lifting)
Max tokens: 4096
Temperature: 0
System: "Compare two texts. Determine if B is paraphrased from A."
```

## Prompt Location
All prompts in `lib/ai/prompts/` as TypeScript constants:

```typescript
export const GRAMMAR_CHECK_PROMPT = `
Analyze the following text for grammar, spelling, and style issues.
Return JSON format:
{
  "errors": [
    {
      "original": "text",
      "suggestion": "fix",
      "explanation": "why",
      "position": { "start": 0, "end": 4 },
      "severity": "error" | "warning" | "info"
    }
  ]
}
Text: {{TEXT}}
` as const;
```

## Error Handling
- Timeout: 30s → fallback to cached result or error state
- Rate limit: exponential backoff (1s, 2s, 4s, 8s)
- Invalid JSON: retry once, then return empty result
- Content filter: return "unable to analyze" message

## Caching
- Key: `hash(text) + prompt_version`
- TTL: 1 hour
- Store: Redis
