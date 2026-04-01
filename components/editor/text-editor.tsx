"use client";

import {
  forwardRef,
  useRef,
  useCallback,
  useEffect,
  useImperativeHandle,
} from "react";
import { cn } from "@/lib/utils";
import { HighlightOverlay, type HighlightRange } from "./highlight-overlay";
import { CHAR_WARN_LIMIT, CHAR_HARD_LIMIT } from "@/lib/store/editor-store";

// ─── Shared font style (must match between textarea and backdrop) ─────────────

const EDITOR_FONT_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
  fontSize: "16px",
  lineHeight: "1.6",
  padding: "40px",
  letterSpacing: "normal",
  fontVariantLigatures: "none",
  tabSize: 4,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  overflowWrap: "break-word",
};

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TextEditorHandle {
  focus: () => void;
  blur: () => void;
  getSelectionStart: () => number;
}

export interface TextEditorProps {
  content: string;
  onChange: (text: string) => void;
  onPaste?: () => void; // fired after paste for immediate check
  highlights?: HighlightRange[];
  activeHighlightId?: string | null;
  onHighlightClick?: (hl: HighlightRange) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const TextEditor = forwardRef<TextEditorHandle, TextEditorProps>(
  function TextEditor(
    {
      content,
      onChange,
      onPaste,
      highlights = [],
      activeHighlightId,
      onHighlightClick,
      placeholder = "Paste or type your text here…",
      className,
      disabled = false,
    },
    ref
  ) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number>(0);

    // ── Expose handle ──────────────────────────────────────────────────────
    useImperativeHandle(ref, () => ({
      focus: () => textareaRef.current?.focus(),
      blur: () => textareaRef.current?.blur(),
      getSelectionStart: () => textareaRef.current?.selectionStart ?? 0,
    }));

    // ── Scroll sync: textarea → backdrop ─────────────────────────────────
    const syncScroll = useCallback(() => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const ta = textareaRef.current;
        const bd = backdropRef.current;
        if (ta && bd) {
          bd.scrollTop = ta.scrollTop;
        }
      });
    }, []);

    useEffect(() => {
      const ta = textareaRef.current;
      if (!ta) return;
      ta.addEventListener("scroll", syncScroll, { passive: true });
      return () => {
        ta.removeEventListener("scroll", syncScroll);
        cancelAnimationFrame(rafRef.current);
      };
    }, [syncScroll]);

    // ── Sidebar highlight click → scroll editor to position ──────────────
    // (parent calls this via editorRef.scrollTo — we expose scroll as part of handle in v2)

    // ── Change handler ────────────────────────────────────────────────────
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newText = e.target.value;
        if (newText.length > CHAR_HARD_LIMIT) return; // hard block
        onChange(newText);
      },
      [onChange]
    );

    // ── Paste handler → immediate check trigger ───────────────────────────
    const handlePaste = useCallback(
      (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        // Let the default paste happen, then fire the callback
        // Use setTimeout to allow DOM to update first
        setTimeout(() => {
          const ta = textareaRef.current;
          if (ta) onChange(ta.value);
          onPaste?.();
        }, 0);
        // Suppress if pasted content would exceed limit
        const pastedText = e.clipboardData.getData("text");
        if (content.length + pastedText.length > CHAR_HARD_LIMIT) {
          e.preventDefault();
        }
      },
      [content, onChange, onPaste]
    );

    const hasHighlights = highlights.length > 0;

    // ── Char limit state ──────────────────────────────────────────────────
    const charCount = content.length;
    const isNearLimit = charCount >= CHAR_WARN_LIMIT;
    const isAtLimit = charCount >= CHAR_HARD_LIMIT;

    return (
      <div className={cn("relative flex flex-col overflow-hidden", className)}>
        {/* Char limit warning banner */}
        {isNearLimit && (
          <div
            className={cn(
              "flex-shrink-0 flex items-center gap-2 px-4 py-2 text-xs font-medium border-b",
              isAtLimit
                ? "bg-red-950/50 border-red-800 text-red-400"
                : "bg-amber-950/50 border-amber-800 text-amber-400"
            )}
            role="alert"
          >
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {isAtLimit
              ? `100,000 character limit reached. Remove text to continue.`
              : `Approaching the 100,000 character limit (${(CHAR_HARD_LIMIT - charCount).toLocaleString()} remaining).`}
          </div>
        )}

        {/* Editor area */}
        <div className="relative flex-1 overflow-hidden">
          {/* ── Layer 1 + 2: Backdrop with highlights ── */}
          {hasHighlights && (
            <div
              ref={backdropRef}
              aria-hidden
              className="absolute inset-0 overflow-auto pointer-events-none select-none"
              style={{
                zIndex: 10,
                scrollbarWidth: "none",
              }}
            >
              {/* Suppress backdrop scrollbar */}
              <style>{`.editor-backdrop::-webkit-scrollbar { display: none; }`}</style>
              <div
                className="text-slate-100"
                style={EDITOR_FONT_STYLE}
              >
                <HighlightOverlay
                  text={content}
                  highlights={highlights}
                  activeId={activeHighlightId ?? undefined}
                  onHighlightClick={onHighlightClick}
                />
              </div>
            </div>
          )}

          {/* ── Layer 3: Textarea (cursor + input) ── */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            onPaste={handlePaste}
            disabled={disabled}
            aria-label="Document editor"
            aria-multiline="true"
            placeholder={placeholder}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            className={cn(
              "absolute inset-0 w-full h-full resize-none outline-none",
              "bg-transparent placeholder:text-slate-600",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-colors duration-150"
            )}
            style={{
              ...EDITOR_FONT_STYLE,
              zIndex: 20,
              // Make text transparent when backdrop handles rendering
              color: hasHighlights ? "transparent" : "#f8fafc",
              caretColor: "#60a5fa",
              scrollbarWidth: "thin",
              scrollbarColor: "#334155 transparent",
            }}
          />

          {/* Placeholder overlay (textarea placeholder won't show through transparent text) */}
          {content === "" && hasHighlights === false && (
            <div
              aria-hidden
              className="absolute pointer-events-none select-none text-slate-600"
              style={{ ...EDITOR_FONT_STYLE, zIndex: 5, top: 0, left: 0 }}
            >
              {placeholder}
            </div>
          )}
        </div>

        {/* ── Char counter ── */}
        <CharCounter count={charCount} warnAt={CHAR_WARN_LIMIT} limitAt={CHAR_HARD_LIMIT} />
      </div>
    );
  }
);

TextEditor.displayName = "TextEditor";

// ─── CharCounter ─────────────────────────────────────────────────────────────

interface CharCounterProps {
  count: number;
  warnAt: number;
  limitAt: number;
}

function CharCounter({ count, warnAt, limitAt }: CharCounterProps) {
  const wordCount = count === 0 ? 0 : count; // approximate
  const pct = Math.min((count / limitAt) * 100, 100);

  return (
    <div className="flex-shrink-0 flex items-center gap-3 px-10 py-2.5 border-t border-slate-800 bg-slate-900">
      {/* Progress bar */}
      <div className="flex-1 h-0.5 rounded-full bg-slate-800 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300",
            pct >= 100
              ? "bg-red-500"
              : pct >= (warnAt / limitAt) * 100
              ? "bg-amber-500"
              : "bg-blue-600/50"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Counts */}
      <span
        className={cn(
          "text-xs tabular-nums transition-colors",
          count >= limitAt
            ? "text-red-400 font-medium"
            : count >= warnAt
            ? "text-amber-400"
            : "text-slate-600"
        )}
      >
        {count.toLocaleString()}&thinsp;/&thinsp;{limitAt.toLocaleString()} chars
      </span>

      <span className="text-xs text-slate-700">·</span>

      <span className="text-xs text-slate-600 tabular-nums">
        {wordCount === 0
          ? "0 words"
          : `~${Math.round(wordCount / 5).toLocaleString()} words`}
      </span>
    </div>
  );
}
