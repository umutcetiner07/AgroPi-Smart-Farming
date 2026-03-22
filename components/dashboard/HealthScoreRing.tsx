"use client";

import { GraduationCap } from "lucide-react";

const R = 44;
const C = 2 * Math.PI * R;

type HealthScoreRingProps = {
  score: number;
};

export function HealthScoreRing({ score }: HealthScoreRingProps) {
  const pct = Math.min(Math.max(score / 100, 0), 1);
  const dash = C * pct;

  return (
    <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
      <GraduationCap
        className="absolute -top-1 left-1/2 h-5 w-5 -translate-x-1/2 text-agropi-amber"
        aria-hidden
      />
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r={R}
          fill="none"
          strokeWidth="8"
          className="stroke-white/20"
        />
        <circle
          cx="50"
          cy="50"
          r={R}
          fill="none"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${C}`}
          className="stroke-agropi-amber drop-shadow-sm"
          style={{ transition: "stroke-dasharray 0.8s ease" }}
        />
      </svg>
      <span className="absolute text-3xl font-bold text-white">{score}</span>
    </div>
  );
}
