"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Compass } from "lucide-react";
import { getCareerBySlug } from "@/lib/career-details";
import type { AlternativeCareer } from "@/lib/career-details/personalization";

interface AlternativeCareersProps {
  alternatives: AlternativeCareer[];
}

export default function AlternativeCareers({ alternatives }: AlternativeCareersProps) {
  if (alternatives.length === 0) return null;

  return (
    <section>
      <h2 className="font-heading text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
        <Compass className="h-6 w-6 text-primary" />
        Other Careers to Explore
      </h2>
      <p className="font-sans text-sm text-muted-foreground mb-6 max-w-2xl">
        Based on your assessment, these careers also align with your profile.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {alternatives.map((alt, i) => {
          const career = getCareerBySlug(alt.slug);
          if (!career) return null;

          return (
            <motion.div
              key={alt.slug}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Link
                href={`/career/${alt.slug}`}
                className="group block rounded-xl border border-border bg-card p-5 hover:border-primary/30 hover:bg-card-hover hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{career.category}</span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold text-primary bg-primary/10 border border-primary/20">
                    {Math.round(alt.matchPercentage)}%
                  </span>
                </div>

                <h3 className="font-heading text-base font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {career.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{career.tagline}</p>

                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  Explore
                  <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
