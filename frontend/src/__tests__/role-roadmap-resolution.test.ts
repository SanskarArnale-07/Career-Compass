import { describe, it, expect } from "vitest";
import {
  resolveRoleRoadmap,
  getRoadmapInventoryStats,
  ALL_PATH_ROADMAPS,
} from "../lib/career-roadmap";
import {
  getCareerCatalogueStats,
} from "../lib/career-hierarchy";

describe("Hybrid Roadmap Architecture & Resolver (Phase R3)", () => {
  // ── 1. Canonical Inventory Integrity ─────────────────────────────────────
  it("maintains the canonical inventory of 25 Paths, 77 Specializations, 231 Roles", () => {
    const stats = getCareerCatalogueStats();
    expect(stats.totalDomains).toBe(6);
    expect(stats.totalPaths).toBe(25);
    expect(stats.totalSpecializations).toBe(77);
    expect(stats.totalRoles).toBe(231);

    const roadmapStats = getRoadmapInventoryStats();
    expect(roadmapStats.totalPaths).toBe(25);
    expect(roadmapStats.totalSpecTracks).toBe(77);
    expect(roadmapStats.totalRoleOverrides).toBeGreaterThanOrEqual(12);
  });

  // ── 2. Verification of the 12 Mandatory Roles ────────────────────────────

  describe("Role 1: Frontend Developer", () => {
    it("resolves Path Foundation -> Web App Eng Track -> Frontend Capstone", () => {
      const roadmap = resolveRoleRoadmap({
        pathSlug: "software-development",
        specId: "web-app-eng",
        roleId: "frontend-dev",
      });

      expect(roadmap.pathSlug).toBe("software-development");
      expect(roadmap.specId).toBe("web-app-eng");
      expect(roadmap.roleId).toBe("frontend-dev");
      expect(roadmap.granularity).toBe("ROLE");
      expect(roadmap.meta.hasRoleOverride).toBe(true);

      // Verify Path Foundation (Phase 1 & 2)
      expect(roadmap.phases[0].title).toContain("Programming Foundations");
      expect(roadmap.phases[1].title).toContain("Data Structures");

      // Verify Specialization Track
      expect(roadmap.phases[2].title).toContain("Modern Web Architectures");

      // Verify Role Capstone
      const capstone = roadmap.phases[roadmap.phases.length - 1];
      expect(capstone.title).toContain("Frontend Engineering Capstone");
      expect(capstone.skills).toContain("Advanced React / Next.js");

      // Verify NO unrelated content (e.g. Swift or hardware)
      const allText = JSON.stringify(roadmap.phases);
      expect(allText).not.toContain("SwiftUI");
      expect(allText).not.toContain("Microcontroller");
    });
  });

  describe("Role 2: Backend Developer", () => {
    it("resolves Path Foundation -> Web App Eng Track -> Backend Capstone", () => {
      const roadmap = resolveRoleRoadmap({
        pathSlug: "software-development",
        specId: "web-app-eng",
        roleId: "backend-dev",
      });

      expect(roadmap.granularity).toBe("ROLE");
      expect(roadmap.phases[0].title).toContain("Programming Foundations");
      expect(roadmap.phases[1].title).toContain("Data Structures");

      const capstone = roadmap.phases[roadmap.phases.length - 1];
      expect(capstone.title).toContain("Backend Engineering Capstone");
      expect(capstone.skills).toContain("Distributed Microservices");

      const allText = JSON.stringify(roadmap.phases);
      expect(allText).not.toContain("SwiftUI");
      expect(allText).not.toContain("Burp Suite");
    });
  });

  describe("Role 3: iOS Application Engineer", () => {
    it("resolves Path Foundation -> Mobile Platforms Track -> iOS Capstone", () => {
      const roadmap = resolveRoleRoadmap({
        pathSlug: "software-development",
        specId: "mobile-platforms",
        roleId: "ios-dev",
      });

      expect(roadmap.specId).toBe("mobile-platforms");
      expect(roadmap.granularity).toBe("ROLE");
      expect(roadmap.phases[0].title).toContain("Programming Foundations");

      // Mobile Track
      expect(roadmap.phases[2].title).toContain("Mobile Platform Architecture");

      // iOS Capstone
      const capstone = roadmap.phases[roadmap.phases.length - 1];
      expect(capstone.title).toContain("iOS Engineering Capstone");
      expect(capstone.skills).toContain("SwiftUI & Combine");
      expect(capstone.skills).toContain("App Store Connect & TestFlight");

      // Verify NO web backend or unrelated specialization content
      const allText = JSON.stringify(roadmap.phases);
      expect(allText).not.toContain("gRPC and Protocol Buffers");
    });
  });

  describe("Role 4: Cloud Systems Architect", () => {
    it("resolves Cloud Foundation -> Cloud Architecture Track -> Cloud Architect Capstone", () => {
      const roadmap = resolveRoleRoadmap({
        pathSlug: "cloud-infrastructure",
        specId: "cloud-architecture",
        roleId: "cloud-solutions-arch",
      });

      expect(roadmap.pathSlug).toBe("cloud-infrastructure");
      expect(roadmap.specId).toBe("cloud-architecture");
      expect(roadmap.granularity).toBe("ROLE");

      // Foundation (Phases 1 & 2)
      expect(roadmap.phases[0].title).toContain("Linux Systems, Networking & Cloud Primitives");
      expect(roadmap.phases[1].title).toContain("Applied Cloud Architecture");

      // Specialization
      expect(roadmap.phases[2].title).toContain("Enterprise Multi-Cloud Architecture");

      // Capstone
      const capstone = roadmap.phases[roadmap.phases.length - 1];
      expect(capstone.title).toContain("Cloud Architecture Capstone");
      expect(capstone.skills).toContain("Enterprise Cloud Blueprint");
    });
  });

  describe("Role 5: Penetration Tester", () => {
    it("resolves Cyber Foundation -> Offensive Security Track -> Pentest Capstone", () => {
      const roadmap = resolveRoleRoadmap({
        pathSlug: "cybersecurity",
        specId: "offensive-security",
        roleId: "pentester",
      });

      expect(roadmap.pathSlug).toBe("cybersecurity");
      expect(roadmap.specId).toBe("offensive-security");
      expect(roadmap.granularity).toBe("ROLE");

      // Foundation (Phases 1 & 2)
      expect(roadmap.phases[0].title).toContain("Networking Protocols");
      expect(roadmap.phases[1].title).toContain("Applied Security Fundamentals");

      // Offensive track
      expect(roadmap.phases[2].title).toContain("Network Penetration Testing");

      // Capstone
      const capstone = roadmap.phases[roadmap.phases.length - 1];
      expect(capstone.title).toContain("Ethical Hacking Capstone");
      expect(capstone.skills).toContain("PTES Standards");

      // Verify NO forensics or GRC content
      const allText = JSON.stringify(roadmap.phases);
      expect(allText).not.toContain("Forensic Case Investigation");
      expect(allText).not.toContain("ISO 27001");
    });
  });

  describe("Role 6: Digital Forensics Investigator", () => {
    it("resolves Cyber Foundation -> DFIR Track -> Forensics Case Capstone", () => {
      const roadmap = resolveRoleRoadmap({
        pathSlug: "cybersecurity",
        specId: "digital-forensics-dfir",
        roleId: "digital-forensics-investigator",
      });

      expect(roadmap.pathSlug).toBe("cybersecurity");
      expect(roadmap.specId).toBe("digital-forensics-dfir");
      expect(roadmap.granularity).toBe("ROLE");

      // Foundation (Phases 1 & 2)
      expect(roadmap.phases[0].title).toContain("Cyber Defense Core");
      expect(roadmap.phases[1].title).toContain("Applied Security Fundamentals");

      // DFIR Track
      expect(roadmap.phases[2].title).toContain("Digital Forensics, Disk Imaging");

      // Capstone
      const capstone = roadmap.phases[roadmap.phases.length - 1];
      expect(capstone.title).toContain("Digital Forensics Capstone");
      expect(capstone.skills).toContain("Chain of Custody Legal Rigor");

      // Verify NO offensive red team exploits
      const allText = JSON.stringify(roadmap.phases);
      expect(allText).not.toContain("Kerberoasting");
    });
  });

  describe("Role 7: Data Scientist", () => {
    it("resolves AI Foundation -> Data Science Track", () => {
      const roadmap = resolveRoleRoadmap({
        pathSlug: "ai-ml-data-science",
        specId: "data-science",
        roleId: "data-scientist",
      });

      expect(roadmap.pathSlug).toBe("ai-ml-data-science");
      expect(roadmap.specId).toBe("data-science");

      // Foundation
      expect(roadmap.phases[0].title).toContain("Scientific Computing");
      expect(roadmap.phases[1].title).toContain("Core Machine Learning");

      // Track
      expect(roadmap.phases[2].title).toContain("Statistical Inference");

      // Verify no unrelated mobile or graphics content
      const allText = JSON.stringify(roadmap.phases);
      expect(allText).not.toContain("SwiftUI");
    });
  });

  describe("Role 8: Data Analyst", () => {
    it("resolves Data Analytics Foundation -> Business Intelligence Track", () => {
      const roadmap = resolveRoleRoadmap({
        pathSlug: "data-analytics-bi",
        specId: "analytics-bi",
        roleId: "bi-data-analyst",
      });

      expect(roadmap.pathSlug).toBe("data-analytics-bi");
      expect(roadmap.specId).toBe("analytics-bi");

      // Foundation (Phases 1 & 2)
      expect(roadmap.phases[0].title).toContain("Analytical SQL");
      expect(roadmap.phases[1].title).toContain("Python Data Analytics");

      // BI Track
      expect(roadmap.phases[2].title).toContain("Advanced DAX");

      // Role Capstone
      const capstone = roadmap.phases[roadmap.phases.length - 1];
      expect(capstone.title).toContain("Data Analytics Capstone");
    });
  });

  describe("Role 9: Algorithmic Strategies Developer", () => {
    it("resolves Finance Foundation -> Quant FinTech Track -> Algo Trading Capstone", () => {
      const roadmap = resolveRoleRoadmap({
        pathSlug: "finance-investment",
        specId: "quant-fintech",
        roleId: "algo-trader",
      });

      expect(roadmap.pathSlug).toBe("finance-investment");
      expect(roadmap.specId).toBe("quant-fintech");
      expect(roadmap.granularity).toBe("ROLE");

      // Foundation
      expect(roadmap.phases[0].title).toContain("Accounting Principles");
      expect(roadmap.phases[1].title).toContain("Corporate Finance");

      // Quant track
      expect(roadmap.phases[2].title).toContain("Computational Finance");

      // Capstone
      const capstone = roadmap.phases[roadmap.phases.length - 1];
      expect(capstone.title).toContain("Algorithmic Trading Capstone");
      expect(capstone.skills).toContain("Automated Signal Generation");

      // Verify NO unrelated M&A legal content
      const allText = JSON.stringify(roadmap.phases);
      expect(allText).not.toContain("Stock Purchase Agreement");
    });
  });

  describe("Role 10: UX Researcher", () => {
    it("resolves Design Foundation -> UX Product Experience Track -> UX Research Capstone", () => {
      const roadmap = resolveRoleRoadmap({
        pathSlug: "design-creative",
        specId: "ux-product-experience",
        roleId: "ux-researcher",
      });

      expect(roadmap.pathSlug).toBe("design-creative");
      expect(roadmap.specId).toBe("ux-product-experience");
      expect(roadmap.granularity).toBe("ROLE");

      // Foundation
      expect(roadmap.phases[0].title).toContain("Visual Design");
      expect(roadmap.phases[1].title).toContain("Component Architecture");

      // UX Research Track
      expect(roadmap.phases[2].title).toContain("UX Research Methods");

      // Capstone
      const capstone = roadmap.phases[roadmap.phases.length - 1];
      expect(capstone.title).toContain("UX Research Capstone");
      expect(capstone.skills).toContain("Moderated Usability Labs");

      // Verify NO 3D Maya modeling content
      const allText = JSON.stringify(roadmap.phases);
      expect(allText).not.toContain("Houdini");
    });
  });

  describe("Role 11: Clinical Trial Coordinator", () => {
    it("resolves Biomedical Foundation -> Pharma Therapeutics Track -> Clinical Trial Capstone", () => {
      const roadmap = resolveRoleRoadmap({
        pathSlug: "biomedical-pharmaceutical",
        specId: "pharma-therapeutics",
        roleId: "clinical-trials-coord",
      });

      expect(roadmap.pathSlug).toBe("biomedical-pharmaceutical");
      expect(roadmap.specId).toBe("pharma-therapeutics");
      expect(roadmap.granularity).toBe("ROLE");

      // Foundation (Phases 1 & 2)
      expect(roadmap.phases[0].title).toContain("Biomedical Sciences, Physiology");
      expect(roadmap.phases[1].title).toContain("Organic Chemistry Principles");

      // Pharma Track
      expect(roadmap.phases[2].title).toContain("Pharmaceutical Formulation");

      // Capstone
      const capstone = roadmap.phases[roadmap.phases.length - 1];
      expect(capstone.title).toContain("Clinical Trial Capstone");
      expect(capstone.skills).toContain("GCP Audit Readiness");

      // Verify NO circuit bioinstrumentation
      const allText = JSON.stringify(roadmap.phases);
      expect(allText).not.toContain("Instrumentation Amplifiers (ECG");
    });
  });

  describe("Role 12: Corporate Legal Associate", () => {
    it("resolves Law Foundation -> Corporate Law Track -> Corporate Legal Capstone", () => {
      const roadmap = resolveRoleRoadmap({
        pathSlug: "law-policy",
        specId: "corporate-commercial-law",
        roleId: "corporate-associate",
      });

      expect(roadmap.pathSlug).toBe("law-policy");
      expect(roadmap.specId).toBe("corporate-commercial-law");
      expect(roadmap.granularity).toBe("ROLE");

      // Foundation
      expect(roadmap.phases[0].title).toContain("Legal Systems, Jurisprudence");
      expect(roadmap.phases[1].title).toContain("Legal Research");

      // Corporate Track
      expect(roadmap.phases[2].title).toContain("Corporate Governance, Commercial Contracts");

      // Capstone
      const capstone = roadmap.phases[roadmap.phases.length - 1];
      expect(capstone.title).toContain("Corporate Legal Capstone");
      expect(capstone.skills).toContain("Definitive Agreement Drafting");

      // Verify NO courtroom trial cross-examination
      const allText = JSON.stringify(roadmap.phases);
      expect(allText).not.toContain("Trial Advocacy");
    });
  });

  // ── 3. Additional Architectural Validations ──────────────────────────────

  it("infers path and specialization automatically when only roleId is provided", () => {
    const roadmap = resolveRoleRoadmap({
      pathSlug: "",
      roleId: "ios-dev",
    });

    expect(roadmap.pathSlug).toBe("software-development");
    expect(roadmap.specId).toBe("mobile-platforms");
    expect(roadmap.granularity).toBe("ROLE");
    expect(roadmap.phases[roadmap.phases.length - 1].title).toContain("iOS Engineering Capstone");
  });

  it("handles path-only resolution without spec or role gracefully", () => {
    const roadmap = resolveRoleRoadmap({
      pathSlug: "software-development",
    });

    expect(roadmap.pathSlug).toBe("software-development");
    expect(roadmap.granularity).toBe("PATH");
    expect(roadmap.phases.length).toBeGreaterThanOrEqual(2);
    // Should have sequential phase numbering starting at 1
    roadmap.phases.forEach((phase, idx) => {
      expect(phase.phase).toBe(idx + 1);
      expect(phase.id).toBe(`software-development-foundation-phase-${idx + 1}`);
    });
  });

  it("does not bias synthesized roadmaps to specializations[0]", () => {
    // When requesting specialization 2 of cybersecurity (sec-operations)
    const roadmapSecOps = resolveRoleRoadmap({
      pathSlug: "cybersecurity",
      specId: "sec-operations",
    });

    expect(roadmapSecOps.specId).toBe("sec-operations");
    expect(roadmapSecOps.phases[2].title).toContain("Security Information & Event Management");

    // When requesting specialization 1 of cybersecurity (offensive-security)
    const roadmapOffSec = resolveRoleRoadmap({
      pathSlug: "cybersecurity",
      specId: "offensive-security",
    });

    expect(roadmapOffSec.specId).toBe("offensive-security");
    expect(roadmapOffSec.phases[2].title).toContain("Network Penetration Testing");

    // The two roadmaps must be distinct
    expect(roadmapSecOps.phases[2].title).not.toEqual(roadmapOffSec.phases[2].title);
  });

  it("ensures every phase has deterministic, stable IDs without raw array indices", () => {
    const roadmap = resolveRoleRoadmap({
      pathSlug: "robotics-automation",
      specId: "industrial-automation",
      roleId: "plc-programmer",
    });

    for (let i = 0; i < roadmap.phases.length; i++) {
      expect(roadmap.phases[i].phase).toBe(i + 1);
      expect(roadmap.phases[i].id).toBe(`robotics-automation-industrial-automation-phase-${i + 1}`);
    }
  });

  // ── 4. R4.1 Class 9–10 Content Adaptation Verification ───────────────────

  describe("R4.1 Class 9–10 Adaptation: Medicine & Clinical Practice", () => {
    it("provides exploratory preparation and excludes medical school / residency practice", () => {
      const pathRoadmap = resolveRoleRoadmap({
        pathSlug: "medicine-healthcare",
      });

      // Verify Age-Appropriate Exploratory Foundations
      expect(pathRoadmap.phases[0].title).toBe("Human Biology, Anatomy Fundamentals & Medical Exploration");
      expect(pathRoadmap.phases[0].skills).toContain("Human Biology & Anatomy");
      expect(pathRoadmap.phases[0].skills).toContain("Healthcare Career Pathways");

      expect(pathRoadmap.phases[1].title).toBe("First Aid Foundations, Health Science & Preventive Care");
      expect(pathRoadmap.phases[1].skills).toContain("Emergency First Aid & CPR Awareness");
      expect(pathRoadmap.phases[1].skills).toContain("Healthcare Ethics & Empathy");

      // Verify Advanced Phases are Exploratory / Pre-Med
      expect(pathRoadmap.phases[2].title).toBe("Clinical Observation, Health Science Exploration & Diagnostic Reasoning");
      expect(pathRoadmap.phases[3].title).toBe("Biomedical Ethics, Science Fair Inquiry & Pre-Med Pathway Capstone");

      // Verify complete exclusion of medical school & residency practice material
      const allText = JSON.stringify(pathRoadmap.phases);
      expect(allText).not.toContain("Guyton and Hall");
      expect(allText).not.toContain("Robbins & Cotran");
      expect(allText).not.toContain("Clinical Clerkships");
      expect(allText).not.toContain("Residency Preparation");
      expect(allText).not.toContain("USMLE");
      expect(allText).not.toContain("pharmacokinetics (ADME)");
    });

    it("ensures surgical specialization is educational/exploratory without implying medical practice", () => {
      const surgeonRoadmap = resolveRoleRoadmap({
        pathSlug: "medicine-healthcare",
        specId: "surgery-acute",
      });

      expect(surgeonRoadmap.phases[2].title).toContain("Surgical Sciences, Anatomy Fundamentals");
      expect(surgeonRoadmap.phases[3].title).toContain("Emergency First Response, Acute Care Science");

      const allText = JSON.stringify(surgeonRoadmap.phases);
      expect(allText).not.toContain("Advanced Trauma Life Support (ATLS)");
      expect(allText).not.toContain("massive transfusion");
      expect(allText).not.toContain("suturing patterns (simple interrupted");
    });
  });

  describe("R4.1 Class 9–10 Adaptation: Law & Public Policy", () => {
    it("provides accessible legal reasoning, mock trial, and excludes law-school professional tools", () => {
      const lawRoadmap = resolveRoleRoadmap({
        pathSlug: "law-policy",
      });

      // Verify Accessible Civic and Legal Foundations
      expect(lawRoadmap.phases[0].title).toBe("Legal Systems, Jurisprudence & Constitutional Foundations");
      expect(lawRoadmap.phases[0].skills).toContain("Legal Reasoning & Analysis");
      expect(lawRoadmap.phases[0].skills).toContain("Constitutional Law Basics");

      expect(lawRoadmap.phases[1].title).toBe("Introductory Legal Research, Mock Trial & Public Policy");
      expect(lawRoadmap.phases[1].skills).toContain("Open Legal Research (Cornell LII)");
      expect(lawRoadmap.phases[1].skills).toContain("Mock Trial Skills & Procedure");

      expect(lawRoadmap.phases[2].title).toBe("Contracts, Consumer Protection & Legal Dispute Resolution");
      expect(lawRoadmap.phases[3].title).toBe("Public Advocacy, Legislative Drafting & Legal Exploration Capstone");

      // Verify removal of law school proprietary tools and formal memoranda
      const allText = JSON.stringify(lawRoadmap.phases);
      expect(allText).not.toContain("Bluebook");
      expect(allText).not.toContain("Westlaw");
      expect(allText).not.toContain("Lexis");
      expect(allText).not.toContain("formal intra-office legal memorandum");
    });
  });

  describe("R4.1 Class 9–10 Adaptation: Quantitative Finance & FinTech", () => {
    it("replaces graduate stochastic calculus with financial literacy, probability, and simple backtests", () => {
      // 1. Verify Specialization Track Level (Phases 3 & 4)
      const quantSpecRoadmap = resolveRoleRoadmap({
        pathSlug: "finance-investment",
        specId: "quant-fintech",
      });

      expect(quantSpecRoadmap.phases[2].title).toBe("Financial Literacy, Probability & Computational Finance in Python");
      expect(quantSpecRoadmap.phases[2].skills).toContain("Financial Literacy & Mathematics");
      expect(quantSpecRoadmap.phases[2].skills).toContain("Probability & Statistics");
      expect(quantSpecRoadmap.phases[2].skills).toContain("Python for Financial Data");

      expect(quantSpecRoadmap.phases[3].title).toBe("Systematic Trading Concepts, Simple Simulations & Algorithmic Backtesting");
      expect(quantSpecRoadmap.phases[3].skills).toContain("Systematic Strategy Concepts");
      expect(quantSpecRoadmap.phases[3].skills).toContain("Simple Probability Simulations");

      // 2. Verify Role Capstone Level
      const quantRoleRoadmap = resolveRoleRoadmap({
        pathSlug: "finance-investment",
        specId: "quant-fintech",
        roleId: "algo-trader",
      });

      const capstone = quantRoleRoadmap.phases[quantRoleRoadmap.phases.length - 1];
      expect(capstone.title).toBe("Algorithmic Trading Capstone: Automated Strategy Simulator & Risk Dashboard");
      expect(capstone.skills).toContain("Automated Signal Generation");

      // Verify complete exclusion of graduate-level stochastic calculus in early roadmap
      const allText = JSON.stringify(quantRoleRoadmap.phases);
      expect(allText).not.toContain("Stochastic Calculus");
      expect(allText).not.toContain("Itô's lemma");
      expect(allText).not.toContain("martingale");
      expect(allText).not.toContain("GARCH");
    });
  });

  // ── 5. R4.2 Foundation Pacing Verification ───────────────────────────────

  describe("R4.2 Foundation Pacing: 2-Phase Foundations across Synthesized Paths", () => {
    const SYNTHESIZED_PATH_SLUGS = [
      "cybersecurity",
      "cloud-infrastructure",
      "robotics-automation",
      "data-engineering-platforms",
      "data-analytics-bi",
      "iot-connected-systems",
      "game-multimedia-design",
      "biomedical-pharmaceutical",
      "visual-brand-communication",
      "animation-3d-media",
      "supply-chain-operations",
      "public-health-epidemiology",
      "journalism-media-production",
    ];

    it("ensures all 13 synthesized paths have exactly 2 paced foundation phases", () => {
      for (const slug of SYNTHESIZED_PATH_SLUGS) {
        const pathDef = ALL_PATH_ROADMAPS[slug];
        expect(pathDef, `Missing path ${slug}`).toBeDefined();
        expect(
          pathDef.foundationalPhases.length,
          `Path ${slug} should have exactly 2 foundation phases`
        ).toBe(2);

        // Phase 1: Conceptual + Tooling
        expect(pathDef.foundationalPhases[0].phase).toBe(1);
        expect(pathDef.foundationalPhases[0].estimatedDuration).toBe("Weeks 1–4");

        // Phase 2: Applied Fundamentals
        expect(pathDef.foundationalPhases[1].phase).toBe(2);
        expect(pathDef.foundationalPhases[1].estimatedDuration).toBe("Weeks 5–8");
      }
    });

    it("ensures every path in the entire canonical catalog (25 paths) has exactly 2 foundation phases", () => {
      for (const [slug, pathDef] of Object.entries(ALL_PATH_ROADMAPS)) {
        expect(
          pathDef.foundationalPhases.length,
          `Path ${slug} should have exactly 2 foundation phases`
        ).toBe(2);
      }
    });

    it("verifies Cybersecurity foundation pacing (Conceptual -> Applied)", () => {
      const roadmap = resolveRoleRoadmap({
        pathSlug: "cybersecurity",
        specId: "offensive-security",
      });

      expect(roadmap.phases.length).toBe(4);
      // Phase 1: Conceptual + Tooling
      expect(roadmap.phases[0].title).toBe("Networking Protocols, Cyber Defense Core & Operating System Tooling");
      expect(roadmap.phases[0].skills).toContain("TCP/IP & OSI Model");
      expect(roadmap.phases[0].skills).toContain("Wireshark Packet Analysis");
      // Phase 2: Applied Fundamentals
      expect(roadmap.phases[1].title).toBe("Applied Security Fundamentals, Linux Hardening & Defensive Controls");
      expect(roadmap.phases[1].skills).toContain("Linux Security Hardening");
      expect(roadmap.phases[1].skills).toContain("Applied Cryptography (AES / RSA / SHA)");
      // Phase 3 & 4: Specialization Track
      expect(roadmap.phases[2].title).toBe("Network Penetration Testing & Web Application Exploitation");
      expect(roadmap.phases[3].title).toBe("Active Directory Exploitation & Red Team Tradecraft");
    });

    it("verifies Cloud & Infrastructure foundation pacing (Conceptual -> Applied)", () => {
      const roadmap = resolveRoleRoadmap({
        pathSlug: "cloud-infrastructure",
        specId: "cloud-architecture",
      });

      expect(roadmap.phases.length).toBe(4);
      expect(roadmap.phases[0].title).toBe("Linux Systems, Networking & Cloud Primitives");
      expect(roadmap.phases[0].skills).toContain("Linux System Administration");
      expect(roadmap.phases[0].skills).toContain("Bash Shell Scripting");

      expect(roadmap.phases[1].title).toBe("Applied Cloud Architecture, Infrastructure as Code & Container Basics");
      expect(roadmap.phases[1].skills).toContain("Docker Containerization");
      expect(roadmap.phases[1].skills).toContain("Basic Terraform / IaC");

      expect(roadmap.phases[2].title).toContain("Enterprise Multi-Cloud Architecture");
    });

    it("verifies Robotics & Automation foundation pacing (Conceptual -> Applied)", () => {
      const roadmap = resolveRoleRoadmap({
        pathSlug: "robotics-automation",
        specId: "industrial-automation",
      });

      expect(roadmap.phases.length).toBe(4);
      expect(roadmap.phases[0].title).toBe("Robotics Mathematics, Kinematics & Computational Thinking");
      expect(roadmap.phases[0].skills).toContain("Robotics Mathematics & Vectors");
      expect(roadmap.phases[0].skills).toContain("Modern C++ Foundations");

      expect(roadmap.phases[1].title).toBe("Microcontroller Interfacing, Sensors & Actuator Control");
      expect(roadmap.phases[1].skills).toContain("Sensor Interfacing (I2C / SPI / ADC)");
      expect(roadmap.phases[1].skills).toContain("Closed-Loop PID Control");

      expect(roadmap.phases[2].title).toContain("Industrial Control Systems");
    });

    it("verifies Data Engineering & Platforms foundation pacing (Conceptual -> Applied)", () => {
      const roadmap = resolveRoleRoadmap({
        pathSlug: "data-engineering-platforms",
        specId: "data-pipelines-lakehouse",
      });

      expect(roadmap.phases.length).toBe(4);
      expect(roadmap.phases[0].title).toBe("Relational Data Modeling, Advanced SQL & Python Foundations");
      expect(roadmap.phases[0].skills).toContain("Relational Data Modeling");
      expect(roadmap.phases[0].skills).toContain("Advanced SQL & Window Functions");

      expect(roadmap.phases[1].title).toBe("Data Pipelines, ETL Architecture & Storage Engines");
      expect(roadmap.phases[1].skills).toContain("ETL Pipeline Design");
      expect(roadmap.phases[1].skills).toContain("Columnar Storage & Lakehouse Basics");

      expect(roadmap.phases[2].title).toContain("Lakehouse Table Formats");
    });
  });

  // ── Roadmap R4.3 — Learning Resource Quality Validation ──────────────────
  describe("Roadmap R4.3 — Learning Resource Quality Validation", () => {
    const genericPublishers = [
      "wiley.com",
      "mheducation.com",
      "oreilly.com",
      "routledge.com",
      "springer.com",
      "pearson.com",
      "cengage.com",
      "elsevier.com",
      "aspenpublishing.com",
      "cqpress.com",
      "penguinrandomhouse.com",
      "amazon.com",
      "koganpage.com",
    ];

    const barePlatformRoots = [
      "https://coursera.org",
      "https://www.coursera.org",
      "https://edx.org",
      "https://www.edx.org",
      "https://youtube.com",
      "https://www.youtube.com",
      "https://ocw.mit.edu",
    ];

    it("ensures zero insecure HTTP URLs across all 25 paths and resolved roadmaps", () => {
      for (const [pathSlug, pathDef] of Object.entries(ALL_PATH_ROADMAPS)) {
        for (const phase of pathDef.foundationalPhases) {
          for (const res of phase.resources || []) {
            expect(res.url, `Insecure URL in ${pathSlug} foundation: ${res.url}`).toMatch(/^https:\/\//);
          }
        }
        for (const track of Object.values(pathDef.specializationTracks || {})) {
          for (const phase of track.phases) {
            for (const res of phase.resources || []) {
              expect(res.url, `Insecure URL in ${pathSlug}/${track.id}: ${res.url}`).toMatch(/^https:\/\//);
            }
          }
        }
      }
    });

    it("ensures zero generic publisher homepages without specific paths", () => {
      for (const [pathSlug, pathDef] of Object.entries(ALL_PATH_ROADMAPS)) {
        const checkResources = (resList: typeof pathDef.foundationalPhases[0]["resources"], context: string) => {
          for (const res of resList || []) {
            try {
              const parsed = new URL(res.url);
              const hostname = parsed.hostname.toLowerCase();
              const pathname = parsed.pathname.replace(/^\/|\/$/g, "");
              const isGenericPub = genericPublishers.some(
                (gp) => hostname === gp || hostname.endsWith("." + gp)
              );
              if (isGenericPub) {
                expect(
                  pathname.length > 0 && pathname.includes("/"),
                  `Generic publisher root found in ${context}: ${res.name} -> ${res.url}`
                ).toBe(true);
              }
            } catch {
              throw new Error(`Invalid URL in ${context}: ${res.url}`);
            }
          }
        };

        pathDef.foundationalPhases.forEach((p) => checkResources(p.resources, `${pathSlug}/foundational/${p.id}`));
        Object.values(pathDef.specializationTracks || {}).forEach((t) =>
          t.phases.forEach((p) => checkResources(p.resources, `${pathSlug}/${t.id}/${p.id}`))
        );
      }
    });

    it("ensures zero bare platform root URLs (Coursera, YouTube, MIT OCW without path)", () => {
      for (const [pathSlug, pathDef] of Object.entries(ALL_PATH_ROADMAPS)) {
        const checkResources = (resList: typeof pathDef.foundationalPhases[0]["resources"], context: string) => {
          for (const res of resList || []) {
            const trimmed = res.url.replace(/\/$/, "");
            expect(
              barePlatformRoots.includes(trimmed),
              `Bare platform root URL in ${context}: ${res.url}`
            ).toBe(false);
          }
        };

        pathDef.foundationalPhases.forEach((p) => checkResources(p.resources, `${pathSlug}/foundational/${p.id}`));
        Object.values(pathDef.specializationTracks || {}).forEach((t) =>
          t.phases.forEach((p) => checkResources(p.resources, `${pathSlug}/${t.id}/${p.id}`))
        );
      }
    });

    it("validates healthy learning progression structure across resolved paths", () => {
      const sampleRoles = [
        { pathSlug: "software-development", specId: "web-application-engineering", roleId: "frontend-developer" },
        { pathSlug: "cybersecurity", specId: "offensive-security-pentest", roleId: "penetration-tester" },
        { pathSlug: "robotics-automation", specId: "autonomous-systems", roleId: "robotics-software-engineer" },
        { pathSlug: "data-engineering-platforms", specId: "data-pipelines-lakehouse", roleId: "data-engineer" },
        { pathSlug: "medicine-healthcare", specId: "surgery-acute" },
      ];

      for (const target of sampleRoles) {
        const roadmap = resolveRoleRoadmap(target);
        expect(roadmap.phases.length, `Phases count for ${target.pathSlug}`).toBeGreaterThanOrEqual(3);

        for (const phase of roadmap.phases) {
          expect(phase.learn.length, `Empty learn list in ${phase.id}`).toBeGreaterThanOrEqual(1);
          expect(phase.practice.length, `Empty practice list in ${phase.id}`).toBeGreaterThanOrEqual(1);
          expect(phase.build.length, `Empty build project in ${phase.id}`).toBeGreaterThan(10);
          expect(phase.resources.length, `Missing resources in ${phase.id}`).toBeGreaterThanOrEqual(1);

          for (const res of phase.resources) {
            expect(["course", "documentation", "practice", "video", "book"]).toContain(res.type);
            expect(["beginner", "intermediate", "advanced"]).toContain(res.difficulty);
            expect(res.url).toMatch(/^https:\/\//);
          }
        }
      }
    });
  });
});

