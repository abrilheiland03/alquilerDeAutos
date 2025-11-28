import apiClient from './api/client';

export const maintenanceService = {
  // Obtener todos los mantenimientos
  getAll: async () => {
    const response = await apiClient.get('/mantenimientos');
    return response.data;
  },

  // Obtener mantenimiento por ID
  getById: async (id) => {
    const response = await apiClient.get(`/mantenimientos/${id}`);
    return response.data;
  },

  // Programar mantenimiento
  create: async (maintenanceData) => {
    const response = await apiClient.post('/mantenimientos', maintenanceData);
    return response.data;
  },

  // Iniciar mantenimiento
  start: async (id) => {
    const response = await apiClient.post(`/mantenimientos/${id}/iniciar`);
    return response.data;
  },

  // Finalizar mantenimiento
  complete: async (id) => {
    const response = await apiClient.post(`/mantenimientos/${id}/finalizar`);
    return response.data;
  },

  // Cancelar mantenimiento
  cancel: async (id) => {
    const response = await apiClient.post(`/mantenimientos/${id}/cancelar`);
    return response.data;
  },

  // Eliminar mantenimiento
  delete: async (id) => {
    const response = await apiClient.delete(`/mantenimientos/${id}`);
    return response.data;
  }
};