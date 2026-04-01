# Design Principles

## 1. Editor-First
Writing space takes 70% screen. Tools are peripheral, not modal.

## 2. Inline Everything
- Grammar: Underline + hover card
- Plagiarism: Highlight + sidebar detail
- No popups blocking text

## 3. Progressive Disclosure
- Default: Clean editor
- Hover: Show basic info
- Click: Full details + actions

## 4. Color System

### Plagiarism
- Match: #ef4444 (red-500) - 20% opacity background
- Citation needed: #f59e0b (amber-500)
- Original: transparent

### Grammar
- Error: #ef4444, wavy underline
- Warning: #f59e0b, dotted underline  
- Suggestion: #3b82f6 (blue-500), solid underline

### Dark Mode
- Background: #0f172a (slate-900)
- Surface: #1e293b (slate-800)
- Text: #f8fafc (slate-50)
- Muted: #94a3b8 (slate-400)

## 5. Typography
- Editor: 16px Inter, 1.6 line-height
- UI: 14px Inter, 1.5 line-height
- Code: 13px JetBrains Mono

## 6. Spacing
- Editor padding: 40px
- Card padding: 16px
- Gap between elements: 12px
- Section gaps: 24px

## 7. Motion
- Use Framer Motion
- Prefer layout animations over opacity
- Respect prefers-reduced-motion
- Max animation distance: 20px
