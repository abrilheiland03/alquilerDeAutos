import api from './api/client';

const multaService = {
  create: async (multaData) => {
    const response = await api.post(`/alquileres/${multaData.id_alquiler}/multas`, {
      costo: multaData.costo,
      detalle: multaData.detalle,
      fecha_multa: `${multaData.fecha}T12:00:00`
    });
    return response.data;
  },

  delete: async (idMulta) => {
    const response = await api.delete(`/multas/${idMulta}`);
    return response.data;
  },

  getByAlquiler: async (idAlquiler) => {
    const response = await api.get(`/alquileres/${idAlquiler}/multas`);
    return response.data;
  }
};

export default multaService;