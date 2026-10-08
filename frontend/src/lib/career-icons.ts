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
  PanelsTopLeft,
  MousePointer2,
  CheckCircle,
  Brush,
  Layers,
  Layers3,
  Package,
  Gamepad2,
  Glasses,
  Headphones,
  Film,
  Boxes,
  Box,
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
  ScrollText,
  Gavel,
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
  "design-creative": PanelsTopLeft,
  "Digital Product & UI/UX Design": PanelsTopLeft,
  "UI/UX & Product Design": PanelsTopLeft,
  "UI/UX Design": PanelsTopLeft,
  "Product & UX Design": PanelsTopLeft,
  "UI/UX": PanelsTopLeft,
  "Design & Creative Arts": PanelsTopLeft,
  "Design / Creative Arts": PanelsTopLeft,
  "Design & Creative": PanelsTopLeft,

  // Visual Brand & Spatial Design
  "visual-brand-communication": Brush,
  "Visual Brand & Spatial Design": Brush,
  "Visual & Brand Communication": Brush,
  "Brand & Visual Design": Brush,
  "Visual Brand": Brush,
  "Visual Branding": Brush,
  "Brand Design": Brush,

  // Game & Interactive Media
  "game-multimedia-design": Gamepad2,
  "Game & Interactive Media": Gamepad2,
  "Game & Interactive Media Design": Gamepad2,
  "Game Design": Gamepad2,
  "Game Development": Gamepad2,

  // Animation & 3D Media
  "animation-3d-media": Clapperboard,
  "Animation & 3D Media": Clapperboard,
  "Animation & 3D": Clapperboard,
  "Animation": Clapperboard,
  "3D Animation": Clapperboard,
  "3D Media": Clapperboard,

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

  "journalism-media-production": Newspaper,
  "Journalism & Media Broadcasting": Newspaper,
  "Journalism & Media Production": Newspaper,
  Journalism: Newspaper,

  // Civil Services & Public Administration
  "civil-services-public-admin": Landmark,
  "Civil Services & Public Administration": Landmark,
  "upsc-civil-services": Landmark,
  "UPSC Civil Services": Landmark,
  "Union Public Service Commission (UPSC) Civil Services": Landmark,
  "Civil Services": Landmark,
  "state-public-service-commissions": Building2,
  "State Public Service Commissions": Building2,
  "State Civil Services": Building2,
  "public-policy-governance-path": ScrollText,
  "Public Administration & Policy Pathways": ScrollText,
  "Public Administration, Policy Analysis & Governance": ScrollText,
  "Public Policy & Administration": ScrollText,
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

  "design-creative": "PanelsTopLeft",
  "Digital Product & UI/UX Design": "PanelsTopLeft",
  "UI/UX & Product Design": "PanelsTopLeft",
  "UI/UX Design": "PanelsTopLeft",
  "Product & UX Design": "PanelsTopLeft",
  "UI/UX": "PanelsTopLeft",
  "Design & Creative Arts": "PanelsTopLeft",
  "Design / Creative Arts": "PanelsTopLeft",
  "Design & Creative": "PanelsTopLeft",

  "visual-brand-communication": "Brush",
  "Visual Brand & Spatial Design": "Brush",
  "Visual & Brand Communication": "Brush",
  "Brand & Visual Design": "Brush",
  "Visual Brand": "Brush",
  "Visual Branding": "Brush",
  "Brand Design": "Brush",

  "game-multimedia-design": "Gamepad2",
  "Game & Interactive Media": "Gamepad2",
  "Game & Interactive Media Design": "Gamepad2",
  "Game Design": "Gamepad2",
  "Game Development": "Gamepad2",

  "animation-3d-media": "Clapperboard",
  "Animation & 3D Media": "Clapperboard",
  "Animation & 3D": "Clapperboard",
  "Animation": "Clapperboard",
  "3D Animation": "Clapperboard",
  "3D Media": "Clapperboard",

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

  // Civil Services & Public Administration
  "civil-services-public-admin": "Landmark",
  "Civil Services & Public Administration": "Landmark",
  "upsc-civil-services": "Landmark",
  "UPSC Civil Services": "Landmark",
  "Union Public Service Commission (UPSC) Civil Services": "Landmark",
  "state-public-service-commissions": "Building2",
  "State Public Service Commissions": "Building2",
  "State Civil Services": "Building2",
  "public-policy-governance-path": "ScrollText",
  "Public Administration & Policy Pathways": "ScrollText",
  "Public Administration, Policy Analysis & Governance": "ScrollText",
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

  // Civil Services Specializations
  "ias-administration": Landmark,
  "Indian Administrative Service (IAS) & Public Governance": Landmark,
  "ips-internal-security": ShieldCheck,
  "Indian Police Service (IPS) & Law Enforcement": ShieldCheck,
  "ifs-diplomatic-relations": Globe,
  "Indian Foreign Service (IFS) & Diplomacy": Globe,
  "irs-revenue-governance": ChartNoAxesCombined,
  "Indian Revenue Service (IRS) & Financial Administration": ChartNoAxesCombined,
  "state-administrative-services": Landmark,
  "State Administrative Services (SAS / Provincial Civil Services)": Landmark,
  "state-police-services": ShieldCheck,
  "State Police Services (SPS / Deputy SP)": ShieldCheck,
  "policy-research-governance": ScrollText,
  "Government Policy & Regulatory Impact": ScrollText,
  "psu-public-enterprises": Building2,
  "Public Sector Enterprises & Institutional Management": Building2,
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
  "civil-services-public-admin": Landmark,
  "Civil Services & Public Administration": Landmark,
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

  // Direct exact match in career map
  if (CAREER_ICON_MAP[identifier]) {
    return CAREER_ICON_MAP[identifier];
  }

  // Direct Lucide component name match if identifier is already an icon name
  const DIRECT_ICONS: Record<string, LucideIcon> = {
    PanelsTopLeft,
    MousePointer2,
    Brush,
    Layers,
    Layers3,
    Gamepad2,
    Clapperboard,
    Box,
    Boxes,
    Film,
    Code2,
    ShieldCheck,
    Cloud,
    Bot,
    Radio,
    Building2,
    BrainCircuit,
    Database,
    BarChart3,
    ChartNoAxesCombined,
    Target,
    Rocket,
    Truck,
    Stethoscope,
    FlaskConical,
    Dna,
    Activity,
    Megaphone,
    Scale,
    Users,
    Newspaper,
    Palette,
    PenTool,
    Landmark,
    ScrollText,
    Gavel,
    Compass,
  };
  if (DIRECT_ICONS[identifier]) {
    return DIRECT_ICONS[identifier];
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

  // Partial substring matches (prioritize specific disciplines over broad catch-all words)
  const lower = identifier.toLowerCase();

  // 1. Game & Interactive Media (must precede generic 'design')
  if (lower.includes("game") || lower.includes("gaming") || lower.includes("interactive media") || lower.includes("gameplay")) return Gamepad2;

  // 2. Animation & 3D Media (must precede generic 'design' or 'media')
  if (lower.includes("animation") || lower.includes("3d media") || lower.includes("3d-media") || lower.includes("cgi") || lower.includes("vfx")) return Clapperboard;

  // 3. Visual Brand & Spatial Design (must precede generic 'design')
  if (lower.includes("brand") || lower.includes("spatial") || lower.includes("packaging") || lower.includes("visual brand") || lower.includes("visual communication")) return Brush;

  // 4. UI/UX & Digital Product Design
  if (lower.includes("ui") || lower.includes("ux") || lower.includes("product design") || lower.includes("user interface") || lower.includes("user experience") || lower.includes("interaction design")) return PanelsTopLeft;

  // 5. Software & Development
  if (lower.includes("software") || lower.includes("developer") || lower.includes("coding") || lower.includes("frontend") || lower.includes("backend") || lower.includes("fullstack") || lower.includes("full-stack")) return Code2;

  // 6. Cybersecurity & Defense
  if (lower.includes("security") || lower.includes("cyber") || lower.includes("infosec") || lower.includes("defense")) return ShieldCheck;

  // 7. Cloud & Infrastructure
  if (lower.includes("cloud") || lower.includes("devops") || lower.includes("infrastructure")) return Cloud;

  // 8. Robotics & Automation
  if (lower.includes("robot") || lower.includes("automation") || lower.includes("mechatronic")) return Bot;

  // 9. IoT & Embedded Systems
  if (lower.includes("iot") || lower.includes("connected system") || lower.includes("embedded") || lower.includes("firmware")) return Radio;

  // 10. AI / Machine Learning & Data Science
  if (lower.includes("ai") || lower.includes("intelligence") || lower.includes("machine learning") || lower.includes("deep learning") || lower.includes("data science")) return BrainCircuit;

  // 11. Data Engineering & Platforms
  if (lower.includes("data engineer") || lower.includes("database") || lower.includes("data platform") || lower.includes("lakehouse")) return Database;

  // 12. Data Analytics & Business Intelligence
  if (lower.includes("analytics") || lower.includes("business intelligence") || lower.includes("bi")) return BarChart3;

  // 13. Finance & Quantitative Investment
  if (lower.includes("finance") || lower.includes("invest") || lower.includes("fintech") || lower.includes("bank") || lower.includes("quant")) return ChartNoAxesCombined;

  // 14. Entrepreneurship & Startups
  if (lower.includes("entrepreneur") || lower.includes("startup") || lower.includes("venture")) return Rocket;

  // 15. Strategic Management & Product Leadership
  if (lower.includes("management") || lower.includes("product manager") || lower.includes("agile") || lower.includes("operations")) return Target;

  // 16. Supply Chain & Logistics
  if (lower.includes("supply") || lower.includes("logistics")) return Truck;

  // 17. Clinical Medicine & Healthcare
  if (lower.includes("medicine") || lower.includes("doctor") || lower.includes("health") || lower.includes("clinic") || lower.includes("hospital")) return Stethoscope;

  // 18. Scientific Research & Discovery
  if (lower.includes("scientific") || lower.includes("research") || lower.includes("experiment") || lower.includes("physical science")) return FlaskConical;

  // 19. Biotechnology & Pharmaceutical
  if (lower.includes("pharma") || lower.includes("biomedical") || lower.includes("biotech")) return Dna;

  // 20. Public Health & Epidemiology
  if (lower.includes("public health") || lower.includes("epidemiol")) return Activity;

  // 21. Strategic Marketing & Brand Communications
  if (lower.includes("market") || lower.includes("pr") || lower.includes("advertising")) return Megaphone;

  // 21b. Civil Services & Public Administration
  if (lower.includes("civil service") || lower.includes("upsc") || lower.includes("ias") || lower.includes("ifs") || lower.includes("state psc") || lower.includes("district magistrate")) return Landmark;
  if (lower.includes("ips") || lower.includes("police service") || lower.includes("law enforcement")) return ShieldCheck;
  if (lower.includes("public policy") || lower.includes("governance") || lower.includes("legislative")) return ScrollText;
  if (lower.includes("public administration") || lower.includes("public enterprise")) return Landmark;

  // 22. Law & Public Policy
  if (lower.includes("law") || lower.includes("legal") || lower.includes("policy")) return Scale;

  // 23. Psychological Sciences & Behavioral Health
  if (lower.includes("psychology") || lower.includes("behavior") || lower.includes("counseling") || lower.includes("social")) return Users;

  // 24. Journalism & Media Broadcasting
  if (lower.includes("journalism") || lower.includes("news") || lower.includes("broadcast")) return Newspaper;

  // 25. Core Engineering (Mechanical, Electrical, Civil)
  if (lower.includes("engineer")) return Building2;

  // 26. Generic design fallback only if no specific creative sub-field matched
  if (lower.includes("design") || lower.includes("creative") || lower.includes("art")) return PanelsTopLeft;

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
  if (lower.includes("game") || lower.includes("gaming") || lower.includes("interactive media")) return "Gamepad2";
  if (lower.includes("animation") || lower.includes("3d media") || lower.includes("cgi") || lower.includes("vfx")) return "Clapperboard";
  if (lower.includes("brand") || lower.includes("spatial") || lower.includes("packaging")) return "Brush";
  if (lower.includes("ui") || lower.includes("ux") || lower.includes("product design") || lower.includes("interface")) return "PanelsTopLeft";
  if (lower.includes("software") || lower.includes("developer") || lower.includes("coding")) return "Code2";
  if (lower.includes("security") || lower.includes("cyber")) return "ShieldCheck";
  if (lower.includes("cloud") || lower.includes("devops")) return "Cloud";
  if (lower.includes("robot") || lower.includes("automation")) return "Bot";
  if (lower.includes("iot") || lower.includes("embedded")) return "Radio";
  if (lower.includes("ai") || lower.includes("intelligence") || lower.includes("machine learning")) return "BrainCircuit";
  if (lower.includes("data engineer") || lower.includes("database")) return "Database";
  if (lower.includes("analytics") || lower.includes("bi")) return "BarChart3";
  if (lower.includes("finance") || lower.includes("invest") || lower.includes("fintech")) return "ChartNoAxesCombined";
  if (lower.includes("entrepreneur") || lower.includes("startup")) return "Rocket";
  if (lower.includes("management") || lower.includes("operations")) return "Target";
  if (lower.includes("supply") || lower.includes("logistics")) return "Truck";
  if (lower.includes("medicine") || lower.includes("health")) return "Stethoscope";
  if (lower.includes("research") || lower.includes("science")) return "FlaskConical";
  if (lower.includes("pharma") || lower.includes("biomedical")) return "Dna";
  if (lower.includes("public health") || lower.includes("epidemiol")) return "Activity";
  if (lower.includes("civil service") || lower.includes("upsc") || lower.includes("ias") || lower.includes("ifs") || lower.includes("state psc") || lower.includes("district magistrate")) return "Landmark";
  if (lower.includes("ips") || lower.includes("police service") || lower.includes("law enforcement")) return "ShieldCheck";
  if (lower.includes("public policy") || lower.includes("governance") || lower.includes("legislative")) return "ScrollText";
  if (lower.includes("public administration") || lower.includes("public enterprise")) return "Landmark";
  if (lower.includes("law") || lower.includes("legal") || lower.includes("policy")) return "Scale";
  if (lower.includes("market") || lower.includes("pr") || lower.includes("advertising")) return "Megaphone";
  if (lower.includes("psychology") || lower.includes("social")) return "Users";
  if (lower.includes("journalism") || lower.includes("news")) return "Newspaper";
  if (lower.includes("engineer")) return "Building2";
  if (lower.includes("design") || lower.includes("creative")) return "PanelsTopLeft";

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
