import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { tokenUtils } from '../utils/tokenUtils';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Criar instância do axios
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de requisição - adiciona token JWT
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

// Interceptor de resposta - trata erros de autenticação
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Se o erro for 401 (não autorizado) e ainda não tentamos renovar o token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const currentToken = tokenUtils.getToken();
        
        if (currentToken && !tokenUtils.isTokenExpired(currentToken)) {
          // Tentar renovar o token
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

          // Atualizar o header da requisição original com o novo token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          }

          // Reenviar a requisição original
          return apiClient(originalRequest);
        } else {
          // Token expirado, redirecionar para login
          tokenUtils.removeToken();
          window.location.href = '/login';
        }
      } catch (refreshError) {
        // Erro ao renovar token, fazer logout
        tokenUtils.removeToken();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Se o erro for 403 (proibido), pode ser necessário fazer logout
    if (error.response?.status === 403) {
      tokenUtils.removeToken();
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default apiClient;
