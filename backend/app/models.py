"""
Pydantic request/response models for the Career Compass scoring API.
"""

from __future__ import annotations

from pydantic import BaseModel, Field, field_validator


# ── Request ──────────────────────────────────────────────────────────

class AssessmentRequest(BaseModel):
    """
    Payload sent from the frontend after a student completes the 20-question
    assessment. Keys are question IDs (q1 … q20), values are the selected
    option text exactly as stored in sessionStorage.
    """
    answers: dict[str, str] = Field(
        ...,
        description="Map of question ID (q1-q20) to selected option text.",
        min_length=1,
    )

    @field_validator("answers")
    @classmethod
    def validate_answers_payload(cls, v: dict[str, str]) -> dict[str, str]:
        if len(v) > 30:
            raise ValueError(f"Too many answers submitted: expected at most 30, got {len(v)}.")
        for key, val in v.items():
            if not isinstance(key, str) or len(key.strip()) == 0 or len(key) > 20:
                raise ValueError(f"Invalid question ID format: {key!r}")
            if not isinstance(val, str) or len(val.strip()) == 0 or len(val) > 500:
                raise ValueError(f"Answer for {key} must be a non-empty string under 500 characters.")
        return v


# ── Trait Profile ────────────────────────────────────────────────────

class TraitProfile(BaseModel):
    """Raw and normalised (0-100) scores for each of the 8 dimensions."""
    AN: float = Field(0, description="Analytical")
    TE: float = Field(0, description="Technical")
    SC: float = Field(0, description="Scientific")
    BU: float = Field(0, description="Business")
    CR: float = Field(0, description="Creative")
    SO: float = Field(0, description="Social")
    LE: float = Field(0, description="Leadership")
    EX: float = Field(0, description="Exploration")


# ── Stream Scores ────────────────────────────────────────────────────

class StreamScores(BaseModel):
    """Normalised percentage suitability for each academic stream."""
    science: float = Field(..., ge=0, le=100)
    commerce: float = Field(..., ge=0, le=100)
    arts: float = Field(..., ge=0, le=100)


class StreamResult(BaseModel):
    """Stream scores plus human-readable recommendation text."""
    scores: StreamScores
    recommendation: str = Field(
        ...,
        description="Soft, non-prescriptive recommendation text.",
    )
    descriptions: dict[str, str] = Field(
        default_factory=dict,
        description="Per-stream description text for the UI.",
    )


# ── Career Match ─────────────────────────────────────────────────────

class CareerMatch(BaseModel):
    """A single career cluster recommendation."""
    career_name: str
    match_percentage: float = Field(..., ge=0, le=100)
    top_traits: list[str] = Field(
        ...,
        description="2-3 strongest matching trait codes.",
    )
    explanation: str
    skill_gaps: list[str]
    next_steps: list[str]


# ── Full Response ────────────────────────────────────────────────────

class AssessmentResponse(BaseModel):
    """Complete scoring result returned to the frontend."""
    trait_profile: TraitProfile
    streams: StreamResult
    top_careers: list[CareerMatch] = Field(
        ...,
        max_length=5,
        description="Top 5 career cluster matches.",
    )


# ── Authentication Models ────────────────────────────────────────────

class UserSignupRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, description="User's full name.")
    email: str = Field(..., min_length=3, max_length=255, description="User's email address.")
    password: str = Field(..., min_length=8, max_length=128, description="User's password (min 8 characters).")

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        trimmed = v.strip()
        if not trimmed:
            raise ValueError("Name cannot be empty.")
        return trimmed

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        trimmed = v.strip().lower()
        if "@" not in trimmed or "." not in trimmed.split("@")[-1]:
            raise ValueError("Invalid email address format.")
        return trimmed


class UserLoginRequest(BaseModel):
    email: str = Field(..., min_length=3, max_length=255, description="User's email address.")
    password: str = Field(..., min_length=1, max_length=128, description="User's password.")
    remember_me: bool = Field(default=True, description="Extend session duration.")

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        return v.strip().lower()


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    created_at: int


class AuthResponse(BaseModel):
    token: str
    user: UserResponse
    expires_at: int


class UserJourneyPayload(BaseModel):
    journey: dict = Field(..., description="Complete or partial journey data.")

