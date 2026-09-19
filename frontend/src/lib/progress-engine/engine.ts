/**
 * Career Progress & Readiness Engine — Implementation
 *
 * Deterministic calculation engine that evaluates:
 * - Completed & incomplete skills with tiered coverage (beginner, intermediate, advanced)
 * - Milestone completion across canonical progression stages
 * - Portfolio project completion across difficulty tiers
 * - Career preparation checklist & internship eligibility
 * - Transparent readiness indicators with contributing factors
 *
 * Designed to provide transparent metrics without black-box misleading scores.
 */

import {
  resolveCareerIntelligence,
  getAllCareerIntelligence,
  type CareerIntelligence,
  type ProjectIdea,
  type PreparationItem,
  type ProjectDifficulty,
} from "../career-intelligence";
import {
  generatePersonalizedRoadmap,
  type PersonalizedRoadmap,
  type RoadmapMilestone,
  type ProgressionStage,
} from "../roadmap-engine";
import {
  calculateCareerReadiness,
  type UserProgressState,
  type CareerReadinessResult,
} from "../career-details/roadmap-intelligence";
import type { TraitProfile } from "../career-details/personalization";
import type {
  CalculateProgressInput,
  CareerReadinessReport,
  IndicatorStatus,
  MilestoneProgressSummary,
  PreparationProgressSummary,
  ProjectProgressSummary,
  ReadinessIndicator,
  RoadmapProgressSummary,
  SkillProgressSummary,
  StageMilestoneCoverage,
  TierCoverage,
} from "./types";

// ── Status Helper ──────────────────────────────────────────────────

export function deriveIndicatorStatus(percentage: number): IndicatorStatus {
  if (percentage <= 0) return "unstarted";
  if (percentage >= 100) return "mastered";
  if (percentage >= 60) return "proficient";
  return "in-progress";
}

// ── Normalize Match Helpers ────────────────────────────────────────

function normalizeString(val: string): string {
  return val.trim().toLowerCase();
}

function matchesAny(target: string, candidates: Set<string>): boolean {
  const norm = normalizeString(target);
  if (candidates.has(norm)) return true;
  // Partial check for IDs vs full names (e.g., "python" in "Python Fundamentals")
  for (const c of candidates) {
    if (c.length >= 3 && (norm.includes(c) || c.includes(norm))) {
      return true;
    }
  }
  return false;
}

// ── 1. Skill Progress & Tier Coverage ──────────────────────────────

export function calculateSkillProgress(
  career: CareerIntelligence | null | undefined,
  completedSkillsInput: string[] = [],
  _traits?: Record<string, number> | null
): SkillProgressSummary {
  const completedSet = new Set(completedSkillsInput.map(normalizeString));

  if (!career) {
    return {
      completedSkills: [],
      incompleteSkills: [],
      totalSkillsCount: 0,
      completedSkillsCount: 0,
      completionPercentage: 0,
      coverageByTier: {
        beginner: { total: 0, completed: 0, percentage: 0 },
        intermediate: { total: 0, completed: 0, percentage: 0 },
        advanced: { total: 0, completed: 0, percentage: 0 },
      },
    };
  }

  // 1. Gather all unique skills from career nodes and tiers
  const skillMap = new Map<string, { id: string; name: string }>();

  // Add from career.skills (SkillNodes)
  (career.skills || []).forEach((s) => {
    const key = normalizeString(s.name);
    if (!skillMap.has(key)) {
      skillMap.set(key, { id: s.id, name: s.name });
    }
  });

  // Add from requiredSkills
  (career.requiredSkills || []).forEach((name) => {
    const key = normalizeString(name);
    if (!skillMap.has(key)) {
      skillMap.set(key, { id: key, name });
    }
  });

  // Add from tier lists if not yet recorded
  [
    ...(career.beginnerSkills || []),
    ...(career.intermediateSkills || []),
    ...(career.advancedSkills || []),
  ].forEach((name) => {
    const key = normalizeString(name);
    if (!skillMap.has(key)) {
      skillMap.set(key, { id: key, name });
    }
  });

  const allSkills = Array.from(skillMap.values());
  const completedSkills: string[] = [];
  const incompleteSkills: string[] = [];

  for (const skill of allSkills) {
    const isCompleted =
      completedSet.has(normalizeString(skill.id)) ||
      completedSet.has(normalizeString(skill.name)) ||
      matchesAny(skill.id, completedSet) ||
      matchesAny(skill.name, completedSet);

    if (isCompleted) {
      completedSkills.push(skill.name);
    } else {
      incompleteSkills.push(skill.name);
    }
  }

  const totalSkillsCount = allSkills.length;
  const completedSkillsCount = completedSkills.length;
  const completionPercentage =
    totalSkillsCount > 0 ? Math.round((completedSkillsCount / totalSkillsCount) * 100) : 0;

  // 2. Compute Coverage by Tier
  const calcTierCoverage = (tierSkills: string[]): TierCoverage => {
    const total = tierSkills.length;
    if (total === 0) return { total: 0, completed: 0, percentage: 0 };

    let completed = 0;
    for (const name of tierSkills) {
      if (
        completedSet.has(normalizeString(name)) ||
        matchesAny(name, completedSet)
      ) {
        completed++;
      }
    }
    const percentage = Math.round((completed / total) * 100);
    return { total, completed, percentage };
  };

  // Fallback partitioning if tier lists are empty
  let beginnerTier = career.beginnerSkills || [];
  let intermediateTier = career.intermediateSkills || [];
  let advancedTier = career.advancedSkills || [];

  if (beginnerTier.length === 0 && intermediateTier.length === 0 && advancedTier.length === 0) {
    const third = Math.ceil(allSkills.length / 3);
    beginnerTier = allSkills.slice(0, third).map((s) => s.name);
    intermediateTier = allSkills.slice(third, third * 2).map((s) => s.name);
    advancedTier = allSkills.slice(third * 2).map((s) => s.name);
  }

  return {
    completedSkills,
    incompleteSkills,
    totalSkillsCount,
    completedSkillsCount,
    completionPercentage,
    coverageByTier: {
      beginner: calcTierCoverage(beginnerTier),
      intermediate: calcTierCoverage(intermediateTier),
      advanced: calcTierCoverage(advancedTier),
    },
  };
}

// ── 2. Milestone Progress & Stage Coverage ─────────────────────────

const ALL_STAGES: ProgressionStage[] = [
  "foundation",
  "core-skills",
  "applied-skills",
  "projects",
  "advanced-skills",
  "career-prep",
];

export function calculateMilestoneProgress(
  roadmap: PersonalizedRoadmap | null | undefined,
  progress?: Partial<UserProgressState> | null
): MilestoneProgressSummary {
  const completedTaskSet = new Set((progress?.completedTasks || []).map(normalizeString));

  const emptyStageCoverage: Record<ProgressionStage, StageMilestoneCoverage> = {
    foundation: { total: 0, completed: 0, percentage: 0 },
    "core-skills": { total: 0, completed: 0, percentage: 0 },
    "applied-skills": { total: 0, completed: 0, percentage: 0 },
    projects: { total: 0, completed: 0, percentage: 0 },
    "advanced-skills": { total: 0, completed: 0, percentage: 0 },
    "career-prep": { total: 0, completed: 0, percentage: 0 },
  };

  if (!roadmap || !roadmap.milestones || roadmap.milestones.length === 0) {
    return {
      completedMilestones: [],
      totalMilestonesCount: 0,
      completedMilestonesCount: 0,
      completionPercentage: 0,
      completedByStage: emptyStageCoverage,
      activeStage: "foundation",
      nextMilestone: null,
    };
  }

  const completedMilestones: string[] = [];
  const completedByStage = { ...emptyStageCoverage };

  // Initialize stage totals
  for (const stage of ALL_STAGES) {
    completedByStage[stage] = { total: 0, completed: 0, percentage: 0 };
  }

  let nextMilestone: RoadmapMilestone | null = null;

  for (const milestone of roadmap.milestones) {
    const stage = milestone.phaseStage;
    if (completedByStage[stage]) {
      completedByStage[stage].total++;
    }

    const isDone =
      milestone.completionState.isCompleted ||
      completedTaskSet.has(normalizeString(milestone.id)) ||
      completedTaskSet.has(normalizeString(milestone.title));

    if (isDone) {
      completedMilestones.push(milestone.title);
      if (completedByStage[stage]) {
        completedByStage[stage].completed++;
      }
    } else if (!nextMilestone && milestone.completionState.isUnlocked) {
      nextMilestone = milestone;
    }
  }

  // Fallback for next milestone if no unlocked one was selected yet
  if (!nextMilestone) {
    nextMilestone =
      roadmap.milestones.find(
        (m) =>
          !completedMilestones.includes(m.title) &&
          !completedTaskSet.has(normalizeString(m.id))
      ) || null;
  }

  // Calculate percentages per stage
  for (const stage of ALL_STAGES) {
    const { total, completed } = completedByStage[stage];
    completedByStage[stage].percentage =
      total > 0 ? Math.round((completed / total) * 100) : 0;
  }

  const totalMilestonesCount = roadmap.milestones.length;
  const completedMilestonesCount = completedMilestones.length;
  const completionPercentage =
    totalMilestonesCount > 0
      ? Math.round((completedMilestonesCount / totalMilestonesCount) * 100)
      : 0;

  // Determine active stage
  let activeStage: ProgressionStage = "career-prep";
  for (const stage of ALL_STAGES) {
    if (completedByStage[stage].percentage < 100 && completedByStage[stage].total > 0) {
      activeStage = stage;
      break;
    }
  }

  return {
    completedMilestones,
    totalMilestonesCount,
    completedMilestonesCount,
    completionPercentage,
    completedByStage,
    activeStage,
    nextMilestone,
  };
}

// ── 3. Project Progress & Difficulty Breakdown ─────────────────────

export function calculateProjectProgress(
  career: CareerIntelligence | null | undefined,
  completedProjectsInput: string[] = []
): ProjectProgressSummary {
  const completedSet = new Set(completedProjectsInput.map(normalizeString));

  const emptyDifficultyBreakdown: Record<
    ProjectDifficulty,
    { total: number; completed: number }
  > = {
    beginner: { total: 0, completed: 0 },
    intermediate: { total: 0, completed: 0 },
    advanced: { total: 0, completed: 0 },
  };

  if (!career || !career.recommendedProjects || career.recommendedProjects.length === 0) {
    return {
      completedProjects: [],
      totalProjectsCount: 0,
      completedProjectsCount: 0,
      completionPercentage: 0,
      completedByDifficulty: emptyDifficultyBreakdown,
      nextProjectToBuild: null,
    };
  }

  const completedProjects: string[] = [];
  const completedByDifficulty = {
    beginner: { total: 0, completed: 0 },
    intermediate: { total: 0, completed: 0 },
    advanced: { total: 0, completed: 0 },
  };

  let nextProjectToBuild: ProjectIdea | null = null;

  for (const project of career.recommendedProjects) {
    const diff = project.difficulty || "intermediate";
    if (completedByDifficulty[diff]) {
      completedByDifficulty[diff].total++;
    }

    const isDone =
      completedSet.has(normalizeString(project.title)) ||
      matchesAny(project.title, completedSet);

    if (isDone) {
      completedProjects.push(project.title);
      if (completedByDifficulty[diff]) {
        completedByDifficulty[diff].completed++;
      }
    } else if (!nextProjectToBuild) {
      nextProjectToBuild = project;
    }
  }

  const totalProjectsCount = career.recommendedProjects.length;
  const completedProjectsCount = completedProjects.length;
  const completionPercentage =
    totalProjectsCount > 0
      ? Math.round((completedProjectsCount / totalProjectsCount) * 100)
      : 0;

  return {
    completedProjects,
    totalProjectsCount,
    completedProjectsCount,
    completionPercentage,
    completedByDifficulty,
    nextProjectToBuild,
  };
}

// ── 4. Preparation Progress & Internship Eligibility ───────────────

export function calculatePreparationProgress(
  career: CareerIntelligence | null | undefined,
  completedTasksInput: string[] = [],
  overallReadinessScore: number = 0,
  completedProjectsCount: number = 0
): PreparationProgressSummary {
  const completedSet = new Set(completedTasksInput.map(normalizeString));

  if (!career || !career.preparation || career.preparation.length === 0) {
    return {
      completedTasks: [],
      totalTasksCount: 0,
      completedTasksCount: 0,
      completionPercentage: 0,
      pendingTasks: [],
      isInternshipReady: false,
    };
  }

  const completedTasks: string[] = [];
  const pendingTasks: PreparationItem[] = [];

  for (const item of career.preparation) {
    const isDone =
      completedSet.has(normalizeString(item.id)) ||
      completedSet.has(normalizeString(item.task)) ||
      matchesAny(item.id, completedSet);

    if (isDone) {
      completedTasks.push(item.task);
    } else {
      pendingTasks.push(item);
    }
  }

  const totalTasksCount = career.preparation.length;
  const completedTasksCount = completedTasks.length;
  const completionPercentage =
    totalTasksCount > 0
      ? Math.round((completedTasksCount / totalTasksCount) * 100)
      : 0;

  // Internship Readiness Rule:
  // Requires overall readiness >= 55, at least 1 completed project, and at least 2 prep tasks done.
  const isInternshipReady =
    overallReadinessScore >= 55 &&
    completedProjectsCount >= 1 &&
    completedTasksCount >= Math.min(2, totalTasksCount);

  return {
    completedTasks,
    totalTasksCount,
    completedTasksCount,
    completionPercentage,
    pendingTasks,
    isInternshipReady,
  };
}

// ── 5. Roadmap Progress ────────────────────────────────────────────

export function calculateRoadmapProgress(
  career: CareerIntelligence | null | undefined,
  completedPhasesInput: number[] = []
): RoadmapProgressSummary {
  if (!career || !career.roadmap || career.roadmap.length === 0) {
    return {
      completedPhases: [],
      totalPhasesCount: 0,
      completedPhasesCount: 0,
      completionPercentage: 0,
      activePhaseNumber: 0,
      activePhaseTitle: "No roadmap available",
    };
  }

  const completedPhases = [...new Set(completedPhasesInput)].sort((a, b) => a - b);
  const totalPhasesCount = career.roadmap.length;
  const completedPhasesCount = completedPhases.length;
  const completionPercentage =
    totalPhasesCount > 0
      ? Math.round((completedPhasesCount / totalPhasesCount) * 100)
      : 0;

  // Find first phase not completed
  const nextUncompletedPhase = career.roadmap.find((p) => !completedPhases.includes(p.phase));
  const activePhaseNumber = nextUncompletedPhase
    ? nextUncompletedPhase.phase
    : totalPhasesCount;
  const activePhaseTitle = nextUncompletedPhase
    ? nextUncompletedPhase.title
    : "Curriculum Complete";

  return {
    completedPhases,
    totalPhasesCount,
    completedPhasesCount,
    completionPercentage,
    activePhaseNumber,
    activePhaseTitle,
  };
}

// ── 6. Transparent Readiness Indicators ────────────────────────────

export function calculateTransparentReadinessIndicators(params: {
  career: CareerIntelligence | null | undefined;
  skills: SkillProgressSummary;
  milestones: MilestoneProgressSummary;
  projects: ProjectProgressSummary;
  preparation: PreparationProgressSummary;
  roadmap: RoadmapProgressSummary;
  readinessResult: CareerReadinessResult;
}): {
  foundations: ReadinessIndicator;
  skills: ReadinessIndicator;
  portfolio: ReadinessIndicator;
  preparation: ReadinessIndicator;
  overallReadiness: ReadinessIndicator;
} {
  const { skills, milestones, projects, preparation, roadmap, readinessResult } = params;

  // 1. Foundations Indicator
  const foundationsStatus = deriveIndicatorStatus(roadmap.completionPercentage);
  const foundationsContributingFactors: string[] = [
    `${roadmap.completedPhasesCount} of ${roadmap.totalPhasesCount} curriculum phases marked complete (${roadmap.completionPercentage}%)`,
    `Current Active Phase: Phase ${roadmap.activePhaseNumber} — ${roadmap.activePhaseTitle}`,
    `${milestones.completedMilestonesCount} of ${milestones.totalMilestonesCount} roadmap milestones achieved`,
  ];
  if (milestones.nextMilestone) {
    foundationsContributingFactors.push(`Immediate Next Milestone: "${milestones.nextMilestone.title}"`);
  }

  const foundations: ReadinessIndicator = {
    id: "foundations",
    label: "Curriculum & Mental Models",
    status: foundationsStatus,
    percentage: roadmap.completionPercentage,
    detail: `${roadmap.completedPhasesCount} of ${roadmap.totalPhasesCount} phases completed`,
    contributingFactors: foundationsContributingFactors,
  };

  // 2. Skills Indicator
  const skillsStatus = deriveIndicatorStatus(skills.completionPercentage);
  const skillsContributingFactors: string[] = [
    `${skills.completedSkillsCount} of ${skills.totalSkillsCount} total domain competencies verified (${skills.completionPercentage}%)`,
    `Beginner tier: ${skills.coverageByTier.beginner.completed}/${skills.coverageByTier.beginner.total} verified (${skills.coverageByTier.beginner.percentage}%)`,
    `Intermediate tier: ${skills.coverageByTier.intermediate.completed}/${skills.coverageByTier.intermediate.total} verified (${skills.coverageByTier.intermediate.percentage}%)`,
    `Advanced tier: ${skills.coverageByTier.advanced.completed}/${skills.coverageByTier.advanced.total} verified (${skills.coverageByTier.advanced.percentage}%)`,
  ];
  if (skills.incompleteSkills.length > 0) {
    const topGaps = skills.incompleteSkills.slice(0, 3).join(", ");
    skillsContributingFactors.push(`High priority pending skills: ${topGaps}`);
  }

  const skillsIndicator: ReadinessIndicator = {
    id: "skills",
    label: "Technical Skill Competency",
    status: skillsStatus,
    percentage: skills.completionPercentage,
    detail: `${skills.completedSkillsCount} of ${skills.totalSkillsCount} skills verified`,
    contributingFactors: skillsContributingFactors,
  };

  // 3. Portfolio Indicator
  const portfolioStatus = deriveIndicatorStatus(projects.completionPercentage);
  const portfolioContributingFactors: string[] = [
    `${projects.completedProjectsCount} of ${projects.totalProjectsCount} standalone portfolio projects shipped (${projects.completionPercentage}%)`,
    `Beginner projects: ${projects.completedByDifficulty.beginner.completed}/${projects.completedByDifficulty.beginner.total}`,
    `Intermediate projects: ${projects.completedByDifficulty.intermediate.completed}/${projects.completedByDifficulty.intermediate.total}`,
    `Advanced projects: ${projects.completedByDifficulty.advanced.completed}/${projects.completedByDifficulty.advanced.total}`,
  ];
  if (projects.nextProjectToBuild) {
    portfolioContributingFactors.push(
      `Next recommended build: "${projects.nextProjectToBuild.title}" (${projects.nextProjectToBuild.difficulty})`
    );
  }

  const portfolio: ReadinessIndicator = {
    id: "portfolio",
    label: "Portfolio & Verifiable Proof",
    status: portfolioStatus,
    percentage: projects.completionPercentage,
    detail: `${projects.completedProjectsCount} of ${projects.totalProjectsCount} projects shipped`,
    contributingFactors: portfolioContributingFactors,
  };

  // 4. Preparation Indicator
  const prepStatus = deriveIndicatorStatus(preparation.completionPercentage);
  const prepContributingFactors: string[] = [
    `${preparation.completedTasksCount} of ${preparation.totalTasksCount} career preparation items completed (${preparation.completionPercentage}%)`,
    preparation.isInternshipReady
      ? "Qualified for introductory internships and junior candidate screens"
      : "Building prerequisite portfolio proof and interview checklist for internship qualification",
  ];
  if (preparation.pendingTasks.length > 0) {
    prepContributingFactors.push(
      `Next prep action: "${preparation.pendingTasks[0].task}" (${preparation.pendingTasks[0].category})`
    );
  }

  const preparationIndicator: ReadinessIndicator = {
    id: "preparation",
    label: "Career & Interview Preparation",
    status: prepStatus,
    percentage: preparation.completionPercentage,
    detail: `${preparation.completedTasksCount} of ${preparation.totalTasksCount} checklist items done`,
    contributingFactors: prepContributingFactors,
  };

  // 5. Overall Multi-Pillar Readiness Indicator
  const overallStatus = deriveIndicatorStatus(readinessResult.overallScore);
  const overallContributingFactors: string[] = [
    `Foundations weight (35%): ${readinessResult.pillars.foundations.score}% competency`,
    `Skills weight (35%): ${readinessResult.pillars.skills.score}% competency`,
    `Portfolio & Proof weight (30%): ${readinessResult.pillars.portfolio.score}% competency`,
    `Current Stage: Level ${readinessResult.tierLevel} (${readinessResult.tierName})`,
    `Unlock Requirement: ${readinessResult.nextTierRequirement}`,
  ];

  const overallReadiness: ReadinessIndicator = {
    id: "overallReadiness",
    label: "Multi-Pillar Readiness Index",
    status: overallStatus,
    percentage: readinessResult.overallScore,
    detail: `Level ${readinessResult.tierLevel}: ${readinessResult.tierName}`,
    contributingFactors: overallContributingFactors,
  };

  return {
    foundations,
    skills: skillsIndicator,
    portfolio,
    preparation: preparationIndicator,
    overallReadiness,
  };
}

export function calculateCareerProgressAndReadiness(
  inputOrCareer: CalculateProgressInput | CareerIntelligence | string,
  maybeTraitProfile?: Record<string, number> | null,
  maybeProgress?: UserProgressState | any,
  maybeRoadmap?: PersonalizedRoadmap | null,
  maybePace?: number
): CareerReadinessReport {
  let input: CalculateProgressInput;
  if (
    typeof inputOrCareer === "object" &&
    inputOrCareer !== null &&
    "career" in inputOrCareer &&
    !("roadmap" in inputOrCareer && "skills" in inputOrCareer)
  ) {
    input = inputOrCareer as CalculateProgressInput;
  } else {
    input = {
      career: inputOrCareer as CareerIntelligence | string,
      traitProfile: maybeTraitProfile,
      progress: maybeProgress,
      roadmap: maybeRoadmap,
      weeklyPaceHours: maybePace,
    };
  }

  // 1. Resolve Target Career with safe fallback
  let career: CareerIntelligence | null = null;
  if (typeof input.career === "string") {
    const resolved = resolveCareerIntelligence(input.career);
    if (resolved) {
      career = resolved;
    } else {
      const all = getAllCareerIntelligence();
      career = all.length > 0 ? all[0] : null;
    }
  } else if (input.career) {
    career = input.career;
  }

  const progressState: UserProgressState = {
    completedPhases: input.progress?.completedPhases || [],
    completedTasks: input.progress?.completedTasks || [],
    completedSkills: input.progress?.completedSkills || [],
    completedProjects: input.progress?.completedProjects || [],
    weeklyPaceHours: input.weeklyPaceHours || input.progress?.weeklyPaceHours || 10,
  };

  const traits = input.traitProfile || null;
  const traitProfile: TraitProfile | null = traits
    ? {
        AN: traits["AN"] ?? 50,
        TE: traits["TE"] ?? 50,
        SC: traits["SC"] ?? 50,
        BU: traits["BU"] ?? 50,
        CR: traits["CR"] ?? 50,
        SO: traits["SO"] ?? 50,
        LE: traits["LE"] ?? 50,
        EX: traits["EX"] ?? 50,
      }
    : null;

  // 2. Generate or accept Personalized Roadmap
  const roadmap: PersonalizedRoadmap | null =
    input.roadmap ||
    (career
      ? generatePersonalizedRoadmap({
          career,
          traitProfile: traits,
          progress: progressState,
          weeklyPaceHours: progressState.weeklyPaceHours,
        })
      : null);

  // 3. Compute Individual Dimensions
  const skills = calculateSkillProgress(career, progressState.completedSkills, traits);
  const milestones = calculateMilestoneProgress(roadmap, progressState);
  const projects = calculateProjectProgress(career, progressState.completedProjects);
  const roadmapProgress = calculateRoadmapProgress(career, progressState.completedPhases);

  // 4. Compute Backward-Compatible 3-Pillar Readiness Result
  const compositeReadinessIndex: CareerReadinessResult = career
    ? calculateCareerReadiness(career, traitProfile, progressState)
    : {
        overallScore: 0,
        tierLevel: 1,
        tierName: "Explorer",
        tierDescription: "No career data available.",
        nextTierRequirement: "Select a valid career track to begin.",
        pillars: {
          foundations: {
            id: "foundations",
            label: "Foundations & Roadmap",
            score: 0,
            weight: 35,
            detail: "0 of 0 phases completed",
            iconName: "BookOpen",
          },
          skills: {
            id: "skills",
            label: "Skill Competency",
            score: 0,
            weight: 35,
            detail: "0 of 0 skills verified",
            iconName: "CheckCircle2",
          },
          portfolio: {
            id: "portfolio",
            label: "Portfolio & Proof",
            score: 0,
            weight: 30,
            detail: "0 of 0 projects completed",
            iconName: "FolderGit2",
          },
        },
      };

  // 5. Compute Preparation & Internship Readiness
  const preparation = calculatePreparationProgress(
    career,
    progressState.completedTasks,
    compositeReadinessIndex.overallScore,
    projects.completedProjectsCount
  );

  // 6. Compute Multi-Dimensional Transparent Indicators
  const indicators = calculateTransparentReadinessIndicators({
    career,
    skills,
    milestones,
    projects,
    preparation,
    roadmap: roadmapProgress,
    readinessResult: compositeReadinessIndex,
  });

  // 7. Gateway Readiness Flags
  const isJobReady =
    compositeReadinessIndex.overallScore >= 80 &&
    projects.completedProjectsCount >= 2 &&
    skills.completionPercentage >= 70;

  const isInternshipReady = preparation.isInternshipReady;

  // 8. Determine Actionable Next Action Rationale
  let nextActionRationale = "Start by exploring Phase 1 foundational concepts and setup.";
  if (milestones.nextMilestone) {
    nextActionRationale = `Focus on milestone "${milestones.nextMilestone.title}" (${milestones.nextMilestone.estimatedEffort.durationText}) to advance in ${milestones.activeStage}.`;
  } else if (projects.nextProjectToBuild) {
    nextActionRationale = `Build and deploy "${projects.nextProjectToBuild.title}" to expand verifiable portfolio proof.`;
  } else if (preparation.pendingTasks.length > 0) {
    nextActionRationale = `Complete preparation item: "${preparation.pendingTasks[0].task}" to finalize career launch.`;
  } else if (isJobReady) {
    nextActionRationale = "All primary milestones and capstones completed. Focus on live applications and interview practice.";
  }

  return {
    careerId: career?.id || "unknown",
    careerTitle: career?.title || "Career Track",
    studentLevel: roadmap?.studentLevel || "beginner",
    skills,
    milestones,
    projects,
    roadmap: roadmapProgress,
    preparation,
    indicators,
    compositeReadinessIndex,
    isJobReady,
    isInternshipReady,
    nextActionRationale,
  };
}
