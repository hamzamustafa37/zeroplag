"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatSimilarity } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface SourceCardProps {
  sourceUrl: string;
  sourceTitle: string;
  similarity: number; // 0.0–1.0
  matchText: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function SourceCard({
  sourceUrl,
  sourceTitle,
  similarity,
  matchText,
  isActive,
  onClick,
}: SourceCardProps) {
  const pct = similarity * 100;
  const color =
    pct >= 80 ? "text-red-400" : pct >= 50 ? "text-amber-400" : "text-green-400";

  return (
    <Card
      className={cn(
        "cursor-pointer transition-colors hover:border-slate-500",
        isActive && "border-red-500/50 bg-slate-700/50"
      )}
      onClick={onClick}
    >
      <CardHeader className="py-2.5">
        <span className={cn("text-sm font-semibold tabular-nums", color)}>
          {formatSimilarity(similarity)}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-200 truncate">
            {sourceTitle}
          </p>
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-500 hover:text-slate-300 truncate block"
            onClick={(e) => e.stopPropagation()}
          >
            {sourceUrl}
          </a>
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-3">
        <p className="text-xs text-slate-400 line-clamp-2 italic">
          &ldquo;{matchText}&rdquo;
        </p>
      </CardContent>
    </Card>
  );
}
