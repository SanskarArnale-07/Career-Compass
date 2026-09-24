"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ArrowRight,
  Layers,
  GitBranch,
  Circle,
  Sparkles,
  Compass,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import {
  CAREER_DOMAINS,
  type CareerDomain,
  type CareerPath,
  type CareerSpecialization,
  type CareerRole,
} from "@/lib/career-hierarchy";

// ── Types ─────────────────────────────────────────────────────────────
export interface CareerTreeProps {
  /** If set, highlight this path slug as "matched" */
  highlightedPathSlug?: string;
  /** If set, show a match % badge next to the highlighted path */
  highlightedMatchPct?: number;
  /** Start with this domain pre-selected (id) */
  defaultDomainId?: string;
  /** Start with this path pre-selected (slug) */
  defaultPathSlug?: string;
  /** Start with this specialization pre-selected (id) */
  defaultSpecId?: string;
  /** Controls layout complexity */
  mode?: "full" | "compact";
  /** Show connecting lines */
  showLines?: boolean;
}

// ── Color System (Cool Electric Cyan & Blue Palette) ─────────────────
const DOMAIN_THEMES: Record<
  string,
  { accent: string; glow: string; border: string; bg: string }
> = {
  "engineering-technology": {
    accent: "#00E5FF",
    glow: "rgba(0, 229, 255, 0.35)",
    border: "rgba(0, 229, 255, 0.4)",
    bg: "rgba(0, 229, 255, 0.08)",
  },
  "data-ai": {
    accent: "#38BDF8",
    glow: "rgba(56, 189, 248, 0.35)",
    border: "rgba(56, 189, 248, 0.4)",
    bg: "rgba(56, 189, 248, 0.08)",
  },
  "design-creative": {
    accent: "#818CF8",
    glow: "rgba(129, 140, 248, 0.35)",
    border: "rgba(129, 140, 248, 0.4)",
    bg: "rgba(129, 140, 248, 0.08)",
  },
  "business-finance-management": {
    accent: "#60A5FA",
    glow: "rgba(96, 165, 250, 0.35)",
    border: "rgba(96, 165, 250, 0.4)",
    bg: "rgba(96, 165, 250, 0.08)",
  },
  "healthcare-sciences": {
    accent: "#2DD4BF",
    glow: "rgba(45, 212, 191, 0.35)",
    border: "rgba(45, 212, 191, 0.4)",
    bg: "rgba(45, 212, 191, 0.08)",
  },
  "media-communications-social": {
    accent: "#A78BFA",
    glow: "rgba(167, 139, 250, 0.35)",
    border: "rgba(167, 139, 250, 0.4)",
    bg: "rgba(167, 139, 250, 0.08)",
  },
};

function getDomainTheme(id: string) {
  return (
    DOMAIN_THEMES[id] ?? {
      accent: "#00E5FF",
      glow: "rgba(0, 229, 255, 0.35)",
      border: "rgba(0, 229, 255, 0.4)",
      bg: "rgba(0, 229, 255, 0.08)",
    }
  );
}

export function CareerTreeExplorer({
  highlightedPathSlug,
  highlightedMatchPct,
  defaultDomainId,
  defaultPathSlug,
  defaultSpecId,
  mode = "full",
  showLines = true,
}: CareerTreeProps) {
  const router = useRouter();

  // Initial domain selection logic
  const determineInitialDomain = () => {
    if (defaultDomainId) {
      const found = CAREER_DOMAINS.find((d) => d.id === defaultDomainId);
      if (found) return found;
    }
    const targetSlug = defaultPathSlug || highlightedPathSlug;
    if (targetSlug) {
      const found = CAREER_DOMAINS.find((d) =>
        d.paths.some((p) => p.slug === targetSlug)
      );
      if (found) return found;
    }
    return CAREER_DOMAINS[0];
  };

  const initialDomain = determineInitialDomain();
  const [selectedDomainId, setSelectedDomainId] = useState<string>(
    initialDomain.id
  );

  const initialPath =
    initialDomain.paths.find(
      (p) => p.slug === (defaultPathSlug || highlightedPathSlug)
    ) ?? initialDomain.paths[0];

  const [selectedPathSlug, setSelectedPathSlug] = useState<string | null>(
    initialPath?.slug ?? null
  );

  const initialSpec =
    initialPath?.specializations.find((s) => s.id === defaultSpecId) ??
    initialPath?.specializations[0];

  const [selectedSpecId, setSelectedSpecId] = useState<string | null>(
    initialSpec?.id ?? null
  );

  // Sync when default props change (e.g. via URL query parameter update)
  useEffect(() => {
    if (defaultDomainId) {
      const d = CAREER_DOMAINS.find((dom) => dom.id === defaultDomainId);
      if (d) {
        setSelectedDomainId(d.id);
        const p = defaultPathSlug
          ? d.paths.find((item) => item.slug === defaultPathSlug) ?? d.paths[0]
          : d.paths[0];
        setSelectedPathSlug(p?.slug ?? null);
        if (p) {
          const s = defaultSpecId
            ? p.specializations.find((spec) => spec.id === defaultSpecId) ??
              p.specializations[0]
            : p.specializations[0];
          setSelectedSpecId(s?.id ?? null);
        }
      }
    } else if (defaultPathSlug || highlightedPathSlug) {
      const targetSlug = defaultPathSlug || highlightedPathSlug;
      const d = CAREER_DOMAINS.find((dom) =>
        dom.paths.some((p) => p.slug === targetSlug)
      );
      if (d) {
        setSelectedDomainId(d.id);
        setSelectedPathSlug(targetSlug!);
        const p = d.paths.find((item) => item.slug === targetSlug);
        if (p) {
          const s = defaultSpecId
            ? p.specializations.find((spec) => spec.id === defaultSpecId) ??
              p.specializations[0]
            : p.specializations[0];
          setSelectedSpecId(s?.id ?? null);
        }
      }
    }
  }, [defaultDomainId, defaultPathSlug, defaultSpecId, highlightedPathSlug]);

  const activeDomain = CAREER_DOMAINS.find((d) => d.id === selectedDomainId);
  const activePath = activeDomain?.paths.find((p) => p.slug === selectedPathSlug);
  const activeSpec = activePath?.specializations.find(
    (s) => s.id === selectedSpecId
  );
  const theme = getDomainTheme(selectedDomainId);

  // Handlers for progressive disclosure
  const handleDomainClick = (domain: CareerDomain) => {
    if (domain.id === selectedDomainId) return;
    setSelectedDomainId(domain.id);
    const firstPath = domain.paths[0];
    setSelectedPathSlug(firstPath?.slug ?? null);
    setSelectedSpecId(firstPath?.specializations[0]?.id ?? null);
  };

  const handlePathClick = (path: CareerPath) => {
    setSelectedPathSlug(path.slug);
    setSelectedSpecId(path.specializations[0]?.id ?? null);
  };

  const handleSpecClick = (spec: CareerSpecialization) => {
    setSelectedSpecId(spec.id);
  };

  const handleRoleClick = (role: CareerRole) => {
    if (activePath) {
      router.push(`/career/${activePath.slug}`);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* ── Active Trail Breadcrumb ─────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#12100E] border border-border/70 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-1.5 text-muted-foreground">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 mr-1 flex items-center gap-1">
            <Compass className="h-3 w-3 text-primary" />
            Branch:
          </span>
          {activeDomain && (
            <button
              onClick={() => {
                setSelectedPathSlug(null);
                setSelectedSpecId(null);
              }}
              className="text-foreground hover:text-primary transition-colors cursor-pointer flex items-center gap-1 font-semibold"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: theme.accent }}
              />
              {activeDomain.name}
            </button>
          )}

          {activePath && (
            <>
              <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
              <button
                onClick={() => setSelectedSpecId(null)}
                className="text-foreground hover:text-primary transition-colors cursor-pointer font-medium"
              >
                {activePath.name}
              </button>
            </>
          )}

          {activeSpec && (
            <>
              <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
              <span className="text-primary font-medium">{activeSpec.name}</span>
            </>
          )}
        </div>

        {activePath && (
          <Link
            href={`/career/${activePath.slug}`}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline ml-auto"
          >
            <span>View Roadmap</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* DESKTOP VIEW: Broad Horizontal Branching Composition             */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="hidden md:block">
        <div className="rounded-2xl border border-border/70 bg-[#0E0E0E] p-6 lg:p-8 relative overflow-hidden shadow-2xl">
          {/* Subtle background glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px] pointer-events-none opacity-20 transition-all duration-700"
            style={{ background: theme.accent }}
          />

          {/* ── LEVEL 1: CAREER DOMAINS (Root Horizontal Row) ────────── */}
          <div className="relative z-10">
            <div className="text-center mb-3">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground/60">
                Level 1 · Career Domains
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-6 gap-2.5">
              {CAREER_DOMAINS.map((domain) => {
                const isSelected = domain.id === selectedDomainId;
                const dTheme = getDomainTheme(domain.id);
                const hasMatchChild = domain.paths.some(
                  (p) => p.slug === highlightedPathSlug
                );

                return (
                  <button
                    key={domain.id}
                    onClick={() => handleDomainClick(domain)}
                    className={`group relative flex flex-col items-center text-center p-3 rounded-xl border transition-all duration-300 cursor-pointer focus:outline-none ${
                      isSelected
                        ? "scale-[1.02] shadow-lg"
                        : "hover:scale-[1.01] hover:border-border/90"
                    }`}
                    style={{
                      borderColor: isSelected
                        ? dTheme.accent
                        : hasMatchChild
                        ? `${dTheme.accent}50`
                        : "rgba(255, 255, 255, 0.08)",
                      background: isSelected
                        ? dTheme.bg
                        : "rgba(16, 20, 26, 0.6)",
                      boxShadow: isSelected
                        ? `0 0 20px ${dTheme.glow}`
                        : "none",
                    }}
                  >
                    {/* Glowing active node dot */}
                    <div
                      className={`h-2.5 w-2.5 rounded-full mb-2 transition-all duration-300 ${
                        isSelected ? "scale-125" : "scale-100 opacity-60"
                      }`}
                      style={{
                        background: dTheme.accent,
                        boxShadow: isSelected
                          ? `0 0 10px ${dTheme.accent}`
                          : "none",
                      }}
                    />

                    <span
                      className="text-xs font-semibold leading-tight transition-colors line-clamp-2"
                      style={{
                        color: isSelected ? "#F4F7FA" : "#8C96A3",
                      }}
                    >
                      {domain.name}
                    </span>

                    <span className="text-[10px] font-mono text-muted-foreground/50 mt-1">
                      {domain.paths.length} paths
                    </span>

                    {hasMatchChild && (
                      <span
                        className="mt-1.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold"
                        style={{
                          background: `${dTheme.accent}20`,
                          color: dTheme.accent,
                        }}
                      >
                        Match
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Thin connecting branch line (Level 1 → Level 2) */}
          {showLines && activeDomain && (
            <div className="relative py-4 flex flex-col items-center">
              <div
                className="w-px h-6"
                style={{
                  background: `linear-gradient(to bottom, ${theme.accent}, ${theme.accent}60)`,
                }}
              />
              <div
                className="h-px w-2/3 max-w-lg"
                style={{
                  background: `linear-gradient(to right, transparent, ${theme.accent}60, transparent)`,
                }}
              />
            </div>
          )}

          {/* ── LEVEL 2: CAREER PATHS (Broad Branching Layout) ───────── */}
          {activeDomain && (
            <div className="relative z-10">
              <div className="text-center mb-3">
                <span
                  className="text-[10px] font-mono uppercase tracking-[0.25em]"
                  style={{ color: theme.accent }}
                >
                  Level 2 · {activeDomain.name} Paths
                </span>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                {activeDomain.paths.map((path) => {
                  const isSelected = path.slug === selectedPathSlug;
                  const isMatch = path.slug === highlightedPathSlug;

                  return (
                    <button
                      key={path.id}
                      onClick={() => handlePathClick(path)}
                      className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 cursor-pointer focus:outline-none ${
                        isSelected
                          ? "scale-[1.02]"
                          : "hover:scale-[1.01] hover:border-border/80"
                      }`}
                      style={{
                        borderColor: isSelected
                          ? theme.accent
                          : isMatch
                          ? `${theme.accent}60`
                          : "rgba(255, 255, 255, 0.1)",
                        background: isSelected
                          ? theme.bg
                          : "rgba(16, 20, 26, 0.8)",
                        boxShadow: isSelected
                          ? `0 0 16px ${theme.glow}`
                          : "none",
                      }}
                    >
                      <GitBranch
                        className="h-4 w-4 shrink-0 transition-colors"
                        style={{
                          color: isSelected ? theme.accent : "#8C96A3",
                        }}
                      />

                      <div className="text-left">
                        <span
                          className="text-xs sm:text-sm font-bold block leading-snug"
                          style={{
                            color: isSelected ? "#F4F7FA" : "#8C96A3",
                          }}
                        >
                          {path.name}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground/60">
                          {path.specializations.length} specializations
                        </span>
                      </div>

                      {isMatch && highlightedMatchPct !== undefined && (
                        <span
                          className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold"
                          style={{
                            background: `${theme.accent}25`,
                            color: theme.accent,
                            border: `1px solid ${theme.accent}40`,
                          }}
                        >
                          {highlightedMatchPct}%
                        </span>
                      )}

                      <ChevronRight
                        className="h-3.5 w-3.5 transition-transform duration-200"
                        style={{
                          color: isSelected ? theme.accent : "#A8A096",
                          transform: isSelected
                            ? "rotate(90deg)"
                            : "rotate(0deg)",
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Thin connecting branch line (Level 2 → Level 3) */}
          {showLines && activePath && (
            <div className="relative py-4 flex flex-col items-center">
              <div
                className="w-px h-6"
                style={{
                  background: `linear-gradient(to bottom, ${theme.accent}80, ${theme.accent}40)`,
                }}
              />
              <div
                className="h-px w-3/4 max-w-xl"
                style={{
                  background: `linear-gradient(to right, transparent, ${theme.accent}50, transparent)`,
                }}
              />
            </div>
          )}

          {/* ── LEVEL 3: SPECIALIZATIONS ─────────────────────────────── */}
          {activePath && (
            <div className="relative z-10">
              <div className="text-center mb-3">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground/70">
                  Level 3 · Specializations in {activePath.name}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 max-w-3xl mx-auto">
                {activePath.specializations.map((spec) => {
                  const isSelected = spec.id === selectedSpecId;

                  return (
                    <button
                      key={spec.id}
                      onClick={() => handleSpecClick(spec)}
                      className={`p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer focus:outline-none ${
                        isSelected
                          ? "scale-[1.02]"
                          : "hover:scale-[1.01] hover:border-border/70"
                      }`}
                      style={{
                        borderColor: isSelected
                          ? theme.accent
                          : "rgba(255, 255, 255, 0.08)",
                        background: isSelected
                          ? `${theme.accent}12`
                          : "rgba(16, 20, 26, 0.7)",
                        boxShadow: isSelected
                          ? `0 0 14px ${theme.glow}`
                          : "none",
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className="text-[9px] font-mono uppercase tracking-widest"
                          style={{
                            color: isSelected
                              ? theme.accent
                              : "#8C96A3",
                          }}
                        >
                          Specialization
                        </span>
                        <span className="text-[9px] font-mono text-muted-foreground/60">
                          {spec.roles.length} roles
                        </span>
                      </div>
                      <p
                        className="text-xs sm:text-sm font-semibold leading-tight"
                        style={{
                          color: isSelected ? "#F4F7FA" : "#8C96A3",
                        }}
                      >
                        {spec.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Thin connecting branch line (Level 3 → Level 4) */}
          {showLines && activeSpec && mode === "full" && (
            <div className="relative py-4 flex flex-col items-center">
              <div
                className="w-px h-5"
                style={{
                  background: `linear-gradient(to bottom, ${theme.accent}60, ${theme.accent}30)`,
                }}
              />
            </div>
          )}

          {/* ── LEVEL 4: ROLES (Lightweight interactive chips) ────────── */}
          {activeSpec && mode === "full" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="relative z-10 max-w-2xl mx-auto p-4 rounded-xl border bg-[#10141A] text-center"
              style={{ borderColor: `${theme.accent}30` }}
            >
              <div className="flex items-center justify-between mb-3 px-1 border-b border-border/40 pb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/80">
                  Level 4 · Key Roles in {activeSpec.name}
                </span>
                <span className="text-[9px] font-mono text-muted-foreground/50">
                  Click role to view roadmap &amp; skills
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                {activeSpec.roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleClick(role)}
                    className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono font-medium transition-all duration-200 hover:scale-[1.03] cursor-pointer"
                    style={{
                      borderColor: `${theme.accent}30`,
                      background: `${theme.accent}08`,
                      color: "#F4F7FA",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = theme.accent;
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 0 10px ${theme.glow}`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.borderColor = `${theme.accent}30`;
                      (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    }}
                  >
                    <Circle
                      className="h-1.5 w-1.5 shrink-0"
                      fill={role.isEntryLevel ? theme.accent : "transparent"}
                      stroke={theme.accent}
                      strokeWidth={2}
                    />
                    <span>{role.title}</span>
                    <ArrowRight
                      className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity -ml-0.5"
                      style={{ color: theme.accent }}
                    />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* MOBILE VIEW: Clean Vertical Expandable Hierarchy (No Overflow)   */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="block md:hidden space-y-3">
        {CAREER_DOMAINS.map((domain) => {
          const isDomainOpen = domain.id === selectedDomainId;
          const dTheme = getDomainTheme(domain.id);
          const hasMatch = domain.paths.some(
            (p) => p.slug === highlightedPathSlug
          );

          return (
            <div
              key={domain.id}
              className="rounded-xl border border-border/80 bg-[#10141A] overflow-hidden"
              style={{
                borderColor: isDomainOpen ? dTheme.accent : undefined,
              }}
            >
              {/* Domain Level Accordion Button */}
              <button
                onClick={() => {
                  if (isDomainOpen) {
                    setSelectedDomainId("");
                    setSelectedPathSlug(null);
                    setSelectedSpecId(null);
                  } else {
                    handleDomainClick(domain);
                  }
                }}
                className="w-full flex items-center justify-between p-4 text-left cursor-pointer focus:outline-none"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ background: dTheme.accent }}
                  />
                  <div>
                    <p className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/70">
                      Domain
                    </p>
                    <h3
                      className="text-sm font-bold"
                      style={{
                        color: isDomainOpen ? dTheme.accent : "#F4F7FA",
                      }}
                    >
                      {domain.name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {hasMatch && (
                    <span
                      className="px-2 py-0.5 rounded text-[9px] font-mono font-bold"
                      style={{
                        background: `${dTheme.accent}20`,
                        color: dTheme.accent,
                      }}
                    >
                      Match
                    </span>
                  )}
                  <ChevronRight
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isDomainOpen ? "rotate-90 text-primary" : "text-muted-foreground"
                    }`}
                  />
                </div>
              </button>

              {/* Nested Paths & Specializations */}
              <AnimatePresence>
                {isDomainOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="border-t border-border/60 bg-[#0B0E12] px-4 py-3 space-y-3"
                  >
                    {domain.paths.map((path) => {
                      const isPathOpen = path.slug === selectedPathSlug;
                      const isMatch = path.slug === highlightedPathSlug;

                      return (
                        <div
                          key={path.id}
                          className="rounded-lg border border-border/50 bg-[#141920] p-3 space-y-2.5"
                          style={{
                            borderColor: isPathOpen
                              ? `${dTheme.accent}60`
                              : undefined,
                          }}
                        >
                          {/* Path Header */}
                          <button
                            onClick={() => {
                              if (isPathOpen) {
                                setSelectedPathSlug(null);
                                setSelectedSpecId(null);
                              } else {
                                handlePathClick(path);
                              }
                            }}
                            className="w-full flex items-center justify-between text-left cursor-pointer focus:outline-none"
                          >
                            <div className="flex items-center gap-2">
                              <GitBranch
                                className="h-3.5 w-3.5 shrink-0"
                                style={{
                                  color: isPathOpen
                                    ? dTheme.accent
                                    : "#8C96A3",
                                }}
                              />
                              <div>
                                <p className="text-[8px] font-mono uppercase tracking-widest text-muted-foreground/60">
                                  Path
                                </p>
                                <span className="text-xs font-semibold text-foreground">
                                  {path.name}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {isMatch && highlightedMatchPct !== undefined && (
                                <span
                                  className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded"
                                  style={{
                                    background: `${dTheme.accent}20`,
                                    color: dTheme.accent,
                                  }}
                                >
                                  {highlightedMatchPct}%
                                </span>
                              )}
                              <ChevronRight
                                className={`h-3 w-3 transition-transform ${
                                  isPathOpen ? "rotate-90 text-primary" : "text-muted-foreground"
                                }`}
                              />
                            </div>
                          </button>

                          {/* Path Expanded: Specializations & Roles (Full Mode) */}
                          {isPathOpen && mode === "full" && (
                            <div className="pt-2 pl-3 border-l-2 border-border/60 space-y-3">
                              {path.specializations.map((spec) => (
                                <div key={spec.id} className="space-y-1.5">
                                  <p className="text-[10px] font-mono font-semibold text-primary/90">
                                    {spec.name}
                                  </p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {spec.roles.map((role) => (
                                      <Link
                                        key={role.id}
                                        href={`/career/${path.slug}`}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-border/80 bg-[#10141A] text-[10px] font-mono text-muted-foreground hover:text-foreground hover:border-primary/40"
                                      >
                                        <Circle
                                          className="h-1.5 w-1.5 shrink-0"
                                          fill={
                                            role.isEntryLevel
                                              ? dTheme.accent
                                              : "transparent"
                                            }
                                          stroke={dTheme.accent}
                                        />
                                        <span>{role.title}</span>
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}

                              <div className="pt-2">
                                <Link
                                  href={`/career/${path.slug}`}
                                  className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-primary"
                                >
                                  <span>View {path.name} Roadmap</span>
                                  <ArrowRight className="h-3 w-3" />
                                </Link>
                              </div>
                            </div>
                          )}

                          {/* Path Expanded: Compact Preview (Specializations only, no 108 roles) */}
                          {isPathOpen && mode === "compact" && (
                            <div className="pt-2 pl-3 border-l-2 border-border/60 space-y-2">
                              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/70">
                                Specializations:
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {path.specializations.map((spec) => (
                                  <span
                                    key={spec.id}
                                    className="inline-flex items-center px-2.5 py-1 rounded-md border border-border/70 bg-[#10141A] text-[11px] font-mono text-foreground/90"
                                  >
                                    {spec.name}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* ── Legend ───────────────────────────────────────────────────── */}
      {mode === "full" ? (
        <div className="flex flex-wrap items-center justify-between gap-y-2 pt-2 border-t border-border/40 text-[10px] font-mono text-muted-foreground/70">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Circle className="h-2 w-2 fill-primary text-primary" />
              Entry-level role
            </span>
            <span className="flex items-center gap-1">
              <Circle className="h-2 w-2 text-primary" />
              Advanced role
            </span>
          </div>
          <span className="text-[9px]">
            Hierarchy: Domain → Path → Specialization → Role
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[10px] font-mono text-muted-foreground/70">
          <span>Career Structure Preview</span>
          <span>Domain → Path → Specialization</span>
        </div>
      )}
    </div>
  );
}
