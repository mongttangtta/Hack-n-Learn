import { create } from 'zustand';
import axios from 'axios';



interface User {
  id: string;
  username: string;
  nickname: string; // Add nickname property
  points: number; // Add points property
  tier?: string;
  titles?: string[];
  // Add other user properties as needed
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  addPoints: (amount: number) => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  isLoading: true, // Start as true to indicate initial loading of auth status

    addPoints: (amount: number) => {
      set((state) => ({
        user: state.user ? { ...state.user, points: (state.user.points || 0) + amount } : null,
      }));
    },

    updateUser: (updates: Partial<User>) => {
      set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null,
      }));
    },

    login: async (username, password) => {
      set({ isLoading: true });
      try {
        const response = await axios.post('/api/auth/login', {
          id: username,
          password,
        });
        if (response.status === 200 && response.data) {
          const user: User = {
            id: response.data.userId, // Extract userId for User.id
            username: username, // Use the provided username for consistency
            nickname: response.data.nickname, // Extract nickname
            points: response.data.points || 0, // Extract points
          }; 
          set({
            isAuthenticated: true,
            user: user,
            isLoading: false,
          });
          return true;
        }
        set({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
        return false;
      } catch (error) {
        console.error('Login failed with error:', error);
        set({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
        return false;
      }
    },
  
    logout: async () => {
      set({ isLoading: true });
      try {
        await axios.post('/api/auth/logout');
      } catch (error) {
        console.error('Logout failed:', error);
      } finally {
        set({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      }
    },
  
    checkAuthStatus: async () => {
      set({ isLoading: true });
      try {
        const response = await axios.get('/api/auth/me', { withCredentials: true });
        if (response.status === 200 && response.data.data) {
          const user: User = {
            id: response.data.data._id,
            username: response.data.data.id, // Map backend's id to User.username
            nickname: response.data.data.nickname, // Extract nickname
            points: response.data.data.points || 0, // Extract points
            tier: response.data.data.tier,
            titles: response.data.data.titles || [],
          };
          set({
            isAuthenticated: true,
            user: user,
            isLoading: false,
          });
        } else {
          set({
            isAuthenticated: false,
            user: null,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Auth status check failed:', error);
        set({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      }
    },}));
