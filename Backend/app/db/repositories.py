"""Repository layer wrapping Supabase/PostgreSQL tables."""

import asyncio
from datetime import datetime, timezone
from typing import Any, Callable

from app.db.database import get_db


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

async def _execute(operation: Callable):
    """
    Execute a synchronous Supabase operation without blocking
    FastAPI's async event loop.
    """
    return await asyncio.to_thread(operation)


def _rows(response: Any) -> list[dict[str, Any]]:
    """Safely extract rows from a Supabase response."""
    if not response or response.data is None:
        return []

    return response.data


def _row(response: Any) -> dict[str, Any] | None:
    """Safely extract the first row from a Supabase response."""
    rows = _rows(response)
    return rows[0] if rows else None


# ---------------------------------------------------------------------------
# Users
# ---------------------------------------------------------------------------

async def get_user_by_email(email: str) -> dict[str, Any] | None:
    client = get_db()

    response = await _execute(
        lambda: client
        .table("users")
        .select("*")
        .eq("email", email)
        .limit(1)
        .execute()
    )

    return _row(response)


async def get_user_by_id(user_id: str) -> dict[str, Any] | None:
    client = get_db()

    response = await _execute(
        lambda: client
        .table("users")
        .select("*")
        .eq("id", user_id)
        .limit(1)
        .execute()
    )

    return _row(response)


async def create_user(
    email: str,
    name: str,
    hashed_password: str,
) -> dict[str, Any]:

    client = get_db()

    doc = {
        "email": email,
        "name": name,
        "hashed_password": hashed_password,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    response = await _execute(
        lambda: client
        .table("users")
        .insert(doc)
        .execute()
    )

    created = _row(response)

    if not created:
        raise RuntimeError("Failed to create user.")

    return created


# ---------------------------------------------------------------------------
# Conversations
# ---------------------------------------------------------------------------

async def get_conversations_by_user(
    user_id: str,
) -> list[dict[str, Any]]:

    client = get_db()

    response = await _execute(
        lambda: client
        .table("conversations")
        .select("*")
        .eq("user_id", user_id)
        .order("updated_at", desc=True)
        .execute()
    )

    return _rows(response)


async def get_conversation_by_id(
    conversation_id: str,
    user_id: str,
) -> dict[str, Any] | None:

    client = get_db()

    response = await _execute(
        lambda: client
        .table("conversations")
        .select("*")
        .eq("id", conversation_id)
        .eq("user_id", user_id)
        .limit(1)
        .execute()
    )

    return _row(response)


async def create_conversation(
    user_id: str,
    title: str,
    category: str,
    preview: str,
) -> dict[str, Any]:

    client = get_db()

    now = datetime.now(timezone.utc).isoformat()

    doc = {
        "user_id": user_id,
        "title": title,
        "category": category,
        "preview": preview,
        "date": "Just now",
        "created_at": now,
        "updated_at": now,
        "messages": [],
    }

    response = await _execute(
        lambda: client
        .table("conversations")
        .insert(doc)
        .execute()
    )

    created = _row(response)

    if not created:
        raise RuntimeError("Failed to create conversation.")

    return created


async def add_message_to_conversation(
    conversation_id: str,
    user_id: str,
    message: dict[str, Any],
) -> bool:
    """
    Append a message to a conversation.

    The user_id is always included in the query to enforce
    user-level data isolation.
    """

    client = get_db()

    # First retrieve the existing conversation.
    response = await _execute(
        lambda: client
        .table("conversations")
        .select("messages")
        .eq("id", conversation_id)
        .eq("user_id", user_id)
        .limit(1)
        .execute()
    )

    conversation = _row(response)

    if not conversation:
        return False

    messages = conversation.get("messages") or []

    if not isinstance(messages, list):
        messages = []

    messages.append(message)

    now = datetime.now(timezone.utc).isoformat()

    update_fields: dict[str, Any] = {
        "messages": messages,
        "updated_at": now,
        "preview": message.get("content", "")[:80],
    }

    # Only change title for a user message.
    if message.get("role") == "user":
        update_fields["title"] = message.get("content", "")[:50]

    update_response = await _execute(
        lambda: client
        .table("conversations")
        .update(update_fields)
        .eq("id", conversation_id)
        .eq("user_id", user_id)
        .execute()
    )

    return bool(_rows(update_response))


# ---------------------------------------------------------------------------
# Legal Resources
# ---------------------------------------------------------------------------

async def get_resources(
    category: str | None = None,
    search: str | None = None,
) -> list[dict[str, Any]]:

    client = get_db()

    query = (
        client
        .table("legal_resources")
        .select("*")
    )

    if category and category != "all":
        query = query.eq("category", category)

    if search:
        # Supabase/PostgreSQL text search.
        query = query.or_(
            f"title.ilike.%{search}%,"
            f"description.ilike.%{search}%"
        )

    response = await _execute(
        lambda: query.execute()
    )

    return _rows(response)


async def get_resource_by_id(
    resource_id: str,
) -> dict[str, Any] | None:

    client = get_db()

    response = await _execute(
        lambda: client
        .table("legal_resources")
        .select("*")
        .eq("id", resource_id)
        .limit(1)
        .execute()
    )

    return _row(response)


async def seed_resources_if_empty(
    resources: list[dict[str, Any]],
) -> None:

    client = get_db()

    response = await _execute(
        lambda: client
        .table("legal_resources")
        .select("id")
        .limit(1)
        .execute()
    )

    if not _rows(response) and resources:
        await _execute(
            lambda: client
            .table("legal_resources")
            .insert(resources)
            .execute()
        )


# ---------------------------------------------------------------------------
# Student Tools
# ---------------------------------------------------------------------------

async def get_student_tools() -> list[dict[str, Any]]:
    client = get_db()

    response = await _execute(
        lambda: client
        .table("student_tools")
        .select("*")
        .execute()
    )

    return _rows(response)


async def get_study_materials() -> list[dict[str, Any]]:
    client = get_db()

    response = await _execute(
        lambda: client
        .table("study_materials")
        .select("*")
        .execute()
    )

    return _rows(response)


async def get_saved_cases() -> list[dict[str, Any]]:
    client = get_db()

    response = await _execute(
        lambda: client
        .table("saved_cases")
        .select("*")
        .execute()
    )

    return _rows(response)


async def get_study_notes() -> list[dict[str, Any]]:
    client = get_db()

    response = await _execute(
        lambda: client
        .table("study_notes")
        .select("*")
        .execute()
    )

    return _rows(response)


async def get_flashcards() -> list[dict[str, Any]]:
    client = get_db()

    response = await _execute(
        lambda: client
        .table("flashcards")
        .select("*")
        .execute()
    )

    return _rows(response)


async def get_quiz_questions() -> list[dict[str, Any]]:
    client = get_db()

    response = await _execute(
        lambda: client
        .table("quiz_questions")
        .select("*")
        .execute()
    )

    return _rows(response)