export function HowItWorks() {
  const steps = [
    { id: "01", label: "Assess", description: "Take the adaptive assessment" },
    { id: "02", label: "Analyze", description: "Map your trait dimensions" },
    { id: "03", label: "Match", description: "Discover aligned careers" },
    { id: "04", label: "Explore", description: "Dive into career details" },
    { id: "05", label: "Build", description: "Follow your roadmap" },
  ];

  return (
    <section id="how-it-works" className="py-24 sm:py-32 w-full">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Section heading */}
        <div className="text-center mb-20">
          <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-4">
            The Journey
          </p>
          <h2 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            From Uncertainty to Direction
          </h2>
          <p className="text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            A structured progression designed to give you clarity and momentum.
          </p>
        </div>

        {/* Connected path */}
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 sm:gap-0">
          {/* Connecting line (horizontal on sm+, vertical on mobile) */}
          <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-px bg-border/50 -translate-y-1/2 z-0" />
          <div className="sm:hidden absolute top-0 bottom-0 left-4 w-px bg-border/50 z-0" />

          {steps.map((step, idx) => (
            <div
              key={step.id}
              className="relative z-10 flex sm:flex-col items-start sm:items-center gap-4 sm:gap-3 flex-1"
            >
              {/* Node */}
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                idx === 0
                  ? "bg-primary/15 border-2 border-primary/40"
                  : "bg-card border border-border/60"
              }`}>
                <span className={`text-[10px] sm:text-xs font-mono font-bold ${
                  idx === 0 ? "text-primary" : "text-muted-foreground"
                }`}>
                  {step.id}
                </span>
              </div>

              {/* Text */}
              <div className="sm:text-center">
                <p className={`text-sm font-semibold mb-0.5 ${
                  idx === 0 ? "text-foreground" : "text-foreground/80"
                }`}>
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-[140px]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
