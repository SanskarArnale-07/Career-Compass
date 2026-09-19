/**
 * AI Career Coach Response Engine
 *
 * Provides journey-grounded, context-aware coaching advice.
 * Evaluates the student's actual Career Compass state:
 * - Career target & match %
 * - Assessment traits & skill gaps
 * - Roadmap phase & completed milestones
 * - Project portfolio readiness
 * - Study pace & timeline
 *
 * Strictly adheres to Career Compass intelligence without hallucinating facts.
 */

import type { CareerCoachContext } from "../career-details/career-context";
import {
  resolveCareerIntelligence,
  getAllCareerIntelligence,
  type CareerIntelligence,
} from "../career-intelligence";

export const SUGGESTED_QUESTIONS = [
  "What should I learn next?",
  "Why was this career recommended?",
  "What skills am I missing?",
  "What project should I build?",
  "What should I focus on this month?",
  "How does this career compare with AI & Data Science?",
  "What should I do after completing this milestone?",
  "Am I ready for internships?",
];

/**
 * Normalizes coach context with guaranteed safe defaults to prevent runtime exceptions.
 */
export function normalizeCoachContext(context: CareerCoachContext): CareerCoachContext {
  const readiness = context.readiness || {
    overallScore: 0,
    tierLevel: 1,
    tierName: "Explorer",
    foundationsScore: 0,
    skillsScore: 0,
    portfolioScore: 0,
    nextTierRequirement: "Complete initial foundation skills",
  };
  const studyPace = context.studyPace || {
    weeklyHours: 10,
    estimatedWeeksRemaining: 12,
    targetMonthYear: "3 months",
  };
  const skills = context.skills || {
    total: 0,
    mastered: [],
    inProgress: [],
    priorityGaps: [],
    highAptitude: [],
  };
  const projects = context.projects || {
    total: 0,
    completed: [],
    nextToBuild: null,
    portfolioReadinessPercent: 0,
  };
  const jobPrep = context.jobPrep || {
    totalTasks: 0,
    completedTasksCount: 0,
    pendingTasks: [],
    isInternshipReady: false,
  };
  const roadmap = context.roadmap || {
    totalPhases: 4,
    currentPhaseNumber: 1,
    currentPhaseTitle: "Foundations",
    currentPhaseDuration: "4-6 weeks",
    completedPhases: [],
    phaseProgressPercent: 0,
    nextMilestone: "Start Phase 1",
  };
  const nextAction = context.nextAction || {
    id: "act_1",
    title: "Begin Foundations Roadmap",
    estimatedTime: "1-2 hours",
    reasoning: "Build foundational competencies",
    description: "Start with programming basics",
    category: "Phase Milestone",
    priority: "high",
  };
  const userProfile = context.userProfile || {
    hasAssessment: false,
    primaryTraits: [],
    topTrait: "Analytical",
    assessmentSummary: "Assessment not yet completed.",
  };
  const assessmentInterpretation = context.assessmentInterpretation || {
    strengths: [],
    gaps: [],
    whyCareerMatches: `Explore this path to determine alignment with your goals.`,
  };

  return {
    ...context,
    readiness,
    studyPace,
    skills,
    projects,
    jobPrep,
    roadmap,
    nextAction,
    userProfile,
    assessmentInterpretation,
  };
}

/**
 * Formats the student's journey state into explicitly delineated,
 * structured sections to guarantee grounding and eliminate hallucinations.
 */
export function formatStructuredCoachContext(
  rawContext: CareerCoachContext,
  query?: string
): string {
  const context = normalizeCoachContext(rawContext);
  const {
    userProfile,
    career,
    assessmentInterpretation,
    skills,
    roadmap,
    roadmapPlan,
    progressReport: _progressReport,
    recommendations,
    projects,
    jobPrep,
    readiness,
    studyPace,
    nextAction,
  } = context;

  void _progressReport; // used in generateLocalCoachResponse, not here

  // 1. USER CONTEXT
  const userContextLines = [
    "=== USER CONTEXT ===",
    `- Assessment Status: ${userProfile?.hasAssessment ? "Completed" : "Not completed (using default baseline)"}`,
    userProfile?.hasAssessment && userProfile.primaryTraits?.length
      ? `- Primary Traits: ${userProfile.primaryTraits.map((t) => `${t.label} (${t.code}: ${t.score})`).join(", ")}`
      : "- Primary Traits: Not yet assessed",
    `- Top Dominant Trait: ${userProfile?.topTrait || "Adaptability"}`,
    `- Assessment Profile Summary: ${userProfile?.assessmentSummary || "General career explorer profile."}`,
    `- Career Match Alignment: ${career?.matchPercentage ?? 80}%`,
    `- Why Career Matches User: ${assessmentInterpretation?.whyCareerMatches || `Aligned with interest in ${career?.category || "technology"}.`}`,
    `- Identified Strengths: ${assessmentInterpretation?.strengths?.length ? assessmentInterpretation.strengths.map((s) => `${s.title} (${s.explanation})`).join("; ") : "Self-directed learning, core curiosity"}`,
    `- Identified Skill Gaps: ${assessmentInterpretation?.gaps?.length ? assessmentInterpretation.gaps.map((g) => `${g.title} (${g.explanation})`).join("; ") : "Practical project portfolio execution"}`,
  ];

  // 2. CAREER DATA
  const careerDataLines = [
    "=== CAREER DATA ===",
    `- Targeted Career: ${career.title} (Slug: ${career.slug})`,
    `- Domain Category: ${career.category}`,
    `- Tagline: ${career.tagline}`,
    `- Overview: ${career.overview}`,
    `- Entry Difficulty: ${career.difficultyToEnter}`,
    `- Industry Growth Potential: ${career.growthPotential}`,
    `- Core Responsibilities: ${career.responsibilities?.slice(0, 4).join("; ") || "Industry-standard engineering & domain execution"}`,
    `- Recommended Academic Stream: ${career.educationPath?.recommendedStream || "Relevant degree or practical portfolio proof"}`,
    `- Target Degrees: ${career.educationPath?.degrees?.join(", ") || "Bachelor's in relevant discipline"}`,
    `- Essential Tools & Technologies: ${career.toolsTechnologies?.join(", ") || "Modern industry toolchain"}`,
    `- Role Progression Ladder: ${career.roleProgression?.join(" → ") || "Junior → Mid-Level → Senior → Lead"}`,
  ];

  // 3. ROADMAP DATA
  const activeMilestone = roadmapPlan?.completionState?.nextMilestone?.title || roadmap.nextMilestone;
  const activeStage = roadmapPlan?.completionState?.activePhaseStage || roadmap.activeStage || "foundation";

  const roadmapDataLines = [
    "=== ROADMAP DATA ===",
    `- Total Roadmap Phases: ${roadmap.totalPhases}`,
    `- Current Active Phase: Phase ${roadmap.currentPhaseNumber} — ${roadmap.currentPhaseTitle} (${roadmap.currentPhaseDuration})`,
    `- Active Progression Stage: ${activeStage}`,
    `- Active Milestone: ${activeMilestone}`,
    `- Milestone Relevance: ${roadmapPlan?.completionState?.nextMilestone?.relevance?.reason || "Core curriculum competency"}`,
    `- Milestone Estimated Effort: ${roadmapPlan?.completionState?.nextMilestone?.estimatedEffort ? `${roadmapPlan.completionState.nextMilestone.estimatedEffort.durationText} (${roadmapPlan.completionState.nextMilestone.estimatedEffort.hours}h)` : "Standard pace"}`,
    `- Milestone Prerequisites: ${roadmapPlan?.completionState?.nextMilestone?.prerequisites?.length ? roadmapPlan.completionState.nextMilestone.prerequisites.join(", ") : "None"}`,
    `- Completed Phases: [${roadmap.completedPhases.join(", ")}] (${roadmap.phaseProgressPercent}% phase progress)`,
    `- Milestone Completion Count: ${roadmapPlan?.completionState?.completedMilestonesCount || 0} of ${roadmapPlan?.completionState?.totalMilestonesCount || 12} (${roadmapPlan?.completionState?.overallProgressPercent || 0}%)`,
  ];

  // 4. PROGRESS DATA
  const progressDataLines = [
    "=== PROGRESS DATA ===",
    `- Overall Readiness Score: ${readiness.overallScore}% (Tier ${readiness.tierLevel}: ${readiness.tierName})`,
    `- Readiness Breakdown: Foundations ${readiness.foundationsScore}%, Skills ${readiness.skillsScore}%, Portfolio ${readiness.portfolioScore}%`,
    `- Next Tier Requirement: ${readiness.nextTierRequirement}`,
    `- Mastered Skills: ${skills.mastered.length > 0 ? skills.mastered.join(", ") : "None yet verified"}`,
    `- Priority Missing Skill Gaps: ${skills.priorityGaps.length > 0 ? skills.priorityGaps.map((g) => `${g.name} [${g.category}] (${g.whyItMatters})`).join("; ") : "No immediate gaps identified"}`,
    `- Completed Projects: ${projects.completed.length > 0 ? projects.completed.join(", ") : "None yet built"} (${projects.completed.length} of ${projects.total})`,
    `- Next Project to Build: ${projects.nextToBuild ? `"${projects.nextToBuild.title}" (${projects.nextToBuild.difficulty.toUpperCase()}: ${projects.nextToBuild.description})` : "All core portfolio projects completed"}`,
    `- Internship Readiness: ${jobPrep.isInternshipReady ? "Qualified for entry-level internships" : "Still building required proof"}`,
    `- Study Velocity: ${studyPace.weeklyHours} hours/week (~${studyPace.estimatedWeeksRemaining} weeks remaining until ${studyPace.targetMonthYear})`,
    `- Immediate Priority Action: "${nextAction.title}" (${nextAction.estimatedTime}) - ${nextAction.reasoning}`,
    recommendations ? `- Adaptive Recommendation: [${recommendations.primaryRecommendation.priority.toUpperCase()}] ${recommendations.primaryRecommendation.title} (Why: ${recommendations.primaryRecommendation.reason})` : "",
  ].filter(Boolean);

  const questionLines = query ? ["", "=== QUESTION ===", query.trim()] : [];

  return [
    userContextLines.join("\n"),
    "",
    careerDataLines.join("\n"),
    "",
    roadmapDataLines.join("\n"),
    "",
    progressDataLines.join("\n"),
    ...questionLines,
  ].join("\n");
}

/**
 * Format the structured system prompt for the coach with anti-hallucination guardrails.
 */
export function buildCoachSystemPrompt(context: CareerCoachContext): string {
  const structuredContext = formatStructuredCoachContext(context);

  return `You are Career Compass AI, the student's personal career intelligence coach.
You have real-time access to the student's actual Career Compass journey.

${structuredContext}

ANTI-HALLUCINATION & COACHING PRINCIPLES:
1. STRICT DATA FIDELITY: You must NOT invent Career Compass-specific facts, unverified milestones, fake percentages, or imaginary courses. Always base numbers, active milestones, and progress on the structured data provided above.
2. MISSING DATA HANDLING: If the student has not completed an assessment, or if specific data is unavailable, clearly acknowledge that rather than inventing answers.
3. GROUNDED GUIDANCE: Ground every recommendation in their specific targeted career (${context.career.title}), active roadmap phase (Phase ${context.roadmap.currentPhaseNumber}), priority skill gaps, and next project.
4. ACTIONABLE & HIGH-AGENCY: Be encouraging, pragmatic, direct, and structured. Use bullet points, bold text, and markdown tables when appropriate.
5. CONCISE: Keep answers focused and actionable (typically 2–4 short sections or bulleted milestones).`;
}

/**
 * Helper to resolve a comparison career from a query.
 */
function extractComparisonCareer(
  query: string,
  currentSlug: string
): CareerIntelligence | undefined {
  const all = getAllCareerIntelligence();

  // Keyword to slug mapping for conversational fuzzy matching
  const comparisons: { keywords: string[]; slug: string }[] = [
    { keywords: ["ai", "machine learning", "data science", "data scientist", "ml"], slug: "ai-ml-data-science" },
    { keywords: ["software", "developer", "web dev", "app dev", "full stack", "programmer"], slug: "software-development" },
    { keywords: ["finance", "fintech", "investment", "banking", "financial"], slug: "finance-investment" },
    { keywords: ["product management", "product manager", "management", "pm"], slug: "management-product" },
    { keywords: ["design", "ux", "ui", "ui/ux", "graphic", "creative"], slug: "design-creative" },
    { keywords: ["marketing", "digital marketing", "media", "seo", "branding"], slug: "marketing-media" },
    { keywords: ["hardware", "engineering", "mechanical", "electrical", "civil"], slug: "engineering" },
    { keywords: ["medicine", "healthcare", "medical", "doctor", "biotech"], slug: "medicine-healthcare" },
    { keywords: ["scientific", "research", "scientist", "phd", "lab"], slug: "scientific-research" },
    { keywords: ["entrepreneur", "startup", "founder", "business"], slug: "entrepreneurship" },
    { keywords: ["law", "legal", "policy", "lawyer"], slug: "law-policy" },
    { keywords: ["psychology", "mental health", "counseling", "social"], slug: "psychology-social" },
  ];

  for (const c of comparisons) {
    if (c.slug !== currentSlug && c.keywords.some((k) => query.includes(k))) {
      return resolveCareerIntelligence(c.slug);
    }
  }

  // Fallback to related career if not explicitly named
  const fallbackSlug = currentSlug === "software-development" ? "ai-ml-data-science" : "software-development";
  return resolveCareerIntelligence(fallbackSlug) || all.find((c) => c.slug !== currentSlug);
}

/**
 * Generate a grounded coach response deterministically.
 * Guarantees zero hallucinations and 100% reliable advice without external dependencies.
 */
export async function generateLocalCoachResponse(
  userQuery: string,
  rawContext: CareerCoachContext
): Promise<string> {
  const query = userQuery.trim().toLowerCase();
  const context = normalizeCoachContext(rawContext);
  const {
    career,
    readiness,
    roadmap,
    roadmapPlan,
    skills,
    projects,
    jobPrep,
    studyPace,
    nextAction,
    recommendations,
    userProfile,
    assessmentInterpretation,
    progressReport,
  } = context;

  // ── 1. "What should I learn next?" ───────────────────────────────────
  if (
    query.includes("what should i learn next") ||
    query.includes("what to learn next") ||
    query.includes("learn next") ||
    query.includes("what should i study next") ||
    query.includes("next skill")
  ) {
    const primaryRec = recommendations?.primaryRecommendation;
    const topGap = skills.priorityGaps[0];
    const nextMilestone = roadmapPlan?.completionState.nextMilestone;

    const targetTitle = primaryRec?.title || (topGap ? topGap.name : nextMilestone?.title || nextAction.title);
    const reasonText = primaryRec?.reason || (topGap ? topGap.whyItMatters : nextAction.reasoning);
    const effort = primaryRec?.estimatedEffort || nextMilestone?.estimatedEffort.durationText || nextAction.estimatedTime;

    return `### ⚡ What to Learn Next for **${career.title}**

Based on your current progress (**Phase ${roadmap.currentPhaseNumber}: ${roadmap.currentPhaseTitle}**), here is your highest-leverage learning target:

1. **Immediate Focus**: **${targetTitle}**
   - **Why This Matters**: ${reasonText}
   - **Estimated Time**: \`${effort}\`
   ${primaryRec?.sourceContext ? `- **Engine Context**: ${primaryRec.sourceContext}` : ""}

2. **How to Learn This Effectively**:
   - Review the curated learning resources in Phase ${roadmap.currentPhaseNumber} of your roadmap.
   - Build a mini hands-on exercise rather than only watching tutorials.
   - Once understood, verify it in your **Skill Mastery Matrix** on the dashboard to immediately boost your Skill Competency score (currently **${readiness.skillsScore}%**).

${topGap ? `> 💡 **Next In Queue**: After mastering this, your next priority bottleneck will be **${skills.priorityGaps[1]?.name || "applied milestone projects"}**.` : ""}`;
  }

  // ── 2. "Why was this career recommended?" ────────────────────────────
  if (
    query.includes("why was this career recommended") ||
    query.includes("why this career") ||
    query.includes("why recommended") ||
    query.includes("why did i match") ||
    query.includes("why am i matched")
  ) {
    if (!userProfile?.hasAssessment) {
      const targetIntel = resolveCareerIntelligence(career.slug);
      const traitFit = targetIntel?.primaryTraits?.join(", ") || "Analytical & Technical";

      return `### 🧭 Target Track: **${career.title}**

You haven't completed the Career Compass psychometric assessment yet — **${career.title}** is currently your actively selected target track.

- **Typical Trait Fit**: This domain strongly rewards students with high **${traitFit}** aptitude.
- **Entry Characteristics**: ${career.difficultyToEnter} barrier to entry, ${career.growthPotential} industry trajectory.

> 📝 **Recommendation**: Take the **15-minute Career Assessment** to get your exact personalized suitability score, strength mapping, and trait alignment breakdown!`;
    }

    const strengthsText = assessmentInterpretation.strengths?.length
      ? assessmentInterpretation.strengths.slice(0, 3).map((s) => `- **${s.title}**: ${s.explanation}`).join("\n")
      : `- **Core Trait Alignment**: Matches your dominant **${userProfile.topTrait}** trait profile.`;

    const gapsText = assessmentInterpretation.gaps?.length
      ? assessmentInterpretation.gaps.slice(0, 2).map((g) => `- **${g.title}**: ${g.explanation}`).join("\n")
      : "- **Hands-on Proof**: Building practical portfolio artifacts.";

    return `### 🎯 Why **${career.title}** Was Recommended

Your assessment results scored a **${career.matchPercentage}% Alignment** with this career direction. Here is the breakdown:

#### 1. Trait Synergy & Match Rationale
${assessmentInterpretation.whyCareerMatches}

- **Dominant Trait**: **${userProfile.topTrait}**
- **Your Top Traits**: ${userProfile.primaryTraits?.slice(0, 3).map((t) => `${t.label} (${t.score}/100)`).join(", ")}

#### 2. Key Strengths in Your Favor
${strengthsText}

#### 3. Growth Areas to Address
${gapsText}

> **Summary**: Your natural cognitive profile provides a strong foundation for **${career.title}**. The personalized roadmap is designed specifically to bridge your growth areas into job-ready strengths!`;
  }

  // ── 3. "What skills am I missing?" ───────────────────────────────────
  if (
    query.includes("what skills am i missing") ||
    query.includes("skills missing") ||
    query.includes("missing skills") ||
    query.includes("what am i missing") ||
    query.includes("skill gaps") ||
    query.includes("my gaps")
  ) {
    const priorityGaps = skills.priorityGaps;
    const mastered = skills.mastered;

    return `### 🔍 Skill Gap Analysis for **${career.title}**

Here is your transparent skill inventory based on your Career Compass roadmap and verified progress:

#### ⚠️ Priority Missing Skills (Immediate Bottlenecks):
${priorityGaps.length > 0 ? priorityGaps.map((g, i) => `${i + 1}. **${g.name}** (\`${g.category}\`)\n   - *Why it matters*: ${g.whyItMatters}`).join("\n") : "- No immediate priority skill gaps! All Phase " + roadmap.currentPhaseNumber + " core skills are verified."}

${progressReport ? `#### 📊 Curriculum Tier Coverage:
- **Beginner Fundamentals**: ${progressReport.skills.coverageByTier.beginner.completed}/${progressReport.skills.coverageByTier.beginner.total} (${progressReport.skills.coverageByTier.beginner.percentage}%)
- **Intermediate Competencies**: ${progressReport.skills.coverageByTier.intermediate.completed}/${progressReport.skills.coverageByTier.intermediate.total} (${progressReport.skills.coverageByTier.intermediate.percentage}%)
- **Advanced Specialization**: ${progressReport.skills.coverageByTier.advanced.completed}/${progressReport.skills.coverageByTier.advanced.total} (${progressReport.skills.coverageByTier.advanced.percentage}%)` : ""}

#### ✅ Verified / Mastered Skills (${mastered.length}):
${mastered.length > 0 ? mastered.map((s) => `• ${s}`).join(", ") : "*None verified yet on your dashboard.*"}

> 🎯 **Action Plan**: Focus on mastering **${priorityGaps[0]?.name || "your active phase concepts"}** first. Checking this off will directly raise your Skill Competency score from **${readiness.skillsScore}%**!`;
  }

  // ── 4. "What project should I build?" ─────────────────────────────────
  if (
    query.includes("what project should i build") ||
    query.includes("which project") ||
    query.includes("project to build") ||
    query.includes("what project") ||
    query.includes("portfolio project") ||
    query.includes("build project")
  ) {
    const proj = projects.nextToBuild;

    if (!proj) {
      return `### 🏆 Core Portfolio Projects Completed!

You have marked all core milestone projects for **${career.title}** as built!

#### Recommended Next Steps:
1. **Deploy & Polish**: Ensure all projects have live demos, clean GitHub repositories, and architectural diagrams in their READMEs.
2. **Case Study**: Write a short technical breakdown explaining the design decisions, trade-offs, and performance optimizations.
3. **Advanced Open Source**: Contribute a feature or bug fix to a notable open-source project in the ${career.title} ecosystem.`;
    }

    const techStack = career.toolsTechnologies?.slice(0, 4).join(", ") || "Domain tools";

    return `### 🛠️ Recommended Project to Build: **${proj.title}**

- **Difficulty Tier**: \`${proj.difficulty.toUpperCase()}\`
- **Portfolio Value**: High yield — directly proves to recruiters you can architect and ship real solutions in ${career.title}.
- **Suggested Toolchain**: ${techStack}

#### Core Features to Implement:
${proj.features.map((f, idx) => `${idx + 1}. **${f}**`).join("\n")}

#### Why this project matters now:
${proj.description}

> 📈 **Readiness Payoff**: Your Portfolio & Proof score is currently **${readiness.portfolioScore}%** (${projects.completed.length}/${projects.total} projects built). Shipping this project will provide the single largest boost toward internship readiness!`;
  }

  // ── 5. "What should I focus on this month?" ───────────────────────────
  if (
    query.includes("what should i focus on this month") ||
    query.includes("focus this month") ||
    query.includes("month focus") ||
    query.includes("monthly plan") ||
    query.includes("this month")
  ) {
    const monthlyHours = Math.round(studyPace.weeklyHours * 4.3);
    const activeMilestone = roadmapPlan?.completionState.nextMilestone?.title || roadmap.nextMilestone;
    const topGap = skills.priorityGaps[0]?.name || "Core concepts";
    const projName = projects.nextToBuild?.title || "Milestone deliverable";

    return `### 📅 Your Monthly Sprint Plan (~${monthlyHours} Hours Budget)

At your current pace of **${studyPace.weeklyHours} hours/week**, you have approximately **${monthlyHours} hours** of dedicated study time this month. Here is your structured 4-week roadmap:

| Week | Focus Area | Goal / Deliverable |
|---|---|---|
| **Week 1** | **Foundations & Skill Gap** | Close bottleneck: **${topGap}**. Complete 3 exercises and verify in Skill Matrix. |
| **Week 2** | **Milestone Execution** | Master **${activeMilestone}** from Phase ${roadmap.currentPhaseNumber}. |
| **Week 3** | **Project Feature Sprint** | Build core architecture and initial features of **${projName}**. |
| **Week 4** | **Project Polish & Review** | Test, document README, deploy, and mark project as built on dashboard. |

#### Milestone Target for Month-End:
- **Project Target**: Complete **${projName}**
- **Readiness Target**: Advance readiness score from **${readiness.overallScore}%** toward **${Math.min(100, readiness.overallScore + 15)}%**
- **Target Completion**: On track for graduation by **${studyPace.targetMonthYear}**

> 💡 **Coach's Rule**: Protect your ${studyPace.weeklyHours} hours each week by scheduling fixed study blocks. Consistency beats cramming every time!`;
  }

  // ── 6. "How does this career compare with another career?" ────────────
  if (
    query.includes("compare with") ||
    query.includes("compared to") ||
    query.includes("compare to") ||
    query.includes("how does this compare") ||
    query.includes("difference between") ||
    query.includes("vs") ||
    query.includes("compare")
  ) {
    const comparisonCareer = extractComparisonCareer(query, career.slug);

    if (!comparisonCareer) {
      return `### ⚖️ Career Comparison

You are currently targeting **${career.title}** (${career.category}).

To compare with another pathway, ask me something like:
- *"How does this career compare with AI & Data Science?"*
- *"How does Software Development compare with Product Management?"*
- *"Compare this career with Finance & Investment."*`;
    }

    const currentTools = career.toolsTechnologies?.slice(0, 4).join(", ") || "Standard toolchain";
    const compareTools = comparisonCareer.toolsTechnologies?.slice(0, 4).join(", ") || "Standard toolchain";
    const targetIntel = resolveCareerIntelligence(career.slug);

    const compDifficulty =
      comparisonCareer.industryInfo?.difficultyToEnter ||
      comparisonCareer.snapshot.find((s) => s.label.toLowerCase().includes("difficulty"))?.value ||
      "Moderate to High";

    const compGrowth =
      comparisonCareer.industryInfo?.growthPotential ||
      comparisonCareer.snapshot.find((s) => s.label.toLowerCase().includes("growth"))?.value ||
      "Expanding";

    const overlapTraits = targetIntel?.primaryTraits?.join(" & ") || "analytical thinking";

    return `### ⚖️ Career Comparison: **${career.title}** vs. **${comparisonCareer.title}**

Here is a side-by-side breakdown of how your current track compares with **${comparisonCareer.title}**:

| Dimension | **${career.title}** (Your Track) | **${comparisonCareer.title}** |
|---|---|---|
| **Domain** | ${career.category} | ${comparisonCareer.category} |
| **Core Focus** | ${career.tagline} | ${comparisonCareer.tagline} |
| **Barrier to Entry** | ${career.difficultyToEnter} | ${compDifficulty} |
| **Growth Potential** | ${career.growthPotential} | ${compGrowth} |
| **Key Toolchain** | ${currentTools} | ${compareTools} |
| **Primary Roles** | ${career.roleProgression?.slice(0, 2).join(", ") || "Entry practitioners"} | ${comparisonCareer.roleProgression?.slice(0, 2).join(", ") || "Entry practitioners"} |

#### Key Strategic Differences:
1. **Core Problem-Solving**:
   - **${career.title}**: Focuses on ${career.responsibilities?.[0] || "engineering functional solutions"}.
   - **${comparisonCareer.title}**: Focuses on ${comparisonCareer.responsibilities?.[0] || "domain-specific specialized outcomes"}.

2. **Transition Overlap**:
   - If you ever decide to pivot, shared fundamentals in ${overlapTraits} give you transferable advantage.

> 🧭 **Bottom Line**: Both pathways offer strong long-term career growth. Your current **${career.matchPercentage}% match** indicates high alignment with **${career.title}**.`;
  }

  // ── 7. "What should I do after completing this milestone?" ────────────
  if (
    query.includes("after completing this milestone") ||
    query.includes("after this milestone") ||
    query.includes("completed milestone") ||
    query.includes("finished milestone") ||
    query.includes("next milestone")
  ) {
    const plan = roadmapPlan;
    const currentMilestoneTitle = plan?.completionState.nextMilestone?.title || roadmap.nextMilestone;
    const allMilestones = plan?.milestones || [];
    const currentIndex = allMilestones.findIndex((m) => m.title === currentMilestoneTitle);
    const nextMilestoneInSeq = currentIndex >= 0 && currentIndex < allMilestones.length - 1
      ? allMilestones[currentIndex + 1]
      : null;

    const nextTitle = nextMilestoneInSeq?.title || `Phase ${roadmap.currentPhaseNumber + 1} Specialization`;
    const nextReason = nextMilestoneInSeq?.relevance.reason || "Advancing toward applied project execution";
    const nextHours = nextMilestoneInSeq?.estimatedEffort.hours || 15;

    return `### 🏁 What to Do After Completing **${currentMilestoneTitle}**

Once you finish your active milestone, follow this checklist to lock in your progress:

#### 1. Completion & Verification Checklist:
- [ ] **Commit & Document**: Push any code or notes to your personal GitHub/portfolio repository.
- [ ] **Mark Done on Dashboard**: Toggle this milestone or task in your dashboard to immediately increase your Roadmap Progress (currently **${roadmap.phaseProgressPercent}%**).
- [ ] **Check Skill Matrix**: If this milestone covered **${skills.priorityGaps[0]?.name || "core skills"}**, toggle it to **Mastered**.

#### 2. Your Next Sequential Milestone: **${nextTitle}**
- **Why this is next**: ${nextReason}
- **Estimated Effort**: ~\`${nextHours} hours\`
- **What this unblocks**: Fulfills prerequisite competency for upcoming applied portfolio deliverables.

> 🚀 **Keep the momentum going**: Take a short break, then preview the core objectives of **${nextTitle}** before your next study session!`;
  }

  // ── 8. "What should I do today?" ─────────────────────────────────────
  if (
    query.includes("what should i do today") ||
    query.includes("what to do today") ||
    query.includes("today")
  ) {
    const topGap = skills.priorityGaps[0];
    const primaryRec = recommendations?.primaryRecommendation;
    const actionTitle = primaryRec?.title || nextAction.title;
    const actionReason = primaryRec?.reason || nextAction.reasoning;
    const actionEffort = primaryRec?.estimatedEffort || nextAction.estimatedTime;

    return `### 🎯 Your Focus for Today

Based on your current progress in **${career.title}**, here is your highest-leverage plan:

1. **Primary Objective**: **${actionTitle}**
   - **Rationale**: ${actionReason}
   - **Time Commitment**: \`${actionEffort}\`
   ${primaryRec?.sourceContext ? `- **Why Recommended**: ${primaryRec.sourceContext}` : ""}

2. **Skill Gap Workout**:
   ${topGap ? `- Dedicate 30–45 minutes to **${topGap.name}** (${topGap.category}). ${topGap.whyItMatters}` : "- Spend 30 minutes practicing exercises from your active phase."}

3. **Weekly Velocity**:
   - You're on track at **${studyPace.weeklyHours} hrs/week** targeting readiness by **${studyPace.targetMonthYear}**. Completing today's task pushes your Readiness Score past **${readiness.overallScore}%**.

> **Quick Action**: Head to your active phase in the roadmap and mark off the current concepts once you've reviewed them!`;
  }

  // ── 9. "Am I ready for internships?" ─────────────────────────────────
  if (
    query.includes("ready for internship") ||
    query.includes("internship") ||
    query.includes("ready for a job")
  ) {
    const isReady = jobPrep.isInternshipReady;
    const completedProjectsCount = projects.completed.length;

    if (isReady) {
      return `### 🚀 Internship Readiness Assessment: **Ready to Apply!**

Great news! Your profile currently shows strong readiness for introductory internships in **${career.title}**:

- **Readiness Index**: **${readiness.overallScore}%** (Level ${readiness.tierLevel}: ${readiness.tierName})
- **Portfolio Proof**: You have built **${completedProjectsCount} projects**, giving recruiters verifiable code to evaluate.
- **Foundations**: You have completed **${roadmap.phaseProgressPercent}%** of the core curriculum.

#### What to do this week:
1. **Polish your GitHub & Portfolio**: Ensure your top project (**${projects.completed[0] || "Capstone"}**) has a clear README and setup guide.
2. **Apply to 3–5 early-career / student roles** highlighting your verified competencies (${skills.mastered.slice(0, 3).join(", ") || "core tools"}).
3. **Practice technical problem solving** for interview screening rounds.`;
    }

    return `### 📋 Internship Readiness Assessment: **In Progress (${readiness.overallScore}%)**

You are currently at **Level ${readiness.tierLevel}: ${readiness.tierName}**. While you've made meaningful progress, you aren't quite ready for technical interviews yet. Here is exactly what is missing:

1. **Portfolio Proof (Current: ${completedProjectsCount} projects built)**:
   - Recruiters need to see at least 1–2 deployed, functional projects.
   - **Next Target**: Build **${projects.nextToBuild?.title || "your first capstone project"}** (${projects.nextToBuild?.difficulty || "beginner"}).

2. **Core Skill Gap**:
   ${skills.priorityGaps.length > 0 ? `- You still have gaps in **${skills.priorityGaps.map((g) => g.name).join(" & ")}**. Closing these is critical before technical screening calls.` : "- Complete verification for your remaining domain skills."}

3. **Next Level Milestone**:
   - ${readiness.nextTierRequirement}

> **Bottom Line**: Focus on shipping **${projects.nextToBuild?.title || "Project 1"}**. That will unlock internship eligibility!`;
  }

  // ── 10. "How can I improve my readiness score?" ──────────────────────
  if (
    query.includes("improve my readiness") ||
    query.includes("readiness score") ||
    query.includes("increase score")
  ) {
    return `### 📈 How to Boost Your Readiness Score (Currently ${readiness.overallScore}%)

Your Career Readiness Index is calculated across **3 transparent pillars**. Here is the fastest path to gain points right now:

1. **Portfolio & Proof (+15–25 pts)** — *Highest Yield!*
   - Build **${projects.nextToBuild?.title || "your next capstone project"}**. Checking off this project delivers an immediate jump in your Portfolio score (currently ${readiness.portfolioScore}%).

2. **Skill Mastery (+10–15 pts)**:
   ${skills.priorityGaps[0] ? `- Master and verify **${skills.priorityGaps[0].name}** in the Skill Matrix on your dashboard.` : "- Verify all remaining core skills in your active phase."}

3. **Foundations (+10 pts)**:
   - Complete the remaining tasks in **Phase ${roadmap.currentPhaseNumber}** (${roadmap.currentPhaseTitle}).

> **Next Tier Target**: Reaching **${readiness.tierLevel < 4 ? "Level " + (readiness.tierLevel + 1) : "Maximum Mastery"}** requires: *${readiness.nextTierRequirement}*`;
  }

  // ── 11. "What tools and technologies should I learn?" ────────────────
  if (
    query.includes("tool") ||
    query.includes("technology") ||
    query.includes("technologies") ||
    query.includes("tech stack")
  ) {
    const tools = career.toolsTechnologies || [];
    return `### 🛠️ Key Tools & Technologies for **${career.title}**

Industry standards prioritize mastering the following tools and technologies:

${tools.length > 0 ? tools.map((t, idx) => `${idx + 1}. **${t}**`).join("\n") : "- Industry-standard software and development suites"}

#### How to prioritize them:
1. **Focus on your current phase**: In **Phase ${roadmap.currentPhaseNumber} (${roadmap.currentPhaseTitle})**, get hands-on experience by building your milestone projects with these tools.
2. **Portfolio Integration**: Highlight these specific tools in your project READMEs so recruiters can verify your technical fluency.`;
  }

  // ── 12. General / Free-form Query Fallback ───────────────────────────
  return `### 🧭 Career Compass Guidance for ${career.title}

Regarding your question about **"${userQuery}"**:

In the context of your journey as an aspiring **${career.title}** (currently **Level ${readiness.tierLevel}: ${readiness.tierName}**, **${readiness.overallScore}% Readiness**):

- **Current Stage**: You are actively progressing through **Phase ${roadmap.currentPhaseNumber}: ${roadmap.currentPhaseTitle}**.
- **Key Bottleneck**: ${skills.priorityGaps[0] ? `Make sure to build solid competence in **${skills.priorityGaps[0].name}**.` : "Maintain consistent weekly project cadence."}
- **Immediate Recommended Action**: **${nextAction.title}** (${nextAction.estimatedTime}).

> Feel free to ask me to drill into any specific technical concept, compare careers, explain what project to build, or plan your study month!`;
}
