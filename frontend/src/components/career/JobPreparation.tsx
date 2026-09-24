"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckSquare, Square, ClipboardCheck, Info } from "lucide-react";
import type { PreparationItem } from "@/lib/career-details/types";

interface JobPreparationProps {
  items: PreparationItem[];
  careerSlug: string;
}

export default function JobPreparation({ items, careerSlug }: JobPreparationProps) {
  const storageKey = `careerCompass_prep_${careerSlug}`;

  const [checked, setChecked] = useState<Set<string>>(new Set());

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setTimeout(() => {
          setChecked(new Set(parsed));
        }, 0);
      }
    } catch {
      // ignore
    }
  }, [storageKey]);

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);

      const arr = Array.from(next);
      try {
        localStorage.setItem(storageKey, JSON.stringify(arr));

        // Also synchronize with global careerCompassProgress
        const progStr = localStorage.getItem("careerCompassProgress");
        if (progStr) {
          const prog = JSON.parse(progStr);
          const currentTasks = new Set<string>(prog.completedTasks || []);
          if (next.has(id)) currentTasks.add(id);
          else currentTasks.delete(id);
          prog.completedTasks = Array.from(currentTasks);
          localStorage.setItem("careerCompassProgress", JSON.stringify(prog));
        }
      } catch {
        // ignore
      }

      return next;
    });
  };

  const progress = items.length > 0 ? (checked.size / items.length) * 100 : 0;

  // Group items by category
  const categories = Array.from(new Set(items.map((i) => i.category)));

  return (
    <section>
      <h2 className="font-heading text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
        <ClipboardCheck className="h-6 w-6 text-primary" />
        Career Preparation Checklist
      </h2>
      <p className="font-sans text-sm text-muted-foreground mb-6 max-w-2xl">
        Track your progress as you prepare for this career. Your progress is saved automatically.
      </p>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-muted-foreground">{checked.size} of {items.length} completed</span>
          <span className="text-xs font-bold text-primary">{Math.round(progress)}%</span>
        </div>
        <div className="h-2.5 w-full bg-[#10141A] rounded-full overflow-hidden border border-border/80">
          <motion.div
            className="h-full bg-linear-to-r from-primary to-[#38BDF8] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Checklist by category */}
      <div className="space-y-6">
        {categories.map((cat) => {
          const catItems = items.filter((i) => i.category === cat);
          return (
            <div key={cat}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {cat}
              </h3>
              <div className="space-y-2">
                {catItems.map((item, i) => {
                  const isChecked = checked.has(item.id);
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => toggle(item.id)}
                      className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border transition-all duration-300 ${
                        isChecked
                          ? "border-border/70 bg-[#10141A]"
                          : "border-border bg-card hover:border-primary/25 hover:bg-card-hover"
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare className="h-5 w-5 text-primary/80 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="h-5 w-5 text-muted-foreground/60 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold transition-colors ${isChecked ? "text-muted-foreground line-through decoration-muted-foreground/40" : "text-foreground"}`}>
                          {item.task}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-start gap-1">
                          <Info className="h-3 w-3 shrink-0 mt-0.5" />
                          {item.details}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
