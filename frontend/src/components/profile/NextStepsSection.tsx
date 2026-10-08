"use client";

import Link from "next/link";
import {
  Compass,
  ArrowRight,
  BookOpen,
  Hammer,
  Map,
  MessageSquare,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import type { NextStepAction } from "@/lib/profile/profile-utils";

interface NextStepsSectionProps {
  steps: NextStepAction[];
  onOpenFeedback?: () => void;
}

export function NextStepsSection({ steps, onOpenFeedback }: NextStepsSectionProps) {
  const getCategoryIcon = (category: NextStepAction["category"]) => {
    switch (category) {
      case "academic":
        return <BookOpen className="h-4 w-4 text-cyan-400" />;
      case "skill":
        return <Hammer className="h-4 w-4 text-primary" />;
      case "roadmap":
        return <Map className="h-4 w-4 text-indigo-400" />;
      case "feedback":
        return <MessageSquare className="h-4 w-4 text-secondary" />;
      default:
        return <Sparkles className="h-4 w-4 text-primary" />;
    }
  };

  const getUrgencyBadge = (urgency: NextStepAction["urgency"]) => {
    switch (urgency) {
      case "Immediate Focus":
        return "bg-primary/15 text-primary border-primary/30";
      case "Recommended":
        return "bg-cyan-500/15 text-cyan-400 border-cyan-500/30";
      case "Next Horizon":
        return "bg-[#141920] text-muted-foreground border-border/80";
    }
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-primary/10 border border-primary/25 text-primary">
            <Compass className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-heading text-lg font-bold text-foreground">
              Recommended Next Steps &amp; Action Plan
            </h2>
            <p className="text-xs text-muted-foreground">
              Turn cognitive insights into validated momentum across skills, roadmaps, and exploration
            </p>
          </div>
        </div>

        {onOpenFeedback && (
          <button
            onClick={onOpenFeedback}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/10 border border-secondary/30 text-xs font-mono font-medium text-secondary hover:bg-secondary/20 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Give Guidance Feedback</span>
          </button>
        )}
      </div>

      {/* Grid of Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {steps.map((step) => {
          const isFeedbackTrigger = step.id === "step-feedback" && onOpenFeedback;

          return (
            <div
              key={step.id}
              className="p-4 rounded-xl border border-border/70 bg-[#0B0E12]/90 hover:border-border transition-colors flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="p-2 rounded-lg bg-[#141920] border border-border/80">
                    {getCategoryIcon(step.category)}
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${getUrgencyBadge(
                      step.urgency
                    )}`}
                  >
                    {step.urgency}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="pt-2 border-t border-border/50">
                {isFeedbackTrigger ? (
                  <button
                    onClick={onOpenFeedback}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover font-mono transition-colors cursor-pointer"
                  >
                    <span>{step.actionLabel}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : step.isExternal ? (
                  <a
                    href={step.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover font-mono transition-colors"
                  >
                    <span>{step.actionLabel}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <Link
                    href={step.href}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover font-mono transition-colors"
                  >
                    <span>{step.actionLabel}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
