import Link from "next/link";
import { Compass } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded text-primary">
              <Compass className="h-3.5 w-3.5" />
            </div>
            <span className="font-heading text-sm font-semibold tracking-tight text-foreground/80">
              Career<span className="text-primary">Compass</span>
            </span>
          </div>
          
          <nav className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <Link href="/assessment" className="hover:text-foreground transition-colors">Assessment</Link>
            <Link href="/careers" className="hover:text-foreground transition-colors">Explore More Careers</Link>
            <Link href="/coach" className="hover:text-foreground transition-colors">Career Coach</Link>
          </nav>
          
          <div className="text-[11px] text-muted-foreground/60">
            © {new Date().getFullYear()} Career Compass
          </div>
          
        </div>
      </div>
    </footer>
  );
}
