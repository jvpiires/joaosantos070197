import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { authService } from "../services/authService";

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  userId: number | null;
  userLogin: string | null;
  login: (token: string, login: string, role: string, id?: number) => void;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

const decodeToken = (token: string): any => {
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
};

const AuthContext = createContext({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem("token");
  });

  const [userRole, setUserRole] = useState<string | null>(() => {
    return localStorage.getItem("userRole");
  });

  const [userLogin, setUserLogin] = useState<string | null>(() => {
    return localStorage.getItem("userLogin");
  });

  const [userId, setUserId] = useState<number | null>(() => {
    const storedId = localStorage.getItem("userId");
    return storedId ? parseInt(storedId, 10) : null;
  });

  const login = (token: string, login: string, role: string, id?: number) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userLogin", login);
    localStorage.setItem("userRole", role);
    
    if (id) {
      localStorage.setItem("userId", id.toString());
      setUserId(id);
    }

    setIsAuthenticated(true);
    setUserLogin(login);
    setUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userLogin");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");

    setIsAuthenticated(false);
    setUserLogin(null);
    setUserRole(null);
    setUserId(null);
  };

  const refreshToken = async () => {
    try {
      const currentToken = localStorage.getItem("token");
      
      if (!currentToken) {
        logout();
        return;
      }

      const response = await authService.refreshToken(currentToken);
      const newToken = response.token;

      localStorage.setItem("token", newToken);
      
    } catch (error) {
      logout();
    }
  };

  // Extrair userId do token se não estiver no localStorage
  useEffect(() => {
    if (isAuthenticated && !userId) {
      const token = localStorage.getItem("token");
      if (token) {
        const decoded = decodeToken(token);
        if (decoded) {
          const extractedUserId = decoded.userId || decoded.id || decoded.sub;
          if (extractedUserId) {
            const userIdNumber = parseInt(extractedUserId, 10);
            if (!isNaN(userIdNumber)) {
              setUserId(userIdNumber);
              localStorage.setItem("userId", userIdNumber.toString());
            }
          }
        }
      }
    }
  }, [isAuthenticated, userId]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const checkTokenExpiration = () => {
      const token = localStorage.getItem("token");
      
      if (!token) return;

      const decoded = decodeToken(token);
      
      if (!decoded || !decoded.exp) return;

      const now = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = decoded.exp - now;

      if (timeUntilExpiry < 300) {
        refreshToken();
      }
    };

    checkTokenExpiration();

    const interval = setInterval(checkTokenExpiration, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userRole, userLogin, login, logout, refreshToken, userId }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
