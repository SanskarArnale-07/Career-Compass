"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { assessmentQuestions } from "@/lib/assessment-data";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Compass,
  Sparkles,
  LockOpen,
  X,
  AlertCircle,
} from "lucide-react";

interface QuestionMeta {
  dimension: string;
  category: string;
}

const QUESTION_META: Record<string, QuestionMeta> = {
  q1: { dimension: "Core Motivations", category: "Intrinsic Calling" },
  q2: { dimension: "Flow State", category: "Deep Focus & Engagement" },
  q3: { dimension: "Value Orientation", category: "Definition of Success" },
  q4: { dimension: "Personal Strengths", category: "Authentic Capabilities" },
  q5: { dimension: "Work Environments", category: "Context & Immersion" },
  q6: { dimension: "Creative Expression", category: "Craft & Building" },
  q7: { dimension: "Problem Solving", category: "Analytical & Logic Focus" },
  q8: { dimension: "Interpersonal Style", category: "Social Dynamics & Empathy" },
  q9: { dimension: "Systems & Organization", category: "Structural Intuition" },
  q10: { dimension: "Curiosity & Discovery", category: "Scientific Inquiry" },
  q11: { dimension: "Leadership & Initiative", category: "Direction & Influence" },
  q12: { dimension: "Adaptability", category: "Uncertainty & Resilience" },
  q13: { dimension: "Decision Architecture", category: "Strategic Judgment" },
  q14: { dimension: "Tools & Mediums", category: "Working Modality" },
  q15: { dimension: "Daily Execution", category: "Rhythm & Work Cadence" },
  q16: { dimension: "Impact Orientation", category: "Scale of Contribution" },
  q17: { dimension: "Collaboration Dynamics", category: "Team vs Autonomous Flow" },
  q18: { dimension: "Career Trajectory", category: "Long-term Professional Growth" },
  q19: { dimension: "Mastery Mindset", category: "Continuous Skill Evolution" },
  q20: { dimension: "Career DNA Synthesis", category: "Ultimate Professional Legacy" },
};

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

export function AssessmentWizard() {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState<1 | -1>(1);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionStep, setCompletionStep] = useState(0);

  const currentQuestion = assessmentQuestions[currentStepIndex];
  const isLastQuestion = currentStepIndex === assessmentQuestions.length - 1;
  const progressPercentage = Math.round(
    ((currentStepIndex + 1) / assessmentQuestions.length) * 100
  );

  const meta =
    QUESTION_META[currentQuestion?.id] || {
      dimension: "Trait Exploration",
      category: "Personal Discovery",
    };

  // ── Restore saved progress from sessionStorage on mount ───────────
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("careerCompassAssessment");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed === "object" && parsed !== null) {
          setAnswers(parsed);
          // Auto-resume at first unanswered question if partial
          const firstUnanswered = assessmentQuestions.findIndex((q) => !parsed[q.id]);
          if (firstUnanswered > 0 && firstUnanswered < assessmentQuestions.length) {
            setCurrentStepIndex(firstUnanswered);
          }
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // ── Save answers continuously to sessionStorage ───────────────────
  const saveAnswers = useCallback((newAnswers: Record<string, string>) => {
    try {
      sessionStorage.setItem("careerCompassAssessment", JSON.stringify(newAnswers));
    } catch {
      // ignore
    }
  }, []);

  // ── Handle option selection ───────────────────────────────────────
  const handleSelect = (value: string) => {
    setValidationError(null);
    const updated = {
      ...answers,
      [currentQuestion.id]: value,
    };
    setAnswers(updated);
    saveAnswers(updated);
  };

  // ── Navigation ────────────────────────────────────────────────────
  const handleNext = () => {
    const selectedAnswer = answers[currentQuestion.id];
    if (!selectedAnswer) {
      setValidationError("Choose an option to continue.");
      return;
    }

    setValidationError(null);

    if (isLastQuestion) {
      // Trigger cinematic completion mapping sequence before routing
      setIsCompleting(true);
      saveAnswers(answers);

      // Step 1: responses collected
      setCompletionStep(1);

      // Step 2: traits mapped
      setTimeout(() => {
        setCompletionStep(2);
      }, 700);

      // Step 3: career directions identified
      setTimeout(() => {
        setCompletionStep(3);
      }, 1400);

      // Transition to results
      setTimeout(() => {
        router.push("/results");
      }, 2100);
    } else {
      setDirection(1);
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setValidationError(null);
    if (currentStepIndex > 0) {
      setDirection(-1);
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  // ── Keyboard shortcuts ────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore when user is on completion screen or inside an input
      if (isCompleting) return;
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Number keys 1-9 to select option
      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= currentQuestion.options.length) {
        e.preventDefault();
        handleSelect(currentQuestion.options[num - 1].value);
        return;
      }

      // Enter to advance if answered
      if (e.key === "Enter") {
        e.preventDefault();
        handleNext();
        return;
      }

      // Backspace to go back
      if (e.key === "Backspace" && currentStepIndex > 0) {
        // Only if not focused on interactive text
        e.preventDefault();
        handleBack();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStepIndex, answers, isCompleting, currentQuestion]);

  // Scroll to top smoothly when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStepIndex]);

  // ══════════════════════════════════════════════════════════════════
  // ASSESSMENT COMPLETION SCREEN (Requirement 15)
  // ══════════════════════════════════════════════════════════════════
  if (isCompleting) {
    return (
      <div className="w-full max-w-xl mx-auto px-4 py-16 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full space-y-8"
        >
          {/* Animated Compass & Constellation Orb */}
          <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping opacity-30" />
            <div className="absolute -inset-3 rounded-full border border-primary/20 animate-[spin_20s_linear_infinite]" />
            <div className="h-20 w-20 rounded-2xl bg-linear-to-br from-[#141920] via-[#10141A] to-[#141920] border border-primary/40 flex items-center justify-center text-primary shadow-xl shadow-primary/20">
              <Compass className="h-10 w-10 animate-[spin_12s_linear_infinite]" />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-primary block">
              Assessment Complete
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
              Your answers are being mapped.
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-sans max-w-md mx-auto">
              Synthesizing your cognitive strengths, work style, and aspirations...
            </p>
          </div>

          {/* Sequential Checkpoints */}
          <div className="space-y-3 max-w-md mx-auto text-left">
            <div
              className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all duration-500 ${
                completionStep >= 1
                  ? "border-primary/40 bg-primary/10 text-foreground"
                  : "border-border/50 bg-[#10141A] text-muted-foreground opacity-50"
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  completionStep >= 1
                    ? "bg-primary text-primary-foreground font-bold"
                    : "border border-border text-muted-foreground"
                }`}
              >
                {completionStep >= 1 ? <Check className="h-3 w-3 stroke-[2.5]" /> : "1"}
              </div>
              <span className="text-xs sm:text-sm font-medium">
                Responses collected (20 of 20)
              </span>
            </div>

            <div
              className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all duration-500 ${
                completionStep >= 2
                  ? "border-primary/40 bg-primary/10 text-foreground"
                  : "border-border/50 bg-[#10141A] text-muted-foreground opacity-50"
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  completionStep >= 2
                    ? "bg-primary text-primary-foreground font-bold"
                    : "border border-border text-muted-foreground"
                }`}
              >
                {completionStep >= 2 ? <Check className="h-3 w-3 stroke-[2.5]" /> : "2"}
              </div>
              <span className="text-xs sm:text-sm font-medium">
                8 Cognitive &amp; trait dimensions mapped
              </span>
            </div>

            <div
              className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all duration-500 ${
                completionStep >= 3
                  ? "border-primary/40 bg-primary/10 text-foreground"
                  : "border-border/50 bg-[#10141A] text-muted-foreground opacity-50"
              }`}
            >
              <div
                className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  completionStep >= 3
                    ? "bg-primary text-primary-foreground font-bold"
                    : "border border-border text-muted-foreground"
                }`}
              >
                {completionStep >= 3 ? <Check className="h-3 w-3 stroke-[2.5]" /> : "3"}
              </div>
              <span className="text-xs sm:text-sm font-medium">
                Personalized career trajectories resolved
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // ACTIVE QUESTION SCREEN (Requirements 4 - 14)
  // ══════════════════════════════════════════════════════════════════
  const selectedValue = answers[currentQuestion.id];

  return (
    <div className="relative w-full max-w-3xl mx-auto px-4 sm:px-6">
      {/* ── Top Bar: Exit, Dimension Label & Minimalist Progress ─────── */}
      <div className="mb-8 sm:mb-10 space-y-3">
        <div className="flex items-center justify-between text-xs">
          {/* Subtle Exit Assessment link */}
          <Link
            href="/assessment"
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors group cursor-pointer"
          >
            <X className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100" />
            <span className="text-[11px] font-mono uppercase tracking-wider">
              Exit Assessment
            </span>
          </Link>

          {/* Dimension Context Tag */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground">
            <span className="text-primary font-semibold uppercase tracking-wider">
              {meta.dimension}
            </span>
            <span className="text-border">•</span>
            <span>{meta.category}</span>
          </div>

          {/* Progress Counters */}
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="text-foreground font-bold">
              {String(currentStepIndex + 1).padStart(2, "0")} /{" "}
              {String(assessmentQuestions.length).padStart(2, "0")}
            </span>
            <span className="text-border">•</span>
            <span className="text-primary font-semibold">
              {progressPercentage}% COMPLETE
            </span>
          </div>
        </div>

        {/* Thin Cyan Progress Line */}
        <div
          className="h-1 sm:h-1.5 w-full bg-[#10141A] rounded-full overflow-hidden border border-border/40"
          role="progressbar"
          aria-valuenow={progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-linear-to-r from-primary to-[#38BDF8] rounded-full transition-all duration-300 ease-out shadow-xs shadow-primary/40"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* ── Question & Options with Smooth Transitions (Requirement 6) ─ */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: direction === 1 ? 16 : -16, filter: "blur(4px)" }}
          animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: direction === 1 ? -16 : 16, filter: "blur(4px)" }}
          transition={{ duration: 0.24, ease: "easeOut" }}
          className="space-y-6 sm:space-y-8"
        >
          {/* Question Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-mono font-bold uppercase tracking-widest text-primary">
                Question {String(currentStepIndex + 1).padStart(2, "0")}
              </span>
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider sm:hidden">
                {meta.dimension}
              </span>
            </div>

            <h2 className="font-heading text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-snug sm:leading-tight">
              {currentQuestion.question}
            </h2>

            {currentQuestion.explanation && (
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-sans pt-1">
                {currentQuestion.explanation}
              </p>
            )}
          </div>

          {/* Interactive Decision Blocks (Requirements 7 & 8) */}
          <div
            className="space-y-2.5 sm:space-y-3"
            role="radiogroup"
            aria-label={currentQuestion.question}
          >
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedValue === option.value;
              const optionLetter = OPTION_LETTERS[idx] || `${idx + 1}`;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full text-left p-3.5 sm:p-4 rounded-xl border transition-all duration-150 flex items-center justify-between gap-4 cursor-pointer select-none group focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-sm shadow-primary/15 text-foreground"
                      : "border-border/70 bg-[#10141A] hover:border-primary/40 hover:bg-[#141920] text-foreground/90"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Keycode Badge (e.g. A, B, C...) */}
                    <span
                      className={`h-6 w-6 rounded-lg text-[11px] font-mono font-bold flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-[#141920] border border-border/80 text-muted-foreground group-hover:text-foreground group-hover:border-primary/40"
                      }`}
                    >
                      {optionLetter}
                    </span>

                    <span
                      className={`text-sm sm:text-base leading-snug transition-colors ${
                        isSelected
                          ? "font-semibold text-foreground"
                          : "font-medium text-foreground/90 group-hover:text-foreground"
                      }`}
                    >
                      {option.label}
                    </span>
                  </div>

                  {/* Selection Indicator Circle */}
                  <div
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground shadow-xs shadow-primary/30"
                        : "border-border/80 bg-transparent group-hover:border-primary/40"
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 stroke-[2.5]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Validation Notice (Requirement 17) */}
          {validationError && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3.5 py-2.5 rounded-xl"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{validationError}</span>
            </motion.div>
          )}

          {/* ── Bottom Navigation Bar (Requirement 10) ───────────────── */}
          <div className="pt-6 sm:pt-8 border-t border-border/60 flex items-center justify-between gap-4">
            {/* Back Button */}
            {currentStepIndex > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border/80 bg-[#10141A] text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-[#141920] transition-all cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {/* Desktop shortcut tip */}
            <span className="hidden md:inline text-[11px] font-mono text-muted-foreground/60">
              Press 1-{currentQuestion.options.length} to select · Enter ↵ to continue
            </span>

            {/* Continue / See My Results CTA Button */}
            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm shadow-lg shadow-primary/20 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              <span>{isLastQuestion ? "See My Results" : "Continue"}</span>
              <ArrowRight className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
