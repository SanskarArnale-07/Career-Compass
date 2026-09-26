/**
 * Canonical Career Hierarchy Registry
 *
 * Single source of truth for the 4-level taxonomy:
 * DOMAIN -> PATH -> SPECIALIZATION -> ROLE
 *
 * Provides 20 structured, realistic career paths across 6 domains,
 * maintaining semantic discipline:
 * - Domain = broad field
 * - Path = discipline/direction
 * - Specialization = sub-field
 * - Role = concrete job title
 */

import type {
  CareerDomain,
  CareerPath,
  CareerSpecialization,
  CareerRole,
  CareerHierarchyMatch,
  CareerCatalogueStats,
} from "./types";

export const CAREER_DOMAINS: CareerDomain[] = [
  // ── 1. Engineering & Technology ───────────────────────────────────
  {
    id: "engineering-technology",
    name: "Engineering & Technology",
    description: "Designing, building, and scaling software architectures, physical hardware, and automated systems.",
    paths: [
      {
        id: "software-development",
        slug: "software-development",
        name: "Software Development",
        title: "Software Development",
        careerName: "Software Development",
        domainId: "engineering-technology",
        domainName: "Engineering & Technology",
        tagline: "Build applications, websites, and digital tools that power everyday life.",
        specializations: [
          {
            id: "web-app-eng",
            name: "Web & Application Engineering",
            description: "Building responsive frontends, server-side APIs, and comprehensive full-stack platforms.",
            roles: [
              { id: "frontend-dev", title: "Frontend Developer", description: "Builds interactive user interfaces, responsive web apps, and design systems.", isEntryLevel: true, aliases: ["Frontend Engineer", "Front End Developer", "UI Developer", "React Developer", "Web Developer"] },
              { id: "backend-dev", title: "Backend Developer", description: "Develops server APIs, database architectures, and core business logic.", isEntryLevel: true, aliases: ["Backend Engineer", "Back End Developer", "API Engineer", "Server Developer"] },
              { id: "fullstack-dev", title: "Full Stack Developer", description: "Connects client-side user experience with scalable server infrastructure.", isEntryLevel: false, aliases: ["Full Stack Engineer", "Fullstack Developer", "Software Engineer"] },
            ],
          },
          {
            id: "systems-cloud",
            name: "Systems & Cloud Architecture",
            description: "Distributed microservices, cloud infrastructure, container orchestration, and reliability.",
            roles: [
              { id: "cloud-architect", title: "Cloud Systems Architect", description: "Architects resilient multi-cloud platforms and scalable infrastructure.", isEntryLevel: false, aliases: ["Cloud Architect", "Cloud Infrastructure Architect"] },
              { id: "devops-engineer", title: "DevOps & Infrastructure Engineer", description: "Automates code deployment, container workflows, and system reliability.", isEntryLevel: true, aliases: ["DevOps Engineer", "Site Reliability Engineer", "SRE", "Platform Engineer"] },
              { id: "distributed-systems-eng", title: "Distributed Systems Engineer", description: "Builds fault-tolerant, high-concurrency networked computing systems.", isEntryLevel: false, aliases: ["Distributed Systems Architect", "Systems Programmer"] },
            ],
          },
          {
            id: "mobile-platforms",
            name: "Mobile & Platforms",
            description: "Native iOS/Android development, cross-platform runtimes, and client-side performance.",
            roles: [
              { id: "ios-dev", title: "iOS Application Engineer", description: "Builds high-performance native iOS applications for iPhone and iPad.", isEntryLevel: true, aliases: ["iOS Developer", "Apple Developer", "Swift Developer", "Mobile Developer"] },
              { id: "android-dev", title: "Android Application Engineer", description: "Creates native Android experiences using modern Kotlin and Jetpack Compose.", isEntryLevel: true, aliases: ["Android Developer", "Kotlin Developer", "Mobile Developer"] },
              { id: "crossplatform-dev", title: "Mobile Systems Specialist", description: "Develops cross-platform client runtimes and universal mobile applications.", isEntryLevel: false, aliases: ["React Native Developer", "Flutter Developer", "Mobile Engineer"] },
            ],
          },
        ],
      },
      {
        id: "cybersecurity",
        slug: "cybersecurity",
        name: "Cybersecurity & Defense",
        title: "Cybersecurity & Defense",
        careerName: "Cybersecurity",
        domainId: "engineering-technology",
        domainName: "Engineering & Technology",
        tagline: "Protect digital infrastructure, critical networks, and enterprise data through defensive operations, offensive testing, and resilient architectures.",
        aliases: ["Cyber", "Cybersecurity", "Infosec", "Information Security", "Cyber Defense", "Network Security"],
        keywords: ["cyber", "security", "infosec", "red team", "blue team", "soc", "siem", "dfir", "grc", "hacking", "pentest", "forensics", "malware"],
        specializations: [
          {
            id: "offensive-security",
            name: "Offensive Security & Red Teaming",
            description: "Adversary emulation, penetration testing, exploit development, and discovering vulnerabilities before threat actors can exploit them.",
            aliases: ["Offensive Security", "Red Team", "Ethical Hacking", "Penetration Testing"],
            keywords: ["red team", "pentest", "offensive", "exploit", "hacker", "ethical hacking", "vulnerability"],
            roles: [
              {
                id: "red-team-operator",
                title: "Red Team Cybersecurity Operator",
                description: "Simulates realistic multi-stage cyber adversary attacks, stealthy lateral network movement, and advanced persistent threat (APT) tactics.",
                isEntryLevel: false,
                aliases: ["Red Team", "Red Teamer", "Adversary Emulation Specialist"],
                keywords: ["red team", "offensive", "apt", "adversary emulation", "exploit", "c2", "lateral movement"],
              },
              {
                id: "pentester",
                title: "Penetration Tester (Ethical Hacker)",
                description: "Systematically assesses enterprise networks, web applications, and physical systems to discover and exploit security weaknesses.",
                isEntryLevel: true,
                aliases: ["Pentester", "Ethical Hacker", "Vulnerability Assessor"],
                keywords: ["pentester", "ethical hacker", "vulnerability", "metasploit", "burp suite", "kali"],
              },
              {
                id: "exploit-researcher",
                title: "Vulnerability Researcher & Exploit Analyst",
                description: "Analyzes compiled binaries, identifies zero-day security vulnerabilities, and engineers proof-of-concept exploits for defensive patching.",
                isEntryLevel: false,
                aliases: ["Vulnerability Researcher", "Exploit Developer"],
                keywords: ["zero day", "reverse engineering", "binaries", "exploit", "cve", "fuzzing"],
              },
            ],
          },
          {
            id: "sec-operations",
            name: "Defensive Security & Blue Teaming (SecOps)",
            description: "Continuous 24/7 security monitoring, threat detection, incident triage, and real-time defense against active cyber attacks.",
            aliases: ["Defensive Security", "Blue Team", "SecOps", "Security Operations", "SOC"],
            keywords: ["blue team", "soc", "siem", "monitoring", "detection", "defensive", "edr"],
            roles: [
              {
                id: "soc-analyst",
                title: "Blue Team & SOC Analyst",
                description: "Monitors enterprise SIEM telemetry 24/7, triages security alerts, and stops unauthorized intrusions across corporate networks.",
                isEntryLevel: true,
                aliases: ["Blue Team", "SOC Analyst", "Security Operations Analyst", "Tier 1 SOC"],
                keywords: ["blue team", "soc", "siem", "edr", "incident triage", "splunk", "sentinel"],
              },
              {
                id: "incident-responder",
                title: "Incident Response Specialist",
                description: "Leads urgent containment, eradication, and post-breach remediation when enterprise systems face active ransomware or network intrusions.",
                isEntryLevel: false,
                aliases: ["Incident Responder", "IR Specialist", "Cyber Emergency Lead"],
                keywords: ["incident response", "ransomware", "containment", "eradication", "forensic triage", "breach"],
              },
              {
                id: "threat-hunter",
                title: "Cyber Threat Hunter & Detection Engineer",
                description: "Proactively scours enterprise endpoints and network logs to root out stealthy adversaries that bypass automated security controls.",
                isEntryLevel: false,
                aliases: ["Threat Hunter", "Detection Engineer", "APT Hunter"],
                keywords: ["threat hunting", "detection engineering", "yara", "sigma", "apt", "mitre att&ck"],
              },
            ],
          },
          {
            id: "cloud-identity-sec",
            name: "Cloud & Application Security (DevSecOps)",
            description: "Securing cloud-native infrastructure, automated CI/CD pipelines, containerized microservices, and web application code.",
            aliases: ["AppSec", "DevSecOps", "Cloud Security", "Application Security"],
            keywords: ["cloud security", "appsec", "devsecops", "sast", "dast", "containers", "kubernetes", "cloud-native"],
            roles: [
              {
                id: "appsec-engineer",
                title: "Application Security Engineer (AppSec)",
                description: "Audits software source code, implements SAST/DAST tooling, and designs secure development lifecycles (SDLC) for modern apps.",
                isEntryLevel: false,
                aliases: ["AppSec Engineer", "Software Security Engineer"],
                keywords: ["appsec", "owasp", "sast", "dast", "secure code", "apis", "code audit"],
              },
              {
                id: "devsecops-engineer",
                title: "DevSecOps Engineer",
                description: "Integrates automated vulnerability scanners, secret detection, and policy-as-code gates directly into cloud delivery pipelines.",
                isEntryLevel: true,
                aliases: ["DevSecOps", "Security Automation Engineer"],
                keywords: ["devsecops", "ci/cd", "pipeline security", "docker", "kubernetes", "policy as code"],
              },
              {
                id: "cloud-sec-engineer",
                title: "Cloud Security Architect",
                description: "Architects enterprise multi-cloud security guardrails, zero-trust network perimeters, and IAM policies across AWS, Azure, and GCP.",
                isEntryLevel: false,
                aliases: ["Cloud Security Architect", "Cloud Security Specialist"],
                keywords: ["cloud security", "aws security", "azure security", "zero trust", "iam", "cloud posture"],
              },
            ],
          },
          {
            id: "digital-forensics-dfir",
            name: "Digital Forensics & Threat Intelligence (DFIR)",
            description: "Uncovering digital evidence, dissecting malware samples, and attributing cyber attacks to global threat actor syndicates.",
            aliases: ["DFIR", "Digital Forensics", "Threat Intelligence", "Malware Analysis"],
            keywords: ["dfir", "forensics", "malware", "reverse engineering", "threat intelligence", "attribution"],
            roles: [
              {
                id: "digital-forensics-investigator",
                title: "Digital Forensics Investigator",
                description: "Extracts volatile forensic artifacts from disks and memory dumps to reconstruct timeline evidence for legal and regulatory proceedings.",
                isEntryLevel: false,
                aliases: ["Forensics Investigator", "DFIR Specialist", "Computer Crime Investigator"],
                keywords: ["forensics", "memory analysis", "chain of custody", "evidence", "disk imaging", "timeline"],
              },
              {
                id: "malware-analyst",
                title: "Malware Analyst & Reverse Engineer",
                description: "Deconstructs weaponized Trojans, ransomware, and rootkits in controlled sandboxes to uncover adversary command-and-control protocols.",
                isEntryLevel: false,
                aliases: ["Malware Analyst", "Reverse Engineer"],
                keywords: ["malware", "reverse engineering", "disassembly", "ida pro", "ghidra", "sandbox", "payload"],
              },
              {
                id: "threat-intel-analyst",
                title: "Cyber Threat Intelligence Analyst",
                description: "Tracks nation-state and cybercriminal groups, maps attack infrastructure, and delivers strategic threat assessments to leadership.",
                isEntryLevel: true,
                aliases: ["Threat Intel Analyst", "CTI Specialist"],
                keywords: ["threat intelligence", "cti", "mitre att&ck", "adversary attribution", "osint", "threat actor"],
              },
            ],
          },
          {
            id: "governance-risk-compliance",
            name: "Governance, Risk, Compliance (GRC) & Security Architecture",
            description: "Aligning IT systems with international security standards, managing third-party vendor risks, and designing enterprise security strategy.",
            aliases: ["GRC", "Security Compliance", "Security Governance", "Risk Management"],
            keywords: ["grc", "compliance", "iso 27001", "soc 2", "nist", "audit", "security architecture"],
            roles: [
              {
                id: "security-grc-analyst",
                title: "Cybersecurity GRC Analyst",
                description: "Translates complex cybersecurity regulations and risk matrices into actionable internal policies and vendor compliance audits.",
                isEntryLevel: true,
                aliases: ["GRC Analyst", "Security Compliance Analyst", "Risk Analyst"],
                keywords: ["grc", "risk management", "iso 27001", "nist", "compliance", "soc 2", "regulatory"],
              },
              {
                id: "security-auditor",
                title: "Information Systems Auditor",
                description: "Conducts formal technological audits to verify that organizational controls meet international compliance and data-privacy standards.",
                isEntryLevel: true,
                aliases: ["Information Security Auditor", "IT Auditor", "CISA"],
                keywords: ["auditor", "audit", "controls", "compliance", "cisa", "security audit"],
              },
              {
                id: "sec-architect",
                title: "Cybersecurity Architect",
                description: "Designs enterprise-wide defensive architecture frameworks, cryptographic standards, and zero-trust identity ecosystems.",
                isEntryLevel: false,
                aliases: ["Enterprise Security Architect", "Security Architect"],
                keywords: ["security architect", "zero trust", "enterprise architecture", "defense in depth", "cryptography"],
              },
            ],
          },
        ],
      },
      {
        id: "cloud-infrastructure",
        slug: "cloud-infrastructure",
        name: "Cloud & Infrastructure Systems",
        title: "Cloud & Infrastructure Systems",
        careerName: "Cloud & Infrastructure Systems",
        domainId: "engineering-technology",
        domainName: "Engineering & Technology",
        tagline: "Architect scalable cloud platforms, automated CI/CD pipelines, and resilient distributed networks.",
        specializations: [
          {
            id: "cloud-architecture",
            name: "Cloud Architecture & Platforms",
            description: "Designing multi-cloud enterprise solutions, container clusters, and scalable serverless compute.",
            roles: [
              { id: "cloud-solutions-arch", title: "Cloud Solutions Architect", description: "Designs secure, scalable multi-cloud infrastructure patterns across AWS, Azure, and GCP.", isEntryLevel: false },
              { id: "platform-engineer", title: "Cloud Platform Engineer", description: "Builds internal developer platforms, Kubernetes clusters, and automated provisioning tools.", isEntryLevel: true },
              { id: "sre-engineer", title: "Site Reliability Engineer", description: "Maintains 99.99% uptime, latency objectives, and automated incident recovery workflows.", isEntryLevel: true },
            ],
          },
          {
            id: "devops-systems",
            name: "DevOps & Systems Automation",
            description: "Automating software deployments, infrastructure-as-code (IaC), and continuous integration pipelines.",
            roles: [
              { id: "devops-automation-eng", title: "DevOps Engineer", description: "Builds automated build, test, and release pipelines connecting software to cloud deployments.", isEntryLevel: true },
              { id: "iac-specialist", title: "Infrastructure-as-Code Specialist", description: "Manages reproducible infrastructure using modern tools like Terraform and Ansible.", isEntryLevel: true },
              { id: "release-engineer", title: "Release & Build Engineer", description: "Coordinates zero-downtime releases, rollback strategies, and software artifact versioning.", isEntryLevel: false },
            ],
          },
          {
            id: "network-distributed",
            name: "Network & Distributed Systems",
            description: "High-throughput networking, software-defined networks (SDN), edge compute, and system administration.",
            roles: [
              { id: "network-systems-eng", title: "Network Infrastructure Engineer", description: "Configures routers, switches, VPNs, and software-defined networks for mission-critical loads.", isEntryLevel: true },
              { id: "linux-sysadmin", title: "Systems Administrator", description: "Monitors, patches, and optimizes enterprise Linux servers and distributed storage clusters.", isEntryLevel: true },
              { id: "edge-compute-spec", title: "Edge Computing Specialist", description: "Deploys low-latency compute and CDN caching networks closest to end users globally.", isEntryLevel: false },
            ],
          },
        ],
      },
      {
        id: "robotics-automation",
        slug: "robotics-automation",
        name: "Robotics & Automation",
        title: "Robotics & Automation",
        careerName: "Robotics & Automation",
        domainId: "engineering-technology",
        domainName: "Engineering & Technology",
        tagline: "Design intelligent machines and automated robotic systems for manufacturing and discovery.",
        specializations: [
          {
            id: "autonomous-mechatronics",
            name: "Autonomous Systems & Mechatronics",
            description: "Integrating sensors, actuators, computer vision, and control algorithms for autonomous robots.",
            roles: [
              { id: "robotics-sw-eng", title: "Robotics Software Engineer", description: "Programs autonomous navigation, obstacle detection, and robot control behaviors.", isEntryLevel: true },
              { id: "mechatronics-eng", title: "Mechatronics Systems Engineer", description: "Integrates mechanical parts, electronic sensors, and computer controllers into functioning robots.", isEntryLevel: true },
              { id: "motion-planning-eng", title: "Motion Planning & Control Specialist", description: "Develops mathematical trajectory algorithms so robotic arms and vehicles move smoothly.", isEntryLevel: false },
            ],
          },
          {
            id: "industrial-automation",
            name: "Industrial & Manufacturing Automation",
            description: "Programmable logic controllers, assembly line robotics, and smart factory optimization.",
            roles: [
              { id: "automation-eng", title: "Industrial Automation Engineer", description: "Automates factory manufacturing lines and optimizes high-throughput production robots.", isEntryLevel: true },
              { id: "plc-programmer", title: "PLC & SCADA Programmer", description: "Writes programmable logic code that coordinates industrial assembly machinery.", isEntryLevel: true },
              { id: "robotics-commissioner", title: "Robotics Commissioning Lead", description: "Oversees physical deployment, testing, and safety certification of robotics installations.", isEntryLevel: false },
            ],
          },
          {
            id: "robotic-perception-ai",
            name: "Robotic Perception, Vision & Manipulation",
            description: "Computer vision for robotic arms, SLAM sensor fusion, tactile gripping, and real-time motion planning.",
            roles: [
              { id: "robot-vision-engineer", title: "Robot Perception & Computer Vision Engineer", description: "Develops 3D point cloud, SLAM, and visual depth models for robotic environment navigation.", isEntryLevel: true },
              { id: "manipulation-engineer", title: "Robotic Manipulation & Grasping Specialist", description: "Designs tactile sensory feedback and inverse kinematics algorithms for automated robot hands.", isEntryLevel: false },
              { id: "hri-specialist", title: "Human-Robot Interaction (HRI) Systems Engineer", description: "Engineers collaborative safety systems, gestures, and intuitive interfaces between operators and cobots.", isEntryLevel: true },
            ],
          },
        ],
      },
      {
        id: "iot-connected-systems",
        slug: "iot-connected-systems",
        name: "IoT & Connected Systems",
        title: "IoT & Connected Systems",
        careerName: "IoT & Connected Systems",
        domainId: "engineering-technology",
        domainName: "Engineering & Technology",
        tagline: "Design smart connected devices, embedded firmware, sensor telemetry, and edge-to-cloud computing platforms.",
        aliases: ["IoT", "Internet of Things", "Connected Devices", "IIoT", "Smart Systems", "Embedded IoT"],
        keywords: ["iot", "internet of things", "embedded", "firmware", "smart devices", "sensors", "edge computing", "microcontroller", "iiot", "smart home"],
        specializations: [
          {
            id: "embedded-iot-firmware",
            name: "Embedded Systems & IoT Firmware",
            description: "Low-level microcontroller firmware, RTOS architectures, sensor drivers, and board-level hardware integration.",
            aliases: ["Embedded Firmware", "Microcontroller Engineering"],
            keywords: ["firmware", "embedded", "c", "c++", "rtos", "microcontroller", "stm32", "esp32"],
            roles: [
              { id: "iot-firmware-engineer", title: "IoT Firmware & Embedded Systems Engineer", description: "Develops low-latency RTOS firmware, driver routines, and hardware abstraction layers for connected devices.", isEntryLevel: true },
              { id: "embedded-hardware-engineer", title: "Microcontroller & Circuit Design Engineer", description: "Designs low-power microcontroller schematics, PCB board layouts, and power management circuits.", isEntryLevel: true },
              { id: "sensor-integration-specialist", title: "Sensor Systems & Telemetry Engineer", description: "Calibrates environmental, biometric, and inertial sensors, streaming high-precision telemetry packets.", isEntryLevel: false },
            ],
          },
          {
            id: "connected-edge-cloud",
            name: "Connected Edge & Cloud Platforms",
            description: "Edge gateway processing, MQTT/CoAP telemetry protocols, distributed device fleets, and wireless IoT networking.",
            aliases: ["Edge Computing", "IoT Cloud Platforms"],
            keywords: ["edge", "mqtt", "coap", "lorawan", "ble", "zigbee", "device fleet", "aws iot"],
            roles: [
              { id: "iot-cloud-architect", title: "IoT Solutions & Cloud Architect", description: "Architects scalable multi-million device fleet ingestion, digital twin platforms, and IoT cloud pipelines.", isEntryLevel: false },
              { id: "edge-computing-engineer", title: "Edge Computing & Gateway Specialist", description: "Deploys on-device machine learning models and local gateway analytics to filter high-velocity telemetry.", isEntryLevel: true },
              { id: "wireless-iot-engineer", title: "Wireless IoT & RF Communications Engineer", description: "Optimizes Bluetooth Low Energy (BLE), LoRaWAN, Cellular IoT, and satellite device communications.", isEntryLevel: false },
            ],
          },
          {
            id: "industrial-iot-smart-systems",
            name: "Industrial IoT (IIoT) & Smart Infrastructure",
            description: "Industry 4.0 smart manufacturing, SCADA connected equipment, smart city grids, and connected device cybersecurity.",
            aliases: ["IIoT", "Industry 4.0", "Smart Infrastructure"],
            keywords: ["iiot", "industry 4.0", "scada", "smart grid", "connected infrastructure", "iot security"],
            roles: [
              { id: "industrial-iot-engineer", title: "Industrial IoT (IIoT) Systems Engineer", description: "Integrates factory floor equipment with cloud dashboards for predictive maintenance and digital twins.", isEntryLevel: true },
              { id: "smart-infrastructure-architect", title: "Smart Infrastructure & Connected Systems Architect", description: "Designs connected building automation, smart water grids, and intelligent traffic management systems.", isEntryLevel: false },
              { id: "iot-security-specialist", title: "Connected Device & IoT Security Specialist", description: "Hardens embedded device firmware against side-channel exploits and secures end-to-end device-to-cloud cryptography.", isEntryLevel: false },
            ],
          },
        ],
      },
      {
        id: "engineering",
        slug: "engineering",
        name: "Core & Systems Engineering",
        title: "Core & Systems Engineering",
        careerName: "Engineering",
        domainId: "engineering-technology",
        domainName: "Engineering & Technology",
        tagline: "Design, build, and optimize physical and electrical systems across industries.",
        specializations: [
          {
            id: "mechanical-robotics",
            name: "Mechanical & Thermal Systems",
            description: "Kinematic design, thermo-fluid mechanics, CAD modeling, and industrial hardware.",
            roles: [
              { id: "mechanical-design-eng", title: "Mechanical Systems Engineer", description: "Designs physical mechanisms, chassis structures, and moving machinery using 3D CAD.", isEntryLevel: true },
              { id: "cad-engineer", title: "CAD & Simulation Specialist", description: "Simulates stress, fluid flow, and material deformation to validate engineering designs.", isEntryLevel: true },
              { id: "thermal-engineer", title: "Thermal Management Engineer", description: "Engineers cooling systems and heat dissipation solutions for electronics and power plants.", isEntryLevel: false },
            ],
          },
          {
            id: "electrical-power-systems",
            name: "Electrical & Power Systems",
            description: "Power grid distribution, renewable energy circuits, high-voltage transformers, and PCB hardware prototyping.",
            roles: [
              { id: "electrical-systems-eng", title: "Electrical Systems Engineer", description: "Designs electrical power distribution, analog/digital circuits, and control systems.", isEntryLevel: true },
              { id: "power-systems-eng", title: "Power Systems & Grid Engineer", description: "Manages renewable energy integration, transformer substations, and high-voltage transmission grids.", isEntryLevel: false },
              { id: "pcb-hardware-eng", title: "Hardware Prototyping Engineer", description: "Designs and solders printed circuit boards (PCBs) for cutting-edge electronics.", isEntryLevel: true },
            ],
          },
          {
            id: "infrastructure-civil",
            name: "Infrastructure & Civil Systems",
            description: "Structural modeling, modern civil networks, and smart city infrastructure.",
            roles: [
              { id: "structural-engineer", title: "Structural Systems Engineer", description: "Calculates structural integrity for bridges, skyscrapers, and sustainable buildings.", isEntryLevel: true },
              { id: "civil-planner", title: "Infrastructure Systems Planner", description: "Plans transportation networks, water distribution grids, and urban infrastructure.", isEntryLevel: false },
              { id: "materials-engineer", title: "Materials Selection Specialist", description: "Tests polymers, alloys, and nanomaterials to discover optimal compounds for manufacturing.", isEntryLevel: true },
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
    description: "Training neural architectures, developing mathematical algorithms, and designing large-scale intelligence engines.",
    paths: [
      {
        id: "ai-ml-data-science",
        slug: "ai-ml-data-science",
        name: "Artificial Intelligence & Data",
        title: "Artificial Intelligence & Data",
        careerName: "Artificial Intelligence & Data",
        domainId: "data-ai",
        domainName: "Data & Artificial Intelligence",
        tagline: "Train machine learning models, neural networks, and large-scale data intelligence systems.",
        specializations: [
          {
            id: "machine-learning",
            name: "Machine Learning",
            description: "Designing neural network architectures, predictive algorithms, and self-learning models.",
            roles: [
              { id: "ml-engineer", title: "Machine Learning Engineer", description: "Builds and trains predictive models and neural network algorithms.", isEntryLevel: true, aliases: ["Machine Learning Engineer", "ML Engineer", "ML Specialist"] },
              { id: "nlp-engineer", title: "NLP Engineer", description: "Specializes in natural language processing, semantic models, and conversational systems.", isEntryLevel: false, aliases: ["NLP Engineer", "Natural Language Processing Engineer", "LLM Specialist"] },
              { id: "cv-engineer", title: "Computer Vision Engineer", description: "Develops visual recognition, object detection, and spatial camera models.", isEntryLevel: true, aliases: ["Computer Vision Engineer", "Vision AI Engineer"] },
            ],
          },
          {
            id: "data-science",
            name: "Data Science",
            description: "Extracting actionable insights from vast datasets, statistical modeling, and predictive intelligence.",
            roles: [
              { id: "data-scientist", title: "Data Scientist", description: "Discovers patterns and builds statistical forecasts to guide business strategy.", isEntryLevel: true, aliases: ["Data Scientist", "Applied Data Scientist", "Data Science Specialist"] },
              { id: "data-analyst", title: "Data Analyst", description: "Analyzes metrics, builds data dashboards, and identifies operational trends.", isEntryLevel: true, aliases: ["Data Analyst", "Data Analytics Specialist"] },
              { id: "bi-analyst", title: "Business Intelligence Analyst", description: "Creates executive reporting dashboards and data models to inform executive decisions.", isEntryLevel: false, aliases: ["Business Intelligence Analyst", "BI Analyst", "BI Developer"] },
            ],
          },
          {
            id: "ai-engineering",
            name: "AI Engineering",
            description: "Foundation models, computer vision, natural language processing, and autonomous agent systems.",
            roles: [
              { id: "ai-engineer", title: "AI Engineer", description: "Integrates machine learning models into scalable production applications and APIs.", isEntryLevel: true, aliases: ["AI Engineer", "Artificial Intelligence Engineer", "AI Developer"] },
              { id: "generative-ai-engineer", title: "Generative AI Engineer", description: "Develops LLM applications, prompt pipelines, RAG systems, and generative agents.", isEntryLevel: false, aliases: ["Generative AI Engineer", "GenAI Engineer", "LLM Engineer", "Prompt Engineer"] },
              { id: "ai-solutions-engineer", title: "AI Solutions Engineer", description: "Designs customized AI architectures and enterprise integrations for business domains.", isEntryLevel: true, aliases: ["AI Solutions Engineer", "AI Architect", "Enterprise AI Specialist"] },
            ],
          },
        ],
      },
      {
        id: "data-engineering-platforms",
        slug: "data-engineering-platforms",
        name: "Data Engineering & Platforms",
        title: "Data Engineering & Platforms",
        careerName: "Data Engineering",
        domainId: "data-ai",
        domainName: "Data & Artificial Intelligence",
        tagline: "Construct the distributed pipelines, data warehouses, and streaming infrastructure modern tech relies on.",
        specializations: [
          {
            id: "data-pipelines-lakehouse",
            name: "Data Pipelines & Lakehouse Architecture",
            description: "Building ETL/ELT data pipelines, distributed storage, and lakehouse storage platforms.",
            roles: [
              { id: "data-engineer", title: "Data Infrastructure Engineer", description: "Builds automated data pipelines that extract, transform, and load massive data streams.", isEntryLevel: true, aliases: ["Data Engineer", "Data Infrastructure Engineer", "Big Data Engineer", "ETL Engineer"] },
              { id: "warehouse-architect", title: "Data Warehouse Architect", description: "Designs structured database schemas and high-performance analytical data warehouses.", isEntryLevel: false },
              { id: "etl-developer", title: "Pipeline Optimization Engineer", description: "Optimizes query efficiency and eliminates bottlenecks in large data processing jobs.", isEntryLevel: true },
            ],
          },
          {
            id: "streaming-realtime",
            name: "Real-Time Streaming Systems",
            description: "Low-latency message queues, event streaming architectures, and distributed state engines.",
            roles: [
              { id: "stream-architect", title: "Real-Time Stream Architect", description: "Architects low-latency message streaming platforms like Kafka for immediate data processing.", isEntryLevel: false },
              { id: "event-broker-eng", title: "Event Systems Engineer", description: "Maintains real-time event brokers handling millions of events per second.", isEntryLevel: true },
              { id: "event-stream-dev", title: "Real-Time Event Stream Developer", description: "Builds low-latency event-driven microservices consuming Apache Flink and Kafka streams.", isEntryLevel: true },
            ],
          },
          {
            id: "data-platform-reliability",
            name: "Data Platform Reliability & Governance",
            description: "Data observability, schema validation, privacy compliance, and automated pipeline quality monitoring.",
            roles: [
              { id: "data-reliability-eng", title: "Data Reliability Engineer (DRE)", description: "Monitors pipeline uptime, data drift, SLA budgets, and automated failure recovery across warehouses.", isEntryLevel: true },
              { id: "data-governance-spec", title: "Data Governance & Privacy Specialist", description: "Enforces data lineage, classification standards, and compliance across analytics stores.", isEntryLevel: false },
              { id: "dataops-engineer", title: "DataOps Automation Engineer", description: "Automates CI/CD testing, schema migrations, and versioning for data transformation models.", isEntryLevel: true },
            ],
          },
        ],
      },
      {
        id: "data-analytics-bi",
        slug: "data-analytics-bi",
        name: "Data Analytics & Insights",
        title: "Data Analytics & Insights",
        careerName: "Data Analytics",
        domainId: "data-ai",
        domainName: "Data & Artificial Intelligence",
        tagline: "Turn complex raw datasets into actionable insights, dashboards, and decision frameworks.",
        specializations: [
          {
            id: "analytics-bi",
            name: "Business Intelligence & Analytics",
            description: "SQL modeling, cohort analyses, executive metric dashboards, and KPI tracking.",
            roles: [
              { id: "bi-data-analyst", title: "Data Analyst", description: "Queries databases and creates executive dashboards to guide business decision-making.", isEntryLevel: true, aliases: ["Data Analyst", "BI Analyst", "Business Data Analyst"] },
              { id: "bi-developer", title: "Business Intelligence Developer", description: "Builds automated reporting systems, metric dashboards, and KPI tracking tools.", isEntryLevel: true },
              { id: "analytics-manager", title: "Decision Intelligence Lead", description: "Translates statistical business intelligence into high-level strategic company roadmaps.", isEntryLevel: false },
            ],
          },
          {
            id: "quantitative-modeling",
            name: "Quantitative & Statistical Modeling",
            description: "Experimental A/B test design, causal inference, and multivariate statistical forecasting.",
            roles: [
              { id: "quantitative-analyst", title: "Quantitative Insights Analyst", description: "Applies statistical formulas and regression models to uncover market and user behavior.", isEntryLevel: true },
              { id: "statistical-modeler", title: "Statistical Modeler", description: "Designs probabilistic models and randomized A/B experiments to evaluate key outcomes.", isEntryLevel: false },
              { id: "ab-testing-analyst", title: "Experimentation & A/B Testing Analyst", description: "Formulates randomized control trials and multi-armed bandit experiments to validate product features.", isEntryLevel: true },
            ],
          },
          {
            id: "product-growth-analytics",
            name: "Product Analytics & Growth Insights",
            description: "Funnel conversion analysis, customer lifetime value modeling, user cohort retention, and growth metrics.",
            roles: [
              { id: "product-analyst", title: "Product Data Analyst", description: "Analyzes user onboarding funnels, feature adoption rates, and behavioral engagement metrics.", isEntryLevel: true },
              { id: "growth-analyst", title: "Growth & Retention Analyst", description: "Models customer acquisition costs, churn prediction, and revenue expansion strategies.", isEntryLevel: true },
              { id: "analytics-translator", title: "Analytics Translator & Strategy Lead", description: "Bridges executive business goals with statistical findings to drive data-informed company decisions.", isEntryLevel: false },
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
    description: "Crafting intuitive digital interfaces, compelling visual narratives, interactive media, and spatial brand systems.",
    paths: [
      {
        id: "design-creative",
        slug: "design-creative",
        name: "UI/UX & Product Design",
        title: "UI/UX & Product Design",
        careerName: "Design & Creative Arts",
        domainId: "design-creative",
        domainName: "Design & Creative Arts",
        tagline: "Shape how humans interact with digital products, apps, and computer systems.",
        specializations: [
          {
            id: "ux-product-experience",
            name: "Product Experience & UX Research",
            description: "User journey mapping, cognitive ergonomics, usability testing, and wireframe prototyping.",
            roles: [
              { id: "product-designer", title: "Product Designer", description: "Designs end-to-end user workflows, interactive prototypes, and intuitive digital app experiences.", isEntryLevel: true },
              { id: "ux-researcher", title: "User Experience Researcher", description: "Interviews users and conducts usability studies to uncover human needs and friction points.", isEntryLevel: true },
              { id: "interaction-specialist", title: "Interaction Designer", description: "Crafts fluid micro-interactions, responsive touch gestures, and state transitions.", isEntryLevel: false },
            ],
          },
          {
            id: "design-systems-ui",
            name: "Design Systems & UI Engineering",
            description: "Design tokens, scalable typography hierarchies, and accessible design system components.",
            roles: [
              { id: "design-technologist", title: "Design Technologist", description: "Bridges design and code by building production-ready component libraries.", isEntryLevel: false },
              { id: "ui-designer", title: "User Interface Designer", description: "Creates polished visual layouts, iconography, typography scales, and high-fidelity screens.", isEntryLevel: true },
              { id: "design-system-spec", title: "Design System Specialist", description: "Maintains unified design tokens and reusable component libraries across large teams.", isEntryLevel: true },
            ],
          },
          {
            id: "accessibility-service-design",
            name: "Accessibility, Usability & Service Design",
            description: "Inclusive digital design, WCAG compliance standards, screen-reader optimization, and end-to-end service blueprints.",
            roles: [
              { id: "accessibility-specialist", title: "Digital Accessibility & Inclusive Designer", description: "Audits interfaces against WCAG accessibility standards ensuring barrier-free digital access.", isEntryLevel: true },
              { id: "information-architect", title: "Information Architect & Content Strategist", description: "Organizes complex navigation taxonomies, metadata structures, and user mental models.", isEntryLevel: false },
              { id: "service-designer", title: "Service Systems Designer", description: "Maps multi-stakeholder service ecosystems, digital-to-physical touchpoints, and customer journeys.", isEntryLevel: false },
            ],
          },
        ],
      },
      {
        id: "visual-brand-communication",
        slug: "visual-brand-communication",
        name: "Visual Brand & Spatial Design",
        title: "Visual Brand & Spatial Design",
        careerName: "Brand & Visual Design",
        domainId: "design-creative",
        domainName: "Design & Creative Arts",
        tagline: "Create distinctive visual identities, spatial brand experiences, and graphic storytelling.",
        specializations: [
          {
            id: "brand-identity",
            name: "Brand Identity & Graphic Strategy",
            description: "Visual positioning, typography palettes, brand guidelines, and distinctive graphic assets.",
            roles: [
              { id: "brand-designer", title: "Brand Identity Designer", description: "Develops memorable logos, color palettes, and comprehensive visual style guides.", isEntryLevel: true },
              { id: "creative-director", title: "Creative Art Director", description: "Steers the artistic vision and storytelling across multi-channel creative campaigns.", isEntryLevel: false },
              { id: "graphic-designer", title: "Graphic Designer", description: "Designs striking visual posters, digital marketing assets, and publication media.", isEntryLevel: true },
            ],
          },
          {
            id: "motion-spatial",
            name: "Motion Graphics & Spatial Experience",
            description: "Kinetic typography, micro-interactions, 3D exhibit branding, and environmental graphics.",
            roles: [
              { id: "motion-designer", title: "Motion Graphics Designer", description: "Animates vector graphics, kinetic typography, and promotional video sequences.", isEntryLevel: true },
              { id: "3d-visualizer", title: "3D Spatial Visualizer", description: "Creates photorealistic 3D models and spatial environments for architecture and exhibits.", isEntryLevel: true },
              { id: "creative-technologist", title: "Creative Technologist", description: "Prototypes interactive installations, sensory experiential brand designs, and creative coding.", isEntryLevel: false },
            ],
          },
          {
            id: "packaging-editorial-design",
            name: "Packaging, Print & Publication Design",
            description: "Structural packaging engineering, sustainable material typography, and editorial publication layouts.",
            roles: [
              { id: "packaging-designer", title: "Packaging & Materials Designer", description: "Engineers 3D structural boxes, dielines, and sustainable printed consumer goods packaging.", isEntryLevel: true },
              { id: "editorial-designer", title: "Publication & Editorial Designer", description: "Typesets books, magazines, and long-form visual journalism for print and digital editions.", isEntryLevel: true },
              { id: "environmental-graphic-designer", title: "Environmental Graphic & Signage Designer", description: "Designs wayfinding signage, architectural typography, and branded spatial environments.", isEntryLevel: false },
            ],
          },
        ],
      },
      {
        id: "game-multimedia-design",
        slug: "game-multimedia-design",
        name: "Game & Interactive Media",
        title: "Game & Interactive Media",
        careerName: "Game Design",
        domainId: "design-creative",
        domainName: "Design & Creative Arts",
        tagline: "Build immersive virtual worlds, game mechanics, and interactive narrative systems.",
        specializations: [
          {
            id: "gameplay-mechanics",
            name: "Gameplay & Level Design",
            description: "Player progression curves, gameplay loop balancing, and immersive level layouts.",
            roles: [
              { id: "game-designer", title: "Gameplay Systems Designer", description: "Invents core game rules, progression systems, combat mechanics, and player balance.", isEntryLevel: true },
              { id: "level-designer", title: "Level & World Designer", description: "Builds engaging game environments, spatial puzzle layouts, and environmental storytelling.", isEntryLevel: true },
              { id: "game-writer", title: "Narrative & Quest Designer", description: "Writes immersive character dialogues, world lore, and branching story questlines.", isEntryLevel: false },
            ],
          },
          {
            id: "technical-art-xr",
            name: "Technical Art & XR Environments",
            description: "Shader authoring, character rigging, and real-time virtual reality experiences.",
            roles: [
              { id: "tech-artist", title: "Technical Artist", description: "Optimizes 3D shaders, character rigs, and graphical rendering pipelines in game engines.", isEntryLevel: true },
              { id: "xr-developer", title: "XR / Virtual Reality Creator", description: "Develops interactive virtual and augmented reality experiences with spatial controls.", isEntryLevel: false },
              { id: "game-vfx-artist", title: "Real-Time Game VFX Artist", description: "Authors particle simulations, magic effects, and dynamic graphical combat shaders in game engines.", isEntryLevel: true },
            ],
          },
          {
            id: "game-systems-audio",
            name: "Game Systems, Economy & Audio Design",
            description: "In-game virtual economies, algorithmic combat balancing, dynamic sound effects, and adaptive music scoring.",
            roles: [
              { id: "game-economy-designer", title: "Game Economy & Systems Designer", description: "Balances virtual currencies, player progression math, reward drop tables, and in-game markets.", isEntryLevel: false },
              { id: "game-audio-designer", title: "Interactive Game Audio Designer", description: "Implements adaptive audio engines, dynamic spatial sound effects, and interactive orchestral cues.", isEntryLevel: true },
              { id: "gameplay-programmer", title: "Gameplay Systems Programmer", description: "Codes core game loop mechanics, camera controllers, and responsive character physics in C++.", isEntryLevel: true },
            ],
          },
        ],
      },
      {
        id: "animation-3d-media",
        slug: "animation-3d-media",
        name: "Animation & 3D Media",
        title: "Animation & 3D Media",
        careerName: "Animation & 3D Media",
        domainId: "design-creative",
        domainName: "Design & Creative Arts",
        tagline: "Bring imaginative worlds and characters to life through 3D CGI, character animation, and visual effects.",
        specializations: [
          {
            id: "3d-modeling-cgi",
            name: "3D Modeling & CGI",
            description: "Hard surface modeling, digital sculpting, texture painting, and high-fidelity rendering.",
            roles: [
              { id: "3d-modeler", title: "3D Environment Artist", description: "Models photorealistic 3D assets, architectural sets, and virtual production environments.", isEntryLevel: true },
              { id: "character-sculptor", title: "Digital Character Sculptor", description: "Sculpts high-resolution organic creatures and character anatomy in ZBrush.", isEntryLevel: true },
              { id: "shading-lighting-artist", title: "Lighting & LookDev Artist", description: "Designs physically-based lighting, volumetric atmosphere, and material shaders.", isEntryLevel: false },
            ],
          },
          {
            id: "character-animation",
            name: "Character Animation & Rigging",
            description: "Keyframe character performance, skeletal rigging, motion capture editing, and facial animation.",
            roles: [
              { id: "character-animator", title: "3D Character Animator", description: "Animates expressive character locomotion, weight shifts, and emotional performance.", isEntryLevel: true },
              { id: "rigging-td", title: "Technical Rigging Artist", description: "Builds skeleton deformation rigs, muscle dynamics, and procedural skinning controllers.", isEntryLevel: false },
              { id: "mocap-specialist", title: "Motion Capture Technician", description: "Calibrates optical tracking suits and cleans live motion capture actor data.", isEntryLevel: true },
            ],
          },
          {
            id: "vfx-motion-graphics",
            name: "Visual Effects & Dynamic Motion",
            description: "Particle simulations, fluid dynamics, motion graphics typography, and compositing.",
            roles: [
              { id: "vfx-compositor", title: "VFX Compositor", description: "Blends live-action footage with CGI elements, color grades, and digital pyrotechnics.", isEntryLevel: true },
              { id: "fx-simulation-artist", title: "Houdini Simulation Specialist", description: "Simulates complex smoke, fire, water, and rigid body destruction dynamics.", isEntryLevel: false },
              { id: "motion-director", title: "Motion Design Lead", description: "Directs title sequences, brand kinetic animations, and broadcast motion design.", isEntryLevel: false },
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
        title: "Finance & FinTech",
        careerName: "Finance",
        domainId: "business-finance-management",
        domainName: "Business, Finance & Management",
        tagline: "Manage capital, analyze financial markets, and design technological financial platforms.",
        specializations: [
          {
            id: "investment-banking",
            name: "Investment Banking & Capital Markets",
            description: "Mergers & acquisitions, debt/equity capital structuring, valuation, and market underwriting.",
            roles: [
              { id: "ib-analyst", title: "Investment Banking Analyst", description: "Builds financial valuation models for corporate mergers, acquisitions, and public offerings.", isEntryLevel: true },
              { id: "equity-research-assoc", title: "Equity Research Associate", description: "Analyzes public company balance sheets and publishes market investment recommendations.", isEntryLevel: true },
              { id: "portfolio-manager", title: "Asset Portfolio Strategist", description: "Allocates institutional investment capital across global asset classes to maximize returns.", isEntryLevel: false },
            ],
          },
          {
            id: "corporate-finance-fpa",
            name: "Corporate Finance & FP&A",
            description: "Financial forecasting, strategic capital allocation, unit economics, and cash runway planning.",
            roles: [
              { id: "fpa-analyst", title: "Corporate Financial Analyst", description: "Forecasts company budgets, tracks monthly revenue, and conducts profitability analysis.", isEntryLevel: true },
              { id: "finance-manager", title: "Strategic FP&A Lead", description: "Guides multi-year financial planning, capital expenditures, and corporate runway.", isEntryLevel: false },
              { id: "treasury-analyst", title: "Treasury Operations Analyst", description: "Manages cash reserves, liquidity forecasting, foreign exchange risk, and bank relations.", isEntryLevel: true },
            ],
          },
          {
            id: "quant-fintech",
            name: "Quantitative Finance & FinTech",
            description: "Algorithmic execution models, payment rails, cryptographic ledgers, and quantitative risk.",
            roles: [
              { id: "quant-analyst", title: "Quantitative Risk Analyst", description: "Models portfolio risk and pricing derivatives using advanced statistical equations.", isEntryLevel: true },
              { id: "fintech-pm", title: "FinTech Product Specialist", description: "Designs consumer payment apps, lending platforms, and digital banking experiences.", isEntryLevel: false },
              { id: "algo-trader", title: "Algorithmic Strategies Developer", description: "Codes automated high-frequency trading algorithms that execute in sub-millisecond speeds.", isEntryLevel: false },
            ],
          },
        ],
      },
      {
        id: "management-product",
        slug: "management-product",
        name: "Product & Operations Management",
        title: "Product & Operations Management",
        careerName: "Product Management",
        domainId: "business-finance-management",
        domainName: "Business, Finance & Management",
        tagline: "Define product vision, align cross-functional teams, and steer complex operational roadmaps.",
        specializations: [
          {
            id: "product-mgmt",
            name: "Digital Product Management",
            description: "User requirements definition, roadmap prioritization, and feature telemetry experiments.",
            roles: [
              { id: "assoc-pm", title: "Associate Product Manager", description: "Gathers customer requirements, writes user stories, and helps launch product features.", isEntryLevel: true },
              { id: "technical-pm", title: "Technical Product Manager", description: "Partners closely with software engineers to prioritize complex technical architecture roadmaps.", isEntryLevel: false },
              { id: "growth-pm", title: "Growth & Retention Product Lead", description: "Runs growth experiments, onboarding funnel optimizations, and user retention loops.", isEntryLevel: false },
            ],
          },
          {
            id: "agile-program-delivery",
            name: "Program & Agile Delivery",
            description: "Large-scale organizational cadence, dependency management, and technical delivery.",
            roles: [
              { id: "scrum-master", title: "Agile Delivery Coach", description: "Facilitates sprint planning, removes team blockers, and coaches agile development practices.", isEntryLevel: true },
              { id: "tpm", title: "Technical Program Manager", description: "Coordinates cross-functional dependencies across multiple engineering teams to hit launch dates.", isEntryLevel: false },
              { id: "ops-manager", title: "Operations Delivery Specialist", description: "Streamlines internal business workflows and monitors day-to-day organizational execution.", isEntryLevel: true },
            ],
          },
          {
            id: "strategy-consulting",
            name: "Strategy & Management Consulting",
            description: "Business model diagnostics, digital transformation frameworks, and operating restructuring.",
            roles: [
              { id: "management-consultant", title: "Strategy Management Consultant", description: "Advises executive leaders on market entry, operational efficiency, and digital transformation.", isEntryLevel: true },
              { id: "bizops-associate", title: "Business Operations Analyst", description: "Solves cross-departmental bottlenecks and establishes core performance benchmarks.", isEntryLevel: true },
              { id: "transformation-dir", title: "Strategic Transformation Lead", description: "Directs large-scale corporate restructurings and organization-wide technology rollouts.", isEntryLevel: false },
            ],
          },
        ],
      },
      {
        id: "entrepreneurship",
        slug: "entrepreneurship",
        name: "Entrepreneurship & Ventures",
        title: "Entrepreneurship & Ventures",
        careerName: "Entrepreneurship",
        domainId: "business-finance-management",
        domainName: "Business, Finance & Management",
        tagline: "Build new companies, validate novel market solutions, and scale ventures from zero to one.",
        specializations: [
          {
            id: "startup-venture-building",
            name: "Startup Venture Building",
            description: "Customer discovery, minimum viable product cycles, fundraising decks, and founding leadership.",
            roles: [
              { id: "startup-founder", title: "Early-Stage Startup Founder", description: "Launches a new business from scratch, validating product-market fit and recruiting the first team.", isEntryLevel: true },
              { id: "venture-builder", title: "Venture Studio Entrepreneur", description: "Systematically incubates and tests multiple startup concepts inside a venture foundry.", isEntryLevel: false },
              { id: "chief-of-staff", title: "Founder's Associate / Chief of Staff", description: "Executes mission-critical special projects directly alongside the founding CEO.", isEntryLevel: true },
            ],
          },
          {
            id: "commercial-gtm",
            name: "Commercial Go-To-Market & Growth",
            description: "Early customer acquisition, B2B sales development, partnership development, and viral expansion.",
            roles: [
              { id: "bdr-lead", title: "Business Development Representative", description: "Initiates conversations with potential enterprise clients and generates qualified leads.", isEntryLevel: true },
              { id: "gtm-strategist", title: "Go-To-Market Strategist", description: "Designs the overall launch strategy, pricing model, and customer sales playbook for new products.", isEntryLevel: false },
              { id: "rev-ops", title: "Revenue Operations Specialist", description: "Aligns sales, marketing, and customer success tools to maximize pipeline conversion.", isEntryLevel: true },
            ],
          },
          {
            id: "venture-capital",
            name: "Venture Capital & Innovation",
            description: "Startup deal sourcing, investment thesis authoring, portfolio acceleration, and cap table due diligence.",
            roles: [
              { id: "vc-analyst", title: "Venture Capital Analyst", description: "Screens pitch decks, conducts market research, and meets founders seeking early investment.", isEntryLevel: true },
              { id: "portfolio-lead", title: "Venture Platform & Community Lead", description: "Connects portfolio startups with hiring networks, advisors, and follow-on investors.", isEntryLevel: true },
              { id: "innovation-partner", title: "Corporate Innovation Partner", description: "Sources emerging technology startups for strategic corporate partnerships and acquisitions.", isEntryLevel: false },
            ],
          },
        ],
      },
      {
        id: "supply-chain-operations",
        slug: "supply-chain-operations",
        name: "Supply Chain & Global Operations",
        title: "Supply Chain & Global Operations",
        careerName: "Supply Chain & Global Operations",
        domainId: "business-finance-management",
        domainName: "Business, Finance & Management",
        tagline: "Coordinate global logistics, streamline industrial operations, and engineer resilient supply chains.",
        specializations: [
          {
            id: "global-logistics-trade",
            name: "Logistics & Global Supply Chain",
            description: "International freight logistics, customs navigation, multi-modal transport, and distribution hubs.",
            roles: [
              { id: "supply-chain-analyst", title: "Global Supply Chain Analyst", description: "Monitors international shipping lead times, customs data, and freight cost efficiencies.", isEntryLevel: true },
              { id: "logistics-coordinator", title: "International Logistics Coordinator", description: "Schedules container freight, warehouse handoffs, and multi-modal transit corridors.", isEntryLevel: true },
              { id: "distribution-architect", title: "Distribution Network Architect", description: "Designs warehouse hub networks and fulfillment routes to maximize delivery speed.", isEntryLevel: false },
            ],
          },
          {
            id: "operations-strategy",
            name: "Operations Strategy & Lean Process",
            description: "Six Sigma process refinement, manufacturing throughput, vendor procurement, and cost control.",
            roles: [
              { id: "operations-consultant", title: "Operations Strategy Consultant", description: "Audits business operational bottlenecks and designs high-efficiency process workflows.", isEntryLevel: false },
              { id: "lean-process-lead", title: "Lean Process Optimization Lead", description: "Implements Kaizen methodologies and reduces operational waste in enterprise production.", isEntryLevel: true },
              { id: "procurement-specialist", title: "Strategic Sourcing Specialist", description: "Negotiates supplier contracts and vets ethical procurement sources globally.", isEntryLevel: true },
            ],
          },
          {
            id: "demand-forecasting",
            name: "Demand Forecasting & Inventory Systems",
            description: "Statistical inventory balancing, predictive demand planning, and automated replenishment.",
            roles: [
              { id: "inventory-analyst", title: "Inventory Optimization Analyst", description: "Applies mathematical economic order quantity models to prevent stockouts and overstock.", isEntryLevel: true },
              { id: "demand-planner", title: "Demand Planning Specialist", description: "Forecasts seasonal product demand cycles using historical sales data and market trends.", isEntryLevel: true },
              { id: "fulfillment-systems-eng", title: "Fulfillment Systems Engineer", description: "Configures automated warehouse management software (WMS) and robotics routing.", isEntryLevel: false },
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
        title: "Medicine & Clinical Practice",
        careerName: "Medicine / Healthcare",
        domainId: "healthcare-sciences",
        domainName: "Healthcare & Life Sciences",
        tagline: "Deliver clinical patient care, medical treatments, and preventive health solutions.",
        specializations: [
          {
            id: "clinical-internal-med",
            name: "Clinical Practice & Internal Medicine",
            description: "Primary patient diagnosis, pathology analysis, systemic disease management, and treatment plans.",
            roles: [
              { id: "clinical-physician", title: "General Physician / Medical Officer", description: "Diagnoses illnesses, prescribes treatments, and provides comprehensive care to patients.", isEntryLevel: true },
              { id: "internist", title: "Internal Medicine Specialist", description: "Manages complex multi-system chronic diseases and provides advanced inpatient care.", isEntryLevel: false },
              { id: "medical-resident", title: "Clinical Care Resident", description: "Undergoes hands-on hospital rotations treating patients under senior physician guidance.", isEntryLevel: true },
            ],
          },
          {
            id: "surgery-acute",
            name: "Surgery & Acute Care",
            description: "Operative techniques, trauma triage protocols, intensive care monitoring, and surgical instrumentation.",
            roles: [
              { id: "general-surgeon", title: "General Surgery Specialist", description: "Performs operative procedures to repair injuries, remove tumors, and treat acute diseases.", isEntryLevel: false },
              { id: "trauma-physician", title: "Emergency & Trauma Physician", description: "Delivers urgent life-saving medical stabilization in hospital emergency rooms.", isEntryLevel: true },
              { id: "anesthesiologist", title: "Anesthesiology Associate", description: "Monitors patient vitals and administers sedation during surgical operations.", isEntryLevel: false },
            ],
          },
          {
            id: "diagnostics-public-health",
            name: "Diagnostics & Public Health",
            description: "Epidemiological surveillance, preventive community health programs, and laboratory screening.",
            roles: [
              { id: "pathologist", title: "Diagnostic Pathologist", description: "Examines tissue biopsies and lab samples under microscopes to detect diseases and cancers.", isEntryLevel: false },
              { id: "public-health-specialist", title: "Public Health Officer", description: "Designs community health initiatives and disease prevention campaigns for populations.", isEntryLevel: true },
              { id: "radiology-fellow", title: "Diagnostic Radiology Fellow", description: "Interprets MRI, CT, and X-ray medical imaging scans to detect internal injuries and disorders.", isEntryLevel: true },
            ],
          },
        ],
      },
      {
        id: "scientific-research",
        slug: "scientific-research",
        name: "Scientific Research & Discovery",
        title: "Scientific Research & Discovery",
        careerName: "Scientific Research",
        domainId: "healthcare-sciences",
        domainName: "Healthcare & Life Sciences",
        tagline: "Conduct rigorous laboratory experiments, test novel hypotheses, and pioneer scientific breakthroughs.",
        specializations: [
          {
            id: "physical-applied-sciences",
            name: "Physical & Applied Sciences",
            description: "Condensed matter physics, material synthesis, optics, thermodynamics, and laboratory instrumentation.",
            roles: [
              { id: "materials-scientist", title: "Materials Scientist", description: "Synthesizes novel chemical compounds and nanomaterials with customized thermal and electrical properties.", isEntryLevel: true },
              { id: "applied-physicist", title: "Experimental Physicist", description: "Conducts precision laser, quantum, and particle experiments to explore physical laws.", isEntryLevel: false },
              { id: "lab-analyst", title: "Laboratory Research Associate", description: "Operates analytical spectrometers and documents scientific experimental data with precision.", isEntryLevel: true },
            ],
          },
          {
            id: "biotech-chem-sciences",
            name: "Biotechnology & Molecular Sciences",
            description: "Cellular biology, genetic sequence editing, macromolecular biochemistry, and enzymatic analysis.",
            roles: [
              { id: "molecular-biologist", title: "Molecular Biologist", description: "Studies DNA, RNA, and protein pathways to understand disease mechanisms and cell biology.", isEntryLevel: true },
              { id: "biochemist", title: "Biochemical Research Scientist", description: "Investigates chemical processes and enzymatic reactions in living organisms.", isEntryLevel: false },
              { id: "genomics-analyst", title: "Genomics Research Specialist", description: "Analyzes high-throughput genomic sequencing datasets to map hereditary genetic variations.", isEntryLevel: true },
            ],
          },
          {
            id: "computational-science",
            name: "Computational & Interdisciplinary Science",
            description: "In-silico molecular modeling, climate forecasting systems, and quantitative biostatistics.",
            roles: [
              { id: "computational-chemist", title: "Computational Chemist", description: "Runs supercomputer simulations of molecular docking and chemical bond reactions.", isEntryLevel: false },
              { id: "bioinformatics-spec", title: "Bioinformatics Specialist", description: "Develops software algorithms to parse biological databases and protein structures.", isEntryLevel: true },
              { id: "climate-modeler", title: "Environmental Computational Scientist", description: "Builds mathematical simulations predicting atmospheric changes and ecosystem impacts.", isEntryLevel: true },
            ],
          },
        ],
      },
      {
        id: "biomedical-pharmaceutical",
        slug: "biomedical-pharmaceutical",
        name: "Biomedical & Pharmaceutical",
        title: "Biomedical & Pharmaceutical",
        careerName: "Biomedical Engineering",
        domainId: "healthcare-sciences",
        domainName: "Healthcare & Life Sciences",
        tagline: "Engineer medical hardware, biosensors, and innovative therapeutic drugs.",
        specializations: [
          {
            id: "medical-devices",
            name: "Medical Devices & Bioinstrumentation",
            description: "Designing patient monitoring devices, imaging apparatus, prosthetic systems, and biocompatible materials.",
            roles: [
              { id: "biomedical-eng", title: "Biomedical Systems Engineer", description: "Engineers medical diagnostic hardware, robotic surgical tools, and artificial organs.", isEntryLevel: true },
              { id: "medical-device-designer", title: "Medical Device Prototyper", description: "Designs ergonomic physical enclosures and mechanical components for healthcare devices.", isEntryLevel: true },
              { id: "regulatory-device-spec", title: "Clinical Device Compliance Specialist", description: "Ensures medical instruments meet strict international health safety and FDA standards.", isEntryLevel: false },
            ],
          },
          {
            id: "pharma-therapeutics",
            name: "Pharmaceutical Formulation & Clinical Trials",
            description: "Drug compound synthesis, clinical protocol design, and pharmacovigilance safety auditing.",
            roles: [
              { id: "clinical-trials-coord", title: "Clinical Trial Coordinator", description: "Manages patient recruitment, protocol adherence, and safety data in new drug trials.", isEntryLevel: true },
              { id: "formulation-scientist", title: "Pharmaceutical Formulation Scientist", description: "Develops chemical stability and delivery methods (tablets, injectables) for medications.", isEntryLevel: false },
              { id: "pharma-analyst", title: "Drug Safety & Regulatory Analyst", description: "Monitors drug efficacy reports and files regulatory documentation with health authorities.", isEntryLevel: true },
            ],
          },
          {
            id: "bioinformatics-precision-therapeutics",
            name: "Bioinformatics & Precision Therapeutics",
            description: "Computational drug discovery, genomic target screening, cellular gene therapy, and personalized oncology.",
            roles: [
              { id: "genomics-data-scientist", title: "Genomics & Computational Biologist", description: "Processes next-generation sequencing data to identify therapeutic disease targets.", isEntryLevel: true },
              { id: "biomarker-discovery-scientist", title: "Precision Oncology & Biomarker Scientist", description: "Identifies molecular biomarkers for personalized patient targeted therapy responses.", isEntryLevel: false },
              { id: "bioprocess-engineer", title: "Bioprocess & Cell Therapy Engineer", description: "Scales bioreactor fermentation and mRNA cell therapy manufacturing pipelines.", isEntryLevel: true },
            ],
          },
        ],
      },
      {
        id: "public-health-epidemiology",
        slug: "public-health-epidemiology",
        name: "Public Health & Global Epidemiology",
        title: "Public Health & Global Epidemiology",
        careerName: "Public Health & Global Epidemiology",
        domainId: "healthcare-sciences",
        domainName: "Healthcare & Life Sciences",
        tagline: "Track disease outbreaks, shape health policy, and design preventative healthcare systems for communities.",
        specializations: [
          {
            id: "epidemiology-surveillance",
            name: "Epidemiological Surveillance & Disease Modeling",
            description: "Tracking infection vectors, statistical contagion modeling, and field outbreak containment.",
            roles: [
              { id: "field-epidemiologist", title: "Field Epidemiologist", description: "Investigates localized disease clusters, traces transmission trees, and collects sample data.", isEntryLevel: true },
              { id: "outbreak-modeler", title: "Infectious Disease Modeler", description: "Develops mathematical SIR differential equation simulations predicting epidemic spread.", isEntryLevel: false },
              { id: "surveillance-officer", title: "Disease Surveillance Specialist", description: "Analyzes hospital health registries to spot anomalous spike patterns in pathogen incidence.", isEntryLevel: true },
            ],
          },
          {
            id: "health-policy-systems",
            name: "Global Health Policy & Healthcare Systems",
            description: "Designing vaccination campaigns, public health legislation, and equitable hospital access.",
            roles: [
              { id: "health-policy-analyst", title: "Health Policy Analyst", description: "Evaluates the economic and health outcomes of government healthcare funding bills.", isEntryLevel: true },
              { id: "health-systems-strategist", title: "Healthcare Systems Strategist", description: "Reforms regional hospital networks to expand preventive checkup access in underserved areas.", isEntryLevel: false },
              { id: "community-health-dir", title: "Community Health Program Director", description: "Leads local health outreach, prenatal nutrition programs, and preventative screening drives.", isEntryLevel: false },
            ],
          },
          {
            id: "environmental-occupational-health",
            name: "Environmental & Occupational Health",
            description: "Mitigating toxic water/air contaminants, workplace safety standards, and climate resilience.",
            roles: [
              { id: "environmental-health-spec", title: "Environmental Health Specialist", description: "Inspects industrial emissions, drinking water purity, and municipal sanitation infrastructure.", isEntryLevel: true },
              { id: "industrial-hygienist", title: "Occupational Safety Specialist", description: "Ensures workplace chemical exposure, acoustic levels, and ergonomics protect worker wellbeing.", isEntryLevel: true },
              { id: "toxicology-risk-analyst", title: "Environmental Risk Assessor", description: "Models the human biological health risks associated with persistent chemical pollutants.", isEntryLevel: false },
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
    description: "Shaping public narratives, driving social initiatives, advocating legal policy, and communicating ideas.",
    paths: [
      {
        id: "marketing-media",
        slug: "marketing-media",
        name: "Marketing & Digital Media",
        title: "Marketing & Digital Media",
        careerName: "Marketing & Communications",
        domainId: "media-communications-social",
        domainName: "Media, Communications & Social Impact",
        tagline: "Build brand narratives, optimize viral growth channels, and communicate stories globally.",
        specializations: [
          {
            id: "growth-marketing",
            name: "Growth & Performance Marketing",
            description: "Channel experimentation, customer acquisition cost optimization, SEO analysis, and analytics.",
            roles: [
              { id: "growth-marketer", title: "Growth Marketing Specialist", description: "Runs A/B experiments across digital channels to rapidly acquire and activate new users.", isEntryLevel: true },
              { id: "performance-media-buyer", title: "Paid Media Strategist", description: "Manages advertising budgets on search engines and social platforms to optimize ROI.", isEntryLevel: true },
              { id: "retention-lead", title: "Lifecycle Marketing Lead", description: "Designs personalized email, push notification, and onboarding journeys to keep users engaged.", isEntryLevel: false },
            ],
          },
          {
            id: "brand-comms-pr",
            name: "Brand Communications & Public Relations",
            description: "Media outreach, narrative crafting, crisis communications, and corporate positioning.",
            roles: [
              { id: "pr-specialist", title: "Public Relations Specialist", description: "Secures positive press coverage and manages relationships with journalists and media outlets.", isEntryLevel: true },
              { id: "brand-strategist", title: "Brand Positioning Strategist", description: "Defines brand voice, value propositions, and long-term reputational positioning.", isEntryLevel: false },
              { id: "comms-manager", title: "Corporate Communications Lead", description: "Crafts internal and external company communications and handles crisis messaging.", isEntryLevel: false },
            ],
          },
          {
            id: "content-production",
            name: "Digital Media & Content Production",
            description: "Multi-platform storytelling, editorial calendars, creative direction, and multimedia video.",
            roles: [
              { id: "content-creator", title: "Multimedia Content Producer", description: "Shoots and edits engaging short-form video, podcasts, and digital storytelling pieces.", isEntryLevel: true },
              { id: "copywriter", title: "Strategic Copywriter", description: "Writes persuasive advertising copy, landing page headlines, and educational articles.", isEntryLevel: true },
              { id: "editorial-lead", title: "Head of Content & Editorial", description: "Directs publication content strategies and maintains high editorial quality across platforms.", isEntryLevel: false },
            ],
          },
        ],
      },
      {
        id: "law-policy",
        slug: "law-policy",
        name: "Law & Public Policy",
        title: "Law & Public Policy",
        careerName: "Law",
        domainId: "media-communications-social",
        domainName: "Media, Communications & Social Impact",
        tagline: "Uphold justice, draft legislative policies, and advise organizations on regulatory compliance.",
        aliases: ["Law", "Legal", "Public Policy", "Legal Studies", "Jurisprudence", "Lawyer", "Attorney", "Legal Counsel"],
        specializations: [
          {
            id: "corporate-commercial-law",
            name: "Corporate & Commercial Law",
            description: "Contractual negotiation, securities law, intellectual property protection, and corporate governance.",
            aliases: ["Corporate Law", "Business Law", "Commercial Law"],
            roles: [
              { id: "corporate-associate", title: "Corporate Legal Associate", description: "Drafts contracts, reviews commercial leases, and assists on financing transactions.", isEntryLevel: true, aliases: ["Corporate Lawyer", "Corporate Counsel", "Commercial Lawyer", "Business Attorney"] },
              { id: "ip-lawyer", title: "Intellectual Property Specialist", description: "Files patent and trademark applications to legally protect innovations and creative work.", isEntryLevel: false, aliases: ["IP Lawyer", "Intellectual Property Lawyer", "Patent Lawyer", "Patent Attorney", "Trademark Lawyer"] },
              { id: "compliance-officer", title: "Regulatory Compliance Counsel", description: "Ensures business operations adhere to privacy, financial, and employment regulations.", isEntryLevel: true, aliases: ["Compliance Lawyer", "Legal Counsel", "Regulatory Attorney"] },
            ],
          },
          {
            id: "public-policy-governance",
            name: "Public Policy & Legislative Governance",
            description: "Socioeconomic policy research, regulatory impact assessments, and legislative drafting.",
            aliases: ["Public Policy", "Government & Law", "Policy Making"],
            roles: [
              { id: "policy-analyst", title: "Public Policy Research Fellow", description: "Researches public policy issues, analyzes economic data, and drafts policy recommendations.", isEntryLevel: true, aliases: ["Policy Analyst", "Policy Researcher", "Legal Policy Specialist"] },
              { id: "government-affairs", title: "Government Affairs Strategist", description: "Advocates for industry perspectives with legislative committees and regulatory bodies.", isEntryLevel: false, aliases: ["Government Relations Lead", "Lobbyist", "Policy Strategist"] },
              { id: "legislative-aide", title: "Legislative Analyst", description: "Briefs elected lawmakers on bill language, constituent concerns, and voting agendas.", isEntryLevel: true, aliases: ["Legislative Aide", "Legislative Counsel", "Law Drafting Specialist"] },
            ],
          },
          {
            id: "litigation-dispute",
            name: "Litigation & Dispute Resolution",
            description: "Courtroom advocacy, discovery review, legal memorandum writing, and dispute mediation.",
            aliases: ["Litigation", "Criminal Law", "Dispute Resolution", "Trial Advocacy"],
            roles: [
              { id: "litigation-associate", title: "Litigation Associate", description: "Drafts courtroom pleadings, conducts discovery review, and assists senior trial counsel.", isEntryLevel: true, aliases: ["Litigation Lawyer", "Trial Lawyer", "Litigator", "Courtroom Advocate"] },
              { id: "arbitrator", title: "Commercial Dispute Arbitrator", description: "Presides over out-of-court dispute resolutions and renders binding commercial settlements.", isEntryLevel: false, aliases: ["Dispute Arbitrator", "Legal Mediator", "ADR Specialist"] },
              { id: "public-defender", title: "Public Defense & Rights Advocate", description: "Represents individuals in criminal court proceedings ensuring constitutional rights are upheld.", isEntryLevel: true, aliases: ["Public Defender", "Defense Attorney", "Criminal Defense Lawyer"] },
            ],
          },
        ],
      },
      {
        id: "psychology-social",
        slug: "psychology-social",
        name: "Psychology & Behavioral Sciences",
        title: "Psychology & Behavioral Sciences",
        careerName: "Psychology & Social Work",
        domainId: "media-communications-social",
        domainName: "Media, Communications & Social Impact",
        tagline: "Understand human cognition, support mental wellbeing, and build programs that uplift communities.",
        specializations: [
          {
            id: "clinical-counseling",
            name: "Counseling & Mental Health",
            description: "Cognitive behavioral therapies, psychological assessment, adolescent support, and crisis counseling.",
            roles: [
              { id: "counselor", title: "Mental Health Counselor", description: "Provides one-on-one therapy sessions helping individuals cope with anxiety and life challenges.", isEntryLevel: true },
              { id: "clinical-psychologist", title: "Clinical Psychologist", description: "Conducts diagnostic evaluations and administers evidence-based psychotherapy.", isEntryLevel: false },
              { id: "wellness-coach", title: "Youth Wellbeing Coach", description: "Mentors adolescents on building emotional resilience, stress management, and healthy habits.", isEntryLevel: true },
            ],
          },
          {
            id: "org-behavior-people",
            name: "Organizational & Behavioral Psychology",
            description: "Workplace culture assessment, employee wellbeing, and behavioral change architecture.",
            roles: [
              { id: "org-psychologist", title: "Organizational Behavior Specialist", description: "Applies psychological principles to optimize employee motivation and team dynamics.", isEntryLevel: true },
              { id: "people-operations-lead", title: "People & Culture Strategist", description: "Designs inclusive workplace cultures, performance reviews, and employee retention programs.", isEntryLevel: true },
              { id: "behavioral-designer", title: "Behavioral Design Consultant", description: "Applies behavioral economics to nudging positive habits in consumer apps and health programs.", isEntryLevel: false },
            ],
          },
          {
            id: "social-impact-community",
            name: "Social Impact & Community Development",
            description: "Community program design, nonprofit leadership, monitoring & evaluation, and social welfare.",
            roles: [
              { id: "social-worker", title: "Social Impact Program Fellow", description: "Connects vulnerable families with community social resources, housing, and healthcare support.", isEntryLevel: true },
              { id: "community-lead", title: "Community Development Director", description: "Leads grassroots nonprofit initiatives to foster local economic development and education.", isEntryLevel: false },
              { id: "monitoring-eval-spec", title: "Social Impact M&E Specialist", description: "Measures and evaluates the quantitative social outcomes of philanthropic aid programs.", isEntryLevel: true },
            ],
          },
        ],
      },
      {
        id: "journalism-media-production",
        slug: "journalism-media-production",
        name: "Journalism & Media Broadcasting",
        title: "Journalism & Media Broadcasting",
        careerName: "Journalism",
        domainId: "media-communications-social",
        domainName: "Media, Communications & Social Impact",
        tagline: "Investigate critical stories, broadcast news, and produce documentary reportage.",
        specializations: [
          {
            id: "investigative-journalism",
            name: "Investigative & Digital Journalism",
            description: "In-depth investigative research, data-driven journalism, and digital news reporting.",
            roles: [
              { id: "reporter", title: "Digital News Reporter", description: "Covers breaking news events, interviews sources, and writes accurate digital news reports.", isEntryLevel: true },
              { id: "investigative-journalist", title: "Investigative Journalist", description: "Conducts deep multi-month investigations uncovering corruption, injustice, and public scandals.", isEntryLevel: false },
              { id: "fact-checker", title: "Verification & Fact-Checking Specialist", description: "Verifies claims, cross-references primary records, and debunk misinformation.", isEntryLevel: true },
            ],
          },
          {
            id: "broadcast-documentary",
            name: "Broadcast & Audio Storytelling",
            description: "Audio podcasts, video journalism, documentary filmmaking, and live broadcast production.",
            roles: [
              { id: "broadcast-producer", title: "Broadcast Media Producer", description: "Produces live television or radio newscasts, booking guests and directing live studio crews.", isEntryLevel: true },
              { id: "documentary-director", title: "Documentary Director", description: "Directs long-form documentary films telling powerful visual real-world human stories.", isEntryLevel: false },
              { id: "podcast-audio-producer", title: "Narrative Podcast & Audio Producer", description: "Records, edits, and mixes investigative audio documentaries and episodic narrative podcasts.", isEntryLevel: true },
            ],
          },
          {
            id: "interactive-data-journalism",
            name: "Interactive & Data Storytelling",
            description: "Visual news graphics, algorithmic accountability, data investigations, and multimedia web features.",
            roles: [
              { id: "data-journalist", title: "Data Journalist & Visual Investigator", description: "Cleans public records, builds interactive charts, and codes data-driven investigative news stories.", isEntryLevel: true },
              { id: "multimedia-storyteller", title: "Multimedia Narrative Producer", description: "Combines interactive web graphics, video, and audio into immersive digital news specials.", isEntryLevel: false },
              { id: "editorial-strategy-lead", title: "Digital Publishing & Content Strategist", description: "Leads multi-platform distribution, audience engagement, and newsroom digital innovation.", isEntryLevel: false },
            ],
          },
        ],
      },
    ],
  },
];

// ── Lookup Indices ─────────────────────────────────────────────────────────

export interface CareerRoleContext {
  role: CareerRole;
  spec: CareerSpecialization;
  specialization: CareerSpecialization;
  path: CareerPath;
  domain: CareerDomain;
}

export interface CareerSpecContext {
  spec: CareerSpecialization;
  specialization: CareerSpecialization;
  path: CareerPath;
  domain: CareerDomain;
}

const PATH_BY_SLUG: Record<string, CareerPath> = {};
const PATH_BY_CAREER_NAME: Record<string, CareerPath> = {};
const DOMAIN_BY_PATH_ID: Record<string, CareerDomain> = {};

const ROLE_LOOKUP_BY_ID: Record<string, CareerRoleContext> = {};
const ROLE_LOOKUP_BY_TITLE: Record<string, CareerRoleContext> = {};
const SPEC_LOOKUP_BY_ID: Record<string, CareerSpecContext> = {};
const SPEC_LOOKUP_BY_NAME: Record<string, CareerSpecContext> = {};

for (const domain of CAREER_DOMAINS) {
  for (const path of domain.paths) {
    PATH_BY_SLUG[path.slug] = path;
    PATH_BY_SLUG[path.id] = path;
    PATH_BY_CAREER_NAME[path.careerName.toLowerCase().trim()] = path;
    PATH_BY_CAREER_NAME[path.title.toLowerCase().trim()] = path;
    PATH_BY_CAREER_NAME[path.name.toLowerCase().trim()] = path;
    DOMAIN_BY_PATH_ID[path.id] = domain;
    DOMAIN_BY_PATH_ID[path.slug] = domain;

    for (const spec of path.specializations) {
      SPEC_LOOKUP_BY_ID[spec.id] = { spec, specialization: spec, path, domain };
      SPEC_LOOKUP_BY_NAME[spec.name.toLowerCase().trim()] = { spec, specialization: spec, path, domain };
      if (spec.aliases) {
        for (const a of spec.aliases) {
          SPEC_LOOKUP_BY_NAME[a.toLowerCase().trim()] = { spec, specialization: spec, path, domain };
        }
      }

      for (const role of spec.roles) {
        ROLE_LOOKUP_BY_ID[role.id] = { role, spec, specialization: spec, path, domain };
        ROLE_LOOKUP_BY_TITLE[role.title.toLowerCase().trim()] = { role, spec, specialization: spec, path, domain };
        if (role.aliases) {
          for (const a of role.aliases) {
            ROLE_LOOKUP_BY_TITLE[a.toLowerCase().trim()] = { role, spec, specialization: spec, path, domain };
          }
        }
      }
    }
  }
}

// Aliases for historical / alternate career names and slugs
const ALIASES: Record<string, string> = {
  "software / app development": "software-development",
  "software & app developer": "software-development",
  "software developer": "software-development",
  "hardware & systems engineer": "engineering",
  "ai & data scientist": "ai-ml-data-science",
  "ui/ux & product designer": "design-creative",
  "finance & investment analyst": "finance-investment",
  "product & operations manager": "management-product",
  "founder & venture builder": "entrepreneurship",
  "medical & healthcare professional": "medicine-healthcare",
  "research scientist": "scientific-research",
  "growth & brand marketer": "marketing-media",
  "legal & policy counsel": "law-policy",
  "behavioral & social impact specialist": "psychology-social",
  "marketing-communications": "marketing-media",
  "marketing & communications": "marketing-media",
  "law-public-policy": "law-policy",
  "law": "law-policy",
  "psychology-social-work": "psychology-social",
  "psychology & social work": "psychology-social",
  "finance": "finance-investment",
  "product management": "management-product",
  "medicine / healthcare": "medicine-healthcare",
  "medicine": "medicine-healthcare",
  "scientific research": "scientific-research",
  "data science & ai": "ai-ml-data-science",
  "artificial intelligence & ml": "ai-ml-data-science",
  "artificial intelligence & data": "ai-ml-data-science",
  "artificial intelligence & data science": "ai-ml-data-science",
  "ai / machine learning / data science": "ai-ml-data-science",
  "ai engineering": "ai-ml-data-science",
  "design & creative arts": "design-creative",
  "cloud & infrastructure": "cloud-infrastructure",
  "cloud infrastructure": "cloud-infrastructure",
  "animation & 3d media": "animation-3d-media",
  "animation": "animation-3d-media",
  "supply chain & global operations": "supply-chain-operations",
  "supply chain": "supply-chain-operations",
  "public health & global epidemiology": "public-health-epidemiology",
  "public health": "public-health-epidemiology",
};

for (const [alias, targetSlug] of Object.entries(ALIASES)) {
  const target = PATH_BY_SLUG[targetSlug];
  if (target) {
    PATH_BY_CAREER_NAME[alias.toLowerCase().trim()] = target;
    PATH_BY_SLUG[alias.toLowerCase().trim()] = target;
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
 * Returns all registered career paths across all domains (25 paths).
 */
export function getAllCareerPaths(): CareerPath[] {
  return CAREER_DOMAINS.flatMap((d) => d.paths);
}

/**
 * Returns a specific role with full parent context (spec, path, domain).
 */
export function getRoleHierarchy(roleIdOrTitle: string): CareerRoleContext | undefined {
  if (!roleIdOrTitle) return undefined;
  const key = roleIdOrTitle.toLowerCase().trim();
  return (
    ROLE_LOOKUP_BY_ID[roleIdOrTitle] ||
    ROLE_LOOKUP_BY_ID[key] ||
    ROLE_LOOKUP_BY_TITLE[key] ||
    Object.values(ROLE_LOOKUP_BY_ID).find(
      (r) =>
        r.role.id.toLowerCase() === key ||
        r.role.title.toLowerCase() === key ||
        r.role.aliases?.some((a: string) => a.toLowerCase() === key)
    )
  );
}

/**
 * Returns a specific specialization with full parent context (path, domain).
 */
export function getSpecializationHierarchy(specIdOrName: string): CareerSpecContext | undefined {
  if (!specIdOrName) return undefined;
  const key = specIdOrName.toLowerCase().trim();
  return (
    SPEC_LOOKUP_BY_ID[specIdOrName] ||
    SPEC_LOOKUP_BY_ID[key] ||
    SPEC_LOOKUP_BY_NAME[key] ||
    Object.values(SPEC_LOOKUP_BY_ID).find(
      (s) =>
        s.spec.id.toLowerCase() === key ||
        s.spec.name.toLowerCase() === key ||
        s.spec.aliases?.some((a: string) => a.toLowerCase() === key)
    )
  );
}

/**
 * Returns all roles across the entire catalogue with their full hierarchy context.
 */
export function getAllRolesWithContext(): CareerRoleContext[] {
  return Object.values(ROLE_LOOKUP_BY_ID);
}

/**
 * Dynamically computes aggregate catalogue metrics directly from the canonical registry:
 * Total domains, career paths, specializations, and career roles.
 */
export function getCareerCatalogueStats(): CareerCatalogueStats {
  const paths = getAllCareerPaths();
  const totalDomains = CAREER_DOMAINS.length;
  const totalPaths = paths.length;
  const totalSpecializations = paths.reduce(
    (acc, p) => acc + p.specializations.length,
    0
  );
  const totalRoles = paths.reduce(
    (acc, p) =>
      acc + p.specializations.reduce((sAcc, s) => sAcc + s.roles.length, 0),
    0
  );

  return {
    totalDomains,
    totalPaths,
    totalSpecializations,
    totalRoles,
  };
}

/**
 * Resolves any career identifier (path slug, role ID, role title, specialization ID,
 * backend career name) into its full hierarchy mapping:
 * Domain -> Path -> Specialization -> Role.
 */
export function getCareerHierarchy(identifier: string): CareerHierarchyMatch | undefined {
  if (!identifier) return undefined;

  const key = identifier.toLowerCase().trim();

  // 1. Direct or fuzzy path lookup
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
        key.includes(p.title.toLowerCase()) ||
        p.name.toLowerCase().includes(key) ||
        key.includes(p.name.toLowerCase())
    );

  if (path) {
    const domain = DOMAIN_BY_PATH_ID[path.id] || DOMAIN_BY_PATH_ID[path.slug];
    if (domain) {
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
  }

  // 2. Role lookup (by ID or Title/Alias)
  const roleEntry =
    ROLE_LOOKUP_BY_ID[identifier] ||
    ROLE_LOOKUP_BY_ID[key] ||
    ROLE_LOOKUP_BY_TITLE[key] ||
    Object.values(ROLE_LOOKUP_BY_ID).find(
      (r) =>
        r.role.id.toLowerCase() === key ||
        r.role.title.toLowerCase() === key ||
        r.role.title.toLowerCase().includes(key) ||
        r.role.aliases?.some((a: string) => a.toLowerCase() === key || a.toLowerCase().includes(key))
    );

  if (roleEntry) {
    return {
      domain: roleEntry.domain,
      path: roleEntry.path,
      primarySpecialization: roleEntry.spec,
      sampleRoles: [roleEntry.role.title, ...roleEntry.spec.roles.filter((r: CareerRole) => r.id !== roleEntry.role.id).map((r: CareerRole) => r.title)],
      breadcrumbs: [roleEntry.domain.name, roleEntry.path.name, roleEntry.spec.name, roleEntry.role.title],
    };
  }

  // 3. Specialization lookup (by ID or Name/Alias)
  const specEntry =
    SPEC_LOOKUP_BY_ID[identifier] ||
    SPEC_LOOKUP_BY_ID[key] ||
    SPEC_LOOKUP_BY_NAME[key] ||
    Object.values(SPEC_LOOKUP_BY_ID).find(
      (s) =>
        s.spec.id.toLowerCase() === key ||
        s.spec.name.toLowerCase() === key ||
        s.spec.name.toLowerCase().includes(key)
    );

  if (specEntry) {
    return {
      domain: specEntry.domain,
      path: specEntry.path,
      primarySpecialization: specEntry.spec,
      sampleRoles: specEntry.spec.roles.map((r: CareerRole) => r.title),
      breadcrumbs: [specEntry.domain.name, specEntry.path.name, specEntry.spec.name],
    };
  }

  return undefined;
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
