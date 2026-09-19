import Link from "next/link";
import { Compass, Home, BookOpen, LayoutDashboard, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        {/* Visual Badge */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 border border-primary/25 text-primary shadow-lg shadow-primary/5">
          <Compass className="h-10 w-10 animate-pulse" />
        </div>

        {/* Code & Title */}
        <div className="mb-2 font-mono text-xs uppercase tracking-widest text-primary font-semibold">
          Error 404 • Destination Unknown
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
          Page Off Course
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-8">
          The path you are looking for doesn&apos;t exist or has moved. Let&apos;s
          get your career exploration back on heading.
        </p>

        {/* Navigation Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary-hover shadow-sm transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>Return Home</span>
          </Link>
          <Link
            href="/careers"
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border bg-card text-foreground text-sm font-semibold hover:bg-card-hover hover:border-primary/40 transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            <span>Explore Careers</span>
          </Link>
        </div>

        <div className="pt-4 border-t border-border/60 flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <Link
            href="/assessment"
            className="hover:text-primary transition-colors flex items-center gap-1"
          >
            <span>Take Assessment</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
          <span>•</span>
          <Link
            href="/dashboard"
            className="hover:text-primary transition-colors flex items-center gap-1"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
