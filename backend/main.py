from __future__ import annotations

import logging
import os
import time
from collections import defaultdict
from typing import Callable

from fastapi import FastAPI, Request, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.routes.assessment import router as assessment_router

# ── Logging Configuration ────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("career_compass")

app = FastAPI(
    title="Career Compass API",
    version="1.0.0",
    docs_url="/docs" if os.getenv("ENVIRONMENT") != "production" else None,
    redoc_url=None,
)

# ── CORS Configuration ───────────────────────────────────────────────
raw_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000",
)
allowed_origins = [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# ── Rate Limiting (In-Memory Sliding Window) ─────────────────────────
class SlidingWindowRateLimiter:
    def __init__(self):
        # ip -> list of timestamps
        self.requests: dict[str, list[float]] = defaultdict(list)
        # Separate window for scoring endpoint
        self.scoring_requests: dict[str, list[float]] = defaultdict(list)

    def is_allowed(self, ip: str, is_scoring: bool = False) -> tuple[bool, int]:
        now = time.time()
        window_size = 60.0  # 1 minute
        max_requests = 60 if is_scoring else 180

        req_list = self.scoring_requests[ip] if is_scoring else self.requests[ip]

        # Prune expired timestamps
        cutoff = now - window_size
        while req_list and req_list[0] < cutoff:
            req_list.pop(0)

        if len(req_list) >= max_requests:
            retry_after = int(window_size - (now - req_list[0])) + 1
            return False, max(1, retry_after)

        req_list.append(now)
        return True, 0

    def reset(self):
        """Reset rate limiter state (useful in test runs)."""
        self.requests.clear()
        self.scoring_requests.clear()


rate_limiter = SlidingWindowRateLimiter()

# ── Security & Rate Limiting Middleware ──────────────────────────────
MAX_PAYLOAD_BYTES = 64 * 1024  # 64 KB max payload size


@app.middleware("http")
async def security_and_rate_limit_middleware(
    request: Request, call_next: Callable
) -> Response:
    # 1. Check payload size from Content-Length header
    content_length = request.headers.get("content-length")
    if content_length:
        try:
            if int(content_length) > MAX_PAYLOAD_BYTES:
                logger.warning(
                    f"Request payload too large ({content_length} bytes) from {request.client.host if request.client else 'unknown'}"
                )
                return JSONResponse(
                    status_code=status.HTTP_413_CONTENT_TOO_LARGE,
                    content={
                        "error": "payload_too_large",
                        "message": f"Request body exceeds maximum allowed limit of {MAX_PAYLOAD_BYTES // 1024} KB.",
                    },
                )
        except ValueError:
            pass

    # 2. Rate limiting check (bypass if RATE_LIMIT_ENABLED=false for testing)
    if os.getenv("RATE_LIMIT_ENABLED", "true").lower() in ("true", "1", "yes"):
        client_ip = request.client.host if request.client else "127.0.0.1"
        # Forwarded for header support if behind reverse proxy
        forwarded_for = request.headers.get("x-forwarded-for")
        if forwarded_for:
            client_ip = forwarded_for.split(",")[0].strip()

        is_scoring = request.url.path.endswith("/score")
        allowed, retry_after = rate_limiter.is_allowed(client_ip, is_scoring=is_scoring)

        if not allowed:
            logger.warning(f"Rate limit exceeded for IP {client_ip} on {request.url.path}")
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                headers={"Retry-After": str(retry_after)},
                content={
                    "error": "rate_limit_exceeded",
                    "message": "Too many requests. Please wait a moment before trying again.",
                    "retry_after_seconds": retry_after,
                },
            )

    start_time = time.time()
    response = await call_next(request)
    process_time = (time.time() - start_time) * 1000

    # Add security & timing headers
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Process-Time-Ms"] = f"{process_time:.2f}"

    return response


# ── Global Unhandled Exception Handler ───────────────────────────────
@app.exception_handler(Exception)
async def global_unhandled_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.error(
        f"Unhandled exception on {request.method} {request.url.path}: {exc}",
        exc_info=True,
    )
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "internal_server_error",
            "message": "An unexpected error occurred while processing your request.",
        },
    )


# ── Register Routers ─────────────────────────────────────────────────
app.include_router(assessment_router)


# ── Public Endpoints ─────────────────────────────────────────────────
@app.get("/")
def read_root():
    return {"message": "Welcome to Career Compass API"}


@app.get("/api/health")
def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", "8000"))
    reload = os.getenv("ENVIRONMENT", "production").lower() == "development"
    uvicorn.run("main:app", host=host, port=port, reload=reload)
