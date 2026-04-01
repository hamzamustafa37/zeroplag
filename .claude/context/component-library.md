# Component Library

## UI Primitives (Radix + Tailwind)

| Component | Location | Notes |
|-----------|----------|-------|
| Button | `ui/button/` | Variants: primary, secondary, ghost, danger |
| Input | `ui/input/` | Sizes: sm, md, lg. States: error, success |
| Card | `ui/card/` | With header, content, footer slots |
| Tooltip | `ui/tooltip/` | 200ms delay, 12px offset |
| Modal | `ui/modal/` | Focus trap, ESC close, portal render |
| Toast | `ui/toast/` | Auto-dismiss 5s, max 3 visible |
| Skeleton | `ui/skeleton/` | Pulse animation, match content shape |

## Editor Components

| Component | Props | Behavior |
|-----------|-------|----------|
| TextEditor | `content, highlights, onChange, mode` | ContentEditable with overlay |
| HighlightOverlay | `highlights[], scrollPosition` | Absolute positioned divs synced to text |
| SuggestionPopup | `suggestion, position, onAccept, onIgnore` | Portal at cursor position |
| SimilaritySidebar | `matches[], activeMatch, onSelect` | Scrollable list, click syncs editor |
| GrammarSidebar | `errors[], stats` | Group by severity, show explanations |

## Feature Components

### Plagiarism
- `SourceCard` - URL, title, similarity %, credibility badge
- `MatchHighlight` - Red background overlay, click to expand
- `SimilarityScore` - Circular progress, color-coded
- `CitationSuggest` - One-click insert citation

### Grammar
- `ErrorCard` - Original + suggestion + explanation
- `FixSuggestion` - Accept/Ignore/Dismiss buttons
- `ExplanationPanel` - Why this is an error, examples
- `StatsDashboard` - Error count by type, readability score

## Animation Specs

| Interaction | Duration | Easing |
|-------------|----------|--------|
| Modal open | 200ms | ease-out |
| Toast slide | 300ms | cubic-bezier(0.16, 1, 0.3, 1) |
| Highlight fade | 150ms | ease-in-out |
| Score ring | 1000ms | ease-out (on complete) |
