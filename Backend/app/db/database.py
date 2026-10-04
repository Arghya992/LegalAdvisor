"""Supabase database connection management."""

import logging

from supabase import Client, create_client

from app.core.config import get_settings

logger = logging.getLogger(__name__)

settings = get_settings()

_supabase: Client | None = None


async def connect_database() -> None:
    """Initialize the Supabase client on FastAPI startup."""
    global _supabase

    if _supabase is not None:
        return

    if not settings.SUPABASE_URL:
        raise RuntimeError("SUPABASE_URL is not configured.")

    if not settings.SUPABASE_SECRET_KEY:
        raise RuntimeError("SUPABASE_SECRET_KEY is not configured.")

    _supabase = create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_SECRET_KEY,
    )

    logger.info("Supabase client initialized.")


async def close_database() -> None:
    """Clear the Supabase client on FastAPI shutdown."""
    global _supabase

    _supabase = None

    logger.info("Supabase client closed.")


def get_db() -> Client:
    """
    Return the Supabase client.

    Lazy initialization is kept as a fallback in case the startup
    event has not initialized the client yet.
    """
    global _supabase

    if _supabase is None:
        if not settings.SUPABASE_URL:
            raise RuntimeError("SUPABASE_URL is not configured.")

        if not settings.SUPABASE_SECRET_KEY:
            raise RuntimeError("SUPABASE_SECRET_KEY is not configured.")

        _supabase = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SECRET_KEY,
        )

    return _supabase


async def ping_database() -> bool:
    """Check whether Supabase is reachable."""
    try:
        client = get_db()

        # Lightweight query against the users table.
        await _run_supabase_query(
            lambda: client.table("users")
            .select("id")
            .limit(1)
            .execute()
        )

        return True

    except Exception as exc:
        logger.error("Supabase ping failed: %s", exc)
        return False


async def _run_supabase_query(operation):
    """
    Run the synchronous Supabase Python client in a worker thread.

    This prevents synchronous Supabase calls from blocking
    FastAPI's async event loop.
    """
    import asyncio

    return await asyncio.to_thread(operation)