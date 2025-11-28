import apiClient from './api/client';

export const vehicleService = {
  // Obtener todos los vehículos
  getAll: async () => {
    const response = await apiClient.get('/vehiculos');
    return response.data;
  },

  // Obtener vehículos libres
  getAvailable: async (fechaInicio, fechaFin) => {
  const response = await apiClient.get('/vehiculos/libres', {
    params: {
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin
    }
  });
  return response.data;
},

  // Obtener vehículo por patente
  getByPlate: async (patente) => {
    const response = await apiClient.get(`/vehiculos/${patente}`);
    return response.data;
  },

  // Crear vehículo
  create: async (vehicleData) => {
    const response = await apiClient.post('/vehiculos', vehicleData);
    return response.data;
  },

  // Actualizar vehículo
  update: async (patente, vehicleData) => {
    const response = await apiClient.put(`/vehiculos/${patente}`, vehicleData);
    return response.data;
  },

  // Eliminar vehículo
  delete: async (patente) => {
    const response = await apiClient.delete(`/vehiculos/${patente}`);
    return response.data;
  },


  // Obtener conteo de vehículos disponibles
  getAvailableCount: async () => {
    const response = await apiClient.get('/vehiculos/libres');
    // Si la respuesta es un array, contar elementos
    if (Array.isArray(response.data)) {
      return response.data.length;
    }
    return 0;
  },
};