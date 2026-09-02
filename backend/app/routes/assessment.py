"""
Assessment scoring API route.

POST /api/v1/assessment/score
  → Accepts the 20 answers, returns the full scored result.
"""

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.models import AssessmentRequest, AssessmentResponse
from app.scoring.engine import score_assessment
from app.scoring.traits import REQUIRED_QUESTION_IDS, get_option_index

router = APIRouter(prefix="/api/v1/assessment", tags=["assessment"])


@router.post("/score", response_model=AssessmentResponse)
async def score(request: AssessmentRequest) -> AssessmentResponse:
    """
    Score a completed Class 10 career assessment.

    Validates that:
      - All 20 question IDs (q1-q20) are present.
      - Every answer text matches a known option for its question.

    Returns 422 with descriptive errors for any validation failures.
    """
    answers = request.answers

    # ── Validate completeness ────────────────────────────────────
    missing = [qid for qid in REQUIRED_QUESTION_IDS if qid not in answers]
    if missing:
        raise HTTPException(
            status_code=422,
            detail={
                "error": "missing_answers",
                "message": f"Missing answers for {len(missing)} question(s).",
                "missing_question_ids": missing,
            },
        )

    # ── Validate answer values ───────────────────────────────────
    invalid: list[dict[str, str]] = []
    for qid in REQUIRED_QUESTION_IDS:
        answer_text = answers[qid]
        if get_option_index(qid, answer_text) is None:
            invalid.append({"question_id": qid, "answer": answer_text})

    if invalid:
        raise HTTPException(
            status_code=422,
            detail={
                "error": "invalid_answers",
                "message": f"Unrecognised answer text for {len(invalid)} question(s).",
                "invalid_answers": invalid,
            },
        )

    # ── Score ────────────────────────────────────────────────────
    return score_assessment(answers)
