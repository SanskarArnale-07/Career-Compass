"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import {
  Compass,
  ArrowLeft,
  CheckCircle2,
  Circle,
  BookOpen,
  ChevronDown,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Target,
  ShieldAlert,
  HelpCircle,
} from "lucide-react";

import {
  getCareerIntelligence,
  getAllCareerIntelligence,
  type CareerIntelligence,
} from "@/lib/career-intelligence";
import {
  generatePersonalizedRoadmap,
  type PersonalizedRoadmap,
} from "@/lib/roadmap-engine";
import {
  calculateCareerProgressAndReadiness,
  type CareerReadinessReport,
} from "@/lib/progress-engine";
import {
  generateAdaptiveRecommendations,
  mapRecommendationToNextBestAction,
} from "@/lib/recommendation-engine";

import {
  generateAdaptiveWeeklySprint,
  getAdaptiveInsights,
  calculateTimeToReadiness,
  type UserProgressState,
  type CareerReadinessResult,
  type NextBestAction,
  type SprintTask,
  type AdaptiveInsight,
  type TimeToReadinessResult,
} from "@/lib/career-details/roadmap-intelligence";

import {
  type TraitProfile,
  getPersonalizedSkills,
  type PersonalizedSkill,
} from "@/lib/career-details/personalization";
import {
  loadCareerJourney,
  saveCareerJourney,
  resetCareerJourney,
  setSelectedCareer as persistSelectedCareer,
} from "@/lib/persistence";

import NextBestActionCard from "@/components/dashboard/NextBestActionCard";
import CareerReadinessMeter from "@/components/dashboard/CareerReadinessMeter";
import AdaptiveSprintList from "@/components/dashboard/AdaptiveSprintList";
import SkillMasteryMatrix from "@/components/dashboard/SkillMasteryMatrix";
import StudyPaceSelector from "@/components/dashboard/StudyPaceSelector";
import ProjectPortfolioTracker from "@/components/dashboard/ProjectPortfolioTracker";
import { CountUp } from "@/components/ui/CountUp";

interface CustomTask {
  id: string;
  text: string;
  category: string;
  done: boolean;
}

const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

function getTimestamp(): number {
  return Date.now();
}

function createCustomTaskId(): string {
  return `custom_${Date.now()}`;
}

export default function DashboardPage() {
  const isClient = useIsClient();
  const [selectedSlug, setSelectedSlug] = useState<string>("software-development");
  const [completedPhases, setCompletedPhases] = useState<Set<number>>(new Set());
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [completedSkills, setCompletedSkills] = useState<Set<string>>(new Set());
  const [completedProjects, setCompletedProjects] = useState<Set<string>>(new Set());
  const [weeklyPaceHours, setWeeklyPaceHours] = useState<number>(10);
  const [customTasks, setCustomTasks] = useState<CustomTask[]>([]);
  const [startedDate, setStartedDate] = useState<string>("");
  const [showCareerSelector, setShowCareerSelector] = useState(false);
  const [expandedPhase, setExpandedPhase] = useState<number | null>(1);
  const [traitProfile, setTraitProfile] = useState<TraitProfile | null>(null);

  const allCareers = getAllCareerIntelligence();
  const career: CareerIntelligence = getCareerIntelligence(selectedSlug) || allCareers[0];

  // ── Load progress from unified persistence engine ──
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const journey = loadCareerJourney();

        // 1. Restore assessment traits
        if (journey.assessment.traitProfile) {
          setTraitProfile(journey.assessment.traitProfile);
        }

        // 2. Restore selected career & started timestamp
        if (journey.selectedCareer?.slug) {
          setSelectedSlug(journey.selectedCareer.slug);
          setStartedDate(
            new Date(journey.selectedCareer.startedAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          );
        }

        // 3. Restore source progress
        setCompletedPhases(new Set(journey.progress.completedPhases));
        setCompletedTasks(new Set(journey.progress.completedTasks));
        setCompletedSkills(new Set(journey.progress.completedSkills));
        setCompletedProjects(new Set(journey.progress.completedProjects));
        setWeeklyPaceHours(journey.progress.weeklyPaceHours);
        setCustomTasks(journey.progress.customTasks);
      } catch (e) {
        console.error("Error initializing dashboard data", e);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // ── Save updates to unified persistence ─────────────────────────
  const saveProgress = (
    slugToSave: string,
    phases: Set<number>,
    tasks: Set<string>,
    skills: Set<string>,
    projects: Set<string>,
    pace: number,
    customList: CustomTask[]
  ) => {
    try {
      const currentJourney = loadCareerJourney();
      const now = getTimestamp();
      saveCareerJourney({
        selectedCareer: {
          slug: slugToSave,
          title: career.title,
          careerName: career.careerName,
          startedAt: currentJourney.selectedCareer.startedAt || now,
          lastActiveAt: now,
        },
        progress: {
          completedPhases: Array.from(phases),
          completedTasks: Array.from(tasks),
          completedSkills: Array.from(skills),
          completedProjects: Array.from(projects),
          weeklyPaceHours: pace,
          customTasks: customList,
        },
      });
    } catch (e) {
      console.error("Failed to save progress", e);
    }
  };

  const handleSelectCareer = (newSlug: string) => {
    setSelectedSlug(newSlug);
    setShowCareerSelector(false);
    persistSelectedCareer(newSlug);
    saveProgress(
      newSlug,
      completedPhases,
      completedTasks,
      completedSkills,
      completedProjects,
      weeklyPaceHours,
      customTasks
    );
  };

  const togglePhase = (phaseNum: number) => {
    const next = new Set(completedPhases);
    if (next.has(phaseNum)) next.delete(phaseNum);
    else next.add(phaseNum);
    setCompletedPhases(next);
    saveProgress(
      selectedSlug,
      next,
      completedTasks,
      completedSkills,
      completedProjects,
      weeklyPaceHours,
      customTasks
    );
  };

  const toggleTask = (taskId: string) => {
    const next = new Set(completedTasks);
    if (next.has(taskId)) next.delete(taskId);
    else next.add(taskId);
    setCompletedTasks(next);
    saveProgress(
      selectedSlug,
      completedPhases,
      next,
      completedSkills,
      completedProjects,
      weeklyPaceHours,
      customTasks
    );
  };

  const toggleSkill = (skillId: string) => {
    const next = new Set(completedSkills);
    if (next.has(skillId)) next.delete(skillId);
    else next.add(skillId);
    setCompletedSkills(next);
    saveProgress(
      selectedSlug,
      completedPhases,
      completedTasks,
      next,
      completedProjects,
      weeklyPaceHours,
      customTasks
    );
  };

  const toggleProject = (projectTitle: string) => {
    const next = new Set(completedProjects);
    if (next.has(projectTitle)) next.delete(projectTitle);
    else next.add(projectTitle);
    setCompletedProjects(next);
    saveProgress(
      selectedSlug,
      completedPhases,
      completedTasks,
      completedSkills,
      next,
      weeklyPaceHours,
      customTasks
    );
  };

  const handleChangePace = (pace: number) => {
    setWeeklyPaceHours(pace);
    saveProgress(
      selectedSlug,
      completedPhases,
      completedTasks,
      completedSkills,
      completedProjects,
      pace,
      customTasks
    );
  };

  const handleAddCustomTask = (text: string) => {
    const newTask: CustomTask = {
      id: createCustomTaskId(),
      text,
      category: "Personal Goal",
      done: false,
    };
    const updated = [...customTasks, newTask];
    setCustomTasks(updated);
    saveProgress(
      selectedSlug,
      completedPhases,
      completedTasks,
      completedSkills,
      completedProjects,
      weeklyPaceHours,
      updated
    );
  };

  const toggleCustomTask = (id: string) => {
    const updated = customTasks.map((t) =>
      t.id === id ? { ...t, done: !t.done } : t
    );
    setCustomTasks(updated);
    saveProgress(
      selectedSlug,
      completedPhases,
      completedTasks,
      completedSkills,
      completedProjects,
      weeklyPaceHours,
      updated
    );
  };

  const deleteCustomTask = (id: string) => {
    const updated = customTasks.filter((t) => t.id !== id);
    setCustomTasks(updated);
    saveProgress(
      selectedSlug,
      completedPhases,
      completedTasks,
      completedSkills,
      completedProjects,
      weeklyPaceHours,
      updated
    );
  };

  const handleResetProgress = () => {
    if (
      window.confirm(
        "Are you sure you want to reset your dashboard progress for this career?"
      )
    ) {
      setCompletedPhases(new Set());
      setCompletedTasks(new Set());
      setCompletedSkills(new Set());
      setCompletedProjects(new Set());
      setCustomTasks([]);
      resetCareerJourney({ keepAssessment: true });
    }
  };

  const handleActionClick = (targetType: string, targetId: string | number) => {
    if (targetType === "phase") {
      setExpandedPhase(Number(targetId));
      const el = document.getElementById("roadmap-phases");
      el?.scrollIntoView({ behavior: "smooth" });
    } else if (targetType === "project") {
      const el = document.getElementById("portfolio-projects");
      el?.scrollIntoView({ behavior: "smooth" });
    } else if (targetType === "skill") {
      const el = document.getElementById("skill-matrix");
      el?.scrollIntoView({ behavior: "smooth" });
    } else if (targetType === "prep") {
      const el = document.getElementById("job-prep");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!isClient) return null;

  // ── Compute Intelligence Engine Outputs (canonical pipeline) ──────
  const progressState: UserProgressState = {
    completedPhases: Array.from(completedPhases),
    completedTasks: Array.from(completedTasks),
    completedSkills: Array.from(completedSkills),
    completedProjects: Array.from(completedProjects),
    weeklyPaceHours,
  };

  // Canonical roadmap (generated first, fed into progress + recommendation engines)
  const personalizedRoadmap: PersonalizedRoadmap = generatePersonalizedRoadmap({
    career,
    traitProfile,
    progress: progressState,
    weeklyPaceHours,
  });

  // Canonical progress report (includes composite readiness index)
  const _progressReport: CareerReadinessReport = calculateCareerProgressAndReadiness({
    career,
    traitProfile,
    progress: progressState,
    weeklyPaceHours,
    roadmap: personalizedRoadmap,
  });
  const readiness: CareerReadinessResult = _progressReport.compositeReadinessIndex;

  // Canonical recommendation engine (includes next-best-action)
  const _recsResult = generateAdaptiveRecommendations({
    career,
    traitProfile,
    progress: progressState,
    roadmap: personalizedRoadmap,
    progressReport: _progressReport,
    weeklyPaceHours,
  });
  const nextBestAction: NextBestAction = mapRecommendationToNextBestAction(
    _recsResult.primaryRecommendation
  );

  // Legacy functions still uniquely provided (no canonical equivalent)
  const sprintTasks: SprintTask[] = generateAdaptiveWeeklySprint(
    career,
    traitProfile,
    progressState
  );

  const adaptiveInsights: AdaptiveInsight[] = getAdaptiveInsights(
    career,
    traitProfile
  );

  const paceInfo: TimeToReadinessResult = calculateTimeToReadiness(
    career,
    progressState,
    weeklyPaceHours
  );

  const personalizedSkills: PersonalizedSkill[] = traitProfile
    ? getPersonalizedSkills(traitProfile, career)
    : career.skills.map((s, idx) => ({
        ...s,
        status: idx === 0 ? ("strong" as const) : ("developing" as const),
      }));

  const IconComponent =
    (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[
      career.icon
    ] ?? Compass;

  return (
    <div className="min-h-screen bg-background text-foreground pb-28">
      {/* Top Utility Bar */}
      <div className="border-b border-border/80 bg-background/80 backdrop-blur-md sticky top-14 z-30">
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
              Adaptive Intelligence Dashboard
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/coach"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/15 text-xs font-semibold text-primary hover:bg-primary/25 transition-all shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Ask AI Coach</span>
            </Link>
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

        {/* Dropdown Career Selector menu */}
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
        {/* Header: Current Focus & Personalization Mode */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-2xl border border-border bg-linear-to-r from-card via-[#0F172A] to-card">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/25 text-primary shrink-0">
              <IconComponent className="h-7 w-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-primary font-mono">
                  Active Career Goal
                </span>
                <span className="text-border">•</span>
                <span className="text-xs text-muted-foreground">
                  Started {startedDate || "Recently"}
                </span>
                <span className="text-border">•</span>
                {traitProfile ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-semibold text-emerald-400">
                    <Sparkles className="h-3 w-3" />
                    Adaptive Mode Active
                  </span>
                ) : (
                  <Link
                    href="/assessment"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-mono font-semibold text-primary hover:underline"
                  >
                    Take Assessment for Personalization →
                  </Link>
                )}
                <span className="text-border hidden sm:inline">•</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono font-semibold text-blue-400 capitalize">
                  {personalizedRoadmap.studentLevel} • Stage: {personalizedRoadmap.completionState.activePhaseStage}
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

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/coach"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-md shadow-primary/20 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Ask AI Coach →</span>
            </Link>
            <Link
              href={`/career/${career.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-xs font-semibold text-foreground hover:bg-card-hover hover:border-primary/30 transition-all"
            >
              <span>View Guide</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Adaptive Insights (Fast-Track / Bridge Alerts) */}
        {adaptiveInsights.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {adaptiveInsights.map((insight, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border flex items-start gap-3 text-xs leading-relaxed ${
                  insight.type === "fast-track"
                    ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-300"
                    : insight.type === "bridge"
                    ? "border-amber-500/30 bg-amber-500/5 text-amber-300"
                    : "border-primary/25 bg-primary/5 text-secondary-foreground"
                }`}
              >
                {insight.type === "fast-track" ? (
                  <Sparkles className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : insight.type === "bridge" ? (
                  <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <HelpCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-bold font-mono uppercase tracking-wider block mb-0.5">
                    {insight.title}
                  </span>
                  <p className="text-foreground/90">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 1. SPOTLIGHT: "What Should I Do Next?" */}
        <section id="next-best-action" className="space-y-4">
          <NextBestActionCard
            action={nextBestAction}
            onActionClick={handleActionClick}
            hasAssessment={!!traitProfile}
          />

          {/* Career Compass AI Coach CTA Card */}
          <div className="rounded-2xl border border-primary/25 bg-linear-to-r from-card via-[#0F172A] to-primary/10 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-primary/5">
            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary shrink-0 shadow-sm">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-sm sm:text-base font-bold text-foreground">
                    Career Compass AI
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-primary/15 text-[10px] font-mono font-semibold text-primary border border-primary/20">
                    Online
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Have a question about your career path, roadmap, or next step?
                </p>
              </div>
            </div>
            <Link
              href="/coach"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all shrink-0"
            >
              <span>Ask AI Coach →</span>
            </Link>
          </div>
        </section>

        {/* 2. CAREER READINESS INDEX (3-Pillar Breakdown) */}
        <section id="readiness-index">
          <CareerReadinessMeter
            readiness={readiness}
            activeCareerTitle={career.title}
          />
        </section>

        {/* 3. ADAPTIVE SPRINT & PACE ESTIMATOR */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AdaptiveSprintList
              tasks={sprintTasks}
              customTasks={customTasks}
              onToggleTask={toggleTask}
              onAddCustomTask={handleAddCustomTask}
              onToggleCustomTask={toggleCustomTask}
              onDeleteCustomTask={deleteCustomTask}
            />
          </div>

          <div className="space-y-6">
            <StudyPaceSelector
              weeklyHours={weeklyPaceHours}
              onChangePace={handleChangePace}
              paceInfo={paceInfo}
            />

            {/* Quick Links Card */}
            <div className="p-5 rounded-2xl border border-border bg-card space-y-3">
              <h3 className="font-heading text-sm font-bold text-foreground">
                Toolkit &amp; Navigation
              </h3>
              <div className="space-y-1.5 text-xs">
                <Link
                  href="/coach"
                  className="flex items-center justify-between p-2.5 rounded-lg border border-primary/30 bg-primary/10 text-primary font-semibold hover:bg-primary/20 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Ask Career Compass AI</span>
                  </span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href={`/career/${career.slug}`}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-[#0F172A] text-foreground hover:border-primary/40 hover:text-primary transition-colors"
                >
                  <span>Complete {career.title} Guide</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/results"
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-[#0F172A] text-foreground hover:border-primary/40 hover:text-primary transition-colors"
                >
                  <span>Assessment Results &amp; Strengths</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/careers"
                  className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-[#0F172A] text-foreground hover:border-primary/40 hover:text-primary transition-colors"
                >
                  <span>Explore All Careers</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4. SKILL MASTERY & GAP CLOSER */}
        <section id="skill-matrix">
          <SkillMasteryMatrix
            skills={personalizedSkills}
            completedSkills={Array.from(completedSkills)}
            onToggleSkill={toggleSkill}
            hasAssessment={!!traitProfile}
          />
        </section>

        {/* 5. PORTFOLIO PROJECT MILESTONES */}
        <section id="portfolio-projects">
          <ProjectPortfolioTracker
            projects={career.projects}
            completedProjects={Array.from(completedProjects)}
            onToggleProject={toggleProject}
          />
        </section>

        {/* 6. PHASED ROADMAP TIMELINE */}
        <section id="roadmap-phases" className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border/70">
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Phased Learning Roadmap
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Structured curriculum from foundations to advanced mastery.
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-muted-foreground">
              <CountUp value={completedPhases.size} duration={0.8} /> of {career.roadmap.length} Completed
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
                  <div
                    onClick={() =>
                      setExpandedPhase(isExpanded ? null : phase.phase)
                    }
                    className="p-5 flex items-start sm:items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3.5">
                      <button
                        type="button"
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

                  {isExpanded && (
                    <div className="px-5 pb-6 pt-2 border-t border-border/60 bg-[#0F172A]/40 space-y-4">
                      <p className="text-xs sm:text-sm text-secondary-foreground leading-relaxed">
                        {phase.description}
                      </p>

                      {/* Key Skills */}
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

                      {/* Capstone Build */}
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
                            Curated Learning Resources
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
        </section>

        {/* 7. JOB & INTERNSHIP PREPARATION CHECKLIST */}
        <section id="job-prep" className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border/70">
            <div>
              <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Job &amp; Internship Readiness Checklist
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Preparation milestones for landing interviews and professional roles.
              </p>
            </div>
            <span className="text-xs font-mono font-medium text-muted-foreground">
              {career.preparation.filter((p) => completedTasks.has(p.id)).length} of{" "}
              {career.preparation.length} Done
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {career.preparation.map((item) => {
              const isDone = completedTasks.has(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => toggleTask(item.id)}
                  className={`p-4 rounded-xl border flex items-start gap-3 transition-all cursor-pointer select-none ${
                    isDone
                      ? "border-emerald-500/25 bg-[#0F172A]/80"
                      : "border-border bg-card hover:border-primary/40 hover:bg-card-hover"
                  }`}
                >
                  <button type="button" className="mt-0.5 shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400 fill-emerald-400/20" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground block mb-0.5">
                      {item.category}
                    </span>
                    <h4
                      className={`text-xs sm:text-sm font-semibold mb-1 transition-colors ${
                        isDone ? "text-muted-foreground line-through" : "text-foreground"
                      }`}
                    >
                      {item.task}
                    </h4>
                    <p className="text-xs text-secondary-foreground/80 leading-relaxed">
                      {item.details}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
