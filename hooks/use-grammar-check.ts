"use client";

import { useCallback, useReducer, useRef } from "react";
import type { GrammarError, GrammarEvent } from "@/lib/ai/grammar";

interface GrammarState {
  errors: GrammarError[];
  isChecking: boolean;
  isDone: boolean;
  error: string | null;
}

type GrammarAction =
  | { type: "START" }
  | { type: "ADD_ERROR"; error: GrammarError }
  | { type: "COMPLETE"; total: number }
  | { type: "SET_ERROR"; message: string }
  | { type: "RESET" };

function grammarReducer(state: GrammarState, action: GrammarAction): GrammarState {
  switch (action.type) {
    case "START":
      return { errors: [], isChecking: true, isDone: false, error: null };
    case "ADD_ERROR":
      return { ...state, errors: [...state.errors, action.error] };
    case "COMPLETE":
      return { ...state, isChecking: false, isDone: true };
    case "SET_ERROR":
      return { ...state, isChecking: false, error: action.message };
    case "RESET":
      return { errors: [], isChecking: false, isDone: false, error: null };
    default:
      return state;
  }
}

const initialState: GrammarState = {
  errors: [],
  isChecking: false,
  isDone: false,
  error: null,
};

export function useGrammarCheck() {
  const [state, dispatch] = useReducer(grammarReducer, initialState);
  const abortRef = useRef<AbortController | null>(null);

  const check = useCallback(async (text: string, documentId?: string) => {
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    dispatch({ type: "START" });

    try {
      const response = await fetch("/api/check/grammar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, documentId, stream: true }),
        signal: abortRef.current.signal,
      });

      if (!response.ok) throw new Error("Grammar check failed");
      if (!response.body) throw new Error("No response body");

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
          const data = line.slice(6).trim();
          if (data === "[DONE]") break;

          try {
            const event = JSON.parse(data) as GrammarEvent;
            if (event.type === "suggestion" && event.data) {
              dispatch({ type: "ADD_ERROR", error: event.data });
            } else if (event.type === "complete") {
              dispatch({ type: "COMPLETE", total: event.totalErrors ?? 0 });
            } else if (event.type === "error") {
              dispatch({ type: "SET_ERROR", message: event.error ?? "Unknown error" });
            }
          } catch {
            // Skip malformed SSE events
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        dispatch({ type: "SET_ERROR", message: (err as Error).message });
      }
    }
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    dispatch({ type: "RESET" });
  }, []);

  return { ...state, check, reset };
}
