"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  Compass,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Target,
  Zap,
  Map,
  Layers,
  FolderKanban,
  ClipboardCheck,
  ShieldAlert,
  HelpCircle,
  LayoutDashboard,
} from "lucide-react";

import {
  getCareerIntelligence,
  getAllCareerIntelligence,
  type CareerIntelligence,
} from "@/lib/career-intelligence";
import { getCareerHierarchy } from "@/lib/career-hierarchy";
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

import CareerReadinessMeter from "@/components/dashboard/CareerReadinessMeter";
import AdaptiveSprintList from "@/components/dashboard/AdaptiveSprintList";
import SkillMasteryMatrix from "@/components/dashboard/SkillMasteryMatrix";
import StudyPaceSelector from "@/components/dashboard/StudyPaceSelector";
import ProjectPortfolioTracker from "@/components/dashboard/ProjectPortfolioTracker";
import RoadmapStagePanel from "@/components/dashboard/RoadmapStagePanel";
import { CountUp } from "@/components/ui/CountUp";

interface CustomTask {
  id: string;
  text: string;
  category: string;
  done: boolean;
}

type DashboardTab = "overview" | "roadmap" | "skills" | "projects" | "prep";

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

function skillId(phaseName: string, skillName: string): string {
  return `${phaseName.toLowerCase().replace(/\s+/g, "-")}-${skillName
    .toLowerCase()
    .replace(/\s+/g, "-")}`;
}

export default function DashboardPage() {
  const isClient = useIsClient();
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [selectedSlug, setSelectedSlug] = useState<string>("software-development");
  const [completedPhases, setCompletedPhases] = useState<Set<number>>(new Set());
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [completedSkills, setCompletedSkills] = useState<Set<string>>(new Set());
  const [completedProjects, setCompletedProjects] = useState<Set<string>>(new Set());
  const [weeklyPaceHours, setWeeklyPaceHours] = useState<number>(10);
  const [customTasks, setCustomTasks] = useState<CustomTask[]>([]);
  const [startedDate, setStartedDate] = useState<string>("");
  const [showCareerSelector, setShowCareerSelector] = useState(false);
  const [showSprintDetail, setShowSprintDetail] = useState(false);
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);
  const [traitProfile, setTraitProfile] = useState<TraitProfile | null>(null);

  const allCareers = getAllCareerIntelligence();
  const career: CareerIntelligence = getCareerIntelligence(selectedSlug) || allCareers[0];
  const hierarchy = getCareerHierarchy(selectedSlug);
  const domainName = hierarchy?.domain?.name || career.category;

  // ── Route Protection: redirect unauthenticated users to /login ──
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  // ── Load progress from unified persistence engine ──
  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

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

      // Auto-open the first incomplete phase in the roadmap
      const completedPhaseNums = new Set(journey.progress.completedPhases);
      const resolvedSlug = journey.selectedCareer?.slug || "software-development";
      const resolvedCareer = getCareerIntelligence(resolvedSlug);
      const firstIncomplete = resolvedCareer?.roadmap.find(
        (p) => !completedPhaseNums.has(p.phase)
      );
      setExpandedPhase(firstIncomplete?.phase ?? resolvedCareer?.roadmap[0]?.phase ?? 1);
    } catch (e) {
      console.error("Error initializing dashboard data", e);
    }
  }, [isLoading, isAuthenticated, user?.id]);

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
      const resolvedCareer = getCareerIntelligence(slugToSave);
      saveCareerJourney({
        selectedCareer: {
          slug: slugToSave,
          title: resolvedCareer?.title || currentJourney.selectedCareer.title,
          careerName: resolvedCareer?.careerName || currentJourney.selectedCareer.careerName,
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

  const toggleSkill = (skillIdStr: string) => {
    const next = new Set(completedSkills);
    if (next.has(skillIdStr)) next.delete(skillIdStr);
    else next.add(skillIdStr);
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

  if (!isClient || isLoading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <p className="text-xs text-muted-foreground animate-pulse">
            Loading your personal learning command center...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // ── Compute Intelligence Engine Outputs (canonical pipeline) ──────
  const progressState: UserProgressState = {
    completedPhases: Array.from(completedPhases),
    completedTasks: Array.from(completedTasks),
    completedSkills: Array.from(completedSkills),
    completedProjects: Array.from(completedProjects),
    weeklyPaceHours,
  };

  const personalizedRoadmap: PersonalizedRoadmap = generatePersonalizedRoadmap({
    career,
    traitProfile,
    progress: progressState,
    weeklyPaceHours,
  });

  const _progressReport: CareerReadinessReport = calculateCareerProgressAndReadiness({
    career,
    traitProfile,
    progress: progressState,
    weeklyPaceHours,
    roadmap: personalizedRoadmap,
  });
  const readiness: CareerReadinessResult = _progressReport.compositeReadinessIndex;

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

  // ── Calculate Match Score from Assessment or Trait Profile ────────
  let matchPercentage: number | null = null;
  try {
    const journey = loadCareerJourney();
    const rawMatches = journey.assessment?.results?.top_careers || [];
    const directMatch = rawMatches.find(
      (m) =>
        m.career_name.toLowerCase().includes(career.careerName.toLowerCase()) ||
        career.careerName.toLowerCase().includes(m.career_name.toLowerCase()) ||
        m.career_name.toLowerCase().includes(career.title.toLowerCase()) ||
        career.title.toLowerCase().includes(m.career_name.toLowerCase()) ||
        m.career_name.toLowerCase().includes(career.slug.toLowerCase())
    );

    if (directMatch) {
      matchPercentage = Math.round(directMatch.match_percentage);
    } else if (traitProfile && career.primaryTraits && career.primaryTraits.length > 0) {
      const scores = career.primaryTraits.map((t) => (traitProfile as Record<string, number>)[t] ?? 0);
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      matchPercentage = Math.round(avg);
    }
  } catch {
    // fallback
  }

  // ── Roadmap Task & Phase Progression Calculations ─────────────────
  const allPhaseSkills = career.roadmap.flatMap((p) =>
    p.skills.map((s) => skillId(p.title, s))
  );
  const totalPhaseSkillsCount = allPhaseSkills.length;
  const completedPhaseSkillsCount = allPhaseSkills.filter((id) =>
    completedSkills.has(id)
  ).length;

  // Total tasks = milestones (curriculum skills + stage checkpoints)
  const totalTasksCount =
    personalizedRoadmap.milestones?.length ||
    totalPhaseSkillsCount + career.roadmap.length;
  const completedTasksCount =
    _progressReport.milestones.completedMilestonesCount ||
    completedPhaseSkillsCount + completedPhases.size;

  const overallRoadmapPercent =
    _progressReport.roadmap.completionPercentage ||
    (totalTasksCount > 0
      ? Math.round((completedTasksCount / totalTasksCount) * 100)
      : 0);

  // Active Focus Phase (first incomplete or stage 1)
  const currentPhase =
    career.roadmap.find((p) => !completedPhases.has(p.phase)) || career.roadmap[0];
  const currentPhaseSkillIds = currentPhase.skills.map((s) =>
    skillId(currentPhase.title, s)
  );
  const currentPhaseMasteredSkills = currentPhaseSkillIds.filter((id) =>
    completedSkills.has(id)
  ).length;
  const currentPhasePercent = completedPhases.has(currentPhase.phase)
    ? 100
    : currentPhaseSkillIds.length > 0
    ? Math.round((currentPhaseMasteredSkills / currentPhaseSkillIds.length) * 100)
    : 0;

  // Top 5 active skills calculation
  const top5Skills = personalizedSkills.slice(0, 5);

  const getSkillPercent = (skill: PersonalizedSkill): number => {
    if (completedSkills.has(skill.id)) return 100;
    if (traitProfile && skill.relevantTraits && skill.relevantTraits.length > 0) {
      const scores = skill.relevantTraits.map(
        (t) => (traitProfile as Record<string, number>)[t] ?? 0
      );
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      return Math.min(95, Math.max(15, Math.round(avg)));
    }
    if (skill.status === "strong") return 80;
    if (skill.status === "developing") return 55;
    return 30;
  };

  // Projects calculations
  const currentProject =
    career.projects.find((p) => !completedProjects.has(p.title)) || career.projects[0];
  const completedProjectsCount = completedProjects.size;
  const totalProjectsCount = career.projects.length;
  const projectProgressPercent =
    totalProjectsCount > 0
      ? Math.round((completedProjectsCount / totalProjectsCount) * 100)
      : 0;

  // Career prep calculations
  const completedPrepCount = career.preparation.filter((p) =>
    completedTasks.has(p.id)
  ).length;
  const totalPrepCount = career.preparation.length;
  const prepPercent =
    totalPrepCount > 0
      ? Math.round((completedPrepCount / totalPrepCount) * 100)
      : 0;

  // Sprint task counts
  const sprintCompletedCount =
    sprintTasks.filter((t) => t.done).length +
    customTasks.filter((t) => t.done).length;
  const sprintTotalCount = sprintTasks.length + customTasks.length;

  // ── Unified Action Handler ────────────────────────────────────────
  const handleActionClick = (targetType: string, targetId: string | number) => {
    if (targetType === "phase") {
      setActiveTab("roadmap");
      setExpandedPhase(Number(targetId));
      setTimeout(() => {
        const el = document.getElementById("roadmap-phases");
        el?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    } else if (targetType === "project") {
      setActiveTab("projects");
      setTimeout(() => {
        const el = document.getElementById("portfolio-projects");
        el?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    } else if (targetType === "skill") {
      const targetPhase = career.roadmap.find((p) =>
        p.skills.some(
          (s) =>
            skillId(p.title, s) === targetId ||
            s.toLowerCase().includes(String(targetId).toLowerCase())
        )
      );
      if (targetPhase) {
        setActiveTab("roadmap");
        setExpandedPhase(targetPhase.phase);
      } else {
        setActiveTab("skills");
      }
      setTimeout(() => {
        const el = document.getElementById("skill-matrix");
        el?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    } else if (targetType === "prep") {
      setActiveTab("prep");
      setTimeout(() => {
        const el = document.getElementById("job-prep");
        el?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    } else {
      setActiveTab("roadmap");
      setExpandedPhase(currentPhase.phase);
    }
  };

  const IconComponent =
    (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[
      career.icon
    ] ?? Compass;

  return (
    <div className="min-h-screen bg-background text-foreground pb-28">
      {/* ── Top Utility Bar ─────────────────────────────────────────── */}
      <div className="border-b border-border/80 bg-background/80 backdrop-blur-md sticky top-14 z-30">
        <div className="container mx-auto px-4 py-3 max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
            <span className="text-border">|</span>
            <span className="text-xs font-semibold text-primary">
              Personal Learning Command Center
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/coach"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/15 text-xs font-semibold text-primary hover:bg-primary/25 transition-all shadow-xs"
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
                          : "border-border bg-[#161412] text-foreground hover:bg-[#1E1A16] hover:border-border"
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

        {/* ── Secondary Navigation Bar (Requirement 11) ─────────────── */}
        <div className="border-t border-border/60 bg-[#12100E]">
          <div className="container mx-auto px-4 max-w-6xl flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none py-2">
            {[
              { id: "overview", label: "Overview", icon: LayoutDashboard, count: null },
              {
                id: "roadmap",
                label: "Roadmap",
                icon: Map,
                count: `${completedPhases.size}/${career.roadmap.length}`,
              },
              {
                id: "skills",
                label: "Skills",
                icon: Layers,
                count: `${completedSkills.size}/${totalPhaseSkillsCount || career.skills.length}`,
              },
              {
                id: "projects",
                label: "Projects",
                icon: FolderKanban,
                count: `${completedProjects.size}/${career.projects.length}`,
              },
              {
                id: "prep",
                label: "Career Preparation",
                icon: Target,
                count: `${completedPrepCount}/${career.preparation.length}`,
              },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const TabIcon = tab.icon;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as DashboardTab);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary text-white shadow-xs shadow-primary/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-[#1A1714]"
                  }`}
                >
                  <TabIcon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                  {tab.count && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? "bg-white/20 text-white font-bold"
                          : "bg-[#1E1A16] text-muted-foreground"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl pt-6 sm:pt-8 space-y-8">
        {/* ══════════════════════════════════════════════════════════════
            TAB 1: OVERVIEW (Personal Learning Command Center)
           ══════════════════════════════════════════════════════════════ */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* 1. HERO / SUMMARY (Requirements 1 & 2) */}
            <div className="rounded-2xl border border-border bg-linear-to-b from-[#161412] to-card p-6 sm:p-8 space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-border/70">
                <div className="flex items-start gap-4">
                  <div className="p-3.5 rounded-2xl bg-primary/10 border border-primary/25 text-primary shrink-0">
                    <IconComponent className="h-7 w-7" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-primary">
                        Career Direction
                      </span>
                      <span className="text-border">•</span>
                      <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
                        {domainName}
                      </span>
                      <span className="text-border">•</span>
                      <span className="text-xs text-muted-foreground">
                        Started {startedDate || "Recently"}
                      </span>
                      {traitProfile ? (
                        <>
                          <span className="text-border hidden sm:inline">•</span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/25 text-[10px] font-mono font-semibold text-primary">
                            <Sparkles className="h-3 w-3" />
                            Adaptive Mode Active
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-border hidden sm:inline">•</span>
                          <Link
                            href="/assessment"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-mono font-semibold text-primary hover:underline"
                          >
                            Take Assessment →
                          </Link>
                        </>
                      )}
                    </div>
                    <div className="flex flex-wrap items-baseline gap-3">
                      <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                        {career.title}
                      </h1>
                      {matchPercentage !== null ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-primary/15 border border-primary/30 text-xs font-mono font-bold text-primary">
                          {matchPercentage}% Match
                        </span>
                      ) : (
                        <Link
                          href="/assessment"
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-card border border-border text-xs font-mono text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
                        >
                          Assessment Pending
                        </Link>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-secondary-foreground max-w-2xl leading-relaxed mt-1">
                      {career.tagline}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start lg:self-center">
                  <Link
                    href={`/career/${career.slug}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-[#161412] text-xs font-semibold text-foreground hover:bg-[#1E1A16] hover:border-primary/40 transition-all"
                  >
                    <span>Career Guide</span>
                    <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                  </Link>
                </div>
              </div>

              {/* 4 Core Questions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {/* Question 1: What career path am I following? */}
                <div className="p-4 rounded-xl border border-border/70 bg-[#141210] flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                      1. Career Path
                    </span>
                    <p className="font-heading text-sm font-bold text-foreground truncate">
                      {career.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                      {domainName}
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-border/50 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground text-[11px]">Match:</span>
                    <span className="font-mono font-bold text-primary">
                      {matchPercentage !== null ? `${matchPercentage}%` : "Pending"}
                    </span>
                  </div>
                </div>

                {/* Question 2: Where am I currently? */}
                <div className="p-4 rounded-xl border border-border/70 bg-[#141210] flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                      2. Current Focus
                    </span>
                    <p className="font-heading text-sm font-bold text-primary truncate">
                      Stage {currentPhase.phase}: {currentPhase.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                      {currentPhasePercent}% of stage complete
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-border/50 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground text-[11px]">Stage Status:</span>
                    <span className="font-mono font-semibold text-primary">Active</span>
                  </div>
                </div>

                {/* Question 3: What should I do next? */}
                <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-primary flex items-center gap-1 mb-1">
                      <Zap className="h-3 w-3" />
                      3. Next Best Action
                    </span>
                    <p className="font-heading text-sm font-bold text-foreground line-clamp-1">
                      {nextBestAction.title}
                    </p>
                    <p className="text-[11px] text-secondary-foreground line-clamp-1 mt-0.5">
                      {nextBestAction.subtitle}
                    </p>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-primary/20 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground text-[11px]">Est. Time:</span>
                    <span className="font-mono font-semibold text-primary">
                      {nextBestAction.estimatedTime}
                    </span>
                  </div>
                </div>

                {/* Question 4: How far have I progressed? */}
                <div className="p-4 rounded-xl border border-border/70 bg-[#141210] flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                      4. Roadmap Progress
                    </span>
                    <div className="flex items-baseline justify-between">
                      <span className="font-heading text-xl sm:text-2xl font-bold text-foreground tabular-nums">
                        {overallRoadmapPercent}%
                      </span>
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {completedTasksCount} / {totalTasksCount} tasks
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2.5 border-t border-border/50">
                    <div className="h-1.5 w-full rounded-full bg-[#1E1A16] overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${overallRoadmapPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
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
                        ? "border-primary/30 bg-primary/5 text-primary"
                        : insight.type === "bridge"
                        ? "border-amber-500/30 bg-amber-500/5 text-amber-300"
                        : "border-border bg-card text-secondary-foreground"
                    }`}
                  >
                    {insight.type === "fast-track" ? (
                      <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
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

            {/* 2. PRIMARY ACTION AREA: CURRENT FOCUS (Requirements 3 & 4) */}
            <div className="rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-[#1A1612] via-[#141210] to-[#1A1612] p-6 sm:p-8 shadow-xl shadow-primary/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none -mt-20 -mr-20" />

              <div className="relative z-10 space-y-6">
                {/* Section Header */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-xs font-bold font-mono uppercase tracking-wider text-primary">
                      <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      Current Focus
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">
                      Stage {currentPhase.phase} of {career.roadmap.length}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-primary">
                    {currentPhasePercent}% Complete
                  </span>
                </div>

                {/* Stage Title & Progress */}
                <div className="space-y-2">
                  <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground uppercase tracking-tight">
                    {currentPhase.title}
                  </h2>
                  <div className="h-2 w-full rounded-full bg-[#1E1A16] overflow-hidden border border-border/50">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-[#D4A853] rounded-full transition-all duration-700"
                      style={{ width: `${currentPhasePercent}%` }}
                    />
                  </div>
                </div>

                {/* Integrated Next Best Action Box */}
                <div className="rounded-xl border border-border/80 bg-[#161412]/90 p-5 sm:p-6 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                          Recommended Next Step
                        </span>
                        <span className="text-border">•</span>
                        <span className="inline-flex items-center gap-1 text-xs text-primary font-mono font-medium">
                          <Clock className="h-3 w-3" />
                          {nextBestAction.estimatedTime}
                        </span>
                        <span className="text-border">•</span>
                        <span className="text-xs font-medium text-muted-foreground capitalize">
                          {nextBestAction.category}
                        </span>
                      </div>

                      <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground leading-snug">
                        "{nextBestAction.title}"
                      </h3>

                      <p className="text-xs sm:text-sm text-secondary-foreground leading-relaxed">
                        {nextBestAction.subtitle}
                      </p>

                      <div className="pt-2 text-xs text-muted-foreground flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <p className="font-sans leading-relaxed">
                          <span className="font-semibold text-foreground/90 font-mono text-[11px] uppercase tracking-wider block sm:inline mr-1">
                            Why this now:
                          </span>
                          {nextBestAction.reasoning}
                        </p>
                      </div>
                    </div>

                    {/* Dominant CTA Button */}
                    <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 md:min-w-[200px] justify-center">
                      <button
                        onClick={() =>
                          handleActionClick(
                            nextBestAction.targetType,
                            nextBestAction.targetId
                          )
                        }
                        className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-primary text-white font-bold text-sm shadow-xl shadow-primary/25 hover:bg-primary-hover hover:shadow-2xl hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer text-center"
                      >
                        <span>Continue Learning</span>
                        <ArrowRight className="h-4 w-4 stroke-[2.5]" />
                      </button>
                      <Link
                        href="/coach"
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-primary/30 bg-primary/10 text-xs font-semibold text-primary hover:bg-primary/20 transition-all text-center"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Ask AI Coach</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. CORE COMMAND BLOCKS: TWO-COLUMN EDITORIAL WORKSPACE (Requirement 18 & 20) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT COLUMN: Roadmap Summary & Adaptive Sprint (lg:col-span-7) */}
              <div className="lg:col-span-7 space-y-6">
                {/* ROADMAP SUMMARY (Requirement 5 & 16) */}
                <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-border/70">
                    <div className="flex items-center gap-2">
                      <Map className="h-5 w-5 text-primary" />
                      <h3 className="font-heading text-base sm:text-lg font-bold text-foreground">
                        Roadmap Summary
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-medium text-muted-foreground">
                      {completedPhases.size} of {career.roadmap.length} Stages Complete
                    </span>
                  </div>

                  <div className="divide-y divide-border/40">
                    {career.roadmap.map((phase) => {
                      const isCompleted = completedPhases.has(phase.phase);
                      const phaseSkillIds = phase.skills.map((s) =>
                        skillId(phase.title, s)
                      );
                      const masteredInPhase = phaseSkillIds.filter((id) =>
                        completedSkills.has(id)
                      ).length;
                      const phasePercent = isCompleted
                        ? 100
                        : phaseSkillIds.length > 0
                        ? Math.round(
                            (masteredInPhase / phaseSkillIds.length) * 100
                          )
                        : 0;
                      const isCurrent = currentPhase.phase === phase.phase;

                      return (
                        <button
                          key={phase.phase}
                          onClick={() => {
                            setActiveTab("roadmap");
                            setExpandedPhase(phase.phase);
                          }}
                          className={`w-full flex items-center justify-between py-3 px-3 rounded-lg text-left transition-colors cursor-pointer group ${
                            isCurrent
                              ? "bg-primary/10 border-l-2 border-l-primary"
                              : "hover:bg-[#161412]"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-xs font-mono font-medium text-muted-foreground w-5 shrink-0">
                              {phase.phase}.
                            </span>
                            <span
                              className={`text-sm font-semibold truncate ${
                                isCompleted
                                  ? "text-muted-foreground line-through"
                                  : isCurrent
                                  ? "text-primary"
                                  : "text-foreground group-hover:text-primary"
                              }`}
                            >
                              {phase.title.toUpperCase()}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {isCompleted ? (
                              <span className="inline-flex items-center gap-1 font-mono text-xs font-bold text-primary">
                                ✓
                              </span>
                            ) : (
                              <span
                                className={`font-mono text-xs font-semibold tabular-nums ${
                                  isCurrent ? "text-primary" : "text-muted-foreground"
                                }`}
                              >
                                {phasePercent}%
                              </span>
                            )}
                            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab("roadmap");
                      setExpandedPhase(currentPhase.phase);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-primary/30 bg-primary/10 text-primary font-semibold text-xs hover:bg-primary/20 transition-all cursor-pointer"
                  >
                    <span>Continue Roadmap</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* ADAPTIVE SPRINT (Requirement 13) */}
                <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-border/70">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      <h3 className="font-heading text-base font-bold text-foreground">
                        Current Sprint
                      </h3>
                    </div>
                    <span className="text-xs font-mono font-semibold text-primary">
                      {sprintCompletedCount} / {sprintTotalCount} Done
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Personalized milestones prioritized by your active stage (
                    {currentPhase.title}) and assessment gaps.
                  </p>

                  <div className="h-1.5 w-full rounded-full bg-[#1E1A16] overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          sprintTotalCount > 0
                            ? Math.round((sprintCompletedCount / sprintTotalCount) * 100)
                            : 0
                        }%`,
                      }}
                    />
                  </div>

                  <button
                    onClick={() => setShowSprintDetail(!showSprintDetail)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-[#161412] text-xs font-semibold text-foreground hover:bg-[#1E1A16] hover:border-primary/40 hover:text-primary transition-all cursor-pointer"
                  >
                    <span>
                      {showSprintDetail ? "Collapse Sprint ↑" : "View Sprint →"}
                    </span>
                  </button>

                  <AnimatePresence>
                    {showSprintDetail && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden pt-2"
                      >
                        <AdaptiveSprintList
                          tasks={sprintTasks}
                          customTasks={customTasks}
                          onToggleTask={toggleTask}
                          onAddCustomTask={handleAddCustomTask}
                          onToggleCustomTask={toggleCustomTask}
                          onDeleteCustomTask={deleteCustomTask}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* RIGHT COLUMN: Readiness, Study Pace, Skills, Projects, Prep (lg:col-span-5) */}
              <div className="lg:col-span-5 space-y-6">
                {/* CAREER READINESS (Requirement 10) */}
                <CareerReadinessMeter
                  readiness={readiness}
                  activeCareerTitle={career.title}
                  compact={true}
                />

                {/* STUDY PACE SELECTOR (Requirement 9) */}
                <StudyPaceSelector
                  weeklyHours={weeklyPaceHours}
                  onChangePace={handleChangePace}
                  paceInfo={paceInfo}
                  compact={true}
                />

                {/* SKILLS PREVIEW (Requirement 6) */}
                <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-border/70">
                    <div className="flex items-center gap-2">
                      <Layers className="h-5 w-5 text-primary" />
                      <h3 className="font-heading text-base font-bold text-foreground">
                        Skills
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {completedSkills.size} of{" "}
                      {totalPhaseSkillsCount || career.skills.length} Mastered
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Top active skills for {career.title}:
                  </p>

                  <div className="space-y-3">
                    {top5Skills.map((skill) => {
                      const isMastered = completedSkills.has(skill.id);
                      const percent = getSkillPercent(skill);

                      return (
                        <div key={skill.id} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span
                              className={`font-medium truncate ${
                                isMastered ? "text-muted-foreground" : "text-foreground"
                              }`}
                            >
                              {skill.name}
                            </span>
                            <span className="font-mono text-[11px] font-semibold text-primary tabular-nums">
                              {percent}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-[#1E1A16] overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all duration-500"
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setActiveTab("skills")}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-[#161412] text-xs font-semibold text-foreground hover:bg-[#1E1A16] hover:border-primary/40 hover:text-primary transition-all cursor-pointer"
                  >
                    <span>View All Skills</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* PROJECTS PREVIEW (Requirement 7) */}
                <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-border/70">
                    <div className="flex items-center gap-2">
                      <FolderKanban className="h-5 w-5 text-primary" />
                      <h3 className="font-heading text-base font-bold text-foreground">
                        Projects
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {completedProjectsCount} of {totalProjectsCount} Built
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#161412] border border-border/60 space-y-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-0.5">
                        Current Project:
                      </span>
                      <p className="font-heading text-sm font-bold text-foreground leading-snug">
                        {currentProject.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 capitalize">
                          {currentProject.difficulty}
                        </span>
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {currentProject.description}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border/40 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Portfolio Progress:</span>
                        <span className="font-mono font-semibold text-primary tabular-nums">
                          {projectProgressPercent}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-[#1E1A16] overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${projectProgressPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab("projects")}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-[#161412] text-xs font-semibold text-foreground hover:bg-[#1E1A16] hover:border-primary/40 hover:text-primary transition-all cursor-pointer"
                  >
                    <span>View Projects</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* CAREER PREPARATION PREVIEW (Requirement 8) */}
                <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-border/70">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      <h3 className="font-heading text-base font-bold text-foreground">
                        Career Preparation
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-muted-foreground">
                      {completedPrepCount} of {totalPrepCount} Done
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#161412] border border-border/60">
                      <span className="text-muted-foreground">Interview Readiness</span>
                      <span className="font-mono font-semibold text-primary">
                        {readiness.pillars.foundations.score}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#161412] border border-border/60">
                      <span className="text-muted-foreground">Portfolio Readiness</span>
                      <span className="font-mono font-semibold text-primary">
                        {readiness.pillars.portfolio.score}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#161412] border border-border/60">
                      <span className="text-muted-foreground">Preparation Progress</span>
                      <span className="font-mono font-semibold text-primary">
                        {prepPercent}%
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab("prep")}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-[#161412] text-xs font-semibold text-foreground hover:bg-[#1E1A16] hover:border-primary/40 hover:text-primary transition-all cursor-pointer"
                  >
                    <span>View Career Preparation</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 2: DETAILED ROADMAP (Phase 3 Learning Journey)
           ══════════════════════════════════════════════════════════════ */}
        {activeTab === "roadmap" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/70">
              <div>
                <button
                  onClick={() => setActiveTab("overview")}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mb-1 cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back to Overview</span>
                </button>
                <h2 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
                  <Map className="h-6 w-6 text-primary" />
                  Detailed Learning Roadmap
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Phased curriculum from initial fundamentals to full industry readiness for {career.title}.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs font-mono font-semibold px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
                  <CountUp value={completedPhases.size} duration={0.8} /> of{" "}
                  {career.roadmap.length} Stages Complete
                </span>
              </div>
            </div>

            <div id="roadmap-phases" className="space-y-3">
              {career.roadmap.map((phase, idx) => (
                <RoadmapStagePanel
                  key={phase.phase}
                  phase={phase}
                  phaseIndex={idx}
                  totalPhases={career.roadmap.length}
                  isCompleted={completedPhases.has(phase.phase)}
                  isActive={expandedPhase === phase.phase}
                  completedSkills={completedSkills}
                  onTogglePhase={(phaseNum) => {
                    togglePhase(phaseNum);
                    const updatedCompleted = new Set(completedPhases);
                    if (updatedCompleted.has(phaseNum)) {
                      updatedCompleted.delete(phaseNum);
                    } else {
                      updatedCompleted.add(phaseNum);
                      const next = career.roadmap.find(
                        (p) => !updatedCompleted.has(p.phase) && p.phase > phaseNum
                      );
                      if (next) setExpandedPhase(next.phase);
                    }
                  }}
                  onToggleSkill={toggleSkill}
                />
              ))}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 3: SKILLS (Full SkillMasteryMatrix)
           ══════════════════════════════════════════════════════════════ */}
        {activeTab === "skills" && (
          <div className="space-y-6">
            <button
              onClick={() => setActiveTab("overview")}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Overview</span>
            </button>

            <div id="skill-matrix">
              <SkillMasteryMatrix
                skills={personalizedSkills}
                completedSkills={Array.from(completedSkills)}
                onToggleSkill={toggleSkill}
                hasAssessment={!!traitProfile}
              />
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 4: PROJECTS (Full ProjectPortfolioTracker)
           ══════════════════════════════════════════════════════════════ */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <button
              onClick={() => setActiveTab("overview")}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Overview</span>
            </button>

            <div id="portfolio-projects">
              <ProjectPortfolioTracker
                projects={career.projects}
                completedProjects={Array.from(completedProjects)}
                onToggleProject={toggleProject}
              />
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            TAB 5: CAREER PREPARATION (Job & Internship Readiness Checklist)
           ══════════════════════════════════════════════════════════════ */}
        {activeTab === "prep" && (
          <div className="space-y-6">
            <button
              onClick={() => setActiveTab("overview")}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Overview</span>
            </button>

            <div id="job-prep" className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/70">
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
                  {completedPrepCount} of {career.preparation.length} Done
                </span>
              </div>

              {/* Progress bar */}
              <div className="rounded-xl border border-border/80 bg-card p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Readiness Completion</span>
                  <span className="font-mono font-semibold text-primary">{prepPercent}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-[#1E1A16] overflow-hidden border border-border/50">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-[#D4A853] rounded-full transition-all duration-500"
                    style={{ width: `${prepPercent}%` }}
                  />
                </div>
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
                          ? "border-primary/30 bg-[#161412]/80"
                          : "border-border bg-card hover:border-primary/40 hover:bg-card-hover"
                      }`}
                    >
                      <button type="button" className="mt-0.5 shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="h-5 w-5 text-primary fill-primary/20" />
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
                            isDone
                              ? "text-muted-foreground line-through"
                              : "text-foreground"
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
