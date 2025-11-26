import axios from 'axios';

const getApiBaseUrl = () => {
  // Si estamos en localhost, usar localhost
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  // Si no, usar la URL del tunnel
  return 'https://dp36lzm9-5000.brs.devtunnels.ms/api';
};

const API_BASE_URL = getApiBaseUrl();

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Interceptor para agregar el user-id automáticamente
apiClient.interceptors.request.use(
  (config) => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      config.headers['user-id'] = userId;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores globalmente
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirigir al login si no está autenticado
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;