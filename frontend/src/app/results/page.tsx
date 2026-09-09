"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, AlertTriangle, Compass, Info, ChevronDown, ChevronUp } from "lucide-react";
import { SuitabilityScores } from "@/components/results/SuitabilityScores";
import { CareerMatches } from "@/components/results/CareerMatches";
import { UserSignals } from "@/components/results/UserSignals";
import { SkillGaps } from "@/components/results/SkillGaps";
import { NextSteps } from "@/components/results/NextSteps";
import { CareerDiscoveryAnimation } from "@/components/interactive/CareerDiscoveryAnimation";
import { assessmentQuestions } from "@/lib/assessment-data";

// ── Types matching the backend response ─────────────────────────────

interface TraitProfile {
  AN: number;
  TE: number;
  SC: number;
  BU: number;
  CR: number;
  SO: number;
  LE: number;
  EX: number;
}

interface StreamScores {
  science: number;
  commerce: number;
  arts: number;
}

interface StreamResult {
  scores: StreamScores;
  recommendation: string;
  descriptions: Record<string, string>;
}

interface CareerMatch {
  career_name: string;
  match_percentage: number;
  top_traits: string[];
  explanation: string;
  skill_gaps: string[];
  next_steps: string[];
}

interface AssessmentResponse {
  trait_profile: TraitProfile;
  streams: StreamResult;
  top_careers: CareerMatch[];
}

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
    });
  } catch {
    resp = await fetch(`${API_BASE}/api/v1/assessment/score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
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

// ── Page Component ──────────────────────────────────────────────────

export default function ResultsPage() {
  const [isClient, setIsClient] = useState(false);
  const [assessmentData, setAssessmentData] = useState<Record<
    string,
    string
  > | null>(null);
  const [result, setResult] = useState<AssessmentResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [animationPhase, setAnimationPhase] = useState<"discovering" | "resolving" | "complete">("discovering");
  const [showStreamDetails, setShowStreamDetails] = useState(false);

  // 1. Read answers from sessionStorage
  useEffect(() => {
    setIsClient(true);
    const data = sessionStorage.getItem("careerCompassAssessment");
    if (data) {
      try {
        setAssessmentData(JSON.parse(data));
      } catch (e) {
        console.error("Failed to parse assessment data", e);
        setAnimationPhase("complete");
      }
    } else {
      setAnimationPhase("complete");
    }
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
          <div className="h-16 w-16 rounded-full bg-[#0F172A] border border-border flex items-center justify-center text-muted-foreground mb-6 font-mono text-xl">
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
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-[#0F172A] px-8 text-sm font-semibold text-foreground hover:bg-card-hover hover:border-primary/40 transition-colors cursor-pointer"
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
              className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-[#0F172A] px-6 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-card-hover transition-colors cursor-pointer"
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

  // Collect all skill gaps and next steps from top careers
  const allSkillGaps = result.top_careers.flatMap((c) =>
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

  const allNextSteps = result.top_careers
    .flatMap((c) => c.next_steps)
    .filter((step, idx, arr) => arr.indexOf(step) === idx)
    .slice(0, 5);

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* 1. HEADER: Exploratory Compass Framing */}
      <div className="text-center mb-8 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-4">
          <Compass className="h-4 w-4" />
          <span>Exploratory Career Compass</span>
        </div>
        
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3 text-foreground">
          Your Career Compass
        </h1>
        
        <p className="text-base sm:text-lg text-secondary-foreground font-medium max-w-2xl mx-auto leading-relaxed">
          Your responses point toward several career directions that may be worth exploring.
        </p>
      </div>

      {/* 2. HOW TO READ THIS (Subtle information section) */}
      <div className="mb-14 p-4 sm:p-5 rounded-xl bg-[#0F172A] border border-border flex items-start gap-3.5 max-w-3xl mx-auto">
        <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">
          <Info className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-xs sm:text-sm font-semibold text-foreground mb-1">
            How to read your results
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            These directions reflect patterns in your responses. They aren&apos;t predictions of what you will become. Your skills, experiences, interests, and goals can all influence which path is right for you.
          </p>
        </div>
      </div>

      <div className="space-y-16">
        {/* 3 & 4. CAREER DIRECTIONS WORTH EXPLORING + MULTIPLE CARDS */}
        <section>
          <CareerMatches careers={result.top_careers} />
        </section>

        {/* 5. WHAT'S SHOWING UP IN YOUR RESPONSES? */}
        <section>
          <UserSignals traits={result.trait_profile as unknown as Record<string, number>} />
        </section>

        {/* Contextual Deep Dive: Academic Streams & Growth Areas (Collapsible) */}
        <section className="rounded-2xl border border-border bg-[#0F172A]/50 overflow-hidden transition-all">
          <button
            onClick={() => setShowStreamDetails(!showStreamDetails)}
            className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-[#0F172A] transition-colors cursor-pointer"
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

        {/* 6. KEEP YOUR OPTIONS OPEN */}
        <section className="p-8 sm:p-10 rounded-2xl bg-card border border-border text-center max-w-3xl mx-auto">
          <h3 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Keep your options open
          </h3>
          <p className="text-secondary-foreground text-sm sm:text-base leading-relaxed mb-8 max-w-2xl mx-auto">
            Career choices are influenced by your interests, skills, experiences, values, and goals — many of which can change over time. Use these directions as a starting point, then explore what actually interests you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/careers"
              className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground hover:bg-primary-hover shadow-sm transition-all"
            >
              Explore Careers
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/assessment"
              className="inline-flex h-12 w-full sm:w-auto items-center justify-center rounded-xl border border-border bg-[#0F172A] px-6 text-sm font-medium text-secondary-foreground hover:bg-card-hover hover:text-foreground transition-all"
            >
              Retake Assessment
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
