import apiClient from './api/client';

export const clientService = {
  // Obtener todos los clientes
  getAll: async () => {
    const response = await apiClient.get('/clientes');
    return response.data;
  },

  // Obtener cliente por ID
  getById: async (id) => {
    const response = await apiClient.get(`/clientes/${id}`);
    return response.data;
  },

  // Buscar cliente por documento
  getByDocument: async (tipo, numero) => {
    const response = await apiClient.get('/clientes/buscar', {
      params: { tipo, nro: numero }
    });
    return response.data;
  },

  // Crear cliente
  create: async (clientData) => {
    const response = await apiClient.post('/clientes', clientData);
    return response.data;
  },

  // Actualizar cliente
  update: async (id, clientData) => {
    const response = await apiClient.put(`/clientes/${id}`, clientData);
    return response.data;
  },

  // Eliminar cliente
  delete: async (id) => {
    const response = await apiClient.delete(`/clientes/${id}`);
    return response.data;
  }
};