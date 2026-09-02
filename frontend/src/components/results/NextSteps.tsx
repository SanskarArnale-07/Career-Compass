"use client";

import { CheckCircle2, ChevronRight, GraduationCap } from "lucide-react";
import Link from "next/link";

interface NextStepsProps {
  steps?: string[];
}

export function NextSteps({ steps }: NextStepsProps) {
  
  const defaultSteps = steps || [
    "Select Science (PCM) for your 11th and 12th grade studies.",
    "Enroll in a basic introductory course to Python or Web Development this summer.",
    "Look into engineering entrance exams (like JEE) and their syllabus."
  ];

  return (
    <div className="bg-gradient-to-br from-card to-muted border border-border shadow-md rounded-xl p-6 md:p-8 relative overflow-hidden">
      
      <div className="absolute -right-6 -bottom-6 opacity-5">
        <GraduationCap className="h-48 w-48 text-foreground" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
        
        <div className="flex-1">
          <h3 className="font-heading text-2xl font-bold mb-2">Your Next Steps</h3>
          <p className="text-muted-foreground mb-6">
            Actionable advice to start executing right away as a Class 10 student.
          </p>
          
          <ul className="space-y-4">
            {defaultSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="font-medium text-foreground">{step}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="w-full md:w-auto mt-4 md:mt-0 bg-background/80 backdrop-blur-sm p-6 rounded-xl border border-border/50 text-center">
          <h4 className="font-bold text-lg mb-2">Ready to start?</h4>
          <p className="text-sm text-muted-foreground mb-6 max-w-[200px] mx-auto">
            Book a session with a counselor to discuss these results.
          </p>
          <Link 
            href="/"
            className="inline-flex w-full h-11 items-center justify-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors group"
          >
            Talk to an Expert
            <ChevronRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </div>
  );
}
