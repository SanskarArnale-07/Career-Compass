"use client";

import React, { useState } from "react";
import {
  Landmark,
  Shield,
  Globe,
  Coins,
  ChevronDown,
  CheckCircle2,
  ExternalLink,
  Info,
  Scale,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CivilServicesBriefingProps {
  careerSlug: string;
}

export function CivilServicesBriefing({ careerSlug }: CivilServicesBriefingProps) {
  const [showExamDetails, setShowExamDetails] = useState(false);

  // Available Constitutional Pathways
  const pathways = [
    {
      code: "IAS",
      name: "Indian Administrative Service",
      focus: "District administration, state secretariat governance, and development programs",
      icon: Landmark,
      color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    },
    {
      code: "IPS",
      name: "Indian Police Service",
      focus: "Law enforcement, public order maintenance, crime investigation, and internal security",
      icon: Shield,
      color: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    },
    {
      code: "IFS",
      name: "Indian Foreign Service",
      focus: "International diplomacy, bilateral accords, consular affairs, and trade representation",
      icon: Globe,
      color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    },
    {
      code: "IRS",
      name: "Indian Revenue Service",
      focus: "Direct & indirect taxation, customs enforcement, and financial administration",
      icon: Coins,
      color: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    },
  ];

  return (
    <section className="space-y-6 rounded-2xl border border-border/80 bg-[#0D1117] p-6 sm:p-8">
      {/* ── Section Header ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-mono font-semibold text-primary mb-2">
            <Landmark className="h-3.5 w-3.5" />
            <span>Public Service Pathway Guide</span>
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
            Indian Civil Services &amp; Public Administration
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl font-light">
            Recruited primarily through the annual UPSC Civil Services Examination (CSE) and State Public Service Commissions.
          </p>
        </div>
        <span className="text-xs font-mono text-muted-foreground/70 bg-[#141922] px-3 py-1.5 rounded-lg border border-border/60 self-start sm:self-auto">
          Constitutional Cadres
        </span>
      </div>

      {/* ── 1. Available Pathways (Simple Initial View) ────────────── */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground font-semibold">
          Primary Constitutional Services
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {pathways.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.code}
                className="p-4 rounded-xl bg-[#111520] border border-border/70 hover:border-primary/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${p.color}`}>
                      {p.code}
                    </span>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <h4 className="font-heading text-sm font-semibold text-foreground leading-snug">
                    {p.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 font-light leading-relaxed">
                    {p.focus}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 2. Important Distinction: Suitability vs Examination Success ─ */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-primary/10 via-[#101726] to-[#0E131E] border border-primary/30 space-y-4">
        <div className="flex items-center gap-2">
          <Scale className="h-4 w-4 text-primary shrink-0" />
          <h3 className="font-heading text-sm sm:text-base font-bold text-foreground">
            Understanding Suitability vs. Competitive Exam Success
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-3.5 rounded-lg bg-[#0C1018] border border-border/70 space-y-2">
            <div className="flex items-center gap-1.5 text-primary font-semibold font-mono text-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Career Suitability (The Role)</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Measures your aptitude for public leadership, ethical governance, empathy for citizens, and problem-solving in complex administrative environments.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-[#0C1018] border border-border/70 space-y-2">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold font-mono text-xs">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Competitive Exam (The Filter)</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              UPSC CSE is a high-selectivity competitive examination (~0.1% final selection). Success requires intense, disciplined syllabus mastery and answer writing, regardless of inherent aptitude.
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground/80 font-light italic">
          <strong className="text-foreground/90 not-italic font-medium">Guidance:</strong> A high suitability score means you would thrive as a public administrator, but students are advised to maintain strong graduate qualifications and parallel career pathways alongside preparation.
        </p>
      </div>

      {/* ── 3. Progressive Disclosure: Official Exam Architecture ──── */}
      <div>
        <button
          type="button"
          onClick={() => setShowExamDetails(!showExamDetails)}
          className="w-full flex items-center justify-between p-4 rounded-xl bg-[#121622] hover:bg-[#161C2A] border border-border/70 text-xs sm:text-sm font-semibold text-foreground transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" />
            <span>Official Examination Structure, Eligibility &amp; Verified Portals</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground text-xs font-mono">
            <span>{showExamDetails ? "Hide details" : "Explore details"}</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${
                showExamDetails ? "rotate-180" : ""
              }`}
            />
          </div>
        </button>

        <AnimatePresence>
          {showExamDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden pt-4 space-y-4"
            >
              {/* Eligibility & Exam Format Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Official Eligibility */}
                <div className="p-4 rounded-xl bg-[#10141E] border border-border/70 space-y-2.5">
                  <h4 className="font-heading text-sm font-bold text-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Official Eligibility Requirements (UPSC)</span>
                  </h4>
                  <ul className="space-y-1.5 text-muted-foreground list-disc list-inside">
                    <li>
                      <strong className="text-foreground">Education:</strong> Bachelor&apos;s degree in any discipline from a recognized university.
                    </li>
                    <li>
                      <strong className="text-foreground">Minimum Age:</strong> 21 years completed as of August 1st of the examination year.
                    </li>
                    <li>
                      <strong className="text-foreground">Upper Age &amp; Attempts:</strong>
                      <span className="block pl-4 text-muted-foreground/80 mt-0.5">
                        • General: 32 years (6 attempts)<br />
                        • OBC: 35 years (9 attempts)<br />
                        • SC / ST: 37 years (unlimited attempts up to age limit)
                      </span>
                    </li>
                  </ul>
                </div>

                {/* 3-Stage Process */}
                <div className="p-4 rounded-xl bg-[#10141E] border border-border/70 space-y-2.5">
                  <h4 className="font-heading text-sm font-bold text-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    <span>Three-Tier Examination Structure</span>
                  </h4>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="p-2 rounded-lg bg-[#0C1018] border border-border/50">
                      <span className="text-foreground font-semibold block">Stage 1: Preliminary Exam (Objective)</span>
                      <span>GS Paper I (200 marks) + CSAT Paper II (200 marks, qualifying at 33%). Filters for Mains.</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#0C1018] border border-border/50">
                      <span className="text-foreground font-semibold block">Stage 2: Main Exam (Written Descriptive)</span>
                      <span>9 papers total (Essay, GS I–IV, 2 Optional subject papers, plus 2 qualifying language papers).</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#0C1018] border border-border/50">
                      <span className="text-foreground font-semibold block">Stage 3: Personality Test / Interview</span>
                      <span>275 marks board assessment evaluating intellectual integrity, balance of judgment, and leadership.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Authoritative Portals */}
              <div className="p-4 rounded-xl bg-[#10141E] border border-border/70">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground block mb-2.5">
                  Verified Official Government &amp; Research Portals
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                  {[
                    {
                      name: "UPSC Official Portal",
                      desc: "Official notification, syllabi, & PYQs",
                      url: "https://upsc.gov.in/",
                    },
                    {
                      name: "NCERT Textbooks Online",
                      desc: "Foundational conceptual curriculum",
                      url: "https://ncert.nic.in/textbook.php",
                    },
                    {
                      name: "Press Information Bureau (PIB)",
                      desc: "Daily official government policy releases",
                      url: "https://pib.gov.in/",
                    },
                    {
                      name: "PRS Legislative Research",
                      desc: "Authoritative bill & policy breakdowns",
                      url: "https://prsindia.org/",
                    },
                  ].map((portal) => (
                    <a
                      key={portal.name}
                      href={portal.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-[#0C1018] border border-border/60 hover:border-primary/50 transition-colors group flex items-start justify-between"
                    >
                      <div>
                        <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors block">
                          {portal.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground block font-light mt-0.5">
                          {portal.desc}
                        </span>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary shrink-0 ml-1.5 mt-0.5" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
