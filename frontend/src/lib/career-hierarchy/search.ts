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

  // Roadmap and navigation
  targetRoadmapUrl: string;
  isSpecificRoleMatch?: boolean;

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
    targetSpecializationIds: ["product-mgmt", "tech-program"],
    targetRoleIds: ["assoc-pm", "group-pm", "growth-pm", "technical-pm", "tpm"],
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
    targetSpecializationIds: ["systems-cloud", "platform-reliability"],
    targetRoleIds: ["devops-engineer", "site-reliability-engineer", "platform-engineer"],
  },
  cs: {
    targetPathSlugs: ["cybersecurity"],
    canonicalTerm: "Cybersecurity",
    targetSpecializationIds: ["sec-operations", "offensive-security"],
    targetRoleIds: ["soc-analyst", "incident-responder", "threat-hunter", "pentester"],
  },
  cyber: {
    targetPathSlugs: ["cybersecurity"],
    canonicalTerm: "Cybersecurity & Defense",
    targetSpecializationIds: [
      "offensive-security",
      "sec-operations",
      "cloud-identity-sec",
      "digital-forensics-dfir",
      "governance-risk-compliance",
    ],
    targetRoleIds: [
      "red-team-operator",
      "soc-analyst",
      "pentester",
      "incident-responder",
      "malware-analyst",
      "devsecops-engineer",
      "cloud-sec-engineer",
      "threat-hunter",
      "digital-forensics-investigator",
      "sec-architect",
      "security-grc-analyst",
      "security-auditor",
      "exploit-researcher",
    ],
  },
  cybersecurity: {
    targetPathSlugs: ["cybersecurity"],
    canonicalTerm: "Cybersecurity & Defense",
    targetSpecializationIds: [
      "offensive-security",
      "sec-operations",
      "cloud-identity-sec",
      "digital-forensics-dfir",
      "governance-risk-compliance",
    ],
    targetRoleIds: [
      "red-team-operator",
      "soc-analyst",
      "pentester",
      "incident-responder",
      "malware-analyst",
      "devsecops-engineer",
      "cloud-sec-engineer",
      "threat-hunter",
      "digital-forensics-investigator",
      "sec-architect",
      "security-grc-analyst",
      "security-auditor",
      "exploit-researcher",
    ],
  },
  infosec: {
    targetPathSlugs: ["cybersecurity"],
    canonicalTerm: "Information Security",
    targetSpecializationIds: ["sec-operations", "offensive-security", "cloud-identity-sec"],
    targetRoleIds: ["soc-analyst", "pentester", "sec-architect", "security-grc-analyst"],
  },
  "red team": {
    targetPathSlugs: ["cybersecurity"],
    canonicalTerm: "Offensive Security & Red Teaming",
    targetSpecializationIds: ["offensive-security"],
    targetRoleIds: ["red-team-operator", "pentester", "exploit-researcher"],
  },
  redteam: {
    targetPathSlugs: ["cybersecurity"],
    canonicalTerm: "Offensive Security & Red Teaming",
    targetSpecializationIds: ["offensive-security"],
    targetRoleIds: ["red-team-operator", "pentester", "exploit-researcher"],
  },
  "blue team": {
    targetPathSlugs: ["cybersecurity"],
    canonicalTerm: "Defensive Security & Blue Teaming",
    targetSpecializationIds: ["sec-operations"],
    targetRoleIds: ["soc-analyst", "incident-responder", "threat-hunter"],
  },
  blueteam: {
    targetPathSlugs: ["cybersecurity"],
    canonicalTerm: "Defensive Security & Blue Teaming",
    targetSpecializationIds: ["sec-operations"],
    targetRoleIds: ["soc-analyst", "incident-responder", "threat-hunter"],
  },
  soc: {
    targetPathSlugs: ["cybersecurity"],
    canonicalTerm: "Security Operations Center (SOC)",
    targetSpecializationIds: ["sec-operations"],
    targetRoleIds: ["soc-analyst", "incident-responder", "threat-hunter"],
  },
  pentest: {
    targetPathSlugs: ["cybersecurity"],
    canonicalTerm: "Penetration Testing & Ethical Hacking",
    targetSpecializationIds: ["offensive-security"],
    targetRoleIds: ["pentester", "red-team-operator", "exploit-researcher"],
  },
  pentesting: {
    targetPathSlugs: ["cybersecurity"],
    canonicalTerm: "Penetration Testing & Ethical Hacking",
    targetSpecializationIds: ["offensive-security"],
    targetRoleIds: ["pentester", "red-team-operator", "exploit-researcher"],
  },
  hacking: {
    targetPathSlugs: ["cybersecurity"],
    canonicalTerm: "Ethical Hacking & Offensive Security",
    targetSpecializationIds: ["offensive-security"],
    targetRoleIds: ["pentester", "red-team-operator", "exploit-researcher"],
  },
  hacker: {
    targetPathSlugs: ["cybersecurity"],
    canonicalTerm: "Ethical Hacker",
    targetSpecializationIds: ["offensive-security"],
    targetRoleIds: ["pentester", "red-team-operator", "exploit-researcher"],
  },
  dfir: {
    targetPathSlugs: ["cybersecurity"],
    canonicalTerm: "Digital Forensics & Incident Response (DFIR)",
    targetSpecializationIds: ["digital-forensics-dfir"],
    targetRoleIds: ["digital-forensics-investigator", "malware-analyst", "threat-intel-analyst"],
  },
  forensics: {
    targetPathSlugs: ["cybersecurity"],
    canonicalTerm: "Digital Forensics",
    targetSpecializationIds: ["digital-forensics-dfir"],
    targetRoleIds: ["digital-forensics-investigator", "malware-analyst", "threat-intel-analyst"],
  },
  malware: {
    targetPathSlugs: ["cybersecurity"],
    canonicalTerm: "Malware Analysis & Reverse Engineering",
    targetSpecializationIds: ["digital-forensics-dfir"],
    targetRoleIds: ["malware-analyst", "exploit-researcher"],
  },
  grc: {
    targetPathSlugs: ["cybersecurity"],
    canonicalTerm: "Governance, Risk & Compliance (GRC)",
    targetSpecializationIds: ["governance-risk-compliance"],
    targetRoleIds: ["security-grc-analyst", "security-auditor", "sec-architect"],
  },
  appsec: {
    targetPathSlugs: ["cybersecurity"],
    canonicalTerm: "Application Security & DevSecOps",
    targetSpecializationIds: ["cloud-identity-sec"],
    targetRoleIds: ["appsec-engineer", "devsecops-engineer", "cloud-sec-engineer"],
  },
  devsecops: {
    targetPathSlugs: ["cybersecurity", "cloud-infrastructure"],
    canonicalTerm: "DevSecOps",
    targetSpecializationIds: ["cloud-identity-sec", "platform-reliability"],
    targetRoleIds: ["devsecops-engineer", "appsec-engineer", "cloud-sec-engineer"],
  },
  iot: {
    targetPathSlugs: ["iot-connected-systems"],
    canonicalTerm: "Internet of Things (IoT)",
    targetSpecializationIds: ["embedded-iot-firmware", "connected-edge-cloud", "industrial-iot-smart-systems"],
    targetRoleIds: [
      "iot-firmware-engineer",
      "embedded-hardware-engineer",
      "sensor-integration-specialist",
      "iot-cloud-architect",
      "edge-computing-engineer",
      "wireless-iot-engineer",
      "industrial-iot-engineer",
      "smart-infrastructure-architect",
      "iot-security-specialist",
    ],
  },
  "internet of things": {
    targetPathSlugs: ["iot-connected-systems"],
    canonicalTerm: "Internet of Things (IoT)",
    targetSpecializationIds: ["embedded-iot-firmware", "connected-edge-cloud", "industrial-iot-smart-systems"],
    targetRoleIds: [
      "iot-firmware-engineer",
      "embedded-hardware-engineer",
      "sensor-integration-specialist",
      "iot-cloud-architect",
      "edge-computing-engineer",
      "wireless-iot-engineer",
      "industrial-iot-engineer",
      "smart-infrastructure-architect",
      "iot-security-specialist",
    ],
  },
  iiot: {
    targetPathSlugs: ["iot-connected-systems"],
    canonicalTerm: "Industrial Internet of Things (IIoT)",
    targetSpecializationIds: ["industrial-iot-smart-systems"],
    targetRoleIds: ["industrial-iot-engineer", "smart-infrastructure-architect", "iot-security-specialist"],
  },
  ds: {
    targetPathSlugs: ["ai-ml-data-science", "data-analytics-bi"],
    canonicalTerm: "Data Science",
    targetSpecializationIds: ["data-science", "analytics-bi"],
    targetRoleIds: ["data-scientist", "ml-research-scientist", "data-analyst"],
  },
  bi: {
    targetPathSlugs: ["data-analytics-bi"],
    canonicalTerm: "Business Intelligence",
    targetSpecializationIds: ["analytics-bi"],
    targetRoleIds: ["data-analyst", "analytics-manager", "product-analyst"],
  },
  law: {
    targetPathSlugs: ["law-policy"],
    canonicalTerm: "Law & Public Policy",
    targetSpecializationIds: ["corporate-commercial-law", "public-policy-governance", "litigation-dispute"],
    targetRoleIds: ["corporate-associate", "litigation-associate", "public-defender", "ip-lawyer", "compliance-officer"],
  },
  legal: {
    targetPathSlugs: ["law-policy"],
    canonicalTerm: "Law & Legal Services",
    targetSpecializationIds: ["corporate-commercial-law", "litigation-dispute"],
    targetRoleIds: ["corporate-associate", "litigation-associate", "public-defender"],
  },
  lawyer: {
    targetPathSlugs: ["law-policy"],
    canonicalTerm: "Legal Profession",
    targetSpecializationIds: ["corporate-commercial-law", "litigation-dispute"],
    targetRoleIds: ["corporate-associate", "litigation-associate", "public-defender"],
  },
  "corporate lawyer": {
    targetPathSlugs: ["law-policy"],
    canonicalTerm: "Corporate & Commercial Law",
    targetSpecializationIds: ["corporate-commercial-law"],
    targetRoleIds: ["corporate-associate"],
  },
  "data scientist": {
    targetPathSlugs: ["ai-ml-data-science"],
    canonicalTerm: "Data Science",
    targetSpecializationIds: ["data-science"],
    targetRoleIds: ["data-scientist"],
  },
  frontend: {
    targetPathSlugs: ["software-development"],
    canonicalTerm: "Frontend Engineering",
    targetSpecializationIds: ["web-app-eng"],
    targetRoleIds: ["frontend-dev"],
  },
  "frontend developer": {
    targetPathSlugs: ["software-development"],
    canonicalTerm: "Frontend Engineering",
    targetSpecializationIds: ["web-app-eng"],
    targetRoleIds: ["frontend-dev"],
  },
  "backend developer": {
    targetPathSlugs: ["software-development"],
    canonicalTerm: "Backend Engineering",
    targetSpecializationIds: ["web-app-eng"],
    targetRoleIds: ["backend-dev"],
  },
  doctor: {
    targetPathSlugs: ["medicine-healthcare"],
    canonicalTerm: "Medicine & Clinical Practice",
    targetSpecializationIds: ["clinical-internal-med", "surgery-acute"],
    targetRoleIds: ["clinical-physician", "internist", "general-surgeon"],
  },
  data: {
    targetPathSlugs: ["ai-ml-data-science", "data-engineering-platforms", "data-analytics-bi"],
    canonicalTerm: "Data Science & Data Engineering",
    targetSpecializationIds: [
      "data-science",
      "data-pipelines",
      "data-warehousing",
      "analytics-bi",
      "quantitative-modeling",
    ],
    targetRoleIds: [
      "data-scientist",
      "data-engineer",
      "data-analyst",
      "analytics-engineer",
      "quant-analytics-analyst",
    ],
  },
  design: {
    targetPathSlugs: ["design-creative", "visual-brand-communication"],
    canonicalTerm: "Design & Creative",
    targetSpecializationIds: [
      "ux-product-experience",
      "design-systems-ui",
      "brand-identity",
    ],
    targetRoleIds: [
      "product-designer",
      "ui-designer",
      "ux-researcher",
      "design-systems-designer",
      "brand-designer",
    ],
  },
  engineering: {
    targetPathSlugs: [
      "software-development",
      "ai-ml-data-science",
      "data-engineering-platforms",
      "cloud-infrastructure",
      "cybersecurity",
      "engineering",
      "iot-connected-systems",
      "robotics-automation",
    ],
    canonicalTerm: "Engineering & Technology",
  },
  healthcare: {
    targetPathSlugs: ["medicine-healthcare", "biomedical-pharmaceutical", "public-health-epidemiology"],
    canonicalTerm: "Healthcare & Life Sciences",
    targetSpecializationIds: [
      "clinical-internal-med",
      "surgery-acute",
      "bioinformatics-precision-therapeutics",
    ],
    targetRoleIds: ["clinical-physician", "general-surgeon", "genomics-data-scientist"],
  },
  finance: {
    targetPathSlugs: ["finance-investment"],
    canonicalTerm: "Finance & FinTech",
    targetSpecializationIds: [
      "investment-banking",
      "corporate-finance-fpa",
      "quant-fintech",
    ],
    targetRoleIds: [
      "ib-analyst",
      "fpa-analyst",
      "finance-manager",
      "quant-analyst",
      "fintech-pm",
      "algo-trader",
      "equity-research-assoc",
      "portfolio-manager",
      "treasury-analyst",
    ],
  },
  fin: {
    targetPathSlugs: ["finance-investment"],
    canonicalTerm: "Finance & FinTech",
    targetSpecializationIds: [
      "investment-banking",
      "corporate-finance-fpa",
      "quant-fintech",
    ],
    targetRoleIds: [
      "fpa-analyst",
      "ib-analyst",
      "quant-analyst",
      "fintech-pm",
      "finance-manager",
    ],
  },
  fintech: {
    targetPathSlugs: ["finance-investment"],
    canonicalTerm: "Finance & FinTech",
    targetSpecializationIds: ["quant-fintech"],
    targetRoleIds: ["fintech-pm", "algo-trader", "quant-analyst"],
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
    [/red[\s-]team/g, "red team"],
    [/redteam/g, "red team"],
    [/blue[\s-]team/g, "blue team"],
    [/blueteam/g, "blue team"],
    [/dev[\s-]?sec[\s-]?ops/g, "devsecops"],
    [/info[\s-]sec/g, "infosec"],
    [/cyber[\s-]security/g, "cybersecurity"],
    [/internet[\s-]of[\s-]things/g, "iot"],
    [/fin[\s-]tech/g, "fintech"],
    [/fintech/g, "fin tech"],
  ];
  for (const [pattern, replacement] of pairs) {
    if (pattern.test(norm)) {
      variations.add(norm.replace(pattern, replacement));
    }
  }

  const collapsed = norm.replace(/[^a-z0-9]/g, "");
  if (collapsed.length >= 2) variations.add(collapsed);

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
  MULTI_TOKEN_ROLE: 85,
  MULTI_TOKEN_SPEC: 75,
  MULTI_TOKEN_PATH: 70,
  PREFIX_ROLE: 65,
  PREFIX_SPEC: 60,
  PREFIX_PATH: 55,
  PREFIX_DOMAIN: 45,
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
      targetRoadmapUrl: `/career/${path.slug}#roadmap`,
      matchedRoles: [],
      matchedSpecializations: [],
    }));
  }

  // 1. MINIMUM QUERY LENGTH:
  // If the normalized query contains fewer than 2 meaningful characters:
  // Do NOT perform broad career matching (e.g. "a" returns [])
  if (query.length < 2) {
    return [];
  }

  const domainFilter =
    options?.domainId && options.domainId !== "all" ? options.domainId : null;

  const queryTokens = tokenize(query);
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

  function expandPath(
    targetPath: CareerPath,
    pathScore: number,
    matchType: CareerSearchResult["matchType"],
    matchedAlias?: string
  ) {
    upsertPath(`path:${targetPath.slug}`, {
      path: targetPath,
      score: pathScore,
      matchType,
      matchedAlias,
    });

    for (const spec of targetPath.specializations) {
      upsertSpec(`spec:${targetPath.slug}:${spec.id}`, {
        path: targetPath,
        spec,
        score: Math.max(10, pathScore - 15),
        matchType,
        matchedAlias,
      });

      for (const role of spec.roles) {
        upsertRole(`role:${targetPath.slug}:${spec.id}:${role.id}`, {
          path: targetPath,
          spec,
          role,
          score: Math.max(5, pathScore - 25),
          matchType,
          matchedAlias,
        });
      }
    }
  }

  function expandSpec(
    targetPath: CareerPath,
    targetSpec: CareerSpecialization,
    specScore: number,
    matchType: CareerSearchResult["matchType"],
    matchedAlias?: string
  ) {
    upsertSpec(`spec:${targetPath.slug}:${targetSpec.id}`, {
      path: targetPath,
      spec: targetSpec,
      score: specScore,
      matchType,
      matchedAlias,
    });

    upsertPath(`path:${targetPath.slug}`, {
      path: targetPath,
      score: Math.max(15, specScore - 10),
      matchType,
      matchedAlias,
    });

    for (const role of targetSpec.roles) {
      upsertRole(`role:${targetPath.slug}:${targetSpec.id}:${role.id}`, {
        path: targetPath,
        spec: targetSpec,
        role,
        score: Math.max(10, specScore - 15),
        matchType,
        matchedAlias,
      });
    }
  }

  function expandRole(
    targetPath: CareerPath,
    targetSpec: CareerSpecialization,
    targetRole: CareerRole,
    roleScore: number,
    matchType: CareerSearchResult["matchType"],
    matchedAlias?: string
  ) {
    upsertRole(`role:${targetPath.slug}:${targetSpec.id}:${targetRole.id}`, {
      path: targetPath,
      spec: targetSpec,
      role: targetRole,
      score: roleScore,
      matchType,
      matchedAlias,
    });

    upsertSpec(`spec:${targetPath.slug}:${targetSpec.id}`, {
      path: targetPath,
      spec: targetSpec,
      score: Math.max(15, roleScore - 20),
      matchType,
      matchedAlias,
    });

    upsertPath(`path:${targetPath.slug}`, {
      path: targetPath,
      score: Math.max(10, roleScore - 30),
      matchType,
      matchedAlias,
    });
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
    for (const v of variations) {
      const aliasData = CANONICAL_CAREER_ALIASES[v];
      if (aliasData) {
        if (aliasData.targetPathSlugs.includes(path.slug)) {
          expandPath(path, SCORES.ALIAS_PATH, "alias", aliasData.canonicalTerm);
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
    }

    // ── 2. EXACT AND WORD BOUNDARY TOKEN MATCHING ────────────────────────────
    for (const v of variations) {
      for (const spec of path.specializations) {
        for (const role of spec.roles) {
          const normRoleTitle = normalizeText(role.title);
          if (normRoleTitle === v) {
            expandRole(path, spec, role, SCORES.EXACT_ROLE, "exact_role");
          } else if (matchesWordBoundary(role.title, v)) {
            expandRole(path, spec, role, SCORES.TOKEN_ROLE, "token_role");
          }

          if (role.aliases) {
            for (const a of role.aliases) {
              const normA = normalizeText(a);
              if (normA === v || matchesWordBoundary(a, v)) {
                expandRole(path, spec, role, SCORES.ALIAS_ROLE, "alias", a);
              }
            }
          }

          if (role.keywords) {
            for (const k of role.keywords) {
              const normK = normalizeText(k);
              if (normK === v || matchesWordBoundary(k, v)) {
                expandRole(path, spec, role, SCORES.TOKEN_ROLE, "token_role");
              }
            }
          }
        }

        const normSpecName = normalizeText(spec.name);
        if (normSpecName === v) {
          expandSpec(path, spec, SCORES.EXACT_SPEC, "exact_specialization");
        } else if (matchesWordBoundary(spec.name, v)) {
          expandSpec(path, spec, SCORES.TOKEN_SPEC, "token_specialization");
        }

        if (spec.aliases) {
          for (const a of spec.aliases) {
            const normA = normalizeText(a);
            if (normA === v || matchesWordBoundary(a, v)) {
              expandSpec(path, spec, SCORES.ALIAS_SPEC, "alias", a);
            }
          }
        }

        if (spec.keywords) {
          for (const k of spec.keywords) {
            const normK = normalizeText(k);
            if (normK === v || matchesWordBoundary(k, v)) {
              expandSpec(path, spec, SCORES.TOKEN_SPEC, "token_specialization");
            }
          }
        }
      }

      if (normPathName === v || normPathTitle === v || normCareerName === v) {
        expandPath(path, SCORES.EXACT_PATH, "exact_path");
      } else if (
        matchesWordBoundary(path.name, v) ||
        matchesWordBoundary(path.title, v) ||
        matchesWordBoundary(path.careerName, v)
      ) {
        expandPath(path, SCORES.TOKEN_PATH, "token_path");
      }

      if (path.aliases) {
        for (const a of path.aliases) {
          const normA = normalizeText(a);
          if (normA === v || matchesWordBoundary(a, v)) {
            expandPath(path, SCORES.ALIAS_PATH, "alias", a);
          }
        }
      }

      if (path.keywords) {
        for (const k of path.keywords) {
          const normK = normalizeText(k);
          if (normK === v || matchesWordBoundary(k, v)) {
            expandPath(path, SCORES.TOKEN_PATH, "token_path");
          }
        }
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

    // ── 3. MULTI-TOKEN COVERAGE ───────────────────────────────────────────────
    if (queryTokens.length > 1) {
      for (const spec of path.specializations) {
        for (const role of spec.roles) {
          const roleTokens = tokenize(role.title);
          const allInRole = queryTokens.every((qt) =>
            roleTokens.some(
              (rt) => rt === qt || (qt.length >= 2 && rt.startsWith(qt))
            )
          );
          if (allInRole) {
            expandRole(path, spec, role, SCORES.MULTI_TOKEN_ROLE, "multi_token");
          }
        }

        const specTokens = tokenize(spec.name);
        const allInSpec = queryTokens.every((qt) =>
          specTokens.some(
            (st) => st === qt || (qt.length >= 2 && st.startsWith(qt))
          )
        );
        if (allInSpec) {
          expandSpec(path, spec, SCORES.MULTI_TOKEN_SPEC, "multi_token");
        }
      }

      const allInPath = queryTokens.every((qt) =>
        pathTokens.some((pt) => pt === qt || (qt.length >= 2 && pt.startsWith(qt)))
      );
      if (allInPath) {
        expandPath(path, SCORES.MULTI_TOKEN_PATH, "multi_token");
      }
    }

    // ── 4. TOKEN-BASED PREFIX MATCHING (query >= 2 chars) ─────────────────────
    if (query.length >= 2) {
      for (const spec of path.specializations) {
        for (const role of spec.roles) {
          const roleTokens = tokenize(role.title);
          const roleAliasTokens = role.aliases ? role.aliases.flatMap((a) => tokenize(a)) : [];
          const roleKeywordTokens = role.keywords ? role.keywords.flatMap((k) => tokenize(k)) : [];
          const allRoleTokens = [...roleTokens, ...roleAliasTokens, ...roleKeywordTokens];

          if (allRoleTokens.some((rt) => rt.length >= 2 && rt.startsWith(query))) {
            expandRole(path, spec, role, SCORES.PREFIX_ROLE, "prefix");
          }
        }

        const specTokens = tokenize(spec.name);
        const specAliasTokens = spec.aliases ? spec.aliases.flatMap((a) => tokenize(a)) : [];
        const specKeywordTokens = spec.keywords ? spec.keywords.flatMap((k) => tokenize(k)) : [];
        const allSpecTokens = [...specTokens, ...specAliasTokens, ...specKeywordTokens];

        if (allSpecTokens.some((st) => st.length >= 2 && st.startsWith(query))) {
          expandSpec(path, spec, SCORES.PREFIX_SPEC, "prefix");
        }
      }

      const pathKey = `path:${path.slug}`;
      const pathAliasTokens = path.aliases ? path.aliases.flatMap((a) => tokenize(a)) : [];
      const pathKeywordTokens = path.keywords ? path.keywords.flatMap((k) => tokenize(k)) : [];
      const allPathTokens = [...pathTokens, ...pathAliasTokens, ...pathKeywordTokens];

      if (allPathTokens.some((pt) => pt.length >= 2 && pt.startsWith(query))) {
        expandPath(path, SCORES.PREFIX_PATH, "prefix");
      } else if (domainTokens.some((dt) => dt.length >= 2 && dt.startsWith(query))) {
        if (!scoredPaths.has(pathKey)) {
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

  const maxPerGroup = options?.maxPerGroup ?? 10;
  const maxTotal = options?.maxTotal ?? 30;

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
      .map((r) => r.role.title)
      .slice(0, 6);

    results.push({
      entityType: "path",
      relevanceScore: sp.score,
      matchType: sp.matchType,
      path: sp.path,
      targetRoadmapUrl: `/career/${sp.path.slug}#roadmap`,
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
      targetRoadmapUrl: `/career/${ss.path.slug}?tab=roadmap&spec=${ss.spec.id}#roadmap`,
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
    const normRoleTitle = normalizeText(sr.role.title);
    const isExactRole = sr.matchType === "exact_role" || normRoleTitle === query;
    const isMultiTokenRole = queryTokens.length > 1 && sr.matchType === "multi_token";
    const isRoleSpecificAlias = Boolean(
      sr.role.aliases && sr.role.aliases.some((a) => normalizeText(a) === query)
    );

    const aliasData = CANONICAL_CAREER_ALIASES[query.toLowerCase()];
    const isSingleRoleAliasTarget = Boolean(
      aliasData?.targetRoleIds &&
      aliasData.targetRoleIds.length === 1 &&
      aliasData.targetRoleIds[0] === sr.role.id
    );

    const isSpecific =
      (sr.score >= SCORES.TOKEN_ROLE &&
        (isExactRole || isMultiTokenRole || isRoleSpecificAlias)) ||
      isSingleRoleAliasTarget;

    results.push({
      entityType: "role",
      relevanceScore: sr.score,
      matchType: sr.matchType,
      path: sr.path,
      specialization: sr.spec,
      role: sr.role,
      targetRoadmapUrl: `/career/${sr.path.slug}?tab=roadmap&spec=${sr.spec.id}&role=${sr.role.id}#roadmap`,
      isSpecificRoleMatch: isSpecific,
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

  // Determine if this is a role-specific query (e.g. "Data Scientist", "Corporate Lawyer", "Frontend Developer")
  const hasSpecificRole = roles.some((r) => r.isSpecificRoleMatch);

  const groups: CareerSearchResultGroup[] = [];
  if (hasSpecificRole) {
    if (roles.length > 0) groups.push({ label: "Roles", results: roles });
    if (paths.length > 0) groups.push({ label: "Career Paths", results: paths });
    if (specs.length > 0) groups.push({ label: "Specializations", results: specs });
  } else {
    if (paths.length > 0) groups.push({ label: "Career Paths", results: paths });
    if (specs.length > 0) groups.push({ label: "Specializations", results: specs });
    if (roles.length > 0) groups.push({ label: "Roles", results: roles });
  }

  return groups;
}

