import { getAllCareerIntelligence } from "./career-intelligence";

export interface CareerClusterDetail {
  title: string;
  summary: string;
  subRoles: string[];
}

/**
 * Dynamically derived from the Centralized Career Intelligence Layer.
 * Guarantees zero duplicate definitions.
 */
export const CAREER_EXPLORATION_MAP: Record<string, CareerClusterDetail> = Object.fromEntries(
  getAllCareerIntelligence().flatMap((career) => {
    const detail: CareerClusterDetail = {
      title: career.title,
      summary: career.description,
      subRoles: career.roleProgression,
    };
    return [
      [career.careerName, detail],
      [career.slug, detail],
      [career.title, detail],
    ];
  })
);

export interface AlignmentInfo {
  label: string;
  badgeStyle: string;
}

export function getAlignmentLabel(index: number): AlignmentInfo {
  if (index === 0) {
    return {
      label: "Strong alignment",
      badgeStyle: "bg-primary/15 text-primary border border-primary/30",
    };
  } else if (index === 1 || index === 2) {
    return {
      label: "Good alignment",
      badgeStyle: "bg-[#141920] text-sky-400 border border-sky-500/25",
    };
  } else if (index === 3) {
    return {
      label: "Worth exploring",
      badgeStyle: "bg-[#10141A] text-muted-foreground border border-border/80",
    };
  } else {
    return {
      label: "Possible direction",
      badgeStyle: "bg-[#10141A] text-muted-foreground/80 border border-border/60",
    };
  }
}

export interface UserSignal {
  traitCode: string;
  title: string;
  description: string;
  iconName: string;
}

const TRAIT_SIGNALS: Record<string, { title: string; description: string; iconName: string }> = {
  AN: {
    title: "Analytical Thinking",
    description: "Pattern recognition and structured problem-solving.",
    iconName: "BrainCircuit",
  },
  SC: {
    title: "Curiosity & Experimentation",
    description: "Exploring questions, testing ideas, and learning through discovery.",
    iconName: "Search",
  },
  TE: {
    title: "Technology & Systems",
    description: "Understanding digital tools, architecture, and mechanical logic.",
    iconName: "Cpu",
  },
  CR: {
    title: "Creative Expression",
    description: "Visual thinking, fresh ideas, and novel ways to approach problems.",
    iconName: "Palette",
  },
  BU: {
    title: "Commercial & Strategic Mindset",
    description: "Understanding organizational incentives, market value, and sustainable growth.",
    iconName: "TrendingUp",
  },
  LE: {
    title: "Leadership & Initiative",
    description: "Guiding group efforts, taking ownership, and driving direction forward.",
    iconName: "Compass",
  },
  SO: {
    title: "Interpersonal Empathy",
    description: "Attunement to people's needs, collaboration, and creating human impact.",
    iconName: "Users",
  },
  EX: {
    title: "Exploration & Adaptability",
    description: "Synthesizing cross-domain knowledge and staying open to diverse paths.",
    iconName: "Compass",
  },
};

export function getSignalsFromTraits(traits: Record<string, number>): UserSignal[] {
  if (!traits) return [];

  // Sort traits by score descending to get user's strongest signals
  const sortedTraits = Object.entries(traits)
    .filter(([code]) => TRAIT_SIGNALS[code])
    .sort((a, b) => b[1] - a[1]);

  // Take the strongest 4-5 signals
  return sortedTraits.slice(0, 5).map(([code]) => {
    const meta = TRAIT_SIGNALS[code];
    return {
      traitCode: code,
      title: meta.title,
      description: meta.description,
      iconName: meta.iconName,
    };
  });
}

