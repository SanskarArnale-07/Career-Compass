"""
User data routes: career journey persistence and retrieval.
"""

from __future__ import annotations

import json
import time

from fastapi import APIRouter, Depends, HTTPException, status

from app.database import get_db
from app.models import UserJourneyPayload
from app.security import get_current_user

router = APIRouter(prefix="/api/v1/user", tags=["user"])


@router.get("/journey")
def get_user_journey(current_user: dict = Depends(get_current_user)) -> dict:
    """
    Retrieve the current user's saved career journey data.
    Returns None if no journey has been saved yet.
    """
    user_id = current_user["id"]
    with get_db() as conn:
        row = conn.execute(
            "SELECT journey_data, updated_at FROM user_journeys WHERE user_id = ?",
            (user_id,),
        ).fetchone()

        if not row:
            return {"journey": None, "updated_at": None}

        try:
            journey_data = json.loads(row["journey_data"])
        except Exception:
            journey_data = None

        return {
            "journey": journey_data,
            "updated_at": row["updated_at"],
        }


@router.put("/journey")
def save_user_journey(
    payload: UserJourneyPayload,
    current_user: dict = Depends(get_current_user),
) -> dict:
    """
    Save or merge the current user's career journey data.
    """
    user_id = current_user["id"]
    now = int(time.time())

    try:
        data_str = json.dumps(payload.journey)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": "invalid_json", "message": f"Could not encode journey data: {e}"},
        )

    with get_db() as conn:
        conn.execute(
            """
            INSERT INTO user_journeys (user_id, journey_data, updated_at)
            VALUES (?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
                journey_data = excluded.journey_data,
                updated_at = excluded.updated_at
            """,
            (user_id, data_str, now),
        )

    return {"status": "success", "updated_at": now}
