"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  CheckCircle2,
  Circle,
  ExternalLink,
  BookOpen,
  Lightbulb,
  Wrench,
  ArrowRight,
  Lock,
} from "lucide-react";
import type { RoadmapPhase, LearningResource } from "@/lib/career-details/types";

// ── Types ────────────────────────────────────────────────────────────

interface RoadmapStagePanelProps {
  phase: RoadmapPhase;
  phaseIndex: number;
  totalPhases: number;
  isCompleted: boolean;
  isActive: boolean; // auto-expanded when true
  completedSkills: Set<string>;
  onTogglePhase: (phaseNum: number) => void;
  onToggleSkill: (skillId: string) => void;
}

// ── Helpers ──────────────────────────────────────────────────────────

/** Derive a stable skill ID from its name + phase context */
function skillId(phaseName: string, skillName: string): string {
  return `${phaseName
    .toLowerCase()
    .replace(/\s+/g, "-")}-${skillName.toLowerCase().replace(/\s+/g, "-")}`;
}

/** Pick resources loosely relevant to a skill name (naive keyword match) */
function getSkillResources(
  skillName: string,
  resources: LearningResource[]
): LearningResource[] {
  const lower = skillName.toLowerCase();
  const keywords = lower.split(/[\s/&-]+/).filter((w) => w.length > 3);
  const matched = resources.filter((r) =>
    keywords.some((kw) => r.name.toLowerCase().includes(kw))
  );
  return matched.length > 0 ? matched : resources.slice(0, 2);
}

/** Map resource type to a short label */
const RESOURCE_TYPE_LABEL: Record<string, string> = {
  course: "Course",
  documentation: "Docs",
  practice: "Practice",
  video: "Video",
  book: "Book",
};

// ── Resource Type Badge ───────────────────────────────────────────────

const RESOURCE_TYPE_STYLE: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  course: {
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-primary/20",
  },
  documentation: {
    bg: "bg-[#141920]",
    text: "text-muted-foreground",
    border: "border-border/80",
  },
  practice: {
    bg: "bg-primary/10",
    text: "text-primary",
    border: "border-primary/20",
  },
  video: {
    bg: "bg-sky-500/10",
    text: "text-sky-400",
    border: "border-sky-500/20",
  },
  book: {
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    border: "border-indigo-500/20",
  },
};

// ── Helper: Format Duration for Student-Age Guidance ──────────────────
function formatDuration(duration: string): string {
  return duration
    .replace(/Ongoing\s*\([Cc]lass\s*11[-–]12\)/gi, "Foundations (Prep for Class 11–12)")
    .replace(/\([Cc]lass\s*11[-–]12\)/gi, "(Prep for Class 11–12)");
}

// ── Skill Drawer ──────────────────────────────────────────────────────

interface SkillDrawerProps {
  skillName: string;
  sid: string;
  phaseLearn: string[];
  phasePractice: string[];
  phaseResources: LearningResource[];
  isCompleted: boolean;
  isOpen: boolean;
  onToggleOpen: () => void;
  onToggleMastery: () => void;
}

function SkillDrawer({
  skillName,
  sid,
  phaseLearn,
  phasePractice,
  phaseResources,
  isCompleted,
  isOpen,
  onToggleOpen,
  onToggleMastery,
}: SkillDrawerProps) {
  const resources = getSkillResources(skillName, phaseResources);

  // Derive 2-3 contextual "learn" tasks from the phase's learn array
  const learnTasks = phaseLearn.slice(0, 3);
  const practiceTasks = phasePractice.slice(0, 2);

  const typeStyle = RESOURCE_TYPE_STYLE["course"]; // default fallback

  return (
    <div
      className={`rounded-xl border transition-all duration-200 w-full ${
        isCompleted
          ? "border-border/70 bg-[#10141A]"
          : isOpen
          ? "border-primary/35 bg-[#141920]"
          : "border-border/60 bg-[#10141A] hover:border-primary/25 hover:bg-[#141920]"
      }`}
    >
      {/* Skill Header Row */}
      <button
        type="button"
        onClick={onToggleOpen}
        className="w-full flex items-center justify-between px-3.5 py-3 gap-3 cursor-pointer select-none text-left"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Completion toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleMastery();
            }}
            className="shrink-0 transition-transform active:scale-90 cursor-pointer"
            title={isCompleted ? "Mark as in-progress" : "Mark complete"}
          >
            {isCompleted ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 fill-emerald-500/10" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
            )}
          </button>

          <span
            className={`text-xs sm:text-sm font-medium leading-snug truncate transition-colors ${
              isCompleted
                ? "text-muted-foreground line-through"
                : "text-foreground"
            }`}
          >
            {skillName}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <ChevronDown
            className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
              isOpen ? "rotate-180 text-primary" : ""
            }`}
          />
        </div>
      </button>

      {/* Skill Drawer Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key={`drawer-${sid}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-border/50 space-y-4">
              {/* Step 1: WHAT TO LEARN */}
              {learnTasks.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-sky-500/15 text-[10px] font-mono font-bold text-sky-400">
                      1
                    </span>
                    <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-sky-400">
                      What to Learn
                    </p>
                  </div>
                  <ul className="space-y-1.5 pl-6 border-l border-sky-500/20 ml-2">
                    {learnTasks.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-secondary-foreground leading-relaxed"
                      >
                        <ArrowRight className="h-3 w-3 text-sky-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Step 2: HOW TO PRACTICE */}
              {practiceTasks.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-primary/15 text-[10px] font-mono font-bold text-primary">
                      2
                    </span>
                    <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-primary">
                      How to Practice
                    </p>
                  </div>
                  <ul className="space-y-1.5 pl-6 border-l border-primary/20 ml-2">
                    {practiceTasks.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-secondary-foreground leading-relaxed"
                      >
                        <ArrowRight className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Step 3: RESOURCES */}
              {resources.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-indigo-500/15 text-[10px] font-mono font-bold text-indigo-400">
                      3
                    </span>
                    <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-indigo-400">
                      Curated Resources
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-6 border-l border-indigo-500/20 ml-2">
                    {resources.map((res) => {
                      const style =
                        RESOURCE_TYPE_STYLE[res.type] || typeStyle;
                      return (
                        <a
                          key={res.name}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between gap-3 p-2.5 rounded-lg border border-border/60 bg-[#10141A] hover:border-primary/40 hover:bg-[#141920] transition-colors group"
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors leading-snug truncate">
                              {res.name}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold uppercase border ${style.bg} ${style.text} ${style.border}`}
                              >
                                {RESOURCE_TYPE_LABEL[res.type] || res.type}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-mono">
                                {res.estimatedTime}
                              </span>
                            </div>
                          </div>
                          <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0 transition-colors" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Mark Complete button */}
              <div className="pt-1 pl-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleMastery();
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isCompleted
                      ? "border border-border bg-card text-muted-foreground hover:text-foreground"
                      : "bg-primary text-primary-foreground font-semibold hover:bg-primary-hover shadow-sm"
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {isCompleted ? "Mark Incomplete" : "Mark Complete"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────

export default function RoadmapStagePanel({
  phase,
  phaseIndex,
  totalPhases,
  isCompleted,
  isActive,
  completedSkills,
  onTogglePhase,
  onToggleSkill,
}: RoadmapStagePanelProps) {
  const [isExpanded, setIsExpanded] = useState(isActive);
  const [expandedSkillId, setExpandedSkillId] = useState<string | null>(null);

  // Sync expand state when parent changes isActive (e.g. after progress loads or stage selection)
  useEffect(() => {
    setIsExpanded(isActive);
  }, [isActive]);

  const skillsCompleted = phase.skills.filter((s) =>
    completedSkills.has(skillId(phase.title, s))
  ).length;

  return (
    <motion.div
      layout
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        isCompleted
          ? "border-border/60 bg-card/40 opacity-95"
          : isActive && !isCompleted
          ? "border-primary/40 bg-card ring-1 ring-primary/20 shadow-lg shadow-primary/5 border-l-4 border-l-primary"
          : isExpanded
          ? "border-primary/30 bg-card shadow-md shadow-primary/5"
          : "border-border bg-card hover:border-primary/25"
      }`}
    >
      {/* Stage Header — always visible */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer select-none"
      >
        {/* Left side */}
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Phase complete toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePhase(phase.phase);
            }}
            className="shrink-0 transition-transform active:scale-90 cursor-pointer"
            title={isCompleted ? "Mark as in-progress" : "Mark stage complete"}
          >
            {isCompleted ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 fill-emerald-500/10" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
            )}
          </button>

          {/* Consistent Stage Numbering Badge */}
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center font-heading font-bold text-xs shrink-0 transition-colors ${
              isCompleted
                ? "bg-emerald-500/10 border border-emerald-500/25 text-emerald-400"
                : isActive
                ? "bg-primary/15 border border-primary/30 text-primary"
                : "bg-muted/40 border border-border/80 text-muted-foreground"
            }`}
          >
            {isCompleted ? "✓" : `0${phase.phase}`}
          </div>

          <div className="min-w-0">
            {/* Stage meta row */}
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <span
                className={`text-[10px] font-mono font-semibold uppercase tracking-wider ${
                  isActive && !isCompleted
                    ? "text-primary flex items-center gap-1.5"
                    : isCompleted
                    ? "text-emerald-400"
                    : "text-muted-foreground"
                }`}
              >
                {isActive && !isCompleted && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                )}
                {isCompleted
                  ? `Stage ${phase.phase} Complete`
                  : isActive
                  ? `Active Journey • Stage ${phase.phase} of ${totalPhases}`
                  : `Next Up • Stage ${phase.phase} of ${totalPhases}`}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground">•</span>
              <span className="text-[10px] font-mono text-muted-foreground">
                {formatDuration(phase.estimatedDuration)}
              </span>
            </div>

            {/* Stage title */}
            <h3
              className={`font-heading text-sm sm:text-base font-bold transition-colors leading-snug ${
                isCompleted
                  ? "text-muted-foreground line-through"
                  : "text-foreground"
              }`}
            >
              {phase.title}
            </h3>
          </div>
        </div>

        {/* Right side — completed counter + chevron */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[11px] font-mono text-muted-foreground hidden sm:inline">
            {skillsCompleted}/{phase.skills.length} completed
          </span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
              isExpanded ? "rotate-180 text-primary" : ""
            }`}
          />
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-border/60 bg-[#10141A]/40 space-y-5">
              {/* Phase description */}
              <p className="text-xs sm:text-sm text-secondary-foreground leading-relaxed pt-2">
                {phase.description}
              </p>

              {/* Skills in this stage — stacked full-width layout */}
              {phase.skills.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                      Skills in this stage — click to explore
                    </p>
                    <span className="text-[10px] font-mono text-muted-foreground sm:hidden">
                      {skillsCompleted}/{phase.skills.length} completed
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {phase.skills.map((skillName) => {
                      const sid = skillId(phase.title, skillName);
                      return (
                        <SkillDrawer
                          key={sid}
                          skillName={skillName}
                          sid={sid}
                          phaseLearn={phase.learn}
                          phasePractice={phase.practice}
                          phaseResources={phase.resources}
                          isCompleted={completedSkills.has(sid)}
                          isOpen={expandedSkillId === sid}
                          onToggleOpen={() =>
                            setExpandedSkillId((prev) => (prev === sid ? null : sid))
                          }
                          onToggleMastery={() => onToggleSkill(sid)}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 4: Milestone project */}
              {phase.build && (
                <div className="p-4 rounded-xl bg-amber-500/[0.04] border border-amber-500/20 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-500/15 text-[10px] font-mono font-bold text-amber-400">
                      4
                    </span>
                    <p className="text-[11px] font-mono font-semibold text-amber-400 uppercase tracking-wider">
                      Stage Milestone Project
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm text-foreground font-medium leading-relaxed pl-6">
                    {phase.build}
                  </p>
                </div>
              )}

              {/* Next stage teaser & Mark stage complete button */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-border/40">
                <div className="text-xs text-muted-foreground">
                  {phase.phase < totalPhases ? (
                    <span className="font-mono text-[11px] text-muted-foreground">
                      Up next: Stage {phase.phase + 1} of {totalPhases}
                    </span>
                  ) : (
                    <span className="font-mono text-[11px] text-emerald-400">
                      Final Stage • Advanced Foundations & Projects
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onTogglePhase(phase.phase)}
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isCompleted
                      ? "border border-border bg-card text-muted-foreground hover:text-foreground"
                      : "bg-primary text-primary-foreground font-semibold hover:bg-primary-hover shadow-sm"
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {isCompleted ? "Mark Stage Incomplete" : "Mark Stage Complete"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
