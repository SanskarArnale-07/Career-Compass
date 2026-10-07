"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Map,
  ArrowRight,
  BookOpen,
  Target,
} from "lucide-react";
import type { CareerIntelligence } from "@/lib/career-intelligence";

interface RoadmapMomentumSectionProps {
  career: CareerIntelligence | null | undefined;
  overallPercent: number;
  completedPhases: number;
  totalPhases: number;
  masteredSkills: number;
  totalSkills: number;
  currentPhaseTitle?: string;
  nextMilestone?: string;
  selectedSlug: string;
}

export function RoadmapMomentumSection({
  career,
  overallPercent,
  completedPhases,
  totalPhases,
  masteredSkills,
  totalSkills,
  currentPhaseTitle,
  nextMilestone,
  selectedSlug,
}: RoadmapMomentumSectionProps) {
  const careerTitle = career?.title || "Software Development";

  return (
    <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-card via-[#10141A] to-[#0B0E12] p-5 sm:p-6 space-y-5 shadow-lg shadow-black/20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/30 text-primary">
            <Map className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                Active Career Track
              </span>
              <span className="px-2 py-0.2 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-mono font-semibold text-primary">
                In Progress
              </span>
            </div>
            <h2 className="font-heading text-lg sm:text-xl font-bold text-foreground">
              {careerTitle}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover shadow-md shadow-primary/20 transition-all"
          >
            <span>Continue Roadmap</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Progress Bar & Key Summary */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Roadmap Readiness</span>
            <span className="font-mono font-bold text-primary tabular-nums">
              {overallPercent}%
            </span>
          </div>
          <span className="font-mono text-muted-foreground">
            {completedPhases} / {totalPhases} stages completed
          </span>
        </div>

        <div className="h-2 w-full rounded-full bg-[#10141A] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallPercent}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
          />
        </div>
      </div>

      {/* Immediate Focus & Milestones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {/* Current Active Stage */}
        <div className="p-3.5 rounded-xl border border-border/70 bg-[#0B0E12]/80 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Current Stage
            </span>
            <span className="text-[10px] font-mono text-primary font-semibold">
              Active Focus
            </span>
          </div>
          <h3 className="text-xs sm:text-sm font-semibold text-foreground truncate">
            {currentPhaseTitle || "Stage 1: Core Foundations"}
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Master fundamental concepts, programming constructs, and core syntax.
          </p>
        </div>

        {/* Next Immediate Milestone */}
        <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-wider text-primary">
              Immediate Objective
            </span>
            <Target className="h-3.5 w-3.5 text-primary" />
          </div>
          <h3 className="text-xs sm:text-sm font-semibold text-foreground truncate">
            {nextMilestone || "Data Structures & Algorithmic Problem Solving"}
          </h3>
          <p className="text-[11px] text-secondary-foreground/80">
            {masteredSkills} / {totalSkills} skills mastered toward career readiness.
          </p>
        </div>
      </div>

      {/* Footer link to career guide */}
      <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
        <span className="text-[11px] text-muted-foreground">
          Adaptive curriculum updates automatically as you complete skills and projects.
        </span>
        <Link
          href={`/career/${selectedSlug}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>Full Career Guide</span>
        </Link>
      </div>
    </div>
  );
}
