import { Sparkles, MapPin } from "lucide-react";

export function CareerDiscovery() {
  return (
    <section className="py-24 sm:py-32 w-full relative overflow-hidden bg-muted/20 border-y border-border/40">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="flex flex-col items-start text-left order-2 lg:order-1">
            <div className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-sm font-medium text-accent mb-6">
              <Sparkles className="mr-2 h-4 w-4" />
              <span>Assessment & Discovery</span>
            </div>
            
            <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight mb-6">
              Pinpoint your exact starting position.
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Before you can navigate to your destination, you need to know exactly where you stand. Our structured assessment maps your current coordinates across skills, interests, and cognitive strengths.
            </p>
            
            <ul className="space-y-4 mb-8">
              {[
                "Identify your natural problem-solving approaches",
                "Map your existing foundational skills",
                "Determine your core working preferences",
              ].map((item, i) => (
                <li key={i} className="flex items-start">
                  <div className="mt-1 mr-3 h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  </div>
                  <span className="text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="order-1 lg:order-2 relative h-100 w-full rounded-2xl border border-border bg-background/50 backdrop-blur overflow-hidden flex items-center justify-center shadow-lg">
            {/* Visual representation of finding coordinates */}
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)',
              backgroundSize: '24px 24px'
            }}></div>
            
            <div className="relative z-10 w-64 h-64 border border-border/80 rounded-full flex items-center justify-center">
              <div className="absolute top-1/2 left-0 right-0 h-px bg-border/80"></div>
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border/80"></div>
              
              <div className="w-32 h-32 border border-primary/30 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center backdrop-blur-md border border-primary/40">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
