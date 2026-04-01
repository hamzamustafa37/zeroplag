# API Contracts

## POST /api/check/grammar
Request:
```json
{
  "text": "string (max 10000 chars)",
  "documentId": "string?",
  "stream": true
}
```

Response (SSE):
```json
{
  "type": "suggestion",
  "data": {
    "original": "teh",
    "suggestion": "the",
    "explanation": "Spelling error",
    "position": { "start": 45, "end": 48 },
    "severity": "error" | "warning" | "info"
  }
}
```

## POST /api/check/plagiarism
Request:
```json
{
  "text": "string (max 50000 chars)",
  "documentId": "string?",
  "sources": ["web", "academic", "internal"]
}
```

Response:
```json
{
  "id": "check_123",
  "status": "complete",
  "score": 85,
  "matches": [
    {
      "sourceUrl": "https://...",
      "sourceTitle": "...",
      "matchText": "...",
      "similarity": 0.92,
      "position": { "start": 120, "end": 340 }
    }
  ],
  "citations": [
    { "text": "...", "suggestedCite": "..." }
  ]
}
```

## WebSocket /ws/check/stream
Real-time progress for long plagiarism checks.

Events:
- `check.started`
- `check.progress` { percent: 45, stage: "searching_sources" }
- `check.match_found`
- `check.complete`
- `check.error`
