"""API router aggregation — registers all sub-routers under /api."""

from fastapi import APIRouter
from app.api.routes import auth, chat, health, resources, students

api_router = APIRouter()

# Register sub-routes
api_router.include_router(health.router, prefix="/health", tags=["Health"])
api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(chat.router, prefix="/consultations", tags=["Consultations"])
api_router.include_router(resources.router, prefix="/resources", tags=["Resources"])
api_router.include_router(students.router, prefix="/student", tags=["Students"])