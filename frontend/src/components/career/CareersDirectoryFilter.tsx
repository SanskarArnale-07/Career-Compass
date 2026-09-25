"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Search, X, Layers, Briefcase, User } from "lucide-react";
import { getCareerIcon } from "@/lib/career-icons";
import {
  getAllCareerPaths,
  CAREER_DOMAINS,
  searchCareerCatalog,
  searchCareerCatalogGrouped,
  type CareerPath,
  type CareerSpecialization,
  type CareerRole,
  type CareerSearchResult,
  type CareerSearchResultGroup,
} from "@/lib/career-hierarchy";

interface CareersDirectoryFilterProps {
  paths?: CareerPath[];
}

export function CareersDirectoryFilter({
  paths: propPaths,
}: CareersDirectoryFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");

  // 150ms debounce for smooth, responsive typing across desktop and mobile
  useEffect(() => {
    const delay = searchQuery.trim() ? 150 : 0;
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, delay);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const allPaths: CareerPath[] = useMemo(() => {
    if (propPaths && propPaths.length > 0) return propPaths;
    return getAllCareerPaths();
  }, [propPaths]);

  // Flat results (used for empty-search domain filtering and result count)
  const flatResults: CareerSearchResult[] = useMemo(() => {
    return searchCareerCatalog(debouncedQuery, {
      domainId: selectedDomain,
    });
  }, [debouncedQuery, selectedDomain]);

  // Grouped results for search rendering
  const groupedResults: CareerSearchResultGroup[] = useMemo(() => {
    if (!debouncedQuery) return [];
    return searchCareerCatalogGrouped(debouncedQuery, {
      domainId: selectedDomain,
      maxPerGroup: 8,
      maxTotal: 20,
    });
  }, [debouncedQuery, selectedDomain]);

  const isBrowsingAllWithoutSearch =
    selectedDomain === "all" && debouncedQuery === "";

  const hasSearchResults = debouncedQuery && flatResults.length > 0;
  const hasNoResults = debouncedQuery && flatResults.length === 0;

  return (
    <div className="space-y-8 select-none">
      {/* ── Prominent Global Search Bar & Exploration Guidance ────── */}
      <div className="space-y-3">
        <div className="relative w-full">
          <div className="relative flex items-center">
            <Search className="absolute left-4.5 h-5 w-5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search careers, roles, or areas..."
              className="w-full bg-[#0D1117] border border-border/80 hover:border-primary/50 focus:border-primary/70 rounded-2xl pl-12 pr-11 py-3.5 sm:py-4 text-sm sm:text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-md transition-all"
              aria-label="Search careers, roles, or areas"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-[#161B24] cursor-pointer transition-colors"
                title="Clear search"
                aria-label="Clear search query"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Communicative Helper & Quick Example Chips */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 px-1 text-xs text-muted-foreground">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-muted-foreground/75 font-light">Try searching:</span>
              {(
                [
                  "Data Scientist",
                  "Frontend Developer",
                  "Artificial Intelligence",
                  "Cybersecurity",
                  "Mobile",
                ] as const
              ).map((example) => (
                <button
                  key={example}
                  type="button"
                  onClick={() => setSearchQuery(example)}
                  className="px-2.5 py-0.5 rounded-full bg-[#121620] hover:bg-[#18202C] hover:text-primary hover:border-primary/40 border border-border/60 transition-all cursor-pointer text-[11px] font-mono text-muted-foreground/90"
                >
                  {example}
                </button>
              ))}
            </div>
            <span className="text-[11px] font-mono text-muted-foreground/60">
              Specific role · Career area · Specialization
            </span>
          </div>
        </div>

        {/* Domain Filter Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
          <button
            type="button"
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
                type="button"
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
          {debouncedQuery
            ? `Search: "${debouncedQuery}"`
            : selectedDomain === "all"
              ? "Full Career Directory"
              : CAREER_DOMAINS.find((d) => d.id === selectedDomain)?.name}
        </span>
        <span className="text-xs font-mono text-muted-foreground/80">
          {isBrowsingAllWithoutSearch
            ? `${allPaths.length} career paths`
            : hasSearchResults
              ? `${flatResults.length} result${flatResults.length === 1 ? "" : "s"}`
              : debouncedQuery
                ? "No results"
                : `${flatResults.length} of ${allPaths.length} career paths`}
        </span>
      </div>

      {/* ── Results Container ───────────────────────────────────────── */}
      {hasNoResults ? (
        /* Empty State */
        <div className="py-16 text-center rounded-2xl border border-border/70 bg-[#0D1117] p-8 max-w-lg mx-auto">
          <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto mb-4">
            <Search className="h-5 w-5" />
          </div>
          <h3 className="font-heading text-base font-bold text-foreground mb-1">
            {`No careers found matching "${debouncedQuery}"`}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-6 leading-relaxed">
            Try searching for a different role (e.g. &ldquo;Data Scientist&rdquo;, &ldquo;Frontend Developer&rdquo;), a career discipline (&ldquo;Cybersecurity&rdquo;), or a specialization.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedDomain("all");
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary-hover transition-colors cursor-pointer"
          >
            <span>Clear search &amp; view all paths</span>
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
      ) : hasSearchResults ? (
        /* Grouped Search Results: Career Paths / Specializations / Roles */
        <div className="space-y-10">
          {groupedResults.map((group) => (
            <SearchResultGroup key={group.label} group={group} />
          ))}
        </div>
      ) : (
        /* Domain-filtered browsing without a search query */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {flatResults.map((result) => (
            <CareerPathCard
              key={result.path.id}
              path={result.path}
              matchedRoles={result.matchedRoles}
              matchedSpecializations={result.matchedSpecializations}
              matchedAlias={result.matchedAlias}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Search Result Group Section ────────────────────────────────────────────

const GROUP_META: Record<
  CareerSearchResultGroup["label"],
  { icon: React.ComponentType<{ className?: string }>; description: string }
> = {
  "Career Paths": {
    icon: Layers,
    description: "Matched career directions",
  },
  Specializations: {
    icon: Briefcase,
    description: "Matched areas of focus",
  },
  Roles: {
    icon: User,
    description: "Matched job roles",
  },
};

function SearchResultGroup({ group }: { group: CareerSearchResultGroup }) {
  const meta = GROUP_META[group.label];
  const Icon = meta.icon;

  return (
    <section className="space-y-3">
      {/* Group header */}
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        <div className="h-6 w-6 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
          <Icon className="h-3.5 w-3.5" />
        </div>
        <span className="font-heading text-sm font-bold text-foreground">
          {group.label}
        </span>
        <span className="text-xs font-mono text-muted-foreground/60 ml-1">
          {meta.description}
        </span>
        <span className="ml-auto text-xs font-mono text-muted-foreground/50">
          {group.results.length}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {group.results.map((result) => {
          if (result.entityType === "path") {
            return (
              <CareerPathCard
                key={result.path.id}
                path={result.path}
                matchedRoles={result.matchedRoles}
                matchedSpecializations={result.matchedSpecializations}
                matchedAlias={result.matchedAlias}
              />
            );
          }
          if (result.entityType === "specialization" && result.specialization) {
            return (
              <SpecializationCard
                key={`${result.path.slug}:${result.specialization.id}`}
                path={result.path}
                spec={result.specialization}
                matchedRoles={result.matchedRoles}
                matchedAlias={result.matchedAlias}
              />
            );
          }
          if (result.entityType === "role" && result.role && result.specialization) {
            return (
              <RoleCard
                key={`${result.path.slug}:${result.specialization.id}:${result.role.id}`}
                path={result.path}
                spec={result.specialization}
                role={result.role}
                matchedAlias={result.matchedAlias}
              />
            );
          }
          return null;
        })}
      </div>
    </section>
  );
}

// ─── Career Path Card ────────────────────────────────────────────────────────

/**
 * Cinematic Career Path Card Component
 * Highlights matched roles/specializations when search is active.
 */
function CareerPathCard({
  path,
  matchedRoles = [],
  matchedSpecializations = [],
  matchedAlias,
}: {
  path: CareerPath;
  matchedRoles?: string[];
  matchedSpecializations?: string[];
  matchedAlias?: string;
}) {
  const totalRoles = path.specializations.reduce(
    (acc, s) => acc + s.roles.length,
    0
  );

  const hasMatches =
    Boolean(matchedAlias) ||
    matchedRoles.length > 0 ||
    matchedSpecializations.length > 0;

  return (
    <Link
      href={`/career/${path.slug}`}
      className="group flex flex-col justify-between p-5 rounded-2xl bg-[#0D1117] border border-border/80 hover:border-primary/50 hover:bg-[#121622] transition-all duration-200 shadow-xs hover:shadow-md hover:shadow-cyan-950/20"
    >
      <div>
        {/* Top: Icon + Domain Tag */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 group-hover:bg-primary/15 transition-all shrink-0">
            {React.createElement(getCareerIcon(path.careerName), { className: "h-5 w-5" })}
          </div>
          <span className="text-xs font-mono text-muted-foreground bg-[#141920] border border-border/50 rounded-full px-2.5 py-0.5 shrink-0">
            {path.domainName}
          </span>
        </div>

        {/* Path Name */}
        <h3 className="font-heading text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug wrap-break-word">
          {path.name}
        </h3>

        {/* 1-Line Description */}
        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed font-light">
          {path.tagline}
        </p>

        {/* Contextual Match Badge */}
        {hasMatches && (
          <div className="mt-3 pt-2.5 border-t border-border/40 text-[11px] font-mono flex items-center gap-1.5 flex-wrap">
            <span className="text-muted-foreground/80">Matches:</span>
            {matchedAlias && (
              <span className="px-2 py-0.5 rounded bg-primary/15 border border-primary/30 text-primary font-semibold">
                {matchedAlias}
              </span>
            )}
            {matchedRoles.slice(0, 2).map((role) => (
              <span
                key={role}
                className="px-2 py-0.5 rounded bg-primary/15 border border-primary/30 text-primary font-semibold truncate max-w-[170px]"
              >
                {role}
              </span>
            ))}
            {matchedRoles.length === 0 &&
              !matchedAlias &&
              matchedSpecializations.slice(0, 1).map((spec) => (
                <span
                  key={spec}
                  className="px-2 py-0.5 rounded bg-primary/15 border border-primary/30 text-primary font-semibold truncate max-w-[170px]"
                >
                  {spec}
                </span>
              ))}
            {matchedRoles.length > 2 && (
              <span className="text-muted-foreground/70">
                +{matchedRoles.length - 2} more
              </span>
            )}
          </div>
        )}
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

// ─── Specialization Card ─────────────────────────────────────────────────────

function SpecializationCard({
  path,
  spec,
  matchedRoles = [],
  matchedAlias,
}: {
  path: CareerPath;
  spec: CareerSpecialization;
  matchedRoles?: string[];
  matchedAlias?: string;
}) {
  return (
    <Link
      href={`/career/${path.slug}`}
      className="group flex flex-col justify-between p-5 rounded-2xl bg-[#0D1117] border border-border/80 hover:border-primary/50 hover:bg-[#121622] transition-all duration-200 shadow-xs hover:shadow-md hover:shadow-cyan-950/20"
    >
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 group-hover:bg-primary/15 transition-all shrink-0">
            <Briefcase className="h-5 w-5" />
          </div>
          <span className="text-xs font-mono text-muted-foreground bg-[#141920] border border-border/50 rounded-full px-2.5 py-0.5 shrink-0 truncate max-w-[140px]">
            {path.name}
          </span>
        </div>

        <h3 className="font-heading text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
          {spec.name}
        </h3>
        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed font-light">
          {spec.description}
        </p>

        {(matchedRoles.length > 0 || matchedAlias) && (
          <div className="mt-3 pt-2.5 border-t border-border/40 text-[11px] font-mono flex items-center gap-1.5 flex-wrap">
            <span className="text-muted-foreground/80">Matches:</span>
            {matchedAlias && (
              <span className="px-2 py-0.5 rounded bg-primary/15 border border-primary/30 text-primary font-semibold">
                {matchedAlias}
              </span>
            )}
            {matchedRoles.slice(0, 2).map((role) => (
              <span
                key={role}
                className="px-2 py-0.5 rounded bg-primary/15 border border-primary/30 text-primary font-semibold truncate max-w-[170px]"
              >
                {role}
              </span>
            ))}
            {matchedRoles.length > 2 && (
              <span className="text-muted-foreground/70">
                +{matchedRoles.length - 2} more
              </span>
            )}
          </div>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
        <span className="text-[11px] font-mono text-muted-foreground/80">
          {spec.roles.length} roles in this area
        </span>
        <span className="inline-flex items-center gap-1 font-semibold text-primary group-hover:translate-x-1 transition-transform">
          <span>View path</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}

// ─── Role Card ───────────────────────────────────────────────────────────────

function RoleCard({
  path,
  spec,
  role,
  matchedAlias,
}: {
  path: CareerPath;
  spec: CareerSpecialization;
  role: CareerRole;
  matchedAlias?: string;
}) {
  return (
    <Link
      href={`/career/${path.slug}`}
      className="group flex flex-col justify-between p-5 rounded-2xl bg-[#0D1117] border border-border/80 hover:border-primary/50 hover:bg-[#121622] transition-all duration-200 shadow-xs hover:shadow-md hover:shadow-cyan-950/20"
    >
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 group-hover:bg-primary/15 transition-all shrink-0">
            <User className="h-5 w-5" />
          </div>
          <div className="flex flex-col items-end gap-0.5 min-w-0">
            <span className="text-xs font-mono text-muted-foreground bg-[#141920] border border-border/50 rounded-full px-2.5 py-0.5 truncate max-w-[130px]">
              {path.name}
            </span>
          </div>
        </div>

        <h3 className="font-heading text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
          {role.title}
        </h3>
        <p className="text-[11px] font-mono text-muted-foreground/70 mt-0.5">
          {spec.name}
        </p>
        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed font-light">
          {role.description}
        </p>

        {matchedAlias && (
          <div className="mt-3 pt-2.5 border-t border-border/40 text-[11px] font-mono flex items-center gap-1.5">
            <span className="text-muted-foreground/80">Matches:</span>
            <span className="px-2 py-0.5 rounded bg-primary/15 border border-primary/30 text-primary font-semibold">
              {matchedAlias}
            </span>
          </div>
        )}
      </div>

      <div className="mt-5 pt-3 border-t border-border/50 flex items-center justify-between text-xs">
        {role.isEntryLevel !== undefined && (
          <span className="text-[11px] font-mono text-muted-foreground/80">
            {role.isEntryLevel ? "Entry level" : "Mid / Senior"}
          </span>
        )}
        <span className="inline-flex items-center gap-1 font-semibold text-primary group-hover:translate-x-1 transition-transform ml-auto">
          <span>Explore path</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
