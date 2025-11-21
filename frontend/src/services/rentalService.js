import apiClient from './api/client';

export const rentalService = {
  // Obtener todos los alquileres
  getAll: async () => {
    const response = await apiClient.get('/alquileres');
    return response.data;
  },

  // Obtener alquiler por ID
  getById: async (id) => {
    const response = await apiClient.get(`/alquileres/${id}`);
    return response.data;
  },

  // Crear alquiler
  create: async (rentalData) => {
    const response = await apiClient.post('/alquileres', rentalData);
    return response.data;
  },

  // Comenzar alquiler
  start: async (id) => {
    const response = await apiClient.post(`/alquileres/${id}/comenzar`);
    return response.data;
  },

  // Finalizar alquiler
  complete: async (id) => {
    const response = await apiClient.post(`/alquileres/${id}/finalizar`);
    return response.data;
  },

  // Cancelar alquiler
  cancel: async (id) => {
    const response = await apiClient.post(`/alquileres/${id}/cancelar`);
    return response.data;
  },

  // Marcar como atrasado
  markOverdue: async (id) => {
    const response = await apiClient.post(`/alquileres/${id}/atrasado`);
    return response.data;
  },

  // Eliminar alquiler
  delete: async (id) => {
    const response = await apiClient.delete(`/alquileres/${id}`);
    return response.data;
  },

  // Gestión de daños
  getDamages: async (rentalId) => {
    const response = await apiClient.get(`/alquileres/${rentalId}/danios`);
    return response.data;
  },

  createDamage: async (rentalId, damageData) => {
    const response = await apiClient.post(`/alquileres/${rentalId}/danios`, damageData);
    return response.data;
  },

  deleteDamage: async (damageId) => {
    const response = await apiClient.delete(`/danios/${damageId}`);
    return response.data;
  },

  // Gestión de multas
  getFines: async (rentalId) => {
    const response = await apiClient.get(`/alquileres/${rentalId}/multas`);
    return response.data;
  },

  createFine: async (rentalId, fineData) => {
    const response = await apiClient.post(`/alquileres/${rentalId}/multas`, fineData);
    return response.data;
  },

  deleteFine: async (fineId) => {
    const response = await apiClient.delete(`/multas/${fineId}`);
    return response.data;
  }
};