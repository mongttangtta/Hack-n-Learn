import { quizzes } from '../data/quizzes';
import type { Problem } from '../types/quiz';

export const quizService = {
  getQuizBySlug: async (slug: string): Promise<Problem[] | undefined> => {
    // In a real application, this would be an actual API call, e.g.:
    // const response = await axios.get(`/api/theory/quiz/${slug}`);
    // return response.data;

    // For now, we'll simulate an API call by returning data from our local 'quizzes' object
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(quizzes[slug]);
      }, 300); // Simulate network delay
    });
  },
};
