"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Search, X, Sparkles, Layers, Compass } from "lucide-react";
import { getCareerIcon } from "@/lib/career-icons";
import {
  getAllCareerPaths,
  CAREER_DOMAINS,
  type CareerPath,
  type CareerDomain,
} from "@/lib/career-hierarchy";

interface CareersDirectoryFilterProps {
  paths?: CareerPath[];
}

export function CareersDirectoryFilter({
  paths: propPaths,
}: CareersDirectoryFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");

  const allPaths: CareerPath[] = useMemo(() => {
    if (propPaths && propPaths.length > 0) return propPaths;
    return getAllCareerPaths();
  }, [propPaths]);

  const filteredPaths = useMemo(() => {
    return allPaths.filter((path) => {
      const matchesDomain =
        selectedDomain === "all" || path.domainId === selectedDomain;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesDomain;

      const allRoles = path.specializations.flatMap((s) =>
        s.roles.map((r) => r.title.toLowerCase())
      );
      const allSpecs = path.specializations.map((s) => s.name.toLowerCase());

      const matchesSearch =
        path.name.toLowerCase().includes(q) ||
        path.title.toLowerCase().includes(q) ||
        path.domainName.toLowerCase().includes(q) ||
        path.tagline.toLowerCase().includes(q) ||
        path.careerName.toLowerCase().includes(q) ||
        allSpecs.some((s) => s.includes(q)) ||
        allRoles.some((r) => r.includes(q));

      return matchesDomain && matchesSearch;
    });
  }, [allPaths, searchQuery, selectedDomain]);

  const isBrowsingAllWithoutSearch =
    selectedDomain === "all" && searchQuery.trim() === "";

  return (
    <div className="space-y-8 select-none">
      {/* ── Search & Filter Toolbar ─────────────────────────────────── */}
      <div className="flex flex-col gap-4 p-4 rounded-2xl bg-[#0D1117] border border-border/80 shadow-md">
        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What are you interested in? Search paths, specializations, or roles..."
            className="w-full bg-[#12161F] border border-border rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded cursor-pointer"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedDomain("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 cursor-pointer ${
              selectedDomain === "all"
                ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                : "bg-[#12161F] text-muted-foreground hover:text-foreground border border-border/60 hover:bg-[#161B24]"
            }`}
          >
            All Paths ({allPaths.length})
          </button>

          {CAREER_DOMAINS.map((domain) => {
            const isSelected = selectedDomain === domain.id;
            return (
              <button
                key={domain.id}
                onClick={() => setSelectedDomain(domain.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "bg-[#12161F] text-muted-foreground hover:text-foreground border border-border/60 hover:bg-[#161B24]"
                }`}
              >
                <span>{domain.name.split(" ")[0]}</span>
                <span className="opacity-60 ml-1">({domain.paths.length})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Status Header Bar ───────────────────────────────────────── */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
          {selectedDomain === "all"
            ? "Full Career Directory"
            : CAREER_DOMAINS.find((d) => d.id === selectedDomain)?.name}
        </span>
        <span className="text-xs font-mono text-muted-foreground/80">
          {isBrowsingAllWithoutSearch
            ? `${allPaths.length} career paths`
            : `Showing ${filteredPaths.length} of ${allPaths.length} career paths`}
        </span>
      </div>

      {/* ── Results Container ───────────────────────────────────────── */}
      {filteredPaths.length === 0 ? (
        /* Empty State */
        <div className="py-16 text-center rounded-2xl border border-border/70 bg-[#0D1117] p-8 max-w-lg mx-auto">
          <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-4">
            <Search className="h-5 w-5" />
          </div>
          <h3 className="font-heading text-base font-bold text-foreground mb-1">
            No career paths found.
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-6 leading-relaxed">
            Try another search or explore all career paths.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedDomain("all");
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover transition-colors cursor-pointer"
          >
            <span>Explore all career paths</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : isBrowsingAllWithoutSearch ? (
        /* Grouped by Domain for clear scanning without visual overload */
        <div className="space-y-12">
          {CAREER_DOMAINS.map((domain) => (
            <section key={domain.id} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-2 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <h2 className="font-heading text-lg font-bold text-foreground">
                    {domain.name}
                  </h2>
                </div>
                <p className="text-xs text-muted-foreground font-light max-w-xl">
                  {domain.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {domain.paths.map((path) => (
                  <CareerPathCard key={path.id} path={path} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        /* Flat Grid for Filtered / Search Results */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPaths.map((path) => (
            <CareerPathCard key={path.id} path={path} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Cinematic Career Path Card Component
 * Strictly conveys: Career Path, Domain, 1-line description, Specialization & Role count, Explore path CTA.
 */
function CareerPathCard({ path }: { path: CareerPath }) {
  const IconComponent = getCareerIcon(path.careerName);
  const totalRoles = path.specializations.reduce(
    (acc, s) => acc + s.roles.length,
    0
  );

  return (
    <Link
      href={`/career/${path.slug}`}
      className="group flex flex-col justify-between p-5 rounded-2xl bg-[#0D1117] border border-border/80 hover:border-primary/50 hover:bg-[#121622] transition-all duration-200 shadow-xs hover:shadow-md hover:shadow-cyan-950/20"
    >
      <div>
        {/* Top: Icon + Domain Tag */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 group-hover:bg-primary/15 transition-all shrink-0">
            <IconComponent className="h-5 w-5" />
          </div>
          <span className="text-xs font-mono text-muted-foreground bg-[#141920] border border-border/50 rounded-full px-2.5 py-0.5 shrink-0">
            {path.domainName}
          </span>
        </div>

        {/* Path Name */}
        <h3 className="font-heading text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug break-words">
          {path.name}
        </h3>

        {/* 1-Line Description */}
        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed font-light">
          {path.tagline}
        </p>
      </div>

      {/* Footer: Specialization/Role metrics + Explore action */}
      <div className="mt-5 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
        <span className="text-[11px] font-mono text-muted-foreground/80">
          {path.specializations.length} specializations · {totalRoles} roles
        </span>
        <span className="inline-flex items-center gap-1 font-semibold text-primary group-hover:translate-x-1 transition-transform">
          <span>Explore path</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
