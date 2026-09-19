"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Zap,
  Sparkles,
  ArrowRight,
  Clock,
  BookOpen,
  FolderKanban,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import type { NextBestAction } from "@/lib/career-details/roadmap-intelligence";

interface NextBestActionCardProps {
  action: NextBestAction;
  onActionClick: (targetType: string, targetId: string | number) => void;
  hasAssessment: boolean;
}

const CATEGORY_CONFIG: Record<
  NextBestAction["category"],
  { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string }
> = {
  learn: {
    label: "Curriculum Step",
    icon: BookOpen,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  build: {
    label: "Portfolio Project",
    icon: FolderKanban,
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
  },
  practice: {
    label: "Skill Bridge Workout",
    icon: AlertCircle,
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
  prepare: {
    label: "Career Readiness",
    icon: CheckCircle2,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
};

export default function NextBestActionCard({
  action,
  onActionClick,
  hasAssessment,
}: NextBestActionCardProps) {
  const config = CATEGORY_CONFIG[action.category] || CATEGORY_CONFIG.learn;
  const CategoryIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl border-2 border-primary/35 bg-linear-to-br from-card via-[#0F172A] to-primary/10 p-6 sm:p-8 shadow-xl shadow-primary/5"
    >
      {/* Subtle backdrop glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 h-48 w-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex-1 min-w-0">
          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/15 border border-primary/30 text-[11px] font-bold font-mono uppercase tracking-wider text-primary">
              <Zap className="h-3.5 w-3.5 animate-pulse text-primary" />
              Next Priority Action
            </span>

            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${config.color}`}
            >
              <CategoryIcon className="h-3 w-3" />
              {config.label}
            </span>

            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-mono">
              <Clock className="h-3.5 w-3.5" />
              {action.estimatedTime}
            </span>
          </div>

          {/* Title */}
          <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2 leading-tight">
            {action.title}
          </h2>

          <p className="text-xs sm:text-sm font-medium text-secondary mb-4">
            {action.subtitle}
          </p>

          {/* Reasoning Box ("Why this now?") */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-[#0B1220]/80 border border-border/80 flex items-start gap-3">
            <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-mono font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                {hasAssessment ? "Why this now for your profile:" : "Recommended next milestone:"}
              </p>
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-sans">
                {action.reasoning}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0 md:min-w-50">
          <button
            onClick={() => onActionClick(action.targetType, action.targetId)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary text-white font-semibold text-sm shadow-lg shadow-primary/25 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/35 hover:-translate-y-0.5 transition-all cursor-pointer text-center"
          >
            <span>{action.actionText}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <Link
            href="/coach"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-primary/30 bg-primary/10 text-xs font-semibold text-primary hover:bg-primary/20 hover:border-primary/50 transition-all text-center"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Ask AI Coach</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
