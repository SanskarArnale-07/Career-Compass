/**
 * Synthesized Path Roadmap Definitions
 *
 * Implements foundational phases, specialization tracks, and role overrides
 * for the 13 paths across tech, data, creative, business, and healthcare.
 *
 * Phase R4.2 Foundation Pacing:
 * Each synthesized path features TWO paced foundation phases:
 * - Phase 1: Conceptual + tooling foundations
 * - Phase 2: Applied fundamentals
 * Followed by the specialized track phases (Phases 3 & 4).
 */

import type { PathRoadmapDefinition } from "../types";

export const SYNTHESIZED_PATH_ROADMAPS: Record<string, PathRoadmapDefinition> = {
  "cybersecurity": {
    "pathSlug": "cybersecurity",
    "pathName": "Cybersecurity & Defense",
    "foundationalPhases": [
      {
        "id": "cyber-found-1",
        "phase": 1,
        "title": "Networking Protocols, Cyber Defense Core & Operating System Tooling",
        "description": "Build foundational knowledge in computer networking, the OSI model, internet protocols, and essential Linux terminal security navigation.",
        "estimatedDuration": "Weeks 1–4",
        "skills": [
          "TCP/IP & OSI Model",
          "Wireshark Packet Analysis",
          "Linux Command-Line Essentials",
          "Network Diagnostics & Ports"
        ],
        "learn": [
          "Network fundamentals: packet analysis with Wireshark, IP addressing, subnetting, DNS, DHCP, and firewalls",
          "The TCP/IP stack vs. OSI 7-layer model: encapsulation, headers, and protocol boundaries",
          "Network diagnostics and utilities: ping, traceroute, netstat, and introductory Nmap port scanning",
          "Linux filesystem architecture, user permissions, shell navigation, and basic command-line utilities"
        ],
        "practice": [
          "Capture and analyze network traffic in Wireshark identifying unencrypted credentials and abnormal packet flows",
          "Practice Linux terminal navigation to inspect active network sockets, routing tables, and file permissions"
        ],
        "build": "A Network Protocol Analyzer Lab: capturing and inspecting HTTP vs. HTTPS traffic, mapping local network topology, and documenting protocol headers.",
        "resources": [
          {
            "name": "OverTheWire: Bandit Linux Security Wargame",
            "type": "practice",
            "difficulty": "beginner",
            "estimatedTime": "4 weeks",
            "url": "https://overthewire.org/wargames/bandit/"
          },
          {
            "name": "Professor Messer: Network+ Training Course",
            "type": "course",
            "difficulty": "beginner",
            "estimatedTime": "6 weeks",
            "url": "https://www.professormesser.com/network-plus/n10-008/n10-008-training-course/"
          }
        ]
      },
      {
        "id": "cyber-found-2",
        "phase": 2,
        "title": "Applied Security Fundamentals, Linux Hardening & Defensive Controls",
        "description": "Implement operating system hardening, applied cryptography, firewall rules, and practical threat modeling frameworks.",
        "estimatedDuration": "Weeks 5–8",
        "skills": [
          "Linux Security Hardening",
          "Applied Cryptography (AES / RSA / SHA)",
          "Firewall & Access Control",
          "Threat Modeling & MITRE ATT&CK"
        ],
        "learn": [
          "Linux system hardening: iptables / ufw firewalls, PAM authentication, SSH key-only access, and fail2ban",
          "Cryptographic primitives: symmetric (AES) vs. asymmetric (RSA) encryption, hashing (SHA-256), and TLS certificates",
          "Threat modeling fundamentals: MITRE ATT&CK matrix, Cyber Kill Chain, and STRIDE framework",
          "Basic security auditing: identifying vulnerable configurations, auditing sudo privileges, and automated log review"
        ],
        "practice": [
          "Harden a Linux server configuring iptables firewalls, SSH key-only access, and fail2ban intrusion prevention",
          "Write a Bash script to audit weak file permissions and monitor unauthorized authentication attempts"
        ],
        "build": "A secure network topology and hardened Linux bastion server with automated intrusion logging and packet capture analysis.",
        "resources": [
          {
            "name": "CISA: Cybersecurity Basics & Fundamentals Guide",
            "type": "documentation",
            "difficulty": "beginner",
            "estimatedTime": "4 weeks",
            "url": "https://www.cisa.gov/cybersecurity-basics"
          },
          {
            "name": "NIST Cybersecurity Framework 2.0 Official Resource Center",
            "type": "documentation",
            "difficulty": "beginner",
            "estimatedTime": "2 weeks",
            "url": "https://www.nist.gov/cyberframework"
          }
        ]
      }
    ],
    "defaultAdvancedPhases": [
      {
        "id": "cyber-adv-1",
        "phase": 3,
        "title": "Defensive Operations, Security Auditing & Incident Response",
        "description": "Configure SIEM platforms, monitor security alerts, and execute incident response procedures.",
        "estimatedDuration": "Weeks 7–14",
        "skills": [
          "SIEM & Log Analysis",
          "Incident Response",
          "Vulnerability Scanning"
        ],
        "learn": [
          "Centralized log ingestion with Splunk/Elastic, correlating alerts, and detecting anomalous behavior",
          "Incident response life cycle (NIST SP 800-61): preparation, detection, containment, eradication, and recovery",
          "Vulnerability management: Nessus vulnerability scans, CVE triage, and remediation prioritization"
        ],
        "practice": [
          "Analyze simulated incident logs to trace malware containment timelines",
          "Configure SIEM detection rules triggering on brute force authentication attempts"
        ],
        "build": "An operational SOC defense playbook and SIEM detection rule suite with incident response protocols.",
        "resources": [
          {
            "name": "NIST SP 800-61 Rev. 2: Computer Security Incident Handling Guide",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "3 weeks",
            "url": "https://csrc.nist.gov/pubs/sp/800/61/r2/final"
          }
        ]
      }
    ],
    "specializationTracks": {
      "offensive-security": {
        "id": "offensive-security",
        "name": "Offensive Security & Red Teaming",
        "phases": [
          {
            "id": "offsec-phase-2",
            "phase": 3,
            "title": "Network Penetration Testing & Web Application Exploitation",
            "description": "Master offensive tooling: Nmap port scanning, Burp Suite proxying, OWASP Top 10 vulnerabilities, and privilege escalation.",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "Network Reconnaissance",
              "Burp Suite",
              "Web Exploitation (OWASP Top 10)",
              "Linux/Windows Privilege Escalation"
            ],
            "learn": [
              "Port scanning and service enumeration techniques using Nmap and vulnerability scripts (NSE)",
              "Web application penetration testing: SQL injection, Cross-Site Scripting (XSS), CSRF, SSRF, and authentication bypass",
              "Burp Suite Professional: Repeater, Intruder, automated scanning, and custom proxy extension workflows",
              "Local privilege escalation on Linux (SUID binaries, sudo misconfigurations) and Windows (unquoted service paths, token impersonation)"
            ],
            "practice": [
              "Complete 20 vulnerable machine challenges on Hack The Box or TryHackMe applying methodical exploitation",
              "Execute manual SQL injection and Cross-Site Scripting attacks on intentionally vulnerable lab targets"
            ],
            "build": "A structured penetration testing report detailing executive summary, vulnerability findings, CVSS scoring, and remediation recommendations.",
            "resources": [
              {
            "name": "PortSwigger Web Security Academy",
            "type": "practice",
            "difficulty": "intermediate",
            "estimatedTime": "8 weeks",
            "url": "https://portswigger.net/web-security"
          }
            ]
          },
          {
            "id": "offsec-phase-3",
            "phase": 4,
            "title": "Active Directory Exploitation & Red Team Tradecraft",
            "description": "Execute lateral movement in enterprise networks, Kerberos attacks (Kerberoasting, AS-REP roasting), and command & control (C2).",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "Active Directory Attacks",
              "Kerberos Exploitation",
              "Lateral Movement",
              "Command & Control (C2)"
            ],
            "learn": [
              "Active Directory enumeration using BloodHound and PowerView to discover shortest attack paths to Domain Admin",
              "Kerberos attack mechanics: Kerberoasting, AS-REP Roasting, Golden/Silver tickets, and Pass-the-Hash/Pass-the-Ticket",
              "Antivirus and EDR evasion concepts: AMSI bypasses, process injection, and obfuscated payloads",
              "Command and control (C2) frameworks: Mythic, Sliver, and Havoc operational deployment"
            ],
            "practice": [
              "Map and exploit an enterprise Active Directory forest domain in a closed cyber range environment",
              "Execute an end-to-end lateral movement attack chain from unprivileged domain user to Enterprise Admin"
            ],
            "build": "An end-to-end Red Team operation report mapping out full attack paths, MITRE ATT&CK tactics, and defensive countermeasures.",
            "resources": [
              {
            "name": "Hack The Box Academy: Hands-On Cyber Training Paths",
            "type": "practice",
            "difficulty": "intermediate",
            "estimatedTime": "6 weeks",
            "url": "https://academy.hackthebox.com/"
          }
            ]
          }
        ],
        "roleOverrides": {
          "pentester": {
            "roleId": "pentester",
            "roleTitle": "Penetration Tester (Ethical Hacker)",
            "capstonePhase": {
              "id": "pentest-capstone",
              "title": "Ethical Hacking Capstone: Comprehensive Penetration Test & Audit Report",
              "description": "Execute a full-scope simulated network and web application penetration test following the PTES standard and present findings to leadership.",
              "estimatedDuration": "Weeks 19–24",
              "skills": [
                "Full-Scope Penetration Testing",
                "PTES Standards",
                "CVSS v3.1 Scoring",
                "Executive Presentation"
              ],
              "learn": [
                "Penetration Testing Execution Standard (PTES): Pre-engagement interactions, intelligence gathering, threat modeling, and exploitation",
                "Scoring vulnerabilities using Common Vulnerability Scoring System (CVSS v3.1) metrics",
                "Authoring executive vs. technical remediation roadmaps prioritizing high-risk systemic flaws",
                "Client debriefing and live demonstration of critical findings to C-suite and security leadership"
              ],
              "practice": [
                "Perform an end-to-end multi-target penetration test in an isolated cyber lab without automated vulnerability tools",
                "Draft an executive summary translating severe technical exploits into quantifiable financial and operational risk"
              ],
              "build": "A client-ready Penetration Testing Engagement Report containing executive summary, methodology, CVSS v3.1 matrix, proof-of-concept exploits, and step-by-step remediation plans.",
              "resources": [
                {
            "name": "NIST SP 800-115: Technical Guide to Information Security Testing",
            "type": "documentation",
            "difficulty": "advanced",
            "estimatedTime": "4 weeks",
            "url": "https://csrc.nist.gov/pubs/sp/800/115/final"
          }
              ]
            }
          },
          "penetration-tester": {
            "roleId": "penetration-tester",
            "roleTitle": "Penetration Tester (Ethical Hacker)",
            "capstonePhase": {
              "id": "pentest-capstone",
              "title": "Ethical Hacking Capstone: Comprehensive Penetration Test & Audit Report",
              "description": "Execute a full-scope simulated network and web application penetration test following the PTES standard and present findings to leadership.",
              "estimatedDuration": "Weeks 19–24",
              "skills": [
                "Full-Scope Penetration Testing",
                "PTES Standards",
                "CVSS v3.1 Scoring",
                "Executive Presentation"
              ],
              "learn": [
                "Penetration Testing Execution Standard (PTES): Pre-engagement interactions, intelligence gathering, threat modeling, and exploitation",
                "Scoring vulnerabilities using Common Vulnerability Scoring System (CVSS v3.1) metrics",
                "Authoring executive vs. technical remediation roadmaps prioritizing high-risk systemic flaws",
                "Client debriefing and live demonstration of critical findings to C-suite and security leadership"
              ],
              "practice": [
                "Perform an end-to-end multi-target penetration test in an isolated cyber lab without automated vulnerability tools",
                "Draft an executive summary translating severe technical exploits into quantifiable financial and operational risk"
              ],
              "build": "A client-ready Penetration Testing Engagement Report containing executive summary, methodology, CVSS v3.1 matrix, proof-of-concept exploits, and step-by-step remediation plans.",
              "resources": [
                {
            "name": "NIST SP 800-115: Technical Guide to Information Security Testing",
            "type": "documentation",
            "difficulty": "advanced",
            "estimatedTime": "4 weeks",
            "url": "https://csrc.nist.gov/pubs/sp/800/115/final"
          }
              ]
            }
          }
        }
      },
      "sec-operations": {
        "id": "sec-operations",
        "name": "Defensive Security & Blue Teaming (SecOps)",
        "phases": [
          {
            "id": "secops-phase-2",
            "phase": 3,
            "title": "Security Information & Event Management (SIEM) & Triage",
            "description": "Master enterprise log aggregation, Splunk/Elastic query languages, detection rule tuning, and SOC alert triage.",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "SIEM (Splunk / Elastic)",
              "Log Parsing & Correlation",
              "Alert Triage",
              "SOC Workflows"
            ],
            "learn": [
              "Enterprise telemetry sources: Windows Event IDs (Sysmon), Linux auth.log, firewall logs, and EDR telemetry",
              "Writing detection rules in Splunk Search Processing Language (SPL) and Elasticsearch KQL/EQL",
              "Alert triage methodology: true positive vs. false positive determination, severity escalation, and ticket management",
              "Intrusion detection systems (Snort, Suricata, Zeek) network packet signature authoring"
            ],
            "practice": [
              "Configure a multi-source Elastic / Splunk SIEM laboratory ingesting Sysmon and firewall telemetry",
              "Triage 50 simulated security alerts determining root cause and isolating infected hosts"
            ],
            "build": "An operational SOC monitoring dashboard in Splunk/Elastic with custom detection rules and alert triage runbooks.",
            "resources": [
              {
            "name": "Splunk Free Training & Education Paths",
            "type": "course",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://www.splunk.com/en_us/training.html"
          }
            ]
          },
          {
            "id": "secops-phase-3",
            "phase": 4,
            "title": "Threat Hunting, Detection Engineering & Incident Response",
            "description": "Develop proactive threat hunting hypotheses, map detections to MITRE ATT&CK, write Sigma rules, and lead incident response.",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "Threat Hunting",
              "Sigma Detection Rules",
              "Incident Containment",
              "MITRE ATT&CK Mapping"
            ],
            "learn": [
              "Proactive threat hunting methodologies: hypothesis formulation, baselining normal behavior, and anomaly discovery",
              "Detection Engineering: authoring vendor-agnostic Sigma rules mapped to specific MITRE ATT&CK techniques",
              "Host-level containment: network isolation, memory preservation, process termination, and credential revocation",
              "Root cause analysis and authoring comprehensive Incident Response Postmortem reports"
            ],
            "practice": [
              "Author 10 original Sigma detection rules detecting malicious PowerShell execution and credential dumping",
              "Execute a live incident response exercise containing a simulated ransomware outbreak in an enterprise domain"
            ],
            "build": "A Threat Hunting playbook and Sigma detection repository mapped to MITRE ATT&CK with verified detection testing logs.",
            "resources": [
              {
                "name": "Sigma Detection Rule Format",
                "type": "documentation",
                "difficulty": "advanced",
                "estimatedTime": "2 weeks",
                "url": "https://github.com/SigmaHQ/sigma"
              }
            ]
          }
        ],
        "roleOverrides": {
          "soc-analyst": {
            "roleId": "soc-analyst",
            "roleTitle": "Blue Team & SOC Analyst",
            "capstonePhase": {
              "id": "soc-analyst-capstone",
              "title": "SOC Operations Capstone: End-to-End Incident Handling & Detection Suite",
              "description": "Triage live simulated cyber attacks, investigate alert chains across endpoint and network telemetry, and execute complete containment runbooks.",
              "estimatedDuration": "Weeks 19–24",
              "skills": [
                "Live Incident Triage",
                "EDR Telemetry Investigation",
                "Containment Runbooks",
                "Post-Incident Reporting"
              ],
              "learn": [
                "Advanced EDR investigation: process trees, parent-child relationships, command-line arguments, and persistence keys",
                "Automated Security Orchestration, Automation, and Response (SOAR) playbook design",
                "Authoring executive shift handoff summaries and customer-facing incident notifications",
                "Continuous security posture improvement through purple team post-incident collaboration"
              ],
              "practice": [
                "Investigate an end-to-end multi-stage intrusion from initial phishing lure to domain credential dumping",
                "Draft complete incident handling documentation according to NIST SP 800-61 Rev 2 standards"
              ],
              "build": "A comprehensive SOC incident portfolio: 5 investigated incident reports, custom SIEM detection rules, automated SOAR workflows, and postmortem documentation.",
              "resources": [
                {
            "name": "MITRE ATT&CK Framework: Enterprise Techniques & Mitigations",
            "type": "documentation",
            "difficulty": "advanced",
            "estimatedTime": "4 weeks",
            "url": "https://attack.mitre.org/"
          }
              ]
            }
          }
        }
      },
      "cloud-identity-sec": {
        "id": "cloud-identity-sec",
        "name": "Cloud & Application Security (DevSecOps)",
        "phases": [
          {
            "id": "appsec-phase-2",
            "phase": 3,
            "title": "Application Security (AppSec) & Secure Code Development",
            "description": "Implement secure software development lifecycles (SSDLC), static/dynamic analysis (SAST/DAST), and secret scanning.",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "Secure SDLC",
              "SAST / DAST Tools",
              "OWASP Top 10 Mitigation",
              "Secret Management"
            ],
            "learn": [
              "Secure coding principles: input validation, parameterized queries, output encoding, and principle of least privilege",
              "Integrating Static Application Security Testing (SAST with Semgrep/SonarQube) into CI/CD pipelines",
              "Dynamic Application Security Testing (DAST with OWASP ZAP) and Software Composition Analysis (SCA with Snyk)",
              "Secret scanning (TruffleHog) and enterprise secrets management with HashiCorp Vault / AWS Secrets Manager"
            ],
            "practice": [
              "Integrate automated SAST, SCA, and secret scanning checks into a GitHub Actions pull request workflow",
              "Audit source code to identify and remediate critical OWASP Top 10 security vulnerabilities"
            ],
            "build": "An automated DevSecOps CI/CD security pipeline blocking vulnerable code commits and alerting on dependency vulnerabilities.",
            "resources": [
              {
                "name": "OWASP DevSecOps Guideline",
                "type": "documentation",
                "difficulty": "intermediate",
                "estimatedTime": "3 weeks",
                "url": "https://owasp.org/www-project-devsecops-guideline/"
              }
            ]
          },
          {
            "id": "appsec-phase-3",
            "phase": 4,
            "title": "Cloud Infrastructure Security & Policy-as-Code",
            "description": "Harden AWS/GCP cloud environments, implement Kubernetes RBAC security, and enforce Policy-as-Code with Open Policy Agent.",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "Cloud Security Posture (CSPM)",
              "Kubernetes Security",
              "Policy-as-Code (OPA / Checkov)",
              "Cloud IAM Hardening"
            ],
            "learn": [
              "Cloud identity and access management (IAM) security: least privilege policies, temporary credentials, and role assumptions",
              "Kubernetes cluster security: pod security standards, network policies, admission controllers, and image signing with Cosign",
              "Infrastructure as Code security: scanning Terraform templates for misconfigurations with Checkov and tfsec",
              "Policy-as-Code enforcement using Open Policy Agent (OPA) and Rego to mandate compliance rules"
            ],
            "practice": [
              "Deploy a secure Kubernetes cluster with isolated network policies and mutual TLS service mesh (Istio)",
              "Write custom OPA Rego policies preventing the deployment of unencrypted cloud resources or public buckets"
            ],
            "build": "A secure cloud infrastructure baseline with automated Terraform compliance scanning, OPA guardrails, and container vulnerability enforcement.",
            "resources": [
              {
            "name": "Checkov: Infrastructure as Code Static Analysis Documentation",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "2 weeks",
            "url": "https://www.checkov.io"
          }
            ]
          }
        ]
      },
      "digital-forensics-dfir": {
        "id": "digital-forensics-dfir",
        "name": "Digital Forensics & Threat Intelligence (DFIR)",
        "phases": [
          {
            "id": "dfir-phase-2",
            "phase": 3,
            "title": "Digital Forensics, Disk Imaging & File System Analysis",
            "description": "Master forensic evidence preservation, write blockers, bitstream disk imaging with FTK Imager, and Windows/Linux file systems.",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "Chain of Custody",
              "Disk Imaging (FTK / dd)",
              "File System Forensics (NTFS)",
              "Registry & Event Artifacts"
            ],
            "learn": [
              "Forensic evidence handling: chain of custody documentation, legal admissibility (Federal Rules of Evidence Rule 902)",
              "Forensic disk acquisition: hardware write-blockers, raw dd and E01 forensic image format verification with SHA-256 hashes",
              "NTFS file system artifacts: Master File Table ($MFT), $LogFile, USN Journal, and recovering deleted files",
              "Windows forensic artifacts: Registry hives, UserAssist, Prefetch files, Shimcache, Amcache, and LNK shortcut parsing"
            ],
            "practice": [
              "Acquire and verify a forensic bitstream disk image of an infected host calculating verification hashes",
              "Parse Windows prefetch and registry artifacts to reconstruct the timeline of malicious executable execution"
            ],
            "build": "A forensic disk analysis case report detailing evidence acquisition hashes, timeline reconstruction, and recovered attacker artifacts.",
            "resources": [
              {
            "name": "The Sleuth Kit & Autopsy: Open Source Digital Forensics Documentation",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://sleuthkit.org/autopsy/docs.php"
          }
            ]
          },
          {
            "id": "dfir-phase-3",
            "phase": 4,
            "title": "Memory Forensics, Malware Triage & Threat Intelligence",
            "description": "Analyze volatile RAM captures using Volatility, conduct basic malware reverse engineering with Ghidra, and leverage MISP threat feeds.",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "Memory Forensics (Volatility 3)",
              "Malware Analysis (Ghidra)",
              "YARA Rule Authoring",
              "Cyber Threat Intelligence (CTI)"
            ],
            "learn": [
              "Volatile memory acquisition (LiME, DumpIt) and analysis with Volatility 3: process listing, DLL injection, and network connections",
              "Detecting memory injection: hollowed processes, reflective DLL loading, and extracting hidden shellcode",
              "Static and dynamic malware analysis: string extraction, PE headers, sandbox execution, and Ghidra disassembly",
              "Authoring YARA rules to detect malware families and utilizing MISP / OpenCTI for threat indicator sharing"
            ],
            "practice": [
              "Analyze an infected system memory dump using Volatility to extract injected Cobalt Strike beacon shellcode",
              "Author and test an original YARA rule matching polymorphic malware samples across a sample repository"
            ],
            "build": "A combined memory forensics and malware analysis dossier detailing malware command-and-control IOCs and YARA signatures.",
            "resources": [
              {
            "name": "Volatility Foundation: Memory Forensics Documentation & Cheat Sheets",
            "type": "documentation",
            "difficulty": "advanced",
            "estimatedTime": "4 weeks",
            "url": "https://volatilityfoundation.org/"
          }
            ]
          }
        ],
        "roleOverrides": {
          "digital-forensics-investigator": {
            "roleId": "digital-forensics-investigator",
            "roleTitle": "Digital Forensics Investigator",
            "capstonePhase": {
              "id": "dfir-capstone",
              "title": "Digital Forensics Capstone: Forensic Case Investigation & Expert Witness Report",
              "description": "Conduct an end-to-end forensic investigation of a simulated corporate espionage breach, preserve evidence, and author an expert witness report.",
              "estimatedDuration": "Weeks 19–24",
              "skills": [
                "Forensic Timeline Synthesis",
                "Chain of Custody Legal Rigor",
                "Expert Witness Report",
                "Evidence Admissibility"
              ],
              "learn": [
                "Compiling super-timelines combining filesystem timestamps (MACB), registry modifications, and event logs using Plaso / log2timeline",
                "Documenting complete anti-forensics identification (timestamp tampering, log clearing, file wiping)",
                "Authoring court-admissible forensic witness reports detailing scope, findings, technical methodology, and conclusions",
                "Preparing for expert witness depositions and cross-examinations regarding forensic chain of custody"
              ],
              "practice": [
                "Reconstruct a minute-by-minute timeline of unauthorized data exfiltration across multiple compromised disk and memory images",
                "Draft a formal 15-page forensic witness report adhering to international digital forensics standards"
              ],
              "build": "A court-admissible Digital Forensics Case Report complete with verified evidence hashes, full forensic timeline, artifact exhibits, and technical witness testimony.",
              "resources": [
                {
            "name": "NIST SP 800-86: Guide to Integrating Forensic Techniques into Incident Response",
            "type": "documentation",
            "difficulty": "advanced",
            "estimatedTime": "3 weeks",
            "url": "https://csrc.nist.gov/pubs/sp/800/86/final"
          }
              ]
            }
          },
          "dfir-investigator": {
            "roleId": "dfir-investigator",
            "roleTitle": "Digital Forensics Investigator",
            "capstonePhase": {
              "id": "dfir-capstone",
              "title": "Digital Forensics Capstone: Forensic Case Investigation & Expert Witness Report",
              "description": "Conduct an end-to-end forensic investigation of a simulated corporate espionage breach, preserve evidence, and author an expert witness report.",
              "estimatedDuration": "Weeks 19–24",
              "skills": [
                "Forensic Timeline Synthesis",
                "Chain of Custody Legal Rigor",
                "Expert Witness Report",
                "Evidence Admissibility"
              ],
              "learn": [
                "Compiling super-timelines combining filesystem timestamps (MACB), registry modifications, and event logs using Plaso / log2timeline",
                "Documenting complete anti-forensics identification (timestamp tampering, log clearing, file wiping)",
                "Authoring court-admissible forensic witness reports detailing scope, findings, technical methodology, and conclusions",
                "Preparing for expert witness depositions and cross-examinations regarding forensic chain of custody"
              ],
              "practice": [
                "Reconstruct a minute-by-minute timeline of unauthorized data exfiltration across multiple compromised disk and memory images",
                "Draft a formal 15-page forensic witness report adhering to international digital forensics standards"
              ],
              "build": "A court-admissible Digital Forensics Case Report complete with verified evidence hashes, full forensic timeline, artifact exhibits, and technical witness testimony.",
              "resources": [
                {
            "name": "NIST SP 800-86: Guide to Integrating Forensic Techniques into Incident Response",
            "type": "documentation",
            "difficulty": "advanced",
            "estimatedTime": "3 weeks",
            "url": "https://csrc.nist.gov/pubs/sp/800/86/final"
          }
              ]
            }
          }
        }
      },
      "governance-risk-compliance": {
        "id": "governance-risk-compliance",
        "name": "Governance, Risk, Compliance (GRC) & Security Architecture",
        "phases": [
          {
            "id": "grc-phase-2",
            "phase": 3,
            "title": "Cybersecurity Frameworks, Risk Assessment & Regulatory Standards",
            "description": "Master industry frameworks: NIST Cybersecurity Framework (CSF), ISO/IEC 27001, SOC 2, HIPAA, GDPR, and quantitative FAIR risk modeling.",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "NIST CSF & ISO 27001",
              "Quantitative Risk Analysis (FAIR)",
              "Regulatory Compliance (SOC 2 / HIPAA)",
              "Security Policy Drafting"
            ],
            "learn": [
              "NIST Cybersecurity Framework 2.0: Govern, Identify, Protect, Detect, Respond, and Recover core functions",
              "ISO/IEC 27001 Information Security Management System (ISMS) implementation and Annex A security controls",
              "Regulatory regimes: SOC 2 Type II trust criteria, HIPAA Security Rule, PCI-DSS v4.0, and GDPR data privacy controls",
              "Risk quantification using the Factor Analysis of Information Risk (FAIR) framework: loss event frequency and magnitude"
            ],
            "practice": [
              "Conduct a gap analysis of an organization's existing security posture against the NIST CSF 2.0 framework",
              "Perform a FAIR quantitative risk assessment modeling potential annual financial loss for a data breach scenario"
            ],
            "build": "An enterprise risk assessment report containing risk register matrices, compliance gap analysis, and policy remediation schedules.",
            "resources": [
              {
                "name": "NIST Cybersecurity Framework 2.0 Official Documentation",
                "type": "documentation",
                "difficulty": "intermediate",
                "estimatedTime": "3 weeks",
                "url": "https://www.nist.gov/cyberframework"
              }
            ]
          },
          {
            "id": "grc-phase-3",
            "phase": 4,
            "title": "Vendor Risk Management, Security Auditing & Governance",
            "description": "Build Third-Party Risk Management (TPRM) programs, execute internal security audits, and align security architecture with business goals.",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "Third-Party Risk Management (TPRM)",
              "Internal Security Auditing",
              "Control Testing",
              "Security Architecture Alignment"
            ],
            "learn": [
              "Third-Party Risk Management (TPRM): vendor security questionnaires (SIG / CAIQ), SOC 2 report reviews, and contract clauses",
              "Audit planning, fieldwork testing, sampling methodologies, and authoring formal audit finding reports",
              "Security architecture principles: Zero Trust architecture (NIST SP 800-207), defense-in-depth, and security zoning",
              "Executive reporting: developing Board-level cybersecurity KPI metrics and risk tolerance appetite statements"
            ],
            "practice": [
              "Review and evaluate a third-party vendor's SOC 2 Type II audit report identifying unmitigated exception findings",
              "Conduct control testing on enterprise identity access management (IAM) and offboarding workflows"
            ],
            "build": "A complete Third-Party Risk Management program package: vendor intake workflows, risk evaluation rubrics, and contract addenda.",
            "resources": [
              {
            "name": "ISACA Cybersecurity & Audit Frameworks",
            "type": "documentation",
            "difficulty": "advanced",
            "estimatedTime": "4 weeks",
            "url": "https://www.isaca.org/resources/frameworks-standards-and-models"
          }
            ]
          }
        ],
        "roleOverrides": {
          "security-grc-analyst": {
            "roleId": "security-grc-analyst",
            "roleTitle": "Cybersecurity GRC Analyst",
            "capstonePhase": {
              "id": "grc-capstone",
              "title": "GRC Capstone: Enterprise SOC 2 / ISO 27001 Audit Readiness Package",
              "description": "Build an end-to-end enterprise compliance readiness package, author security policies, document control matrices, and present to audit stakeholders.",
              "estimatedDuration": "Weeks 19–24",
              "skills": [
                "Audit Readiness Coordination",
                "Security Policy Suite Authoring",
                "Control Evidence Collection",
                "Board Risk Presentation"
              ],
              "learn": [
                "Drafting a comprehensive Information Security Policy (ISP) suite: Access Control, Data Classification, Disaster Recovery, Acceptable Use",
                "Establishing continuous automated evidence collection workflows for auditor review",
                "Remediating non-conformities and authoring Corrective Action Plans (CAP)",
                "Synthesizing enterprise compliance progress into executive dashboard reporting for the Board of Directors"
              ],
              "practice": [
                "Compile complete auditor evidence packages for 15 critical SOC 2 Type II trust service controls",
                "Present an enterprise cybersecurity risk and compliance posture briefing to a simulated Board of Directors audit committee"
              ],
              "build": "A full enterprise GRC readiness package: master security policy suite, statement of applicability, risk register, and executive board presentation.",
              "resources": [
                {
            "name": "ISO/IEC 27001: Information Security Management Systems Overview",
            "type": "documentation",
            "difficulty": "advanced",
            "estimatedTime": "4 weeks",
            "url": "https://www.iso.org/standard/27001"
          }
              ]
            }
          },
          "grc-analyst": {
            "roleId": "grc-analyst",
            "roleTitle": "Cybersecurity GRC Analyst",
            "capstonePhase": {
              "id": "grc-capstone",
              "title": "GRC Capstone: Enterprise SOC 2 / ISO 27001 Audit Readiness Package",
              "description": "Build an end-to-end enterprise compliance readiness package, author security policies, document control matrices, and present to audit stakeholders.",
              "estimatedDuration": "Weeks 19–24",
              "skills": [
                "Audit Readiness Coordination",
                "Security Policy Suite Authoring",
                "Control Evidence Collection",
                "Board Risk Presentation"
              ],
              "learn": [
                "Drafting a comprehensive Information Security Policy (ISP) suite: Access Control, Data Classification, Disaster Recovery, Acceptable Use",
                "Establishing continuous automated evidence collection workflows for auditor review",
                "Remediating non-conformities and authoring Corrective Action Plans (CAP)",
                "Synthesizing enterprise compliance progress into executive dashboard reporting for the Board of Directors"
              ],
              "practice": [
                "Compile complete auditor evidence packages for 15 critical SOC 2 Type II trust service controls",
                "Present an enterprise cybersecurity risk and compliance posture briefing to a simulated Board of Directors audit committee"
              ],
              "build": "A full enterprise GRC readiness package: master security policy suite, statement of applicability, risk register, and executive board presentation.",
              "resources": [
                {
            "name": "ISO/IEC 27001: Information Security Management Systems Overview",
            "type": "documentation",
            "difficulty": "advanced",
            "estimatedTime": "4 weeks",
            "url": "https://www.iso.org/standard/27001"
          }
              ]
            }
          }
        }
      }
    }
  },
  "robotics-automation": {
    "pathSlug": "robotics-automation",
    "pathName": "Robotics & Automation",
    "foundationalPhases": [
      {
        "id": "robotics-found-1",
        "phase": 1,
        "title": "Robotics Mathematics, Kinematics & Computational Thinking",
        "description": "Learn essential linear algebra, spatial coordinates, 2D/3D kinematic transformations, and foundational programming in C++.",
        "estimatedDuration": "Weeks 1–4",
        "skills": [
          "Robotics Mathematics & Vectors",
          "Spatial Transformations & Frames",
          "Modern C++ Foundations",
          "Algorithm Logic"
        ],
        "learn": [
          "Linear algebra for robotics: coordinate frames, 2D and 3D vectors, dot/cross products, and matrix multiplication",
          "Spatial transformations: homogeneous transformation matrices, Euler angles, rotation matrices, and translation vectors",
          "Forward kinematics concepts: computing end-effector positions from joint angles in multi-link robotic arms",
          "C++ programming foundations: pointers, references, object-oriented design, standard template library (STL), and memory safety"
        ],
        "practice": [
          "Implement 2D and 3D coordinate transformation algorithms in C++ calculating robot joint translations",
          "Solve forward kinematics equations for a 2-degree-of-freedom planar robotic arm and simulate joint trajectories"
        ],
        "build": "A 2D/3D Kinematic Robot Simulator in C++ that calculates and visualizes reachable workspace and end-effector positions for multi-joint arms.",
        "resources": [
          {
            "name": "Modern Robotics: Mechanics, Planning, and Control (Northwestern University)",
            "type": "book",
            "difficulty": "beginner",
            "estimatedTime": "8 weeks",
            "url": "https://modernrobotics.northwestern.edu/"
          },
          {
            "name": "learncpp.com: Online C++ Tutorials",
            "type": "documentation",
            "difficulty": "beginner",
            "estimatedTime": "4 weeks",
            "url": "https://www.learncpp.com"
          }
        ]
      },
      {
        "id": "robotics-found-2",
        "phase": 2,
        "title": "Microcontroller Interfacing, Sensors & Actuator Control",
        "description": "Connect microcontrollers to sensors and motors, write embedded C++ firmware, and implement closed-loop PID control loops.",
        "estimatedDuration": "Weeks 5–8",
        "skills": [
          "Microcontroller Firmware (C++)",
          "Sensor Interfacing (I2C / SPI / ADC)",
          "Motor & Actuator Control (PWM)",
          "Closed-Loop PID Control"
        ],
        "learn": [
          "Embedded microcontroller architectures: GPIO configuration, hardware timers, interrupt service routines (ISRs), and ADC converters",
          "Hardware communication protocols: reading digital and analog sensors over I2C, SPI, and UART serial buses",
          "Actuators and motor control: H-bridges, DC motor speed control via PWM, stepper motor indexing, and servo angles",
          "Closed-loop control systems: Proportional-Integral-Derivative (PID) feedback algorithms and sensor noise filtering"
        ],
        "practice": [
          "Wire and program ultrasonic distance sensors, rotary encoders, and servo motors to respond to environment changes",
          "Implement and tune a closed-loop PID controller in C++ to stabilize motor velocity under varying external mechanical load"
        ],
        "build": "An autonomous mobile robot firmware prototype with real-time obstacle avoidance, encoder feedback, and closed-loop PID motor regulation.",
        "resources": [
          {
            "name": "Arduino Official Documentation & Robotics Tutorials",
            "type": "documentation",
            "difficulty": "beginner",
            "estimatedTime": "3 weeks",
            "url": "https://docs.arduino.cc/tutorials/"
          },
          {
            "name": "Control of Mobile Robots (Georgia Tech / Coursera)",
            "type": "course",
            "difficulty": "intermediate",
            "estimatedTime": "6 weeks",
            "url": "https://www.coursera.org/learn/mobile-robot"
          }
        ]
      }
    ],
    "defaultAdvancedPhases": [
      {
        "id": "robot-adv-1",
        "phase": 3,
        "title": "Robot Operating System (ROS2) & Autonomous Navigation",
        "description": "Develop robotic software architectures with ROS2, simulate robots in Gazebo, and implement autonomous navigation.",
        "estimatedDuration": "Weeks 7–14",
        "skills": [
          "ROS2 (Robot Operating System)",
          "Gazebo Simulation",
          "Autonomous Navigation (Nav2)"
        ],
        "learn": [
          "ROS2 architecture: nodes, topics, services, actions, parameters, and launch files",
          "Robot simulation in Gazebo: URDF/Xacro modeling, physics engines, and sensor plugins",
          "Navigation2 (Nav2): costmaps, global/local path planners, and recovery behaviors"
        ],
        "practice": [
          "Build a simulated differential drive mobile robot in ROS2 and Gazebo",
          "Implement autonomous waypoint navigation avoiding obstacles"
        ],
        "build": "A complete ROS2 mobile robot package simulating autonomous SLAM mapping and path planning in Gazebo.",
        "resources": [
          {
            "name": "ROS2 Humble Documentation & Beginner Tutorials",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://docs.ros.org/en/humble/Tutorials.html"
          }
        ]
      }
    ],
    "specializationTracks": {
      "autonomous-mechatronics": {
        "id": "autonomous-mechatronics",
        "name": "Autonomous Systems & Mechatronics",
        "phases": [
          {
            "id": "auto-phase-2",
            "phase": 3,
            "title": "ROS2 Node Architecture, URDF Modeling & Simulation",
            "description": "Master ROS2 multi-node systems, URDF/Xacro robot description, Gazebo physical simulation, and sensor feedback.",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "ROS2 Architecture",
              "URDF / Xacro Modeling",
              "Gazebo Physics Simulation",
              "Sensor Integration"
            ],
            "learn": [
              "Writing modular ROS2 C++ and Python nodes, custom message types, and lifecycle nodes",
              "URDF and Xacro: defining visual geometries, collision boundaries, and mass/inertia tensors",
              "Simulating sensor plugins in Gazebo: LiDAR scanners, depth cameras, and IMU telemetry",
              "Motor feedback control: PID velocity controllers and odometry calculation from wheel encoders"
            ],
            "practice": [
              "Model a custom mobile robot in Xacro and spawn it into a physics-enabled Gazebo environment",
              "Tune closed-loop PID velocity controllers on simulated joint actuators to eliminate steady-state error"
            ],
            "build": "A functional ROS2 robot simulation package with custom URDF kinematics, Gazebo plugins, and teleoperation control.",
            "resources": [
              {
            "name": "ROS2 Humble Official Documentation & Architecture",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://docs.ros.org/en/humble/index.html"
          }
            ]
          },
          {
            "id": "auto-phase-3",
            "phase": 4,
            "title": "SLAM Mapping, Nav2 Path Planning & State Estimation",
            "description": "Implement Simultaneous Localization and Mapping (SLAM), Extended Kalman Filtering (EKF), and Nav2 autonomous navigation.",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "SLAM (Cartographer / Slam Toolbox)",
              "State Estimation (EKF)",
              "Nav2 Navigation Stack",
              "Trajectory Generation"
            ],
            "learn": [
              "Simultaneous Localization and Mapping (SLAM) principles: 2D occupancy grid mapping with Slam Toolbox and Cartographer",
              "State estimation: Extended Kalman Filters (robot_localization package) fusing IMU and wheel odometry",
              "Navigation2 (Nav2): global planners (A*, Dijkstra), local planners (TEB, DWB), and obstacle costmaps",
              "Behavior trees: orchestrating autonomous task execution and error recovery routines in Nav2"
            ],
            "practice": [
              "Generate a 2D occupancy grid map of an unknown environment using simulated LiDAR and SLAM",
              "Configure Nav2 to autonomously navigate a mobile robot through complex dynamic obstacles"
            ],
            "build": "An autonomous mobile robotics system in ROS2 capable of real-time SLAM mapping, sensor fusion with EKF, and waypoint navigation.",
            "resources": [
              {
                "name": "ROS2 Navigation2 Guide",
                "type": "documentation",
                "difficulty": "advanced",
                "estimatedTime": "4 weeks",
                "url": "https://navigation.ros.org"
              }
            ]
          }
        ]
      },
      "industrial-automation": {
        "id": "industrial-automation",
        "name": "Industrial & Manufacturing Automation",
        "phases": [
          {
            "id": "ind-phase-2",
            "phase": 3,
            "title": "Industrial Control Systems, Electrical Schematics & Sensors",
            "description": "Master industrial automation electrical hardware: 24V DC circuitry, safety relays, variable frequency drives (VFD), and industrial fieldbus.",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "Industrial Electrical Schematics",
              "Industrial Sensors (Proximity / Optical)",
              "Variable Frequency Drives (VFD)",
              "Industrial Fieldbus"
            ],
            "learn": [
              "Reading and designing industrial control schematics: power circuits, control loops, and wiring diagrams (NFPA 79)",
              "Industrial sensors: inductive, capacitive, photoelectric, and ultrasonic sensors with NPN/PNP sourcing/sinking",
              "Actuators and power: pneumatic cylinders, directional solenoid valves, and variable frequency drives (VFDs)",
              "Industrial communication networks: Modbus TCP/IP, EtherNet/IP, PROFINET, and IO-Link protocols"
            ],
            "practice": [
              "Wire a physical or simulated 24V industrial control circuit with start/stop latching and emergency stop relays",
              "Configure a variable frequency drive (VFD) via industrial Ethernet to control AC induction motor ramp rates"
            ],
            "build": "An industrial automated conveyor control panel design: complete electrical schematics, VFD configuration, and safety interlock wiring.",
            "resources": [
              {
            "name": "OpenPLC Project: Open Source IEC 61131-3 Industrial Automation",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://openplcproject.com/"
          }
            ]
          },
          {
            "id": "ind-phase-3",
            "phase": 4,
            "title": "PLC Programming (Ladder Logic & Structured Text) & SCADA",
            "description": "Program industrial Programmable Logic Controllers (PLCs) in IEC 61131-3 languages, design SCADA HMI interfaces, and integrate safety PLCs.",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "PLC Programming (IEC 61131-3)",
              "Ladder Logic & Structured Text",
              "SCADA & HMI Design",
              "Safety PLC Systems"
            ],
            "learn": [
              "IEC 61131-3 programming languages: Ladder Diagram (LD), Structured Text (ST), and Function Block Diagram (FBD)",
              "PLC platforms: Siemens TIA Portal (S7-1200/1500) and Rockwell Studio 5000 (ControlLogix)",
              "Designing Human-Machine Interfaces (HMI) and SCADA systems (Ignition / FactoryTalk): alarm management and real-time trends",
              "Industrial functional safety standards (ISO 13849 / IEC 62061): safety PLCs, safety gates, and light curtains"
            ],
            "practice": [
              "Program a sequential packaging machine automated cycle using Structured Text with state machine architecture",
              "Design an operator HMI screen with visual equipment status, manual override controls, and active alarm banners"
            ],
            "build": "A complete PLC and SCADA industrial automation program controlling a multi-station manufacturing cell with emergency safety routines.",
            "resources": [
              {
                "name": "Inductive University: Ignition SCADA Training",
                "type": "course",
                "difficulty": "intermediate",
                "estimatedTime": "Ongoing",
                "url": "https://inductiveuniversity.com"
              }
            ]
          }
        ],
        "roleOverrides": {
          "plc-programmer": {
            "roleId": "plc-programmer",
            "roleTitle": "PLC & SCADA Programmer",
            "capstonePhase": {
              "id": "plc-programmer-capstone",
              "title": "Industrial Automation Capstone: Automated Manufacturing Cell PLC & SCADA System",
              "description": "Architect, program, and commission an automated manufacturing cell control system using IEC 61131-3 Ladder Logic/Structured Text, safety PLCs, and SCADA HMI.",
              "estimatedDuration": "Weeks 19–24",
              "skills": [
                "Production PLC Architecture",
                "Structured Text State Machines",
                "SCADA HMI Dashboard",
                "Industrial Safety Commissioning"
              ],
              "learn": [
                "Advanced Structured Text programming: user-defined data types (UDTs), add-on instructions (AOIs), and modular functional code",
                "OPC-UA data exchange protocols between shop-floor PLCs and enterprise MES/ERP databases",
                "Alarm rationalization following ISA-18.2 standards: priority levels, suppression, and operator response metrics",
                "Factory acceptance testing (FAT) and site commissioning procedures for industrial automation cells"
              ],
              "practice": [
                "Program a complex pick-and-place packaging workcell implementing ISA-88 batch state models",
                "Configure an Ignition SCADA project logging production throughput metrics and alarm history to an SQL database"
              ],
              "build": "A production-grade PLC and SCADA automation package: fully commented Structured Text PLC program, Ignition SCADA HMI project, electrical schematics, and factory commissioning checklist.",
              "resources": [
                {
            "name": "Siemens Industry Support: TIA Portal Getting Started & Tutorials",
            "type": "documentation",
            "difficulty": "advanced",
            "estimatedTime": "4 weeks",
            "url": "https://support.industry.siemens.com"
          }
              ]
            }
          }
        }
      },
      "robotic-perception-ai": {
        "id": "robotic-perception-ai",
        "name": "Robotic Perception, Vision & Manipulation",
        "phases": [
          {
            "id": "percep-phase-2",
            "phase": 3,
            "title": "Computer Vision for Robotics, OpenCV & Point Clouds",
            "description": "Master 2D image processing with OpenCV, 3D point cloud processing with PCL, camera calibration, and depth sensor pipelines.",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "OpenCV (Python/C++)",
              "Point Cloud Library (PCL)",
              "Camera Calibration",
              "Object Detection"
            ],
            "learn": [
              "Camera pinhole models, intrinsic/extrinsic parameters, lens distortion correction, and stereo camera depth estimation",
              "2D image processing: edge detection, color segmentation, contour analysis, and ArUco marker pose tracking",
              "3D point clouds: Point Cloud Library (PCL), voxel grid filtering, RANSAC plane fitting, and Euclidean cluster extraction",
              "Integrating RGB-D cameras (Intel RealSense, OAK-D) with ROS2 vision pipelines"
            ],
            "practice": [
              "Calibrate a camera using checkerboard patterns and calculate accurate 6-DOF camera pose relative to an ArUco marker",
              "Process raw 3D point clouds using PCL to segment tabletop surfaces and cluster target graspable objects"
            ],
            "build": "A real-time robotic vision pipeline in ROS2 detecting objects and publishing their 3D spatial coordinate transforms (TF2).",
            "resources": [
              {
            "name": "OpenCV Official User Guide & Python Tutorials",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "6 weeks",
            "url": "https://docs.opencv.org/4.x/d6/d00/tutorial_py_root.html"
          }
            ]
          },
          {
            "id": "percep-phase-3",
            "phase": 4,
            "title": "Robotic Manipulation, MoveIt2 & 6-DOF Grasp Planning",
            "description": "Plan collision-free trajectories for robotic arm manipulators using MoveIt2, inverse kinematics solvers, and grasp synthesis.",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "MoveIt2 Framework",
              "Motion Planning (OMPL)",
              "Grasp Pose Generation",
              "Trajectory Execution"
            ],
            "learn": [
              "MoveIt2 architecture: planning scene, collision checking, kinematics solvers (KDL, TRAC-IK, IKFast)",
              "Sampling-based motion planning: RRT, RRT*, and trajectory optimization in configuration space (C-space)",
              "6-DOF grasp pose generation: antipodal grasps, surface normal estimation, and gripper approach vectors",
              "Pick-and-place pipeline integration: vision detection, grasp generation, planning, and execution monitoring"
            ],
            "practice": [
              "Configure MoveIt2 for a 6-DOF robotic manipulator arm defining planning groups and end-effector links",
              "Implement an autonomous pick-and-place routine in simulation executing collision-free trajectories to sorted bins"
            ],
            "build": "An end-to-end vision-guided robotic manipulation package in ROS2 utilizing MoveIt2 to detect, grasp, and sort objects.",
            "resources": [
              {
                "name": "MoveIt2 Official Tutorials",
                "type": "documentation",
                "difficulty": "advanced",
                "estimatedTime": "4 weeks",
                "url": "https://moveit.picknik.ai"
              }
            ]
          }
        ]
      }
    }
  },
  "game-multimedia-design": {
    "pathSlug": "game-multimedia-design",
    "pathName": "Game & Interactive Media",
    "foundationalPhases": [
      {
        "id": "game-found-1",
        "phase": 1,
        "title": "Game Design Theory, MDA Framework & Paper Prototyping",
        "description": "Explore the Mechanics-Dynamics-Aesthetics (MDA) framework, player psychology, core game loops, and paper prototyping.",
        "estimatedDuration": "Weeks 1–4",
        "skills": [
          "Game Design Principles",
          "MDA Framework",
          "Core Gameplay Loops",
          "Paper Prototyping & Playtesting"
        ],
        "learn": [
          "Game design history and taxonomy: understanding genres, player motivations, and the anatomy of play",
          "The MDA framework: analyzing Mechanics (rules), Dynamics (system behavior), and Aesthetics (emotional resonance)",
          "Core gameplay loops: action, reward, progression, and feedback cycles that sustain player engagement",
          "Paper prototyping and playtesting: designing rules without code, observing player behavior, and gathering constructive feedback"
        ],
        "practice": [
          "Design and playtest a tabletop card or board game prototype isolating a single innovative core mechanic",
          "Write a formal game design ruleset and conduct a structured playtest session documenting player feedback and balance tweaks"
        ],
        "build": "A complete Game Design Document (GDD) and physical paper prototype for an original tabletop game with playtesting logs.",
        "resources": [
          {
            "name": "The Art of Game Design: A Book of Lenses (Jesse Schell)",
            "type": "book",
            "difficulty": "beginner",
            "estimatedTime": "4 weeks",
            "url": "https://www.schellgames.com/art-of-game-design"
          },
          {
            "name": "Game Maker's Toolkit: Game Design Fundamentals",
            "type": "course",
            "difficulty": "beginner",
            "estimatedTime": "2 weeks",
            "url": "https://www.youtube.com/c/MarkBrownGMT"
          }
        ]
      },
      {
        "id": "game-found-2",
        "phase": 2,
        "title": "Game Engine Architecture, Scripting Basics & 2D Prototyping",
        "description": "Learn modern game engine workflows (Godot / Unity), coordinate systems, physics engines, and basic C# / GDScript gameplay programming.",
        "estimatedDuration": "Weeks 5–8",
        "skills": [
          "Game Engine Workflows (Godot / Unity)",
          "Gameplay Scripting (C# / GDScript)",
          "2D Physics & Collisions",
          "State Machines & Input"
        ],
        "learn": [
          "Game engine architecture: scene hierarchies, node trees, component-based entity systems, and the game loop",
          "Gameplay scripting: handling player input, manipulating coordinate transforms, instantiating game objects, and event handling",
          "2D physics systems: kinematic vs. dynamic bodies, colliders, trigger volumes, and gravity simulation",
          "Game feel and audio: sprite animations, state machines for character actions, sound effect triggers, and UI score overlays"
        ],
        "practice": [
          "Program player character movement, jump mechanics, and double-jump logic with responsive controller feel in Godot or Unity",
          "Implement collision triggers that collect coins, update an on-screen score HUD, and trigger sound effects"
        ],
        "build": "A playable 2D game prototype featuring player controls, collectible objectives, score tracking, win/loss conditions, and audio feedback.",
        "resources": [
          {
            "name": "Godot Engine Official Getting Started & Tutorials",
            "type": "documentation",
            "difficulty": "beginner",
            "estimatedTime": "4 weeks",
            "url": "https://docs.godotengine.org/en/stable/getting_started/introduction/index.html"
          },
          {
            "name": "Unity Learn: Essentials Learning Pathway",
            "type": "course",
            "difficulty": "beginner",
            "estimatedTime": "4 weeks",
            "url": "https://learn.unity.com/pathway/unity-essentials"
          }
        ]
      }
    ],
    "defaultAdvancedPhases": [
      {
        "id": "game-adv-1",
        "phase": 3,
        "title": "Level Architecture, Game Systems & 3D Environments",
        "description": "Design 3D game levels, implement state machines for enemy AI, and build immersive game environments.",
        "estimatedDuration": "Weeks 5–12",
        "skills": [
          "Level Design",
          "Enemy AI & State Machines",
          "3D Environments"
        ],
        "learn": [
          "3D greyboxing, visual guidance, pacing, and sightline composition in level design",
          "Enemy AI architectures: finite state machines (FSM) and behavior trees",
          "Lighting, particle systems, post-processing, and game optimization"
        ],
        "practice": [
          "Greybox an interactive 3D level with puzzle mechanics and enemy encounters",
          "Program an enemy AI state machine with patrol, alert, and attack states"
        ],
        "build": "A polished 3D playable game level featuring structured environmental storytelling, enemy AI, and audio.",
        "resources": [
          {
            "name": "Unreal Engine Official Getting Started Documentation",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "6 weeks",
            "url": "https://dev.epicgames.com/documentation/en-us/unreal-engine"
          }
        ]
      }
    ],
    "specializationTracks": {
      "gameplay-mechanics": {
        "id": "gameplay-mechanics",
        "name": "Gameplay & Level Design",
        "phases": [
          {
            "id": "gameplay-phase-2",
            "phase": 3,
            "title": "Systems Design, Level Greyboxing & Unreal Engine Blueprints",
            "description": "Master visual scripting with Unreal Blueprints, 3D level greyboxing, player pacing, and environmental guidance.",
            "estimatedDuration": "Weeks 5–10",
            "skills": [
              "Unreal Engine Blueprints",
              "Level Greyboxing",
              "Player Pacing & Metrics",
              "Combat Systems"
            ],
            "learn": [
              "Visual scripting in Unreal Engine Blueprints: event dispatchers, interfaces, custom character controllers, and animation graphs",
              "Level design principles: metric-driven geometry, leading lines, framing, breadcrumbing, and landmark composition",
              "Combat and ability systems: hitbox/hurtbox registration, camera shakes, frame pauses, and game feel ('juice')",
              "Player pacing: intensity curves, risk-reward trade-offs, and gating mechanics"
            ],
            "practice": [
              "Greybox a 15-minute playable combat and traversal level in Unreal Engine utilizing geometry brushes",
              "Build a responsive melee or ranged combat system with animation blending and damage feedback"
            ],
            "build": "A complete playable level prototype in Unreal Engine featuring combat mechanics, scripted encounters, and level pacing.",
            "resources": [
              {
            "name": "Game Programming Patterns (Bob Nystrom)",
            "type": "book",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://gameprogrammingpatterns.com/"
          }
            ]
          },
          {
            "id": "gameplay-phase-3",
            "phase": 4,
            "title": "Game Economy Balancing, Narrative Systems & Game Capstone",
            "description": "Design game economies, systemic progression trees, narrative branching, and deliver a published vertical slice game.",
            "estimatedDuration": "Weeks 11–18",
            "skills": [
              "Game Economy Design",
              "Progression Trees",
              "Narrative Systems",
              "Vertical Slice Delivery"
            ],
            "learn": [
              "Game economy modeling: resource faucets, sinks, inflation prevention, and mathematical balancing in spreadsheets",
              "Player progression systems: skill trees, loot tables, XP curves, and reward schedules",
              "Narrative design: dialogue trees, environmental storytelling, quest trackers, and player choice branching",
              "Production vertical slice: bug tracking, performance profiling (60 FPS on target hardware), and build distribution"
            ],
            "practice": [
              "Model and simulate a complete crafting and currency game economy verifying mathematical balance",
              "Package and profile a standalone game build eliminating frame rate drops and memory bottlenecks"
            ],
            "build": "A published vertical slice game demonstrating deep gameplay mechanics, balanced economy systems, narrative quests, and audio.",
            "resources": [
              {
            "name": "Game Programming Patterns: Architecture for Games",
            "type": "book",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://gameprogrammingpatterns.com/"
          }
            ]
          }
        ]
      },
      "technical-art-xr": {
        "id": "technical-art-xr",
        "name": "Technical Art & XR Environments",
        "phases": [
          {
            "id": "techart-phase-2",
            "phase": 3,
            "title": "Shader Programming (HLSL), Material Graphs & Real-Time VFX",
            "description": "Master shader creation, vertex/fragment shaders in HLSL, Unreal Material Graphs, Niagara particle systems, and performance budgets.",
            "estimatedDuration": "Weeks 5–10",
            "skills": [
              "HLSL Shader Programming",
              "Material Graphs (Unreal)",
              "Real-Time VFX (Niagara)",
              "Draw Call Optimization"
            ],
            "learn": [
              "GPU rendering pipeline: vertex processing, rasterization, pixel/fragment shaders, and blending operations",
              "Math for technical art: dot products, cross products, UV manipulation, and trigonometric spatial offsets",
              "Advanced material graphs: PBR shading, subsurface scattering, parallax occlusion mapping, and custom HLSL nodes",
              "Real-time visual effects: particle simulations with Unreal Niagara / Unity VFX Graph and GPU sprite emitters"
            ],
            "practice": [
              "Write a custom procedural water or hologram shader using HLSL with vertex displacement and refraction",
              "Create a multi-stage combat VFX spell effect in Niagara combining emitters, ribbon trails, and dynamic point lights"
            ],
            "build": "A technical art portfolio showcase: interactive shader materials library, procedural VFX spells, and performance benchmarks.",
            "resources": [
              {
                "name": "The Book of Shaders",
                "type": "documentation",
                "difficulty": "intermediate",
                "estimatedTime": "4 weeks",
                "url": "https://thebookofshaders.com"
              }
            ]
          },
          {
            "id": "techart-phase-3",
            "phase": 4,
            "title": "XR Virtual Reality Development, Rigging & Spatial Interaction",
            "description": "Develop immersive virtual and augmented reality experiences using OpenXR, optimize frame rates for 90 FPS VR, and rig assets.",
            "estimatedDuration": "Weeks 11–18",
            "skills": [
              "OpenXR Framework",
              "VR Interaction Systems",
              "Technical Rigging",
              "VR Performance Profiling (90 FPS)"
            ],
            "learn": [
              "OpenXR standard: 6-DOF head and hand controller tracking, spatial anchors, and gesture recognition",
              "VR interaction mechanics: physics-based grabbing, throw velocities, spatial UI, and preventing virtual motion sickness",
              "Technical rigging and skinning: inverse kinematics (IK) setups, skin weighting, and skeletal deformers",
              "VR optimization: stereo instancing, foveated rendering, draw call reduction, and maintaining strict 90 FPS budgets"
            ],
            "practice": [
              "Build a physics-based VR hand interaction system allowing natural grabbing, throwing, and lever manipulation",
              "Profile a VR scene in Meta Quest Developer Hub to ensure draw calls and GPU frame times stay below 11ms"
            ],
            "build": "An immersive OpenXR Virtual Reality experience featuring physics-based hands, custom visual shaders, and 90 FPS mobile VR performance.",
            "resources": [
              {
            "name": "Khronos Group: OpenXR Standard & Cross-Platform VR/AR Development",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://www.khronos.org/openxr/"
          }
            ]
          }
        ]
      },
      "game-systems-audio": {
        "id": "game-systems-audio",
        "name": "Game Systems, Economy & Audio Design",
        "phases": [
          {
            "id": "audio-phase-2",
            "phase": 3,
            "title": "Interactive Game Audio, Sound Synthesis & Middleware (FMOD)",
            "description": "Master Foley sound recording, modular sound synthesis in DAWs, and audio middleware implementation in FMOD Studio.",
            "estimatedDuration": "Weeks 5–10",
            "skills": [
              "Sound Design & Foley Recording",
              "DAW Sound Synthesis",
              "Audio Middleware (FMOD Studio)",
              "Interactive Sound Parameters"
            ],
            "learn": [
              "Game audio principles: Diegetic vs. non-diegetic sound, audio frequency balancing, and dynamic range management",
              "Sound design in digital audio workstations (Pro Tools / Reaper / Ableton): layering, pitch shifting, and distortion",
              "Audio middleware architecture with FMOD Studio: multi-track events, sound banks, scatterer instruments, and parameter curves",
              "Interactive audio triggers: player footsteps modulated by surface material tags, weapon audio variations"
            ],
            "practice": [
              "Design and synthesize a complete sound palette for a sci-fi or fantasy game environment in a DAW",
              "Build an FMOD Studio project with dynamic footstep sounds that adapt to wood, concrete, and water surfaces"
            ],
            "build": "An interactive audio package in FMOD Studio featuring responsive parameter-driven sound events and spatial audio attenuation.",
            "resources": [
              {
                "name": "FMOD Studio Official Learning Materials",
                "type": "documentation",
                "difficulty": "intermediate",
                "estimatedTime": "3 weeks",
                "url": "https://www.fmod.com/learn"
              }
            ]
          },
          {
            "id": "audio-phase-3",
            "phase": 4,
            "title": "Adaptive Music Systems, 3D Spatial Audio & Audio Capstone",
            "description": "Implement horizontal re-sequencing and vertical re-orchestration adaptive music, 3D binaural spatialization, and engine integration.",
            "estimatedDuration": "Weeks 11–18",
            "skills": [
              "Adaptive Music Systems",
              "3D Binaural Spatialization",
              "Engine Audio Integration",
              "Audio Mixing & Mastering"
            ],
            "learn": [
              "Adaptive interactive music techniques: horizontal re-sequencing (branching tracks) and vertical re-orchestration (layer stems)",
              "3D spatial audio: distance attenuation curves, obstruction/occlusion raycasting, and binaural HRTF spatialization",
              "Integrating audio middleware with game engines (Unity / Unreal C# and Blueprint integration)",
              "Dynamic audio mixing: snapshot states (ducking music during dialogue or explosion shockwaves), LUFS loudness compliance"
            ],
            "practice": [
              "Compose and implement an interactive music system that smoothly transitions from ambient exploration to combat intensity",
              "Write game engine integration scripts managing FMOD event instances, occlusion filtering, and listener orientation"
            ],
            "build": "A complete adaptive game audio soundtrack and spatial sound design integration running live within a playable 3D game level.",
            "resources": [
              {
            "name": "Pure Data: Open Source Real-Time Audio Programming",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://puredata.info/docs/"
          }
            ]
          }
        ],
        "roleOverrides": {
          "interactive-audio-designer": {
            "roleId": "interactive-audio-designer",
            "roleTitle": "Interactive Game Audio Designer",
            "capstonePhase": {
              "id": "audio-designer-capstone",
              "title": "Game Audio Capstone: Complete Adaptive Audio & Dynamic Music System",
              "description": "Design, compose, implement, and mix an end-to-end interactive audio universe in FMOD/Wwise integrated into a playable game engine build.",
              "estimatedDuration": "Weeks 19–24",
              "skills": [
                "Full Adaptive Music Score",
                "3D Spatial Audio Mix",
                "FMOD/Wwise Integration",
                "Dynamic Snapshot Mixing"
              ],
              "learn": [
                "Advanced middleware mixing: setting up automated sidechain ducking, environment reverbs, and audio priority tiers",
                "Profiling game audio memory usage, streaming voice limits, and compression codec optimization (Vorbis/Opus)",
                "Designing high-impact game audio UX: UI clicks, reward stingers, narrative voiceover processing, and accessibility subtitles",
                "Authoring audio design documentation (GDD Audio Bible) and asset delivery manifests"
              ],
              "practice": [
                "Profile audio performance in a live game build ensuring audio thread CPU consumption remains under 3%",
                "Deliver a complete audio mix adhering to -24 LKFS broadcast and interactive loudness standards"
              ],
              "build": "A master game audio portfolio: full interactive FMOD/Wwise project, synchronized video gameplay capture demonstrating adaptive music, and complete sound design asset library.",
              "resources": [
                {
            "name": "Pure Data Official Audio Synthesis Tutorials",
            "type": "documentation",
            "difficulty": "advanced",
            "estimatedTime": "6 weeks",
            "url": "https://puredata.info/docs/"
          }
              ]
            }
          }
        }
      }
    }
  },
  "biomedical-pharmaceutical": {
    "pathSlug": "biomedical-pharmaceutical",
    "pathName": "Biomedical & Pharmaceutical",
    "foundationalPhases": [
      {
        "id": "biomed-found-1",
        "phase": 1,
        "title": "Biomedical Sciences, Physiology & Cellular Foundations",
        "description": "Study cellular biology, molecular biochemistry, organ system physiology, and the principles of scientific biological inquiry.",
        "estimatedDuration": "Weeks 1–4",
        "skills": [
          "Cellular Biology",
          "Organ System Physiology",
          "Biomolecules & Biochemistry",
          "Scientific Laboratory Safety"
        ],
        "learn": [
          "Cellular architecture: cell membrane permeability, organelle functions, energy generation (ATP), and cellular reproduction",
          "Biomolecules of life: structural classifications and roles of amino acids, proteins, carbohydrates, lipids, and nucleic acids",
          "Human physiological systems: circulatory, respiratory, digestive, and nervous system functions and homeostatic balance",
          "Laboratory safety principles: biosafety containment levels, personal protective equipment (PPE), and standard scientific metrics"
        ],
        "practice": [
          "Diagram cellular transport mechanisms and feedback loops regulating blood sugar and body temperature",
          "Map the physiological journey of nutrients and oxygen throughout human organ systems"
        ],
        "build": "An illustrated biomedical science atlas documenting cell organelles, macromolecule structures, and organ system homeostatic regulation.",
        "resources": [
          {
            "name": "Khan Academy: Biology & Human Physiology",
            "type": "course",
            "difficulty": "beginner",
            "estimatedTime": "4 weeks",
            "url": "https://www.khanacademy.org/science/biology"
          },
          {
            "name": "OpenStax: Anatomy and Physiology 2e",
            "type": "book",
            "difficulty": "beginner",
            "estimatedTime": "6 weeks",
            "url": "https://openstax.org/details/books/anatomy-and-physiology-2e"
          }
        ]
      },
      {
        "id": "biomed-found-2",
        "phase": 2,
        "title": "Organic Chemistry Principles & Applied Biomedical Research",
        "description": "Understand organic chemistry reaction mechanisms, functional groups, molecular interactions, and introductory biostatistical analysis.",
        "estimatedDuration": "Weeks 5–8",
        "skills": [
          "Organic Functional Groups",
          "Molecular Interactions & Bonding",
          "Biomedical Statistics",
          "Scientific Literature Appraisal"
        ],
        "learn": [
          "Organic chemistry foundations: covalent bonding, hybridization, stereochemistry, and functional group properties",
          "Molecular interactions in medicine: hydrogen bonds, hydrophobic interactions, drug-receptor lock-and-key mechanisms, and enzyme kinetics",
          "Biostatistics fundamentals: normal distributions, sample sizes, null hypothesis testing, p-values, and statistical power",
          "Scientific research appraisal: reading peer-reviewed journal articles, identifying control groups, and evaluating experimental bias"
        ],
        "practice": [
          "Build 3D models of therapeutic molecules identifying polar and non-polar functional groups that interact with cellular receptors",
          "Analyze a simulated clinical study dataset calculating statistical significance and confidence intervals"
        ],
        "build": "A biomedical experimental design proposal and chemical interaction compendium detailing molecular structures, functional groups, and statistical hypothesis tests.",
        "resources": [
          {
            "name": "Master Organic Chemistry: Reaction Guide & Functional Groups",
            "type": "documentation",
            "difficulty": "beginner",
            "estimatedTime": "3 weeks",
            "url": "https://www.masterorganicchemistry.com/reaction-guide/"
          },
          {
            "name": "Introduction to Biostatistics (BMJ Resources)",
            "type": "documentation",
            "difficulty": "beginner",
            "estimatedTime": "2 weeks",
            "url": "https://www.bmj.com/about-bmj/resources-readers/publications/statistics-square-one"
          }
        ]
      }
    ],
    "defaultAdvancedPhases": [
      {
        "id": "biomed-adv-1",
        "phase": 3,
        "title": "Medical Device Technologies & Pharmacology",
        "description": "Understand bioinstrumentation circuits, pharmacological drug delivery, and healthcare compliance.",
        "estimatedDuration": "Weeks 7–14",
        "skills": [
          "Bioinstrumentation",
          "Drug Delivery",
          "Medical Compliance"
        ],
        "learn": [
          "Bio-potential signal processing: ECG/EMG amplification, filtering, and noise rejection",
          "Pharmacokinetics (ADME) and formulation kinetics",
          "Medical regulatory standards: ISO 13485, FDA regulations, and GMP guidelines"
        ],
        "practice": [
          "Design an analog bio-potential filter circuit for ECG signal capture",
          "Model drug release kinetics in simulated physiological media"
        ],
        "build": "A biomedical engineering prototype package with circuit schematics and regulatory compliance documentation.",
        "resources": [
          {
            "name": "NIH NIBIB: Science Education & Biomedical Engineering Topics",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://www.nibib.nih.gov/science-education/science-topics"
          }
        ]
      }
    ],
    "specializationTracks": {
      "medical-devices": {
        "id": "medical-devices",
        "name": "Medical Devices & Bioinstrumentation",
        "phases": [
          {
            "id": "meddev-phase-2",
            "phase": 3,
            "title": "Bioinstrumentation, Biosensors & Medical Circuit Design",
            "description": "Design low-noise bio-potential amplifiers (ECG/EMG), physiological optical sensors (PPG/SpO2), and embedded firmware.",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "Bio-Potential Amplifiers (ECG / EMG)",
              "Optical Biosensors (PPG)",
              "Low-Noise Analog Design",
              "Embedded Medical Firmware"
            ],
            "learn": [
              "Bio-potential signal acquisition: instrumentation amplifiers, high Common-Mode Rejection Ratio (CMRR), and Right Leg Drive circuits",
              "Optical biosensing: photoplethysmography (PPG), pulse oximetry LED drive circuits, and transimpedance amplifiers",
              "Analog filtering: active Butterworth bandpass filters eliminating 50/60 Hz electrical interference and motion artifact",
              "Electrical patient safety standards: IEC 60601-1 leakage current limits and patient isolation barriers"
            ],
            "practice": [
              "Design and simulate an active ECG instrumentation amplifier circuit achieving > 100 dB CMRR",
              "Program embedded microcontroller firmware sampling analog biosensors and calculating pulse heart rate in real time"
            ],
            "build": "A working biometric sensor acquisition prototype (ECG or PPG) with analog filtering circuits, microcontroller firmware, and live waveform plotting.",
            "resources": [
              {
            "name": "World Health Organization: Medical Devices Technical Overview",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://www.who.int/health-topics/medical-devices"
          }
            ]
          },
          {
            "id": "meddev-phase-3",
            "phase": 4,
            "title": "Medical Device Prototyping, Risk Management & FDA 510(k)",
            "description": "Model biocompatible device enclosures, execute ISO 14971 risk management, and assemble FDA 510(k) premarket notification submissions.",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "Medical CAD Prototyping",
              "Biocompatibility Standards (ISO 10993)",
              "Risk Management (ISO 14971)",
              "FDA 510(k) Premarket Notification"
            ],
            "learn": [
              "Medical device mechanical CAD modeling: ergonomic enclosures, liquid ingress protection (IP67), and rapid 3D prototyping",
              "Material biocompatibility standards (ISO 10993): cytotoxicity, irritation, and medical-grade polymer selection",
              "Medical device risk management (ISO 14971): Failure Mode and Effects Analysis (FMEA) and hazard mitigation matrices",
              "FDA regulatory pathways: Class I, II, III designations, substantial equivalence determinations, and 510(k) dossier preparation"
            ],
            "practice": [
              "Conduct a comprehensive ISO 14971 Risk Analysis and FMEA matrix for a wearable diagnostic medical device",
              "Draft a formal FDA 510(k) substantial equivalence comparison table against an approved predicate device"
            ],
            "build": "A complete medical device design history file (DHF) package: enclosure CAD models, ISO 14971 risk analysis, and FDA 510(k) submission dossier.",
            "resources": [
              {
                "name": "FDA 510(k) Submission Guidance",
                "type": "documentation",
                "difficulty": "advanced",
                "estimatedTime": "3 weeks",
                "url": "https://www.fda.gov/medical-devices/premarket-submissions-selecting-and-preparing-correct-submission/premarket-notification-510k"
              }
            ]
          }
        ]
      },
      "pharma-therapeutics": {
        "id": "pharma-therapeutics",
        "name": "Pharmaceutical Formulation & Clinical Trials",
        "phases": [
          {
            "id": "pharma-phase-2",
            "phase": 3,
            "title": "Pharmaceutical Formulation, Pharmacokinetics & GMP",
            "description": "Master solid and liquid dosage formulations, dissolution testing, pharmacokinetics modeling (ADME), and Good Manufacturing Practice (GMP).",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "Drug Formulation",
              "Pharmacokinetics (ADME)",
              "Dissolution Testing",
              "Good Manufacturing Practice (GMP)"
            ],
            "learn": [
              "Dosage form development: tablet compression, excipient selection, controlled-release polymers, and sterile injectable formulations",
              "Pharmacokinetics (PK) and pharmacodynamics (PD): half-life (t1/2), volume of distribution, bioavailability, and clearance kinetics",
              "USP dissolution testing standards and analytical chromatography (HPLC) for drug potency verification",
              "Current Good Manufacturing Practice (cGMP / 21 CFR Part 210/211): cleanroom air handling, batch records, and validation protocols"
            ],
            "practice": [
              "Calculate pharmacokinetic parameters and model plasma concentration-time curves using non-compartmental analysis",
              "Draft an audit-ready pharmaceutical master batch production record following strict cGMP guidelines"
            ],
            "build": "A complete pharmaceutical formulation development report: pre-formulation stability data, dissolution curves, and cGMP batch records.",
            "resources": [
              {
            "name": "NIH NCATS: Translational Science & Drug Development Education",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://ncats.nih.gov/training-education"
          }
            ]
          },
          {
            "id": "pharma-phase-3",
            "phase": 4,
            "title": "Clinical Trial Protocols, Regulatory Affairs (IND/NDA) & Trial Coordination",
            "description": "Design clinical trial protocols (Phases I–IV), understand ICH-GCP ethical standards, and author FDA Investigational New Drug (IND) dossiers.",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "Clinical Trial Protocol Design",
              "ICH-GCP Guidelines",
              "IRB Submissions & Consent",
              "Regulatory Affairs (IND / NDA)"
            ],
            "learn": [
              "Clinical trial phases (Phase I safety, Phase II efficacy, Phase III confirmatory, Phase IV post-market surveillance)",
              "International Council for Harmonisation - Good Clinical Practice (ICH-GCP E6 R2) ethical and quality standards",
              "Authoring clinical study protocols: primary/secondary endpoints, inclusion/exclusion criteria, and randomization protocols",
              "Institutional Review Board (IRB) submissions, informed consent forms (ICF), and FDA IND/NDA regulatory submission structures"
            ],
            "practice": [
              "Draft a Phase II clinical trial study protocol including patient eligibility criteria and statistical sample size justifications",
              "Design an informed consent document and adverse event reporting SOP compliant with ICH-GCP standards"
            ],
            "build": "A clinical trial protocol package: clinical study protocol document, patient informed consent form, and trial operational timeline.",
            "resources": [
              {
            "name": "ICH: Efficacy Guidelines & Good Clinical Practice (GCP)",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "3 weeks",
            "url": "https://www.ich.org/page/efficacy-guidelines"
          }
            ]
          }
        ],
        "roleOverrides": {
          "clinical-trials-coord": {
            "roleId": "clinical-trials-coord",
            "roleTitle": "Clinical Trial Coordinator",
            "capstonePhase": {
              "id": "clinical-coordinator-capstone",
              "title": "Clinical Trial Capstone: GCP Trial Management Dossier & IRB Package",
              "description": "Coordinate an end-to-end clinical trial study startup package: protocol operationalization, IRB submission, adverse event management, and audit readiness.",
              "estimatedDuration": "Weeks 19–24",
              "skills": [
                "Trial Startup Operations",
                "IRB Regulatory Dossier",
                "Adverse Event (AE) Reporting",
                "GCP Audit Readiness"
              ],
              "learn": [
                "Operationalizing clinical protocols into clinical site standard operating procedures (SOPs)",
                "Managing investigator regulatory binders: FDA Form 1572, financial disclosures, and curriculum vitae verification",
                "Serious Adverse Event (SAE) reporting workflows and expedited safety notifications to regulatory bodies",
                "Electronic Data Capture (EDC) systems and preparing clinical sites for FDA sponsor audit inspections"
              ],
              "practice": [
                "Assemble an audit-ready Trial Master File (TMF) and site regulatory binder for a multi-center clinical study",
                "Execute a simulated Serious Adverse Event (SAE) expedited notification within mandatory 24-hour reporting deadlines"
              ],
              "build": "A complete Clinical Trial Site Operations and Regulatory Dossier: approved protocol operations manual, IRB submission package, informed consent documents, and SAE management workflow.",
              "resources": [
                {
            "name": "ClinicalTrials.gov: Study Basics & Clinical Research Fundamentals",
            "type": "documentation",
            "difficulty": "advanced",
            "estimatedTime": "4 weeks",
            "url": "https://clinicaltrials.gov/study-basics"
          }
              ]
            }
          },
          "clinical-trials-manager": {
            "roleId": "clinical-trials-manager",
            "roleTitle": "Clinical Trial Coordinator",
            "capstonePhase": {
              "id": "clinical-coordinator-capstone",
              "title": "Clinical Trial Capstone: GCP Trial Management Dossier & IRB Package",
              "description": "Coordinate an end-to-end clinical trial study startup package: protocol operationalization, IRB submission, adverse event management, and audit readiness.",
              "estimatedDuration": "Weeks 19–24",
              "skills": [
                "Trial Startup Operations",
                "IRB Regulatory Dossier",
                "Adverse Event (AE) Reporting",
                "GCP Audit Readiness"
              ],
              "learn": [
                "Operationalizing clinical protocols into clinical site standard operating procedures (SOPs)",
                "Managing investigator regulatory binders: FDA Form 1572, financial disclosures, and curriculum vitae verification",
                "Serious Adverse Event (SAE) reporting workflows and expedited safety notifications to regulatory bodies",
                "Electronic Data Capture (EDC) systems and preparing clinical sites for FDA sponsor audit inspections"
              ],
              "practice": [
                "Assemble an audit-ready Trial Master File (TMF) and site regulatory binder for a multi-center clinical study",
                "Execute a simulated Serious Adverse Event (SAE) expedited notification within mandatory 24-hour reporting deadlines"
              ],
              "build": "A complete Clinical Trial Site Operations and Regulatory Dossier: approved protocol operations manual, IRB submission package, informed consent documents, and SAE management workflow.",
              "resources": [
                {
            "name": "ClinicalTrials.gov: Study Basics & Clinical Research Fundamentals",
            "type": "documentation",
            "difficulty": "advanced",
            "estimatedTime": "4 weeks",
            "url": "https://clinicaltrials.gov/study-basics"
          }
              ]
            }
          }
        }
      },
      "bioinformatics-precision-therapeutics": {
        "id": "bioinformatics-precision-therapeutics",
        "name": "Bioinformatics & Precision Therapeutics",
        "phases": [
          {
            "id": "bioinf-phase-2",
            "phase": 3,
            "title": "Genomic Sequencing Pipelines, Biopython & Variant Calling",
            "description": "Process next-generation sequencing (NGS) data: FASTQ quality trimming, BWA alignment, SAMtools processing, and GATK variant calling.",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "NGS Sequencing Pipelines",
              "Biopython & R",
              "Sequence Alignment (BWA / Bowtie)",
              "Variant Calling (GATK / VCF)"
            ],
            "learn": [
              "Next-Generation Sequencing technologies: Illumina short-read vs. PacBio/Oxford Nanopore long-read sequencing mechanics",
              "Bioinformatics command-line tools: FastQC quality control, Trimmomatic trimming, and BWA-MEM reference genome alignment",
              "SAM/BAM file manipulation using SAMtools: sorting, indexing, duplicate marking with Picard, and depth calculation",
              "Variant calling workflows: GATK Best Practices pipeline generating Variant Call Format (VCF) files"
            ],
            "practice": [
              "Write a Snakemake or Nextflow automated pipeline processing raw FASTQ reads to a filtered, annotated VCF file",
              "Use Biopython to parse genomic sequence files, calculate GC content, and translate reading frames programmatically"
            ],
            "build": "An automated next-generation sequencing analysis pipeline in Nextflow/Snakemake outputting annotated genetic variants.",
            "resources": [
              {
            "name": "GATK Official Documentation & Best Practices Workflows",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://gatk.broadinstitute.org/hc/en-us"
          }
            ]
          },
          {
            "id": "bioinf-phase-3",
            "phase": 4,
            "title": "RNA-Seq Transcriptomics, Precision Oncology & Biomarkers",
            "description": "Perform differential gene expression analysis with DESeq2, identify cancer driver mutations, and evaluate targeted biomarker therapeutics.",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "RNA-Seq Differential Expression (DESeq2)",
              "Pathway Enrichment Analysis",
              "Precision Oncology Biomarkers",
              "Targeted Therapeutics"
            ],
            "learn": [
              "RNA-seq data quantification: pseudo-alignment with Kallisto/Salmon and gene-level count matrix generation",
              "Differential expression analysis in R using DESeq2: normalization, dispersion estimation, and volcano plot visualizations",
              "Pathway enrichment and functional annotation: Gene Ontology (GO) and KEGG pathway overrepresentation analysis",
              "Precision oncology databases (TCGA, ClinVar, COSMIC): identifying actionable driver mutations and targeted drug candidates"
            ],
            "practice": [
              "Execute a differential gene expression analysis in R comparing tumor vs. healthy tissue cohorts using DESeq2",
              "Perform gene set enrichment analysis (GSEA) to identify activated oncogenic signaling pathways"
            ],
            "build": "A precision oncology bioinformatics capstone report: differential expression analysis, volcano plots, pathway enrichment, and targeted biomarker candidates.",
            "resources": [
              {
                "name": "Bioconductor: RNA-seq Workflow",
                "type": "documentation",
                "difficulty": "advanced",
                "estimatedTime": "3 weeks",
                "url": "https://www.bioconductor.org/help/workflows/rnaseqGene/"
              }
            ]
          }
        ]
      }
    }
  },
  "cloud-infrastructure": {
    "pathSlug": "cloud-infrastructure",
    "pathName": "Cloud & Infrastructure Systems",
    "foundationalPhases": [
      {
        "id": "cloud-found-1",
        "phase": 1,
        "title": "Linux Systems, Networking & Cloud Primitives",
        "description": "Master Linux command-line operations, file system architecture, shell scripting, and core computer networking concepts.",
        "estimatedDuration": "Weeks 1–4",
        "skills": [
          "Linux System Administration",
          "Bash Shell Scripting",
          "Networking & DNS Primitives",
          "Virtualization Concepts"
        ],
        "learn": [
          "Linux system administration: process management, systemd services, package managers, and cron jobs",
          "Bash shell scripting: automation scripts, environment variables, exit codes, and text processing (grep, awk, sed)",
          "Networking fundamentals for the cloud: CIDR blocks, subnetting, DNS resolution, and HTTP/HTTPS protocol flows",
          "Virtualization basics: hypervisors, virtual machines, resource allocation, and cloud compute paradigms"
        ],
        "practice": [
          "Write automated Bash scripts to monitor server disk, memory, and CPU utilization with alert thresholds",
          "Configure a local Linux virtual machine with custom web server hosting and local DNS hostname mapping"
        ],
        "build": "An automated Linux server provisioning script that configures user environments, firewall rules, and scheduled system health checks.",
        "resources": [
          {
            "name": "Linux Journey: Grasshopper to Hero",
            "type": "documentation",
            "difficulty": "beginner",
            "estimatedTime": "3 weeks",
            "url": "https://linuxjourney.com"
          },
          {
            "name": "freeCodeCamp: Linux Command Line & Bash Guide",
            "type": "course",
            "difficulty": "beginner",
            "estimatedTime": "3 weeks",
            "url": "https://www.freecodecamp.org/news/linux-command-line-bash-tutorial/"
          }
        ]
      },
      {
        "id": "cloud-found-2",
        "phase": 2,
        "title": "Applied Cloud Architecture, Infrastructure as Code & Container Basics",
        "description": "Deploy core cloud infrastructure (VPCs, compute instances, object storage), containerize services with Docker, and write basic IaC.",
        "estimatedDuration": "Weeks 5–8",
        "skills": [
          "Cloud Infrastructure Primitives (Compute / Storage / VPC)",
          "Docker Containerization",
          "Basic Terraform / IaC",
          "Cloud Security & IAM"
        ],
        "learn": [
          "Core cloud primitives: Virtual Private Clouds (VPC), public/private subnets, security groups, and object storage",
          "Identity & Access Management (IAM): roles, policies, multi-factor authentication, and the principle of least privilege",
          "Containerization with Docker: writing Dockerfiles, container lifecycles, volume mounts, and multi-container Docker Compose",
          "Infrastructure as Code (IaC) fundamentals: declarative configuration, Terraform state, and reproducible infrastructure"
        ],
        "practice": [
          "Containerize a multi-tier web application using Docker and orchestrate services with Docker Compose",
          "Write Terraform configurations to provision a secure VPC network with compute instances and cloud storage buckets"
        ],
        "build": "A cloud-hosted containerized web service deployed inside a custom VPC with security groups, automated health checks, and Terraform provisioning.",
        "resources": [
          {
            "name": "AWS Cloud Practitioner Essentials",
            "type": "course",
            "difficulty": "beginner",
            "estimatedTime": "3 weeks",
            "url": "https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/"
          },
          {
            "name": "Docker Documentation: Getting Started",
            "type": "documentation",
            "difficulty": "beginner",
            "estimatedTime": "2 weeks",
            "url": "https://docs.docker.com/get-started/"
          }
        ]
      }
    ],
    "defaultAdvancedPhases": [
      {
        "id": "cloud-adv-1",
        "phase": 3,
        "title": "Infrastructure as Code & Containerized Deployments",
        "description": "Provision cloud infrastructure using Terraform, containerize services with Docker, and orchestrate containers with Kubernetes.",
        "estimatedDuration": "Weeks 7–14",
        "skills": [
          "Terraform (IaC)",
          "Docker Containers",
          "Kubernetes Core",
          "Cloud CI/CD"
        ],
        "learn": [
          "Infrastructure as Code (IaC) with Terraform: state files, modules, providers, and plan/apply workflows",
          "Docker containerization: Dockerfile optimization, multi-stage builds, and container image registries",
          "Kubernetes fundamentals: Pods, Deployments, Services, ConfigMaps, and Ingress controllers",
          "Automated cloud CI/CD pipelines deploying container images directly to cloud compute clusters"
        ],
        "practice": [
          "Write reusable Terraform modules provisioning database and compute clusters with remote state locking",
          "Deploy a multi-service containerized application onto a managed Kubernetes cluster (EKS/GKE)"
        ],
        "build": "An automated cloud infrastructure pipeline provisioning containerized microservices via Terraform and GitHub Actions.",
        "resources": [
          {
            "name": "HashiCorp Terraform Associate Tutorials",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "3 weeks",
            "url": "https://developer.hashicorp.com/terraform/tutorials"
          }
        ]
      }
    ],
    "specializationTracks": {
      "cloud-architecture": {
        "id": "cloud-architecture",
        "name": "Cloud Architecture & Platforms",
        "phases": [
          {
            "id": "cloud-arch-phase-2",
            "phase": 3,
            "title": "Enterprise Multi-Cloud Architecture & High Availability",
            "description": "Architect resilient multi-region architectures, VPC peering, transit gateways, disaster recovery strategies, and Well-Architected Frameworks.",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "Multi-Region Architecture",
              "AWS Well-Architected Framework",
              "VPC Transit Gateways",
              "Disaster Recovery (RTO/RPO)"
            ],
            "learn": [
              "AWS Well-Architected Framework pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability",
              "Multi-region and hybrid network topology: AWS Transit Gateway, Direct Connect, VPN tunnels, and global DNS routing with Route 53",
              "Disaster recovery strategies: Backup & Restore, Pilot Light, Warm Standby, and Multi-Region Active-Active failover",
              "Serverless compute architectures: event-driven architectures with AWS Lambda, EventBridge, SQS, and API Gateway"
            ],
            "practice": [
              "Architect an active-active multi-region database and compute cluster with cross-region read replicas",
              "Conduct an architectural Well-Architected review on an existing enterprise cloud deployment identifying resiliency risks"
            ],
            "build": "An enterprise-grade multi-region cloud architecture blueprint complete with cross-region replication, transit gateway routing, and failover runbooks.",
            "resources": [
              {
                "name": "AWS Well-Architected Framework Whitepapers",
                "type": "documentation",
                "difficulty": "advanced",
                "estimatedTime": "3 weeks",
                "url": "https://aws.amazon.com/architecture/well-architected/"
              }
            ]
          },
          {
            "id": "cloud-arch-phase-3",
            "phase": 4,
            "title": "Cloud Migration, FinOps & Enterprise Governance",
            "description": "Lead enterprise cloud migrations (6 R's), implement FinOps cloud cost optimization, and enforce organizational policy guardrails.",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "Cloud Migration Strategies (6 R's)",
              "FinOps & Cost Governance",
              "AWS Organizations & SCPs",
              "Enterprise Security Guardrails"
            ],
            "learn": [
              "Cloud migration strategies: Rehost, Replatform, Repurchase, Refactor, Retire, and Retain (6 R's methodology)",
              "FinOps principles: cloud cost visibility, unit economics, Reserved Instances / Savings Plans, and automated idle resource termination",
              "Multi-account governance: AWS Organizations, Control Tower, Service Control Policies (SCPs), and consolidated billing",
              "Enterprise compliance monitoring with AWS Config, CloudTrail audits, and automated remediation rules"
            ],
            "practice": [
              "Design a phased migration roadmap transitioning a legacy on-premise monolithic application to cloud-native microservices",
              "Perform a FinOps audit analyzing cloud spend metrics and implementing cost-saving automation policies"
            ],
            "build": "A cloud migration and governance master plan featuring TCO economic analysis, multi-account SCP matrices, and FinOps cost dashboards.",
            "resources": [
              {
                "name": "FinOps Foundation Framework",
                "type": "documentation",
                "difficulty": "advanced",
                "estimatedTime": "2 weeks",
                "url": "https://www.finops.org/framework/"
              }
            ]
          }
        ],
        "roleOverrides": {
          "cloud-solutions-arch": {
            "roleId": "cloud-solutions-arch",
            "roleTitle": "Cloud Solutions Architect",
            "capstonePhase": {
              "id": "cloud-arch-capstone",
              "title": "Cloud Architecture Capstone: Enterprise Multi-Region Resilient Platform Blueprint",
              "description": "Architect and defend an enterprise-scale multi-region cloud architecture supporting 99.999% SLA, zero-data-loss failover, and audited FinOps optimization.",
              "estimatedDuration": "Weeks 19–24",
              "skills": [
                "Enterprise Cloud Blueprint",
                "Zero-Downtime DR Drills",
                "Cost Optimization Modeling",
                "Executive Architecture Defense"
              ],
              "learn": [
                "Designing global distributed systems with sub-second RTO and zero RPO disaster recovery guarantees",
                "Advanced multi-tenant isolation, enterprise data classification, and automated security governance",
                "Translating complex business requirements into high-level system architecture and total cost of ownership models",
                "Defending architectural trade-offs before executive review boards and enterprise risk committees"
              ],
              "practice": [
                "Execute a simulated complete regional blackout failover exercise in an enterprise sandbox",
                "Present a complete cloud migration and architecture proposal to a simulated CTO and executive committee"
              ],
              "build": "A client-ready Enterprise Cloud Architecture Dossier: full Terraform infrastructure code, multi-region architecture diagrams, disaster recovery SOPs, and FinOps cost model.",
              "resources": [
                {
                  "name": "Google Cloud Architecture Framework",
                  "type": "documentation",
                  "difficulty": "advanced",
                  "estimatedTime": "3 weeks",
                  "url": "https://cloud.google.com/architecture/framework"
                }
              ]
            }
          },
          "cloud-systems-architect": {
            "roleId": "cloud-systems-architect",
            "roleTitle": "Cloud Solutions Architect",
            "capstonePhase": {
              "id": "cloud-arch-capstone-alias",
              "title": "Cloud Architecture Capstone: Enterprise Multi-Region Resilient Platform Blueprint",
              "description": "Architect and defend an enterprise-scale multi-region cloud architecture supporting 99.999% SLA, zero-data-loss failover, and audited FinOps optimization.",
              "estimatedDuration": "Weeks 19–24",
              "skills": [
                "Enterprise Cloud Blueprint",
                "Zero-Downtime DR Drills",
                "Cost Optimization Modeling",
                "Executive Architecture Defense"
              ],
              "learn": [
                "Designing global distributed systems with sub-second RTO and zero RPO disaster recovery guarantees",
                "Advanced multi-tenant isolation, enterprise data classification, and automated security governance",
                "Translating complex business requirements into high-level system architecture and total cost of ownership models",
                "Defending architectural trade-offs before executive review boards and enterprise risk committees"
              ],
              "practice": [
                "Execute a simulated complete regional blackout failover exercise in an enterprise sandbox",
                "Present a complete cloud migration and architecture proposal to a simulated CTO and executive committee"
              ],
              "build": "A client-ready Enterprise Cloud Architecture Dossier: full Terraform infrastructure code, multi-region architecture diagrams, disaster recovery SOPs, and FinOps cost model.",
              "resources": [
                {
                  "name": "Google Cloud Architecture Framework",
                  "type": "documentation",
                  "difficulty": "advanced",
                  "estimatedTime": "3 weeks",
                  "url": "https://cloud.google.com/architecture/framework"
                }
              ]
            }
          }
        }
      },
      "devops-systems": {
        "id": "devops-systems",
        "name": "DevOps & Systems Automation",
        "phases": [
          {
            "id": "devops-phase-2",
            "phase": 3,
            "title": "CI/CD Pipeline Automation & Infrastructure as Code",
            "description": "Master continuous integration and delivery with GitHub Actions, reusable Terraform modules, Packer image building, and Helm charts.",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "Advanced CI/CD (GitHub Actions / GitLab CI)",
              "Terraform Modularization",
              "Helm Chart Development",
              "Automated Testing in Pipelines"
            ],
            "learn": [
              "Advanced pipeline architecture: matrix builds, self-hosted runners, caching strategies, and environment promotion gates",
              "Terraform module design: dynamic blocks, terragrunt state DRYing, and automated module testing with Terratest",
              "Immutable infrastructure: building golden machine images using Packer and Ansible configuration scripts",
              "Kubernetes packaging with Helm: templating values, chart dependencies, and automated Helm release rollouts"
            ],
            "practice": [
              "Build a multi-stage CI/CD pipeline running linters, unit tests, security scans, and preview environment deployments",
              "Author a production-ready Helm chart deploying a high-availability microservice with auto-scaling rules"
            ],
            "build": "A complete automated software delivery pipeline provisioning environments with Terraform and deploying via Helm to Kubernetes.",
            "resources": [
              {
            "name": "The DevOps Handbook (IT Revolution Resources)",
            "type": "book",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://itrevolution.com/product/the-devops-handbook/"
          }
            ]
          },
          {
            "id": "devops-phase-3",
            "phase": 4,
            "title": "GitOps, Observability & Kubernetes Production Orchestration",
            "description": "Implement declarative GitOps with ArgoCD, distributed observability with Prometheus/Grafana/OpenTelemetry, and progressive canary deployments.",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "GitOps (ArgoCD / Flux)",
              "Prometheus & Grafana",
              "OpenTelemetry Distributed Tracing",
              "Progressive Delivery (Argo Rollouts)"
            ],
            "learn": [
              "GitOps principles: single source of truth in Git, automated drift detection, and self-healing reconciliation with ArgoCD",
              "Telemetry collection: Prometheus metrics scraping, PromQL alert rules, and centralized Grafana dashboarding",
              "Distributed tracing with OpenTelemetry and Jaeger: trace context propagation and latency bottleneck identification",
              "Canary releases and progressive delivery using Argo Rollouts with automated metric-based rollback criteria"
            ],
            "practice": [
              "Deploy and configure an ArgoCD GitOps workflow synchronizing application state across staging and production clusters",
              "Instrument microservices with OpenTelemetry and configure Grafana dashboards alerting on error budget burn rates"
            ],
            "build": "A production-grade GitOps platform with automated ArgoCD reconciliation, canary rollouts, and comprehensive Prometheus alerting.",
            "resources": [
              {
            "name": "ArgoCD Official Documentation & Getting Started",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "2 weeks",
            "url": "https://argo-cd.readthedocs.io/en/stable/"
          }
            ]
          }
        ]
      },
      "network-distributed": {
        "id": "network-distributed",
        "name": "Network & Distributed Systems",
        "phases": [
          {
            "id": "net-phase-2",
            "phase": 3,
            "title": "Software-Defined Networking (SDN), BGP & Hybrid Interconnect",
            "description": "Master enterprise routing protocols, BGP peering, Software-Defined Networking (SDN), WireGuard VPN meshes, and hybrid cloud interconnect.",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "BGP Peering & Autonomous Systems",
              "Software-Defined Networking (SDN)",
              "WireGuard VPN Meshes",
              "Hybrid Cloud Interconnect"
            ],
            "learn": [
              "Border Gateway Protocol (BGP) mechanics: path attributes, route propagation, autonomous systems (AS), and peering policies",
              "Software-Defined Networking (SDN) architectures: OpenFlow, virtual overlay networks, and VXLAN packet encapsulation",
              "High-security VPN mesh networks: WireGuard protocol, mutual cryptographic key authentication, and split-tunneling",
              "Enterprise hybrid cloud connections: AWS Direct Connect, Azure ExpressRoute, cross-connect circuits, and redundant failovers"
            ],
            "practice": [
              "Configure a virtual BGP network peering topology utilizing BIRD / FRRouting in simulated Linux namespaces",
              "Deploy a secure, low-latency WireGuard mesh connecting on-premise hardware to cloud virtual private clouds"
            ],
            "build": "A hybrid cloud networking blueprint with redundant BGP peering, automated failover routes, and encrypted WireGuard mesh tunnels.",
            "resources": [
              {
            "name": "Khan Academy: The Internet & Computer Networking",
            "type": "course",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://www.khanacademy.org/computing/computers-and-internet-code-org/internet-works-unit"
          }
            ]
          },
          {
            "id": "net-phase-3",
            "phase": 4,
            "title": "Kernel Network Tuning, eBPF & High-Throughput Edge Computing",
            "description": "Optimize Linux kernel networking parameters, inspect packet processing with eBPF, deploy Envoy service proxies, and configure global CDNs.",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "Linux Kernel Network Tuning",
              "eBPF Packet Filtering",
              "Envoy Proxy & Service Mesh",
              "Edge CDN Architectures"
            ],
            "learn": [
              "Linux network stack optimization: TCP buffer sizing, socket options (SO_REUSEPORT), epoll I/O multiplexing, and DPDK",
              "Extended Berkeley Packet Filter (eBPF): writing XDP (eXpress Data Path) kernel programs for ultra-fast packet filtering and observability",
              "Service proxying with Envoy: filter chains, HTTP/2 & gRPC multiplexing, connection pooling, and circuit breaking",
              "Global Content Delivery Networks (CDNs): edge caching strategies, cache invalidation, and edge worker computing (Cloudflare Workers)"
            ],
            "practice": [
              "Write a basic eBPF program running at the XDP layer that drops malicious DDoS traffic before reaching the kernel TCP stack",
              "Configure Envoy proxy as an edge gateway handling SSL termination, rate limiting, and gRPC web translation"
            ],
            "build": "A high-throughput edge network gateway utilizing eBPF packet inspection, tuned Linux kernel parameters, and Envoy proxy routing.",
            "resources": [
              {
            "name": "eBPF Official Documentation & Architecture Tutorials",
            "type": "documentation",
            "difficulty": "advanced",
            "estimatedTime": "4 weeks",
            "url": "https://ebpf.io/what-is-ebpf/"
          }
            ]
          }
        ]
      }
    }
  },
  "iot-connected-systems": {
    "pathSlug": "iot-connected-systems",
    "pathName": "IoT & Connected Systems",
    "foundationalPhases": [
      {
        "id": "iot-found-1",
        "phase": 1,
        "title": "Electronics Fundamentals, Circuit Prototyping & C Programming",
        "description": "Understand voltage, current, resistance, circuit schematics, breadboard prototyping, and fundamental C programming.",
        "estimatedDuration": "Weeks 1–4",
        "skills": [
          "Electronics Circuit Fundamentals",
          "Breadboard Prototyping",
          "C Programming Basics",
          "Schematic Reading"
        ],
        "learn": [
          "Electronics basics: Ohm's law (V=IR), power calculation, resistors, capacitors, LEDs, diodes, and transistor switches",
          "Reading circuit schematics, identifying component pinouts, and breadboard prototyping best practices",
          "Using test equipment: digital multimeter voltage, current, resistance, and continuity measurements",
          "C programming essentials: data types, variables, control flow, functions, bitwise operations, and memory pointers"
        ],
        "practice": [
          "Build analog sensor circuits (light-dependent resistors, thermistors) on breadboards and measure voltage outputs with a multimeter",
          "Write C programs manipulating bit masks to read and configure simulated hardware register values"
        ],
        "build": "An electronics prototype workbook with schematic diagrams, circuit calculations, and tested breadboard sensor circuits.",
        "resources": [
          {
            "name": "SparkFun Electronics: What is a Circuit? Beginner Tutorial",
            "type": "documentation",
            "difficulty": "beginner",
            "estimatedTime": "2 weeks",
            "url": "https://learn.sparkfun.com/tutorials/what-is-a-circuit"
          },
          {
            "name": "Tinkercad Circuits: Interactive Online Electronics Simulation",
            "type": "practice",
            "difficulty": "beginner",
            "estimatedTime": "3 weeks",
            "url": "https://www.tinkercad.com/circuits"
          }
        ]
      },
      {
        "id": "iot-found-2",
        "phase": 2,
        "title": "Microcontroller Architecture, Hardware Protocols & Sensor Firmware",
        "description": "Program ESP32 / Arduino microcontrollers, interface hardware sensors over I2C/SPI/UART, and write embedded firmware.",
        "estimatedDuration": "Weeks 5–8",
        "skills": [
          "Microcontroller Programming (ESP32 / ARM)",
          "Hardware Protocols (I2C / SPI / UART)",
          "Sensor Data Acquisition",
          "Embedded Firmware Architecture"
        ],
        "learn": [
          "Microcontroller architecture: clock cycles, Flash memory, RAM, GPIO pins, and interrupt handling",
          "Hardware communication protocols: I2C two-wire bus, SPI synchronous serial, and UART asynchronous serial transmission",
          "Sensor data acquisition: reading digital sensors (accelerometers, temperature/humidity), sensor calibration, and sampling rates",
          "Embedded firmware architecture: non-blocking timer loops, finite state machines (FSM), and power-efficient sleep modes"
        ],
        "practice": [
          "Connect an I2C environmental sensor to an ESP32 and transmit structured telemetry packets to a serial monitor",
          "Implement a non-blocking state machine in C++ controlling indicator LEDs, alarms, and user button inputs"
        ],
        "build": "A multi-sensor environmental monitoring firmware package that logs ambient conditions, detects threshold triggers, and outputs formatted sensor data.",
        "resources": [
          {
            "name": "Adafruit Learning System: Microcontroller Essentials Guide",
            "type": "documentation",
            "difficulty": "beginner",
            "estimatedTime": "3 weeks",
            "url": "https://learn.adafruit.com/category/microcontrollers"
          },
          {
            "name": "Espressif ESP32 Getting Started & ESP-IDF Documentation",
            "type": "documentation",
            "difficulty": "beginner",
            "estimatedTime": "3 weeks",
            "url": "https://docs.espressif.com/projects/esp-idf/en/latest/esp32/get-started/"
          }
        ]
      }
    ],
    "defaultAdvancedPhases": [
      {
        "id": "iot-adv-1",
        "phase": 3,
        "title": "IoT Networking Protocols & Cloud Telemetry Ingestion",
        "description": "Connect devices to networks using MQTT, CoAP, and HTTP, secure telemetry with TLS, and ingest device data into cloud platforms.",
        "estimatedDuration": "Weeks 7–14",
        "skills": [
          "MQTT Protocol",
          "TLS on Constrained Devices",
          "Cloud IoT Core (AWS / Azure)",
          "Device Shadows"
        ],
        "learn": [
          "Lightweight IoT messaging: MQTT topics, QoS levels (0, 1, 2), retain flags, and CoAP RESTful interactions",
          "Device security: hardware root of trust, cryptographic secure elements (ATECC608), and mutual TLS (mTLS) authentication",
          "Cloud IoT platforms (AWS IoT Core): device shadows, topic rules, and routing messages to time-series databases"
        ],
        "practice": [
          "Connect an ESP32 microcontroller to AWS IoT Core using mTLS certificates and stream live sensor data over MQTT",
          "Handle network disconnections with local offline caching and automatic reconnect queues"
        ],
        "build": "A connected IoT telemetry sensor node streaming encrypted sensor telemetry to cloud dashboards with device shadow synchronization.",
        "resources": [
          {
            "name": "AWS IoT Developer Guide",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "3 weeks",
            "url": "https://docs.aws.amazon.com/iot/latest/developerguide/what-is-aws-iot.html"
          }
        ]
      }
    ],
    "specializationTracks": {
      "embedded-iot-firmware": {
        "id": "embedded-iot-firmware",
        "name": "Embedded Systems & IoT Firmware",
        "phases": [
          {
            "id": "firmware-phase-2",
            "phase": 3,
            "title": "Real-Time Operating Systems (FreeRTOS) & Power Optimization",
            "description": "Master preemptive multi-tasking with FreeRTOS, inter-task communication (queues, semaphores), and ultra-low power sleep states.",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "FreeRTOS Multi-Tasking",
              "Queues & Semaphores",
              "Low-Power Modes (Deep Sleep)",
              "Hardware Abstraction Layers (HAL)"
            ],
            "learn": [
              "RTOS multitasking concepts: task priority scheduling, context switching, stack allocation, and memory management",
              "Inter-task synchronization and communication: mutexes, binary/counting semaphores, message queues, and event groups",
              "Low-power embedded design: deep sleep modes, wake-up timer interrupts, power domains, and sub-milliamp battery optimization",
              "Writing modular Hardware Abstraction Layers (HAL) decoupling application logic from hardware vendor registers"
            ],
            "practice": [
              "Design a multi-task FreeRTOS firmware application with dedicated sensor sampling, UI display, and communication tasks",
              "Optimize an embedded battery-powered device firmware to achieve multi-month battery life utilizing deep sleep cycles"
            ],
            "build": "A battery-optimized FreeRTOS firmware package for a connected wearable device managing tasks, priority inversions, and sleep states.",
            "resources": [
              {
                "name": "Mastering the FreeRTOS Real Time Kernel",
                "type": "book",
                "difficulty": "intermediate",
                "estimatedTime": "4 weeks",
                "url": "https://www.freertos.org/Documentation/RTOS_book.html"
              }
            ]
          },
          {
            "id": "firmware-phase-3",
            "phase": 4,
            "title": "Secure Boot, Over-The-Air (OTA) Updates & Device Security",
            "description": "Implement cryptographic secure bootloaders, dual-partition fail-safe Over-The-Air (OTA) firmware updates, and memory protection.",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "Secure Boot",
              "OTA Firmware Updates",
              "Cryptographic Signature Verification",
              "Memory Protection Units (MPU)"
            ],
            "learn": [
              "Secure bootloader architecture: cryptographic verification of firmware images using ECDSA / RSA signatures",
              "Dual-bank flash partition schemes: active partition, update partition, rollback recovery on boot failure",
              "Over-The-Air (OTA) update delivery: chunked downloading, resume capability, and flash wear leveling",
              "Memory Protection Units (MPU): configuring hardware memory regions preventing buffer overflows and privilege escalation"
            ],
            "practice": [
              "Implement an automated OTA firmware update system that verifies cryptographic digital signatures before applying patches",
              "Trigger an intentional firmware crash during an OTA update and verify the device automatically rolls back to the golden image"
            ],
            "build": "A production-grade secure bootloader and OTA firmware update framework with cryptographic verification and automated rollback recovery.",
            "resources": [
              {
                "name": "Embedded Security Guidelines",
                "type": "documentation",
                "difficulty": "advanced",
                "estimatedTime": "3 weeks",
                "url": "https://www.arm.com/architecture/platform-security-architecture"
              }
            ]
          }
        ],
        "roleOverrides": {
          "iot-firmware-engineer": {
            "roleId": "iot-firmware-engineer",
            "roleTitle": "IoT Firmware & Embedded Systems Engineer",
            "capstonePhase": {
              "id": "iot-firmware-capstone",
              "title": "Embedded Firmware Capstone: Production IoT Device Firmware Suite",
              "description": "Architect and deploy an enterprise-grade IoT embedded firmware stack with FreeRTOS multi-tasking, secure boot, OTA update recovery, and ultra-low power states.",
              "estimatedDuration": "Weeks 19–24",
              "skills": [
                "Production RTOS Architecture",
                "Dual-Bank OTA Deployment",
                "Micro-Amp Current Optimization",
                "Hardware In-The-Loop Testing"
              ],
              "learn": [
                "Advanced automated Hardware-in-the-Loop (HIL) testing: flashing firmware, simulating sensor inputs, and asserting outputs programmatically",
                "Defensive embedded programming: watchdog timers, brownout detectors, and fault handler exception logging",
                "Flash memory wear leveling algorithms and file systems for microcontrollers (LittleFS / SPIFFS)",
                "Manufacturing test firmware: designing automated factory flashing, calibration, and self-test routines"
              ],
              "practice": [
                "Execute automated Hardware-in-the-Loop firmware test suites validating task timing and edge-case exceptions",
                "Measure real-time current consumption with an oscilloscope / power analyzer across varying operational sleep profiles"
              ],
              "build": "A commercial-grade embedded IoT firmware product package: complete commented C++ source, FreeRTOS tasks, secure bootloader, OTA update server scripts, and hardware test reports.",
              "resources": [
                {
            "name": "Test Driven Development for Embedded C (Pragmatic Bookshelf)",
            "type": "book",
            "difficulty": "advanced",
            "estimatedTime": "4 weeks",
            "url": "https://pragprog.com/titles/jgade/test-driven-development-for-embedded-c/"
          }
              ]
            }
          }
        }
      },
      "connected-edge-cloud": {
        "id": "connected-edge-cloud",
        "name": "Connected Edge & Cloud Platforms",
        "phases": [
          {
            "id": "edge-phase-2",
            "phase": 3,
            "title": "IoT Edge Gateways, Local Processing & MQTT Brokers",
            "description": "Deploy embedded Linux edge gateways, configure local MQTT message brokers (Mosquitto/EMQX), and process telemetry locally.",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "Edge Linux Gateways",
              "MQTT Broker Architecture",
              "Local Edge Analytics",
              "Containerized Edge Runtimes"
            ],
            "learn": [
              "Edge gateway hardware architectures: industrial computers, Raspberry Pi / compute modules, and cellular modems",
              "Clustered MQTT brokers: high-throughput broker deployment (EMQX, HiveMQ), connection limits, and ACL authentication",
              "Containerized edge computing: deploying lightweight Docker containers and edge runtimes (AWS IoT Greengrass, Azure IoT Edge)",
              "Edge protocol translation: bridging serial Modbus and CAN bus data into unified JSON/Protobuf MQTT telemetry"
            ],
            "practice": [
              "Configure an industrial edge gateway running AWS IoT Greengrass / Docker ingesting local sensor data and filtering anomalies",
              "Deploy and benchmark a clustered MQTT broker handling 10,000 concurrent simulated device connections"
            ],
            "build": "An edge gateway appliance software stack translating local hardware telemetry into filtered cloud-ready MQTT streams.",
            "resources": [
              {
            "name": "AWS IoT Greengrass V2 Developer Guide",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "3 weeks",
            "url": "https://docs.aws.amazon.com/greengrass/v2/developerguide/what-is-iot-greengrass.html"
          }
            ]
          },
          {
            "id": "edge-phase-3",
            "phase": 4,
            "title": "Massive Fleet Management, Digital Twins & Time-Series Analytics",
            "description": "Manage millions of deployed connected devices, model digital twins, and store massive telemetry in time-series databases.",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "Device Fleet Provisioning",
              "Digital Twin Modeling",
              "Time-Series Data (TimescaleDB / InfluxDB)",
              "Fleet Observability"
            ],
            "learn": [
              "Automated device fleet provisioning: zero-touch onboarding, JITP (Just-In-Time Provisioning), and certificate management",
              "Digital twin architecture: synchronizing physical asset states with virtual graph models (AWS IoT TwinMaker, Azure Digital Twins)",
              "Time-series database modeling: hypertable partitioning, retention policies, and real-time aggregation queries in TimescaleDB",
              "Fleet-wide monitoring: detecting silent device failures, battery degradation trends, and mass OTA update orchestration"
            ],
            "practice": [
              "Design an automated device provisioning pipeline that generates device certificates and registers new hardware automatically",
              "Build a real-time digital twin dashboard mirroring physical machine telemetry and calculating operational efficiency (OEE)"
            ],
            "build": "A cloud IoT fleet management platform capable of automated device onboarding, digital twin state tracking, and time-series anomaly monitoring.",
            "resources": [
              {
                "name": "TimescaleDB Documentation & Time-Series Best Practices",
                "type": "documentation",
                "difficulty": "advanced",
                "estimatedTime": "3 weeks",
                "url": "https://docs.timescale.com"
              }
            ]
          }
        ]
      },
      "industrial-iot-smart-systems": {
        "id": "industrial-iot-smart-systems",
        "name": "Industrial IoT (IIoT) & Smart Infrastructure",
        "phases": [
          {
            "id": "iiot-phase-2",
            "phase": 3,
            "title": "Industrial Fieldbus, OPC-UA & Smart Factory Telemetry",
            "description": "Bridge legacy factory floor machinery to modern networks using Modbus TCP, PROFINET, and OPC-UA semantic models.",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "OPC-UA Protocol",
              "Modbus TCP & PROFINET",
              "Industrial Network Security",
              "SCADA-to-Cloud Integration"
            ],
            "learn": [
              "OPC Unified Architecture (OPC-UA): address space, information models, nodes, security policies, and pub/sub extensions",
              "Legacy industrial fieldbus protocols: Modbus RTU/TCP registers, PROFINET IO cycles, and EtherNet/IP CIP objects",
              "Purdue Enterprise Reference Architecture (PERA / ISA-95): zone segmentation, firewalls, and DMZ isolation between IT and OT",
              "Edge industrial connectivity: configuring Kepware / Node-RED to stream machine cycle telemetry into cloud data lakes"
            ],
            "practice": [
              "Configure an OPC-UA server modeling factory machine status variables and connect it to a cloud telemetry collector",
              "Implement an isolated ISA-95 network architecture restricting shop-floor PLC access while allowing telemetry extraction"
            ],
            "build": "An industrial factory telemetry pipeline extracting PLC tag data via OPC-UA and publishing structured telemetry to an enterprise dashboard.",
            "resources": [
              {
            "name": "OPC Foundation: OPC Unified Architecture Technical Overview",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://opcfoundation.org/about/opc-technologies/opc-ua/"
          }
            ]
          },
          {
            "id": "iiot-phase-3",
            "phase": 4,
            "title": "Predictive Maintenance, Edge AI & Smart Infrastructure",
            "description": "Deploy machine learning models to the edge for predictive maintenance, vibration analysis, and smart grid automation.",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "Vibration Frequency Analysis (FFT)",
              "Edge Machine Learning (TensorFlow Lite)",
              "Predictive Maintenance",
              "Smart Infrastructure"
            ],
            "learn": [
              "Condition-based monitoring: vibration spectral analysis, Fast Fourier Transform (FFT), bearing fault frequencies, and temperature trending",
              "Embedded Machine Learning (TinyML / TensorFlow Lite for Microcontrollers): quantizing neural networks for edge anomaly detection",
              "Smart infrastructure systems: smart building automation (BACnet), intelligent street lighting, and smart water distribution networks",
              "Calculating Mean Time Between Failures (MTBF) and remaining useful life (RUL) metrics to preempt catastrophic equipment failure"
            ],
            "practice": [
              "Compute FFT frequency spectrums on raw accelerometer vibration data to detect simulated motor bearing faults",
              "Deploy a quantized TinyML anomaly detection model onto an edge microcontroller alerting on abnormal mechanical vibrations"
            ],
            "build": "An end-to-end industrial predictive maintenance system: edge vibration analysis, TinyML fault detection, and automated maintenance ticketing.",
            "resources": [
              {
            "name": "TensorFlow Lite for Microcontrollers: Official Documentation",
            "type": "documentation",
            "difficulty": "advanced",
            "estimatedTime": "4 weeks",
            "url": "https://www.tensorflow.org/lite/microcontrollers"
          }
            ]
          }
        ]
      }
    }
  },
  "data-engineering-platforms": {
    "pathSlug": "data-engineering-platforms",
    "pathName": "Data Engineering & Platforms",
    "foundationalPhases": [
      {
        "id": "dataeng-found-1",
        "phase": 1,
        "title": "Relational Data Modeling, Advanced SQL & Python Foundations",
        "description": "Master relational database design, complex analytical SQL queries, window functions, and Python for data manipulation.",
        "estimatedDuration": "Weeks 1–4",
        "skills": [
          "Relational Data Modeling",
          "Advanced SQL & Window Functions",
          "Python Data Manipulation",
          "Database Indexing & Normalization"
        ],
        "learn": [
          "Relational database design: third normal form (3NF), primary/foreign keys, and dimensional modeling (star vs. snowflake schemas)",
          "Advanced analytical SQL: window functions (RANK, DENSE_RANK, ROW_NUMBER, LAG, LEAD), common table expressions (CTEs), and aggregation",
          "Database query execution: understanding EXPLAIN plans, B-tree indexes, partitions, and query optimization",
          "Python data fundamentals: handling structured files (CSV, JSON), data structures, and database connection libraries (SQLAlchemy / psycopg2)"
        ],
        "practice": [
          "Write complex analytical SQL queries calculating rolling averages, month-over-month growth, and cohort retention metrics",
          "Design a normalized relational schema for a multi-tenant application and optimize slow queries using targeted indexing"
        ],
        "build": "A SQL Data Analytics & Schema Optimization Portfolio featuring complex window function queries, dimensional schemas, and query execution plans.",
        "resources": [
          {
            "name": "Mode Analytics: Intermediate & Advanced SQL Tutorials",
            "type": "documentation",
            "difficulty": "beginner",
            "estimatedTime": "3 weeks",
            "url": "https://mode.com/sql-tutorial/"
          },
          {
            "name": "Designing Data-Intensive Applications (Martin Kleppmann)",
            "type": "book",
            "difficulty": "intermediate",
            "estimatedTime": "6 weeks",
            "url": "https://dataintensive.net"
          }
        ]
      },
      {
        "id": "dataeng-found-2",
        "phase": 2,
        "title": "Data Pipelines, ETL Architecture & Storage Engines",
        "description": "Build automated Extract-Transform-Load (ETL) pipelines, parse unstructured data, and understand distributed storage concepts.",
        "estimatedDuration": "Weeks 5–8",
        "skills": [
          "ETL Pipeline Design",
          "Data Validation & Quality Checks",
          "Python ETL Scripting",
          "Columnar Storage & Lakehouse Basics"
        ],
        "learn": [
          "ETL vs. ELT pipeline patterns: batch ingestion, incremental loads, idempotency, and backfilling strategies",
          "Automated data validation: schema enforcement, null checks, outlier detection, and automated data quality assertions",
          "Storage formats: comparing row-oriented (CSV, JSON, PostgreSQL) vs. columnar storage engines (Parquet, ORC, DuckDB)",
          "Distributed storage foundations: object storage architecture (S3/GCS), partitioning strategies, and data lake principles"
        ],
        "practice": [
          "Build an automated Python pipeline pulling live data from a public REST API, validating schema integrity, and saving partitioned Parquet files",
          "Write a batch processing script transforming millions of raw log entries into clean analytical tables using DuckDB or Pandas"
        ],
        "build": "An end-to-end automated ETL pipeline in Python that extracts live external data, validates records against quality rules, and stores structured tables for analytics.",
        "resources": [
          {
            "name": "Data Engineering Zoomcamp (DataTalks.Club)",
            "type": "course",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://github.com/DataTalksClub/data-engineering-zoomcamp"
          },
          {
            "name": "DuckDB Documentation & Guides",
            "type": "documentation",
            "difficulty": "beginner",
            "estimatedTime": "2 weeks",
            "url": "https://duckdb.org/docs/"
          }
        ]
      }
    ],
    "defaultAdvancedPhases": [
      {
        "id": "dataeng-adv-1",
        "phase": 3,
        "title": "Distributed Data Processing & Cloud Warehouses",
        "description": "Scale data transformations with Apache Spark, model dimensional warehouses in Snowflake/BigQuery, and orchestrate with dbt.",
        "estimatedDuration": "Weeks 7–14",
        "skills": [
          "Apache Spark (PySpark)",
          "Cloud Warehouses (Snowflake / BigQuery)",
          "dbt (Data Build Tool)",
          "ETL Orchestration"
        ],
        "learn": [
          "Apache Spark architecture: resilient distributed datasets (RDDs), Catalyst query optimizer, Tungsten execution engine, and shuffle partitions",
          "Dimensional modeling: Kimball star schema, snowflake schema, slowly changing dimensions (SCD Type 1/2), and surrogate keys",
          "dbt (data build tool): Jinja templating, schema tests, incremental materializations, and automated documentation generation",
          "Cloud data warehouses (Snowflake / BigQuery): virtual warehouses, micro-partitioning, clustering keys, and cost optimization"
        ],
        "practice": [
          "Write a PySpark distributed processing job aggregating billions of transaction events with optimized shuffle partitions",
          "Build an end-to-end dbt project transforming raw staging data into production dimensional star schemas with automated tests"
        ],
        "build": "A cloud analytics warehouse pipeline using Snowflake, dbt, and Apache Spark transforming raw event logs into production reporting marts.",
        "resources": [
          {
            "name": "dbt Learn Fundamentals Course",
            "type": "course",
            "difficulty": "intermediate",
            "estimatedTime": "3 weeks",
            "url": "https://courses.getdbt.com/courses/fundamentals"
          }
        ]
      }
    ],
    "specializationTracks": {
      "data-pipelines-lakehouse": {
        "id": "data-pipelines-lakehouse",
        "name": "Data Pipelines & Lakehouse Architecture",
        "phases": [
          {
            "id": "lakehouse-phase-2",
            "phase": 3,
            "title": "Apache Spark Internals & Lakehouse Table Formats (Delta / Iceberg)",
            "description": "Master modern lakehouse open table formats (Delta Lake, Apache Iceberg), ACID transactions on object storage, and Spark memory tuning.",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "Apache Iceberg & Delta Lake",
              "PySpark Optimization",
              "ACID on Object Storage",
              "Time-Travel Queries"
            ],
            "learn": [
              "Open table formats: Delta Lake, Apache Iceberg, and Apache Hudi metadata structures, snapshots, and manifest lists",
              "Enabling ACID transactions on cloud object storage (S3/GCS): copy-on-write, merge-on-read, and file compaction",
              "Time-travel queries, rollback capabilities, and schema evolution without full table rewrites",
              "Advanced Spark tuning: eliminating data skew with salting, broadcast joins, dynamic partition pruning, and memory profiling"
            ],
            "practice": [
              "Create an Apache Iceberg lakehouse table, perform schema evolution, and query historical table snapshots using time-travel",
              "Benchmark and optimize a slow Spark join job suffering from heavy partition skew using broadcast hash joins and salting"
            ],
            "build": "A high-performance Lakehouse data storage layer on S3/GCS using Apache Iceberg with automated compaction and vacuum maintenance routines.",
            "resources": [
              {
            "name": "Apache Iceberg Official Documentation & Quickstart",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "3 weeks",
            "url": "https://iceberg.apache.org/docs/latest/"
          }
            ]
          },
          {
            "id": "lakehouse-phase-3",
            "phase": 4,
            "title": "Modern Data Stack Orchestration & Medallion Architecture",
            "description": "Orchestrate complex DAG dependencies with Apache Airflow / Dagster, build Medallion (Bronze/Silver/Gold) pipelines, and enforce data contracts.",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "Pipeline Orchestration (Airflow / Dagster)",
              "Medallion Architecture (Bronze/Silver/Gold)",
              "Data Contracts",
              "CI/CD for Data"
            ],
            "learn": [
              "Orchestration frameworks: Apache Airflow (DAG design, dynamic task generation, Celery/Kubernetes executors) and asset-based Dagster",
              "Medallion data architecture: raw ingestion (Bronze), cleaned cleansed conformance (Silver), and aggregated business marts (Gold)",
              "Data contracts: defining producer-consumer JSON/Protobuf schemas preventing breaking upstream pipeline changes",
              "Automating data CI/CD: automated schema testing, PR preview databases (dbt-slim-ci), and deployment rollback strategies"
            ],
            "practice": [
              "Author a production Airflow DAG with task retries, SLA alerts, dynamic task branching, and automated failure notifications",
              "Implement a complete Medallion lakehouse transformation pipeline transforming raw messy telemetry into aggregated executive metrics"
            ],
            "build": "An enterprise Medallion lakehouse platform orchestrated by Apache Airflow/Dagster with automated data contract enforcement and dbt testing.",
            "resources": [
              {
            "name": "Apache Airflow Official Tutorial & Concepts",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://airflow.apache.org/docs/apache-airflow/stable/tutorial/index.html"
          }
            ]
          }
        ],
        "roleOverrides": {
          "data-engineer": {
            "roleId": "data-engineer",
            "roleTitle": "Data Infrastructure Engineer",
            "capstonePhase": {
              "id": "data-eng-capstone",
              "title": "Data Engineering Capstone: Enterprise Medallion Lakehouse & Orchestration Platform",
              "description": "Architect and build an end-to-end production data platform processing millions of events daily through a Bronze/Silver/Gold Iceberg lakehouse orchestrated by Airflow.",
              "estimatedDuration": "Weeks 19–24",
              "skills": [
                "Full Lakehouse Architecture",
                "Production Airflow DAGs",
                "Data Quality SLA Enforcement",
                "Cost & Performance Optimization"
              ],
              "learn": [
                "Architecting multi-tenant data pipelines handling concurrent schema evolutions and data backfills",
                "Designing automated anomaly detection and data drift alert systems on production warehouses",
                "Benchmarking cloud warehouse spend: optimizing query clustering and eliminating redundant compute consumption",
                "Authoring comprehensive data platform architectural documentation and operational SLAs"
              ],
              "practice": [
                "Execute a full historical backfill of a multi-terabyte dataset without exceeding database concurrency limits or breaking downstream dashboards",
                "Implement an automated data incident response workflow that quarantines corrupted source records to a dead-letter quarantine table"
              ],
              "build": "A production-ready enterprise data platform repository: Airflow DAG code, Iceberg table configurations, dbt dimensional models, Great Expectations validation suites, and automated CI/CD test pipelines.",
              "resources": [
                {
            "name": "dbt Best Practices & Data Modeling Guide",
            "type": "documentation",
            "difficulty": "advanced",
            "estimatedTime": "4 weeks",
            "url": "https://docs.getdbt.com/guides/best-practices"
          }
              ]
            }
          }
        }
      },
      "streaming-realtime": {
        "id": "streaming-realtime",
        "name": "Real-Time Streaming Systems",
        "phases": [
          {
            "id": "stream-phase-2",
            "phase": 3,
            "title": "Distributed Message Streaming with Apache Kafka",
            "description": "Master event-driven architectures, Kafka cluster topology, partitions, consumer rebalancing, schema registries, and message guarantees.",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "Apache Kafka",
              "Kafka Consumer Groups",
              "Schema Registry (Avro / Protobuf)",
              "Exactly-Once Semantics"
            ],
            "learn": [
              "Kafka architecture: brokers, ZooKeeper / KRaft metadata mode, topic partition distribution, replication factor, and leader election",
              "Producers and consumers: batching, compression (Snappy/zstd), consumer lag, offset commit strategies, and rebalance protocols",
              "Schema enforcement: Confluent Schema Registry, Apache Avro / Protobuf serialization, and schema evolution compatibility rules",
              "Message delivery guarantees: At-least-once, at-most-once, and idempotent producer exactly-once semantics (EOS)"
            ],
            "practice": [
              "Deploy a multi-broker Kafka cluster with KRaft consensus and benchmark producer throughput under high message volumes",
              "Write a multi-threaded Python/Java Kafka consumer with manual offset commits and consumer lag monitoring"
            ],
            "build": "A distributed event streaming broker cluster with schema registry enforcement and automated dead-letter queue error handling.",
            "resources": [
              {
            "name": "Apache Kafka Quickstart & Documentation",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://kafka.apache.org/quickstart"
          }
            ]
          },
          {
            "id": "stream-phase-3",
            "phase": 4,
            "title": "Stream Processing with Apache Flink & Low-Latency Engines",
            "description": "Implement real-time stateful stream processing with Apache Flink, event-time semantics, watermarks, and windowing operations.",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "Apache Flink",
              "Event Time & Watermarks",
              "Tumbling & Sliding Windows",
              "Stateful Stream Processing"
            ],
            "learn": [
              "Stream processing concepts: event time vs. processing time vs. ingestion time, late data arrival, and watermark generation",
              "Windowing operations: tumbling, sliding, and session windows over high-velocity unbounded event streams",
              "Stateful computation: keyed state, checkpointing, savepoints, and RocksDB state backend tuning for fault tolerance",
              "Real-time stream joins: joining high-velocity transaction streams with low-velocity dimension streams (enrichment)"
            ],
            "practice": [
              "Write an Apache Flink application calculating sliding window user spending metrics detecting credit card fraud in real time",
              "Restore a stateful Flink streaming application from a savepoint after code modification without losing state or dropping messages"
            ],
            "build": "An end-to-end real-time stream processing pipeline ingesting Kafka events, calculating live windowed metrics in Apache Flink, and outputting to low-latency cache stores.",
            "resources": [
              {
            "name": "Apache Flink Official Documentation & Stream Architecture",
            "type": "documentation",
            "difficulty": "advanced",
            "estimatedTime": "5 weeks",
            "url": "https://flink.apache.org/"
          }
            ]
          }
        ]
      },
      "data-platform-reliability": {
        "id": "data-platform-reliability",
        "name": "Data Platform Reliability & Governance",
        "phases": [
          {
            "id": "dprel-phase-2",
            "phase": 3,
            "title": "Data Observability, Pipeline Quality Testing & Great Expectations",
            "description": "Implement automated data quality gates, statistical anomaly detection, data drift monitoring, and pipeline SLA tracking.",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "Data Quality Testing (Great Expectations / Soda)",
              "Data Observability",
              "Data Drift Detection",
              "Data Downtime SLA Tracking"
            ],
            "learn": [
              "The pillars of data observability: Freshness, Volume, Schema, Distribution, and Lineage",
              "Authoring automated assertion suites using Great Expectations and Soda Core to validate incoming batch and stream data",
              "Detecting statistical distribution drift: Kolmogorov-Smirnov tests and identifying anomalous null/zero rate spikes",
              "Tracking data downtime: calculating Mean Time to Detection (MTTD) and Mean Time to Resolution (MTTR) for data outages"
            ],
            "practice": [
              "Write a suite of Great Expectations validation checks integrated into an Airflow pipeline that halts ingestion on data anomalies",
              "Build a data freshness and volume monitoring dashboard alerting engineers to delayed pipeline batches"
            ],
            "build": "An automated data quality and observability framework validating datasets, alerting on schema drifts, and publishing data health reports.",
            "resources": [
              {
                "name": "Great Expectations Official Tutorials",
                "type": "documentation",
                "difficulty": "intermediate",
                "estimatedTime": "2 weeks",
                "url": "https://greatexpectations.io"
              }
            ]
          },
          {
            "id": "dprel-phase-3",
            "phase": 4,
            "title": "Data Governance, Lineage & DataOps Automation",
            "description": "Enforce enterprise data governance, automated data lineage tracking (OpenLineage/Marquez), and DataOps CI/CD pipelines.",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "Data Governance & Catalogs (OpenMetadata / DataHub)",
              "End-to-End Data Lineage",
              "Data Privacy (GDPR / CCPA / PII Masking)",
              "DataOps Automation"
            ],
            "learn": [
              "Enterprise data catalogs: deploying OpenMetadata / DataHub to index datasets, ownership metadata, and glossary terms",
              "Automated end-to-end data lineage extraction using OpenLineage: tracing columns from raw ingestion to executive dashboard charts",
              "Data privacy and compliance: dynamic PII masking, column-level access controls, and automated right-to-be-forgotten workflows",
              "DataOps automation: automated staging environments, pull-request data schema diffs, and zero-downtime database migrations"
            ],
            "practice": [
              "Configure OpenMetadata / DataHub to parse SQL logs and extract automated column-level data lineage across transformation tables",
              "Implement dynamic role-based data masking in a cloud warehouse hiding customer credit card and PII numbers from unauthorized analysts"
            ],
            "build": "A complete DataOps and data governance platform featuring automated lineage extraction, data catalog documentation, and PII masking rules.",
            "resources": [
              {
            "name": "The DataOps Manifesto & Principles",
            "type": "documentation",
            "difficulty": "advanced",
            "estimatedTime": "2 weeks",
            "url": "https://dataopsmanifesto.org/"
          }
            ]
          }
        ]
      }
    }
  },
  "data-analytics-bi": {
    "pathSlug": "data-analytics-bi",
    "pathName": "Data Analytics & Insights",
    "foundationalPhases": [
      {
        "id": "analytics-found-1",
        "phase": 1,
        "title": "Analytical SQL, Data Exploration & Spreadsheet Foundations",
        "description": "Master data manipulation with SQL, structured spreadsheets, and exploratory data analysis techniques.",
        "estimatedDuration": "Weeks 1–4",
        "skills": [
          "Analytical SQL",
          "Spreadsheet Modeling",
          "Exploratory Data Analysis (EDA)",
          "Data Cleaning & Transformation"
        ],
        "learn": [
          "Core SQL for data analysts: SELECT, WHERE, GROUP BY, HAVING, multi-table JOINs, and subqueries",
          "Spreadsheet data modeling: pivot tables, VLOOKUP/XLOOKUP, conditional formatting, and data validation rules",
          "Data cleaning methods: identifying missing values, removing duplicates, trimming whitespace, and type casting",
          "Exploratory Data Analysis (EDA) framework: calculating summary statistics (mean, median, IQR, standard deviation) and identifying anomalies"
        ],
        "practice": [
          "Clean a noisy real-world customer dataset using spreadsheet functions and SQL queries, documenting data quality issues",
          "Build a dynamic spreadsheet dashboard summarizing monthly sales performance by region and product category"
        ],
        "build": "An exploratory data analysis workbook and SQL cleaning script turning raw transaction logs into clean, structured tables.",
        "resources": [
          {
            "name": "Khan Academy: Intro to SQL",
            "type": "course",
            "difficulty": "beginner",
            "estimatedTime": "2 weeks",
            "url": "https://www.khanacademy.org/computing/computer-programming/sql"
          },
          {
            "name": "Exceljet: Excel Formulas and Functions",
            "type": "documentation",
            "difficulty": "beginner",
            "estimatedTime": "2 weeks",
            "url": "https://exceljet.net"
          }
        ]
      },
      {
        "id": "analytics-found-2",
        "phase": 2,
        "title": "Python Data Analytics, Business Metrics & Visualization",
        "description": "Analyze datasets using Python (Pandas), track business and operational metrics, and create compelling interactive visualizations.",
        "estimatedDuration": "Weeks 5–8",
        "skills": [
          "Python (Pandas & Seaborn)",
          "Core Business Metrics (CAC / LTV / Retention)",
          "Data Visualization Principles",
          "Storytelling with Data"
        ],
        "learn": [
          "Python for data analysis: Pandas DataFrames, indexing, filtering, groupby aggregations, and reshaping data",
          "Visual communication: choosing effective chart types (bar, line, scatter, boxplot), color palettes, and avoiding cognitive clutter",
          "Core business metrics: Customer Acquisition Cost (CAC), Lifetime Value (LTV), Monthly Recurring Revenue (MRR), and cohort retention",
          "Translating data into insights: formulating business recommendations based on statistical findings and executive presentation"
        ],
        "practice": [
          "Analyze customer churn for a subscription service in Python, generating retention heatmaps and cohort curves",
          "Design a publication-ready chart suite comparing key performance indicators against industry benchmarks"
        ],
        "build": "An end-to-end Python Business Analytics Notebook calculating customer retention, profit margins, and key performance indicators with charts.",
        "resources": [
          {
            "name": "Python Data Science Handbook (Jake VanderPlas)",
            "type": "book",
            "difficulty": "beginner",
            "estimatedTime": "4 weeks",
            "url": "https://jakevdp.github.io/PythonDataScienceHandbook/"
          },
          {
            "name": "Storytelling with Data (Cole Nussbaumer Knaflic)",
            "type": "book",
            "difficulty": "beginner",
            "estimatedTime": "2 weeks",
            "url": "https://www.storytellingwithdata.com"
          }
        ]
      }
    ],
    "defaultAdvancedPhases": [
      {
        "id": "analytics-adv-1",
        "phase": 3,
        "title": "BI Dashboards, Semantic Modeling & Executive Storytelling",
        "description": "Build interactive executive dashboards in Power BI/Tableau, define semantic metric layers, and present data stories to leaders.",
        "estimatedDuration": "Weeks 7–14",
        "skills": [
          "Power BI / Tableau",
          "Semantic Metric Modeling",
          "Executive Data Storytelling",
          "KPI Dashboard Design"
        ],
        "learn": [
          "Dashboard design best practices: visual hierarchy, color discipline, cognitive load reduction, and user interaction filters",
          "Formulating complex measures: DAX calculations in Power BI or Level of Detail (LOD) expressions in Tableau",
          "Semantic layer modeling: defining reusable metric formulas so every team uses the exact same definition of 'active user'",
          "Data storytelling: structuring presentations to answer 'What happened?', 'Why did it happen?', and 'What should we do next?'"
        ],
        "practice": [
          "Build an interactive executive sales KPI dashboard in Power BI/Tableau with drill-down capabilities and dynamic date slicers",
          "Deliver an executive presentation translating complex statistical findings into three clear strategic business recommendations"
        ],
        "build": "A polished executive business intelligence dashboard accompanied by an executive briefing slide deck detailing revenue optimization opportunities.",
        "resources": [
          {
            "name": "Storytelling with Data (Cole Nussbaumer Knaflic)",
            "type": "book",
            "difficulty": "intermediate",
            "estimatedTime": "2 weeks",
            "url": "https://www.storytellingwithdata.com"
          }
        ]
      }
    ],
    "specializationTracks": {
      "analytics-bi": {
        "id": "analytics-bi",
        "name": "Business Intelligence & Analytics",
        "phases": [
          {
            "id": "bi-phase-2",
            "phase": 3,
            "title": "Advanced DAX, Dimensional Semantic Layers & Enterprise BI",
            "description": "Master complex DAX formulas (CALCULATE, time intelligence, iterators), semantic layers, and automated report distribution.",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "Advanced DAX & Power BI",
              "Time Intelligence Calculations",
              "Row-Level Security (RLS)",
              "Semantic Layer Governance"
            ],
            "learn": [
              "Advanced DAX mechanics: context transition, filter context vs. row context, CALCULATE modifiers (KEEPFILTERS, REMOVEFILTERS)",
              "Time intelligence modeling: Year-over-Year (YoY), Month-to-Date (MTD), Year-to-Date (YTD), and rolling moving averages",
              "Enterprise BI security: configuring Row-Level Security (RLS) and Object-Level Security (OLS) ensuring regional data isolation",
              "Performance optimization: VertiPaq storage engine internals, cardinality reduction, and Power BI Performance Analyzer"
            ],
            "practice": [
              "Write complex DAX measures calculating dynamic moving averages and customer cohort retention percentages",
              "Optimize an enterprise Power BI data model reducing file size by 60% and cutting visual load times from 8s to under 1s"
            ],
            "build": "An enterprise-grade Power BI analytical model complete with advanced DAX time intelligence, RLS security roles, and automated data refresh.",
            "resources": [
              {
                "name": "The Definitive Guide to DAX (Marco Russo & Alberto Ferrari)",
                "type": "book",
                "difficulty": "advanced",
                "estimatedTime": "6 weeks",
                "url": "https://www.sqlbi.com/books/the-definitive-guide-to-dax-2nd-edition/"
              }
            ]
          },
          {
            "id": "bi-phase-3",
            "phase": 4,
            "title": "Decision Intelligence, C-Suite Consulting & Analytics Strategy",
            "description": "Lead company-wide analytics initiatives, partner with business executives, establish data governance, and drive strategic roadmaps.",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "Decision Intelligence",
              "Executive Stakeholder Management",
              "Root Cause Analysis",
              "Analytics ROI Tracking"
            ],
            "learn": [
              "Translating ambiguous business challenges into quantifiable hypotheses and structured analytical frameworks",
              "Conducting deep-dive root cause analyses: decomposing revenue dips into volume, mix, and price variances",
              "Executive communication: designing 1-page executive memos and board meeting slides that eliminate unnecessary jargon",
              "Analytics project management: prioritizing request queues, evaluating analytics ROI, and mentoring junior data analysts"
            ],
            "practice": [
              "Investigate a simulated 15% unexpected drop in monthly recurring revenue and author a root-cause diagnosis memo",
              "Present strategic business growth recommendations to a simulated C-suite executive panel with live data defense"
            ],
            "build": "A master decision intelligence portfolio: an executive root-cause investigation memo, strategic growth roadmap, and enterprise KPI dictionary.",
            "resources": [
              {
            "name": "Microsoft Power BI Guided Learning & Documentation",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "5 weeks",
            "url": "https://learn.microsoft.com/en-us/training/powerplatform/power-bi"
          }
            ]
          }
        ],
        "roleOverrides": {
          "bi-data-analyst": {
            "roleId": "bi-data-analyst",
            "roleTitle": "Data Analyst",
            "capstonePhase": {
              "id": "bi-analyst-capstone",
              "title": "Data Analytics Capstone: Enterprise Analytics Portfolio & Executive Readout",
              "description": "Conduct an end-to-end commercial analytics investigation combining SQL modeling, Power BI dashboarding, cohort decomposition, and C-suite presentation.",
              "estimatedDuration": "Weeks 19–24",
              "skills": [
                "Full SQL Data Pipeline",
                "Interactive BI Master Dashboard",
                "Executive Business Memo",
                "Stakeholder Defense"
              ],
              "learn": [
                "End-to-end data modeling: structuring raw transaction tables into star schemas optimized for analytical querying",
                "Advanced customer segmentation using RFM (Recency, Frequency, Monetary) statistical clustering",
                "Synthesizing multi-variable findings into actionable commercial business opportunities",
                "Live executive presentation techniques and handling unexpected statistical skepticism during reviews"
              ],
              "practice": [
                "Build an end-to-end customer lifetime value and churn analytics model in SQL and Power BI/Tableau",
                "Draft an executive briefing memo outlining a $1M+ operational revenue improvement opportunity"
              ],
              "build": "A client-ready Data Analytics Portfolio Package: documented SQL scripts, interactive BI dashboard file, executive decision memo, and video presentation walkthrough.",
              "resources": [
                {
            "name": "Storytelling with Data: Chart Guide & Visual Best Practices",
            "type": "documentation",
            "difficulty": "advanced",
            "estimatedTime": "3 weeks",
            "url": "https://www.storytellingwithdata.com/chart-guide"
          }
              ]
            }
          }
        }
      },
      "quantitative-modeling": {
        "id": "quantitative-modeling",
        "name": "Quantitative & Statistical Modeling",
        "phases": [
          {
            "id": "quant-mod-phase-2",
            "phase": 3,
            "title": "Inferential Statistics, Regression Analysis & Econometrics",
            "description": "Master hypothesis testing, multivariate linear and logistic regression, ANOVA, and econometric time-series modeling in Python/R.",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "Hypothesis Testing",
              "Multivariate Linear & Logistic Regression",
              "Econometrics",
              "Model Diagnostics"
            ],
            "learn": [
              "Parametric and non-parametric hypothesis tests: t-tests, Mann-Whitney U, Chi-square tests of independence, and ANOVA",
              "Multivariate linear regression: Ordinary Least Squares (OLS), multicollinearity (VIF), heteroskedasticity, and residual diagnostics",
              "Classification models: logistic regression, log-odds interpretation, ROC-AUC curves, and confusion matrix evaluation",
              "Time-series econometrics: stationary testing (ADF test), ARIMA models, and seasonal decomposition for forecasting"
            ],
            "practice": [
              "Build a multivariate regression model predicting customer churn probability and evaluate diagnostic assumptions",
              "Conduct hypothesis tests on marketing campaigns determining whether conversion improvements are statistically significant"
            ],
            "build": "An econometric predictive modeling package in Python/R analyzing macroeconomic or business drivers with full regression diagnostics.",
            "resources": [
              {
            "name": "OpenStax: Introductory Business Statistics 2e",
            "type": "book",
            "difficulty": "intermediate",
            "estimatedTime": "6 weeks",
            "url": "https://openstax.org/details/books/introductory-business-statistics-2e"
          }
            ]
          },
          {
            "id": "quant-mod-phase-3",
            "phase": 4,
            "title": "Causal Inference, A/B Testing & Quasi-Experimentation",
            "description": "Design randomized controlled trials (A/B testing), calculate statistical sample size power, and apply causal inference techniques.",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "A/B Testing Experimentation",
              "Statistical Power & Sample Sizing",
              "Causal Inference (Diff-in-Diff / IV)",
              "Synthetic Controls"
            ],
            "learn": [
              "Randomized controlled trial (RCT) design: minimum detectable effect (MDE), type I and type II error rates, and sample size power analysis",
              "Experimentation pitfalls: peeking bias, p-hacking, multi-armed bandits vs. fixed horizon tests, and network interference",
              "Causal inference when RCTs are impossible: Difference-in-Differences (DiD), Propensity Score Matching (PSM), and Instrumental Variables",
              "Synthetic control methods: evaluating policy or business intervention effects by constructing artificial comparison groups"
            ],
            "practice": [
              "Design an A/B test experimentation protocol calculating required sample sizes and defining primary vs. guardrail metrics",
              "Execute a Difference-in-Differences causal inference analysis evaluating the revenue impact of a regional price change"
            ],
            "build": "An experimentation and causal inference framework documenting A/B test protocols, statistical power calculators, and quasi-experimental evaluations.",
            "resources": [
              {
                "name": "Causal Inference: The Mixtape (Scott Cunningham)",
                "type": "book",
                "difficulty": "advanced",
                "estimatedTime": "4 weeks",
                "url": "https://mixtape.scunning.com"
              }
            ]
          }
        ]
      },
      "product-growth-analytics": {
        "id": "product-growth-analytics",
        "name": "Product Analytics & Growth Insights",
        "phases": [
          {
            "id": "growth-phase-2",
            "phase": 3,
            "title": "Product Funnel Analytics, Event Telemetry & Behavioral Cohorts",
            "description": "Instrument event analytics (Segment, Amplitude, Mixpanel), build onboarding conversion funnels, and analyze user retention curves.",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "Event Tracking Taxonomy",
              "Funnel Conversion Analysis",
              "Retention Curves & Cohorting",
              "Feature Adoption Tracking"
            ],
            "learn": [
              "Event tracking taxonomy: naming conventions, event properties, user traits, and identity resolution across devices",
              "Onboarding funnel conversion analysis: step-by-step dropoff analysis, time-to-convert metrics, and identifying friction bottlenecks",
              "Retention curve analysis: N-day retention, unbounded retention, bracketed retention, and identifying 'aha' moments",
              "Feature engagement matrix: mapping product features by frequency of use vs. breadth of user adoption"
            ],
            "practice": [
              "Design a comprehensive event tracking plan for a mobile or web application and implement event triggers",
              "Analyze user session events to discover the key behavioral action strongly correlated with 30-day user retention"
            ],
            "build": "A complete product analytics audit: event taxonomy tracking plan, onboarding funnel drop-off report, and user retention curves.",
            "resources": [
              {
            "name": "Amplitude: Product Analytics Playbook Guide",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "3 weeks",
            "url": "https://amplitude.com/product-analytics-playbook"
          }
            ]
          },
          {
            "id": "growth-phase-3",
            "phase": 4,
            "title": "Unit Economics, LTV Modeling & Growth Accounting",
            "description": "Model customer lifetime value (LTV), cohort payback periods, viral referral loops, and growth accounting frameworks.",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "Customer Lifetime Value (LTV) Modeling",
              "CAC Payback Period",
              "Growth Accounting (Bessemer Framework)",
              "Viral Loop Mechanics"
            ],
            "learn": [
              "Growth accounting equations: Net ARR growth = New ARR + Expansion ARR + Reactivated ARR - Churned ARR - Contraction ARR",
              "Predictive LTV modeling: historical vs. predictive models, discount rates, gross margin adjustments, and cohort survival curves",
              "Customer Acquisition Cost (CAC) and CAC payback period calculations across acquisition channels and marketing campaigns",
              "Viral coefficient (K-factor) and viral cycle time: modeling organic compounding user referral and network loops"
            ],
            "practice": [
              "Build a dynamic cohort-based customer LTV predictive model in Python predicting 36-month net customer value",
              "Deconstruct a SaaS company's growth accounting metrics evaluating whether expansion revenue offsets churn losses"
            ],
            "build": "A comprehensive growth analytics model package: predictive LTV simulator, CAC payback dashboards, and growth accounting decomposition tables.",
            "resources": [
              {
            "name": "Reforge: Growth Strategy Series",
            "type": "course",
            "difficulty": "advanced",
            "estimatedTime": "6 weeks",
            "url": "https://www.reforge.com/courses/growth-series"
          }
            ]
          }
        ]
      }
    }
  },
  "visual-brand-communication": {
    "pathSlug": "visual-brand-communication",
    "pathName": "Visual Brand & Spatial Design",
    "foundationalPhases": [
      {
        "id": "brand-found-1",
        "phase": 1,
        "title": "Visual Composition, Typography Systems & Color Theory",
        "description": "Master visual hierarchy, typographic classification, scale, grid alignment, and color harmony fundamentals.",
        "estimatedDuration": "Weeks 1–4",
        "skills": [
          "Visual Hierarchy & Balance",
          "Typographic Anatomy & Pairings",
          "Color Theory & Harmonies",
          "Grid Systems & Composition"
        ],
        "learn": [
          "Core design principles: focal points, contrast, visual weight, rhythm, white space, and Gestalt perceptual principles",
          "Typography fundamentals: anatomy of type, serif vs. sans-serif, kerning, tracking, leading, and establishing hierarchy",
          "Color science: additive vs. subtractive color, the color wheel, complementary/analogous harmonies, and emotional color psychology",
          "Grid systems: manuscript, column, and modular grids for responsive digital screens and printed layouts"
        ],
        "practice": [
          "Create a typographic hierarchy scale showing headline, subheadline, body, and caption pairings for mobile and desktop screens",
          "Develop 4 harmonious color palettes adhering to WCAG accessibility contrast ratios for digital interfaces"
        ],
        "build": "A visual design specimen book showcasing typographic pairing rules, grid layout studies, and color harmony palettes.",
        "resources": [
          {
            "name": "Butterick's Practical Typography",
            "type": "book",
            "difficulty": "beginner",
            "estimatedTime": "3 weeks",
            "url": "https://practicaltypography.com/"
          },
          {
            "name": "Canva Design School: Graphic Design Basics",
            "type": "course",
            "difficulty": "beginner",
            "estimatedTime": "2 weeks",
            "url": "https://www.canva.com/designschool/"
          }
        ]
      },
      {
        "id": "brand-found-2",
        "phase": 2,
        "title": "Vector Tooling, Brand Identity Systems & Asset Creation",
        "description": "Master vector design tools (Figma / Illustrator), logo geometry, visual identity guidelines, and production asset export.",
        "estimatedDuration": "Weeks 5–8",
        "skills": [
          "Vector Pen Tool Mastery",
          "Logo Geometry & Construction",
          "Brand Identity Guidelines",
          "Asset Production & Export"
        ],
        "learn": [
          "Vector graphics mechanics: bezier curves, control points, boolean shape combinations, and vector path optimization",
          "Logo design principles: simplicity, versatility, memorability, scalability, and geometric alignment",
          "Brand identity architecture: primary marks, secondary logomarks, favicon icons, brand voice, and typography rules",
          "Production asset exports: vector SVGs, high-resolution PNGs, color profile conversions (RGB vs. CMYK), and digital asset management"
        ],
        "practice": [
          "Trace and construct geometric logos using precise vector bezier tools in Figma or Illustrator",
          "Assemble a complete mini-brand identity kit for a sustainable consumer startup with logos, colors, and typography"
        ],
        "build": "A comprehensive Brand Identity Style Guide including primary and secondary logo marks, color tokens, typography scales, and application mockups.",
        "resources": [
          {
            "name": "Figma Design Fundamentals & Vector Guide",
            "type": "practice",
            "difficulty": "beginner",
            "estimatedTime": "2 weeks",
            "url": "https://help.figma.com/hc/en-us/categories/360002051613-Figma-design"
          },
          {
            "name": "Logo Design Love: Guide to Creating Iconic Brand Identities (David Airey)",
            "type": "book",
            "difficulty": "beginner",
            "estimatedTime": "3 weeks",
            "url": "https://www.davidairey.com/books/"
          }
        ]
      }
    ],
    "defaultAdvancedPhases": [
      {
        "id": "vbrand-adv-1",
        "phase": 3,
        "title": "Brand Identity Systems & Multi-Channel Design Strategy",
        "description": "Create cohesive brand identity guidelines, design multi-channel marketing collateral, and articulate strategic brand positioning.",
        "estimatedDuration": "Weeks 7–14",
        "skills": [
          "Brand Identity Systems",
          "Brand Style Guides",
          "Collateral Design",
          "Creative Strategy"
        ],
        "learn": [
          "Comprehensive brand guidelines: logo usage rules, clear space, forbidden variations, typography rules, and photographic art direction",
          "Multi-channel asset deployment: digital banners, social templates, corporate stationery, and physical merchandise",
          "Brand positioning: defining core values, tone of voice, personality archetypes, and market differentiation"
        ],
        "practice": [
          "Develop a 30-page brand guidelines document for an innovative consumer brand",
          "Design a cohesive campaign suite across billboards, social media, and packaging"
        ],
        "build": "A complete Brand Identity Style Guide featuring primary/secondary logos, color system, typography rules, and collateral mockups.",
        "resources": [
          {
            "name": "Adobe Spectrum: Design System & Visual Brand Guidelines",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://spectrum.adobe.com/"
          }
        ]
      }
    ],
    "specializationTracks": {
      "brand-identity": {
        "id": "brand-identity",
        "name": "Brand Identity & Graphic Strategy",
        "phases": [
          {
            "id": "brand-id-phase-2",
            "phase": 3,
            "title": "Comprehensive Identity Systems & Strategic Art Direction",
            "description": "Develop multi-layered corporate identity systems, dynamic responsive logos, comprehensive brand books, and art direction guidelines.",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "Comprehensive Brand Books",
              "Responsive Logomarks",
              "Art Direction Guidelines",
              "Corporate Rebranding"
            ],
            "learn": [
              "Developing responsive logo systems: adaptable marks for micro-favicons, mobile apps, billboards, and architectural signage",
              "Art directing photography and illustration: moodboards, lighting briefs, model casting direction, and visual treatment consistency",
              "Sub-brand and brand architecture: masterbrand (monolithic), endorsed brands, and house of brands structural strategies",
              "Authoring comprehensive enterprise brand books detailing messaging, tone of voice, visual grammar, and digital asset management"
            ],
            "practice": [
              "Execute a complete brand identity redesign for a traditional legacy enterprise modernizing its visual presence",
              "Create a responsive logo system that scales seamlessly from 16px favicon up to building-scale exterior signage"
            ],
            "build": "An exhaustive 50-page enterprise brand guidelines manual complete with dynamic logo variations, art direction moodboards, and multi-channel applications.",
            "resources": [
              {
                "name": "Brand Systems & Identity Design",
                "type": "documentation",
                "difficulty": "intermediate",
                "estimatedTime": "3 weeks",
                "url": "https://www.underconsideration.com/brandnew/"
              }
            ]
          },
          {
            "id": "brand-id-phase-3",
            "phase": 4,
            "title": "Executive Creative Direction, Brand Launch & Campaign Strategy",
            "description": "Lead creative campaign rollouts, craft high-impact client presentation decks, and direct multi-disciplinary creative teams.",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "Creative Direction",
              "Campaign Rollout Strategy",
              "Client Presentation & Pitching",
              "Brand Asset Management"
            ],
            "learn": [
              "Concepting creative campaign narratives: unifying advertising, social activations, PR stunts, and digital experiences",
              "Client presentation craft: structuring the big reveal, addressing client skepticism, and defending aesthetic decisions with business logic",
              "Brand governance: building automated digital asset management (DAM) libraries and template systems for global marketing teams",
              "Estimating creative budgets, licensing photography/typefaces, and managing external copywriters and illustrators"
            ],
            "practice": [
              "Assemble and deliver a client pitch presentation deck proposing a multi-million-dollar global brand repositioning campaign",
              "Design a cross-platform brand launch rollout schedule coordinating social, print, digital, and out-of-home media touchpoints"
            ],
            "build": "A master creative direction portfolio package: executive pitch deck, launch campaign strategy, multi-channel asset suite, and video brand manifesto.",
            "resources": [
              {
            "name": "D&AD Creative Advertising Showcase & Educational Case Studies",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://www.dandad.org/en/d-ad-awards/"
          }
            ]
          }
        ]
      },
      "motion-spatial": {
        "id": "motion-spatial",
        "name": "Motion Graphics & Spatial Experience",
        "phases": [
          {
            "id": "motion-phase-2",
            "phase": 3,
            "title": "Kinetic Typography & 2D Motion Graphics (After Effects)",
            "description": "Master the 12 principles of animation in motion graphics, kinetic typography, easing curves, expressions, and After Effects pipelines.",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "After Effects Animation",
              "Kinetic Typography",
              "Motion Graph Speed Easing",
              "Lottie Web Animations"
            ],
            "learn": [
              "The 12 principles of animation applied to UI and brand graphics: anticipation, follow-through, squash & stretch, and staging",
              "Speed graph and value graph editor mastery: crafting smooth custom bezier easing curves that feel weighted and tactile",
              "Kinetic typography: synchronizing text rhythm with voiceover audio, dynamic masking, and optical distortion",
              "Exporting performant web animations: vector shape layers, Bodymovin, and Lottie animations for interactive mobile/web apps"
            ],
            "practice": [
              "Animate a 30-second kinetic typography video synced to a recorded voiceover utilizing rhythmic speed graph curves",
              "Build a set of 5 interactive micro-interaction UI animations and export them as lightweight Lottie JSON files"
            ],
            "build": "A dynamic 45-second motion graphics brand manifesto video featuring kinetic typography, vector transformations, and sound design.",
            "resources": [
              {
            "name": "School of Motion: Animation Bootcamp",
            "type": "course",
            "difficulty": "intermediate",
            "estimatedTime": "8 weeks",
            "url": "https://www.schoolofmotion.com/courses/animation-bootcamp"
          }
            ]
          },
          {
            "id": "motion-phase-3",
            "phase": 4,
            "title": "3D Spatial Branding, Environmental Graphics & Interactive Projection",
            "description": "Create 3D spatial brand visuals in Cinema 4D/Blender, environmental graphics, interactive projections, and architectural brand spaces.",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "3D Spatial Modeling (Cinema 4D / Blender)",
              "Environmental Graphic Design",
              "Projection Mapping & Experiential",
              "Physical Materials"
            ],
            "learn": [
              "3D spatial branding: modeling architectural retail interiors, trade show exhibit booths, and branded environmental installations",
              "Camera staging, physically based materials (PBR), depth of field, and Octane / Redshift rendering pipelines",
              "Projection mapping fundamentals: software calibration (MadMapper / TouchDesigner) for mapping visuals onto physical geometry",
              "Physical material specification: acrylics, metals, LED displays, dimensional signage typography, and lighting considerations"
            ],
            "practice": [
              "Model and render a high-fidelity 3D branded experiential pop-up store or retail exhibit in Cinema 4D / Blender",
              "Create an interactive projection mapping animation loop tailored to fit an architectural facade or sculpture"
            ],
            "build": "A 3D spatial experiential brand installation package: architectural renders, projection mapping motion tests, and physical material specifications.",
            "resources": [
              {
            "name": "SEGD: Experiential Graphic Design Best Practices & Case Studies",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "3 weeks",
            "url": "https://segd.org/"
          }
            ]
          }
        ]
      },
      "packaging-editorial-design": {
        "id": "packaging-editorial-design",
        "name": "Packaging, Print & Publication Design",
        "phases": [
          {
            "id": "pack-phase-2",
            "phase": 3,
            "title": "Structural Packaging Design, Dielines & Sustainable Materials",
            "description": "Master 3D structural packaging dielines, folding cartons, print production prepress, spot colors (Pantone), and sustainable materials.",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "Structural Dieline Engineering",
              "Print Prepress (CMYK / Spot PMS)",
              "Packaging Materials & Finishes",
              "3D Packaging Mockups"
            ],
            "learn": [
              "Dieline drafting: cut lines, crease lines, bleed zones, tuck flaps, and structural corrugated/folding carton geometry",
              "Print production prepress: spot color separations (Pantone Matching System), trapping, overprint settings, and high-res PDF/X-1a exports",
              "Specialty finishes: foil stamping, blind embossing/debossing, spot UV varnishes, and soft-touch coatings",
              "Sustainable packaging design: recyclable substrates, biodegradable polymers, minimalist ink coverage, and life-cycle impact"
            ],
            "practice": [
              "Draft an accurate structural dieline for an origami folding retail product box with zero adhesive requirements",
              "Preflight and prepare press-ready packaging files with verified spot varnish layers and Pantone separations"
            ],
            "build": "A production-ready retail product packaging suite: structural dieline CAD files, press-ready print PDFs, and photorealistic 3D renders.",
            "resources": [
              {
            "name": "Dieline: Packaging Design Trends & Structural Guides",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "3 weeks",
            "url": "https://thedieline.com/"
          }
            ]
          },
          {
            "id": "pack-phase-3",
            "phase": 4,
            "title": "Long-Form Publication Editorial, Book Design & Wayfinding",
            "description": "Typeset long-form books and magazines in Adobe InDesign, manage master pages, and design architectural wayfinding signage systems.",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "Adobe InDesign Master Pages",
              "Long-Form Typesetting",
              "Editorial Layout & Art Direction",
              "Architectural Wayfinding Systems"
            ],
            "learn": [
              "InDesign advanced features: paragraph/character styles, nested styles, baseline grid alignment, and automated table of contents",
              "Editorial magazine design: pacing, feature story layout rhythm, pull quotes, image spreads, and visual storytelling",
              "Book publishing prepress: signatures, binding styles (smyth sewn, perfect bound, saddle stitch), and spine width calculations",
              "Architectural wayfinding systems: sign hierarchy, viewing distance legibility calculations, pictograms, and ADA compliance standards"
            ],
            "practice": [
              "Typeset a 48-page editorial magazine layout featuring complex multi-column typography, photo essays, and pull quotes",
              "Design an architectural wayfinding signage system and universal iconography set for a cultural museum or university campus"
            ],
            "build": "A printed editorial publication and architectural wayfinding manual: complete 48-page magazine PDF, binding specifications, and signage blueprint.",
            "resources": [
              {
            "name": "Butterick's Practical Typography: Document & Layout Design",
            "type": "book",
            "difficulty": "intermediate",
            "estimatedTime": "3 weeks",
            "url": "https://practicaltypography.com/"
          }
            ]
          }
        ]
      }
    }
  },
  "animation-3d-media": {
    "pathSlug": "animation-3d-media",
    "pathName": "Animation & 3D Media",
    "foundationalPhases": [
      {
        "id": "anim-found-1",
        "phase": 1,
        "title": "3D Viewport Navigation, Form Principles & Polygonal Modeling",
        "description": "Master 3D software navigation in Blender, primitive manipulation, mesh modeling, and proportion analysis.",
        "estimatedDuration": "Weeks 1–4",
        "skills": [
          "3D Viewport Navigation",
          "Polygon Mesh Modeling (Blender)",
          "Form & Silhouette Analysis",
          "Extrusion & Loop Cuts"
        ],
        "learn": [
          "Navigating 3D space: 3D coordinate axes (X, Y, Z), viewport navigation, perspective vs. orthographic projections, and 3D cursor placement",
          "Mesh modeling foundations: vertices, edges, faces, and normals in polygon construction",
          "Essential modeling tools: extrude, inset, bevel, loop cut, knife tool, and mirror modifier workflows",
          "Form and proportion: silhouette readability, blocking out primary shapes, and maintaining realistic physical scale"
        ],
        "practice": [
          "Block out and model 3 hard-surface household objects (such as a mug, desk lamp, and chair) from reference photographs",
          "Practice non-destructive modeling workflows using the mirror, boolean, and solidify modifiers in Blender"
        ],
        "build": "A low-poly 3D hard-surface prop asset pack with clean geometry, optimized face counts, and rendered presentation turntable shots.",
        "resources": [
          {
            "name": "Blender 4.0 Beginner Tutorial Series (Blender Guru)",
            "type": "course",
            "difficulty": "beginner",
            "estimatedTime": "4 weeks",
            "url": "https://www.youtube.com/playlist?list=PLjEaoINr3zgEPv5y--4MKpciLaoQYZB1Z"
          },
          {
            "name": "Blender Official Manual: Modeling Basics",
            "type": "documentation",
            "difficulty": "beginner",
            "estimatedTime": "2 weeks",
            "url": "https://docs.blender.org/manual/en/latest/"
          }
        ]
      },
      {
        "id": "anim-found-2",
        "phase": 2,
        "title": "Topology, Edge Flow, Materials & 3D Shading Fundamentals",
        "description": "Learn subdivision surface modeling, edge loop flow, UV unwrapping basics, PBR material creation, and studio lighting.",
        "estimatedDuration": "Weeks 5–8",
        "skills": [
          "Topology & Subdivision Modeling",
          "UV Unwrapping Basics",
          "PBR Material Shading",
          "Studio Three-Point Lighting"
        ],
        "learn": [
          "Subdivision surface modeling: quad-based topology, controlling supporting edge loops, and avoiding n-gons and poles",
          "UV unwrapping: marking seams, unwrapping mesh geometry, optimizing texel density, and minimizing texture distortion",
          "Physically Based Rendering (PBR) shading: base color, roughness, metallic, and normal map channels in material nodes",
          "Studio lighting and rendering: three-point lighting setups (key, fill, rim lights), camera focal lengths, and rendering engines (Eevee / Cycles)"
        ],
        "practice": [
          "UV unwrap a 3D model with clean island packing and apply custom procedural metal, wood, and glass shaders",
          "Set up a three-point studio lighting stage and render high-resolution portfolio images of your textured 3D models"
        ],
        "build": "A finished 3D asset showcase featuring subdivided clean topology, custom PBR textured materials, studio lighting, and high-resolution portfolio renders.",
        "resources": [
          {
            "name": "CG Cookie: Mesh Modeling & Shading Fundamentals",
            "type": "course",
            "difficulty": "beginner",
            "estimatedTime": "4 weeks",
            "url": "https://cgcookie.com/categories/3d/courses"
          },
          {
            "name": "PBR Guide (Allegorithmic / Adobe)",
            "type": "documentation",
            "difficulty": "beginner",
            "estimatedTime": "2 weeks",
            "url": "https://helpx.adobe.com/substance-3d-painter/pbr-guide.html"
          }
        ]
      }
    ],
    "defaultAdvancedPhases": [
      {
        "id": "anim-adv-1",
        "phase": 3,
        "title": "UV Unwrapping, PBR Texturing & Cinematic Lighting",
        "description": "Unwrap UV texture coordinates, paint physically based materials in Substance Painter, and light scenes with cinematic 3-point setups.",
        "estimatedDuration": "Weeks 7–14",
        "skills": [
          "UV Unwrapping & Packing",
          "PBR Material Texturing",
          "Substance Painter",
          "Cinematic Scene Lighting"
        ],
        "learn": [
          "UV unwrapping: seam placement, minimizing distortion/stretching, texel density consistency, and UDIM tile workflows",
          "Physically Based Rendering (PBR) metallic/roughness workflows: Base Color, Roughness, Metallic, Normal, and Height maps",
          "Texturing in Substance Painter: smart materials, procedural mask generators, hand-painted details, and curvature baking",
          "Lighting and rendering: 3-point key/fill/rim lighting, HDRI environmental lighting, depth of field, and Arnold/Cycles rendering"
        ],
        "practice": [
          "Unwrap UVs on a complex mechanical asset with equal texel density across two UDIM tiles",
          "Texture a realistic weathered asset in Substance Painter with edge wear, surface grime, and realistic roughness variations"
        ],
        "build": "A photorealistic rendered 3D scene showcasing an intricately textured asset with cinematic lighting and multi-angle turnarounds.",
        "resources": [
          {
            "name": "The PBR Guide (Allegorithmic / Adobe)",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "2 weeks",
            "url": "https://substance3d.adobe.com/tutorials/courses/the-pbr-guide-part-1"
          }
        ]
      }
    ],
    "specializationTracks": {
      "3d-modeling-cgi": {
        "id": "3d-modeling-cgi",
        "name": "3D Modeling & CGI",
        "phases": [
          {
            "id": "cgi-phase-2",
            "phase": 3,
            "title": "Digital Sculpting in ZBrush & Anatomy Deconstruction",
            "description": "Master digital sculpting in ZBrush, human/creature anatomical landmarks, dynamesh, zremesher, and high-to-low poly baking.",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "Digital Sculpting (ZBrush)",
              "Anatomical Landmarks",
              "Retopology",
              "Normal Map Baking"
            ],
            "learn": [
              "ZBrush sculpting brushes: Clay Buildup, Move, DamStandard, HPolish, and custom alphas for skin pore micro-details",
              "Human and creature anatomy: skeletal landmarks, major muscle volume insertions/origins, and facial expressive planes",
              "Retopology techniques: manual retopology in TopoGun / Maya Quad Draw creating deformation-ready animation loops",
              "High-poly to low-poly baking: cage configuration, resolving baking artifacts, and normal/ambient occlusion map generation"
            ],
            "practice": [
              "Sculpt a detailed anatomical head or creature torso from a digital clay sphere in ZBrush",
              "Manually retopologize a 5-million polygon high-res sculpt down to an optimized 15,000 polygon animation-ready mesh"
            ],
            "build": "A completed character bust sculpt complete with clean manual retopology, baked normal maps, and textured facial details.",
            "resources": [
              {
            "name": "Anatomy for 3D Artists (3dtotal Publishing)",
            "type": "book",
            "difficulty": "intermediate",
            "estimatedTime": "5 weeks",
            "url": "https://store.3dtotal.com/products/anatomy-for-3d-artists"
          }
            ]
          },
          {
            "id": "cgi-phase-3",
            "phase": 4,
            "title": "Look Development, Complex Shaders & Production Environments",
            "description": "Develop procedural materials, complex glass/subsurface scattering shaders, environment set dressing, and ACES color management.",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "LookDev & Material Shaders",
              "Subsurface Scattering (SSS)",
              "Environment Worldbuilding",
              "ACES Color Pipeline"
            ],
            "learn": [
              "Advanced shader networks: Subsurface Scattering (SSS) for skin and wax, thin-film iridescence, and complex glass transmission",
              "Environment set dressing: scattering foliage with geometry nodes / MASH, modular architectural kits, and level-of-detail (LOD)",
              "ACES (Academy Color Encoding System) linear workflow: color space transforms, wide-gamut preservation, and grading",
              "Optimizing production render passes: AOVs (diffuse, specular, Z-depth, crypto-matte) for compositing handoff"
            ],
            "practice": [
              "Create a realistic human skin shader in Arnold/Cycles utilizing multi-layer subsurface scattering and micro-roughness",
              "Assemble a detailed 3D environment set utilizing modular assets, atmospheric fog, and procedural foliage scattering"
            ],
            "build": "A production CGI portfolio project: a fully realized 3D environment or character with realistic LookDev shaders, rendered in ACES with beauty passes.",
            "resources": [
              {
                "name": "Physically Based Shading in Theory and Practice (SIGGRAPH Course)",
                "type": "documentation",
                "difficulty": "advanced",
                "estimatedTime": "4 weeks",
                "url": "https://blog.selfshadow.com/publications/s2017-shading-course/"
              }
            ]
          }
        ],
        "roleOverrides": {
          "3d-modeler": {
            "roleId": "3d-modeler",
            "roleTitle": "3D Environment Artist",
            "capstonePhase": {
              "id": "env-artist-capstone",
              "title": "3D Environment Capstone: Production Real-Time Game Environment",
              "description": "Architect and build a complete real-time 3D environment inside Unreal Engine 5 featuring modular kitbashing, Nanite meshes, Lumen lighting, and PBR textures.",
              "estimatedDuration": "Weeks 19–24",
              "skills": [
                "Unreal Engine 5 (Nanite & Lumen)",
                "Modular Architectural Kits",
                "Foliage & Landscape Generation",
                "Real-Time Performance Optimization"
              ],
              "learn": [
                "Designing modular architectural kit pieces that snap seamlessly to grid coordinates with zero seam overlap",
                "Unreal Engine 5 core systems: Nanite virtualized geometry, Lumen real-time global illumination, and Virtual Shadow Maps",
                "Landscape sculpting, master material shader creation with runtime virtual texturing (RVT), and foliage placement",
                "Performance profiling: GPU frame time analysis, draw calls, shader complexity, and maintaining target 60 FPS"
              ],
              "practice": [
                "Build a modular architectural kit of 15 pieces and construct a complete historical or sci-fi interior scene",
                "Light an environment in Unreal Engine 5 using Lumen dynamic lighting to achieve cinematic mood and atmosphere"
              ],
              "build": "A portfolio-ready 3D game environment in Unreal Engine 5 complete with video walkthrough flythrough, beauty renders, asset breakdown sheets, and wireframe turntable videos.",
              "resources": [
                {
                  "name": "Unreal Engine 5 Environment Art Guide",
                  "type": "documentation",
                  "difficulty": "advanced",
                  "estimatedTime": "4 weeks",
                  "url": "https://dev.epicgames.com/community/learning"
                }
              ]
            }
          }
        }
      },
      "character-animation": {
        "id": "character-animation",
        "name": "Character Animation & Rigging",
        "phases": [
          {
            "id": "char-anim-phase-2",
            "phase": 3,
            "title": "Character Rigging, Kinematics (FK/IK) & Skin Weighting",
            "description": "Build skeletal joint hierarchies, configure Forward/Inverse Kinematics (FK/IK), paint smooth skin weights, and author facial blendshapes.",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "Skeletal Rigging",
              "FK / IK Systems & Switching",
              "Skin Weight Painting",
              "Facial Blendshapes"
            ],
            "learn": [
              "Skeletal anatomy for rigging: joint orientation, local rotation axes, gimbal lock prevention, and hierarchical parenting",
              "Inverse Kinematics (IK) solvers: two-bone IK, pole vector constraints, and building seamless FK/IK switching systems",
              "Smooth skin weight painting: component editor, normalizing influence weights, dual-quaternion skinning to eliminate volume loss",
              "Facial rigging: blendshape sculpting (ARKit 52 facial blendshapes), bone-driven facial joints, and eye gaze tracking"
            ],
            "practice": [
              "Rig a full biped character from scratch with stretchy limbs, reverse foot roll setup, and custom control curves",
              "Paint skin weights on a character shoulder and elbow joint achieving clean deformations throughout full ranges of motion"
            ],
            "build": "A production-ready biped character animation rig with FK/IK switching, spine bends, reverse foot controls, and facial expressions.",
            "resources": [
              {
            "name": "Blender Official Manual: Armatures & Character Rigging",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://docs.blender.org/manual/en/latest/animation/armatures/index.html"
          }
            ]
          },
          {
            "id": "char-anim-phase-3",
            "phase": 4,
            "title": "Performance Character Animation, Locomotion & Acting",
            "description": "Animate expressive biped character walk cycles, weight shifts, action acrobatics, and emotional dialogue acting performance.",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "Biped Walk & Run Cycles",
              "Weight & Momentum Dynamics",
              "Character Acting & Lip Sync",
              "Graph Editor Polish"
            ],
            "learn": [
              "Locomotion mechanics: contact, down, passing, and up poses in walk and run cycles with realistic hip and spine rotation",
              "Communicating physical weight: center of gravity, line of action, overlap, follow-through, and realistic settling frames",
              "Character acting: subtext, thought process beats, eye darts, posture shifts, and authentic physical performance",
              "Dialogue and facial animation: phoneme mouth shapes (visemes), jaw dynamics, and eyebrow emotional accents"
            ],
            "practice": [
              "Animate a personality-infused walk cycle communicating a distinct character emotion (confident, dejected, stealthy)",
              "Animate a 15-second character acting dialogue scene from audio reference with full body performance and lip sync"
            ],
            "build": "An animation showreel featuring a personality locomotion cycle, an athletic action stunt, and an expressive dialogue acting shot.",
            "resources": [
              {
            "name": "Alan Becker: The 12 Principles of Animation Video Guide",
            "type": "video",
            "difficulty": "intermediate",
            "estimatedTime": "3 weeks",
            "url": "https://www.youtube.com/playlist?list=PL-bOh8btec4CXd2ya1NmSKpi92U_l6ZJq"
          }
            ]
          }
        ]
      },
      "vfx-motion-graphics": {
        "id": "vfx-motion-graphics",
        "name": "Visual Effects & Dynamic Motion",
        "phases": [
          {
            "id": "vfx-phase-2",
            "phase": 3,
            "title": "Procedural VFX Simulations with Houdini (Pyro, Particles, Destruction)",
            "description": "Master node-based procedural simulations in SideFX Houdini: VEX scripting, particle systems (POPs), fire/smoke (Pyro), and rigid body destruction (RBD).",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "Houdini Node Workflows",
              "VEX Coding Basics",
              "Pyro Fire & Smoke",
              "Rigid Body Destruction (RBD)"
            ],
            "learn": [
              "Houdini procedural architecture: Surface Operators (SOPs), Dynamics Operators (DOPs), attributes (@P, @N, @v), and VEX code",
              "Particle dynamics (POPs): forces, collision behavior, particle emission, life cycles, and trail meshes",
              "Pyro solver: volumetric sparse solvers, combustion models, buoyancy, temperature fields, and realistic smoke dissipation",
              "Rigid Body Dynamics (RBD): Voronoi fracturing, constraint networks (glue, hard, soft), and realistic architectural destruction"
            ],
            "practice": [
              "Simulate an explosive building collapse in Houdini using Voronoi fracturing, glue constraints, and secondary dust particles",
              "Author a procedural campfire or fireball simulation utilizing the sparse Pyro solver with realistic turbulence fields"
            ],
            "build": "A dynamic Houdini VFX simulation shot featuring fractured geometry destruction, secondary dust particles, and fiery pyro plumes.",
            "resources": [
              {
                "name": "SideFX Houdini Official Learning Paths",
                "type": "documentation",
                "difficulty": "intermediate",
                "estimatedTime": "6 weeks",
                "url": "https://www.sidefx.com/learn/"
              }
            ]
          },
          {
            "id": "vfx-phase-3",
            "phase": 4,
            "title": "VFX Compositing, Matchmoving & Photorealistic Integration (Nuke)",
            "description": "Composite CG elements into live-action footage using Foundry Nuke: node-based compositing, camera tracking, green screen keying, and color matching.",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "Foundry Nuke Compositing",
              "3D Camera Matchmoving",
              "Green Screen Chroma Keying",
              "CG Multi-Pass Integration"
            ],
            "learn": [
              "Node-based compositing in Nuke: channel architecture, merge mathematical operations (plus, multiply, over), and premultiplication",
              "3D camera tracking: feature detection, solving camera focal length, ground plane alignment, and undistortion grids",
              "Chroma keying: Primatte / Keylight algorithms, despill operations, edge blending, and preserving fine hair detail",
              "Rebuilding the beauty pass: assembling multi-channel EXR render passes (diffuse, specular, reflection, refraction, depth, normals)"
            ],
            "practice": [
              "Track a live-action handheld video plate and place a 3D simulated asset with matched camera motion and realistic contact shadows",
              "Key out a green screen actor plate, replace the background, match grain/lens softness, and grade color balance seamlessly"
            ],
            "build": "A photorealistic live-action visual effects integration shot composited in Nuke featuring 3D camera tracking, keyed actors, and CG element interaction.",
            "resources": [
              {
            "name": "Foundry Nuke Official Tutorials & Compositing Documentation",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "5 weeks",
            "url": "https://learn.foundry.com/nuke"
          }
            ]
          }
        ]
      }
    }
  },
  "supply-chain-operations": {
    "pathSlug": "supply-chain-operations",
    "pathName": "Supply Chain & Global Operations",
    "foundationalPhases": [
      {
        "id": "supply-found-1",
        "phase": 1,
        "title": "Supply Chain Systems, Operations Economics & Process Flow",
        "description": "Understand the end-to-end supply chain ecosystem, operations economics, inventory costs, and value stream mapping.",
        "estimatedDuration": "Weeks 1–4",
        "skills": [
          "Supply Chain Core Frameworks (SCOR)",
          "Operations Economics",
          "Value Stream Mapping",
          "Lead Time & Cycle Time Analysis"
        ],
        "learn": [
          "The supply chain life cycle: Plan, Source, Make, Deliver, and Return within the SCOR framework",
          "Operations economics: Cost of Goods Sold (COGS), holding costs, transportation costs, and Total Cost of Ownership (TCO)",
          "Process flow analysis: mapping value streams, identifying operational bottlenecks, and reducing lead times",
          "Global trade and transportation modes: comparing air, ocean, rail, and trucking logistics for international freight"
        ],
        "practice": [
          "Map the complete global supply chain journey of an everyday consumer item (e.g. sneakers or coffee) from raw materials to store shelf",
          "Calculate total landed cost for imported products comparing sea freight vs. air freight trade-offs"
        ],
        "build": "A Value Stream Map and Supply Chain Flow Analysis detailing supplier stages, transportation modes, holding points, and lead times for a consumer product.",
        "resources": [
          {
            "name": "ASCM: Introduction to Supply Chain Principles & Body of Knowledge",
            "type": "documentation",
            "difficulty": "beginner",
            "estimatedTime": "3 weeks",
            "url": "https://www.ascm.org/learning-development/"
          },
          {
            "name": "OpenStax: Principles of Management (Operations & Supply Chain)",
            "type": "book",
            "difficulty": "beginner",
            "estimatedTime": "6 weeks",
            "url": "https://openstax.org/details/books/principles-management"
          }
        ]
      },
      {
        "id": "supply-found-2",
        "phase": 2,
        "title": "Inventory Management, Spreadsheet Modeling & Quality Control",
        "description": "Master inventory classification (ABC analysis), Economic Order Quantity (EOQ), spreadsheet forecasting models, and quality standards.",
        "estimatedDuration": "Weeks 5–8",
        "skills": [
          "Inventory Control (EOQ & Safety Stock)",
          "ABC Inventory Analysis",
          "Spreadsheet Operations Modeling",
          "Lean & Quality Management (Six Sigma Basics)"
        ],
        "learn": [
          "Inventory control models: Economic Order Quantity (EOQ), reorder point formulas, and calculating safety stock buffers",
          "ABC inventory stratification: prioritizing high-value inventory items based on Pareto's 80/20 principle",
          "Spreadsheet operations modeling: building automated inventory tracking, demand forecasting, and order trigger models",
          "Lean operations and Six Sigma: eliminating the 8 deadly wastes (DOWNTIME), 5S workplace organization, and continuous improvement (Kaizen)"
        ],
        "practice": [
          "Build an Excel or Google Sheets inventory calculator computing EOQ and safety stock under fluctuating weekly customer demand",
          "Conduct an ABC classification analysis on a simulated warehouse inventory catalog of 500 SKUs"
        ],
        "build": "A Dynamic Warehouse Inventory & Operations Model in spreadsheets with automated reorder calculations, ABC categorization, and Lean process recommendations.",
        "resources": [
          {
            "name": "Lean Enterprise Institute: Lean Thinking & Practice Lexicon",
            "type": "documentation",
            "difficulty": "beginner",
            "estimatedTime": "2 weeks",
            "url": "https://www.lean.org/lexicon-terms/lean-thinking-and-practice/"
          },
          {
            "name": "Coursera: Everyday Excel & Data Analytics for Operations",
            "type": "course",
            "difficulty": "beginner",
            "estimatedTime": "4 weeks",
            "url": "https://www.coursera.org/learn/excel-analysis"
          }
        ]
      }
    ],
    "defaultAdvancedPhases": [
      {
        "id": "sc-adv-1",
        "phase": 3,
        "title": "Logistics Optimization, Freight Networks & Warehousing",
        "description": "Coordinate international freight corridors, manage modern warehouse operations, and optimize distribution hub routes.",
        "estimatedDuration": "Weeks 7–14",
        "skills": [
          "Freight Logistics",
          "Warehouse Operations (WMS)",
          "Inventory Management",
          "Transportation Modeling"
        ],
        "learn": [
          "Multi-modal freight networks: ocean container shipping, air cargo, intermodal rail, and last-mile trucking economics",
          "Warehouse management systems (WMS): slotting optimization, cross-docking, pick-pack-ship workflows, and automated storage (ASRS)",
          "Inventory principles: cycle stock, safety stock calculation, Economic Order Quantity (EOQ), and mitigating the Bullwhip Effect"
        ],
        "practice": [
          "Model an optimal warehouse slotting plan grouping high-velocity SKUs to minimize picker transit travel time",
          "Calculate safety stock levels required to sustain a 98% customer service level across volatile supplier lead times"
        ],
        "build": "A logistics distribution blueprint optimizing freight routing corridors, warehouse slotting layouts, and inventory reorder points.",
        "resources": [
          {
            "name": "Warehousing Education and Research Council (WERC) Best Practice Guides",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://werc.org/"
          }
        ]
      }
    ],
    "specializationTracks": {
      "global-logistics-trade": {
        "id": "global-logistics-trade",
        "name": "Logistics & Global Supply Chain",
        "phases": [
          {
            "id": "logistics-phase-2",
            "phase": 3,
            "title": "International Trade, Customs Compliance & Incoterms 2020",
            "description": "Master international commercial terms (Incoterms 2020), customs documentation, import/export tariffs, and ocean freight logistics.",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "Incoterms 2020",
              "Customs Compliance & Harmonized Tariffs",
              "Bill of Lading & Documentation",
              "Ocean & Air Freight Management"
            ],
            "learn": [
              "Incoterms 2020 rules: EXW, FOB, CIF, DDP, and the division of financial liability, transport costs, and insurance risks",
              "Harmonized Tariff Schedule (HTS) classification codes, customs valuation, country-of-origin rules, and duty drawback programs",
              "Shipping documentation: Bill of Lading (B/L), commercial invoices, packing lists, certificates of origin, and letters of credit",
              "Container shipping dynamics: TEUs, carrier alliances, demurrage and detention charges, and port congestion mitigation"
            ],
            "practice": [
              "Audit an international shipping dossier identifying customs classification errors and calculating correct tariff duties",
              "Select the optimal Incoterm and route for shipping containerized freight from Asia to European distribution hubs"
            ],
            "build": "A global trade compliance and freight routing playbook featuring Incoterms matrices, customs checklists, and carrier contracts.",
            "resources": [
              {
            "name": "International Chamber of Commerce: Incoterms 2020 Rules Overview",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "2 weeks",
            "url": "https://iccwbo.org/business-solutions/incoterms-rules/incoterms-2020/"
          }
            ]
          },
          {
            "id": "logistics-phase-3",
            "phase": 4,
            "title": "Global Distribution Network Design & Supply Chain Resiliency",
            "description": "Design multi-echelon distribution hub networks, optimize freight transport routes, and construct resilient disaster contingency plans.",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "Network Design & Center of Gravity",
              "Multi-Echelon Distribution",
              "Supply Chain Disruption Modeling",
              "Carrier Procurement"
            ],
            "learn": [
              "Distribution network modeling: Center of Gravity method and mixed-integer linear programming (MILP) for optimal facility location",
              "Multi-echelon inventory positioning: pooling safety stock in regional fulfillment centers vs. local spoke warehouses",
              "Supply chain risk and geopolitical resilience: dual-sourcing strategies, nearshoring economics, and geopolitical risk mitigation",
              "Freight procurement: conducting RFP bids, negotiating carrier master service agreements, and tracking fuel surcharge mechanisms"
            ],
            "practice": [
              "Calculate the mathematical center of gravity for placing a new regional distribution center minimizing total freight mileage",
              "Design an emergency supply chain contingency playbook simulating major maritime canal blockages or port strikes"
            ],
            "build": "An enterprise global distribution network master plan: mathematical facility placement models, multi-echelon inventory allocations, and geopolitical risk mitigation strategies.",
            "resources": [
              {
            "name": "OpenStax: Principles of Management",
            "type": "book",
            "difficulty": "intermediate",
            "estimatedTime": "6 weeks",
            "url": "https://openstax.org/details/books/principles-management"
          }
            ]
          }
        ],
        "roleOverrides": {
          "supply-chain-analyst": {
            "roleId": "supply-chain-analyst",
            "roleTitle": "Global Supply Chain Analyst",
            "capstonePhase": {
              "id": "sc-analyst-capstone",
              "title": "Supply Chain Capstone: Global Logistics Optimization & Network Audit",
              "description": "Perform an end-to-end supply chain network optimization analyzing freight lane costs, landed TCO, inventory safety buffers, and risk mitigation.",
              "estimatedDuration": "Weeks 19–24",
              "skills": [
                "Freight Lane Cost Modeling",
                "Landed Cost Optimization",
                "Safety Stock Simulation",
                "Executive Logistics Defense"
              ],
              "learn": [
                "Building dynamic logistics cost models in Python/Excel analyzing historical freight rate indices (Freightos / Xeneta)",
                "Monte Carlo simulation of supply chain lead-time variability and stocking stockout risks",
                "Synthesizing freight procurement data into executive savings recommendations for the Chief Supply Chain Officer (CSCO)",
                "Negotiating service level agreements with 3PL (Third-Party Logistics) and 4PL logistics providers"
              ],
              "practice": [
                "Execute a freight lane cost audit across 20 global trade corridors identifying $500K+ in freight consolidation savings",
                "Present a complete supply chain resilience and nearshoring evaluation to an executive operations committee"
              ],
              "build": "A client-ready Global Supply Chain Audit Report: freight lane economic models, center-of-gravity facility proposals, safety stock formulas, and 3PL vendor scorecard.",
              "resources": [
                {
            "name": "Council of Supply Chain Management Professionals (CSCMP) Research",
            "type": "documentation",
            "difficulty": "advanced",
            "estimatedTime": "4 weeks",
            "url": "https://cscmp.org/"
          }
              ]
            }
          }
        }
      },
      "operations-strategy": {
        "id": "operations-strategy",
        "name": "Operations Strategy & Lean Process",
        "phases": [
          {
            "id": "ops-phase-2",
            "phase": 3,
            "title": "Lean Process Optimization, Six Sigma (DMAIC) & Kaizen",
            "description": "Eliminate operational waste using Lean principles, apply the Six Sigma DMAIC framework, and conduct statistical process control (SPC).",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "Lean Methodologies (5S / Poka-Yoke)",
              "Six Sigma DMAIC Framework",
              "Statistical Process Control (SPC)",
              "Bottleneck Theory (TOC)"
            ],
            "learn": [
              "The 8 forms of operational waste (TIMWOODS): Transportation, Inventory, Motion, Waiting, Overproduction, Over-processing, Defects, Skills",
              "Six Sigma DMAIC methodology: Define, Measure, Analyze, Improve, and Control phases for defect rate reduction",
              "Statistical Process Control (SPC): X-bar and R control charts, process capability indices (Cp, Cpk), and identifying special cause variation",
              "Theory of Constraints (Goldratt's TOC): identifying operational bottlenecks, drum-buffer-rope scheduling, and maximizing throughput"
            ],
            "practice": [
              "Conduct an operational Gemba walk identifying process waste and designing error-proofing (Poka-Yoke) interventions",
              "Construct an SPC control chart tracking manufacturing defect rates and calculate Cpk process capability"
            ],
            "build": "A comprehensive Six Sigma DMAIC process improvement charter detailing root-cause Ishikawa diagrams, SPC control charts, and ROI gains.",
            "resources": [
              {
            "name": "American Society for Quality (ASQ): Six Sigma Quality Tools",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://asq.org/quality-resources/six-sigma"
          }
            ]
          },
          {
            "id": "ops-phase-3",
            "phase": 4,
            "title": "Strategic Procurement, Vendor Management & Sustainable Operations",
            "description": "Design strategic sourcing frameworks, negotiate enterprise supplier contracts, and audit sustainable supply chains (ESG).",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "Kraljic Portfolio Matrix",
              "Supplier Relationship Management (SRM)",
              "Contract Negotiation",
              "Sustainable Sourcing & ESG"
            ],
            "learn": [
              "Strategic sourcing with the Kraljic Portfolio Matrix: categorizing spend into Strategic, Bottleneck, Leverage, and Non-critical items",
              "Supplier performance management: developing balanced supplier scorecards measuring on-time in-full (OTIF), quality, and cost compliance",
              "Negotiation strategies for commercial procurement: BATNA, concession planning, price adjustment indexes, and volume tiering",
              "Environmental, Social, and Governance (ESG) in operations: Scope 1, 2, and 3 emissions auditing, fair labor standards, and ethical sourcing"
            ],
            "practice": [
              "Map an enterprise's $50M procurement spend into the Kraljic Matrix formulating distinct sourcing strategies per category",
              "Conduct a supplier audit evaluation reviewing ESG sustainability compliance and operational risk exposures"
            ],
            "build": "A strategic procurement transformation package: Kraljic spend matrix, supplier scorecard rubrics, and ethical sourcing audit framework.",
            "resources": [
              {
            "name": "Institute for Supply Management (ISM): Supply Management Fundamentals",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "3 weeks",
            "url": "https://www.ismworld.org/"
          }
            ]
          }
        ]
      },
      "demand-forecasting": {
        "id": "demand-forecasting",
        "name": "Demand Forecasting & Inventory Systems",
        "phases": [
          {
            "id": "demand-phase-2",
            "phase": 3,
            "title": "Quantitative Inventory Management & Safety Stock Optimization",
            "description": "Master multi-item inventory balancing, ABC/XYZ classification, service-level trade-offs, and multi-tier replenishment models.",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "ABC / XYZ Inventory Segmentation",
              "Safety Stock Mathematics",
              "Reorder Point (ROP) Formulas",
              "Holding Cost vs. Stockout Trade-offs"
            ],
            "learn": [
              "ABC inventory classification (Pareto 80/20 rule) combined with XYZ demand predictability matrix segmentation",
              "Mathematical safety stock calculation factoring in lead-time standard deviation and demand volatility (Z-score normal distributions)",
              "Dynamic Reorder Point (ROP) models: continuous review (s, Q) policies vs. periodic review (R, S) policies",
              "Cash flow implications of inventory: holding costs (carrying cost percentages), cost of capital, and inventory turnover ratios"
            ],
            "practice": [
              "Segment a catalog of 10,000 SKUs using ABC/XYZ analysis and assign differentiated service-level targets",
              "Calculate mathematically rigorous safety stock and reorder points for volatile seasonal consumer products"
            ],
            "build": "An automated inventory optimization model in Python/Excel calculating safety stock buffers, ROPs, and working capital savings.",
            "resources": [
              {
            "name": "ASCM: Planning & Inventory Management Educational Resources",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://www.ascm.org/learning-development/"
          }
            ]
          },
          {
            "id": "demand-phase-3",
            "phase": 4,
            "title": "Time-Series Demand Forecasting & Sales & Operations Planning (S&OP)",
            "description": "Implement time-series statistical forecasting (Exponential Smoothing, ARIMA), facilitate S&OP consensus meetings, and track forecast accuracy.",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "Time-Series Forecasting (Holt-Winters)",
              "Forecast Accuracy (MAPE / WAPE / Bias)",
              "Sales & Operations Planning (S&OP)",
              "ERP / WMS Integration"
            ],
            "learn": [
              "Statistical forecasting models: simple moving averages, Holt-Winters exponential smoothing (level, trend, seasonality), and machine learning regression",
              "Measuring forecast accuracy: Mean Absolute Percentage Error (MAPE), Weighted MAPE (WAPE), Root Mean Squared Error (RMSE), and tracking signal bias",
              "The 5-step Sales & Operations Planning (S&OP) cycle: data gathering, demand planning, supply planning, pre-S&OP, and executive S&OP review",
              "Integrating demand forecasts into enterprise ERP systems (SAP, Oracle NetSuite) to trigger automated purchase orders"
            ],
            "practice": [
              "Build a Holt-Winters time-series forecasting model predicting monthly SKU sales and benchmark against historical actuals",
              "Facilitate an S&OP consensus meeting reconciling sales team optimism against operations manufacturing constraints"
            ],
            "build": "A complete S&OP demand forecasting engine: time-series model code, MAPE accuracy tracking dashboards, and monthly S&OP executive slides.",
            "resources": [
              {
            "name": "Institute of Business Forecasting (IBF): Demand Planning Guides",
            "type": "documentation",
            "difficulty": "advanced",
            "estimatedTime": "4 weeks",
            "url": "https://ibf.org/"
          }
            ]
          }
        ]
      }
    }
  },
  "public-health-epidemiology": {
    "pathSlug": "public-health-epidemiology",
    "pathName": "Public Health & Global Epidemiology",
    "foundationalPhases": [
      {
        "id": "pubhealth-found-1",
        "phase": 1,
        "title": "Public Health Foundations, Social Determinants & Global Health",
        "description": "Explore the history of public health, global disease prevention, community wellness, and social determinants of health.",
        "estimatedDuration": "Weeks 1–4",
        "skills": [
          "Public Health Core Principles",
          "Social Determinants of Health",
          "Community Health Needs Assessment",
          "Global Health Systems"
        ],
        "learn": [
          "Core mission of public health: population-level prevention, wellness promotion, and health equity versus individual clinical medicine",
          "Social determinants of health: how education, income, neighborhood environment, and food security influence health outcomes",
          "Major public health milestones: clean water sanitation, immunization campaigns, motor vehicle safety, and infectious disease containment",
          "Global health frameworks: World Health Organization (WHO) priorities, CDC global health initiatives, and UN Sustainable Development Goals"
        ],
        "practice": [
          "Conduct a simulated Community Health Needs Assessment analyzing health disparities and environmental factors in a local or regional population",
          "Evaluate the effectiveness and cultural appropriateness of a historical public health awareness campaign"
        ],
        "build": "A Community Health Profile Report identifying major health disparities, environmental risk factors, and recommended preventive interventions for a target region.",
        "resources": [
          {
            "name": "CDC Public Health 101 Training Series",
            "type": "course",
            "difficulty": "beginner",
            "estimatedTime": "3 weeks",
            "url": "https://www.cdc.gov/training/publichealth101/"
          },
          {
            "name": "World Health Organization: Global Health Observatory",
            "type": "documentation",
            "difficulty": "beginner",
            "estimatedTime": "2 weeks",
            "url": "https://www.who.int/data/gho"
          }
        ]
      },
      {
        "id": "pubhealth-found-2",
        "phase": 2,
        "title": "Epidemiological Methods, Biostatistics & Outbreak Investigation",
        "description": "Master fundamental epidemiological metrics (incidence, prevalence), study designs, introductory biostatistics, and outbreak response steps.",
        "estimatedDuration": "Weeks 5–8",
        "skills": [
          "Epidemiological Measures (Incidence / Prevalence)",
          "Study Designs (Cohort vs. Case-Control)",
          "Introductory Biostatistics",
          "Outbreak Investigation Steps"
        ],
        "learn": [
          "Measures of disease frequency: incidence rate, prevalence proportion, crude vs. adjusted mortality rates, and attack rates",
          "Epidemiological study designs: cross-sectional surveys, retrospective case-control studies, and prospective cohort studies",
          "Introductory biostatistics: interpreting risk ratios (RR), odds ratios (OR), 95% confidence intervals, and p-values",
          "The 10-step outbreak investigation framework: establishing case definitions, constructing epidemic curves (epi curves), and tracing contacts"
        ],
        "practice": [
          "Calculate incidence rates, relative risk, and odds ratios from simulated epidemiological data tables",
          "Plot and interpret an epidemic curve for a simulated foodborne disease outbreak to determine point source vs. continuous exposure"
        ],
        "build": "A simulated Outbreak Investigation Portfolio complete with epidemic curve charts, attack rate calculations, case definitions, and public containment recommendations.",
        "resources": [
          {
            "name": "CDC: Principles of Epidemiology in Public Health Practice",
            "type": "book",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://www.cdc.gov/csels/dsepd/ss1978/"
          },
          {
            "name": "OpenEpi: Open Source Epidemiological Statistics",
            "type": "practice",
            "difficulty": "beginner",
            "estimatedTime": "2 weeks",
            "url": "https://www.openepi.com"
          }
        ]
      }
    ],
    "defaultAdvancedPhases": [
      {
        "id": "ph-adv-1",
        "phase": 3,
        "title": "Disease Surveillance, Outbreak Containment & Health Policy",
        "description": "Establish disease surveillance registries, investigate active pathogen outbreaks, and formulate community preventive health policies.",
        "estimatedDuration": "Weeks 7–14",
        "skills": [
          "Disease Surveillance Systems",
          "Outbreak Investigation Steps",
          "Contact Tracing Protocols",
          "Health Intervention Design"
        ],
        "learn": [
          "Public health surveillance: active vs. passive surveillance, syndromic surveillance, and mandatory notifiable disease registries",
          "The CDC 10-step outbreak investigation protocol: verifying diagnosis, establishing case definitions, constructing epidemic curves",
          "Epidemic curves (epi curves): interpreting point-source, common-vehicle, and propagated person-to-person transmission vectors",
          "Formulating community health interventions: vaccination campaigns, water sanitation directives, and health education messaging"
        ],
        "practice": [
          "Construct and interpret an epidemic curve from active field outbreak data determining incubation periods and transmission modes",
          "Design a community preventative health campaign targeting chronic metabolic disease or childhood immunization gaps"
        ],
        "build": "An infectious disease outbreak investigation report complete with case definitions, epidemic curves, transmission hypotheses, and containment directives.",
        "resources": [
          {
            "name": "CDC Field Epidemiology Manual",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://www.cdc.gov/fem/"
          }
        ]
      }
    ],
    "specializationTracks": {
      "epidemiology-surveillance": {
        "id": "epidemiology-surveillance",
        "name": "Epidemiological Surveillance & Disease Modeling",
        "phases": [
          {
            "id": "epi-surv-phase-2",
            "phase": 3,
            "title": "Mathematical Disease Modeling (SIR/SEIR) & Contact Dynamics",
            "description": "Model infectious disease transmission dynamics using differential equations (SIR/SEIR), calculate basic reproduction numbers (R0), and simulate herd immunity.",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "Mathematical Epidemiological Modeling (SIR / SEIR)",
              "Basic Reproduction Number (R0 / Rt)",
              "Herd Immunity Thresholds",
              "Contact Network Simulation"
            ],
            "learn": [
              "Compartmental mathematical models: Susceptible-Infectious-Recovered (SIR) and SEIR differential equation systems in Python/R",
              "The basic reproduction number (R0) and effective reproduction number (Rt): calculation methods and sensitivity to social interventions",
              "Herd immunity thresholds: mathematical equations factoring in vaccine efficacy, waning immunity, and viral variants",
              "Agent-based modeling: simulating human mobility networks, superspreading events, and targeted quarantine effectiveness"
            ],
            "practice": [
              "Simulate an SIR epidemic outbreak model in Python evaluating the quantitative flattening effect of non-pharmaceutical interventions",
              "Calculate time-varying Rt metrics from real-world daily case telemetry to evaluate when an outbreak begins to recede"
            ],
            "build": "An interactive mathematical epidemic simulation model in Python predicting hospital bed capacity needs under varying intervention scenarios.",
            "resources": [
              {
            "name": "CDC: Epidemic Intelligence Service (EIS) Case Studies",
            "type": "practice",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://www.cdc.gov/eis/casestudies.html"
          }
            ]
          },
          {
            "id": "epi-surv-phase-3",
            "phase": 4,
            "title": "Spatial Epidemiology, GIS Disease Mapping & Global Surveillance",
            "description": "Map spatial disease clusters using GIS (QGIS/ArcGIS), analyze environmental spatial risk factors, and coordinate with international health registries (WHO).",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "Spatial GIS Disease Mapping (QGIS / R)",
              "Spatial Cluster Detection (SaTScan)",
              "Global Health Surveillance (WHO IHR)",
              "Environmental Geostatistics"
            ],
            "learn": [
              "Geographic Information Systems (GIS) in public health: coordinate systems, spatial geocoding, choropleth maps, and density heatmaps",
              "Spatial scan statistics (SaTScan / Moran's I): detecting statistically significant geographic disease clusters and anomalies",
              "International Health Regulations (WHO IHR): global disease notification, public health emergencies of international concern (PHEIC)",
              "Integrating satellite remote sensing data (temperature, rainfall, vegetation) to model vector-borne disease transmission (Malaria, Dengue)"
            ],
            "practice": [
              "Build a spatial GIS disease map in QGIS identifying statistically significant localized cancer or infectious disease clusters",
              "Model vector-borne disease expansion risks using spatial precipitation and temperature environmental raster layers"
            ],
            "build": "A spatial epidemiology dossier featuring GIS cluster maps, environmental correlation models, and global disease surveillance reports.",
            "resources": [
              {
            "name": "CDC Epi Info: Open Source Disease Surveillance & Mapping Software",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://www.cdc.gov/epiinfo/index.html"
          }
            ]
          }
        ],
        "roleOverrides": {
          "field-epidemiologist": {
            "roleId": "field-epidemiologist",
            "roleTitle": "Field Epidemiologist",
            "capstonePhase": {
              "id": "field-epi-capstone",
              "title": "Field Epidemiology Capstone: End-to-End Outbreak Investigation & Containment Dossier",
              "description": "Conduct an end-to-end field outbreak investigation of a simulated viral contagion: draft case definitions, build epidemic curves, calculate R0, and coordinate emergency response.",
              "estimatedDuration": "Weeks 19–24",
              "skills": [
                "Field Outbreak Response",
                "Case Definition Standardization",
                "Contact Tracing Management",
                "Health Ministry Briefing"
              ],
              "learn": [
                "Deploying rapid response field epidemiological teams to outbreak epicenters under crisis constraints",
                "Establishing biosafety protocols for clinical field sample collection and cold-chain transport",
                "Synthesizing epidemiological contact tracing data into transmission chain network graphs",
                "Delivering urgent public health briefings to government health ministers and national media"
              ],
              "practice": [
                "Investigate a simulated hospital-acquired infection or foodborne contagion tracing patient zero and exposure pathways",
                "Draft an emergency national public health directive containing mandatory isolation guidelines and medical countermeasures"
              ],
              "build": "A comprehensive Field Epidemiological Outbreak Dossier: clinical case definitions, verified contact tracing trees, epidemic curves, biostatistical analysis, and official ministry emergency directives.",
              "resources": [
                {
            "name": "American Public Health Association: Communicable Diseases Manual",
            "type": "documentation",
            "difficulty": "advanced",
            "estimatedTime": "4 weeks",
            "url": "https://www.apha.org/ccdm"
          }
              ]
            }
          }
        }
      },
      "health-policy-systems": {
        "id": "health-policy-systems",
        "name": "Global Health Policy & Healthcare Systems",
        "phases": [
          {
            "id": "hpol-phase-2",
            "phase": 3,
            "title": "Health Economics, Cost-Effectiveness & Quality of Life (QALYs)",
            "description": "Evaluate healthcare economic policies, calculate Quality-Adjusted Life Years (QALYs), and conduct Incremental Cost-Effectiveness Ratio (ICER) analysis.",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "Cost-Effectiveness Analysis (CEA)",
              "QALYs & DALYs",
              "Incremental Cost-Effectiveness (ICER)",
              "Healthcare Reimbursement Models"
            ],
            "learn": [
              "Health economics metrics: Quality-Adjusted Life Years (QALYs), Disability-Adjusted Life Years (DALYs), and willingness-to-pay thresholds",
              "Cost-effectiveness analysis (CEA): calculating Incremental Cost-Effectiveness Ratios (ICER) to evaluate medical treatments and vaccines",
              "Healthcare financing structures: single-payer (Beveridge/National Health Insurance), multi-payer (Bismarck), and out-of-pocket systems",
              "Provider reimbursement models: Fee-for-Service (FFS), capitation, bundled payments, and value-based care incentives"
            ],
            "practice": [
              "Conduct an ICER cost-effectiveness analysis evaluating a new preventative cardiovascular drug against the standard of care",
              "Model the budgetary impact on a national health agency of funding a subsidized universal vaccination program"
            ],
            "build": "A health economics technology assessment report calculating QALY gains, ICER ratios, and budgetary impact for a healthcare intervention.",
            "resources": [
              {
            "name": "World Health Organization: Health Financing & Economics Topics",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://www.who.int/health-topics/health-financing"
          }
            ]
          },
          {
            "id": "hpol-phase-3",
            "phase": 4,
            "title": "Healthcare System Reform, Universal Health Coverage & Policy Drafting",
            "description": "Design equitable health reform legislation, expand universal healthcare access, and address social determinants of health (SDOH).",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "Healthcare Legislative Drafting",
              "Universal Health Coverage (UHC)",
              "Social Determinants of Health (SDOH)",
              "Stakeholder Health Advocacy"
            ],
            "learn": [
              "Designing Universal Health Coverage (UHC) frameworks balancing population coverage, service breadth, and financial protection",
              "Addressing Social Determinants of Health (SDOH): food security, housing stability, environmental quality, and income inequality",
              "Drafting legislative policy bills: statutory language, regulatory oversight mechanisms, and enforcement bodies",
              "Coalition building: negotiating with physician associations, hospital networks, pharmaceutical lobbies, and patient advocacy groups"
            ],
            "practice": [
              "Draft a state or national legislative policy proposal expanding rural telemedicine access and reducing maternal mortality disparities",
              "Conduct a health equity impact assessment evaluating the disparate outcomes of proposed Medicaid / Medicare reforms"
            ],
            "build": "A comprehensive health policy reform proposal package: draft legislative bill language, fiscal impact analysis, and health equity assessment.",
            "resources": [
              {
                "name": "World Health Report: Health Systems Financing",
                "type": "documentation",
                "difficulty": "advanced",
                "estimatedTime": "3 weeks",
                "url": "https://www.who.int/publications/i/item/9789241564052"
              }
            ]
          }
        ]
      },
      "environmental-occupational-health": {
        "id": "environmental-occupational-health",
        "name": "Environmental & Occupational Health",
        "phases": [
          {
            "id": "envh-phase-2",
            "phase": 3,
            "title": "Environmental Toxicology, Exposure Assessment & Air/Water Quality",
            "description": "Assess toxic chemical exposures, dose-response curves, municipal drinking water quality (PFAS/lead), and air particulate monitoring (PM2.5).",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "Environmental Toxicology",
              "Dose-Response Relationships",
              "Water Quality Standards (EPA)",
              "Air Pollution Monitoring (PM2.5 / Ozone)"
            ],
            "learn": [
              "Toxicological principles: toxicokinetics (absorption, distribution, metabolism, excretion), LD50, and Reference Dose (RfD)",
              "Exposure pathways: inhalation, dermal absorption, ingestion, and bioaccumulation across ecological food chains",
              "Water pollution standards: Safe Drinking Water Act (SDWA), maximum contaminant levels (MCLs) for lead, arsenic, and PFAS compounds",
              "Air pollution monitoring: criteria air pollutants (PM2.5, PM10, ozone, nitrogen dioxide), Air Quality Index (AQI), and dispersion modeling"
            ],
            "practice": [
              "Analyze chemical water sampling data from an industrial municipality identifying EPA maximum contaminant level violations",
              "Model human health carcinogenic risk associated with prolonged exposure to volatile organic compounds (VOCs)"
            ],
            "build": "An environmental health risk assessment report detailing toxicological exposure modeling, laboratory water sample analysis, and public remediation recommendations.",
            "resources": [
              {
            "name": "World Health Organization: Chemical Safety & Environmental Toxicology",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://www.who.int/health-topics/chemical-safety"
          }
            ]
          },
          {
            "id": "envh-phase-3",
            "phase": 4,
            "title": "Industrial Hygiene, Occupational Safety (OSHA) & Workplace Ergonomics",
            "description": "Conduct industrial workplace exposure audits, enforce OSHA compliance, implement ergonomics, and engineer hazard controls.",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "OSHA Compliance Audits",
              "Hierarchy of Hazard Controls",
              "Industrial Hygiene Sampling",
              "Workplace Ergonomics"
            ],
            "learn": [
              "The Hierarchy of Hazard Controls: Elimination, Substitution, Engineering Controls, Administrative Controls, and Personal Protective Equipment (PPE)",
              "OSHA standards (29 CFR 1910): Permissible Exposure Limits (PELs), Hazard Communication Standard, and respiratory protection programs",
              "Workplace industrial hygiene sampling: acoustic decibel dosimetry, chemical air sampling pumps, and thermal heat stress monitoring",
              "Workplace ergonomics: evaluating musculoskeletal disorder (MSD) risk factors using the NIOSH Lifting Equation and RULA scoring"
            ],
            "practice": [
              "Conduct a simulated industrial manufacturing safety inspection identifying noise, chemical, and ergonomic hazards",
              "Design an OSHA-compliant Respiratory Protection Program including fit-testing protocols and cartridge change schedules"
            ],
            "build": "An industrial hygiene and occupational safety audit report: workplace chemical exposure data, noise dosimetry maps, OSHA compliance checklist, and engineering hazard controls.",
            "resources": [
              {
            "name": "World Health Organization: Environmental & Occupational Health",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://www.who.int/health-topics/environmental-health"
          }
            ]
          }
        ]
      }
    }
  },
  "journalism-media-production": {
    "pathSlug": "journalism-media-production",
    "pathName": "Journalism & Media Broadcasting",
    "foundationalPhases": [
      {
        "id": "journal-found-1",
        "phase": 1,
        "title": "Journalistic Ethics, Media Literacy & Information Verification",
        "description": "Learn media literacy, the SPJ Code of Ethics, primary source verification, fact-checking, and combating misinformation.",
        "estimatedDuration": "Weeks 1–4",
        "skills": [
          "SPJ Code of Ethics",
          "Information Verification & Fact-Checking",
          "Media Literacy & Critical Thinking",
          "Primary Source Evaluation"
        ],
        "learn": [
          "The democratic role of journalism: the Fourth Estate, freedom of the press, and public accountability",
          "The SPJ Code of Ethics: Seek Truth and Report It, Minimize Harm, Act Independently, and Be Accountable & Transparent",
          "Media literacy: distinguishing verified news from commentary, sponsored content, propaganda, and satire",
          "Digital verification toolkits: lateral reading, cross-referencing public databases, reverse image lookup, and geolocation verification"
        ],
        "practice": [
          "Perform lateral reading and primary-source verification on 5 contested viral social media claims to establish factual accuracy",
          "Analyze case studies involving ethical dilemmas in breaking news reporting (e.g. privacy rights vs. public interest)"
        ],
        "build": "A Fact-Checking & Media Verification Dossier evaluating contemporary claims, citing verified primary documentation and explaining verification methodology.",
        "resources": [
          {
            "name": "Society of Professional Journalists (SPJ) Code of Ethics",
            "type": "documentation",
            "difficulty": "beginner",
            "estimatedTime": "1 week",
            "url": "https://www.spj.org/ethicscode.asp"
          },
          {
            "name": "Poynter Institute: Fact-Checking & Verification Resources",
            "type": "documentation",
            "difficulty": "beginner",
            "estimatedTime": "2 weeks",
            "url": "https://www.poynter.org/fact-checking/"
          }
        ]
      },
      {
        "id": "journal-found-2",
        "phase": 2,
        "title": "News Gathering, Investigative Interviewing & Inverted Pyramid Writing",
        "description": "Conduct structured interviews, evaluate sources, and write compelling news articles using the inverted pyramid structure.",
        "estimatedDuration": "Weeks 5–8",
        "skills": [
          "Inverted Pyramid News Writing",
          "Interviewing Techniques",
          "Headline & Lead Writing",
          "AP Style Basics"
        ],
        "learn": [
          "The inverted pyramid structure: crafting compelling leads (5 Ws and H), nut graphs, body progression, and background context",
          "Journalistic interviewing: preparing questions, active listening, attribution guidelines (on the record, off the record, on background)",
          "Source development: cultivating diverse sources, evaluating source reliability, and protecting whistleblower confidentiality",
          "Newsroom standards: Associated Press (AP) style rules, copyediting fundamentals, headline composition, and deadline management"
        ],
        "practice": [
          "Conduct a structured 15-minute mock interview with a subject and draft a 500-word news story with accurate quotes and strong lead",
          "Edit and rewrite an unorganized draft article according to AP style and inverted pyramid hierarchy"
        ],
        "build": "A Published News Story Portfolio containing a breaking news report, an interview feature article, and a headline/lead rewriting study.",
        "resources": [
          {
            "name": "The Associated Press Stylebook Online",
            "type": "documentation",
            "difficulty": "beginner",
            "estimatedTime": "Ongoing",
            "url": "https://www.apstylebook.com"
          },
          {
            "name": "Columbia Journalism Review (CJR): Media Analysis & Case Studies",
            "type": "documentation",
            "difficulty": "beginner",
            "estimatedTime": "2 weeks",
            "url": "https://www.cjr.org/analysis"
          }
        ]
      }
    ],
    "defaultAdvancedPhases": [
      {
        "id": "jour-adv-1",
        "phase": 3,
        "title": "Digital News Production, Multi-Platform Media & Fact-Checking",
        "description": "Produce multimedia news packages, verify online information and combat misinformation, and optimize digital publishing workflows.",
        "estimatedDuration": "Weeks 7–14",
        "skills": [
          "Multimedia News Production",
          "Open-Source Verification (OSINT)",
          "Digital Publishing & CMS",
          "Fact-Checking Standards"
        ],
        "learn": [
          "Digital newsroom workflows: content management systems (WordPress / Arc Publishing), headline writing for SEO, and social distribution",
          "Open-source intelligence (OSINT) and geolocation verification: reverse image searching, metadata analysis, and satellite imagery cross-referencing",
          "Multi-platform reporting: shooting B-roll video, recording clear mobile audio, and writing companion web text"
        ],
        "practice": [
          "Debunk a viral piece of social media misinformation using reverse image search, geolocation tools, and primary source records",
          "Produce a multi-platform digital news package combining 800 words of reported text, original photography, and an embedded audio clip"
        ],
        "build": "A digital multimedia news package featuring verified investigative text, original photojournalism, and fact-checking documentation.",
        "resources": [
          {
            "name": "The Data Journalism Handbook: Verification and Sourcing",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "3 weeks",
            "url": "https://datajournalism.com/"
          }
        ]
      }
    ],
    "specializationTracks": {
      "investigative-journalism": {
        "id": "investigative-journalism",
        "name": "Investigative & Digital Journalism",
        "phases": [
          {
            "id": "inv-jour-phase-2",
            "phase": 3,
            "title": "Public Records (FOIA), Corporate Filings & Document Forensics",
            "description": "File Freedom of Information Act (FOIA) requests, analyze SEC corporate disclosures (10-K/10-Q), search court dockets, and dissect leaked data.",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "FOIA & Public Records Requests",
              "Court Docket Research (PACER)",
              "Financial Statement Forensics",
              "Encrypted Source Protection"
            ],
            "learn": [
              "Filing state public records and federal Freedom of Information Act (FOIA) requests: drafting precise scope, fee waivers, and administrative appeals",
              "Court records research: searching PACER federal court dockets, state civil/criminal filings, and tracking indictment documents",
              "Financial document forensics: reading corporate SEC 10-K annual reports, discovering executive conflicts of interest, and nonprofit IRS Form 990 filings",
              "Operational security for journalists: encrypted messaging (Signal), PGP email encryption, secure dropboxes, and confidential source protection"
            ],
            "practice": [
              "Draft and file three formal FOIA requests with government agencies requesting public inspection records or contracting audits",
              "Analyze an IRS Form 990 nonprofit tax filing uncovering executive compensation irregularities or undisclosed related-party transactions"
            ],
            "build": "An investigative public records dossier compiling government audit findings, court filings, FOIA responses, and financial disclosure contradictions.",
            "resources": [
              {
            "name": "The Data Journalism Handbook: Investigative Research Methods",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://datajournalism.com/"
          }
            ]
          },
          {
            "id": "inv-jour-phase-3",
            "phase": 4,
            "title": "Long-Form Investigative Project, Whistleblowers & Legal Vetting",
            "description": "Investigate systemic corruption, conduct sensitive whistleblower interviews, navigate pre-publication legal libel vetting, and launch major exposés.",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "Long-Form Project Management",
              "Whistleblower Handling",
              "Pre-Publication Legal Vetting",
              "Impactful Editorial Pacing"
            ],
            "learn": [
              "Managing multi-month investigative projects: building chronology master spreadsheets, corroborating allegations with multiple independent sources",
              "Whistleblower ethics and safety: risk assessment, safe meeting protocols, physical security, and legal protections",
              "Pre-publication legal review: working with media defense attorneys to bulletproof articles against libel claims and defamation lawsuits",
              "No-surprise policy: drafting exhaustive, point-by-point right-of-reply letters to subjects of investigations and analyzing their responses"
            ],
            "practice": [
              "Author a comprehensive 3,000-word investigative exposé detailing institutional corruption with verified documentary proof",
              "Draft a formal right-of-reply letter to a corporate target outlining detailed investigative findings and setting a response deadline"
            ],
            "build": "A major publication-grade investigative exposé: a 3,000-word reported investigative story, primary document appendices, fact-checking bible, and right-of-reply log.",
            "resources": [
              {
            "name": "The Data Journalism Handbook: Data Gathering & Verification",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://datajournalism.com/"
          }
            ]
          }
        ],
        "roleOverrides": {
          "investigative-journalist": {
            "roleId": "investigative-journalist",
            "roleTitle": "Investigative Journalist",
            "capstonePhase": {
              "id": "inv-journalist-capstone",
              "title": "Investigative Journalism Capstone: Full Investigative Exposé & Evidence Dossier",
              "description": "Research, report, fact-check, and publish an independent long-form investigative exposé uncovering a public interest issue with extensive primary documentation.",
              "estimatedDuration": "Weeks 19–24",
              "skills": [
                "Full Investigative Storytelling",
                "Fact-Checking Bible Creation",
                "Primary Document Archival",
                "Public Impact Follow-Up"
              ],
              "learn": [
                "Creating a line-by-line fact-checking binder linking every factual assertion to an annotated primary document or recorded interview",
                "Crafting compelling long-form narrative structure that hooks readers while maintaining uncompromising evidentiary rigor",
                "Handling public blowback, retraction demands, and post-publication corrections with complete transparency",
                "Tracking legislative, regulatory, or criminal accountability outcomes triggered by the published reporting"
              ],
              "practice": [
                "Compile a comprehensive 100-page fact-checking binder verifying every name, date, and statistic in an investigative story",
                "Execute a post-publication impact campaign engaging civic organizations and public officials regarding findings"
              ],
              "build": "A Pulitzer-caliber investigative journalism portfolio: a fully reported 3,500-word investigative story, annotated evidence archive, verified fact-checking bible, and recorded audio/video interviews.",
              "resources": [
                {
            "name": "Pulitzer Prize: Investigative Reporting Archives & Case Studies",
            "type": "documentation",
            "difficulty": "advanced",
            "estimatedTime": "2 weeks",
            "url": "https://www.pulitzer.org/prize-winners-by-category/206"
          }
              ]
            }
          }
        }
      },
      "broadcast-documentary": {
        "id": "broadcast-documentary",
        "name": "Broadcast & Audio Storytelling",
        "phases": [
          {
            "id": "bcast-phase-2",
            "phase": 3,
            "title": "Broadcast Field Production, Camera Operation & Audio Engineering",
            "description": "Master broadcast video cameras, 3-point lighting setups, broadcast microphone techniques (lavalier/shotgun), and live control room operations.",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "Broadcast Camera Operation",
              "3-Point Lighting for Television",
              "Field Audio Recording",
              "Control Room Studio Operations"
            ],
            "learn": [
              "Electronic News Gathering (ENG) cameras: shutter speeds, white balance calibration, iris exposure, and framing broadcast interviews",
              "Field audio capture: dynamic vs. condenser microphones, wireless lavalier placement, boom shotgun operation, and monitoring decibel levels",
              "Lighting for television: key, fill, and backlight ratios, color temperature matching (3200K tungsten vs. 5600K daylight), and diffusion",
              "Live studio broadcast workflows: teleprompters, floor direction, multi-camera switching, and live remote satellite/bonded cellular feeds"
            ],
            "practice": [
              "Shoot and record a professional broadcast stand-up report on location with proper lighting and wireless lavalier audio",
              "Operate studio equipment executing a live 10-minute simulated newscast switching between anchor desk and field reporters"
            ],
            "build": "A broadcast television news package (wrap) featuring an on-camera standup, anchor intro/outro, soundbites, and b-roll footage.",
            "resources": [
              {
            "name": "NPR Training: Audio Storytelling, Reporting & Production",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://training.npr.org/"
          }
            ]
          },
          {
            "id": "bcast-phase-3",
            "phase": 4,
            "title": "Documentary Film Directing, Non-Linear Editing & Post-Production",
            "description": "Direct long-form documentary films, edit in Adobe Premiere Pro / DaVinci Resolve, grade color, and produce narrative investigative podcasts.",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "Documentary Directing",
              "Non-Linear Editing (Premiere / DaVinci)",
              "Color Grading & Sound Mixing",
              "Narrative Podcast Production"
            ],
            "learn": [
              "Documentary narrative pacing: three-act documentary structure, character development, and emotional verité cinematography",
              "Advanced non-linear editing (NLE): assembly cuts, rough cuts, J/L audio cuts, pacing rhythm, and archival b-roll montage",
              "Audio post-production and sound design: noise reduction (iZotope RX), room tone patching, compression, and documentary music scoring",
              "Narrative audio podcasting: voiceover narration recording, tape syncs, sound design scene reconstruction, and episodic structure"
            ],
            "practice": [
              "Edit a 10-minute short documentary film balancing archival historical media, talking head interviews, and musical score",
              "Produce and mix a 15-minute narrative investigative podcast episode with immersive atmospheric sound design"
            ],
            "build": "A completed 10-minute short documentary film and pilot narrative podcast episode complete with professional color grading and sound mix.",
            "resources": [
              {
            "name": "International Documentary Association: Educational Filmmaker Resources",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://www.documentary.org/"
          }
            ]
          }
        ]
      },
      "interactive-data-journalism": {
        "id": "interactive-data-journalism",
        "name": "Interactive & Data Storytelling",
        "phases": [
          {
            "id": "data-jour-phase-2",
            "phase": 3,
            "title": "Data Scraping, Cleaning & Public Records Analysis for Reporters",
            "description": "Scrape public records using Python (BeautifulSoup), clean messy government data in OpenRefine, and run exploratory statistical analyses.",
            "estimatedDuration": "Weeks 7–12",
            "skills": [
              "Data Scraping (Python / BeautifulSoup)",
              "Data Cleaning (OpenRefine / Pandas)",
              "Government Database Analysis",
              "Statistical Fact Checking"
            ],
            "learn": [
              "Extracting public data: web scraping government portals using Python, handling pagination, and querying public open data APIs (Socrata)",
              "Cleaning messy public records using OpenRefine: clustering text, handling inconsistent spellings, and formatting dates/currencies",
              "Exploratory data analysis for journalists in Pandas: grouping by agencies, calculating percentage changes, and finding statistical outliers",
              "Bulletproofing data stories: testing for selection bias, missing data caveats, and verifying calculations with independent statisticians"
            ],
            "practice": [
              "Scrape and clean a city government's public expenditure portal uncovering anomalous vendor payments or spending spikes",
              "Analyze public crime or housing inspection records calculating per-capita rates and identifying systemic neighborhood disparities"
            ],
            "build": "A data-driven investigative reporting piece complete with reproducible Python scraping scripts, clean datasets, and statistical findings.",
            "resources": [
              {
            "name": "The Data Journalism Handbook: Open Online Edition",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://datajournalism.com/"
          }
            ]
          },
          {
            "id": "data-jour-phase-3",
            "phase": 4,
            "title": "Interactive News Graphics, D3.js & Investigative Scrollytelling",
            "description": "Build interactive visual news charts with D3.js, code scrollytelling web experiences, and map geographical datasets with Mapbox.",
            "estimatedDuration": "Weeks 13–18",
            "skills": [
              "Interactive News Graphics (D3.js / Svelte)",
              "Scrollytelling & Scroll-Driven Media",
              "Interactive Geospatial Mapping (Mapbox)",
              "Responsive News Web Design"
            ],
            "learn": [
              "Data visualization for journalism: selecting truthful chart types, designing responsive charts that work on mobile screens, and color accessibility",
              "Interactive charting with D3.js: SVG rendering, scales, transitions, hover tooltips, and interactive filter controls",
              "Scrollytelling techniques: using Scrollama / Intersection Observer to trigger visual step transitions as readers scroll through investigative text",
              "Interactive map storytelling: Mapbox GL JS, vector tiles, choropleth layers, and geocoded narrative fly-tos"
            ],
            "practice": [
              "Build a responsive interactive scrollytelling web special where charts animate dynamically as the user reads investigative text",
              "Create an interactive Mapbox mapping feature allowing users to search their local zip code and explore local environmental inspection data"
            ],
            "build": "An award-winning caliber interactive data journalism web special featuring responsive D3.js charts, animated scrollytelling transitions, and searchable local data.",
            "resources": [
              {
            "name": "D3.js Official Getting Started & Interactive Visualization Tutorials",
            "type": "documentation",
            "difficulty": "intermediate",
            "estimatedTime": "4 weeks",
            "url": "https://d3js.org/getting-started"
          }
            ]
          }
        ]
      }
    }
  }
};
