"use client";

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { GrammarError } from "@/lib/ai/grammar";
import type { PlagiarismResult } from "@/lib/ai/plagiarism";
import type { HighlightRange } from "@/components/editor/highlight-overlay";

export type CheckMode = "grammar" | "plagiarism";

// ─── State shape ─────────────────────────────────────────────────────────────

interface EditorState {
  // Document
  content: string;
  title: string;
  documentId: string | null;
  isDirty: boolean;
  isSaving: boolean;

  // Mode
  mode: CheckMode;

  // Grammar
  grammarErrors: GrammarError[];
  ignoredErrorKeys: Set<string>; // `${original}:${start}`
  isGrammarChecking: boolean;
  isGrammarDone: boolean;

  // Plagiarism
  plagiarismResult: PlagiarismResult | null;
  isPlagiarismChecking: boolean;

  // UI
  activeHighlightId: string | null;
}

// ─── Actions ─────────────────────────────────────────────────────────────────

interface EditorActions {
  // Content
  setContent: (content: string) => void;
  setTitle: (title: string) => void;
  setDocumentId: (id: string | null) => void;
  loadDocument: (doc: { id: string; title: string; content: string }) => void;
  markSaved: () => void;
  setIsSaving: (saving: boolean) => void;

  // Mode
  setMode: (mode: CheckMode) => void;

  // Grammar
  startGrammarCheck: () => void;
  addGrammarError: (error: GrammarError) => void;
  finishGrammarCheck: () => void;
  ignoreError: (key: string) => void;
  acceptError: (error: GrammarError) => void;
  clearGrammarErrors: () => void;

  // Plagiarism
  startPlagiarismCheck: () => void;
  setPlagiarismResult: (result: PlagiarismResult) => void;
  failPlagiarismCheck: () => void;
  clearPlagiarismResult: () => void;

  // Highlights
  setActiveHighlight: (id: string | null) => void;
  getHighlights: () => HighlightRange[];

  // Reset
  reset: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function errorKey(error: GrammarError): string {
  return `${error.original}:${error.position.start}`;
}

function grammarErrorsToHighlights(
  errors: GrammarError[],
  ignored: Set<string>
): HighlightRange[] {
  return errors
    .filter((e) => !ignored.has(errorKey(e)))
    .map((e) => ({
      id: errorKey(e),
      start: e.position.start,
      end: e.position.end,
      type:
        e.severity === "error"
          ? "grammar-error"
          : e.severity === "warning"
          ? "grammar-warning"
          : "grammar-suggestion",
      label: e.explanation,
    }));
}

function plagiarismToHighlights(result: PlagiarismResult): HighlightRange[] {
  return result.suspiciousSegments.map((seg, i) => ({
    id: `plag-${i}`,
    start: seg.position.start,
    end: seg.position.end,
    type: "plagiarism" as const,
    label: seg.reason,
  }));
}

// ─── Default state ────────────────────────────────────────────────────────────

const defaultState: EditorState = {
  content: "",
  title: "Untitled",
  documentId: null,
  isDirty: false,
  isSaving: false,
  mode: "grammar",
  grammarErrors: [],
  ignoredErrorKeys: new Set(),
  isGrammarChecking: false,
  isGrammarDone: false,
  plagiarismResult: null,
  isPlagiarismChecking: false,
  activeHighlightId: null,
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useEditorStore = create<EditorState & EditorActions>()(
  subscribeWithSelector((set, get) => ({
    ...defaultState,

    // ── Content ─────────────────────────────────────────────────────────────
    setContent: (content) =>
      set({ content, isDirty: true }),

    setTitle: (title) =>
      set({ title, isDirty: true }),

    setDocumentId: (documentId) =>
      set({ documentId }),

    loadDocument: (doc) =>
      set({
        documentId: doc.id,
        title: doc.title,
        content: doc.content,
        isDirty: false,
        grammarErrors: [],
        ignoredErrorKeys: new Set(),
        isGrammarDone: false,
        plagiarismResult: null,
      }),

    markSaved: () =>
      set({ isDirty: false, isSaving: false }),

    setIsSaving: (isSaving) =>
      set({ isSaving }),

    // ── Mode ────────────────────────────────────────────────────────────────
    setMode: (mode) =>
      set({ mode }),

    // ── Grammar ─────────────────────────────────────────────────────────────
    startGrammarCheck: () =>
      set({
        isGrammarChecking: true,
        isGrammarDone: false,
        grammarErrors: [],
        ignoredErrorKeys: new Set(),
      }),

    addGrammarError: (error) =>
      set((s) => ({ grammarErrors: [...s.grammarErrors, error] })),

    finishGrammarCheck: () =>
      set({ isGrammarChecking: false, isGrammarDone: true }),

    ignoreError: (key) =>
      set((s) => {
        const next = new Set(s.ignoredErrorKeys);
        next.add(key);
        return { ignoredErrorKeys: next };
      }),

    acceptError: (error) => {
      const { content, setContent } = get();
      const { start, end } = error.position;
      const next =
        content.slice(0, start) + error.suggestion + content.slice(end);
      setContent(next);
      // Remove from errors list
      set((s) => ({
        grammarErrors: s.grammarErrors.filter(
          (e) => errorKey(e) !== errorKey(error)
        ),
      }));
    },

    clearGrammarErrors: () =>
      set({
        grammarErrors: [],
        ignoredErrorKeys: new Set(),
        isGrammarDone: false,
      }),

    // ── Plagiarism ───────────────────────────────────────────────────────────
    startPlagiarismCheck: () =>
      set({ isPlagiarismChecking: true, plagiarismResult: null }),

    setPlagiarismResult: (plagiarismResult) =>
      set({ plagiarismResult, isPlagiarismChecking: false }),

    failPlagiarismCheck: () =>
      set({ isPlagiarismChecking: false }),

    clearPlagiarismResult: () =>
      set({ plagiarismResult: null }),

    // ── Highlights ───────────────────────────────────────────────────────────
    setActiveHighlight: (activeHighlightId) =>
      set({ activeHighlightId }),

    getHighlights: () => {
      const { mode, grammarErrors, ignoredErrorKeys, plagiarismResult } = get();
      if (mode === "grammar") {
        return grammarErrorsToHighlights(grammarErrors, ignoredErrorKeys);
      }
      if (plagiarismResult) {
        return plagiarismToHighlights(plagiarismResult);
      }
      return [];
    },

    // ── Reset ────────────────────────────────────────────────────────────────
    reset: () =>
      set({ ...defaultState, ignoredErrorKeys: new Set() }),
  }))
);

// ─── Selectors ────────────────────────────────────────────────────────────────

export const selectHighlights = (s: EditorState & EditorActions) =>
  s.getHighlights();

export const selectGrammarStats = (s: EditorState) => ({
  total: s.grammarErrors.length,
  errors: s.grammarErrors.filter((e) => e.severity === "error").length,
  warnings: s.grammarErrors.filter((e) => e.severity === "warning").length,
  suggestions: s.grammarErrors.filter((e) => e.severity === "info").length,
});

export const selectVisibleErrors = (s: EditorState) =>
  s.grammarErrors.filter(
    (e) => !s.ignoredErrorKeys.has(`${e.original}:${e.position.start}`)
  );

export const CHAR_WARN_LIMIT = 80_000;
export const CHAR_HARD_LIMIT = 100_000;
