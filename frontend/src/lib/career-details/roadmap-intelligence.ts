/**
 * Adaptive Career Roadmap & Progress Intelligence Engine
 *
 * Pure functions for computing:
 * 1. Career Readiness Index (3-pillar: Foundations, Skills, Proof)
 * 2. Next Best Action ("What should I do next?")
 * 3. Adaptive Weekly Sprint goals
 * 4. Fast-track and bridge alerts based on trait assessment
 * 5. Time-to-readiness estimation based on study pace
 *
 * @deprecated (partial) — The canonical intelligence pipeline now lives in:
 *   - progress-engine/  → calculateCareerProgressAndReadiness (supersedes calculateCareerReadiness)
 *   - roadmap-engine/   → generatePersonalizedRoadmap
 *   - recommendation-engine/ → generateAdaptiveRecommendations (supersedes getNextBestAction logic)
 *
 * Functions still uniquely provided by this module (no canonical equivalent):
 *   - generateAdaptiveWeeklySprint()
 *   - getAdaptiveInsights()
 *   - calculateTimeToReadiness()
 */

import type { CareerDetail } from "./types";
import {
  type TraitProfile,
  getPersonalizedSkills,
} from "./personalization";
import {
  generateAdaptiveRecommendations,
  mapRecommendationToNextBestAction,
} from "../recommendation-engine";
import type { CareerIntelligence } from "../career-intelligence";

// ── State Model ───────────────────────────────────────────────────

export interface UserProgressState {
  completedPhases: number[];
  completedTasks: string[];
  completedSkills: string[];
  completedProjects: string[];
  weeklyPaceHours: number;
}

// ── Readiness Types ───────────────────────────────────────────────

export interface ReadinessPillar {
  id: "foundations" | "skills" | "portfolio";
  label: string;
  score: number; // 0–100
  weight: number;
  detail: string;
  iconName: string;
}

export interface CareerReadinessResult {
  overallScore: number; // 0–100
  tierLevel: 1 | 2 | 3 | 4;
  tierName: string;
  tierDescription: string;
  nextTierRequirement: string;
  pillars: {
    foundations: ReadinessPillar;
    skills: ReadinessPillar;
    portfolio: ReadinessPillar;
  };
}

// ── Next Best Action Types ────────────────────────────────────────

export interface NextBestAction {
  id: string;
  title: string;
  subtitle: string;
  category: "learn" | "build" | "practice" | "prepare";
  reasoning: string;
  estimatedTime: string;
  actionText: string;
  targetType: "phase" | "project" | "skill" | "prep";
  targetId: string | number;
}

// ── Adaptive Sprint Types ─────────────────────────────────────────

export interface SprintTask {
  id: string;
  title: string;
  category: "Curriculum" | "Skill Workout" | "Project Lab" | "Career Prep";
  priority: "Urgent" | "High Impact" | "Recommended";
  reason: string;
  done: boolean;
}

// ── Adaptive Insights Types ───────────────────────────────────────

export interface AdaptiveInsight {
  type: "fast-track" | "bridge" | "milestone";
  title: string;
  description: string;
  skillOrTraitName: string;
}

// ── 1. Career Readiness Index (3 Pillars) ─────────────────────────

export function calculateCareerReadiness(
  career: CareerDetail,
  traits: TraitProfile | null,
  progress: UserProgressState
): CareerReadinessResult {
  const totalPhases = Math.max(1, career.roadmap.length);
  const completedPhasesCount = progress.completedPhases.length;

  // Pillar 1: Foundations (Curriculum Coverage)
  const foundationsScore = Math.min(
    100,
    Math.round((completedPhasesCount / totalPhases) * 100)
  );

  // Pillar 2: Skill Competency (Traits + Manual Mastery)
  const personalizedSkills = traits
    ? getPersonalizedSkills(traits, career)
    : career.skills.map((s, i) => ({
        ...s,
        status: i === 0 ? ("strong" as const) : ("developing" as const),
      }));

  const totalSkills = Math.max(1, career.skills.length);
  let skillPoints = 0;

  for (const skill of personalizedSkills) {
    if (progress.completedSkills.includes(skill.id)) {
      skillPoints += 1.0; // fully mastered
    } else if (skill.status === "strong") {
      skillPoints += 0.65; // high natural aptitude
    } else if (skill.status === "developing") {
      skillPoints += 0.35; // developing
    } else {
      skillPoints += 0.1; // needs work
    }
  }

  const skillsScore = Math.min(100, Math.round((skillPoints / totalSkills) * 100));

  // Pillar 3: Portfolio & Proof (Projects + Job Prep)
  const totalProjects = Math.max(1, career.projects.length);
  const completedProjectsCount = progress.completedProjects.length;
  const projectPoints = (completedProjectsCount / totalProjects) * 65;

  const totalPrep = Math.max(1, career.preparation.length);
  const completedPrepCount = career.preparation.filter((p) =>
    progress.completedTasks.includes(p.id)
  ).length;
  const prepPoints = (completedPrepCount / totalPrep) * 35;

  const portfolioScore = Math.min(
    100,
    Math.round(projectPoints + prepPoints)
  );

  // Weighted Overall Score: 35% Foundations, 35% Skills, 30% Portfolio
  const overallScore = Math.min(
    100,
    Math.round(
      foundationsScore * 0.35 + skillsScore * 0.35 + portfolioScore * 0.3
    )
  );

  // Tier level and domain-aware unlock requirements
  const cat = (career?.category || "").toLowerCase();
  let toApprentice = "Complete Phase 1 and build your first beginner project to reach Apprentice.";
  let toPractitioner = "Master intermediate concepts and complete a substantial portfolio project to reach Practitioner.";
  let toReady = "Finish advanced capstone projects and finalize your career prep checklist to reach Career Ready.";

  if (cat.includes("health") || cat.includes("medicine")) {
    toApprentice = "Complete Phase 1 and foundational study modules to reach Apprentice.";
    toPractitioner = "Master intermediate clinical concepts and complete clinical case reviews to reach Practitioner.";
    toReady = "Finish advanced clinical studies and complete your licensing prep checklist to reach Career Ready.";
  } else if (cat.includes("law") || cat.includes("govern")) {
    toApprentice = "Complete Phase 1 and draft your first legal brief or case note to reach Apprentice.";
    toPractitioner = "Master intermediate legal concepts and complete practical briefs or moot arguments to reach Practitioner.";
    toReady = "Finish advanced legal research and complete your bar prep checklist to reach Career Ready.";
  } else if (cat.includes("design") || cat.includes("art")) {
    toApprentice = "Complete Phase 1 and design your first beginner project to reach Apprentice.";
    toPractitioner = "Master intermediate design principles and build a multi-screen prototype to reach Practitioner.";
    toReady = "Finish advanced design systems and curate your portfolio case studies to reach Career Ready.";
  } else if (cat.includes("finance")) {
    toApprentice = "Complete Phase 1 and build your first financial analysis model to reach Apprentice.";
    toPractitioner = "Master intermediate valuation concepts and build a full financial model to reach Practitioner.";
    toReady = "Finish advanced transaction cases and complete your finance career checklist to reach Career Ready.";
  } else if (cat.includes("science") || cat.includes("research")) {
    toApprentice = "Complete Phase 1 and design your first structured experiment to reach Apprentice.";
    toPractitioner = "Master intermediate methodologies and complete a data-backed study to reach Practitioner.";
    toReady = "Finish advanced research writing and complete your academic prep checklist to reach Career Ready.";
  } else if (cat.includes("social") || cat.includes("psychology")) {
    toApprentice = "Complete Phase 1 and complete your first case analysis to reach Apprentice.";
    toPractitioner = "Master intermediate assessment concepts and design a community intervention to reach Practitioner.";
    toReady = "Finish advanced case studies and complete your professional readiness checklist to reach Career Ready.";
  } else if (cat.includes("business") || cat.includes("management") || cat.includes("marketing") || cat.includes("innovation")) {
    toApprentice = "Complete Phase 1 and create your first strategy or business canvas to reach Apprentice.";
    toPractitioner = "Master intermediate domain frameworks and launch a real project deliverable to reach Practitioner.";
    toReady = "Finish advanced strategic projects and complete your career portfolio checklist to reach Career Ready.";
  } else if (cat.includes("engineering")) {
    toApprentice = "Complete Phase 1 and build your first engineering prototype to reach Apprentice.";
    toPractitioner = "Master intermediate engineering tools and complete a functional subsystem build to reach Practitioner.";
    toReady = "Finish advanced capstone systems and finalize your engineering licensure prep to reach Career Ready.";
  }

  let tierLevel: 1 | 2 | 3 | 4 = 1;
  let tierName = "Explorer";
  let tierDescription = "Building foundational understanding of this career.";
  let nextTierRequirement = toApprentice;

  if (overallScore >= 80) {
    tierLevel = 4;
    tierName = "Career Ready";
    tierDescription = "Complete portfolio, core skills mastered, ready for internships and entry roles.";
    nextTierRequirement = "You have unlocked maximum readiness! Focus on live applications and interview practice.";
  } else if (overallScore >= 55) {
    tierLevel = 3;
    tierName = "Practitioner";
    tierDescription = "Realistic projects built, advancing through specialized phases.";
    nextTierRequirement = toReady;
  } else if (overallScore >= 25) {
    tierLevel = 2;
    tierName = "Apprentice";
    tierDescription = "Active hands-on learner with core foundations in place.";
    nextTierRequirement = toPractitioner;
  }

  return {
    overallScore,
    tierLevel,
    tierName,
    tierDescription,
    nextTierRequirement,
    pillars: {
      foundations: {
        id: "foundations",
        label: "Foundations & Roadmap",
        score: foundationsScore,
        weight: 35,
        detail: `${completedPhasesCount} of ${totalPhases} phases completed`,
        iconName: "BookOpen",
      },
      skills: {
        id: "skills",
        label: "Skill Competency",
        score: skillsScore,
        weight: 35,
        detail: `${progress.completedSkills.length} of ${totalSkills} skills verified`,
        iconName: "CheckCircle2",
      },
      portfolio: {
        id: "portfolio",
        label: "Portfolio & Proof",
        score: portfolioScore,
        weight: 30,
        detail: `${completedProjectsCount} projects built • ${completedPrepCount} prep items checked`,
        iconName: "FolderKanban",
      },
    },
  };
}

// ── 2. Next Best Action Engine ─────────────────────────────────────

export function getNextBestAction(
  career: CareerDetail,
  traits: TraitProfile | null,
  progress: UserProgressState
): NextBestAction {
  try {
    const recResult = generateAdaptiveRecommendations({
      career: career as unknown as CareerIntelligence,
      traitProfile: traits,
      progress,
    });
    return mapRecommendationToNextBestAction(recResult.primaryRecommendation);
  } catch {
    const phase1 = career.roadmap[0];
    return {
      id: "action_phase_1",
      title: `Master Foundations: ${phase1?.title || "Core Concepts"}`,
      subtitle: `Phase 1 Milestone • Estimated ${phase1?.estimatedDuration || "3–4 weeks"}`,
      category: "learn",
      reasoning:
        "Every career journey begins with foundational literacy. Completing Phase 1 gives you the core vocabulary and mental models required for practical projects.",
      estimatedTime: "~3–5 hours this week",
      actionText: "Open Phase 1 Roadmap",
      targetType: "phase",
      targetId: 1,
    };
  }
}

// ── 3. Adaptive Weekly Sprint Generator ────────────────────────────

export function generateAdaptiveWeeklySprint(
  career: CareerDetail,
  traits: TraitProfile | null,
  progress: UserProgressState
): SprintTask[] {
  const personalizedSkills = traits
    ? getPersonalizedSkills(traits, career)
    : career.skills.map((s) => ({ ...s, status: "developing" as const }));

  const activePhaseNum = Math.min(
    career.roadmap.length,
    (progress.completedPhases[progress.completedPhases.length - 1] || 0) + 1
  );
  const activePhase = career.roadmap.find((p) => p.phase === activePhaseNum) || career.roadmap[0];

  const tasks: SprintTask[] = [];

  // Goal 1: Active Phase Study
  const phaseTaskId = `${career.slug}_sprint_phase_${activePhase.phase}`;
  tasks.push({
    id: phaseTaskId,
    title: `Study Phase ${activePhase.phase} topic: ${activePhase.learn[0] || activePhase.title}`,
    category: "Curriculum",
    priority: "High Impact",
    reason: `Core learning module for Phase ${activePhase.phase} (${activePhase.estimatedDuration})`,
    done: progress.completedTasks.includes(phaseTaskId),
  });

  // Goal 2: High-impact Skill Workout (focus on gaps)
  const unmasteredGap =
    personalizedSkills.find(
      (s) => s.status === "needs-work" && !progress.completedSkills.includes(s.id)
    ) ||
    personalizedSkills.find(
      (s) => !progress.completedSkills.includes(s.id)
    ) ||
    personalizedSkills[0];

  const skillTaskId = `${career.slug}_sprint_skill_${unmasteredGap?.id || "core"}`;
  tasks.push({
    id: skillTaskId,
    title: `Practice exercise for ${unmasteredGap?.name || "Core Skill"}: ${unmasteredGap?.recommendedLevel || "Solve practice problems"}`,
    category: "Skill Workout",
    priority: unmasteredGap?.status === "needs-work" ? "Urgent" : "High Impact",
    reason:
      unmasteredGap?.status === "needs-work"
        ? "Closes a priority gap identified in your assessment"
        : "Strengthens baseline execution speed",
    done: progress.completedTasks.includes(skillTaskId),
  });

  // Goal 3: Project Lab Milestone
  const activeProject =
    career.projects.find((p) => !progress.completedProjects.includes(p.title)) ||
    career.projects[0];

  const projectTaskId = `${career.slug}_sprint_project_${activeProject.title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`;
  tasks.push({
    id: projectTaskId,
    title: `Implement core feature in "${activeProject.title}": ${activeProject.features[0] || "MVP Architecture"}`,
    category: "Project Lab",
    priority: "High Impact",
    reason: `Advances your ${activeProject.difficulty} portfolio deliverable`,
    done: progress.completedTasks.includes(projectTaskId),
  });

  // Goal 4: Career Prep / Routine
  const uncompletedPrep =
    career.preparation.find((p) => !progress.completedTasks.includes(p.id)) ||
    career.preparation[0];

  const prepTaskId = uncompletedPrep?.id || `${career.slug}_sprint_prep`;
  tasks.push({
    id: prepTaskId,
    title: uncompletedPrep?.task || "Review and document this week's code commits on GitHub",
    category: "Career Prep",
    priority: "Recommended",
    reason: uncompletedPrep?.details || "Builds visibility with future employers",
    done: progress.completedTasks.includes(prepTaskId),
  });

  return tasks;
}

// ── 4. Fast-Track & Bridge Insights ────────────────────────────────

export function getAdaptiveInsights(
  career: CareerDetail,
  traits: TraitProfile | null
): AdaptiveInsight[] {
  if (!traits) {
    return [
      {
        type: "milestone",
        title: "Standard Roadmap Mode",
        description:
          "Take the free 5-minute assessment to unlock personalized fast-track shortcuts and customized gap analysis.",
        skillOrTraitName: "Career Compass Assessment",
      },
    ];
  }

  const insights: AdaptiveInsight[] = [];
  const personalizedSkills = getPersonalizedSkills(traits, career);

  // 1. Fast-track opportunities (skills with strong aptitude)
  const strongSkills = personalizedSkills.filter((s) => s.status === "strong");
  if (strongSkills.length > 0) {
    const topSkill = strongSkills[0];
    insights.push({
      type: "fast-track",
      title: "Fast-Track Eligible",
      description: `Your assessment indicated strong natural aptitude in ${topSkill.name}. You can review the syntax/basics quickly and skip straight to hands-on build exercises.`,
      skillOrTraitName: topSkill.name,
    });
  }

  // 2. High-priority bridge areas (skills with needs-work status)
  const gapSkills = personalizedSkills.filter((s) => s.status === "needs-work");
  if (gapSkills.length > 0) {
    const topGap = gapSkills[0];
    insights.push({
      type: "bridge",
      title: "High-Priority Growth Bridge",
      description: `Targeted deliberate practice in ${topGap.name} will eliminate your biggest roadblock toward becoming competitive in ${career.title}.`,
      skillOrTraitName: topGap.name,
    });
  }

  return insights;
}

// ── 5. Time-to-Readiness Pace Calculator ──────────────────────────

export interface TimeToReadinessResult {
  totalEstimatedWeeks: number;
  remainingWeeks: number;
  hoursPerWeek: number;
  targetMonthYear: string;
}

export function calculateTimeToReadiness(
  career: CareerDetail,
  progress: UserProgressState,
  weeklyHours: number
): TimeToReadinessResult {
  // Baseline: each phase averages ~4 weeks at standard 10 hrs/week pace (~40 hours per phase)
  const totalHoursNeeded = career.roadmap.length * 40;
  const safePace = Math.max(2, weeklyHours);

  const totalEstimatedWeeks = Math.ceil(totalHoursNeeded / safePace);

  // Account for phases completed and projects built
  const phasesDone = progress.completedPhases.length;
  const projectsDone = progress.completedProjects.length;

  const hoursCompleted = phasesDone * 40 + projectsDone * 15;
  const hoursRemaining = Math.max(0, totalHoursNeeded - hoursCompleted);
  const remainingWeeks = Math.max(1, Math.ceil(hoursRemaining / safePace));

  // Compute target date
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + remainingWeeks * 7);

  const targetMonthYear = targetDate.toLocaleDateString(undefined, {
    month: "short",
    year: "numeric",
  });

  return {
    totalEstimatedWeeks,
    remainingWeeks,
    hoursPerWeek: safePace,
    targetMonthYear,
  };
}
