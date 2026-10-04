"""MongoDB document models (for reference / seed data)."""

from datetime import datetime, timezone
from typing import Any


def user_doc(email: str, name: str, hashed_password: str) -> dict[str, Any]:
    return {
        "email": email,
        "name": name,
        "hashed_password": hashed_password,
        "created_at": datetime.now(timezone.utc),
    }


def conversation_doc(user_id: str, title: str, category: str, preview: str) -> dict[str, Any]:
    return {
        "user_id": user_id,
        "title": title,
        "category": category,
        "preview": preview,
        "date": "Just now",
        "created_at": datetime.now(timezone.utc),
        "messages": [],
    }


def message_doc(role: str, content: str, response: dict[str, Any] | None = None) -> dict[str, Any]:
    return {
        "id": f"m{int(datetime.now(timezone.utc).timestamp() * 1000)}",
        "role": role,
        "content": content,
        "response": response,
        "timestamp": datetime.now(timezone.utc).strftime("%I:%M %p"),
    }


def legal_resource_doc(
    rid: str,
    title: str,
    category: str,
    rtype: str,
    description: str,
    is_demo: bool = True,
    metadata: dict[str, Any] | None = None,
) -> dict[str, Any]:
    return {
        "id": rid,
        "title": title,
        "category": category,
        "type": rtype,
        "description": description,
        "isDemo": is_demo,
        "metadata": metadata or {},
    }
