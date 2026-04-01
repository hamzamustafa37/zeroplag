"use client";

import { useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEditorStore, type CheckMode } from "@/lib/store/editor-store";

// ─── Icons ───────────────────────────────────────────────────────────────────

function IconGrammar({ className }: { className?: string }) {
  return (
    <svg className={cn("w-3.5 h-3.5", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );
}

function IconPlagiarism({ className }: { className?: string }) {
  return (
    <svg className={cn("w-3.5 h-3.5", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function IconSave({ className }: { className?: string }) {
  return (
    <svg className={cn("w-3.5 h-3.5", className)} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface EditorToolbarProps {
  onGrammarCheck: () => void;
  onPlagiarismCheck: () => void;
  onSave: () => void;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function EditorToolbar({
  onGrammarCheck,
  onPlagiarismCheck,
  onSave,
  className,
}: EditorToolbarProps) {
  const {
    title,
    setTitle,
    mode,
    setMode,
    isDirty,
    isSaving,
    documentId,
    isGrammarChecking,
    isPlagiarismChecking,
    content,
    grammarErrors,
    plagiarismResult,
  } = useEditorStore();

  const handleModeSwitch = useCallback(
    (newMode: CheckMode) => {
      setMode(newMode);
      if (newMode === "grammar") onGrammarCheck();
      else onPlagiarismCheck();
    },
    [setMode, onGrammarCheck, onPlagiarismCheck]
  );

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <header
      className={cn(
        "flex-shrink-0 h-14 flex items-center gap-2 px-4 border-b border-slate-800 bg-slate-900",
        className
      )}
    >
      {/* Back link */}
      <Link
        href="/dashboard"
        className="text-slate-500 hover:text-slate-300 transition-colors mr-1 flex-shrink-0"
        aria-label="Back to documents"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </Link>

      {/* Title input */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 min-w-0 bg-transparent text-slate-50 font-medium text-sm outline-none truncate placeholder:text-slate-600"
        placeholder="Untitled document"
        aria-label="Document title"
        maxLength={200}
      />

      {/* Stats badges */}
      <div className="hidden sm:flex items-center gap-2 mr-2">
        {wordCount > 0 && (
          <span className="text-xs text-slate-600 tabular-nums">
            {wordCount.toLocaleString()}w
          </span>
        )}
        {grammarErrors.length > 0 && (
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400 tabular-nums font-medium">
            {grammarErrors.length} issues
          </span>
        )}
        {plagiarismResult !== null && (
          <span
            className={cn(
              "text-xs px-1.5 py-0.5 rounded-full font-medium tabular-nums",
              plagiarismResult.score >= 80
                ? "bg-green-500/15 text-green-400"
                : plagiarismResult.score >= 60
                ? "bg-amber-500/15 text-amber-400"
                : "bg-red-500/15 text-red-400"
            )}
          >
            {plagiarismResult.score}% original
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="h-6 w-px bg-slate-800 mx-1 flex-shrink-0" />

      {/* Mode toggle pill */}
      <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-slate-800 border border-slate-700">
        <ModeButton
          active={mode === "grammar"}
          loading={isGrammarChecking}
          onClick={() => handleModeSwitch("grammar")}
          icon={<IconGrammar />}
          label="Grammar"
        />
        <ModeButton
          active={mode === "plagiarism"}
          loading={isPlagiarismChecking}
          onClick={() => handleModeSwitch("plagiarism")}
          icon={<IconPlagiarism />}
          label="Plagiarism"
        />
      </div>

      {/* Save button */}
      <Button
        size="sm"
        variant={isDirty ? "primary" : "ghost"}
        onClick={onSave}
        loading={isSaving}
        disabled={!isDirty && !!documentId}
        className="flex-shrink-0 gap-1.5"
        aria-label={isSaving ? "Saving…" : isDirty ? "Save document" : "Saved"}
      >
        <IconSave />
        <span className="hidden sm:inline">
          {isSaving ? "Saving…" : isDirty ? "Save" : "Saved"}
        </span>
      </Button>
    </header>
  );
}

// ─── ModeButton ───────────────────────────────────────────────────────────────

interface ModeButtonProps {
  active: boolean;
  loading: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function ModeButton({ active, loading, onClick, icon, label }: ModeButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      aria-pressed={active}
      className={cn(
        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        active
          ? "bg-slate-600 text-slate-50 shadow-sm"
          : "text-slate-400 hover:text-slate-200"
      )}
    >
      {loading ? (
        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        icon
      )}
      {label}
    </button>
  );
}
