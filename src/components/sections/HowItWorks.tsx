import { Compass, Map, Target, ArrowRight } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      id: "01",
      title: "Discover Your Profile",
      description: "Take our structured assessment to uncover your unique strengths, interests, and working style.",
      icon: Compass,
    },
    {
      id: "02",
      title: "Find Your Direction",
      description: "Our AI matches your profile against thousands of career paths to find your optimal fit.",
      icon: Target,
    },
    {
      id: "03",
      title: "Identify the Gap",
      description: "Understand exactly which skills you have and which you need to acquire to reach your goal.",
      icon: ArrowRight,
    },
    {
      id: "04",
      title: "Follow the Map",
      description: "Get a step-by-step personalized roadmap to guide you from where you are to your new career.",
      icon: Map,
    },
  ];

  return (
    <section className="py-24 sm:py-32 w-full">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col items-center text-center mb-20">
          <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight mb-4">
            How Career Compass Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            A structured path from uncertainty to absolute clarity.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[1px] bg-border/60"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center group">
                <div className="w-24 h-24 rounded-full bg-background border border-border flex items-center justify-center mb-6 relative transition-transform duration-500 group-hover:scale-105 shadow-sm">
                  <div className="absolute inset-0 rounded-full border border-primary/20 scale-[1.15] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <step.icon className="h-8 w-8 text-primary" strokeWidth={1.5} />
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-mono text-muted-foreground border border-border">
                    {step.id}
                  </div>
                </div>
                <h3 className="font-heading text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
