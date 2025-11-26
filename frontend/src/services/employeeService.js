import apiEmployee from './api/employee';

export const employeeService = {
  // Obtener todos los empleados
  getAll: async () => {
    const response = await apiEmployee.get('/empleados');
    return response.data;
  },

  // Obtener empleado por ID
  getById: async (id) => {
    const response = await apiEmployee.get(`/empleados/${id}`);
    return response.data;
  },

  // Buscar empleado por documento
  getByDocument: async (tipo, numero) => {
    const response = await apiEmployee.get('/empleados/buscar', {
      params: { tipo, nro: numero }
    });
    return response.data;
  },

  // Crear empleado
  create: async (payload) => {
    const response = await apiEmployee.post('/empleados', payload);
    return response.data;
  },



  // Actualizar empleado
  update: async (id, employeeData) => {
    const response = await apiEmployee.put(`/empleados/${id}`, employeeData);
    return response.data;
  },

  // Eliminar empleado
  delete: async (id) => {
    const response = await apiEmployee.delete(`/empleados/${id}`);
    return response.data;
  }
};