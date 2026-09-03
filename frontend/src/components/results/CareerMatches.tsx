"use client";

import { ArrowRight } from "lucide-react";
import { getCareerIcon } from "@/lib/career-icons";

interface CareerMatchData {
  career_name: string;
  match_percentage: number;
  top_traits: string[];
  explanation: string;
  skill_gaps: string[];
  next_steps: string[];
}

interface CareerMatchesProps {
  careers: CareerMatchData[];
}

export function CareerMatches({ careers }: CareerMatchesProps) {

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-heading text-2xl font-bold">Top Career Matches</h3>
          <p className="text-muted-foreground">Careers that align with your unique trait profile</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {careers.map((career, idx) => (
          <div key={idx} className={`bg-card border shadow-xs hover:shadow-md transition-all rounded-xl p-6 flex flex-col group relative overflow-hidden ${
            idx === 0 ? 'border-primary/50 md:col-span-2 lg:col-span-1' : 'border-border'
          }`}>
            
            {/* Background decoration */}
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>

            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-3 bg-primary/10 rounded-lg">
                {(() => {
                  const Icon = getCareerIcon(career.career_name);
                  return <Icon className="h-8 w-8 text-indigo-500" />;
                })()}
              </div>
              <div className="inline-flex items-center bg-green-500/10 text-green-600 px-2.5 py-1 rounded-full text-sm font-semibold">
                {career.match_percentage}% Match
              </div>
            </div>
            
            <h4 className="text-xl font-bold mb-2 relative z-10">{career.career_name}</h4>
            <p className="text-muted-foreground text-sm flex-1 relative z-10 mb-3">
              {career.explanation}
            </p>

            {/* Top traits */}
            <div className="flex flex-wrap gap-1.5 mb-4 relative z-10">
              {career.top_traits.map((trait) => (
                <span key={trait} className="text-[11px] font-medium bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                  {trait}
                </span>
              ))}
            </div>
            
            <div className="mt-auto pt-4 border-t border-border/50 flex items-center justify-between text-sm font-medium text-primary cursor-pointer relative z-10 group-hover:text-primary/80">
              Explore path
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
