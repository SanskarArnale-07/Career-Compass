import { ArrowRight, Code, Database, PenTool } from "lucide-react";
import Link from "next/link";

export function CareerMatchPreview() {
  const examples = [
    {
      role: "Software Engineer",
      match: "92%",
      icon: Code,
      skills: ["Problem Solving", "Systems Design", "Analytical Thinking"],
      reason: "Your high preference for structured logic and deep-focus exploration aligns directly with engineering disciplines.",
    },
    {
      role: "Data Analyst",
      match: "87%",
      icon: Database,
      skills: ["Pattern Recognition", "Statistics", "SQL"],
      reason: "Your tendency toward pattern recognition makes you a natural fit for extracting signal from ambiguous data.",
    },
    {
      role: "UX Designer",
      match: "81%",
      icon: PenTool,
      skills: ["User Empathy", "Visual Systems", "Interaction Design"],
      reason: "Empathetic reasoning combined with spatial composition suggests excellence in human-centered product craft.",
    }
  ];

  return (
    <section className="py-28 w-full border-t border-border/40 relative">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="text-xs font-mono uppercase tracking-[0.2em] text-primary/80 mb-3">
            Trajectory Preview
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
            More than a career quiz.
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl font-light">
            Understand your fit, identify hidden skill gaps, and navigate your trajectory. A glimpse of what personalized discovery reveals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {examples.map((example, idx) => (
            <div 
              key={idx} 
              className="flex flex-col p-7 rounded-xl bg-card/70 border border-border/60 shadow-sm hover:border-primary/40 hover:bg-card transition-all duration-300 relative overflow-hidden group"
            >
              {/* Subtle warm amber glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <example.icon className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-heading font-bold text-primary tracking-tight">{example.match}</span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/70">Alignment</span>
                  </div>
                </div>

                <h3 className="font-heading text-xl font-bold mb-3 text-foreground tracking-tight">{example.role}</h3>
                
                <div className="mb-5 flex flex-wrap gap-2">
                  {example.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="inline-flex items-center rounded-md bg-[#161412] border border-border/80 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      {skill}
                    </span>
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground mb-8 leading-relaxed font-light">
                  {example.reason}
                </p>

                <div className="mt-auto pt-2 border-t border-border/40">
                  <Link href="/assessment" className="inline-flex items-center text-xs font-semibold text-primary hover:text-primary-hover transition-colors pt-3">
                    <span>Explore Trajectory</span>
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
