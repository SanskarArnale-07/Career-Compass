/**
 * Career Compass — Central Career & Category Icon Mapping
 *
 * Single Source of Truth for all Career Paths, Specializations, and Domains.
 * Replaces generic briefcase icons with meaningful, category-calibrated Lucide icons.
 */

import {
  Code2,
  Layout,
  Server,
  Smartphone,
  ShieldCheck,
  Terminal,
  Lock,
  FileSearch,
  FileCheck,
  Cloud,
  Workflow,
  Network,
  Bot,
  Factory,
  ScanEye,
  Radio,
  Cpu,
  Wifi,
  Building2,
  Cog,
  Zap,
  BrainCircuit,
  LineChart,
  Sparkles,
  Database,
  Activity,
  BarChart3,
  Calculator,
  TrendingUp,
  Palette,
  PenTool,
  CheckCircle,
  Brush,
  Layers,
  Package,
  Gamepad2,
  Glasses,
  Headphones,
  Film,
  Boxes,
  Clapperboard,
  Flame,
  ChartNoAxesCombined,
  Landmark,
  Target,
  Compass,
  Rocket,
  Coins,
  Truck,
  Stethoscope,
  HeartPulse,
  Microscope,
  FlaskConical,
  Atom,
  Dna,
  Heart,
  Pill,
  Globe,
  Shield,
  Megaphone,
  Video,
  Scale,
  Users,
  HeartHandshake,
  Newspaper,
  Mic,
  BarChart2,
  type LucideIcon,
} from "lucide-react";

// ── 1. Canonical 25 Career Paths Mapping ──────────────────────────────
export const CAREER_ICON_MAP: Record<string, LucideIcon> = {
  // Software Development
  "software-development": Code2,
  "Software Development": Code2,
  "Software & App Developer": Code2,
  "Software / App Development": Code2,

  // Cybersecurity & Defense
  cybersecurity: ShieldCheck,
  "Cybersecurity & Defense": ShieldCheck,
  Cybersecurity: ShieldCheck,

  // Cloud & Infrastructure Systems
  "cloud-infrastructure": Cloud,
  "Cloud & Infrastructure Systems": Cloud,

  // Robotics & Automation Systems
  "robotics-automation": Bot,
  "Robotics & Automation Systems": Bot,
  "Robotics & Automation": Bot,

  // IoT & Connected Systems
  "iot-connected-systems": Radio,
  "IoT & Connected Systems": Radio,
  IoT: Radio,

  // Core & Systems Engineering
  engineering: Building2,
  "Core & Systems Engineering": Building2,
  Engineering: Building2,

  // Artificial Intelligence & Data
  "ai-ml-data-science": BrainCircuit,
  "Artificial Intelligence & Data": BrainCircuit,
  "AI / Machine Learning / Data Science": BrainCircuit,

  // Data Engineering & Platforms
  "data-engineering-platforms": Database,
  "Data Engineering & Platforms": Database,
  "Data Engineering & Infrastructure": Database,

  // Business Intelligence & Analytics
  "data-analytics-bi": BarChart3,
  "Business Intelligence & Analytics": BarChart3,
  "Data Analytics & Insights": BarChart3,

  // Digital Product & UI/UX Design
  "design-creative": Palette,
  "Digital Product & UI/UX Design": Palette,
  "UI/UX & Product Design": Palette,
  "Design & Creative Arts": Palette,

  // Visual Brand & Spatial Design
  "visual-brand-communication": Brush,
  "Visual Brand & Spatial Design": Brush,
  "Visual & Brand Communication": Brush,

  // Game & Interactive Media
  "game-multimedia-design": Gamepad2,
  "Game & Interactive Media": Gamepad2,
  "Game & Interactive Media Design": Gamepad2,

  // Animation & 3D Media
  "animation-3d-media": Film,
  "Animation & 3D Media": Film,

  // Finance & FinTech
  "finance-investment": ChartNoAxesCombined,
  "Financial Markets & Quantitative Investment": ChartNoAxesCombined,
  "Finance & FinTech": ChartNoAxesCombined,
  "Finance / Investment Banking": ChartNoAxesCombined,

  // Product & Operations Management
  "management-product": Target,
  "Strategic Management & Product Leadership": Target,
  "Product & Operations Management": Target,
  "Management / Product Management": Target,

  // Venture Building & Entrepreneurship
  entrepreneurship: Rocket,
  "Venture Building & Entrepreneurship": Rocket,
  "Entrepreneurship & Ventures": Rocket,
  Entrepreneurship: Rocket,

  // Supply Chain & Global Operations
  "supply-chain-operations": Truck,
  "Supply Chain & Global Operations": Truck,

  // Clinical Medicine & Patient Care
  "medicine-healthcare": Stethoscope,
  "Clinical Medicine & Patient Care": Stethoscope,
  "Medicine & Clinical Practice": Stethoscope,
  "Medicine / Healthcare": Stethoscope,

  // Scientific Research & Discovery
  "scientific-research": FlaskConical,
  "Scientific Research & Discovery": FlaskConical,
  "Scientific Research": FlaskConical,

  // Biotechnology & Pharmaceutical Sciences
  "biomedical-pharmaceutical": Dna,
  "Biotechnology & Pharmaceutical Sciences": Dna,
  "Biomedical & Pharmaceutical": Dna,
  "Biomedical Engineering": Dna,

  // Public Health & Global Epidemiology
  "public-health-epidemiology": Activity,
  "Public Health & Global Epidemiology": Activity,

  // Strategic Marketing & Brand Communications
  "marketing-media": Megaphone,
  "Strategic Marketing & Brand Communications": Megaphone,
  "Marketing & Digital Media": Megaphone,
  "Marketing / Media / Communications": Megaphone,

  // Legal Systems & Public Policy
  "law-policy": Scale,
  "Legal Systems & Public Policy": Scale,
  "Law & Public Policy": Scale,
  "Law / Public Policy": Scale,

  // Psychological Sciences & Behavioral Health
  "psychology-social": Users,
  "Psychological Sciences & Behavioral Health": Users,
  "Psychology & Behavioral Sciences": Users,
  "Psychology / Social Impact": Users,

  // Journalism & Media Broadcasting
  "journalism-media-production": Newspaper,
  "Journalism & Media Broadcasting": Newspaper,
  "Journalism & Media Production": Newspaper,
  Journalism: Newspaper,
};

// ── 2. String Icon Names Mapping (for serialized components) ───────────
export const CAREER_ICON_NAME_MAP: Record<string, string> = {
  "software-development": "Code2",
  "Software Development": "Code2",
  "Software / App Development": "Code2",

  cybersecurity: "ShieldCheck",
  "Cybersecurity & Defense": "ShieldCheck",
  Cybersecurity: "ShieldCheck",

  "cloud-infrastructure": "Cloud",
  "Cloud & Infrastructure Systems": "Cloud",

  "robotics-automation": "Bot",
  "Robotics & Automation Systems": "Bot",

  "iot-connected-systems": "Radio",
  "IoT & Connected Systems": "Radio",

  engineering: "Building2",
  "Core & Systems Engineering": "Building2",
  Engineering: "Building2",

  "ai-ml-data-science": "BrainCircuit",
  "Artificial Intelligence & Data": "BrainCircuit",
  "AI / Machine Learning / Data Science": "BrainCircuit",

  "data-engineering-platforms": "Database",
  "Data Engineering & Platforms": "Database",

  "data-analytics-bi": "BarChart3",
  "Business Intelligence & Analytics": "BarChart3",

  "design-creative": "Palette",
  "Digital Product & UI/UX Design": "Palette",
  "UI/UX & Product Design": "Palette",
  "Design & Creative Arts": "Palette",

  "visual-brand-communication": "Brush",
  "Visual Brand & Spatial Design": "Brush",

  "game-multimedia-design": "Gamepad2",
  "Game & Interactive Media": "Gamepad2",

  "animation-3d-media": "Film",
  "Animation & 3D Media": "Film",

  "finance-investment": "ChartNoAxesCombined",
  "Financial Markets & Quantitative Investment": "ChartNoAxesCombined",
  "Finance & FinTech": "ChartNoAxesCombined",
  "Finance / Investment Banking": "ChartNoAxesCombined",

  "management-product": "Target",
  "Strategic Management & Product Leadership": "Target",
  "Product & Operations Management": "Target",
  "Management / Product Management": "Target",

  entrepreneurship: "Rocket",
  "Venture Building & Entrepreneurship": "Rocket",
  "Entrepreneurship & Ventures": "Rocket",
  Entrepreneurship: "Rocket",

  "supply-chain-operations": "Truck",
  "Supply Chain & Global Operations": "Truck",

  "medicine-healthcare": "Stethoscope",
  "Clinical Medicine & Patient Care": "Stethoscope",
  "Medicine & Clinical Practice": "Stethoscope",
  "Medicine / Healthcare": "Stethoscope",

  "scientific-research": "FlaskConical",
  "Scientific Research & Discovery": "FlaskConical",
  "Scientific Research": "FlaskConical",

  "biomedical-pharmaceutical": "Dna",
  "Biotechnology & Pharmaceutical Sciences": "Dna",
  "Biomedical & Pharmaceutical": "Dna",

  "public-health-epidemiology": "Activity",
  "Public Health & Global Epidemiology": "Activity",

  "marketing-media": "Megaphone",
  "Strategic Marketing & Brand Communications": "Megaphone",
  "Marketing & Digital Media": "Megaphone",

  "law-policy": "Scale",
  "Legal Systems & Public Policy": "Scale",
  "Law & Public Policy": "Scale",

  "psychology-social": "Users",
  "Psychological Sciences & Behavioral Health": "Users",
  "Psychology & Behavioral Sciences": "Users",

  "journalism-media-production": "Newspaper",
  "Journalism & Media Broadcasting": "Newspaper",
};

// ── 3. Specializations Mapping (all 77 specializations) ────────────────
export const SPECIALIZATION_ICON_MAP: Record<string, LucideIcon> = {
  // Software Development
  "web-app-eng": Layout,
  "Web & Application Engineering": Layout,
  "systems-cloud": Server,
  "Systems & Cloud Architecture": Server,
  "mobile-platforms": Smartphone,
  "Mobile & Platforms": Smartphone,

  // Cybersecurity
  "offensive-security": Terminal,
  "Offensive Security & Red Teaming": Terminal,
  "sec-operations": ShieldCheck,
  "Defensive Security & Blue Teaming (SecOps)": ShieldCheck,
  "cloud-identity-sec": Lock,
  "Cloud & Application Security (DevSecOps)": Lock,
  "digital-forensics-dfir": FileSearch,
  "Digital Forensics & Threat Intelligence (DFIR)": FileSearch,
  "governance-risk-compliance": FileCheck,
  "Governance, Risk, Compliance (GRC) & Security Architecture": FileCheck,

  // Cloud & Infrastructure
  "cloud-architecture": Cloud,
  "Cloud Architecture & Platforms": Cloud,
  "devops-systems": Workflow,
  "DevOps & Systems Automation": Workflow,
  "network-distributed": Network,
  "Network & Distributed Systems": Network,

  // Robotics & Automation
  "autonomous-mechatronics": Bot,
  "Autonomous Systems & Mechatronics": Bot,
  "industrial-automation": Factory,
  "Industrial & Manufacturing Automation": Factory,
  "robotic-perception-ai": ScanEye,
  "Robotic Perception, Vision & Manipulation": ScanEye,

  // IoT
  "embedded-iot-firmware": Cpu,
  "Embedded Systems & IoT Firmware": Cpu,
  "connected-edge-cloud": Wifi,
  "Connected Edge & Cloud Platforms": Wifi,
  "industrial-iot-smart-systems": Radio,
  "Industrial IoT (IIoT) & Smart Infrastructure": Radio,

  // Engineering
  "mechanical-robotics": Cog,
  "Mechanical & Thermal Systems": Cog,
  "electrical-power-systems": Zap,
  "Electrical & Power Systems": Zap,
  "infrastructure-civil": Building2,
  "Infrastructure & Civil Systems": Building2,

  // AI & Data
  "machine-learning": BrainCircuit,
  "Machine Learning": BrainCircuit,
  "data-science": LineChart,
  "Data Science": LineChart,
  "ai-engineering": Sparkles,
  "AI Engineering": Sparkles,

  // Data Engineering
  "data-pipelines-lakehouse": Database,
  "Data Pipelines & Lakehouse Architecture": Database,
  "streaming-realtime": Activity,
  "Real-Time Streaming Systems": Activity,
  "data-platform-reliability": Server,
  "Data Platform Reliability & Governance": Server,

  // Data Analytics
  "analytics-bi": BarChart3,
  "Business Intelligence & Analytics": BarChart3,
  "quantitative-modeling": Calculator,
  "Quantitative & Statistical Modeling": Calculator,
  "product-growth-analytics": TrendingUp,
  "Product Analytics & Growth Insights": TrendingUp,

  // Design & UI/UX
  "ux-product-experience": PenTool,
  "Product Experience & UX Research": PenTool,
  "design-systems-ui": Palette,
  "Design Systems & UI Engineering": Palette,
  "accessibility-service-design": CheckCircle,
  "Accessibility, Usability & Service Design": CheckCircle,

  // Visual Brand
  "brand-identity": Brush,
  "Brand Identity & Graphic Strategy": Brush,
  "motion-spatial": Layers,
  "Motion Graphics & Spatial Experience": Layers,
  "packaging-editorial-design": Package,
  "Packaging, Print & Publication Design": Package,

  // Game Design
  "gameplay-mechanics": Gamepad2,
  "Gameplay & Level Design": Gamepad2,
  "technical-art-xr": Glasses,
  "Technical Art & XR Environments": Glasses,
  "game-systems-audio": Headphones,
  "Game Systems, Economy & Audio Design": Headphones,

  // Animation & 3D Media
  "3d-modeling-cgi": Boxes,
  "3D Modeling & CGI": Boxes,
  "character-animation": Clapperboard,
  "Character Animation & Rigging": Clapperboard,
  "vfx-motion-graphics": Flame,
  "Visual Effects & Dynamic Motion": Flame,

  // Finance
  "investment-banking": Landmark,
  "Investment Banking & Capital Markets": Landmark,
  "corporate-finance-fpa": TrendingUp,
  "Corporate Finance & FP&A": TrendingUp,
  "quant-fintech": ChartNoAxesCombined,
  "Quantitative Finance & FinTech": ChartNoAxesCombined,

  // Management
  "product-mgmt": Target,
  "Digital Product Management": Target,
  "agile-program-delivery": Workflow,
  "Program & Agile Delivery": Workflow,
  "strategy-consulting": Compass,
  "Strategy & Management Consulting": Compass,

  // Entrepreneurship
  "startup-venture-building": Rocket,
  "Startup Venture Building": Rocket,
  "commercial-gtm": TrendingUp,
  "Commercial Go-To-Market & Growth": TrendingUp,
  "venture-capital": Coins,
  "Venture Capital & Innovation": Coins,

  // Supply Chain
  "global-logistics-trade": Truck,
  "Logistics & Global Supply Chain": Truck,
  "operations-strategy": Boxes,
  "Operations Strategy & Lean Process": Boxes,
  "demand-forecasting": LineChart,
  "Demand Forecasting & Inventory Systems": LineChart,

  // Medicine
  "clinical-internal-med": Stethoscope,
  "Clinical Practice & Internal Medicine": Stethoscope,
  "surgery-acute": HeartPulse,
  "Surgery & Acute Care": HeartPulse,
  "diagnostics-public-health": Microscope,
  "Diagnostics & Public Health": Microscope,

  // Scientific Research
  "physical-applied-sciences": Atom,
  "Physical & Applied Sciences": Atom,
  "biotech-chem-sciences": FlaskConical,
  "Biotechnology & Molecular Sciences": FlaskConical,
  "computational-science": Cpu,
  "Computational & Interdisciplinary Science": Cpu,

  // Biomedical
  "medical-devices": Heart,
  "Medical Devices & Bioinstrumentation": Heart,
  "pharma-therapeutics": Pill,
  "Pharmaceutical Formulation & Clinical Trials": Pill,
  "bioinformatics-precision-therapeutics": Dna,
  "Bioinformatics & Precision Therapeutics": Dna,

  // Public Health
  "epidemiology-surveillance": Activity,
  "Epidemiological Surveillance & Disease Modeling": Activity,
  "health-policy-systems": Globe,
  "Global Health Policy & Healthcare Systems": Globe,
  "environmental-occupational-health": Shield,
  "Environmental & Occupational Health": Shield,

  // Marketing
  "growth-marketing": TrendingUp,
  "Growth & Performance Marketing": TrendingUp,
  "brand-comms-pr": Megaphone,
  "Brand Communications & Public Relations": Megaphone,
  "content-production": Video,
  "Digital Media & Content Production": Video,

  // Law
  "corporate-commercial-law": Building2,
  "Corporate & Commercial Law": Building2,
  "public-policy-governance": Landmark,
  "Public Policy & Legislative Governance": Landmark,
  "litigation-dispute": Scale,
  "Litigation & Dispute Resolution": Scale,

  // Psychology
  "clinical-counseling": Heart,
  "Counseling & Mental Health": Heart,
  "org-behavior-people": Users,
  "Organizational & Behavioral Psychology": Users,
  "social-impact-community": HeartHandshake,
  "Social Impact & Community Development": HeartHandshake,

  // Journalism
  "investigative-journalism": Newspaper,
  "Investigative & Digital Journalism": Newspaper,
  "broadcast-documentary": Mic,
  "Broadcast & Audio Storytelling": Mic,
  "interactive-data-journalism": BarChart2,
  "Interactive & Data Storytelling": BarChart2,
};

// ── 4. Domains / Categories Mapping ───────────────────────────────────
export const DOMAIN_ICON_MAP: Record<string, LucideIcon> = {
  "engineering-technology": Code2,
  "Engineering & Technology": Code2,
  "data-artificial-intelligence": BrainCircuit,
  "Data & Artificial Intelligence": BrainCircuit,
  "Data & AI": BrainCircuit,
  "design-creative-arts": Palette,
  "Design & Creative Arts": Palette,
  "business-finance-management": ChartNoAxesCombined,
  "Business, Finance & Management": ChartNoAxesCombined,
  "Business & Management": Target,
  "healthcare-life-sciences": Stethoscope,
  "Healthcare & Life Sciences": Stethoscope,
  "media-communications-social-impact": Megaphone,
  "Media, Communications & Social Impact": Megaphone,
  "Media & Communications": Megaphone,
};

// ── Helper: Normalizer ───────────────────────────────────────────────
function normalizeKey(str: string): string {
  return str.trim().toLowerCase().replace(/[\s/&_]+/g, "-");
}

/**
 * Primary accessor for Career Path icons.
 * Resolves by path slug, careerName, title, alias, or category.
 * Never defaults to generic briefcase unless specifically matched.
 */
export function getCareerIcon(identifier?: string | null): LucideIcon {
  if (!identifier) return Compass;

  // Direct exact match
  if (CAREER_ICON_MAP[identifier]) {
    return CAREER_ICON_MAP[identifier];
  }

  // Normalized key match
  const normalized = normalizeKey(identifier);
  for (const [key, icon] of Object.entries(CAREER_ICON_MAP)) {
    if (normalizeKey(key) === normalized) {
      return icon;
    }
  }

  // Check specialization
  if (SPECIALIZATION_ICON_MAP[identifier]) {
    return SPECIALIZATION_ICON_MAP[identifier];
  }

  // Check domain
  if (DOMAIN_ICON_MAP[identifier]) {
    return DOMAIN_ICON_MAP[identifier];
  }

  // Partial substring matches
  const lower = identifier.toLowerCase();
  if (lower.includes("software") || lower.includes("developer") || lower.includes("coding")) return Code2;
  if (lower.includes("security") || lower.includes("cyber")) return ShieldCheck;
  if (lower.includes("cloud") || lower.includes("devops")) return Cloud;
  if (lower.includes("robot") || lower.includes("automation")) return Bot;
  if (lower.includes("ai") || lower.includes("intelligence") || lower.includes("machine learning")) return BrainCircuit;
  if (lower.includes("data engineer") || lower.includes("database")) return Database;
  if (lower.includes("data") || lower.includes("analytics")) return BarChart3;
  if (lower.includes("design") || lower.includes("ui") || lower.includes("ux")) return Palette;
  if (lower.includes("game")) return Gamepad2;
  if (lower.includes("animation") || lower.includes("3d")) return Film;
  if (lower.includes("finance") || lower.includes("invest") || lower.includes("fintech") || lower.includes("bank")) return ChartNoAxesCombined;
  if (lower.includes("entrepreneur") || lower.includes("startup") || lower.includes("venture")) return Rocket;
  if (lower.includes("product") || lower.includes("management")) return Target;
  if (lower.includes("supply") || lower.includes("logistics")) return Truck;
  if (lower.includes("medicine") || lower.includes("doctor") || lower.includes("health") || lower.includes("clinic")) return Stethoscope;
  if (lower.includes("research") || lower.includes("science")) return FlaskConical;
  if (lower.includes("pharma") || lower.includes("biomedical") || lower.includes("biotech")) return Dna;
  if (lower.includes("market") || lower.includes("pr") || lower.includes("advertising")) return Megaphone;
  if (lower.includes("law") || lower.includes("legal") || lower.includes("policy")) return Scale;
  if (lower.includes("psychology") || lower.includes("behavior") || lower.includes("social")) return Users;
  if (lower.includes("journalism") || lower.includes("news") || lower.includes("broadcast")) return Newspaper;
  if (lower.includes("engineer")) return Building2;

  return Compass;
}

/**
 * Accessor for Career Path icon string names (for serialized data).
 */
export function getCareerIconName(identifier?: string | null): string {
  if (!identifier) return "Compass";

  if (CAREER_ICON_NAME_MAP[identifier]) {
    return CAREER_ICON_NAME_MAP[identifier];
  }

  const normalized = normalizeKey(identifier);
  for (const [key, name] of Object.entries(CAREER_ICON_NAME_MAP)) {
    if (normalizeKey(key) === normalized) {
      return name;
    }
  }

  const lower = identifier.toLowerCase();
  if (lower.includes("software") || lower.includes("developer")) return "Code2";
  if (lower.includes("security") || lower.includes("cyber")) return "ShieldCheck";
  if (lower.includes("cloud")) return "Cloud";
  if (lower.includes("robot")) return "Bot";
  if (lower.includes("ai") || lower.includes("intelligence")) return "BrainCircuit";
  if (lower.includes("data engineer")) return "Database";
  if (lower.includes("data") || lower.includes("analytics")) return "BarChart3";
  if (lower.includes("design") || lower.includes("ui") || lower.includes("ux")) return "Palette";
  if (lower.includes("game")) return "Gamepad2";
  if (lower.includes("animation")) return "Film";
  if (lower.includes("finance") || lower.includes("invest")) return "ChartNoAxesCombined";
  if (lower.includes("entrepreneur") || lower.includes("startup")) return "Rocket";
  if (lower.includes("product") || lower.includes("management")) return "Target";
  if (lower.includes("medicine") || lower.includes("health")) return "Stethoscope";
  if (lower.includes("research") || lower.includes("science")) return "FlaskConical";
  if (lower.includes("law") || lower.includes("legal")) return "Scale";
  if (lower.includes("market")) return "Megaphone";
  if (lower.includes("journalism")) return "Newspaper";

  return "Compass";
}

/**
 * Accessor for Specialization icons.
 * If specialization ID or name is found, returns its specific icon.
 * Otherwise falls back to parent path icon or domain icon.
 */
export function getSpecializationIcon(
  specIdOrName?: string | null,
  parentPathSlug?: string | null
): LucideIcon {
  if (specIdOrName && SPECIALIZATION_ICON_MAP[specIdOrName]) {
    return SPECIALIZATION_ICON_MAP[specIdOrName];
  }

  if (specIdOrName) {
    const normalized = normalizeKey(specIdOrName);
    for (const [key, icon] of Object.entries(SPECIALIZATION_ICON_MAP)) {
      if (normalizeKey(key) === normalized) {
        return icon;
      }
    }
  }

  if (parentPathSlug) {
    return getCareerIcon(parentPathSlug);
  }

  return Layers;
}

/**
 * Accessor for Domain/Category icons.
 */
export function getDomainIcon(domainIdOrName?: string | null): LucideIcon {
  if (domainIdOrName && DOMAIN_ICON_MAP[domainIdOrName]) {
    return DOMAIN_ICON_MAP[domainIdOrName];
  }

  if (domainIdOrName) {
    const normalized = normalizeKey(domainIdOrName);
    for (const [key, icon] of Object.entries(DOMAIN_ICON_MAP)) {
      if (normalizeKey(key) === normalized) {
        return icon;
      }
    }
  }

  return Compass;
}
