import Link from "next/link";
import { ArrowRight, Code, Target, ArrowUpRight } from "lucide-react";
import { Particles } from "@/components/interactive/Particles";
import { Features } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { CareerMatchPreview } from "@/components/sections/CareerMatchPreview";
import { FinalCta } from "@/components/sections/FinalCta";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      
      {/* 1. HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center pt-24 pb-16 md:pt-32 md:pb-24 w-full overflow-hidden">
        {/* Interactive Particles Background - Toned down slightly */}
        <Particles
          className="absolute inset-0 z-0 opacity-40"
          quantity={70}
          ease={70}
          staticity={30}
        />
        
        <div className="absolute inset-0 z-0 bg-radial from-transparent to-background via-background/80" />

        <div className="container relative z-10 mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="flex flex-col items-start text-left">
            {/* Hero Heading */}
            <h1 className="font-heading text-5xl md:text-6xl font-bold tracking-tight max-w-2xl mb-6 leading-[1.1]">
              Find the career that actually fits you.
            </h1>
            
            {/* Subheading */}
            <p className="text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed">
              Career-Compass analyzes your interests, strengths, skills and goals to help you discover suitable careers and build a clear path forward.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link 
                href="/assessment" 
                className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-medium text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Take the Assessment
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link 
                href="/careers" 
                className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-background/50 backdrop-blur-sm px-8 text-base font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Explore Careers
              </Link>
            </div>
          </div>

          {/* Product Visual */}
          <div className="relative w-full flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              {/* Main Card */}
              <div className="bg-card border border-border/80 shadow-2xl rounded-2xl p-6 relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Career Match</p>
                    <h3 className="font-heading text-xl font-bold flex items-center gap-2">
                      <Code className="h-5 w-5 text-primary" /> Software Engineer
                    </h3>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <span className="text-sm font-bold text-primary">92%</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-2 font-medium">Core Skills Match</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center rounded-md bg-accent px-2 py-1 text-xs font-medium text-accent-foreground">Problem Solving</span>
                      <span className="inline-flex items-center rounded-md bg-accent px-2 py-1 text-xs font-medium text-accent-foreground">Programming</span>
                      <span className="inline-flex items-center rounded-md bg-accent px-2 py-1 text-xs font-medium text-accent-foreground">Analytical Thinking</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overlapping Small Card */}
              <div className="absolute -bottom-6 -left-6 md:-left-12 bg-background border border-border shadow-xl rounded-xl p-4 z-20 w-64">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <Target className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-0.5">Next Step</p>
                    <p className="text-sm font-medium flex items-center gap-1">
                      Build 2 projects <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/20 blur-3xl -z-10 rounded-full"></div>
            </div>
          </div>
          
        </div>
      </section>

      {/* 2. FEATURES CARDS */}
      <Features />

      {/* 3. HOW IT WORKS */}
      <HowItWorks />

      {/* 4. CAREER MATCH PREVIEW */}
      <CareerMatchPreview />

      {/* 5. FINAL CTA */}
      <FinalCta />
      
    </div>
  );
}
