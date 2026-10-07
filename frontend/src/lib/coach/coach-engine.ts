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
    description: `Start with core fundamentals of ${context.career?.title || "your chosen career path"}`,
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
    `- Career Match Alignment: ${career?.matchPercentage !== undefined ? `${career.matchPercentage}%` : "Not yet assessed (Exploration Mode)"}`,
    `- Why Career Matches User: ${assessmentInterpretation?.whyCareerMatches || `Aligned with interest in ${career?.category || "this career domain"}.`}`,
    `- Identified Strengths: ${assessmentInterpretation?.strengths?.length ? assessmentInterpretation.strengths.map((s) => `${s.title} (${s.explanation})`).join("; ") : "Self-directed learning, core curiosity"}`,
    `- Identified Skill Gaps: ${assessmentInterpretation?.gaps?.length ? assessmentInterpretation.gaps.map((g) => `${g.title} (${g.explanation})`).join("; ") : "Domain-specific project execution and portfolio proof"}`,
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
    `- Core Responsibilities: ${career.responsibilities?.slice(0, 4).join("; ") || "Professional domain execution and industry practice"}`,
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
    `- Progress Level: Level ${readiness.tierLevel} (${readiness.tierName})`,
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
 * Detects if a message is a simple, standalone greeting.
 */
export function isGreeting(text: string): boolean {
  const clean = text.trim().toLowerCase().replace(/[!.,?]+$/, "").trim();
  return /^(hello|hi|hey|hey there|good morning|good afternoon|good evening|howdy|hiya|yo|greetings)(\s+(there|companion|bot|friend))?$/i.test(clean);
}

/**
 * Detects if a message is a simple acknowledgement or thank you.
 */
export function isAcknowledgement(text: string): boolean {
  const clean = text.trim().toLowerCase().replace(/[!.,?]+$/, "").trim();
  return /^(thanks|thank you|thx|ty|thanks a lot|thank you so much|many thanks|cool|got it|okay|ok|great|awesome|perfect|sounds good|nice)$/i.test(clean);
}

/**
 * Detects if a message is a simple farewell/goodbye.
 */
export function isGoodbye(text: string): boolean {
  const clean = text.trim().toLowerCase().replace(/[!.,?]+$/, "").trim();
  return /^(bye|goodbye|see ya|cya|take care|have a good day)$/i.test(clean);
}

/**
 * Format the structured system prompt for the coach with anti-hallucination guardrails.
 */
export function buildCoachSystemPrompt(context: CareerCoachContext): string {
  const structuredContext = formatStructuredCoachContext(context);
  const matchPct = context.career.matchPercentage ? Math.round(context.career.matchPercentage) : 0;

  return `You are Career Companion, a friendly, encouraging AI guide for Class 9–10 school students (ages 14–16).
You have access to the student's journey in Career Compass:

${structuredContext}

CONVERSATIONAL BEHAVIOR & GUIDELINES:
1. NATURAL CONVERSATION:
   - For greetings ("hello", "hi", "hey"), acknowledgements ("thanks", "thank you", "cool", "ok"), or casual talk, respond naturally and briefly (1-2 sentences).
   - Example greeting: "Hey! 👋 What can I help you with?"
   - Example thanks: "You're welcome! Want to explore anything else?"
   - NEVER generate a career report just because career context is available.
2. CONTEXT SHOULD INFORM ANSWERS, NOT OVERRIDE:
   - Use the student's current career (${context.career.title}) only when the question is relevant to it.
   - Do NOT force every response into a career report.
3. REMOVE REPORT-LIKE RESPONSE STYLE:
   - Do NOT generate enterprise dashboard headings like "Career Compass Guidance for...", "Skill Gap Analysis", "Priority Missing Skills", "Immediate Bottlenecks", or "Transparent Skill Inventory".
   - Keep answers conversational, warm, and easy to read.
4. SIMPLIFY LANGUAGE FOR CLASS 9–10:
   - Use student-friendly wording: use "Skills you can work on next" (not "Priority missing skills"), "Good areas to focus on" (not "Immediate bottlenecks").
   - Avoid enterprise or corporate jargon like "transparent skill inventory", "verified progress", "readiness analysis".
5. CONCISE LENGTH:
   - Default responses should be 2–5 sentences, concise, easy to scan in a small 320px chat panel.
   - Use short bullet lists (2–3 items) only when helpful.
6. MATCH SCORE CONSISTENCY:
   - If referencing career match, always use the rounded integer (${matchPct}% match). Never invent decimals (like 75.1%) or a conflicting readiness score.`;
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
 * Tailored specifically for Class 9–10 students: conversational, concise, and supportive.
 */
export async function generateLocalCoachResponse(
  userQuery: string,
  rawContext: CareerCoachContext
): Promise<string> {
  const query = userQuery.trim().toLowerCase();
  const context = normalizeCoachContext(rawContext);
  const {
    career,
    roadmap,
    roadmapPlan,
    skills,
    projects,
    studyPace,
    nextAction,
    recommendations,
    userProfile,
    assessmentInterpretation,
  } = context;

  // ── 0. Natural Conversation (Greetings, Thanks, Acknowledgements, Casual) ─
  if (isGreeting(userQuery)) {
    return "Hey! 👋 What can I help you with?";
  }

  if (isAcknowledgement(userQuery)) {
    return "You're welcome! Want to explore anything else?";
  }

  if (isGoodbye(userQuery)) {
    return "Bye! Come back anytime you want to explore more careers. 👋";
  }

  if (query.includes("how are you")) {
    return "I'm doing great, thanks for asking! Ready to help you explore careers and roadmaps. What's on your mind?";
  }

  if (query.includes("who are you") || query.includes("what are you")) {
    return "I'm your Career Companion! I help Class 9–10 students explore careers, understand what skills they need, and plan what to study after 10th. What would you like to know?";
  }

  // ── 1. "What does this career involve?" ──────────────────────────────
  if (
    query.includes("what does this career involve") ||
    query.includes("career involve") ||
    query.includes("what does this involve") ||
    query.includes("what does this career do") ||
    query.includes("what do they do") ||
    query.includes("day to day") ||
    query.includes("responsibilities")
  ) {
    const responsibilities = career.responsibilities || [];
    const coreTasks = responsibilities.slice(0, 3);
    const summary = career.overview
      ? career.overview.split(".")[0].trim() + "."
      : career.tagline;

    let response = `As a **${career.title}**, you ${summary.toLowerCase().startsWith("as a") ? summary : summary.charAt(0).toLowerCase() + summary.slice(1)}`;
    if (!response.endsWith(".")) response += ".";

    if (coreTasks.length > 0) {
      response += `\n\n**Here is what daily work typically looks like:**\n`;
      response += coreTasks.map((r) => `- ${r}`).join("\n");
    }

    response += `\n\nWould you like to know what skills or subjects are needed for this path?`;
    return response.trim();
  }

  // ── 2. "Why did I get this career?" / "Why was this career recommended?" ─
  if (
    query.includes("why did i get this career") ||
    query.includes("why did i get") ||
    query.includes("why i got") ||
    query.includes("why was this career recommended") ||
    query.includes("why this career") ||
    query.includes("why recommended") ||
    query.includes("why did i match") ||
    query.includes("why am i matched")
  ) {
    const matchPct = career.matchPercentage !== undefined ? Math.round(career.matchPercentage) : undefined;

    if (!userProfile?.hasAssessment || matchPct === undefined || matchPct === 0) {
      return `You're currently exploring **${career.title}** in discovery mode.\n\nThis pathway is great for students who enjoy problem-solving, science experiments, and analytical thinking. If you take the short Career Compass assessment, I can show you your personalized match percentage and strength breakdown!`;
    }

    const dominantTrait = userProfile.topTrait || "analytical thinking";
    const strengths = assessmentInterpretation.strengths?.slice(0, 2).map((s) => s.title) || [];
    const strengthsMention = strengths.length > 0 ? ` and ${strengths.join(", ").toLowerCase()}` : "";

    return `**${career.title}** was recommended with a **${matchPct}% match** based on your assessment results.\n\nYour profile showed strong strengths in **${dominantTrait}**${strengthsMention}. You naturally enjoy asking how things work, testing ideas, and finding evidence — which is the core mindset of a researcher!\n\nWould you like to see what subjects you should take in Class 11–12 for this?`;
  }

  // ── 3. "What should I study after 10th?" / "What subjects should I focus on?" ──
  if (
    query.includes("after 10th") ||
    query.includes("what should i study after 10th") ||
    query.includes("study after 10th") ||
    query.includes("what stream") ||
    query.includes("which stream") ||
    query.includes("stream after 10th") ||
    query.includes("stream") ||
    query.includes("what subjects should i focus on") ||
    query.includes("what subjects") ||
    query.includes("which subjects") ||
    query.includes("subjects to focus on") ||
    query.includes("subjects")
  ) {
    const stream = career.educationPath?.recommendedStream || "Science stream";
    const degrees = career.educationPath?.degrees || [];
    const targetDegree = degrees[0] || "a Bachelor's degree in science or a related discipline";

    return `After 10th, the best route for **${career.title}** is taking the **${stream}** in Class 11–12.\n\nFocus on building strong conceptual understanding in math and science fundamentals rather than just memorizing formulas. Later on, you'll typically pursue ${targetDegree.includes("Bachelor") || targetDegree.includes("B.Sc") ? targetDegree : `a ${targetDegree}`} followed by specialized higher studies.\n\nWant to know what hands-on skills or projects you can start exploring right now?`;
  }

  // ── 4. "What skills do I need?" / "What skills does this career need?" ────
  if (
    query.includes("what skills do i need") ||
    query.includes("what skills are needed") ||
    query.includes("what skills does this career need") ||
    query.includes("what skills does it need") ||
    query.includes("skills needed") ||
    query.includes("skills do i need") ||
    query.includes("what skills am i missing") ||
    query.includes("skills missing") ||
    query.includes("missing skills") ||
    query.includes("what am i missing") ||
    query.includes("skill gaps") ||
    query.includes("my gaps") ||
    query.includes("skills")
  ) {
    const gaps = skills.priorityGaps.slice(0, 3);
    const mastered = skills.mastered.slice(0, 3);

    let response = `To build a strong foundation for **${career.title}**, here are key skills to focus on:\n\n`;

    if (gaps.length > 0) {
      response += `**Skills you can work on next:**\n`;
      response += gaps
        .map((g) => `- **${g.name}**: ${g.whyItMatters || "Helps build core problem-solving capability."}`)
        .join("\n");
    } else {
      const topSkills = career.toolsTechnologies?.slice(0, 3) || [];
      response += `**Good areas to focus on:**\n`;
      response += topSkills.map((s) => `- **${s}**`).join("\n");
    }

    if (mastered.length > 0) {
      response += `\n\n**Skills you've already started:** ${mastered.join(", ")}.`;
    }

    response += `\n\nYou can start practicing these right now through school science projects! Would you like some project ideas?`;
    return response.trim();
  }

  // ── 5. "What should I learn next?" ───────────────────────────────────
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

    return `Right now in **Phase ${roadmap.currentPhaseNumber}: ${roadmap.currentPhaseTitle}**, your best next step is to focus on **${targetTitle}**.\n\n${reasonText}\n\nTry working through a small hands-on exercise or school experiment to practice it. Once you feel confident, you can mark it complete on your roadmap!`;
  }

  // ── 6. "What project should I build?" ─────────────────────────────────
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
      return `You've already built all the recommended milestone projects for **${career.title}**! 🎉\n\nA great next step is to polish your project notes, create a simple poster or summary, and share what you discovered with your teachers or classmates.`;
    }

    const featureHighlights = proj.features.slice(0, 3).map((f) => `- ${f}`).join("\n");

    return `A great project to start with is **${proj.title}** (${proj.difficulty} level).\n\n${proj.description}\n\n**Key things to include:**\n${featureHighlights}\n\nBuilding this gives you real hands-on proof of how science works! Would you like help planning the first step?`;
  }

  // ── 7. "What should I focus on this month?" / "What should I do today?" ─
  if (
    query.includes("what should i focus on this month") ||
    query.includes("focus this month") ||
    query.includes("month focus") ||
    query.includes("monthly plan") ||
    query.includes("this month") ||
    query.includes("what should i do today") ||
    query.includes("what to do today") ||
    query.includes("today")
  ) {
    const weeklyHours = studyPace.weeklyHours || 10;
    const topGap = skills.priorityGaps[0]?.name || "core fundamentals";
    const projName = projects.nextToBuild?.title || "a hands-on project";

    return `At your pace of about **${weeklyHours} hours per week**, here's a simple focus plan:\n\n1. **First 2 weeks**: Focus on understanding **${topGap}** through quick daily study sessions.\n2. **Next 2 weeks**: Apply what you learned by starting **${projName}**.\n\nSpending just 1–2 hours consistently a few days a week is the best way to make steady progress!`;
  }

  // ── 8. "How does this career compare with another career?" ────────────
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
      return `You're currently exploring **${career.title}** (${career.category}).\n\nTo compare with another path, ask me something like:\n- *"How does this career compare with AI & Data Science?"*\n- *"How does Software Development compare with Product Management?"*`;
    }

    const compTools = comparisonCareer.toolsTechnologies?.slice(0, 3).join(", ") || "specialized tools";
    const currentTools = career.toolsTechnologies?.slice(0, 3).join(", ") || "domain tools";

    return `Here is how **${career.title}** compares with **${comparisonCareer.title}**:\n\n- **${career.title}**: Focuses on ${career.tagline.toLowerCase().replace(/\.$/, "")}, using tools like ${currentTools}.\n- **${comparisonCareer.title}**: Focuses on ${comparisonCareer.tagline.toLowerCase().replace(/\.$/, "")}, using tools like ${compTools}.\n\nBoth are exciting paths with great growth! Which of these two areas sparks your curiosity more?`;
  }

  // ── 9. "Am I ready for internships / jobs?" ───────────────────────────
  if (
    query.includes("ready for internship") ||
    query.includes("internship") ||
    query.includes("ready for a job")
  ) {
    return `Since you're currently in school, you don't need to worry about formal internships or jobs just yet! 😊\n\nAt this stage, the best way to prepare is participating in school science exhibitions, competitions (like Olympiads), and hands-on projects. Those experiences build real confidence and look amazing on college applications later on.`;
  }

  // ── 10. "What tools and technologies should I learn?" ─────────────────
  if (
    query.includes("tool") ||
    query.includes("technology") ||
    query.includes("technologies") ||
    query.includes("tech stack")
  ) {
    const tools = career.toolsTechnologies?.slice(0, 4) || [];
    if (tools.length === 0) {
      return `For **${career.title}**, you'll typically use specialized tools for observation, data recording, and analysis. In school, getting comfortable with spreadsheets and basic computer tools is a great first step!`;
    }

    return `For **${career.title}**, here are some of the most useful tools to get familiar with:\n\n${tools.map((t) => `- **${t}**`).join("\n")}\n\nIn Class 9–10, you don't need to master all of them right away — just exploring beginner tutorials or spreadsheets is a great way to start!`;
  }

  // ── 11. "After completing this milestone?" ────────────────────────────
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

    return `Once you complete **${currentMilestoneTitle}**, make sure to toggle it as done on your roadmap to track your progress!\n\nYour next milestone after that will be **${nextTitle}**. Take a short break, review what you learned, and then dive into the next phase when you're ready!`;
  }

  // ── 12. "How to improve skills / readiness?" ──────────────────────────
  if (
    query.includes("improve my readiness") ||
    query.includes("readiness score") ||
    query.includes("increase score") ||
    query.includes("improve my skills") ||
    query.includes("strengthen my profile")
  ) {
    const topGap = skills.priorityGaps[0]?.name || "foundation skills";
    const proj = projects.nextToBuild?.title || "your next hands-on project";

    return `Here are the top two ways to build your skills right now:\n\n1. **Practice Key Skills**: Work on **${topGap}** using exercises from your current roadmap phase.\n2. **Build Hands-On Projects**: Start working on **${proj}** to put what you've learned into practice.\n\nCompleting hands-on projects is the single best way to prove your abilities!`;
  }

  // ── 13. General Conversational Fallback ───────────────────────────────
  const matchStr = career.matchPercentage && career.matchPercentage > 0
    ? ` (${Math.round(career.matchPercentage)}% match)`
    : "";

  return `Since you're exploring **${career.title}**${matchStr}, I can help you understand what this career involves, what skills you need, or what to study after 10th.\n\nWhat specifically would you like to explore?`;
}
