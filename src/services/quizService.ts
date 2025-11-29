import axios from 'axios';
import type {
  Problem,
  SingleProblemCheckResponse,
  AIExplanationResponse,
  UserAnswer,
  QuizProcessResponse,
} from '../types/quiz'; // Import new types

interface QuizApiResponse {
  success: boolean;
  data: {
    technique: {
      _id: string;
      slug: string;
      title: string;
      level: string;
      description: string;
    };
    quizzes: Problem[];
  };
}

export const quizService = {
  getQuizBySlug: async (slug: string): Promise<Problem[]> => {
    const response = await axios.get<QuizApiResponse>(
      `/api/theory/quiz/${slug}`
    );
    return response.data.data.quizzes;
  },

  getQuizProcess: async (slug: string): Promise<string[]> => {
    const response = await axios.get<QuizProcessResponse>(
      `/api/theory/quiz-process/${slug}`
    );
    return response.data.data
      .filter((entry) => entry.lastCorrect)
      .map((entry) => entry.quizId);
  },

  checkProblemAnswer: async (
    problemId: string,
    userAnswer: string
  ): Promise<SingleProblemCheckResponse> => {
    const response = await axios.post<SingleProblemCheckResponse>(
      `/api/theory/quiz/${problemId}/check`,
      { userAnswer }
    );
    return response.data;
  },

  generateAIExplanation: async (
    slug: string,
    userAnswers: UserAnswer[]
  ): Promise<AIExplanationResponse> => {
    const response = await axios.post<AIExplanationResponse>(
      `/api/theory/quiz/${slug}/result-explanation`,
      { userAnswers }
    );
    return response.data;
  },
};
