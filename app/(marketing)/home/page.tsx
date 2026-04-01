import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ZeroPlag — AI Plagiarism & Grammar Checker",
  description:
    "Detect plagiarism and fix grammar with AI. 200K character support, real-time streaming, and academic database coverage.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      {/* Hero */}
      <div className="max-w-3xl mx-auto text-center space-y-6">
        <h1 className="text-5xl font-bold tracking-tight text-slate-50">
          Write without fear.
        </h1>
        <p className="text-xl text-slate-400 max-w-xl mx-auto leading-relaxed">
          AI-powered plagiarism detection and grammar checking. Real-time
          analysis, inline highlights, and actionable suggestions.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
          >
            Start checking →
          </Link>
          <Link
            href="/home#features"
            className="inline-flex items-center px-6 py-3 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-slate-50 font-medium transition-colors"
          >
            See how it works
          </Link>
        </div>
      </div>

      {/* Feature grid */}
      <div
        id="features"
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-24 px-4"
      >
        {features.map((f) => (
          <div
            key={f.title}
            className="p-6 rounded-xl bg-slate-800 border border-slate-700 space-y-3"
          >
            <div className="text-2xl">{f.icon}</div>
            <h3 className="font-semibold text-slate-50">{f.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const features = [
  {
    icon: "🔍",
    title: "Plagiarism Detection",
    desc: "Compare against web sources, academic databases, and internal documents. Similarity scored 0–100%.",
  },
  {
    icon: "✏️",
    title: "Grammar Checking",
    desc: "Streaming AI grammar analysis with inline underlines, hover cards, and one-click fixes.",
  },
  {
    icon: "⚡",
    title: "Real-time & Fast",
    desc: "500ms debounce, parallel processing, Redis-cached results. Supports documents up to 200K characters.",
  },
];
