import type {
  Flashcard,
  QuizQuestion,
  SavedCase,
  StudyMaterial,
  StudyNote,
  StudentTool,
} from '@/types';

export const STUDENT_TOOLS: StudentTool[] = [
  { id: 'summarizer', name: 'Case Summarizer', description: 'Summarize lengthy judgments into key points and holdings.', icon: 'FileText', status: 'available' },
  { id: 'explainer', name: 'Provision Explainer', description: 'Break down statutory provisions into understandable language.', icon: 'BookOpen', status: 'available' },
  { id: 'concepts', name: 'Legal Concepts', description: 'Explore interconnected legal concepts and doctrines.', icon: 'Network', status: 'available' },
  { id: 'flashcards', name: 'Flashcards', description: 'Create and review flashcards for active recall.', icon: 'Layers', status: 'available' },
  { id: 'quiz', name: 'Quiz Generator', description: 'Generate practice questions from study material.', icon: 'CircleHelp', status: 'available' },
  { id: 'notes', name: 'Study Notes', description: 'Organize and structure your legal study notes.', icon: 'NotebookPen', status: 'available' },
  { id: 'explorer', name: 'Case Law Explorer', description: 'Navigate case law relationships and precedents.', icon: 'Compass', status: 'beta' },
];

export const STUDY_MATERIALS: StudyMaterial[] = [
  { id: 'sm1', title: 'Constitutional Law — Fundamental Rights', type: 'Case Summary', progress: 78, date: 'Today' },
  { id: 'sm2', title: 'Contract Act — Formation & Breach', type: 'Provision Explainer', progress: 45, date: 'Yesterday' },
  { id: 'sm3', title: 'Criminal Procedure — Bail Provisions', type: 'Study Notes', progress: 62, date: '2 days ago' },
  { id: 'sm4', title: 'Tort Law — Negligence Elements', type: 'Flashcard Set', progress: 90, date: '3 days ago' },
];

export const SAVED_CASES: SavedCase[] = [
  { id: 'sc1', title: 'Demo Case — Right to Privacy', citation: 'Demo Citation (2023)', date: 'Aug 15', tags: ['Constitutional', 'Privacy'], isDemo: true },
  { id: 'sc2', title: 'Demo Case — Freedom of Speech', citation: 'Demo Citation (2022)', date: 'Aug 12', tags: ['Constitutional', 'Speech'], isDemo: true },
  { id: 'sc3', title: 'Demo Case — Consumer Dispute', citation: 'Demo Citation (2023)', date: 'Aug 8', tags: ['Consumer', 'Dispute'], isDemo: true },
];

export const STUDY_NOTES: StudyNote[] = [
  { id: 'sn1', title: 'Notes: Basic Structure Doctrine', excerpt: 'The basic structure doctrine holds that certain fundamental features of the Constitution cannot be altered by amendment...', category: 'Constitutional Law', date: 'Today' },
  { id: 'sn2', title: 'Notes: Essentials of a Valid Contract', excerpt: 'A valid contract requires offer, acceptance, consideration, capacity, and free consent...', category: 'Contract Law', date: 'Yesterday' },
  { id: 'sn3', title: 'Notes: Types of Bail', excerpt: 'Bail may be categorized into regular bail, anticipatory bail, and interim bail depending on the stage...', category: 'Criminal Law', date: '2 days ago' },
];

export const FLASHCARDS: Flashcard[] = [
  { id: 'f1', term: 'Habeas Corpus', definition: 'A writ requiring a person under arrest to be brought before a court to secure release unless lawful grounds exist.', category: 'Constitutional Law' },
  { id: 'f2', term: 'Mens Rea', definition: 'The mental element of a crime — intention or knowledge of wrongdoing.', category: 'Criminal Law' },
  { id: 'f3', term: 'Locus Standi', definition: 'The right or capacity to bring an action before a court.', category: 'Civil Procedure' },
  { id: 'f4', term: 'Res Judicata', definition: 'A matter already judged cannot be pursued again between the same parties.', category: 'Civil Procedure' },
  { id: 'f5', term: 'Stare Decisis', definition: 'The principle of following precedent set by prior court decisions.', category: 'Jurisprudence' },
  { id: 'f6', term: 'Consideration', definition: 'Something of value exchanged between parties to form a binding contract.', category: 'Contract Law' },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Which writ requires a person under arrest to be presented before a court?',
    options: ['Mandamus', 'Habeas Corpus', 'Certiorari', 'Quo Warranto'],
    correctIndex: 1,
    explanation: 'Habeas Corpus requires a person under arrest to be brought before a court to secure their release unless lawful grounds are shown.',
  },
  {
    id: 'q2',
    question: 'What does "mens rea" refer to in criminal law?',
    options: ['The physical act of a crime', 'The mental element of a crime', 'The punishment for a crime', 'The court procedure'],
    correctIndex: 1,
    explanation: 'Mens rea refers to the mental element — intention or knowledge of wrongdoing that constitutes part of a criminal offence.',
  },
  {
    id: 'q3',
    question: 'Which principle prevents the same matter from being tried twice between the same parties?',
    options: ['Stare Decisis', 'Res Judicata', 'Locus Standi', 'Natural Justice'],
    correctIndex: 1,
    explanation: 'Res Judicata prevents a matter already judged from being pursued again between the same parties.',
  },
  {
    id: 'q4',
    question: 'What is "consideration" in contract law?',
    options: ['A written agreement', 'Something of value exchanged between parties', 'A court order', 'A witness signature'],
    correctIndex: 1,
    explanation: 'Consideration is something of value exchanged between parties to form a binding contract.',
  },
  {
    id: 'q5',
    question: 'Which standard of proof applies in criminal cases?',
    options: ['Balance of probabilities', 'Beyond reasonable doubt', 'Preponderance of evidence', 'Clear and convincing'],
    correctIndex: 1,
    explanation: 'Criminal cases require proof beyond reasonable doubt, the highest standard of proof.',
  },
];
