"use client";

import { BrainCircuit, Calculator, Palette } from "lucide-react";

interface SuitabilityScoresProps {
  scores: {
    science: number;
    commerce: number;
    arts: number;
  };
  descriptions?: Record<string, string>;
}

export function SuitabilityScores({ scores, descriptions = {} }: SuitabilityScoresProps) {
  
  const streams = [
    {
      name: "Science (PCM/PCB)",
      key: "science",
      score: scores.science,
      icon: <BrainCircuit className="h-6 w-6 text-blue-500" />,
      color: "bg-blue-500",
      bgClass: "bg-blue-500/10",
      description: descriptions.science || "Alignment based on your analytical, technical, and scientific traits."
    },
    {
      name: "Commerce",
      key: "commerce",
      score: scores.commerce,
      icon: <Calculator className="h-6 w-6 text-emerald-500" />,
      color: "bg-emerald-500",
      bgClass: "bg-emerald-500/10",
      description: descriptions.commerce || "Alignment based on your business, analytical, and leadership traits."
    },
    {
      name: "Arts & Humanities",
      key: "arts",
      score: scores.arts,
      icon: <Palette className="h-6 w-6 text-purple-500" />,
      color: "bg-purple-500",
      bgClass: "bg-purple-500/10",
      description: descriptions.arts || "Alignment based on your creative, social, and exploratory traits."
    }
  ].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-card border border-border shadow-sm rounded-xl p-6 md:p-8 w-full">
      <h3 className="font-heading text-2xl font-bold mb-2">Class 10 Stream Suitability</h3>
      <p className="text-muted-foreground mb-8">
        Based on your assessment, here is your compatibility with the major 11th-grade streams.
      </p>

      <div className="space-y-6">
        {streams.map((stream, index) => (
          <div key={stream.key} className={`p-4 rounded-lg border ${index === 0 ? 'border-primary/50 bg-primary/5' : 'border-border bg-card'}`}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-md ${stream.bgClass}`}>
                  {stream.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    {stream.name}
                    {index === 0 && <span className="text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Top Match</span>}
                  </h4>
                  <p className="text-sm text-muted-foreground">{stream.description}</p>
                </div>
              </div>
              <div className="text-xl font-bold tracking-tight">
                {stream.score}%
              </div>
            </div>
            
            <div className="mt-4 h-2.5 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${stream.color} transition-all duration-1000 ease-out`}
                style={{ width: `${stream.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
