"""
ASGI entry point alias for environments or configurations targeting 'app.main:app'.
The canonical FastAPI application instance is defined in backend/main.py.
"""
from main import app

__all__ = ["app"]
