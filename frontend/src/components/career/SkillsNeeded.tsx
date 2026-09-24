"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, CheckCircle2, Circle, AlertCircle, BookOpen } from "lucide-react";
import type { SkillStatus } from "@/lib/career-details/types";
import type { PersonalizedSkill } from "@/lib/career-details/personalization";

interface SkillsNeededProps {
  skills: PersonalizedSkill[];
  hasAssessment: boolean;
}

function StatusDot({ status }: { status: SkillStatus }) {
  if (status === "strong") return <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />;
  if (status === "developing") return <AlertCircle className="h-5 w-5 text-sky-400 shrink-0" />;
  return <Circle className="h-5 w-5 text-muted-foreground/60 shrink-0" />;
}

function statusLabel(status: SkillStatus): string {
  if (status === "strong") return "You likely already have this";
  if (status === "developing") return "Developing — keep building";
  return "You'll need to learn this";
}

export default function SkillsNeeded({ skills, hasAssessment }: SkillsNeededProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section>
      <h2 className="font-heading text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
        <BookOpen className="h-6 w-6 text-primary" />
        Skills You&apos;ll Need
      </h2>
      <p className="font-sans text-sm text-muted-foreground mb-6 max-w-2xl">
        {hasAssessment
          ? "Based on your assessment, here's where you stand with each skill. Click any skill to learn more."
          : "Click any skill to learn more about what it involves and why it matters."}
      </p>

      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-4.5 top-8 bottom-8 w-px bg-linear-to-b from-primary/30 via-primary/15 to-transparent hidden sm:block" />

        <div className="space-y-3">
          {skills.map((skill, i) => {
            const isExpanded = expandedId === skill.id;
            return (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : skill.id)}
                  className="w-full text-left"
                >
                  <div
                    className={`relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
                      isExpanded
                        ? "border-primary/40 bg-primary/5 shadow-md shadow-primary/10"
                        : "border-border bg-card hover:border-primary/20 hover:bg-card-hover"
                    }`}
                  >
                    {/* Status dot */}
                    <div className="relative z-10">
                      <StatusDot status={skill.status} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-heading text-sm font-bold text-foreground">{skill.name}</h3>
                        <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground bg-background/50 px-2 py-0.5 rounded-full border border-border">
                          {skill.category}
                        </span>
                      </div>
                      {hasAssessment && (
                        <p className="text-xs text-muted-foreground mt-0.5">{statusLabel(skill.status)}</p>
                      )}
                    </div>

                    {/* Chevron */}
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                  </div>
                </button>

                {/* Expanded content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-9 mt-1 p-4 rounded-xl border border-border/60 bg-card/50 space-y-3">
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Why It Matters</h4>
                          <p className="text-sm text-foreground/90 leading-relaxed">{skill.whyItMatters}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-1">What to Know</h4>
                          <p className="text-sm text-foreground/90 leading-relaxed">{skill.whatToKnow}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-1">Recommended Level</h4>
                          <p className="text-sm text-foreground/90 leading-relaxed">{skill.recommendedLevel}</p>
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
