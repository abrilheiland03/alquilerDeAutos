import apiClient from './api/client';

export const catalogService = {
  getDocumentTypes: async () => {
    const response = await apiClient.get('/tipos-documento');
    return response.data;
  },

  getBrands: async () => {
    const response = await apiClient.get('/marcas');
    return response.data;
  },

  getColors: async () => {
    const response = await apiClient.get('/colores');
    return response.data;
  },

  getVehicleStates: async () => {
    const response = await apiClient.get('/estados-auto');
    return response.data;
  },

  getRentalStates: async () => {
    const response = await apiClient.get('/estados-alquiler');
    return response.data;
  },

  getMaintenanceStates: async () => {
    const response = await apiClient.get('/estados-mantenimiento');
    return response.data;
  },

  getPermissions: async () => {
    const response = await apiClient.get('/permisos');
    return response.data;
  }
};