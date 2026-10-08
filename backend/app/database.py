"""
SQLite database configuration and initialization for Career Compass.
"""

from __future__ import annotations

import os
import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import Generator

DB_PATH = os.getenv(
    "DATABASE_PATH",
    str(Path(__file__).resolve().parent.parent / "career_compass.db"),
)


def get_connection(db_path: str | None = None) -> sqlite3.Connection:
    """Return a configured SQLite connection."""
    target_path = db_path or DB_PATH
    conn = sqlite3.connect(target_path, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    conn.execute("PRAGMA journal_mode = WAL;")
    return conn


@contextmanager
def get_db(db_path: str | None = None) -> Generator[sqlite3.Connection, None, None]:
    """Context manager for SQLite database transactions."""
    conn = get_connection(db_path)
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db(db_path: str | None = None) -> None:
    """Initialize database tables if they do not exist."""
    with get_db(db_path) as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                password_salt TEXT NOT NULL,
                created_at INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS user_sessions (
                token TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                expires_at INTEGER NOT NULL,
                created_at INTEGER NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS user_journeys (
                user_id TEXT PRIMARY KEY,
                journey_data TEXT NOT NULL,
                updated_at INTEGER NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS student_feedback (
                id TEXT PRIMARY KEY,
                user_id TEXT,
                session_id TEXT NOT NULL,
                submitted_at INTEGER NOT NULL,
                profile_clarity_score INTEGER NOT NULL,
                career_relevance_score INTEGER NOT NULL,
                strengths_understanding_score INTEGER NOT NULL,
                career_exploration_usefulness_score INTEGER NOT NULL,
                confidence_before INTEGER NOT NULL,
                confidence_after INTEGER NOT NULL,
                recommendation_explanation_score INTEGER NOT NULL,
                discovered_new_career INTEGER NOT NULL,
                recommend_to_others INTEGER NOT NULL,
                most_useful TEXT,
                improvement_suggestion TEXT,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
            );

            CREATE TABLE IF NOT EXISTS analytics_events (
                id TEXT PRIMARY KEY,
                event_name TEXT NOT NULL,
                user_id TEXT,
                session_id TEXT NOT NULL,
                timestamp INTEGER NOT NULL,
                properties TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
            );

            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
            CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id);
            CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON user_sessions(expires_at);
            CREATE INDEX IF NOT EXISTS idx_feedback_submitted_at ON student_feedback(submitted_at);
            CREATE INDEX IF NOT EXISTS idx_analytics_event_name ON analytics_events(event_name);
            CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics_events(timestamp);
            """
        )
