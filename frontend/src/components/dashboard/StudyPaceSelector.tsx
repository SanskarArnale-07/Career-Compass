"use client";

import { Clock, Calendar, Zap } from "lucide-react";
import type { TimeToReadinessResult } from "@/lib/career-details/roadmap-intelligence";

interface StudyPaceSelectorProps {
  weeklyHours: number;
  onChangePace: (hours: number) => void;
  paceInfo: TimeToReadinessResult;
}

const PACE_OPTIONS = [
  { hours: 5, label: "5 hrs/wk", sub: "Casual / School Balance" },
  { hours: 10, label: "10 hrs/wk", sub: "Consistent (Recommended)" },
  { hours: 15, label: "15+ hrs/wk", sub: "Fast-Track Sprint" },
];

export default function StudyPaceSelector({
  weeklyHours,
  onChangePace,
  paceInfo,
}: StudyPaceSelectorProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/70">
        <div>
          <h3 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Pace &amp; Estimated Timeline
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Adjust your weekly commitment to see an adaptive timeline to career readiness.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary font-mono self-start sm:self-auto">
          <Calendar className="h-3.5 w-3.5" />
          <span>Target Readiness: {paceInfo.targetMonthYear}</span>
        </div>
      </div>

      {/* 3 Pace Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {PACE_OPTIONS.map((opt) => {
          const isSelected = weeklyHours === opt.hours;

          return (
            <button
              key={opt.hours}
              onClick={() => onChangePace(opt.hours)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? "border-primary bg-primary/15 shadow-md shadow-primary/10 text-foreground"
                  : "border-border bg-[#0F172A] text-secondary-foreground hover:bg-card-hover hover:border-border"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-heading text-sm font-bold text-foreground">
                  {opt.label}
                </span>
                {isSelected && (
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                )}
              </div>
              <p className="text-[11px] text-muted-foreground">{opt.sub}</p>
            </button>
          );
        })}
      </div>

      {/* Dynamic Pace Summary */}
      <div className="p-4 rounded-xl bg-[#0F172A] border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <p className="font-semibold text-foreground">
              ~{paceInfo.remainingWeeks} weeks remaining at this pace
            </p>
            <p className="text-muted-foreground">
              Based on completing remaining curriculum phases, hands-on capstones, and portfolio tasks.
            </p>
          </div>
        </div>

        <span className="font-mono font-bold text-primary shrink-0 text-sm">
          {paceInfo.hoursPerWeek} hrs/week
        </span>
      </div>
    </div>
  );
}
