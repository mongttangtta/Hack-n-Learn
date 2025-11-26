// src/types/quiz.ts

export interface QuestionPart {
  type: 'highlight' | 'text';
  content: string;
}

export interface Choice {
  label: string;
  content: string;
}

export interface Problem {
  _id: string;
  techniqueId: string;
  rawQuestion: string;
  questionParts: QuestionPart[];
  choices?: Choice[]; // Optional for short answer types
  correctAnswer: string;
  explanation: string;
  questionType: 'short' | 'choice'; // 'input' from old type is 'short', 'multiple-choice' is 'choice'
}

export interface SingleProblemCheckData {
  correct: boolean;
  correctAnswer: string;
  explanation: string;
  earned: number;
}

export interface SingleProblemCheckResponse {
  success: boolean;
  data: SingleProblemCheckData;
}

// New types for AI Explanation
export interface PerQuestionResult {
  questionId: string;
  reasonSummary: string;
  mistakeAnalysis: string[];
  stepByStepSolution: string[];
  learningTips: string;
}

export interface AIExplanationData {
  title: string;
  summary: string;
  focusAreas: string[];
  nextSteps: string[];
  model: string;
  stats: {
    totalCount: number;
    correctCount: number;
    wrongCount: number;
  };
  createdAt: string;
  perQuestionResults: PerQuestionResult[];
}

export interface AIExplanationResponse {
  success: boolean;
  data: {
    ok: boolean;
    status: number;
    data: AIExplanationData;
  };
}

export interface UserAnswer {
  problemId: string;
  answer: string; // The user's selected choice label (string) or short answer text (string)
}

export interface QuizProcessEntry {
  _id: string;
  quizId: string;
  attempts: number;
  lastAnswer: string;
  lastAnsweredAt: string;
  lastCorrect: boolean;
  status: string;
  techniqueId: string;
}

export interface QuizProcessResponse {
  success: boolean;
  data: QuizProcessEntry[];
}
