import type { CareerDetail } from "../types";
export const medicineHealthcare: CareerDetail = {
  slug: "medicine-healthcare", careerName: "Medicine / Healthcare", title: "Medical & Healthcare Professional", tagline: "Diagnose, treat, and care for patients — from general medicine to surgery and public health.", category: "Healthcare & Life Sciences", icon: "Heart", primaryTraits: ["SC", "SO"], relatedSlugs: ["scientific-research", "psychology-social", "engineering"],
  snapshot: [
    { label: "What You Do", value: "Diagnose illnesses, prescribe treatments, perform procedures, and work to improve patient health outcomes.", icon: "Stethoscope" },
    { label: "Entry-Level Roles", value: "Medical Intern, Resident Doctor, Lab Technician, Nursing Associate, Public Health Associate", icon: "Briefcase" },
    { label: "Industries", value: "Hospitals, clinics, research labs, pharma, biotech, public health, mental health, telemedicine", icon: "Building2" },
    { label: "Work Environment", value: "Hospitals, clinics, operating rooms, labs — high-stakes, emotionally demanding, deeply rewarding", icon: "Monitor" },
    { label: "Difficulty to Enter", value: "Very High — long education path (MBBS + specialization), competitive entrance exams (NEET)", icon: "Signal" },
    { label: "Growth Potential", value: "Very Strong — sustained demand across healthcare systems with clear progression for clinical specialists.", icon: "TrendingUp" },
  ],
  skills: [
    { id: "biology", name: "Biology & Human Anatomy", category: "Foundation", relevantTraits: ["SC"], whyItMatters: "Understanding how the human body works is the foundation of all medical practice.", whatToKnow: "Cell biology, organ systems, anatomy, physiology, genetics, microbiology.", recommendedLevel: "Strong command of Class 12 Biology concepts" },
    { id: "chemistry-med", name: "Chemistry (Organic & Biochemistry)", category: "Foundation", relevantTraits: ["SC", "AN"], whyItMatters: "Drug interactions, metabolic pathways, and diagnostics all require chemistry knowledge.", whatToKnow: "Organic chemistry, biochemistry, pharmacology basics, chemical reactions in the body.", recommendedLevel: "Comfortable with Class 12 Chemistry + organic fundamentals" },
    { id: "clinical-skills", name: "Clinical Reasoning", category: "Core", relevantTraits: ["AN", "SC"], whyItMatters: "Connecting symptoms to diagnoses through logical reasoning is the core skill of a physician.", whatToKnow: "Differential diagnosis, medical history taking, physical examination, evidence-based medicine.", recommendedLevel: "Developed during medical school and residency" },
    { id: "patient-comm", name: "Patient Communication & Empathy", category: "Core", relevantTraits: ["SO"], whyItMatters: "Medicine is about people. Effective communication improves diagnosis, treatment adherence, and outcomes.", whatToKnow: "Active listening, breaking bad news, health literacy, cultural sensitivity, bedside manner.", recommendedLevel: "Communicate complex medical information clearly and compassionately" },
    { id: "research-med", name: "Medical Research & Evidence", category: "Advanced", relevantTraits: ["SC", "AN"], whyItMatters: "Medicine evolves constantly. Reading and conducting research keeps you at the frontier of patient care.", whatToKnow: "Research methodology, clinical trials, biostatistics, PubMed/literature review, evidence grading.", recommendedLevel: "Read and critically evaluate medical research papers" },
  ],
  roadmap: [
    { id: "med-phase-1", phase: 1, title: "Biology & Chemistry Foundations", description: "Build the scientific foundation that medical entrance exams and medical school require.", estimatedDuration: "Ongoing (Class 11-12)", skills: ["Biology & Human Anatomy", "Chemistry (Organic & Biochemistry)"], learn: ["Human anatomy & physiology", "Cell biology & genetics", "Organic chemistry reactions", "Biochemistry fundamentals", "NEET syllabus topics"], practice: ["Solve 500+ NEET-level MCQs", "Complete NCERT Biology thoroughly"], build: "A detailed study notes collection with diagrams for key biological systems", resources: [
      { name: "NCERT Biology (Class 11 & 12)", type: "book", difficulty: "beginner", estimatedTime: "6 months", url: "https://ncert.nic.in/textbook.php" },
      { name: "Khan Academy — Biology", type: "course", difficulty: "beginner", estimatedTime: "Ongoing", url: "https://www.khanacademy.org/science/biology" },
      { name: "NEET Previous Year Papers", type: "practice", difficulty: "intermediate", estimatedTime: "Ongoing", url: "https://neet.nta.nic.in/" },
    ]},
    { id: "med-phase-2", phase: 2, title: "NEET Preparation", description: "Systematic preparation for the medical entrance examination.", estimatedDuration: "12–18 months", skills: ["Biology & Human Anatomy", "Chemistry (Organic & Biochemistry)"], learn: ["Complete NEET syllabus", "Test-taking strategies", "Time management", "Revision techniques"], practice: ["Complete 50+ full-length mock tests", "Maintain an error log"], build: "A comprehensive revision notebook covering all NEET topics", resources: [
      { name: "Allen/Aakash/NEET Coaching Materials", type: "course", difficulty: "intermediate", estimatedTime: "1-2 years", url: "https://www.aakash.ac.in/" },
      { name: "Unacademy NEET", type: "video", difficulty: "intermediate", estimatedTime: "Ongoing", url: "https://unacademy.com/goal/neet-ug/YOTUH" },
    ]},
    { id: "med-phase-3", phase: 3, title: "Clinical Skills & Communication", description: "Develop the interpersonal and clinical reasoning skills needed alongside medical knowledge.", estimatedDuration: "Ongoing", skills: ["Clinical Reasoning", "Patient Communication & Empathy"], learn: ["Medical ethics", "History taking", "Basic first aid", "Health communication", "Volunteering experience"], practice: ["Volunteer at a hospital or health camp", "Shadow a doctor if possible"], build: "A volunteer experience portfolio documenting your healthcare exposure", resources: [
      { name: "Red Cross — First Aid Training", type: "course", difficulty: "beginner", estimatedTime: "1 week", url: "https://www.indianredcross.org/" },
      { name: "Coursera — Medical Terminology", type: "course", difficulty: "beginner", estimatedTime: "4 weeks", url: "https://www.coursera.org/learn/medical-terminology" },
    ]},
  ],
  projects: [
    { title: "Health Awareness Campaign", difficulty: "beginner", skills: ["Communication", "Research", "Organization"], description: "Organize a health awareness session at your school or community on a topic like nutrition, hygiene, or mental health.", features: ["Research-backed content", "Visual presentations", "Interactive Q&A", "Handouts or pamphlets", "Impact documentation"], portfolioValue: "Demonstrates initiative, communication skills, and genuine interest in public health." },
    { title: "Biology Study Guide with Illustrations", difficulty: "intermediate", skills: ["Biology", "Visual Communication", "Research"], description: "Create a comprehensive illustrated study guide for a complex biological system (e.g., cardiovascular, nervous).", features: ["Detailed anatomical diagrams", "Function explanations", "Disease connections", "Quiz questions", "Digital or printed format"], portfolioValue: "Shows deep understanding of biology and the ability to communicate complex information visually." },
    { title: "Community Health Survey & Analysis", difficulty: "advanced", skills: ["Research", "Data Analysis", "Communication"], description: "Design and conduct a health survey in your community, analyze the data, and present findings with recommendations.", features: ["Survey design", "Data collection (100+ respondents)", "Statistical analysis", "Health recommendations", "Presentation to community leaders"], portfolioValue: "Demonstrates research skills, data analysis, and commitment to community health — valued by medical schools." },
  ],
  progression: [
    { title: "Medical Student (MBBS)", yearsRange: "5.5 years", responsibilities: ["Learn medical sciences", "Clinical rotations", "Examinations", "Hospital internship"], skills: ["Anatomy", "Physiology", "Pharmacology", "Clinical skills"], deltaFromPrevious: "Intensive medical education combining theory and clinical practice." },
    { title: "Resident Doctor", yearsRange: "3–5 years post-MBBS", responsibilities: ["Treat patients under supervision", "Specialize in chosen field", "Research", "Emergency care"], skills: ["Clinical expertise", "Decision-making", "Stamina", "Specialization"], deltaFromPrevious: "Transition from learning to practicing medicine with increasing independence." },
    { title: "Specialist / Consultant", yearsRange: "8–12 years total", responsibilities: ["Independent practice", "Complex cases", "Mentor residents", "Publish research"], skills: ["Deep specialization", "Leadership", "Research", "Teaching"], deltaFromPrevious: "Become an expert in your chosen field with full clinical independence." },
    { title: "Senior Consultant / HOD", yearsRange: "15+ years", responsibilities: ["Department leadership", "Policy decisions", "Training programs", "Hospital administration"], skills: ["Administrative leadership", "Strategic planning", "Mentorship", "Innovation"], deltaFromPrevious: "Lead departments and shape healthcare delivery at an institutional level." },
  ],
  preparation: [
    { id: "med-prep-1", category: "Education", task: "Choose Science (PCB) in Class 11", details: "Focus on Biology and Chemistry. Physics is also required for NEET." },
    { id: "med-prep-2", category: "Exam", task: "Start NEET preparation early", details: "Begin with NCERT, then expand to coaching materials. Consistency is key." },
    { id: "med-prep-3", category: "Exposure", task: "Volunteer at a hospital or health camp", details: "Even a few hours of shadowing gives you invaluable perspective on the medical profession." },
    { id: "med-prep-4", category: "Skills", task: "Learn basic first aid and CPR", details: "Take a Red Cross course. This is practical knowledge every aspiring doctor should have." },
    { id: "med-prep-5", category: "Reading", task: "Read popular medical books", details: "Try 'The Emperor of All Maladies', 'When Breath Becomes Air', or 'Being Mortal'." },
  ],
};
