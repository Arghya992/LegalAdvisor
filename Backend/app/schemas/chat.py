"""Chat Schemas - definitions for request and response payloads."""

from typing import List, Optional

from pydantic import BaseModel, Field, field_validator


class SendMessageRequest(BaseModel):
    content: str = Field(
        ...,
        description="The user's legal question or situational query.",
    )

    category: Optional[str] = Field(
        default="General Law",
        description="Optional legal category focus.",
    )

    @field_validator("content")
    @classmethod
    def validate_content_not_empty(cls, value: str) -> str:
        cleaned = value.strip()

        if not cleaned:
            raise ValueError(
                "Message content cannot be empty or blank whitespace."
            )

        return cleaned

    @field_validator("category")
    @classmethod
    def normalize_category(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return "General Law"

        cleaned = value.strip()

        return cleaned if cleaned else "General Law"


class LegalSource(BaseModel):
    id: str = Field(
        default="src-1",
        description="Unique source identifier.",
    )

    act: str = Field(
        ...,
        description="Name of the governing legal Act.",
    )

    section: str = Field(
        ...,
        description="Specific statutory section or article.",
    )

    provision: str = Field(
        ...,
        description="Summary of what the legal provision mandates.",
    )

    isDemo: bool = Field(
        default=False,
        description="Flag indicating fallback or mock source data.",
    )


class LegalResponseData(BaseModel):
    understanding: str = Field(
        ...,
        description="1-2 sentence breakdown of the user's situation.",
    )

    relevantLaw: str = Field(
        ...,
        description="Applicable statutory acts, sections, or constitutional laws.",
    )

    explanation: str = Field(
        ...,
        description="Detailed legal guidance, liabilities, and rights.",
    )

    nextSteps: List[str] = Field(
        default_factory=list,
        description="Actionable sequential steps for the user.",
    )

    sources: List[LegalSource] = Field(
        default_factory=list,
        description="List of cited legal sources.",
    )

    @field_validator("nextSteps", "sources", mode="before")
    @classmethod
    def ensure_list_type(cls, value):
        """
        Prevent crashes if the AI model returns None
        instead of an empty list.
        """
        if value is None:
            return []

        return value