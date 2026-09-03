"""
Core scoring engine — pure functions, no I/O, no LLM dependency.

Pipeline:
  answers (dict)
    → compute_trait_scores   → TraitProfile
    → compute_stream_scores  → StreamResult
    → compute_career_matches → list[CareerMatch]
    → build_response         → AssessmentResponse
"""

from __future__ import annotations

from app.models import (
    AssessmentResponse,
    CareerMatch,
    StreamResult,
    StreamScores,
    TraitProfile,
)
from app.scoring.careers import CAREER_CLUSTERS
from app.scoring.traits import (
    TRAIT_LABELS,
    TRAIT_WEIGHT_MAP,
    Trait,
    get_option_index,
)


# ── 1. Trait Scoring ─────────────────────────────────────────────────

def compute_trait_scores(answers: dict[str, str]) -> TraitProfile:
    """
    Accumulate raw trait scores from the answered questions, then
    normalise each trait to a 0-100 scale based on the theoretical
    maximum any single trait can achieve across all 20 questions.
    
    Unanswered or unrecognised answers are silently skipped (the
    route layer validates completeness before calling this).
    """
    raw: dict[str, float] = {t.value: 0.0 for t in Trait}

    for qid, answer_text in answers.items():
        option_idx = get_option_index(qid, answer_text)
        if option_idx is None:
            continue  # skip unrecognised question / answer

        weights = TRAIT_WEIGHT_MAP.get(qid, {}).get(option_idx, {})
        for trait, points in weights.items():
            raw[trait.value] += points

    # Compute the theoretical maximum for normalisation.
    # For each question, find the highest weight any single trait can receive,
    # then sum them all.  This gives the upper bound for a single trait.
    theoretical_max = _compute_theoretical_max()

    # Normalise to 0-100
    normalised: dict[str, float] = {}
    for trait_code, score in raw.items():
        t_max = theoretical_max.get(trait_code, 0.0)
        if t_max > 0:
            normalised[trait_code] = round(
                min((score / t_max) * 100, 100), 1
            )
        else:
            normalised[trait_code] = 0.0

    return TraitProfile(**normalised)


def _compute_theoretical_max() -> dict[str, float]:
    """
    The theoretical max is the highest possible raw score a single trait
    could get if every question awarded it the maximum available weight.
    
    We compute: for each trait, sum the max weight it could receive from
    each question.
    """
    trait_max_per_q: dict[str, list[float]] = {t.value: [] for t in Trait}

    for qid, options in TRAIT_WEIGHT_MAP.items():
        # For each trait, find the max weight offered by any option in this question
        per_trait: dict[str, float] = {t.value: 0.0 for t in Trait}
        for _opt_idx, weights in options.items():
            for trait, pts in weights.items():
                per_trait[trait.value] = max(per_trait[trait.value], pts)
        for tc, mx in per_trait.items():
            trait_max_per_q[tc].append(mx)

    # Sum each trait's per-question maxima
    trait_totals = {tc: sum(vals) for tc, vals in trait_max_per_q.items()}
    return trait_totals


# ── 2. Stream Scoring ────────────────────────────────────────────────

# Weighted formulas from the spec
_STREAM_FORMULAS: dict[str, dict[str, float]] = {
    "science":  {"AN": 0.25, "TE": 0.20, "SC": 0.40, "EX": 0.15},
    "commerce": {"AN": 0.20, "BU": 0.45, "LE": 0.25, "EX": 0.10},
    "arts":     {"CR": 0.40, "SO": 0.30, "LE": 0.15, "EX": 0.15},
}


def compute_stream_scores(traits: TraitProfile) -> StreamResult:
    """
    Apply the weighted formulas and normalise so the three scores
    sum to 100%.
    """
    trait_dict = traits.model_dump()

    raw_streams: dict[str, float] = {}
    for stream, formula in _STREAM_FORMULAS.items():
        raw_streams[stream] = sum(
            trait_dict[tc] * weight for tc, weight in formula.items()
        )

    total = sum(raw_streams.values())
    if total == 0:
        pcts = {s: 33.3 for s in raw_streams}
    else:
        pcts = {s: round((v / total) * 100, 1) for s, v in raw_streams.items()}

    # Ensure they sum exactly to 100 (adjust largest to absorb rounding)
    diff = 100.0 - sum(pcts.values())
    if diff != 0:
        largest = max(pcts, key=lambda k: pcts[k])
        pcts[largest] = round(pcts[largest] + diff, 1)

    scores = StreamScores(**pcts)
    recommendation = _build_recommendation(pcts)
    descriptions = _build_stream_descriptions(pcts)

    return StreamResult(
        scores=scores,
        recommendation=recommendation,
        descriptions=descriptions,
    )


def _build_recommendation(pcts: dict[str, float]) -> str:
    """
    Generate soft, non-prescriptive recommendation text.
    Never says a student MUST choose a stream.
    """
    ranked = sorted(pcts.items(), key=lambda x: x[1], reverse=True)
    stream_names = {"science": "Science", "commerce": "Commerce", "arts": "Arts"}

    lines: list[str] = []
    for i, (stream, pct) in enumerate(ranked):
        name = stream_names[stream]
        if i == 0:
            lines.append(
                f"{name} appears to be your strongest current fit ({pct}%)."
            )
        elif pct >= 30:
            lines.append(f"{name} may be worth exploring ({pct}%).")
        else:
            lines.append(
                f"{name} is also a possible fit based on your profile ({pct}%)."
            )

    return " ".join(lines)


def _build_stream_descriptions(pcts: dict[str, float]) -> dict[str, str]:
    """Dynamic description text for each stream card in the UI."""
    ranked = sorted(pcts.items(), key=lambda x: x[1], reverse=True)
    descriptions: dict[str, str] = {}

    templates = {
        0: "Strong alignment based on your assessment responses — this appears to be your best current fit.",
        1: "Moderate alignment. Several of your traits connect well with this stream.",
        2: "Lower alignment relative to your other interests, but still a viable option.",
    }

    for rank, (stream, _pct) in enumerate(ranked):
        descriptions[stream] = templates.get(rank, templates[2])

    return descriptions


# ── 3. Career Matching ───────────────────────────────────────────────

def compute_career_matches(traits: TraitProfile) -> list[CareerMatch]:
    """
    For each of the 12 career clusters, compute a weighted dot-product
    of the cluster's key traits against the student's normalised profile.
    Return the top 5 sorted by match percentage.
    """
    trait_dict = traits.model_dump()
    scored: list[tuple[float, CareerMatch]] = []

    for cluster in CAREER_CLUSTERS:
        # Weighted sum of the student's traits for this cluster
        student_weighted_score = sum(
            trait_dict.get(tc, 0.0) * w
            for tc, w in cluster.trait_weights.items()
        )
        
        # Calculate theoretical maximum assuming every relevant trait is 100
        career_max = sum(
            100.0 * w
            for w in cluster.trait_weights.values()
        )
        
        if career_max > 0:
            match_pct = round(min((student_weighted_score / career_max) * 100, 100), 1)
        else:
            match_pct = 0.0

        # Identify the 2-3 strongest matching traits for this student
        trait_contributions = sorted(
            [
                (tc, trait_dict.get(tc, 0.0) * w)
                for tc, w in cluster.trait_weights.items()
            ],
            key=lambda x: x[1],
            reverse=True,
        )
        top_traits = [
            TRAIT_LABELS.get(tc, tc)
            for tc, _contrib in trait_contributions[:3]
            if _contrib > 0
        ]

        # Build explanation based on the student's strongest traits for this career
        explanation = _build_career_explanation(cluster.name, top_traits, match_pct)

        scored.append((
            match_pct,
            CareerMatch(
                career_name=cluster.name,
                match_percentage=match_pct,
                top_traits=top_traits,
                explanation=explanation,
                skill_gaps=cluster.skill_gaps,
                next_steps=cluster.next_steps,
            ),
        ))

    # Sort descending by score, break ties alphabetically
    scored.sort(key=lambda x: (-x[0], x[1].career_name))
    return [cm for _, cm in scored[:5]]


def _build_career_explanation(
    career_name: str, top_traits: list[str], match_pct: float
) -> str:
    """Generate a short deterministic explanation per career match."""
    traits_text = " and ".join(top_traits[:2]) if top_traits else "your profile"

    if match_pct >= 75:
        strength = "strong"
    elif match_pct >= 50:
        strength = "solid"
    else:
        strength = "moderate"

    return (
        f"Your {traits_text} strengths show a {strength} alignment with "
        f"{career_name}. This career path leverages your natural inclinations "
        f"and could be a great fit for your future."
    )


# ── 4. Full Pipeline ─────────────────────────────────────────────────

def score_assessment(answers: dict[str, str]) -> AssessmentResponse:
    """
    Run the complete scoring pipeline:
      answers → traits → streams + careers → response
    """
    traits = compute_trait_scores(answers)
    streams = compute_stream_scores(traits)
    careers = compute_career_matches(traits)

    return AssessmentResponse(
        trait_profile=traits,
        streams=streams,
        top_careers=careers,
    )
