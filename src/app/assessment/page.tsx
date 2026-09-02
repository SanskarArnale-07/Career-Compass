import Link from "next/link";
import { ArrowRight, Clock, Compass } from "lucide-react";

export default function AssessmentIntroPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center flex flex-col items-center">
        
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
          <Compass className="h-10 w-10" />
        </div>

        <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight mb-6">
          Let's understand how you think.
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
          This assessment looks at your interests, strengths, working preferences and goals to find careers that fit you.
        </p>

        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-muted/50 px-4 py-2 rounded-full mb-10">
          <Clock className="h-4 w-4" />
          <span>~5 minutes</span>
        </div>

        <Link
          href="/assessment/take"
          className="inline-flex h-14 items-center justify-center rounded-lg bg-primary px-10 text-lg font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-105 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Start Assessment
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
