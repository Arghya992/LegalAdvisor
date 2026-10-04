"""Message model helpers."""

from datetime import datetime, timezone
from typing import Any


def new_message(role: str, content: str, response: dict[str, Any] | None = None, category: str | None = None) -> dict[str, Any]:
    msg: dict[str, Any] = {
        "id": f"m{int(datetime.now(timezone.utc).timestamp() * 1000)}",
        "role": role,
        "content": content,
        "timestamp": datetime.now(timezone.utc).strftime("%I:%M %p"),
    }
    if response:
        msg["response"] = response
    if category:
        msg["category"] = category
    return msg
