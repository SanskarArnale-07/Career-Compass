"use client";

import {
  BookOpen,
  CheckCircle2,
  FolderKanban,
  Target,
} from "lucide-react";
import type { CareerReadinessResult } from "@/lib/career-details/roadmap-intelligence";

interface CareerReadinessMeterProps {
  readiness: CareerReadinessResult;
  activeCareerTitle: string;
}

const PILLAR_ICONS = {
  foundations: BookOpen,
  skills: CheckCircle2,
  portfolio: FolderKanban,
};

export default function CareerReadinessMeter({
  readiness,
  activeCareerTitle,
}: CareerReadinessMeterProps) {
  const { overallScore, tierLevel, tierName, tierDescription, nextTierRequirement, pillars } =
    readiness;

  // Level badge styling
  const levelColors: Record<number, { bg: string; text: string; border: string }> = {
    1: { bg: "bg-blue-500/15", text: "text-blue-400", border: "border-blue-500/30" },
    2: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30" },
    3: { bg: "bg-purple-500/15", text: "text-purple-400", border: "border-purple-500/30" },
    4: { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/30" },
  };

  const levelStyle = levelColors[tierLevel] || levelColors[1];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 space-y-6">
      {/* Header: Score + Tier */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border/70">
        <div className="flex items-center gap-4">
          {/* Radial score gauge */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                strokeWidth="7"
                className="text-[#0F172A]"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#readinessGrad)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${2 * Math.PI * 42 * (1 - overallScore / 100)}`}
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="readinessGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-heading text-lg sm:text-xl font-bold text-foreground">
                {overallScore}%
              </span>
              <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">
                Ready
              </span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                Career Readiness Index
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${levelStyle.bg} ${levelStyle.text} ${levelStyle.border}`}
              >
                Level {tierLevel}: {tierName}
              </span>
            </div>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
              {activeCareerTitle} Readiness
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 max-w-md">
              {tierDescription}
            </p>
          </div>
        </div>

        {/* Next Unlock Requirement */}
        <div className="sm:max-w-xs p-3 rounded-xl bg-[#0F172A] border border-border/80">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary mb-1">
            <Target className="h-3.5 w-3.5" />
            <span>Next Level Target</span>
          </div>
          <p className="text-xs text-foreground/90 leading-relaxed font-sans">
            {nextTierRequirement}
          </p>
        </div>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.values(pillars).map((pillar) => {
          const PillarIcon = PILLAR_ICONS[pillar.id] || BookOpen;

          return (
            <div
              key={pillar.id}
              className="p-4 rounded-xl border border-border/80 bg-[#0F172A]/60 hover:bg-[#0F172A] transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                    <PillarIcon className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">
                    {pillar.label}
                  </span>
                </div>
                <span className="text-xs font-bold font-mono text-primary">
                  {pillar.score}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-card rounded-full h-1.5 overflow-hidden mb-2 border border-border/40">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all duration-600"
                  style={{ width: `${Math.min(100, Math.max(3, pillar.score))}%` }}
                />
              </div>

              <p className="text-[11px] text-muted-foreground leading-snug">
                {pillar.detail}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
