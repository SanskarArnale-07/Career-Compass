/**
 * Centralized Career Intelligence Layer — Types
 *
 * Defines the canonical data contract for all career knowledge in Career Compass.
 */

import type {
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
  CareerDetail,
} from "../career-details/types";

export type {
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
  CareerDetail,
};

export interface EducationPathway {
  recommendedStream: string;
  degrees: string[];
  keySubjects: string[];
  certifications?: string[];
  description?: string;
}

export interface IndustryInfo {
  sectors: string[];
  workEnvironment: string;
  difficultyToEnter: string;
  growthPotential: string;
  marketOutlook?: string;
}

export interface SkillLevelBreakdown {
  beginner: string[];
  intermediate: string[];
  advanced: string[];
}

export interface CareerIntelligence extends CareerDetail {
  /** Canonical career identifier, e.g. "software-development" */
  id: string;

  /** Primary description / summary */
  description: string;

  /** Core day-to-day responsibilities and functions */
  responsibilities: string[];

  /** Recommended academic stream, degrees, subjects, and certifications */
  educationPath: EducationPathway;

  /** Required competencies and technical skills */
  requiredSkills: string[];

  /** Categorized skill tiers */
  beginnerSkills: string[];
  intermediateSkills: string[];
  advancedSkills: string[];

  /** Key software, languages, frameworks, and developer tools */
  toolsTechnologies: string[];

  /** Recommended projects categorized by difficulty */
  recommendedProjects: ProjectIdea[];

  /** Certifications and learning resources */
  certificationsResources: LearningResource[];

  /** Related career IDs for cross-domain exploration */
  relatedCareers: string[];

  /** Stage progression throughout a career lifecycle */
  careerProgression: CareerStage[];

  /** Sub-roles and title hierarchy */
  roleProgression: string[];

  /** Industry and hiring market details */
  industryInfo: IndustryInfo;
}
