"use client";

import { Sparkles } from "lucide-react";

interface CareerExplanationProps {
  explanation: string;
}

export function CareerExplanation({ explanation }: CareerExplanationProps) {

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 md:p-8 relative overflow-hidden">
      
      <div className="absolute top-0 right-0 p-8 opacity-10">
        <Sparkles className="h-32 w-32 text-primary" />
      </div>

      <div className="relative z-10">
        <h3 className="font-heading text-xl font-bold flex items-center gap-2 mb-4 text-primary">
          <Sparkles className="h-5 w-5" />
          Your Stream Recommendation
        </h3>
        
        <p className="text-foreground/90 leading-relaxed md:text-lg max-w-3xl">
          {explanation}
        </p>
      </div>
    </div>
  );
}
