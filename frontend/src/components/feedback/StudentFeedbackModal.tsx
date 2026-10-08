"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { submitStudentFeedback } from "@/lib/feedback/api";
import type { StudentFeedbackPayload } from "@/lib/feedback/types";

interface StudentFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId?: string;
  sourceContext?: string;
}

export function StudentFeedbackModal({
  isOpen,
  onClose,
  sessionId = "session-profile",
  sourceContext = "profile",
}: StudentFeedbackModalProps) {
  const { token, user } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1); // 1 = Ratings, 2 = Discovery & Notes, 3 = Success
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [profileClarity, setProfileClarity] = useState<number>(5);
  const [careerRelevance, setCareerRelevance] = useState<number>(5);
  const [strengthsUnderstanding, setStrengthsUnderstanding] = useState<number>(5);
  const [explorationUsefulness, setExplorationUsefulness] = useState<number>(5);
  const [confidenceBefore, setConfidenceBefore] = useState<number>(2);
  const [confidenceAfter, setConfidenceAfter] = useState<number>(4);
  const [explanationClarity, setExplanationClarity] = useState<number>(5);

  const [discoveredNew, setDiscoveredNew] = useState<boolean>(true);
  const [recommendToOthers, setRecommendToOthers] = useState<boolean>(true);
  const [mostUseful, setMostUseful] = useState<string>("");
  const [improvementSuggestion, setImprovementSuggestion] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMsg(null);

    const payload: StudentFeedbackPayload = {
      session_id: sessionId || `student-${user?.id || "anon"}-${Date.now()}`,
      profile_clarity_score: profileClarity,
      career_relevance_score: careerRelevance,
      strengths_understanding_score: strengthsUnderstanding,
      career_exploration_usefulness_score: explorationUsefulness,
      confidence_before: confidenceBefore,
      confidence_after: confidenceAfter,
      recommendation_explanation_score: explanationClarity,
      discovered_new_career: discoveredNew,
      recommend_to_others: recommendToOthers,
      most_useful: mostUseful.trim() || undefined,
      improvement_suggestion: improvementSuggestion.trim() || undefined,
    };

    try {
      const res = await submitStudentFeedback(payload, token);
      if (res.success) {
        setStep(3);
      } else {
        setErrorMsg("Failed to submit feedback. Please try again.");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRatingRow = (
    label: string,
    sub: string,
    value: number,
    onChange: (val: number) => void
  ) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-[#0B0E12] border border-border/70">
      <div className="min-w-0">
        <p className="text-xs font-semibold text-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground">{sub}</p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => onChange(num)}
            className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold transition-all cursor-pointer ${
              value === num
                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                : "bg-[#141920] border border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-2xl border border-border/80 bg-card p-6 shadow-2xl shadow-black/60 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-[#141920] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* ── STEP 1: Core Ratings ─────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/25 text-primary">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground">
                  Student Guidance Feedback
                </h3>
                <p className="text-xs text-muted-foreground">
                  Step 1 of 2: Rate clarity, relevance, and confidence impact
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {renderRatingRow(
                "Profile Clarity",
                "How easy was your profile and cognitive archetype to understand?",
                profileClarity,
                setProfileClarity
              )}

              {renderRatingRow(
                "Career Relevance",
                "How accurately did suggested careers align with your real interests?",
                careerRelevance,
                setCareerRelevance
              )}

              {renderRatingRow(
                "Strengths Understanding",
                "Did this assessment deepen your understanding of your cognitive skills?",
                strengthsUnderstanding,
                setStrengthsUnderstanding
              )}

              {renderRatingRow(
                "Exploration Tools",
                "How useful are the roadmap stages and career hierarchies?",
                explorationUsefulness,
                setExplorationUsefulness
              )}

              {renderRatingRow(
                "Why-Fit Explanation",
                "How clearly did we explain WHY these careers match your traits?",
                explanationClarity,
                setExplanationClarity
              )}
            </div>

            {/* Confidence Delta Comparative Picker */}
            <div className="p-4 rounded-xl bg-[#0B0E12] border border-primary/25 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>Career Direction Confidence</span>
                </div>
                <span className="text-[11px] font-mono font-bold text-emerald-400">
                  {confidenceAfter - confidenceBefore >= 0 ? "+" : ""}
                  {confidenceAfter - confidenceBefore} Point Shift
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground font-mono">
                    Before Career Compass (1-5)
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setConfidenceBefore(n)}
                        className={`flex-1 py-1 rounded text-xs font-mono font-semibold transition-colors cursor-pointer ${
                          confidenceBefore === n
                            ? "bg-slate-700 text-foreground"
                            : "bg-[#141920] text-muted-foreground hover:bg-[#1a202c]"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-muted-foreground font-mono">
                    After Guidance Today (1-5)
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setConfidenceAfter(n)}
                        className={`flex-1 py-1 rounded text-xs font-mono font-semibold transition-colors cursor-pointer ${
                          confidenceAfter === n
                            ? "bg-primary text-primary-foreground font-bold"
                            : "bg-[#141920] text-muted-foreground hover:bg-[#1a202c]"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover shadow-md shadow-primary/20 transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Discovery & Qualitative Notes ────────────────── */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-secondary/10 border border-secondary/25 text-secondary">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-bold text-foreground">
                  Discovery &amp; Open Feedback
                </h3>
                <p className="text-xs text-muted-foreground">
                  Step 2 of 2: Help shape our ongoing research and platform improvements
                </p>
              </div>
            </div>

            {/* Quick Yes/No Questions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-[#0B0E12] border border-border/70 space-y-2">
                <p className="text-xs font-semibold text-foreground">
                  Discovered New Career Options?
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setDiscoveredNew(true)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      discoveredNew
                        ? "bg-primary text-primary-foreground"
                        : "bg-[#141920] text-muted-foreground"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiscoveredNew(false)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      !discoveredNew
                        ? "bg-slate-700 text-foreground"
                        : "bg-[#141920] text-muted-foreground"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0B0E12] border border-border/70 space-y-2">
                <p className="text-xs font-semibold text-foreground">
                  Would Recommend to Peers?
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setRecommendToOthers(true)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      recommendToOthers
                        ? "bg-primary text-primary-foreground"
                        : "bg-[#141920] text-muted-foreground"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecommendToOthers(false)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      !recommendToOthers
                        ? "bg-slate-700 text-foreground"
                        : "bg-[#141920] text-muted-foreground"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>

            {/* Open fields */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  What was most helpful or clear?
                </label>
                <textarea
                  rows={2}
                  value={mostUseful}
                  onChange={(e) => setMostUseful(e.target.value)}
                  placeholder="e.g. Explaining why software engineering fits my technical skills..."
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0E12] border border-border/80 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  What could we improve or add next?
                </label>
                <textarea
                  rows={2}
                  value={improvementSuggestion}
                  onChange={(e) => setImprovementSuggestion(e.target.value)}
                  placeholder="e.g. More details on state civil services exams, college cutoffs..."
                  className="w-full px-3 py-2 rounded-xl bg-[#0B0E12] border border-border/80 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-400 font-mono">{errorMsg}</p>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-[#141920] text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover shadow-md shadow-primary/20 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Submit Evaluation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Success Confirmation ─────────────────────────── */}
        {step === 3 && (
          <div className="py-8 text-center space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading text-xl font-bold text-foreground">
                Thank You for Your Feedback!
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Your evaluation has been recorded into our research database. Every rating directly informs algorithmic calibration and guidance quality.
              </p>
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover shadow-md shadow-primary/20 transition-all cursor-pointer"
              >
                Return to Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
