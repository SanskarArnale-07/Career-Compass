"use client";

import { useEffect, useState, useSyncExternalStore, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
  MessageSquare,
  FolderArchive,
  BarChart3,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import {
  loadCareerJourney,
  saveAssessmentResult,
  type CareerJourneySourceData,
} from "@/lib/persistence";
import {
  getCareerIntelligence,
} from "@/lib/career-intelligence";
import { getCareerHierarchy } from "@/lib/career-hierarchy";
import { getTieredCareerMatches } from "@/lib/constants/matching";
import type { CareerMatch, TraitProfile } from "@/lib/types/assessment";
import {
  deriveStudentPersona,
  deriveStreamSuitability,
  deriveWhyFitReasoning,
  deriveWorkLearningStyle,
  deriveNextSteps,
} from "@/lib/profile/profile-utils";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileMetricsRow } from "@/components/profile/ProfileMetricsRow";
import { TopTraitsSection } from "@/components/profile/TopTraitsSection";
import { StreamSuitabilitySection } from "@/components/profile/StreamSuitabilitySection";
import { WorkLearningStyleSection } from "@/components/profile/WorkLearningStyleSection";
import { WhyFitSection } from "@/components/profile/WhyFitSection";
import { GroupedCareerMatchesSection } from "@/components/profile/GroupedCareerMatchesSection";
import { NextStepsSection } from "@/components/profile/NextStepsSection";
import { RoadmapMomentumSection } from "@/components/profile/RoadmapMomentumSection";
import { TopCareerDirectionsSection } from "@/components/profile/TopCareerDirectionsSection";
import { NextStepCTA } from "@/components/profile/NextStepCTA";
import { ProgressiveInsightsDisclosure } from "@/components/profile/ProgressiveInsightsDisclosure";
import { StudentFeedbackModal } from "@/components/feedback/StudentFeedbackModal";
import { trackProfileViewed } from "@/lib/analytics/tracker";

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
  const [isDeepDiveOpen, setIsDeepDiveOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Auth guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=/profile");
    }
  }, [isLoading, isAuthenticated, router]);

  // Load journey data with safe fallback to session/local storage
  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    try {
      const j = loadCareerJourney();
      if (!j.assessment?.results && typeof window !== "undefined") {
        const stored =
          sessionStorage.getItem("careerCompassResults") ||
          localStorage.getItem("careerCompassResults");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed && (parsed.trait_profile || parsed.top_careers)) {
              j.assessment.completed = true;
              j.assessment.results = parsed;
              j.assessment.traitProfile = parsed.trait_profile || null;
              saveAssessmentResult(parsed);
            }
          } catch {
            // ignore
          }
        }
      }
      setJourney(j);
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
          <p className="text-xs text-muted-foreground animate-pulse font-mono">
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

  // Career matches (tiered by threshold: Strong >= 60% or highest tier, Exploration >= 40%)
  const rawMatches: CareerMatch[] = results?.top_careers ?? [];
  const { strongMatches, explorationMatches, allVisibleMatches } =
    getTieredCareerMatches(rawMatches);

  // Top career match for profile context
  const topMatch = allVisibleMatches[0] || rawMatches[0] || null;
  const topCareerIntel = topMatch
    ? getCareerIntelligence(topMatch.career_name)
    : null;
  const displayHierarchy = topCareerIntel
    ? getCareerHierarchy(topCareerIntel.slug)
    : hierarchy;

  // Personalization data
  const traits = (assessment?.traitProfile ||
    results?.trait_profile ||
    null) as TraitProfile | null;

  const persona = deriveStudentPersona(
    traits,
    topCareerIntel?.title || career?.title
  );

  const streamSuitability = deriveStreamSuitability(
    results?.streams,
    traits
  );

  const whyFitReasoning = deriveWhyFitReasoning(
    traits,
    topCareerIntel?.title || career?.title
  );

  const workLearningStyle = deriveWorkLearningStyle(traits);
  const nextSteps = deriveNextSteps(
    persona,
    topCareerIntel?.title || career?.title,
    selectedSlug
  );

  useEffect(() => {
    if (assessmentDone && persona?.archetype) {
      trackProfileViewed(
        persona.archetype,
        topCareerIntel?.title || career?.title
      );
    }
  }, [assessmentDone, persona?.archetype]);

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
  const currentPhase =
    career?.roadmap.find((p) => !completedPhasesSet.has(p.phase)) ||
    career?.roadmap[0];

  const nextMilestone = currentPhase?.skills?.[0]
    ? `Master ${currentPhase.skills[0]}`
    : "Continue active phase coursework";

  // Tasks done (preparation items)
  const completedPrep = (progress?.completedTasks ?? []).filter((id) =>
    career?.preparation?.some((p) => p.id === id)
  ).length;

  // Per-phase skill progress for the skills tab
  const phaseSkillProgress =
    career?.roadmap.map((phase) => {
      const phaseSkillIds = phase.skills.map((s) => skillId(phase.title, s));
      const done = phaseSkillIds.filter((id) =>
        completedSkillsSet.has(id)
      ).length;
      return {
        phase,
        total: phaseSkillIds.length,
        done,
        percent:
          phaseSkillIds.length > 0
            ? (done / phaseSkillIds.length) * 100
            : 0,
      };
    }) ?? [];

  // Streak / activity state
  const hasAnyActivity =
    completedPhases > 0 || masteredSkills > 0 || completedPrep > 0;

  // ── NEW USER: No assessment done ─────────────────────────────────
  if (!assessmentDone) {
    return (
      <div className="min-h-screen bg-background text-foreground pb-20">
        <ProfileTopBar user={user} onLogout={logout} />
        <div className="container mx-auto px-4 max-w-2xl pt-20 pb-12 text-center">
          <div className="mb-8 flex justify-center">
            <div className="h-20 w-20 rounded-2xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-primary text-3xl font-bold font-heading shadow-lg shadow-primary/10">
              {getInitials(user.name)}
            </div>
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">
            {user.name}
          </h1>
          <p className="text-sm text-muted-foreground font-mono mb-8">{user.email}</p>

          <div className="p-8 rounded-2xl border border-border bg-card space-y-5 shadow-xl shadow-black/20">
            <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto">
              <Compass className="h-6 w-6" />
            </div>
            <h2 className="font-heading text-xl font-bold text-foreground">
              Your Career Journey Hasn&apos;t Started Yet
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Complete our 5-minute psychometric assessment to generate your personalized career profile, discover your cognitive archetype, evaluate academic stream suitability, and unlock your adaptive learning roadmap.
            </p>
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary-hover shadow-md shadow-primary/20 transition-all mt-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>Take the Assessment</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── FULL POLISHED PROFILE ─────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <ProfileTopBar
        user={user}
        onLogout={logout}
        onOpenFeedback={() => setIsFeedbackOpen(true)}
      />

      <div className="container mx-auto px-4 max-w-5xl pt-8 space-y-6">
        {/* 1. Stronger Profile Header: Student Identity + Persona + Concise Summary */}
        <ProfileHeader
          user={user}
          persona={persona}
          displayHierarchy={displayHierarchy}
          topMatchScore={topMatch?.match_percentage}
          startedAt={journey?.selectedCareer?.startedAt}
          selectedSlug={selectedSlug}
          careerTitle={topCareerIntel?.title || career?.title}
        />

        {/* 2. Tab Navigation */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#10141A] border border-border/70 w-full sm:w-auto">
          {(
            [
              { id: "overview", label: "Snapshot", icon: User },
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
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════ */}
        {/* TAB: SNAPSHOT & OVERVIEW (Minimal-First Approach)     */}
        {/* ══════════════════════════════════════════════════════ */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* 1. Career Snapshot is established in ProfileHeader (Who am I?) */}

            {/* 2. Top Strengths: strictly top 3 traits with short interpretations (What am I strongest at?) */}
            <TopTraitsSection
              topStrengths={persona.topStrengths}
              allTraits={persona.allTraits}
              limit={3}
            />

            {/* 3. Top Career Directions: strictly 3-5 strongest pathways (What career directions should I explore?) */}
            <TopCareerDirectionsSection
              matches={allVisibleMatches}
              limit={4}
              exploreAllHref="/results"
              onExploreAll={() => setIsDeepDiveOpen(true)}
            />

            {/* 4. Next Step: Prominent CTA to explore career matches */}
            <NextStepCTA
              exploreMatchesHref="/results"
              roadmapHref="/dashboard"
              activeCareerTitle={topCareerIntel?.title || career?.title}
              isDeepDiveOpen={isDeepDiveOpen}
              onToggleDeepDive={() => setIsDeepDiveOpen((prev) => !prev)}
            />

            {/* 5. Progressive Disclosure: Full In-Depth Intelligence on Demand */}
            <ProgressiveInsightsDisclosure
              isOpen={isDeepDiveOpen}
              onToggle={() => setIsDeepDiveOpen((prev) => !prev)}
              overallPercent={overallPercent}
              topCareerName={topCareerIntel?.title || career?.title || "Software Development"}
              topCareerScore={topMatch?.match_percentage}
              topTraitLabel={persona.topStrengths[0]?.label || "Technical Aptitude"}
              topTraitScore={persona.topStrengths[0]?.score}
              primaryStream={streamSuitability.primaryRecommendation}
              weeklyPaceHours={progress?.weeklyPaceHours ?? 10}
              rankedStreams={streamSuitability.rankedStreams}
              whyFitReasoning={whyFitReasoning}
              workLearningStyle={workLearningStyle}
              strongMatches={strongMatches}
              explorationMatches={explorationMatches}
              allVisibleMatches={allVisibleMatches}
              career={career}
              completedPhases={completedPhases}
              totalPhases={totalPhases}
              masteredSkills={masteredSkills}
              totalSkills={totalSkills}
              currentPhaseTitle={
                currentPhase
                  ? `Stage ${currentPhase.phase}: ${currentPhase.title}`
                  : undefined
              }
              nextMilestone={nextMilestone}
              selectedSlug={selectedSlug}
            />
          </div>
        )}

        {/* ══════════════════════════════════════════════════════ */}
        {/* TAB: ROADMAP (Journey Summary)                         */}
        {/* ══════════════════════════════════════════════════════ */}
        {activeTab === "roadmap" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-heading text-base font-bold text-foreground">
                    Career Journey — {career?.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Stage-by-stage progression toward career readiness
                  </p>
                </div>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1 text-xs text-primary font-semibold hover:underline"
                >
                  <span>Open full dashboard</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>

              {career && totalPhases > 0 ? (
                <div className="space-y-2.5">
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
                            ? "border-primary/40 bg-primary/10 shadow-xs shadow-primary/10"
                            : "border-border/40 bg-[#0B0E12]"
                        }`}
                      >
                        {/* Stage indicator */}
                        <div
                          className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                            isComplete
                              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                              : isActive
                              ? "bg-primary/20 border border-primary/40 text-primary"
                              : "bg-[#141920] border border-border/60 text-muted-foreground/60"
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
                                  ? "text-emerald-400 font-semibold"
                                  : isActive
                                  ? "text-primary font-bold"
                                  : "text-muted-foreground/60"
                              }`}
                            >
                              {isComplete ? "Completed" : `${pct}%`}
                            </span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-[#10141A] overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isComplete
                                  ? "bg-emerald-500/60 w-full"
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
                  sub="Your personalized roadmap is ready to explore."
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
                      sublabel={`${done} / ${total} skills mastered · ${phase.estimatedDuration}`}
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
                  Skill Mastery Summary
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
            {/* Streaks */}
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
                  days active
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
                  days active
                </p>
              </div>
            </div>

            {/* Learning Activity */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Learning Activity
              </p>

              {hasAnyActivity ? (
                <div className="space-y-4">
                  <ActivityGrid />
                  <p className="text-[10px] text-muted-foreground/60 font-mono text-center">
                    Detailed daily activity tracking records as you complete roadmap milestones and master skills.
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
                    Complete roadmap tasks, mark skills as mastered, or finish stages to build your learning record.
                  </p>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover transition-colors"
                  >
                    <span>Start Learning</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              )}
            </div>

            {/* Recent activity timeline */}
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Recent Journey Events
              </p>
              <RecentActivity journey={journey} career={career} />
            </div>
          </div>
        )}
      </div>

      {/* Student Feedback Modal */}
      <StudentFeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        sessionId={`session-${user?.id || "anon"}`}
        sourceContext="profile"
      />
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────

function ProfileTopBar({
  user,
  onLogout,
  onOpenFeedback,
}: {
  user: { name: string; email: string };
  onLogout: () => void;
  onOpenFeedback?: () => void;
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
        <div className="flex items-center gap-2">
          {onOpenFeedback && (
            <button
              onClick={onOpenFeedback}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary/10 border border-secondary/25 text-xs font-mono text-secondary hover:bg-secondary/20 transition-colors cursor-pointer"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Give Feedback</span>
            </button>
          )}
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-red-400 font-mono transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
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
        <span>{cta}</span>
        <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}

/** Visual heatmap grid */
function ActivityGrid() {
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
                title="Activity cell"
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
      <p className="text-xs text-muted-foreground text-center py-4 font-mono">
        No recorded activity yet. Start your roadmap to build your history.
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
