import apiClient from './api/client';

export const dashboardService = {
  // Obtener estadísticas del dashboard
  getStats: async () => {
    const response = await apiClient.get('/dashboard/estadisticas');
    return response.data;
  },

  // Obtener último alquiler del cliente
  getLastRental: async () => {
    const response = await apiClient.get('/dashboard/ultimo-alquiler');
    return response.data;
  },

  // Verificar disponibilidad de vehículo
  checkVehicleAvailability: async (patente) => {
    const response = await apiClient.get(`/vehiculos/${patente}/disponible`);
    return response.data;
  }
};