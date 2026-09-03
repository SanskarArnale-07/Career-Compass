"""
Scoring engine tests — verifies correctness for multiple profiles
and edge cases.

Run with:  python -m pytest tests/ -v  (from backend/)
"""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from main import app
from app.scoring.engine import (
    compute_career_matches,
    compute_stream_scores,
    compute_trait_scores,
    score_assessment,
)
from app.scoring.traits import OPTION_INDEX, REQUIRED_QUESTION_IDS

client = TestClient(app)


# ── Helper: build answers from option positions ─────────────────────

def _answers_from_positions(positions: dict[str, int]) -> dict[str, str]:
    """
    Given a map of question_id → 1-indexed position, return the
    corresponding answer-text dict.
    """
    answers: dict[str, str] = {}
    for qid, pos in positions.items():
        options = OPTION_INDEX[qid]
        # Reverse lookup: position → text
        for text, idx in options.items():
            if idx == pos:
                answers[qid] = text
                break
    return answers


def _all_position(pos: int) -> dict[str, str]:
    """Every question answered with option at the given 1-indexed position."""
    return _answers_from_positions({qid: pos for qid in REQUIRED_QUESTION_IDS})


# ── Shared assertions ───────────────────────────────────────────────

def _assert_valid_result(result: dict):
    """Check invariants that must hold for any valid scoring result."""
    # Trait profile: all values 0-100
    tp = result["trait_profile"]
    for code in ["AN", "TE", "SC", "BU", "CR", "SO", "LE", "EX"]:
        assert code in tp, f"Missing trait {code}"
        assert 0 <= tp[code] <= 100, f"Trait {code} out of range: {tp[code]}"

    # Stream scores: all 0-100 and sum ≈ 100
    ss = result["streams"]["scores"]
    for stream in ["science", "commerce", "arts"]:
        assert stream in ss
        assert 0 <= ss[stream] <= 100, f"Stream {stream} out of range: {ss[stream]}"
    total = ss["science"] + ss["commerce"] + ss["arts"]
    assert 99.5 <= total <= 100.5, f"Stream scores don't sum to 100: {total}"

    # Recommendation text exists
    assert len(result["streams"]["recommendation"]) > 0

    # Top careers: exactly 5, valid match %
    careers = result["top_careers"]
    assert len(careers) == 5, f"Expected 5 careers, got {len(careers)}"
    for c in careers:
        assert 0 <= c["match_percentage"] <= 100
        assert len(c["top_traits"]) >= 1
        assert len(c["explanation"]) > 0
        assert len(c["skill_gaps"]) >= 1
        assert len(c["next_steps"]) >= 1

    # Careers are sorted descending
    percentages = [c["match_percentage"] for c in careers]
    assert percentages == sorted(percentages, reverse=True), "Careers not sorted"


# ═══════════════════════════════════════════════════════════════════
# TEST 1: All first options
# ═══════════════════════════════════════════════════════════════════

class TestAllFirstOptions:
    """Profile: every question answered with the 1st option."""

    @pytest.fixture(autouse=True)
    def setup(self):
        self.answers = _all_position(1)
        self.result = score_assessment(self.answers).model_dump()

    def test_no_negative_scores(self):
        tp = self.result["trait_profile"]
        for code, val in tp.items():
            assert val >= 0, f"Negative trait score: {code}={val}"

    def test_valid_percentages(self):
        _assert_valid_result(self.result)

    def test_top_careers_returned(self):
        assert len(self.result["top_careers"]) == 5

    def test_api_endpoint(self):
        resp = client.post(
            "/api/v1/assessment/score",
            json={"answers": self.answers},
        )
        assert resp.status_code == 200
        _assert_valid_result(resp.json())


# ═══════════════════════════════════════════════════════════════════
# TEST 2: All second options
# ═══════════════════════════════════════════════════════════════════

class TestAllSecondOptions:
    """Profile: every question answered with the 2nd option."""

    @pytest.fixture(autouse=True)
    def setup(self):
        self.answers = _all_position(2)
        self.result = score_assessment(self.answers).model_dump()

    def test_no_negative_scores(self):
        tp = self.result["trait_profile"]
        for code, val in tp.items():
            assert val >= 0, f"Negative trait score: {code}={val}"

    def test_valid_percentages(self):
        _assert_valid_result(self.result)

    def test_top_careers_returned(self):
        assert len(self.result["top_careers"]) == 5

    def test_api_endpoint(self):
        resp = client.post(
            "/api/v1/assessment/score",
            json={"answers": self.answers},
        )
        assert resp.status_code == 200
        _assert_valid_result(resp.json())


# ═══════════════════════════════════════════════════════════════════
# TEST 3: Mixed realistic profile
# ═══════════════════════════════════════════════════════════════════

class TestMixedProfile:
    """
    A realistic mixed profile:
      Tech-leaning student who enjoys science, some creativity,
      and moderate business interest.
    """

    @pytest.fixture(autouse=True)
    def setup(self):
        self.answers = _answers_from_positions({
            "q1": 1,   # Building apps or websites          → TE, AN
            "q2": 1,   # Solving problems                   → AN, SC
            "q3": 5,   # Building something meaningful      → TE, CR, LE
            "q4": 5,   # You always find solutions           → AN, TE
            "q5": 1,   # AI & Robotics Lab                  → TE, SC
            "q6": 2,   # Solving difficult challenges       → AN, TE
            "q7": 2,   # Tech help                          → TE, AN
            "q8": 2,   # Coding                             → TE, AN
            "q9": 1,   # Technical problems                 → TE, AN
            "q10": 1,  # Remote from anywhere               → EX, TE
            "q11": 5,  # Artificial Intelligence            → TE, SC
            "q12": 1,  # I enjoy building things             → TE, AN
            "q13": 1,  # Technology                         → TE, SC
            "q14": 2,  # Start a company                    → BU, LE
            "q15": 1,  # Curious                            → SC, EX
            "q16": 5,  # Inventing something revolutionary  → SC, TE
            "q17": 2,  # Building an app from scratch       → TE, AN
            "q18": 6,  # Opportunity to grow                → SC, LE
            "q19": 4,  # Inventing something useful         → TE, SC
            "q20": 4,  # I solved important problems        → AN, SC
        })
        self.result = score_assessment(self.answers).model_dump()

    def test_valid_percentages(self):
        _assert_valid_result(self.result)

    def test_science_is_top_stream(self):
        """A tech/science student should score highest in Science."""
        ss = self.result["streams"]["scores"]
        assert ss["science"] >= ss["commerce"]
        assert ss["science"] >= ss["arts"]

    def test_top_career_is_tech_related(self):
        """Top career should be tech-related."""
        top = self.result["top_careers"][0]["career_name"]
        tech_careers = {
            "Software / App Development",
            "AI / Machine Learning / Data Science",
            "Engineering",
        }
        assert top in tech_careers, f"Expected tech career, got: {top}"

    def test_api_endpoint(self):
        resp = client.post(
            "/api/v1/assessment/score",
            json={"answers": self.answers},
        )
        assert resp.status_code == 200
        _assert_valid_result(resp.json())


# ═══════════════════════════════════════════════════════════════════
# TEST 4: Missing answers → 422
# ═══════════════════════════════════════════════════════════════════

class TestMissingAnswers:
    def test_partial_answers_returns_422(self):
        partial = _answers_from_positions({
            qid: 1 for qid in REQUIRED_QUESTION_IDS[:10]
        })
        resp = client.post(
            "/api/v1/assessment/score",
            json={"answers": partial},
        )
        assert resp.status_code == 422
        body = resp.json()
        assert body["detail"]["error"] == "missing_answers"
        assert len(body["detail"]["missing_question_ids"]) == 10


# ═══════════════════════════════════════════════════════════════════
# TEST 5: Invalid answer text → 422
# ═══════════════════════════════════════════════════════════════════

class TestInvalidAnswers:
    def test_garbage_answers_returns_422(self):
        garbage = {qid: "totally invalid garbage" for qid in REQUIRED_QUESTION_IDS}
        resp = client.post(
            "/api/v1/assessment/score",
            json={"answers": garbage},
        )
        assert resp.status_code == 422
        body = resp.json()
        assert body["detail"]["error"] == "invalid_answers"
        assert len(body["detail"]["invalid_answers"]) == 20


# ═══════════════════════════════════════════════════════════════════
# TEST 6: Empty body → 422
# ═══════════════════════════════════════════════════════════════════

class TestEmptyBody:
    def test_empty_dict_returns_422(self):
        resp = client.post(
            "/api/v1/assessment/score",
            json={},
        )
        assert resp.status_code == 422

    def test_empty_answers_returns_422(self):
        resp = client.post(
            "/api/v1/assessment/score",
            json={"answers": {}},
        )
        assert resp.status_code == 422


# ═══════════════════════════════════════════════════════════════════
# TEST 7: Perfect trait scores
# ═══════════════════════════════════════════════════════════════════

class TestPerfectTraitCeilings:
    """
    Tests that the per-trait normalization is correct.
    For each trait, if the student picks the highest possible weighting
    option for every question, their normalized score for that trait
    must be EXACTLY 100.0.
    """
    def test_each_trait_can_reach_exactly_100(self):
        from app.scoring.traits import TRAIT_WEIGHT_MAP, Trait
        
        for target_trait in Trait:
            positions = {}
            for qid, options in TRAIT_WEIGHT_MAP.items():
                best_pos = 1
                best_val = -1
                for pos, weights in options.items():
                    val = weights.get(target_trait, 0)
                    if val > best_val:
                        best_val = val
                        best_pos = pos
                positions[qid] = best_pos
            
            answers = _answers_from_positions(positions)
            result = score_assessment(answers).model_dump()
            score = result["trait_profile"][target_trait.value]
            
            assert score == 100.0, f"{target_trait.value} ceiling max is {score}, expected 100.0"

