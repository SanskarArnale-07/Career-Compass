/**
 * Adaptive Recommendation Engine — Implementation
 *
 * Deterministic engine synthesizing Career Intelligence, Career Context,
 * Personalized Roadmap, and Progress State into explainable, prioritized actions.
 */

import {
  resolveCareerIntelligence,
  getAllCareerIntelligence,
  type CareerIntelligence,
  type ProjectIdea,
} from "../career-intelligence";
import {
  generatePersonalizedRoadmap,
  type PersonalizedRoadmap,
} from "../roadmap-engine";
import {
  calculateCareerProgressAndReadiness,
  type CareerReadinessReport,
} from "../progress-engine";
import type {
  NextBestAction,
  UserProgressState,
} from "../career-details/roadmap-intelligence";
import type {
  AdaptiveRecommendation,
  AdaptiveRecommendationsResult,
  GenerateRecommendationsInput,
  RecommendationPriority,
} from "./types";

// ── Priority Sorting Helper ────────────────────────────────────────

const PRIORITY_ORDER: Record<RecommendationPriority, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

function normalizeString(val: string): string {
  return val.trim().toLowerCase();
}

// ── Main Deterministic Engine ──────────────────────────────────────

export function generateAdaptiveRecommendations(
  inputOrCareer: GenerateRecommendationsInput | CareerIntelligence | string,
  maybeRoadmap?: PersonalizedRoadmap | null,
  maybeProgress?: UserProgressState | any,
  maybeTraits?: Record<string, number> | null
): AdaptiveRecommendationsResult {
  let input: GenerateRecommendationsInput;
  if (
    typeof inputOrCareer === "object" &&
    inputOrCareer !== null &&
    "career" in inputOrCareer &&
    !("roadmap" in inputOrCareer && "skills" in inputOrCareer)
  ) {
    input = inputOrCareer as GenerateRecommendationsInput;
  } else {
    const isProgressReport = maybeProgress && "compositeReadinessIndex" in maybeProgress;
    input = {
      career: inputOrCareer as CareerIntelligence | string,
      roadmap: maybeRoadmap,
      progressReport: isProgressReport ? (maybeProgress as CareerReadinessReport) : undefined,
      progress: isProgressReport
        ? {
            completedPhases: (maybeProgress as CareerReadinessReport).roadmap?.completedPhases || [],
            completedTasks: (maybeProgress as CareerReadinessReport).preparation?.completedTasks || [],
            completedSkills: (maybeProgress as CareerReadinessReport).skills?.completedSkills || [],
            completedProjects: (maybeProgress as CareerReadinessReport).projects?.completedProjects || [],
          }
        : maybeProgress?.progressReport || maybeProgress?.progressState || maybeProgress,
      traitProfile: maybeTraits,
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

  const traits = input.traitProfile || null;
  const rawProgress = input.progress as any;
  const progressState: UserProgressState = {
    completedPhases: rawProgress?.completedPhases || rawProgress?.roadmap?.completedPhases || [],
    completedTasks: rawProgress?.completedTasks || rawProgress?.preparation?.completedTasks || [],
    completedSkills: rawProgress?.completedSkills || rawProgress?.skills?.completedSkills || [],
    completedProjects: rawProgress?.completedProjects || rawProgress?.projects?.completedProjects || [],
    weeklyPaceHours: input.weeklyPaceHours || rawProgress?.weeklyPaceHours || 10,
  };

  // 2. Resolve or generate Roadmap and Progress Report
  const roadmap: PersonalizedRoadmap =
    input.roadmap ||
    generatePersonalizedRoadmap({
      career: career || "software-development",
      traitProfile: traits,
      progress: progressState,
      weeklyPaceHours: progressState.weeklyPaceHours,
    });

  const progressReport: CareerReadinessReport =
    input.progressReport ||
    calculateCareerProgressAndReadiness({
      career: career || "software-development",
      traitProfile: traits,
      progress: progressState,
      roadmap,
      weeklyPaceHours: progressState.weeklyPaceHours,
    });

  const candidates: AdaptiveRecommendation[] = [];

  const completedSkillsSet = new Set(progressState.completedSkills.map(normalizeString));
  const completedPhasesSet = new Set(progressState.completedPhases);

  // ─────────────────────────────────────────────────────────────────
  // RULE 1: Stalled Roadmap / Unfinished Prerequisite Blocker
  // ─────────────────────────────────────────────────────────────────
  // Trigger: User has attempted later phases or projects, but earlier foundational
  // milestones or prerequisite skills remain incomplete.
  const allMilestones = roadmap.milestones || [];
  for (const milestone of allMilestones) {
    if (milestone.completionState.isCompleted) continue;

    // Check if any prerequisite is unfinished
    const hasUnfinishedPrereq = milestone.prerequisites.some((prereqId) => {
      const prereqM = allMilestones.find((m) => m.id === prereqId);
      return prereqM && !prereqM.completionState.isCompleted;
    });

    const isSubsequentAttempted =
      Array.from(completedPhasesSet).some((p) => p > Math.floor(milestone.order / 2) + 1) ||
      (progressState.completedProjects.length > 0 && milestone.phaseStage === "foundation") ||
      (completedPhasesSet.size > 0 && !completedPhasesSet.has(1) && milestone.phaseStage === "foundation");

    if (hasUnfinishedPrereq && isSubsequentAttempted) {
      const blockerPrereq = milestone.prerequisites
        .map((pid) => allMilestones.find((m) => m.id === pid))
        .find((m) => m && !m.completionState.isCompleted);

      const targetMilestone = blockerPrereq || milestone;

      candidates.push({
        id: `rec-prereq-${targetMilestone.id}`,
        type: "prerequisite-blocker",
        title: `Unblock Prerequisite: ${targetMilestone.title}`,
        reason: `Your roadmap progress is currently blocked. Completing this essential prerequisite in ${targetMilestone.phaseStage} unlocks subsequent stages and ensures a solid technical foundation.`,
        relatedEntity: {
          kind: "milestone",
          id: targetMilestone.id,
          name: targetMilestone.title,
          detail: `Stage: ${targetMilestone.phaseStage}`,
        },
        priority: "critical",
        sourceContext: `Roadmap Engine: Milestone "${milestone.title}" has pending prerequisite "${targetMilestone.title}".`,
        category: "practice",
        actionText: "Resolve Prerequisite Milestone",
        estimatedEffort: targetMilestone.estimatedEffort.durationText,
      });
      break; // Only surface highest-level blocker
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // RULE 2: Missing Foundational Skill
  // ─────────────────────────────────────────────────────────────────
  // Trigger: Beginner tier coverage < 80% or Phase 1 foundational milestone incomplete.
  const beginnerCoverage = progressReport.skills.coverageByTier.beginner;
  const foundationMilestones = allMilestones.filter((m) => m.phaseStage === "foundation");
  const incompleteFoundationMilestone = foundationMilestones.find(
    (m) => !m.completionState.isCompleted
  );

  if (beginnerCoverage.percentage < 80 || incompleteFoundationMilestone) {
    const missingSkill =
      career?.beginnerSkills.find((s) => !completedSkillsSet.has(normalizeString(s))) ||
      career?.skills[0]?.name ||
      "Core Foundations";

    const targetMilestone = incompleteFoundationMilestone || foundationMilestones[0];

    candidates.push({
      id: `rec-foundation-${targetMilestone?.id || "phase-1"}`,
      type: "missing-foundation",
      title: `Master Foundational Skill: ${missingSkill}`,
      reason: `Every career journey begins with foundational literacy. Achieving beginner tier proficiency in ${missingSkill} equips you with the mental models required for hands-on projects.`,
      relatedEntity: {
        kind: "skill",
        id: missingSkill,
        name: missingSkill,
        detail: `Foundational milestone: ${targetMilestone?.title || "Phase 1"}`,
      },
      priority: progressState.completedPhases.length === 0 ? "critical" : "high",
      sourceContext: `Progress Engine: Beginner skill tier coverage is at ${beginnerCoverage.percentage}% (${beginnerCoverage.completed}/${beginnerCoverage.total} verified).`,
      category: "learn",
      actionText: "Study Core Foundations",
      estimatedEffort: targetMilestone?.estimatedEffort.durationText || "2–3 weeks",
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // RULE 3: Missing Project Experience
  // ─────────────────────────────────────────────────────────────────
  // Trigger: Curriculum is underway (Phase 1 complete or skills verified), but 0 projects built.
  const totalProjectsBuilt = progressReport.projects.completedProjectsCount;
  if (
    (progressReport.roadmap.completedPhasesCount >= 1 || beginnerCoverage.percentage >= 50) &&
    totalProjectsBuilt === 0
  ) {
    const beginnerProject: ProjectIdea | undefined =
      career?.recommendedProjects.find((p) => p.difficulty === "beginner") ||
      career?.recommendedProjects[0];

    if (beginnerProject) {
      candidates.push({
        id: `rec-missing-project-${normalizeString(beginnerProject.title).replace(/\s+/g, "-")}`,
        type: "missing-project",
        title: `Build Your First Deliverable: ${beginnerProject.title}`,
        reason: `You have completed foundational concepts, but have 0 verifiable projects. Shipping your first working application proves you can turn theory into functional deliverables and starts your recruiter portfolio.`,
        relatedEntity: {
          kind: "project",
          id: beginnerProject.title,
          name: beginnerProject.title,
          detail: `Difficulty: ${beginnerProject.difficulty.toUpperCase()}`,
        },
        priority: "critical",
        sourceContext: `Progress Engine: 0 of ${progressReport.projects.totalProjectsCount} projects shipped. Practical proof is required for portfolio readiness.`,
        category: "build",
        actionText: "Open Project Blueprint",
        estimatedEffort: "4–6 hours",
      });
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // RULE 4: Completed Foundation -> Recommend Next Skill
  // ─────────────────────────────────────────────────────────────────
  // Trigger: Beginner tier complete (>= 80%) or Phase 1 done, but intermediate skills incomplete.
  const intermediateCoverage = progressReport.skills.coverageByTier.intermediate;
  if (
    beginnerCoverage.percentage >= 80 &&
    intermediateCoverage.percentage < 70
  ) {
    const nextIntermediateSkill =
      career?.intermediateSkills.find((s) => !completedSkillsSet.has(normalizeString(s))) ||
      career?.skills.find((s) => !completedSkillsSet.has(normalizeString(s.name)))?.name ||
      "Intermediate Concepts";

    const coreMilestone = allMilestones.find(
      (m) => m.phaseStage === "core-skills" && !m.completionState.isCompleted
    );

    candidates.push({
      id: `rec-next-skill-${normalizeString(nextIntermediateSkill).replace(/\s+/g, "-")}`,
      type: "foundation-next-step",
      title: `Advance to Intermediate Skill: ${nextIntermediateSkill}`,
      reason: `With foundations secure, mastering ${nextIntermediateSkill} expands your ability into real-world production frameworks, database design, and workflow automation.`,
      relatedEntity: {
        kind: "skill",
        id: nextIntermediateSkill,
        name: nextIntermediateSkill,
        detail: `Progression stage: ${coreMilestone?.phaseStage || "core-skills"}`,
      },
      priority: "high",
      sourceContext: `Career Intelligence: Beginner tier is at ${beginnerCoverage.percentage}%. Advancing to intermediate competency (${intermediateCoverage.percentage}% current).`,
      category: "learn",
      actionText: "Learn Intermediate Skill",
      estimatedEffort: coreMilestone?.estimatedEffort.durationText || "2 weeks",
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // RULE 5: Completed Project -> Recommend Next Project
  // ─────────────────────────────────────────────────────────────────
  // Trigger: Has completed at least 1 project, but has incomplete intermediate or advanced projects.
  if (totalProjectsBuilt >= 1 && totalProjectsBuilt < progressReport.projects.totalProjectsCount) {
    const nextProjectToBuild = progressReport.projects.nextProjectToBuild;
    if (nextProjectToBuild) {
      candidates.push({
        id: `rec-next-project-${normalizeString(nextProjectToBuild.title).replace(/\s+/g, "-")}`,
        type: "next-project",
        title: `Ship Capstone Project: ${nextProjectToBuild.title}`,
        reason: `You successfully completed your previous project! Building this ${nextProjectToBuild.difficulty} project demonstrates scalable architecture, automated testing, and production readiness.`,
        relatedEntity: {
          kind: "project",
          id: nextProjectToBuild.title,
          name: nextProjectToBuild.title,
          detail: `Difficulty: ${nextProjectToBuild.difficulty.toUpperCase()}`,
        },
        priority: "high",
        sourceContext: `Portfolio Progress: ${totalProjectsBuilt} of ${progressReport.projects.totalProjectsCount} projects completed. Next tier: ${nextProjectToBuild.difficulty}.`,
        category: "build",
        actionText: "Review Project Blueprint",
        estimatedEffort: "8–12 hours",
      });
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // RULE 6: Strong Skill Coverage -> Move Toward Advanced Material
  // ─────────────────────────────────────────────────────────────────
  // Trigger: Intermediate skills >= 70% and at least 1 project completed.
  const advancedCoverage = progressReport.skills.coverageByTier.advanced;
  if (
    intermediateCoverage.percentage >= 70 &&
    totalProjectsBuilt >= 1 &&
    advancedCoverage.percentage < 80
  ) {
    const advMilestone = allMilestones.find(
      (m) => m.phaseStage === "advanced-skills" && !m.completionState.isCompleted
    );

    const nextAdvSkill =
      career?.advancedSkills.find((s) => !completedSkillsSet.has(normalizeString(s))) ||
      "System Architecture & Scaling";

    candidates.push({
      id: `rec-advanced-${normalizeString(nextAdvSkill).replace(/\s+/g, "-")}`,
      type: "advanced-advancement",
      title: `Specialize in Advanced Material: ${nextAdvSkill}`,
      reason: `Your core competencies and project deliverables demonstrate strong competence. Tackling ${nextAdvSkill} elevates your skills toward production-grade engineering and systems leadership.`,
      relatedEntity: {
        kind: "milestone",
        id: advMilestone?.id || "advanced-01",
        name: nextAdvSkill,
        detail: `Stage: advanced-skills`,
      },
      priority: "high",
      sourceContext: `Progress Engine: Intermediate skill coverage is at ${intermediateCoverage.percentage}%. Ready for advanced specialization (${advancedCoverage.percentage}% verified).`,
      category: "learn",
      actionText: "Dive into Advanced Architecture",
      estimatedEffort: advMilestone?.estimatedEffort.durationText || "3–4 weeks",
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // RULE 7: Career Preparation & Launch
  // ─────────────────────────────────────────────────────────────────
  // Trigger: Solid curriculum and portfolio in place, but career prep checklist incomplete.
  const pendingPrep = progressReport.preparation.pendingTasks;
  if (
    (progressReport.compositeReadinessIndex.overallScore >= 50 || totalProjectsBuilt >= 1) &&
    pendingPrep.length > 0
  ) {
    const topPrepItem = pendingPrep[0];
    candidates.push({
      id: `rec-prep-${topPrepItem.id}`,
      type: "career-preparation",
      title: `Career Launch Checkpoint: ${topPrepItem.task}`,
      reason: `Your technical foundation and projects are taking shape. Finalizing this preparation item (${topPrepItem.category}) ensures recruiters can review your work and evaluate you for opportunities.`,
      relatedEntity: {
        kind: "prep",
        id: topPrepItem.id,
        name: topPrepItem.task,
        detail: `Category: ${topPrepItem.category}`,
      },
      priority: progressReport.preparation.isInternshipReady ? "medium" : "high",
      sourceContext: `Preparation Progress: ${progressReport.preparation.completedTasksCount} of ${progressReport.preparation.totalTasksCount} checklist items verified.`,
      category: "prepare",
      actionText: "Complete Prep Checkpoint",
      estimatedEffort: "1–2 hours",
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // RULE 8: Complete Roadmap / All Complete Fallback
  // ─────────────────────────────────────────────────────────────────
  if (candidates.length === 0) {
    candidates.push({
      id: "rec-career-outreach",
      type: "career-preparation",
      title: "Portfolio Outreach & Interview Applications",
      reason: `You have successfully completed all core curriculum phases, shipped portfolio capstones, and verified domain skills. Direct your energy into technical interviews, networking, and active job applications!`,
      relatedEntity: {
        kind: "phase",
        id: 6,
        name: "Career Launch",
        detail: "All primary roadmap milestones completed",
      },
      priority: "high",
      sourceContext: `Roadmap Engine: 100% roadmap completion reached. Career Ready tier unlocked.`,
      category: "prepare",
      actionText: "Start Application Sprint",
      estimatedEffort: "Ongoing weekly",
    });
  }

  // ─────────────────────────────────────────────────────────────────
  // Deterministic Sorting & Deduplication
  // ─────────────────────────────────────────────────────────────────
  // Sort by priority weight desc, preserving rule order within same priority
  const seenIds = new Set<string>();
  const uniqueCandidates: AdaptiveRecommendation[] = [];

  for (const c of candidates) {
    if (!seenIds.has(c.id)) {
      seenIds.add(c.id);
      uniqueCandidates.push(c);
    }
  }

  uniqueCandidates.sort((a, b) => {
    const pA = PRIORITY_ORDER[a.priority];
    const pB = PRIORITY_ORDER[b.priority];
    if (pA !== pB) return pB - pA;
    return 0; // preserve deterministic relative insertion order
  });

  const primaryRecommendation = uniqueCandidates[0];

  // Derive context summary
  let topBottleneck = "None currently";
  if (primaryRecommendation.type === "prerequisite-blocker") {
    topBottleneck = `Prerequisite blocker: ${primaryRecommendation.title}`;
  } else if (primaryRecommendation.type === "missing-foundation") {
    topBottleneck = `Foundational competency: ${primaryRecommendation.relatedEntity.name}`;
  } else if (primaryRecommendation.type === "missing-project") {
    topBottleneck = `Portfolio proof: 0 projects built`;
  } else if (primaryRecommendation.type === "next-project") {
    topBottleneck = `Capstone deliverable: ${primaryRecommendation.relatedEntity.name}`;
  }

  return {
    careerId: career?.id || "unknown",
    careerTitle: career?.title || "Career Track",
    primaryRecommendation,
    recommendations: uniqueCandidates,
    contextSummary: {
      studentLevel: roadmap.studentLevel,
      roadmapProgressPercent: progressReport.roadmap.completionPercentage,
      skillsProgressPercent: progressReport.skills.completionPercentage,
      projectsCompletedCount: totalProjectsBuilt,
      topBottleneck,
    },
  };
}

// ── Bridge Helper: Map AdaptiveRecommendation to NextBestAction ───

export function mapRecommendationToNextBestAction(
  rec: AdaptiveRecommendation
): NextBestAction {
  let targetType: "phase" | "project" | "skill" | "prep" = "phase";
  if (rec.relatedEntity.kind === "project") targetType = "project";
  else if (rec.relatedEntity.kind === "skill") targetType = "skill";
  else if (rec.relatedEntity.kind === "prep") targetType = "prep";
  else targetType = "phase";

  return {
    id: rec.id,
    title: rec.title,
    subtitle: `${rec.relatedEntity.detail || rec.relatedEntity.name} • ${rec.priority.toUpperCase()} PRIORITY`,
    category: rec.category,
    reasoning: rec.reason,
    estimatedTime: rec.estimatedEffort,
    actionText: rec.actionText,
    targetType,
    targetId: rec.relatedEntity.id,
  };
}
