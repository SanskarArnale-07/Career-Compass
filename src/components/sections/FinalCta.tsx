import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCta() {
  return (
    <section className="py-24 w-full border-t border-border/40 relative overflow-hidden">
      {/* Radial gradient background */}
      <div className="absolute inset-0 bg-radial from-primary/5 to-transparent via-transparent" />
      
      <div className="container mx-auto px-4 max-w-4xl relative z-10 flex flex-col items-center text-center">
        <h2 className="font-heading text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
          Ready to find your direction?
        </h2>
        
        <p className="text-xl text-muted-foreground max-w-2xl mb-10">
          Stop wandering. Take the assessment today and get a crystal clear picture of where you belong and how to get there.
        </p>
        
        <Link 
          href="/assessment" 
          className="inline-flex h-14 items-center justify-center rounded-lg bg-primary px-8 text-lg font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-105 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Start Your Journey
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
