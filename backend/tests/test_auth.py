"""
Unit and integration tests for authentication, user sessions, and journey persistence.
"""

import os
import tempfile
import pytest
from starlette.testclient import TestClient

from app.database import init_db
import app.database as db_module
from main import app


@pytest.fixture(autouse=True)
def setup_test_db(monkeypatch):
    """Create a temporary SQLite database for each test run."""
    with tempfile.NamedTemporaryFile(suffix=".db", delete=False) as tmp:
        test_db_path = tmp.name

    monkeypatch.setattr(db_module, "DB_PATH", test_db_path)
    init_db(test_db_path)

    yield test_db_path

    # Cleanup
    try:
        os.remove(test_db_path)
    except OSError:
        pass


@pytest.fixture
def client():
    return TestClient(app)


def test_signup_success(client):
    response = client.post(
        "/api/v1/auth/signup",
        json={
            "name": "Sarthak Sharma",
            "email": "sarthak@example.com",
            "password": "SecurePassword123!",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert "token" in data
    assert len(data["token"]) > 20
    assert data["user"]["name"] == "Sarthak Sharma"
    assert data["user"]["email"] == "sarthak@example.com"
    assert "id" in data["user"]
    assert data["user"]["id"].startswith("usr_")


def test_signup_duplicate_email(client):
    client.post(
        "/api/v1/auth/signup",
        json={
            "name": "First User",
            "email": "duplicate@example.com",
            "password": "Password123!",
        },
    )
    # Attempt signup again with same email (different case)
    response = client.post(
        "/api/v1/auth/signup",
        json={
            "name": "Second User",
            "email": "DUPLICATE@example.com",
            "password": "Password123!",
        },
    )
    assert response.status_code == 400
    assert "email_exists" in response.json()["detail"]["error"]


def test_signup_validation_errors(client):
    # Short password
    res1 = client.post(
        "/api/v1/auth/signup",
        json={"name": "Valid Name", "email": "valid@example.com", "password": "short"},
    )
    assert res1.status_code == 422

    # Invalid email
    res2 = client.post(
        "/api/v1/auth/signup",
        json={"name": "Valid Name", "email": "not-an-email", "password": "Password123!"},
    )
    assert res2.status_code == 422

    # Empty name
    res3 = client.post(
        "/api/v1/auth/signup",
        json={"name": "   ", "email": "valid@example.com", "password": "Password123!"},
    )
    assert res3.status_code == 422


def test_login_success(client):
    # Register user
    client.post(
        "/api/v1/auth/signup",
        json={
            "name": "Login Tester",
            "email": "tester@example.com",
            "password": "Password123!",
        },
    )

    # Login
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "TESTER@example.com", "password": "Password123!", "remember_me": True},
    )
    assert response.status_code == 200
    data = response.json()
    assert "token" in data
    assert data["user"]["email"] == "tester@example.com"


def test_login_invalid_password(client):
    client.post(
        "/api/v1/auth/signup",
        json={
            "name": "Login Tester",
            "email": "tester2@example.com",
            "password": "Password123!",
        },
    )

    response = client.post(
        "/api/v1/auth/login",
        json={"email": "tester2@example.com", "password": "WrongPassword!"},
    )
    assert response.status_code == 401
    assert "Invalid email or password" in response.json()["detail"]["message"]


def test_login_nonexistent_user(client):
    response = client.post(
        "/api/v1/auth/login",
        json={"email": "doesnotexist@example.com", "password": "Password123!"},
    )
    assert response.status_code == 401


def test_get_me_flow(client):
    # Unauthenticated
    res_unauth = client.get("/api/v1/auth/me")
    assert res_unauth.status_code == 401

    # Signup
    signup_res = client.post(
        "/api/v1/auth/signup",
        json={
            "name": "Me Tester",
            "email": "me@example.com",
            "password": "Password123!",
        },
    )
    token = signup_res.json()["token"]

    # Authenticated get_me
    res_auth = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res_auth.status_code == 200
    assert res_auth.json()["email"] == "me@example.com"
    assert res_auth.json()["name"] == "Me Tester"

    # Logout
    logout_res = client.post(
        "/api/v1/auth/logout",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert logout_res.status_code == 200

    # Token should now be invalid
    res_after_logout = client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res_after_logout.status_code == 401


def test_user_journey_persistence_and_isolation(client):
    # User 1
    u1 = client.post(
        "/api/v1/auth/signup",
        json={"name": "User One", "email": "user1@example.com", "password": "Password123!"},
    ).json()
    t1 = u1["token"]

    # User 2
    u2 = client.post(
        "/api/v1/auth/signup",
        json={"name": "User Two", "email": "user2@example.com", "password": "Password123!"},
    ).json()
    t2 = u2["token"]

    # Initially empty for both
    res1_init = client.get("/api/v1/user/journey", headers={"Authorization": f"Bearer {t1}"})
    assert res1_init.status_code == 200
    assert res1_init.json()["journey"] is None

    # User 1 saves a journey
    u1_journey = {
        "version": 1,
        "selectedCareer": {"slug": "ai-specialist", "title": "AI & ML Specialist"},
        "progress": {"completedPhases": [1, 2], "weeklyPaceHours": 15},
    }
    save_res = client.put(
        "/api/v1/user/journey",
        headers={"Authorization": f"Bearer {t1}"},
        json={"journey": u1_journey},
    )
    assert save_res.status_code == 200

    # User 1 retrieves their journey
    u1_get = client.get("/api/v1/user/journey", headers={"Authorization": f"Bearer {t1}"}).json()
    assert u1_get["journey"]["selectedCareer"]["slug"] == "ai-specialist"
    assert u1_get["journey"]["progress"]["completedPhases"] == [1, 2]

    # User 2 retrieves their journey -> MUST be None, ensuring complete isolation!
    u2_get = client.get("/api/v1/user/journey", headers={"Authorization": f"Bearer {t2}"}).json()
    assert u2_get["journey"] is None


def test_password_not_stored_as_plaintext(client):
    client.post(
        "/api/v1/auth/signup",
        json={"name": "Plaintext Check", "email": "plaintext@example.com", "password": "SuperSecretPassword123"},
    )

    with db_module.get_db() as conn:
        row = conn.execute("SELECT password_hash, password_salt FROM users WHERE email = 'plaintext@example.com'").fetchone()
        assert row is not None
        assert "SuperSecretPassword123" not in row["password_hash"]
        assert len(row["password_hash"]) == 64  # SHA256 hex length
        assert len(row["password_salt"]) == 32  # 16 bytes hex length
