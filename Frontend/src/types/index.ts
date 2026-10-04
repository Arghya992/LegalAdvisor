export type LegalCategory = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

export type ChatRole = 'user' | 'assistant';

export type LegalSource = {
  id: string;
  act: string;
  section: string;
  provision: string;
  reference: string;
  isDemo: boolean;
};

export type LegalResponseData = {
  understanding: string;
  relevantLaw: string;
  explanation: string;
  nextSteps: string[];
  sources: LegalSource[];
};

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  response?: LegalResponseData;
  timestamp: string;
  category?: string;
};

export type Consultation = {
  id: string;
  title: string;
  category: string;
  preview: string;
  date: string;
  messages: ChatMessage[];
};

export type ProcessingStage = {
  id: string;
  label: string;
};

export type LegalResource = {
  id: string;
  title: string;
  category: string;
  type: string;
  description: string;
  isDemo: boolean;
  metadata: {
    jurisdiction?: string;
    year?: string;
    authority?: string;
  };
};

export type ResourceCategory = {
  id: string;
  name: string;
  description: string;
  count: number;
};

export type StudentTool = {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'available' | 'beta';
};

export type Flashcard = {
  id: string;
  term: string;
  definition: string;
  category: string;
};

export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type StudyMaterial = {
  id: string;
  title: string;
  type: string;
  progress: number;
  date: string;
};

export type SavedCase = {
  id: string;
  title: string;
  citation: string;
  date: string;
  tags: string[];
  isDemo: boolean;
};

export type StudyNote = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
};

export type FutureItem = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

export type PipelineStep = {
  id: string;
  number: string;
  label: string;
  description: string;
};

export type Problem = {
  number: string;
  title: string;
  description: string;
};

export type Principle = {
  title: string;
  description: string;
  icon: string;
};
