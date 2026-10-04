import { useState, useEffect } from 'react';
import { getIcon } from '@/utils/icons';
import { studentService } from '@/services/studentService';
import type {
  Flashcard,
  QuizQuestion,
  SavedCase,
  StudyMaterial,
  StudyNote,
  StudentTool,
} from '@/types';
import { ArrowRight, RotateCw, Check, X, ChevronRight, Search } from 'lucide-react';

export default function LawStudents() {
  const [tools, setTools] = useState<StudentTool[]>([]);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [savedCases, setSavedCases] = useState<SavedCase[]>([]);
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

  const [activeView, setActiveView] = useState<'dashboard' | 'flashcards' | 'quiz'>('dashboard');
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    studentService.getTools().then(setTools);
    studentService.getStudyMaterials().then(setMaterials);
    studentService.getSavedCases().then(setSavedCases);
    studentService.getStudyNotes().then(setNotes);
    studentService.getFlashcards().then(setFlashcards);
    studentService.getQuizQuestions().then(setQuizQuestions);
  }, []);

  const toggleFlip = (id: string) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleQuizAnswer = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const quizScore = quizSubmitted
    ? quizQuestions.reduce(
        (score, q) => (quizAnswers[q.id] === q.correctIndex ? score + 1 : score),
        0
      )
    : 0;

  const filteredNotes = searchQuery
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : notes;

  if (activeView === 'flashcards') {
    return (
      <div className="pt-14 min-h-screen">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 py-12">
          <button
            onClick={() => setActiveView('dashboard')}
            className="text-sm text-ivory-muted hover:text-bronze-300 mb-8 inline-flex items-center gap-1"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Dashboard
          </button>
          <p className="section-label mb-4">Study Tools</p>
          <h1 className="editorial-heading text-4xl sm:text-5xl mb-4">Flashcards</h1>
          <p className="text-ivory-muted mb-12">Tap a card to flip between term and definition.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {flashcards.map((card) => {
              const isFlipped = flippedCards.has(card.id);
              return (
                <button
                  key={card.id}
                  onClick={() => toggleFlip(card.id)}
                  className="relative h-48 border border-ink-600 bg-ink-800 hover:border-bronze-500/50 transition-colors duration-300 overflow-hidden text-left p-6"
                >
                  <div className={`transition-opacity duration-300 ${isFlipped ? 'opacity-0' : 'opacity-100'}`}>
                    <p className="eyebrow mb-4">{card.category}</p>
                    <h3 className="font-serif text-2xl text-ivory">{card.term}</h3>
                    <p className="text-[10px] uppercase tracking-label text-ivory-muted mt-8">Tap to reveal</p>
                  </div>
                  <div className={`absolute inset-0 p-6 transition-opacity duration-300 ${isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <p className="eyebrow mb-3">Definition</p>
                    <p className="text-sm text-ivory/90 leading-relaxed">{card.definition}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (activeView === 'quiz') {
    return (
      <div className="pt-14 min-h-screen">
        <div className="mx-auto max-w-3xl px-5 sm:px-8 py-12">
          <button
            onClick={() => setActiveView('dashboard')}
            className="text-sm text-ivory-muted hover:text-bronze-300 mb-8 inline-flex items-center gap-1"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to Dashboard
          </button>
          <p className="section-label mb-4">Study Tools</p>
          <h1 className="editorial-heading text-4xl sm:text-5xl mb-4">Quiz Generator</h1>
          <p className="text-ivory-muted mb-12">
            Test your legal knowledge. {quizQuestions.length} questions.
          </p>

          {quizSubmitted && (
            <div className="border border-bronze-500/40 bg-ink-800 p-6 mb-8 text-center">
              <p className="font-serif text-3xl text-bronze-300 mb-2">
                {quizScore} / {quizQuestions.length}
              </p>
              <p className="text-sm text-ivory-muted">
                {quizScore === quizQuestions.length
                  ? 'Excellent work.'
                  : quizScore >= quizQuestions.length / 2
                  ? 'Good effort. Review the explanations below.'
                  : 'Keep studying. Review the material and try again.'}
              </p>
              <button
                onClick={() => {
                  setQuizAnswers({});
                  setQuizSubmitted(false);
                }}
                className="btn-secondary mt-6"
              >
                <RotateCw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          )}

          <div className="space-y-8">
            {quizQuestions.map((q, qIdx) => {
              const userAnswer = quizAnswers[q.id];
              return (
                <div key={q.id} className="border border-ink-600 bg-ink-800 p-6">
                  <p className="text-[11px] uppercase tracking-label text-bronze-400 mb-3">
                    Question {qIdx + 1}
                  </p>
                  <h3 className="font-serif text-lg text-ivory mb-5">{q.question}</h3>
                  <div className="space-y-2">
                    {q.options.map((option, i) => {
                      const isSelected = userAnswer === i;
                      const isCorrect = i === q.correctIndex;
                      const showResult = quizSubmitted;
                      return (
                        <button
                          key={i}
                          onClick={() => handleQuizAnswer(q.id, i)}
                          disabled={quizSubmitted}
                          className={`w-full text-left px-4 py-3 border text-sm transition-colors duration-200 ${
                            showResult && isCorrect
                              ? 'border-bronze-400 bg-bronze-500/10 text-ivory'
                              : showResult && isSelected && !isCorrect
                              ? 'border-red-900/60 bg-red-950/30 text-ivory/70'
                              : isSelected
                              ? 'border-bronze-500 text-ivory'
                              : 'border-ink-500 text-ivory-muted hover:border-bronze-500/40 hover:text-ivory'
                          }`}
                        >
                          <span className="flex items-center justify-between">
                            {option}
                            {showResult && isCorrect && <Check className="w-4 h-4 text-bronze-300" />}
                            {showResult && isSelected && !isCorrect && <X className="w-4 h-4 text-red-400" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {quizSubmitted && (
                    <p className="text-xs text-ivory-muted mt-4 pl-1 leading-relaxed border-l border-ink-500 pl-3">
                      {q.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {!quizSubmitted && (
            <button
              onClick={() => setQuizSubmitted(true)}
              disabled={Object.keys(quizAnswers).length === 0}
              className="btn-primary mt-8 w-full disabled:opacity-30"
            >
              Submit Answers
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-14 min-h-screen">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-12">
        <p className="section-label mb-6">For Law Students</p>
        <h1 className="editorial-heading text-4xl sm:text-5xl md:text-6xl mb-6 text-balance">
          Built for those who study the law.
        </h1>
        <p className="text-lg text-ivory/70 mb-12 max-w-2xl font-light">
          Learn faster. Understand deeper. Revise smarter. A dedicated study
          environment with professional tools for serious legal study.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-2 card-surface p-8">
            <p className="eyebrow mb-4">Welcome</p>
            <h2 className="font-serif text-3xl text-ivory mb-4">
              Your study workspace.
            </h2>
            <p className="text-ivory-muted leading-relaxed mb-6">
              Access case summarizers, provision explainers, flashcards, and quiz
              generators — all designed to help you understand and retain legal
              concepts efficiently.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setActiveView('flashcards')} className="btn-primary text-[12px]">
                Review Flashcards
              </button>
              <button onClick={() => setActiveView('quiz')} className="btn-secondary text-[12px]">
                Take a Quiz
              </button>
            </div>
          </div>

          <div className="card-surface p-8">
            <p className="eyebrow mb-4">Study Progress</p>
            <div className="space-y-5">
              {materials.slice(0, 3).map((m) => (
                <div key={m.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs text-ivory truncate pr-2">{m.title}</p>
                    <span className="text-xs text-bronze-400 flex-shrink-0">{m.progress}%</span>
                  </div>
                  <div className="h-1 bg-ink-600">
                    <div
                      className="h-full bg-bronze-500 transition-all duration-500"
                      style={{ width: `${m.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-12">
          <p className="eyebrow mb-6">Study Tools</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.map((tool) => {
              const Icon = getIcon(tool.icon);
              return (
                <button
                  key={tool.id}
                  onClick={() => {
                    if (tool.id === 'flashcards') setActiveView('flashcards');
                    else if (tool.id === 'quiz') setActiveView('quiz');
                  }}
                  className="card-surface p-6 text-left hover:border-bronze-500/50 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <Icon className="w-6 h-6 text-bronze-400" strokeWidth={1.5} />
                    {tool.status === 'beta' && (
                      <span className="text-[9px] uppercase tracking-label text-ivory-muted border border-ink-500 px-1.5 py-0.5">
                        Beta
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-lg text-ivory mb-2 group-hover:text-bronze-300 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-ivory-muted leading-relaxed">{tool.description}</p>
                  <div className="flex items-center gap-1 mt-4 text-[11px] text-bronze-400 uppercase tracking-label opacity-0 group-hover:opacity-100 transition-opacity">
                    Open <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <div className="card-surface p-8">
            <p className="eyebrow mb-6">Recent Study Materials</p>
            <div className="space-y-4">
              {materials.map((m) => (
                <div key={m.id} className="flex items-center justify-between border-b border-ink-600 pb-4 last:border-0">
                  <div>
                    <p className="text-sm text-ivory">{m.title}</p>
                    <p className="text-[11px] text-ivory-muted mt-0.5 uppercase tracking-label">{m.type} · {m.date}</p>
                  </div>
                  <span className="text-xs text-bronze-400">{m.progress}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card-surface p-8">
            <p className="eyebrow mb-6">Saved Cases</p>
            <div className="space-y-4">
              {savedCases.map((c) => (
                <div key={c.id} className="border-b border-ink-600 pb-4 last:border-0">
                  <div className="flex items-start justify-between mb-1">
                    <p className="text-sm text-ivory">{c.title}</p>
                    {c.isDemo && (
                      <span className="text-[9px] uppercase tracking-label text-bronze-500/80 border border-bronze-500/30 px-1.5 py-0.5 flex-shrink-0 ml-2">
                        Demo
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-ivory-muted">{c.citation} · {c.date}</p>
                  <div className="flex gap-1.5 mt-2">
                    {c.tags.map((tag) => (
                      <span key={tag} className="text-[10px] uppercase tracking-label text-bronze-400 border border-ink-500 px-2 py-0.5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card-surface p-8">
          <div className="flex items-center justify-between mb-6">
            <p className="eyebrow">Study Notes</p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="bg-ink-900 border border-ink-600 pl-9 pr-4 py-2 text-sm text-ivory placeholder:text-ivory-muted focus:outline-none focus:border-bronze-500 transition-colors w-48 sm:w-64"
              />
            </div>
          </div>
          <div className="space-y-4">
            {filteredNotes.length === 0 ? (
              <p className="text-sm text-ivory-muted text-center py-8">No notes found.</p>
            ) : (
              filteredNotes.map((note) => (
                <div key={note.id} className="border-b border-ink-600 pb-4 last:border-0">
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-sm text-ivory">{note.title}</p>
                    <span className="text-[10px] uppercase tracking-label text-bronze-400 border border-ink-500 px-2 py-0.5">
                      {note.category}
                    </span>
                  </div>
                  <p className="text-xs text-ivory-muted leading-relaxed">{note.excerpt}</p>
                  <p className="text-[10px] text-ivory-muted/60 mt-2 uppercase tracking-label">{note.date}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
