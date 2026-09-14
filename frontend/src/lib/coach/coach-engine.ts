/**
 * AI Career Coach Response Engine
 *
 * Provides journey-grounded, context-aware coaching advice.
 * Evaluates the student's actual Career Compass state:
 * - Career target & match %
 * - Assessment traits & skill gaps
 * - Roadmap phase & completed milestones
 * - Project portfolio readiness
 * - Study pace & timeline
 */

import type { CareerCoachContext } from "../career-details/career-context";

export const SUGGESTED_QUESTIONS = [
  "What should I do today?",
  "Am I ready for internships?",
  "What skill should I learn next?",
  "Why am I behind?",
  "How can I improve my readiness score?",
  "Which project should I build?",
  "I only have 5 hours this week. Plan my week.",
];

/**
 * Format the structured system prompt for the coach.
 */
export function buildCoachSystemPrompt(context: CareerCoachContext): string {
  return `You are Career Compass AI, the student's personal career intelligence coach.
You are NOT a generic chatbot. You have full, real-time access to the student's actual Career Compass journey.

STUDENT CAREER CONTEXT:
- Targeted Career: ${context.career.title} (${context.career.category})
- Match Alignment: ${context.career.matchPercentage}%
- Overall Readiness: ${context.readiness.overallScore}% (Level ${context.readiness.tierLevel}: ${context.readiness.tierName})
  * Foundations & Roadmap: ${context.readiness.foundationsScore}%
  * Skill Competency: ${context.readiness.skillsScore}%
  * Portfolio & Proof: ${context.readiness.portfolioScore}%
- Current Active Phase: Phase ${context.roadmap.currentPhaseNumber} — ${context.roadmap.currentPhaseTitle} (${context.roadmap.phaseProgressPercent}% of roadmap complete)
- Next Priority Action: ${context.nextAction.title} (${context.nextAction.estimatedTime})
- Top Priority Skill Gap: ${context.skills.priorityGaps[0]?.name || "None currently"}
- Mastered Skills: ${context.skills.mastered.length > 0 ? context.skills.mastered.join(", ") : "None verified yet"}
- Next Project to Build: ${context.projects.nextToBuild?.title || "All core projects completed"}
- Study Pace: ${context.studyPace.weeklyHours} hrs/week (~${context.studyPace.estimatedWeeksRemaining} weeks remaining until ${context.studyPace.targetMonthYear})
- Internship Readiness: ${context.jobPrep.isInternshipReady ? "Ready for introductory internships" : "Still building required proof"}

COACHING PRINCIPLES:
1. Always ground your responses in their specific numbers, active phase, and priority skill gaps.
2. Be direct, pragmatic, encouraging, and high-agency. Avoid generic boilerplate fluff.
3. Use bullet points, bold highlights, and clear actionable steps.
4. Keep answers focused (2–4 short paragraphs or bulleted milestones).`;
}

/**
 * Generate a grounded coach response deterministically.
 * This ensures 100% reliable responses without requiring external API keys.
 */
export async function generateLocalCoachResponse(
  userQuery: string,
  context: CareerCoachContext
): Promise<string> {
  const query = userQuery.trim().toLowerCase();
  const { career, readiness, roadmap, skills, projects, jobPrep, studyPace, nextAction } = context;

  // 1. "What should I do today?"
  if (query.includes("what should i do today") || query.includes("what to do today") || query.includes("today")) {
    const topGap = skills.priorityGaps[0];
    return `### 🎯 Your Focus for Today

Based on your current progress in **${career.title}**, here is your highest-leverage plan:

1. **Primary Milestone**: **${nextAction.title}**
   - **Why this now**: ${nextAction.reasoning}
   - **Time Commitment**: \`${nextAction.estimatedTime}\`

2. **Skill Gap Workout**:
   ${topGap ? `- Dedicate 30–45 minutes to **${topGap.name}** (${topGap.category}). ${topGap.whyItMatters}` : "- Spend 30 minutes practicing exercises from your active phase."}

3. **Weekly Velocity**:
   - You're on track at **${studyPace.weeklyHours} hrs/week** targeting readiness by **${studyPace.targetMonthYear}**. Completing today's milestone will push your Readiness Score past **${readiness.overallScore}%**.

> **Quick Action**: Head to your active phase in the roadmap and mark off the current concepts once you've reviewed them!`;
  }

  // 2. "Am I ready for internships?"
  if (query.includes("ready for internship") || query.includes("internship") || query.includes("ready for a job")) {
    const completedProjectsCount = projects.completed.length;
    const isReady = jobPrep.isInternshipReady;

    if (isReady) {
      return `### 🚀 Internship Readiness Assessment: **Ready to Apply!**

Great news! Your profile currently shows strong readiness for introductory internships in **${career.title}**:

- **Readiness Index**: **${readiness.overallScore}%** (Level ${readiness.tierLevel}: ${readiness.tierName})
- **Portfolio Proof**: You have built **${completedProjectsCount} projects**, giving recruiters verifiable code to evaluate.
- **Foundations**: You have completed **${roadmap.phaseProgressPercent}%** of the core curriculum.

#### What to do this week:
1. **Polish your GitHub & Portfolio**: Ensure your top project (**${projects.completed[0] || "Capstone"}**) has a clear README, setup guide, and demo screenshots.
2. **Apply to 3–5 early-career / student roles** with a targeted resume highlighting your specific skill competencies (${skills.mastered.slice(0, 3).join(", ") || "core tools"}).
3. **Practice technical problem solving**: Review common interview questions in your domain.`;
    }

    return `### 📋 Internship Readiness Assessment: **In Progress (${readiness.overallScore}%)**

You are currently at **Level ${readiness.tierLevel}: ${readiness.tierName}**. While you've made meaningful progress, you aren't quite ready for technical interviews yet. Here is exactly what is missing:

1. **Portfolio Proof (Current: ${projects.completed.length} projects built)**:
   - Recruiters need to see at least 1–2 deployed, functional projects.
   - **Next Target**: Build **${projects.nextToBuild?.title || "your first capstone project"}** (${projects.nextToBuild?.difficulty || "beginner"}).

2. **Core Skill Gap**:
   ${skills.priorityGaps.length > 0 ? `- You still have gaps in **${skills.priorityGaps.map((g) => g.name).join(" & ")}**. Closing these is critical before technical screening calls.` : "- Complete verification for your remaining domain skills."}

3. **Next Level Milestone**:
   - ${readiness.nextTierRequirement}

> **Bottom Line**: Focus 100% of your energy on shipping **${projects.nextToBuild?.title || "Project 1"}** over the next 2 weeks. That will unlock internship eligibility!`;
  }

  // 3. "What skill should I learn next?"
  if (query.includes("what skill") || query.includes("skill should i learn") || query.includes("learn next")) {
    const topGap = skills.priorityGaps[0];
    const nextGap = skills.priorityGaps[1];

    if (!topGap) {
      return `### 🌟 Skill Status: Solid Coverage!

You have addressed all priority gaps for Phase ${roadmap.currentPhaseNumber}!

- **Mastered Skills**: ${skills.mastered.join(", ") || "Foundations verified"}
- **Recommended Next Focus**: Deepen your hands-on execution by applying these skills into **${projects.nextToBuild?.title || "your next capstone project"}**.`;
    }

    return `### ⚡ Next High-Impact Skill: **${topGap.name}**

According to your assessment and progress in **${career.title}**, **${topGap.name}** is your #1 priority bottleneck.

- **Category**: ${topGap.category}
- **Why It Matters**: ${topGap.whyItMatters}
${nextGap ? `- **Secondary Follow-up**: **${nextGap.name}** (${nextGap.category})` : ""}

#### How to learn this efficiently:
1. Review the curated resources in **Phase ${roadmap.currentPhaseNumber}** of your roadmap.
2. Build a tiny 30-minute prototype specifically exercising ${topGap.name}.
3. Once confident, return to the **Skill Mastery Matrix** on your dashboard and toggle it to **Mastered** to boost your Skill Competency score!`;
  }

  // 4. "Why am I behind?"
  if (query.includes("why am i behind") || query.includes("behind") || query.includes("slow")) {
    return `### 💡 Honest Pace Assessment: You're Calibrating

Feeling behind is normal, but let's look at the actual data rather than gut feeling:

- **Target Career**: ${career.title} (${career.difficultyToEnter} barrier to entry)
- **Current Pace**: **${studyPace.weeklyHours} hrs/week**
- **Estimated Completion**: **${studyPace.targetMonthYear}** (~${studyPace.estimatedWeeksRemaining} weeks remaining)
- **Current Phase**: Phase ${roadmap.currentPhaseNumber} (${roadmap.currentPhaseTitle})

#### Why progress feels slower than expected:
1. **Phase ${roadmap.currentPhaseNumber} is a foundational hump**: This phase introduces concepts that require real cognitive rewiring. Don't rush it.
2. **Hours per week mismatch**: At ${studyPace.weeklyHours} hrs/week, you have ~${studyPace.estimatedWeeksRemaining} weeks left. If you want to accelerate to readiness faster, increasing your pace to **12–15 hrs/week** cuts your timeline almost in half!
3. **Actionable Fix**: Don't try to learn everything at once. Focus on **one micro-task**: ${nextAction.title}.`;
  }

  // 5. "How can I improve my readiness score?"
  if (query.includes("improve my readiness") || query.includes("readiness score") || query.includes("increase score")) {
    return `### 📈 How to Boost Your Readiness Score (Currently ${readiness.overallScore}%)

Your Career Readiness Index is calculated across **3 pillars**. Here is the fastest path to gain points right now:

1. **Portfolio & Proof (+15–25 pts)** — *Highest Yield!*
   - Build **${projects.nextToBuild?.title || "your next capstone project"}**. Checking off this project delivers an immediate jump in your Portfolio score (currently ${readiness.portfolioScore}%).

2. **Skill Mastery (+10–15 pts)**:
   ${skills.priorityGaps[0] ? `- Master and verify **${skills.priorityGaps[0].name}** in the Skill Matrix on your dashboard.` : "- Verify all remaining core skills in your active phase."}

3. **Foundations (+10 pts)**:
   - Complete the remaining tasks in **Phase ${roadmap.currentPhaseNumber}** (${roadmap.currentPhaseTitle}).

> **Target**: Reaching **${readiness.tierLevel < 4 ? "Level " + (readiness.tierLevel + 1) : "Maximum Mastery"}** requires: *${readiness.nextTierRequirement}*`;
  }

  // 6. "Which project should I build?"
  if (query.includes("which project") || query.includes("project should i build") || query.includes("build project")) {
    const proj = projects.nextToBuild;

    if (!proj) {
      return `### 🏆 Capstones Complete!
You have marked all core projects for **${career.title}** as built! Focus on creating your live portfolio page and writing case studies detailing your architecture.`;
    }

    return `### 🛠️ Recommended Project: **${proj.title}**

- **Difficulty Tier**: \`${proj.difficulty.toUpperCase()}\`
- **Why this project**: ${proj.description}

#### Core Features to Implement:
${proj.features.map((f, i) => `${i + 1}. **${f}**`).join("\n")}

#### Portfolio Value:
This project directly proves to recruiters that you can design, build, and deploy functional solutions in ${career.title}. Once finished, mark it as **Built** on your dashboard to unlock significant readiness points!`;
  }

  // 7. "I only have 5 hours this week. Plan my week."
  if (query.includes("5 hours") || query.includes("plan my week") || query.includes("hours this week")) {
    const topGap = skills.priorityGaps[0]?.name || "Core concepts";
    const proj = projects.nextToBuild?.title || "Portfolio deliverable";

    return `### ⏱️ Your 5-Hour High-Efficiency Weekly Sprint

When time is limited, focus exclusively on high-leverage milestones:

| Block | Focus Area | What to Do |
|---|---|---|
| **Hour 1–2** | **Phase ${roadmap.currentPhaseNumber} Curriculum** | Study **${nextAction.title}** and review docs/video resources. |
| **Hour 3** | **Skill Gap Workout** | Deliberate practice on **${topGap}** (solve 2 exercises). |
| **Hour 4–5** | **Project Sprint** | Work on feature #1 of **${proj}**. |

> **Coach's Rule**: Do not get distracted by side tutorials. Stick strictly to these 5 hours, and you will maintain consistent forward momentum toward **${studyPace.targetMonthYear}**!`;
  }

  // 8. General / Free-form Query Fallback
  return `### 🧭 Career Compass Guidance for ${career.title}

Regarding your question about **"${userQuery}"**:

In the context of your journey as an aspiring **${career.title}** (currently **Level ${readiness.tierLevel}: ${readiness.tierName}**, **${readiness.overallScore}% Readiness**):

- **Current Stage**: You are actively progressing through **Phase ${roadmap.currentPhaseNumber}: ${roadmap.currentPhaseTitle}**.
- **Key Bottleneck**: ${skills.priorityGaps[0] ? `Make sure to build solid competence in **${skills.priorityGaps[0].name}**.` : "Maintain consistent weekly project cadence."}
- **Immediate Recommended Action**: **${nextAction.title}** (${nextAction.estimatedTime}).

> Feel free to ask me to drill into any specific technical concept, explain a roadmap phase, or plan your next study sprint!`;
}
