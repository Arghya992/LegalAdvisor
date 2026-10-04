"""Application configuration settings."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # ------------------------------------------------------------------
    # Gemini
    # ------------------------------------------------------------------
    # Kept for backward compatibility with older configuration.
    # Gemini is no longer used by the active RAG pipeline.
    GEMINI_API_KEY: str = ""
    GEMINI_FILE_SEARCH_STORE: str = ""

    # ------------------------------------------------------------------
    # Groq
    # ------------------------------------------------------------------
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "openai/gpt-oss-20b"

    # ------------------------------------------------------------------
    # Supabase
    # ------------------------------------------------------------------
    SUPABASE_URL: str = ""
    SUPABASE_SECRET_KEY: str = ""

    # ------------------------------------------------------------------
    # JWT
    # ------------------------------------------------------------------
    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    # ------------------------------------------------------------------
    # Frontend
    # ------------------------------------------------------------------
    FRONTEND_URL: str = "http://localhost:5173"

    # ------------------------------------------------------------------
    # Environment file
    # ------------------------------------------------------------------
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


def get_settings() -> Settings:
    """Return application configuration loaded from environment variables."""
    return Settings()