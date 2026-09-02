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
        <div className="p-2 bg-orange-500/10 rounded-lg">
          <Target className="h-6 w-6 text-orange-500" />
        </div>
        <div>
          <h3 className="font-heading text-2xl font-bold">Your Skill Gaps</h3>
          <p className="text-muted-foreground">Areas to focus on during Class 11 and 12</p>
        </div>
      </div>

      <div className="bg-card border border-border shadow-sm rounded-xl overflow-hidden">
        <div className="divide-y divide-border">
          {gaps.map((gap, idx) => (
            <div key={idx} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/30 transition-colors">
              <div className="flex-1">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  {gap.skill}
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                    {gap.level}
                  </span>
                </h4>
                <div className="mt-2 flex items-start gap-2 text-muted-foreground text-sm">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
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
