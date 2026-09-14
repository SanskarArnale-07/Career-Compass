/**
 * Career Context Engine
 *
 * Centralized context builder that combines:
 * 1. User assessment traits & profile
 * 2. Selected CareerDetail definition
 * 3. User progress state (phases, skills, projects, tasks, pace)
 * 4. Progress Intelligence outputs (readiness index, next best action, pace)
 *
 * Produces a normalized, compact, model-friendly JSON object
 * for the AI Career Coach.
 */

import {
  getCareerBySlug,
  getAllCareers,
  type CareerDetail,
} from "./index";
import {
  type TraitProfile,
  getStrengthsAndGaps,
  getPersonalizedSkills,
  type StoredResults,
} from "./personalization";
import {
  calculateCareerReadiness,
  getNextBestAction,
  calculateTimeToReadiness,
  type UserProgressState,
  type CareerReadinessResult,
  type NextBestAction,
  type TimeToReadinessResult,
} from "./roadmap-intelligence";

export interface StoredProgressInput {
  currentCareer?: {
    slug: string;
    title: string;
    careerName: string;
    startedAt: number;
  };
  completedTasks?: string[];
  completedPhases?: number[];
  completedSkills?: string[];
  completedProjects?: string[];
  weeklyPaceHours?: number;
  customTasks?: { id: string; text: string; category: string; done: boolean }[];
}

export interface CareerCoachContext {
  userProfile: {
    hasAssessment: boolean;
    primaryTraits: { code: string; label: string; score: number }[];
    topTrait: string;
    assessmentSummary: string;
  };
  career: {
    slug: string;
    title: string;
    category: string;
    tagline: string;
    matchPercentage: number;
    overview: string;
    difficultyToEnter: string;
    growthPotential: string;
    icon?: string;
  };
  assessmentInterpretation: {
    strengths: { title: string; status: string; explanation: string }[];
    gaps: { title: string; status: string; explanation: string }[];
    whyCareerMatches: string;
  };
  skills: {
    total: number;
    mastered: string[];
    inProgress: string[];
    priorityGaps: { id: string; name: string; category: string; whyItMatters: string }[];
    highAptitude: string[];
  };
  roadmap: {
    totalPhases: number;
    currentPhaseNumber: number;
    currentPhaseTitle: string;
    currentPhaseDuration: string;
    completedPhases: number[];
    phaseProgressPercent: number;
    nextMilestone: string;
  };
  projects: {
    total: number;
    completed: string[];
    nextToBuild: { title: string; difficulty: string; description: string; features: string[] } | null;
    portfolioReadinessPercent: number;
  };
  jobPrep: {
    totalTasks: number;
    completedTasksCount: number;
    pendingTasks: { task: string; category: string }[];
    isInternshipReady: boolean;
  };
  readiness: {
    overallScore: number;
    tierLevel: number;
    tierName: string;
    foundationsScore: number;
    skillsScore: number;
    portfolioScore: number;
    nextTierRequirement: string;
  };
  studyPace: {
    weeklyHours: number;
    estimatedWeeksRemaining: number;
    targetMonthYear: string;
  };
  activity: {
    startedAtDate: string;
    totalTasksDone: number;
    customMilestonesCount: number;
    weeklyGoalsCount: number;
  };
  nextAction: {
    title: string;
    category: string;
    reasoning: string;
    estimatedTime: string;
    actionText: string;
  };
}

const TRAIT_LABELS: Record<string, string> = {
  AN: "Analytical Thinking",
  TE: "Technical Aptitude",
  SC: "Scientific Curiosity",
  BU: "Business & Strategic Mindset",
  CR: "Creative Expression",
  SO: "Social & Interpersonal Skills",
  LE: "Leadership & Initiative",
  EX: "Exploration & Adaptability",
};

/**
 * Build a normalized, compact Career Coach Context from current application state.
 */
export function buildCareerContext(params?: {
  careerSlug?: string;
  storedProgress?: StoredProgressInput | null;
  storedResults?: StoredResults | null;
}): CareerCoachContext {
  const allCareers = getAllCareers();

  // 1. Resolve Target Career
  let slug = params?.careerSlug;
  if (!slug && params?.storedProgress?.currentCareer?.slug) {
    slug = params.storedProgress.currentCareer.slug;
  }
  if (!slug && params?.storedResults?.top_careers?.[0]) {
    const topCareerName = params.storedResults.top_careers[0].career_name;
    const match = allCareers.find(
      (c) => c.careerName.toLowerCase() === topCareerName.toLowerCase()
    );
    if (match) slug = match.slug;
  }
  if (!slug) slug = "software-development";

  const career: CareerDetail = getCareerBySlug(slug) || allCareers[0];

  // 2. Resolve User Trait Profile
  const traits: TraitProfile | null = params?.storedResults?.trait_profile || null;
  const hasAssessment = !!traits;

  // 3. Resolve Progress State
  const progressState: UserProgressState = {
    completedPhases: params?.storedProgress?.completedPhases || [],
    completedTasks: params?.storedProgress?.completedTasks || [],
    completedSkills: params?.storedProgress?.completedSkills || [],
    completedProjects: params?.storedProgress?.completedProjects || [],
    weeklyPaceHours: params?.storedProgress?.weeklyPaceHours || 10,
  };

  // 4. Compute Intelligence
  const readiness: CareerReadinessResult = calculateCareerReadiness(
    career,
    traits,
    progressState
  );
  const nextAction: NextBestAction = getNextBestAction(
    career,
    traits,
    progressState
  );
  const paceInfo: TimeToReadinessResult = calculateTimeToReadiness(
    career,
    progressState,
    progressState.weeklyPaceHours
  );

  // 5. Match Percentage & Interpretation
  let matchPercentage = 75;
  let whyCareerMatches = `Based on foundational alignment with ${career.title}.`;

  if (params?.storedResults?.top_careers) {
    const matchItem = params.storedResults.top_careers.find(
      (c) =>
        c.career_name.toLowerCase() === career.careerName.toLowerCase() ||
        c.career_name.toLowerCase().includes(career.title.toLowerCase())
    );
    if (matchItem) {
      matchPercentage = matchItem.match_percentage;
      whyCareerMatches = matchItem.explanation;
    }
  }

  const strengthsGaps = traits
    ? getStrengthsAndGaps(traits, career)
    : {
        strengths: [
          {
            title: "Domain Curiosity",
            status: "strong" as const,
            explanation: `Natural interest in ${career.category.toLowerCase()} concepts.`,
          },
        ],
        gaps: [
          {
            title: "Hands-on Projects",
            status: "needs-work" as const,
            explanation: "Building practical deliverables is required for portfolio readiness.",
          },
        ],
        summary: "General career alignment profile.",
      };

  const personalizedSkills = traits
    ? getPersonalizedSkills(traits, career)
    : career.skills.map((s, idx) => ({
        ...s,
        status: idx === 0 ? ("strong" as const) : ("developing" as const),
      }));

  // 6. User Profile traits list
  const primaryTraitsList = traits
    ? Object.entries(traits)
        .filter(([code]) => TRAIT_LABELS[code])
        .map(([code, score]) => ({
          code,
          label: TRAIT_LABELS[code] || code,
          score,
        }))
        .sort((a, b) => b.score - a.score)
    : [];

  const topTrait = primaryTraitsList[0]?.label || "Adaptability";

  // 7. Skills aggregation
  const masteredSkills = career.skills
    .filter((s) => progressState.completedSkills.includes(s.id))
    .map((s) => s.name);

  const priorityGaps = personalizedSkills
    .filter(
      (s) =>
        s.status === "needs-work" &&
        !progressState.completedSkills.includes(s.id)
    )
    .slice(0, 3)
    .map((s) => ({
      id: s.id,
      name: s.name,
      category: s.category,
      whyItMatters: s.whyItMatters,
    }));

  const highAptitude = personalizedSkills
    .filter((s) => s.status === "strong")
    .map((s) => s.name);

  const inProgressSkills = personalizedSkills
    .filter(
      (s) =>
        !progressState.completedSkills.includes(s.id) &&
        s.status !== "needs-work"
    )
    .map((s) => s.name);

  // 8. Roadmap aggregation
  const activePhaseNum = Math.min(
    career.roadmap.length,
    (progressState.completedPhases[progressState.completedPhases.length - 1] || 0) + 1
  );
  const activePhase =
    career.roadmap.find((p) => p.phase === activePhaseNum) || career.roadmap[0];
  const phaseProgressPercent = Math.round(
    (progressState.completedPhases.length / Math.max(1, career.roadmap.length)) * 100
  );

  // 9. Projects aggregation
  const uncompletedProject = career.projects.find(
    (p) => !progressState.completedProjects.includes(p.title)
  );

  // 10. Job Preparation
  const completedPrepCount = career.preparation.filter((p) =>
    progressState.completedTasks.includes(p.id)
  ).length;
  const pendingPrep = career.preparation
    .filter((p) => !progressState.completedTasks.includes(p.id))
    .slice(0, 4)
    .map((p) => ({ task: p.task, category: p.category }));

  const isInternshipReady =
    readiness.overallScore >= 55 &&
    progressState.completedProjects.length >= 1 &&
    completedPrepCount >= 2;

  // 11. Activity metadata
  const startedAtDate = params?.storedProgress?.currentCareer?.startedAt
    ? new Date(params.storedProgress.currentCareer.startedAt).toLocaleDateString(
        undefined,
        { month: "short", day: "numeric", year: "numeric" }
      )
    : "Recently";

  return {
    userProfile: {
      hasAssessment,
      primaryTraits: primaryTraitsList.slice(0, 4),
      topTrait,
      assessmentSummary: strengthsGaps.summary,
    },
    career: {
      slug: career.slug,
      title: career.title,
      category: career.category,
      tagline: career.tagline,
      matchPercentage,
      overview: career.snapshot[0]?.value || career.tagline,
      difficultyToEnter: career.snapshot.find((s) => s.label.includes("Difficulty"))?.value || "Moderate",
      growthPotential: career.snapshot.find((s) => s.label.includes("Growth"))?.value || "High",
      icon: career.icon,
    },
    assessmentInterpretation: {
      strengths: strengthsGaps.strengths.slice(0, 3),
      gaps: strengthsGaps.gaps.slice(0, 3),
      whyCareerMatches,
    },
    skills: {
      total: career.skills.length,
      mastered: masteredSkills,
      inProgress: inProgressSkills,
      priorityGaps,
      highAptitude,
    },
    roadmap: {
      totalPhases: career.roadmap.length,
      currentPhaseNumber: activePhase.phase,
      currentPhaseTitle: activePhase.title,
      currentPhaseDuration: activePhase.estimatedDuration,
      completedPhases: progressState.completedPhases,
      phaseProgressPercent,
      nextMilestone: activePhase.build || `Complete Phase ${activePhase.phase}`,
    },
    projects: {
      total: career.projects.length,
      completed: progressState.completedProjects,
      nextToBuild: uncompletedProject
        ? {
            title: uncompletedProject.title,
            difficulty: uncompletedProject.difficulty,
            description: uncompletedProject.description,
            features: uncompletedProject.features,
          }
        : null,
      portfolioReadinessPercent: readiness.pillars.portfolio.score,
    },
    jobPrep: {
      totalTasks: career.preparation.length,
      completedTasksCount: completedPrepCount,
      pendingTasks: pendingPrep,
      isInternshipReady,
    },
    readiness: {
      overallScore: readiness.overallScore,
      tierLevel: readiness.tierLevel,
      tierName: readiness.tierName,
      foundationsScore: readiness.pillars.foundations.score,
      skillsScore: readiness.pillars.skills.score,
      portfolioScore: readiness.pillars.portfolio.score,
      nextTierRequirement: readiness.nextTierRequirement,
    },
    studyPace: {
      weeklyHours: progressState.weeklyPaceHours,
      estimatedWeeksRemaining: paceInfo.remainingWeeks,
      targetMonthYear: paceInfo.targetMonthYear,
    },
    activity: {
      startedAtDate,
      totalTasksDone:
        progressState.completedTasks.length +
        progressState.completedPhases.length +
        progressState.completedSkills.length +
        progressState.completedProjects.length,
      customMilestonesCount: params?.storedProgress?.customTasks?.length || 0,
      weeklyGoalsCount: 4,
    },
    nextAction: {
      title: nextAction.title,
      category: nextAction.category,
      reasoning: nextAction.reasoning,
      estimatedTime: nextAction.estimatedTime,
      actionText: nextAction.actionText,
    },
  };
}

/**
 * Client-side helper: Reads sessionStorage & localStorage directly.
 */
export function buildCurrentCareerContext(careerSlugOverride?: string): CareerCoachContext {
  if (typeof window === "undefined") {
    return buildCareerContext({ careerSlug: careerSlugOverride });
  }

  let storedProgress: StoredProgressInput | null = null;
  let storedResults: StoredResults | null = null;

  try {
    const progStr = localStorage.getItem("careerCompassProgress");
    if (progStr) storedProgress = JSON.parse(progStr);

    const resStr = sessionStorage.getItem("careerCompassResults");
    if (resStr) storedResults = JSON.parse(resStr);
  } catch (e) {
    console.error("Error reading storage for career context", e);
  }

  return buildCareerContext({
    careerSlug: careerSlugOverride,
    storedProgress,
    storedResults,
  });
}
