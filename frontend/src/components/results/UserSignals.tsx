"use client";

import {
  BrainCircuit,
  Search,
  Cpu,
  Palette,
  TrendingUp,
  Compass,
  Users,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { getSignalsFromTraits, UserSignal } from "@/lib/career-directions";

interface UserSignalsProps {
  traits: Record<string, number>;
}

const ICON_MAP: Record<string, LucideIcon> = {
  BrainCircuit,
  Search,
  Cpu,
  Palette,
  TrendingUp,
  Compass,
  Users,
};

export function UserSignals({ traits }: UserSignalsProps) {
  const signals: UserSignal[] = getSignalsFromTraits(traits);

  if (!signals.length) return null;

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono font-semibold text-primary mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Behavioral Pattern Analysis</span>
        </div>
        <h3 className="font-heading text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          What&apos;s showing up in your responses?
        </h3>
        <p className="text-muted-foreground mt-1 max-w-2xl font-light text-sm sm:text-base">
          Based on how you evaluated trade-offs and scenarios, here are the central themes that emerged from your choices.
        </p>
      </div>

      <div className="bg-card border border-border/70 rounded-xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-border/60">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
            Strongest Observed Signals
          </span>
          <span className="text-xs font-mono text-muted-foreground/70">
            8 Dimensional Vectors
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {signals.map((signal) => {
            const Icon = ICON_MAP[signal.iconName] || Compass;
            return (
              <div
                key={signal.traitCode}
                className="flex flex-col p-5 rounded-xl bg-[#161412] border border-border/60 hover:border-primary/40 hover:bg-[#1A1714] transition-all duration-200 group"
              >
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h4 className="font-semibold text-foreground text-sm tracking-tight">
                    {signal.title}
                  </h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed font-light">
                  {signal.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-5 border-t border-border/50 flex items-start gap-3 text-xs text-muted-foreground font-light">
          <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
          <p className="leading-relaxed">
            <strong className="text-foreground font-medium">Perspective:</strong> These signals can emerge across many disciplines. They represent exploratory coordinates, not limiting boundaries.
          </p>
        </div>
      </div>
    </div>
  );
}
