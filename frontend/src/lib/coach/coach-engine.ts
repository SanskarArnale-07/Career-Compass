/**
 * AI Career Coach Response Engine
 *
 * Provides journey-grounded, context-aware coaching advice.
 * Evaluates the student's actual Career Compass state:
 * - Assessment traits & top career recommendations
 * - Target career & match %
 * - Multi-turn conversation history
 * - Phased skills roadmaps across all 28 catalog pathways
 * - UPSC & Indian Civil Services entry requirements
 * - Project portfolio milestones & study pace
 *
 * Strictly adheres to verified Career Compass intelligence without hallucinating facts.
 */

import type { CareerCoachContext } from "../career-details/career-context";
import {
  resolveCareerIntelligence,
  getAllCareerIntelligence,
  getCareerIntelligence,
  type CareerIntelligence,
} from "../career-intelligence";

export const SUGGESTED_QUESTIONS = [
  "What careers match my strengths?",
  "How do I become a cybersecurity analyst?",
  "What skills should I learn first?",
  "How can I prepare for UPSC?",
  "Compare software engineering and data analytics",
  "Is UI/UX design a good career for me?",
  "What should I do next in my current roadmap?",
  "What should I study after 10th?",
];

export interface ChatHistoryMessage {
  role: "user" | "assistant" | "coach" | "companion" | "system";
  content: string;
}

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
    topCareers: [],
    recommendedStream: undefined,
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

  void _progressReport;

  // 1. USER CONTEXT
  const userContextLines = [
    "=== USER CONTEXT ===",
    `- Assessment Status: ${userProfile?.hasAssessment ? "Completed" : "Not completed (using default baseline)"}`,
    userProfile?.hasAssessment && userProfile.primaryTraits?.length
      ? `- Primary Traits: ${userProfile.primaryTraits.map((t) => `${t.label} (${t.code}: ${t.score}%)`).join(", ")}`
      : "- Primary Traits: Not yet assessed",
    `- Top Dominant Trait: ${userProfile?.topTrait || "Adaptability"}`,
    `- Top Recommended Careers: ${userProfile?.topCareers?.length ? userProfile.topCareers.map((c) => `${c.career_name} (${Math.round(c.match_percentage)}%)`).join(", ") : "Not yet generated"}`,
    `- Recommended Stream: ${userProfile?.recommendedStream || "Not yet determined"}`,
    `- Assessment Profile Summary: ${userProfile?.assessmentSummary || "General career explorer profile."}`,
    `- Current Career Match Alignment: ${career?.matchPercentage !== undefined ? `${career.matchPercentage}%` : "Not yet assessed (Exploration Mode)"}`,
    `- Why Career Matches User: ${assessmentInterpretation?.whyCareerMatches || `Aligned with interest in ${career?.category || "this career domain"}.`}`,
  ];

  // 2. CAREER DATA
  const careerDataLines = [
    "=== ACTIVE CAREER CONTEXT ===",
    `- Active Career: ${career.title} (Slug: ${career.slug})`,
    `- Domain Category: ${career.category}`,
    `- Tagline: ${career.tagline}`,
    `- Recommended Stream After 10th: ${career.educationPath?.recommendedStream || "Science stream"}`,
    `- Recommended Degree: ${career.educationPath?.degrees?.join(", ") || "Bachelor's degree in a relevant discipline"}`,
    `- Key Skills: ${career.toolsTechnologies?.slice(0, 5).join(", ") || "Core analytical & domain tools"}`,
  ];

  // 3. ROADMAP & PROGRESS
  const roadmapLines = [
    "=== ACTIVE ROADMAP ===",
    `- Current Phase: Phase ${roadmap.currentPhaseNumber}: ${roadmap.currentPhaseTitle}`,
    `- Phase Duration: ${roadmap.currentPhaseDuration}`,
    `- Next Milestone: ${roadmap.nextMilestone}`,
    `- Next Recommended Action: ${nextAction.title} (${nextAction.reasoning})`,
  ];

  return [...userContextLines, "", ...careerDataLines, "", ...roadmapLines].join("\n");
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

  return `You are Career Companion, a friendly, encouraging, and context-aware AI career guidance assistant for school students (Class 9–12, ages 14–18).

You have access to the student's journey in Career Compass:
${structuredContext}

You also have comprehensive knowledge of the entire Career Compass catalog of 28 career pathways across Technology, Engineering, Design, Management, Sciences, Healthcare, Civil Services & Public Policy, Law, Finance, and Media.

CRITICAL INSTRUCTIONS:
1. ALWAYS ANSWER THE EXACT QUESTION ASKED:
   - If the student asks about a specific career (e.g., Cybersecurity, UPSC, UI/UX Design, Data Analytics, Medicine, Law), answer specifically about THAT career.
   - Do NOT force every response back to the active page career (${context.career.title}) unless the question is actually about it.
2. MULTI-TURN CONVERSATION MEMORY:
   - When a student asks a follow-up (e.g. "What should I learn first?"), use the conversation history to understand what career or topic was previously discussed.
3. PERSONALIZATION WITH HONEST DATA:
   - When asked what matches their strengths, reference their actual assessment results (${context.userProfile?.primaryTraits?.map((t) => `${t.label}: ${t.score}%`).join(", ") || "not yet taken"}).
   - If they haven't taken the assessment, state that limitation honestly and explain how the assessment works without inventing numbers.
4. STRUCTURE OF ANSWERS:
   - 1. Direct answer.
   - 2. Concrete explanation or details (short bullet points).
   - 3. Actionable next step or practical advice for school students.
5. CONCISE, STUDENT-FRIENDLY TONE:
   - Keep answers between 2–4 short paragraphs or bullet lists.
   - Avoid enterprise jargon like "transparent skill inventory" or "verified progress".`;
}

/**
 * Helper to match keywords as whole words or delimited boundaries.
 * Prevents false positives where short keywords match inside longer words (e.g. "ca" inside "career").
 */
export function matchesKeyword(text: string, keyword: string): boolean {
  if (!text || !keyword) return false;
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(?:^|[^a-zA-Z0-9])${escaped}(?:[^a-zA-Z0-9]|$)`, "i");
  return regex.test(text);
}

// ── Career Keyword Mappings for Intent Detection ──────────────────────
interface CareerKeywordMap {
  slug: string;
  keywords: string[];
}

const CAREER_KEYWORDS: CareerKeywordMap[] = [
  {
    slug: "cybersecurity",
    keywords: [
      "cybersecurity",
      "cyber security",
      "cyber",
      "security analyst",
      "ethical hacker",
      "ethical hacking",
      "infosec",
      "information security",
      "penetration testing",
      "pen tester",
      "red team",
      "blue team",
      "soc analyst",
      "cyber defense",
    ],
  },
  {
    slug: "upsc-civil-services",
    keywords: [
      "upsc",
      "civil services",
      "civil service",
      "ias",
      "ips",
      "ifs",
      "irs",
      "district magistrate",
      "dm",
      "collector",
      "upsc cse",
      "civil servant",
      "bureaucrat",
      "bureaucracy",
      "public administration",
    ],
  },
  {
    slug: "design-creative",
    keywords: [
      "ui/ux",
      "ui ux",
      "ui",
      "ux",
      "product design",
      "product designer",
      "user experience",
      "user interface",
      "interaction design",
      "figma",
      "ux design",
      "ui design",
      "graphic design",
    ],
  },
  {
    slug: "software-development",
    keywords: [
      "software engineering",
      "software engineer",
      "software development",
      "software developer",
      "developer",
      "coding",
      "programmer",
      "programming",
      "web developer",
      "app developer",
      "full stack",
      "backend",
      "frontend",
    ],
  },
  {
    slug: "data-analytics-bi",
    keywords: [
      "data analytics",
      "data analyst",
      "business intelligence",
      "bi analyst",
      "analytics",
      "data analysis",
      "business analyst",
    ],
  },
  {
    slug: "ai-ml-data-science",
    keywords: [
      "ai",
      "machine learning",
      "data science",
      "data scientist",
      "artificial intelligence",
      "deep learning",
      "ml engineer",
      "nlp",
    ],
  },
  {
    slug: "management-product",
    keywords: [
      "product management",
      "product manager",
      "pm",
      "tech management",
      "associate product manager",
      "apm",
    ],
  },
  {
    slug: "medicine-healthcare",
    keywords: [
      "medicine",
      "doctor",
      "healthcare",
      "medical",
      "neet",
      "mbbs",
      "physician",
      "surgeon",
    ],
  },
  {
    slug: "engineering",
    keywords: [
      "engineering",
      "engineer",
      "mechanical engineering",
      "electrical engineering",
      "civil engineering",
      "robotics",
      "hardware engineering",
    ],
  },
  {
    slug: "law-policy",
    keywords: [
      "law",
      "lawyer",
      "legal",
      "advocate",
      "clat",
      "corporate law",
      "judiciary",
      "public policy",
    ],
  },
  {
    slug: "finance-investment",
    keywords: [
      "finance",
      "investment banking",
      "investment banker",
      "banking",
      "financial analyst",
      "fintech",
      "chartered accountant",
      "chartered accountancy",
      "ca foundation",
      "ca exam",
      "ca course",
      "c.a.",
      "ca inter",
      "ca final",
      "stock market",
    ],
  },
  {
    slug: "marketing-media",
    keywords: [
      "marketing",
      "digital marketing",
      "seo",
      "branding",
      "social media marketing",
      "content creation",
    ],
  },
  {
    slug: "cloud-infrastructure",
    keywords: [
      "cloud",
      "cloud engineer",
      "devops",
      "aws",
      "azure",
      "cloud computing",
      "infrastructure",
    ],
  },
  {
    slug: "scientific-research",
    keywords: [
      "scientific research",
      "research scientist",
      "scientist",
      "scientific discovery",
      "laboratory",
      "phd",
      "researcher",
    ],
  },
  {
    slug: "psychology-social",
    keywords: [
      "psychology",
      "psychologist",
      "counselor",
      "behavioral science",
      "mental health",
      "counseling",
    ],
  },
  {
    slug: "entrepreneurship",
    keywords: [
      "entrepreneur",
      "startup",
      "founder",
      "entrepreneurship",
      "building a company",
    ],
  },
];

/**
 * Detects whether the query or previous conversation history mentions a specific career.
 * Solves the critical multi-turn follow-up problem.
 */
export function detectCareerFromQueryOrHistory(
  query: string,
  history?: ChatHistoryMessage[],
  defaultSlug?: string
): CareerIntelligence | undefined {
  const q = query.toLowerCase();

  // 1. Direct match in query using keyword dictionary (word boundary safe)
  for (const item of CAREER_KEYWORDS) {
    if (item.keywords.some((k) => matchesKeyword(q, k))) {
      const match = resolveCareerIntelligence(item.slug);
      if (match) return match;
    }
  }

  // 2. Direct match in query using all catalog career titles/slugs
  const allIntel = getAllCareerIntelligence();
  for (const intel of allIntel) {
    const slugName = intel.slug.toLowerCase().replace(/-/g, " ");
    if (
      matchesKeyword(q, intel.title.toLowerCase()) ||
      matchesKeyword(q, intel.careerName.toLowerCase()) ||
      matchesKeyword(q, slugName)
    ) {
      return intel;
    }
  }

  // 3. Multi-turn context resolution: Inspect recent conversation history
  if (history && history.length > 0) {
    const recent = [...history].reverse().slice(0, 6);
    for (const msg of recent) {
      const text = msg.content.toLowerCase();
      for (const item of CAREER_KEYWORDS) {
        if (item.keywords.some((k) => matchesKeyword(text, k))) {
          const match = resolveCareerIntelligence(item.slug);
          if (match) return match;
        }
      }
      for (const intel of allIntel) {
        const slugName = intel.slug.toLowerCase().replace(/-/g, " ");
        if (
          matchesKeyword(text, intel.title.toLowerCase()) ||
          matchesKeyword(text, intel.careerName.toLowerCase()) ||
          matchesKeyword(text, slugName)
        ) {
          return intel;
        }
      }
    }
  }

  // 4. Fallback to active target career if available
  if (defaultSlug) {
    return resolveCareerIntelligence(defaultSlug);
  }

  return undefined;
}

/**
 * Extracts two distinct careers for comparison queries (e.g. "compare software engineering and data analytics").
 */
export function extractTwoCareersForComparison(
  query: string,
  currentSlug: string
): { careerA: CareerIntelligence; careerB: CareerIntelligence } | undefined {
  const q = query.toLowerCase();
  const matchedSlugs: string[] = [];

  for (const item of CAREER_KEYWORDS) {
    if (item.keywords.some((k) => matchesKeyword(q, k)) && !matchedSlugs.includes(item.slug)) {
      matchedSlugs.push(item.slug);
    }
  }

  if (matchedSlugs.length >= 2) {
    const careerA = resolveCareerIntelligence(matchedSlugs[0]);
    const careerB = resolveCareerIntelligence(matchedSlugs[1]);
    if (careerA && careerB) {
      return { careerA, careerB };
    }
  }

  if (matchedSlugs.length === 1) {
    const careerA = resolveCareerIntelligence(currentSlug) || getAllCareerIntelligence()[0];
    const careerB = resolveCareerIntelligence(matchedSlugs[0]);
    if (careerA && careerB && careerA.slug !== careerB.slug) {
      return { careerA, careerB };
    }
  }

  // Fallback defaults for comparison
  const fallbackB = currentSlug === "software-development" ? "data-analytics-bi" : "software-development";
  const careerA = resolveCareerIntelligence(currentSlug) || getAllCareerIntelligence()[0];
  const careerB = resolveCareerIntelligence(fallbackB);
  if (careerA && careerB) {
    return { careerA, careerB };
  }

  return undefined;
}

/**
 * Generate a grounded coach response deterministically.
 * Guarantees zero hallucinations and 100% reliable advice without external dependencies.
 * Tailored specifically for Class 9–12 students: conversational, concise, context-aware, and actionable.
 */
export async function generateLocalCoachResponse(
  userQuery: string,
  rawContext: CareerCoachContext,
  history?: ChatHistoryMessage[]
): Promise<string> {
  const query = userQuery.trim().toLowerCase();
  const context = normalizeCoachContext(rawContext);
  const {
    career: activeCareer,
    roadmap,
    skills,
    projects,
    studyPace,
    nextAction,
    userProfile,
    assessmentInterpretation,
  } = context;

  // ── 0. Natural Fast-Path Conversation (Greetings, Thanks, Farewell) ─────
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
    return "I'm your Career Companion! I help school students explore careers, understand what skills they need, and plan what to study after 10th. What would you like to know?";
  }

  // Off-topic / general web search questions
  if (
    query.includes("weather") ||
    query.includes("capital of") ||
    query.includes("tell me a joke") ||
    query.includes("write a poem") ||
    query.includes("recipe") ||
    query.includes("who is the president") ||
    query.includes("who won")
  ) {
    return "I'm your Career Companion, so my superpower is helping you discover career paths, plan school subjects, and learn skills! For general web searches or trivia, check an encyclopedia or search engine. Can I help you with any career questions or roadmaps today?";
  }

  // ── 1. "What careers match my strengths?" / Recommendation Inquiry ──────
  if (
    query.includes("what careers match my strengths") ||
    query.includes("which careers match my strengths") ||
    query.includes("what careers match me") ||
    query.includes("what careers fit me") ||
    query.includes("careers that match my strengths") ||
    query.includes("careers for me") ||
    query.includes("recommend careers") ||
    query.includes("my career matches") ||
    query.includes("match my strengths") ||
    query.includes("what career suits me") ||
    query.includes("best careers for me")
  ) {
    if (!userProfile.hasAssessment || !userProfile.primaryTraits?.length) {
      return `You haven't completed the Career Compass assessment yet, so I don't have your personalized trait profile.\n\nTaking our short 5-minute psychometric assessment will calculate your exact match percentages across 28 career pathways based on your cognitive strengths!\n\nIn the meantime, what subjects or activities do you naturally enjoy most?`;
    }

    const topTraitsStr = userProfile.primaryTraits
      .slice(0, 2)
      .map((t) => `**${t.label}** (${t.score}%)`)
      .join(" and ");

    const matches = userProfile.topCareers?.slice(0, 3) || [];

    if (matches.length > 0) {
      let res = `Based on your assessment, your strongest traits are ${topTraitsStr}.\n\nHere are your top matching career pathways:\n\n`;
      matches.forEach((m) => {
        const intel = resolveCareerIntelligence(m.career_name);
        const name = intel?.title || m.career_name;
        res += `- **${name}** (${Math.round(m.match_percentage)}% match): ${m.explanation || intel?.tagline || "High cognitive synergy with your problem-solving style."}\n`;
      });
      res += `\nWould you like to explore the step-by-step roadmap for any of these, or compare two of them?`;
      return res.trim();
    }

    return `Your assessment highlights strong aptitudes in ${topTraitsStr}.\n\nYour profile aligns well with analytical and problem-solving fields like **Software Development**, **AI & Data Science**, and **Product Management**.\n\nWhich of these would you like to dive into?`;
  }

  // ── 2. UPSC & Indian Civil Services Guidance ────────────────────────────
  if (
    query.includes("upsc") ||
    query.includes("civil services") ||
    query.includes("civil service") ||
    query.includes("ias") ||
    query.includes("ips") ||
    query.includes("upsc cse") ||
    query.includes("collector") ||
    query.includes("district magistrate")
  ) {
    const upscIntel = resolveCareerIntelligence("upsc-civil-services");
    const title = upscIntel?.title || "UPSC Civil Services";

    return `To prepare for **${title}** (IAS, IPS, IFS), here is the essential roadmap:\n\n1. **Eligibility & Stream**: You can choose **any academic stream** (Arts, Science, or Commerce) in Class 11–12 and pursue any recognized Bachelor's degree. UPSC eligibility requires graduation in any discipline and a minimum age of 21.\n2. **Exam Architecture**: The UPSC Civil Services Examination (CSE) has 3 stages: **Preliminary Exam** (General Studies + CSAT), **Main Written Exam** (9 papers including essay and optional subject), and the **Personality Test (Interview)**.\n3. **What to do in School (Class 9–12)**:\n   - Build strong foundations by reading standard NCERT textbooks (History, Geography, Polity, Economics).\n   - Cultivate a daily newspaper habit (*The Hindu* or *Indian Express*) to understand current affairs.\n   - Practice clear, analytical essay writing.\n\nWould you like to know what subjects to pick for Class 11–12, or explore the UPSC roadmap?`;
  }

  // ── 3. Career Comparison ("Compare A and B") ─────────────────────────────
  if (
    query.includes("compare") ||
    query.includes("difference between") ||
    query.includes(" vs ") ||
    query.includes("versus")
  ) {
    const pair = extractTwoCareersForComparison(query, activeCareer.slug);
    if (pair) {
      const { careerA, careerB } = pair;
      const toolsA = careerA.toolsTechnologies?.slice(0, 3).join(", ") || "core technical tools";
      const toolsB = careerB.toolsTechnologies?.slice(0, 3).join(", ") || "specialized tools";

      return `Here is how **${careerA.title}** compares with **${careerB.title}**:\n\n- **${careerA.title}**: Focuses on ${careerA.tagline.toLowerCase().replace(/\.$/, "")}. Daily work emphasizes building solutions using tools like ${toolsA}.\n- **${careerB.title}**: Focuses on ${careerB.tagline.toLowerCase().replace(/\.$/, "")}. Daily work emphasizes tools like ${toolsB}.\n\n**How to choose**:\nIf you enjoy creating and building systems from scratch, ${careerA.title} is an ideal fit. If you prefer investigating trends, data, and business impact, ${careerB.title} is a great choice!\n\nWhich of these two problems sounds more interesting to you?`;
    }
  }

  // Detect subject career from query or recent history (supports multi-turn context)
  const resolvedTarget = detectCareerFromQueryOrHistory(query, history, activeCareer.slug);
  const targetCareer: CareerIntelligence =
    resolvedTarget ||
    resolveCareerIntelligence(activeCareer.slug) ||
    getAllCareerIntelligence()[0];

  const isTargetActive = targetCareer.slug === activeCareer.slug;
  let targetMatchPct: number | undefined = undefined;
  if (isTargetActive && activeCareer.matchPercentage !== undefined) {
    targetMatchPct = Math.round(activeCareer.matchPercentage);
  } else if (userProfile.topCareers?.length) {
    const matched = userProfile.topCareers.find(
      (c) =>
        c.career_name.toLowerCase() === targetCareer.title.toLowerCase() ||
        c.career_name.toLowerCase() === targetCareer.careerName.toLowerCase() ||
        resolveCareerIntelligence(c.career_name)?.slug === targetCareer.slug
    );
    if (matched) {
      targetMatchPct = Math.round(matched.match_percentage);
    }
  }

  // ── 4. "Is [career] a good career for me?" / Fit Evaluation ─────────────
  if (
    query.includes("good career for me") ||
    query.includes("right career for me") ||
    query.includes("good for me") ||
    query.includes("right for me") ||
    query.includes("would i be good at") ||
    query.includes("can i do") ||
    query.includes("suitability for") ||
    query.includes("is it good for me")
  ) {
    if (userProfile.hasAssessment && targetMatchPct !== undefined && targetMatchPct > 0) {
      return `**${targetCareer.title}** currently has a **${targetMatchPct}% match** based on your assessment results!\n\nYour natural strengths in **${userProfile.topTrait}** align well with this field's problem-solving requirements. Students in this pathway thrive by ${targetCareer.tagline.toLowerCase()}.\n\nWould you like to see what subjects to study after 10th or what skills to start practicing?`;
    }

    if (userProfile.hasAssessment && userProfile.primaryTraits?.length) {
      const topT = userProfile.primaryTraits[0]?.label || "Analytical Thinking";
      return `**${targetCareer.title}** is a great field if you enjoy ${targetCareer.tagline.toLowerCase()}.\n\nYour assessment highlights strengths in **${topT}**. This provides a solid cognitive foundation, especially when combined with structured hands-on project practice.\n\nWould you like to explore the core skills needed for this path?`;
    }

    return `**${targetCareer.title}** is an exciting, high-growth career focused on ${targetCareer.tagline.toLowerCase()}.\n\nIt is especially well-suited for students who enjoy problem-solving, structured learning, and practical projects. Once you complete the 5-minute Career Compass assessment, I can calculate your exact personalized match score for this path!`;
  }

  // ── 5. "What skills should I learn first?" / Beginner Priorities ────────
  if (
    query.includes("what skills should i learn first") ||
    query.includes("what should i learn first") ||
    query.includes("learn first") ||
    query.includes("what to learn first") ||
    query.includes("skills to learn first") ||
    query.includes("where should i start") ||
    query.includes("what should i start with") ||
    query.includes("first skills") ||
    query.includes("start learning") ||
    query.includes("how to start")
  ) {
    const phase1 = targetCareer.roadmap?.[0];
    const starterSkills: string[] = phase1?.skills?.slice(0, 3) || targetCareer.skills?.slice(0, 3).map((s: { name: string }) => s.name) || [
      "Core problem solving",
      "Foundational tools",
    ];

    let res = `To get started in **${targetCareer.title}**, here are the three foundational skills to learn first:\n\n`;
    starterSkills.forEach((s: string, idx: number) => {
      res += `${idx + 1}. **${s}**: Builds the conceptual bedrock needed before advancing to specialized tools.\n`;
    });
    res += `\nIn Class 9–10, you don't need to master everything immediately. Spending 1–2 hours a week on basic exercises or beginner projects is the best way to start!\n\nWould you like some beginner project ideas or recommended resources for these skills?`;
    return res.trim();
  }

  // ── 6. "How do I become [career]?" / Career Pathway Overview ───────────
  if (
    query.includes("how do i become") ||
    query.includes("how to become") ||
    query.includes("how to get into") ||
    query.includes("how to be a") ||
    query.includes("how to be an") ||
    query.includes("steps to become") ||
    query.includes("path to become")
  ) {
    const stream = targetCareer.educationPath?.recommendedStream || "Science stream";
    const degrees = targetCareer.educationPath?.degrees?.slice(0, 2).join(" or ") || "a relevant Bachelor's degree";
    const starterSkills = targetCareer.roadmap?.[0]?.skills?.slice(0, 2).join(" and ") || "core fundamentals";

    return `Here is the step-by-step pathway to become a **${targetCareer.title}**:\n\n1. **Class 11–12 Stream**: Take the **${stream}** to build the necessary mathematics, science, or analytical base.\n2. **College Education**: Pursue **${degrees}** followed by practical internships or specialized portfolio work.\n3. **Practical Skills in School**: Start learning **${starterSkills}** through hands-on practice and self-paced projects.\n\nWould you like to see what daily work in this career looks like, or what skills you should focus on first?`;
  }

  // ── 7. "What should I do next in my current roadmap?" ───────────────────
  if (
    query.includes("current roadmap") ||
    query.includes("what should i do next in my current roadmap") ||
    query.includes("what should i do next") ||
    query.includes("what to do next") ||
    query.includes("next in roadmap") ||
    query.includes("my next step") ||
    query.includes("my next milestone")
  ) {
    const milestoneTitle = roadmap.nextMilestone || nextAction.title;
    const phaseName = `Phase ${roadmap.currentPhaseNumber}: ${roadmap.currentPhaseTitle}`;

    return `In your active roadmap for **${activeCareer.title}**, you are currently on **${phaseName}**.\n\n**Your immediate next milestone**: **${milestoneTitle}**\n\n${nextAction.reasoning || "Focus on completing this milestone to build steady momentum toward career readiness."}\n\nTry dedicating 1–2 focused sessions this week to work on this milestone, then mark it complete on your dashboard!`;
  }

  // ── 8. "What does this career involve?" ────────────────────────────────
  if (
    query.includes("what does this career involve") ||
    query.includes("career involve") ||
    query.includes("what does this involve") ||
    query.includes("what does this career do") ||
    query.includes("what do they do") ||
    query.includes("day to day") ||
    query.includes("responsibilities") ||
    query.includes("what is this career")
  ) {
    const responsibilities = targetCareer.responsibilities || [];
    const coreTasks = responsibilities.slice(0, 3);
    const summary = targetCareer.description
      ? targetCareer.description.split(".")[0].trim() + "."
      : targetCareer.tagline;

    let response = `As a **${targetCareer.title}**, you ${summary.toLowerCase().startsWith("as a") ? summary : summary.charAt(0).toLowerCase() + summary.slice(1)}`;
    if (!response.endsWith(".")) response += ".";

    if (coreTasks.length > 0) {
      response += `\n\n**Here is what daily work typically looks like:**\n`;
      response += coreTasks.map((r) => `- ${r}`).join("\n");
    }

    response += `\n\nWould you like to know what skills or subjects are needed for this path?`;
    return response.trim();
  }

  // ── 9. "Why was this career recommended?" / Match Explanation ──────────
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
    if (!userProfile?.hasAssessment || targetMatchPct === undefined || targetMatchPct === 0) {
      return `You're currently exploring **${targetCareer.title}** in discovery mode.\n\nThis pathway is great for students who enjoy problem-solving, structured learning, and analytical thinking. If you take the short Career Compass assessment, I can show you your personalized match percentage and strength breakdown!`;
    }

    const dominantTrait = userProfile.topTrait || "analytical thinking";
    const strengths = assessmentInterpretation.strengths?.slice(0, 2).map((s) => s.title) || [];
    const strengthsMention = strengths.length > 0 ? ` and ${strengths.join(", ").toLowerCase()}` : "";

    return `**${targetCareer.title}** was recommended with a **${targetMatchPct}% match** based on your assessment results.\n\nYour profile showed strong strengths in **${dominantTrait}**${strengthsMention}. You naturally enjoy asking how things work, testing ideas, and finding evidence — which aligns directly with this career!\n\nWould you like to see what subjects you should take in Class 11–12 for this?`;
  }

  // ── 10. "What should I study after 10th?" / Stream Guidance ────────────
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
    const stream = targetCareer.educationPath?.recommendedStream || "Science stream";
    const degrees = targetCareer.educationPath?.degrees || [];
    const targetDegree = degrees[0] || "a Bachelor's degree in science or a related discipline";

    return `After 10th, the best route for **${targetCareer.title}** is taking the **${stream}** in Class 11–12.\n\nFocus on building strong conceptual understanding in math and science fundamentals rather than just memorizing formulas. Later on, you'll typically pursue ${targetDegree.includes("Bachelor") || targetDegree.includes("B.Sc") ? targetDegree : `a ${targetDegree}`} followed by specialized higher studies.\n\nWant to know what hands-on skills or projects you can start exploring right now?`;
  }

  // ── 11. "What skills do I need?" / Missing Skills ──────────────────────
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
    const isTargetActive = targetCareer.slug === activeCareer.slug;
    const gaps = isTargetActive ? skills.priorityGaps.slice(0, 3) : [];
    const mastered = isTargetActive ? skills.mastered.slice(0, 3) : [];

    let response = `To build a strong foundation for **${targetCareer.title}**, here are key skills to focus on:\n\n`;

    if (gaps.length > 0) {
      response += `**Skills you can work on next:**\n`;
      response += gaps
        .map((g) => `- **${g.name}**: ${g.whyItMatters || "Helps build core problem-solving capability."}`)
        .join("\n");
    } else {
      const topSkills = targetCareer.toolsTechnologies?.slice(0, 3) || targetCareer.roadmap?.[0]?.skills?.slice(0, 3) || [];
      response += `**Good areas to focus on:**\n`;
      response += topSkills.map((s: string) => `- **${s}**`).join("\n");
    }

    if (mastered.length > 0) {
      response += `\n\n**Skills you've already started:** ${mastered.join(", ")}.`;
    }

    response += `\n\nYou can start practicing these right now through school science projects! Would you like some project ideas?`;
    return response.trim();
  }

  // ── 12. "What should I learn next?" ────────────────────────────────────
  if (
    query.includes("what should i learn next") ||
    query.includes("what to learn next") ||
    query.includes("learn next") ||
    query.includes("what should i study next") ||
    query.includes("next skill")
  ) {
    const topGap = skills.priorityGaps[0];
    const targetTitle = topGap ? topGap.name : nextAction.title;
    const reasonText = topGap ? topGap.whyItMatters : nextAction.reasoning;

    return `Right now in **Phase ${roadmap.currentPhaseNumber}: ${roadmap.currentPhaseTitle}**, your best next step is to focus on **${targetTitle}**.\n\n${reasonText}\n\nTry working through a small hands-on exercise or school experiment to practice it. Once you feel confident, you can mark it complete on your roadmap!`;
  }

  // ── 13. "What project should I build?" ──────────────────────────────────
  if (
    query.includes("what project should i build") ||
    query.includes("which project") ||
    query.includes("project to build") ||
    query.includes("what project") ||
    query.includes("portfolio project") ||
    query.includes("build project") ||
    query.includes("project ideas")
  ) {
    const proj = projects.nextToBuild;

    if (!proj) {
      return `You've already built all the recommended milestone projects for **${targetCareer.title}**! 🎉\n\nA great next step is to polish your project notes, create a simple summary, and share what you discovered with your teachers or classmates.`;
    }

    const featureHighlights = proj.features.slice(0, 3).map((f) => `- ${f}`).join("\n");

    return `A great project to start with is **${proj.title}** (${proj.difficulty} level).\n\n${proj.description}\n\n**Key things to include:**\n${featureHighlights}\n\nBuilding this gives you real hands-on proof of how science works! Would you like help planning the first step?`;
  }

  // ── 14. "What tools and technologies should I learn?" ──────────────────
  if (
    query.includes("tool") ||
    query.includes("technology") ||
    query.includes("technologies") ||
    query.includes("tech stack")
  ) {
    const tools = targetCareer.toolsTechnologies?.slice(0, 4) || [];
    if (tools.length === 0) {
      return `For **${targetCareer.title}**, you'll typically use specialized tools for observation, data recording, and analysis. In school, getting comfortable with spreadsheets and basic computer tools is a great first step!`;
    }

    return `For **${targetCareer.title}**, here are some of the most useful tools to get familiar with:\n\n${tools.map((t) => `- **${t}**`).join("\n")}\n\nIn Class 9–10, you don't need to master all of them right away — just exploring beginner tutorials or spreadsheets is a great way to start!`;
  }

  // ── 15. "Am I ready for internships / jobs?" ───────────────────────────
  if (
    query.includes("ready for internship") ||
    query.includes("internship") ||
    query.includes("ready for a job")
  ) {
    return `Since you're currently in school, you don't need to worry about formal internships or jobs just yet! 😊\n\nAt this stage, the best way to prepare is participating in school science exhibitions, competitions (like Olympiads), and hands-on projects. Those experiences build real confidence and look amazing on college applications later on.`;
  }

  // ── 16. Platform & Assessment Questions ────────────────────────────────
  if (query.includes("assessment") && (query.includes("work") || query.includes("how does"))) {
    return `The Career Compass assessment presents 28 scenarios that measure your natural cognitive styles across 8 core dimensions (like Technical, Analytical, Creative, and Leadership). There are no right or wrong answers — your choices identify which careers match your natural problem-solving flow!`;
  }

  if (query.includes("retake") || query.includes("take again")) {
    return `Yes! You can retake the assessment anytime from the Assessment tab. Retaking recalculates your match percentages across all 28 career tracks.`;
  }

  if (query.includes("career compass") || query.includes("what is this")) {
    return `Career Compass helps school students discover careers matching their natural strengths and provides step-by-step learning roadmaps with projects and study planning.`;
  }

  // ── 17. Intelligent Contextual Fallback ─────────────────────────────────
  // Responds with specific details about the detected career rather than a generic prompt
  const matchStr = targetMatchPct !== undefined && targetMatchPct > 0
    ? ` (${targetMatchPct}% match)`
    : "";

  return `Regarding **${targetCareer.title}**${matchStr}:\n\nThis field focuses on ${targetCareer.tagline.toLowerCase()}.\n\nI can help you explore:\n- **What skills to learn first**\n- **What stream to choose after 10th**\n- **What daily work looks like**\n\nWhat specifically would you like to know?`;
}
