"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import type { SnapshotItem } from "@/lib/career-details/types";

interface CareerSnapshotProps {
  items: SnapshotItem[];
}

export default function CareerSnapshot({ items }: CareerSnapshotProps) {
  return (
    <section>
      <h2 className="font-heading text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
        <LucideIcons.LayoutGrid className="h-6 w-6 text-primary" />
        Career Snapshot
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, i) => {
          const Icon =
            (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[item.icon] ?? LucideIcons.Info;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="group rounded-xl border border-border bg-card p-5 hover:border-primary/30 hover:bg-card-hover transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <h3 className="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider">
                  {item.label}
                </h3>
              </div>
              <p className="font-sans text-sm text-foreground leading-relaxed">{item.value}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
