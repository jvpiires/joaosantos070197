import type { DecodedToken } from '../types/auth.types';

const TOKEN_KEY = 'jwt_token';

export const tokenUtils = {
  saveToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },

  decodeToken: (token: string): DecodedToken | null => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
      return null;
    }
  },

  isTokenExpired: (token: string): boolean => {
    const decoded = tokenUtils.decodeToken(token);
    if (!decoded) return true;

    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  },

  isTokenExpiringSoon: (token: string, minutesBefore: number = 5): boolean => {
    const decoded = tokenUtils.decodeToken(token);
    if (!decoded) return true;

    const currentTime = Date.now() / 1000;
    const expirationBuffer = minutesBefore * 60;
    return decoded.exp - currentTime < expirationBuffer;
  },
};
