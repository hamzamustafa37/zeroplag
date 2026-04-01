"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useDocuments } from "@/hooks/use-document";
import { cn } from "@/lib/utils";

interface CheckBadge {
  type: string;
  status: string;
  score: number | null;
}

interface DocumentItem {
  id: string;
  title: string;
  createdAt: string;
  checks: CheckBadge[];
}

export function DocumentsList() {
  const { data, isLoading, error, refetch } = useDocuments();
  const documents = (data?.documents as unknown as DocumentItem[]) ?? [];

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="flex-shrink-0 flex items-center justify-between px-6 py-5 border-b border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-50">Documents</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {isLoading ? "Loading…" : `${documents.length} document${documents.length !== 1 ? "s" : ""}`}
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/editor">+ New document</Link>
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {error && (
          <div className="rounded-xl bg-red-950/40 border border-red-800 p-4 text-sm text-red-400 flex items-center gap-3">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Failed to load documents.{" "}
            <button onClick={() => refetch()} className="underline hover:no-underline">
              Retry
            </button>
          </div>
        )}

        {/* Loading skeletons */}
        {isLoading && (
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-xl bg-slate-800 border border-slate-700 p-4 space-y-3">
                <Skeleton className="h-4 w-48" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && documents.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-base font-semibold text-slate-300 mb-1">No documents yet</h2>
            <p className="text-sm text-slate-500 mb-6 max-w-xs">
              Create your first document to start checking for plagiarism and grammar issues.
            </p>
            <Button asChild>
              <Link href="/editor">Create document</Link>
            </Button>
          </div>
        )}

        {/* Document list */}
        {!isLoading && documents.length > 0 && (
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {documents.map((doc, i) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                >
                  <DocumentRow doc={doc} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

function DocumentRow({ doc }: { doc: DocumentItem }) {
  const latestCheck = doc.checks[0] ?? null;
  const date = new Date(doc.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`/editor?id=${doc.id}`}
      className="group flex items-center gap-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-500 p-4 transition-colors"
    >
      {/* Doc icon */}
      <div className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0 group-hover:bg-slate-600 transition-colors">
        <svg className="w-4.5 h-4.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>

      {/* Title + date */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-200 truncate group-hover:text-slate-50 transition-colors">
          {doc.title || "Untitled"}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">{date}</p>
      </div>

      {/* Check badges */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {latestCheck && latestCheck.score !== null && (
          <ScoreBadge type={latestCheck.type} score={latestCheck.score} />
        )}
        {!latestCheck && (
          <span className="text-xs text-slate-600 italic">No checks</span>
        )}
      </div>

      {/* Arrow */}
      <svg className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

function ScoreBadge({ type, score }: { type: string; score: number }) {
  const isGrammar = type === "GRAMMAR";
  const label = isGrammar
    ? `${score.toFixed(0)} grammar`
    : `${score.toFixed(0)}% original`;
  const color =
    score >= 80
      ? "bg-green-500/15 text-green-400 border-green-500/20"
      : score >= 60
      ? "bg-amber-500/15 text-amber-400 border-amber-500/20"
      : "bg-red-500/15 text-red-400 border-red-500/20";

  return (
    <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium", color)}>
      {label}
    </span>
  );
}

