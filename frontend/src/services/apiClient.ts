import axios from 'axios';
import { authService } from './authService';
import { webSocketService } from './webSocketService';

const apiClient = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } 
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    console.error('❌ Erro na requisição:', {
      status: error.response?.status,
      url: originalRequest?.url,
      retry: originalRequest?._retry
    });

    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry) {
      if (originalRequest.url?.includes('/auth/login') || 
          originalRequest.url?.includes('/auth/register') ||
          originalRequest.url?.includes('/auth/refresh')) {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const currentToken = localStorage.getItem('token');
      
      if (!currentToken) {
        console.error('⚠️ Token não encontrado. Redirecionando para login...');
        localStorage.clear();
        window.location.href = '/';
        return Promise.reject(error);
      }

      try {
        const response = await authService.refreshToken(currentToken);
        const newToken = response.token;
        
        localStorage.setItem('token', newToken);
        
        apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
        originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
        
        processQueue(null, newToken);
                
        webSocketService.disconnect();
        setTimeout(() => {
          webSocketService.connect();
        }, 500);
        
        return apiClient(originalRequest);
        
      } catch (refreshError: any) {
        processQueue(refreshError, null);
        
        webSocketService.disconnect();
        localStorage.clear();
        window.location.href = '/';
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
