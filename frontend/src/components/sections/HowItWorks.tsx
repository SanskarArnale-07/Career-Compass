import { ClipboardCheck, Sparkles, Map } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      id: "01",
      title: "Take the assessment",
      description: "Answer questions about your working style, interests, and current skills.",
      icon: ClipboardCheck,
    },
    {
      id: "02",
      title: "Get your career matches",
      description: "See the careers that actually fit you, backed by data and clear reasoning.",
      icon: Sparkles,
    },
    {
      id: "03",
      title: "Follow your personalized roadmap",
      description: "Know exactly which skills to build and what steps to take next.",
      icon: Map,
    }
  ];

  return (
    <section id="how-it-works" className="py-24 sm:py-32 w-full bg-background border-y border-border">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
            How it works
          </h2>
          <p className="text-lg text-muted-foreground">
            A simple process to absolute clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-px bg-border"></div>
          
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center relative z-10">
              <div className="w-20 h-20 rounded-2xl bg-card border border-border flex items-center justify-center mb-6 shadow-lg shadow-black/20 group hover:border-primary/40 transition-colors">
                <step.icon className="h-8 w-8 text-primary" strokeWidth={1.75} />
              </div>
              <div className="mb-3">
                <span className="text-xs font-mono font-semibold text-primary bg-primary/15 border border-primary/25 px-2.5 py-1 rounded-full">
                  Step {step.id}
                </span>
              </div>
              <h3 className="font-heading text-lg font-bold mb-2 text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground max-w-[250px] mx-auto leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
