import axios from 'axios';
import { authService } from './authService';
import { webSocketService } from './webSocketService';

const apiClient = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag para evitar múltiplas tentativas de refresh simultâneas
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

    // Log de erro para debug
    console.error('❌ Erro na requisição:', {
      status: error.response?.status,
      url: originalRequest?.url,
      retry: originalRequest?._retry
    });

    // Se for 401 e não for a rota de login/register/refresh
    if (error.response?.status === 401 || error.response?.status === 403 &&  !originalRequest._retry) {      
      // Evita refresh em rotas públicas
      if (originalRequest.url?.includes('/auth/login') || 
          originalRequest.url?.includes('/auth/register') ||
          originalRequest.url?.includes('/auth/refresh')) {
        console.log('⏭️ Pulando refresh para rota de autenticação');
        return Promise.reject(error);
      }

      // Se já está tentando fazer refresh, adiciona na fila
      if (isRefreshing) {
        console.log('⏳ Aguardando refresh anterior...');
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          console.log('🔁 Reenviando requisição com novo token');
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
        // Sem token, redireciona para login
        console.error('⚠️ Token não encontrado. Redirecionando para login...');
        localStorage.clear();
        window.location.href = '/';
        return Promise.reject(error);
      }

      try {
        console.log('🔄 Iniciando renovação de token...');
        // Tenta renovar o token
        const response = await authService.refreshToken(currentToken);
        const newToken = response.token;
        
        console.log('💾 Salvando novo token no localStorage');
        localStorage.setItem('token', newToken);
        
        // Atualiza o header da requisição original
        apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + newToken;
        originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
        
        processQueue(null, newToken);
        
        console.log('✅ Token renovado com sucesso! Novo token:', newToken.substring(0, 20) + '...');
        
        // Reconecta ao WebSocket com novo token
        console.log('🔌 Reconectando ao WebSocket...');
        webSocketService.disconnect();
        setTimeout(() => {
          webSocketService.connect();
        }, 500);
        
        // Tenta novamente a requisição original
        console.log('🔁 Reenviando requisição original...');
        return apiClient(originalRequest);
        
      } catch (refreshError: any) {
        // Falha ao renovar token, desloga
        processQueue(refreshError, null);
        
        console.error('❌ Falha ao renovar token:', refreshError.response?.status, refreshError.response?.data);
        console.log('🚪 Desconectando WebSocket e limpando sessão...');
        webSocketService.disconnect();
        localStorage.clear();
        window.location.href = '/';
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Outros erros (403, 404, 500, etc)
    return Promise.reject(error);
  }
);

export default apiClient;
