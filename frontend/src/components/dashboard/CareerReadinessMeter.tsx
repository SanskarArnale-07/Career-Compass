"use client";

import { motion } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  FolderKanban,
  Target,
} from "lucide-react";
import { CountUp } from "@/components/ui/CountUp";
import type { CareerReadinessResult } from "@/lib/career-details/roadmap-intelligence";

interface CareerReadinessMeterProps {
  readiness: CareerReadinessResult;
  activeCareerTitle: string;
  compact?: boolean;
}

const PILLAR_ICONS = {
  foundations: BookOpen,
  skills: CheckCircle2,
  portfolio: FolderKanban,
};

export default function CareerReadinessMeter({
  readiness,
  activeCareerTitle,
  compact = false,
}: CareerReadinessMeterProps) {
  const { overallScore, tierLevel, tierName, tierDescription, nextTierRequirement, pillars } =
    readiness;

  // Level badge styling
  const levelColors: Record<number, { bg: string; text: string; border: string }> = {
    1: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30" },
    2: { bg: "bg-amber-500/25", text: "text-amber-300", border: "border-amber-500/40" },
    3: { bg: "bg-primary/20", text: "text-primary", border: "border-primary/40" },
    4: { bg: "bg-primary/30", text: "text-[#D4A853]", border: "border-primary/50" },
  };

  const levelStyle = levelColors[tierLevel] || levelColors[1];
  const circumference = 2 * Math.PI * 42;
  const targetOffset = circumference * (1 - overallScore / 100);

  if (compact) {
    return (
      <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
            Career Readiness
          </span>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${levelStyle.bg} ${levelStyle.text} ${levelStyle.border}`}
          >
            Tier {tierLevel}: {tierName}
          </span>
        </div>

        <div className="flex items-baseline gap-2">
          <CountUp
            value={overallScore}
            duration={1.0}
            suffix="%"
            className="font-heading text-2xl sm:text-3xl font-bold text-foreground tabular-nums"
          />
          <span className="text-xs text-muted-foreground">Readiness Score</span>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          {tierDescription}
        </p>

        {/* 3 Pillar Mini Progress Bars */}
        <div className="space-y-2 pt-1 border-t border-border/50">
          {Object.entries(pillars).map(([key, pillar]) => (
            <div key={key} className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground capitalize">{key}</span>
                <span className="font-mono font-medium text-primary tabular-nums">
                  {pillar.score}%
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[#1E1A16] overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${pillar.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
                className="text-[#161412]"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#readinessGrad)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: targetOffset }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="readinessGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#C8922A" />
                  <stop offset="100%" stopColor="#D4A853" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <CountUp
                value={overallScore}
                duration={1.2}
                suffix="%"
                className="font-heading text-lg sm:text-xl font-bold text-foreground"
              />
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
        <div className="sm:max-w-xs p-3 rounded-xl bg-[#161412] border border-border/80">
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
              className="p-4 rounded-xl border border-border/80 bg-[#161412]/60 hover:bg-[#161412] transition-colors"
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
                <CountUp
                  value={pillar.score}
                  duration={1}
                  suffix="%"
                  className="text-xs font-bold font-mono text-primary"
                />
              </div>

              {/* Progress bar */}
              <div className="w-full bg-card rounded-full h-1.5 overflow-hidden mb-2 border border-border/40">
                <motion.div
                  className="bg-primary h-1.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.max(3, pillar.score))}%` }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
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
