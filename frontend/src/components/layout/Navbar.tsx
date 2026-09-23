"use client";

import Link from "next/link";
import { Compass } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/90 backdrop-blur-md">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/15 border border-primary/30 text-primary">
            <Compass className="h-4 w-4" />
          </div>
          <span className="font-heading text-base font-bold tracking-tight text-foreground">
            Career<span className="text-primary font-semibold">Compass</span>
          </span>
        </Link>
        
        {/* Center: Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-[13px] font-medium">
          <Link href="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">
            Dashboard
          </Link>
          <Link href="/coach" className="text-muted-foreground transition-colors hover:text-foreground">
            Career Coach
          </Link>
          <Link href="/assessment" className="text-muted-foreground transition-colors hover:text-foreground">
            Assessment
          </Link>
          <Link href="/careers" className="text-muted-foreground/50 transition-colors hover:text-muted-foreground text-xs">
            Explore More
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <Link 
            href="/assessment" 
            className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary-hover"
          >
            Start Assessment
          </Link>
        </div>

      </div>
    </header>
  );
}
