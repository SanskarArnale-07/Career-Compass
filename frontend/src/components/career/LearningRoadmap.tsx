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

const PROGRESSION_STAGES = [
  "Current Position",
  "Foundation",
  "Core Skills",
  "Applied Skills",
  "Projects",
  "Advanced Skills",
  "Career Preparation",
];

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
      className="group flex items-start gap-3 p-3 rounded-lg border border-border bg-background/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate">{resource.name}</span>
          <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${difficultyColors[resource.difficulty]}`}>
            {resource.difficulty}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />{resource.estimatedTime}
          </span>
        </div>
      </div>
    </a>
  );
}

export default function LearningRoadmap({ phases, completedPhases = [] }: LearningRoadmapProps) {
  const [expandedPhase, setExpandedPhase] = useState<string | null>(phases[0]?.id ?? null);
  const completedSet = new Set(completedPhases);

  // Active progression stage in the 7-step journey pipeline
  const activeStageIndex = Math.min(
    completedPhases.length + 1,
    PROGRESSION_STAGES.length - 1
  );

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
            <Map className="h-6 w-6 text-primary" />
            Learning Roadmap &amp; Journey
          </h2>
          <p className="font-sans text-sm text-muted-foreground mt-1 max-w-2xl">
            A step-by-step career progression from your current starting point to full professional readiness.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
            {completedSet.size} of {phases.length} Phases Completed
          </span>
        </div>
      </div>

      {/* Progression Pipeline Stepper (7-Stage Journey Flow) */}
      <div className="mb-8 p-4 rounded-2xl border border-border bg-card/60 backdrop-blur-xs">
        <div className="flex items-center justify-between gap-2 pb-2 mb-3 border-b border-border/60">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Student Journey Trajectory
          </span>
          <span className="text-[11px] font-mono text-primary font-medium">
            Stage {activeStageIndex + 1} of {PROGRESSION_STAGES.length}: {PROGRESSION_STAGES[activeStageIndex]}
          </span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none pb-1">
          {PROGRESSION_STAGES.map((stage, idx) => {
            const isCompleted = idx < activeStageIndex;
            const isActive = idx === activeStageIndex;
            const isLast = idx === PROGRESSION_STAGES.length - 1;

            return (
              <div key={stage} className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <div
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-all ${
                    isActive
                      ? "bg-primary/15 border-primary text-primary font-semibold shadow-xs shadow-primary/20"
                      : isCompleted
                      ? "bg-[#141920] border-border text-muted-foreground font-medium"
                      : "bg-background/40 border-border/60 text-muted-foreground"
                  }`}
                >
                  <span
                    className={`h-4.5 w-4.5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                      isActive
                        ? "bg-primary text-primary-foreground font-bold"
                        : isCompleted
                        ? "bg-[#10141A] text-muted-foreground border border-border/60"
                        : "bg-card border border-border text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-2.5 w-2.5 stroke-3" />
                    ) : (
                      idx + 1
                    )}
                  </span>
                  <span className="whitespace-nowrap">{stage}</span>
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shrink-0" />
                  )}
                </div>
                {!isLast && (
                  <span className="text-border/80 text-xs select-none">→</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative">
        {/* Tracing Beam timeline line */}
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
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
              >
                <button
                  onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`phase-details-${phase.id}`}
                  className="w-full text-left focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary rounded-xl cursor-pointer"
                >
                  <div className="relative flex items-start gap-4 group">
                    {/* Phase number circle / milestone icon */}
                    <div
                      className={`relative z-10 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 shrink-0 transition-all duration-300 ${
                        isCompleted
                          ? "border-border/80 bg-[#10141A] text-muted-foreground shadow-xs"
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

                    {/* Content Box */}
                    <div
                      className={`flex-1 rounded-xl border p-4 sm:p-5 transition-all duration-300 ${
                        isCompleted
                          ? "border-border/70 bg-[#10141A]"
                          : isCurrent
                          ? "border-primary/50 bg-[#141920] shadow-sm shadow-primary/10 border-l-4 border-l-primary"
                          : isExpanded
                          ? "border-primary/40 bg-card shadow-xs"
                          : isUpcoming
                          ? "border-border/60 bg-card/60 opacity-90 group-hover:opacity-100 group-hover:border-border group-hover:bg-card"
                          : "border-border bg-card group-hover:border-primary/20 group-hover:bg-card-hover"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                              Phase {phase.phase}
                            </span>
                            {isCurrent && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-primary/15 text-primary border border-primary/25">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                Active Focus Milestone
                              </span>
                            )}
                            {isCompleted && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono text-muted-foreground bg-[#1A1816] border border-border/80">
                                Completed Milestone
                              </span>
                            )}
                            {isUpcoming && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono text-muted-foreground/70 bg-card border border-border/60">
                                Upcoming Step
                              </span>
                            )}
                          </div>
                          <h3 className="font-heading text-base font-bold text-foreground">
                            {phase.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="inline-flex items-center gap-1 text-xs text-primary font-medium">
                              <Clock className="h-3 w-3" />
                              {phase.estimatedDuration}
                            </span>
                          </div>
                        </div>
                        <ChevronDown
                          className={`h-5 w-5 text-muted-foreground transition-transform duration-300 ${
                            isExpanded ? "rotate-180 text-primary" : ""
                          }`}
                        />
                      </div>
                      {!isExpanded && (
                        <p className="text-xs sm:text-sm text-muted-foreground mt-2 line-clamp-1">
                          {phase.description}
                        </p>
                      )}
                    </div>
                  </div>
                </button>

                {/* Expanded details */}
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
                      <div className="ml-8 sm:ml-16 mt-2 space-y-5">
                        {/* Description */}
                        <p className="text-sm text-foreground/90 leading-relaxed">{phase.description}</p>

                        {/* Learn */}
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                            <GraduationCap className="h-3.5 w-3.5" />Learn
                          </h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {phase.learn.map((item) => (
                              <li key={item} className="flex items-center gap-2 text-sm text-foreground/80">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Practice */}
                        {phase.practice.length > 0 && (
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-2 flex items-center gap-1.5">
                              <Hammer className="h-3.5 w-3.5" />Practice
                            </h4>
                            <ul className="space-y-1">
                              {phase.practice.map((item) => (
                                <li key={item} className="flex items-center gap-2 text-sm text-foreground/80">
                                  <span className="h-1.5 w-1.5 rounded-full bg-sky-400/60 shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Build */}
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                            <Code2 className="h-3.5 w-3.5" />Build Project
                          </h4>
                          <p className="text-sm text-foreground/90 bg-[#10141A] border border-border/80 rounded-lg px-3 py-2">{phase.build}</p>
                        </div>

                        {/* Resources */}
                        {phase.resources.length > 0 && (
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Recommended Resources</h4>
                            <div className="grid grid-cols-1 gap-2">
                              {phase.resources.map((r) => (
                                <ResourceCard key={r.name} resource={r} />
                              ))}
                            </div>
                          </div>
                        )}
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
