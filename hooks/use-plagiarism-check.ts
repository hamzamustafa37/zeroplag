"use client";

import { useCallback, useRef } from "react";
import type { PlagiarismResult } from "@/lib/ai/plagiarism";

/** Fetches a plagiarism check and returns the result. No internal state — store manages it. */
export function usePlagiarismCheck() {
  const abortRef = useRef<AbortController | null>(null);

  const check = useCallback(
    async (
      text: string,
      documentId?: string,
      options?: { sources?: string[] }
    ): Promise<PlagiarismResult | null> => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      try {
        const response = await fetch("/api/check/plagiarism", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, documentId, sources: options?.sources ?? ["web"] }),
          signal: abortRef.current.signal,
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data?.error ?? "Plagiarism check failed");
        return data as PlagiarismResult;
      } catch (err) {
        if ((err as Error).name === "AbortError") return null;
        throw err;
      }
    },
    []
  );

  const abort = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { check, abort };
}
