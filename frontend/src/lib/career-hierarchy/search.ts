/**
 * Canonical Career Directory Search Engine
 *
 * Implements semantic, token-aware relevance search across the 4-level taxonomy:
 * DOMAIN -> CAREER PATH -> SPECIALIZATION -> ROLE
 *
 * Rules:
 * 1. Intentional searchable fields only: Domain name, Path name, Specialization name, Role title, and Canonical Aliases.
 * 2. Never searches arbitrary descriptions or marketing copy.
 * 3. Never uses naive substring matching.
 * 4. Short queries (1-2 chars) require exact token or canonical abbreviation match (e.g. "AI", "ML", "UX", "UI", "PM").
 * 5. Returns structured results per entity (path / specialization / role) sorted by relevance score descending.
 * 6. For broad queries (aliases, domain names) the entire relevant cluster is surfaced.
 */

import { getAllCareerPaths } from "./registry";
import type { CareerPath, CareerSpecialization, CareerRole } from "./types";

// ─── Result types ────────────────────────────────────────────────────────────

/** A single matched entity with full hierarchy context and relevance score. */
export interface CareerSearchResult {
  /** The matched entity type */
  entityType: "path" | "specialization" | "role";
  /** Relevance score — higher is better */
  relevanceScore: number;
  /** How the match was established */
  matchType:
    | "exact_role"
    | "exact_path"
    | "exact_specialization"
    | "exact_domain"
    | "alias"
    | "token_role"
    | "token_specialization"
    | "token_path"
    | "token_domain"
    | "multi_token"
    | "prefix";

  // Hierarchy context — always populated
  path: CareerPath;
  specialization?: CareerSpecialization; // set when entityType is "specialization" or "role"
  role?: CareerRole; // set when entityType is "role"

  // For UI badges
  matchedRoles: string[];
  matchedSpecializations: string[];
  matchedDomainName?: string;
  matchedAlias?: string;
}

/** Grouped result structure for rendering */
export interface CareerSearchResultGroup {
  label: "Career Paths" | "Specializations" | "Roles";
  results: CareerSearchResult[];
}

export interface SearchCatalogOptions {
  domainId?: string; // "all" or specific domain ID
  /** Maximum number of results per entity-level bucket (default: 8) */
  maxPerGroup?: number;
  /** Absolute max total results across all groups (default: 20) */
  maxTotal?: number;
}

// ─── Canonical alias / acronym map ──────────────────────────────────────────

/**
 * Central canonical aliases and abbreviations mapping.
 * Maps standard industry acronyms to their corresponding canonical paths,
 * specializations, and roles in the registry.
 */
export const CANONICAL_CAREER_ALIASES: Record<
  string,
  {
    targetPathSlugs: string[];
    canonicalTerm: string;
    targetSpecializationIds?: string[];
    targetRoleIds?: string[];
  }
> = {
  ai: {
    targetPathSlugs: ["ai-ml-data-science"],
    canonicalTerm: "Artificial Intelligence",
    targetSpecializationIds: ["machine-learning", "ai-engineering", "data-science"],
    targetRoleIds: [
      "ai-engineer",
      "generative-ai-engineer",
      "ai-solutions-engineer",
      "ml-engineer",
      "nlp-engineer",
      "cv-engineer",
      "data-scientist",
    ],
  },
  ml: {
    targetPathSlugs: ["ai-ml-data-science"],
    canonicalTerm: "Machine Learning",
    targetSpecializationIds: ["machine-learning", "ai-engineering"],
    targetRoleIds: ["ml-engineer", "nlp-engineer", "cv-engineer", "ai-engineer"],
  },
  ux: {
    targetPathSlugs: ["design-creative"],
    canonicalTerm: "User Experience (UX)",
    targetSpecializationIds: ["ux-product-experience"],
    targetRoleIds: ["ux-researcher", "product-designer"],
  },
  ui: {
    targetPathSlugs: ["design-creative"],
    canonicalTerm: "User Interface (UI)",
    targetSpecializationIds: ["design-systems-ui"],
    targetRoleIds: ["ui-designer", "product-designer"],
  },
  pm: {
    targetPathSlugs: ["management-product"],
    canonicalTerm: "Product Management",
    targetSpecializationIds: ["product-mgmt"],
    targetRoleIds: ["assoc-pm", "tech-pm", "product-ops"],
  },
  swe: {
    targetPathSlugs: ["software-development"],
    canonicalTerm: "Software Engineering",
    targetSpecializationIds: ["web-app-eng", "systems-cloud"],
    targetRoleIds: ["frontend-dev", "backend-dev", "fullstack-dev", "devops-engineer"],
  },
  sde: {
    targetPathSlugs: ["software-development"],
    canonicalTerm: "Software Development",
    targetSpecializationIds: ["web-app-eng"],
    targetRoleIds: ["frontend-dev", "backend-dev", "fullstack-dev"],
  },
  devops: {
    targetPathSlugs: ["software-development", "cloud-infrastructure"],
    canonicalTerm: "DevOps & Infrastructure",
    targetSpecializationIds: ["systems-cloud", "devops-systems"],
    targetRoleIds: ["devops-engineer", "cloud-engineer", "sre"],
  },
  cs: {
    targetPathSlugs: ["cybersecurity"],
    canonicalTerm: "Cybersecurity",
    targetSpecializationIds: ["sec-operations", "offensive-security"],
    targetRoleIds: ["soc-analyst", "incident-responder", "threat-hunter", "pentester"],
  },
  ds: {
    targetPathSlugs: ["ai-ml-data-science", "data-analytics-bi"],
    canonicalTerm: "Data Science",
    targetSpecializationIds: ["data-science", "analytics-bi"],
    targetRoleIds: ["data-scientist", "data-analyst"],
  },
  bi: {
    targetPathSlugs: ["data-analytics-bi"],
    canonicalTerm: "Business Intelligence",
    targetSpecializationIds: ["analytics-bi"],
    targetRoleIds: ["bi-developer", "analytics-manager"],
  },
};

// ─── String utilities ────────────────────────────────────────────────────────

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s/&-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[\s/&\-_,]+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matchesWordBoundary(target: string, query: string): boolean {
  if (!target || !query) return false;
  const regex = new RegExp(
    `(^|[^a-zA-Z0-9])${escapeRegExp(query)}([^a-zA-Z0-9]|$)`,
    "i"
  );
  return regex.test(target);
}

function getQueryVariations(query: string): string[] {
  const norm = normalizeText(query);
  const variations = new Set<string>([norm]);

  const pairs: [RegExp, string][] = [
    [/front[\s-]end/g, "frontend"],
    [/frontend/g, "front end"],
    [/back[\s-]end/g, "backend"],
    [/backend/g, "back end"],
    [/full[\s-]stack/g, "fullstack"],
    [/fullstack/g, "full stack"],
    [/dev[\s-]ops/g, "devops"],
    [/devops/g, "dev ops"],
    [/ui[\s/]ux/g, "ui ux"],
    [/ai[\s/]ml/g, "ai ml"],
  ];
  for (const [pattern, replacement] of pairs) {
    if (pattern.test(norm)) {
      variations.add(norm.replace(pattern, replacement));
    }
  }

  const collapsed = norm.replace(/\s+/g, "");
  if (collapsed.length >= 4) variations.add(collapsed);

  return Array.from(variations);
}

// ─── Score constants ─────────────────────────────────────────────────────────

const SCORES = {
  EXACT_ROLE: 120,
  EXACT_PATH: 110,
  EXACT_SPEC: 105,
  EXACT_DOMAIN: 100,
  ALIAS_PATH: 100,
  ALIAS_SPEC: 95,
  ALIAS_ROLE: 90,
  TOKEN_ROLE: 85,
  TOKEN_SPEC: 75,
  TOKEN_PATH: 70,
  TOKEN_DOMAIN: 60,
  MULTI_TOKEN_ROLE: 65,
  MULTI_TOKEN_SPEC: 55,
  MULTI_TOKEN_PATH: 50,
  PREFIX_ROLE: 40,
  PREFIX_SPEC: 35,
  PREFIX_PATH: 30,
  PREFIX_DOMAIN: 25,
} as const;

// ─── Internal scored entity types ────────────────────────────────────────────

interface ScoredPath {
  path: CareerPath;
  score: number;
  matchType: CareerSearchResult["matchType"];
  matchedAlias?: string;
  matchedDomainName?: string;
}

interface ScoredSpec {
  path: CareerPath;
  spec: CareerSpecialization;
  score: number;
  matchType: CareerSearchResult["matchType"];
  matchedAlias?: string;
}

interface ScoredRole {
  path: CareerPath;
  spec: CareerSpecialization;
  role: CareerRole;
  score: number;
  matchType: CareerSearchResult["matchType"];
  matchedAlias?: string;
}

// ─── Main search function ────────────────────────────────────────────────────

/**
 * Searches the canonical career catalogue and returns entity-level results
 * (paths, specializations, and roles) ranked by relevance.
 *
 * Short queries (1-2 chars) use strict alias / exact-token matching only.
 * Longer queries use full token, multi-token, and controlled prefix matching.
 */
export function searchCareerCatalog(
  rawQuery: string,
  options?: SearchCatalogOptions
): CareerSearchResult[] {
  const query = normalizeText(rawQuery);
  const allPaths = getAllCareerPaths();

  // Empty query: return all paths filtered by domain if set
  if (!query) {
    const selectedDomain = options?.domainId;
    const paths =
      selectedDomain && selectedDomain !== "all"
        ? allPaths.filter((p) => p.domainId === selectedDomain)
        : allPaths;

    return paths.map((path) => ({
      entityType: "path" as const,
      relevanceScore: 0,
      matchType: "exact_path" as const,
      path,
      matchedRoles: [],
      matchedSpecializations: [],
    }));
  }

  const domainFilter =
    options?.domainId && options.domainId !== "all" ? options.domainId : null;

  const queryTokens = tokenize(query);
  const isShortQuery = query.length <= 2;
  const variations = getQueryVariations(query);

  // Accumulate scored entities; deduplicate by string key
  const scoredPaths = new Map<string, ScoredPath>();
  const scoredSpecs = new Map<string, ScoredSpec>();
  const scoredRoles = new Map<string, ScoredRole>();

  function upsertPath(key: string, candidate: ScoredPath) {
    const existing = scoredPaths.get(key);
    if (!existing || candidate.score > existing.score) {
      scoredPaths.set(key, candidate);
    }
  }
  function upsertSpec(key: string, candidate: ScoredSpec) {
    const existing = scoredSpecs.get(key);
    if (!existing || candidate.score > existing.score) {
      scoredSpecs.set(key, candidate);
    }
  }
  function upsertRole(key: string, candidate: ScoredRole) {
    const existing = scoredRoles.get(key);
    if (!existing || candidate.score > existing.score) {
      scoredRoles.set(key, candidate);
    }
  }

  for (const path of allPaths) {
    if (domainFilter && path.domainId !== domainFilter) continue;

    const normPathName = normalizeText(path.name);
    const normPathTitle = normalizeText(path.title);
    const normCareerName = normalizeText(path.careerName);
    const normDomainName = normalizeText(path.domainName);

    const pathTokens = tokenize(`${path.name} ${path.title} ${path.careerName}`);
    const domainTokens = tokenize(path.domainName);

    const aliasKey = query.toLowerCase();
    const aliasData = CANONICAL_CAREER_ALIASES[aliasKey];

    // ── 1. CANONICAL ALIAS MATCH ─────────────────────────────────────────────
    if (aliasData) {
      if (aliasData.targetPathSlugs.includes(path.slug)) {
        upsertPath(`path:${path.slug}`, {
          path,
          score: SCORES.ALIAS_PATH,
          matchType: "alias",
          matchedAlias: aliasData.canonicalTerm,
        });
      }

      for (const spec of path.specializations) {
        if (aliasData.targetSpecializationIds?.includes(spec.id)) {
          upsertSpec(`spec:${path.slug}:${spec.id}`, {
            path,
            spec,
            score: SCORES.ALIAS_SPEC,
            matchType: "alias",
            matchedAlias: aliasData.canonicalTerm,
          });
        }

        for (const role of spec.roles) {
          if (aliasData.targetRoleIds?.includes(role.id)) {
            upsertRole(`role:${path.slug}:${spec.id}:${role.id}`, {
              path,
              spec,
              role,
              score: SCORES.ALIAS_ROLE,
              matchType: "alias",
              matchedAlias: aliasData.canonicalTerm,
            });
          }
        }
      }
    }

    // ── 2. SHORT QUERY (1-2 chars) — exact tokens only, then stop ───────────
    if (isShortQuery) {
      for (const spec of path.specializations) {
        for (const role of spec.roles) {
          const roleTokens = tokenize(role.title);
          if (roleTokens.includes(query)) {
            upsertRole(`role:${path.slug}:${spec.id}:${role.id}`, {
              path,
              spec,
              role,
              score: SCORES.TOKEN_ROLE,
              matchType: "token_role",
            });
          }
        }
        const specTokens = tokenize(spec.name);
        if (specTokens.includes(query)) {
          upsertSpec(`spec:${path.slug}:${spec.id}`, {
            path,
            spec,
            score: SCORES.TOKEN_SPEC,
            matchType: "token_specialization",
          });
        }
      }
      if (pathTokens.includes(query)) {
        upsertPath(`path:${path.slug}`, {
          path,
          score: SCORES.TOKEN_PATH,
          matchType: "token_path",
        });
      }
      if (domainTokens.includes(query)) {
        upsertPath(`path:${path.slug}`, {
          path,
          score: SCORES.TOKEN_DOMAIN,
          matchType: "token_domain",
          matchedDomainName: path.domainName,
        });
      }
      // Short queries: no prefix or substring — stop here
      continue;
    }

    // ── 3. LONGER QUERIES: FULL SEMANTIC MATCHING ────────────────────────────

    for (const v of variations) {
      for (const spec of path.specializations) {
        for (const role of spec.roles) {
          const normRoleTitle = normalizeText(role.title);
          if (normRoleTitle === v) {
            upsertRole(`role:${path.slug}:${spec.id}:${role.id}`, {
              path,
              spec,
              role,
              score: SCORES.EXACT_ROLE,
              matchType: "exact_role",
            });
          } else if (matchesWordBoundary(role.title, v)) {
            upsertRole(`role:${path.slug}:${spec.id}:${role.id}`, {
              path,
              spec,
              role,
              score: SCORES.TOKEN_ROLE,
              matchType: "token_role",
            });
          }
        }

        const normSpecName = normalizeText(spec.name);
        if (normSpecName === v) {
          upsertSpec(`spec:${path.slug}:${spec.id}`, {
            path,
            spec,
            score: SCORES.EXACT_SPEC,
            matchType: "exact_specialization",
          });
        } else if (matchesWordBoundary(spec.name, v)) {
          upsertSpec(`spec:${path.slug}:${spec.id}`, {
            path,
            spec,
            score: SCORES.TOKEN_SPEC,
            matchType: "token_specialization",
          });
        }
      }

      if (normPathName === v || normPathTitle === v || normCareerName === v) {
        upsertPath(`path:${path.slug}`, {
          path,
          score: SCORES.EXACT_PATH,
          matchType: "exact_path",
        });
      } else if (
        matchesWordBoundary(path.name, v) ||
        matchesWordBoundary(path.title, v) ||
        matchesWordBoundary(path.careerName, v)
      ) {
        upsertPath(`path:${path.slug}`, {
          path,
          score: SCORES.TOKEN_PATH,
          matchType: "token_path",
        });
      }

      if (normDomainName === v) {
        upsertPath(`path:${path.slug}`, {
          path,
          score: SCORES.EXACT_DOMAIN,
          matchType: "exact_domain",
          matchedDomainName: path.domainName,
        });
      } else if (matchesWordBoundary(path.domainName, v)) {
        upsertPath(`path:${path.slug}`, {
          path,
          score: SCORES.TOKEN_DOMAIN,
          matchType: "token_domain",
          matchedDomainName: path.domainName,
        });
      }
    }

    // ── 4. MULTI-TOKEN COVERAGE ───────────────────────────────────────────────
    if (queryTokens.length > 1) {
      for (const spec of path.specializations) {
        for (const role of spec.roles) {
          const roleTokens = tokenize(role.title);
          const allInRole = queryTokens.every((qt) =>
            roleTokens.some(
              (rt) => rt === qt || (qt.length >= 4 && rt.startsWith(qt))
            )
          );
          if (allInRole) {
            upsertRole(`role:${path.slug}:${spec.id}:${role.id}`, {
              path,
              spec,
              role,
              score: SCORES.MULTI_TOKEN_ROLE,
              matchType: "multi_token",
            });
          }
        }

        const specTokens = tokenize(spec.name);
        const allInSpec = queryTokens.every((qt) =>
          specTokens.some(
            (st) => st === qt || (qt.length >= 4 && st.startsWith(qt))
          )
        );
        if (allInSpec) {
          upsertSpec(`spec:${path.slug}:${spec.id}`, {
            path,
            spec,
            score: SCORES.MULTI_TOKEN_SPEC,
            matchType: "multi_token",
          });
        }
      }

      const allInPath = queryTokens.every((qt) =>
        pathTokens.some((pt) => pt === qt || (qt.length >= 4 && pt.startsWith(qt)))
      );
      if (allInPath) {
        upsertPath(`path:${path.slug}`, {
          path,
          score: SCORES.MULTI_TOKEN_PATH,
          matchType: "multi_token",
        });
      }
    }

    // ── 5. CONTROLLED PREFIX MATCHING (query >= 4 chars) ─────────────────────
    if (query.length >= 4) {
      for (const spec of path.specializations) {
        for (const role of spec.roles) {
          const key = `role:${path.slug}:${spec.id}:${role.id}`;
          if (!scoredRoles.has(key)) {
            const roleTokens = tokenize(role.title);
            if (roleTokens.some((rt) => rt.startsWith(query))) {
              upsertRole(key, {
                path,
                spec,
                role,
                score: SCORES.PREFIX_ROLE,
                matchType: "prefix",
              });
            }
          }
        }

        const specKey = `spec:${path.slug}:${spec.id}`;
        if (!scoredSpecs.has(specKey)) {
          const specTokens = tokenize(spec.name);
          if (specTokens.some((st) => st.startsWith(query))) {
            upsertSpec(specKey, {
              path,
              spec,
              score: SCORES.PREFIX_SPEC,
              matchType: "prefix",
            });
          }
        }
      }

      const pathKey = `path:${path.slug}`;
      if (!scoredPaths.has(pathKey)) {
        if (pathTokens.some((pt) => pt.startsWith(query))) {
          upsertPath(pathKey, {
            path,
            score: SCORES.PREFIX_PATH,
            matchType: "prefix",
          });
        } else if (domainTokens.some((dt) => dt.startsWith(query))) {
          upsertPath(pathKey, {
            path,
            score: SCORES.PREFIX_DOMAIN,
            matchType: "prefix",
            matchedDomainName: path.domainName,
          });
        }
      }
    }
  }

  // ── Assemble final result list ───────────────────────────────────────────

  const maxPerGroup = options?.maxPerGroup ?? 8;
  const maxTotal = options?.maxTotal ?? 20;

  const sortByScore = <T extends { score: number }>(arr: T[]): T[] =>
    [...arr].sort((a, b) => b.score - a.score);

  const topPaths = sortByScore(Array.from(scoredPaths.values())).slice(0, maxPerGroup);
  const topSpecs = sortByScore(Array.from(scoredSpecs.values())).slice(0, maxPerGroup);
  const topRoles = sortByScore(Array.from(scoredRoles.values())).slice(0, maxPerGroup);

  const results: CareerSearchResult[] = [];

  // Path-level results: include matched sub-entities as badge context
  for (const sp of topPaths) {
    const matchedSpecs = topSpecs
      .filter((s) => s.path.slug === sp.path.slug)
      .map((s) => s.spec.name);
    const matchedRoles = topRoles
      .filter((r) => r.path.slug === sp.path.slug)
      .map((r) => r.role.title);

    results.push({
      entityType: "path",
      relevanceScore: sp.score,
      matchType: sp.matchType,
      path: sp.path,
      matchedRoles,
      matchedSpecializations: matchedSpecs,
      matchedDomainName: sp.matchedDomainName,
      matchedAlias: sp.matchedAlias,
    });
  }

  // Specialization-level results
  for (const ss of topSpecs) {
    results.push({
      entityType: "specialization",
      relevanceScore: ss.score,
      matchType: ss.matchType,
      path: ss.path,
      specialization: ss.spec,
      matchedRoles: topRoles
        .filter(
          (r) => r.path.slug === ss.path.slug && r.spec.id === ss.spec.id
        )
        .map((r) => r.role.title),
      matchedSpecializations: [ss.spec.name],
      matchedAlias: ss.matchedAlias,
    });
  }

  // Role-level results
  for (const sr of topRoles) {
    results.push({
      entityType: "role",
      relevanceScore: sr.score,
      matchType: sr.matchType,
      path: sr.path,
      specialization: sr.spec,
      role: sr.role,
      matchedRoles: [sr.role.title],
      matchedSpecializations: [sr.spec.name],
      matchedAlias: sr.matchedAlias,
    });
  }

  // Sort by relevance descending, secondary by path name
  results.sort((a, b) => {
    if (b.relevanceScore !== a.relevanceScore) return b.relevanceScore - a.relevanceScore;
    return a.path.name.localeCompare(b.path.name);
  });

  return results.slice(0, maxTotal);
}

/**
 * Returns results grouped into Career Paths / Specializations / Roles sections.
 * The UI can render each group as a distinct visual section.
 */
export function searchCareerCatalogGrouped(
  rawQuery: string,
  options?: SearchCatalogOptions
): CareerSearchResultGroup[] {
  if (!rawQuery.trim()) {
    return [];
  }

  const flat = searchCareerCatalog(rawQuery, options);

  const paths = flat.filter((r) => r.entityType === "path");
  const specs = flat.filter((r) => r.entityType === "specialization");
  const roles = flat.filter((r) => r.entityType === "role");

  const groups: CareerSearchResultGroup[] = [];
  if (paths.length > 0) groups.push({ label: "Career Paths", results: paths });
  if (specs.length > 0) groups.push({ label: "Specializations", results: specs });
  if (roles.length > 0) groups.push({ label: "Roles", results: roles });

  return groups;
}
