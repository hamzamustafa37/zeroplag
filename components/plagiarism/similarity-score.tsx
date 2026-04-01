"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SimilarityScoreProps {
  score: number; // 0-100 originality score
  size?: number;
  className?: string;
}

export function SimilarityScore({ score, size = 80, className }: SimilarityScoreProps) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const color =
    score >= 80
      ? "#22c55e" // green
      : score >= 60
      ? "#f59e0b" // amber
      : "#ef4444"; // red

  const label =
    score >= 80 ? "Original" : score >= 60 ? "Review" : "High Risk";

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#1e293b"
            strokeWidth={8}
          />
          {/* Score ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-slate-50" style={{ color }}>
            {score}
          </span>
        </div>
      </div>
      <span className="text-xs font-medium" style={{ color }}>
        {label}
      </span>
    </div>
  );
}
