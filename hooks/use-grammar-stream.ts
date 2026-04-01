"use client";

import { useCallback, useRef } from "react";
import type { GrammarError, GrammarEvent } from "@/lib/ai/grammar";

interface GrammarStreamCallbacks {
  onError: (message: string) => void;
  onComplete: () => void;
  /** Called for each grammar error/suggestion found */
  onError2: (error: GrammarError) => void;
}

/** Streams grammar check results via SSE, dispatching each error via callback. */
export function useGrammarStream() {
  const abortRef = useRef<AbortController | null>(null);

  const check = useCallback(
    async (
      text: string,
      documentId: string | undefined,
      callbacks: GrammarStreamCallbacks
    ) => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      try {
        const response = await fetch("/api/check/grammar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, documentId, stream: true }),
          signal: abortRef.current.signal,
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          callbacks.onError(data?.error ?? "Grammar check failed");
          return;
        }

        if (!response.body) {
          callbacks.onError("No response stream");
          return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const raw = line.slice(6).trim();
            if (raw === "[DONE]") {
              callbacks.onComplete();
              return;
            }

            try {
              const event = JSON.parse(raw) as GrammarEvent;
              if (event.type === "suggestion" && event.data) {
                callbacks.onError2(event.data);
              } else if (event.type === "complete") {
                callbacks.onComplete();
                return;
              } else if (event.type === "error") {
                callbacks.onError(event.error ?? "Unknown error");
                return;
              }
            } catch {
              // Skip malformed events
            }
          }
        }

        callbacks.onComplete();
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          callbacks.onError((err as Error).message ?? "Request failed");
        }
      }
    },
    []
  );

  const abort = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return { check, abort };
}
