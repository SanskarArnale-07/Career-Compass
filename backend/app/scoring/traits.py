"""
Trait definitions and the complete Q1-Q28 answer -> trait weight mapping.

Architecture:
  - 28 total questions
  - 24 core questions: exactly 3 core questions for each of the 8 dimensions
    (AN: q1-q3, TE: q4-q6, SC: q7-q9, BU: q10-q12, CR: q13-q15, SO: q16-q18, LE: q19-q21, EX: q22-q24)
  - 4 scenario-based differentiation questions (q25-q28) with explicit, balanced multi-trait evidence
"""

from __future__ import annotations

from enum import Enum


# ── 8-Dimension Trait Enum ───────────────────────────────────────────

class Trait(str, Enum):
    AN = "AN"  # Analytical
    TE = "TE"  # Technical
    SC = "SC"  # Scientific
    BU = "BU"  # Business
    CR = "CR"  # Creative
    SO = "SO"  # Social
    LE = "LE"  # Leadership
    EX = "EX"  # Exploration


# Human-readable labels (for API responses)
TRAIT_LABELS: dict[str, str] = {
    "AN": "Analytical",
    "TE": "Technical",
    "SC": "Scientific",
    "BU": "Business",
    "CR": "Creative",
    "SO": "Social",
    "LE": "Leadership",
    "EX": "Exploration",
}


# ── Question Options & Trait Weights ─────────────────────────────────
# Direct mapping: question_id -> option_text -> trait points

QUESTION_OPTIONS: dict[str, dict[str, dict[Trait, int]]] = {
    # ── 1. ANALYTICAL (AN) — 3 Core Questions ─────────────────────────────
    # q1: Evidence & Comparison (Data vs Intuition)
    "q1": {
        "Read customer reviews and look for recurring complaints or praises": {Trait.AN: 2},
        "Build a comparison checklist comparing exact technical specifications, warranty, and price-to-feature ratios": {Trait.AN: 3},
        "Ask friends or older siblings who already own one for their personal recommendation": {Trait.AN: 1},
        "Pick the one that looks and feels best to you in person at the local store": {},
    },
    # q2: Root-Cause Analysis & Troubleshooting (Systematic Decomposition)
    "q2": {
        "Redo the last few steps quickly from memory to see if that clears up the problem": {Trait.AN: 1},
        "Ask a classmate or teacher immediately for advice or a workaround": {},
        "Step through each slide and element one by one to isolate the exact component causing the failure": {Trait.AN: 3},
        "Look up common error codes or check recent changes to figure out what was modified last": {Trait.AN: 2},
    },
    # q3: Strategic Planning & Resource Allocation (Logical Prioritization)
    "q3": {
        "Estimate the hours needed for each task, rank them by urgency and difficulty, and schedule dedicated time blocks": {Trait.AN: 3},
        "Make a priority checklist and finish the hardest assignment first so the rest of the week is lighter": {Trait.AN: 2},
        "Work on whichever assignment you feel most motivated to do in the moment until it's finished": {Trait.AN: 1},
        "Team up with classmates so you can study together and keep each other accountable through the week": {},
    },

    # ── 2. TECHNICAL (TE) — 3 Core Questions ──────────────────────────────
    # q4: System Mechanics & Feature Exploration (How Things Work)
    "q4": {
        "Use it right away for its intended main purpose without worrying about how it works": {},
        "Explore the settings, shortcuts, and advanced configuration options to see what it can customize or automate": {Trait.TE: 3},
        "Share it with friends or classmates to see how they use it": {Trait.TE: 1},
        "Follow a tutorial or video guide to learn all the recommended features step by step": {Trait.TE: 2},
    },
    # q5: Engineering & Hands-On Construction (Building Systems)
    "q5": {
        "Wiring up sensors, assembling moving parts, or coding interactive buttons for the display": {Trait.TE: 3},
        "Designing the illustrations, color schemes, and poster layouts for the exhibit": {Trait.TE: 1},
        "Setting up the display equipment, screens, and audio-visual connections so everything runs smoothly": {Trait.TE: 2},
        "Writing the explanatory story and script that explains the concepts to the children": {},
    },
    # q6: Workflow Optimization & Automation (Efficiency Engineering)
    "q6": {
        "Get through it as quickly as possible by focusing and doing it in one continuous sprint": {Trait.TE: 1},
        "Spend time finding a script, keyboard shortcut, or automation tool to handle it automatically in the future": {Trait.TE: 3},
        "Alternate tasks or listen to music to keep yourself refreshed while finishing it": {},
        "Create a standardized reusable template or checklist that cuts down the manual steps each time": {Trait.TE: 2},
    },

    # ── 3. SCIENTIFIC (SC) — 3 Core Questions ─────────────────────────────
    # q7: Inquiry & Wondering "Why" (Hypothesis & Principles)
    "q7": {
        "I immediately want to isolate what caused the unexpected outcome and test a new hypothesis": {Trait.SC: 3},
        "I want to read the textbook or ask the teacher about the underlying chemical or physical law that explains it": {Trait.SC: 2},
        "I think it's a cool visual effect and remember what it looked like for future reference": {Trait.SC: 1},
        "I focus on writing down the exact observation required for the exam notes so I don't lose marks": {},
    },
    # q8: Controlled Testing & Variable Isolation (Scientific Method)
    "q8": {
        "Plant several seeds in different spots around the house and observe which ones grow best overall": {Trait.SC: 1},
        "Look up the standard growing conditions in a gardening book and follow the recommended advice": {},
        "Keep one group under standard conditions as a baseline while varying sunlight for the other pots": {Trait.SC: 2},
        "Keep soil, temperature, and container identical, change only one variable, and measure daily growth in millimeters": {Trait.SC: 3},
    },
    # q9: Fact Verification & Empirical Skepticism (Evaluating Claims)
    "q9": {
        "Check whether reputable news outlets or known science communicators have verified the claim": {Trait.SC: 2},
        "Look for the original scientific study to inspect sample size, methodology, and whether the data actually supports the claim": {Trait.SC: 3},
        "Mention it to family or friends in casual conversation to see what they think about it": {},
        "Wait to see if the claim is widely accepted over time before deciding whether to believe it": {Trait.SC: 1},
    },

    # ── 4. BUSINESS (BU) — 3 Core Questions ───────────────────────────────
    # q10: Resource Allocation & Budgeting (Cost-Benefit Logic)
    "q10": {
        "Compare vendors, negotiate discounts, and calculate cost-per-student to deliver maximum experience within budget": {Trait.BU: 3},
        "Prioritize fun entertainment and decorations first, and adjust remaining items if funds run short": {Trait.BU: 1},
        "Create an itemized expense ledger with a reserve buffer for unexpected last-minute costs": {Trait.BU: 2},
        "Brainstorm memorable themes and let someone else keep track of the receipts and bills": {},
    },
    # q11: Market Demand & Audience Needs (Customer Insight)
    "q11": {
        "Pick something you and your close friends really enjoy doing or eating": {Trait.BU: 1},
        "Survey students across different grades to identify what is missing from other stalls and what they are willing to spend money on": {Trait.BU: 3},
        "Create something elaborate and artistic that will stand out visually from every other stall": {},
        "Look at what stalls made the highest profit in previous years and improve on their format": {Trait.BU: 2},
    },
    # q12: Initiative Expansion & Scaling (Enterprise Thinking)
    "q12": {
        "Keep it small and only make a few for your closest friends so it doesn't feel like work": {},
        "Pre-order raw materials in bulk to lower costs and set up a clear delivery schedule": {Trait.BU: 2},
        "Partner with classmates to streamline production, price items properly, and expand to other sections or grades": {Trait.BU: 3},
        "Focus on making each individual piece unique and handcrafted even if it takes much longer": {Trait.BU: 1},
    },

    # ── 5. CREATIVE (CR) — 3 Core Questions ───────────────────────────────
    # q13: Aesthetic Curation & Design Polish (Visual Harmony)
    "q13": {
        "Use a default template and make sure the text is readable and correctly spelled": {Trait.CR: 1},
        "Carefully select colors, font pairings, visual balance, and custom imagery so the design looks professional and cohesive": {Trait.CR: 3},
        "Focus almost entirely on the factual bullet points; design matters very little as long as information is accurate": {},
        "Add relevant illustrations and neat headings to break up large paragraphs of text": {Trait.CR: 2},
    },
    # q14: Narrative Storytelling & Framing (Emotional Resonance)
    "q14": {
        "Use real-world examples and interactive questions to keep the audience engaged": {Trait.CR: 2},
        "Read through clear, structured bullet points covering all required curriculum facts": {},
        "Frame the facts as a dramatic story with relatable characters, suspense, and emotional resonance": {Trait.CR: 3},
        "Present charts, timelines, and quantitative maps that clearly display the timeline of events": {Trait.CR: 1},
    },
    # q15: Divergent Ideation & Novelty (Unconventional Thinking)
    "q15": {
        "Explore how today's emerging gadgets and transport will evolve into everyday appliances": {Trait.CR: 2},
        "Research current statistical forecasts and write a grounded, realistic summary of expected changes": {Trait.CR: 1},
        "Invent a completely novel cultural custom, architecture style, or artistic movement that doesn't exist today": {Trait.CR: 3},
        "Focus on the political governance structures and legal policies that will be needed": {},
    },

    # ── 6. SOCIAL (SO) — 3 Core Questions ─────────────────────────────────
    # q16: Empathetic Listening & Emotional Attunement (Human Understanding)
    "q16": {
        "Focus on your own assigned portion of the work so the project doesn't fall behind": {},
        "Reach out to them privately after the meeting to see if they're doing okay and listen to what's on their mind": {Trait.SO: 3},
        "Mention to the group that everyone needs to speak up equally so the work is distributed fairly": {Trait.SO: 1},
        "Offer to share your notes or pair up on a task so they don't feel overwhelmed by themselves": {Trait.SO: 2},
    },
    # q17: Conflict Mediation & Common Ground (Interpersonal Dynamics)
    "q17": {
        "Suggest a fair compromise where both sides get a portion of what they want": {Trait.SO: 2},
        "Step back and let them figure it out between themselves so you don't get caught in the middle": {},
        "Help each person articulate their perspective calmly so both sides feel genuinely heard and understood": {Trait.SO: 3},
        "Vote for whichever idea has stronger objective merits so the group can move forward quickly": {Trait.SO: 1},
    },
    # q18: Peer Mentorship & Community Service (Helping Others Flourish)
    "q18": {
        "Organizing the library books or lab equipment so the school spaces are orderly": {Trait.SO: 1},
        "Helping a younger student who is struggling with basic reading or math understand a difficult concept": {Trait.SO: 3},
        "Working independently on your own personal project or study goals in a quiet room": {},
        "Participating in a collaborative campus cleanup drive with a team of classmates": {Trait.SO: 2},
    },

    # ── 7. LEADERSHIP (LE) — 3 Core Questions ─────────────────────────────
    # q19: Initiative & Direction Setting (Breaking Stalls)
    "q19": {
        "Quietly start brainstorming your own ideas on paper while waiting for someone to take charge": {Trait.LE: 1},
        "Speak up, summarize the goal, suggest an initial starting step, and invite others to build on it": {Trait.LE: 3},
        "Wait patiently for the teacher or supervisor to come by and clarify the instructions": {},
        "Ask an open question to the group to see if anyone has a preference on how to proceed": {Trait.LE: 2},
    },
    # q20: Talent Mobilization & Delegation (Empowering Others)
    "q20": {
        "Find out what each person enjoys and is best at, and assign roles that play to their individual strengths": {Trait.LE: 3},
        "Write down all tasks on slips of paper and draw names randomly so no one feels favored": {Trait.LE: 1},
        "Ask for volunteers for each task and step in to take whatever difficult jobs remain unassigned": {Trait.LE: 2},
        "Let everyone grab whatever task they want and work on whatever you feel like doing": {},
    },
    # q21: Decisiveness & Composure Under Pressure (Crisis Accountability)
    "q21": {
        "Feel stressed and wait for someone with more authority to tell you what to do": {},
        "Look for a quick substitute material that is already available nearby": {Trait.LE: 2},
        "Gather the team calmly, make a swift decision on an alternative backup plan, and reassign tasks to meet the deadline": {Trait.LE: 3},
        "Figure out why the equipment failed so the error isn't repeated in the future": {Trait.LE: 1},
    },

    # ── 8. EXPLORATION (EX) — 3 Core Questions ────────────────────────────
    # q22: Curiosity for Unfamiliar Frontiers (Breadth of Inquiry)
    "q22": {
        "Watching a tutorial or video about a skill or sport you are currently trying to improve": {Trait.EX: 2},
        "Checking your usual favorite gaming or entertainment channels that you watch every day": {},
        "Reading or watching a documentary about a culture, planet, historical event, or technology you know almost nothing about": {Trait.EX: 3},
        "Reading updates and news about topics you are already familiar with": {Trait.EX: 1},
    },
    # q23: Adaptability in Novel Environments (Embracing the Unfamiliar)
    "q23": {
        "A bit hesitant at first, but comfortable once I find one person to sit with": {Trait.EX: 1},
        "Excited by the novelty—I look forward to discovering a new place and hearing fresh perspectives": {Trait.EX: 3},
        "Prefer sticking to familiar environments where I already know the routines and expectations": {},
        "Curious about the workshop topic itself and ready to dive into the activities regardless of who is there": {Trait.EX: 2},
    },
    # q24: Cross-Domain Synthesis (Connecting Divergent Fields)
    "q24": {
        "Focus strictly on memorizing the specific facts and definitions that will be tested on the exam": {},
        "Wonder how this connects to completely different fields—like how trade shaped culinary recipes, music, or language": {Trait.EX: 3},
        "Compare it to another chapter or subject you studied recently to see similarities in patterns": {Trait.EX: 2},
        "Think about how this concept applies directly to your own city or daily routine": {Trait.EX: 1},
    },

    # ── 9. DIFFERENTIATION SCENARIOS — 4 Scenario Questions ───────────────
    # q25: Scenario 1 — The School Festival Exhibition Stall
    "q25": {
        "Build the interactive working demonstration—assembling hardware, wiring components, or coding the digital display": {Trait.TE: 2, Trait.SC: 1},
        "Design the creative identity—painting banners, curating the visual theme, and crafting visitor storytelling boards": {Trait.CR: 2, Trait.SO: 1},
        "Manage the booth operations—tracking the materials budget, calculating visitor throughput, and promoting the booth to maximize turnout": {Trait.BU: 2, Trait.AN: 1},
        "Coordinate team roles, facilitate daily check-ins, keep energy high, and troubleshoot unexpected roadblocks on event day": {Trait.LE: 2, Trait.EX: 1},
    },
    # q26: Scenario 2 — The Campus Sustainability & Waste Challenge
    "q26": {
        "Conduct a systematic waste audit—weighing discards by category, charting peak hours, and building an automated tracking sheet": {Trait.AN: 2, Trait.TE: 1},
        "Run an engaging peer-led awareness initiative—organizing classroom discussions, student interviews, and visual story campaigns that inspire real habit change": {Trait.SO: 2, Trait.CR: 1},
        "Experiment with biological recycling solutions—testing cafeteria composting methods and analyzing soil decomposition rates with the biology lab": {Trait.SC: 2, Trait.EX: 1},
        "Research zero-waste models used in schools worldwide and pitch a proposal to school leadership for bulk reusable food containers": {Trait.EX: 2, Trait.LE: 1},
    },
    # q27: Scenario 3 — The Open Weekend Showcase Project
    "q27": {
        "Designing and running a home science experiment on water filtration, plant genetics, or aerodynamics, documenting every observation": {Trait.SC: 2, Trait.AN: 1},
        "Coding a useful mini-game or productivity web tool, or assembling a mechanical device from recycled electronic parts": {Trait.TE: 2, Trait.CR: 1},
        "Creating a student guide to saving and investing, or organizing a micro-fundraiser selling custom study planners to peers": {Trait.BU: 2, Trait.SO: 1},
        "Writing and illustrating an original speculative fiction comic, producing a short musical piece, or creating a digital concept art series": {Trait.CR: 2, Trait.EX: 1},
    },
    # q28: Scenario 4 — The Project Crossroads & 24-Hour Countdown
    "q28": {
        "Stress-test all data tables, check calculations, and eliminate any logical inconsistencies or weak arguments in the report": {Trait.AN: 2, Trait.TE: 1},
        "Rehearse the live presentation with strict timing, make sure every speaker is confident, and sharpen how the practical value is conveyed to the judges": {Trait.LE: 2, Trait.BU: 1},
        "Check in with teammates who are stressed or falling behind, redistribute the final slide-review duties, and ensure the team presents a united front": {Trait.SO: 2, Trait.LE: 1},
        "Add a bold, surprising live demonstration or creative interactive element that will make the judges remember your project above all others": {Trait.EX: 2, Trait.CR: 1},
    },
}


# ── Derived Index & Weight Maps (for backward compatibility) ──────────

OPTION_INDEX: dict[str, dict[str, int]] = {
    qid: {text: idx for idx, text in enumerate(opts, 1)}
    for qid, opts in QUESTION_OPTIONS.items()
}

TRAIT_WEIGHT_MAP: dict[str, dict[int, dict[Trait, int]]] = {
    qid: {idx: weights for idx, weights in enumerate(opts.values(), 1)}
    for qid, opts in QUESTION_OPTIONS.items()
}

TOTAL_QUESTIONS = 28
REQUIRED_QUESTION_IDS = [f"q{i}" for i in range(1, TOTAL_QUESTIONS + 1)]


def get_option_index(question_id: str, answer_text: str) -> int | None:
    """Resolve an answer's display text to its 1-indexed position."""
    return OPTION_INDEX.get(question_id, {}).get(answer_text)
