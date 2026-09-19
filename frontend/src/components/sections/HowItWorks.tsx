import { Compass, Target, Map, CheckCircle2, Sparkles } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      id: "01",
      title: "Discover",
      description: "Take the 5-minute adaptive assessment to reveal your cognitive traits and intrinsic interests.",
      icon: Compass,
    },
    {
      id: "02",
      title: "Understand",
      description: "Explore data-backed fit percentages, skill requirements, and market insights for each career.",
      icon: Target,
    },
    {
      id: "03",
      title: "Plan",
      description: "Generate a personalized milestone roadmap tailored to your target year and study pace.",
      icon: Map,
    },
    {
      id: "04",
      title: "Progress",
      description: "Complete weekly adaptive sprints, build portfolio proof, and track your readiness meter.",
      icon: CheckCircle2,
    },
    {
      id: "05",
      title: "Reach Direction",
      description: "Receive real-time advice from your AI Coach and step into your chosen career with confidence.",
      icon: Sparkles,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 w-full bg-background border-y border-border">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-3">
            <span>Proven Journey Model</span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight mb-4 text-foreground">
            From Uncertainty to Direction
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-xl">
            A structured, student-first progression designed to give you clarity and momentum.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className="flex flex-col items-center text-center p-5 rounded-2xl border border-border bg-card/70 hover:border-primary/40 hover:bg-card transition-all duration-300 relative group"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-primary/15 transition-all">
                  <Icon className="h-6 w-6 text-primary" strokeWidth={2} />
                </div>
                <div className="mb-2">
                  <span className="text-[11px] font-mono font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                    Step {step.id}
                  </span>
                </div>
                <h3 className="font-heading text-base font-bold mb-2 text-foreground">
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
