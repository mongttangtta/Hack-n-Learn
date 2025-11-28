import axios from 'axios';
import type { PaginatedPosts } from '../types/community';

const API_URL = '/api/community';

export const communityService = {
  getPosts: async (
    page: number = 1,
    limit: number = 10,
    type?: string,
    keyword?: string
  ): Promise<PaginatedPosts> => {
    try {
      const response = await axios.get<{ success: boolean; data: PaginatedPosts }>(
        `${API_URL}/posts`,
        {
          params: {
            page,
            limit,
            ...(type && { type }),
            ...(keyword && { keyword }),
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching community posts:', error);
      throw error;
    }
  },
};
