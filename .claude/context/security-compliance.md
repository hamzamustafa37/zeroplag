# Security & Compliance

## Data Handling
- User text: encrypted at rest (AES-256)
- Check results: encrypted, auto-delete 30 days
- Logs: anonymized, no text content

## API Security
- Rate limit: 10 req/min free, 100 req/min paid
- Max text size: 100K chars (validated)
- API keys: server-side only, rotate quarterly

## Compliance
- GDPR: data export, right to deletion
- CCPA: opt-out of data retention
- FERPA: optional for edu (no data retention)

## AI Safety
- No PII in AI prompts (strip emails, phones)
- Content moderation on output
- No training on user data (Claude API guarantee)

## Audit
- Check ID traceable to user + timestamp
- Source matches logged (URL only, not full text)
- Admin dashboard for abuse detection
