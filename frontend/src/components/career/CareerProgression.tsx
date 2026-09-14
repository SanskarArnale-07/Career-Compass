"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, ChevronDown, ArrowRight } from "lucide-react";
import type { CareerStage } from "@/lib/career-details/types";

interface CareerProgressionProps {
  stages: CareerStage[];
}

export default function CareerProgression({ stages }: CareerProgressionProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section>
      <h2 className="font-heading text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
        <TrendingUp className="h-6 w-6 text-primary" />
        Career Progression
      </h2>
      <p className="font-sans text-sm text-muted-foreground mb-8 max-w-2xl">
        A typical career trajectory — your actual path may vary based on specialization and opportunities.
      </p>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-primary/5" />

        <div className="space-y-4">
          {stages.map((stage, i) => {
            const isExpanded = expandedIndex === i;
            const isFirst = i === 0;
            return (
              <motion.div
                key={stage.title}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : i)}
                  className="w-full text-left"
                >
                  <div className="relative flex items-start gap-4 group">
                    {/* Timeline dot */}
                    <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 shrink-0 transition-all duration-300 ${
                      isFirst
                        ? "border-primary bg-primary/20 text-primary"
                        : isExpanded
                          ? "border-primary/60 bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground group-hover:border-primary/40"
                    }`}>
                      <span className="font-heading text-xs font-bold">{i + 1}</span>
                    </div>

                    {/* Content */}
                    <div className={`flex-1 rounded-xl border p-4 transition-all duration-300 ${
                      isExpanded
                        ? "border-primary/30 bg-primary/5"
                        : "border-border bg-card group-hover:border-primary/20 group-hover:bg-card-hover"
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-heading text-base font-bold text-foreground">{stage.title}</h3>
                          <span className="text-xs text-primary font-medium">{stage.yearsRange}</span>
                        </div>
                        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                      </div>
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-16 mt-2 space-y-4 p-4 rounded-xl border border-border/60 bg-card/50">
                        {/* What changes */}
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/15">
                          <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <p className="text-sm text-foreground/90">{stage.deltaFromPrevious}</p>
                        </div>

                        {/* Responsibilities */}
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Responsibilities</h4>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {stage.responsibilities.map((r) => (
                              <li key={r} className="flex items-center gap-2 text-sm text-foreground/80">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />{r}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Skills */}
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Key Skills</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {stage.skills.map((s) => (
                              <span key={s} className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
