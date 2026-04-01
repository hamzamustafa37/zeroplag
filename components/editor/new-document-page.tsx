"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { TextEditor } from "./text-editor";
import { Button } from "@/components/ui/button";
import { useGrammarStream } from "@/hooks/use-grammar-stream";
import { usePlagiarismCheck } from "@/hooks/use-plagiarism-check";
import { useDebounce } from "@/hooks/use-debounce";
import { GrammarSidebar } from "@/components/grammar/grammar-sidebar";
import { SimilaritySidebar } from "@/components/plagiarism/similarity-sidebar";
import { useCreateDocument } from "@/hooks/use-document";
import type { GrammarError } from "@/lib/ai/grammar";
import type { PlagiarismResult } from "@/lib/ai/plagiarism";

type Mode = "grammar" | "plagiarism";

export default function NewDocumentPage() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("Untitled");
  const [mode, setMode] = useState<Mode>("grammar");

  const [grammarErrors, setGrammarErrors] = useState<GrammarError[]>([]);
  const [isGrammarChecking, setIsGrammarChecking] = useState(false);

  const [plagiarismResult, setPlagiarismResult] = useState<PlagiarismResult | null>(null);
  const [isPlagiarismChecking, setIsPlagiarismChecking] = useState(false);

  const debouncedContent = useDebounce(content, 500);
  const grammarStream = useGrammarStream();
  const plagiarismFetch = usePlagiarismCheck();
  const createDoc = useCreateDocument();

  const handleGrammarCheck = useCallback(async (text?: string) => {
    const checkText = text ?? debouncedContent;
    if (!checkText.trim()) return;
    setGrammarErrors([]);
    setIsGrammarChecking(true);
    await grammarStream.check(checkText, undefined, {
      onError2: (err) => setGrammarErrors((prev) => [...prev, err]),
      onComplete: () => setIsGrammarChecking(false),
      onError: () => setIsGrammarChecking(false),
    });
  }, [debouncedContent, grammarStream]);

  const handlePlagiarismCheck = useCallback(async () => {
    if (!content.trim()) return;
    setIsPlagiarismChecking(true);
    setPlagiarismResult(null);
    try {
      const result = await plagiarismFetch.check(content);
      setPlagiarismResult(result);
    } finally {
      setIsPlagiarismChecking(false);
    }
  }, [content, plagiarismFetch]);

  const handleSave = async () => {
    const result = await createDoc.mutateAsync({ title, content });
    if (result?.document?.id) {
      router.push(`/editor?id=${result.document.id}`);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Toolbar */}
      <header className="h-14 flex items-center gap-3 px-4 border-b border-slate-800 flex-shrink-0">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-transparent text-slate-50 font-medium text-sm outline-none flex-1 min-w-0"
          placeholder="Document title"
          aria-label="Document title"
        />
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={mode === "grammar" ? "primary" : "ghost"}
            onClick={() => { setMode("grammar"); handleGrammarCheck(); }}
            loading={isGrammarChecking}
          >
            Grammar
          </Button>
          <Button
            size="sm"
            variant={mode === "plagiarism" ? "primary" : "ghost"}
            onClick={() => { setMode("plagiarism"); handlePlagiarismCheck(); }}
            loading={isPlagiarismChecking}
          >
            Plagiarism
          </Button>
          <Button size="sm" variant="secondary" onClick={handleSave} loading={createDoc.isPending}>
            Save
          </Button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Editor — 70% */}
        <TextEditor
          content={content}
          onChange={setContent}
          className="flex-[7] min-w-0"
        />

        {/* Sidebar — 30% */}
        <aside className="flex-[3] min-w-56 max-w-80 overflow-hidden flex flex-col border-l border-slate-800 bg-slate-900">
          {mode === "grammar" && (
            <GrammarSidebar
              errors={grammarErrors}
              isChecking={isGrammarChecking}
            />
          )}
          {mode === "plagiarism" && (
            <SimilaritySidebar
              matches={plagiarismResult?.matches ?? []}
              score={plagiarismResult?.score}
              isChecking={isPlagiarismChecking}
            />
          )}
        </aside>
      </div>
    </div>
  );
}
