"use client";

import { Sparkles } from "lucide-react";

interface CareerExplanationProps {
  explanation?: string;
}

export function CareerExplanation({ explanation }: CareerExplanationProps) {
  
  const defaultExplanation = "Your assessment shows a strong inclination towards analytical problem-solving and logic building. When asked about success, you prioritized 'Building things that impact millions', and your interest in 'Technology' and 'Science Projects' strongly correlates with engineering fields. You also indicated you enjoy 'Working remotely from anywhere', which is highly compatible with tech careers.";

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 md:p-8 relative overflow-hidden">
      
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Sparkles className="h-32 w-32 text-primary" />
      </div>

      <div className="relative z-10">
        <h3 className="font-heading text-xl font-bold flex items-center gap-2 mb-4 text-primary">
          <Sparkles className="h-5 w-5" />
          Why these matches?
        </h3>
        
        <p className="text-foreground/90 leading-relaxed md:text-lg max-w-3xl">
          {explanation || defaultExplanation}
        </p>
      </div>
    </div>
  );
}
