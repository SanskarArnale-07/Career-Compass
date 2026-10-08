"""
Tests for Student Feedback and Analytics tracking routes.
"""

import pytest
from starlette.testclient import TestClient
from main import app
from app.database import get_db, init_db

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_test_db():
    init_db()
    with get_db() as conn:
        conn.execute("DELETE FROM student_feedback")
        conn.execute("DELETE FROM analytics_events")


def test_feedback_submission_and_stats():
    # 1. Initial stats should be empty
    res = client.get("/api/v1/feedback/stats")
    assert res.status_code == 200
    data = res.json()
    assert data["total_responses"] == 0
    assert data["avg_profile_clarity"] is None

    # 2. Submit student feedback
    payload = {
        "session_id": "test-session-101",
        "profile_clarity_score": 5,
        "career_relevance_score": 4,
        "strengths_understanding_score": 5,
        "career_exploration_usefulness_score": 4,
        "confidence_before": 2,
        "confidence_after": 4,
        "recommendation_explanation_score": 5,
        "discovered_new_career": True,
        "recommend_to_others": True,
        "most_useful": "The explanation of why careers fit my traits was very clear.",
        "improvement_suggestion": "Add more details on competitive exams.",
    }
    submit_res = client.post("/api/v1/feedback", json=payload)
    assert submit_res.status_code == 201
    assert submit_res.json()["status"] == "success"
    assert "id" in submit_res.json()

    # 3. Check updated stats
    stats_res = client.get("/api/v1/feedback/stats")
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert stats["total_responses"] == 1
    assert stats["avg_profile_clarity"] == 5.0
    assert stats["confidence_improvement"] == 2.0  # 4 - 2
    assert stats["discovery_rate_percent"] == 100.0


def test_analytics_event_tracking_and_metrics():
    # 1. Track individual event
    event_payload = {
        "event_name": "ASSESSMENT_STARTED",
        "session_id": "test-session-201",
        "properties": {"source": "home_hero"},
    }
    track_res = client.post("/api/v1/analytics/events", json=event_payload)
    assert track_res.status_code == 202

    # 2. Track batch events
    batch_payload = {
        "events": [
            {
                "event_name": "ASSESSMENT_COMPLETED",
                "session_id": "test-session-201",
                "properties": {"duration_seconds": 240},
            },
            {
                "event_name": "PROFILE_VIEWED",
                "session_id": "test-session-201",
                "properties": {"section": "strongest_traits"},
            },
            {
                "event_name": "CAREER_DETAILS_VIEWED",
                "session_id": "test-session-201",
                "properties": {"slug": "software-development", "domain": "engineering-technology"},
            },
            {
                "event_name": "ROADMAP_OPENED",
                "session_id": "test-session-201",
                "properties": {"career": "software-development"},
            },
        ]
    }
    batch_res = client.post("/api/v1/analytics/events", json=batch_payload)
    assert batch_res.status_code == 202
    assert batch_res.json()["count"] == 4

    # 3. Check research metrics
    metrics_res = client.get("/api/v1/analytics/metrics")
    assert metrics_res.status_code == 200
    metrics = metrics_res.json()
    assert metrics["total_assessments_started"] >= 1
    assert metrics["total_assessments_completed"] >= 1
    assert metrics["career_exploration_funnel"]["assessment_started"] >= 1
    assert metrics["career_exploration_funnel"]["assessment_completed"] >= 1
    assert metrics["career_exploration_funnel"]["profile_viewed"] >= 1
    assert metrics["career_exploration_funnel"]["roadmap_opened"] >= 1
