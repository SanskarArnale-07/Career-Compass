/**
 * Career Details — Registry & exports
 *
 * Central lookup for all career detail data.
 * Maps URL slugs ↔ career names ↔ CareerDetail objects.
 */

import { softwareDevelopment } from "./careers/software-development";
import { aiMlDataScience } from "./careers/ai-ml-data";
import { engineering } from "./careers/engineering";
import { medicineHealthcare } from "./careers/medicine";
import { scientificResearch } from "./careers/scientific-research";
import { financeInvestment } from "./careers/finance";
import { entrepreneurship } from "./careers/entrepreneurship";
import { managementProduct } from "./careers/management";
import { marketingMedia } from "./careers/marketing-media";
import { designCreative } from "./careers/design-creative";
import { lawPolicy } from "./careers/law-policy";
import { psychologySocial } from "./careers/psychology-social";

import type { CareerDetail } from "./types";

// ── All careers indexed by slug ────────────────────────────────────
const CAREER_REGISTRY: Record<string, CareerDetail> = {
  "software-development": softwareDevelopment,
  "ai-ml-data-science": aiMlDataScience,
  "engineering": engineering,
  "medicine-healthcare": medicineHealthcare,
  "scientific-research": scientificResearch,
  "finance-investment": financeInvestment,
  "entrepreneurship": entrepreneurship,
  "management-product": managementProduct,
  "marketing-media": marketingMedia,
  "design-creative": designCreative,
  "law-policy": lawPolicy,
  "psychology-social": psychologySocial,
};

// ── Backend career name → slug mapping ─────────────────────────────
const NAME_TO_SLUG: Record<string, string> = Object.fromEntries(
  Object.values(CAREER_REGISTRY).map((c) => [c.careerName, c.slug])
);

// ── Public API ─────────────────────────────────────────────────────

/** Look up a career by its URL slug. */
export function getCareerBySlug(slug: string): CareerDetail | undefined {
  return CAREER_REGISTRY[slug];
}

/** Return every registered slug (useful for static generation). */
export function getAllCareerSlugs(): string[] {
  return Object.keys(CAREER_REGISTRY);
}

/** Convert a backend career name (e.g. "Software / App Development") to a URL slug. */
export function getCareerSlug(careerName: string): string {
  return NAME_TO_SLUG[careerName] ?? careerName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/,"");
}

/** Get all career detail objects (for listing pages). */
export function getAllCareers(): CareerDetail[] {
  return Object.values(CAREER_REGISTRY);
}

// ── Re-exports ─────────────────────────────────────────────────────
export type {
  CareerDetail,
  SnapshotItem,
  SkillNode,
  SkillStatus,
  StrengthGapItem,
  RoadmapPhase,
  LearningResource,
  ResourceType,
  ProjectIdea,
  ProjectDifficulty,
  CareerStage,
  PreparationItem,
} from "./types";
