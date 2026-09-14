/**
 * Career Details — Type Definitions
 *
 * Every career cluster in Career Compass is described by a single
 * `CareerDetail` object.  The shape is generic enough to support any
 * career while remaining concrete enough to power the UI directly.
 */

// ── Skill status (derived from trait profile at runtime) ───────────
export type SkillStatus = "strong" | "developing" | "needs-work";

// ── Snapshot cards ─────────────────────────────────────────────────
export interface SnapshotItem {
  label: string;
  value: string;
  icon: string; // Lucide icon name
}

// ── Strength / Gap item (personalised at runtime) ──────────────────
export interface StrengthGapItem {
  title: string;
  status: SkillStatus;
  explanation: string;
}

// ── Skill node (interactive skill list) ────────────────────────────
export interface SkillNode {
  id: string;
  name: string;
  category: string;
  /** Which trait codes contribute to this skill (for personalisation) */
  relevantTraits: string[];
  whyItMatters: string;
  whatToKnow: string;
  recommendedLevel: string;
}

// ── Learning resource ──────────────────────────────────────────────
export type ResourceType = "course" | "documentation" | "practice" | "video" | "book";

export interface LearningResource {
  name: string;
  type: ResourceType;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  url: string;
}

// ── Roadmap phase ──────────────────────────────────────────────────
export interface RoadmapPhase {
  id: string;
  phase: number;
  title: string;
  description: string;
  estimatedDuration: string;
  skills: string[];
  learn: string[];
  practice: string[];
  build: string;
  resources: LearningResource[];
}

// ── Project idea ───────────────────────────────────────────────────
export type ProjectDifficulty = "beginner" | "intermediate" | "advanced";

export interface ProjectIdea {
  title: string;
  difficulty: ProjectDifficulty;
  skills: string[];
  description: string;
  features: string[];
  portfolioValue: string;
}

// ── Career progression stage ───────────────────────────────────────
export interface CareerStage {
  title: string;
  yearsRange: string;
  responsibilities: string[];
  skills: string[];
  deltaFromPrevious: string;
}

// ── Preparation checklist item ─────────────────────────────────────
export interface PreparationItem {
  id: string;
  category: string;
  task: string;
  details: string;
}

// ── The full career detail record ──────────────────────────────────
export interface CareerDetail {
  /** URL-safe slug, e.g. "software-development" */
  slug: string;

  /** Exact career name as returned by the backend */
  careerName: string;

  /** Short human-friendly title for the hero */
  title: string;

  /** One-line description */
  tagline: string;

  /** Career category label */
  category: string;

  /** Lucide icon name */
  icon: string;

  /** Which trait codes are primary for this career */
  primaryTraits: string[];

  /** Snapshot cards — 6 items */
  snapshot: SnapshotItem[];

  /** Ordered skill tree */
  skills: SkillNode[];

  /** Learning roadmap phases */
  roadmap: RoadmapPhase[];

  /** Projects by difficulty tier */
  projects: ProjectIdea[];

  /** Career progression stages */
  progression: CareerStage[];

  /** Job/internship preparation checklist */
  preparation: PreparationItem[];

  /** Related career slugs (for the "also like" section) */
  relatedSlugs: string[];
}
