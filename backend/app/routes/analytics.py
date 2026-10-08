"""
Analytics and Research Metrics routes for Career Compass.
"""

from __future__ import annotations

import json
import time
import uuid
from typing import Union

from fastapi import APIRouter, Header, status

from app.database import get_db
from app.models import (
    AnalyticsBatchRequest,
    AnalyticsEventPayload,
    ResearchMetricsResponse,
)
from app.security import get_user_from_token

router = APIRouter(prefix="/api/v1/analytics", tags=["analytics"])

ALLOWED_EVENT_NAMES = {
    "ASSESSMENT_STARTED",
    "ASSESSMENT_COMPLETED",
    "PROFILE_VIEWED",
    "TRAIT_SECTION_VIEWED",
    "CAREER_DOMAIN_OPENED",
    "CAREER_PATH_OPENED",
    "CAREER_DETAILS_VIEWED",
    "CAREER_SAVED",
    "ROADMAP_OPENED",
    "ROADMAP_STAGE_VIEWED",
    "FEEDBACK_OPENED",
    "FEEDBACK_SUBMITTED",
}


@router.post("/events", status_code=status.HTTP_202_ACCEPTED)
def track_events(
    payload: Union[AnalyticsEventPayload, AnalyticsBatchRequest],
    authorization: str | None = Header(default=None),
) -> dict:
    """
    Record privacy-conscious platform usage events.
    Accepts single events or batches up to 50 items.
    """
    user_id: str | None = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split("Bearer ", 1)[1].strip()
        user = get_user_from_token(token)
        if user:
            user_id = user["id"]

    events_to_process = (
        payload.events if isinstance(payload, AnalyticsBatchRequest) else [payload]
    )

    now = int(time.time())
    records = []

    for ev in events_to_process:
        event_name = ev.event_name.strip().upper()
        # Accept valid known events or normalized variants
        if event_name not in ALLOWED_EVENT_NAMES and not event_name.startswith("CAREER_"):
            continue

        ev_id = str(uuid.uuid4())
        ev_ts = ev.timestamp or now
        props_str = json.dumps(ev.properties) if ev.properties else "{}"
        records.append((ev_id, event_name, user_id, ev.session_id, ev_ts, props_str))

    if records:
        with get_db() as conn:
            conn.executemany(
                """
                INSERT INTO analytics_events (
                    id, event_name, user_id, session_id, timestamp, properties
                ) VALUES (?, ?, ?, ?, ?, ?)
                """,
                records,
            )

    return {"status": "accepted", "count": len(records)}


@router.get("/metrics", response_model=ResearchMetricsResponse)
def get_research_metrics() -> ResearchMetricsResponse:
    """
    Computes grounded platform utilization and student outcome metrics.
    Only computes metrics from authentic recorded sessions and feedback.
    """
    with get_db() as conn:
        # 1. Assessment counts
        started_row = conn.execute(
            "SELECT COUNT(DISTINCT session_id) as cnt FROM analytics_events WHERE event_name = 'ASSESSMENT_STARTED'"
        ).fetchone()
        assessments_started = started_row["cnt"] if started_row else 0

        completed_row = conn.execute(
            "SELECT COUNT(DISTINCT session_id) as cnt FROM analytics_events WHERE event_name = 'ASSESSMENT_COMPLETED'"
        ).fetchone()
        assessments_completed = completed_row["cnt"] if completed_row else 0

        completion_rate = None
        if assessments_started > 0:
            completion_rate = round((assessments_completed / assessments_started) * 100, 1)

        # 2. Distinct engaged students (sessions or users)
        students_row = conn.execute(
            "SELECT COUNT(DISTINCT session_id) as cnt FROM analytics_events"
        ).fetchone()
        total_students = students_row["cnt"] if students_row else 0

        # 3. Feedback metrics
        fb_row = conn.execute(
            """
            SELECT
                COUNT(*) as total,
                AVG(profile_clarity_score) as avg_clarity,
                AVG(career_relevance_score) as avg_relevance,
                AVG(career_exploration_usefulness_score) as avg_usefulness,
                AVG(confidence_before) as avg_before,
                AVG(confidence_after) as avg_after,
                AVG(discovered_new_career) as avg_discovery,
                AVG(recommend_to_others) as avg_recommend
            FROM student_feedback
            """
        ).fetchone()

        total_feedback = fb_row["total"] if fb_row else 0
        feedback_rate = None
        if assessments_completed > 0:
            feedback_rate = round((total_feedback / assessments_completed) * 100, 1)

        avg_clarity = round(float(fb_row["avg_clarity"]), 2) if fb_row and fb_row["avg_clarity"] is not None else None
        avg_relevance = round(float(fb_row["avg_relevance"]), 2) if fb_row and fb_row["avg_relevance"] is not None else None
        avg_usefulness = round(float(fb_row["avg_usefulness"]), 2) if fb_row and fb_row["avg_usefulness"] is not None else None
        avg_before = round(float(fb_row["avg_before"]), 2) if fb_row and fb_row["avg_before"] is not None else None
        avg_after = round(float(fb_row["avg_after"]), 2) if fb_row and fb_row["avg_after"] is not None else None

        confidence_delta = None
        if avg_after is not None and avg_before is not None:
            confidence_delta = round(avg_after - avg_before, 2)

        discovery_pct = round(float(fb_row["avg_discovery"]) * 100, 1) if fb_row and fb_row["avg_discovery"] is not None else None
        recommend_pct = round(float(fb_row["avg_recommend"]) * 100, 1) if fb_row and fb_row["avg_recommend"] is not None else None

        # 4. Total events
        events_count_row = conn.execute("SELECT COUNT(*) as cnt FROM analytics_events").fetchone()
        total_events = events_count_row["cnt"] if events_count_row else 0

        # 5. Career exploration: average distinct career explorations per session
        career_events = conn.execute(
            """
            SELECT session_id, properties
            FROM analytics_events
            WHERE event_name IN ('CAREER_DETAILS_VIEWED', 'CAREER_PATH_OPENED')
            """
        ).fetchall()

        careers_per_session: dict[str, set[str]] = {}
        domain_counts: dict[str, int] = {}
        path_counts: dict[str, int] = {}

        for row in career_events:
            sid = row["session_id"]
            if sid not in careers_per_session:
                careers_per_session[sid] = set()

            try:
                props = json.loads(row["properties"])
                slug = props.get("slug") or props.get("career") or props.get("path")
                if slug:
                    careers_per_session[sid].add(str(slug))
                    path_counts[str(slug)] = path_counts.get(str(slug), 0) + 1

                domain = props.get("domain") or props.get("domainId")
                if domain:
                    domain_counts[str(domain)] = domain_counts.get(str(domain), 0) + 1
            except Exception:
                pass

        avg_careers_explored = 0.0
        if careers_per_session:
            total_distinct_explored = sum(len(s) for s in careers_per_session.values())
            avg_careers_explored = round(total_distinct_explored / len(careers_per_session), 1)

        # 6. Exploration Funnel
        profile_views = conn.execute(
            "SELECT COUNT(DISTINCT session_id) as cnt FROM analytics_events WHERE event_name = 'PROFILE_VIEWED'"
        ).fetchone()
        careers_explored_sessions = len(careers_per_session)
        roadmap_views = conn.execute(
            "SELECT COUNT(DISTINCT session_id) as cnt FROM analytics_events WHERE event_name = 'ROADMAP_OPENED'"
        ).fetchone()

        funnel = {
            "assessment_started": assessments_started,
            "assessment_completed": assessments_completed,
            "profile_viewed": profile_views["cnt"] if profile_views else 0,
            "careers_explored": careers_explored_sessions,
            "roadmap_opened": roadmap_views["cnt"] if roadmap_views else 0,
            "feedback_submitted": total_feedback,
        }

        top_domains = [
            {"domain": d, "count": c}
            for d, c in sorted(domain_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        ]
        top_paths = [
            {"path": p, "count": c}
            for p, c in sorted(path_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        ]

        return ResearchMetricsResponse(
            total_assessments_started=assessments_started,
            total_assessments_completed=assessments_completed,
            assessment_completion_rate=completion_rate,
            total_students_evaluated=total_students,
            total_feedback_submissions=total_feedback,
            feedback_submission_rate=feedback_rate,
            average_profile_clarity=avg_clarity,
            average_career_relevance=avg_relevance,
            average_usefulness=avg_usefulness,
            average_confidence_before=avg_before,
            average_confidence_after=avg_after,
            confidence_improvement=confidence_delta,
            discovery_rate_percent=discovery_pct,
            recommendation_rate_percent=recommend_pct,
            average_careers_explored=avg_careers_explored,
            total_events_tracked=total_events,
            career_exploration_funnel=funnel,
            top_explored_domains=top_domains,
            top_explored_paths=top_paths,
        )
