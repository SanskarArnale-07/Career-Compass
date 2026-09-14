"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import {
  Compass,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Calendar,
  Zap,
  Target,
  BookOpen,
  Award,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  RotateCcw,
  ExternalLink,
} from "lucide-react";

import {
  getCareerBySlug,
  getAllCareers,
  type CareerDetail,
} from "@/lib/career-details";

interface WeeklyTask {
  id: string;
  text: string;
  category: string;
  done: boolean;
}

interface StoredProgress {
  currentCareer?: {
    slug: string;
    title: string;
    careerName: string;
    startedAt: number;
  };
  completedTasks: string[];
  completedPhases: number[];
  customTasks?: WeeklyTask[];
}

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false);
  const [selectedSlug, setSelectedSlug] = useState<string>("software-development");
  const [completedPhases, setCompletedPhases] = useState<Set<number>>(new Set());
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [customTasks, setCustomTasks] = useState<WeeklyTask[]>([]);
  const [newTaskInput, setNewTaskInput] = useState("");
  const [startedDate, setStartedDate] = useState<string>("");
  const [showCareerSelector, setShowCareerSelector] = useState(false);
  const [expandedPhase, setExpandedPhase] = useState<number | null>(1);

  const allCareers = getAllCareers();
  const career: CareerDetail = getCareerBySlug(selectedSlug) || allCareers[0];

  // ── Load progress from localStorage ─────────────────────────────
  useEffect(() => {
    setIsClient(true);
    try {
      // 1. Check if progress exists in localStorage
      const stored = localStorage.getItem("careerCompassProgress");
      if (stored) {
        const data: StoredProgress = JSON.parse(stored);
        if (data.currentCareer?.slug) {
          setSelectedSlug(data.currentCareer.slug);
          if (data.currentCareer.startedAt) {
            setStartedDate(
              new Date(data.currentCareer.startedAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            );
          }
        }
        if (data.completedPhases) {
          setCompletedPhases(new Set(data.completedPhases));
        }
        if (data.completedTasks) {
          setCompletedTasks(new Set(data.completedTasks));
        }
        if (data.customTasks) {
          setCustomTasks(data.customTasks);
        }
      } else {
        // 2. Try checking assessment results for top career
        const resultsStr = sessionStorage.getItem("careerCompassResults");
        if (resultsStr) {
          const results = JSON.parse(resultsStr);
          if (results.top_careers?.[0]) {
            const topCareerName = results.top_careers[0].career_name;
            const match = allCareers.find(
              (c) => c.careerName.toLowerCase() === topCareerName.toLowerCase()
            );
            if (match) {
              setSelectedSlug(match.slug);
            }
          }
        }
        setStartedDate(
          new Date().toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        );
      }
    } catch (e) {
      console.error("Error loading progress from storage", e);
    }
  }, []);

  // ── Save updates to localStorage ────────────────────────────────
  const saveProgress = (
    slugToSave: string,
    phases: Set<number>,
    tasks: Set<string>,
    customList: WeeklyTask[]
  ) => {
    try {
      const payload: StoredProgress = {
        currentCareer: {
          slug: slugToSave,
          title: career.title,
          careerName: career.careerName,
          startedAt: Date.now(),
        },
        completedPhases: Array.from(phases),
        completedTasks: Array.from(tasks),
        customTasks: customList,
      };
      localStorage.setItem("careerCompassProgress", JSON.stringify(payload));
    } catch (e) {
      console.error("Failed to save progress to localStorage", e);
    }
  };

  const handleSelectCareer = (newSlug: string) => {
    setSelectedSlug(newSlug);
    setShowCareerSelector(false);
    saveProgress(newSlug, completedPhases, completedTasks, customTasks);
  };

  const togglePhase = (phaseNum: number) => {
    const next = new Set(completedPhases);
    if (next.has(phaseNum)) {
      next.delete(phaseNum);
    } else {
      next.add(phaseNum);
    }
    setCompletedPhases(next);
    saveProgress(selectedSlug, next, completedTasks, customTasks);
  };

  const toggleTask = (taskId: string) => {
    const next = new Set(completedTasks);
    if (next.has(taskId)) {
      next.delete(taskId);
    } else {
      next.add(taskId);
    }
    setCompletedTasks(next);
    saveProgress(selectedSlug, completedPhases, next, customTasks);
  };

  const handleAddCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;

    const newTask: WeeklyTask = {
      id: `custom_${Date.now()}`,
      text: newTaskInput.trim(),
      category: "Personal Goal",
      done: false,
    };
    const updated = [...customTasks, newTask];
    setCustomTasks(updated);
    setNewTaskInput("");
    saveProgress(selectedSlug, completedPhases, completedTasks, updated);
  };

  const toggleCustomTask = (id: string) => {
    const updated = customTasks.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t
    );
    setCustomTasks(updated);
    saveProgress(selectedSlug, completedPhases, completedTasks, updated);
  };

  const deleteCustomTask = (id: string) => {
    const updated = customTasks.filter((t) => t.id !== id);
    setCustomTasks(updated);
    saveProgress(selectedSlug, completedPhases, completedTasks, updated);
  };

  const handleResetProgress = () => {
    if (
      window.confirm(
        "Are you sure you want to reset your dashboard progress for this career?"
      )
    ) {
      setCompletedPhases(new Set());
      setCompletedTasks(new Set());
      setCustomTasks([]);
      localStorage.removeItem("careerCompassProgress");
    }
  };

  if (!isClient) return null;

  // ── Compute metrics ─────────────────────────────────────────────
  const totalPhases = career.roadmap.length || 1;
  const phasePercent = Math.round((completedPhases.size / totalPhases) * 100);

  // Derive initial tasks from Phase 1 or Job Prep
  const defaultActionItems = [
    {
      id: `${career.slug}_p1_fundamentals`,
      text: `Master Phase 1 fundamentals: ${career.roadmap[0]?.title || "Core concepts"}`,
      category: "Foundations",
    },
    {
      id: `${career.slug}_project_1`,
      text: `Build first beginner project: ${career.projects[0]?.title || "Portfolio project"}`,
      category: "Projects",
    },
    {
      id: `${career.slug}_prep_setup`,
      text: career.preparation[0]?.task || "Setup professional profile and development environment",
      category: "Preparation",
    },
    {
      id: `${career.slug}_dsa_practice`,
      text: "Dedicate 3–5 hours this week to deliberate practice and coursework",
      category: "Routine",
    },
  ];

  const totalBuiltinTasks = defaultActionItems.length;
  const completedBuiltin = defaultActionItems.filter((t) =>
    completedTasks.has(t.id)
  ).length;

  const totalCustom = customTasks.length;
  const completedCustom = customTasks.filter((t) => t.done).length;

  const totalAllTasks = totalBuiltinTasks + totalCustom;
  const completedAllTasks = completedBuiltin + completedCustom;

  const overallScore = Math.round(
    phasePercent * 0.6 + (totalAllTasks > 0 ? (completedAllTasks / totalAllTasks) * 40 : 0)
  );

  let currentLevel = "Beginner Explorer";
  if (overallScore >= 75) currentLevel = "Career Ready & Applied";
  else if (overallScore >= 40) currentLevel = "Active Apprentice";
  else if (overallScore >= 15) currentLevel = "Foundations in Progress";

  const Icon =
    (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[
      career.icon
    ] ?? Compass;

  return (
    <div className="min-h-screen bg-background text-foreground pb-28">
      {/* Top Bar */}
      <div className="border-b border-border/80 bg-background/80 backdrop-blur-md sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3 max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/career/${career.slug}`}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Career Details</span>
            </Link>
            <span className="text-border">|</span>
            <span className="text-xs font-semibold text-primary">
              Roadmap Dashboard
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCareerSelector(!showCareerSelector)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-foreground hover:bg-card-hover hover:border-primary/30 transition-colors cursor-pointer"
            >
              <span>Switch Career</span>
              <ChevronDown className="h-3.5 w-3.5 opacity-60" />
            </button>
            <button
              onClick={handleResetProgress}
              title="Reset progress"
              className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-destructive hover:border-destructive/30 transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Dropdown Career Selector modal / menu */}
        <AnimatePresence>
          {showCareerSelector && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-border bg-card/95 backdrop-blur-md px-4 py-4"
            >
              <div className="container mx-auto max-w-6xl">
                <p className="text-xs font-mono font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                  Select a career roadmap to track:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  {allCareers.map((c) => (
                    <button
                      key={c.slug}
                      onClick={() => handleSelectCareer(c.slug)}
                      className={`text-left p-2.5 rounded-lg border text-xs font-medium transition-all ${
                        c.slug === selectedSlug
                          ? "bg-primary/15 border-primary text-primary font-semibold"
                          : "border-border bg-[#0F172A] text-foreground hover:bg-card-hover hover:border-border"
                      }`}
                    >
                      <div className="truncate">{c.title}</div>
                      <div className="text-[10px] text-muted-foreground truncate">
                        {c.category}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="container mx-auto px-4 max-w-6xl pt-8 space-y-8">
        {/* Header: Current Focus */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl border border-border bg-gradient-to-r from-card via-[#0F172A] to-card">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/25 text-primary shrink-0">
              <Icon className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-primary font-mono">
                  Active Career Goal
                </span>
                <span className="text-border">•</span>
                <span className="text-xs text-muted-foreground">
                  Started {startedDate || "Recently"}
                </span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                {career.title}
              </h1>
              <p className="text-sm text-secondary-foreground mt-1 max-w-xl">
                {career.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={`/career/${career.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-xs font-semibold text-foreground hover:bg-card-hover hover:border-primary/30 transition-all"
            >
              <span>View Full Guide</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Overall Progress */}
          <div className="p-5 rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground font-mono uppercase tracking-wider">
                Overall Progress
              </span>
              <Award className="h-4 w-4 text-primary" />
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="font-heading text-3xl font-bold text-foreground">
                {overallScore}%
              </span>
              <span className="text-xs text-muted-foreground">completed</span>
            </div>
            <div className="w-full bg-[#0F172A] rounded-full h-2 overflow-hidden border border-border/50">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(4, overallScore))}%` }}
              />
            </div>
          </div>

          {/* Card 2: Current Stage */}
          <div className="p-5 rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground font-mono uppercase tracking-wider">
                Current Level
              </span>
              <Target className="h-4 w-4 text-secondary" />
            </div>
            <div className="mb-1">
              <span className="font-heading text-xl font-bold text-foreground">
                {currentLevel}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {completedPhases.size} of {totalPhases} roadmap phases completed
            </p>
          </div>

          {/* Card 3: Action Milestones */}
          <div className="p-5 rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground font-mono uppercase tracking-wider">
                Milestones Done
              </span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-heading text-3xl font-bold text-foreground">
                {completedAllTasks}
                <span className="text-base text-muted-foreground font-normal">
                  /{totalAllTasks}
                </span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {totalAllTasks - completedAllTasks > 0
                ? `${totalAllTasks - completedAllTasks} pending tasks this cycle`
                : "All weekly goals achieved!"}
            </p>
          </div>
        </div>

        {/* Main 2-column layout: Roadmap Progress (left) + Action Checklist (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT 2 COLS: Phase-by-Phase Timeline */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Roadmap Phases
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Click a phase to inspect topics, practice tasks, and mark off
                  completion.
                </p>
              </div>
              <span className="text-xs font-mono font-medium text-muted-foreground">
                {completedPhases.size}/{totalPhases} Finished
              </span>
            </div>

            <div className="space-y-4">
              {career.roadmap.map((phase) => {
                const isCompleted = completedPhases.has(phase.phase);
                const isExpanded = expandedPhase === phase.phase;

                return (
                  <div
                    key={phase.phase}
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isCompleted
                        ? "border-emerald-500/30 bg-card/60"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    {/* Phase Header Accordion */}
                    <div
                      onClick={() =>
                        setExpandedPhase(isExpanded ? null : phase.phase)
                      }
                      className="p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePhase(phase.phase);
                          }}
                          className="shrink-0 transition-transform active:scale-90 cursor-pointer"
                          title={
                            isCompleted ? "Mark in-progress" : "Mark as completed"
                          }
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-6 w-6 text-emerald-400 fill-emerald-400/20" />
                          ) : (
                            <Circle className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                          )}
                        </button>

                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                              Phase {phase.phase}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono bg-primary/10 text-primary border border-primary/20">
                              {phase.estimatedDuration}
                            </span>
                          </div>
                          <h3
                            className={`font-heading text-base font-bold transition-colors ${
                              isCompleted
                                ? "text-emerald-300 line-through opacity-80"
                                : "text-foreground"
                            }`}
                          >
                            {phase.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-muted-foreground hidden sm:inline font-sans">
                          {isCompleted ? "Completed" : "In Progress"}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                            isExpanded ? "rotate-180 text-foreground" : ""
                          }`}
                        />
                      </div>
                    </div>

                    {/* Phase Expanded Details */}
                    {isExpanded && (
                      <div className="px-5 pb-6 pt-2 border-t border-border/60 bg-[#0F172A]/40 space-y-4">
                        <p className="text-xs sm:text-sm text-secondary-foreground leading-relaxed">
                          {phase.description}
                        </p>

                        {/* Learn Points */}
                        <div>
                          <p className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                            Key Skills &amp; Concepts
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {phase.skills.map((skill) => (
                              <span
                                key={skill}
                                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-card border border-border text-foreground"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Practical Build Task */}
                        {phase.build && (
                          <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20">
                            <p className="text-xs font-mono font-semibold text-primary uppercase tracking-wider mb-1">
                              Phase Milestone Project
                            </p>
                            <p className="text-xs text-foreground font-medium">
                              {phase.build}
                            </p>
                          </div>
                        )}

                        {/* Resources */}
                        {phase.resources && phase.resources.length > 0 && (
                          <div>
                            <p className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                              Recommended Resources
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {phase.resources.map((res) => (
                                <a
                                  key={res.name}
                                  href={res.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2.5 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-card-hover transition-colors flex items-center justify-between group"
                                >
                                  <div className="truncate mr-2">
                                    <p className="text-xs font-medium text-foreground group-hover:text-primary transition-colors truncate">
                                      {res.name}
                                    </p>
                                    <span className="text-[10px] text-muted-foreground font-mono uppercase">
                                      {res.type} • {res.estimatedTime}
                                    </span>
                                  </div>
                                  <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary shrink-0" />
                                </a>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Bottom action inside phase */}
                        <div className="pt-2 flex justify-end">
                          <button
                            onClick={() => togglePhase(phase.phase)}
                            className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                              isCompleted
                                ? "border border-border bg-card text-muted-foreground hover:text-foreground"
                                : "bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm"
                            }`}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>
                              {isCompleted
                                ? "Mark as Incomplete"
                                : "Mark Phase Complete"}
                            </span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT 1 COL: Weekly Action Focus & Custom Tasks */}
          <div className="space-y-6">
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <Zap className="h-5 w-5 text-secondary" />
                This Week&apos;s Focus
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Concrete bite-sized goals to make consistent forward progress.
              </p>
            </div>

            {/* Checklist Card */}
            <div className="p-5 rounded-2xl border border-border bg-card space-y-4">
              {/* Built-in Tasks */}
              <div className="space-y-2.5">
                {defaultActionItems.map((task) => {
                  const isDone = completedTasks.has(task.id);
                  return (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className={`p-3 rounded-xl border flex items-start gap-3 transition-all cursor-pointer select-none ${
                        isDone
                          ? "border-emerald-500/25 bg-emerald-500/5"
                          : "border-border bg-[#0F172A] hover:border-primary/30"
                      }`}
                    >
                      <button className="mt-0.5 shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground block mb-0.5">
                          {task.category}
                        </span>
                        <p
                          className={`text-xs font-medium leading-relaxed ${
                            isDone
                              ? "text-muted-foreground line-through"
                              : "text-foreground"
                          }`}
                        >
                          {task.text}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* Custom Tasks */}
                {customTasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                      task.done
                        ? "border-emerald-500/25 bg-emerald-500/5"
                        : "border-border bg-[#0F172A] hover:border-primary/30"
                    }`}
                  >
                    <button
                      onClick={() => toggleCustomTask(task.id)}
                      className="mt-0.5 shrink-0 cursor-pointer"
                    >
                      {task.done ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                    <div
                      onClick={() => toggleCustomTask(task.id)}
                      className="flex-1 min-w-0 cursor-pointer select-none"
                    >
                      <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground block mb-0.5">
                        {task.category}
                      </span>
                      <p
                        className={`text-xs font-medium leading-relaxed ${
                          task.done
                            ? "text-muted-foreground line-through"
                            : "text-foreground"
                        }`}
                      >
                        {task.text}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteCustomTask(task.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors shrink-0 p-0.5"
                      title="Delete task"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Custom Task Form */}
              <form onSubmit={handleAddCustomTask} className="pt-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    placeholder="Add a milestone or project task..."
                    className="flex-1 px-3 py-2 rounded-xl bg-[#0F172A] border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shrink-0 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Career Links Card */}
            <div className="p-5 rounded-2xl border border-border bg-card space-y-3">
              <h3 className="font-heading text-sm font-bold text-foreground">
                Quick Navigation
              </h3>
              <div className="space-y-1.5 text-xs">
                <Link
                  href={`/career/${career.slug}`}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-[#0F172A] text-foreground hover:border-primary/40 hover:text-primary transition-colors"
                >
                  <span>Complete {career.title} Guide</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/results"
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-[#0F172A] text-foreground hover:border-primary/40 hover:text-primary transition-colors"
                >
                  <span>Assessment Results &amp; Strengths</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/careers"
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-[#0F172A] text-foreground hover:border-primary/40 hover:text-primary transition-colors"
                >
                  <span>Explore Other Career Paths</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
