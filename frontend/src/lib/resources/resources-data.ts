/**
 * Career Compass — Verified Learning Resources Hub Data
 *
 * All resources link to authentic, authoritative, official platforms
 * (e.g., official governmental portals, accredited universities,
 * foundational documentation, and open academic institutions).
 */

export interface VerifiedResource {
  id: string;
  title: string;
  provider: string;
  category:
    | "civil-services"
    | "computer-science"
    | "data-ai"
    | "business-strategy"
    | "creative-design"
    | "healthcare"
    | "core-engineering"
    | "foundational";
  description: string;
  url: string;
  type: "Official Portal" | "Open Course" | "Documentation" | "Curriculum" | "Textbook Hub";
  cost: "Free" | "Free / Audit" | "Official Public";
  badge: string;
}

export const RESOURCE_CATEGORIES = [
  { id: "all", label: "All Categories" },
  { id: "civil-services", label: "Civil Services & Public Policy" },
  { id: "computer-science", label: "Computer Science & Engineering" },
  { id: "data-ai", label: "AI & Data Science" },
  { id: "business-strategy", label: "Business & Strategic Management" },
  { id: "creative-design", label: "Design & Product Innovation" },
  { id: "healthcare", label: "Healthcare & Life Sciences" },
  { id: "core-engineering", label: "Core Physical Engineering" },
  { id: "foundational", label: "Foundational & Academic Skills" },
] as const;

export const VERIFIED_RESOURCES: VerifiedResource[] = [
  // ── 1. Civil Services & Public Administration ───────────────────────
  {
    id: "cs-upsc-official",
    title: "UPSC Official Notifications & Examination Syllabi",
    provider: "Union Public Service Commission (Govt. of India)",
    category: "civil-services",
    description: "Official notifications, rules of examination, complete syllabi for Civil Services Examination (CSE), Indian Forest Service (IFS), and Engineering Services.",
    url: "https://upsc.gov.in",
    type: "Official Portal",
    cost: "Official Public",
    badge: "Official Source",
  },
  {
    id: "cs-ncert-textbooks",
    title: "NCERT Official Digital Textbooks (Classes 6–12)",
    provider: "National Council of Educational Research and Training",
    category: "civil-services",
    description: "Essential foundational reading for General Studies: Indian Polity, History, Geography, and Economic Development in free PDF format.",
    url: "https://ncert.nic.in/textbook.php",
    type: "Textbook Hub",
    cost: "Free",
    badge: "Essential Foundation",
  },
  {
    id: "cs-dopt-portal",
    title: "Department of Personnel and Training (DoPT)",
    provider: "Ministry of Personnel, Public Grievances and Pensions",
    category: "civil-services",
    description: "Official cadre allocation policies, service rules, administrative reforms, and civil services governance structures.",
    url: "https://dopt.gov.in",
    type: "Official Portal",
    cost: "Official Public",
    badge: "Governance Rulebook",
  },
  {
    id: "cs-swayam-public-policy",
    title: "SWAYAM — Indian Polity & Public Policy Courses",
    provider: "Ministry of Education (Govt. of India) & IIT/IIM Faculty",
    category: "civil-services",
    description: "Accredited university-level online coursework covering constitutional governance, administrative ethics, and public administration.",
    url: "https://swayam.gov.in",
    type: "Open Course",
    cost: "Free / Audit",
    badge: "Accredited Higher Ed",
  },
  {
    id: "cs-ncs-portal",
    title: "National Career Service (NCS) India",
    provider: "Ministry of Labour & Employment",
    category: "civil-services",
    description: "Official nationwide career counseling information, state public service notifications, and public sector employment data.",
    url: "https://www.ncs.gov.in",
    type: "Official Portal",
    cost: "Free",
    badge: "National Registry",
  },

  // ── 2. Computer Science & Software Engineering ──────────────────────
  {
    id: "cs-mdn-web",
    title: "MDN Web Docs (JavaScript, CSS, HTML, Web APIs)",
    provider: "Mozilla Foundation",
    category: "computer-science",
    description: "The gold standard open documentation for modern frontend and backend web engineering, browser standards, and HTTP architectures.",
    url: "https://developer.mozilla.org",
    type: "Documentation",
    cost: "Free",
    badge: "Industry Standard",
  },
  {
    id: "cs-python-official",
    title: "Python Official Documentation & Tutorial",
    provider: "Python Software Foundation",
    category: "computer-science",
    description: "Comprehensive language tutorial, standard library reference, and best practices for one of the most widely utilized engineering languages.",
    url: "https://docs.python.org/3/tutorial/",
    type: "Documentation",
    cost: "Free",
    badge: "Official Language Docs",
  },
  {
    id: "cs-cs50-harvard",
    title: "CS50: Introduction to Computer Science",
    provider: "Harvard University (via edX)",
    category: "computer-science",
    description: "World-renowned introductory course covering computational thinking, memory allocation in C, Python, SQL, and algorithm efficiency.",
    url: "https://cs50.harvard.edu/x/",
    type: "Open Course",
    cost: "Free / Audit",
    badge: "Premier Academic Course",
  },
  {
    id: "cs-freecodecamp",
    title: "freeCodeCamp Full-Stack Curriculum & Certifications",
    provider: "freeCodeCamp Organization",
    category: "computer-science",
    description: "Interactive browser-based coding challenges covering responsive design, JavaScript algorithms, backend APIs, and Git workflows.",
    url: "https://www.freecodecamp.org",
    type: "Curriculum",
    cost: "Free",
    badge: "Hands-on Practice",
  },

  // ── 3. AI & Data Science ────────────────────────────────────────────
  {
    id: "data-fastai",
    title: "Practical Deep Learning for Coders",
    provider: "fast.ai Research Lab",
    category: "data-ai",
    description: "Top-down, hands-on deep learning curriculum teaching computer vision, NLP, and tabular models using PyTorch.",
    url: "https://course.fast.ai",
    type: "Open Course",
    cost: "Free",
    badge: "High Practical Signal",
  },
  {
    id: "data-kaggle-learn",
    title: "Kaggle Micro-Courses: Data Analysis & Machine Learning",
    provider: "Kaggle (Google)",
    category: "data-ai",
    description: "Bite-sized, executable Python notebooks teaching Pandas, Feature Engineering, XGBoost, and Data Visualization.",
    url: "https://www.kaggle.com/learn",
    type: "Curriculum",
    cost: "Free",
    badge: "Interactive Notebooks",
  },
  {
    id: "data-scikit-learn",
    title: "Scikit-Learn Machine Learning Guide & Tutorials",
    provider: "Scikit-Learn Community / Inria",
    category: "data-ai",
    description: "In-depth mathematical concepts and code examples for supervised, unsupervised, regression, and clustering algorithms.",
    url: "https://scikit-learn.org/stable/user_guide.html",
    type: "Documentation",
    cost: "Free",
    badge: "Algorithmic Reference",
  },

  // ── 4. Business & Strategy ──────────────────────────────────────────
  {
    id: "biz-iim-swayam",
    title: "SWAYAM — Corporate Strategy & Financial Accounting",
    provider: "IIM Bangalore & IIT Madras (Ministry of Education)",
    category: "business-strategy",
    description: "University-level coursework in strategic management, quantitative finance, microeconomics, and corporate valuation.",
    url: "https://swayam.gov.in",
    type: "Open Course",
    cost: "Free / Audit",
    badge: "Top Tier Indian Faculty",
  },
  {
    id: "biz-khan-macro",
    title: "Khan Academy Economics & Financial Markets",
    provider: "Khan Academy",
    category: "business-strategy",
    description: "Clear, conceptual video tutorials on microeconomics, macroeconomics, monetary policy, and interest rate mechanics.",
    url: "https://www.khanacademy.org/economics-finance-domain",
    type: "Open Course",
    cost: "Free",
    badge: "Mastery Based",
  },

  // ── 5. Creative Design & UI/UX ──────────────────────────────────────
  {
    id: "des-nngroup",
    title: "Nielsen Norman Group UX Research Articles",
    provider: "Nielsen Norman Group",
    category: "creative-design",
    description: "Evidence-based research and usability guidelines from the pioneers of human-computer interaction and design thinking.",
    url: "https://www.nngroup.com/articles/",
    type: "Documentation",
    cost: "Free",
    badge: "Design Research Gold Standard",
  },
  {
    id: "des-figma-learn",
    title: "Figma Design Fundamentals & Auto-Layout Guide",
    provider: "Figma Design Education",
    category: "creative-design",
    description: "Official tutorials covering design systems, component properties, accessibility contrast, and responsive layout constraints.",
    url: "https://help.figma.com/hc/en-us/categories/360002051613-Learn-design",
    type: "Curriculum",
    cost: "Free",
    badge: "Industry Standard Tool",
  },

  // ── 6. Healthcare & Medical Sciences ────────────────────────────────
  {
    id: "health-ncbi-bookshelf",
    title: "NCBI Bookshelf — Biomedical & Life Sciences",
    provider: "National Center for Biotechnology Information (NIH)",
    category: "healthcare",
    description: "Free, peer-reviewed biomedical literature, pathology textbooks, anatomy guides, and molecular biology resources.",
    url: "https://www.ncbi.nlm.nih.gov/books/",
    type: "Textbook Hub",
    cost: "Free",
    badge: "Peer-Reviewed Scientific",
  },
  {
    id: "health-who-open",
    title: "OpenWHO — Global Public Health Courses",
    provider: "World Health Organization",
    category: "healthcare",
    description: "Interactive online courses covering epidemiology, global disease surveillance, and health systems management.",
    url: "https://openwho.org",
    type: "Open Course",
    cost: "Free",
    badge: "Global Health Authority",
  },

  // ── 7. Core Engineering & Physical Sciences ─────────────────────────
  {
    id: "eng-nptel",
    title: "NPTEL Online Engineering Courses (IITs & IISc)",
    provider: "National Programme on Technology Enhanced Learning (Govt. of India)",
    category: "core-engineering",
    description: "Comprehensive lecture video series and problem sets in Mechanical, Electrical, Chemical, and Civil Engineering from India's premier institutes.",
    url: "https://nptel.ac.in",
    type: "Open Course",
    cost: "Free",
    badge: "Premier Indian Institutes",
  },
  {
    id: "eng-mit-ocw",
    title: "MIT OpenCourseWare: Physics, Circuits, & Dynamics",
    provider: "Massachusetts Institute of Technology",
    category: "core-engineering",
    description: "Complete course syllabi, lecture notes, exam problems, and laboratory assignments from MIT faculty.",
    url: "https://ocw.mit.edu",
    type: "Open Course",
    cost: "Free",
    badge: "Global Benchmark",
  },

  // ── 8. Foundational & Academic Skills ───────────────────────────────
  {
    id: "found-khan-stem",
    title: "Khan Academy Advanced Mathematics & Calculus",
    provider: "Khan Academy",
    category: "foundational",
    description: "Self-paced mastery learning from fundamental algebra through multivariable calculus, linear algebra, and probability.",
    url: "https://www.khanacademy.org/math",
    type: "Curriculum",
    cost: "Free",
    badge: "Math Foundation",
  },
  {
    id: "found-learning-how-to-learn",
    title: "Learning How to Learn: Powerful Mental Tools",
    provider: "Deep Teaching Solutions (Dr. Barbara Oakley & Dr. Terrence Sejnowski)",
    category: "foundational",
    description: "Neuroscience-backed principles for chunking knowledge, overcoming procrastination, and optimizing diffuse-mode cognitive processing.",
    url: "https://www.coursera.org/learn/learning-how-to-learn",
    type: "Open Course",
    cost: "Free / Audit",
    badge: "Cognitive Science",
  },
];
