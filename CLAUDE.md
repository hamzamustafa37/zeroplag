# Plagiarism & Grammar Checker

## Stack
- Next.js 15 App Router, React 19, TypeScript 5.3
- Tailwind CSS 4, Radix UI, Framer Motion
- Zustand + TanStack Query
- Anthropic Claude API (primary)
- PostgreSQL + Redis

## Structure
- `app/(dashboard)/` - Authenticated routes
- `app/(marketing)/` - Public pages
- `components/ui/` - Design system primitives
- `components/editor/` - Text editor
- `components/plagiarism/` - Plagiarism UI
- `components/grammar/` - Grammar UI
- `lib/ai/prompts/` - Version controlled prompts
- `hooks/` - Feature-specific hooks

## Rules
- Server Components by default
- Use 'use client' only for interactivity
- Stream AI responses always
- Co-locate prompts with version control
- Feature-based folder structure
- NEVER expose API keys client-side

## Conventions
- Components: PascalCase
- Hooks: useCamelCase
- Files: kebab-case
- API routes: lowercase

## Critical
- Chunk large docs for Claude (200K limit)
- Implement request deduplication
- Cache check results by text hash
- Handle rate limits with backoff
- Support reduced-motion
- Dark mode default