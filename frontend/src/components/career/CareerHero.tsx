"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import type { CareerDetail } from "@/lib/career-details/types";

interface CareerHeroProps {
  career: CareerDetail;
  matchPercentage?: number;
  explanation?: string;
  onStartRoadmap?: () => void;
}

export default function CareerHero({
  career,
  matchPercentage,
  explanation,
  onStartRoadmap,
}: CareerHeroProps) {
  const IconComponent =
    (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[career.icon] ?? LucideIcons.Compass;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-primary/5">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-14">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Left: Icon + Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 min-w-0"
          >
            {/* Category badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary uppercase tracking-wider">
                <IconComponent className="h-3.5 w-3.5" />
                {career.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-3 leading-tight">
              {career.title}
            </h1>

            {/* Tagline */}
            <p className="font-sans text-lg sm:text-xl text-muted-foreground mb-6 max-w-2xl leading-relaxed">
              {career.tagline}
            </p>

            {/* Personalized explanation */}
            {explanation && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-primary/5 border border-primary/15 mb-6 max-w-2xl"
              >
                <LucideIcons.Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <p className="text-sm sm:text-base text-foreground/90 leading-relaxed font-sans">
                  {explanation}
                </p>
              </motion.div>
            )}

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              {onStartRoadmap && (
                <button
                  onClick={onStartRoadmap}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <LucideIcons.Zap className="h-4 w-4" />
                  Start My Roadmap
                </button>
              )}
              <a
                href="/results"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border bg-card text-foreground font-semibold text-sm hover:bg-card-hover hover:border-primary/30 transition-all duration-300"
              >
                <LucideIcons.ArrowLeft className="h-4 w-4" />
                Explore Other Careers
              </a>
            </div>
          </motion.div>

          {/* Right: Match Ring */}
          {matchPercentage !== undefined && matchPercentage > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
              className="flex-shrink-0 flex flex-col items-center"
            >
              <div className="relative w-36 h-36 sm:w-44 sm:h-44">
                {/* Background circle */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" strokeWidth="6" className="text-border" />
                  <circle
                    cx="60" cy="60" r="52" fill="none"
                    stroke="url(#matchGradient)" strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 52}`}
                    strokeDashoffset={`${2 * Math.PI * 52 * (1 - matchPercentage / 100)}`}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="matchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--color-primary)" />
                      <stop offset="100%" stopColor="#818cf8" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-heading text-3xl sm:text-4xl font-bold text-foreground">{Math.round(matchPercentage)}%</span>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mt-0.5">Match</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center font-medium">Based on your assessment</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
