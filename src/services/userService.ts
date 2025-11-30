import axios from 'axios';
import type { MyPageData } from '../types/mypage';

export const fetchMyPageData = async (): Promise<{
  success: boolean;
  data: MyPageData | null;
}> => {
  try {
    const response = await axios.get('/api/mypage');
    return { success: true, data: response.data.data }; // Accessing data.data because the API returns { success: true, data: { ... } }
  } catch (error) {
    console.error('Error fetching my page data:', error);
    return { success: false, data: null };
  }
};

export const uploadProfileImage = async (
  file: File
): Promise<{ success: boolean; data: any }> => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await axios.post('/api/mypage/profile-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, data: null };
  }
};

export const checkNicknameAvailability = async (
  nickname: string
): Promise<{ available: boolean | null }> => {
  try {
    const response = await axios.get('/api/mypage/check-nickname', {
      params: {
        nickname: nickname,
      },
    });
    return { available: response.data.available };
  } catch (error) {
    console.error('Error checking nickname availability:', error);
    return { available: false };
  }
};

export const updateNickname = async (
  nickname: string
): Promise<{
  success: boolean;
  data?: any;
  error?: string;
  nextAvailableAt?: string;
  remainHours?: number;
}> => {
  try {
    const response = await axios.post('/api/mypage/nickname', { nickname });
    if (response.data.success) {
      return { success: true, data: response.data };
    } else {
      return {
        success: false,
        error: response.data.error,
        nextAvailableAt: response.data.nextAvailableAt,
        remainHours: response.data.remainHours,
      };
    }
  } catch (error: any) {
    console.error('Error updating nickname:', error);
    if (error.response && error.response.data) {
      return {
        success: false,
        error: error.response.data.error,
        nextAvailableAt: error.response.data.nextAvailableAt,
        remainHours: error.response.data.remainHours,
      };
    }
    return { success: false, data: null };
  }
};

export const fetchMyPageProfile = async (): Promise<{
  success: boolean;
  data: any;
}> => {
  try {
    const response = await axios.get('/api/mypage/profile');
    return { success: true, data: response.data.data }; // Accessing data.data because the API returns { success: true, data: { ... } }
  } catch (error) {
    console.error('Error fetching my page profile:', error);
    return { success: false, data: null };
  }
};
