import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { authService } from "../services/authService";

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  userLogin: string | null;
  login: (token: string, login: string, role: string) => void;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

// Decodifica JWT sem verificar (apenas para ler exp)
const decodeToken = (token: string): { exp: number } | null => {
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

  const login = (token: string, login: string, role: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userLogin", login);
    localStorage.setItem("userRole", role);

    setIsAuthenticated(true);
    setUserLogin(login);
    setUserRole(role);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userLogin");
    localStorage.removeItem("userRole");

    setIsAuthenticated(false);
    setUserLogin(null);
    setUserRole(null);
  };

  const refreshToken = async () => {
    try {
      const currentToken = localStorage.getItem("token");
      
      if (!currentToken) {
        console.log("❌ Nenhum token para renovar");
        logout();
        return;
      }

      console.log("🔄 Renovando token via AuthContext...");
      const response = await authService.refreshToken(currentToken);
      const newToken = response.token;

      // Atualiza o token no localStorage
      localStorage.setItem("token", newToken);
      
      console.log("✅ Token renovado com sucesso via AuthContext");
    } catch (error) {
      console.error("❌ Erro ao renovar token via AuthContext:", error);
      logout();
    }
  };

  // Verifica periodicamente se o token precisa ser renovado
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkTokenExpiration = () => {
      const token = localStorage.getItem("token");
      
      if (!token) return;

      const decoded = decodeToken(token);
      
      if (!decoded || !decoded.exp) return;

      // Calcula quantos minutos faltam para expirar
      const now = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = decoded.exp - now;
      const minutesUntilExpiry = Math.floor(timeUntilExpiry / 60);

      console.log(`⏰ Token expira em ${minutesUntilExpiry} minutos`);

      // Se faltar menos de 5 minutos para expirar, renova
      if (timeUntilExpiry < 300) { // 5 minutos
        console.log("⚠️ Token próximo de expirar! Renovando...");
        refreshToken();
      }
    };

    // Verifica imediatamente
    checkTokenExpiration();

    // Verifica a cada 2 minutos
    const interval = setInterval(checkTokenExpiration, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userRole, userLogin, login, logout, refreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
