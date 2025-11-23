import React, { useState, useEffect } from 'react';
import { vehicleService } from "../../../services/vehicleService";
import { clientService } from "../../../services/clientService";
import { X, Calendar, Car, User, DollarSign } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotification } from '../../../contexts/NotificationContext';

const RentalModal = ({ isOpen, onClose, rental, onSave, vehicle, user }) => {
  const [formData, setFormData] = useState({
    patente: '',
    id_cliente: '',
    fecha_inicio: '',
    fecha_fin: '',
    estado: 'RESERVADO'
  });
  const [vehicles, setVehicles] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [errors, setErrors] = useState({});
  const { hasPermission } = useAuth();
  const propio = hasPermission('cliente');
  const { showNotification } = useNotification();

  const getLocalDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
  if (isOpen) {
    if (propio && vehicle && user) {
      console.log('Vehicle data received:', vehicle);
      console.log('User data received:', user);
      
      const now = new Date();
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate());
      const startString = getLocalDateString(startDate);

      const endDate = new Date(now);
      endDate.setDate(endDate.getDate() + 1);
      const endString = getLocalDateString(endDate);
      
      setFormData({
        patente: vehicle.patente || '',
        id_cliente: user.userId || '', // Cambiar a userId
        fecha_inicio: startString,
        fecha_fin: endString,
        estado: 'RESERVADO'
      });
    } else if (rental) {
      setFormData({
        patente: rental.patente || '',
        id_cliente: rental.id_cliente || '',
        fecha_inicio: rental.fecha_inicio?.split('T')[0] || '',
        fecha_fin: rental.fecha_fin?.split('T')[0] || '',
        estado: rental.estado || 'RESERVADO'
      });
    } else {
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowFormatted = tomorrow.toISOString().split('T')[0];
      
      setFormData({
        patente: '',
        id_cliente: '',
        fecha_inicio: today,
        fecha_fin: tomorrowFormatted,
        estado: 'RESERVADO'
      });
    }
    setErrors({});
    
    if (!propio) {
      fetchAvailableData();
    }
  }
}, [isOpen, rental, vehicle, user, propio]);

  useEffect(() => {
    calculatePrice();
    validateForm();
  }, [formData]);

  const fetchAvailableData = async () => {
    try {
      const [vehiclesData, clientsData] = await Promise.all([
        vehicleService.getAvailable(),
        clientService.getAll()
      ]);
      
      setVehicles(vehiclesData);
      setClients(clientsData);
    } catch (error) {
      console.error('Error fetching available data:', error);
    }
  };

  const calculatePrice = () => {
    if (!formData.patente || !formData.fecha_inicio || !formData.fecha_fin) {
      setCalculatedPrice(0);
      return;
    }

    let selectedVehicle;
    if (propio && vehicle) {
      selectedVehicle = vehicle;
    } else {
      selectedVehicle = vehicles.find(v => v.patente === formData.patente);
    }

    if (!selectedVehicle) {
      setCalculatedPrice(0);
      return;
    }

    const start = new Date(formData.fecha_inicio);
    const end = new Date(formData.fecha_fin);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const totalPrice = diffDays * selectedVehicle.precio_flota;
    setCalculatedPrice(totalPrice);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!propio && !formData.id_cliente) {
      newErrors.id_cliente = 'Selecciona un cliente';
    }

    if (!propio && !formData.patente) {
      newErrors.patente = 'Selecciona un vehículo';
    }

    if (!formData.fecha_inicio) {
      newErrors.fecha_inicio = 'La fecha de inicio es requerida';
    }

    if (!formData.fecha_fin) {
      newErrors.fecha_fin = 'La fecha de fin es requerida';
    }

    if (formData.fecha_inicio && formData.fecha_fin) {
      const start = new Date(formData.fecha_inicio + 'T00:00:00'); // Forzar hora 00:00
      const end = new Date(formData.fecha_fin + 'T00:00:00'); // Forzar hora 00:00
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      console.log('=== DATE DEBUG ===');
      console.log('start:', start);
      console.log('today:', today);
      console.log('start < today:', start < today);
      
      if (end <= start) {
        newErrors.fecha_fin = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }
      
      if (start < today) {
        newErrors.fecha_inicio = 'La fecha de inicio no puede ser en el pasado';
      }
    }

    // Validación adicional para cliente
    if (propio && (!formData.patente || !formData.id_cliente)) {
      newErrors.general = 'Error: No se pudo cargar la información del vehículo o cliente';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showNotification('Por favor, corrige los errores en el formulario', 'error');
      return;
    }

    setLoading(true);

    try {
      const rentalData = {
        ...formData,
        id_empleado: 1
      };
      console.log('Sending rental data:', rentalData); // Debug
      await onSave(rentalData);
      onClose();
    } catch (error) {
      console.error('Error saving rental:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCliente = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) {
    showNotification('Por favor, corrige los errores en el formulario', 'error');
    return;
  }

  setLoading(true);

  try {
    const rentalData = {
      patente: formData.patente,
      userId: user.userId, // Cambiar id_cliente por userId
      fecha_inicio: formData.fecha_inicio,
      fecha_fin: formData.fecha_fin,
      estado: formData.estado,
      id_empleado: 1
    };
    
    console.log('Sending rental data (cliente):', rentalData);
    await onSave(rentalData);
    onClose();
  } catch (error) {
    console.error('Error saving rental:', error);
  } finally {
    setLoading(false);
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getDuration = () => {
    if (!formData.fecha_inicio || !formData.fecha_fin) return '';
    
    const start = new Date(formData.fecha_inicio);
    const end = new Date(formData.fecha_fin);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return `${diffDays} día${diffDays !== 1 ? 's' : ''}`;
  };

  const selectedVehicle = propio ? vehicle : vehicles.find(v => v.patente === formData.patente);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {rental ? 'Editar Alquiler' : 'Nuevo Alquiler'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!propio ? 
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 inline mr-1" />
                  Cliente *
                </label>
                <select
                  name="id_cliente"
                  value={formData.id_cliente}
                  onChange={handleChange}
                  className={`input-primary ${errors.id_cliente ? 'border-red-500' : ''}`}
                  required
                >
                  <option value="">Seleccionar cliente</option>
                  {clients.map(client => (
                    <option key={client.id_cliente} value={client.id_cliente}>
                      {client.nombre} {client.apellido} - {client.nro_documento}
                    </option>
                  ))}
                </select>
                {errors.id_cliente && (
                  <p className="text-red-500 text-sm mt-1">{errors.id_cliente}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Car className="h-4 w-4 inline mr-1" />
                  Vehículo *
                </label>
                <select
                  name="patente"
                  value={formData.patente}
                  onChange={handleChange}
                  className={`input-primary ${errors.patente ? 'border-red-500' : ''}`}
                  required
                >
                  <option value="">Seleccionar vehículo</option>
                  {vehicles.map(vehicle => (
                    <option key={vehicle.patente} value={vehicle.patente}>
                      {vehicle.patente} - {vehicle.modelo} {vehicle.marca} (${vehicle.precio_flota}/día)
                    </option>
                  ))}
                </select>
                {errors.patente && (
                  <p className="text-red-500 text-sm mt-1">{errors.patente}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Fecha de Inicio *
                </label>
                <input
                  type="date"
                  name="fecha_inicio"
                  value={formData.fecha_inicio}
                  onChange={handleChange}
                  className={`input-primary ${errors.fecha_inicio ? 'border-red-500' : ''}`}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                {errors.fecha_inicio && (
                  <p className="text-red-500 text-sm mt-1">{errors.fecha_inicio}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Fecha de Fin *
                </label>
                <input
                  type="date"
                  name="fecha_fin"
                  value={formData.fecha_fin}
                  onChange={handleChange}
                  className={`input-primary ${errors.fecha_fin ? 'border-red-500' : ''}`}
                  min={formData.fecha_inicio}
                  required
                />
                {errors.fecha_fin && (
                  <p className="text-red-500 text-sm mt-1">{errors.fecha_fin}</p>
                )}
              </div>

              {rental && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="input-primary"
                  >
                    <option value="RESERVADO">Reservado</option>
                    <option value="ACTIVO">Activo</option>
                    <option value="FINALIZADO">Finalizado</option>
                    <option value="CANCELADO">Cancelado</option>
                  </select>
                </div>
              )}
            </div>

            {formData.patente && formData.fecha_inicio && formData.fecha_fin && selectedVehicle && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-3">
                  Resumen del Alquiler
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Duración:</span>
                    <p className="font-medium text-blue-900">{getDuration()}</p>
                  </div>
                  <div>
                    <span className="text-blue-700">Precio Total:</span>
                    <p className="font-medium text-green-600 flex items-center">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {calculatedPrice.toLocaleString()}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-blue-700">Vehículo Seleccionado:</span>
                    <p className="font-medium text-blue-900">
                      {selectedVehicle.modelo} - {selectedVehicle.marca}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-blue-700">Precio por día:</span>
                    <p className="font-medium text-blue-900">
                      ${selectedVehicle.precio_flota}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || Object.keys(errors).length > 0}
                className="btn-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Guardando...' : rental ? 'Actualizar' : 'Crear Alquiler'}
              </button>
            </div>
          </form> 
        : 
          <form onSubmit={handleSubmitCliente} className="p-6 space-y-6">
            {/* Mostrar error si no hay datos */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{errors.general}</p>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-medium text-blue-900 mb-3">
                Información del Alquiler
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Vehículo:</span>
                  <p className="font-medium text-blue-900">
                    {vehicle?.modelo} - {vehicle?.marca}
                  </p>
                  <p className="text-blue-600">Patente: {vehicle?.patente}</p>
                </div>
                <div>
                  <span className="text-blue-700">Cliente:</span>
                  <p className="font-medium text-blue-900">
                    {user?.nombre} {user?.apellido}
                  </p>
                  <p className="text-blue-600">ID: {user?.userId}</p> {/* Cambiar a userId */}
                </div>
                <div className="col-span-2">
                  <span className="text-blue-700">Precio por día:</span>
                  <p className="font-medium text-green-600">
                    ${vehicle?.precio_flota}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Fecha de Inicio *
                </label>
                <input
                  type="date"
                  name="fecha_inicio"
                  value={formData.fecha_inicio}
                  onChange={handleChange}
                  className={`input-primary ${errors.fecha_inicio ? 'border-red-500' : ''}`}
                  min={new Date().toLocaleDateString('en-CA')}
                  required
                />
                {errors.fecha_inicio && (
                  <p className="text-red-500 text-sm mt-1">{errors.fecha_inicio}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Fecha de Fin *
                </label>
                <input
                  type="date"
                  name="fecha_fin"
                  value={formData.fecha_fin}
                  onChange={handleChange}
                  className={`input-primary ${errors.fecha_fin ? 'border-red-500' : ''}`}
                  min={formData.fecha_inicio}
                  required
                />
                {errors.fecha_fin && (
                  <p className="text-red-500 text-sm mt-1">{errors.fecha_fin}</p>
                )}
              </div>
            </div>

            {formData.fecha_inicio && formData.fecha_fin && vehicle && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-3">
                  Resumen del Alquiler
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Duración:</span>
                    <p className="font-medium text-blue-900">{getDuration()}</p>
                  </div>
                  <div>
                    <span className="text-blue-700">Precio Total:</span>
                    <p className="font-medium text-green-600 flex items-center">
                      <DollarSign className="h-3 w-3 mr-1" />
                      {calculatedPrice.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || Object.keys(errors).length > 0 || !formData.patente || !formData.id_cliente}
                className="btn-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Guardando...' : 'Confirmar Alquiler'}
              </button>
            </div>
          </form>
        }
      </div>
    </div>
  );
};

export default RentalModal;