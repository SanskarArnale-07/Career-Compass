"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Compass,
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle2,
  LockOpen,
  RotateCcw,
} from "lucide-react";
import { assessmentQuestions } from "@/lib/assessment-data";

export default function AssessmentIntroPage() {
  const [resumeIndex, setResumeIndex] = useState<number | null>(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("careerCompassAssessment");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed === "object" && parsed !== null) {
          const answeredCount = Object.keys(parsed).length;
          if (answeredCount > 0 && answeredCount < assessmentQuestions.length) {
            queueMicrotask(() => {
              setResumeIndex(answeredCount);
            });
          }
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleStartFresh = () => {
    try {
      sessionStorage.removeItem("careerCompassAssessment");
      setResumeIndex(null);
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-12 sm:py-16 overflow-hidden">
      {/* Ambient background glow & radial instrument styling */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-primary/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-85 h-85 rounded-full border border-primary/15 pointer-events-none animate-[spin_60s_linear_infinite]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-130 h-130 rounded-full border border-border/40 border-dashed pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-2xl text-center flex flex-col items-center"
      >
        {/* Instrument Compass Icon Badge */}
        <div className="relative mb-6">
          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-linear-to-br from-[#141920] via-[#10141A] to-[#141920] border-2 border-primary/30 flex items-center justify-center text-primary shadow-xl shadow-primary/10">
            <Compass className="h-8 w-8 sm:h-10 sm:w-10 animate-[spin_24s_linear_infinite]" />
          </div>
          <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-primary ring-4 ring-[#080A0D] animate-pulse" />
        </div>

        {/* Eyebrow */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-primary">
            Career Compass
          </span>
          <span className="text-border">•</span>
          <span className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground">
            Assessment
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4 leading-tight">
          Let's find your direction.
        </h1>

        {/* Supporting text */}
        <p className="text-sm sm:text-base md:text-lg text-secondary-foreground mb-8 max-w-xl leading-relaxed font-sans">
          Answer a few questions about how you think, create, solve, learn, and work.
          Your responses will help map the career directions that align with you.
        </p>

        {/* Concise Information Pills (Requirement 2) */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10141A] border border-border/80 text-xs font-mono font-medium text-foreground">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
            <span>20 Questions</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10141A] border border-border/80 text-xs font-mono font-medium text-foreground">
            <Layers className="h-3.5 w-3.5 text-primary" />
            <span>8 Dimensions</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10141A] border border-border/80 text-xs font-mono font-medium text-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Personalized Career Directions</span>
          </div>
        </div>

        {/* Primary CTA and Actions */}
        <div className="flex flex-col items-center gap-3 w-full sm:w-auto">
          {resumeIndex !== null ? (
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Link
                href="/assessment/take"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base shadow-xl shadow-primary/25 hover:bg-primary-hover hover:shadow-2xl hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <span>Resume from Question {resumeIndex + 1}</span>
                <ArrowRight className="h-4 w-4 stroke-[2.5]" />
              </Link>
              <button
                onClick={handleStartFresh}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-border bg-[#10141A] text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Start Fresh</span>
              </button>
            </div>
          ) : (
            <Link
              href="/assessment/take"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base sm:text-lg shadow-xl shadow-primary/25 hover:bg-primary-hover hover:shadow-2xl hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              <span>Begin Assessment</span>
              <ArrowRight className="h-5 w-5 stroke-[2.5]" />
            </Link>
          )}

          {/* Secondary subtle text: No login required (Requirement 2 & 19) */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80 font-mono mt-2">
            <LockOpen className="h-3.5 w-3.5 text-primary/70" />
            <span>No login required · Completely free &amp; private</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
