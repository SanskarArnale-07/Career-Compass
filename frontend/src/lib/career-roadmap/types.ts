/**
 * Hybrid Career Roadmap Data Model & Architecture Types
 *
 * Implements the 3-tier hierarchy:
 * Path Foundation -> Specialization Track -> Optional Role Capstone
 */

import type { RoadmapPhase, LearningResource } from "../career-details/types";

export type { RoadmapPhase, LearningResource };

/**
 * Role-level capstone or milestone customization.
 * Applied when a role genuinely diverges from sibling roles in the same specialization.
 */
export interface RoleRoadmapOverride {
  roleId: string;
  roleTitle?: string;
  /** Complete capstone phase that replaces or forms the final phase of the roadmap */
  capstonePhase?: {
    id: string;
    title: string;
    description: string;
    estimatedDuration: string;
    skills: string[];
    learn: string[];
    practice: string[];
    build: string;
    resources: LearningResource[];
  };
  /** Partial milestones to merge into an existing phase */
  phaseModifications?: {
    targetPhaseNumber?: number; // 1-based, defaults to final phase
    title?: string;
    description?: string;
    skillsToAdd?: string[];
    learnToAdd?: string[];
    practiceToAdd?: string[];
    buildOverride?: string;
    resourcesToAdd?: LearningResource[];
  };
}

/**
 * Specialization track providing intermediate and advanced learning specific to a sub-discipline.
 */
export interface SpecializationTrack {
  id: string;
  name: string;
  description?: string;
  /** Specialization-specific phases (typically 1–2 phases that build upon the Path Foundation) */
  phases: RoadmapPhase[];
  /** Optional role-specific overrides within this specialization */
  roleOverrides?: Record<string, RoleRoadmapOverride>;
}

/**
 * Full roadmap definition for a Career Path.
 */
export interface PathRoadmapDefinition {
  pathSlug: string;
  pathName: string;
  /** Core foundational phases shared across all specializations in this path */
  foundationalPhases: RoadmapPhase[];
  /** Default advanced phases when no specialization is selected */
  defaultAdvancedPhases?: RoadmapPhase[];
  /** Specialization tracks keyed by specialization ID */
  specializationTracks: Record<string, SpecializationTrack>;
  /** Direct role overrides keyed by role ID */
  roleOverrides?: Record<string, RoleRoadmapOverride>;
}

/**
 * Parameters for the canonical roadmap resolution function.
 */
export interface ResolveRoleRoadmapParams {
  pathSlug: string;
  specId?: string | null;
  roleId?: string | null;
}

/**
 * The final composed roadmap returned by the resolver.
 */
export interface ComposedRoleRoadmap {
  pathSlug: string;
  pathName: string;
  specId?: string;
  specName?: string;
  roleId?: string;
  roleTitle?: string;
  granularity: "PATH" | "SPECIALIZATION" | "ROLE";
  phases: RoadmapPhase[];
  meta: {
    foundationalPhasesCount: number;
    specializationPhasesCount: number;
    hasRoleOverride: boolean;
  };
}
