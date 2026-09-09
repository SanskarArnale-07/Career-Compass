import { Compass, Target, AlertCircle, Map } from "lucide-react";

export function Features() {
  const features = [
    {
      id: "01",
      title: "Discover",
      description: "Explore careers that match your interests and strengths.",
      icon: Compass,
    },
    {
      id: "02",
      title: "Understand",
      description: "See why each career fits your profile.",
      icon: Target,
    },
    {
      id: "03",
      title: "Identify Gaps",
      description: "Find the skills you need to develop.",
      icon: AlertCircle,
    },
    {
      id: "04",
      title: "Build Your Path",
      description: "Get practical next steps toward your target career.",
      icon: Map,
    },
  ];

  return (
    <section className="py-20 w-full bg-[#0F172A] border-t border-border">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div 
              key={feature.id} 
              className="flex flex-col p-6 rounded-xl border border-border bg-card hover:bg-card-hover hover:border-primary/40 transition-all duration-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <feature.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-mono font-medium text-primary/70">
                  {feature.id}
                </span>
              </div>
              <h3 className="font-heading text-lg font-bold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
