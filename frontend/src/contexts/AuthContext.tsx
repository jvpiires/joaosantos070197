import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthContextType, LoginCredentials, RegisterData } from '../types/auth.types';
import { authService } from '../services/authService';
import { tokenUtils } from '../utils/tokenUtils';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = tokenUtils.getToken();
    if (savedToken && !tokenUtils.isTokenExpired(savedToken)) {
      setToken(savedToken);
    } else if (savedToken) {
      // Token expirado, remover
      tokenUtils.removeToken();
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!token) return;

    const checkTokenExpiration = async () => {
      if (tokenUtils.isTokenExpiringSoon(token)) {
        try {
          await refreshToken();
        } catch (error) {
          console.error('Erro ao renovar token:', error);
          logout();
        }
      }
    };

    const interval = setInterval(checkTokenExpiration, 60000);
    
    checkTokenExpiration();

    return () => clearInterval(interval);
  }, [token]);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      const response = await authService.login(credentials);
      const newToken = response.token;
      
      tokenUtils.saveToken(newToken);
      setToken(newToken);
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    try {
      await authService.register(data);
    } catch (error) {
      throw error;
    }
  };

  const logout = (): void => {
    tokenUtils.removeToken();
    setToken(null);
  };

  const refreshToken = async (): Promise<void> => {
    if (!token) {
      throw new Error('Nenhum token disponível para renovação');
    }

    try {
      const response = await authService.refreshToken(token);
      const newToken = response.token;
      
      tokenUtils.saveToken(newToken);
      setToken(newToken);
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      logout();
      throw error;
    }
  };

  const value: AuthContextType = {
    token,
    isAuthenticated: !!token && !tokenUtils.isTokenExpired(token),
    login,
    register,
    logout,
    refreshToken,
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
