/**
 * Canonical Career Hierarchy Registry
 *
 * Single source of truth for the 4-level taxonomy:
 * DOMAIN -> PATH -> SPECIALIZATION -> ROLE
 *
 * Connects all 12 broad career records into a structured hierarchy
 * without modifying original scoring data or breaking existing slugs.
 */

import type {
  CareerDomain,
  CareerPath,
  CareerHierarchyMatch,
} from "./types";

export const CAREER_DOMAINS: CareerDomain[] = [
  // ── 1. Engineering & Technology ───────────────────────────────────
  {
    id: "engineering-technology",
    name: "Engineering & Technology",
    description: "Designing, building, and scaling software architectures, physical hardware, and cyber-physical systems.",
    paths: [
      {
        id: "software-development",
        slug: "software-development",
        name: "Software Development",
        title: "Software & App Developer",
        careerName: "Software / App Development",
        domainId: "engineering-technology",
        domainName: "Engineering & Technology",
        tagline: "Build applications, websites, and digital tools that power everyday life.",
        specializations: [
          {
            id: "web-app-eng",
            name: "Web & Application Engineering",
            description: "Building responsive frontends, server-side APIs, and comprehensive full-stack platforms.",
            roles: [
              { id: "frontend-dev", title: "Frontend Developer", isEntryLevel: true },
              { id: "backend-dev", title: "Backend Developer", isEntryLevel: true },
              { id: "fullstack-dev", title: "Full Stack Developer", isEntryLevel: false },
            ],
          },
          {
            id: "systems-cloud",
            name: "Systems & Cloud Architecture",
            description: "Distributed microservices, cloud infrastructure, container orchestration, and reliability.",
            roles: [
              { id: "cloud-architect", title: "Cloud Systems Architect", isEntryLevel: false },
              { id: "devops-engineer", title: "DevOps & Infrastructure Engineer", isEntryLevel: true },
              { id: "distributed-systems-eng", title: "Distributed Systems Engineer", isEntryLevel: false },
            ],
          },
          {
            id: "mobile-platforms",
            name: "Mobile & Platforms",
            description: "Native iOS/Android development, cross-platform runtimes, and client-side performance.",
            roles: [
              { id: "ios-dev", title: "iOS Application Engineer", isEntryLevel: true },
              { id: "android-dev", title: "Android Application Engineer", isEntryLevel: true },
              { id: "crossplatform-dev", title: "Mobile Systems Specialist", isEntryLevel: false },
            ],
          },
        ],
      },
      {
        id: "engineering",
        slug: "engineering",
        name: "Core & Systems Engineering",
        title: "Hardware & Systems Engineer",
        careerName: "Engineering",
        domainId: "engineering-technology",
        domainName: "Engineering & Technology",
        tagline: "Design, build, and optimize physical and electrical systems across industries.",
        specializations: [
          {
            id: "mechanical-robotics",
            name: "Mechanical & Robotics Systems",
            description: "Robotics automation, kinematic design, thermo-fluid mechanics, and mechatronics.",
            roles: [
              { id: "robotics-engineer", title: "Robotics & Automation Engineer", isEntryLevel: false },
              { id: "mechanical-design-eng", title: "Mechanical Systems Engineer", isEntryLevel: true },
              { id: "cad-engineer", title: "CAD & Simulation Specialist", isEntryLevel: true },
            ],
          },
          {
            id: "electrical-embedded",
            name: "Electrical & Embedded Hardware",
            description: "Microcontroller architecture, firmware development, circuit analysis, and IoT sensors.",
            roles: [
              { id: "embedded-systems-eng", title: "Embedded Systems Engineer", isEntryLevel: true },
              { id: "firmware-engineer", title: "Firmware Developer", isEntryLevel: false },
              { id: "pcb-hardware-eng", title: "Hardware Prototyping Engineer", isEntryLevel: true },
            ],
          },
          {
            id: "infrastructure-civil",
            name: "Infrastructure & Civil Systems",
            description: "Structural modeling, modern civil networks, and smart city infrastructure.",
            roles: [
              { id: "structural-engineer", title: "Structural Systems Engineer", isEntryLevel: true },
              { id: "civil-planner", title: "Infrastructure Systems Planner", isEntryLevel: false },
              { id: "materials-engineer", title: "Materials Selection Specialist", isEntryLevel: true },
            ],
          },
        ],
      },
    ],
  },

  // ── 2. Data & Artificial Intelligence ─────────────────────────────
  {
    id: "data-ai",
    name: "Data & Artificial Intelligence",
    description: "Statistical learning, deep neural architectures, machine perception, and enterprise decision intelligence.",
    paths: [
      {
        id: "ai-ml-data-science",
        slug: "ai-ml-data-science",
        name: "AI & Data Science",
        title: "Data Scientist & AI Specialist",
        careerName: "AI / Machine Learning / Data Science",
        domainId: "data-ai",
        domainName: "Data & Artificial Intelligence",
        tagline: "Develop intelligent algorithms, statistical pipelines, and data-driven systems.",
        specializations: [
          {
            id: "ml-ai-engineering",
            name: "Machine Learning & AI Engineering",
            description: "Supervised and unsupervised models, transformer neural networks, and inference APIs.",
            roles: [
              { id: "ml-engineer", title: "Machine Learning Engineer", isEntryLevel: true },
              { id: "ai-researcher", title: "AI Research Scientist", isEntryLevel: false },
              { id: "nlp-vision-specialist", title: "Computer Vision / NLP Specialist", isEntryLevel: false },
            ],
          },
          {
            id: "analytics-bi",
            name: "Data Analytics & Business Intelligence",
            description: "Exploratory analytics, statistical experiment design, attribution, and executive dashboards.",
            roles: [
              { id: "data-analyst", title: "Data Analyst", isEntryLevel: true },
              { id: "bi-architect", title: "Business Intelligence Architect", isEntryLevel: false },
              { id: "quantitative-analyst", title: "Quantitative Insights Analyst", isEntryLevel: true },
            ],
          },
          {
            id: "data-infra-mlops",
            name: "Data Engineering & MLOps",
            description: "Distributed data lakes, ETL pipeline streaming, model registries, and drift telemetry.",
            roles: [
              { id: "data-engineer", title: "Data Infrastructure Engineer", isEntryLevel: true },
              { id: "mlops-engineer", title: "MLOps Platform Engineer", isEntryLevel: false },
              { id: "pipeline-architect", title: "Real-time Stream Architect", isEntryLevel: false },
            ],
          },
        ],
      },
    ],
  },

  // ── 3. Design & Creative Arts ─────────────────────────────────────
  {
    id: "design-creative",
    name: "Design & Creative Arts",
    description: "Human-centered digital product experience, design tokens, interaction craft, and visual brand identity.",
    paths: [
      {
        id: "design-creative",
        slug: "design-creative",
        name: "UI/UX & Digital Product Design",
        title: "UI/UX & Digital Product Designer",
        careerName: "UI/UX & Digital Product Design",
        domainId: "design-creative",
        domainName: "Design & Creative Arts",
        tagline: "Shape interactive digital interfaces, customer experiences, and visual product systems.",
        specializations: [
          {
            id: "ux-product-experience",
            name: "Product Experience & UX Research",
            description: "User research, cognitive journey mapping, wireframing, and usability evaluation.",
            roles: [
              { id: "product-designer", title: "Product Designer", isEntryLevel: true },
              { id: "ux-researcher", title: "User Experience Researcher", isEntryLevel: true },
              { id: "interaction-specialist", title: "Interaction Designer", isEntryLevel: false },
            ],
          },
          {
            id: "design-systems-ui",
            name: "Design Systems & UI Engineering",
            description: "Atomic design components, auto-layout tokens, accessibility standards, and prototyping.",
            roles: [
              { id: "design-technologist", title: "Design Technologist", isEntryLevel: false },
              { id: "ui-designer", title: "User Interface Designer", isEntryLevel: true },
              { id: "design-system-lead", title: "Design Systems Architect", isEntryLevel: false },
            ],
          },
          {
            id: "visual-brand-motion",
            name: "Visual Brand & Spatial Design",
            description: "Identity design systems, iconography, motion micro-interactions, and 3D visual assets.",
            roles: [
              { id: "visual-designer", title: "Visual Brand Designer", isEntryLevel: true },
              { id: "motion-designer", title: "Motion & Interaction Designer", isEntryLevel: false },
              { id: "brand-identity-lead", title: "Brand Identity Specialist", isEntryLevel: false },
            ],
          },
        ],
      },
    ],
  },

  // ── 4. Business, Finance & Management ─────────────────────────────
  {
    id: "business-finance-management",
    name: "Business, Finance & Management",
    description: "Capital allocation, strategic operating systems, product management, and high-growth enterprise creation.",
    paths: [
      {
        id: "finance-investment",
        slug: "finance-investment",
        name: "Finance & FinTech",
        title: "Financial Analyst & Investment Specialist",
        careerName: "Finance & FinTech",
        domainId: "business-finance-management",
        domainName: "Business, Finance & Management",
        tagline: "Navigate capital markets, corporate valuations, risk models, and modern FinTech.",
        specializations: [
          {
            id: "investment-banking-markets",
            name: "Investment Banking & Capital Markets",
            description: "Financial modeling, mergers & acquisitions (M&A), equity research, and capital raising.",
            roles: [
              { id: "ib-analyst", title: "Investment Banking Analyst", isEntryLevel: true },
              { id: "equity-research-assoc", title: "Equity Research Associate", isEntryLevel: true },
              { id: "portfolio-analyst", title: "Portfolio Analyst", isEntryLevel: false },
            ],
          },
          {
            id: "corporate-finance-fpa",
            name: "Corporate Finance & FP&A",
            description: "Corporate financial planning, budgeting, unit economics, and working capital strategy.",
            roles: [
              { id: "fpa-analyst", title: "FP&A Financial Analyst", isEntryLevel: true },
              { id: "treasury-specialist", title: "Corporate Treasury Analyst", isEntryLevel: true },
              { id: "finance-manager", title: "Strategic Finance Manager", isEntryLevel: false },
            ],
          },
          {
            id: "fintech-quant",
            name: "Quantitative Finance & FinTech",
            description: "Algorithmic strategies, payment networks, quantitative risk assessment, and blockchain.",
            roles: [
              { id: "quant-analyst", title: "Quantitative Risk Analyst", isEntryLevel: true },
              { id: "fintech-product-spec", title: "FinTech Product Specialist", isEntryLevel: false },
              { id: "risk-modeling-assoc", title: "Risk Modeling Associate", isEntryLevel: true },
            ],
          },
        ],
      },
      {
        id: "management-product",
        slug: "management-product",
        name: "Product & Operations Management",
        title: "Product & Operations Manager",
        careerName: "Management / Product",
        domainId: "business-finance-management",
        domainName: "Business, Finance & Management",
        tagline: "Lead cross-functional engineering, design, and commercial initiatives from idea to launch.",
        specializations: [
          {
            id: "product-management",
            name: "Product Management",
            description: "Product vision, customer problem definition, PRD documentation, and sprint roadmaps.",
            roles: [
              { id: "apm", title: "Associate Product Manager", isEntryLevel: true },
              { id: "technical-pm", title: "Technical Product Manager", isEntryLevel: false },
              { id: "growth-pm", title: "Product Growth Lead", isEntryLevel: false },
            ],
          },
          {
            id: "program-operations",
            name: "Agile Program & Project Delivery",
            description: "Agile rituals, resource coordination, bottleneck resolution, and delivery management.",
            roles: [
              { id: "tpm", title: "Technical Program Manager", isEntryLevel: false },
              { id: "scrum-master", title: "Agile Delivery Lead", isEntryLevel: true },
              { id: "project-coordinator", title: "Project Operations Associate", isEntryLevel: true },
            ],
          },
          {
            id: "strategy-consulting",
            name: "Strategy & Operations Consulting",
            description: "Business model analysis, organizational process optimization, and executive advisory.",
            roles: [
              { id: "operations-analyst", title: "Business Operations Analyst", isEntryLevel: true },
              { id: "strategy-consultant", title: "Management Consultant", isEntryLevel: false },
              { id: "chief-of-staff", title: "Executive Operations Strategist", isEntryLevel: false },
            ],
          },
        ],
      },
      {
        id: "entrepreneurship",
        slug: "entrepreneurship",
        name: "Entrepreneurship & Venture Building",
        title: "Entrepreneur & Business Builder",
        careerName: "Business Strategy & Operations",
        domainId: "business-finance-management",
        domainName: "Business, Finance & Management",
        tagline: "Build new ventures from scratch, test customer hypotheses, and scale innovative solutions.",
        specializations: [
          {
            id: "venture-creation",
            name: "Startup Venture Building",
            description: "MVP prototyping, founder storytelling, early customer discovery, and initial team hiring.",
            roles: [
              { id: "startup-founder", title: "Startup Founder / Co-Founder", isEntryLevel: true },
              { id: "venture-builder", title: "Venture Studio Associate", isEntryLevel: true },
              { id: "early-operator", title: "Founding Team Generalist", isEntryLevel: true },
            ],
          },
          {
            id: "gtm-scaling",
            name: "Commercial Go-To-Market & Growth",
            description: "Customer acquisition engines, B2B sales development, pricing experiments, and retention.",
            roles: [
              { id: "growth-lead", title: "Growth & Business Development Lead", isEntryLevel: true },
              { id: "revops-manager", title: "Commercial Operations Strategist", isEntryLevel: false },
              { id: "partnership-director", title: "Strategic Partnerships Director", isEntryLevel: false },
            ],
          },
          {
            id: "venture-ecosystems",
            name: "Venture Capital & Innovation",
            description: "Seed deal sourcing, startup accelerator management, cap table analysis, and diligence.",
            roles: [
              { id: "vc-analyst", title: "Venture Capital Analyst", isEntryLevel: true },
              { id: "incubator-manager", title: "Accelerator Program Associate", isEntryLevel: true },
              { id: "innovation-lead", title: "Corporate Innovation Specialist", isEntryLevel: false },
            ],
          },
        ],
      },
    ],
  },

  // ── 5. Healthcare & Life Sciences ─────────────────────────────────
  {
    id: "healthcare-sciences",
    name: "Healthcare & Life Sciences",
    description: "Clinical patient healing, medical interventions, biological research, and scientific inquiry.",
    paths: [
      {
        id: "medicine-healthcare",
        slug: "medicine-healthcare",
        name: "Medicine & Clinical Practice",
        title: "Medical & Healthcare Professional",
        careerName: "Medicine / Healthcare",
        domainId: "healthcare-sciences",
        domainName: "Healthcare & Life Sciences",
        tagline: "Diagnose, treat, and care for individuals through compassionate, evidence-based medicine.",
        specializations: [
          {
            id: "clinical-patient-care",
            name: "Clinical Practice & Internal Medicine",
            description: "Patient diagnosis, outpatient medical consultations, and chronic disease treatment.",
            roles: [
              { id: "resident-doctor", title: "Junior Resident Doctor", isEntryLevel: true },
              { id: "general-physician", title: "General Physician", isEntryLevel: false },
              { id: "internal-med-consultant", title: "Internal Medicine Consultant", isEntryLevel: false },
            ],
          },
          {
            id: "surgery-emergency",
            name: "Surgery & Acute Care",
            description: "Operative procedures, intensive care unit protocols, and emergency trauma medicine.",
            roles: [
              { id: "surgical-resident", title: "Surgical Resident", isEntryLevel: true },
              { id: "emergency-physician", title: "Emergency Care Specialist", isEntryLevel: false },
              { id: "critical-care-lead", title: "Critical Care Specialist", isEntryLevel: false },
            ],
          },
          {
            id: "diagnostics-public-health",
            name: "Diagnostics & Public Health",
            description: "Clinical laboratory assays, imaging diagnostics, epidemiology, and healthcare administration.",
            roles: [
              { id: "pathologist", title: "Clinical Diagnostic Specialist", isEntryLevel: true },
              { id: "epidemiologist", title: "Public Health Officer", isEntryLevel: false },
              { id: "healthcare-admin", title: "Clinical Services Coordinator", isEntryLevel: true },
            ],
          },
        ],
      },
      {
        id: "scientific-research",
        slug: "scientific-research",
        name: "Scientific Research & Discovery",
        title: "Scientific Researcher",
        careerName: "Scientific Research & Development",
        domainId: "healthcare-sciences",
        domainName: "Healthcare & Life Sciences",
        tagline: "Explore the frontiers of physics, chemistry, biology, and materials through empirical research.",
        specializations: [
          {
            id: "physical-applied-sciences",
            name: "Physical & Applied Sciences",
            description: "Experimental physics, optical systems, materials discovery, and laboratory instrumentation.",
            roles: [
              { id: "research-assistant-physics", title: "Laboratory Research Assistant", isEntryLevel: true },
              { id: "materials-scientist", title: "Materials Research Scientist", isEntryLevel: false },
              { id: "applied-physicist", title: "Experimental Physicist", isEntryLevel: false },
            ],
          },
          {
            id: "biotech-chemical-sciences",
            name: "Biotechnology & Chemical Sciences",
            description: "Molecular biology, genetic assays, synthetic chemistry, and pharmaceutical discovery.",
            roles: [
              { id: "biochemist", title: "Biochemistry Fellow", isEntryLevel: true },
              { id: "biotech-researcher", title: "Molecular Biotechnology Scientist", isEntryLevel: false },
              { id: "synthesis-chemist", title: "Chemical Formulation Specialist", isEntryLevel: true },
            ],
          },
          {
            id: "computational-science",
            name: "Computational & Interdisciplinary Science",
            description: "Bioinformatics algorithms, mathematical modeling, and simulated chemical dynamics.",
            roles: [
              { id: "bioinformatics-analyst", title: "Bioinformatics Analyst", isEntryLevel: true },
              { id: "computational-modeler", title: "Computational Simulation Scientist", isEntryLevel: false },
              { id: "data-scientist-science", title: "Scientific Data Fellow", isEntryLevel: true },
            ],
          },
        ],
      },
    ],
  },

  // ── 6. Media, Communications & Social Impact ──────────────────────
  {
    id: "media-communications-social",
    name: "Media, Communications & Social Impact",
    description: "Persuasive storytelling, legal advocacy, institutional policy, and human behavioral wellbeing.",
    paths: [
      {
        id: "marketing-media",
        slug: "marketing-media",
        name: "Marketing & Digital Media",
        title: "Marketing Strategist & Media Specialist",
        careerName: "Marketing / Media",
        domainId: "media-communications-social",
        domainName: "Media, Communications & Social Impact",
        tagline: "Design brand narratives, digital acquisition funnels, and multimedia campaigns.",
        specializations: [
          {
            id: "growth-performance",
            name: "Growth & Performance Marketing",
            description: "Paid customer acquisition, lifecycle email marketing, analytics attribution, and conversion funnels.",
            roles: [
              { id: "growth-specialist", title: "Growth Marketing Specialist", isEntryLevel: true },
              { id: "paid-ads-manager", title: "Paid Acquisition Manager", isEntryLevel: true },
              { id: "marketing-analytics-lead", title: "Marketing Analytics Strategist", isEntryLevel: false },
            ],
          },
          {
            id: "brand-communications",
            name: "Brand Communications & Public Relations",
            description: "Corporate reputation, narrative messaging, media press relations, and crisis advisory.",
            roles: [
              { id: "brand-strategist", title: "Brand Strategist", isEntryLevel: true },
              { id: "pr-specialist", title: "Public Relations Specialist", isEntryLevel: true },
              { id: "comms-director", title: "Communications Director", isEntryLevel: false },
            ],
          },
          {
            id: "content-multimedia",
            name: "Digital Media & Content Production",
            description: "Creative writing, video production, editorial publishing, and community engagement.",
            roles: [
              { id: "content-writer", title: "Content Strategist & Copywriter", isEntryLevel: true },
              { id: "video-producer", title: "Multimedia Producer", isEntryLevel: true },
              { id: "community-manager", title: "Community & Editorial Lead", isEntryLevel: false },
            ],
          },
        ],
      },
      {
        id: "law-policy",
        slug: "law-policy",
        name: "Law & Public Policy",
        title: "Legal Counsel & Policy Strategist",
        careerName: "Law & Governance",
        domainId: "media-communications-social",
        domainName: "Media, Communications & Social Impact",
        tagline: "Advise on legal rights, draft corporate contracts, and shape public policy frameworks.",
        specializations: [
          {
            id: "corporate-commercial-law",
            name: "Corporate & Commercial Law",
            description: "Contract negotiation, corporate compliance, intellectual property, and transactional advisory.",
            roles: [
              { id: "legal-associate", title: "Corporate Legal Associate", isEntryLevel: true },
              { id: "compliance-officer", title: "Compliance & Risk Specialist", isEntryLevel: true },
              { id: "commercial-counsel", title: "Senior Commercial Counsel", isEntryLevel: false },
            ],
          },
          {
            id: "public-policy-governance",
            name: "Public Policy & Legislative Governance",
            description: "Policy brief research, regulatory impact assessments, and government stakeholder analysis.",
            roles: [
              { id: "policy-analyst", title: "Policy Research Analyst", isEntryLevel: true },
              { id: "legislative-advisor", title: "Legislative Affairs Advisor", isEntryLevel: false },
              { id: "regulatory-consultant", title: "Regulatory Strategy Specialist", isEntryLevel: true },
            ],
          },
          {
            id: "litigation-advocacy",
            name: "Litigation & Dispute Resolution",
            description: "Judicial oral advocacy, arbitration proceedings, civil dispute management, and human rights.",
            roles: [
              { id: "litigation-junior", title: "Junior Litigation Advocate", isEntryLevel: true },
              { id: "dispute-counsel", title: "Arbitration & Dispute Counsel", isEntryLevel: false },
              { id: "appellate-advocate", title: "Senior Appellate Counsel", isEntryLevel: false },
            ],
          },
        ],
      },
      {
        id: "psychology-social",
        slug: "psychology-social",
        name: "Psychology & Behavioral Sciences",
        title: "Psychologist & Social Impact Specialist",
        careerName: "Psychology & Social Impact",
        domainId: "media-communications-social",
        domainName: "Media, Communications & Social Impact",
        tagline: "Understand human cognition, provide empathetic counseling, and champion community wellbeing.",
        specializations: [
          {
            id: "clinical-counseling",
            name: "Clinical & Counseling Psychology",
            description: "Evidence-based psychotherapy, psychological assessment, and student mental health counseling.",
            roles: [
              { id: "counseling-associate", title: "Counseling Assistant", isEntryLevel: true },
              { id: "clinical-psychologist", title: "Clinical Psychologist", isEntryLevel: false },
              { id: "behavioral-therapist", title: "Behavioral Health Therapist", isEntryLevel: false },
            ],
          },
          {
            id: "org-behavior-people",
            name: "Organizational & Behavioral Psychology",
            description: "Workplace culture assessment, employee wellbeing, and behavioral change architecture.",
            roles: [
              { id: "org-psychologist", title: "Organizational Behavior Specialist", isEntryLevel: true },
              { id: "people-operations-lead", title: "People & Culture Strategist", isEntryLevel: true },
              { id: "behavioral-designer", title: "Behavioral Design Consultant", isEntryLevel: false },
            ],
          },
          {
            id: "social-impact-community",
            name: "Social Impact & Community Development",
            description: "Community program design, nonprofit leadership, monitoring & evaluation, and social welfare.",
            roles: [
              { id: "social-worker", title: "Social Impact Program Fellow", isEntryLevel: true },
              { id: "community-lead", title: "Community Development Director", isEntryLevel: false },
              { id: "monitoring-eval-spec", title: "Social Impact M&E Specialist", isEntryLevel: true },
            ],
          },
        ],
      },
    ],
  },
];

// ── Lookup Indices ─────────────────────────────────────────────────────────

const PATH_BY_SLUG: Record<string, CareerPath> = {};
const PATH_BY_CAREER_NAME: Record<string, CareerPath> = {};
const DOMAIN_BY_PATH_ID: Record<string, CareerDomain> = {};

for (const domain of CAREER_DOMAINS) {
  for (const path of domain.paths) {
    PATH_BY_SLUG[path.slug] = path;
    PATH_BY_SLUG[path.id] = path;
    PATH_BY_CAREER_NAME[path.careerName.toLowerCase().trim()] = path;
    PATH_BY_CAREER_NAME[path.title.toLowerCase().trim()] = path;
    PATH_BY_CAREER_NAME[path.name.toLowerCase().trim()] = path;
    DOMAIN_BY_PATH_ID[path.id] = domain;
    DOMAIN_BY_PATH_ID[path.slug] = domain;
  }
}

// ── Public Helper Functions ────────────────────────────────────────────────

/**
 * Returns all top-level career domains.
 */
export function getAllCareerDomains(): CareerDomain[] {
  return CAREER_DOMAINS;
}

/**
 * Returns all 12 registered career paths.
 */
export function getAllCareerPaths(): CareerPath[] {
  return CAREER_DOMAINS.flatMap((d) => d.paths);
}

/**
 * Resolves a career identifier (slug, ID, backend career name, or title)
 * into its full hierarchy mapping: Domain -> Path -> Specializations -> Roles.
 */
export function getCareerHierarchy(identifier: string): CareerHierarchyMatch | undefined {
  if (!identifier) return undefined;

  const key = identifier.toLowerCase().trim();
  const path =
    PATH_BY_SLUG[identifier] ||
    PATH_BY_SLUG[key] ||
    PATH_BY_CAREER_NAME[key] ||
    Object.values(PATH_BY_SLUG).find(
      (p) =>
        p.slug.toLowerCase() === key ||
        p.careerName.toLowerCase().includes(key) ||
        key.includes(p.careerName.toLowerCase()) ||
        p.title.toLowerCase().includes(key) ||
        key.includes(p.title.toLowerCase())
    );

  if (!path) return undefined;

  const domain = DOMAIN_BY_PATH_ID[path.id] || DOMAIN_BY_PATH_ID[path.slug];
  if (!domain) return undefined;

  const primarySpecialization = path.specializations[0];
  const sampleRoles = primarySpecialization
    ? primarySpecialization.roles.map((r) => r.title)
    : [];

  const breadcrumbs: string[] = [domain.name, path.name];
  if (primarySpecialization) {
    breadcrumbs.push(primarySpecialization.name);
    if (sampleRoles[0]) {
      breadcrumbs.push(sampleRoles[0]);
    }
  }

  return {
    domain,
    path,
    primarySpecialization,
    sampleRoles,
    breadcrumbs,
  };
}

/**
 * Returns a clean hierarchy breadcrumb chain for any career identifier.
 * Example: ["Engineering & Technology", "Software Development", "Web & Application Engineering", "Frontend Developer"]
 */
export function getHierarchyBreadcrumbs(identifier: string): string[] {
  const match = getCareerHierarchy(identifier);
  if (!match) return [];
  return match.breadcrumbs;
}
