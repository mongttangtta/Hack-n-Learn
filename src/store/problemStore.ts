import { create } from 'zustand';
import axios from 'axios';

interface ProblemProgress {
  slug: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard'; // Use specific types if known, otherwise string
  answerRate: number;
  result: 'solved' | 'unsolved' | 'partial' | 'fail'; // Use specific types if known, otherwise string
}

interface ProblemState {
  problemProgress: ProblemProgress[];
  isLoading: boolean;
  error: string | null;
  fetchProblemProgress: () => Promise<void>;
}

export const useProblemStore = create<ProblemState>((set) => ({
  problemProgress: [],
  isLoading: false,
  error: null,

  fetchProblemProgress: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get('/api/problems/progress');
      if (response.status === 200 && response.data && response.data.data) {
        set({ problemProgress: response.data.data, isLoading: false });
      } else {
        set({ error: 'Failed to fetch problem progress', isLoading: false });
      }
    } catch (error) {
      console.error('Failed to fetch problem progress:', error);
      set({ error: 'Failed to fetch problem progress', isLoading: false });
    }
  },
}));
