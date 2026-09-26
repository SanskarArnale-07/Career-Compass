/**
 * Centralized Career Intelligence Layer — Public API
 *
 * Single point of access for all career domain knowledge in Career Compass.
 */

import {
  CAREER_INTELLIGENCE_REGISTRY,
  CAREER_NAME_TO_ID,
} from "./registry";
import { getAllCareerPaths, getCareerHierarchy } from "../career-hierarchy";
import type {
  CareerIntelligence,
  EducationPathway,
  IndustryInfo,
  SkillLevelBreakdown,
  SnapshotItem,
  SkillNode,
  RoadmapPhase,
  ProjectIdea,
  CareerStage,
  PreparationItem,
} from "./types";
import type {
  CareerHierarchyMatch,
  CareerRole,
  CareerSpecialization,
  CareerPath,
} from "../career-hierarchy";

export * from "./types";
export * from "../career-hierarchy";
export { CAREER_INTELLIGENCE_REGISTRY, CAREER_NAME_TO_ID };

/**
 * Normalizes an identifier (slug, id, or backend career name) into a canonical career record.
 */
export function resolveCareerIntelligence(
  identifier: string
): CareerIntelligence | undefined {
  if (!identifier) return undefined;

  // 1. Direct slug/id match
  if (CAREER_INTELLIGENCE_REGISTRY[identifier]) {
    return CAREER_INTELLIGENCE_REGISTRY[identifier];
  }

  // 2. Lookup by exact or case-insensitive backend careerName/alias
  const byNameId =
    CAREER_NAME_TO_ID[identifier] ||
    Object.entries(CAREER_NAME_TO_ID).find(
      ([k]) => k.toLowerCase() === identifier.toLowerCase().trim()
    )?.[1];
  if (byNameId && CAREER_INTELLIGENCE_REGISTRY[byNameId]) {
    return CAREER_INTELLIGENCE_REGISTRY[byNameId];
  }

  // 3. Case-insensitive search across slugs, IDs, titles, and career names
  const lower = identifier.toLowerCase().trim();
  const all = Object.values(CAREER_INTELLIGENCE_REGISTRY);

  const matched = all.find(
    (c) =>
      c.id.toLowerCase() === lower ||
      c.slug.toLowerCase() === lower ||
      c.careerName.toLowerCase() === lower ||
      c.title.toLowerCase() === lower
  );
  if (matched) return matched;

  // 4. Prefix or substring matching for common aliases/slugs (e.g. "ai-ml-data", "finance-fintech")
  const aliasMatched = all.find(
    (c) =>
      c.id.toLowerCase().startsWith(lower) ||
      lower.startsWith(c.id.toLowerCase()) ||
      c.careerName.toLowerCase().includes(lower) ||
      lower.includes(c.careerName.toLowerCase())
  );
  if (aliasMatched) return aliasMatched;

  // 5. Canonical Career Hierarchy fallback for all 25 catalogue paths, specializations, and roles
  const hierarchy = getCareerHierarchy(identifier);
  if (hierarchy) {
    if (CAREER_INTELLIGENCE_REGISTRY[hierarchy.path.slug]) {
      return CAREER_INTELLIGENCE_REGISTRY[hierarchy.path.slug];
    }
    const synthesized = buildCareerIntelligenceFromHierarchy(hierarchy);
    CAREER_INTELLIGENCE_REGISTRY[hierarchy.path.slug] = synthesized;
    CAREER_NAME_TO_ID[hierarchy.path.careerName.toLowerCase().trim()] = hierarchy.path.slug;
    CAREER_NAME_TO_ID[hierarchy.path.name.toLowerCase().trim()] = hierarchy.path.slug;
    return synthesized;
  }

  return undefined;
}

/**
 * Builds a rich, canonical CareerIntelligence object from a CareerHierarchyMatch.
 * Powers full career exploration, specializations, and roles for any of the 24 paths in the catalogue.
 */
function buildCareerIntelligenceFromHierarchy(
  hierarchy: CareerHierarchyMatch
): CareerIntelligence {
  const { domain, path, primarySpecialization } = hierarchy;
  const allRoles: CareerRole[] = path.specializations.flatMap((s: CareerSpecialization) => s.roles);
  const entryLevelRoles = allRoles.filter((r: CareerRole) => r.isEntryLevel);
  const seniorRoles = allRoles.filter((r: CareerRole) => !r.isEntryLevel);

  // Derive day-to-day responsibilities from actual roles
  const responsibilities = allRoles.slice(0, 5).map(
    (r: CareerRole) => r.description || `Design, implement, and maintain solutions as a ${r.title}.`
  );

  // Snapshot cards
  const snapshot: SnapshotItem[] = [
    { label: "Specializations", value: `${path.specializations.length} Areas`, icon: "Briefcase" },
    { label: "Career Roles", value: `${allRoles.length} Distinct Roles`, icon: "Users" },
    { label: "Domain Focus", value: domain.name, icon: "GraduationCap" },
    { label: "Hiring Demand", value: "High Growth", icon: "TrendingUp" },
    { label: "Average Salary", value: "$85,000 – $155,000", icon: "DollarSign" },
    { label: "Work Style", value: "Hybrid / Modern Workspace", icon: "Laptop" },
  ];

  // Skills generated from specialization roles
  const skills: SkillNode[] = path.specializations.flatMap((spec: CareerSpecialization) =>
    spec.roles.slice(0, 2).map((role: CareerRole) => ({
      id: `${spec.id}-${role.id}`,
      name: role.title,
      category: spec.name,
      relevantTraits: ["TI", "AC", "PS"],
      whyItMatters: role.description || `Essential competency within ${spec.name}.`,
      whatToKnow: `Industry fundamentals, modern toolsets, and best practices for ${role.title}.`,
      recommendedLevel: (role.isEntryLevel ? "Foundational" : "Advanced") as "Foundational" | "Advanced",
    }))
  );

  // 4 Phased Roadmap stages
  const roadmap: RoadmapPhase[] = [
    {
      id: "phase-1",
      phase: 1,
      title: `Foundations of ${path.careerName}`,
      description: `Core academic and technical principles underpinning ${path.name}.`,
      estimatedDuration: "Months 1–3",
      skills: entryLevelRoles.slice(0, 3).map((r: CareerRole) => r.title),
      learn: [
        `Fundamental concepts in ${path.careerName}`,
        `Core industry tools and software standards`,
        `Introductory methods in ${primarySpecialization?.name || "the discipline"}`,
      ],
      practice: [
        `Small targeted exercises exploring key concepts`,
        `Analyzing existing case studies and implementations`,
      ],
      build: `Comprehensive foundational starter project demonstrating core principles.`,
      resources: [
        {
          name: `${path.careerName} Starter Curriculum`,
          type: "course",
          difficulty: "beginner",
          estimatedTime: "25 hours",
          url: "https://careercompass.internal/courses/starter",
        },
      ],
    },
    {
      id: "phase-2",
      phase: 2,
      title: `Specialization Focus: ${primarySpecialization?.name || "Core Tracks"}`,
      description: `Diving into dedicated workflows, tooling, and architectural concepts.`,
      estimatedDuration: "Months 4–6",
      skills: (primarySpecialization?.roles || []).map((r: CareerRole) => r.title),
      learn: [
        `Advanced workflows in ${primarySpecialization?.name || path.name}`,
        `Modern platform integrations and tooling`,
      ],
      practice: [`End-to-end lab environments and specialized simulations`],
      build: `Applied system or platform demonstrating specialization competence.`,
      resources: [],
    },
    {
      id: "phase-3",
      phase: 3,
      title: "Applied Projects & Architecture",
      description: `Building production-ready implementations and multi-faceted systems.`,
      estimatedDuration: "Months 7–9",
      skills: seniorRoles.slice(0, 3).map((r: CareerRole) => r.title),
      learn: [
        `Scalability, reliability, and security considerations`,
        `Cross-functional collaboration with adjacent disciplines`,
      ],
      practice: [`Real-world problem solving and incident mitigation`],
      build: `Portfolio-grade production deployment or capstone project.`,
      resources: [],
    },
    {
      id: "phase-4",
      phase: 4,
      title: "Professional Role Readiness & Industry Capstone",
      description: `Interview preparation, portfolio review, and industry accreditation.`,
      estimatedDuration: "Months 10–12",
      skills: allRoles.slice(0, 4).map((r: CareerRole) => r.title),
      learn: [
        `System design interviews and case studies`,
        `Professional portfolio presentation`,
      ],
      practice: [`Mock technical and architectural interviews`],
      build: `End-to-end industry portfolio ready for hiring teams.`,
      resources: [],
    },
  ];

  // Projects derived from specializations
  const projects: ProjectIdea[] = path.specializations.map((spec: CareerSpecialization, idx: number) => ({
    title: `${spec.name} Project Architecture`,
    difficulty: (idx === 0 ? "beginner" : idx === 1 ? "intermediate" : "advanced") as "beginner" | "intermediate" | "advanced",
    skills: spec.roles.map((r: CareerRole) => r.title),
    description: `Design and deliver a fully functional implementation in ${spec.name}. ${spec.description}`,
    features: [
      `End-to-end implementation of key ${spec.name} workflows`,
      `Documented architecture and best-practice patterns`,
      `Interactive demonstration or deployable asset`,
    ],
    portfolioValue: `Demonstrates applied expertise in ${spec.name} to potential hiring managers.`,
  }));

  // Career stages
  const progression: CareerStage[] = [
    {
      title: "Associate / Entry-Level",
      yearsRange: "0–2 Years",
      responsibilities: [
        "Contribute to foundational tasks under senior guidance",
        "Master primary domain tooling and team workflows",
      ],
      skills: entryLevelRoles.map((r: CareerRole) => r.title).slice(0, 3),
      deltaFromPrevious: "Starting position following training or degree completion.",
    },
    {
      title: "Mid-Level Professional",
      yearsRange: "2–5 Years",
      responsibilities: [
        "Independently lead key project components and deliverables",
        "Refine system standards and mentor junior contributors",
      ],
      skills: allRoles.slice(0, 3).map((r: CareerRole) => r.title),
      deltaFromPrevious: "Independent execution and deep domain specialization.",
    },
    {
      title: "Senior Lead / Architect",
      yearsRange: "5+ Years",
      responsibilities: [
        "Shape organizational direction and comprehensive architectures",
        "Define best practices and evaluate emerging industry methodologies",
      ],
      skills: seniorRoles.map((r: CareerRole) => r.title).slice(0, 3),
      deltaFromPrevious: "High-level strategic authority and organizational ownership.",
    },
  ];

  // Preparation checklist
  const preparation: PreparationItem[] = [
    {
      id: "prep-1",
      category: "Foundations",
      task: `Master core ${path.careerName} concepts`,
      details: `Understand the fundamental principles of ${path.name} and its specializations.`,
    },
    {
      id: "prep-2",
      category: "Portfolio",
      task: "Build 2–3 end-to-end projects",
      details: "Showcase code, documentation, or case studies on GitHub or portfolio website.",
    },
    {
      id: "prep-3",
      category: "Certification",
      task: "Obtain recognized industry credentials",
      details: `Complete accredited certifications relevant to ${path.name}.`,
    },
  ];

  const relatedSlugs = domain.paths
    .filter((p: CareerPath) => p.slug !== path.slug)
    .map((p: CareerPath) => p.slug);

  return {
    slug: path.slug,
    id: path.slug,
    careerName: path.careerName,
    title: path.name,
    tagline: path.tagline,
    description: path.tagline,
    category: domain.name,
    icon: path.slug === "cybersecurity" ? "Shield" : "Briefcase",
    primaryTraits: ["TI", "AC", "PS"],
    snapshot,
    skills,
    roadmap,
    projects,
    progression,
    preparation,
    relatedSlugs,
    responsibilities,
    educationPath: {
      recommendedStream: domain.name,
      degrees: [
        `Bachelor's in ${path.careerName} or related discipline`,
        `Master's / Advanced specialization in ${path.name}`,
      ],
      keySubjects: path.specializations.map((s: CareerSpecialization) => s.name),
      certifications: [`Industry certification in ${path.name}`],
    },
    requiredSkills: allRoles.map((r: CareerRole) => r.title),
    beginnerSkills: entryLevelRoles.map((r: CareerRole) => r.title),
    intermediateSkills: seniorRoles.map((r: CareerRole) => r.title),
    advancedSkills: [`${path.name} Architecture`, `${path.name} Strategy`],
    toolsTechnologies: path.specializations.map((s: CareerSpecialization) => s.name),
    recommendedProjects: projects,
    certificationsResources: roadmap[0].resources,
    relatedCareers: relatedSlugs,
    careerProgression: progression,
    roleProgression: allRoles.map((r: CareerRole) => r.title),
    industryInfo: {
      sectors: [domain.name, path.name],
      workEnvironment: "Hybrid / Modern Workspace",
      difficultyToEnter: "Moderate",
      growthPotential: "High",
    },
  };
}

/**
 * Look up a career by its URL slug or ID.
 */
export function getCareerIntelligence(
  idOrSlug: string
): CareerIntelligence | undefined {
  return resolveCareerIntelligence(idOrSlug);
}

/**
 * Return all registered Career Intelligence objects.
 */
export function getAllCareerIntelligence(): CareerIntelligence[] {
  for (const path of getAllCareerPaths()) {
    if (!CAREER_INTELLIGENCE_REGISTRY[path.slug]) {
      const hierarchy = getCareerHierarchy(path.slug);
      if (hierarchy) {
        CAREER_INTELLIGENCE_REGISTRY[path.slug] = buildCareerIntelligenceFromHierarchy(hierarchy);
        CAREER_NAME_TO_ID[path.careerName.toLowerCase().trim()] = path.slug;
        CAREER_NAME_TO_ID[path.name.toLowerCase().trim()] = path.slug;
      }
    }
  }
  return Object.values(CAREER_INTELLIGENCE_REGISTRY);
}

/**
 * Return all career IDs / slugs.
 */
export function getAllCareerSlugs(): string[] {
  getAllCareerIntelligence();
  return Object.keys(CAREER_INTELLIGENCE_REGISTRY);
}

/**
 * Convert any career name or title to its URL slug.
 */
export function getCareerSlug(careerName: string): string {
  const resolved = resolveCareerIntelligence(careerName);
  if (resolved) return resolved.slug;
  return careerName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Return the role progression / sub-roles for a career.
 */
export function getCareerRoles(identifier: string): string[] {
  const career = resolveCareerIntelligence(identifier);
  if (!career || !career.roleProgression || career.roleProgression.length === 0) {
    return [
      "Junior Specialist",
      "Domain Analyst",
      "Lead Associate",
      "Strategic Director",
    ];
  }
  return career.roleProgression;
}

/**
 * Return the structured education pathway for a career.
 */
export function getCareerEducation(
  identifier: string
): EducationPathway | undefined {
  const career = resolveCareerIntelligence(identifier);
  return career?.educationPath;
}

/**
 * Return tools and technologies for a career.
 */
export function getCareerTools(identifier: string): string[] {
  const career = resolveCareerIntelligence(identifier);
  return career?.toolsTechnologies || [];
}

/**
 * Return categorized skill tiers (beginner, intermediate, advanced) for a career.
 */
export function getCareerSkillsByTier(
  identifier: string
): SkillLevelBreakdown {
  const career = resolveCareerIntelligence(identifier);
  if (!career) {
    return { beginner: [], intermediate: [], advanced: [] };
  }
  return {
    beginner: career.beginnerSkills,
    intermediate: career.intermediateSkills,
    advanced: career.advancedSkills,
  };
}

/**
 * Return industry information for a career.
 */
export function getCareerIndustry(
  identifier: string
): IndustryInfo | undefined {
  const career = resolveCareerIntelligence(identifier);
  return career?.industryInfo;
}
