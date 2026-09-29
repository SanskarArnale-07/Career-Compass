"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Clock,
  ExternalLink,
  BookOpen,
  Code2,
  Hammer,
  GraduationCap,
  Map,
  CheckCircle2,
  Check,
  Sparkles,
  ArrowRight,
  Target,
  Trophy,
} from "lucide-react";
import type { RoadmapPhase, LearningResource, ResourceType } from "@/lib/career-details/types";

interface LearningRoadmapProps {
  phases: RoadmapPhase[];
  completedPhases?: number[];
}

const RESOURCE_ICONS: Record<ResourceType, React.ComponentType<{ className?: string }>> = {
  course: GraduationCap,
  video: BookOpen,
  book: BookOpen,
  documentation: Code2,
  practice: Hammer,
};

function ResourceCard({ resource }: { resource: LearningResource }) {
  const Icon = RESOURCE_ICONS[resource.type] ?? BookOpen;
  const difficultyColors: Record<string, string> = {
    beginner: "text-muted-foreground bg-[#141920] border-border/80",
    intermediate: "text-primary bg-primary/10 border-primary/25",
    advanced: "text-[#818CF8] bg-indigo-500/10 border-indigo-500/25",
  };

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-3.5 p-3.5 rounded-xl border border-border bg-[#0D1117]/80 hover:border-primary/40 hover:bg-[#121722] transition-all duration-200"
    >
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary border border-primary/20 shrink-0 group-hover:scale-105 transition-transform">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 justify-between">
          <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">
            {resource.name}
          </span>
          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
        </div>
        <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
          <span className={`text-xs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${difficultyColors[resource.difficulty]}`}>
            {resource.difficulty}
          </span>
          <span className="text-xs font-mono text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3 text-primary/70" />
            {resource.estimatedTime}
          </span>
          <span className="text-xs font-mono uppercase text-muted-foreground/60 ml-auto">
            {resource.type}
          </span>
        </div>
      </div>
    </a>
  );
}

export default function LearningRoadmap({ phases, completedPhases = [] }: LearningRoadmapProps) {
  const [expandedPhase, setExpandedPhase] = useState<string | null>(phases[0]?.id ?? null);
  const completedSet = new Set(completedPhases);

  // Active progression stage index in the phases list
  const currentStageIndex = phases.findIndex((p, idx) => {
    const isCompleted = completedSet.has(p.phase);
    return !isCompleted && (idx === 0 || completedSet.has(phases[idx - 1]?.phase));
  });

  const activeIndex = currentStageIndex >= 0 ? currentStageIndex : 0;

  const handlePhaseSelect = (phaseId: string) => {
    setExpandedPhase((prev) => (prev === phaseId ? null : phaseId));
    setTimeout(() => {
      const el = document.getElementById(`phase-card-${phaseId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 100);
  };

  return (
    <section>
      {/* ── Section Title & Journey Status ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2.5">
            <Map className="h-6 w-6 text-primary" />
            Learning Roadmap &amp; Journey
          </h2>
          <p className="font-sans text-sm sm:text-base text-muted-foreground mt-1 max-w-2xl leading-relaxed">
            Your structured progression toward this career — from initial foundations to specialized execution.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-mono font-semibold px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary">
            {completedSet.size} of {phases.length} Stages Completed
          </span>
        </div>
      </div>

      {/* ── Dynamic Journey Progression Pipeline Tracker ── */}
      <div className="mb-8 p-4 sm:p-5 rounded-2xl border border-border bg-card/70 backdrop-blur-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-border/60">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
              Your Step-by-Step Career Journey
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-muted-foreground">Current Focus:</span>
            <span className="text-primary font-bold">
              Stage {activeIndex + 1} of {phases.length}
            </span>
          </div>
        </div>

        {/* Horizontal Pipeline Steps */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          {phases.map((phase, idx) => {
            const isCompleted = completedSet.has(phase.phase);
            const isCurrent = idx === activeIndex;
            const isSelected = expandedPhase === phase.id;
            const isLast = idx === phases.length - 1;

            return (
              <div key={phase.id} className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handlePhaseSelect(phase.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                    isSelected
                      ? "bg-primary/20 border-primary text-primary font-bold shadow-xs shadow-primary/25 ring-1 ring-primary/40"
                      : isCurrent
                      ? "bg-primary/10 border-primary/50 text-foreground font-semibold hover:border-primary"
                      : isCompleted
                      ? "bg-[#141920] border-border text-muted-foreground hover:text-foreground hover:border-border/80"
                      : "bg-background/50 border-border/60 text-muted-foreground/80 hover:text-foreground hover:border-border"
                  }`}
                >
                  <span
                    className={`h-5 w-5 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                      isCompleted
                        ? "bg-primary/20 text-primary border border-primary/30"
                        : isSelected || isCurrent
                        ? "bg-primary text-primary-foreground font-bold"
                        : "bg-card border border-border text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? <Check className="h-3 w-3 stroke-[2.5]" /> : idx + 1}
                  </span>
                  <span className="whitespace-nowrap font-sans font-medium text-xs sm:text-sm">
                    {phase.title.length > 26 ? `${phase.title.slice(0, 24)}…` : phase.title}
                  </span>
                  {isCurrent && (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shrink-0" />
                  )}
                </button>
                {!isLast && (
                  <span className="text-border/80 text-xs select-none">→</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Journey Stages Timeline (Tracing Beam) ── */}
      <div className="relative">
        {/* Tracing line */}
        <div className="absolute left-5 sm:left-6 top-0 bottom-0 w-0.5 bg-linear-to-b from-primary via-primary/30 to-border/40" />

        <div className="space-y-5">
          {phases.map((phase, i) => {
            const isExpanded = expandedPhase === phase.id;
            const isCompleted = completedSet.has(phase.phase);
            const isCurrent = !isCompleted && (i === 0 || completedSet.has(phases[i - 1]?.phase));
            const isUpcoming = !isCompleted && !isCurrent;

            return (
              <motion.div
                key={phase.id}
                id={`phase-card-${phase.id}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                {/* Accordion Stage Toggle Button */}
                <button
                  type="button"
                  onClick={() => handlePhaseSelect(phase.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`phase-details-${phase.id}`}
                  className="w-full text-left focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-xl cursor-pointer"
                >
                  <div className="relative flex items-start gap-4 group">
                    {/* Milestone node icon */}
                    <div
                      className={`relative z-10 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 shrink-0 transition-all duration-300 ${
                        isCompleted
                          ? "border-border/80 bg-[#10141A] text-primary shadow-xs"
                          : isCurrent
                          ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25 ring-4 ring-primary/10"
                          : isExpanded
                          ? "border-primary/80 bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground group-hover:border-primary/50"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-5 w-5 stroke-[2.5]" />
                      ) : (
                        <span className="font-heading text-xs sm:text-sm font-bold">
                          {phase.phase}
                        </span>
                      )}
                    </div>

                    {/* Stage Card Header */}
                    <div
                      className={`flex-1 rounded-xl border p-4 sm:p-5 transition-all duration-300 ${
                        isCompleted
                          ? "border-border/70 bg-[#10141A]"
                          : isCurrent
                          ? "border-primary/50 bg-[#121720] shadow-sm shadow-primary/10 border-l-4 border-l-primary"
                          : isExpanded
                          ? "border-primary/40 bg-card shadow-xs"
                          : isUpcoming
                          ? "border-border/60 bg-card/60 opacity-90 group-hover:opacity-100 group-hover:border-border group-hover:bg-card"
                          : "border-border bg-card group-hover:border-primary/20 group-hover:bg-card-hover"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1.5 flex-1 min-w-0">
                          {/* Status & Timing Metadata */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                              Stage {phase.phase} of {phases.length}
                            </span>
                            {isCurrent && (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-primary/15 text-primary border border-primary/25">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                Current Journey Stage
                              </span>
                            )}
                            {isCompleted && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono text-muted-foreground bg-[#1A1816] border border-border/80">
                                <Check className="h-3 w-3 text-primary" />
                                Completed Milestone
                              </span>
                            )}
                            {isUpcoming && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono text-muted-foreground/70 bg-card border border-border/60">
                                Next in Sequence
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground/80 ml-auto">
                              <Clock className="h-3 w-3 text-primary/70" />
                              {phase.estimatedDuration}
                            </span>
                          </div>

                          {/* Phase Title */}
                          <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground leading-snug">
                            {phase.title}
                          </h3>

                          {/* Skills Preview Pills (Quick glance) */}
                          {phase.skills.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                              {phase.skills.slice(0, 4).map((skill) => (
                                <span
                                  key={skill}
                                  className="text-xs font-mono px-2 py-0.5 rounded bg-[#161B24] border border-border/60 text-muted-foreground"
                                >
                                  {skill}
                                </span>
                              ))}
                              {phase.skills.length > 4 && (
                                <span className="text-xs font-mono text-muted-foreground/60">
                                  +{phase.skills.length - 4} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Chevron */}
                        <ChevronDown
                          className={`h-5 w-5 text-muted-foreground transition-transform duration-300 shrink-0 mt-1 ${
                            isExpanded ? "rotate-180 text-primary" : ""
                          }`}
                        />
                      </div>

                      {/* Collapsed Description Teaser */}
                      {!isExpanded && (
                        <p className="text-xs sm:text-sm text-muted-foreground mt-2.5 line-clamp-1 leading-relaxed">
                          {phase.description}
                        </p>
                      )}
                    </div>
                  </div>
                </button>

                {/* ── Expanded Stage Details: 4 Clear Pillars ── */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      id={`phase-details-${phase.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="ml-6 sm:ml-16 mt-3 space-y-5 pt-1">
                        {/* Pillar 0: What This Stage is About */}
                        <div className="p-4 sm:p-5 rounded-xl bg-[#0D1117] border border-border/80 space-y-2">
                          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-primary">
                            <Target className="h-4 w-4 text-primary" />
                            <span>Stage Objective &amp; Purpose</span>
                          </div>
                          <p className="text-sm sm:text-base text-foreground/90 leading-relaxed font-sans">
                            {phase.description}
                          </p>
                        </div>

                        {/* Pillar 1 & 2: Learn & Practice Side-by-Side Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* 1. LEARN */}
                          <div className="p-4 sm:p-5 rounded-xl bg-[#0D1117] border border-border/80 flex flex-col">
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/50">
                              <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                                <GraduationCap className="h-4 w-4" />
                              </div>
                              <div>
                                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
                                  1. Learn &amp; Understand
                                </h4>
                                <p className="text-xs text-muted-foreground">Core concepts &amp; theory</p>
                              </div>
                            </div>
                            <ul className="space-y-2 flex-1">
                              {phase.learn.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2.5 text-sm text-foreground/85 leading-relaxed">
                                  <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* 2. PRACTICE */}
                          <div className="p-4 sm:p-5 rounded-xl bg-[#0D1117] border border-border/80 flex flex-col">
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/50">
                              <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                                <Hammer className="h-4 w-4" />
                              </div>
                              <div>
                                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
                                  2. Hands-on Practice
                                </h4>
                                <p className="text-xs text-muted-foreground">Applied drills &amp; exercises</p>
                              </div>
                            </div>
                            <ul className="space-y-2 flex-1">
                              {phase.practice.map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2.5 text-sm text-foreground/85 leading-relaxed">
                                  <CheckCircle2 className="h-4 w-4 text-sky-400/80 mt-0.5 shrink-0" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Pillar 3: BUILD (Portfolio Milestone Artifact) */}
                        <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-r from-primary/10 via-[#101724] to-[#0D1117] border border-primary/30 shadow-md">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5 pb-2 border-b border-primary/20">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-primary/20 text-primary border border-primary/30">
                                <Code2 className="h-4.5 w-4.5" />
                              </div>
                              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-primary">
                                3. Build &amp; Deliver — Portfolio Milestone
                              </h4>
                            </div>
                            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25 shrink-0 self-start sm:self-auto">
                              Tangible Proof of Work
                            </span>
                          </div>
                          <p className="text-sm sm:text-base text-foreground font-medium leading-relaxed pt-1">
                            {phase.build}
                          </p>
                        </div>

                        {/* Pillar 4: RESOURCES */}
                        {phase.resources.length > 0 && (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                                  4. Curated Learning Resources
                                </h4>
                              </div>
                              <span className="text-xs font-mono text-muted-foreground/60">
                                {phase.resources.length} {phase.resources.length === 1 ? "resource" : "resources"}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {phase.resources.map((r) => (
                                <ResourceCard key={r.name} resource={r} />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Pillar 5: WHAT COMES NEXT (Actionable Journey Continuation) */}
                        <div className="pt-2">
                          {i < phases.length - 1 ? (
                            <div className="p-4 rounded-xl bg-[#121620] border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="space-y-0.5">
                                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                                  Next Step in Your Journey
                                </span>
                                <p className="text-sm font-semibold text-foreground">
                                  Stage {i + 2}: {phases[i + 1].title}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handlePhaseSelect(phases[i + 1].id)}
                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs sm:text-sm hover:bg-primary-hover shadow-sm shadow-primary/20 transition-all cursor-pointer shrink-0"
                              >
                                <span>Continue to Stage {i + 2}</span>
                                <ArrowRight className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-[#0E1716] to-[#0D1117] border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                                  <Trophy className="h-4 w-4" />
                                  <span>Final Stage • Professional Readiness</span>
                                </div>
                                <p className="text-sm text-slate-300">
                                  Completing these milestones prepares you for industry roles and portfolio reviews.
                                </p>
                              </div>
                              <a
                                href="/dashboard"
                                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-xs sm:text-sm hover:bg-emerald-400 shadow-sm transition-all cursor-pointer shrink-0"
                              >
                                <span>Track on Dashboard</span>
                                <ArrowRight className="h-4 w-4" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
