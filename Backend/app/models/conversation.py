"""Conversation model helpers."""

from datetime import datetime, timezone
from typing import Any


def new_conversation(user_id: str, title: str, category: str = "general", preview: str = "") -> dict[str, Any]:
    return {
        "user_id": user_id,
        "title": title,
        "category": category,
        "preview": preview or "Start by describing your legal question...",
        "date": "Just now",
        "created_at": datetime.now(timezone.utc),
        "messages": [],
    }
