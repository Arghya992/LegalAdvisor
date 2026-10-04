"""FastAPI Application Main Entry Point."""

import logging
import os
import traceback
from contextlib import asynccontextmanager
from pathlib import Path
from dotenv import load_dotenv
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Explicitly resolve and load .env relative to Backend root directory
BASE_DIR = Path(__file__).resolve().parent.parent
env_path = BASE_DIR / ".env"
load_dotenv(dotenv_path=env_path)

from app.api.router import api_router
from app.core.config import get_settings
from app.db.database import close_database, connect_database
from app.api.routes.chat import limiter  # Importing rate limiter instance

settings = get_settings()
IS_PRODUCTION = os.getenv("ENV", "development").lower() == "production"


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage database connection lifecycle across application startup and shutdown."""
    logger.info("Initializing application resources...")
    await connect_database()
    yield
    logger.info("Shutting down application resources...")
    await close_database()


app = FastAPI(
    title="LegalAdvisor API",
    description="Backend service for Legal AI Assistant (BNS 2023 / BNSS 2023)",
    version="1.0.0",
    lifespan=lifespan,
    debug=not IS_PRODUCTION,
)

# Attach rate limiter state and exception handler to FastAPI app
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Secure exception handler that hides raw tracebacks in production."""
    tb_str = "".join(traceback.format_exception(type(exc), exc, exc.__traceback__))
    logger.error("Unhandled Exception: %s\n%s", exc, tb_str)

    if IS_PRODUCTION:
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "status": "error",
                "detail": "An internal server error occurred.",
            },
        )

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error_type": type(exc).__name__,
            "detail": str(exc),
            "traceback": tb_str.splitlines(),
        },
    )


# CORS Configuration allowing all Vercel domains and local dev environments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount central API router under /api
app.include_router(api_router, prefix="/api")


@app.get("/", tags=["Health Check"])
async def root():
    """Health check endpoint at root."""
    return {
        "status": "ok",
        "service": "LegalAdvisor API",
        "environment": os.getenv("ENV", "development"),
    }