"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, ArrowLeft, AlertTriangle } from "lucide-react";
import { SuitabilityScores } from "@/components/results/SuitabilityScores";
import { CareerMatches } from "@/components/results/CareerMatches";
import { CareerExplanation } from "@/components/results/CareerExplanation";
import { SkillGaps } from "@/components/results/SkillGaps";
import { NextSteps } from "@/components/results/NextSteps";

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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function scoreAssessment(
  answers: Record<string, string>
): Promise<AssessmentResponse> {
  const resp = await fetch(`${API_BASE}/api/v1/assessment/score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  });

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
  const [loading, setLoading] = useState(true);

  // 1. Read answers from sessionStorage
  useEffect(() => {
    setIsClient(true);
    const data = sessionStorage.getItem("careerCompassAssessment");
    if (data) {
      try {
        setAssessmentData(JSON.parse(data));
      } catch (e) {
        console.error("Failed to parse assessment data", e);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  // 2. Call backend scoring API when answers are available
  useEffect(() => {
    if (!assessmentData) return;

    scoreAssessment(assessmentData)
      .then((res) => {
        setResult(res);
        setError(null);
      })
      .catch((err) => {
        console.error("Scoring API error:", err);
        setError(err.message || "Failed to score assessment.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [assessmentData]);

  // ── Loading state ─────────────────────────────────────────────
  if (!isClient || loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground font-medium">
            Analyzing your career profile…
          </p>
        </div>
      </div>
    );
  }

  // ── No assessment data ────────────────────────────────────────
  if (!assessmentData) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center py-20 flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-6">
            ?
          </div>
          <h1 className="font-heading text-3xl font-bold mb-4">
            No Assessment Data Found
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            It looks like you haven&apos;t completed the career assessment yet,
            or your session has expired.
          </p>
          <Link
            href="/assessment"
            className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Take Assessment
          </Link>
        </div>
      </div>
    );
  }

  // ── API Error state ───────────────────────────────────────────
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center py-20 flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-6">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h1 className="font-heading text-3xl font-bold mb-4">
            Something Went Wrong
          </h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            {error}
          </p>
          <div className="flex gap-4">
            <Link
              href="/assessment"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-background px-8 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Retake Assessment
            </Link>
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                if (assessmentData) {
                  scoreAssessment(assessmentData)
                    .then((res) => {
                      setResult(res);
                      setError(null);
                    })
                    .catch((err) => setError(err.message))
                    .finally(() => setLoading(false));
                }
              }}
              className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Try Again
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
      <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Your Career DNA Profile
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Here is your personalized roadmap for Class 11 and beyond, based on
          your unique interests and personality.
        </p>
      </div>

      <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
        {/* Step 1: Suitability */}
        <section>
          <SuitabilityScores
            scores={result.streams.scores}
            descriptions={result.streams.descriptions}
          />
        </section>

        {/* Step 2: Career Matches */}
        <section>
          <CareerMatches careers={result.top_careers} />
        </section>

        {/* Step 3: Explanation */}
        <section>
          <CareerExplanation explanation={result.streams.recommendation} />
        </section>

        {/* Step 4: Skill Gaps */}
        <section>
          <SkillGaps gaps={uniqueGaps} />
        </section>

        {/* Step 5: Next Steps */}
        <section>
          <NextSteps steps={allNextSteps} />
        </section>

        <div className="pt-8 border-t border-border flex justify-center">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-background px-8 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
