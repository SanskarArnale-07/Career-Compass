import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCta() {
  return (
    <section className="py-24 w-full border-t border-border relative overflow-hidden">
      {/* Subtle radial electric blue glow background */}
      <div className="absolute inset-0 bg-radial from-primary/12 via-background to-background" />
      
      <div className="container mx-auto px-4 max-w-4xl relative z-10 flex flex-col items-center text-center">
        <h2 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
          Your career shouldn't be a guess.
        </h2>
        
        <p className="text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
          Start with a better understanding of yourself.
        </p>
        
        <Link 
          href="/assessment" 
          className="inline-flex h-14 items-center justify-center rounded-lg bg-primary px-8 text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary-hover hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/35 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Start Your Assessment
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
