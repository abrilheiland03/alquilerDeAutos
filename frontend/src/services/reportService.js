import apiClient from './api/client'; // Ajusta la ruta según tu estructura

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
  },

  // Funciones para PDF - CORREGIDAS
  getClientRentalsPDF: async (fechaDesde, fechaHasta) => {
    const response = await apiClient.get(`/reportes/pdf/detalle-clientes?fecha_desde=${fechaDesde}&fecha_hasta=${fechaHasta}`);
    return response.data;
  },
  
  getRentalsByPeriodPDF: async (fechaDesde, fechaHasta, periodo) => {
    const response = await apiClient.get(`/reportes/pdf/alquileres-periodo?fecha_desde=${fechaDesde}&fecha_hasta=${fechaHasta}&periodo=${periodo}`);
    return response.data;
  },
  
  getVehicleRankingPDF: async (fechaDesde, fechaHasta) => {
    const response = await apiClient.get(`/reportes/pdf/ranking-vehiculos?fecha_desde=${fechaDesde}&fecha_hasta=${fechaHasta}`);
    return response.data;
  },
  
  getMonthlyRevenuePDF: async (fechaDesde, fechaHasta) => {
    const response = await apiClient.get(`/reportes/pdf/facturacion-mensual?fecha_desde=${fechaDesde}&fecha_hasta=${fechaHasta}`);
    return response.data;
  },

  // En reportService.js - agregar nueva función
  getDetailedClientRentalsPDF: async (fechaDesde, fechaHasta) => {
    const response = await apiClient.get(`/reportes/pdf/detalle-clientes-completo?fecha_desde=${fechaDesde}&fecha_hasta=${fechaHasta}`);
    return response.data;
},
};