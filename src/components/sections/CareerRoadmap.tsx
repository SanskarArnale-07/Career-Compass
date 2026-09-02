import { Map, Milestone, Compass } from "lucide-react";

export function CareerRoadmap() {
  return (
    <section className="py-24 sm:py-32 w-full relative overflow-hidden bg-muted/20 border-y border-border/40">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-sm font-medium text-accent mb-6">
            <Map className="mr-2 h-4 w-4" />
            <span>Actionable Roadmaps</span>
          </div>
          <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight mb-6 max-w-3xl">
            A clear path through the noise.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Once you know your destination, we build the exact map to get you there. No more guessing what to learn or do next.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto mt-12">
          {/* Visual Roadmap Line */}
          <div className="absolute top-0 bottom-0 left-8 md:left-1/2 w-0.5 bg-border -translate-x-1/2"></div>
          
          <div className="space-y-12 relative z-10">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row items-start md:items-center w-full">
              <div className="md:w-1/2 md:pr-12 md:text-right flex flex-col md:items-end pl-16 md:pl-0 mb-4 md:mb-0">
                <h3 className="font-heading text-xl font-bold">Close the Skill Gap</h3>
                <p className="text-muted-foreground text-sm mt-2 max-w-sm">Focus only on the exact skills you're missing, saving hundreds of hours of directionless learning.</p>
              </div>
              <div className="absolute left-8 md:left-1/2 w-8 h-8 rounded-full bg-background border-2 border-primary -translate-x-1/2 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              </div>
              <div className="md:w-1/2 md:pl-12 pl-16 md:pl-0 hidden md:block">
                {/* Empty spacer for alternating layout */}
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row items-start md:items-center w-full">
              <div className="md:w-1/2 md:pr-12 md:text-right hidden md:block"></div>
              <div className="absolute left-8 md:left-1/2 w-8 h-8 rounded-full bg-background border-2 border-border -translate-x-1/2 flex items-center justify-center">
                <Milestone className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="md:w-1/2 md:pl-12 pl-16 md:pl-0">
                <h3 className="font-heading text-xl font-bold">Build Your Portfolio</h3>
                <p className="text-muted-foreground text-sm mt-2 max-w-sm">Complete tailored projects that actually prove you have the skills employers in this specific field are looking for.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row items-start md:items-center w-full">
              <div className="md:w-1/2 md:pr-12 md:text-right flex flex-col md:items-end pl-16 md:pl-0 mb-4 md:mb-0">
                <h3 className="font-heading text-xl font-bold">Navigate the Interview</h3>
                <p className="text-muted-foreground text-sm mt-2 max-w-sm">Prepare with highly specific insights into the industry, role expectations, and technical requirements.</p>
              </div>
              <div className="absolute left-8 md:left-1/2 w-8 h-8 rounded-full bg-background border-2 border-border -translate-x-1/2 flex items-center justify-center">
                <Compass className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="md:w-1/2 md:pl-12 pl-16 md:pl-0 hidden md:block"></div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
