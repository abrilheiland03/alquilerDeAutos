import apiClient from './api/client';

export const reportService = {
  // Reporte de alquileres por cliente
  getClientRentals: async (clientId) => {
    const response = await apiClient.get(`/reportes/cliente/${clientId}`);
    return response.data;
  },

  // Ranking de vehículos
  getVehicleRanking: async (startDate, endDate) => {
    const response = await apiClient.get('/reportes/ranking-vehiculos', {
      params: { fecha_desde: startDate, fecha_hasta: endDate }
    });
    return response.data;
  },

  // Evolución temporal de alquileres
  getRentalEvolution: async (startDate, endDate) => {
    const response = await apiClient.get('/reportes/evolucion-alquileres', {
      params: { fecha_desde: startDate, fecha_hasta: endDate }
    });
    return response.data;
  },

  // Facturación mensual
  getMonthlyRevenue: async (startDate, endDate) => {
    const response = await apiClient.get('/reportes/facturacion', {
      params: { fecha_desde: startDate, fecha_hasta: endDate }
    });
    return response.data;
  }
};