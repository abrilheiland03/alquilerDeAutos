import apiClient from './api/client';

export const authService = {
  login: async (email, password) => {
    const response = await apiClient.post('/login', { email, password });
    return response.data;
  },

  register: async (userData) => {
    const response = await apiClient.post('/registro', userData);
    return response.data;
  },

  getCurrentUser: async (userId) => {
    const response = await apiClient.get(`/usuarios/${userId}`);
    return response.data;
  },

  updateProfile: async (userId, userData) => {
    const response = await apiClient.put(`/usuarios/${userId}`, userData);
    return response.data;
  }
};