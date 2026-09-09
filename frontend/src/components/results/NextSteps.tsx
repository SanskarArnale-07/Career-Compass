"use client";

import { CheckCircle2, ChevronRight, GraduationCap } from "lucide-react";
import Link from "next/link";

interface NextStepsProps {
  steps: string[];
}

export function NextSteps({ steps }: NextStepsProps) {

  return (
    <div className="bg-card border border-border shadow-md rounded-xl p-6 md:p-8 relative overflow-hidden">
      
      <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none">
        <GraduationCap className="h-48 w-48 text-foreground" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
        
        <div className="flex-1">
          <h3 className="font-heading text-2xl font-bold mb-2 text-foreground">Your Next Steps</h3>
          <p className="text-muted-foreground mb-6">
            Actionable advice to start executing right away as a Class 10 student.
          </p>
          
          <ul className="space-y-4">
            {steps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="font-medium text-foreground leading-snug">{step}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="w-full md:w-auto mt-4 md:mt-0 bg-[#0F172A] p-6 rounded-xl border border-border/80 text-center shadow-sm">
          <h4 className="font-bold text-lg mb-2 text-foreground">Ready to start?</h4>
          <p className="text-sm text-muted-foreground mb-6 max-w-[200px] mx-auto leading-relaxed">
            Book a session with a counselor to discuss these results.
          </p>
          <Link 
            href="/"
            className="inline-flex w-full h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary-hover shadow-md shadow-primary/25 transition-colors group"
          >
            Talk to an Expert
            <ChevronRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
}
