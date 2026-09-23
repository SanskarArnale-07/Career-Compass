"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

interface CareerNode {
  id: string;
  label: string;
  match?: string;
  isPrimaryMatch?: boolean;
  specializations: {
    name: string;
    roles: string[];
  }[];
}

interface DomainMap {
  id: string;
  domainName: string;
  overallMatch: string;
  paths: CareerNode[];
}

const CAREER_TAXONOMY: DomainMap[] = [
  {
    id: "engineering",
    domainName: "ENGINEERING",
    overallMatch: "92%",
    paths: [
      {
        id: "software",
        label: "Software Engineering",
        match: "92%",
        isPrimaryMatch: true,
        specializations: [
          {
            name: "Backend Systems",
            roles: ["Distributed Systems Engineer", "API Architect"],
          },
          {
            name: "Full Stack",
            roles: ["Application Engineer", "Product Engineer"],
          },
          {
            name: "Frontend Platforms",
            roles: ["Design Systems Engineer", "Web Performance Lead"],
          },
        ],
      },
      {
        id: "data-eng",
        label: "Data & Systems",
        match: "85%",
        specializations: [
          {
            name: "Pipelines & ETL",
            roles: ["Data Infrastructure Engineer", "Stream Processing Dev"],
          },
          {
            name: "Cloud Platforms",
            roles: ["Site Reliability Engineer", "Cloud Architect"],
          },
        ],
      },
      {
        id: "embedded",
        label: "Hardware & Robotics",
        match: "78%",
        specializations: [
          {
            name: "Firmware Systems",
            roles: ["IoT Systems Engineer", "Robotics Controller Dev"],
          },
        ],
      },
    ],
  },
  {
    id: "data-ai",
    domainName: "DATA & INTELLIGENCE",
    overallMatch: "87%",
    paths: [
      {
        id: "data-analytics",
        label: "Data Analytics",
        match: "87%",
        isPrimaryMatch: true,
        specializations: [
          {
            name: "Decision Intelligence",
            roles: ["Product Analytics Lead", "Growth Data Scientist"],
          },
          {
            name: "Business Intelligence",
            roles: ["BI Solutions Architect", "Quantitative Strategist"],
          },
        ],
      },
      {
        id: "machine-learning",
        label: "Machine Learning / AI",
        match: "86%",
        specializations: [
          {
            name: "Deep Learning",
            roles: ["AI Model Engineer", "NLP Research Engineer"],
          },
          {
            name: "MLOps",
            roles: ["Inference Infrastructure Dev", "ML Platform Engineer"],
          },
        ],
      },
    ],
  },
  {
    id: "design",
    domainName: "DESIGN & CREATIVE",
    overallMatch: "81%",
    paths: [
      {
        id: "ux-product",
        label: "UX / Product Design",
        match: "81%",
        isPrimaryMatch: true,
        specializations: [
          {
            name: "Product Experience",
            roles: ["Lead Product Designer", "Interaction Specialist"],
          },
          {
            name: "User Research",
            roles: ["Cognitive Ergonomics Researcher", "Usability Architect"],
          },
        ],
      },
      {
        id: "visual-brand",
        label: "Design Systems",
        match: "77%",
        specializations: [
          {
            name: "Design Systems",
            roles: ["Design Technologist", "Brand Experience Designer"],
          },
        ],
      },
    ],
  },
];

export function Section03CareerMap() {
  const [activeDomainId, setActiveDomainId] = useState<string>("engineering");
  const [activePathId, setActivePathId] = useState<string>("software");

  const currentDomain =
    CAREER_TAXONOMY.find((d) => d.id === activeDomainId) || CAREER_TAXONOMY[0];
  const currentPath =
    currentDomain.paths.find((p) => p.id === activePathId) ||
    currentDomain.paths[0];

  const handleSelectDomain = (domain: DomainMap) => {
    setActiveDomainId(domain.id);
    setActivePathId(domain.paths[0].id);
  };

  return (
    <section className="py-20 md:py-28 w-full border-t border-border/40 relative">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* ── Section Header ───────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="font-mono text-7xl sm:text-8xl md:text-9xl font-light text-muted-foreground/20 leading-none select-none tracking-tighter mb-4 block">
              03
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-3">
              Your Career Map
            </h2>
            <p className="text-base sm:text-lg text-secondary-foreground max-w-xl font-light leading-relaxed">
              Careers are not flat lists. They exist as structural hierarchies that guide your decisions from broad domain to specialized execution.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
              Taxonomy Hierarchy
            </span>
            <div className="flex items-center gap-1.5 text-xs font-mono text-primary font-semibold bg-[#161412] px-3 py-1.5 rounded border border-primary/20">
              <span>DOMAIN</span>
              <span className="text-muted-foreground">→</span>
              <span>PATH</span>
              <span className="text-muted-foreground">→</span>
              <span>SPECIALIZATION</span>
              <span className="text-muted-foreground">→</span>
              <span>ROLE</span>
            </div>
          </div>
        </div>

        {/* ── Domain Selector Tabs (Masthead instrument tabs) ────────── */}
        <div className="flex flex-wrap gap-2.5 mb-10 pb-2 border-b border-border/50">
          {CAREER_TAXONOMY.map((domain) => {
            const isSelected = domain.id === activeDomainId;
            return (
              <button
                key={domain.id}
                onClick={() => handleSelectDomain(domain)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#1C1814] border border-primary/50 text-foreground font-semibold shadow-sm"
                    : "bg-[#141210]/60 border border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                <span>{domain.domainName}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-[#1A1612] text-primary/80 border border-border/80"
                  }`}
                >
                  {domain.overallMatch}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Branching Tree Visualization Canvas ────────────────────── */}
        <div className="rounded-2xl bg-[#12100E] border border-border/70 p-6 sm:p-10 shadow-xl relative overflow-hidden">
          
          {/* Subtle grid background */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(to_right,#C8922A_1px,transparent_1px),linear-gradient(to_bottom,#C8922A_1px,transparent_1px)] bg-[size:32px_32px]" />

          {/* LEVEL 1: CAREER DOMAIN ROOT */}
          <div className="flex flex-col items-center relative z-10 mb-8">
            <div className="px-5 py-2 rounded-xl bg-[#181512] border-2 border-primary/50 text-center shadow-lg shadow-amber-950/20">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground block mb-0.5">
                Career Domain
              </span>
              <span className="font-heading text-base sm:text-lg font-bold text-foreground">
                {currentDomain.domainName}
              </span>
            </div>

            {/* Connecting Vertical Trunk Line */}
            <div className="w-px h-8 bg-primary/40 my-1" />

            {/* Horizontal Branching Bar spanning child paths */}
            <div className="w-3/4 max-w-2xl h-px bg-border/80 relative">
              <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
            </div>
          </div>

          {/* LEVEL 2: CAREER PATHS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 mb-12">
            {currentDomain.paths.map((path) => {
              const isSelected = path.id === activePathId;

              return (
                <div key={path.id} className="flex flex-col items-center">
                  {/* Vertical branch drop line */}
                  <div
                    className={`w-px h-6 mb-1 ${
                      isSelected ? "bg-primary" : "bg-border/60"
                    }`}
                  />

                  {/* Path Node Card */}
                  <button
                    onClick={() => setActivePathId(path.id)}
                    className={`w-full p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? "bg-[#1C1814] border-primary text-foreground shadow-md shadow-amber-950/30 scale-[1.02]"
                        : "bg-[#161412]/80 border-border/70 text-muted-foreground hover:border-border hover:bg-[#161412]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/80">
                        Career Path
                      </span>
                      {path.match && (
                        <span
                          className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-primary/10 text-primary border border-primary/20"
                          }`}
                        >
                          {path.match}
                        </span>
                      )}
                    </div>
                    <p
                      className={`font-heading text-sm sm:text-base font-bold ${
                        isSelected ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {path.label}
                    </p>
                  </button>
                </div>
              );
            })}
          </div>

          {/* LEVEL 3 & 4: SPECIALIZATIONS & OPERATIONAL ROLES */}
          <div className="relative z-10 border-t border-border/60 pt-8 bg-[#151311]/60 rounded-xl p-5 sm:p-7 border border-border/50">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-primary font-semibold">
                  Branch Deep-Dive
                </span>
                <h4 className="font-heading text-lg font-bold text-foreground">
                  Specializations &amp; High-Impact Roles in {currentPath.label}
                </h4>
              </div>
              <Link
                href="/careers"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>View All 12 Domains</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {currentPath.specializations.map((spec, sIdx) => (
                <div
                  key={sIdx}
                  className="p-4 rounded-lg bg-[#141210] border border-border/70 flex flex-col justify-between"
                >
                  <div className="mb-3">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-1">
                      Specialization 0{sIdx + 1}
                    </span>
                    <h5 className="font-heading text-sm font-bold text-foreground">
                      {spec.name}
                    </h5>
                  </div>

                  <div className="space-y-1.5 border-t border-border/40 pt-2.5">
                    <span className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground/60 block">
                      Typical Roles
                    </span>
                    {spec.roles.map((role, rIdx) => (
                      <div
                        key={rIdx}
                        className="flex items-center gap-1.5 text-xs text-secondary-foreground"
                      >
                        <span className="w-1 h-1 rounded-full bg-primary/80" />
                        <span>{role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
