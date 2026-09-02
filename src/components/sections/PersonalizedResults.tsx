import { Target, CheckCircle2, Navigation } from "lucide-react";

export function PersonalizedResults() {
  return (
    <section className="py-24 sm:py-32 w-full relative">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="order-1 relative h-[400px] w-full rounded-2xl border border-border bg-background/50 backdrop-blur overflow-hidden flex items-center justify-center shadow-lg p-8">
            {/* Abstract visual of targeting/matching */}
            <div className="w-full max-w-sm space-y-4">
              {[
                { title: "Frontend Developer", match: "94%" },
                { title: "UX Engineer", match: "88%" },
                { title: "Product Designer", match: "76%" }
              ].map((role, idx) => (
                <div key={idx} className={`p-4 rounded-xl border flex items-center justify-between transition-all ${idx === 0 ? 'bg-primary/10 border-primary/50 scale-105 shadow-md' : 'bg-muted/30 border-border/50 opacity-70'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-primary' : 'bg-muted-foreground'}`} />
                    <span className="font-medium text-foreground">{role.title}</span>
                  </div>
                  <span className={`font-mono font-bold ${idx === 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                    {role.match}
                  </span>
                </div>
              ))}
              
              <div className="mt-8 p-4 bg-muted/20 border border-border/40 rounded-xl">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="text-primary font-bold mr-1">Why it fits:</span> 
                  Your high score in spatial reasoning and preference for immediate visual feedback aligns perfectly with the day-to-day work of a Frontend Developer.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-start text-left order-2">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
              <Target className="mr-2 h-4 w-4" />
              <span>Targeted Matching</span>
            </div>
            
            <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Find the direction that's actually right for you.
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              We don't just give you a list of jobs. Our engine calculates exactly how well you align with thousands of roles, explaining <span className="text-foreground font-medium">why</span> a specific path makes sense for your unique profile.
            </p>
            
            <ul className="space-y-4">
              {[
                "Data-driven career compatibility scores",
                "Deep dive into why a career fits your personality",
                "Transparent breakdown of required vs. existing skills",
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <CheckCircle2 className="mr-3 h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
        </div>
      </div>
    </section>
  );
}
