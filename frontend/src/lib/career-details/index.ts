/**
 * Career Details — Bridge & Compatibility Layer
 *
 * Delegates directly to the centralized Career Intelligence Layer.
 * Preserves 100% backward compatibility for all existing imports.
 */

import {
  getCareerIntelligence,
  getAllCareerIntelligence,
  getAllCareerSlugs,
  getCareerSlug,
  resolveCareerIntelligence,
  CAREER_INTELLIGENCE_REGISTRY,
} from "../career-intelligence";
import type { CareerDetail } from "./types";
import type { CareerIntelligence } from "../career-intelligence/types";

// ── Compatibility Map ──────────────────────────────────────────────
export const CAREER_REGISTRY: Record<string, CareerDetail> = CAREER_INTELLIGENCE_REGISTRY;

// ── Public API ─────────────────────────────────────────────────────

/** Look up a career by its URL slug or ID. */
export function getCareerBySlug(slug: string): CareerIntelligence | undefined {
  return getCareerIntelligence(slug);
}

/** Return every registered slug (useful for static generation). */
export { getAllCareerSlugs };

/** Convert a backend career name or title to a URL slug. */
export { getCareerSlug };

/** Get all career detail objects (for listing pages). */
export function getAllCareers(): CareerIntelligence[] {
  return getAllCareerIntelligence();
}

/** Resolve career from any identifier (slug, ID, backend name). */
export { resolveCareerIntelligence };

export { getMatchExplanation } from "./personalization";

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

export type {
  CareerIntelligence,
  EducationPathway,
  IndustryInfo,
  SkillLevelBreakdown,
} from "../career-intelligence/types";
