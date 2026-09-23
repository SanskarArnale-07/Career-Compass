import Link from "next/link";
import { Compass } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-[#0A0A0A]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-primary/80" />
            <span className="font-heading text-sm font-bold tracking-tight text-foreground/80">
              Career<span className="text-primary/70">Compass</span>
            </span>
          </div>
          
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <Link href="/assessment" className="hover:text-foreground transition-colors">Assessment</Link>
            <Link href="/careers" className="hover:text-muted-foreground/80 transition-colors text-muted-foreground/50">Explore More Careers</Link>
            <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
          </nav>
          
          <div className="text-xs text-muted-foreground/50">
            © {new Date().getFullYear()} Career Compass
          </div>
          
        </div>
      </div>
    </footer>
  );
}
