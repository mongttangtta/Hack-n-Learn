import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const emitSecurityAlert = (message?: string) => {
  if (!message) return;

  window.dispatchEvent(
    new CustomEvent('security-alert', {
      detail: { message },
    })
  );
};

export const setupAxiosInterceptor = () => {
  // OAuth 및 쿠키 기반 인증을 위해 credentials 포함 설정 (credentials: "include"와 동일)
  axios.defaults.withCredentials = true;

  axios.interceptors.request.use(
    (config) => config,
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      emitSecurityAlert(response.headers?.['x-security-alert']);
      return response;
    },
    async (error) => {
      emitSecurityAlert(error.response?.headers?.['x-security-alert']);

      if (error.response && error.response.status === 401) {
        const { isAuthenticated, logout } = useAuthStore.getState();
        if (!isAuthenticated) {
          return Promise.reject(error);
        }

        // Session expired or unauthorized while authenticated
        await logout();
        window.dispatchEvent(new CustomEvent('session-expired'));
      }
      return Promise.reject(error);
    }
  );
};
