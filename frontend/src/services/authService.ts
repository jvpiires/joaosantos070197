import axios from 'axios';
import type { LoginCredentials, LoginResponse, RegisterData } from '../types/auth.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

// Cliente axios sem interceptadores para refresh token
const authClient = axios.create({
  baseURL: API_URL,
});

export const authService = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>(
      `${API_URL}/auth/login`,
      credentials
    );
    return response.data;
  },

  register: async (data: RegisterData): Promise<void> => {
    await axios.post(`${API_URL}/auth/register`, data);
  },

  refreshToken: async (currentToken: string): Promise<LoginResponse> => {
    try {
      console.log('🔄 Tentando renovar token...');
      
      const response = await authClient.post<LoginResponse>(
        '/auth/refresh',
        {},
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log('✅ Token renovado:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao renovar token:', error.response?.status, error.response?.data);
      throw error;
    }
  },
};
