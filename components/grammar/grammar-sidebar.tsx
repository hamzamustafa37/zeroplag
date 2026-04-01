"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ErrorCard } from "./error-card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { GrammarError } from "@/lib/ai/grammar";

interface GrammarSidebarProps {
  errors: GrammarError[];
  isChecking?: boolean;
  onAccept?: (error: GrammarError) => void;
  onIgnore?: (error: GrammarError) => void;
}

type Severity = "all" | "error" | "warning" | "info";

export function GrammarSidebar({
  errors,
  isChecking,
  onAccept,
  onIgnore,
}: GrammarSidebarProps) {
  const [filter, setFilter] = useState<Severity>("all");
  const [activeId, setActiveId] = useState<string | null>(null);

  const filtered =
    filter === "all" ? errors : errors.filter((e) => e.severity === filter);

  const counts = {
    error: errors.filter((e) => e.severity === "error").length,
    warning: errors.filter((e) => e.severity === "warning").length,
    info: errors.filter((e) => e.severity === "info").length,
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-300">Grammar</h2>
          {isChecking && (
            <span className="text-xs text-slate-500 animate-pulse">
              Checking…
            </span>
          )}
          {!isChecking && errors.length > 0 && (
            <span className="text-xs text-slate-500">
              {errors.length} issue{errors.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Severity filters */}
        <div className="flex gap-1.5 flex-wrap">
          {(["all", "error", "warning", "info"] as Severity[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={cn(
                "text-xs px-2.5 py-1 rounded-full border transition-colors capitalize",
                filter === s
                  ? "bg-slate-600 border-slate-500 text-slate-50"
                  : "bg-transparent border-slate-700 text-slate-500 hover:text-slate-300"
              )}
            >
              {s === "all"
                ? `All (${errors.length})`
                : `${s} (${counts[s as keyof typeof counts]})`}
            </button>
          ))}
        </div>
      </div>

      {/* Error list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {isChecking &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2 rounded-xl bg-slate-800 p-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-5/6" />
            </div>
          ))}

        <AnimatePresence mode="popLayout">
          {!isChecking && filtered.length === 0 && errors.length > 0 && (
            <p className="text-center text-sm text-slate-500 py-8">
              No {filter} issues found.
            </p>
          )}

          {!isChecking && errors.length === 0 && (
            <p className="text-center text-sm text-slate-600 py-8">
              {isChecking ? "Checking…" : "Run grammar check to see results."}
            </p>
          )}

          {!isChecking &&
            filtered.map((error, i) => {
              const id = `${error.original}-${error.position.start}`;
              return (
                <ErrorCard
                  key={`${id}-${i}`}
                  error={error}
                  isActive={activeId === id}
                  onClick={() => setActiveId(activeId === id ? null : id)}
                  onAccept={onAccept}
                  onIgnore={onIgnore}
                />
              );
            })}
        </AnimatePresence>
      </div>
    </div>
  );
}
