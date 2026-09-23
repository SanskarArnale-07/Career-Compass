"""
Authentication routes: signup, login, me, and logout.
"""

from __future__ import annotations

import time
import uuid

from fastapi import APIRouter, Depends, HTTPException, status

from app.database import get_db
from app.models import AuthResponse, UserLoginRequest, UserResponse, UserSignupRequest
from app.security import (
    create_session,
    delete_session,
    get_current_user,
    hash_password,
    http_bearer,
    verify_password,
)

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: UserSignupRequest) -> AuthResponse:
    """
    Register a new user account.
    Checks for duplicate emails and securely hashes the password.
    """
    email = payload.email.strip().lower()
    name = payload.name.strip()
    password = payload.password

    with get_db() as conn:
        existing = conn.execute("SELECT id FROM users WHERE email = ?", (email,)).fetchone()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={"error": "email_exists", "message": "An account with this email already exists."},
            )

        user_id = f"usr_{uuid.uuid4().hex[:16]}"
        pwd_hash, pwd_salt = hash_password(password)
        now = int(time.time())

        conn.execute(
            """
            INSERT INTO users (id, name, email, password_hash, password_salt, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (user_id, name, email, pwd_hash, pwd_salt, now),
        )

    # Automatically create session
    token, expires_at = create_session(user_id, remember_me=True)

    return AuthResponse(
        token=token,
        user=UserResponse(
            id=user_id,
            name=name,
            email=email,
            created_at=now,
        ),
        expires_at=expires_at,
    )


@router.post("/login", response_model=AuthResponse)
def login(payload: UserLoginRequest) -> AuthResponse:
    """
    Authenticate user with email and password.
    Returns session token on success.
    """
    email = payload.email.strip().lower()
    password = payload.password

    with get_db() as conn:
        user_row = conn.execute(
            """
            SELECT id, name, email, password_hash, password_salt, created_at
            FROM users
            WHERE email = ?
            """,
            (email,),
        ).fetchone()

        if not user_row or not verify_password(
            password, user_row["password_hash"], user_row["password_salt"]
        ):
            # Generic error to prevent email enumeration
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail={"error": "invalid_credentials", "message": "Invalid email or password."},
            )

        user_id = user_row["id"]
        user_name = user_row["name"]
        user_email = user_row["email"]
        user_created_at = user_row["created_at"]

    token, expires_at = create_session(user_id, remember_me=payload.remember_me)

    return AuthResponse(
        token=token,
        user=UserResponse(
            id=user_id,
            name=user_name,
            email=user_email,
            created_at=user_created_at,
        ),
        expires_at=expires_at,
    )


@router.get("/me", response_model=UserResponse)
def get_me(current_user: dict = Depends(get_current_user)) -> UserResponse:
    """
    Get profile information of the currently authenticated user.
    """
    return UserResponse(
        id=current_user["id"],
        name=current_user["name"],
        email=current_user["email"],
        created_at=current_user["created_at"],
    )


@router.post("/logout")
def logout(
    credentials=Depends(http_bearer),
    current_user: dict = Depends(get_current_user),
) -> dict:
    """
    Invalidate the current session token.
    """
    if credentials and credentials.credentials:
        delete_session(credentials.credentials)
    return {"message": "Successfully logged out."}
