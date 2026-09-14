import type { CareerDetail } from "../types";

export const engineering: CareerDetail = {
  slug: "engineering",
  careerName: "Engineering",
  title: "Engineer",
  tagline: "Design, build, and optimize systems — from civil structures and electronics to aerospace and robotics.",
  category: "Engineering & Applied Sciences",
  icon: "Lightbulb",
  primaryTraits: ["AN", "TE", "SC"],
  relatedSlugs: ["software-development", "scientific-research", "ai-ml-data-science"],
  snapshot: [
    { label: "What You Do", value: "Apply physics, math, and material science to design and build real-world systems — bridges, circuits, robots, and more.", icon: "Wrench" },
    { label: "Entry-Level Roles", value: "Junior Engineer, Graduate Trainee, R&D Intern, Design Engineer, Quality Assurance Engineer", icon: "Briefcase" },
    { label: "Industries", value: "Manufacturing, automotive, aerospace, construction, electronics, energy, defense, robotics", icon: "Building2" },
    { label: "Work Environment", value: "Labs, factories, offices, field sites, R&D centers — blend of desk work and hands-on building", icon: "Monitor" },
    { label: "Difficulty to Enter", value: "Moderate-High — requires strong PCM foundation and competitive entrance exams (JEE/BITSAT)", icon: "Signal" },
    { label: "Growth Potential", value: "Strong — engineers are in demand globally. Specializations like robotics and renewable energy are booming.", icon: "TrendingUp" },
  ],
  skills: [
    { id: "math-physics", name: "Mathematics & Physics", category: "Foundation", relevantTraits: ["AN", "SC"], whyItMatters: "Engineering is applied math and physics. Calculus, mechanics, and electromagnetism are your daily tools.", whatToKnow: "Calculus, differential equations, linear algebra, classical mechanics, electromagnetism, thermodynamics.", recommendedLevel: "Comfortable with Class 12 PCM and beyond" },
    { id: "technical-drawing", name: "Technical Drawing & CAD", category: "Tools", relevantTraits: ["TE", "CR"], whyItMatters: "Every engineered product starts as a drawing. CAD tools translate ideas into precise, buildable designs.", whatToKnow: "Engineering drawing conventions, AutoCAD or SolidWorks basics, 3D modeling, dimensioning, tolerancing.", recommendedLevel: "Create detailed 3D models of mechanical parts" },
    { id: "problem-solving-eng", name: "Analytical Problem Solving", category: "Core", relevantTraits: ["AN", "SC"], whyItMatters: "Engineers solve complex, constrained problems every day. Systematic thinking and first-principles reasoning are essential.", whatToKnow: "Free body diagrams, circuit analysis, system modeling, dimensional analysis, optimization basics.", recommendedLevel: "Break down complex problems into solvable sub-problems" },
    { id: "programming-eng", name: "Programming for Engineers", category: "Tools", relevantTraits: ["TE"], whyItMatters: "Modern engineering relies heavily on simulation, automation, and data analysis — all powered by code.", whatToKnow: "Python or MATLAB, numerical methods, simulation, data visualization, basic automation scripts.", recommendedLevel: "Write scripts to solve engineering problems and plot results" },
    { id: "materials-manufacturing", name: "Materials & Manufacturing", category: "Domain", relevantTraits: ["SC", "TE"], whyItMatters: "Understanding how materials behave and how things are made determines whether your designs work in reality.", whatToKnow: "Material properties, stress/strain, manufacturing processes, quality control, prototyping methods.", recommendedLevel: "Select materials for a design based on requirements and constraints" },
  ],
  roadmap: [
    { id: "eng-phase-1", phase: 1, title: "Math & Physics Foundations", description: "Strengthen the mathematical and physics foundations that all engineering builds upon.", estimatedDuration: "4–6 weeks", skills: ["Mathematics & Physics"], learn: ["Advanced calculus", "Trigonometry & vectors", "Newton's laws & mechanics", "Basic electromagnetism", "Thermodynamics intro"], practice: ["Solve 100 JEE-level physics and math problems"], build: "A physics simulation (projectile motion or pendulum) using Python", resources: [
      { name: "Khan Academy — Calculus & Physics", type: "course", difficulty: "beginner", estimatedTime: "6 weeks", url: "https://www.khanacademy.org/math/calculus-1" },
      { name: "MIT OCW — Physics I", type: "course", difficulty: "intermediate", estimatedTime: "Semester", url: "https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/" },
      { name: "3Blue1Brown — Essence of Calculus", type: "video", difficulty: "beginner", estimatedTime: "3 hours", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr" },
    ]},
    { id: "eng-phase-2", phase: 2, title: "CAD, Drawing & Prototyping", description: "Learn to translate ideas into precise technical drawings and 3D models.", estimatedDuration: "3–4 weeks", skills: ["Technical Drawing & CAD"], learn: ["Engineering drawing basics", "AutoCAD or Fusion 360", "3D modeling workflows", "Dimensioning and tolerances", "3D printing basics"], practice: ["Model 5 mechanical components in CAD"], build: "A complete 3D model of a small mechanical assembly", resources: [
      { name: "Autodesk Fusion 360 — Free for Students", type: "course", difficulty: "beginner", estimatedTime: "3 weeks", url: "https://www.autodesk.com/products/fusion-360/students" },
      { name: "NPTEL — Engineering Drawing", type: "course", difficulty: "beginner", estimatedTime: "4 weeks", url: "https://nptel.ac.in/" },
    ]},
    { id: "eng-phase-3", phase: 3, title: "Core Engineering & Programming", description: "Combine analytical problem solving with computational tools.", estimatedDuration: "4–6 weeks", skills: ["Analytical Problem Solving", "Programming for Engineers"], learn: ["Circuit analysis", "System modeling", "Python/MATLAB for engineering", "Numerical methods", "Data analysis for experiments"], practice: ["Solve 50 engineering analysis problems", "Write 5 simulation scripts"], build: "An Arduino/Raspberry Pi project (robot, sensor system, or automation)", resources: [
      { name: "NPTEL — Engineering Mechanics", type: "course", difficulty: "intermediate", estimatedTime: "8 weeks", url: "https://nptel.ac.in/" },
      { name: "Arduino Official Tutorials", type: "documentation", difficulty: "beginner", estimatedTime: "2 weeks", url: "https://www.arduino.cc/en/Tutorial/HomePage" },
    ]},
    { id: "eng-phase-4", phase: 4, title: "Specialization & Career Prep", description: "Choose your engineering branch and prepare for entrance exams and internships.", estimatedDuration: "Ongoing", skills: ["Materials & Manufacturing"], learn: ["Material science basics", "Manufacturing processes", "Quality control", "Chosen specialization depth", "JEE/BITSAT preparation"], practice: ["Complete 10 full-length mock exams", "Visit a factory or lab if possible"], build: "A capstone DIY project demonstrating your chosen specialization", resources: [
      { name: "JEE Main & Advanced — Previous Papers", type: "practice", difficulty: "intermediate", estimatedTime: "Ongoing", url: "https://jeemain.nta.nic.in/" },
      { name: "MIT OCW — Materials Science", type: "course", difficulty: "intermediate", estimatedTime: "Semester", url: "https://ocw.mit.edu/courses/3-091-introduction-to-solid-state-chemistry-fall-2018/" },
    ]},
  ],
  projects: [
    { title: "Arduino Obstacle-Avoiding Robot", difficulty: "beginner", skills: ["Electronics", "Programming", "Mechanics"], description: "Build a small robot that detects and avoids obstacles using ultrasonic sensors and servo motors.", features: ["Ultrasonic distance sensing", "Motor control", "Autonomous navigation", "Battery power", "Simple chassis design"], portfolioValue: "Demonstrates hands-on engineering skills and the ability to integrate hardware and software." },
    { title: "Smart Home Automation System", difficulty: "intermediate", skills: ["IoT", "Electronics", "Programming", "CAD"], description: "Design and build a home automation system using sensors, microcontrollers, and a mobile interface.", features: ["Temperature & light sensors", "Relay-controlled devices", "Mobile app or web dashboard", "Data logging", "3D-printed enclosure"], portfolioValue: "Shows integration of multiple engineering disciplines — electronics, software, and industrial design." },
    { title: "Solar-Powered Water Purifier", difficulty: "advanced", skills: ["Thermodynamics", "Materials", "CAD", "Analysis"], description: "Design a portable solar-powered water purification system with efficiency analysis and prototype.", features: ["Solar thermal collection", "Distillation mechanism", "Efficiency calculations", "Cost analysis", "Full CAD model", "Physical prototype"], portfolioValue: "A meaningful, real-world engineering project that demonstrates problem-solving for social impact." },
  ],
  progression: [
    { title: "Engineering Intern / Trainee", yearsRange: "0–1 year", responsibilities: ["Assist with design and testing", "Learn tools and processes", "Document results", "Shadow senior engineers"], skills: ["Fundamentals", "CAD basics", "Communication"], deltaFromPrevious: "Entry point — learning professional engineering practice." },
    { title: "Junior Engineer", yearsRange: "1–3 years", responsibilities: ["Design components", "Run simulations and tests", "Write technical reports", "Collaborate on projects"], skills: ["CAD proficiency", "Analysis", "Domain knowledge"], deltaFromPrevious: "Begin contributing to real engineering designs." },
    { title: "Engineer", yearsRange: "3–6 years", responsibilities: ["Lead design projects", "Optimize systems", "Mentor juniors", "Cross-team collaboration"], skills: ["Advanced analysis", "Project management", "Specialization depth"], deltaFromPrevious: "Own entire subsystems and make key design decisions." },
    { title: "Senior Engineer / Specialist", yearsRange: "6–10 years", responsibilities: ["Define technical standards", "Lead R&D initiatives", "Solve complex problems", "Guide architecture"], skills: ["Deep expertise", "Leadership", "Innovation", "Strategic thinking"], deltaFromPrevious: "Become the technical authority in your domain." },
    { title: "Principal Engineer / Engineering Manager", yearsRange: "10+ years", responsibilities: ["Set engineering direction", "Manage teams or lead R&D", "Drive innovation strategy", "Stakeholder communication"], skills: ["Org leadership", "Budget management", "Industry vision"], deltaFromPrevious: "Choose the specialist track (Principal) or management track. Both shape the engineering organization." },
  ],
  preparation: [
    { id: "eng-prep-1", category: "Education", task: "Choose Science (PCM) in Class 11", details: "Focus on Physics and Mathematics. These are the foundation of all engineering branches." },
    { id: "eng-prep-2", category: "Exam", task: "Start JEE/entrance exam preparation", details: "Begin systematic preparation early. Join a coaching program or use quality online resources." },
    { id: "eng-prep-3", category: "Projects", task: "Build 2 DIY engineering projects", details: "Arduino projects, model bridges, or simple robots. Document your process with photos and analysis." },
    { id: "eng-prep-4", category: "Skills", task: "Learn CAD and basic programming", details: "Install Fusion 360 (free for students) and learn Python. Both are used in modern engineering." },
    { id: "eng-prep-5", category: "Resume", task: "Create a technical profile", details: "List your projects, competitions (Science Olympiad, robotics), and technical skills." },
    { id: "eng-prep-6", category: "Exposure", task: "Visit engineering labs or factories", details: "Attend college open days, maker fairs, or factory tours to see engineering in practice." },
  ],
};
