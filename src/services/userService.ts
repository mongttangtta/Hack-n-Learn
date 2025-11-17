import axios from 'axios';

export const fetchMyPageData = async () => {
  try {
    const response = await axios.get('/api/mypage');
    return response.data;
  } catch (error) {
    console.error('Error fetching my page data:', error);
    throw error;
  }
};
