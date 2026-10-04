"""Student schemas matching the frontend types."""

from pydantic import BaseModel


class StudentTool(BaseModel):
    id: str
    name: str
    description: str
    icon: str
    status: str = "available"


class Flashcard(BaseModel):
    id: str
    term: str
    definition: str
    category: str


class QuizQuestion(BaseModel):
    id: str
    question: str
    options: list[str]
    correctIndex: int
    explanation: str


class StudyMaterial(BaseModel):
    id: str
    title: str
    type: str
    progress: int
    date: str


class SavedCase(BaseModel):
    id: str
    title: str
    citation: str
    date: str
    tags: list[str]
    isDemo: bool = True


class StudyNote(BaseModel):
    id: str
    title: str
    excerpt: str
    category: str
    date: str
