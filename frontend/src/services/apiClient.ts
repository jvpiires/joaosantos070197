import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { tokenUtils } from '../utils/tokenUtils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenUtils.getToken();
    
    if (token && !tokenUtils.isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const currentToken = tokenUtils.getToken();
        
        if (currentToken && !tokenUtils.isTokenExpired(currentToken)) {
          const refreshResponse = await axios.post<{ token: string }>(
            `${API_URL}/auth/refresh`,
            {},
            {
              headers: {
                Authorization: `Bearer ${currentToken}`,
              },
            }
          );

          const newToken = refreshResponse.data.token;
          tokenUtils.saveToken(newToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          return apiClient(originalRequest);
        } else {
          tokenUtils.removeToken();
          window.location.href = '/login';
        }
      } catch (refreshError) {
        tokenUtils.removeToken();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 403) {
      tokenUtils.removeToken();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default apiClient;
