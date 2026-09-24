"use client";

import { useEffect, useState, useCallback, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, AlertTriangle, Compass, Info, ChevronDown, ChevronUp, Sparkles, Check, RotateCcw } from "lucide-react";
import { SuitabilityScores } from "@/components/results/SuitabilityScores";
import { CareerMatches } from "@/components/results/CareerMatches";
import { UserSignals } from "@/components/results/UserSignals";
import { SkillGaps } from "@/components/results/SkillGaps";
import { NextSteps } from "@/components/results/NextSteps";
import { CareerDiscoveryAnimation } from "@/components/interactive/CareerDiscoveryAnimation";
import { BlurText } from "@/components/interactive/BlurText";
import { assessmentQuestions } from "@/lib/assessment-data";
import { saveAssessmentResult, loadCareerJourney } from "@/lib/persistence";
import { useAuth } from "@/context/AuthContext";
import {
  getTieredCareerMatches,
  CAREER_MATCH_THRESHOLD,
  CAREER_EXPLORATION_THRESHOLD,
} from "@/lib/constants/matching";
import type { StoredResults } from "@/lib/career-details/personalization";

import type { AssessmentResponse } from "@/lib/types/assessment";
import { PersonalizedHierarchy } from "@/components/results/PersonalizedHierarchy";

// ── API Call ─────────────────────────────────────────────────────────

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

async function scoreAssessment(
  answers: Record<string, string>
): Promise<AssessmentResponse> {
  // Try same-origin Next.js rewrite proxy first to bypass cross-port/adblock issues
  const url = typeof window !== "undefined" ? "/api/v1/assessment/score" : `${API_BASE}/api/v1/assessment/score`;

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
  const [animationPhase, setAnimationPhase] = useState<"discovering" | "resolving" | "complete">("discovering");
  const [showStreamDetails, setShowStreamDetails] = useState(false);

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
        // Check if we already have persisted results from an earlier session
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
            saveAssessmentResult(res as unknown as StoredResults, assessmentData || undefined);
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
          <div className="h-16 w-16 rounded-full bg-[#10141A] border border-border flex items-center justify-center text-muted-foreground mb-6 font-mono text-xl">
            ?
          </div>
          <h1 className="font-heading text-3xl font-bold mb-4 text-foreground">
            No Assessment Data Found
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
            It looks like you haven&apos;t completed the career assessment yet,
            or your session has expired.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/assessment"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground hover:bg-primary-hover shadow-sm transition-colors"
            >
              Take Assessment
            </Link>
            <button
              onClick={handleLoadSample}
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-[#10141A] px-8 text-sm font-semibold text-foreground hover:bg-[#141920] hover:border-primary/40 transition-colors cursor-pointer"
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
          <div className="h-16 w-16 rounded-full bg-destructive/15 border border-destructive/30 flex items-center justify-center text-destructive mb-6 shadow-sm">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h1 className="font-heading text-3xl font-bold mb-4 text-foreground">
            Something Went Wrong
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm">
            {error}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/assessment"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-card px-8 text-sm font-medium text-foreground hover:bg-card-hover transition-colors"
            >
              Retake Assessment
            </Link>
            <button
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
                        console.error("Failed to save results via persistence engine", e);
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
              className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground hover:bg-primary-hover shadow-sm transition-colors cursor-pointer"
            >
              Try Again
            </button>
            <button
              onClick={handleLoadSample}
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-[#10141A] px-6 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-[#141920] transition-colors cursor-pointer"
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

  // Partition career matches into two-tier system: Strong Matches (>= 40%) & Worth Exploring (>= 25%)
  const { strongMatches, explorationMatches, allVisibleMatches } =
    getTieredCareerMatches(result.top_careers);

  // Collect all skill gaps and next steps from visible careers (or fallback to top_careers)
  const careersForInsights =
    allVisibleMatches.length > 0 ? allVisibleMatches : result.top_careers;
  const allSkillGaps = careersForInsights.flatMap((c) =>
    c.skill_gaps.map((sg) => ({
      skill: sg,
      level: "Focus Area",
      action: `Relevant for ${c.career_name}`,
    }))
  );
  // Deduplicate by skill name, keep first occurrence
  const uniqueGaps = allSkillGaps.filter(
    (gap, idx, arr) => arr.findIndex((g) => g.skill === gap.skill) === idx
  );

  const allNextSteps = careersForInsights
    .flatMap((c) => c.next_steps)
    .filter((step, idx, arr) => arr.indexOf(step) === idx)
    .slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* 1. HEADER: Personalized Match Framing */}
      <div className="text-center mb-8 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-4">
          <Compass className="h-4 w-4" />
          <span>Your Personalized Career Matches</span>
        </div>
        
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 text-foreground">
          <BlurText text="Your Career Matches" delay={0.08} className="inline-block" />
        </h1>
        
        <p className="text-base sm:text-lg text-secondary-foreground font-medium max-w-2xl mx-auto leading-relaxed">
          Based on your assessment, here are the careers most suited to your profile.
        </p>
      </div>

      {/* 2. HOW TO READ THIS (Subtle information section) */}
      <div className="mb-14 p-4 sm:p-5 rounded-xl bg-[#10141A] border border-border/70 flex items-start gap-3.5 max-w-3xl mx-auto">
        <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">
          <Info className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-xs sm:text-sm font-semibold text-foreground mb-1">
            How your matches are scored
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            These matches are scored from your trait profile across 8 dimensions. Career paths with at least {CAREER_MATCH_THRESHOLD}% profile alignment are presented as your Strong Matches. When fewer than 3 strong matches qualify, paths with at least {CAREER_EXPLORATION_THRESHOLD}% alignment are included for directional exploration.
          </p>
        </div>
      </div>

      <div className="space-y-16">
        {/* 3 & 4. CAREER DIRECTIONS WORTH EXPLORING + MULTIPLE CARDS */}
        <section>
          {allVisibleMatches.length > 0 ? (
            <CareerMatches
              strongMatches={strongMatches}
              explorationMatches={explorationMatches}
            />
          ) : (
            <div className="rounded-2xl border border-border/80 bg-[#10141A] p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-xl">
              <div className="h-14 w-14 mx-auto rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-5">
                <Compass className="h-7 w-7" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-3">
                No Direct Matches Above Threshold
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">
                We couldn&apos;t find any direct or exploratory matches above our alignment threshold ({CAREER_EXPLORATION_THRESHOLD}%).
                The assessment produces directional guidance; exploring broader career domains is available, or you can retake the assessment.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/assessment"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary-hover shadow-sm transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retake Assessment
                </Link>
                <Link
                  href="/careers"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-[#10141A] px-6 text-sm font-semibold text-foreground hover:bg-[#141920] hover:border-border transition-colors"
                >
                  Explore More Careers
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Optional Account Creation CTA for Guest Users */}
        {!isAuthenticated && (
          <section className="relative overflow-hidden rounded-2xl border border-primary/30 bg-linear-to-br from-[#10141A] via-[#141920] to-[#10141A] p-6 sm:p-8 shadow-xl">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 border border-primary/25 text-xs font-semibold text-primary mb-3">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Optional Account</span>
                </div>
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-2">
                  Save your results &amp; track your roadmap
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Create a free account to securely save your personalized matches, access your custom learning roadmap, and track milestone progress on your dashboard across all devices.
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-secondary-foreground">
                  <span className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-primary" />
                    Save 8-trait career profile
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-primary" />
                    Unlock personalized dashboard
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-primary" />
                    Track learning milestones
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-stretch gap-3 w-full sm:w-auto shrink-0">
                <Link
                  href="/signup"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-7 text-sm font-semibold text-primary-foreground hover:bg-primary-hover shadow-md shadow-primary/20 transition-all hover:scale-[1.02]"
                >
                  <span>Create Account</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-border/70 bg-[#10141A] px-5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-[#141920] transition-colors text-center"
                >
                  Already have an account? Sign in
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* 4b. PERSONALIZED CAREER DIRECTION HIERARCHY */}
        {allVisibleMatches.length > 0 && (
          <section>
            <PersonalizedHierarchy topMatches={allVisibleMatches} />
          </section>
        )}

        {/* 5. WHAT'S SHOWING UP IN YOUR RESPONSES? */}
        <section>
          <UserSignals traits={result.trait_profile as unknown as Record<string, number>} />
        </section>

        {/* Contextual Deep Dive: Academic Streams & Growth Areas (Collapsible) */}
        <section className="rounded-xl border border-border/70 bg-[#10141A]/60 overflow-hidden transition-all">
          <button
            onClick={() => setShowStreamDetails(!showStreamDetails)}
            className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-[#141920] transition-colors cursor-pointer"
          >
            <div>
              <h3 className="font-heading text-lg font-bold text-foreground">
                Academic Stream &amp; Skill Development Perspectives
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Explore how Science, Commerce, and Arts align with your responses, plus recommended focus skills.
              </p>
            </div>
            <div className="h-8 w-8 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground shrink-0 ml-4">
              {showStreamDetails ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </button>

          {showStreamDetails && (
            <div className="p-6 sm:p-8 border-t border-border space-y-12 bg-card/40 animate-in fade-in duration-300">
              {/* Stream Breakdown */}
              <div>
                <SuitabilityScores
                  scores={result.streams.scores}
                  descriptions={result.streams.descriptions}
                />
              </div>

              {/* Skills to develop */}
              <div className="pt-4 border-t border-border/80">
                <SkillGaps gaps={uniqueGaps} />
              </div>

              {/* Practical steps */}
              <div className="pt-4 border-t border-border/80">
                <NextSteps steps={allNextSteps} />
              </div>
            </div>
          )}
        </section>

        {/* 6. EXPLORE MORE / RETAKE */}
        <section className="p-8 sm:p-10 rounded-2xl bg-card border border-border text-center max-w-3xl mx-auto">
          <h3 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Not what you were looking for?
          </h3>
          <p className="text-secondary-foreground text-sm sm:text-base leading-relaxed mb-8 max-w-2xl mx-auto">
            Retake the assessment for a fresh analysis, or browse careers you&apos;re curious about beyond your personalized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/assessment"
              className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground hover:bg-primary-hover shadow-sm transition-all"
            >
              Retake Assessment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/careers"
              className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-xl border border-border/70 bg-[#10141A] px-6 text-sm font-medium text-muted-foreground hover:bg-[#141920] hover:text-foreground transition-all"
            >
              Explore More Careers
            </Link>
          </div>
        </section>

        {/* Return Home */}
        <div className="pt-2 flex justify-center">
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-card px-6 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-card-hover transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
