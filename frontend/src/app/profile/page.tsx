"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  Circle,
  Sparkles,
  Target,
  BookOpen,
  Layers,
  Flame,
  Trophy,
  Map,
  User,
  ExternalLink,
  LogOut,
  LayoutDashboard,
  ClipboardCheck,
  GitBranch,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import {
  loadCareerJourney,
  type CareerJourneySourceData,
} from "@/lib/persistence";
import {
  getCareerIntelligence,
  getAllCareerIntelligence,
} from "@/lib/career-intelligence";
import { getCareerHierarchy } from "@/lib/career-hierarchy";
import { getCareerIcon } from "@/lib/career-icons";
import {
  CAREER_MATCH_THRESHOLD,
  getRecommendedCareers,
  getTieredCareerMatches,
} from "@/lib/constants/matching";
import type { CareerMatch } from "@/lib/types/assessment";

// ── SSR-safe hooks ───────────────────────────────────────────────────
const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

// ── Helper: initials from name ───────────────────────────────────────
function getInitials(name: string): string {
  return name
    .trim()
    .split(" ")
    .map((w) => w[0]?.toUpperCase() ?? "")
    .slice(0, 2)
    .join("");
}

// ── Helper: format relative date ────────────────────────────────────
function formatStartedDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Skill ID helper (mirrors RoadmapStagePanel) ───────────────────────
function skillId(phaseName: string, skillName: string): string {
  return `${phaseName.toLowerCase().replace(/\s+/g, "-")}-${skillName
    .toLowerCase()
    .replace(/\s+/g, "-")}`;
}

// ── Stat Card ────────────────────────────────────────────────────────
function StatCard({
  value,
  label,
  accent = false,
}: {
  value: string | number;
  label: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-card border border-border/70 min-w-0">
      <span
        className={`font-heading text-2xl font-bold tabular-nums leading-none ${
          accent ? "text-primary" : "text-foreground"
        }`}
      >
        {value}
      </span>
      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mt-1 text-center leading-tight">
        {label}
      </span>
    </div>
  );
}

// ── Progress Bar ─────────────────────────────────────────────────────
function ProgressBar({
  percent,
  label,
  sublabel,
  accent = true,
}: {
  percent: number;
  label: string;
  sublabel?: string;
  accent?: boolean;
}) {
  const clamped = Math.min(100, Math.max(0, Math.round(percent)));
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground leading-snug">{label}</span>
        <span
          className={`font-mono font-semibold tabular-nums ${
            accent ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {clamped}%
        </span>
      </div>
      {sublabel && (
        <p className="text-[10px] text-muted-foreground">{sublabel}</p>
      )}
      <div className="h-1.5 w-full rounded-full bg-[#10141A] overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className={`h-full rounded-full ${
            accent ? "bg-primary" : "bg-muted-foreground/40"
          }`}
        />
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────
export default function ProfilePage() {
  const isClient = useIsClient();
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const [journey, setJourney] = useState<CareerJourneySourceData | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "roadmap" | "skills" | "activity"
  >("overview");

  // Auth guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=/profile");
    }
  }, [isLoading, isAuthenticated, router]);

  // Load journey data
  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    try {
      setJourney(loadCareerJourney());
    } catch {
      setJourney(null);
    }
  }, [isLoading, isAuthenticated, user?.id]);

  // ── Loading state ─────────────────────────────────────────────────
  if (!isClient || isLoading) {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <p className="text-xs text-muted-foreground animate-pulse">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) return null;

  // ── Derived data ──────────────────────────────────────────────────
  const assessment = journey?.assessment;
  const assessmentDone = assessment?.completed ?? false;
  const results = assessment?.results ?? null;

  const selectedSlug = journey?.selectedCareer?.slug ?? "software-development";
  const career = getCareerIntelligence(selectedSlug);
  const hierarchy = getCareerHierarchy(selectedSlug);

  const progress = journey?.progress;
  const completedPhasesSet = new Set(progress?.completedPhases ?? []);
  const completedSkillsSet = new Set(progress?.completedSkills ?? []);
  const completedTasksSet = new Set(progress?.completedTasks ?? []);
  const completedProjectsSet = new Set(progress?.completedProjects ?? []);

  // Career matches (tiered by threshold: Strong >= 40%, Exploring >= 25%)
  const rawMatches: CareerMatch[] = results?.top_careers ?? [];
  const { allVisibleMatches } = getTieredCareerMatches(rawMatches);
  const qualifiedMatches = allVisibleMatches;

  // Roadmap progress
  const totalPhases = career?.roadmap?.length ?? 0;
  const completedPhases = completedPhasesSet.size;

  // Total skills across all phases
  const allSkillIds = career
    ? career.roadmap.flatMap((phase) =>
        phase.skills.map((s) => skillId(phase.title, s))
      )
    : [];
  const totalSkills = allSkillIds.length;
  const masteredSkills = allSkillIds.filter((id) =>
    completedSkillsSet.has(id)
  ).length;

  // Overall roadmap percent (phases + skills equally weighted)
  const phasePercent =
    totalPhases > 0 ? (completedPhases / totalPhases) * 100 : 0;
  const skillPercent =
    totalSkills > 0 ? (masteredSkills / totalSkills) * 100 : 0;
  const overallPercent = Math.round((phasePercent + skillPercent) / 2);

  // Current active phase (first incomplete)
  const currentPhase = career?.roadmap.find(
    (p) => !completedPhasesSet.has(p.phase)
  );

  // Tasks done (preparation items)
  const totalPrep = career?.preparation?.length ?? 0;
  const completedPrep = (progress?.completedTasks ?? []).filter((id) =>
    career?.preparation?.some((p) => p.id === id)
  ).length;

  // Projects
  const totalProjects = career?.projects?.length ?? 0;
  const completedProjectsCount = completedProjectsSet.size;

  // Top career match (for profile header)
  const topMatch = qualifiedMatches[0];
  const topCareerIntel = topMatch
    ? getCareerIntelligence(topMatch.career_name)
    : null;
  const displayHierarchy = topCareerIntel
    ? getCareerHierarchy(topCareerIntel.slug)
    : hierarchy;

  // Per-phase skill progress for the skills tab
  const phaseSkillProgress = career?.roadmap.map((phase) => {
    const phaseSkillIds = phase.skills.map((s) => skillId(phase.title, s));
    const done = phaseSkillIds.filter((id) => completedSkillsSet.has(id)).length;
    return {
      phase,
      total: phaseSkillIds.length,
      done,
      percent: phaseSkillIds.length > 0 ? (done / phaseSkillIds.length) * 100 : 0,
    };
  }) ?? [];

  // Streak / activity — no per-event timestamps, show honest state
  const hasAnyActivity =
    completedPhases > 0 || masteredSkills > 0 || completedPrep > 0;

  // ── NEW USER: No assessment done ─────────────────────────────────
  if (!assessmentDone) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-20">
        <ProfileTopBar user={user} onLogout={logout} />
        <div className="container mx-auto px-4 max-w-2xl pt-20 pb-12 text-center">
          <div className="mb-8 flex justify-center">
            <div className="h-20 w-20 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center text-primary text-3xl font-bold font-heading">
              {getInitials(user.name)}
            </div>
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
            {user.name}
          </h1>
          <p className="text-sm text-muted-foreground mb-10">{user.email}</p>

          <div className="p-8 rounded-2xl border border-border bg-card space-y-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto">
              <Compass className="h-6 w-6" />
            </div>
            <h2 className="font-heading text-xl font-bold text-foreground">
              Your Career Journey Hasn&apos;t Started Yet
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Complete the 5-minute assessment to discover your career direction,
              get personalized match scores, and unlock your adaptive roadmap.
            </p>
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary-hover shadow-md shadow-primary/20 transition-all mt-2"
            >
              <Sparkles className="h-4 w-4" />
              Take the Assessment
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── FULL PROFILE ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <ProfileTopBar user={user} onLogout={logout} />

      <div className="container mx-auto px-4 max-w-5xl pt-8 space-y-6">

        {/* ── PROFILE HEADER ─────────────────────────────────── */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-5">
            {/* Avatar */}
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary font-heading text-2xl font-bold shrink-0">
              {getInitials(user.name)}
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0">
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                {user.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">{user.email}</p>

              {/* Career Direction */}
              <div className="mt-4 flex flex-wrap gap-2">
                {displayHierarchy && (
                  <>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141920] border border-border text-xs font-mono text-muted-foreground">
                      <Layers className="h-3 w-3 text-primary/70" />
                      {displayHierarchy.domain.name}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-xs font-mono text-primary font-semibold">
                      {displayHierarchy.path.name}
                    </span>
                  </>
                )}
                {topMatch && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 border border-primary/25 text-xs font-mono font-semibold text-primary">
                    <CheckCircle2 className="h-3 w-3" />
                    {topMatch.match_percentage}% match
                  </span>
                )}
              </div>

              {/* Started date */}
              {journey?.selectedCareer?.startedAt && (
                <p className="text-[11px] text-muted-foreground/70 font-mono mt-3">
                  Journey started{" "}
                  {formatStartedDate(journey.selectedCareer.startedAt)}
                </p>
              )}
            </div>

            {/* Quick actions */}
            <div className="flex flex-row sm:flex-col gap-2 shrink-0">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-primary/30 bg-primary/10 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                My Roadmap
              </Link>
              <Link
                href="/results"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-card text-xs font-medium text-muted-foreground hover:text-foreground hover:border-border transition-colors"
              >
                <ClipboardCheck className="h-3.5 w-3.5" />
                Results
              </Link>
            </div>
          </div>
        </div>

        {/* ── OVERALL PROGRESS BANNER ────────────────────────── */}
        <div className="rounded-2xl border border-primary/25 bg-card p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Roadmap Progress
              </p>
              <div className="flex items-baseline gap-2">
                <span className="font-heading text-4xl font-bold text-primary tabular-nums">
                  {overallPercent}%
                </span>
                <span className="text-sm text-muted-foreground font-light">
                  overall completion
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-mono">
                {completedPhases} / {totalPhases} stages
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                {masteredSkills} / {totalSkills} skills mastered
              </p>
              {currentPhase && (
                <p className="text-[10px] text-primary font-mono mt-1">
                  Current: {currentPhase.title}
                </p>
              )}
            </div>
          </div>
          <div className="h-2 w-full rounded-full bg-[#10141A] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallPercent}%` }}
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="h-full rounded-full bg-primary"
            />
          </div>
        </div>

        {/* ── STATS ROW ──────────────────────────────────────── */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          <StatCard
            value={completedPhases}
            label="Stages Done"
            accent={completedPhases > 0}
          />
          <StatCard
            value={masteredSkills}
            label="Skills Mastered"
            accent={masteredSkills > 0}
          />
          <StatCard value={completedPrep} label="Tasks Done" />
          <StatCard
            value={currentPhase ? `S${currentPhase.phase}` : "—"}
            label="Active Stage"
            accent
          />
          <StatCard
            value={`${progress?.weeklyPaceHours ?? 10}h`}
            label="Weekly Pace"
          />
        </div>

        {/* ── TAB NAVIGATION ─────────────────────────────────── */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#10141A] border border-border/70 w-full sm:w-auto">
          {(
            [
              { id: "overview", label: "Overview", icon: User },
              { id: "roadmap", label: "Journey", icon: Map },
              { id: "skills", label: "Skills", icon: Layers },
              { id: "activity", label: "Activity", icon: Flame },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                activeTab === id
                  ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════ */}
        {/* TAB: OVERVIEW                                         */}
        {/* ══════════════════════════════════════════════════════ */}
        {activeTab === "overview" && (
          <div className="space-y-5">
            {/* Career Direction detail */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                  Career Direction
                </p>
                {topMatch && (
                  <span className="px-2 py-0.5 rounded-full bg-primary/15 border border-primary/25 text-xs font-mono font-bold text-primary">
                    {Math.round(topMatch.match_percentage)}% Match
                  </span>
                )}
              </div>

              {displayHierarchy ? (
                <div className="space-y-4">
                  {/* Visual Hierarchy Trail */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3.5 rounded-xl bg-[#10141A] border border-border/80">
                    <Link
                      href={`/career-map?domain=${displayHierarchy.domain.id}`}
                      className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                    >
                      <Layers className="h-3 w-3 text-primary" />
                      <span>{displayHierarchy.domain.name}</span>
                    </Link>

                    <span className="text-muted-foreground/40 text-xs hidden sm:inline">↓</span>

                    <Link
                      href={`/career/${displayHierarchy.path.slug}`}
                      className="text-xs font-bold text-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                    >
                      <GitBranch className="h-3 w-3 text-primary" />
                      <span>{displayHierarchy.path.name}</span>
                    </Link>

                    {displayHierarchy.primarySpecialization && (
                      <>
                        <span className="text-muted-foreground/40 text-xs hidden sm:inline">↓</span>
                        <Link
                          href={`/career-map?domain=${displayHierarchy.domain.id}&path=${displayHierarchy.path.slug}&spec=${displayHierarchy.primarySpecialization.id}`}
                          className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                        >
                          <Circle className="h-1.5 w-1.5 fill-primary text-primary" />
                          <span>{displayHierarchy.primarySpecialization.name}</span>
                        </Link>
                      </>
                    )}
                  </div>

                  {/* Roadmap and Tree Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-muted-foreground">
                        Roadmap Progress:
                      </span>
                      <span className="text-xs font-mono font-bold text-primary">
                        {overallPercent}%
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/career-map?domain=${displayHierarchy.domain.id}&path=${displayHierarchy.path.slug}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-[#141920] text-xs font-mono text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                      >
                        <GitBranch className="h-3 w-3" />
                        <span>Explore in Tree</span>
                      </Link>
                      <Link
                        href={`/career/${displayHierarchy.path.slug}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover transition-colors"
                      >
                        <span>Continue Roadmap</span>
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Assessment completed — career direction loading...
                </p>
              )}
            </div>

            {/* Career matches */}
            {qualifiedMatches.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                    Your Career Matches
                  </p>
                  <span className="text-[10px] font-mono text-muted-foreground/60">
                    Top career trajectories
                  </span>
                </div>
                <div className="space-y-3">
                  {qualifiedMatches.slice(0, 5).map((m) => {
                    const intel = getCareerIntelligence(m.career_name);
                    const IconComp = intel
                      ? getCareerIcon(intel.careerName)
                      : Compass;
                    return (
                      <div
                        key={m.career_name}
                        className="flex items-center gap-3"
                      >
                        <div className="h-7 w-7 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                          <IconComp className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-foreground truncate">
                              {intel?.title ?? m.career_name}
                            </span>
                            <span className="text-xs font-mono font-semibold text-primary ml-2 shrink-0">
                              {m.match_percentage}%
                            </span>
                          </div>
                          <div className="h-1 w-full rounded-full bg-[#10141A] overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${m.match_percentage}%`,
                              }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                              className="h-full rounded-full bg-primary/80"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Link
                  href="/results"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  View full assessment results
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            )}

            {/* Quick links */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
              <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                Navigate
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  {
                    href: "/dashboard",
                    icon: LayoutDashboard,
                    label: "My Roadmap Dashboard",
                    sub: "Full stage → skill → task journey",
                  },
                  {
                    href: "/results",
                    icon: ClipboardCheck,
                    label: "Assessment Results",
                    sub: "Trait profile & match scores",
                  },
                  {
                    href: `/career/${selectedSlug}`,
                    icon: BookOpen,
                    label: "Career Guide",
                    sub: career?.title ?? "Full career deep-dive",
                  },
                  {
                    href: "/coach",
                    icon: Sparkles,
                    label: "Career Coach AI",
                    sub: "Ask questions about your path",
                  },
                ].map(({ href, icon: Icon, label, sub }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-[#10141A] hover:border-primary/30 hover:bg-[#141920] transition-all group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {label}
                      </p>
                      <p className="text-[10px] text-muted-foreground truncate">
                        {sub}
                      </p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary ml-auto shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════ */}
        {/* TAB: ROADMAP (journey summary)                        */}
        {/* ══════════════════════════════════════════════════════ */}
        {activeTab === "roadmap" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-5">
                <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                  Career Journey — {career?.title}
                </p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline"
                >
                  Open full roadmap
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>

              {career && totalPhases > 0 ? (
                <div className="space-y-2">
                  {career.roadmap.map((phase, idx) => {
                    const isComplete = completedPhasesSet.has(phase.phase);
                    const isActive =
                      !isComplete &&
                      career.roadmap
                        .slice(0, idx)
                        .every((p) => completedPhasesSet.has(p.phase));

                    const phaseSkillIds = phase.skills.map((s) =>
                      skillId(phase.title, s)
                    );
                    const doneSkills = phaseSkillIds.filter((id) =>
                      completedSkillsSet.has(id)
                    ).length;
                    const pct =
                      isComplete
                        ? 100
                        : phaseSkillIds.length > 0
                        ? Math.round((doneSkills / phaseSkillIds.length) * 100)
                        : 0;

                    return (
                      <div
                        key={phase.phase}
                        className={`flex items-center gap-4 p-3.5 rounded-xl border transition-colors ${
                          isComplete
                            ? "border-border/70 bg-[#10141A]"
                            : isActive
                            ? "border-primary/40 bg-primary/10"
                            : "border-border/40 bg-[#0B0E12]"
                        }`}
                      >
                        {/* Stage indicator */}
                        <div
                          className={`h-7 w-7 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                            isComplete
                              ? "bg-[#141920] text-muted-foreground"
                              : isActive
                              ? "bg-primary/20 text-primary"
                              : "bg-[#141920] text-muted-foreground/60"
                          }`}
                        >
                          {isComplete ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            `S${phase.phase}`
                          )}
                        </div>

                        {/* Title + bar */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span
                              className={`text-xs font-medium truncate ${
                                isComplete
                                  ? "text-muted-foreground/80 line-through"
                                  : isActive
                                  ? "text-foreground font-semibold"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {phase.title}
                            </span>
                            <span
                              className={`text-[10px] font-mono ml-2 shrink-0 ${
                                isComplete
                                  ? "text-muted-foreground"
                                  : isActive
                                  ? "text-primary font-bold"
                                  : "text-muted-foreground/60"
                              }`}
                            >
                              {isComplete ? "Done" : `${pct}%`}
                            </span>
                          </div>
                          <div className="h-1 w-full rounded-full bg-[#10141A] overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isComplete
                                  ? "bg-muted-foreground/40 w-full"
                                  : "bg-primary"
                              }`}
                              style={
                                !isComplete ? { width: `${pct}%` } : undefined
                              }
                            />
                          </div>
                        </div>

                        {/* Duration badge */}
                        <span className="text-[10px] font-mono text-muted-foreground/60 shrink-0 hidden sm:inline">
                          {phase.estimatedDuration}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState
                  title="Roadmap not started"
                  sub="Your personalized roadmap is ready."
                  cta="Open Roadmap"
                  href="/dashboard"
                />
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════ */}
        {/* TAB: SKILLS                                           */}
        {/* ══════════════════════════════════════════════════════ */}
        {activeTab === "skills" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-5">
                Skill Mastery by Stage
              </p>

              {phaseSkillProgress.length > 0 ? (
                <div className="space-y-4">
                  {phaseSkillProgress.map(({ phase, total, done, percent }) => (
                    <ProgressBar
                      key={phase.phase}
                      label={phase.title}
                      percent={percent}
                      sublabel={`${done} / ${total} skills · ${phase.estimatedDuration}`}
                      accent={done > 0}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No skills tracked yet"
                  sub="Expand stages in your roadmap and mark skills as mastered."
                  cta="Go to Roadmap"
                  href="/dashboard"
                />
              )}
            </div>

            {/* Summary */}
            {totalSkills > 0 && (
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  Skill Summary
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <StatCard value={masteredSkills} label="Mastered" accent />
                  <StatCard
                    value={totalSkills - masteredSkills}
                    label="Remaining"
                  />
                  <StatCard
                    value={`${Math.round(skillPercent)}%`}
                    label="Complete"
                    accent
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════ */}
        {/* TAB: ACTIVITY                                         */}
        {/* ══════════════════════════════════════════════════════ */}
        {activeTab === "activity" && (
          <div className="space-y-4">
            {/* Streak */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border bg-card p-5 flex flex-col items-center gap-2">
                <Flame className="h-6 w-6 text-primary" />
                <span className="font-heading text-3xl font-bold text-foreground tabular-nums">
                  0
                </span>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground text-center">
                  Current Streak
                </p>
                <p className="text-[10px] text-muted-foreground/60 text-center">
                  days
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5 flex flex-col items-center gap-2">
                <Trophy className="h-6 w-6 text-primary/60" />
                <span className="font-heading text-3xl font-bold text-foreground tabular-nums">
                  0
                </span>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground text-center">
                  Longest Streak
                </p>
                <p className="text-[10px] text-muted-foreground/60 text-center">
                  days
                </p>
              </div>
            </div>

            {/* Activity heatmap — honest empty state */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Learning Activity
              </p>

              {hasAnyActivity ? (
                /* Partial info state — activity exists but no per-event timestamps */
                <div className="space-y-4">
                  <ActivityGrid />
                  <p className="text-[10px] text-muted-foreground/60 font-mono text-center">
                    Detailed daily activity tracking will be available in a
                    future update. Complete more roadmap tasks to build your
                    history.
                  </p>
                </div>
              ) : (
                <div className="py-10 text-center space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-[#10141A] border border-border flex items-center justify-center text-muted-foreground/40 mx-auto">
                    <Target className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    No learning activity yet
                  </p>
                  <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                    Complete roadmap tasks, mark skills as mastered, or finish
                    stages to build your activity history.
                  </p>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover transition-colors"
                  >
                    Start Learning
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Recent activity — what we CAN derive */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Recent Activity
              </p>
              <RecentActivity journey={journey} career={career} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────

function ProfileTopBar({
  user,
  onLogout,
}: {
  user: { name: string; email: string };
  onLogout: () => void;
}) {
  return (
    <div className="sticky top-14 z-30 border-b border-border/80 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 max-w-5xl py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-primary" />
          <span className="text-xs font-mono font-semibold text-primary">
            Student Profile
          </span>
          <span className="text-border hidden sm:inline">·</span>
          <span className="text-xs text-muted-foreground hidden sm:inline truncate max-w-xs">
            {user.name}
          </span>
        </div>
        <button
          onClick={onLogout}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-400 font-mono transition-colors cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Log Out</span>
        </button>
      </div>
    </div>
  );
}

function EmptyState({
  title,
  sub,
  cta,
  href,
}: {
  title: string;
  sub: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="py-8 text-center space-y-3">
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
        {sub}
      </p>
      <Link
        href={href}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover transition-colors"
      >
        {cta}
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

/** Placeholder visual heatmap grid when user has some activity but no timestamps */
function ActivityGrid() {
  // 15 weeks × 7 days = 105 cells, all empty (honest)
  const weeks = 15;
  return (
    <div className="overflow-x-auto pb-1">
      <div
        className="grid gap-1 w-max"
        style={{ gridTemplateColumns: `repeat(${weeks}, 1fr)` }}
      >
        {Array.from({ length: weeks }).map((_, wk) => (
          <div key={wk} className="flex flex-col gap-1">
            {Array.from({ length: 7 }).map((_, day) => (
              <div
                key={day}
                className="h-3 w-3 rounded-sm bg-[#10141A] border border-border/20"
                title="No activity data yet"
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2 justify-end">
        <span className="text-[10px] text-muted-foreground/50 font-mono">Less</span>
        {["bg-[#10141A]", "bg-primary/20", "bg-primary/50", "bg-primary/80", "bg-primary"].map(
          (cls, i) => (
            <div key={i} className={`h-3 w-3 rounded-sm ${cls}`} />
          )
        )}
        <span className="text-[10px] text-muted-foreground/50 font-mono">More</span>
      </div>
    </div>
  );
}

function RecentActivity({
  journey,
  career,
}: {
  journey: CareerJourneySourceData | null;
  career: ReturnType<typeof getCareerIntelligence>;
}) {
  interface ActivityItem {
    ts: number;
    label: string;
    type: "complete" | "start" | "assessment";
  }
  const items: ActivityItem[] = [];

  if (journey?.assessment?.completedAt) {
    items.push({
      ts: journey.assessment.completedAt,
      label: "Completed career assessment",
      type: "assessment",
    });
  }

  if (journey?.selectedCareer?.startedAt && career) {
    items.push({
      ts: journey.selectedCareer.startedAt,
      label: `Started roadmap: ${career.title}`,
      type: "start",
    });
  }

  if (journey?.selectedCareer?.lastActiveAt && career) {
    const startAt = journey.selectedCareer.startedAt;
    const lastAt = journey.selectedCareer.lastActiveAt;
    if (lastAt !== startAt) {
      items.push({
        ts: lastAt,
        label: `Last active on roadmap`,
        type: "complete",
      });
    }
  }

  items.sort((a, b) => b.ts - a.ts);

  if (items.length === 0) {
    return (
      <p className="text-xs text-muted-foreground text-center py-4">
        No recorded activity yet. Start your roadmap to build history.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-3">
          <div
            className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0 ${
              item.type === "assessment" || item.type === "complete"
                ? "bg-primary/20 text-primary"
                : "bg-[#141920] text-muted-foreground"
            }`}
          >
            {item.type === "assessment" || item.type === "complete" ? (
              <CheckCircle2 className="h-3 w-3" />
            ) : (
              <Circle className="h-3 w-3" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground">{item.label}</p>
            <p className="text-[10px] text-muted-foreground/70 font-mono">
              {new Date(item.ts).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
