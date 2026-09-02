import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Particles } from "@/components/interactive/Particles";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { CareerDiscovery } from "@/components/sections/CareerDiscovery";
import { PersonalizedResults } from "@/components/sections/PersonalizedResults";
import { CareerRoadmap } from "@/components/sections/CareerRoadmap";
import { AiAssistant } from "@/components/sections/AiAssistant";
import { FinalCta } from "@/components/sections/FinalCta";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      
      {/* 1. HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] w-full overflow-hidden">
        {/* Interactive Particles Background - The Field of Possibilities */}
        <Particles
          className="absolute inset-0 z-0 opacity-80"
          quantity={70}
          ease={70}
          staticity={30}
        />
        
        {/* Very subtle gradient to ensure text readability without overpowering */}
        <div className="absolute inset-0 z-0 bg-radial from-transparent to-background via-background/60" />

        <div className="container relative z-10 mx-auto px-4 py-20 flex flex-col items-center text-center">
          
          <h2 className="font-heading text-sm md:text-base font-medium tracking-widest text-primary uppercase mb-6 drop-shadow-sm">
            Career Compass
          </h2>

          {/* Hero Heading */}
          <h1 className="font-heading text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mb-6 leading-tight">
            Find the direction that's <span className="text-transparent bg-clip-text bg-linear-to-r from-foreground to-foreground/50">right for you.</span>
          </h1>
          
          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-12">
            Discover careers based on your interests, strengths, goals, and potential.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              href="/assessment" 
              className="inline-flex h-14 items-center justify-center rounded-lg bg-primary px-8 text-lg font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-105 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              href="/careers" 
              className="inline-flex h-14 items-center justify-center rounded-lg border border-border bg-background/30 backdrop-blur-md px-8 text-lg font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Explore Careers
            </Link>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-pulse opacity-50">
          <div className="w-px h-12 bg-linear-to-b from-foreground to-transparent"></div>
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <HowItWorks />

      {/* 3. CAREER DISCOVERY */}
      <CareerDiscovery />

      {/* 4. PERSONALIZED RESULTS */}
      <PersonalizedResults />

      {/* 5. CAREER ROADMAP */}
      <CareerRoadmap />

      {/* 6. AI ASSISTANT */}
      <AiAssistant />

      {/* 7. FINAL CTA */}
      <FinalCta />
      
    </div>
  );
}
