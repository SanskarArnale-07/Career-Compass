import type { PathRoadmapDefinition } from "../types";

export const UPSC_CIVIL_SERVICES_ROADMAP: PathRoadmapDefinition = {
  pathSlug: "upsc-civil-services",
  pathName: "UPSC Civil Services",
  foundationalPhases: [
    {
      id: "upsc-found-1",
      phase: 1,
      title: "Constitutional Governance, Indian Polity & NCERT Core Foundations",
      description: "Master the architecture of Indian constitutional democracy, administrative institutions, and foundational NCERT knowledge.",
      estimatedDuration: "Weeks 1–4",
      skills: ["Indian Constitution & Articles", "Preamble & Fundamental Rights", "NCERT Foundations (Hist, Geo, Pol, Econ)", "Current Affairs Synthesis"],
      learn: [
        "Constitutional philosophy: Preamble, Fundamental Rights, Directive Principles of State Policy, and Basic Structure doctrine",
        "Institutional organs: President, Parliament, Supreme Court, High Courts, and Governor functions",
        "Foundations of Indian economic development, agrarian systems, and post-independence history",
        "Daily current affairs synthesis connecting national news with General Studies syllabus topics",
      ],
      practice: [
        "Analyze 5 landmark Supreme Court constitutional judgments (e.g. Kesavananda Bharati, Maneka Gandhi, Puttaswamy)",
        "Summarize monthly policy briefs from official government sources like Press Information Bureau (PIB)",
      ],
      build: "A foundational governance dossier: constitutional summaries, institutional maps, and a 1-month current affairs policy notebook.",
      resources: [
        { name: "UPSC Official Examination Portal & Syllabus", type: "documentation", difficulty: "beginner", estimatedTime: "Ongoing", url: "https://upsc.gov.in/" },
        { name: "NCERT Textbooks Online (Class 6–12 Foundations)", type: "documentation", difficulty: "beginner", estimatedTime: "Ongoing", url: "https://ncert.nic.in/textbook.php" },
      ],
    },
    {
      id: "upsc-found-2",
      phase: 2,
      title: "General Studies Mains Mastery, Administrative Ethics & Answer Writing",
      description: "Develop deep subject comprehension across GS Papers I–IV, ethics case studies, and structured answer writing.",
      estimatedDuration: "Weeks 5–8",
      skills: ["Structured GS Answer Writing", "Administrative Ethics & Case Studies", "Public Scheme Evaluation", "Essay Writing Strategy"],
      learn: [
        "General Studies Papers I–IV syllabus mapping: History/Geography (GS1), Governance/Polity/IR (GS2), Economy/Environment/Security (GS3), Ethics/Integrity/Aptitude (GS4)",
        "Answer writing structure: concise introduction, structured arguments with sub-headings, flowchart utilization, and balanced conclusion",
        "Administrative ethics case studies: navigating conflict of interest, political pressure, and resource scarcity",
        "Essay paper strategy: brainstorming multidimensional arguments across social, economic, political, and philosophical lenses",
      ],
      practice: [
        "Write 2 timed GS answers daily with self-evaluation against official UPSC marking benchmarks",
        "Draft a complete 1,000-word analytical essay on a contemporary governance or public policy topic",
      ],
      build: "A comprehensive Mains answer writing portfolio: 20 graded GS answers, 3 structured essays, and 10 solved ethical case studies.",
      resources: [
        { name: "PRS Legislative Research — Official Policy & Bill Analysis", type: "documentation", difficulty: "intermediate", estimatedTime: "Ongoing", url: "https://prsindia.org/" },
        { name: "Press Information Bureau (PIB) Government of India", type: "documentation", difficulty: "beginner", estimatedTime: "Daily", url: "https://pib.gov.in/" },
      ],
    },
  ],
  defaultAdvancedPhases: [
    {
      id: "upsc-adv-1",
      phase: 3,
      title: "Optional Subject Depth, Test Series Simulation & PYQ Consolidation",
      description: "Master specialized optional subject disciplines, solve previous year question papers, and simulate Prelims and Mains exams.",
      estimatedDuration: "Weeks 9–14",
      skills: ["Optional Subject Mastery", "UPSC PYQ Pattern Analysis", "Prelims Speed & Accuracy", "Mains Time Management"],
      learn: [
        "Specialized subject selection and deep syllabus coverage for the two Optional papers (500 marks total)",
        "Rigorous analysis of 10 years of UPSC Prelims and Mains Previous Year Questions (PYQs)",
        "Time management and question selection strategy during 3-hour examination sessions",
        "Static vs. dynamic question integration across international relations and science & technology",
      ],
      practice: [
        "Solve 10 full-length simulated UPSC Prelims mock tests with negative marking calculation",
        "Complete 4 full-length Mains test series papers under strict 3-hour exam conditions",
      ],
      build: "An advanced examination preparation portfolio: 10 years solved PYQ question banks, optional subject synopses, and test performance analysis.",
      resources: [
        { name: "UPSC Previous Years Question Papers (Official Archive)", type: "practice", difficulty: "advanced", estimatedTime: "Ongoing", url: "https://upsc.gov.in/examinations/previous-question-papers" },
      ],
    },
    {
      id: "upsc-adv-2",
      phase: 4,
      title: "Personality Test (Interview) Preparation & Governance Capstone",
      description: "Develop administrative personality attributes, articulate positions on national policy, and defend your Detailed Application Form.",
      estimatedDuration: "Weeks 15–20",
      skills: ["Personality Test Board Prep", "DAF Profile Defense", "Crisis Leadership Simulation", "Public Policy Debate"],
      learn: [
        "Interview board personality preparation: detailed application form (DAF) defense, home state profile, and international affairs",
        "Stress management, mental composure, and ethical conviction under rigorous board questioning",
        "Articulating nuanced, evidence-based stances on complex constitutional and socio-economic controversies",
        "Understanding field posting challenges: grassroots service delivery, disaster response, and citizen interface",
      ],
      practice: [
        "Participate in structured mock interviews with senior administrators and subject matter experts",
        "Deliver simulated 10-minute policy briefings on district development bottlenecks",
      ],
      build: "A complete civil service candidacy portfolio: detailed DAF analysis dossier, current affairs viewpoint compendium, and leadership case study.",
      resources: [
        { name: "Sansad TV Official Discussions & Debates", type: "video", difficulty: "intermediate", estimatedTime: "Weekly", url: "https://sansadtv.nic.in/" },
      ],
    },
  ],
  specializationTracks: {
    "ias-administration": {
      id: "ias-administration",
      name: "Indian Administrative Service (IAS) & Public Governance",
      phases: [
        {
          id: "ias-spec-3",
          phase: 3,
          title: "District Administration, Land Revenue Governance & Grassroots Schemes",
          description: "Master sub-divisional and district administration, revenue courts, Panchayati Raj integration, and welfare delivery.",
          estimatedDuration: "Weeks 9–14",
          skills: ["District Administration Machinery", "Land Revenue & Tenure", "Grassroots Welfare Delivery", "Panchayati Raj Coordination"],
          learn: [
            "Sub-divisional and district administrative machinery: SDM and District Magistrate statutory powers",
            "Land revenue administration, land records digitization, and local dispute settlement",
            "Inter-departmental execution of flagship national missions (Jal Jeevan, PM Awas, Swachh Bharat)",
            "Disaster management command under the Disaster Management Act, 2005",
          ],
          practice: [
            "Simulate an emergency district disaster management plan for flash flooding or heatwave crisis",
            "Draft an operational blueprint for improving primary school attendance and mid-day meal quality in a district",
          ],
          build: "A complete District Administrative Action Plan: emergency disaster SOP, welfare scheme monitoring dashboard, and grievance redressal framework.",
          resources: [{ name: "NITI Aayog Best Practices in Social Sector", type: "documentation", difficulty: "intermediate", estimatedTime: "3 weeks", url: "https://www.niti.gov.in" }],
        },
        {
          id: "ias-spec-4",
          phase: 4,
          title: "State Secretariat Policy Formulation & National Mission Leadership",
          description: "Lead state and national ministry policy formulation, public expenditure management, and administrative reforms.",
          estimatedDuration: "Weeks 15–20",
          skills: ["Ministry Policy Drafting", "Public Expenditure & Budgeting", "Legislative Assembly Briefing", "Digital Governance Platforms"],
          learn: [
            "Secretariat operations: file management, cabinet notes, inter-ministerial consultations, and statutory rules",
            "State and central budget preparation, fiscal deficit management, and public-private partnerships",
            "Digital governance initiatives: direct benefit transfer (DBT), open data platforms, and citizen service portals",
            "Ethics and probity in procurement, regulatory approvals, and vigilance inquiries",
          ],
          practice: [
            "Draft a comprehensive Cabinet Note proposing a statewide healthcare infrastructure upgrade",
            "Evaluate a public procurement tender analyzing compliance, financial viability, and transparency",
          ],
          build: "A flagship Public Governance Capstone: drafted state policy framework, cabinet note, and digital delivery architecture.",
          resources: [{ name: "Department of Administrative Reforms & Public Grievances (DARPG)", type: "documentation", difficulty: "intermediate", estimatedTime: "2 weeks", url: "https://darpg.gov.in" }],
        },
      ],
    },
    "ips-internal-security": {
      id: "ips-internal-security",
      name: "Indian Police Service (IPS) & Law Enforcement",
      phases: [
        {
          id: "ips-spec-3",
          phase: 3,
          title: "Police Station Administration, Investigation & Public Order",
          description: "Study district policing, criminal law implementation under BNS/BNSS, forensic investigation, and crowd control.",
          estimatedDuration: "Weeks 9–14",
          skills: ["Criminal Law & Procedures (BNS/BNSS)", "Police Station Management", "Forensic Investigation", "Public Order & Riot Control"],
          learn: [
            "Statutory framework of policing: Bharatiya Nyaya Sanhita (BNS) and Bharatiya Nagarik Suraksha Sanhita (BNSS)",
            "Police station circle management, station house officer supervision, and crime beat patrols",
            "Forensic evidence collection, chain of custody, and modern scientific interrogation techniques",
            "Crowd management, peaceful assembly policing, and non-lethal de-escalation tactics",
          ],
          practice: [
            "Review a simulated crime scene protocol ensuring evidence preservation and legal compliance",
            "Draft a law and order deployment plan for a major public festival or political demonstration",
          ],
          build: "A comprehensive Law Enforcement Portfolio: crime investigation SOP, public order deployment matrix, and community policing strategy.",
          resources: [{ name: "Bureau of Police Research and Development (BPR&D)", type: "documentation", difficulty: "intermediate", estimatedTime: "Ongoing", url: "https://bprd.nic.in" }],
        },
        {
          id: "ips-spec-4",
          phase: 4,
          title: "Internal Security, Counter-Terrorism & Cybercrime Defense",
          description: "Formulate strategic security policies, intelligence coordination, anti-terror operations, and specialized cyber defense.",
          estimatedDuration: "Weeks 15–20",
          skills: ["Internal Security Architecture", "Intelligence Analysis", "Cybercrime Investigation", "Police Modernization"],
          learn: [
            "India's internal security threats: left-wing extremism, border security, cross-border terrorism, and communal friction",
            "Intelligence collection, inter-agency coordination (IB, RAW, State Intelligence), and multi-agency centers (MAC)",
            "Cyber policing: digital forensics, financial fraud investigation, and countering online radicalization",
            "Police modernization: SMART policing frameworks, CCTV surveillance grids, and police welfare systems",
          ],
          practice: [
            "Draft an intelligence assessment report evaluating a hypothetical coastal or border security threat",
            "Design a district cybercrime awareness and rapid incident response protocol",
          ],
          build: "An Internal Security Capstone Blueprint: district security assessment, cybercrime rapid response manual, and inter-agency intelligence coordination framework.",
          resources: [{ name: "National Crime Records Bureau (NCRB) Reports", type: "documentation", difficulty: "intermediate", estimatedTime: "3 weeks", url: "https://ncrb.gov.in" }],
        },
      ],
    },
    "ifs-diplomatic-relations": {
      id: "ifs-diplomatic-relations",
      name: "Indian Foreign Service (IFS) & Diplomacy",
      phases: [
        {
          id: "ifs-spec-3",
          phase: 3,
          title: "Bilateral Diplomacy, Consular Affairs & International Law",
          description: "Master diplomatic protocol, Vienna Conventions, consular assistance for diaspora, and bilateral trade talks.",
          estimatedDuration: "Weeks 9–14",
          skills: ["Diplomatic Protocol", "Vienna Convention on Diplomatic Relations", "Consular Affairs", "Bilateral Trade Negotiations"],
          learn: [
            "International law and treaties: Vienna Convention on Diplomatic and Consular Relations, UN charter",
            "Consular operations: passport and visa administration, diaspora welfare, and emergency evacuation protocols",
            "Bilateral negotiations: diplomatic dispatches, joint communiqués, and economic partnership agreements",
            "Public diplomacy: cultural outreach, media engagement, and soft power projection abroad",
          ],
          practice: [
            "Draft a formal diplomatic note verbale and bilateral joint statement on clean energy collaboration",
            "Formulate an emergency evacuation contingency plan for Indian citizens in a crisis zone",
          ],
          build: "A Diplomatic Mission Operations Portfolio: bilateral briefing book, emergency diaspora evacuation SOP, and public diplomacy campaign plan.",
          resources: [{ name: "Ministry of External Affairs (MEA) Official Portals & Statements", type: "documentation", difficulty: "intermediate", estimatedTime: "Ongoing", url: "https://www.mea.gov.in" }],
        },
        {
          id: "ifs-spec-4",
          phase: 4,
          title: "Multilateral Geopolitics, Strategic Accords & Summit Negotiations",
          description: "Represent India at multilateral forums (UN, G20, BRICS, SCO), negotiate strategic accords, and shape foreign policy.",
          estimatedDuration: "Weeks 15–20",
          skills: ["Multilateral Negotiations", "Geopolitical Strategy", "Global Supply Chain Diplomacy", "Summit Coordination"],
          learn: [
            "Multilateral forums: United Nations Security Council reform, G20 leadership, BRICS, Quad, and WTO negotiations",
            "Geopolitical balancing: Indo-Pacific strategy, neighborhood-first policy, and global South partnerships",
            "Energy and technology diplomacy: critical minerals, semiconductor partnerships, and climate finance",
            "Crisis diplomacy: managing international tensions, sanctions compliance, and maritime security accords",
          ],
          practice: [
            "Draft an official delegate speech for a UN General Assembly debate on international maritime security",
            "Formulate a strategic briefing paper on India's engagement in the Indian Ocean Region",
          ],
          build: "A Foreign Policy Strategy Capstone: multilateral summit position paper, Indo-Pacific diplomatic strategy document, and global South partnership roadmap.",
          resources: [{ name: "Indian Council of World Affairs (ICWA) Research", type: "documentation", difficulty: "advanced", estimatedTime: "4 weeks", url: "https://www.icwa.in" }],
        },
      ],
    },
    "irs-revenue-governance": {
      id: "irs-revenue-governance",
      name: "Indian Revenue Service (IRS) & Financial Administration",
      phases: [
        {
          id: "irs-spec-3",
          phase: 3,
          title: "Direct & Indirect Tax Administration, GST & Corporate Assessments",
          description: "Master Income Tax and GST administration, corporate audits, assessment proceedings, and tax tribunals.",
          estimatedDuration: "Weeks 9–14",
          skills: ["Income Tax Act Administration", "GST Architecture & Compliance", "Corporate Financial Audits", "Tax Dispute Resolution"],
          learn: [
            "Direct tax systems: Income Tax Act, corporate tax assessment, and faceless assessment schemes",
            "Indirect tax systems: Goods and Services Tax (GST) council framework, input tax credit, and customs tariffs",
            "Financial statement analysis, corporate forensic accounting, and detecting tax evasion patterns",
            "Appellate tribunals, dispute resolution panels, and taxpayer grievance redressal mechanisms",
          ],
          practice: [
            "Review a simulated corporate tax assessment order evaluating allowable deductions and compliance",
            "Analyze a GST input tax credit reconciliation identifying circular trading anomalies",
          ],
          build: "A Tax Administration Case Portfolio: corporate assessment order draft, GST compliance audit report, and taxpayer service charter.",
          resources: [{ name: "Central Board of Direct Taxes (CBDT) Official Portal", type: "documentation", difficulty: "intermediate", estimatedTime: "Ongoing", url: "https://incometaxindia.gov.in" }],
        },
        {
          id: "irs-spec-4",
          phase: 4,
          title: "Anti-Money Laundering, International Taxation & Financial Intelligence",
          description: "Lead investigations into economic offences, transfer pricing, financial forensics, and cross-border tax evasion.",
          estimatedDuration: "Weeks 15–20",
          skills: ["Anti-Money Laundering (PMLA)", "Cross-Border Transfer Pricing", "Financial Intelligence & Forensics", "Revenue Policy Strategy"],
          learn: [
            "Economic offence frameworks: Prevention of Money Laundering Act (PMLA), Black Money Act, and Fugitive Economic Offenders Act",
            "International taxation: Base Erosion and Profit Shifting (BEPS), double taxation avoidance agreements (DTAA)",
            "Financial intelligence units (FIU-IND) operations, digital cryptocurrency tracking, and trade-based money laundering",
            "National revenue forecasting, fiscal policy advisory, and ease of doing business tax reforms",
          ],
          practice: [
            "Conduct a simulated cross-border transfer pricing evaluation on multinational intra-group transactions",
            "Formulate a financial intelligence report linking shell company transactions to unexplained wealth",
          ],
          build: "A Revenue Governance Capstone: cross-border transfer pricing audit memorandum, financial forensics investigation report, and revenue reform blueprint.",
          resources: [{ name: "Central Board of Indirect Taxes and Customs (CBIC)", type: "documentation", difficulty: "advanced", estimatedTime: "4 weeks", url: "https://www.cbic.gov.in" }],
        },
      ],
    },
  },
};

// ── State Public Service Commissions (State PSCs) ──────────────────────────
export const STATE_PSC_ROADMAP: PathRoadmapDefinition = {
  pathSlug: "state-public-service-commissions",
  pathName: "State Public Service Commissions",
  foundationalPhases: [
    {
      id: "state-psc-found-1",
      phase: 1,
      title: "State Constitutional History, Regional Geography & NCERT Foundations",
      description: "Master state-specific administrative heritage, regional geography, natural resources, and the constitutional role of State Governors.",
      estimatedDuration: "Weeks 1–4",
      skills: ["State History & Regional Heritage", "Physical & Economic Geography of State", "State Constitutional Framework & Governor Powers", "Regional Current Affairs & State Schemes"],
      learn: [
        "State-specific historical movements, regional freedom struggles, dynasties, and post-reorganization geography",
        "Regional river basins, soil classifications, mineral wealth, industrial corridors, and agro-climatic zones",
        "Constitutional federal structure: Governor's constitutional powers, State Legislature, State High Court, and State Election Commission",
        "State socio-economic development, flagship state welfare missions, and regional budget highlights",
      ],
      practice: [
        "Map the major river basins, forest preserves, and industrial hubs of the target state",
        "Analyze 3 state legislative bills and summarize their regional governance impact",
      ],
      build: "A State Governance Dossier: comprehensive state administrative atlas, historical timeline, and state welfare scheme directory.",
      resources: [
        { name: "Official State Portal Directory (National Portal of India)", type: "documentation", difficulty: "beginner", estimatedTime: "Ongoing", url: "https://www.india.gov.in/content/states-and-uts" },
        { name: "Census of India: State Demographic & Socio-Economic Profiles", type: "documentation", difficulty: "beginner", estimatedTime: "Ongoing", url: "https://censusindia.gov.in/" },
      ],
    },
    {
      id: "state-psc-found-2",
      phase: 2,
      title: "State Administrative Law, Panchayati Raj & State PSC Answer Writing",
      description: "Understand state revenue codes, local self-government institutions, regional language administration, and State PSC Mains answer writing.",
      estimatedDuration: "Weeks 5–8",
      skills: ["State Administrative Law & Revenue Code", "Panchayati Raj Institutions (73rd/74th Amendments)", "State PSC Answer Writing Technique", "Regional Language Proficiency & Translation"],
      learn: [
        "State Tenancy and Land Revenue Code: land titling, mutation proceedings, tenancy rights, and ceiling acts",
        "Decentralized governance: 73rd and 74th Constitutional Amendments, Gram Sabhas, Zilla Parishad operations, and urban municipal acts",
        "State PSC Mains answer structure: incorporating state-specific statistics, government committee reports, and balanced regional analysis",
        "Regional language comprehension, official administrative translation, and state précis writing",
      ],
      practice: [
        "Write 2 timed State PSC Mains answers daily addressing local developmental issues",
        "Translate an official government notification between English and the regional state language",
      ],
      build: "A State PSC Mains Portfolio: 15 graded state governance answers, 5 regional land dispute case notes, and 2 state policy analysis essays.",
      resources: [
        { name: "Ministry of Panchayati Raj: Decentralized Planning Guidelines", type: "documentation", difficulty: "intermediate", estimatedTime: "Ongoing", url: "https://panchayat.gov.in/" },
        { name: "Department of Land Resources (Ministry of Rural Development)", type: "documentation", difficulty: "intermediate", estimatedTime: "Ongoing", url: "https://dolr.gov.in/" },
      ],
    },
  ],
  defaultAdvancedPhases: [
    {
      id: "state-psc-adv-1",
      phase: 3,
      title: "District Field Administration & State Public Service Simulation",
      description: "Deepen understanding of district administration, sub-divisional magisterial roles, and state mock examinations.",
      estimatedDuration: "Weeks 9–14",
      skills: ["District Administrative Hierarchy", "Sub-Divisional Revenue Courts", "State Mock Exam Simulation", "State Specific PYQ Analysis"],
      learn: [
        "Hierarchical coordination between District Collector, Sub-Divisional Officer, Tehsildar, and Patwari/Lekhpal",
        "Dispute adjudication in revenue courts: tenancy appeals, partition suits, and encroachment removals",
        "Simulating full-length State PSC Preliminary and Mains examination papers under timed conditions",
        "Analyzing 10 years of state-specific previous year questions to master high-frequency regional themes",
      ],
      practice: [
        "Complete 5 full-length State PSC Mains mock tests under strict 3-hour exam conditions",
        "Draft a simulated revenue court order settling an agricultural boundary partition dispute",
      ],
      build: "A State PSC Examination Master Portfolio: 10 years solved state PYQ question banks and mock performance analysis reports.",
      resources: [
        { name: "National Portal of India — State PSC Examination Archive", type: "practice", difficulty: "advanced", estimatedTime: "Ongoing", url: "https://www.india.gov.in/" },
      ],
    },
    {
      id: "state-psc-adv-2",
      phase: 4,
      title: "State PSC Interview (Personality Test) & Local Governance Capstone",
      description: "Prepare for the State PSC Personality Test board, defend state developmental priorities, and present a local governance roadmap.",
      estimatedDuration: "Weeks 15–20",
      skills: ["State PSC Interview Board Strategy", "Regional Socio-Economic Debate", "Field Crisis Leadership Simulation", "Grassroots Citizen Interface"],
      learn: [
        "State PSC interview board preparation: district profile defense, local developmental challenges, and personal background",
        "Articulating evidence-backed positions on regional water disputes, industrialization, and agricultural welfare",
        "Simulating grassroots crisis leadership: disaster relief distribution, law-and-order flare-ups, and health epidemics",
        "Developing compassionate, citizen-centric administrative temperament adhering to public service values",
      ],
      practice: [
        "Participate in mock interview panels evaluated by senior retired state administrators",
        "Deliver a 10-minute briefing on resolving acute drinking water shortages in an arid sub-division",
      ],
      build: "A State Civil Service Candidacy Portfolio: comprehensive district socio-economic monograph and leadership case study.",
      resources: [
        { name: "Sardar Patel Institute of Public Administration (SPIPA) / State ATI Case Studies", type: "documentation", difficulty: "intermediate", estimatedTime: "Weekly", url: "https://spipa.gujarat.gov.in/" },
      ],
    },
  ],
  specializationTracks: {
    "state-administrative-services": {
      id: "state-administrative-services",
      name: "State Administrative Services (SAS / Provincial Civil Services)",
      phases: [
        {
          id: "sas-spec-3",
          phase: 3,
          title: "Tehsil & Sub-Divisional Administration, Land Records & Local Public Grievance",
          description: "Master magisterial powers, land records mutation, public hearing mechanics, and disaster relief logistics.",
          estimatedDuration: "Weeks 9–14",
          skills: ["Sub-Divisional Magisterial Powers (CrPC/BNSS)", "Land Mutation & Record-of-Rights (RoR)", "Public Grievance Redressal (Jan Seva)", "Disaster Relief & Local Protocol"],
          learn: [
            "Magisterial powers of Sub-Divisional Magistrates under the Code of Criminal Procedure / BNSS",
            "Land record maintenance: digitized Record-of-Rights (Jamabandi/Khatoni), demarcation, and revenue dispute resolution",
            "Grassroots grievance redressal: public hearings, Right to Public Services acts, and localized welfare disbursement",
            "District disaster response protocols, monsoon flood relief management, and election returning officer duties",
          ],
          practice: [
            "Draft a simulated magisterial order addressing a local public nuisance and land encroachment dispute",
            "Review a digitized land mutation appeal identifying discrepancies in tenancy title",
          ],
          build: "A Sub-Divisional Administrative Casebook: magisterial order drafts, land dispute adjudication records, and disaster relief logistics plan.",
          resources: [
            { name: "Digital India Land Records Modernization Programme (DILRMP)", type: "documentation", difficulty: "intermediate", estimatedTime: "Ongoing", url: "https://dilrmp.gov.in/" },
          ],
        },
        {
          id: "sas-spec-4",
          phase: 4,
          title: "Block Development, Rural Welfare Implementation & District Development Coordination",
          description: "Orchestrate rural employment guarantee execution, Panchayati Raj funds devolution, social audits, and inter-departmental convergence.",
          estimatedDuration: "Weeks 15–20",
          skills: ["Rural Development Scheme Execution (MGNREGS)", "Panchayat Development Coordination", "Social Audits & Grassroots Accountability", "District Planning Committee Operations"],
          learn: [
            "Execution frameworks for major rural schemes: MGNREGS, PM Awas Yojana, Jal Jeevan Mission, and rural livelihood missions",
            "Financial devolution to Gram Panchayats under State Finance Commission recommendations",
            "Conducting transparent social audits, public muster roll verifications, and anti-corruption safeguards",
            "Inter-departmental coordination: agriculture, animal husbandry, health, and primary education alignment",
          ],
          practice: [
            "Formulate a Gram Panchayat annual development plan integrating rural employment and water conservation",
            "Conduct a simulated social audit of an infrastructure work verifying material quality and expenditure",
          ],
          build: "A Rural Governance Capstone: comprehensive block development plan, social audit dossier, and rural livelihood impact assessment.",
          resources: [
            { name: "National Institute of Rural Development & Panchayati Raj (NIRDPR)", type: "documentation", difficulty: "advanced", estimatedTime: "4 weeks", url: "https://www.nirdpr.org.in/" },
          ],
        },
      ],
    },
    "state-police-services": {
      id: "state-police-services",
      name: "State Police Services (SPS / Deputy SP)",
      phases: [
        {
          id: "sps-spec-3",
          phase: 3,
          title: "Sub-Divisional Police Command, FIR Registration & Field Law & Order",
          description: "Supervise police station operations, maintain case diaries, deploy riot control squads, and preserve crime scene evidence.",
          estimatedDuration: "Weeks 9–14",
          skills: ["Police Station Supervision & Thana Management", "FIR & Case Diary Documentation", "Riot Control & Public Order Tactics", "Field Forensic Evidence Collection"],
          learn: [
            "Police station routine: General Diary, First Information Report (FIR), case diary upkeep, and lock-up safeguards",
            "Investigation procedures under Bharatiya Sakshya Adhiniyam and criminal procedure statutes",
            "Crowd dynamics, non-lethal crowd control, mob dispersal protocols, and VIP security bandobast",
            "Crime scene preservation, physical evidence tagging, chain of custody, and forensic coordination",
          ],
          practice: [
            "Draft a detailed First Information Report and initial case diary for a simulated property crime",
            "Formulate a bandobast deployment scheme for a major public festival or political rally",
          ],
          build: "A Police Station Operations Portfolio: inspection report template, criminal investigation case diary, and riot containment tactical scheme.",
          resources: [
            { name: "Bureau of Police Research and Development (BPR&D): Police Training Manuals", type: "documentation", difficulty: "intermediate", estimatedTime: "Ongoing", url: "https://bprd.nic.in/" },
          ],
        },
        {
          id: "sps-spec-4",
          phase: 4,
          title: "State Crime Investigation, Cybercrime Cell & Strategic Range Supervision",
          description: "Lead organized crime interdiction, operate district cybercrime cells, orchestrate CDR analysis, and foster community policing.",
          estimatedDuration: "Weeks 15–20",
          skills: ["Organized Crime & Narcotics Interdiction", "Cybercrime Cell Operations & CDR Analysis", "Community Policing & Citizen Interface", "Police Modernization & Emergency Response"],
          learn: [
            "Organized crime suppression, illicit arms tracking, and NDPS investigation protocols",
            "Cybercrime cell workflows: Call Detail Record (CDR) analysis, IP tracing, financial cyber fraud response, and 1930 portal integration",
            "Community policing initiatives: building citizen-police trust, women safety beats, and juvenile rehabilitation",
            "Modern police control rooms, emergency response support systems (ERSS 112), and predictive patrolling",
          ],
          practice: [
            "Analyze simulated mobile tower call detail records to reconstruct suspect movement during an incident",
            "Design a community policing outreach campaign targeting cyber fraud awareness in senior citizens",
          ],
          build: "A State Police Leadership Capstone: cybercrime investigation dossier, range-level crime reduction strategy, and community policing framework.",
          resources: [
            { name: "National Cyber Crime Reporting Portal (MHA)", type: "documentation", difficulty: "advanced", estimatedTime: "4 weeks", url: "https://cybercrime.gov.in/" },
          ],
        },
      ],
    },
  },
};

// ── Public Administration & Policy Pathways ────────────────────────────────
export const PUBLIC_POLICY_ROADMAP: PathRoadmapDefinition = {
  pathSlug: "public-policy-governance-path",
  pathName: "Public Administration & Policy Pathways",
  foundationalPhases: [
    {
      id: "policy-found-1",
      phase: 1,
      title: "Public Policy Foundations, Institutional Governance & Welfare Economics",
      description: "Understand the public policy formulation cycle, institutional checks and balances, welfare economics, and governance accountability metrics.",
      estimatedDuration: "Weeks 1–4",
      skills: ["Policy Cycle & Agenda Setting", "Public Institutional Frameworks", "Microeconomics for Public Policy", "Governance & Accountability Metrics"],
      learn: [
        "The policy cycle: problem identification, agenda setting, policy formulation, decision making, implementation, and evaluation",
        "Separation of powers, independent regulatory authorities (RBI, SEBI, CCI, TRAI), and institutional checks and balances",
        "Welfare economics: public goods, externalities, market failures, and redistributive fiscal policies",
        "Governance indicators: World Bank Worldwide Governance Indicators, transparency metrics, and open government data",
      ],
      practice: [
        "Construct a stakeholder matrix and issue brief for an emerging public health or environmental issue",
        "Model the economic deadweight loss and distributional equity of a subsidy versus direct benefit transfer",
      ],
      build: "A Public Policy Issue Brief: comprehensive problem statement, stakeholder analysis, and policy option comparison matrix.",
      resources: [
        { name: "NITI Aayog Official Research Publications & Reports", type: "documentation", difficulty: "beginner", estimatedTime: "Ongoing", url: "https://www.niti.gov.in/reports-indices" },
        { name: "World Bank Open Knowledge Repository: Governance & Policy", type: "documentation", difficulty: "beginner", estimatedTime: "Ongoing", url: "https://openknowledge.worldbank.org/" },
      ],
    },
    {
      id: "policy-found-2",
      phase: 2,
      title: "Quantitative Policy Evaluation, Legislative Analysis & Policy Briefings",
      description: "Master causal inference methods, administrative data analytics, parliamentary bill scrutiny, and executive policy memorandum writing.",
      estimatedDuration: "Weeks 5–8",
      skills: ["Policy Impact Evaluation (RCTs, DiD)", "Data Analytics for Governance (R/Python)", "Legislative Bill Analysis", "Executive Policy Writing"],
      learn: [
        "Causal inference methodologies: randomized controlled trials, difference-in-differences, regression discontinuity, and propensity score matching",
        "Working with large administrative datasets (NSSO, NFHS, PLFS) using R or Python for demographic analysis",
        "Dissecting parliamentary legislation: clause-by-clause scrutiny, financial memoranda, and delegated legislation",
        "Writing concise, evidence-driven 2-page executive policy memos for senior administrative decision-makers",
      ],
      practice: [
        "Conduct a difference-in-differences analysis on simulated district welfare data to estimate intervention impact",
        "Draft a 2-page legislative policy brief on a pending parliamentary bill highlighting regulatory tradeoffs",
      ],
      build: "An Evidence-Based Policy Briefing: statistical evaluation of a national scheme, legislative commentary, and executive memorandum.",
      resources: [
        { name: "PRS Legislative Research: Parliamentary Bill Tracking", type: "documentation", difficulty: "intermediate", estimatedTime: "Ongoing", url: "https://prsindia.org/" },
        { name: "Ministry of Statistics and Programme Implementation (MoSPI) Data Portal", type: "documentation", difficulty: "intermediate", estimatedTime: "Ongoing", url: "https://www.mospi.gov.in/" },
      ],
    },
  ],
  defaultAdvancedPhases: [
    {
      id: "policy-adv-1",
      phase: 3,
      title: "Strategic Policy Implementation, Regulatory Impact & Public Finance",
      description: "Deepen expertise in public financial management, regulatory impact assessments, and inter-ministerial coordination.",
      estimatedDuration: "Weeks 9–14",
      skills: ["Public Financial Management", "Regulatory Impact Analysis", "Inter-Agency Coordination", "Policy Communications"],
      learn: [
        "Public financial management: Union Budget cycle, fiscal deficit targets, and medium-term expenditure frameworks",
        "Regulatory impact assessments: assessing compliance burdens on industry and small businesses",
        "Inter-agency coordination: resolving conflicting mandates between central ministries and state departments",
        "Communicating policy outcomes to diverse citizen, media, and academic stakeholders",
      ],
      practice: [
        "Deconstruct a national budget allocation tracking capital vs revenue expenditures across 5 fiscal years",
        "Prepare an inter-ministerial consultation memorandum on a cross-cutting digital economy regulation",
      ],
      build: "A Public Finance & Regulatory Assessment: comprehensive budget analysis dossier and regulatory consultation draft.",
      resources: [
        { name: "Union Budget Official Portal (Government of India)", type: "documentation", difficulty: "intermediate", estimatedTime: "Ongoing", url: "https://www.indiabudget.gov.in/" },
      ],
    },
    {
      id: "policy-adv-2",
      phase: 4,
      title: "Governance Leadership, Think Tank Publication & Capstone Presentation",
      description: "Publish peer-reviewed policy whitepapers, present reforms to advisory panels, and evaluate institutional effectiveness.",
      estimatedDuration: "Weeks 15–20",
      skills: ["Think Tank Research Leadership", "Policy Advisory Presentation", "Institutional Reform Design", "Public Value Strategy"],
      learn: [
        "Leading policy research teams: designing multi-year research roadmaps and peer review governance",
        "Defending controversial policy recommendations before parliamentary committees and executive panels",
        "Designing long-term civil service and institutional restructuring frameworks",
        "Evaluating public value creation beyond short-term economic metrics",
      ],
      practice: [
        "Present a simulated 15-minute testimony before a parliamentary standing committee on infrastructure reforms",
        "Author an op-ed explaining a complex macroeconomic policy trade-off to a general audience",
      ],
      build: "A Senior Policy Leadership Dossier: comprehensive reform monograph, parliamentary committee presentation deck, and published op-ed.",
      resources: [
        { name: "Centre for Policy Research (CPR) Policy Research Compendium", type: "documentation", difficulty: "advanced", estimatedTime: "4 weeks", url: "https://cprindia.org/" },
      ],
    },
  ],
  specializationTracks: {
    "policy-research-governance": {
      id: "policy-research-governance",
      name: "Government Policy & Regulatory Impact",
      phases: [
        {
          id: "prg-spec-3",
          phase: 3,
          title: "Think Tank Whitepapers, Stakeholder Consultations & Regulatory Impact Analysis",
          description: "Author comprehensive whitepapers, conduct structured citizen and industry consultations, and evaluate regulatory compliance burdens.",
          estimatedDuration: "Weeks 9–14",
          skills: ["Regulatory Impact Assessment (RIA)", "Stakeholder Consultation Design", "Public Finance & Outcome Budgeting", "Policy Whitepaper Authoring"],
          learn: [
            "Regulatory impact assessment: cost-benefit analysis, compliance burden measurement, and competition impact",
            "Designing inclusive citizen consultations, expert panels, and civil society feedback loops",
            "Medium-term expenditure frameworks, outcome budgeting, and public financial management systems (PFMS)",
            "Structuring institutional whitepapers: methodology, empirical evidence, international case studies, and policy recommendations",
          ],
          practice: [
            "Conduct a regulatory impact evaluation of an urban mobility or data protection regulation",
            "Structure an outcome budget tracking physical targets versus financial allocations for a state department",
          ],
          build: "A Published Policy Whitepaper: 15-page comprehensive research paper featuring regulatory impact analysis, budget models, and policy reforms.",
          resources: [
            { name: "NITI Aayog Development Monitoring & Evaluation Office (DMEO)", type: "documentation", difficulty: "intermediate", estimatedTime: "Ongoing", url: "https://dmeo.gov.in/" },
          ],
        },
        {
          id: "prg-spec-4",
          phase: 4,
          title: "Apex Policy Advisory, Monitoring & Evaluation (M&E) & Governance Dashboards",
          description: "Design real-time administrative KPI dashboards, theories of change, logframe matrices, and rapid-response crisis policy memos.",
          estimatedDuration: "Weeks 15–20",
          skills: ["M&E Framework Design (Logic Models/ToC)", "Governance KPI Dashboards", "Inter-Ministerial Consensus Building", "Crisis Policy Response"],
          learn: [
            "Monitoring & evaluation architectures: theory of change, logframe matrices, output-outcome indicators, and third-party evaluations",
            "Designing real-time administrative dashboards for executive decision support (e.g. Aspirational Districts Programme)",
            "Navigating political economy constraints, coalition building, and inter-ministerial coordination",
            "Designing rapid-response policy interventions during macroeconomic, geopolitical, or health emergencies",
          ],
          practice: [
            "Design a complete Theory of Change and indicator framework for a municipal clean energy transition",
            "Formulate a crisis response memo addressing a sudden agricultural supply-chain disruption",
          ],
          build: "An Apex Governance Capstone: nationwide policy reform proposal, monitoring & evaluation dashboard blueprint, and inter-ministerial cabinet note.",
          resources: [
            { name: "Aspirational Districts Programme Portal (NITI Aayog)", type: "documentation", difficulty: "advanced", estimatedTime: "4 weeks", url: "https://www.niti.gov.in/aspirational-districts-programme" },
          ],
        },
      ],
    },
    "psu-public-enterprises": {
      id: "psu-public-enterprises",
      name: "Public Sector Enterprises & Institutional Management",
      phases: [
        {
          id: "psu-spec-3",
          phase: 3,
          title: "Public Sector Procurement, Statutory Governance & Enterprise Compliance",
          description: "Master Government e-Marketplace (GeM) procurement, CVC transparency guidelines, Maharatna/Navratna board governance, and CAG audit compliance.",
          estimatedDuration: "Weeks 9–14",
          skills: ["Government e-Marketplace (GeM) & CVC Guidelines", "Public Enterprise Corporate Governance", "Statutory Compliance & CAG Audits", "Capital Project Monitoring"],
          learn: [
            "Central Vigilance Commission (CVC) procurement guidelines, transparent tendering, two-bid systems, and GeM procurement",
            "Department of Public Enterprises (DPE) guidelines: Maharatna/Navratna/Miniratna autonomy, board structures, and CSR mandates",
            "Comptroller and Auditor General (CAG) compliance audits, proprietary audits, and PAC accountability",
            "Capital expenditure project management: milestone scheduling, EPC contract oversight, and risk mitigation",
          ],
          practice: [
            "Draft a tender document for an enterprise equipment procurement adhering strictly to CVC and GeM guidelines",
            "Review a simulated CAG audit para and prepare a departmental compliance and remediation reply",
          ],
          build: "A PSU Procurement & Governance Portfolio: comprehensive tender documentation, audit response memorandum, and DPE compliance scorecard.",
          resources: [
            { name: "Government e-Marketplace (GeM) Official Portal & Procurement Manuals", type: "documentation", difficulty: "intermediate", estimatedTime: "Ongoing", url: "https://gem.gov.in/" },
          ],
        },
        {
          id: "psu-spec-4",
          phase: 4,
          title: "Strategic Public Enterprise Operations, Disinvestment & Institutional Leadership",
          description: "Steer PSU financial performance, Ministry Memoranda of Understanding (MoUs), infrastructure execution, and ESG compliance.",
          estimatedDuration: "Weeks 15–20",
          skills: ["Public Sector Financial Management", "Strategic Enterprise Restructuring & MoUs", "Energy & Infrastructure Operations", "Public Value Creation & ESG"],
          learn: [
            "PSU financial statements, working capital management, dividend policies, and debt financing",
            "Performance Memoranda of Understanding (MoU) between PSUs and administrative ministries",
            "Operational excellence in core sectors: energy utilities, transport networks, defense production, and heavy manufacturing",
            "Environmental, Social, and Governance (ESG) standards in public enterprises and long-term public value creation",
          ],
          practice: [
            "Formulate an annual Performance MoU matrix negotiating operational and financial targets for an enterprise",
            "Perform a turnaround analysis on an underperforming public utility recommending modernizing restructuring steps",
          ],
          build: "A Public Enterprise Leadership Capstone: enterprise strategic turnaround blueprint, ministry MoU proposal, and capital investment appraisal.",
          resources: [
            { name: "Department of Public Enterprises (Ministry of Finance)", type: "documentation", difficulty: "advanced", estimatedTime: "4 weeks", url: "https://dpe.gov.in/" },
          ],
        },
      ],
    },
  },
};

