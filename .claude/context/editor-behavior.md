# Editor Behavior Spec

## Text Input
- Plain text only (no rich text for v1)
- Preserve newlines, tabs
- Max 100K chars (soft warning at 80K)

## Highlighting System
1. Text rendered in layer 1 (z-10)
2. Highlights in layer 2 (z-20, absolute)
3. Cursors in layer 3 (z-30)

## Scroll Sync
- Editor scroll → Highlight overlay follows (requestAnimationFrame)
- Sidebar click → Editor scrolls to match position
- Smooth scroll: 300ms ease-out

## Cursor Preservation
- Before AI check: save cursor index
- After render: restore cursor position
- If text changed: map to nearest valid position

## Debounce Strategy
- Typing: 500ms idle → trigger grammar
- Pasting: immediate check
- Manual "Check Now" button: bypass debounce

## Performance
- Virtual scroll for >1000 lines
- Highlight pooling (reuse DOM nodes)
- RAF throttling for scroll sync
