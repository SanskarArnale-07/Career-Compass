import Link from "next/link";
import { ArrowRight, Code, Target, ArrowUpRight } from "lucide-react";
import { Particles } from "@/components/interactive/Particles";
import { BlurText } from "@/components/interactive/BlurText";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { SpotlightCard } from "@/components/interactive/SpotlightCard";
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
          className="absolute inset-0 z-0 opacity-20"
          quantity={70}
          ease={70}
          staticity={30}
        />
        
        {/* Subtle soft electric blue glow overlay */}
        <div className="absolute inset-0 z-0 bg-radial from-primary/10 via-background/90 to-background" />

        <div className="container relative z-10 mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="flex flex-col items-start text-left">
            {/* Hero Heading */}
            <h1 className="font-heading text-5xl md:text-6xl font-bold tracking-tight max-w-2xl mb-6 leading-[1.1] text-foreground">
              <BlurText
                text="Find the career that actually fits you."
                delay={0.05}
                className="inline-block"
              />
            </h1>
            
            {/* Subheading */}
            <p className="text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed">
              Career-Compass analyzes your interests, strengths, skills and goals to help you discover suitable careers and build a clear path forward.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-stretch sm:items-center">
              <Link href="/assessment" className="inline-block">
                <ShimmerButton className="h-12 px-8 text-base font-semibold shadow-md shadow-primary/25">
                  <span className="flex items-center gap-2">
                    <span>Take the Assessment</span>
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </ShimmerButton>
              </Link>
              <div className="flex flex-col items-start sm:items-center">
                <Link 
                  href="/careers" 
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Explore More Careers
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <span className="text-[11px] text-muted-foreground/60 mt-0.5">Curious about other careers?</span>
              </div>
            </div>
          </div>

          {/* Product Visual */}
          <div className="relative w-full flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              {/* Main Card */}
              <SpotlightCard
                spotlightColor="rgba(59, 130, 246, 0.15)"
                className="shadow-2xl rounded-2xl p-6 relative z-10"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Career Match</p>
                    <h3 className="font-heading text-xl font-bold flex items-center gap-2 text-foreground">
                      <Code className="h-5 w-5 text-primary" /> Software Engineer
                    </h3>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center border border-primary/30 shadow-xs shadow-primary/20">
                    <span className="text-sm font-bold text-primary">92%</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-2 font-medium">Core Skills Match</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center rounded-md bg-[#0F172A] border border-border/80 px-2.5 py-1 text-xs font-medium text-secondary">Problem Solving</span>
                      <span className="inline-flex items-center rounded-md bg-[#0F172A] border border-border/80 px-2.5 py-1 text-xs font-medium text-secondary">Programming</span>
                      <span className="inline-flex items-center rounded-md bg-[#0F172A] border border-border/80 px-2.5 py-1 text-xs font-medium text-secondary">Analytical Thinking</span>
                    </div>
                  </div>
                </div>
              </SpotlightCard>

              {/* Overlapping Small Card */}
              <div className="absolute -bottom-6 -left-6 md:-left-12 bg-[#0F172A] border border-border shadow-xl rounded-xl p-4 z-20 w-64">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center text-primary border border-primary/20">
                    <Target className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-0.5">Next Step</p>
                    <p className="text-sm font-medium text-foreground flex items-center gap-1">
                      Build 2 projects <ArrowUpRight className="h-3 w-3 text-muted-foreground" />
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Background Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/10 blur-3xl -z-10 rounded-full"></div>
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
