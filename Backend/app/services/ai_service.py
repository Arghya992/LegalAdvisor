"""AI Service - Universal Legal AI Assistant with Fallback JSON Protection."""

import asyncio
import json
import logging
import re
from typing import Any

from groq import Groq
from app.core.config import get_settings

logger = logging.getLogger(__name__)


def get_groq_client() -> Groq:
    settings = get_settings()
    api_key = settings.GROQ_API_KEY
    if not api_key:
        raise RuntimeError("GROQ_API_KEY is missing from Backend/.env")
    return Groq(api_key=api_key.strip())


def _sync_generate(question: str, category: str, context: str = "") -> str:
    client = get_groq_client()
    settings = get_settings()
    model = settings.GROQ_MODEL

    # Comprehensive System Prompt covering all legal spectrums in India
    system_prompt = (
        "You are an expert Indian Legal AI Assistant skilled across ALL domains of Indian law, including:\n"
        "1. Criminal Law (Bharatiya Nyaya Sanhita 2023 - BNS, Bharatiya Nagarik Suraksha Sanhita 2023 - BNSS).\n"
        "2. Civil & Property Law (Transfer of Property Act, Civil Procedure Code, Specific Relief Act).\n"
        "3. Labor & Employment Law (Industrial Disputes Act, Payment of Wages Act, Shops & Establishment Act).\n"
        "4. Family & Personal Law (Hindu Marriage Act, Special Marriage Act, Guardianship, Inheritance).\n"
        "5. Commercial, Corporate & Consumer Law (Contract Act, Companies Act, Consumer Protection Act 2019, IT Act).\n"
        "6. Constitutional & Administrative Law.\n\n"
        "LEGAL MANDATES:\n"
        "- For criminal queries, STRICTLY cite BNS 2023 and BNSS 2023 statutory sections. NEVER cite legacy IPC sections.\n"
        "- For civil, labor, property, or corporate queries, cite the exact relevant Indian Acts and statutory remedies.\n"
        "- Provide actionable legal steps, recourse, and procedures.\n\n"
        "OUTPUT REQUIREMENT:\n"
        "You must respond ONLY with a valid JSON object matching this exact structure:\n"
        "{\n"
        '  "understanding": "Clear summary of the legal issue raised by the user.",\n'
        '  "relevantLaw": "Applicable Acts and Sections (e.g., BNS 2023 Section 316, Payment of Wages Act 1936).",\n'
        '  "explanation": "Detailed analysis of legal rights, statutory remedies, procedures, and options.",\n'
        '  "nextSteps": ["Actionable step 1", "Actionable step 2", "Actionable step 3"],\n'
        '  "sources": [\n'
        "    {\n"
        '      "id": "src-1",\n'
        '      "act": "Statute Name",\n'
        '      "section": "Section Number",\n'
        '      "provision": "Key statutory provision detail",\n'
        '      "isDemo": false\n'
        "    }\n"
        "  ]\n"
        "}"
    )

    user_prompt = f"Category: {category}\nQuestion: {question}\nContext: {context if context else 'None'}"

    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.2,
            response_format={"type": "json_object"},
        )
        if response.choices and response.choices[0].message.content:
            return response.choices[0].message.content
    except Exception as err:
        logger.warning("[AI Service] Standard JSON response failed, executing fallback retry: %s", err)
        fallback_resp = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.2,
        )
        if fallback_resp.choices and fallback_resp.choices[0].message.content:
            return fallback_resp.choices[0].message.content

    return ""


def _extract_json_payload(text: str) -> dict[str, Any]:
    cleaned = text.strip()
    if "```" in cleaned:
        cleaned = re.sub(r"```json?\s*", "", cleaned).replace("```", "").strip()

    try:
        return json.loads(cleaned)
    except Exception:
        match = re.search(r"\{.*\}", cleaned, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        raise ValueError("Could not parse JSON payload from response text.")


def _validate_response(data: dict[str, Any], query: str) -> dict[str, Any]:
    understanding = str(data.get("understanding") or f"Legal analysis regarding: {query}")
    relevant_law = str(data.get("relevantLaw") or "Relevant Statutory Provisions")
    explanation = str(data.get("explanation") or "Detailed overview of statutory remedies and rights available.")

    next_steps = data.get("nextSteps")
    if not isinstance(next_steps, list) or not next_steps:
        next_steps = [
            "Review relevant contractual or statutory documents.",
            "Issue a formal legal notice or lodge an official complaint if required.",
            "Consult a legal advocate for formal representation."
        ]
    else:
        next_steps = [str(s).strip() for s in next_steps if str(s).strip()]

    sources = data.get("sources")
    normalized_sources = []
    if isinstance(sources, list):
        for idx, src in enumerate(sources):
            if isinstance(src, dict):
                normalized_sources.append({
                    "id": str(src.get("id", f"src-{idx+1}")),
                    "act": str(src.get("act", "Relevant Indian Statute")),
                    "section": str(src.get("section", "Statutory Provision")),
                    "provision": str(src.get("provision", "Legal Overview")),
                    "isDemo": False
                })

    if not normalized_sources:
        normalized_sources = [{
            "id": "src-1",
            "act": "Indian Statutory Law",
            "section": "Applicable Provision",
            "provision": "General Legal Principles",
            "isDemo": False
        }]

    return {
        "understanding": understanding,
        "relevantLaw": relevant_law,
        "explanation": explanation,
        "nextSteps": next_steps,
        "sources": normalized_sources
    }


async def generate_legal_response(
    question: str, category: str = "General Law", context: str = ""
) -> dict[str, Any]:
    if not question or not question.strip():
        raise ValueError("Legal question cannot be empty.")

    raw_response = await asyncio.to_thread(
        _sync_generate, question.strip(), category, context
    )

    if not raw_response:
        raise RuntimeError("No response returned from LLM service.")

    parsed_data = _extract_json_payload(raw_response)
    return _validate_response(parsed_data, question.strip())