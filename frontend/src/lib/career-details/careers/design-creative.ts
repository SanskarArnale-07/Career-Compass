import type { CareerDetail } from "../types";

export const designCreative: CareerDetail = {
  slug: "design-creative",
  careerName: "Design / Creative Arts",
  title: "Designer & Creative Artist",
  tagline: "Create visual and experiential design that shapes how people interact with the world.",
  category: "Design & Arts",
  icon: "Palette",
  primaryTraits: ["CR", "EX"],
  relatedSlugs: ["marketing-media", "software-development", "entrepreneurship"],

  snapshot: [
    { label: "What You Do", value: "Design user interfaces, brand identities, visual content, and creative experiences across digital and physical mediums.", icon: "PenTool" },
    { label: "Entry-Level Roles", value: "Junior UI/UX Designer, Graphic Designer, Visual Design Intern, Motion Graphics Artist", icon: "Briefcase" },
    { label: "Industries", value: "Tech, advertising, media, fashion, architecture, gaming, film, publishing", icon: "Building2" },
    { label: "Work Environment", value: "Creative studios, design agencies, remote teams, open collaborative spaces, flexible schedules", icon: "Monitor" },
    { label: "Difficulty to Enter", value: "Moderate — portfolio quality matters more than formal education. Requires consistent creative practice.", icon: "Signal" },
    { label: "Growth Potential", value: "Strong — UI/UX design is in very high demand. Creative directors command premium compensation.", icon: "TrendingUp" },
  ],

  skills: [
    { id: "design-principles", name: "Design Principles", category: "Foundation", relevantTraits: ["CR"], whyItMatters: "Color theory, typography, layout, and visual hierarchy are the grammar of design. They make the difference between amateur and professional work.", whatToKnow: "Color theory, typography fundamentals, grid systems, visual hierarchy, Gestalt principles, white space.", recommendedLevel: "Apply principles consistently in original designs" },
    { id: "figma", name: "Design Tools (Figma)", category: "Tools", relevantTraits: ["CR", "TE"], whyItMatters: "Figma is the industry-standard tool for UI/UX design. Knowing it is essential for any design role.", whatToKnow: "Components, auto-layout, prototyping, design systems, handoff, plugins, collaboration features.", recommendedLevel: "Design a complete multi-page app prototype" },
    { id: "ux-research", name: "UX Research & Strategy", category: "Core", relevantTraits: ["AN", "SO"], whyItMatters: "Great design is informed by understanding real users. Research ensures you're solving the right problems.", whatToKnow: "User interviews, personas, journey mapping, usability testing, A/B testing, information architecture.", recommendedLevel: "Conduct a user research study and present findings" },
    { id: "ui-design", name: "UI Design & Design Systems", category: "Core", relevantTraits: ["CR", "TE"], whyItMatters: "UI design translates wireframes into polished, pixel-perfect interfaces that users love to interact with.", whatToKnow: "Component design, design tokens, responsive design, accessibility (WCAG), interaction design, micro-animations.", recommendedLevel: "Build a complete design system from scratch" },
    { id: "prototyping", name: "Prototyping & Animation", category: "Advanced", relevantTraits: ["CR", "EX"], whyItMatters: "Prototypes bring designs to life. Motion design adds polish and helps communicate interactions clearly.", whatToKnow: "Interactive prototyping, micro-interactions, motion principles, Framer, After Effects basics, Lottie animations.", recommendedLevel: "Create interactive prototypes with realistic animations" },
    { id: "frontend-basics", name: "Frontend Development Basics", category: "Complementary", relevantTraits: ["TE"], whyItMatters: "Understanding HTML, CSS, and basic JavaScript makes you a more effective designer and improves developer collaboration.", whatToKnow: "HTML semantics, CSS layout (flexbox, grid), responsive design in code, basic JavaScript, browser dev tools.", recommendedLevel: "Build a simple responsive webpage from your own design" },
  ],

  roadmap: [
    { id: "des-phase-1", phase: 1, title: "Design Foundations", description: "Learn the fundamental principles that govern all good design.", estimatedDuration: "2–3 weeks", skills: ["Design Principles"], learn: ["Color theory & palettes", "Typography fundamentals", "Layout & grid systems", "Visual hierarchy", "Gestalt principles"], practice: ["Redesign 5 existing app screens using design principles"], build: "A mood board and style guide for a fictional brand", resources: [
      { name: "Google UX Design Certificate", type: "course", difficulty: "beginner", estimatedTime: "6 months (self-paced)", url: "https://www.coursera.org/professional-certificates/google-ux-design" },
      { name: "Refactoring UI (book)", type: "book", difficulty: "beginner", estimatedTime: "1 week", url: "https://www.refactoringui.com/" },
      { name: "The Futur — Design Fundamentals", type: "video", difficulty: "beginner", estimatedTime: "5 hours", url: "https://www.youtube.com/c/thefutur" },
    ]},
    { id: "des-phase-2", phase: 2, title: "Figma Mastery", description: "Become proficient in Figma — the tool you'll use every day as a designer.", estimatedDuration: "2–3 weeks", skills: ["Design Tools (Figma)"], learn: ["Figma interface & shortcuts", "Components & variants", "Auto-layout & constraints", "Prototyping & interactions", "Design system setup", "Collaboration & handoff"], practice: ["Recreate 3 popular app screens in Figma", "Build a mini component library"], build: "A complete mobile app design with interactive prototype", resources: [
      { name: "Figma Official Tutorial", type: "documentation", difficulty: "beginner", estimatedTime: "1 week", url: "https://help.figma.com/hc/en-us/categories/360002051613" },
      { name: "Figma Academy (YouTube)", type: "video", difficulty: "beginner", estimatedTime: "4 hours", url: "https://www.youtube.com/@figma" },
      { name: "Daily UI Challenge", type: "practice", difficulty: "beginner", estimatedTime: "30 days", url: "https://www.dailyui.co/" },
    ]},
    { id: "des-phase-3", phase: 3, title: "UX Research & UI Design", description: "Learn to design for real users and build polished, accessible interfaces.", estimatedDuration: "4–5 weeks", skills: ["UX Research & Strategy", "UI Design & Design Systems"], learn: ["User research methods", "Persona creation", "Wireframing workflow", "Responsive design patterns", "Accessibility standards", "Design system architecture"], practice: ["Conduct 3 user interviews", "Build a design system in Figma"], build: "A case study: research → wireframes → polished UI → prototype for a real problem", resources: [
      { name: "Don't Make Me Think (book)", type: "book", difficulty: "beginner", estimatedTime: "3 days", url: "https://sensible.com/dont-make-me-think/" },
      { name: "Laws of UX", type: "documentation", difficulty: "beginner", estimatedTime: "2 hours", url: "https://lawsofux.com/" },
      { name: "Figma Design Systems Tutorial", type: "video", difficulty: "intermediate", estimatedTime: "3 hours", url: "https://www.youtube.com/watch?v=Dtd40cHQQlk" },
    ]},
    { id: "des-phase-4", phase: 4, title: "Motion Design & Frontend Basics", description: "Add polish with animation and learn enough code to collaborate with developers.", estimatedDuration: "3–4 weeks", skills: ["Prototyping & Animation", "Frontend Development Basics"], learn: ["Motion design principles", "Micro-interaction design", "HTML & CSS fundamentals", "Responsive layouts in code", "Basic JavaScript"], practice: ["Create 5 animated interactions in Figma/Framer", "Code 3 responsive pages from your designs"], build: "A portfolio website designed in Figma and built in code", resources: [
      { name: "Frontend Mentor", type: "practice", difficulty: "beginner", estimatedTime: "Ongoing", url: "https://www.frontendmentor.io/" },
      { name: "Framer — Interactive Design", type: "documentation", difficulty: "intermediate", estimatedTime: "1 week", url: "https://www.framer.com/learn/" },
      { name: "MDN Web Docs — CSS", type: "documentation", difficulty: "beginner", estimatedTime: "2 weeks", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
    ]},
  ],

  projects: [
    { title: "App Redesign Case Study", difficulty: "beginner", skills: ["Design Principles", "Figma", "UX Research"], description: "Pick an app you use daily, identify UX issues, and redesign it with a full case study documenting your process.", features: ["User research findings", "Current UX audit", "Wireframes", "Polished UI mockups", "Interactive prototype", "Before/after comparison"], portfolioValue: "The #1 portfolio piece for junior designers. Shows process thinking, not just visual skills." },
    { title: "Design System for a Startup", difficulty: "intermediate", skills: ["Design Systems", "Components", "Figma"], description: "Create a complete, reusable design system with components, tokens, and documentation for a fictional startup.", features: ["Color & typography tokens", "30+ component variants", "Light and dark themes", "Responsive breakpoints", "Usage documentation", "Figma component library"], portfolioValue: "Shows systems thinking and attention to scale — exactly what design teams look for in candidates." },
    { title: "End-to-End Product Design", difficulty: "advanced", skills: ["UX Research", "UI Design", "Prototyping", "Frontend"], description: "Design and prototype a complete product from research to high-fidelity interactive prototype, then build the key screens in code.", features: ["Full research documentation", "User flows & wireframes", "High-fidelity UI", "Interactive prototype with animations", "Coded landing page", "Usability test results"], portfolioValue: "A flagship portfolio piece that demonstrates the full design process and technical capability." },
  ],

  progression: [
    { title: "Design Intern", yearsRange: "0–1 year", responsibilities: ["Assist with design tasks", "Create simple graphics and layouts", "Learn design systems", "Participate in design reviews"], skills: ["Figma basics", "Design principles", "Communication"], deltaFromPrevious: "Entry point — learning professional design workflows." },
    { title: "Junior Designer", yearsRange: "1–2 years", responsibilities: ["Design features and screens", "Contribute to design systems", "Conduct user testing", "Present designs to stakeholders"], skills: ["UI design", "Prototyping", "UX fundamentals", "Presentation"], deltaFromPrevious: "Shift from task-based work to owning design for features." },
    { title: "Product Designer", yearsRange: "2–5 years", responsibilities: ["Own design for product areas", "Lead user research", "Collaborate with PMs and engineers", "Mentor junior designers"], skills: ["UX strategy", "Design systems", "Cross-functional collaboration", "Design leadership"], deltaFromPrevious: "Think beyond screens — own the entire user experience for a product." },
    { title: "Senior / Lead Designer", yearsRange: "5–8 years", responsibilities: ["Define design direction", "Build design culture", "Hire and grow design team", "Drive design strategy"], skills: ["Design strategy", "Team leadership", "Design ops", "Stakeholder management"], deltaFromPrevious: "Transition from individual contribution to shaping design culture." },
    { title: "Creative Director / VP Design", yearsRange: "8+ years", responsibilities: ["Set creative vision", "Manage design organization", "Drive brand and product strategy", "Executive communication"], skills: ["Creative leadership", "Brand strategy", "Business acumen", "Executive communication"], deltaFromPrevious: "Shape the creative direction of the entire company." },
  ],

  preparation: [
    { id: "des-prep-1", category: "Portfolio", task: "Build a design portfolio website", details: "Showcase 3–5 projects with detailed case studies. Include your process, not just final mockups." },
    { id: "des-prep-2", category: "Portfolio", task: "Complete 3 design case studies", details: "Each should show: problem → research → wireframes → solution → results. Quality over quantity." },
    { id: "des-prep-3", category: "Practice", task: "Complete the Daily UI challenge (30 days)", details: "Design one UI element per day. Post to Dribbble or Behance for feedback." },
    { id: "des-prep-4", category: "Tools", task: "Master Figma advanced features", details: "Auto-layout, variants, component properties, prototyping with variables. Take the Figma certification." },
    { id: "des-prep-5", category: "Resume", task: "Create a visual resume / portfolio deck", details: "A concise PDF that introduces you, your skills, and links to your best work." },
    { id: "des-prep-6", category: "Networking", task: "Build presence on design communities", details: "Join Dribbble, Behance, and design Discord communities. Share work and give feedback to others." },
    { id: "des-prep-7", category: "Internship", task: "Apply to design internships", details: "Target tech companies, agencies, and startups. Apply with portfolio link and 2–3 case study highlights." },
  ],
};
