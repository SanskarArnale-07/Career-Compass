"""
Pydantic request/response models for the Career Compass scoring API.
"""

from __future__ import annotations

from pydantic import BaseModel, Field


# ── Request ──────────────────────────────────────────────────────────

class AssessmentRequest(BaseModel):
    """
    Payload sent from the frontend after a student completes the 20-question
    assessment.  Keys are question IDs (q1 … q20), values are the selected
    option text exactly as stored in sessionStorage.
    """
    answers: dict[str, str] = Field(
        ...,
        description="Map of question ID (q1-q20) to selected option text.",
        min_length=1,
    )


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
