"use client";

import { motion } from "framer-motion";
import {
  Compass,
  Briefcase,
  Users,
  Lightbulb,
  Sliders,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import type { WorkLearningStyle } from "@/lib/profile/profile-utils";

interface WorkLearningStyleSectionProps {
  style: WorkLearningStyle;
}

export function WorkLearningStyleSection({ style }: WorkLearningStyleSectionProps) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-lg bg-primary/10 border border-primary/25 text-primary">
          <Sliders className="h-4 w-4" />
        </div>
        <div>
          <h2 className="font-heading text-lg font-bold text-foreground">
            Work &amp; Learning Style Profile
          </h2>
          <p className="text-xs text-muted-foreground">
            Cognitive environment preferences, problem-solving modes, and collaboration dynamics
          </p>
        </div>
      </div>

      {/* 3 Core Preferences Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Environment Preference */}
        <div className="p-4 rounded-xl border border-border/70 bg-[#0B0E12]/80 space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-[#141920] border border-border/80 text-primary">
                <Briefcase className="h-3.5 w-3.5" />
              </span>
              <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/25 text-[10px] font-mono text-primary font-medium">
                {style.environmentPreference.tag}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Optimal Environment
              </p>
              <h3 className="text-xs font-bold text-foreground mt-0.5">
                {style.environmentPreference.title}
              </h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {style.environmentPreference.description}
            </p>
          </div>
        </div>

        {/* Problem Solving Mode */}
        <div className="p-4 rounded-xl border border-border/70 bg-[#0B0E12]/80 space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-[#141920] border border-border/80 text-secondary">
                <Lightbulb className="h-3.5 w-3.5" />
              </span>
              <span className="px-2 py-0.5 rounded-full bg-secondary/10 border border-secondary/25 text-[10px] font-mono text-secondary font-medium">
                {style.problemSolvingMode.tag}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Problem-Solving Mode
              </p>
              <h3 className="text-xs font-bold text-foreground mt-0.5">
                {style.problemSolvingMode.title}
              </h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {style.problemSolvingMode.description}
            </p>
          </div>
        </div>

        {/* Collaboration Dynamic */}
        <div className="p-4 rounded-xl border border-border/70 bg-[#0B0E12]/80 space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="p-1.5 rounded-lg bg-[#141920] border border-border/80 text-cyan-400">
                <Users className="h-3.5 w-3.5" />
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-[10px] font-mono text-cyan-400 font-medium">
                {style.collaborationDynamic.tag}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Collaboration Dynamic
              </p>
              <h3 className="text-xs font-bold text-foreground mt-0.5">
                {style.collaborationDynamic.title}
              </h3>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {style.collaborationDynamic.description}
            </p>
          </div>
        </div>
      </div>

      {/* Structure vs Flexibility Slider Meter */}
      <div className="p-4 rounded-xl border border-border/70 bg-[#0B0E12]/90 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Cognitive Architecture
            </span>
            <h4 className="text-xs font-bold text-foreground">
              Structure vs. Flexibility: {style.structureVsFlexibility.title}
            </h4>
          </div>
          <span className="text-xs font-mono font-bold text-primary">
            {style.structureVsFlexibility.score}% Structure Affinity
          </span>
        </div>

        {/* Visual Dual-Spectrum Meter */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
            <span>Fluid / Exploratory</span>
            <span>Balanced Hybrid</span>
            <span>Methodical / Systematic</span>
          </div>
          <div className="h-2 w-full rounded-full bg-[#141920] overflow-hidden relative">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${style.structureVsFlexibility.score}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-primary to-indigo-500"
            />
          </div>
        </div>

        <p className="text-[11px] text-secondary-foreground leading-relaxed">
          {style.structureVsFlexibility.description}
        </p>
      </div>

      {/* Actionable Cognitive Dimension Tips */}
      <div className="space-y-2.5">
        <p className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
          Practical Learning &amp; Execution Guidance
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {style.cognitiveDimensions.map((dim, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-border/60 bg-[#10141A] space-y-1.5"
            >
              <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                <Sparkles className="h-3 w-3" />
                <span>{dim.category}</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {dim.insight}
              </p>
              <div className="pt-1 border-t border-border/40 text-[10px] font-mono text-slate-300 flex items-start gap-1">
                <ArrowRight className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                <span>{dim.actionableTip}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
