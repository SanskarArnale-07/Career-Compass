/**
 * Centralized Career Intelligence Layer — Public API
 *
 * Single point of access for all career domain knowledge in Career Compass.
 */

import {
  CAREER_INTELLIGENCE_REGISTRY,
  CAREER_NAME_TO_ID,
} from "./registry";
import type {
  CareerIntelligence,
  EducationPathway,
  IndustryInfo,
  SkillLevelBreakdown,
} from "./types";

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

  return aliasMatched;
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
  return Object.values(CAREER_INTELLIGENCE_REGISTRY);
}

/**
 * Return all career IDs / slugs.
 */
export function getAllCareerSlugs(): string[] {
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
