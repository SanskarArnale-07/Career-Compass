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

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-amber-500/15 border border-amber-500/30 rounded-xl text-amber-500 shadow-xs shadow-amber-500/10">
          <Target className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-heading text-2xl font-bold text-foreground">Your Skill Gaps</h3>
          <p className="text-muted-foreground">Areas to focus on during Class 11 and 12</p>
        </div>
      </div>

      <div className="bg-card border border-border shadow-sm rounded-xl overflow-hidden">
        <div className="divide-y divide-border">
          {gaps.map((gap, idx) => (
            <div key={idx} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-card-hover transition-colors">
              <div className="flex-1">
                <h4 className="font-semibold text-lg flex items-center gap-2.5 text-foreground">
                  {gap.skill}
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                    {gap.level}
                  </span>
                </h4>
                <div className="mt-2 flex items-start gap-2 text-muted-foreground text-sm leading-relaxed">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-amber-500/80" />
                  <p>{gap.action}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
