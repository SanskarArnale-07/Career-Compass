export interface CareerClusterDetail {
  title: string;
  summary: string;
  subRoles: string[];
}

export const CAREER_EXPLORATION_MAP: Record<string, CareerClusterDetail> = {
  "Software / App Development": {
    title: "Software & Technology",
    summary: "Your responses suggest an interest in building digital solutions, logical architecture, and solving complex technical challenges.",
    subRoles: [
      "Full-Stack Developer",
      "Mobile App Engineer",
      "Cloud / DevOps Engineer",
      "Systems Architect",
    ],
  },
  "AI / Machine Learning / Data Science": {
    title: "AI & Data Science",
    summary: "Your responses indicate an aptitude for quantitative reasoning, pattern discovery, and working with intelligent data-driven systems.",
    subRoles: [
      "Machine Learning Engineer",
      "Data Scientist",
      "AI Solutions Architect",
      "Quantitative Analyst",
    ],
  },
  "Engineering": {
    title: "Engineering & Applied Sciences",
    summary: "Your responses suggest an interest in practical design, physics-driven systems, and hands-on mechanical or structural problem solving.",
    subRoles: [
      "Robotics & Automation Engineer",
      "Aerospace / Mechanical Engineer",
      "Electrical & Systems Specialist",
      "Biomedical Engineer",
    ],
  },
  "Medicine / Healthcare": {
    title: "Medicine & Healthcare",
    summary: "Your responses show an inclination toward biological sciences, clinical diagnosis, and making a tangible impact on human health.",
    subRoles: [
      "Clinical Physician / Surgeon",
      "Biomedical Researcher",
      "Healthcare Technologist",
      "Public Health Specialist",
    ],
  },
  "Scientific Research": {
    title: "Scientific Research",
    summary: "Your responses suggest an interest in investigation, experimentation, discovery, and understanding how the world works.",
    subRoles: [
      "Research Scientist",
      "Laboratory Researcher",
      "R&D Specialist",
      "Scientific Data Analyst",
    ],
  },
  "Finance / Investment Banking": {
    title: "Finance & Economics",
    summary: "Your responses highlight an aptitude for market mechanics, risk analysis, financial modeling, and structured decision making.",
    subRoles: [
      "Investment Analyst",
      "Portfolio & Wealth Manager",
      "FinTech Strategist",
      "Risk & Valuation Consultant",
    ],
  },
  "Entrepreneurship": {
    title: "Entrepreneurship & Innovation",
    summary: "Your responses reflect initiative, comfort with uncertainty, and a desire to turn novel ideas into real-world ventures.",
    subRoles: [
      "Startup Founder",
      "Venture Builder",
      "Innovation Lead",
      "Growth Strategist",
    ],
  },
  "Management / Product Management": {
    title: "Product & Operations Leadership",
    summary: "Your responses point toward coordinating cross-functional teams, shaping strategy, and guiding products from concept to execution.",
    subRoles: [
      "Product Manager",
      "Operations Director",
      "Management Consultant",
      "Technical Program Manager",
    ],
  },
  "Marketing / Media / Communications": {
    title: "Media & Brand Communications",
    summary: "Your responses indicate a talent for storytelling, public engagement, consumer psychology, and audience communication.",
    subRoles: [
      "Brand Strategist",
      "Digital Media Producer",
      "Content & Editorial Director",
      "Communications Specialist",
    ],
  },
  "Design / Creative Arts": {
    title: "Design & Creative Arts",
    summary: "Your responses suggest a strong visual sense, aesthetic intuition, and a passion for crafting engaging user experiences.",
    subRoles: [
      "UI/UX Product Designer",
      "Visual & Brand Identity Designer",
      "Creative Director",
      "Industrial / Spatial Designer",
    ],
  },
  "Law / Public Policy": {
    title: "Law, Governance & Public Policy",
    summary: "Your responses show an interest in governance, systematic argumentation, ethical reasoning, and social regulation.",
    subRoles: [
      "Corporate & Tech Legal Counsel",
      "Public Policy Analyst",
      "Regulatory & Compliance Advisor",
      "International Relations Specialist",
    ],
  },
  "Psychology / Social Impact": {
    title: "Psychology & Social Impact",
    summary: "Your responses reflect deep interpersonal empathy, curiosity about human behavior, and a commitment to helping communities thrive.",
    subRoles: [
      "Organizational Psychologist",
      "Behavioral Researcher",
      "Social Impact Director",
      "Counselor & Wellbeing Specialist",
    ],
  },
};

export interface AlignmentInfo {
  label: string;
  badgeStyle: string;
}

export function getAlignmentLabel(index: number): AlignmentInfo {
  if (index === 0) {
    return {
      label: "Strong alignment",
      badgeStyle: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
    };
  } else if (index === 1 || index === 2) {
    return {
      label: "Good alignment",
      badgeStyle: "bg-blue-500/10 text-blue-300 border border-blue-500/20",
    };
  } else if (index === 3) {
    return {
      label: "Worth exploring",
      badgeStyle: "bg-slate-800 text-slate-300 border border-slate-700",
    };
  } else {
    return {
      label: "Possible direction",
      badgeStyle: "bg-slate-800/80 text-slate-400 border border-slate-700/60",
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

export function formatExplorationExplanation(careerName: string, topTraits: string[]): string {
  const customMap: Record<string, string> = {
    "Scientific Research": "Your responses show signals around curiosity, investigation, experimentation, and analytical problem-solving.",
    "Software / App Development": "Your responses show signals around logical structuring, algorithmic reasoning, and digital systems architecture.",
    "AI / Machine Learning / Data Science": "Your responses show signals around quantitative reasoning, mathematical modeling, and pattern discovery.",
    "Engineering": "Your responses show signals around practical design, physical mechanics, and structured systems problem-solving.",
    "Medicine / Healthcare": "Your responses show signals around biological sciences, empirical diagnosis, and human health impact.",
    "Finance / Investment Banking": "Your responses show signals around quantitative valuation, market mechanics, and economic strategy.",
    "Entrepreneurship": "Your responses show signals around initiative, autonomy, strategic risk-taking, and building new ventures.",
    "Management / Product Management": "Your responses show signals around cross-functional coordination, operational strategy, and guiding outcomes.",
    "Marketing / Media / Communications": "Your responses show signals around narrative storytelling, audience psychology, and creative communication.",
    "Design / Creative Arts": "Your responses show signals around aesthetic intuition, user empathy, and creative experimentation.",
    "Law / Public Policy": "Your responses show signals around ethical reasoning, governance, and structured argumentation.",
    "Psychology / Social Impact": "Your responses show signals around interpersonal empathy, behavioral curiosity, and community impact.",
  };

  if (customMap[careerName]) {
    return customMap[careerName];
  }

  if (topTraits && topTraits.length > 0) {
    const formattedTraits = topTraits.slice(0, 2).map((t) => t.toLowerCase()).join(" and ");
    return `Your responses show signals around ${formattedTraits} and structured problem-solving.`;
  }

  return "Your responses highlight an encouraging alignment with the analytical and practical demands of this pathway.";
}
