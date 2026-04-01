"use client";

import { useRef, useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { TextEditor, type TextEditorHandle } from "./text-editor";
import { EditorToolbar } from "./editor-toolbar";
import { GrammarSidebar } from "@/components/grammar/grammar-sidebar";
import { SimilaritySidebar } from "@/components/plagiarism/similarity-sidebar";
import { SuggestionPopup } from "./suggestion-popup";
import {
  useEditorStore,
  CHAR_HARD_LIMIT,
} from "@/lib/store/editor-store";
import { useGrammarStream } from "@/hooks/use-grammar-stream";
import { usePlagiarismCheck } from "@/hooks/use-plagiarism-check";
import { useDebounce } from "@/hooks/use-debounce";
import { useCreateDocument, useUpdateDocument } from "@/hooks/use-document";
import type { GrammarError } from "@/lib/ai/grammar";
import type { HighlightRange } from "./highlight-overlay";

export function EditorView() {
  const router = useRouter();
  const editorRef = useRef<TextEditorHandle>(null);

  // Store slices
  const content = useEditorStore((s) => s.content);
  const title = useEditorStore((s) => s.title);
  const documentId = useEditorStore((s) => s.documentId);
  const isDirty = useEditorStore((s) => s.isDirty);
  const mode = useEditorStore((s) => s.mode);
  const isGrammarChecking = useEditorStore((s) => s.isGrammarChecking);
  const isPlagiarismChecking = useEditorStore((s) => s.isPlagiarismChecking);
  const plagiarismResult = useEditorStore((s) => s.plagiarismResult);
  const activeHighlightId = useEditorStore((s) => s.activeHighlightId);
  const grammarErrors = useEditorStore((s) => s.grammarErrors);
  const ignoredErrorKeys = useEditorStore((s) => s.ignoredErrorKeys);

  const visibleErrors = useMemo(
    () => grammarErrors.filter(
      (e) => !ignoredErrorKeys.has(`${e.original}:${e.position.start}`)
    ),
    [grammarErrors, ignoredErrorKeys]
  );

  const highlights = useMemo(
    () => useEditorStore.getState().getHighlights(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode, grammarErrors, ignoredErrorKeys, plagiarismResult]
  );

  // Actions
  const setContent = useEditorStore((s) => s.setContent);
  const setMode = useEditorStore((s) => s.setMode);
  const setActiveHighlight = useEditorStore((s) => s.setActiveHighlight);
  const startGrammarCheck = useEditorStore((s) => s.startGrammarCheck);
  const addGrammarError = useEditorStore((s) => s.addGrammarError);
  const finishGrammarCheck = useEditorStore((s) => s.finishGrammarCheck);
  const acceptError = useEditorStore((s) => s.acceptError);
  const ignoreError = useEditorStore((s) => s.ignoreError);
  const startPlagiarismCheck = useEditorStore((s) => s.startPlagiarismCheck);
  const setPlagiarismResult = useEditorStore((s) => s.setPlagiarismResult);
  const failPlagiarismCheck = useEditorStore((s) => s.failPlagiarismCheck);
  const setDocumentId = useEditorStore((s) => s.setDocumentId);
  const markSaved = useEditorStore((s) => s.markSaved);
  const setIsSaving = useEditorStore((s) => s.setIsSaving);

  // Services
  const grammarStream = useGrammarStream();
  const plagiarismFetch = usePlagiarismCheck();
  const createDoc = useCreateDocument();
  const updateDoc = useUpdateDocument(documentId ?? "");

  const debouncedContent = useDebounce(content, 500);

  // ── Auto grammar check on debounce ──────────────────────────────────────
  useEffect(() => {
    if (!debouncedContent.trim() || mode !== "grammar") return;
    if (debouncedContent.length > CHAR_HARD_LIMIT) return;
    triggerGrammarCheck(debouncedContent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedContent]);

  // ── Grammar check ────────────────────────────────────────────────────────
  const triggerGrammarCheck = useCallback(
    async (text: string = content) => {
      if (!text.trim()) return;
      startGrammarCheck();
      await grammarStream.check(text, documentId ?? undefined, {
        onError2: addGrammarError,
        onComplete: finishGrammarCheck,
        onError: (msg) => {
          console.error("Grammar stream error:", msg);
          finishGrammarCheck();
        },
      });
    },
    [content, documentId, grammarStream, startGrammarCheck, addGrammarError, finishGrammarCheck]
  );

  // ── Plagiarism check ─────────────────────────────────────────────────────
  const triggerPlagiarismCheck = useCallback(async () => {
    if (!content.trim()) return;
    startPlagiarismCheck();
    try {
      const result = await plagiarismFetch.check(content, documentId ?? undefined);
      if (result) setPlagiarismResult(result);
      else failPlagiarismCheck();
    } catch {
      failPlagiarismCheck();
    }
  }, [
    content,
    documentId,
    plagiarismFetch,
    startPlagiarismCheck,
    setPlagiarismResult,
    failPlagiarismCheck,
  ]);

  // ── Paste → immediate check ───────────────────────────────────────────────
  const handlePaste = useCallback(() => {
    if (mode === "grammar") {
      // Content will update via onChange first, then we trigger
      setTimeout(() => {
        const latest = useEditorStore.getState().content;
        if (latest.trim()) triggerGrammarCheck(latest);
      }, 50);
    }
  }, [mode, triggerGrammarCheck]);

  // ── Mode switch ───────────────────────────────────────────────────────────
  const handleModeSwitch = useCallback(
    (newMode: typeof mode) => {
      setMode(newMode);
      if (newMode === "grammar") triggerGrammarCheck();
      else triggerPlagiarismCheck();
    },
    [setMode, triggerGrammarCheck, triggerPlagiarismCheck]
  );

  // ── Grammar accept/ignore ─────────────────────────────────────────────────
  const handleAccept = useCallback(
    (error: GrammarError) => acceptError(error),
    [acceptError]
  );

  const handleIgnore = useCallback(
    (error: GrammarError) => ignoreError(`${error.original}:${error.position.start}`),
    [ignoreError]
  );

  // ── Highlight click ───────────────────────────────────────────────────────
  const handleHighlightClick = useCallback(
    (hl: HighlightRange) => {
      setActiveHighlight(hl.id === activeHighlightId ? null : hl.id);
    },
    [setActiveHighlight, activeHighlightId]
  );

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (!isDirty) return;
    setIsSaving(true);
    try {
      if (documentId) {
        await updateDoc.mutateAsync({ title, content });
      } else {
        const result = await createDoc.mutateAsync({ title, content });
        const newId = result?.document?.id;
        if (newId) {
          setDocumentId(newId);
          router.replace(`/editor?id=${newId}`, { scroll: false });
        }
      }
      markSaved();
    } catch (err) {
      console.error("Save failed:", err);
      setIsSaving(false);
    }
  }, [
    isDirty,
    documentId,
    title,
    content,
    updateDoc,
    createDoc,
    setDocumentId,
    setIsSaving,
    markSaved,
    router,
  ]);

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key === "s") { e.preventDefault(); handleSave(); }
      if (isMod && e.shiftKey && e.key === "K") { e.preventDefault(); triggerGrammarCheck(); }
      if (isMod && e.shiftKey && e.key === "P") { e.preventDefault(); setMode("plagiarism"); triggerPlagiarismCheck(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleSave, triggerGrammarCheck, setMode, triggerPlagiarismCheck]);

  // ── Active suggestion popup ───────────────────────────────────────────────
  const activeError =
    mode === "grammar" && activeHighlightId
      ? (grammarErrors.find(
          (e) => `${e.original}:${e.position.start}` === activeHighlightId
        ) ?? null)
      : null;

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden">
      {/* Toolbar */}
      <EditorToolbar
        onGrammarCheck={() => triggerGrammarCheck()}
        onPlagiarismCheck={triggerPlagiarismCheck}
        onSave={handleSave}
      />

      {/* Body: editor + sidebar */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Editor — 70% */}
        <TextEditor
          ref={editorRef}
          content={content}
          onChange={setContent}
          onPaste={handlePaste}
          highlights={highlights}
          activeHighlightId={activeHighlightId}
          onHighlightClick={handleHighlightClick}
          className="flex-[7] min-w-0"
        />

        {/* Sidebar — 30% */}
        <aside
          className="hidden sm:flex flex-[3] min-w-56 max-w-sm border-l border-slate-800 flex-col bg-slate-900 overflow-hidden"
          aria-label="Check results"
        >
          {mode === "grammar" ? (
            <GrammarSidebar
              errors={visibleErrors}
              isChecking={isGrammarChecking}
              onAccept={handleAccept}
              onIgnore={handleIgnore}
            />
          ) : (
            <SimilaritySidebar
              matches={plagiarismResult?.matches ?? []}
              score={plagiarismResult?.score}
              isChecking={isPlagiarismChecking}
            />
          )}
        </aside>
      </div>

      {/* Grammar suggestion popup */}
      <SuggestionPopup
        suggestion={activeError}
        position={activeError ? { x: 200, y: 200 } : null}
        onAccept={handleAccept}
        onIgnore={handleIgnore}
        onClose={() => setActiveHighlight(null)}
      />
    </div>
  );
}
