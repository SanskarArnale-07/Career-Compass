"use client";

import { ArrowRight, Code, Database, LineChart } from "lucide-react";

interface CareerMatchesProps {
  careers?: Array<{
    title: string;
    description: string;
    matchScore: number;
    icon: any;
  }>;
}

export function CareerMatches({ careers }: CareerMatchesProps) {
  
  const mockCareers = careers || [
    {
      title: "Software Engineer",
      description: "Build applications, systems, and logic that power the digital world.",
      matchScore: 92,
      icon: <Code className="h-8 w-8 text-indigo-500" />
    },
    {
      title: "Data Scientist",
      description: "Analyze complex datasets to extract insights and predict future trends.",
      matchScore: 88,
      icon: <Database className="h-8 w-8 text-indigo-500" />
    },
    {
      title: "Financial Analyst",
      description: "Guide businesses and individuals in making investment decisions.",
      matchScore: 75,
      icon: <LineChart className="h-8 w-8 text-indigo-500" />
    }
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-heading text-2xl font-bold">Top Career Matches</h3>
          <p className="text-muted-foreground">Careers that fit your Science/Tech profile</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockCareers.map((career, idx) => (
          <div key={idx} className="bg-card border border-border shadow-xs hover:shadow-md transition-all rounded-xl p-6 flex flex-col group relative overflow-hidden">
            
            {/* Background decoration */}
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors"></div>

            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="p-3 bg-primary/10 rounded-lg">
                {career.icon}
              </div>
              <div className="inline-flex items-center bg-green-500/10 text-green-600 px-2.5 py-1 rounded-full text-sm font-semibold">
                {career.matchScore}% Match
              </div>
            </div>
            
            <h4 className="text-xl font-bold mb-2 relative z-10">{career.title}</h4>
            <p className="text-muted-foreground text-sm flex-1 relative z-10">
              {career.description}
            </p>
            
            <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between text-sm font-medium text-primary cursor-pointer relative z-10 group-hover:text-primary/80">
              Explore path
              <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
