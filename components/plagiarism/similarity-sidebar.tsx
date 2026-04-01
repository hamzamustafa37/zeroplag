"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SimilarityScore } from "./similarity-score";
import { SourceCard } from "./source-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { SourceMatch } from "@/lib/ai/plagiarism";

interface SimilaritySidebarProps {
  matches: SourceMatch[];
  score?: number;
  isChecking?: boolean;
  onSelectMatch?: (match: SourceMatch) => void;
}

export function SimilaritySidebar({
  matches,
  score,
  isChecking,
  onSelectMatch,
}: SimilaritySidebarProps) {
  const [activeUrl, setActiveUrl] = useState<string | null>(null);

  const handleSelect = (match: SourceMatch) => {
    setActiveUrl(match.sourceUrl);
    onSelectMatch?.(match);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-300">
            Plagiarism Check
          </h2>
          {isChecking && (
            <span className="text-xs text-slate-500 animate-pulse">Checking…</span>
          )}
        </div>

        {/* Score ring */}
        {score !== undefined && !isChecking && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center py-2"
          >
            <SimilarityScore score={score} size={80} />
          </motion.div>
        )}

        {isChecking && (
          <div className="flex justify-center py-2">
            <Skeleton className="w-20 h-20 rounded-full" />
          </div>
        )}
      </div>

      {/* Match list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {isChecking &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2 rounded-xl bg-slate-800 p-3">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          ))}

        <AnimatePresence>
          {!isChecking && matches.length === 0 && score !== undefined && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-slate-500 py-8"
            >
              No matching sources found.
            </motion.p>
          )}

          {!isChecking &&
            matches.map((match) => (
              <motion.div
                key={match.sourceUrl}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <SourceCard
                  {...match}
                  isActive={activeUrl === match.sourceUrl}
                  onClick={() => handleSelect(match)}
                />
              </motion.div>
            ))}
        </AnimatePresence>

        {!isChecking && score === undefined && (
          <p className="text-center text-sm text-slate-600 py-8">
            Run plagiarism check to see results.
          </p>
        )}
      </div>
    </div>
  );
}
