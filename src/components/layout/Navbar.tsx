"use client";

import Link from "next/link";
import { Compass } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Compass className="h-4 w-4" />
          </div>
          <span className="font-heading text-base font-bold tracking-tight">
            Career<span className="text-primary">Compass</span>
          </span>
        </Link>
        
        {/* Center: Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/careers" className="text-muted-foreground transition-colors hover:text-foreground">
            Explore Careers
          </Link>
          <Link href="/assessment" className="text-muted-foreground transition-colors hover:text-foreground">
            Assessment
          </Link>
          <Link href="/#how-it-works" className="text-muted-foreground transition-colors hover:text-foreground">
            How It Works
          </Link>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <Link 
            href="/auth" 
            className="hidden sm:inline-flex text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign In
          </Link>
          <Link 
            href="/assessment" 
            className="inline-flex h-8 items-center justify-center rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Start Assessment
          </Link>
        </div>

      </div>
    </header>
  );
}
