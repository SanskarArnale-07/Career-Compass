import Link from "next/link";
import { Compass } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-[#0F172A]/80">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-xs shadow-primary/25">
              <Compass className="h-3.5 w-3.5" />
            </div>
            <span className="font-heading text-sm font-bold tracking-tight text-foreground">
              Career<span className="text-primary">Compass</span>
            </span>
          </div>
          
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <Link href="/careers" className="hover:text-foreground transition-colors">Explore Careers</Link>
            <Link href="/assessment" className="hover:text-foreground transition-colors">Assessment</Link>
            <Link href="/#how-it-works" className="hover:text-foreground transition-colors">How It Works</Link>
          </nav>
          
          <div className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Career Compass. All rights reserved.
          </div>
          
        </div>
      </div>
    </footer>
  );
}
