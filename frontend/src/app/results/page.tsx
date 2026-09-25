"use client";

import { useEffect, useState, useCallback, useSyncExternalStore, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  AlertTriangle,
  Compass,
  ChevronDown,
  ChevronUp,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { CareerMatches } from "@/components/results/CareerMatches";
import { ContributingTraitsVisual } from "@/components/results/ContributingTraitsVisual";
import { ProgressiveHierarchy } from "@/components/results/ProgressiveHierarchy";
import { SuitabilityScores } from "@/components/results/SuitabilityScores";
import { SkillGaps } from "@/components/results/SkillGaps";
import { NextSteps } from "@/components/results/NextSteps";
import { CareerDiscoveryAnimation } from "@/components/interactive/CareerDiscoveryAnimation";
import { assessmentQuestions } from "@/lib/assessment-data";
import { saveAssessmentResult, loadCareerJourney } from "@/lib/persistence";
import { useAuth } from "@/context/AuthContext";
import { getCareerHierarchy } from "@/lib/career-hierarchy";
import { getCareerSlug } from "@/lib/career-details";
import {
  getTieredCareerMatches,
  CAREER_MATCH_THRESHOLD,
  CAREER_EXPLORATION_THRESHOLD,
} from "@/lib/constants/matching";
import type { StoredResults } from "@/lib/career-details/personalization";
import type { AssessmentResponse, CareerMatch } from "@/lib/types/assessment";

// ── API Call ─────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

async function scoreAssessment(
  answers: Record<string, string>
): Promise<AssessmentResponse> {
  const url =
    typeof window !== "undefined"
      ? "/api/v1/assessment/score"
      : `${API_BASE}/api/v1/assessment/score`;

  let resp: Response;
  try {
    resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
      signal: AbortSignal.timeout(10000),
    });
  } catch {
    resp = await fetch(`${API_BASE}/api/v1/assessment/score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
      signal: AbortSignal.timeout(10000),
    });
  }

  if (!resp.ok) {
    const detail = await resp.json().catch(() => null);
    throw new Error(
      detail?.detail?.message || `Scoring failed (${resp.status})`
    );
  }

  return resp.json();
}

const emptySubscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

// ── Page Component ──────────────────────────────────────────────────

export default function ResultsPage() {
  const isClient = useIsClient();
  const { isAuthenticated } = useAuth();
  const [assessmentData, setAssessmentData] = useState<Record<
    string,
    string
  > | null>(null);
  const [result, setResult] = useState<AssessmentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [animationPhase, setAnimationPhase] = useState<
    "discovering" | "resolving" | "complete"
  >("discovering");
  const [showStreamDetails, setShowStreamDetails] = useState(false);
  const [selectedCareerName, setSelectedCareerName] = useState<string | null>(null);

  // 1. Read answers from sessionStorage or persistent journey
  useEffect(() => {
    const timer = setTimeout(() => {
      const data = sessionStorage.getItem("careerCompassAssessment");
      if (data) {
        try {
          setAssessmentData(JSON.parse(data));
        } catch (e) {
          console.error("Failed to parse assessment data", e);
          setAnimationPhase("complete");
        }
      } else {
        try {
          const journey = loadCareerJourney();
          if (journey.assessment?.results) {
            setResult(journey.assessment.results as unknown as AssessmentResponse);
          }
        } catch (e) {
          console.error("Failed to check persisted journey", e);
        }
        setAnimationPhase("complete");
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // 2. Call backend scoring API when answers are available
  useEffect(() => {
    if (!assessmentData) return;

    let isSubscribed = true;
    const startTime = Date.now();
    const MIN_DISCOVERY_TIME = 1000;

    scoreAssessment(assessmentData)
      .then((res) => {
        if (!isSubscribed) return;
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, MIN_DISCOVERY_TIME - elapsed);

        setTimeout(() => {
          if (!isSubscribed) return;
          setResult(res);
          try {
            saveAssessmentResult(
              res as unknown as StoredResults,
              assessmentData || undefined
            );
          } catch (e) {
            console.error("Failed to save results via persistence engine", e);
          }
          setError(null);
          setAnimationPhase("resolving");
        }, remaining);
      })
      .catch((err) => {
        if (!isSubscribed) return;
        console.error("Scoring API error:", err);
        setError(err.message || "Failed to score assessment.");
        setAnimationPhase("complete");
      });

    return () => {
      isSubscribed = false;
    };
  }, [assessmentData]);

  // 3. Failsafe timer: ensure user is never trapped in the animation for more than 3.5s
  useEffect(() => {
    if (assessmentData && animationPhase !== "complete") {
      const failsafe = setTimeout(() => {
        setAnimationPhase("complete");
      }, 3500);
      return () => clearTimeout(failsafe);
    }
  }, [assessmentData, animationPhase]);

  const handleAnimationComplete = useCallback(() => {
    setAnimationPhase("complete");
  }, []);

  const handleLoadSample = () => {
    const sample: Record<string, string> = {};
    assessmentQuestions.forEach((q) => {
      if (q.options.length > 0) {
        sample[q.id] = q.options[0].value;
      }
    });
    sessionStorage.setItem("careerCompassAssessment", JSON.stringify(sample));
    sessionStorage.removeItem("careerCompassResults");
    setError(null);
    setAssessmentData(sample);
    setAnimationPhase("discovering");
  };

  // ── Matches calculation ───────────────────────────────────────
  const { strongMatches, explorationMatches, allVisibleMatches } = useMemo(() => {
    if (!result?.top_careers) {
      return { strongMatches: [], explorationMatches: [], allVisibleMatches: [] };
    }
    return getTieredCareerMatches(result.top_careers);
  }, [result]);

  // Determine active career for progressive hierarchy
  const activeCareer: CareerMatch | null = useMemo(() => {
    if (selectedCareerName) {
      const found = allVisibleMatches.find(
        (c) => c.career_name === selectedCareerName
      );
      if (found) return found;
    }
    return allVisibleMatches[0] || result?.top_careers[0] || null;
  }, [selectedCareerName, allVisibleMatches, result]);

  const handleExploreCareer = useCallback((careerName: string) => {
    setSelectedCareerName(careerName);
    const targetElement = document.getElementById("progressive-hierarchy-section");
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // Primary career match for Top of Results
  const primaryCareer = allVisibleMatches[0] || result?.top_careers[0];
  const primaryHierarchy = primaryCareer
    ? getCareerHierarchy(primaryCareer.career_name)
    : null;
  const primaryTitle =
    primaryHierarchy?.path.name || primaryCareer?.career_name || "Software Development";
  const primarySlug =
    primaryHierarchy?.path.slug ||
    (primaryCareer ? getCareerSlug(primaryCareer.career_name) : "software-development");
  const primaryScore = primaryCareer
    ? Math.round(primaryCareer.match_percentage)
    : 0;
  const isPrimaryStrong = primaryScore >= CAREER_MATCH_THRESHOLD;

  // Neutral wording for Worth Exploring vs Strong Match
  const primaryExplanation = useMemo(() => {
    if (!isPrimaryStrong) {
      return "This path is worth exploring based on your strongest assessment traits.";
    }
    if (primaryCareer?.explanation) {
      return primaryCareer.explanation.replace(
        /and could be a great fit for your future\.?/i,
        "is a strong directional match for your profile."
      );
    }
    return (
      primaryHierarchy?.path.tagline ||
      "Your assessment patterns demonstrate strong problem-solving and structured thinking aligned directly with this career domain."
    );
  }, [isPrimaryStrong, primaryCareer?.explanation, primaryHierarchy?.path.tagline]);

  // Unique skill gaps for skill development section
  const uniqueGaps = useMemo(() => {
    const list = (allVisibleMatches.length > 0 ? allVisibleMatches : result?.top_careers || []).flatMap((c) =>
      (c.skill_gaps || []).map((sg) => ({
        skill: sg,
        level: "Core Capability",
        action: `Build hands-on foundation in ${sg} through structured coursework and practice.`,
      }))
    );
    const seen = new Set<string>();
    return list.filter((g) => {
      if (seen.has(g.skill)) return false;
      seen.add(g.skill);
      return true;
    }).slice(0, 4);
  }, [allVisibleMatches, result]);

  // Next action milestones
  const allNextSteps = useMemo(() => {
    const list = (allVisibleMatches.length > 0 ? allVisibleMatches : result?.top_careers || []).flatMap(
      (c) => c.next_steps || []
    );
    return Array.from(new Set(list)).slice(0, 3);
  }, [allVisibleMatches, result]);

  // ── Loading state ─────────────────────────────────────────────
  if (!isClient) return null;

  if (animationPhase !== "complete" && !error && assessmentData) {
    return (
      <CareerDiscoveryAnimation
        status={animationPhase}
        onComplete={handleAnimationComplete}
      />
    );
  }

  // ── No assessment data fallback ───────────────────────────────
  if (!assessmentData) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center py-20 flex flex-col items-center">
          <div className="h-14 w-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-5 font-mono text-lg font-bold">
            ?
          </div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-slate-100 mb-2">
            No Assessment Data Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed mb-6 max-w-md mx-auto">
            It looks like you haven&apos;t completed the career assessment yet,
            or your session has expired.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/assessment"
              className="inline-flex h-10 sm:h-11 items-center justify-center rounded-xl bg-cyan-400 hover:bg-cyan-300 px-6 text-xs sm:text-sm font-bold text-slate-950 shadow-md shadow-cyan-400/20 transition-all cursor-pointer"
            >
              Take Assessment
            </Link>
            <button
              type="button"
              onClick={handleLoadSample}
              className="inline-flex h-10 sm:h-11 items-center justify-center rounded-xl border border-border/70 bg-[#10141A] px-6 text-xs sm:text-sm font-semibold text-slate-200 hover:bg-[#141920] hover:border-cyan-500/40 transition-colors cursor-pointer"
            >
              Explore Sample Results
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── API Error state ───────────────────────────────────────────
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center py-20 flex flex-col items-center">
          <div className="h-14 w-14 rounded-2xl bg-destructive/15 border border-destructive/30 flex items-center justify-center text-destructive mb-5 shadow-sm">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-slate-100 mb-2">
            Something Went Wrong
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed mb-6 max-w-md mx-auto">
            {error}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/assessment"
              className="inline-flex h-10 sm:h-11 items-center justify-center rounded-xl border border-border/70 bg-[#10141A] px-6 text-xs sm:text-sm font-medium text-slate-200 hover:bg-[#141920] transition-colors"
            >
              Retake Assessment
            </Link>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setAnimationPhase("discovering");
                if (assessmentData) {
                  scoreAssessment(assessmentData)
                    .then((res) => {
                      setResult(res);
                      try {
                        saveAssessmentResult(
                          res as unknown as StoredResults,
                          assessmentData || undefined
                        );
                      } catch (e) {
                        console.error(
                          "Failed to save results via persistence engine",
                          e
                        );
                      }
                      setError(null);
                      setAnimationPhase("resolving");
                    })
                    .catch((err) => {
                      setError(err.message);
                      setAnimationPhase("complete");
                    });
                }
              }}
              className="inline-flex h-10 sm:h-11 items-center justify-center rounded-xl bg-cyan-400 hover:bg-cyan-300 px-6 text-xs sm:text-sm font-bold text-slate-950 shadow-md shadow-cyan-400/20 transition-all cursor-pointer"
            >
              Try Again
            </button>
            <button
              type="button"
              onClick={handleLoadSample}
              className="inline-flex h-10 sm:h-11 items-center justify-center rounded-xl border border-border/70 bg-[#10141A] px-6 text-xs sm:text-sm font-semibold text-slate-200 hover:bg-[#141920] transition-colors cursor-pointer"
            >
              Load Sample Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Results ───────────────────────────────────────────────────
  if (!result) return null;

  return (
    <div className="min-h-screen bg-[#080A0D] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      <div className="container mx-auto px-4 py-8 sm:py-10 max-w-4xl space-y-6 sm:space-y-8">
        {/* ─────────────────────────────────────────────────────────────
            1. TOP CAREER PATH
            Clean, grounded opening for Top Career Path
            ───────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-linear-to-b from-[#10141A] via-[#0E1217] to-[#0A0D12] p-6 sm:p-8 md:p-10 shadow-2xl">
          {/* Subtle ambient lighting */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            {/* Eyebrow: "TOP CAREER PATH" */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-3.5">
              <Compass className="h-3.5 w-3.5" />
              <span>TOP CAREER PATH</span>
            </div>

            {/* Primary Matched Career Path */}
            <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-3 leading-tight">
              {primaryTitle}
            </h1>

            {/* Match Strength + Status */}
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{primaryScore}% Match</span>
              </span>

              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider ${
                  isPrimaryStrong
                    ? "bg-cyan-950/60 text-cyan-300 border border-cyan-500/30"
                    : "bg-sky-950/60 text-sky-300 border border-sky-500/30"
                }`}
              >
                {isPrimaryStrong ? "Strong Match (≥40%)" : "Worth Exploring (25–39%)"}
              </span>

              {primaryHierarchy?.domain && (
                <span className="text-xs font-mono text-slate-400">
                  in {primaryHierarchy.domain.name}
                </span>
              )}
            </div>

            {/* Neutral explanation wording based on match tier */}
            <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed max-w-xl">
              {primaryExplanation}
            </p>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            2. WHY THIS PATH
            Profile DNA — compact 3 strongest traits + expand
            ───────────────────────────────────────────────────────────── */}
        <section>
          <ContributingTraitsVisual
            traits={result.trait_profile as unknown as Record<string, number>}
            primaryCareerName={primaryTitle}
          />
        </section>

        {/* ─────────────────────────────────────────────────────────────
            3. CAREER PATHS TO EXPLORE
            Max 3 paths, clickable cards, no separate explore buttons
            ───────────────────────────────────────────────────────────── */}
        <section>
          {allVisibleMatches.length > 0 ? (
            <CareerMatches
              strongMatches={strongMatches}
              explorationMatches={explorationMatches}
              activeCareerName={activeCareer?.career_name}
              onExploreCareer={handleExploreCareer}
            />
          ) : (
            <div className="rounded-2xl border border-border/80 bg-[#10141A] p-8 sm:p-10 text-center max-w-xl mx-auto shadow-xl">
              <div className="h-12 w-12 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                <Compass className="h-6 w-6" />
              </div>
              <h2 className="font-heading text-xl font-bold text-foreground mb-2">
                No Direct Matches Above Threshold
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-5 font-light">
                We couldn&apos;t find any direct or exploratory matches above our alignment threshold ({CAREER_EXPLORATION_THRESHOLD}%).
                You can retake the assessment or explore our broader career catalog.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/assessment"
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-cyan-400 hover:bg-cyan-300 px-5 text-xs font-bold text-slate-950 shadow-sm transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                  Retake Assessment
                </Link>
                <Link
                  href="/careers"
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-[#10141A] px-5 text-xs font-semibold text-slate-200 hover:bg-[#141920] hover:border-border transition-colors"
                >
                  Explore More Careers
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* ─────────────────────────────────────────────────────────────
            4. CAREER HIERARCHY
            Progressive hierarchy with reduced vertical space
            Domain → Path → Specialization → Role
            ───────────────────────────────────────────────────────────── */}
        {activeCareer && (
          <section>
            <ProgressiveHierarchy
              activeCareer={activeCareer}
              allMatches={allVisibleMatches}
              onSelectCareer={(name) => setSelectedCareerName(name)}
            />
          </section>
        )}

        {/* ─────────────────────────────────────────────────────────────
            5. NEXT ACTION ("Next Step")
            Compact next action section replacing detailed learning lists
            ───────────────────────────────────────────────────────────── */}
        <section className="rounded-2xl border border-cyan-500/25 bg-linear-to-b from-[#10141A] to-[#0A0D12] p-6 sm:p-8 text-center max-w-xl mx-auto shadow-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono font-semibold text-cyan-400 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Next Step</span>
          </div>

          <h2 className="font-heading text-lg sm:text-xl font-bold text-slate-100 mb-1.5 tracking-tight">
            Explore your career path and see what to build next.
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 font-light mb-5 max-w-md mx-auto leading-relaxed">
            Your custom roadmap breaks down required competencies, hands-on projects, and progressive milestones.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Primary Action: View Your Roadmap */}
            <Link
              href={`/career/${primarySlug}#roadmap`}
              className="inline-flex h-10 sm:h-11 items-center justify-center gap-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 px-5 sm:px-6 text-xs sm:text-sm font-bold text-slate-950 shadow-md shadow-cyan-400/20 transition-all cursor-pointer hover:scale-[1.02]"
            >
              <span>View Your Roadmap</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            {/* Secondary Action: Explore More Careers */}
            <Link
              href="/careers"
              className="inline-flex h-10 sm:h-11 items-center justify-center rounded-xl border border-border/70 bg-[#10141A] hover:bg-[#141920] px-5 sm:px-6 text-xs sm:text-sm font-semibold text-slate-200 transition-colors"
            >
              Explore More Careers
            </Link>
          </div>
        </section>

        {/* ─────────────────────────────────────────────────────────────
            SECONDARY COLLAPSIBLE: Academic Stream & Skill Development Perspectives
            Kept strictly secondary/collapsed so it does not compete
            ───────────────────────────────────────────────────────────── */}
        {result.streams && (
          <section className="rounded-2xl border border-border/70 bg-[#10141A]/50 overflow-hidden transition-all">
            <button
              type="button"
              onClick={() => setShowStreamDetails(!showStreamDetails)}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-[#141920] transition-colors cursor-pointer"
            >
              <div>
                <h3 className="font-heading text-sm sm:text-base font-semibold text-slate-200">
                  Academic Stream &amp; Skill Development Perspectives
                </h3>
                <p className="text-xs text-slate-400 mt-0.5 font-light leading-relaxed">
                  Secondary perspective: explore how Science, Commerce, and Arts align with your responses, plus focus skills and action steps.
                </p>
              </div>
              <div className="h-7 w-7 rounded-lg bg-[#141920] border border-border/80 flex items-center justify-center text-slate-400 shrink-0 ml-4">
                {showStreamDetails ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </button>

            {showStreamDetails && (
              <div className="p-5 sm:p-6 border-t border-border/70 bg-[#0B0E12] space-y-8 animate-in fade-in duration-200">
                {/* Academic Stream Alignment */}
                <SuitabilityScores
                  scores={result.streams.scores}
                  descriptions={result.streams.descriptions}
                  recommendation={result.streams.recommendation}
                />

                {/* Skill Development Focus */}
                {uniqueGaps.length > 0 && (
                  <div className="pt-6 border-t border-border/60">
                    <SkillGaps gaps={uniqueGaps} />
                  </div>
                )}

                {/* Your Next Steps */}
                {allNextSteps.length > 0 && (
                  <div className="pt-6 border-t border-border/60">
                    <NextSteps steps={allNextSteps} />
                  </div>
                )}
              </div>
            )}
          </section>
        )}

        {/* Low-Profile Guest Save Results Prompt */}
        {!isAuthenticated && (
          <section className="rounded-xl border border-cyan-500/20 bg-[#10141A]/40 p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <p className="text-xs text-slate-300 font-light">
                <strong className="text-slate-100 font-medium">Save your results:</strong> Create a free account to revisit your assessment profile and custom learning roadmap anytime.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <Link
                href="/signup"
                className="inline-flex h-8 items-center justify-center rounded-lg bg-cyan-400 hover:bg-cyan-300 px-3.5 text-xs font-bold text-slate-950 transition-all cursor-pointer"
              >
                <span>Save Results</span>
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-8 items-center justify-center rounded-lg border border-border/70 bg-[#141920] px-2.5 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </section>
        )}

        {/* Bottom Utility: Retake Assessment */}
        <div className="pt-1 flex items-center justify-center pb-8">
          <Link
            href="/assessment"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Retake Assessment</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
