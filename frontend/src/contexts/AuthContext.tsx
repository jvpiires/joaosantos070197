import { createContext, useContext, useState, type ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: string | null;
  userLogin: string | null;
  login: (token: string, login: string, role: string) => void;
  logout: () => void;
}

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

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userRole, userLogin, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
