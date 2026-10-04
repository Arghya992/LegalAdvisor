"""Consultation chat endpoints backed by the existing repository layer with rate limiting."""

import logging
import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, status
from pydantic import BaseModel, Field
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.api.deps import get_current_user_id
from app.db.repositories import (
    add_message_to_conversation,
    create_conversation,
    get_conversation_by_id,
    get_conversations_by_user,
)
from app.schemas.chat import LegalResponseData, SendMessageRequest
from app.services.legal_service import get_legal_response

router = APIRouter(tags=["Consultations"])

logger = logging.getLogger(__name__)

# Initialize rate limiter using client IP
limiter = Limiter(key_func=get_remote_address)


class ConsultationInitResponse(BaseModel):
    id: str = Field(
        ...,
        description="Unique consultation session ID."
    )
    status: str = Field(
        default="active",
        description="Status of the initialized session."
    )


class ConsultationCreateRequest(BaseModel):
    category: str | None = Field(
        default="General Law",
        description="Optional legal category for the consultation.",
    )


def _utcnow() -> str:
    return datetime.now(timezone.utc).isoformat()


def _message_id() -> str:
    return str(uuid.uuid4())


def _validate_uuid(id_str: str, param_name: str = "consultation_id") -> None:
    try:
        uuid.UUID(id_str)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid {param_name} format: '{id_str}'. Must be a valid UUID.",
        )


def _serialize_response(response_data: LegalResponseData) -> dict:
    return response_data.model_dump(mode="json")


@router.post(
    "",
    response_model=ConsultationInitResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Initialize Consultation Session",
)
async def create_consultation(
    req: ConsultationCreateRequest | None = None,
    user_id: str = Depends(get_current_user_id),
):
    """Create a persisted consultation for the authenticated user."""

    category = (req.category if req else None) or "General Law"

    conversation = await create_conversation(
        user_id=user_id,
        title="Legal Consultation",
        category=category,
        preview="",
    )

    consultation_id = str(conversation["id"])

    logger.info(
        "Consultation created: [%s] for user [%s]",
        consultation_id,
        user_id,
    )

    return ConsultationInitResponse(
        id=consultation_id,
        status="active",
    )


@router.get(
    "",
    status_code=status.HTTP_200_OK,
    summary="Get All Consultations",
)
async def get_consultations(
    user_id: str = Depends(get_current_user_id),
):
    """Return consultations owned by the authenticated user."""

    conversations = await get_conversations_by_user(user_id)

    return [
        {
            "id": str(conversation.get("id", "")),
            "title": conversation.get("title") or "Legal Consultation",
            "category": conversation.get("category") or "General Law",
            "preview": conversation.get("preview") or "",
            "date": conversation.get("date") or "Just now",
            "messages": conversation.get("messages") or [],
        }
        for conversation in conversations
    ]


@router.get(
    "/{consultation_id}/messages",
    status_code=status.HTTP_200_OK,
    summary="Get Consultation Message History",
)
async def get_consultation_messages(
    consultation_id: str,
    user_id: str = Depends(get_current_user_id),
):
    """Return chat history for a consultation owned by the current user."""
    _validate_uuid(consultation_id)

    conversation = await get_conversation_by_id(consultation_id, user_id)

    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consultation not found.",
        )

    return conversation.get("messages") or []


@router.post(
    "/{consultation_id}/messages",
    response_model=LegalResponseData,
    status_code=status.HTTP_200_OK,
    summary="Send Legal Message",
)
@limiter.limit("10/minute")  # Limits requests per IP address
async def send_message(
    request: Request,
    consultation_id: str,
    req: SendMessageRequest,
    user_id: str = Depends(get_current_user_id),
):
    """Process a legal question for a consultation with rate-limit protection."""
    _validate_uuid(consultation_id)

    conversation = await get_conversation_by_id(consultation_id, user_id)

    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consultation not found.",
        )

    user_msg = {
        "id": _message_id(),
        "timestamp": _utcnow(),
        "role": "user",
        "content": req.content,
        "category": req.category,
    }

    stored_user = await add_message_to_conversation(
        conversation_id=consultation_id,
        user_id=user_id,
        message=user_msg,
    )

    if not stored_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Consultation not found.",
        )

    logger.info(
        "Processing legal question for consultation [%s]",
        consultation_id,
    )

    try:
        response_data = await get_legal_response(
            question=req.content,
            category=req.category,
        )

        assistant_payload = _serialize_response(response_data)

        ai_msg = {
            "id": _message_id(),
            "timestamp": _utcnow(),
            "role": "assistant",
            "content": response_data.understanding,
            "response": assistant_payload,
        }

        stored_ai = await add_message_to_conversation(
            conversation_id=consultation_id,
            user_id=user_id,
            message=ai_msg,
        )

        if not stored_ai:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Consultation not found.",
            )

        logger.info(
            "Legal response generated successfully for consultation [%s]",
            consultation_id,
        )

        return response_data

    except HTTPException:
        raise
    except Exception as exc:
        logger.error(
            "Legal processing failed for consultation [%s]: %s",
            consultation_id,
            exc,
            exc_info=True,
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Legal processing failure: {str(exc)}",
        )