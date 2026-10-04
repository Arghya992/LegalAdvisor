"""Legal RAG service using Supabase PostgreSQL Full-Text Search."""

import logging

from app.db.database import get_db

logger = logging.getLogger(__name__)


async def retrieve_relevant_context(
    query: str,
    category: str | None = None,
) -> str | None:
    """
    Retrieve relevant Indian legal information from
    the Supabase PostgreSQL database using Full-Text Search.
    """

    cleaned_query = query.strip()

    if not cleaned_query:
        raise ValueError("RAG query cannot be empty.")

    # Convert a natural-language question into a simpler
    # FTS-friendly search query.
    stop_words = {
        "what",
        "is",
        "the",
        "a",
        "an",
        "of",
        "for",
        "under",
        "in",
        "on",
        "to",
        "and",
        "does",
        "do",
        "can",
        "how",
        "what's",
        "are",
        "was",
        "were",
        "who",
        "which",
        "why",
        "when",
        "indian",
        "law",
        "legal",
    }

    search_terms = [
        word.strip(".,?!;:()[]{}\"'")
        for word in cleaned_query.split()
        if word.strip(".,?!;:()[]{}\"'").lower() not in stop_words
    ]

    search_query = " ".join(
        word for word in search_terms if word
    )

    # Fallback in case every word was filtered out.
    if not search_query:
        search_query = cleaned_query

    logger.info(
        "[RAG Service] Search query: %s",
        search_query,
    )

    try:
        client = get_db()

        logger.info(
            "[RAG Service] Starting Supabase FTS..."
        )

        from app.db.database import _run_supabase_query

        def _execute_rpc():
            return client.rpc(
                "match_legal_chunks",
                {
                    "search_query": search_query,
                    "match_count": 5,
                },
            ).execute()

        response = await _run_supabase_query(_execute_rpc)

        data = response.data

        if not data:
            logger.warning(
                "[RAG Service] Supabase FTS returned no results."
            )
            return None

        text_parts: list[str] = []

        for row in data:
            act = row.get("act", "")
            section = row.get("section", "")
            title = row.get("title", "")
            content = row.get("content", "")

            chunk_text = (
                f"Source: {act} - {section} ({title})\n"
                f"{content}"
            ).strip()

            if chunk_text:
                text_parts.append(chunk_text)

        if not text_parts:
            logger.warning(
                "[RAG Service] Supabase FTS returned no usable text."
            )
            return None

        legal_context = "\n\n---\n\n".join(
            text_parts
        ).strip()

        logger.info(
            "[RAG Service] Supabase FTS retrieval successful. "
            "Context length: %d characters.",
            len(legal_context),
        )

        return legal_context

    except Exception as exc:
        logger.error(
            "[RAG Service] Supabase FTS failed: %s",
            exc,
            exc_info=True,
        )

        raise RuntimeError(
            f"Supabase RAG retrieval failed: {exc}"
        ) from exc