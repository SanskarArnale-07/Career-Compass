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
import { CareerMeaningSection } from "@/components/results/CareerMeaningSection";
import { ContributingTraitsVisual } from "@/components/results/ContributingTraitsVisual";
import { ProgressiveHierarchy } from "@/components/results/ProgressiveHierarchy";
import { SuitabilityScores } from "@/components/results/SuitabilityScores";
import { CareerDiscoveryAnimation } from "@/components/interactive/CareerDiscoveryAnimation";
import { assessmentQuestions } from "@/lib/assessment-data";
import { saveAssessmentResult, loadCareerJourney } from "@/lib/persistence";
import { useAuth } from "@/context/AuthContext";
import { getCareerHierarchy } from "@/lib/career-hierarchy";
import { getCareerSlug } from "@/lib/career-details";
import {
  getTieredCareerMatches,
  isStrongMatch,
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
    const MIN_DISCOVERY_TIME = 400;

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

  // 3. Failsafe timer: ensure user is never trapped in the animation for more than 2s
  useEffect(() => {
    if (assessmentData && animationPhase !== "complete") {
      const failsafe = setTimeout(() => {
        setAnimationPhase("complete");
      }, 2000);
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

  // Current active career (defaults to primary match)
  const primaryCareer = allVisibleMatches[0] || result?.top_careers[0];
  const currentCareer = activeCareer || primaryCareer;
  const currentHierarchy = currentCareer
    ? getCareerHierarchy(currentCareer.career_name)
    : null;
  const currentTitle =
    currentHierarchy?.path.name || currentCareer?.career_name || "Software Development";
  const currentSlug =
    currentHierarchy?.path.slug ||
    (currentCareer ? getCareerSlug(currentCareer.career_name) : "software-development");
  const currentScore = currentCareer
    ? Math.round(currentCareer.match_percentage)
    : 0;
  const isCurrentStrong = isStrongMatch(currentScore);

  // Consistent explanation: strictly enforces Strong Match vs Worth Exploring
  const currentExplanation = useMemo(() => {
    const topTraits = currentCareer?.top_traits || [];
    const traitsText = topTraits.length >= 2
      ? `${topTraits[0].toLowerCase()} and ${topTraits[1].toLowerCase()}`
      : "technical and analytical";

    if (isCurrentStrong) {
      return `Your ${traitsText} profile shows strong alignment with ${currentTitle}. This career direction leverages your natural strengths.`;
    }
    return `Your ${traitsText} profile shows this is a direction worth exploring within ${currentTitle}.`;
  }, [isCurrentStrong, currentTitle, currentCareer?.top_traits]);



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
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-[1150px] space-y-8 sm:space-y-12">
        {/* ─────────────────────────────────────────────────────────────
            1. HERO — YOUR CAREER RESULT
            Immediate focal point: Recommended Career Path
            Communicates within 2-3s: "This is my recommended career direction."
            Software Development · 43% Match · Strong Match · Engineering & Technology
            ───────────────────────────────────────────────────────────── */}
        <section className="relative pt-3 pb-2 sm:pt-5 sm:pb-3 text-center flex flex-col items-center">
          {/* Subtle cosmic ambient glow */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-80 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Eyebrow: YOUR CAREER RESULT */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-cyan-500/30 bg-[#10141A]/90 text-cyan-300 text-xs font-mono font-semibold tracking-widest uppercase mb-3 shadow-sm shadow-cyan-950/30">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>YOUR CAREER RESULT</span>
          </div>

          {/* Matched Career Path Heading — UNMISTAKABLE FOCAL POINT (32–48px desktop) */}
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2 leading-tight max-w-3xl">
            {currentTitle}
          </h1>

          {/* Domain context as clean subtitle */}
          {currentHierarchy?.domain && (
            <p className="text-xs sm:text-sm font-mono text-cyan-400/90 mb-3">
              {currentHierarchy.domain.name}
            </p>
          )}

          {/* Telemetry Indicator: Percentage · Tier */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-3.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs sm:text-sm font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-950/20">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>{currentScore}% Match</span>
            </span>

            <span
              className={`inline-flex items-center px-3 py-1 rounded-xl text-xs sm:text-sm font-mono font-semibold uppercase tracking-wider border ${
                isCurrentStrong
                  ? "bg-cyan-950/50 text-cyan-300 border-cyan-500/40"
                  : "bg-sky-950/50 text-sky-300 border-sky-500/30"
              }`}
            >
              {isCurrentStrong ? "Strong Match" : "Worth Exploring"}
            </span>
          </div>

          {/* Path Tagline (16–18px primary body, constrained width) */}
          {currentHierarchy?.path.tagline && (
            <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-xl mx-auto">
              {currentHierarchy.path.tagline}
            </p>
          )}

          {/* Connector filament to Meaning section */}
          <div className="w-px h-6 bg-linear-to-b from-cyan-400/40 to-transparent mt-4 pointer-events-none" />
        </section>

        {/* ─────────────────────────────────────────────────────────────
            2. WHAT IT MEANS & CAREER SNAPSHOT
            "What is Software Development?"
            What people actually do + Student connection + Practical snapshot
            ───────────────────────────────────────────────────────────── */}
        <section>
          <CareerMeaningSection
            careerName={currentCareer.career_name}
            careerTitle={currentTitle}
            careerSlug={currentSlug}
            matchPercentage={currentScore}
            isStrong={isCurrentStrong}
            explanation={currentExplanation}
          />
          {/* Connector filament to Profile */}
          <div className="w-px h-6 bg-linear-to-b from-cyan-500/40 to-transparent mx-auto mt-4 pointer-events-none" />
        </section>

        {/* ─────────────────────────────────────────────────────────────
            3. WHY DOES THIS FIT YOU?
            Relevant profile dimensions as evidence + Constellation visual profile
            ───────────────────────────────────────────────────────────── */}
        <section>
          <ContributingTraitsVisual
            traits={result.trait_profile as unknown as Record<string, number>}
            primaryCareerName={currentTitle}
          />
          {/* Connector filament to Career Matches */}
          <div className="w-px h-6 bg-linear-to-b from-cyan-500/30 to-transparent mx-auto mt-4 pointer-events-none" />
        </section>

        {/* ─────────────────────────────────────────────────────────────
            4. YOUR CAREER MATCHES
            Show the strongest career directions from the assessment
            Clearly distinguish primary recommendation from alternatives
            Keep canonical 40% / 25% threshold logic
            ───────────────────────────────────────────────────────────── */}
        {allVisibleMatches.length > 0 && (
          <section className="max-w-2xl mx-auto">
            <CareerMatches
              strongMatches={strongMatches}
              explorationMatches={explorationMatches}
              activeCareerName={currentCareer?.career_name}
              onExploreCareer={handleExploreCareer}
            />
            {/* Connector filament to Where This Career Can Lead */}
            <div className="w-px h-6 bg-linear-to-b from-cyan-500/30 to-transparent mx-auto mt-4 pointer-events-none" />
          </section>
        )}

        {/* ─────────────────────────────────────────────────────────────
            5 & 6. WHERE THIS CAREER CAN LEAD & CAREERS YOU COULD EXPLORE
            5: Specializations (Web & App, Systems & Cloud, Mobile...)
            6: Concrete roles (Frontend, Backend, Full-Stack...)
            ───────────────────────────────────────────────────────────── */}
        {currentCareer && (
          <section>
            <ProgressiveHierarchy
              activeCareer={currentCareer}
              allMatches={allVisibleMatches}
              onSelectCareer={(name) => setSelectedCareerName(name)}
            />
            {/* Connector filament to Academic Stream Guidance */}
            <div className="w-px h-4 bg-linear-to-b from-cyan-500/30 to-transparent mx-auto mt-2 pointer-events-none" />
          </section>
        )}

        {/* ─────────────────────────────────────────────────────────────
            7. YOUR ACADEMIC STREAM GUIDANCE
            Explain how the career direction connects to Class 11–12 stream choices
            Keep this student-facing and clearly optional/guidance-oriented
            ───────────────────────────────────────────────────────────── */}
        {result.streams && (
          <section className="rounded-2xl border border-border/50 bg-[#0D1117]/60 overflow-hidden transition-all max-w-2xl mx-auto">
            <button
              type="button"
              onClick={() => setShowStreamDetails(!showStreamDetails)}
              className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-[#141920]/60 transition-colors cursor-pointer"
            >
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-1.5">
                  <span>ACADEMIC GUIDANCE</span>
                </div>
                <h3 className="font-heading text-base sm:text-lg font-bold text-slate-100">
                  Your Academic Stream Guidance
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 font-normal mt-0.5">
                  See how this career direction connects with your Class 11–12 stream choices.
                </p>
              </div>
              <div className="h-7 w-7 rounded-lg bg-[#141920] border border-border/80 flex items-center justify-center text-slate-400 shrink-0 ml-4">
                {showStreamDetails ? (
                  <ChevronUp className="h-4 w-4 text-cyan-400" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </button>

            {showStreamDetails && (
              <div className="p-4 sm:p-5 border-t border-border/50 bg-[#080A0D]/90 animate-in fade-in duration-200">
                <SuitabilityScores
                  scores={result.streams.scores}
                  descriptions={result.streams.descriptions}
                  recommendation={result.streams.recommendation}
                />
              </div>
            )}
          </section>
        )}

        {/* ─────────────────────────────────────────────────────────────
            8. YOUR ROADMAP
            Primary CTA: View Your Roadmap
            Natural next step after understanding the career and academic choices
            ───────────────────────────────────────────────────────────── */}
        <section className="text-center pt-2 pb-2 sm:pt-4 sm:pb-3 flex flex-col items-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-xs font-mono text-cyan-400 mb-2.5">
            <span>NEXT STEP</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-100 mb-2 tracking-tight">
            Ready to explore your roadmap?
          </h2>
          <p className="text-sm sm:text-base text-cyan-400/90 font-mono mb-2">
            Career Path: <span className="text-slate-100 font-semibold">{currentTitle}</span>
          </p>
          <p className="text-sm sm:text-base text-slate-300 font-normal mb-5 max-w-xl mx-auto leading-relaxed">
            Follow a phased milestone plan covering Class 11–12 stream selection, college degrees, and core skills.
          </p>

          <Link
            href={`/career/${currentSlug}#roadmap`}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 px-8 text-sm sm:text-base font-bold text-slate-950 shadow-lg shadow-cyan-400/20 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <span>View Your Roadmap</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          {/* Connector filament to Explore More Careers */}
          <div className="w-px h-6 bg-linear-to-b from-cyan-500/30 to-transparent mx-auto mt-4 pointer-events-none" />
        </section>

        {/* ─────────────────────────────────────────────────────────────
            9. EXPLORE MORE CAREERS
            Secondary action: Link to full Career Directory
            ───────────────────────────────────────────────────────────── */}
        <section className="max-w-2xl mx-auto text-center p-6 sm:p-7 rounded-2xl border border-border/70 bg-[#0E1217]/70 shadow-sm">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141920] border border-border/80 text-xs font-mono text-slate-400 uppercase tracking-wider mb-2.5">
            <span>EXPLORE MORE CAREERS</span>
          </div>
          <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-100 mb-2">
            Looking for other career directions?
          </h3>
          <p className="text-sm sm:text-base text-slate-300 font-normal mb-5 max-w-xl mx-auto leading-relaxed">
            Discover all 24 career paths across technology, business, health, creativity, science, and more in our complete directory.
          </p>
          <Link
            href="/careers"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-cyan-500/30 bg-[#10141A] hover:bg-[#141920] hover:border-cyan-400/50 px-6 text-sm font-semibold text-cyan-300 hover:text-cyan-200 transition-all cursor-pointer"
          >
            Explore Full Career Directory →
          </Link>
        </section>

        {/* Low-Profile Guest Save Results Prompt */}
        {!isAuthenticated && (
          <section className="rounded-xl border border-cyan-500/20 bg-[#10141A]/40 p-4 sm:p-4.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 max-w-3xl mx-auto">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
                <Sparkles className="h-4 w-4" />
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-normal">
                <strong className="text-slate-100 font-medium">Save your results:</strong> Create a free account to revisit your assessment profile and custom learning roadmap anytime.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
              <Link
                href="/signup"
                className="inline-flex h-8.5 items-center justify-center rounded-lg bg-cyan-400 hover:bg-cyan-300 px-3.5 text-xs font-bold text-slate-950 transition-all cursor-pointer"
              >
                <span>Save Results</span>
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
              <Link
                href="/login"
                className="inline-flex h-8.5 items-center justify-center rounded-lg border border-border/70 bg-[#141920] px-3 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
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
