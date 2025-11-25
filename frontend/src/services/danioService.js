import api from './api/client';

const danioService = {
  create: async (danioData) => {
    const response = await api.post(`/alquileres/${danioData.id_alquiler}/danios`, {
      costo: danioData.costo,
      detalle: danioData.detalle
    });
    return response.data;
  },

  delete: async (idDanio) => {
    const response = await api.delete(`/danios/${idDanio}`);
    return response.data;
  },

  getByAlquiler: async (idAlquiler) => {
    const response = await api.get(`/alquileres/${idAlquiler}/danios`);
    return response.data;
  }
};

export default danioService;