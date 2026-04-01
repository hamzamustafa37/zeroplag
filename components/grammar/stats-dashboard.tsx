"use client";

import { cn } from "@/lib/utils";
import type { GrammarError } from "@/lib/ai/grammar";

interface StatsDashboardProps {
  errors: GrammarError[];
  className?: string;
}

interface StatItem {
  label: string;
  value: number;
  color: string;
}

export function StatsDashboard({ errors, className }: StatsDashboardProps) {
  const stats: StatItem[] = [
    {
      label: "Errors",
      value: errors.filter((e) => e.severity === "error").length,
      color: "text-red-400",
    },
    {
      label: "Warnings",
      value: errors.filter((e) => e.severity === "warning").length,
      color: "text-amber-400",
    },
    {
      label: "Suggestions",
      value: errors.filter((e) => e.severity === "info").length,
      color: "text-blue-400",
    },
  ];

  return (
    <div className={cn("grid grid-cols-3 gap-3", className)}>
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center gap-1 rounded-lg bg-slate-800 border border-slate-700 p-3"
        >
          <span className={cn("text-2xl font-bold tabular-nums", stat.color)}>
            {stat.value}
          </span>
          <span className="text-xs text-slate-500">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
