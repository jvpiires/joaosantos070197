import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3333',
  headers: {
    'Content-Type': 'application/json',
  },
});

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
  (error) => {
    if (error.response?.status === 401) {
      console.error('Token inválido ou expirado. Redirecionando para login...');
      localStorage.removeItem('token');
      localStorage.removeItem('userLogin');
      localStorage.removeItem('userRole');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
