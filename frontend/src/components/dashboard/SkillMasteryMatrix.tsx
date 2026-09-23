"use client";

import { useState } from "react";
import {
  ChevronDown,
  Layers,
  Check,
} from "lucide-react";
import type { PersonalizedSkill } from "@/lib/career-details/personalization";

interface SkillMasteryMatrixProps {
  skills: PersonalizedSkill[];
  completedSkills: string[];
  onToggleSkill: (skillId: string) => void;
  hasAssessment?: boolean;
}

export default function SkillMasteryMatrix({
  skills,
  completedSkills,
  onToggleSkill,
}: SkillMasteryMatrixProps) {
  const [filter, setFilter] = useState<"all" | "gaps" | "mastered">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const completedSet = new Set(completedSkills);

  const filteredSkills = skills.filter((skill) => {
    if (filter === "mastered") return completedSet.has(skill.id);
    if (filter === "gaps") return skill.status === "needs-work" && !completedSet.has(skill.id);
    return true;
  });

  const gapCount = skills.filter(
    (s) => s.status === "needs-work" && !completedSet.has(s.id)
  ).length;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/70">
        <div>
          <h3 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            Skill Mastery &amp; Gap Closer
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Track and verify core competencies. Gaps identified from your assessment are highlighted.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#161412] border border-border/80 self-start sm:self-auto">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              filter === "all"
                ? "bg-primary text-white font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({skills.length})
          </button>
          <button
            onClick={() => setFilter("gaps")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              filter === "gaps"
                ? "bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>Priority Gaps</span>
            {gapCount > 0 && (
              <span className="h-4 w-4 rounded-full bg-amber-500/30 text-amber-300 text-[10px] flex items-center justify-center font-mono">
                {gapCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter("mastered")}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              filter === "mastered"
                ? "bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Mastered ({completedSkills.length})
          </button>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredSkills.map((skill) => {
          const isMastered = completedSet.has(skill.id);
          const isExpanded = expandedId === skill.id;

          // Status Badge config
          let badge = {
            label: "Developing",
            bg: "bg-amber-500/10",
            text: "text-[#D4A853]",
            border: "border-amber-500/20",
          };
          if (isMastered) {
            badge = {
              label: "Verified Mastered",
              bg: "bg-emerald-500/15",
              text: "text-emerald-400",
              border: "border-emerald-500/30",
            };
          } else if (skill.status === "needs-work") {
            badge = {
              label: "Growth Gap",
              bg: "bg-red-500/15",
              text: "text-red-400",
              border: "border-red-500/30",
            };
          } else if (skill.status === "strong") {
            badge = {
              label: "High Aptitude",
              bg: "bg-emerald-500/10",
              text: "text-emerald-400",
              border: "border-emerald-500/20",
            };
          }

          return (
            <div
              key={skill.id}
              className={`p-4 rounded-xl border transition-all ${
                isMastered
                  ? "border-emerald-500/30 bg-[#161412]/70"
                  : skill.status === "needs-work"
                  ? "border-red-500/20 bg-card hover:border-red-500/40"
                  : "border-border bg-card hover:border-primary/40"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                      {skill.category}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.2 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badge.bg} ${badge.text} ${badge.border}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  <h4 className="font-heading text-sm font-bold text-foreground">
                    {skill.name}
                  </h4>
                </div>

                {/* Mastered Toggle button */}
                <button
                  onClick={() => onToggleSkill(skill.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
                    isMastered
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/35 hover:bg-emerald-500/30"
                      : "bg-[#161412] border border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                  }`}
                >
                  {isMastered ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Mastered</span>
                    </>
                  ) : (
                    <span>Mark Done</span>
                  )}
                </button>
              </div>

              {/* Collapsible info */}
              <p className="text-xs text-secondary-foreground mt-2 leading-relaxed">
                {skill.whyItMatters}
              </p>

              <button
                onClick={() => setExpandedId(isExpanded ? null : skill.id)}
                className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-primary-hover cursor-pointer"
              >
                <span>{isExpanded ? "Hide Details" : "View Checklist & Target Level"}</span>
                <ChevronDown
                  className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                />
              </button>

              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-border/60 text-xs space-y-2 bg-[#0B1220]/60 p-3 rounded-lg animate-in fade-in duration-200">
                  <div>
                    <span className="font-semibold text-foreground block mb-0.5">
                      What to master:
                    </span>
                    <p className="text-muted-foreground">{skill.whatToKnow}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground block mb-0.5">
                      Recommended proficiency:
                    </span>
                    <p className="text-muted-foreground">{skill.recommendedLevel}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
