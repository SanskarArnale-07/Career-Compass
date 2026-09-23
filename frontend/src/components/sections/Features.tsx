export function Features() {
  const steps = [
    {
      num: "01",
      title: "Understand Yourself",
      description: "A 5-minute adaptive assessment maps your cognitive traits, interests, and natural strengths across 8 dimensions.",
    },
    {
      num: "02",
      title: "Find Your Direction",
      description: "Your trait profile is scored against real career requirements to identify areas of genuine alignment.",
    },
    {
      num: "03",
      title: "Discover Your Matches",
      description: "See personalized career recommendations ranked by how closely they match your unique profile.",
    },
    {
      num: "04",
      title: "Build Your Path",
      description: "Each recommended career includes a structured roadmap with skills, milestones, and projects to get you there.",
    },
  ];

  return (
    <section className="py-24 sm:py-32 w-full border-t border-border/40">
      <div className="container mx-auto px-4 max-w-4xl">

        {steps.map((step, idx) => (
          <div
            key={step.num}
            className={`flex flex-col sm:flex-row gap-6 sm:gap-12 py-12 ${
              idx !== steps.length - 1 ? "border-b border-border/30" : ""
            }`}
          >
            {/* Large number */}
            <span className="font-heading text-5xl sm:text-6xl font-bold text-primary/20 leading-none shrink-0 tabular-nums tracking-tight">
              {step.num}
            </span>

            <div className="flex-1">
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-foreground mb-3 tracking-tight">
                {step.title}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg">
                {step.description}
              </p>
            </div>
          </div>
        ))}

      </div>
    </section>
  );
}
