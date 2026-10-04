"""Student routes — /api/student.

Frontend expects:
  GET /student/tools       → StudentTool[]
  GET /student/materials   → StudyMaterial[]
  GET /student/cases       → SavedCase[]
  GET /student/notes       → StudyNote[]
  GET /student/flashcards  → Flashcard[]
  GET /student/quiz        → QuizQuestion[]
"""

from fastapi import APIRouter, Depends

from app.api.deps import get_optional_user
from app.schemas.student import (
    Flashcard,
    QuizQuestion,
    SavedCase,
    StudyMaterial,
    StudyNote,
    StudentTool,
)
from app.services import student_service

router = APIRouter()


@router.get("/tools", response_model=list[StudentTool])
async def get_tools(_user: dict | None = Depends(get_optional_user)):
    return [StudentTool(**t) for t in await student_service.get_tools()]


@router.get("/materials", response_model=list[StudyMaterial])
async def get_materials(_user: dict | None = Depends(get_optional_user)):
    return [StudyMaterial(**m) for m in await student_service.get_materials()]


@router.get("/cases", response_model=list[SavedCase])
async def get_cases(_user: dict | None = Depends(get_optional_user)):
    return [SavedCase(**c) for c in await student_service.get_cases()]


@router.get("/notes", response_model=list[StudyNote])
async def get_notes(_user: dict | None = Depends(get_optional_user)):
    return [StudyNote(**n) for n in await student_service.get_notes()]


@router.get("/flashcards", response_model=list[Flashcard])
async def get_flashcards(_user: dict | None = Depends(get_optional_user)):
    return [Flashcard(**f) for f in await student_service.get_flashcards()]


@router.get("/quiz", response_model=list[QuizQuestion])
async def get_quiz(_user: dict | None = Depends(get_optional_user)):
    return [QuizQuestion(**q) for q in await student_service.get_quiz()]
