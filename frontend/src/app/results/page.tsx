"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import { SuitabilityScores } from "@/components/results/SuitabilityScores";
import { CareerMatches } from "@/components/results/CareerMatches";
import { CareerExplanation } from "@/components/results/CareerExplanation";
import { SkillGaps } from "@/components/results/SkillGaps";
import { NextSteps } from "@/components/results/NextSteps";

export default function ResultsPage() {
  const [isClient, setIsClient] = useState(false);
  const [assessmentData, setAssessmentData] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    const data = sessionStorage.getItem("careerCompassAssessment");
    if (data) {
      try {
        setAssessmentData(JSON.parse(data));
      } catch (e) {
        console.error("Failed to parse assessment data", e);
      }
    }
  }, []);

  if (!isClient) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!assessmentData) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center py-20 flex flex-col items-center">
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-6">
            ?
          </div>
          <h1 className="font-heading text-3xl font-bold mb-4">No Assessment Data Found</h1>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            It looks like you haven't completed the career assessment yet, or your session has expired.
          </p>
          <Link 
            href="/assessment" 
            className="inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Take Assessment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      
      <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Your Career DNA Profile
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Here is your personalized roadmap for Class 11 and beyond, based on your unique interests and personality.
        </p>
      </div>

      <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150 fill-mode-both">
        
        {/* Step 1: Suitability */}
        <section>
          <SuitabilityScores />
        </section>

        {/* Step 2: Career Matches */}
        <section>
          <CareerMatches />
        </section>

        {/* Step 3: Explanation */}
        <section>
          <CareerExplanation />
        </section>

        {/* Step 4: Skill Gaps */}
        <section>
          <SkillGaps />
        </section>

        {/* Step 5: Next Steps */}
        <section>
          <NextSteps />
        </section>

        <div className="pt-8 border-t border-border flex justify-center">
          <Link 
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-background px-8 text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return Home
          </Link>
        </div>

      </div>
    </div>
  );
}
