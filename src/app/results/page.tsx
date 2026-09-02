"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";

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

  // Avoid hydration mismatch by waiting for client render
  if (!isClient) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      
      {!assessmentData ? (
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
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-500 mb-6">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Assessment Complete
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              We've successfully collected your profile data. In the final product, this is where our AI engine will generate your personalized career matches.
            </p>
          </div>

          <div className="bg-card border border-border shadow-sm rounded-xl p-6 md:p-8 mb-10 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary via-primary/50 to-primary"></div>
            
            <h3 className="font-heading text-xl font-bold mb-6 flex items-center justify-between">
              <span>Your Profile Data Payload</span>
              <span className="text-xs font-mono font-normal bg-muted px-2 py-1 rounded text-muted-foreground">JSON</span>
            </h3>
            
            <div className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
              <pre className="text-sm font-mono text-muted-foreground whitespace-pre-wrap">
                {JSON.stringify(assessmentData, null, 2)}
              </pre>
            </div>
          </div>

          <div className="flex justify-center">
            <Link 
              href="/"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-border bg-background px-8 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </div>
        </div>
      )}

    </div>
  );
}
