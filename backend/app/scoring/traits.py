"""
Trait definitions and the complete Q1-Q20 answer → trait weight mapping.

Each answer's weights use the convention:
  Primary trait   = 3 points
  Secondary trait = 2 points
  Tertiary trait  = 1 point

Options are keyed by their **1-indexed position** within the question's
option list (matching the order in assessment-data.ts).
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


# ── Option-Text → Position Lookup ────────────────────────────────────
# Maps (question_id, option_text) → 1-indexed position.
# This avoids fragile substring matching at runtime.

OPTION_INDEX: dict[str, dict[str, int]] = {
    "q1": {
        "Building apps or websites": 1,
        "Creating art, music, or content": 2,
        "Helping people": 3,
        "Starting a business": 4,
        "Exploring science or technology": 5,
        "Traveling and discovering new places": 6,
    },
    "q2": {
        "Solving problems": 1,
        "Creating something": 2,
        "Talking with people": 3,
        "Playing games": 4,
        "Learning new things": 5,
        "Organizing or planning": 6,
    },
    "q3": {
        "Becoming financially free": 1,
        "Making a positive impact": 2,
        "Being recognized worldwide": 3,
        "Loving what I do every day": 4,
        "Building something meaningful": 5,
        "Constantly learning and growing": 6,
    },
    "q4": {
        "You're incredibly smart.": 1,
        "You're so creative.": 2,
        "You're an amazing leader.": 3,
        "You're kind and helpful.": 4,
        "You always find solutions.": 5,
        "You're inspiring.": 6,
    },
    "q5": {
        "AI & Robotics Lab": 1,
        "Creative Studio": 2,
        "Startup Office": 3,
        "Hospital": 4,
        "Research Center": 5,
        "Outdoor Adventure Camp": 6,
    },
    "q6": {
        "Learning new skills": 1,
        "Solving difficult challenges": 2,
        "Earning money": 3,
        "Helping others": 4,
        "Creating something unique": 5,
        "Becoming the best version of myself": 6,
    },
    "q7": {
        "Advice": 1,
        "Tech help": 2,
        "Funny conversations": 3,
        "Creative ideas": 4,
        "Planning things": 5,
        "Solving problems": 6,
    },
    "q8": {
        "Science projects": 1,
        "Coding": 2,
        "Debates": 3,
        "Drawing or designing": 4,
        "Sports": 5,
        "Organizing events": 6,
    },
    "q9": {
        "Technical problems": 1,
        "Business problems": 2,
        "Human problems": 3,
        "Creative challenges": 4,
        "Scientific mysteries": 5,
        "Real-world issues": 6,
    },
    "q10": {
        "Remote from anywhere": 1,
        "Corporate office": 2,
        "Startup": 3,
        "Creative workspace": 4,
        "Laboratory": 5,
        "Traveling frequently": 6,
    },
    "q11": {
        "Coding": 1,
        "Public Speaking": 2,
        "Designing": 3,
        "Business & Marketing": 4,
        "Artificial Intelligence": 5,
        "Medicine": 6,
    },
    "q12": {
        "I enjoy building things.": 1,
        "I enjoy helping people.": 2,
        "I enjoy leading people.": 3,
        "I enjoy creating things.": 4,
        "I enjoy discovering new ideas.": 5,
        "I enjoy improving existing things.": 6,
    },
    "q13": {
        "Technology": 1,
        "Finance": 2,
        "Gaming": 3,
        "Travel": 4,
        "Educational": 5,
        "Art & Entertainment": 6,
    },
    "q14": {
        "Invest it": 1,
        "Start a company": 2,
        "Travel the world": 3,
        "Support my family": 4,
        "Donate to a cause": 5,
        "Buy my dream gadgets": 6,
    },
    "q15": {
        "Curious": 1,
        "Creative": 2,
        "Practical": 3,
        "Ambitious": 4,
        "Compassionate": 5,
        "Confident": 6,
    },
    "q16": {
        "Running my own company": 1,
        "Working in a top global company": 2,
        "Helping thousands of people": 3,
        "Becoming famous for my talent": 4,
        "Inventing something revolutionary": 5,
        "Living a peaceful and balanced life": 6,
    },
    "q17": {
        "Speaking in front of 1,000 people": 1,
        "Building an app from scratch": 2,
        "Starting a business": 3,
        "Leading a team": 4,
        "Solving a global problem": 5,
        "Creating a viral project": 6,
    },
    "q18": {
        "High salary": 1,
        "Job satisfaction": 2,
        "Flexibility": 3,
        "Respect": 4,
        "Work-life balance": 5,
        "Opportunity to grow": 6,
    },
    "q19": {
        "Owning a successful company": 1,
        "Becoming an expert in my field": 2,
        "Changing people's lives": 3,
        "Inventing something useful": 4,
        "Building financial freedom": 5,
        "Creating something remembered for years": 6,
    },
    "q20": {
        "I made life better for others.": 1,
        "I built something incredible.": 2,
        "I inspired millions.": 3,
        "I solved important problems.": 4,
        "I created unforgettable experiences.": 5,
        "I never stopped learning and growing.": 6,
    },
}


# ── Trait Weight Map ─────────────────────────────────────────────────
# Structure: TRAIT_WEIGHT_MAP[question_id][option_position] = {Trait: weight}

TRAIT_WEIGHT_MAP: dict[str, dict[int, dict[Trait, int]]] = {
    "q1": {
        1: {Trait.TE: 3, Trait.AN: 2},
        2: {Trait.CR: 3, Trait.SO: 1},
        3: {Trait.SO: 3, Trait.LE: 1},
        4: {Trait.BU: 3, Trait.LE: 2},
        5: {Trait.SC: 3, Trait.TE: 2},
        6: {Trait.EX: 3, Trait.SO: 1},
    },
    "q2": {
        1: {Trait.AN: 3, Trait.SC: 2},
        2: {Trait.CR: 3, Trait.TE: 1},
        3: {Trait.SO: 3, Trait.LE: 1},
        4: {Trait.TE: 2, Trait.AN: 2},
        5: {Trait.SC: 3, Trait.EX: 2},
        6: {Trait.AN: 2, Trait.LE: 2, Trait.BU: 1},
    },
    "q3": {
        1: {Trait.BU: 3, Trait.LE: 1},
        2: {Trait.SO: 3, Trait.LE: 1},
        3: {Trait.LE: 3, Trait.CR: 1},
        4: {Trait.CR: 2, Trait.EX: 2},
        5: {Trait.TE: 2, Trait.CR: 2, Trait.LE: 1},
        6: {Trait.SC: 2, Trait.EX: 2, Trait.AN: 1},
    },
    "q4": {
        1: {Trait.AN: 3, Trait.SC: 2},
        2: {Trait.CR: 3},
        3: {Trait.LE: 3, Trait.SO: 1},
        4: {Trait.SO: 3},
        5: {Trait.AN: 3, Trait.TE: 1},
        6: {Trait.LE: 2, Trait.SO: 2},
    },
    "q5": {
        1: {Trait.TE: 3, Trait.SC: 2},
        2: {Trait.CR: 3},
        3: {Trait.BU: 3, Trait.LE: 2},
        4: {Trait.SO: 3, Trait.SC: 2},
        5: {Trait.SC: 3, Trait.AN: 2},
        6: {Trait.EX: 3, Trait.SO: 1},
    },
    "q6": {
        1: {Trait.SC: 2, Trait.EX: 2},
        2: {Trait.AN: 3, Trait.TE: 2},
        3: {Trait.BU: 3},
        4: {Trait.SO: 3},
        5: {Trait.CR: 3, Trait.TE: 1},
        6: {Trait.LE: 2, Trait.EX: 2},
    },
    "q7": {
        1: {Trait.SO: 3, Trait.LE: 1},
        2: {Trait.TE: 3, Trait.AN: 2},
        3: {Trait.SO: 2, Trait.CR: 2},
        4: {Trait.CR: 3},
        5: {Trait.AN: 2, Trait.LE: 2},
        6: {Trait.AN: 3, Trait.TE: 1},
    },
    "q8": {
        1: {Trait.SC: 3, Trait.AN: 2},
        2: {Trait.TE: 3, Trait.AN: 2},
        3: {Trait.SO: 2, Trait.LE: 3},
        4: {Trait.CR: 3},
        5: {Trait.EX: 2, Trait.LE: 2},
        6: {Trait.LE: 3, Trait.BU: 2},
    },
    "q9": {
        1: {Trait.TE: 3, Trait.AN: 2},
        2: {Trait.BU: 3, Trait.AN: 2},
        3: {Trait.SO: 3},
        4: {Trait.CR: 3},
        5: {Trait.SC: 3, Trait.AN: 2},
        6: {Trait.SO: 2, Trait.EX: 2},
    },
    "q10": {
        1: {Trait.EX: 3, Trait.TE: 1},
        2: {Trait.BU: 2, Trait.LE: 2},
        3: {Trait.BU: 3, Trait.LE: 2},
        4: {Trait.CR: 3},
        5: {Trait.SC: 3, Trait.AN: 2},
        6: {Trait.EX: 3, Trait.SO: 1},
    },
    "q11": {
        1: {Trait.TE: 3, Trait.AN: 2},
        2: {Trait.SO: 2, Trait.LE: 3},
        3: {Trait.CR: 3},
        4: {Trait.BU: 3, Trait.LE: 2},
        5: {Trait.TE: 3, Trait.SC: 2},
        6: {Trait.SC: 3, Trait.SO: 2},
    },
    "q12": {
        1: {Trait.TE: 3, Trait.AN: 1},
        2: {Trait.SO: 3},
        3: {Trait.LE: 3, Trait.SO: 1},
        4: {Trait.CR: 3},
        5: {Trait.SC: 3, Trait.EX: 1},
        6: {Trait.AN: 3, Trait.TE: 1},
    },
    "q13": {
        1: {Trait.TE: 3, Trait.SC: 1},
        2: {Trait.BU: 3, Trait.AN: 1},
        3: {Trait.TE: 2, Trait.CR: 1},
        4: {Trait.EX: 3},
        5: {Trait.SC: 2, Trait.AN: 1},
        6: {Trait.CR: 3},
    },
    "q14": {
        1: {Trait.BU: 3, Trait.AN: 2},
        2: {Trait.BU: 3, Trait.LE: 2},
        3: {Trait.EX: 3},
        4: {Trait.SO: 3},
        5: {Trait.SO: 3, Trait.LE: 1},
        6: {Trait.TE: 2, Trait.CR: 1},
    },
    "q15": {
        1: {Trait.SC: 3, Trait.EX: 2},
        2: {Trait.CR: 3},
        3: {Trait.AN: 2, Trait.BU: 2},
        4: {Trait.LE: 3, Trait.BU: 1},
        5: {Trait.SO: 3},
        6: {Trait.LE: 3, Trait.SO: 1},
    },
    "q16": {
        1: {Trait.BU: 3, Trait.LE: 3},
        2: {Trait.BU: 2, Trait.LE: 2},
        3: {Trait.SO: 3, Trait.LE: 2},
        4: {Trait.CR: 3, Trait.LE: 2},
        5: {Trait.SC: 3, Trait.TE: 2},
        6: {Trait.EX: 2, Trait.SO: 1},
    },
    "q17": {
        1: {Trait.LE: 3, Trait.SO: 2},
        2: {Trait.TE: 3, Trait.AN: 2},
        3: {Trait.BU: 3, Trait.LE: 2},
        4: {Trait.LE: 3, Trait.SO: 1},
        5: {Trait.SC: 2, Trait.AN: 2, Trait.SO: 2},
        6: {Trait.CR: 3, Trait.LE: 1},
    },
    "q18": {
        1: {Trait.BU: 3},
        2: {Trait.CR: 2, Trait.SO: 1},
        3: {Trait.EX: 3},
        4: {Trait.LE: 2, Trait.BU: 1},
        5: {Trait.EX: 2, Trait.SO: 1},
        6: {Trait.SC: 2, Trait.LE: 2},
    },
    "q19": {
        1: {Trait.BU: 3, Trait.LE: 2},
        2: {Trait.SC: 3, Trait.AN: 2},
        3: {Trait.SO: 3, Trait.LE: 1},
        4: {Trait.TE: 2, Trait.SC: 3},
        5: {Trait.BU: 3},
        6: {Trait.CR: 3, Trait.LE: 1},
    },
    "q20": {
        1: {Trait.SO: 3},
        2: {Trait.TE: 2, Trait.CR: 2},
        3: {Trait.LE: 3, Trait.SO: 2},
        4: {Trait.AN: 3, Trait.SC: 2},
        5: {Trait.CR: 3, Trait.EX: 2},
        6: {Trait.SC: 2, Trait.EX: 2, Trait.AN: 1},
    },
}


# ── Total number of questions ────────────────────────────────────────
TOTAL_QUESTIONS = 20
REQUIRED_QUESTION_IDS = [f"q{i}" for i in range(1, TOTAL_QUESTIONS + 1)]


def get_option_index(question_id: str, answer_text: str) -> int | None:
    """
    Resolve an answer's display text to its 1-indexed position.
    Returns None if the question ID or answer text is not recognised.
    """
    question_options = OPTION_INDEX.get(question_id)
    if question_options is None:
        return None
    return question_options.get(answer_text)
