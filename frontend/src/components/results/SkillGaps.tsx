"use client";

import { Target, AlertCircle } from "lucide-react";

interface SkillGapsProps {
  gaps: Array<{
    skill: string;
    level: string;
    action: string;
  }>;
}

export function SkillGaps({ gaps }: SkillGapsProps) {
  if (!gaps || gaps.length === 0) return null;

  return (
    <div className="w-full space-y-4">
      {/* Section Header - Normalized to established Results-page scale */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400 shrink-0">
            <Target className="h-4 w-4" />
          </div>
          <h3 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-slate-100">
            Skill Development Focus
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 font-light mt-0.5 leading-relaxed">
          Key capabilities to develop for your target career direction.
        </p>
      </div>

      <div className="rounded-xl border border-border/70 bg-[#141920]/60 overflow-hidden divide-y divide-border/60">
        {gaps.map((gap, idx) => (
          <div
            key={idx}
            className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-[#181F28] transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-heading text-xs sm:text-sm font-semibold text-slate-200">
                  {gap.skill}
                </h4>
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider bg-sky-500/10 text-sky-300 border border-sky-500/20 px-2 py-0.5 rounded-md">
                  {gap.level}
                </span>
              </div>
              <div className="flex items-start gap-1.5 text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
                <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-cyan-400" />
                <p>{gap.action}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
