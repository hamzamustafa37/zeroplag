"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { GrammarError } from "@/lib/ai/grammar";

interface ErrorCardProps {
  error: GrammarError;
  onAccept?: (error: GrammarError) => void;
  onIgnore?: (error: GrammarError) => void;
  isActive?: boolean;
  onClick?: () => void;
}

const severityConfig = {
  error: {
    border: "border-red-500/30",
    badge: "bg-red-500/10 text-red-400 border border-red-500/20",
    label: "Error",
  },
  warning: {
    border: "border-amber-500/30",
    badge: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    label: "Warning",
  },
  info: {
    border: "border-blue-500/30",
    badge: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    label: "Suggestion",
  },
};

export function ErrorCard({
  error,
  onAccept,
  onIgnore,
  isActive,
  onClick,
}: ErrorCardProps) {
  const config = severityConfig[error.severity];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      className={cn(
        "rounded-xl bg-slate-800 border p-4 space-y-3 cursor-pointer",
        "hover:border-slate-500 transition-colors",
        config.border,
        isActive && "ring-2 ring-blue-500/40"
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", config.badge)}>
          {config.label}
        </span>
      </div>

      {/* Diff */}
      <div className="space-y-1">
        <p className="text-sm line-through text-red-400/80 font-mono">
          {error.original}
        </p>
        <p className="text-sm text-green-400 font-mono font-medium">
          {error.suggestion}
        </p>
      </div>

      {/* Explanation */}
      <p className="text-xs text-slate-400 leading-relaxed">{error.explanation}</p>

      {/* Actions */}
      {(onAccept || onIgnore) && (
        <div className="flex gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
          {onAccept && (
            <Button size="sm" variant="primary" onClick={() => onAccept(error)} className="flex-1">
              Accept
            </Button>
          )}
          {onIgnore && (
            <Button size="sm" variant="ghost" onClick={() => onIgnore(error)} className="flex-1">
              Ignore
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
}
