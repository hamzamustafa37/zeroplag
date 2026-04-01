import type { Metadata } from "next";
import { Suspense } from "react";
import { EditorLoader } from "@/components/editor/editor-loader";

export const metadata: Metadata = {
  title: "Editor",
};

export default function EditorPage() {
  return (
    // Suspense boundary needed for useSearchParams in EditorLoader
    <Suspense fallback={<EditorSkeleton />}>
      <EditorLoader />
    </Suspense>
  );
}

function EditorSkeleton() {
  return (
    <div className="flex flex-col h-full animate-pulse">
      <div className="h-14 border-b border-slate-800 bg-slate-900" />
      <div className="flex flex-1">
        <div className="flex-[7] bg-slate-900" />
        <div className="flex-[3] border-l border-slate-800 bg-slate-900" />
      </div>
    </div>
  );
}
