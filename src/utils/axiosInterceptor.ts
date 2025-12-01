import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export const setupAxiosInterceptor = () => {
  // OAuth 및 쿠키 기반 인증을 위해 credentials 포함 설정 (credentials: "include"와 동일)
  axios.defaults.withCredentials = true;

  axios.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        // Session expired or unauthorized
        const { logout } = useAuthStore.getState();
        await logout();
        window.dispatchEvent(new CustomEvent('session-expired'));
      }
      return Promise.reject(error);
    }
  );
};
