import axios from 'axios';
import type { RankingResponse, RankingUser, MyRankingResponse } from '../types/ranking';

export const fetchRankings = async (page: number = 1, limit: number = 10): Promise<RankingResponse> => {
  try {
    const response = await axios.get<RankingResponse>(`/api/ranking`, {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching rankings:', error);
    throw error;
  }
};

export const fetchMyRanking = async (): Promise<RankingUser> => {
  try {
    // Assuming the API returns a single RankingUser object wrapped in data: { rank: ..., nickname: ...}
    const response = await axios.get<MyRankingResponse>(`/api/ranking/me`);
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error('Failed to fetch my ranking: ' + (response.data as any).message || 'Unknown error');
    }
  } catch (error) {
    console.error('Error fetching my ranking:', error);
    throw error;
  }
};
