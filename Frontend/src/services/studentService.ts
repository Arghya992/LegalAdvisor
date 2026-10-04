import type {
  Flashcard,
  QuizQuestion,
  SavedCase,
  StudyMaterial,
  StudyNote,
  StudentTool,
} from '@/types';
import {
  STUDENT_TOOLS,
  STUDY_MATERIALS,
  SAVED_CASES,
  STUDY_NOTES,
  FLASHCARDS,
  QUIZ_QUESTIONS,
} from '@/data/studentData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

function isApiConfigured(): boolean {
  return Boolean(API_BASE_URL);
}

export const studentService = {
  async getTools(): Promise<StudentTool[]> {
    if (isApiConfigured()) {
      const res = await fetch(`${API_BASE_URL}/student/tools`);
      if (!res.ok) throw new Error('Failed to load tools');
      return res.json();
    }
    return Promise.resolve(STUDENT_TOOLS);
  },

  async getStudyMaterials(): Promise<StudyMaterial[]> {
    if (isApiConfigured()) {
      const res = await fetch(`${API_BASE_URL}/student/materials`);
      if (!res.ok) throw new Error('Failed to load materials');
      return res.json();
    }
    return Promise.resolve(STUDY_MATERIALS);
  },

  async getSavedCases(): Promise<SavedCase[]> {
    if (isApiConfigured()) {
      const res = await fetch(`${API_BASE_URL}/student/cases`);
      if (!res.ok) throw new Error('Failed to load cases');
      return res.json();
    }
    return Promise.resolve(SAVED_CASES);
  },

  async getStudyNotes(): Promise<StudyNote[]> {
    if (isApiConfigured()) {
      const res = await fetch(`${API_BASE_URL}/student/notes`);
      if (!res.ok) throw new Error('Failed to load notes');
      return res.json();
    }
    return Promise.resolve(STUDY_NOTES);
  },

  async getFlashcards(): Promise<Flashcard[]> {
    if (isApiConfigured()) {
      const res = await fetch(`${API_BASE_URL}/student/flashcards`);
      if (!res.ok) throw new Error('Failed to load flashcards');
      return res.json();
    }
    return Promise.resolve(FLASHCARDS);
  },

  async getQuizQuestions(): Promise<QuizQuestion[]> {
    if (isApiConfigured()) {
      const res = await fetch(`${API_BASE_URL}/student/quiz`);
      if (!res.ok) throw new Error('Failed to load quiz');
      return res.json();
    }
    return Promise.resolve(QUIZ_QUESTIONS);
  },
};
