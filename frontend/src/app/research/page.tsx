"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Users,
  Compass,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Award,
  Layers,
  ShieldCheck,
  BookOpen,
  PieChart,
} from "lucide-react";
import type { FeedbackStats } from "@/lib/feedback/types";

interface ResearchMetrics {
  total_assessments_started: number;
  total_assessments_completed: number;
  assessment_completion_rate: number | null;
  total_students_evaluated: number;
  total_feedback_submissions: number;
  feedback_submission_rate: number | null;
  average_profile_clarity: number | null;
  average_career_relevance: number | null;
  average_usefulness: number | null;
  average_confidence_before: number | null;
  average_confidence_after: number | null;
  confidence_improvement: number | null;
  discovery_rate_percent: number | null;
  recommendation_rate_percent: number | null;
  average_careers_explored: number;
  total_events_tracked: number;
  career_exploration_funnel: Record<string, number>;
  top_explored_domains: Array<{ domain: string; views: number }>;
  top_explored_paths: Array<{ path: string; views: number }>;
}

export default function ResearchPage() {
  const [metrics, setMetrics] = useState<ResearchMetrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchMetrics = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/analytics/metrics", {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (e) {
      console.warn("Failed to fetch research metrics:", e);
    } finally {
      setIsLoading(false);
      setLastRefreshed(new Date());
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const hasFeedbackData =
    metrics && metrics.total_feedback_submissions > 0;
  const hasAssessmentData =
    metrics && metrics.total_assessments_started > 0;

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Top Banner */}
      <div className="border-b border-border/80 bg-[#0B0E12]/80 backdrop-blur-md">
        <div className="container mx-auto px-4 max-w-6xl py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/25 text-primary">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold text-primary uppercase tracking-wider">
                  Research &amp; Utilization Analytics
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
                  Live Telemetry
                </span>
              </div>
              <h1 className="text-lg font-heading font-bold text-foreground">
                Career Compass Empirical Study &amp; Impact Dashboard
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={fetchMetrics}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/70 bg-[#141920] text-xs font-mono text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </button>
            <span className="text-[10px] font-mono text-muted-foreground/60 hidden md:inline">
              Refreshed {lastRefreshed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl pt-8 space-y-8">
        {/* Research Overview Abstract */}
        <div className="p-6 rounded-2xl border border-border/80 bg-card space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-primary">
            <ShieldCheck className="h-4 w-4" />
            <span>Honest Evaluation Protocol</span>
          </div>
          <h2 className="text-xl font-heading font-bold text-foreground">
            Systematic Assessment Validity &amp; Student Guidance Outcomes
          </h2>
          <p className="text-xs sm:text-sm text-secondary-foreground leading-relaxed max-w-4xl">
            This dashboard reports transparent, unmanipulated operational metrics and evaluation responses collected across active student cohorts. We measure psychometric completion rates, cognitive profile clarity, self-reported pre/post guidance confidence shifts, and career path discovery. No numbers are simulated.
          </p>
        </div>

        {/* Primary Metric Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="p-4 rounded-xl border border-border/70 bg-[#0B0E12] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Assessments Started
            </span>
            <div className="text-2xl font-heading font-bold text-foreground">
              {metrics?.total_assessments_started ?? 0}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Initial student onboarding sessions
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border/70 bg-[#0B0E12] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Completion Rate
            </span>
            <div className="text-2xl font-heading font-bold text-primary">
              {metrics?.assessment_completion_rate !== null &&
              metrics?.assessment_completion_rate !== undefined
                ? `${metrics.assessment_completion_rate}%`
                : "—"}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {metrics?.total_assessments_completed ?? 0} completed psychometric runs
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border/70 bg-[#0B0E12] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Feedback Submissions
            </span>
            <div className="text-2xl font-heading font-bold text-secondary">
              {metrics?.total_feedback_submissions ?? 0}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Structured student evaluations (Q A–K)
            </p>
          </div>

          <div className="p-4 rounded-xl border border-border/70 bg-[#0B0E12] space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Confidence Shift (Pre/Post)
            </span>
            <div className="text-2xl font-heading font-bold text-emerald-400">
              {metrics?.confidence_improvement !== null &&
              metrics?.confidence_improvement !== undefined
                ? `+${metrics.confidence_improvement}`
                : "—"}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Average Likert point increase
            </p>
          </div>
        </div>

        {/* Section: Guidance Quality Ratings (Questions A–G) */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-secondary/10 border border-secondary/25 text-secondary">
              <Award className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-heading text-base font-bold text-foreground">
                Student Evaluation Ratings (Scale 1.0 – 5.0)
              </h3>
              <p className="text-xs text-muted-foreground">
                Averaged from verified post-assessment student feedback submissions
              </p>
            </div>
          </div>

          {hasFeedbackData ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#0B0E12] border border-border/60 space-y-2">
                <span className="text-[10px] font-mono uppercase text-muted-foreground">
                  Question A
                </span>
                <h4 className="text-xs font-bold text-foreground">
                  Profile Clarity
                </h4>
                <div className="text-2xl font-mono font-bold text-primary">
                  {metrics.average_profile_clarity?.toFixed(2) ?? "—"}
                  <span className="text-xs text-muted-foreground"> / 5.0</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Understandability of archetype and trait breakdowns
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0B0E12] border border-border/60 space-y-2">
                <span className="text-[10px] font-mono uppercase text-muted-foreground">
                  Question B
                </span>
                <h4 className="text-xs font-bold text-foreground">
                  Career Relevance
                </h4>
                <div className="text-2xl font-mono font-bold text-secondary">
                  {metrics.average_career_relevance?.toFixed(2) ?? "—"}
                  <span className="text-xs text-muted-foreground"> / 5.0</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Degree of alignment with real student interests &amp; aspirations
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0B0E12] border border-border/60 space-y-2">
                <span className="text-[10px] font-mono uppercase text-muted-foreground">
                  Question D
                </span>
                <h4 className="text-xs font-bold text-foreground">
                  Exploration Usefulness
                </h4>
                <div className="text-2xl font-mono font-bold text-cyan-400">
                  {metrics.average_usefulness?.toFixed(2) ?? "—"}
                  <span className="text-xs text-muted-foreground"> / 5.0</span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Utility of roadmap stages and hierarchical domain trees
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-xl bg-[#0B0E12] border border-border/60 text-center space-y-2">
              <p className="text-sm font-semibold text-foreground">
                Collecting Initial Cohort Feedback
              </p>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                No student feedback forms have been submitted yet. Complete an assessment and submit your evaluation on the Profile or Guide page to populate live ratings.
              </p>
              <Link
                href="/assessment"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover transition-colors mt-2"
              >
                <span>Take Assessment to Participate</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          {/* Discovery & Recommendation Highlights */}
          {hasFeedbackData && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#0B0E12] border border-border/70 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    New Career Discovery Rate
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Students discovering options they had not previously considered
                  </p>
                </div>
                <span className="text-xl font-heading font-bold text-cyan-400">
                  {metrics.discovery_rate_percent !== null
                    ? `${metrics.discovery_rate_percent}%`
                    : "—"}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#0B0E12] border border-border/70 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Peer Recommendation Rate
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Students who would recommend Career Compass to classmates
                  </p>
                </div>
                <span className="text-xl font-heading font-bold text-emerald-400">
                  {metrics.recommendation_rate_percent !== null
                    ? `${metrics.recommendation_rate_percent}%`
                    : "—"}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Section: Funnel & Exploration Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Exploration Funnel */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-primary">
              <TrendingUp className="h-4 w-4" />
              <span>Journey Conversion Funnel</span>
            </div>
            <h3 className="font-heading text-base font-bold text-foreground">
              User Progression Across Guidance Milestones
            </h3>

            <div className="space-y-3 pt-2">
              {[
                {
                  key: "started",
                  label: "Assessment Started",
                  count: metrics?.career_exploration_funnel?.started ?? metrics?.total_assessments_started ?? 0,
                },
                {
                  key: "completed",
                  label: "Assessment Completed",
                  count: metrics?.career_exploration_funnel?.completed ?? metrics?.total_assessments_completed ?? 0,
                },
                {
                  key: "profile_viewed",
                  label: "Profile & Archetype Viewed",
                  count: metrics?.career_exploration_funnel?.profile_viewed ?? 0,
                },
                {
                  key: "roadmap_viewed",
                  label: "Roadmap Stage Explored",
                  count: metrics?.career_exploration_funnel?.roadmap_viewed ?? 0,
                },
                {
                  key: "feedback_given",
                  label: "Guidance Feedback Submitted",
                  count: metrics?.career_exploration_funnel?.feedback_given ?? metrics?.total_feedback_submissions ?? 0,
                },
              ].map((step, idx) => {
                const base = Math.max(1, metrics?.career_exploration_funnel?.started ?? metrics?.total_assessments_started ?? 1);
                const pct = Math.min(100, Math.round((step.count / base) * 100));

                return (
                  <div key={step.key} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{step.label}</span>
                      <span className="font-mono font-semibold text-foreground">
                        {step.count} ({step.count > 0 ? `${pct}%` : "0%"})
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-[#10141A] overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Academic Integrity & Methodology */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-secondary">
                <BookOpen className="h-4 w-4" />
                <span>Methodology &amp; Disclaimers</span>
              </div>
              <h3 className="font-heading text-base font-bold text-foreground mt-1 mb-3">
                Non-Deterministic Guidance Protocol
              </h3>

              <div className="space-y-3 text-xs text-secondary-foreground/90 leading-relaxed">
                <p>
                  <strong>1. Trait Assessment vs. Exam Selection:</strong> Psychometric alignment measures intrinsic cognitive synergy and work style fit. It does <em>not</em> forecast competitive exam pass rates (e.g. UPSC Civil Services, JEE, NEET, CAT), where actual selection depends heavily on vacancies, year-specific competition, and intensive syllabus preparation.
                </p>
                <p>
                  <strong>2. Explainability Mandate:</strong> Career Compass adheres to deterministic, auditable trait scoring. No career recommendation is presented as a black-box percentage without explicit causal attribution.
                </p>
                <p>
                  <strong>3. Privacy-First Telemetry:</strong> All usage events are anonymized and aggregated. Personal identifiers, passwords, and private assessment responses are excluded from research datasets.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-mono text-[11px]">
                Events logged: {metrics?.total_events_tracked ?? 0}
              </span>
              <Link
                href="/resources"
                className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
              >
                <span>Browse Verified Learning Resources</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
