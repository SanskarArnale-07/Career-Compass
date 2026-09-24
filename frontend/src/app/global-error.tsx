"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#080A0D] text-[#F4F7FA] flex items-center justify-center p-4 font-sans antialiased">
        <div className="max-w-md w-full text-center p-8 rounded-2xl border border-[#1E2633] bg-[#10141A] shadow-2xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400">
            ⚠️
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Critical Application Error
          </h1>
          <p className="text-sm text-[#8C96A3] mb-6 leading-relaxed font-light">
            The application encountered a critical runtime exception.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => reset()}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary-hover transition-colors cursor-pointer"
            >
              Restart Application
            </button>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-[#1E2633] bg-[#141920] text-[#F4F7FA] font-semibold text-sm hover:bg-[#1A222D] transition-colors inline-block"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
