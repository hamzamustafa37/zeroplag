"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { EditorView } from "./editor-view";
import { useEditorStore } from "@/lib/store/editor-store";

/**
 * Reads ?id= from URL and loads the document into the Zustand store,
 * then renders the editor.
 */
export function EditorLoader() {
  const searchParams = useSearchParams();
  const docId = searchParams.get("id");

  const loadDocument = useEditorStore((s) => s.loadDocument);
  const reset = useEditorStore((s) => s.reset);
  const documentId = useEditorStore((s) => s.documentId);

  useEffect(() => {
    if (!docId) {
      // New document — reset store
      reset();
      return;
    }

    // Load document from API if not already loaded
    if (documentId === docId) return;

    fetch(`/api/documents/${docId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.document) {
          loadDocument({
            id: data.document.id,
            title: data.document.title,
            content: data.document.content,
          });
        }
      })
      .catch(console.error);
  }, [docId, documentId, loadDocument, reset]);

  return <EditorView />;
}
