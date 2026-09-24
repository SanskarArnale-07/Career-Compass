"use client";

import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, AlertTriangle } from "lucide-react";
import type { StrengthGapItem, SkillStatus } from "@/lib/career-details/types";

interface WhyThisCareerProps {
  summary: string;
  strengths: StrengthGapItem[];
  gaps: StrengthGapItem[];
}

function StatusBadge({ status }: { status: SkillStatus }) {
  const config: Record<SkillStatus, { label: string; className: string }> = {
    strong: { label: "Strong", className: "bg-primary/15 text-primary border-primary/30" },
    developing: { label: "Developing", className: "bg-sky-500/15 text-sky-400 border-sky-500/30" },
    "needs-work": { label: "Needs Work", className: "bg-[#141920] text-muted-foreground border-border/80" },
  };
  const { label, className } = config[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${className}`}>
      {label}
    </span>
  );
}

export default function WhyThisCareer({ summary, strengths, gaps }: WhyThisCareerProps) {
  return (
    <section>
      <h2 className="font-heading text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-primary" />
        Why This Career Matches You
      </h2>

      <p className="font-sans text-muted-foreground text-sm mb-8 max-w-3xl leading-relaxed">{summary}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths column */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h3 className="font-heading text-lg font-bold text-foreground">Your Strengths</h3>
          </div>
          <div className="space-y-3">
            {strengths.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="rounded-xl border border-primary/20 bg-primary/5 p-4 hover:border-primary/35 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="font-heading text-sm font-bold text-foreground">{item.title}</h4>
                  <StatusBadge status={item.status} />
                </div>
                <p className="font-sans text-xs text-muted-foreground leading-relaxed">{item.explanation}</p>
              </motion.div>
            ))}
            {strengths.length === 0 && (
              <p className="text-sm text-muted-foreground italic">Take the assessment to see your strengths here.</p>
            )}
          </div>
        </div>

        {/* Gaps column */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <h3 className="font-heading text-lg font-bold text-foreground">Areas to Develop</h3>
          </div>
          <div className="space-y-3">
            {gaps.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-4 hover:border-amber-500/25 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="font-heading text-sm font-bold text-foreground">{item.title}</h4>
                  <StatusBadge status={item.status} />
                </div>
                <p className="font-sans text-xs text-muted-foreground leading-relaxed">{item.explanation}</p>
              </motion.div>
            ))}
            {gaps.length === 0 && (
              <div className="rounded-xl border border-border/50 bg-card/40 p-4">
                <p className="text-sm text-muted-foreground italic">
                  {strengths.length === 0
                    ? "Take the assessment to discover your strengths and development areas for this career."
                    : "Great news! No major gaps detected for this career."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
