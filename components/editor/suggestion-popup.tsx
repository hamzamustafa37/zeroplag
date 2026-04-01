"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { GrammarError } from "@/lib/ai/grammar";

interface SuggestionPopupProps {
  suggestion: GrammarError | null;
  position: { x: number; y: number } | null;
  onAccept: (suggestion: GrammarError) => void;
  onIgnore: (suggestion: GrammarError) => void;
  onClose: () => void;
}

const severityColors = {
  error: "text-red-400",
  warning: "text-amber-400",
  info: "text-blue-400",
};

export function SuggestionPopup({
  suggestion,
  position,
  onAccept,
  onIgnore,
  onClose,
}: SuggestionPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <AnimatePresence>
      {suggestion && position && (
        <motion.div
          ref={popupRef}
          key={suggestion.original}
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.97 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{ left: position.x, top: position.y + 20 }}
          className={cn(
            "fixed z-50 w-72 rounded-xl bg-slate-800 border border-slate-700",
            "shadow-2xl p-4 space-y-3"
          )}
        >
          {/* Severity badge */}
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-xs font-medium uppercase tracking-wide",
                severityColors[suggestion.severity]
              )}
            >
              {suggestion.severity}
            </span>
          </div>

          {/* Diff */}
          <div className="space-y-1">
            <p className="text-sm line-through text-red-400/80">
              {suggestion.original}
            </p>
            <p className="text-sm font-medium text-green-400">
              {suggestion.suggestion}
            </p>
          </div>

          {/* Explanation */}
          <p className="text-xs text-slate-400 leading-relaxed">
            {suggestion.explanation}
          </p>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              variant="primary"
              onClick={() => onAccept(suggestion)}
              className="flex-1"
            >
              Accept
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onIgnore(suggestion)}
              className="flex-1"
            >
              Ignore
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
