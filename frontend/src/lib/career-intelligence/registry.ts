/**
 * Centralized Career Intelligence Registry
 *
 * Single source of truth for all 12 supported career domains in Career Compass.
 * Combines full curricula, roadmap phases, skills taxonomy, responsibilities,
 * education pathways, tools, and industry profiles into canonical CareerIntelligence records.
 */

import { softwareDevelopment } from "../career-details/careers/software-development";
import { aiMlDataScience } from "../career-details/careers/ai-ml-data";
import { engineering } from "../career-details/careers/engineering";
import { medicineHealthcare } from "../career-details/careers/medicine";
import { scientificResearch } from "../career-details/careers/scientific-research";
import { financeInvestment } from "../career-details/careers/finance";
import { entrepreneurship } from "../career-details/careers/entrepreneurship";
import { managementProduct } from "../career-details/careers/management";
import { marketingMedia } from "../career-details/careers/marketing-media";
import { designCreative } from "../career-details/careers/design-creative";
import { lawPolicy } from "../career-details/careers/law-policy";
import { psychologySocial } from "../career-details/careers/psychology-social";

import type {
  CareerDetail,
  SkillNode,
  RoadmapPhase,
  ProjectIdea,
  CareerStage,
  PreparationItem,
  SnapshotItem,
} from "../career-details/types";
import type { CareerIntelligence, EducationPathway, IndustryInfo } from "./types";
import { getAllCareerPaths, type CareerPath } from "../career-hierarchy";

/**
 * Creates a fully-typed CareerIntelligence record with safe defaults.
 */
function createCareerIntelligence(
  base: CareerDetail,
  extra: {
    responsibilities: string[];
    educationPath: EducationPathway;
    beginnerSkills: string[];
    intermediateSkills: string[];
    advancedSkills: string[];
    toolsTechnologies: string[];
    roleProgression: string[];
    industryInfo: IndustryInfo;
  }
): CareerIntelligence {
  const allResources = base.roadmap.flatMap((r) => r.resources || []);

  return {
    ...base,
    id: base.slug,
    description: base.tagline,
    responsibilities: extra.responsibilities || [],
    educationPath: extra.educationPath || {
      recommendedStream: "General",
      degrees: [],
      keySubjects: [],
    },
    requiredSkills: [
      ...(extra.beginnerSkills || []),
      ...(extra.intermediateSkills || []),
      ...(extra.advancedSkills || []),
    ],
    beginnerSkills: extra.beginnerSkills || [],
    intermediateSkills: extra.intermediateSkills || [],
    advancedSkills: extra.advancedSkills || [],
    toolsTechnologies: extra.toolsTechnologies || [],
    recommendedProjects: base.projects || [],
    certificationsResources: allResources,
    relatedCareers: base.relatedSlugs || [],
    careerProgression: base.progression || [],
    roleProgression: extra.roleProgression || [],
    industryInfo: extra.industryInfo || {
      sectors: [],
      workEnvironment: "Office or hybrid team environment",
      difficultyToEnter: "Moderate",
      growthPotential: "High",
    },
  };
}

// ── 1. Software / App Development ──────────────────────────────────────────
const softwareDevelopmentIntel = createCareerIntelligence(softwareDevelopment, {
  responsibilities: [
    "Design, build, and maintain web, mobile, and cloud software applications",
    "Write clean, modular, and thoroughly tested code following industry best practices",
    "Collaborate with product designers, managers, and engineers in agile sprints",
    "Debug production incidents, resolve bottlenecks, and optimize system performance",
    "Design and consume REST and GraphQL APIs backed by robust database schemas",
  ],
  educationPath: {
    recommendedStream: "Science (PCM)",
    degrees: [
      "B.Tech / B.E. in Computer Science / Information Technology",
      "BCA followed by MCA",
      "B.S. in Computer Science / Software Engineering",
    ],
    keySubjects: ["Mathematics", "Physics", "Computer Science", "Algorithms"],
    certifications: [
      "AWS Certified Solutions Architect / Developer",
      "Meta Front-End / Back-End Developer Certificate",
      "Certified Kubernetes Application Developer (CKAD)",
    ],
  },
  beginnerSkills: [
    "Programming Fundamentals (Python / JavaScript)",
    "Git & GitHub Version Control",
    "HTML5 & Modern CSS Layouts",
    "Command Line & Terminal Basics",
  ],
  intermediateSkills: [
    "Data Structures & Algorithms (Arrays, HashMaps, Trees)",
    "Relational Databases & SQL Schema Design",
    "RESTful APIs & Backend Frameworks (Node.js / FastAPI)",
    "Authentication, JWT & Security Fundamentals",
  ],
  advancedSkills: [
    "System Design & Scalable Microservices",
    "CI/CD Pipelines & Containerization (Docker, Kubernetes)",
    "Database Sharding, Caching & Replication",
    "Distributed Systems & Asynchronous Queues",
  ],
  toolsTechnologies: [
    "TypeScript",
    "Python",
    "React / Next.js",
    "Node.js",
    "FastAPI",
    "PostgreSQL",
    "Docker",
    "Git",
    "Tailwind CSS",
    "AWS",
  ],
  roleProgression: [
    "Junior Developer",
    "Full-Stack / Backend Engineer",
    "Senior Software Engineer",
    "Staff / Principal Engineer",
    "Engineering Manager / Architect",
  ],
  industryInfo: {
    sectors: [
      "Technology & SaaS",
      "FinTech & Digital Banking",
      "E-Commerce & Retail Tech",
      "Healthcare & MedTech",
      "Gaming & Entertainment",
    ],
    workEnvironment: "Office, hybrid, or fully remote with flexible agile sprints and collaborative code reviews",
    difficultyToEnter: "Moderate — strong portfolio, problem solving, and projects matter more than credentials",
    growthPotential: "Very high — sustained global demand across every industry sector",
  },
});

// ── 2. AI / Machine Learning / Data Science ────────────────────────────────
const aiMlDataScienceIntel = createCareerIntelligence(aiMlDataScience, {
  responsibilities: [
    "Develop statistical models and machine learning pipelines to solve prediction and optimization problems",
    "Clean, transform, and analyze high-volume structured and unstructured datasets",
    "Train, evaluate, fine-tune, and deploy deep learning and LLM models into production",
    "Translate complex quantitative findings into actionable strategic recommendations",
    "Monitor model drift, latency, fairness, and accuracy across live data feeds",
  ],
  educationPath: {
    recommendedStream: "Science (PCM)",
    degrees: [
      "B.Tech in Artificial Intelligence & Data Science",
      "B.S. / B.Sc in Statistics, Mathematics, or Computer Science",
      "M.S. / M.Tech in Machine Learning / Data Science",
    ],
    keySubjects: ["Linear Algebra", "Probability & Statistics", "Multivariable Calculus", "Computer Science"],
    certifications: [
      "TensorFlow Developer Certificate",
      "AWS Certified Machine Learning – Specialty",
      "DeepLearning.AI Machine Learning Specialization",
    ],
  },
  beginnerSkills: [
    "Python Programming for Data (NumPy, Pandas)",
    "Linear Algebra & Multivariable Calculus",
    "Probability & Descriptive Statistics",
    "Data Cleaning & Exploratory Data Analysis (EDA)",
  ],
  intermediateSkills: [
    "Supervised & Unsupervised Machine Learning (Scikit-Learn)",
    "Relational Databases & SQL for Analytics",
    "Data Visualization (Matplotlib, Seaborn, Tableau)",
    "Feature Engineering & Dimensionality Reduction",
  ],
  advancedSkills: [
    "Deep Learning Architectures (Transformers, CNNs, RNNs)",
    "Natural Language Processing & Large Language Models (LLMs)",
    "MLOps, Model Deployment & Pipeline Monitoring",
    "Big Data Frameworks (Apache Spark, Kafka)",
  ],
  toolsTechnologies: [
    "Python",
    "PyTorch",
    "TensorFlow",
    "Pandas",
    "NumPy",
    "Scikit-Learn",
    "Hugging Face",
    "SQL",
    "Jupyter",
    "MLflow",
    "Docker",
  ],
  roleProgression: [
    "Data Analyst / Associate",
    "Machine Learning Engineer",
    "Senior Data Scientist",
    "AI Research Scientist",
    "Head of AI / VP of Data Science",
  ],
  industryInfo: {
    sectors: [
      "Generative AI & Tech Platforms",
      "Finance & Algorithmic Trading",
      "Autonomous Vehicles & Robotics",
      "Bioinformatics & Drug Discovery",
      "Defense & Aerospace",
    ],
    workEnvironment: "High-autonomy research and engineering labs, cloud compute environments, and hybrid teams",
    difficultyToEnter: "High — requires rigorous mathematical foundations alongside programming capability",
    growthPotential: "Exponential — core driver of next-generation technological transformation",
  },
});

// ── 3. Engineering ─────────────────────────────────────────────────────────
const engineeringIntel = createCareerIntelligence(engineering, {
  responsibilities: [
    "Design, analyze, prototype, and test physical, mechanical, and electrical systems",
    "Apply principles of mechanics, thermodynamics, circuits, and materials science to real-world hardware",
    "Create comprehensive technical drawings, CAD specifications, and bill-of-materials (BOM)",
    "Oversee manufacturing processes, quality control, assembly lines, and safety certifications",
    "Troubleshoot hardware failures, structural stress, and electromagnetic interference",
  ],
  educationPath: {
    recommendedStream: "Science (PCM)",
    degrees: [
      "B.Tech / B.E. in Mechanical, Electrical, Civil, or Mechatronics Engineering",
      "M.Tech in Robotics, Systems Engineering, or Structural Engineering",
    ],
    keySubjects: ["Physics (Mechanics & Electromagnetism)", "Engineering Mathematics", "Thermodynamics", "Materials Science"],
    certifications: [
      "Certified SolidWorks Associate (CSWA) / Professional (CSWP)",
      "Six Sigma Green Belt",
      "AutoCAD Certified Professional",
    ],
  },
  beginnerSkills: [
    "Engineering Mathematics & Calculus",
    "Physics & Applied Mechanics",
    "2D Technical Drafting & Orthographic Projection",
    "Basic Electronics & Circuit Prototyping",
  ],
  intermediateSkills: [
    "3D Parametric CAD Modeling (SolidWorks / Inventor)",
    "Thermodynamics & Fluid Dynamics Principles",
    "Microcontroller Programming (C / C++, Arduino)",
    "Materials Selection & Manufacturing Methods",
  ],
  advancedSkills: [
    "Finite Element Analysis (FEA) & Stress Simulation",
    "Control Systems & Autonomous Robotics",
    "Embedded Systems Design & Firmware Architecture",
    "Design for Manufacturability (DFM) & Assembly",
  ],
  toolsTechnologies: [
    "SolidWorks",
    "AutoCAD",
    "MATLAB / Simulink",
    "ANSYS",
    "C / C++",
    "Altium Designer",
    "Arduino / Raspberry Pi",
    "3D Printing / CNC",
  ],
  roleProgression: [
    "Graduate Engineer Trainee",
    "Systems / Mechanical / Electrical Engineer",
    "Senior Project Engineer",
    "Principal Systems Architect",
    "Chief Technology Officer / VP of Engineering",
  ],
  industryInfo: {
    sectors: [
      "Aerospace & Defense",
      "Automotive & Electric Vehicles",
      "Robotics & Industrial Automation",
      "Renewable Energy & Power Systems",
      "Infrastructure & Construction",
    ],
    workEnvironment: "Laboratories, testing facilities, manufacturing plants, and collaborative CAD design offices",
    difficultyToEnter: "High — requires accredited engineering degree and competitive entrance exam qualifications",
    growthPotential: "Strong & steady — enduring backbone for hardware, energy, and infrastructure innovation",
  },
});

// ── 4. Medicine / Healthcare ───────────────────────────────────────────────
const medicineHealthcareIntel = createCareerIntelligence(medicineHealthcare, {
  responsibilities: [
    "Diagnose, evaluate, and treat physical and pathological illnesses in patients",
    "Perform clinical examinations, interpret medical tests, and formulate care regimens",
    "Communicate empathetically with patients, families, and interdisciplinary healthcare staff",
    "Execute medical procedures, emergency interventions, or surgical operations according to protocol",
    "Maintain rigorous medical records, prescription integrity, and adherence to bioethical standards",
  ],
  educationPath: {
    recommendedStream: "Science (PCB)",
    degrees: [
      "MBBS (Bachelor of Medicine, Bachelor of Surgery)",
      "BDS (Dental Surgery) / B.Pharm / B.Sc Nursing",
      "MD / MS (Doctor of Medicine / Master of Surgery) Post-Graduation",
    ],
    keySubjects: ["Biology (Botany & Zoology)", "Human Anatomy & Physiology", "Organic Chemistry", "Genetics"],
    certifications: [
      "Basic Life Support (BLS) & ACLS Certification",
      "Board Medical Licensing Registration",
      "Specialty Fellowship Qualifications",
    ],
  },
  beginnerSkills: [
    "Human Anatomy & Organ Systems",
    "Biochemistry & Cellular Biology",
    "Medical Terminology & Ethics",
    "Patient Empathy & Observation",
  ],
  intermediateSkills: [
    "Pathology & Microbiology Understanding",
    "Pharmacology & Drug Action",
    "Clinical History Taking & Vital Assessment",
    "Diagnostic Test Interpretation (Blood, Urine, ECG)",
  ],
  advancedSkills: [
    "Differential Clinical Diagnosis",
    "Emergency Care & Critical Resuscitation",
    "Surgical Intervention Techniques",
    "Preventative & Public Health Epidemiology",
  ],
  toolsTechnologies: [
    "Electronic Health Records (EHR) Systems",
    "Medical Diagnostic Imaging (X-Ray, MRI, CT)",
    "Surgical & Laparoscopic Instruments",
    "Patient Monitoring Vitals Equipment",
    "Laboratory Assay Analyzers",
  ],
  roleProgression: [
    "Medical Resident / House Officer",
    "General Practitioner / Junior Doctor",
    "Specialist Consultant Physician",
    "Senior Consultant / Department Head",
    "Medical Director / Hospital Chief of Staff",
  ],
  industryInfo: {
    sectors: [
      "Hospitals & Healthcare Networks",
      "Clinical Diagnostics & Pathology Labs",
      "Pharmaceuticals & Clinical Trials",
      "Public Health & Epidemiology Agencies",
      "Telemedicine & Digital Health Startups",
    ],
    workEnvironment: "Hospitals, outpatient clinics, operating theaters, and diagnostic laboratories with shifts and emergency calls",
    difficultyToEnter: "Very high — requires extensive formal qualification, competitive exams (NEET/MBBS), and intensive clinical residency",
    growthPotential: "Extremely resilient — sustained societal demand with lifelong career longevity and clinical specializations",
  },
});

// ── 5. Scientific Research ─────────────────────────────────────────────────
const scientificResearchIntel = createCareerIntelligence(scientificResearch, {
  responsibilities: [
    "Formulate testable scientific hypotheses and design rigorous controlled experimental studies",
    "Collect, calibrate, clean, and statistically evaluate empirical experimental data",
    "Author peer-reviewed research papers and present discoveries at scientific conferences",
    "Apply for scientific grants and manage laboratory equipment and research budgets",
    "Mentor doctoral students, lab assistants, and undergraduate research fellows",
  ],
  educationPath: {
    recommendedStream: "Science (PCM or PCB)",
    degrees: [
      "B.Sc / BS-MS Dual Degree in Physics, Chemistry, Biology, or Interdisciplinary Sciences",
      "M.Sc in Specialized Scientific Domain",
      "Ph.D. / Post-Doctoral Fellowship",
    ],
    keySubjects: ["Fundamental Physics / Chemistry / Biology", "Statistical Mechanics & Analysis", "Calculus", "Experimental Methods"],
    certifications: [
      "Laboratory Safety & Biosafety Officer Certification",
      "Radiation Safety Certification",
      "Good Laboratory Practice (GLP) Compliance",
    ],
  },
  beginnerSkills: [
    "Scientific Method & Hypothesis Formulation",
    "Laboratory Protocol & Specimen Preparation",
    "Statistical Data Analysis & Plotting",
    "Systematic Scientific Literature Review",
  ],
  intermediateSkills: [
    "Experimental Control Design & Replication",
    "Spectroscopy, Chromatography & Assays",
    "Grant Writing & Technical Manuscript Preparation",
    "Statistical Significance Testing & P-Value Analysis",
  ],
  advancedSkills: [
    "Novel Experimental Methodology Innovation",
    "High-Impact Peer-Reviewed Authorship",
    "Multi-Institutional Scientific Collaboration",
    "Computational Simulation & Mathematical Modeling",
  ],
  toolsTechnologies: [
    "Python / R for Science",
    "LaTeX",
    "SPSS / GraphPad Prism",
    "Electron Microscopy & Spectroscopy",
    "Zotero / Mendeley Reference Managers",
    "Bioinformatics / Computational Physics Toolkits",
  ],
  roleProgression: [
    "Graduate Research Assistant",
    "Post-Doctoral Fellow",
    "Staff Scientist / Assistant Professor",
    "Principal Investigator (PI) / Lab Director",
    "Distinguished Research Fellow / Chief Scientific Officer",
  ],
  industryInfo: {
    sectors: [
      "Government & National Research Laboratories (IISc, CSIR, ISRO, NASA)",
      "University Academic Departments",
      "Biotechnology & Pharmaceutical R&D",
      "Advanced Materials & Semiconductor Labs",
      "Environmental & Climate Research Centers",
    ],
    workEnvironment: "Academic research laboratories, cleanrooms, specialized observatories, and writing studies",
    difficultyToEnter: "High — requires advanced post-graduate education (Ph.D.), deep persistence, and published scholarly track record",
    growthPotential: "Prestige-driven with profound long-term global impact on human knowledge and technology",
  },
});

// ── 6. Finance / Investment Banking ────────────────────────────────────────
const financeInvestmentIntel = createCareerIntelligence(financeInvestment, {
  responsibilities: [
    "Perform financial modeling, valuation analysis, and market feasibility studies",
    "Analyze corporate balance sheets, cash flows, income statements, and 10-K disclosures",
    "Advise on mergers and acquisitions (M&A), equity/debt issuances, and IPO structuring",
    "Manage investment portfolios, asset allocation strategies, and risk mitigation models",
    "Create detailed pitch decks, investment memos, and executive board presentations",
  ],
  educationPath: {
    recommendedStream: "Commerce (with Mathematics) or Science (PCM)",
    degrees: [
      "B.Com (Hons) / BBA in Finance",
      "B.S. in Economics, Mathematics, or Statistics",
      "MBA in Finance / Master in Financial Engineering",
    ],
    keySubjects: ["Accountancy & Financial Reporting", "Micro & Macro Economics", "Financial Mathematics & Statistics", "Business Law"],
    certifications: [
      "Chartered Financial Analyst (CFA)",
      "Chartered Accountant (CA) / CPA",
      "Financial Risk Manager (FRM)",
    ],
  },
  beginnerSkills: [
    "Double-Entry Accounting & Financial Statements",
    "Advanced Microsoft Excel & Financial Shortcuts",
    "Time Value of Money & Compound Interest Calculations",
    "Market Mechanics (Equities, Bonds, Interest Rates)",
  ],
  intermediateSkills: [
    "Discounted Cash Flow (DCF) & Multiples Valuation",
    "Financial Statement Forecasting & Scenario Modeling",
    "Capital Budgeting & WACC Calculations",
    "Portfolio Theory & Diversification Analysis",
  ],
  advancedSkills: [
    "LBO (Leveraged Buyout) & M&A Transaction Structuring",
    "Derivatives Pricing & Hedging Strategies",
    "Algorithmic & Quantitative Trading Systems",
    "Regulatory Compliance & Credit Risk Assessment",
  ],
  toolsTechnologies: [
    "Microsoft Excel (Advanced VBA/Formulas)",
    "Bloomberg Terminal",
    "FactSet / Capital IQ",
    "Python for Quantitative Finance",
    "SQL",
    "Power BI / Tableau",
  ],
  roleProgression: [
    "Financial Analyst",
    "Senior Analyst / Associate",
    "Vice President / Portfolio Manager",
    "Director / Managing Director",
    "Partner / Chief Financial Officer (CFO)",
  ],
  industryInfo: {
    sectors: [
      "Investment Banking & Capital Markets",
      "Private Equity & Venture Capital",
      "Asset Management & Sovereign Wealth Funds",
      "FinTech & Algorithmic Trading Firms",
      "Corporate Finance & Strategic Treasury",
    ],
    workEnvironment: "High-energy financial centers, fast-paced transaction desks, data-driven analytical environments",
    difficultyToEnter: "High — highly competitive recruiting pipelines favoring strong quantitative track records and financial acumen",
    growthPotential: "High earning potential — competitive industry compensation and structured pathways to senior partnership and executive leadership",
  },
});

// ── 7. Entrepreneurship ────────────────────────────────────────────────----
const entrepreneurshipIntel = createCareerIntelligence(entrepreneurship, {
  responsibilities: [
    "Identify unmet market needs, validate customer pain points, and define viable product solutions",
    "Assemble, motivate, lead, and compensate high-performing founding teams",
    "Build financial projections, manage runway, manage cash flow, and ensure unit economic profitability",
    "Pitch to angel investors, venture capitalists, and strategic institutional partners for capital",
    "Drive early-stage sales, go-to-market strategies, customer support, and continuous product iteration",
  ],
  educationPath: {
    recommendedStream: "Any Stream (Commerce, Science, or Humanities)",
    degrees: [
      "Bachelor's Degree in Business, Engineering, Design, or Economics",
      "MBA in Entrepreneurship / Innovation (Optional)",
      "Accelerator Programs (Y Combinator, Techstars, Antler)",
    ],
    keySubjects: ["Business Economics", "Marketing & Consumer Psychology", "Financial Accounting", "Strategic Management"],
    certifications: [
      "Product Management & Growth Certificates",
      "Lean Startup Masterclasses",
      "Venture Capital Fellowship Accreditations",
    ],
  },
  beginnerSkills: [
    "Customer Problem Discovery & User Interviewing",
    "Lean Canvas & Value Proposition Design",
    "Basic Financial Budgeting & Runway Tracking",
    "Public Speaking, Storytelling & Pitch Crafting",
  ],
  intermediateSkills: [
    "Rapid MVP Prototyping & No-Code Launch",
    "Customer Acquisition & Digital Performance Marketing",
    "Direct Sales Pipeline & Contract Closing",
    "Early Hiring, Culture Building & Equity Structuring",
  ],
  advancedSkills: [
    "Venture Capital Fundraising (Seed through Series C)",
    "Unit Economics Optimization (LTV, CAC, Payback, Churn)",
    "Strategic Mergers, Acquisitions & Scaling Infrastructure",
    "Corporate Governance, Board Management & Public Listing (IPO)",
  ],
  toolsTechnologies: [
    "Notion / Coda",
    "Figma / Canva",
    "Stripe / Payment Gateways",
    "HubSpot / CRM Suites",
    "Google Analytics 4",
    "Pitch Deck Software",
    "Slack / Linear",
  ],
  roleProgression: [
    "Solo / Early-Stage Founder",
    "Co-Founder & CEO / COO",
    "Growth-Stage Scaleup Executive",
    "Serial Entrepreneur",
    "Venture Capital General Partner / Angel Investor",
  ],
  industryInfo: {
    sectors: [
      "Early-Stage Startups",
      "Venture Studios & Incubators",
      "Technology & Direct-to-Consumer (D2C)",
      "CleanTech & Climate Innovation",
      "Social Impact Enterprises",
    ],
    workEnvironment: "High-uncertainty, high-autonomy startup environments, dynamic workspaces, rapid sprint iterations",
    difficultyToEnter: "Open access to launch, but extremely high execution difficulty requiring resilience, capital efficiency, and market timing",
    growthPotential: "Significant upside — equity ownership and high autonomy, balanced by market competition and execution risk",
  },
});

// ── 8. Management / Product Management ─────────────────────────────────────
const managementProductIntel = createCareerIntelligence(managementProduct, {
  responsibilities: [
    "Define product vision, strategic roadmap, and quarterly OKRs aligned with business targets",
    "Synthesize user feedback, competitor analysis, and quantitative telemetry into Product Requirement Documents (PRDs)",
    "Prioritize backlog features using objective value vs effort assessment frameworks",
    "Bridge engineering, design, marketing, legal, and sales stakeholders to ensure smooth delivery",
    "Monitor feature adoption, engagement funnels, retention metrics, and customer satisfaction (NPS)",
  ],
  educationPath: {
    recommendedStream: "Science (PCM) or Commerce",
    degrees: [
      "B.Tech / B.E. followed by MBA",
      "BBA / B.Com in Business Management or Marketing",
      "B.S. in Computer Science or Information Systems",
    ],
    keySubjects: ["Information Systems", "Business Statistics", "Consumer Behavior", "Operations Management"],
    certifications: [
      "Certified Scrum Product Owner (CSPO)",
      "Reforge Product Strategy / Growth Programs",
      "Pragmatic Institute Certified Product Manager",
    ],
  },
  beginnerSkills: [
    "User Story Writing & Acceptance Criteria",
    "Agile & Scrum Workflow Execution",
    "Basic Funnel Telemetry & Analytics Tracking",
    "Active Cross-Functional Listening & Facilitation",
  ],
  intermediateSkills: [
    "Feature Prioritization Frameworks (RICE, MoSCoW, Kano)",
    "A/B Testing & Statistical Experimentation",
    "Stakeholder Alignment & Negotiation",
    "Wireframing & UX Workflow Mapping",
  ],
  advancedSkills: [
    "Multi-Year Product Vision & Portfolio Strategy",
    "Go-To-Market (GTM) Strategy & Commercial Launch",
    "P&L Ownership & Pricing Architecture",
    "Organizational Design & Cross-Functional Team Leadership",
  ],
  toolsTechnologies: [
    "Jira / Linear",
    "Figma",
    "Mixpanel / Amplitude",
    "Miro / Whimsical",
    "Notion / Confluence",
    "Google Analytics",
    "Postman",
  ],
  roleProgression: [
    "Associate Product Manager (APM)",
    "Product Manager (PM)",
    "Senior Product Manager",
    "Group Product Manager / Director of Product",
    "Chief Product Officer (CPO) / VP of Product",
  ],
  industryInfo: {
    sectors: [
      "Enterprise SaaS & Cloud Software",
      "Consumer Internet & Mobile Platforms",
      "E-Commerce & Digital Marketplaces",
      "FinTech & Neobanking",
      "Management Consulting Agencies",
    ],
    workEnvironment: "Collaborative offices, cross-functional whiteboarding rooms, remote coordination hubs",
    difficultyToEnter: "Moderate to High — requires exceptional problem-solving, empathy, communication, and strategic analytical acumen",
    growthPotential: "Very high — standard pathway into executive general management and corporate leadership",
  },
});

// ── 9. Marketing / Media / Communications ──────────────────────────────────
const marketingMediaIntel = createCareerIntelligence(marketingMedia, {
  responsibilities: [
    "Develop multi-channel marketing campaigns that drive brand awareness, leads, and customer acquisition",
    "Craft compelling brand narratives, advertising copy, press releases, and editorial content",
    "Manage paid acquisition budgets across Google, Meta, LinkedIn, and programmatic ad platforms",
    "Analyze campaign attribution, return on ad spend (ROAS), customer acquisition cost (CAC), and conversions",
    "Collaborate with graphic designers, video editors, and PR agencies to deliver cohesive brand assets",
  ],
  educationPath: {
    recommendedStream: "Arts / Humanities or Commerce",
    degrees: [
      "B.A. in Mass Communication & Journalism",
      "B.A. in Advertising, Public Relations, or Media Studies",
      "BBA in Marketing / MBA in Marketing & Brand Management",
    ],
    keySubjects: ["Media Ethics & Law", "Consumer Psychology", "Advertising Principles", "Digital Media Strategy"],
    certifications: [
      "Google Ads Search / Display Certification",
      "Meta Certified Digital Marketing Associate",
      "HubSpot Inbound Marketing & Content Marketing Certification",
    ],
  },
  beginnerSkills: [
    "Persuasive Copywriting & Storytelling",
    "Social Media Channel Curation & Publishing",
    "Basic Visual Composition & Graphic Layout",
    "Keyword Research & On-Page SEO Foundations",
  ],
  intermediateSkills: [
    "Paid Ad Campaign Setup & Optimization (Meta/Google Ads)",
    "Email Lifecycle Marketing & Automation Sequences",
    "Audience Segmentation & Behavioral Analytics",
    "Video Scripting, Direction & Short-Form Content",
  ],
  advancedSkills: [
    "Omnichannel Brand Architecture & Messaging Positioning",
    "Marketing Attribution Modeling & CAC/LTV Scaling",
    "Corporate Communications & Crisis PR Strategy",
    "Creator Partnerships & Community Growth Engines",
  ],
  toolsTechnologies: [
    "Canva / Adobe Creative Cloud",
    "Google Ads Manager",
    "Meta Ads Manager",
    "HubSpot / Mailchimp",
    "SEMrush / Ahrefs",
    "Google Analytics 4",
    "WordPress / Webflow",
  ],
  roleProgression: [
    "Marketing Coordinator / Content Specialist",
    "Digital Marketing Manager",
    "Senior Brand Strategist",
    "Director of Growth / Communications",
    "Chief Marketing Officer (CMO)",
  ],
  industryInfo: {
    sectors: [
      "Digital Advertising & Creative Agencies",
      "Consumer Tech & Consumer Brands (FMCG)",
      "Media, Publishing & Streaming Platforms",
      "Corporate Enterprise Communications",
      "Public Relations & Crisis Management Firms",
    ],
    workEnvironment: "Creative studio spaces, collaborative agency pods, hybrid remote marketing teams",
    difficultyToEnter: "Moderate — accessible with strong writing samples, creative portfolio, and demonstrable campaign results",
    growthPotential: "High — essential engine for revenue generation and consumer mindshare across all modern brands",
  },
});

// ── 10. Design / Creative Arts ─────────────────────────────────────────────
const designCreativeIntel = createCareerIntelligence(designCreative, {
  responsibilities: [
    "Conduct user experience research, empathic observation, and usability testing with target users",
    "Create wireframes, user journeys, responsive interface layouts, and interactive high-fidelity prototypes",
    "Establish and maintain comprehensive design systems with design tokens, typography, and reusable components",
    "Design brand visual identities including logos, brand guidelines, color palettes, and marketing collateral",
    "Partner closely with frontend engineers to ensure pixel-perfect, accessible UI implementation",
  ],
  educationPath: {
    recommendedStream: "Arts / Humanities, Science, or Commerce",
    degrees: [
      "B.Des (Bachelor of Design) in Interaction, Industrial, or Communication Design",
      "B.F.A. in Graphic Design / Visual Arts",
      "Diplomas / Degrees from National Institute of Design (NID), NIFT, or International Design Schools",
    ],
    keySubjects: ["Visual Composition", "Typography & Color Theory", "Human-Computer Interaction (HCI)", "Design History"],
    certifications: [
      "Google UX Design Professional Certificate",
      "Nielsen Norman Group (NN/g) UX Certification",
      "Framer / Webflow Expert Accreditations",
    ],
  },
  beginnerSkills: [
    "Color Theory, Typography & Layout Geometry",
    "Low-Fidelity Wireframing & Paper Sketching",
    "Visual Hierarchy, Spacing & Contrast Principles",
    "Design Software Basics (Figma Vector Tools)",
  ],
  intermediateSkills: [
    "High-Fidelity UI Prototyping & Micro-Interactions",
    "Usability Testing & Qualitative User Research",
    "Atomic Design Systems & Component Auto-Layout",
    "Responsive Web & Native Mobile Guidelines (iOS/Android)",
  ],
  advancedSkills: [
    "Strategic Design Innovation & Service Design",
    "Complex Enterprise Information Architecture",
    "Accessibility Standards (WCAG 2.2 AA/AAA)",
    "Design Team Leadership & Creative Direction",
  ],
  toolsTechnologies: [
    "Figma",
    "Adobe Photoshop",
    "Adobe Illustrator",
    "Framer",
    "Miro",
    "Protopie",
    "Blender",
    "Webflow",
  ],
  roleProgression: [
    "Junior UI/UX / Graphic Designer",
    "Product Designer",
    "Senior Experience Designer",
    "Lead Designer / Design Architect",
    "Head of Design / VP of User Experience",
  ],
  industryInfo: {
    sectors: [
      "Digital Product Studios & Design Agencies",
      "Software, Mobile Apps & Web Platforms",
      "Consumer Electronics & Hardware Design",
      "Brand Identity & Creative Consultancies",
      "Gaming, AR/VR & Spatial Computing",
    ],
    workEnvironment: "Aesthetic design studios, collaborative Figma canvases, creative critique spaces",
    difficultyToEnter: "Moderate — evaluated primarily on portfolio strength, design case studies, and problem-solving rationale",
    growthPotential: "Very high — user experience is now a critical competitive differentiator for all technology products",
  },
});

// ── 11. Law / Public Policy ────────────────────────────────────────────────
const lawPolicyIntel = createCareerIntelligence(lawPolicy, {
  responsibilities: [
    "Conduct exhaustive legal research into statutory law, judicial precedents, and regulatory codes",
    "Draft legally binding contracts, corporate agreements, compliance policies, and court pleadings",
    "Advise corporate clients, government agencies, or individuals on rights, liabilities, and legal risk",
    "Represent clients before courts, tribunals, arbitration panels, or regulatory hearings",
    "Analyze legislative bills, economic policies, and governance proposals for public sector reform",
  ],
  educationPath: {
    recommendedStream: "Arts / Humanities or Commerce",
    degrees: [
      "5-Year Integrated B.A. LL.B / B.B.A. LL.B (via CLAT, AILET, or LSAT)",
      "3-Year LL.B following Undergraduate Degree",
      "Master of Laws (LL.M) / Master of Public Policy (MPP)",
    ],
    keySubjects: ["Constitutional Law", "Political Science", "Jurisprudence", "Contract & Corporate Law", "Public Administration"],
    certifications: [
      "Bar Council Enrollment / State Bar Licensure",
      "Certified Information Privacy Professional (CIPP/E)",
      "Arbitration & Mediation Accreditation",
    ],
  },
  beginnerSkills: [
    "Critical Reading & Legal Comprehension",
    "Logical Argumentation & Constitutional Literacy",
    "Formal Debate & Public Advocacy",
    "Legal Citation & Case Briefing Methods",
  ],
  intermediateSkills: [
    "Contract Drafting, Redlining & Risk Analysis",
    "Statutory Interpretation & Precedent Analysis",
    "Regulatory Compliance & Due Diligence",
    "Policy Memorandum Writing & Stakeholder Mapping",
  ],
  advancedSkills: [
    "Courtroom Oral Advocacy & Appellate Litigation",
    "Cross-Border M&A and Commercial Financing Law",
    "Legislative Bill Drafting & Regulatory Policy Formulation",
    "International Arbitration & Dispute Resolution",
  ],
  toolsTechnologies: [
    "SCC Online / Manupatra",
    "Westlaw / LexisNexis",
    "HeinOnline",
    "Document Review & Automation Platforms",
    "Legal Matter Management Systems",
  ],
  roleProgression: [
    "Legal Associate / Policy Analyst",
    "Senior Associate / Counsel",
    "Salaried Partner / Senior Policy Specialist",
    "Equity Partner / Head of Legal (General Counsel)",
    "Senior Advocate / Judge / Secretary to Government",
  ],
  industryInfo: {
    sectors: [
      "Corporate Law Firms & Chambers",
      "In-House Corporate Legal Departments",
      "Public Policy Think Tanks & NGOs",
      "Government Ministries & Regulatory Bodies",
      "International Organizations (UN, WTO, World Bank)",
    ],
    workEnvironment: "Courtrooms, law firm libraries, corporate boardrooms, legislative research offices",
    difficultyToEnter: "High — requires competitive entrance examinations (CLAT), demanding legal study, and professional bar licensure",
    growthPotential: "High prestige with immense societal influence, governance leadership, and professional longevity",
  },
});

// ── 12. Psychology / Social Impact ─────────────────────────────────────────
const psychologySocialIntel = createCareerIntelligence(psychologySocial, {
  responsibilities: [
    "Conduct psychological assessments, diagnostic interviews, and behavioral health evaluations",
    "Design and implement evidence-based counseling interventions (CBT, ACT, supportive counseling)",
    "Lead community outreach, nonprofit programs, and social impact intervention initiatives",
    "Design research surveys and evaluate data on human cognition, motivation, and mental health",
    "Advocate for workplace mental health, institutional wellbeing policies, and vulnerable populations",
  ],
  educationPath: {
    recommendedStream: "Arts / Humanities or Science (Psychology/Biology)",
    degrees: [
      "B.A. / B.Sc in Psychology",
      "M.A. / M.Sc in Clinical, Counseling, or Organizational Psychology",
      "M.Phil / Psy.D / Ph.D. in Clinical Psychology or Master of Social Work (MSW)",
    ],
    keySubjects: ["General & Cognitive Psychology", "Developmental Psychology", "Psychopathology", "Social Psychology & Research Statistics"],
    certifications: [
      "Rehabilitation Council of India (RCI) / Licensed Clinical Psychologist Credential",
      "Cognitive Behavioral Therapy (CBT) Certification",
      "Certified Trauma Professional (CTP)",
    ],
  },
  beginnerSkills: [
    "Understanding of Human Behavior & Developmental Stages",
    "Empathetic Active Listening & Non-Verbal Attunement",
    "Research Ethics & Client Confidentiality Protocols",
    "Basic Psychological Statistics & Survey Design",
  ],
  intermediateSkills: [
    "Standardized Psychometric Testing & Scoring",
    "Counseling Frameworks & Therapeutic Rapport",
    "Group Dynamics & Organizational Culture Assessment",
    "Community Needs Assessment & Program Delivery",
  ],
  advancedSkills: [
    "Clinical Psychotherapy & Complex Case Formulation",
    "Behavioral Economics & Nudge Intervention Architecture",
    "Social Impact Program Measurement & Monitoring (M&E)",
    "Mental Health Policy Reform & Systemic Advocacy",
  ],
  toolsTechnologies: [
    "SPSS / R for Psychological Statistics",
    "Psychometric Assessment Suites (WAIS, MMPI, BDI)",
    "Qualtrics / Google Forms",
    "Telehealth & Confidential Clinical EHR Platforms",
    "Monitoring & Evaluation (M&E) Dashboards",
  ],
  roleProgression: [
    "Counseling Intern / Social Work Associate",
    "Staff Psychologist / Behavioral Specialist",
    "Senior Consultant / Clinical Supervisor",
    "Director of Psychological Services / Head of Social Impact",
    "Chief People Officer / Policy Advisor in Mental Health",
  ],
  industryInfo: {
    sectors: [
      "Mental Health Clinics & Private Practices",
      "Hospitals & Psychiatric Care Facilities",
      "Corporate HR, Wellbeing & People Operations",
      "Nonprofit Foundations & Development Organizations",
      "Schools, Universities & Educational Counseling Centers",
    ],
    workEnvironment: "Consulting offices, clinical rooms, community centers, and university research facilities",
    difficultyToEnter: "High for clinical practice — requires clinical licensing, supervised internship hours, and graduate degree",
    growthPotential: "Rapidly expanding — rising global awareness of mental health, organizational wellbeing, and human-centered social impact",
  },
});

// ── Path Intelligence Synthesizer for Expanded Paths ────────────────────────

function synthesizePathIntelligence(path: CareerPath): CareerIntelligence {
  const primaryTraitsByDomain: Record<string, string[]> = {
    "engineering-technology": ["TE", "AN"],
    "data-ai": ["AN", "TE"],
    "design-creative": ["CR", "TE"],
    "business-finance-management": ["BU", "AN"],
    "healthcare-sciences": ["SC", "AN"],
    "media-communications-social": ["SO", "CR"],
  };

  const domainStreamMap: Record<string, { stream: string; degrees: string[]; subjects: string[] }> = {
    "engineering-technology": {
      stream: "Science (PCM)",
      degrees: ["B.Tech / B.E. in Computer Science / Engineering", "B.S. in Applied Technology"],
      subjects: ["Mathematics", "Physics", "Computer Science", "Systems Architecture"],
    },
    "data-ai": {
      stream: "Science (PCM / Statistics)",
      degrees: ["B.Tech in Artificial Intelligence / Data Science", "B.S. in Statistics & Computer Science"],
      subjects: ["Mathematics", "Probability & Statistics", "Computer Science", "Machine Learning"],
    },
    "design-creative": {
      stream: "Any Stream (Design / Arts / Science)",
      degrees: ["B.Des in Interaction / Visual Communication", "B.F.A. in Digital Arts / Animation"],
      subjects: ["Visual Arts", "Design Principles", "Digital Tools", "Psychology"],
    },
    "business-finance-management": {
      stream: "Commerce / Humanities / Science with Math",
      degrees: ["BBA / BBS in Management", "B.Com / B.S. in Finance / Economics"],
      subjects: ["Economics", "Accounting", "Business Studies", "Applied Mathematics"],
    },
    "healthcare-sciences": {
      stream: "Science (PCB)",
      degrees: ["MBBS / B.Sc in Biomedical Sciences", "B.Pharm / Public Health Degrees"],
      subjects: ["Biology", "Chemistry", "Physiology", "Health Systems"],
    },
    "media-communications-social": {
      stream: "Humanities / Any Stream",
      degrees: ["B.A. in Journalism / Mass Communication", "B.A. in Psychology / Social Policy", "LL.B in Law"],
      subjects: ["English & Communication", "Political Science", "Psychology", "Media Studies"],
    },
  };

  const primaryTraits = primaryTraitsByDomain[path.domainId] || ["TE", "AN"];
  const edu = domainStreamMap[path.domainId] || {
    stream: "General",
    degrees: ["Bachelor's Degree in Related Field"],
    subjects: ["Core Disciplines", "Applied Methods"],
  };

  const allRoleTitles = path.specializations.flatMap((s) => s.roles.map((r) => r.title));
  const primarySpec = path.specializations[0];

  const skills: SkillNode[] = path.specializations.map((spec, idx) => ({
    id: `${path.slug}-skill-${idx + 1}`,
    name: spec.name,
    category: path.name,
    relevantTraits: primaryTraits,
    whyItMatters: `Crucial foundation for mastering ${spec.name.toLowerCase()} within ${path.name}.`,
    whatToKnow: spec.description || `Core principles, practical methodologies, and advanced techniques in ${spec.name}.`,
    recommendedLevel: idx === 0 ? "Core" : "Advanced",
  }));

  const roadmap: RoadmapPhase[] = [
    {
      id: `${path.slug}-phase-1`,
      phase: 1,
      title: "Foundational Principles & Core Concepts",
      description: `Build rigorous conceptual foundations in ${path.name}. Master core theories, vocabulary, and introductory workflows.`,
      estimatedDuration: "Months 1–3",
      skills: [skills[0]?.name || "Core Principles", "Industry Fundamentals"],
      learn: [
        `Fundamental concepts and historical principles of ${path.name}`,
        "Standard development environments and foundational software suites",
        "Key methodologies and professional problem-solving frameworks",
      ],
      practice: [
        "Hands-on introductory labs and conceptual problem sets",
        "Analyzing real-world case studies and industry best practices",
      ],
      build: `A foundational starter project demonstrating core principles of ${path.name}.`,
      resources: [
        {
          name: `${path.name} Fundamentals Masterclass`,
          type: "course",
          difficulty: "beginner",
          estimatedTime: "25 hours",
          url: "https://coursera.org",
        },
      ],
    },
    {
      id: `${path.slug}-phase-2`,
      phase: 2,
      title: "Professional Tools & Intermediate Execution",
      description: `Transition to industry-standard tools, systems, and collaborative workflows in ${primarySpec?.name || path.name}.`,
      estimatedDuration: "Months 4–6",
      skills: [skills[1]?.name || "Specialized Tooling", "Applied Systems"],
      learn: [
        "Professional software, hardware frameworks, and automated tooling",
        "Collaborative workflows, version control, and sprint execution",
        "Quality assurance, performance optimization, and testing standards",
      ],
      practice: [
        "Building multi-component workflows and intermediate modules",
        "Optimizing systems for efficiency, reliability, and security",
      ],
      build: `A comprehensive portfolio prototype solving a real-world challenge in ${primarySpec?.name || path.name}.`,
      resources: [
        {
          name: `Applied ${path.name} & System Tools`,
          type: "practice",
          difficulty: "intermediate",
          estimatedTime: "35 hours",
          url: "https://edx.org",
        },
      ],
    },
    {
      id: `${path.slug}-phase-3`,
      phase: 3,
      title: "Advanced Projects & Production Systems",
      description: `Execute end-to-end production-grade projects. Handle edge cases, scale constraints, and real-world deployment.`,
      estimatedDuration: "Months 7–9",
      skills: ["Production Architecture", "System Optimization"],
      learn: [
        "Architecting robust systems capable of scaling under production demands",
        "Cross-functional collaboration with product, design, and operations teams",
        "Regulatory compliance, safety protocols, and industry standards",
      ],
      practice: [
        "Deploying end-to-end systems with monitoring and automated failover",
        "Participating in peer code / design reviews and architectural audits",
      ],
      build: `A full-scale, production-ready capstone project ready for industry presentation.`,
      resources: [
        {
          name: `Advanced ${path.name} Production Systems`,
          type: "documentation",
          difficulty: "advanced",
          estimatedTime: "40 hours",
          url: "https://github.com",
        },
      ],
    },
    {
      id: `${path.slug}-phase-4`,
      phase: 4,
      title: "Specialization & Career Launch",
      description: `Deepen your focus in your chosen specialization, prepare your portfolio, and launch your professional career.`,
      estimatedDuration: "Months 10–12",
      skills: ["Specialized Domain Expertise", "Interview & Career Launch"],
      learn: [
        "Cutting-edge emerging trends, research breakthroughs, and future directions",
        "Portfolio presentation, technical interviewing, and career positioning",
        "Mentorship, leadership principles, and strategic impact",
      ],
      practice: [
        "Mock technical interviews and domain case study presentations",
        "Publishing technical articles or open-source / public contributions",
      ],
      build: `A standout professional portfolio showcasing verified domain competencies and completed client-grade projects.`,
      resources: [
        {
          name: "Career Transition & Portfolio Guide",
          type: "book",
          difficulty: "advanced",
          estimatedTime: "20 hours",
          url: "https://medium.com",
        },
      ],
    },
  ];

  const projects: ProjectIdea[] = [
    {
      title: `${path.name} Foundational Prototype`,
      difficulty: "beginner",
      skills: [skills[0]?.name || "Core Skills", "Problem Solving"],
      description: `An introductory working project exploring the core concepts and mechanics of ${path.name}.`,
      features: [
        "Clean, well-structured architecture adhering to domain standards",
        "Clear documentation explaining decisions and technical trade-offs",
        "Demonstrated understanding of core inputs, processing, and outputs",
      ],
      portfolioValue: "Validates foundational technical literacy and structured thinking to entry-level hiring managers.",
    },
    {
      title: `Applied ${primarySpec?.name || path.name} Solution`,
      difficulty: "intermediate",
      skills: [skills[1]?.name || "Systems Design", "Optimization"],
      description: `A multi-stage solution addressing a specific bottleneck in ${primarySpec?.name || path.name}.`,
      features: [
        "Integrates multiple specialized tools and data / asset pipelines",
        "Addresses real user constraints, edge cases, and performance limits",
        "Comprehensive validation and testing verification metrics",
      ],
      portfolioValue: "Demonstrates practical execution and hands-on competence with professional tools.",
    },
    {
      title: `Full-Scale ${path.name} Production Capstone`,
      difficulty: "advanced",
      skills: ["End-to-End Delivery", "Advanced Systems"],
      description: `An industry-grade, end-to-end system built to professional standards.`,
      features: [
        "Full lifecycle implementation from initial discovery to deployment",
        "Production monitoring, error handling, and performance benchmarks",
        "Publicly documented case study with measurable impact outcomes",
      ],
      portfolioValue: "A flagship portfolio piece that proves you can build and deliver at a professional level.",
    },
  ];

  const progression: CareerStage[] = [
    {
      title: allRoleTitles[0] || "Junior Associate / Analyst",
      yearsRange: "0–2 years",
      responsibilities: [
        `Execute day-to-day tasks and modules within ${path.name}`,
        "Collaborate with senior team members on system requirements",
        "Continuously learn industry tooling and best practices",
      ],
      skills: [skills[0]?.name || "Fundamentals", "Tooling Proficiency"],
      deltaFromPrevious: "Entering the field and translating foundational education into practical team contributions.",
    },
    {
      title: allRoleTitles[1] || "Senior Specialist / Engineer",
      yearsRange: "2–5 years",
      responsibilities: [
        "Independently lead complex modules and feature developments",
        "Make key technical and design decisions for project sub-systems",
        "Mentor junior peers and improve team operational efficiency",
      ],
      skills: ["Advanced Execution", "System Architecture", "Problem Solving"],
      deltaFromPrevious: "Moving from guided task execution to independent system ownership and architectural decision-making.",
    },
    {
      title: allRoleTitles[2] || "Principal / Lead Specialist",
      yearsRange: "5–8 years",
      responsibilities: [
        `Set technical and methodological direction for ${path.name} initiatives`,
        "Align domain strategy with cross-functional business objectives",
        "Conduct architectural reviews and establish quality benchmarks",
      ],
      skills: ["Strategic Vision", "Cross-Functional Leadership", "Domain Mastery"],
      deltaFromPrevious: "Scaling impact from individual project execution to multi-team strategy and technical leadership.",
    },
    {
      title: "Director / Head of Domain",
      yearsRange: "8+ years",
      responsibilities: [
        `Oversee organization-wide strategy, budget, and talent for ${path.name}`,
        "Pioneer long-term innovation roadmaps and executive partnerships",
        "Champion culture, talent development, and industry reputation",
      ],
      skills: ["Executive Strategy", "Organizational Leadership", "Industry Influence"],
      deltaFromPrevious: "Transitioning from technical domain lead to executive leader guiding company-wide direction.",
    },
  ];

  const preparation: PreparationItem[] = [
    {
      id: `${path.slug}-prep-1`,
      category: "Portfolio & Projects",
      task: `Build 3 polished projects demonstrating core competencies in ${path.name}.`,
      details: "Ensure projects are publicly accessible with clear case studies and documented results.",
    },
    {
      id: `${path.slug}-prep-2`,
      category: "Technical & Tooling Mastery",
      task: "Attain professional fluency with primary industry software and tools.",
      details: "Practice standard workflows until you can execute core tasks rapidly without assistance.",
    },
    {
      id: `${path.slug}-prep-3`,
      category: "Interview & Case Study Prep",
      task: "Prepare answers for common domain interview questions and scenario case studies.",
      details: "Frame your experience around structured problem-solving, measurable results, and lessons learned.",
    },
    {
      id: `${path.slug}-prep-4`,
      category: "Community & Network",
      task: `Connect with active professionals and communities in ${path.name}.`,
      details: "Attend meetups, engage on relevant forums, and seek feedback on your portfolio work.",
    },
  ];

  const snapshot: SnapshotItem[] = [
    { label: "Avg Starting Salary", value: "$75,000 – $95,000", icon: "DollarSign" },
    { label: "Mid-Career Salary", value: "$130,000 – $165,000", icon: "TrendingUp" },
    { label: "Job Growth", value: "15% (Much faster than avg)", icon: "Compass" },
    { label: "Remote Flexibility", value: path.domainId === "healthcare-sciences" ? "Moderate" : "High", icon: "Globe" },
    { label: "Primary Skill", value: skills[0]?.name || "Core Mastery", icon: "Sparkles" },
    { label: "Barrier to Entry", value: "Moderate", icon: "Award" },
  ];

  return {
    id: path.slug,
    slug: path.slug,
    careerName: path.name,
    title: path.name,
    tagline: path.tagline,
    description: path.tagline,
    category: path.domainName,
    icon: "Compass",
    primaryTraits,
    snapshot,
    skills,
    roadmap,
    projects,
    progression,
    preparation,
    relatedSlugs: [],
    relatedCareers: [],
    responsibilities: path.specializations.map((s) => s.description || s.name),
    educationPath: {
      recommendedStream: edu.stream,
      degrees: edu.degrees,
      keySubjects: edu.subjects,
    },
    requiredSkills: skills.map((s) => s.name),
    beginnerSkills: [skills[0]?.name || "Foundations"],
    intermediateSkills: skills.slice(1).map((s) => s.name),
    advancedSkills: ["Industry Specialization", "System Leadership"],
    toolsTechnologies: allRoleTitles.slice(0, 5),
    recommendedProjects: projects,
    certificationsResources: roadmap.flatMap((r) => r.resources),
    careerProgression: progression,
    roleProgression: allRoleTitles,
    industryInfo: {
      sectors: [path.domainName, "Global Enterprises", "High-Growth Startups"],
      workEnvironment: "Modern collaborative workplace, flexible or hybrid",
      difficultyToEnter: "Moderate — requires dedicated portfolio and structured domain learning",
      growthPotential: "Strong — expanding demand across modern industries and global markets",
    },
  };
}

// ── Registry Map (All 24 Career Paths) ──────────────────────────────────────

const BASE_CAREER_INTELLIGENCE: Record<string, CareerIntelligence> = {
  "software-development": softwareDevelopmentIntel,
  "ai-ml-data-science": aiMlDataScienceIntel,
  "engineering": engineeringIntel,
  "medicine-healthcare": medicineHealthcareIntel,
  "scientific-research": scientificResearchIntel,
  "finance-investment": financeInvestmentIntel,
  "entrepreneurship": entrepreneurshipIntel,
  "management-product": managementProductIntel,
  "marketing-media": marketingMediaIntel,
  "design-creative": designCreativeIntel,
  "law-policy": lawPolicyIntel,
  "psychology-social": psychologySocialIntel,
};

export const CAREER_INTELLIGENCE_REGISTRY: Record<string, CareerIntelligence> = {
  ...BASE_CAREER_INTELLIGENCE,
};

// Auto-register full intelligence for all expanded paths from canonical hierarchy
for (const path of getAllCareerPaths()) {
  if (!CAREER_INTELLIGENCE_REGISTRY[path.slug]) {
    CAREER_INTELLIGENCE_REGISTRY[path.slug] = synthesizePathIntelligence(path);
  }
}

// ── Backend name -> Slug reverse lookup ────────────────────────────────────
export const CAREER_NAME_TO_ID: Record<string, string> = {
  ...Object.fromEntries(
    Object.values(CAREER_INTELLIGENCE_REGISTRY).map((c) => [c.careerName, c.id])
  ),
  ...Object.fromEntries(
    Object.values(CAREER_INTELLIGENCE_REGISTRY).map((c) => [c.title, c.id])
  ),
  ...Object.fromEntries(
    Object.values(CAREER_INTELLIGENCE_REGISTRY).map((c) => [c.slug, c.id])
  ),
  // Common aliases & alternate cluster titles
  "Software Development": "software-development",
  "Software Developer": "software-development",
  "Software / App Development": "software-development",
  "Software & App Developer": "software-development",
  "Artificial Intelligence & Data": "ai-ml-data-science",
  "AI & Data Science": "ai-ml-data-science",
  "AI / Machine Learning / Data Science": "ai-ml-data-science",
  "UI/UX & Digital Product Design": "design-creative",
  "Design / Creative": "design-creative",
  "Finance & FinTech": "finance-investment",
  "Finance / Investment": "finance-investment",
  "Finance / Investment Banking": "finance-investment",
  "Law & Governance": "law-policy",
  "Law / Public Policy": "law-policy",
  "Law & Public Policy": "law-policy",
  "Management / Product": "management-product",
  "Marketing / Media": "marketing-media",
  "Healthcare & Biotechnology": "medicine-healthcare",
  "Medicine / Healthcare / Biotech": "medicine-healthcare",
  "Business Strategy & Operations": "entrepreneurship",
  "Engineering & Hardware": "engineering",
  "Scientific Research & Development": "scientific-research",
  "Data Analytics & Business Intelligence": "data-analytics-bi",
  "Data Scientist & AI Specialist": "ai-ml-data-science",
  // Common slug aliases
  "finance-fintech": "finance-investment",
  "ai-ml-data": "ai-ml-data-science",
  "data-science": "ai-ml-data-science",
  "data-science-ai": "ai-ml-data-science",
  "data-analytics": "data-analytics-bi",
  "product-management": "management-product",
  "digital-marketing": "marketing-media",
  "healthcare": "medicine-healthcare",
  "biotech": "biomedical-pharmaceutical",
  "cloud-infrastructure": "cloud-infrastructure",
  "animation": "animation-3d-media",
  "supply-chain": "supply-chain-operations",
  "public-health": "public-health-epidemiology",
};
