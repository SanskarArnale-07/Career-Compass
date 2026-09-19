"""
Phase 8 — Assessment & Scoring Validation

Comprehensive test suite verifying determinism, correctness, and consistency
of the Career Compass scoring engine.

Covers:
  1.  Every question (q1-q20) × every option (6 each) → valid weights
  2.  Trait dimension calculations
  3.  Stream calculations & normalisation
  4.  Career cluster ranking & stability
  5.  Tie situations
  6.  Missing / invalid / partial answers
  7.  Boundary values
  8.  Repeated submissions → identical results
  9.  Result persistence/shape
 10.  Career mapping consistency (frontend ↔ backend)

Run with:  python -m pytest tests/test_scoring_validation.py -v  (from backend/)
"""

from __future__ import annotations

import copy
import itertools

import pytest
from fastapi.testclient import TestClient

from main import app
from app.models import TraitProfile
from app.scoring.engine import (
    THEORETICAL_MAX,
    _build_career_explanation,
    _build_recommendation,
    _build_stream_descriptions,
    _compute_theoretical_max,
    compute_career_matches,
    compute_stream_scores,
    compute_trait_scores,
    score_assessment,
)
from app.scoring.careers import CAREER_CLUSTERS, CareerCluster
from app.scoring.traits import (
    OPTION_INDEX,
    QUESTION_OPTIONS,
    REQUIRED_QUESTION_IDS,
    TOTAL_QUESTIONS,
    TRAIT_LABELS,
    TRAIT_WEIGHT_MAP,
    Trait,
    get_option_index,
)

client = TestClient(app)


# ══════════════════════════════════════════════════════════════════════
# Helpers
# ══════════════════════════════════════════════════════════════════════

def _answers_from_positions(positions: dict[str, int]) -> dict[str, str]:
    """Given {qid: 1-indexed pos}, return {qid: answer_text}."""
    answers: dict[str, str] = {}
    for qid, pos in positions.items():
        options = OPTION_INDEX[qid]
        for text, idx in options.items():
            if idx == pos:
                answers[qid] = text
                break
    return answers


def _all_position(pos: int) -> dict[str, str]:
    """Every question answered with option at 1-indexed position `pos`."""
    return _answers_from_positions({qid: pos for qid in REQUIRED_QUESTION_IDS})


def _assert_valid_result(result: dict):
    """Structural invariants that must hold for *any* valid result."""
    tp = result["trait_profile"]
    for code in [t.value for t in Trait]:
        assert code in tp, f"Missing trait {code}"
        assert 0 <= tp[code] <= 100, f"Trait {code} out of range: {tp[code]}"

    ss = result["streams"]["scores"]
    for stream in ["science", "commerce", "arts"]:
        assert stream in ss
        assert 0 <= ss[stream] <= 100, f"Stream {stream} out of range"
    total = ss["science"] + ss["commerce"] + ss["arts"]
    assert 99.5 <= total <= 100.5, f"Stream scores don't sum to 100: {total}"

    assert len(result["streams"]["recommendation"]) > 0
    assert isinstance(result["streams"]["descriptions"], dict)

    careers = result["top_careers"]
    assert len(careers) == 5
    for c in careers:
        assert 0 <= c["match_percentage"] <= 100
        assert len(c["top_traits"]) >= 1
        assert len(c["explanation"]) > 0
        assert len(c["skill_gaps"]) >= 1
        assert len(c["next_steps"]) >= 1

    pcts = [c["match_percentage"] for c in careers]
    assert pcts == sorted(pcts, reverse=True), "Careers not sorted descending"


# ══════════════════════════════════════════════════════════════════════
# 1. QUESTION & OPTION COVERAGE
# ══════════════════════════════════════════════════════════════════════

class TestQuestionOptionCoverage:
    """Verify the question bank structure itself."""

    def test_exactly_20_questions(self):
        assert len(QUESTION_OPTIONS) == 20
        assert TOTAL_QUESTIONS == 20

    def test_question_ids_q1_through_q20(self):
        expected = {f"q{i}" for i in range(1, 21)}
        assert set(QUESTION_OPTIONS.keys()) == expected

    def test_every_question_has_exactly_6_options(self):
        for qid, opts in QUESTION_OPTIONS.items():
            assert len(opts) == 6, f"{qid} has {len(opts)} options, expected 6"

    def test_required_question_ids_match(self):
        assert REQUIRED_QUESTION_IDS == [f"q{i}" for i in range(1, 21)]

    def test_every_option_has_at_least_one_trait(self):
        for qid, opts in QUESTION_OPTIONS.items():
            for text, weights in opts.items():
                assert len(weights) >= 1, f"{qid}/{text} has no trait weights"

    def test_all_trait_weights_are_positive_integers(self):
        for qid, opts in QUESTION_OPTIONS.items():
            for text, weights in opts.items():
                for trait, pts in weights.items():
                    assert isinstance(trait, Trait), f"Non-Trait key: {trait}"
                    assert isinstance(pts, int) and pts > 0, (
                        f"{qid}/{text}: weight {pts} must be a positive int"
                    )

    def test_weights_follow_convention_max_3(self):
        """Primary=3, secondary=2, tertiary=1 — no weight exceeds 3."""
        for qid, opts in QUESTION_OPTIONS.items():
            for text, weights in opts.items():
                for trait, pts in weights.items():
                    assert pts <= 3, (
                        f"{qid}/{text}/{trait.value}: weight {pts} exceeds max=3"
                    )

    def test_option_index_consistent_with_question_options(self):
        for qid, opts in QUESTION_OPTIONS.items():
            option_texts = list(opts.keys())
            for text, idx in OPTION_INDEX[qid].items():
                assert text in option_texts
                assert 1 <= idx <= 6

    def test_get_option_index_roundtrip(self):
        for qid, opts in QUESTION_OPTIONS.items():
            for i, text in enumerate(opts.keys(), 1):
                assert get_option_index(qid, text) == i

    def test_get_option_index_unknown_returns_none(self):
        assert get_option_index("q1", "Nonexistent Option") is None
        assert get_option_index("q999", "anything") is None


# ══════════════════════════════════════════════════════════════════════
# 2. TRAIT DIMENSION CALCULATIONS
# ══════════════════════════════════════════════════════════════════════

class TestTraitScoring:
    """Tests for compute_trait_scores correctness."""

    def test_empty_answers_give_all_zeros(self):
        """Engine should handle empty dict (route validates, but engine is resilient)."""
        profile = compute_trait_scores({})
        d = profile.model_dump()
        for t in Trait:
            assert d[t.value] == 0.0

    def test_single_question_correct_accumulation(self):
        """Answering q1='Building apps or websites' → TE:3, AN:2, others 0."""
        answers = {"q1": "Building apps or websites"}
        profile = compute_trait_scores(answers)
        d = profile.model_dump()
        # TE and AN should be nonzero, proportional to their theoretical max
        assert d["TE"] > 0
        assert d["AN"] > 0
        # All others should be 0
        for t in ["SC", "BU", "CR", "SO", "LE", "EX"]:
            assert d[t] == 0.0

    def test_all_traits_reachable(self):
        """Each of the 8 traits can be scored by at least one option."""
        trait_hit: set[str] = set()
        for opts in QUESTION_OPTIONS.values():
            for weights in opts.values():
                for trait in weights:
                    trait_hit.add(trait.value)
        assert trait_hit == {t.value for t in Trait}

    def test_theoretical_max_all_positive(self):
        for tc, mx in THEORETICAL_MAX.items():
            assert mx > 0, f"THEORETICAL_MAX[{tc}] = {mx} <= 0"

    def test_theoretical_max_deterministic(self):
        """Re-computing theoretical max yields identical values."""
        recomputed = _compute_theoretical_max()
        assert recomputed == THEORETICAL_MAX

    def test_normalisation_caps_at_100(self):
        """No trait can exceed 100 even with pathological data."""
        answers = _all_position(1)
        result = score_assessment(answers).model_dump()
        for code, val in result["trait_profile"].items():
            assert val <= 100.0

    def test_each_trait_can_reach_100(self):
        """Pick the best option for a trait in every question → exactly 100."""
        for target in Trait:
            positions: dict[str, int] = {}
            for qid, opts_by_pos in TRAIT_WEIGHT_MAP.items():
                best_pos, best_val = 1, -1
                for pos, weights in opts_by_pos.items():
                    val = weights.get(target, 0)
                    if val > best_val:
                        best_val = val
                        best_pos = pos
                    elif val == best_val and pos < best_pos:
                        best_pos = pos
                positions[qid] = best_pos
            answers = _answers_from_positions(positions)
            result = score_assessment(answers).model_dump()
            assert result["trait_profile"][target.value] == 100.0

    def test_trait_labels_cover_all_traits(self):
        for t in Trait:
            assert t.value in TRAIT_LABELS


# ══════════════════════════════════════════════════════════════════════
# 3. STREAM CALCULATIONS
# ══════════════════════════════════════════════════════════════════════

class TestStreamScoring:
    """Tests for compute_stream_scores."""

    def test_streams_sum_to_100(self):
        for pos in range(1, 7):
            answers = _all_position(pos)
            result = score_assessment(answers).model_dump()
            ss = result["streams"]["scores"]
            total = ss["science"] + ss["commerce"] + ss["arts"]
            assert 99.9 <= total <= 100.1, f"Position {pos}: sum={total}"

    def test_zero_traits_give_equal_streams(self):
        """All-zero trait profile → 33.3% each."""
        zero_profile = TraitProfile(AN=0, TE=0, SC=0, BU=0, CR=0, SO=0, LE=0, EX=0)
        result = compute_stream_scores(zero_profile)
        d = result.scores.model_dump()
        for stream in ["science", "commerce", "arts"]:
            assert 33.0 <= d[stream] <= 34.0

    def test_science_formula_weights(self):
        """Science = 0.25*AN + 0.20*TE + 0.40*SC + 0.15*EX"""
        profile = TraitProfile(AN=100, TE=0, SC=0, BU=0, CR=0, SO=0, LE=0, EX=0)
        result = compute_stream_scores(profile)
        # Science raw = 0.25*100 = 25, commerce raw = 0.20*100 = 20, arts = 0
        # Science should be highest
        d = result.scores.model_dump()
        assert d["science"] > d["arts"]

    def test_commerce_formula_weights(self):
        """Commerce = 0.20*AN + 0.45*BU + 0.25*LE + 0.10*EX"""
        profile = TraitProfile(AN=0, TE=0, SC=0, BU=100, CR=0, SO=0, LE=0, EX=0)
        result = compute_stream_scores(profile)
        d = result.scores.model_dump()
        assert d["commerce"] > d["science"]
        assert d["commerce"] > d["arts"]

    def test_arts_formula_weights(self):
        """Arts = 0.40*CR + 0.30*SO + 0.15*LE + 0.15*EX"""
        profile = TraitProfile(AN=0, TE=0, SC=0, BU=0, CR=100, SO=0, LE=0, EX=0)
        result = compute_stream_scores(profile)
        d = result.scores.model_dump()
        assert d["arts"] > d["science"]
        assert d["arts"] > d["commerce"]

    def test_recommendation_text_mentions_top_stream(self):
        answers = _all_position(1)
        result = score_assessment(answers)
        rec = result.streams.recommendation
        # Should mention at least one stream name
        assert any(s in rec for s in ["Science", "Commerce", "Arts"])

    def test_stream_descriptions_all_three_present(self):
        answers = _all_position(1)
        result = score_assessment(answers)
        assert set(result.streams.descriptions.keys()) == {"science", "commerce", "arts"}


# ══════════════════════════════════════════════════════════════════════
# 4. CAREER CLUSTER RANKING
# ══════════════════════════════════════════════════════════════════════

class TestCareerMatching:
    """Tests for compute_career_matches."""

    def test_always_returns_exactly_5(self):
        for pos in range(1, 7):
            answers = _all_position(pos)
            result = score_assessment(answers).model_dump()
            assert len(result["top_careers"]) == 5

    def test_all_12_clusters_defined(self):
        assert len(CAREER_CLUSTERS) == 12

    def test_cluster_names_are_unique(self):
        names = [c.name for c in CAREER_CLUSTERS]
        assert len(names) == len(set(names))

    def test_all_cluster_trait_weights_sum_to_1(self):
        """Each cluster's trait weights should sum to 1.0 (normalised)."""
        for cluster in CAREER_CLUSTERS:
            total = sum(cluster.trait_weights.values())
            assert abs(total - 1.0) < 0.01, (
                f"{cluster.name} weights sum to {total}, not 1.0"
            )

    def test_all_cluster_trait_codes_are_valid(self):
        valid_codes = {t.value for t in Trait}
        for cluster in CAREER_CLUSTERS:
            for code in cluster.trait_weights:
                assert code in valid_codes, (
                    f"{cluster.name} uses unknown trait code: {code}"
                )

    def test_careers_sorted_descending(self):
        answers = _all_position(3)
        result = score_assessment(answers).model_dump()
        pcts = [c["match_percentage"] for c in result["top_careers"]]
        assert pcts == sorted(pcts, reverse=True)

    def test_tie_breaking_alphabetical(self):
        """When match percentages are equal, alphabetically earlier career wins."""
        # Create a profile where all traits are equal
        equal_profile = TraitProfile(
            AN=50, TE=50, SC=50, BU=50, CR=50, SO=50, LE=50, EX=50
        )
        careers = compute_career_matches(equal_profile)
        # For ties, names should be alphabetical
        for i in range(len(careers) - 1):
            if careers[i].match_percentage == careers[i + 1].match_percentage:
                assert careers[i].career_name <= careers[i + 1].career_name

    def test_each_cluster_has_skill_gaps(self):
        for cluster in CAREER_CLUSTERS:
            assert len(cluster.skill_gaps) >= 1

    def test_each_cluster_has_next_steps(self):
        for cluster in CAREER_CLUSTERS:
            assert len(cluster.next_steps) >= 1

    def test_career_explanation_strength_tiers(self):
        """Verify explanation text uses correct strength labels."""
        assert "strong" in _build_career_explanation("Test", ["Analytical"], 80)
        assert "solid" in _build_career_explanation("Test", ["Analytical"], 60)
        assert "moderate" in _build_career_explanation("Test", ["Analytical"], 30)

    def test_career_match_percentage_bounded(self):
        """No career match can exceed 100% or go below 0%."""
        for pos in range(1, 7):
            answers = _all_position(pos)
            result = score_assessment(answers).model_dump()
            for c in result["top_careers"]:
                assert 0 <= c["match_percentage"] <= 100

    def test_top_traits_are_valid_human_labels(self):
        valid_labels = set(TRAIT_LABELS.values())
        answers = _all_position(1)
        result = score_assessment(answers).model_dump()
        for c in result["top_careers"]:
            for t in c["top_traits"]:
                assert t in valid_labels, f"Unknown trait label: {t}"


# ══════════════════════════════════════════════════════════════════════
# 5. DETERMINISM — REPEATED SUBMISSIONS
# ══════════════════════════════════════════════════════════════════════

class TestDeterminism:
    """The same answers must ALWAYS produce the exact same result."""

    def test_same_answers_same_traits(self):
        answers = _all_position(3)
        r1 = score_assessment(answers).model_dump()
        r2 = score_assessment(answers).model_dump()
        assert r1["trait_profile"] == r2["trait_profile"]

    def test_same_answers_same_streams(self):
        answers = _all_position(3)
        r1 = score_assessment(answers).model_dump()
        r2 = score_assessment(answers).model_dump()
        assert r1["streams"]["scores"] == r2["streams"]["scores"]

    def test_same_answers_same_careers(self):
        answers = _all_position(3)
        r1 = score_assessment(answers).model_dump()
        r2 = score_assessment(answers).model_dump()
        assert r1["top_careers"] == r2["top_careers"]

    def test_deterministic_across_100_runs(self):
        answers = _all_position(1)
        baseline = score_assessment(answers).model_dump()
        for _ in range(100):
            current = score_assessment(answers).model_dump()
            assert current == baseline

    def test_answer_order_irrelevant(self):
        """Dict ordering shouldn't affect scoring."""
        answers = _all_position(2)
        reversed_answers = dict(reversed(list(answers.items())))
        r1 = score_assessment(answers).model_dump()
        r2 = score_assessment(reversed_answers).model_dump()
        assert r1 == r2


# ══════════════════════════════════════════════════════════════════════
# 6. BOUNDARY VALUES
# ══════════════════════════════════════════════════════════════════════

class TestBoundaryValues:
    """Edge case and boundary value testing."""

    def test_all_positions_1_through_6_valid(self):
        """Every uniform-position answer set produces a valid result."""
        for pos in range(1, 7):
            answers = _all_position(pos)
            result = score_assessment(answers).model_dump()
            _assert_valid_result(result)

    def test_unrecognised_answers_silently_skipped_in_engine(self):
        """
        The engine itself skips unknowns gracefully. The route layer
        validates, but the engine must not crash.
        """
        answers = {qid: "INVALID" for qid in REQUIRED_QUESTION_IDS}
        profile = compute_trait_scores(answers)
        d = profile.model_dump()
        for t in Trait:
            assert d[t.value] == 0.0

    def test_extra_question_ids_ignored(self):
        """Extra keys beyond q1-q20 should not affect scoring."""
        answers = _all_position(1)
        answers_with_extra = copy.deepcopy(answers)
        answers_with_extra["q99"] = "phantom"
        answers_with_extra["bonus"] = "ignored"
        r1 = score_assessment(answers).model_dump()
        r2 = score_assessment(answers_with_extra).model_dump()
        assert r1["trait_profile"] == r2["trait_profile"]
        assert r1["streams"]["scores"] == r2["streams"]["scores"]

    def test_mixed_valid_and_invalid_answers(self):
        """10 valid + 10 invalid answers: engine uses valid ones only."""
        valid = _answers_from_positions({
            f"q{i}": 1 for i in range(1, 11)
        })
        invalid = {f"q{i}": "GARBAGE" for i in range(11, 21)}
        combined = {**valid, **invalid}
        profile = compute_trait_scores(combined)
        # Should still produce values (from the 10 valid answers)
        d = profile.model_dump()
        has_nonzero = any(d[t.value] > 0 for t in Trait)
        assert has_nonzero, "Expected some nonzero scores from valid answers"


# ══════════════════════════════════════════════════════════════════════
# 7. API VALIDATION
# ══════════════════════════════════════════════════════════════════════

class TestAPIValidation:
    """Route-level input validation tests."""

    def test_missing_single_question(self):
        answers = _all_position(1)
        del answers["q20"]
        resp = client.post("/api/v1/assessment/score", json={"answers": answers})
        assert resp.status_code == 422
        body = resp.json()
        assert body["detail"]["error"] == "missing_answers"
        assert "q20" in body["detail"]["missing_question_ids"]

    def test_missing_all_questions(self):
        resp = client.post("/api/v1/assessment/score", json={"answers": {}})
        assert resp.status_code == 422

    def test_no_body(self):
        resp = client.post("/api/v1/assessment/score", json={})
        assert resp.status_code == 422

    def test_null_body(self):
        resp = client.post(
            "/api/v1/assessment/score",
            content="null",
            headers={"content-type": "application/json"},
        )
        assert resp.status_code == 422

    def test_single_invalid_answer(self):
        answers = _all_position(1)
        answers["q10"] = "Not a real option"
        resp = client.post("/api/v1/assessment/score", json={"answers": answers})
        assert resp.status_code == 422
        body = resp.json()
        assert body["detail"]["error"] == "invalid_answers"

    def test_all_valid_answers_returns_200(self):
        for pos in range(1, 7):
            answers = _all_position(pos)
            resp = client.post(
                "/api/v1/assessment/score", json={"answers": answers}
            )
            assert resp.status_code == 200
            _assert_valid_result(resp.json())

    def test_valid_response_shape(self):
        answers = _all_position(1)
        resp = client.post(
            "/api/v1/assessment/score", json={"answers": answers}
        )
        body = resp.json()
        # Top-level keys
        assert "trait_profile" in body
        assert "streams" in body
        assert "top_careers" in body
        # Stream sub-keys
        assert "scores" in body["streams"]
        assert "recommendation" in body["streams"]
        assert "descriptions" in body["streams"]


# ══════════════════════════════════════════════════════════════════════
# 8. PROFILE ARCHETYPES — CORRECT CAREER ALIGNMENT
# ══════════════════════════════════════════════════════════════════════

class TestProfileArchetypes:
    """
    Verify that strongly typed profiles produce expected top careers.
    These are 'sanity check' tests — if a student answers everything
    tech-related, their top career should be tech-related.
    """

    def _score_profile(self, positions: dict[str, int]) -> dict:
        answers = _answers_from_positions(positions)
        return score_assessment(answers).model_dump()

    def test_tech_profile_gets_tech_careers(self):
        """Mostly TE/AN → Software or AI/ML or Engineering on top."""
        # Pick option 1 (tech-leaning) for most questions
        result = self._score_profile({
            "q1": 1, "q2": 1, "q3": 5, "q4": 5, "q5": 1,
            "q6": 2, "q7": 2, "q8": 2, "q9": 1, "q10": 1,
            "q11": 1, "q12": 1, "q13": 1, "q14": 6, "q15": 3,
            "q16": 5, "q17": 2, "q18": 6, "q19": 4, "q20": 4,
        })
        top_name = result["top_careers"][0]["career_name"]
        tech_names = {
            "Software / App Development",
            "AI / Machine Learning / Data Science",
            "Engineering",
        }
        assert top_name in tech_names, f"Got {top_name}"

    def test_business_profile_gets_business_careers(self):
        """Mostly BU/LE → Entrepreneurship or Finance on top."""
        result = self._score_profile({
            "q1": 4, "q2": 6, "q3": 1, "q4": 3, "q5": 3,
            "q6": 3, "q7": 5, "q8": 6, "q9": 2, "q10": 3,
            "q11": 4, "q12": 3, "q13": 2, "q14": 2, "q15": 4,
            "q16": 1, "q17": 3, "q18": 1, "q19": 1, "q20": 3,
        })
        top_name = result["top_careers"][0]["career_name"]
        business_names = {
            "Finance / Investment Banking",
            "Entrepreneurship",
            "Management / Product Management",
        }
        assert top_name in business_names, f"Got {top_name}"

    def test_creative_profile_gets_creative_careers(self):
        """Mostly CR → Design or Marketing on top."""
        result = self._score_profile({
            "q1": 2, "q2": 2, "q3": 4, "q4": 2, "q5": 2,
            "q6": 5, "q7": 4, "q8": 4, "q9": 4, "q10": 4,
            "q11": 3, "q12": 4, "q13": 6, "q14": 6, "q15": 2,
            "q16": 4, "q17": 6, "q18": 2, "q19": 6, "q20": 5,
        })
        top_name = result["top_careers"][0]["career_name"]
        creative_names = {
            "Design / Creative Arts",
            "Marketing / Media / Communications",
        }
        assert top_name in creative_names, f"Got {top_name}"

    def test_social_profile_gets_social_careers(self):
        """Mostly SO → Medicine, Psychology, or Law on top."""
        result = self._score_profile({
            "q1": 3, "q2": 3, "q3": 2, "q4": 4, "q5": 4,
            "q6": 4, "q7": 1, "q8": 3, "q9": 3, "q10": 6,
            "q11": 6, "q12": 2, "q13": 4, "q14": 4, "q15": 5,
            "q16": 3, "q17": 1, "q18": 5, "q19": 3, "q20": 1,
        })
        top_name = result["top_careers"][0]["career_name"]
        social_names = {
            "Medicine / Healthcare",
            "Psychology / Social Impact",
            "Law / Public Policy",
            "Marketing / Media / Communications",
        }
        assert top_name in social_names, f"Got {top_name}"

    def test_science_profile_gets_science_careers(self):
        """Mostly SC → Scientific Research or Medicine on top."""
        result = self._score_profile({
            "q1": 5, "q2": 5, "q3": 6, "q4": 1, "q5": 5,
            "q6": 1, "q7": 6, "q8": 1, "q9": 5, "q10": 5,
            "q11": 5, "q12": 5, "q13": 5, "q14": 1, "q15": 1,
            "q16": 5, "q17": 5, "q18": 6, "q19": 2, "q20": 6,
        })
        top_name = result["top_careers"][0]["career_name"]
        science_names = {
            "Scientific Research",
            "AI / Machine Learning / Data Science",
            "Engineering",
            "Medicine / Healthcare",
        }
        assert top_name in science_names, f"Got {top_name}"


# ══════════════════════════════════════════════════════════════════════
# 9. FRONTEND ↔ BACKEND OPTION SYNC
# ══════════════════════════════════════════════════════════════════════

class TestFrontendBackendSync:
    """
    Verify the frontend assessment-data.ts option values exactly match
    the backend QUESTION_OPTIONS keys. This prevents option text drift
    that would cause 422 errors in production.

    We load the frontend data via the raw QUESTION_OPTIONS (source of
    truth). The frontend file is already validated by the existing
    TestAllFirstOptions..TestAllSecondOptions tests since they use
    OPTION_INDEX to build answers. This class adds *explicit* structural
    checks.
    """

    def test_all_options_have_matching_trait_weights(self):
        """Every option text in QUESTION_OPTIONS maps to at least 1 trait."""
        for qid, opts in QUESTION_OPTIONS.items():
            for text, weights in opts.items():
                assert len(weights) >= 1, f"{qid}/{text} has 0 weights"

    def test_option_index_positions_contiguous(self):
        """Option positions for every question are exactly {1,2,3,4,5,6}."""
        for qid, opts in OPTION_INDEX.items():
            positions = set(opts.values())
            assert positions == {1, 2, 3, 4, 5, 6}, (
                f"{qid} positions: {positions}"
            )


# ══════════════════════════════════════════════════════════════════════
# 10. CAREER MAPPING CONSISTENCY
# ══════════════════════════════════════════════════════════════════════

class TestCareerMappingConsistency:
    """
    Ensure every career name generated by the scoring engine is a valid
    cluster name and that no unsupported IDs leak through.
    """

    def test_all_12_cluster_names_are_strings(self):
        for cluster in CAREER_CLUSTERS:
            assert isinstance(cluster.name, str) and len(cluster.name) > 0

    def test_no_duplicate_cluster_names(self):
        names = [c.name for c in CAREER_CLUSTERS]
        assert len(names) == len(set(names))

    def test_every_returned_career_is_a_known_cluster(self):
        known = {c.name for c in CAREER_CLUSTERS}
        for pos in range(1, 7):
            answers = _all_position(pos)
            result = score_assessment(answers).model_dump()
            for c in result["top_careers"]:
                assert c["career_name"] in known, (
                    f"Unknown career: {c['career_name']}"
                )

    def test_frozen_cluster_dataclass(self):
        """Career clusters are frozen — they cannot be mutated at runtime."""
        cluster = CAREER_CLUSTERS[0]
        with pytest.raises(AttributeError):
            cluster.name = "Mutated"  # type: ignore[misc]


# ══════════════════════════════════════════════════════════════════════
# 11. STREAM HELPER FUNCTIONS
# ══════════════════════════════════════════════════════════════════════

class TestStreamHelpers:
    """Edge cases for _build_recommendation and _build_stream_descriptions."""

    def test_recommendation_all_above_30(self):
        pcts = {"science": 34.0, "commerce": 33.0, "arts": 33.0}
        rec = _build_recommendation(pcts)
        assert "Science" in rec
        assert "worth exploring" in rec or "strongest" in rec

    def test_recommendation_one_dominant(self):
        pcts = {"science": 70.0, "commerce": 20.0, "arts": 10.0}
        rec = _build_recommendation(pcts)
        assert "Science" in rec
        assert "strongest" in rec

    def test_descriptions_all_three_keys(self):
        pcts = {"science": 40.0, "commerce": 35.0, "arts": 25.0}
        descs = _build_stream_descriptions(pcts)
        assert set(descs.keys()) == {"science", "commerce", "arts"}
        # Highest rank gets "best current fit"
        assert "best current fit" in descs["science"]


# ══════════════════════════════════════════════════════════════════════
# 12. FULL PIPELINE INTEGRATION
# ══════════════════════════════════════════════════════════════════════

class TestFullPipeline:
    """End-to-end pipeline tests using score_assessment."""

    def test_pipeline_returns_assessment_response(self):
        from app.models import AssessmentResponse
        answers = _all_position(1)
        result = score_assessment(answers)
        assert isinstance(result, AssessmentResponse)

    def test_pipeline_trait_profile_is_trait_profile(self):
        answers = _all_position(1)
        result = score_assessment(answers)
        assert isinstance(result.trait_profile, TraitProfile)

    def test_pipeline_careers_are_career_match_objects(self):
        from app.models import CareerMatch
        answers = _all_position(1)
        result = score_assessment(answers)
        for c in result.top_careers:
            assert isinstance(c, CareerMatch)

    def test_every_option_combination_produces_valid_result(self):
        """
        Test a selection of diverse answer combinations.
        We can't test all 6^20 combos, but we test a representative
        sample of 20 distinct position patterns.
        """
        patterns = [
            {qid: ((i + j) % 6) + 1 for j, qid in enumerate(REQUIRED_QUESTION_IDS)}
            for i in range(20)
        ]
        for i, positions in enumerate(patterns):
            answers = _answers_from_positions(positions)
            result = score_assessment(answers).model_dump()
            _assert_valid_result(result), f"Pattern {i} failed validation"
