"use client";

import Link from "next/link";
import { Compass } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Compass className="h-5 w-5" />
            </div>
            <span className="font-heading text-lg font-bold tracking-tight">
              Career<span className="text-primary">Compass</span>
            </span>
          </Link>
        </div>
        
        <nav className="ml-auto flex items-center gap-6 text-sm font-medium">
          <Link href="/careers" className="text-muted-foreground transition-colors hover:text-foreground">
            Explore Careers
          </Link>
          <Link href="/assessment" className="text-muted-foreground transition-colors hover:text-foreground">
            Assessment
          </Link>
          <div className="h-4 w-px bg-border/60"></div>
          <Link 
            href="/auth" 
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Sign In
          </Link>
        </nav>
      </div>
    </header>
  );
}
