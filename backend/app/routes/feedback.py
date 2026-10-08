"""
Student Feedback routes for Career Compass evaluation.
"""

from __future__ import annotations

import time
import uuid

from fastapi import APIRouter, Header, HTTPException, status

from app.database import get_db
from app.models import FeedbackSubmissionRequest, FeedbackStatsResponse
from app.security import get_user_from_token

router = APIRouter(prefix="/api/v1/feedback", tags=["feedback"])


@router.post("", status_code=status.HTTP_201_CREATED)
def submit_feedback(
    payload: FeedbackSubmissionRequest,
    authorization: str | None = Header(default=None),
) -> dict:
    """
    Submit structured student evaluation feedback.
    Supports both authenticated and anonymous evaluation sessions.
    """
    user_id: str | None = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split("Bearer ", 1)[1].strip()
        user = get_user_from_token(token)
        if user:
            user_id = user["id"]

    feedback_id = str(uuid.uuid4())
    submitted_at = int(time.time())

    with get_db() as conn:
        conn.execute(
            """
            INSERT INTO student_feedback (
                id, user_id, session_id, submitted_at,
                profile_clarity_score, career_relevance_score,
                strengths_understanding_score, career_exploration_usefulness_score,
                confidence_before, confidence_after,
                recommendation_explanation_score, discovered_new_career,
                recommend_to_others, most_useful, improvement_suggestion
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                feedback_id,
                user_id,
                payload.session_id,
                submitted_at,
                payload.profile_clarity_score,
                payload.career_relevance_score,
                payload.strengths_understanding_score,
                payload.career_exploration_usefulness_score,
                payload.confidence_before,
                payload.confidence_after,
                payload.recommendation_explanation_score,
                1 if payload.discovered_new_career else 0,
                1 if payload.recommend_to_others else 0,
                payload.most_useful.strip() if payload.most_useful else None,
                payload.improvement_suggestion.strip() if payload.improvement_suggestion else None,
            ),
        )

    return {
        "status": "success",
        "id": feedback_id,
        "submitted_at": submitted_at,
    }


@router.get("/stats", response_model=FeedbackStatsResponse)
def get_feedback_stats() -> FeedbackStatsResponse:
    """
    Calculate and return aggregate feedback metrics.
    Only computes metrics when genuine student responses exist.
    """
    with get_db() as conn:
        row = conn.execute(
            """
            SELECT
                COUNT(*) as total,
                AVG(profile_clarity_score) as avg_clarity,
                AVG(career_relevance_score) as avg_relevance,
                AVG(strengths_understanding_score) as avg_strengths,
                AVG(career_exploration_usefulness_score) as avg_exploration,
                AVG(confidence_before) as avg_before,
                AVG(confidence_after) as avg_after,
                AVG(discovered_new_career) as avg_discovery,
                AVG(recommend_to_others) as avg_recommend
            FROM student_feedback
            """
        ).fetchone()

        if not row or row["total"] == 0:
            return FeedbackStatsResponse(total_responses=0)

        total = row["total"]
        avg_clarity = round(float(row["avg_clarity"]), 2) if row["avg_clarity"] is not None else None
        avg_relevance = round(float(row["avg_relevance"]), 2) if row["avg_relevance"] is not None else None
        avg_strengths = round(float(row["avg_strengths"]), 2) if row["avg_strengths"] is not None else None
        avg_exploration = round(float(row["avg_exploration"]), 2) if row["avg_exploration"] is not None else None
        avg_before = round(float(row["avg_before"]), 2) if row["avg_before"] is not None else None
        avg_after = round(float(row["avg_after"]), 2) if row["avg_after"] is not None else None

        confidence_improvement = None
        if avg_after is not None and avg_before is not None:
            confidence_improvement = round(avg_after - avg_before, 2)

        discovery_rate = round(float(row["avg_discovery"]) * 100, 1) if row["avg_discovery"] is not None else None
        recommend_rate = round(float(row["avg_recommend"]) * 100, 1) if row["avg_recommend"] is not None else None

        return FeedbackStatsResponse(
            total_responses=total,
            avg_profile_clarity=avg_clarity,
            avg_career_relevance=avg_relevance,
            avg_strengths_understanding=avg_strengths,
            avg_exploration_usefulness=avg_exploration,
            avg_confidence_before=avg_before,
            avg_confidence_after=avg_after,
            confidence_improvement=confidence_improvement,
            discovery_rate_percent=discovery_rate,
            recommend_rate_percent=recommend_rate,
        )
