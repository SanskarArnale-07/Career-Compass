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
    bg: "bg-slate-500/10",
    text: "text-slate-400",
    border: "border-slate-500/20",
  },
  practice: {
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    border: "border-violet-500/20",
  },
  video: {
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/20",
  },
  book: {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/20",
  },
};

// ── Skill Drawer ──────────────────────────────────────────────────────

interface SkillDrawerProps {
  skillName: string;
  sid: string;
  phaseLearn: string[];
  phasePractice: string[];
  phaseResources: LearningResource[];
  isCompleted: boolean;
  onToggle: () => void;
}

function SkillDrawer({
  skillName,
  sid,
  phaseLearn,
  phasePractice,
  phaseResources,
  isCompleted,
  onToggle,
}: SkillDrawerProps) {
  const [open, setOpen] = useState(false);

  const resources = getSkillResources(skillName, phaseResources);

  // Derive 2-3 contextual "learn" tasks from the phase's learn array
  // We cycle through them per skill index to give variety
  const learnTasks = phaseLearn.slice(0, 3);
  const practiceTasks = phasePractice.slice(0, 2);

  const typeStyle =
    RESOURCE_TYPE_STYLE["course"]; // default fallback

  return (
    <div
      className={`rounded-xl border transition-all duration-200 ${
        isCompleted
          ? "border-emerald-500/25 bg-emerald-500/5"
          : open
          ? "border-primary/35 bg-[#161412]"
          : "border-border/60 bg-[#141210] hover:border-primary/25 hover:bg-[#161412]"
      }`}
    >
      {/* Skill Header Row */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 gap-3 cursor-pointer select-none text-left"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Completion toggle */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="shrink-0 transition-transform active:scale-90"
            title={isCompleted ? "Mark as in-progress" : "Mark as mastered"}
          >
            {isCompleted ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 fill-emerald-400/20" />
            ) : (
              <Circle className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
            )}
          </button>

          <span
            className={`text-xs font-medium leading-snug truncate transition-colors ${
              isCompleted
                ? "text-emerald-300/70 line-through"
                : "text-foreground"
            }`}
          >
            {skillName}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {open && (
            <span className="text-[10px] font-mono text-muted-foreground hidden sm:inline">
              {resources.length} resource{resources.length !== 1 ? "s" : ""}
            </span>
          )}
          <ChevronDown
            className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${
              open ? "rotate-180 text-primary" : ""
            }`}
          />
        </div>
      </button>

      {/* Skill Drawer Content */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key={`drawer-${sid}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-3.5 pb-4 pt-1 border-t border-border/50 space-y-4">
              {/* Learn Tasks */}
              {learnTasks.length > 0 && (
                <div>
                  <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Lightbulb className="h-3 w-3 text-amber-400" />
                    What to learn
                  </p>
                  <ul className="space-y-1.5">
                    {learnTasks.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-secondary-foreground leading-relaxed"
                      >
                        <ArrowRight className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Practice Tasks */}
              {practiceTasks.length > 0 && (
                <div>
                  <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Wrench className="h-3 w-3 text-violet-400" />
                    How to practice
                  </p>
                  <ul className="space-y-1.5">
                    {practiceTasks.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-secondary-foreground leading-relaxed"
                      >
                        <ArrowRight className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Resources */}
              {resources.length > 0 && (
                <div>
                  <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                    <BookOpen className="h-3 w-3 text-primary" />
                    Curated resources
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {resources.map((res) => {
                      const style =
                        RESOURCE_TYPE_STYLE[res.type] || typeStyle;
                      return (
                        <a
                          key={res.name}
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start justify-between gap-2 p-2.5 rounded-lg border border-border/60 bg-card hover:border-primary/40 hover:bg-card-hover transition-colors group"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors leading-snug truncate">
                              {res.name}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
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
                          <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary shrink-0 mt-0.5" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Mark skill button */}
              <div className="pt-1">
                <button
                  onClick={onToggle}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isCompleted
                      ? "border border-border bg-card text-muted-foreground hover:text-foreground"
                      : "bg-emerald-600/90 text-white hover:bg-emerald-500 shadow-sm"
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {isCompleted ? "Mark as In Progress" : "Mark as Mastered"}
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

  // Sync expand state when parent changes isActive (e.g. after progress loads)
  useEffect(() => {
    if (isActive) setIsExpanded(true);
  }, [isActive]);

  const skillsCompleted = phase.skills.filter((s) =>
    completedSkills.has(skillId(phase.title, s))
  ).length;

  const isLocked = !isCompleted && phaseIndex > 0 && false; // phases are not locked — all accessible

  return (
    <motion.div
      layout
      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
        isCompleted
          ? "border-emerald-500/25 bg-card/60"
          : isExpanded
          ? "border-primary/35 bg-card shadow-md shadow-primary/5"
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
              <CheckCircle2 className="h-5 w-5 text-emerald-400 fill-emerald-400/20" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
            )}
          </button>

          <div className="min-w-0">
            {/* Stage meta row */}
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                Stage {phase.phase} of {totalPhases}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono bg-primary/10 text-primary border border-primary/20">
                {phase.estimatedDuration}
              </span>
              {isActive && !isCompleted && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/25 text-[10px] font-mono font-semibold text-primary">
                  ● Active
                </span>
              )}
              {isCompleted && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-mono font-semibold text-emerald-400">
                  ✓ Complete
                </span>
              )}
            </div>

            {/* Stage title */}
            <h3
              className={`font-heading text-sm sm:text-base font-bold transition-colors leading-snug ${
                isCompleted
                  ? "text-emerald-300/70 line-through"
                  : "text-foreground"
              }`}
            >
              {phase.title}
            </h3>
          </div>
        </div>

        {/* Right side — skill progress + chevron */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[10px] font-mono text-muted-foreground hidden sm:inline">
            {skillsCompleted}/{phase.skills.length} skills
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
            <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-border/60 bg-[#161412]/40 space-y-5">
              {/* Phase description */}
              <p className="text-xs sm:text-sm text-secondary-foreground leading-relaxed pt-2">
                {phase.description}
              </p>

              {/* Skill list with progressive disclosure */}
              {phase.skills.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                    Skills in this stage — click to explore
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                          onToggle={() => onToggleSkill(sid)}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Milestone project */}
              {phase.build && (
                <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20">
                  <p className="text-[10px] font-mono font-semibold text-primary uppercase tracking-wider mb-1">
                    Stage Milestone Project
                  </p>
                  <p className="text-xs text-foreground font-medium leading-relaxed">
                    {phase.build}
                  </p>
                </div>
              )}

              {/* Mark stage complete button */}
              <div className="flex justify-end pt-1">
                <button
                  onClick={() => onTogglePhase(phase.phase)}
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isCompleted
                      ? "border border-border bg-card text-muted-foreground hover:text-foreground"
                      : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm"
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {isCompleted ? "Mark as Incomplete" : "Mark Stage Complete"}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
