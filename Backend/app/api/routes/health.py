"""Health check endpoint."""

from fastapi import APIRouter

from app.db.database import ping_database

router = APIRouter()


@router.get("")
@router.get("/")
async def health_check():
    """Returns service status and MongoDB connectivity."""
    db_ok = await ping_database()
    return {
        "status": "ok" if db_ok else "degraded",
        "service": "AI Legal Advisor API",
        "database": "connected" if db_ok else "disconnected",
    }
