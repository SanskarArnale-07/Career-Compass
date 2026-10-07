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

  const headline = `Natural alignment driven by high ${top1.short} and ${top2.short} synergy`;

  const narrative = `Your assessment reveals an exceptional synergy between ${top1.label} (${top1.score}%) and ${top2.label} (${top2.score}%). Instead of relying on surface memorization, you naturally look for foundational mechanisms, logical continuity, and structured systems. In careers like ${career}, this cognitive pattern translates into rapid problem resolution, high technical velocity, and durable professional growth.`;

  const pillars = [
    {
      iconName: "Target" as const,
      title: "Systematic Problem Solving",
      body: `You naturally excel at breaking complicated challenges into clean, structured components rather than relying on trial-and-error.`,
    },
    {
      iconName: "Sparkles" as const,
      title: "High Learning Velocity",
      body: `Your strong ${top1.short.toLowerCase()} aptitude accelerates hands-on mastery of modern tools, frameworks, and real-world workflows.`,
    },
    {
      iconName: "GitBranch" as const,
      title: "Transferable Career Core",
      body: `These core strengths provide long-term career resilience across engineering, specialized technical leadership, and product architecture.`,
    },
  ];

  return {
    headline,
    narrative,
    pillars,
  };
}
