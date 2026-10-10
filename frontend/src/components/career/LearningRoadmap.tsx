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
  Circle,
  FolderGit2,
} from "lucide-react";
import type { RoadmapPhase, LearningResource, ResourceType } from "@/lib/career-details/types";
import { resolvePhaseTasks } from "@/lib/career-roadmap/task-resolution";

interface LearningRoadmapProps {
  phases: RoadmapPhase[];
  completedPhases?: number[];
  careerTitle?: string;
}

const RESOURCE_ICONS: Record<ResourceType, React.ComponentType<{ className?: string }>> = {
  course: GraduationCap,
  video: BookOpen,
  book: BookOpen,
  documentation: Code2,
  practice: Hammer,
};

function formatDuration(duration: string): string {
  return duration
    .replace(/Ongoing\s*\([Cc]lass\s*11[-–]12\)/gi, "Foundations (Prep for Class 11–12)")
    .replace(/\([Cc]lass\s*11[-–]12\)/gi, "(Prep for Class 11–12)");
}

function ResourcePill({ resource }: { resource: LearningResource }) {
  const Icon = RESOURCE_ICONS[resource.type] ?? BookOpen;

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between p-2.5 rounded-xl border border-border/70 bg-[#0B0F15] hover:border-primary/40 hover:bg-[#10141D] transition-all duration-150"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10 text-primary border border-primary/20 shrink-0">
          <Icon className="h-3.5 w-3.5" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors truncate">
            {resource.name}
          </p>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
            <span className="capitalize">{resource.type}</span>
            <span>•</span>
            <span>{resource.estimatedTime}</span>
          </div>
        </div>
      </div>
      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-2" />
    </a>
  );
}

export default function LearningRoadmap({
  phases,
  completedPhases = [],
  careerTitle,
}: LearningRoadmapProps) {
  const [completedSet, setCompletedSet] = useState<Set<number>>(new Set(completedPhases));
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  // Find the active phase index (first incomplete)
  const firstIncompleteIdx = phases.findIndex((p) => !completedSet.has(p.phase));
  const defaultIdx = firstIncompleteIdx >= 0 ? firstIncompleteIdx : 0;

  const [activeStageIndex, setActiveStageIndex] = useState<number>(defaultIdx);
  const [expandedTaskIndex, setExpandedTaskIndex] = useState<number | null>(null);
  const [showMoreResources, setShowMoreResources] = useState<boolean>(false);

  if (!phases || phases.length === 0) return null;

  const currentPhase = phases[activeStageIndex] || phases[0];
  const isCurrentPhaseCompleted = completedSet.has(currentPhase.phase);

  // Compute progress
  const completedCount = completedSet.size;
  const progressPercent = Math.round((completedCount / phases.length) * 100);

  // Determine "YOUR NEXT STEP"
  const nextStepPhase = phases.find((p) => !completedSet.has(p.phase)) || phases[0];
  const nextPhaseTasks = resolvePhaseTasks(nextStepPhase);
  const nextTask =
    nextPhaseTasks.find((t) => !completedTasks.has(`${nextStepPhase.id}-${t.skillName}`)) ||
    nextPhaseTasks[0];
  const nextSkillName = nextTask ? nextTask.skillName : nextStepPhase.title;
  const nextSkillExplanation =
    nextTask?.learnItems[0] ||
    nextTask?.objective ||
    nextStepPhase.description ||
    "Build core foundational competencies required for this stage.";

  const handleToggleTask = (taskKey: string) => {
    setCompletedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(taskKey)) next.delete(taskKey);
      else next.add(taskKey);
      return next;
    });
  };

  const handleTogglePhase = (phaseNum: number) => {
    setCompletedSet((prev) => {
      const next = new Set(prev);
      if (next.has(phaseNum)) next.delete(phaseNum);
      else next.add(phaseNum);
      return next;
    });
  };

  const handleStartNextStep = () => {
    const targetIdx = phases.findIndex((p) => p.id === nextStepPhase.id);
    if (targetIdx >= 0) {
      setActiveStageIndex(targetIdx);
      const skillIdx = nextPhaseTasks.findIndex((t) => t.skillName === nextSkillName);
      setExpandedTaskIndex(skillIdx >= 0 ? skillIdx : 0);
      const el = document.getElementById("active-stage-container");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section className="space-y-8">
      {/* ── 1. HEADER: CAREER GOAL & CURRENT STAGE ── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-border/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono font-semibold text-primary mb-2">
            <Map className="h-3.5 w-3.5" />
            <span>Learning Roadmap</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
            {careerTitle ? `${careerTitle} Roadmap` : "Career Learning Journey"}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
            A step-by-step progression focusing on one stage at a time.
          </p>
        </div>

        {/* Simple Progress Indicator */}
        <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-muted-foreground">Journey Progress:</span>
            <span className="text-primary font-bold">{progressPercent}%</span>
          </div>
          <div className="w-36 sm:w-44 h-1.5 rounded-full bg-[#12161F] overflow-hidden border border-border/60">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-[11px] font-mono text-muted-foreground/80">
            {completedCount} of {phases.length} Stages Completed
          </span>
        </div>
      </div>

      {/* ── 2. YOUR NEXT STEP: PROMINENT ACTION CARD ── */}
      <div className="p-5 sm:p-6 rounded-2xl border border-primary/30 bg-gradient-to-br from-[#10141D] via-[#0D1117] to-[#0A0D12] shadow-lg shadow-primary/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-primary/15 border border-primary/25 text-[11px] font-mono font-bold uppercase tracking-wider text-primary">
              <Sparkles className="h-3 w-3" />
              <span>Your Next Step</span>
            </div>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground leading-snug">
              {nextSkillName}
            </h3>
            <p className="text-xs sm:text-sm text-secondary-foreground leading-relaxed line-clamp-2">
              {nextSkillExplanation}
            </p>
            <p className="text-[11px] font-mono text-muted-foreground pt-0.5">
              Part of Stage {nextStepPhase.phase}: {nextStepPhase.title}
            </p>
          </div>

          <button
            type="button"
            onClick={handleStartNextStep}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-xs sm:text-sm transition-all shadow-md shadow-primary/20 shrink-0 cursor-pointer self-start md:self-center"
          >
            <span>Start Task</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ── 3. YOUR JOURNEY: CLEAN STAGE SEQUENCE ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
            Your Journey
          </h4>
          <span className="text-[11px] font-mono text-muted-foreground/70">
            Select a stage to view actions
          </span>
        </div>

        {/* Clean sequence of stages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {phases.map((phase, idx) => {
            const isSelected = activeStageIndex === idx;
            const isCompleted = completedSet.has(phase.phase);
            const isNextStepHere = nextStepPhase.id === phase.id && !isCompleted;

            return (
              <button
                key={phase.id}
                type="button"
                onClick={() => {
                  setActiveStageIndex(idx);
                  setExpandedTaskIndex(null);
                  setShowMoreResources(false);
                }}
                className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary bg-[#121722] ring-1 ring-primary/40 shadow-sm shadow-primary/10"
                    : isCompleted
                    ? "border-emerald-500/30 bg-[#0E131A] hover:border-emerald-500/50"
                    : "border-border/70 bg-[#0B0F15] hover:border-border hover:bg-[#0F131C]"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5 ${
                    isCompleted
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-[#141920] text-muted-foreground border border-border/80"
                  }`}
                >
                  {isCompleted ? <Check className="h-3.5 w-3.5 stroke-[2.5]" /> : `0${phase.phase}`}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground truncate">
                      Stage {phase.phase}
                    </span>
                    {isNextStepHere && (
                      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>
                  <p
                    className={`text-xs font-semibold truncate mt-0.5 ${
                      isSelected
                        ? "text-primary font-bold"
                        : isCompleted
                        ? "text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {phase.title}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 4. ACTIVE STAGE REVEAL: TASKS & RESOURCES ── */}
      <div
        id="active-stage-container"
        className="p-5 sm:p-6 rounded-2xl border border-border/80 bg-[#0D1117] space-y-6"
      >
        {/* Stage Header & Brief Description */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-primary uppercase tracking-wider">
                Stage {currentPhase.phase} of {phases.length}
              </span>
              <span className="text-border">•</span>
              <span className="text-xs font-mono text-muted-foreground">
                {formatDuration(currentPhase.estimatedDuration)}
              </span>
            </div>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground mt-1">
              {currentPhase.title}
            </h3>
            <p className="text-xs sm:text-sm text-secondary-foreground mt-1 leading-relaxed max-w-2xl font-light">
              {currentPhase.description}
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleTogglePhase(currentPhase.phase)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
              isCurrentPhaseCompleted
                ? "border border-border/80 bg-[#141920] text-muted-foreground hover:text-foreground"
                : "border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
            }`}
          >
            {isCurrentPhaseCompleted ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Stage Completed</span>
              </>
            ) : (
              <>
                <Circle className="h-3.5 w-3.5" />
                <span>Mark Stage Done</span>
              </>
            )}
          </button>
        </div>

        {/* Tasks in this stage */}
        <div className="space-y-3">
          {(() => {
            const currentTasks = resolvePhaseTasks(currentPhase);
            return (
              <>
                <div className="flex items-center justify-between px-0.5">
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                    Tasks in this Stage ({currentTasks.length})
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground">
                    Click a task to reveal instructions &amp; resources
                  </span>
                </div>

                <div className="space-y-2.5">
                  {currentTasks.map((task, tIdx) => {
                    const taskKey = `${currentPhase.id}-${task.skillName}`;
                    const isTaskDone = completedTasks.has(taskKey);
                    const isExpanded = expandedTaskIndex === tIdx;
                    const isFirstIncomplete =
                      !isTaskDone &&
                      currentTasks
                        .slice(0, tIdx)
                        .every((prevTask) => completedTasks.has(`${currentPhase.id}-${prevTask.skillName}`));

                    // Dedicated resources for this task
                    const resources = task.resources || [];
                    const initialResources = resources.slice(0, 2);
                    const remainingResources = resources.slice(2);

                    return (
                      <div
                        key={taskKey}
                        className={`rounded-xl border transition-all ${
                          isExpanded
                            ? "border-primary/50 bg-[#121622] shadow-sm"
                            : isTaskDone
                            ? "border-border/60 bg-[#0B0F15] opacity-80"
                            : isFirstIncomplete
                            ? "border-primary/30 bg-[#10141D]"
                            : "border-border/70 bg-[#0B0F15] hover:border-border hover:bg-[#0E121B]"
                        }`}
                      >
                        {/* Task Header Row */}
                        <div className="flex items-center justify-between p-3.5 gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleTask(taskKey);
                              }}
                              className="shrink-0 transition-transform active:scale-90 cursor-pointer"
                              title={isTaskDone ? "Mark incomplete" : "Mark task complete"}
                            >
                              {isTaskDone ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-400 fill-emerald-500/10" />
                              ) : (
                                <Circle className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                              )}
                            </button>

                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-xs sm:text-sm font-medium truncate ${
                                    isTaskDone
                                      ? "text-muted-foreground line-through"
                                      : "text-foreground font-semibold"
                                  }`}
                                >
                                  {task.skillName}
                                </span>
                                {isFirstIncomplete && !isTaskDone && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-primary/20 text-primary uppercase tracking-wider shrink-0">
                                    Start Here
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => setExpandedTaskIndex(isExpanded ? null : tIdx)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono text-muted-foreground hover:text-foreground hover:bg-[#151A24] transition-colors shrink-0 cursor-pointer"
                          >
                            <span>{isExpanded ? "Hide" : "Instructions"}</span>
                            <ChevronDown
                              className={`h-3.5 w-3.5 transition-transform duration-200 ${
                                isExpanded ? "rotate-180 text-primary" : ""
                              }`}
                            />
                          </button>
                        </div>

                        {/* Task Details Drawer */}
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: "easeInOut" }}
                              className="overflow-hidden border-t border-border/50"
                            >
                              <div className="p-4 sm:p-5 bg-[#090C12] space-y-4">
                                {/* What to learn (Dedicated to this skill) */}
                                {task.learnItems.length > 0 && (
                                  <div className="space-y-1.5">
                                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
                                      What to Learn
                                    </span>
                                    <ul className="space-y-1 pl-4 border-l border-primary/20">
                                      {task.learnItems.map((item, idx) => (
                                        <li
                                          key={idx}
                                          className="text-xs text-secondary-foreground leading-relaxed flex items-start gap-1.5"
                                        >
                                          <span className="text-primary mt-1">•</span>
                                          <span>{item}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {/* How to practice (Dedicated to this skill) */}
                                {task.practiceTask && (
                                  <div className="space-y-1.5">
                                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-400">
                                      How to Practice
                                    </span>
                                    <div className="pl-4 border-l border-sky-500/20">
                                      <p className="text-xs text-secondary-foreground leading-relaxed">
                                        {task.practiceTask}
                                      </p>
                                    </div>
                                  </div>
                                )}

                                {/* Curated Resources for this skill */}
                                {resources.length > 0 && (
                                  <div className="space-y-2 pt-1 border-t border-border/40">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
                                        Curated Learning Resources
                                      </span>
                                      {remainingResources.length > 0 && (
                                        <button
                                          type="button"
                                          onClick={() => setShowMoreResources(!showMoreResources)}
                                          className="text-[11px] font-mono text-primary hover:underline cursor-pointer"
                                        >
                                          {showMoreResources
                                            ? "Show fewer resources"
                                            : `+${remainingResources.length} more resources`}
                                        </button>
                                      )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      {initialResources.map((res) => (
                                        <ResourcePill key={res.name} resource={res} />
                                      ))}
                                      {showMoreResources &&
                                        remainingResources.map((res) => (
                                          <ResourcePill key={res.name} resource={res} />
                                        ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </>
            );
          })()}
        </div>

        {/* Milestone Project Card for Stage */}
        {currentPhase.build && (
          <div className="p-4 rounded-xl border border-amber-500/25 bg-amber-500/[0.03] flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
              <FolderGit2 className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                Stage Milestone Project
              </span>
              <p className="text-xs sm:text-sm text-foreground font-medium mt-0.5 leading-relaxed">
                {currentPhase.build}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
