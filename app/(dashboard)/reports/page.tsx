import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reports",
};

export default function ReportsPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-5 border-b border-slate-800">
        <h1 className="text-xl font-bold text-slate-50">Reports</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Aggregate analysis across all your documents.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total documents" value="—" />
          <StatCard label="Checks run" value="—" />
          <StatCard label="Avg originality" value="—" />
        </div>

        {/* Coming soon */}
        <div className="rounded-xl bg-slate-800 border border-slate-700 border-dashed p-10 text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-slate-400">Detailed reports coming soon</p>
          <p className="text-xs text-slate-600 mt-1">
            Historical trends, per-document analysis, and export to PDF.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-800 border border-slate-700 p-5">
      <p className="text-xs text-slate-500 uppercase tracking-wide font-medium mb-2">{label}</p>
      <p className="text-3xl font-bold text-slate-200 tabular-nums">{value}</p>
    </div>
  );
}
