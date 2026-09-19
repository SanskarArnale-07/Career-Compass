"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log sanitized client error
    console.error("Unhandled client error caught by boundary:", error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 border border-destructive/25 text-destructive">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <div className="font-mono text-xs uppercase tracking-widest text-destructive font-semibold mb-2">
          System Recovery
        </div>

        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-3">
          Something Went Wrong
        </h1>

        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
          An unexpected error occurred while rendering this view. Your saved career
          progress is safely stored.
        </p>

        {error?.digest && (
          <div className="mb-6 p-2.5 rounded-lg bg-card border border-border text-[11px] font-mono text-muted-foreground">
            Error ID: {error.digest}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-hover shadow-sm transition-colors cursor-pointer"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm font-semibold hover:bg-card-hover transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
