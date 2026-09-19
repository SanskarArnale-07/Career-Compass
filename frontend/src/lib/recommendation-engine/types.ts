/**
 * Adaptive Recommendation Engine — Types
 *
 * Defines the contract for explainable, deterministic recommendations
 * synthesized from Career Intelligence, Context, Roadmap, and Progress.
 */

import type { CareerIntelligence } from "../career-intelligence";
import type { PersonalizedRoadmap } from "../roadmap-engine";
import type { CareerReadinessReport } from "../progress-engine";
import type { UserProgressState } from "../career-details/roadmap-intelligence";

export type RecommendationType =
  | "prerequisite-blocker"     // Stalled roadmap / unfinished prerequisite
  | "missing-foundation"       // Missing foundational skill or mental model
  | "foundation-next-step"     // Completed foundation -> recommend next core skill
  | "missing-project"          // Missing project experience -> recommend first deliverable
  | "next-project"             // Completed project -> recommend next difficulty tier
  | "advanced-advancement"     // Strong skill coverage -> move toward advanced material
  | "career-preparation";      // Portfolio in place -> career prep / interview readiness

export type RecommendationPriority = "critical" | "high" | "medium" | "low";

export type RecommendationCategory = "learn" | "build" | "practice" | "prepare";

export interface RelatedEntity {
  kind: "skill" | "milestone" | "project" | "phase" | "prep";
  id: string | number;
  name: string;
  detail?: string;
}

export interface AdaptiveRecommendation {
  /** Unique deterministic identifier */
  id: string;

  /** Recommendation category type */
  type: RecommendationType;

  /** Action title */
  title: string;

  /** Explainable rationale: WHY this action is recommended right now */
  reason: string;

  /** The concrete skill, milestone, project, or phase associated */
  relatedEntity: RelatedEntity;

  /** Deterministic urgency/priority */
  priority: RecommendationPriority;

  /** Grounded source / context fact that triggered this recommendation */
  sourceContext: string;

  /** Category for UI presentation and icon mapping */
  category: RecommendationCategory;

  /** User-friendly CTA label */
  actionText: string;

  /** Estimated time required */
  estimatedEffort: string;
}

export interface GenerateRecommendationsInput {
  career: CareerIntelligence | string;
  traitProfile?: Record<string, number> | null;
  progress?: Partial<UserProgressState> | null;
  roadmap?: PersonalizedRoadmap | null;
  progressReport?: CareerReadinessReport | null;
  weeklyPaceHours?: number;
}

export interface AdaptiveRecommendationsResult {
  careerId: string;
  careerTitle: string;
  primaryRecommendation: AdaptiveRecommendation;
  recommendations: AdaptiveRecommendation[];
  contextSummary: {
    studentLevel: string;
    roadmapProgressPercent: number;
    skillsProgressPercent: number;
    projectsCompletedCount: number;
    topBottleneck: string;
  };
}
