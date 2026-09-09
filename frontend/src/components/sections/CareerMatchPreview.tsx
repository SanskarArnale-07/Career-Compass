import { ArrowRight, Code, Database, PenTool } from "lucide-react";
import Link from "next/link";

export function CareerMatchPreview() {
  const examples = [
    {
      role: "Software Engineer",
      match: "92%",
      icon: Code,
      skills: ["Problem Solving", "Programming", "Analytical Thinking"],
      reason: "Your preference for logical structures and deep-focus work aligns highly with backend development.",
    },
    {
      role: "Data Analyst",
      match: "87%",
      icon: Database,
      skills: ["Data Visualization", "Statistics", "SQL"],
      reason: "Your high score in pattern recognition makes you a natural fit for extracting insights from datasets.",
    },
    {
      role: "UX Designer",
      match: "81%",
      icon: PenTool,
      skills: ["User Empathy", "Prototyping", "Wireframing"],
      reason: "Strong empathy combined with spatial reasoning suggests you'd excel in user-centered design.",
    }
  ];

  return (
    <section className="py-24 w-full">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight mb-4">
            More than a career quiz.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Understand your fit, identify your gaps, and know what to do next. Here's a glimpse of what your personalized results might look like.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {examples.map((example, idx) => (
            <div 
              key={idx} 
              className="flex flex-col p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-xl hover:border-primary/50 hover:bg-card-hover transition-all duration-300 relative overflow-hidden group"
            >
              {/* Subtle background glow on hover */}
              <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center text-primary shadow-xs shadow-primary/20">
                      <example.icon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-heading font-bold text-primary">{example.match}</span>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Match</span>
                  </div>
                </div>

                <h3 className="font-heading text-xl font-bold mb-3 text-foreground">{example.role}</h3>
                
                <div className="mb-4 flex flex-wrap gap-2">
                  {example.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="inline-flex items-center rounded-md bg-[#0F172A] border border-border/80 px-2.5 py-1 text-xs font-medium text-secondary">
                      {skill}
                    </span>
                  ))}
                </div>

                <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
                  {example.reason}
                </p>

                <div className="mt-auto pt-2">
                  <Link href="/assessment" className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary-hover transition-colors">
                    View Career <ArrowRight className="ml-1.5 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
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
