"""
Unit and integration tests for production hardening in backend/main.py.

Tests:
- Health check endpoint schema & response
- Root endpoint
- Security response headers (X-Frame-Options, X-Content-Type-Options)
- Max payload size enforcement (HTTP 413)
- Sliding window rate limiting enforcement (HTTP 429)
- Input validation: answer key/value limits (HTTP 422)
"""

from fastapi.testclient import TestClient
import pytest

from main import app, rate_limiter
from app.scoring.traits import QUESTION_OPTIONS, REQUIRED_QUESTION_IDS


@pytest.fixture(autouse=True)
def reset_limiter():
    rate_limiter.reset()
    yield
    rate_limiter.reset()


client = TestClient(app)


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data == {"status": "healthy"}


def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data == {"message": "Welcome to Career Compass API"}


def test_security_headers():
    response = client.get("/api/health")
    assert response.headers.get("X-Content-Type-Options") == "nosniff"
    assert response.headers.get("X-Frame-Options") == "DENY"
    assert "X-Process-Time-Ms" in response.headers


def test_cors_preflight():
    response = client.options(
        "/api/v1/assessment/score",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "Content-Type",
        },
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"


def test_oversized_payload_rejected():
    large_answers = {"q1": "A" * 70000}
    response = client.post(
        "/api/v1/assessment/score",
        json={"answers": large_answers},
        headers={"Content-Length": "75000"},
    )
    assert response.status_code == 413
    data = response.json()
    assert data["error"] == "payload_too_large"


def test_excessive_answers_dictionary_rejected():
    # Attempting to submit more than 30 answers
    excessive_answers = {f"q{i}": "Some answer" for i in range(1, 35)}
    response = client.post(
        "/api/v1/assessment/score",
        json={"answers": excessive_answers},
    )
    assert response.status_code == 422


def test_empty_answers_rejected():
    response = client.post(
        "/api/v1/assessment/score",
        json={"answers": {}},
    )
    assert response.status_code == 422


def test_rate_limiting_enforcement():
    valid_answers = {qid: list(opts.keys())[0] for qid, opts in QUESTION_OPTIONS.items()}

    # Exhaust the 60 requests scoring limit
    for _ in range(60):
        res = client.post("/api/v1/assessment/score", json={"answers": valid_answers})
        assert res.status_code == 200

    # The 61st request must trigger 429 Too Many Requests
    blocked = client.post("/api/v1/assessment/score", json={"answers": valid_answers})
    assert blocked.status_code == 429
    assert blocked.headers.get("Retry-After") is not None
    data = blocked.json()
    assert data["error"] == "rate_limit_exceeded"
