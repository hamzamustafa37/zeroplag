# System Architecture

## High-Level Flow

User Input → Text Editor → Chunking Service → AI/ML Pipeline → Results Store → UI Render

## Core Services

| Service | Tech | Purpose |
|---------|------|---------|
| Text Chunker | Node.js | Split docs for Claude 200K limit |
| Similarity Engine | Python/FastAPI | Vector search + semantic match |
| Grammar Engine | Claude API | Real-time suggestions |
| Plagiarism Detector | Hybrid: Vector DB + Claude | Web + academic DB search |
| Cache Layer | Redis | Deduplicate identical checks |

## Data Flow

1. User types/pastes text
2. Debounce 500ms → trigger check
3. Chunk if >100K chars
4. Parallel: Grammar (stream) + Plagiarism (async)
5. Cache results (text hash + TTL 1hr)
6. Render: Inline highlights + sidebar

## Database Schema (Prisma)

```prisma
model Document {
  id        String   @id @default(cuid())
  userId    String
  title     String
  content   String   @db.Text
  checks    Check[]
  createdAt DateTime @default(now())
}

model Check {
  id           String        @id @default(cuid())
  documentId   String
  type         CheckType     // GRAMMAR | PLAGIARISM | BOTH
  status       Status        // PENDING | RUNNING | COMPLETE | ERROR
  results      Json?
  score        Float?        // 0-100 originality/grammar score
  completedAt  DateTime?
}

model SourceMatch {
  id          String @id @default(cuid())
  checkId     String
  sourceUrl   String
  sourceTitle String
  matchText   String @db.Text
  similarity  Float  // 0-1
  startIndex  Int
  endIndex    Int
}
```
