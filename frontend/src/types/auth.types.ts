export interface LoginCredentials {
  login: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterData {
  login: string;
  password: string;
  userRole: string;
}

export interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export interface DecodedToken {
  sub: string;
  exp: number;
  iat: number;
  role: string | 'ADMIN' | 'USER'; // Adicionando Role
}
