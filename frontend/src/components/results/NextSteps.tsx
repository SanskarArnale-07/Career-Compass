"use client";

import { CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";

interface NextStepsProps {
  steps: string[];
}

export function NextSteps({ steps }: NextStepsProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="w-full space-y-4">
      {/* Section Header - Normalized to established Results-page scale */}
      <div>
        <h3 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-slate-100">
          Your Next Steps
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 font-light mt-0.5 leading-relaxed">
          Actionable milestones to start building momentum in your career direction.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-5 items-start">
        {/* Step Items */}
        <div className="flex-1 w-full rounded-xl border border-border/70 bg-[#141920]/60 p-4">
          <ul className="space-y-3">
            {steps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                  {step}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Personal Guidance Card */}
        <div className="w-full md:w-64 bg-[#10141A] p-4 rounded-xl border border-border/80 text-center shrink-0">
          <h4 className="font-heading text-xs sm:text-sm font-semibold text-slate-200 mb-1">
            Personal Guidance
          </h4>
          <p className="text-xs text-slate-400 font-light mb-3 leading-relaxed">
            Discuss your match results and roadmap strategy with your coach.
          </p>
          <Link
            href="/coach"
            className="inline-flex w-full h-9 items-center justify-center rounded-lg bg-cyan-400 hover:bg-cyan-300 px-4 text-xs font-bold text-slate-950 transition-colors group cursor-pointer"
          >
            <span>Consult AI Coach</span>
            <ChevronRight className="ml-1.5 h-3.5 w-3.5 transform group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
