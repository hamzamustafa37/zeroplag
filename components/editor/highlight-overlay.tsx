"use client";

import { cn } from "@/lib/utils";

export interface HighlightRange {
  id: string;
  start: number;
  end: number;
  type: "plagiarism" | "citation" | "grammar-error" | "grammar-warning" | "grammar-suggestion";
  label?: string;
}

interface HighlightOverlayProps {
  text: string;
  highlights: HighlightRange[];
  onHighlightClick?: (highlight: HighlightRange) => void;
  activeId?: string;
}

const highlightClasses: Record<HighlightRange["type"], string> = {
  plagiarism: "highlight-plagiarism cursor-pointer",
  citation: "highlight-citation cursor-pointer",
  "grammar-error": "underline-grammar-error cursor-pointer",
  "grammar-warning": "underline-grammar-warning cursor-pointer",
  "grammar-suggestion": "underline-grammar-suggestion cursor-pointer",
};

/** Renders text with inline highlight spans. */
export function HighlightOverlay({
  text,
  highlights,
  onHighlightClick,
  activeId,
}: HighlightOverlayProps) {
  if (highlights.length === 0) {
    return <span>{text}</span>;
  }

  // Sort highlights by start position
  const sorted = [...highlights].sort((a, b) => a.start - b.start);

  const segments: React.ReactNode[] = [];
  let cursor = 0;

  for (const hl of sorted) {
    if (hl.start > cursor) {
      segments.push(
        <span key={`plain-${cursor}`}>{text.slice(cursor, hl.start)}</span>
      );
    }
    const highlighted = text.slice(hl.start, hl.end);
    segments.push(
      <mark
        key={hl.id}
        className={cn(
          "rounded-sm transition-all duration-150 bg-transparent",
          highlightClasses[hl.type],
          activeId === hl.id && "ring-2 ring-offset-1 ring-blue-400"
        )}
        onClick={() => onHighlightClick?.(hl)}
        aria-label={hl.label}
      >
        {highlighted}
      </mark>
    );
    cursor = hl.end;
  }

  if (cursor < text.length) {
    segments.push(<span key={`plain-${cursor}`}>{text.slice(cursor)}</span>);
  }

  return <>{segments}</>;
}
