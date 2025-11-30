import axios from 'axios';
import type {
  PaginatedPosts,
  Comment,
  CreateCommentPayload,
  CreateReplyPayload,
} from '../types/community';

const API_URL = '/api/community';

export const communityService = {
  getPosts: async (
    page: number = 1,
    limit: number = 10,
    type?: string,
    keyword?: string
  ): Promise<PaginatedPosts> => {
    try {
      const response = await axios.get<{
        success: boolean;
        data: PaginatedPosts;
      }>(`${API_URL}/posts`, {
        params: {
          page,
          limit,
          ...(type && { type }),
          ...(keyword && { keyword }),
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching community posts:', error);
      throw error;
    }
  },
  addComment: async (
    postId: string,
    payload: CreateCommentPayload
  ): Promise<Comment> => {
    try {
      const response = await axios.post<{ success: boolean; data: Comment }>(
        `${API_URL}/posts/${postId}/comments`,
        payload
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error adding comment to post ${postId}:`, error);
      throw error;
    }
  },
  addReply: async (
    postId: string,
    commentId: string,
    payload: CreateReplyPayload
  ): Promise<Comment> => {
    try {
      const response = await axios.post<{ success: boolean; data: Comment }>(
        `${API_URL}/posts/${postId}/comments/${commentId}/reply`,
        payload
      );
      return response.data.data;
    } catch (error) {
      console.error(
        `Error adding reply to comment ${commentId} on post ${postId}:`,
        error
      );
      throw error;
    }
  },
  updateComment: async (
    commentId: string,
    payload: { content: string }
  ): Promise<Comment> => {
    try {
      const response = await axios.put<{ success: boolean; data: Comment }>(
        `${API_URL}/comments/${commentId}`,
        payload
      );
      return response.data.data;
    } catch (error) {
      console.error(`Error updating comment ${commentId}:`, error);
      throw error;
    }
  },
  deleteComment: async (commentId: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/comments/${commentId}`);
    } catch (error) {
      console.error(`Error deleting comment ${commentId}:`, error);
      throw error;
    }
  },
  checkPostViewed: async (postId: string): Promise<boolean> => {
    try {
      const response = await axios.get<{ success: boolean; viewed: boolean }>(
        `${API_URL}/posts/${postId}/viewed`
      );
      return response.data.viewed;
    } catch (error) {
      console.error(`Error checking viewed status for post ${postId}:`, error);
      return false; // Assume not viewed on error
    }
  },
};
