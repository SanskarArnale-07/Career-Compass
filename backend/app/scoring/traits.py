"""
Trait definitions and the complete Q1-Q20 answer -> trait weight mapping.

Each answer's weights use the convention:
  Primary trait   = 3 points
  Secondary trait = 2 points
  Tertiary trait  = 1 point
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
    "q1": {
        'Building apps or websites': {Trait.TE: 3, Trait.AN: 2},
        'Creating art, music, or content': {Trait.CR: 3, Trait.SO: 1},
        'Helping people': {Trait.SO: 3, Trait.LE: 1},
        'Starting a business': {Trait.BU: 3, Trait.LE: 2},
        'Exploring science or technology': {Trait.SC: 3, Trait.TE: 2},
        'Traveling and discovering new places': {Trait.EX: 3, Trait.SO: 1},
    },
    "q2": {
        'Solving problems': {Trait.AN: 3, Trait.SC: 2},
        'Creating something': {Trait.CR: 3, Trait.TE: 1},
        'Talking with people': {Trait.SO: 3, Trait.LE: 1},
        'Playing games': {Trait.TE: 2, Trait.AN: 2},
        'Learning new things': {Trait.SC: 3, Trait.EX: 2},
        'Organizing or planning': {Trait.AN: 2, Trait.LE: 2, Trait.BU: 1},
    },
    "q3": {
        'Becoming financially free': {Trait.BU: 3, Trait.LE: 1},
        'Making a positive impact': {Trait.SO: 3, Trait.LE: 1},
        'Being recognized worldwide': {Trait.LE: 3, Trait.CR: 1},
        'Loving what I do every day': {Trait.CR: 2, Trait.EX: 2},
        'Building something meaningful': {Trait.TE: 2, Trait.CR: 2, Trait.LE: 1},
        'Constantly learning and growing': {Trait.SC: 2, Trait.EX: 2, Trait.AN: 1},
    },
    "q4": {
        "You're incredibly smart.": {Trait.AN: 3, Trait.SC: 2},
        "You're so creative.": {Trait.CR: 3},
        "You're an amazing leader.": {Trait.LE: 3, Trait.SO: 1},
        "You're kind and helpful.": {Trait.SO: 3},
        'You always find solutions.': {Trait.AN: 3, Trait.TE: 1},
        "You're inspiring.": {Trait.LE: 2, Trait.SO: 2},
    },
    "q5": {
        'AI & Robotics Lab': {Trait.TE: 3, Trait.SC: 2},
        'Creative Studio': {Trait.CR: 3},
        'Startup Office': {Trait.BU: 3, Trait.LE: 2},
        'Hospital': {Trait.SO: 3, Trait.SC: 2},
        'Research Center': {Trait.SC: 3, Trait.AN: 2},
        'Outdoor Adventure Camp': {Trait.EX: 3, Trait.SO: 1},
    },
    "q6": {
        'Learning new skills': {Trait.SC: 2, Trait.EX: 2},
        'Solving difficult challenges': {Trait.AN: 3, Trait.TE: 2},
        'Earning money': {Trait.BU: 3},
        'Helping others': {Trait.SO: 3},
        'Creating something unique': {Trait.CR: 3, Trait.TE: 1},
        'Becoming the best version of myself': {Trait.LE: 2, Trait.EX: 2},
    },
    "q7": {
        'Advice': {Trait.SO: 3, Trait.LE: 1},
        'Tech help': {Trait.TE: 3, Trait.AN: 2},
        'Funny conversations': {Trait.SO: 2, Trait.CR: 2},
        'Creative ideas': {Trait.CR: 3},
        'Planning things': {Trait.AN: 2, Trait.LE: 2},
        'Solving problems': {Trait.AN: 3, Trait.TE: 1},
    },
    "q8": {
        'Science projects': {Trait.SC: 3, Trait.AN: 2},
        'Coding': {Trait.TE: 3, Trait.AN: 2},
        'Debates': {Trait.SO: 2, Trait.LE: 3},
        'Drawing or designing': {Trait.CR: 3},
        'Sports': {Trait.EX: 2, Trait.LE: 2},
        'Organizing events': {Trait.LE: 3, Trait.BU: 2},
    },
    "q9": {
        'Technical problems': {Trait.TE: 3, Trait.AN: 2},
        'Business problems': {Trait.BU: 3, Trait.AN: 2},
        'Human problems': {Trait.SO: 3},
        'Creative challenges': {Trait.CR: 3},
        'Scientific mysteries': {Trait.SC: 3, Trait.AN: 2},
        'Real-world issues': {Trait.SO: 2, Trait.EX: 2},
    },
    "q10": {
        'Remote from anywhere': {Trait.EX: 3, Trait.TE: 1},
        'Corporate office': {Trait.BU: 2, Trait.LE: 2},
        'Startup': {Trait.BU: 3, Trait.LE: 2},
        'Creative workspace': {Trait.CR: 3},
        'Laboratory': {Trait.SC: 3, Trait.AN: 2},
        'Traveling frequently': {Trait.EX: 3, Trait.SO: 1},
    },
    "q11": {
        'Coding': {Trait.TE: 3, Trait.AN: 2},
        'Public Speaking': {Trait.SO: 2, Trait.LE: 3},
        'Designing': {Trait.CR: 3},
        'Business & Marketing': {Trait.BU: 3, Trait.LE: 2},
        'Artificial Intelligence': {Trait.TE: 3, Trait.SC: 2},
        'Medicine': {Trait.SC: 3, Trait.SO: 2},
    },
    "q12": {
        'I enjoy building things.': {Trait.TE: 3, Trait.AN: 1},
        'I enjoy helping people.': {Trait.SO: 3},
        'I enjoy leading people.': {Trait.LE: 3, Trait.SO: 1},
        'I enjoy creating things.': {Trait.CR: 3},
        'I enjoy discovering new ideas.': {Trait.SC: 3, Trait.EX: 1},
        'I enjoy improving existing things.': {Trait.AN: 3, Trait.TE: 1},
    },
    "q13": {
        'Technology': {Trait.TE: 3, Trait.SC: 1},
        'Finance': {Trait.BU: 3, Trait.AN: 1},
        'Gaming': {Trait.TE: 2, Trait.CR: 1},
        'Travel': {Trait.EX: 3},
        'Educational': {Trait.SC: 2, Trait.AN: 1},
        'Art & Entertainment': {Trait.CR: 3},
    },
    "q14": {
        'Invest it': {Trait.BU: 3, Trait.AN: 2},
        'Start a company': {Trait.BU: 3, Trait.LE: 2},
        'Travel the world': {Trait.EX: 3},
        'Support my family': {Trait.SO: 3},
        'Donate to a cause': {Trait.SO: 3, Trait.LE: 1},
        'Buy my dream gadgets': {Trait.TE: 2, Trait.CR: 1},
    },
    "q15": {
        'Curious': {Trait.SC: 3, Trait.EX: 2},
        'Creative': {Trait.CR: 3},
        'Practical': {Trait.AN: 2, Trait.BU: 2},
        'Ambitious': {Trait.LE: 3, Trait.BU: 1},
        'Compassionate': {Trait.SO: 3},
        'Confident': {Trait.LE: 3, Trait.SO: 1},
    },
    "q16": {
        'Running my own company': {Trait.BU: 3, Trait.LE: 3},
        'Working in a top global company': {Trait.BU: 2, Trait.LE: 2},
        'Helping thousands of people': {Trait.SO: 3, Trait.LE: 2},
        'Becoming famous for my talent': {Trait.CR: 3, Trait.LE: 2},
        'Inventing something revolutionary': {Trait.SC: 3, Trait.TE: 2},
        'Living a peaceful and balanced life': {Trait.EX: 2, Trait.SO: 1},
    },
    "q17": {
        'Speaking in front of 1,000 people': {Trait.LE: 3, Trait.SO: 2},
        'Building an app from scratch': {Trait.TE: 3, Trait.AN: 2},
        'Starting a business': {Trait.BU: 3, Trait.LE: 2},
        'Leading a team': {Trait.LE: 3, Trait.SO: 1},
        'Solving a global problem': {Trait.SC: 2, Trait.AN: 2, Trait.SO: 2},
        'Creating a viral project': {Trait.CR: 3, Trait.LE: 1},
    },
    "q18": {
        'High salary': {Trait.BU: 3},
        'Job satisfaction': {Trait.CR: 2, Trait.SO: 1},
        'Flexibility': {Trait.EX: 3},
        'Respect': {Trait.LE: 2, Trait.BU: 1},
        'Work-life balance': {Trait.EX: 2, Trait.SO: 1},
        'Opportunity to grow': {Trait.SC: 2, Trait.LE: 2},
    },
    "q19": {
        'Owning a successful company': {Trait.BU: 3, Trait.LE: 2},
        'Becoming an expert in my field': {Trait.SC: 3, Trait.AN: 2},
        "Changing people's lives": {Trait.SO: 3, Trait.LE: 1},
        'Inventing something useful': {Trait.TE: 2, Trait.SC: 3},
        'Building financial freedom': {Trait.BU: 3},
        'Creating something remembered for years': {Trait.CR: 3, Trait.LE: 1},
    },
    "q20": {
        'I made life better for others.': {Trait.SO: 3},
        'I built something incredible.': {Trait.TE: 2, Trait.CR: 2},
        'I inspired millions.': {Trait.LE: 3, Trait.SO: 2},
        'I solved important problems.': {Trait.AN: 3, Trait.SC: 2},
        'I created unforgettable experiences.': {Trait.CR: 3, Trait.EX: 2},
        'I never stopped learning and growing.': {Trait.SC: 2, Trait.EX: 2, Trait.AN: 1},
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

TOTAL_QUESTIONS = 20
REQUIRED_QUESTION_IDS = [f"q{i}" for i in range(1, TOTAL_QUESTIONS + 1)]


def get_option_index(question_id: str, answer_text: str) -> int | None:
    """Resolve an answer's display text to its 1-indexed position."""
    return OPTION_INDEX.get(question_id, {}).get(answer_text)
