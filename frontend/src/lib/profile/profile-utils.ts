/**
 * Career Compass — Profile Utilities & Personalization Helpers
 *
 * Deterministically derives student persona archetypes, trait rankings,
 * academic stream suitability, and personalized career alignment explanations.
 */

import type { TraitProfile, StreamResult } from "@/lib/types/assessment";

export interface TraitMeta {
  code: string;
  label: string;
  short: string;
  desc: string;
  keyCapability: string;
}

export const CANONICAL_TRAIT_CONFIG: TraitMeta[] = [
  {
    code: "TE",
    label: "Technical Aptitude",
    short: "Technical",
    desc: "Digital systems architecture, tooling mastery, and structured logic",
    keyCapability: "Translates abstract ideas into working technical architectures and functional software.",
  },
  {
    code: "AN",
    label: "Analytical Thinking",
    short: "Analytical",
    desc: "Algorithmic reasoning, data analysis, and quantitative problem-solving",
    keyCapability: "Deconstructs complex multi-variable problems into logical, sequential steps.",
  },
  {
    code: "SC",
    label: "Scientific Curiosity",
    short: "Scientific",
    desc: "Empirical inquiry, hypothesis testing, and investigative discovery",
    keyCapability: "Applies evidence-driven investigation and empirical testing to find root causes.",
  },
  {
    code: "BU",
    label: "Business & Strategy",
    short: "Business",
    desc: "Strategic mindset, value creation, and commercial scaling",
    keyCapability: "Identifies market opportunities, calculates trade-offs, and drives sustainable value.",
  },
  {
    code: "CR",
    label: "Creative Expression",
    short: "Creative",
    desc: "Novel ideation, visual expression, and design innovation",
    keyCapability: "Envisions novel solutions, crafts intuitive experiences, and thinks beyond convention.",
  },
  {
    code: "SO",
    label: "Social & Interpersonal",
    short: "Social",
    desc: "Human communication, emotional intelligence, and collaboration",
    keyCapability: "Builds high-trust relationships, facilitates consensus, and empowers team harmony.",
  },
  {
    code: "LE",
    label: "Leadership & Initiative",
    short: "Leadership",
    desc: "Directional ownership, team orchestration, and execution initiative",
    keyCapability: "Rallies stakeholders around a shared vision and takes decisive ownership of outcomes.",
  },
  {
    code: "EX",
    label: "Exploration & Adaptability",
    short: "Exploration",
    desc: "Cross-domain curiosity, agile learning, and rapid context switching",
    keyCapability: "Embraces ambiguity, adapts rapidly to change, and synthesizes cross-disciplinary ideas.",
  },
];

export interface ScoredTrait extends TraitMeta {
  score: number;
  tier: "Dominant Strength" | "High Alignment" | "Developing Strength";
  badgeClass: string;
}

export interface StudentPersona {
  archetype: string;
  tagline: string;
  executiveSummary: string;
  topStrengths: ScoredTrait[];
  allTraits: ScoredTrait[];
}

/**
 * Derives the student's persona, title, and executive summary from their trait profile.
 */
export function deriveStudentPersona(
  traits: TraitProfile | Record<string, number> | null | undefined,
  topCareerName?: string
): StudentPersona {
  const safeTraits: Record<string, number> = traits || {};

  const allTraits: ScoredTrait[] = CANONICAL_TRAIT_CONFIG.map((meta) => {
    const rawScore = safeTraits[meta.code] ?? 0;
    const score = Math.round(Math.max(0, Math.min(100, rawScore)));

    let tier: ScoredTrait["tier"] = "Developing Strength";
    let badgeClass = "bg-[#141920] text-muted-foreground border-border/80";

    if (score >= 70) {
      tier = "Dominant Strength";
      badgeClass = "bg-primary/15 text-primary border-primary/30";
    } else if (score >= 45) {
      tier = "High Alignment";
      badgeClass = "bg-secondary/15 text-secondary border-secondary/30";
    }

    return {
      ...meta,
      score,
      tier,
      badgeClass,
    };
  }).sort((a, b) => b.score - a.score);

  const top1 = allTraits[0] || CANONICAL_TRAIT_CONFIG[0];
  const top2 = allTraits[1] || CANONICAL_TRAIT_CONFIG[1];
  const topStrengths = allTraits.slice(0, 4);

  // Derive persona archetype
  let archetype = "Strategic Problem Solver";
  const pair = `${top1.code}-${top2.code}`;
  const reversePair = `${top2.code}-${top1.code}`;

  if (pair === "TE-AN" || reversePair === "TE-AN") archetype = "Analytical Systems Architect";
  else if (pair === "TE-SC" || reversePair === "TE-SC") archetype = "Computational Scientist";
  else if (pair === "TE-CR" || reversePair === "TE-CR") archetype = "Creative Technologist";
  else if (pair === "AN-BU" || reversePair === "AN-BU") archetype = "Quantitative Strategist";
  else if (pair === "BU-LE" || reversePair === "BU-LE") archetype = "Strategic Venture Leader";
  else if (pair === "CR-SO" || reversePair === "CR-SO") archetype = "Human-Centered Designer";
  else if (pair === "SO-LE" || reversePair === "SO-LE") archetype = "Collaborative Team Catalyst";
  else if (pair === "SC-AN" || reversePair === "SC-AN") archetype = "Empirical Research Analyst";
  else if (pair === "EX-TE" || reversePair === "EX-TE") archetype = "Agile Systems Innovator";
  else if (pair === "BU-TE" || reversePair === "BU-TE") archetype = "Technical Product Strategist";
  else if (top1.code === "TE") archetype = "Technical Systems Specialist";
  else if (top1.code === "AN") archetype = "Analytical Systems Specialist";
  else if (top1.code === "CR") archetype = "Creative Innovation Specialist";
  else if (top1.code === "BU") archetype = "Business Strategy Specialist";
  else if (top1.code === "SC") archetype = "Scientific Inquiry Specialist";
  else if (top1.code === "LE") archetype = "Organizational Leadership Catalyst";
  else if (top1.code === "SO") archetype = "Human Relations Specialist";
  else if (top1.code === "EX") archetype = "Adaptive Multi-Disciplinary Explorer";

  const tagline = `Excels at ${top1.short.toLowerCase()} problem decomposition, ${top2.short.toLowerCase()} reasoning, and structured execution.`;

  const careerTarget = topCareerName || "modern technical domains";
  const executiveSummary = `Exhibits exceptional ${top1.label} (${top1.score}%) and ${top2.label} (${top2.score}%) aptitude. Demonstrates strong natural synergy with ${careerTarget}, thriving in complex environments that reward methodical problem decomposition, iterative mastery, and analytical clarity.`;

  return {
    archetype,
    tagline,
    executiveSummary,
    topStrengths,
    allTraits,
  };
}

export interface StreamSuitabilityItem {
  key: "science" | "commerce" | "arts";
  name: string;
  subjects: string;
  score: number;
  rank: number;
  badgeLabel: string;
  badgeClass: string;
  description: string;
  guidance: string;
}

export interface StreamSuitabilityResult {
  scores: { science: number; commerce: number; arts: number };
  rankedStreams: StreamSuitabilityItem[];
  primaryRecommendation: string;
}

/**
 * Resolves stream suitability scores and meaningful foundation guidance.
 */
export function deriveStreamSuitability(
  streamData?: StreamResult | null,
  traits?: TraitProfile | Record<string, number> | null
): StreamSuitabilityResult {
  let scienceScore = 33.3;
  let commerceScore = 33.3;
  let artsScore = 33.4;

  if (streamData?.scores) {
    scienceScore = streamData.scores.science ?? 33.3;
    commerceScore = streamData.scores.commerce ?? 33.3;
    artsScore = streamData.scores.arts ?? 33.4;
  } else if (traits) {
    const sc = traits.SC ?? 0;
    const te = traits.TE ?? 0;
    const an = traits.AN ?? 0;
    const bu = traits.BU ?? 0;
    const le = traits.LE ?? 0;
    const ex = traits.EX ?? 0;
    const cr = traits.CR ?? 0;
    const so = traits.SO ?? 0;

    const rawSci = sc * 0.35 + te * 0.35 + an * 0.30;
    const rawCom = bu * 0.40 + an * 0.30 + le * 0.20 + ex * 0.10;
    const rawArt = cr * 0.40 + so * 0.30 + le * 0.15 + ex * 0.15;
    const sum = rawSci + rawCom + rawArt;

    if (sum > 0) {
      scienceScore = Math.round((rawSci / sum) * 1000) / 10;
      commerceScore = Math.round((rawCom / sum) * 1000) / 10;
      artsScore = Math.round((rawArt / sum) * 1000) / 10;
    }
  }

  const items: Array<{
    key: "science" | "commerce" | "arts";
    name: string;
    subjects: string;
    score: number;
    description: string;
    guidance: string;
  }> = [
    {
      key: "science",
      name: "Science (PCM / PCB)",
      subjects: "Physics, Chemistry, Math / Biology, Computer Science",
      score: scienceScore,
      description: "Connects with analytical rigor, computational architecture, and empirical research.",
      guidance: "Provides the strongest foundational launchpad for software engineering, deep tech, architecture, and medical sciences.",
    },
    {
      key: "commerce",
      name: "Commerce & Economics",
      subjects: "Economics, Accountancy, Business Studies, Applied Math",
      score: commerceScore,
      description: "Connects with financial modeling, market strategy, and organizational growth.",
      guidance: "Ideal foundation for fintech, quantitative investment, business analytics, and venture entrepreneurship.",
    },
    {
      key: "arts",
      name: "Arts & Humanities",
      subjects: "Psychology, Political Science, Design, Literature, Sociology",
      score: artsScore,
      description: "Connects with creative expression, human behavior, communication, and social systems.",
      guidance: "Excellent foundation for digital product design (UI/UX), media, public policy, and creative direction.",
    },
  ];

  items.sort((a, b) => b.score - a.score);

  const rankedStreams: StreamSuitabilityItem[] = items.map((item, index) => {
    let badgeLabel = "Worth Exploring";
    let badgeClass = "bg-[#141920] text-muted-foreground border-border/80";

    if (index === 0) {
      badgeLabel = "Primary Academic Fit";
      badgeClass = "bg-primary/15 text-primary border-primary/30";
    } else if (index === 1) {
      badgeLabel = "Strong Secondary Fit";
      badgeClass = "bg-secondary/15 text-secondary border-secondary/30";
    }

    return {
      ...item,
      rank: index + 1,
      badgeLabel,
      badgeClass,
    };
  });

  return {
    scores: {
      science: scienceScore,
      commerce: commerceScore,
      arts: artsScore,
    },
    rankedStreams,
    primaryRecommendation: rankedStreams[0]?.name || "Science (PCM / PCB)",
  };
}

export interface WorkLearningStyle {
  environmentPreference: {
    title: string;
    description: string;
    tag: string;
  };
  problemSolvingMode: {
    title: string;
    description: string;
    tag: string;
  };
  collaborationDynamic: {
    title: string;
    description: string;
    tag: string;
  };
  structureVsFlexibility: {
    title: string;
    description: string;
    score: number; // 0-100 (high = structured, low = flexible)
  };
  cognitiveDimensions: {
    category: string;
    insight: string;
    actionableTip: string;
  }[];
}

/**
 * Derives practical work and learning style tendencies from student psychometrics.
 */
export function deriveWorkLearningStyle(
  traits: TraitProfile | Record<string, number> | null | undefined
): WorkLearningStyle {
  const safe = traits || {};
  const te = safe.TE ?? 50;
  const an = safe.AN ?? 50;
  const sc = safe.SC ?? 50;
  const bu = safe.BU ?? 50;
  const cr = safe.CR ?? 50;
  const so = safe.SO ?? 50;
  const le = safe.LE ?? 50;
  const ex = safe.EX ?? 50;

  // Environment Preference
  let envTitle = "Structured Technical & Analytical Lab";
  let envDesc = "Thrives in focused, distraction-free workspaces equipped with modern tooling, clear objectives, and deterministic feedback loops.";
  let envTag = "Deep Focus & High Signal";

  if (so > 65 || le > 65) {
    envTitle = "Collaborative Team & Stakeholder Hub";
    envDesc = "Energized by dynamic group discussions, cross-functional standups, mentorship, and high-context organizational interactions.";
    envTag = "Interpersonal & Dynamic";
  } else if (cr > 65 && ex > 60) {
    envTitle = "Creative Studio & Exploratory Sandbox";
    envDesc = "Performs at peak in open, iterative environments encouraging rapid prototyping, aesthetic experimentation, and visual ideation.";
    envTag = "Agile & Experimental";
  } else if (sc > 65 || an > 70) {
    envTitle = "Research & Rigorous Investigation Workspace";
    envDesc = "Excels when given uninterrupted time to explore source material, test empirical hypotheses, and build robust proof-of-concepts.";
    envTag = "Empirical & Rigorous";
  }

  // Problem Solving Mode
  let solveTitle = "Deconstructive & Algorithmic";
  let solveDesc = "Breaks complex, multi-variable challenges into modular sub-tasks, addressing root causes sequentially with logical clarity.";
  let solveTag = "First-Principles Logic";

  if (cr > 70) {
    solveTitle = "Divergent & Human-Centered";
    solveDesc = "Approaches problems from unconventional angles, reframing user needs, and producing elegant, intuitive solutions.";
    solveTag = "Design-Led Synthesis";
  } else if (bu > 65 && an > 60) {
    solveTitle = "Strategic & Value-Oriented";
    solveDesc = "Assesses risk-reward trade-offs, prioritizing high-leverage bottlenecks that create the greatest long-term impact.";
    solveTag = "ROI & Systems Optimization";
  }

  // Collaboration Dynamic
  let collabTitle = "Focused Autonomous Contributor with Async Alignment";
  let collabDesc = "Prefers deep individual concentration on complex execution, paired with clear documentation, structured code reviews, and concise syncs.";
  let collabTag = "Independent Mastery";

  if (so > 60 && le > 55) {
    collabTitle = "Active Team Orchestrator & Facilitator";
    collabDesc = "Excels at bridging technical and non-technical stakeholders, clarifying group goals, and motivating collaborative velocity.";
    collabTag = "Cross-Functional Bridge";
  } else if (so > 65) {
    collabTitle = "Empathetic Peer Collaborator";
    collabDesc = "Champions psychological safety, pair programming, active listening, and constructive team knowledge-sharing.";
    collabTag = "High-Trust Partner";
  }

  // Structure vs Flexibility Score
  // Technical, Analytical, and Scientific favor structure; Exploration and Creative favor flexibility
  const structureWeight = (te * 0.35 + an * 0.35 + sc * 0.3);
  const flexWeight = (ex * 0.5 + cr * 0.5);
  const normalizedStructure = Math.max(10, Math.min(95, Math.round(50 + (structureWeight - flexWeight) * 0.4)));

  let structTitle = normalizedStructure >= 60 ? "Structured & Methodical" : normalizedStructure <= 40 ? "Fluid & Adaptive" : "Balanced Hybrid";
  let structDesc = normalizedStructure >= 60
    ? "Benefits most from defined syllabi, reproducible workflows, clear rubrics, and modular milestone tracking."
    : normalizedStructure <= 40
    ? "Thrives when allowed autonomy to discover learning paths organically, experiment across domains, and pivot based on discovery."
    : "Comfortable balancing systematic operational roadmaps with self-directed exploratory sprints.";

  // Key Cognitive Insights
  const cognitiveDimensions = [
    {
      category: "Learning Retention Mode",
      insight: te >= 60 || sc >= 60
        ? "Hands-on implementation and immediate project experimentation yield 3x higher retention than passive reading."
        : "Conceptual frameworks, visual mind-mapping, and contextual case studies accelerate comprehension fastest.",
      actionableTip: "Pair every theoretical concept with a concrete miniature build or portfolio artifact.",
    },
    {
      category: "Cognitive Stamina & Focus",
      insight: an >= 65
        ? "High endurance for complex analytical debugging and long-horizon problem decomposition."
        : "Best focus sustained through 25-minute Pomodoro bursts interspersed with creative synthesis breaks.",
      actionableTip: "Protect 90-minute uninterrupted focus blocks for complex engineering or quantitative topics.",
    },
    {
      category: "Feedback & Growth Vector",
      insight: le >= 55 || so >= 55
        ? "Rapidly incorporates peer code reviews, public demonstrations, and stakeholder feedback into iterative refinements."
        : "Excels when self-evaluating against objective automated benchmarks, unit tests, and empirical metrics.",
      actionableTip: "Share work publicly on GitHub or in developer communities early to test real-world resonance.",
    },
  ];

  return {
    environmentPreference: {
      title: envTitle,
      description: envDesc,
      tag: envTag,
    },
    problemSolvingMode: {
      title: solveTitle,
      description: solveDesc,
      tag: solveTag,
    },
    collaborationDynamic: {
      title: collabTitle,
      description: collabDesc,
      tag: collabTag,
    },
    structureVsFlexibility: {
      title: structTitle,
      description: structDesc,
      score: normalizedStructure,
    },
    cognitiveDimensions,
  };
}

export interface NextStepAction {
  id: string;
  category: "academic" | "skill" | "roadmap" | "feedback";
  title: string;
  description: string;
  actionLabel: string;
  href: string;
  isExternal?: boolean;
  urgency: "Immediate Focus" | "Recommended" | "Next Horizon";
}

/**
 * Builds actionable, non-generic next steps guiding the student from profile insights into real momentum.
 */
export function deriveNextSteps(
  persona: StudentPersona,
  topCareerTitle?: string,
  selectedSlug: string = "software-development"
): NextStepAction[] {
  const top1 = persona.topStrengths[0]?.short || "Technical";
  const career = topCareerTitle || "Software Development";

  const isCivilServices =
    career.toLowerCase().includes("civil") ||
    career.toLowerCase().includes("public") ||
    career.toLowerCase().includes("ias") ||
    selectedSlug.includes("civil");

  if (isCivilServices) {
    return [
      {
        id: "step-civil-foundation",
        category: "academic",
        urgency: "Immediate Focus",
        title: "Build Constitutional & Public Administration Foundations",
        description: "Review foundational NCERT humanities frameworks (Polity, Governance, Indian Economy) and establish a disciplined daily national editorial reading habit.",
        actionLabel: "View Verified UPSC Resources",
        href: "/resources?category=government",
      },
      {
        id: "step-civil-service-discernment",
        category: "skill",
        urgency: "Recommended",
        title: "Understand Exam Route vs. Service vs. Functional Roles",
        description: "Study how the competitive exam selection process relates to real-world administrative postings across IAS, IPS, IFS, and State Civil Services.",
        actionLabel: "Explore Civil Services Tree",
        href: "/career-map?domain=civil-services-public-admin",
      },
      {
        id: "step-roadmap-start",
        category: "roadmap",
        urgency: "Recommended",
        title: "Activate Milestone Tracking in Your Journey",
        description: "Track stages from general studies foundation to optional subject mastery and public policy research methodologies.",
        actionLabel: "Open Roadmap Dashboard",
        href: "/dashboard",
      },
      {
        id: "step-feedback",
        category: "feedback",
        urgency: "Immediate Focus",
        title: "Help Us Improve: Complete Student Guidance Feedback",
        description: "Share 60 seconds of honest evaluation on clarity, career relevance, and roadmap usability to refine Career Compass research.",
        actionLabel: "Share Your Feedback",
        href: "#feedback",
      },
    ];
  }

  return [
    {
      id: "step-core-skill",
      category: "skill",
      urgency: "Immediate Focus",
      title: `Build Hands-On Projects in ${career}`,
      description: `Translate your strong ${top1} aptitude into verified GitHub repositories, functional prototypes, or interactive system demos.`,
      actionLabel: "View Learning Resources",
      href: "/resources",
    },
    {
      id: "step-roadmap-progress",
      category: "roadmap",
      urgency: "Immediate Focus",
      title: "Work Through Active Stage Milestones",
      description: `Complete stage-by-stage skills for ${career} to validate competency before entering intermediate concepts.`,
      actionLabel: "Go to Roadmap Dashboard",
      href: "/dashboard",
    },
    {
      id: "step-career-intel",
      category: "academic",
      urgency: "Recommended",
      title: "Inspect Deep Industry Insights & Salary Trends",
      description: `Understand the complete hierarchy, entry requirements, certifications, and top employers in ${career}.`,
      actionLabel: "Read Career Guide",
      href: `/career/${selectedSlug}`,
    },
    {
      id: "step-feedback",
      category: "feedback",
      urgency: "Immediate Focus",
      title: "Evaluate Your Recommendations (Student Feedback)",
      description: "Take 60 seconds to rate accuracy, guidance clarity, and confidence change to help our open research program.",
      actionLabel: "Give Feedback",
      href: "#feedback",
    },
  ];
}

export interface WhyFitReasoning {
  headline: string;
  narrative: string;
  pillars: {
    iconName: "Target" | "Sparkles" | "GitBranch";
    title: string;
    body: string;
  }[];
}

/**
 * Builds a compact, personalized "Why These Careers Fit You" explanation.
 */
export function deriveWhyFitReasoning(
  traits: TraitProfile | Record<string, number> | null | undefined,
  primaryCareerTitle?: string
): WhyFitReasoning {
  const safeTraits = traits || {};
  const sorted = CANONICAL_TRAIT_CONFIG.map((t) => ({
    ...t,
    score: safeTraits[t.code] ?? 0,
  })).sort((a, b) => b.score - a.score);

  const top1 = sorted[0] || CANONICAL_TRAIT_CONFIG[0];
  const top2 = sorted[1] || CANONICAL_TRAIT_CONFIG[1];
  const career = primaryCareerTitle || "Software Development";

  const isCivilServices =
    career.toLowerCase().includes("civil") ||
    career.toLowerCase().includes("public") ||
    career.toLowerCase().includes("ias");

  const headline = `Natural alignment driven by high ${top1.short} and ${top2.short} synergy`;

  let narrative = `Your assessment reveals an exceptional synergy between ${top1.label} (${top1.score}%) and ${top2.label} (${top2.score}%). Instead of relying on surface memorization, you naturally look for foundational mechanisms, logical continuity, and structured systems. In careers like ${career}, this cognitive pattern translates into rapid problem resolution, high technical velocity, and durable professional growth.`;

  if (isCivilServices) {
    narrative = `Your assessment reveals strong synergy between ${top1.label} (${top1.score}%) and ${top2.label} (${top2.score}%). Public administration, constitutional governance, and public policy demand sustained analytical stamina, ethical judgment, and complex system coordination. In careers like ${career}, these strengths enable you to synthesize policy trade-offs, lead cross-departmental initiatives, and deliver public accountability.`;
  }

  const pillars = [
    {
      iconName: "Target" as const,
      title: isCivilServices ? "Systemic Policy & Governance Decomposition" : "Systematic Problem Solving",
      body: isCivilServices
        ? `You naturally excel at dissecting multi-stakeholder challenges, legal-regulatory frameworks, and administrative workflows into clear procedural steps.`
        : `You naturally excel at breaking complicated challenges into clean, structured components rather than relying on trial-and-error.`,
    },
    {
      iconName: "Sparkles" as const,
      title: isCivilServices ? "Sustained Synthesis & Retention" : "High Learning Velocity",
      body: isCivilServices
        ? `Your strong ${top1.short.toLowerCase()} aptitude enables deep contextual absorption across history, economics, ethics, and contemporary governance affairs.`
        : `Your strong ${top1.short.toLowerCase()} aptitude accelerates hands-on mastery of modern tools, frameworks, and real-world workflows.`,
    },
    {
      iconName: "GitBranch" as const,
      title: isCivilServices ? "Public Stewardship & High-Impact Leadership" : "Transferable Career Core",
      body: isCivilServices
        ? `These traits form the bedrock for decisive leadership across district administration, policy design, diplomacy, and regulatory enforcement.`
        : `These core strengths provide long-term career resilience across engineering, specialized technical leadership, and product architecture.`,
    },
  ];

  return {
    headline,
    narrative,
    pillars,
  };
}

