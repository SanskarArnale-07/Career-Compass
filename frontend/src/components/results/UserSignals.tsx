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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-3">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Your Behavioral Patterns</span>
        </div>
        <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
          What's showing up in your responses?
        </h3>
        <p className="text-muted-foreground mt-1 max-w-2xl">
          Based on how you evaluated different situations, here are the central themes that emerged from your choices.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-border/80">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
            Your strongest signals
          </span>
          <span className="text-xs font-medium text-secondary">
            Derived from 8 dimensional profiles
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {signals.map((signal) => {
            const Icon = ICON_MAP[signal.iconName] || Compass;
            return (
              <div
                key={signal.traitCode}
                className="flex flex-col p-4 rounded-xl bg-[#0F172A]/70 border border-border/70 hover:border-primary/40 hover:bg-[#0F172A] transition-all duration-200"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <h4 className="font-semibold text-foreground text-base">
                    {signal.title}
                  </h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                  {signal.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-5 border-t border-border/60 flex items-start gap-3 text-xs text-muted-foreground">
          <div className="h-1.5 w-1.5 rounded-full bg-primary/80 mt-1.5 shrink-0" />
          <p className="leading-relaxed">
            <strong className="text-secondary-foreground font-semibold">Important perspective:</strong> These signals can appear across many different careers. They are useful clues for exploration, not fixed labels.
          </p>
        </div>
      </div>
    </div>
  );
}
