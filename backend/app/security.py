"""
Authentication security utilities: PBKDF2 password hashing, token generation,
and FastAPI current_user dependency.
"""

from __future__ import annotations

import hashlib
import hmac
import os
import secrets
import time
from typing import Optional

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.database import get_db

# OWASP recommended iterations for PBKDF2-HMAC-SHA256
PBKDF2_ITERATIONS = int(os.getenv("PBKDF2_ITERATIONS", "600000"))
SESSION_EXPIRATION_SECONDS = int(os.getenv("SESSION_EXPIRATION_SECONDS", str(7 * 24 * 3600)))  # 7 days

http_bearer = HTTPBearer(auto_error=False)


def hash_password(password: str) -> tuple[str, str]:
    """
    Hash a password using PBKDF2-HMAC-SHA256 with a unique random salt.
    Returns (hex_hash, hex_salt).
    """
    salt = secrets.token_bytes(16)
    key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, PBKDF2_ITERATIONS)
    return key.hex(), salt.hex()


def verify_password(password: str, expected_hash_hex: str, salt_hex: str) -> bool:
    """
    Verify a password against stored hex hash and hex salt in constant time.
    """
    try:
        salt = bytes.fromhex(salt_hex)
        expected_hash = bytes.fromhex(expected_hash_hex)
        key = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, PBKDF2_ITERATIONS)
        return hmac.compare_digest(key, expected_hash)
    except Exception:
        return False


def generate_session_token() -> str:
    """Generate a secure, cryptographically random session token."""
    return secrets.token_urlsafe(32)


def create_session(user_id: str, remember_me: bool = True) -> tuple[str, int]:
    """
    Create a session token in the database for the given user.
    Returns (token, expires_at_timestamp).
    """
    token = generate_session_token()
    now = int(time.time())
    # 30 days if remember_me, else 1 day
    duration = 30 * 24 * 3600 if remember_me else 24 * 3600
    expires_at = now + duration

    with get_db() as conn:
        conn.execute(
            """
            INSERT INTO user_sessions (token, user_id, expires_at, created_at)
            VALUES (?, ?, ?, ?)
            """,
            (token, user_id, expires_at, now),
        )

    return token, expires_at


def delete_session(token: str) -> None:
    """Invalidate a session token."""
    with get_db() as conn:
        conn.execute("DELETE FROM user_sessions WHERE token = ?", (token,))


def get_user_from_token(token: str) -> Optional[dict]:
    """
    Look up user by active session token.
    Returns user dict if valid and not expired, else None.
    """
    now = int(time.time())
    with get_db() as conn:
        row = conn.execute(
            """
            SELECT u.id, u.name, u.email, u.created_at
            FROM user_sessions s
            JOIN users u ON s.user_id = u.id
            WHERE s.token = ? AND s.expires_at > ?
            """,
            (token, now),
        ).fetchone()

        if row:
            return {
                "id": row["id"],
                "name": row["name"],
                "email": row["email"],
                "created_at": row["created_at"],
            }
    return None


async def get_current_user(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(http_bearer),
) -> dict:
    """
    FastAPI dependency that returns the current authenticated user.
    Extracts token from Authorization header (Bearer) or session cookie.
    Raises 401 if unauthenticated or token expired.
    """
    token: Optional[str] = None
    if credentials and credentials.credentials:
        token = credentials.credentials
    else:
        # Check standard Authorization header fallback
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ", 1)[1].strip()
        elif "session_token" in request.cookies:
            token = request.cookies.get("session_token")

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": "unauthorized", "message": "Authentication required."},
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = get_user_from_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": "invalid_or_expired_token", "message": "Invalid or expired session."},
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user
