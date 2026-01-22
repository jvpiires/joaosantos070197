import axios from 'axios';
import type { LoginCredentials, LoginResponse, RegisterData } from '../types/auth.types';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

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
    const response = await axios.post<LoginResponse>(
      `${API_URL}/auth/refresh`,
      {},
      {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      }
    );
    return response.data;
  },
};
