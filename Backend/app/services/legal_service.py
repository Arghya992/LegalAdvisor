"""Legal Service - orchestrates Supabase RAG and Groq generation."""

import logging

from app.schemas.chat import LegalResponseData
from app.services.ai_service import generate_legal_response
from app.services.rag_service import retrieve_relevant_context

logger = logging.getLogger(__name__)


async def get_legal_response(
    question: str,
    category: str | None = None,
) -> LegalResponseData:
    """Complete legal AI pipeline."""

    if not question or not question.strip():
        raise ValueError("Legal question cannot be empty.")

    cleaned_question = question.strip()
    cleaned_category = (category or "General Law").strip()

    context: str = ""
    try:
        context = await retrieve_relevant_context(
            query=cleaned_question,
            category=cleaned_category,
        )
    except Exception as exc:
        logger.error("[Legal Service] RAG Context Retrieval Error: %s", exc)
        context = "Use standard knowledge of Indian Laws (Bharatiya Nyaya Sanhita - BNS / BNSS 2023)."

    try:
        response_data = await generate_legal_response(
            question=cleaned_question,
            category=cleaned_category,
            context=context,
        )

        if isinstance(response_data, dict):
            return LegalResponseData.model_validate(response_data)

        return response_data

    except Exception as exc:
        logger.error("[Legal Service] Pipeline Error: %s", exc, exc_info=True)
        return LegalResponseData(
            understanding=f"Legal query regarding: {cleaned_question[:80]}...",
            relevantLaw="Bharatiya Nyaya Sanhita, 2023",
            explanation="An unexpected internal issue occurred while fetching full AI response. Please ensure your query is specific.",
            nextSteps=[
                "Re-submit your query with additional details.",
                "Consult a legal expert for formal legal advice."
            ],
            sources=[]
        )