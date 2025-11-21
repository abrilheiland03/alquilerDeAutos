import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { rentalService } from '../../services/rentalService';
import { vehicleService } from '../../services/vehicleService';
import { clientService } from '../../services/clientService';
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  X,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Car,
  User,
  DollarSign,
  Download,
  Upload,
  ArrowUpDown,
  Users,
  MapPin
} from 'lucide-react';

// Componente de Modal para Crear/Editar Alquiler
const RentalModal = ({ isOpen, onClose, rental, onSave }) => {
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

  useEffect(() => {
    if (isOpen) {
      fetchAvailableData();
      if (rental) {
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
    }
  }, [isOpen, rental]);

  useEffect(() => {
    calculatePrice();
  }, [formData.patente, formData.fecha_inicio, formData.fecha_fin]);

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

    const selectedVehicle = vehicles.find(v => v.patente === formData.patente);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const rentalData = {
        ...formData,
        id_empleado: 1 // En un sistema real, esto vendría del usuario autenticado
      };
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cliente */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente *
              </label>
              <select
                name="id_cliente"
                value={formData.id_cliente}
                onChange={handleChange}
                className="input-primary"
                required
              >
                <option value="">Seleccionar cliente</option>
                {clients.map(client => (
                  <option key={client.id_cliente} value={client.id_cliente}>
                    {client.nombre} {client.apellido} - {client.nro_documento}
                  </option>
                ))}
              </select>
            </div>

            {/* Vehículo */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehículo *
              </label>
              <select
                name="patente"
                value={formData.patente}
                onChange={handleChange}
                className="input-primary"
                required
              >
                <option value="">Seleccionar vehículo</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle.patente} value={vehicle.patente}>
                    {vehicle.patente} - {vehicle.modelo} {vehicle.marca} (${vehicle.precio_flota}/día)
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha de Inicio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Inicio *
              </label>
              <input
                type="date"
                name="fecha_inicio"
                value={formData.fecha_inicio}
                onChange={handleChange}
                className="input-primary"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            {/* Fecha de Fin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Fin *
              </label>
              <input
                type="date"
                name="fecha_fin"
                value={formData.fecha_fin}
                onChange={handleChange}
                className="input-primary"
                min={formData.fecha_inicio}
                required
              />
            </div>

            {/* Estado (solo para edición) */}
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

          {/* Resumen del Alquiler */}
          {formData.patente && formData.fecha_inicio && formData.fecha_fin && (
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
                  <p className="font-medium text-green-600">${calculatedPrice.toLocaleString()}</p>
                </div>
                {formData.patente && (
                  <div className="md:col-span-2">
                    <span className="text-blue-700">Vehículo Seleccionado:</span>
                    <p className="font-medium text-blue-900">
                      {vehicles.find(v => v.patente === formData.patente)?.modelo} - 
                      {vehicles.find(v => v.patente === formData.patente)?.marca}
                    </p>
                  </div>
                )}
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
              disabled={loading}
              className="btn-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : rental ? 'Actualizar' : 'Crear Alquiler'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente de Tarjeta de Alquiler
const RentalCard = ({ rental, onStart, onComplete, onCancel, onDelete, onView }) => {
  const getStatusConfig = (estado) => {
    const config = {
      'Reservado': { 
        color: 'bg-blue-100 text-blue-800',
        icon: Clock,
        actions: ['start', 'cancel']
      },
      'Activo': { 
        color: 'bg-green-100 text-green-800',
        icon: Play,
        actions: ['complete']
      },
      'Atrasado': { 
        color: 'bg-red-100 text-red-800',
        icon: AlertTriangle,
        actions: ['complete']
      },
      'Finalizado': { 
        color: 'bg-gray-100 text-gray-800',
        icon: CheckCircle,
        actions: []
      },
      'Cancelado': { 
        color: 'bg-yellow-100 text-yellow-800',
        icon: XCircle,
        actions: []
      }
    };
    return config[estado] || { color: 'bg-gray-100 text-gray-800', icon: Clock, actions: [] };
  };

  const getDaysRemaining = (fechaFin) => {
    if (!fechaFin) return '';
    const today = new Date();
    const endDate = new Date(fechaFin);
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `Vencido hace ${Math.abs(diffDays)} días`;
    if (diffDays === 0) return 'Vence hoy';
    if (diffDays === 1) return '1 día restante';
    return `${diffDays} días restantes`;
  };

  const calculateTotal = (rental) => {
    const start = new Date(rental.fecha_inicio);
    const end = new Date(rental.fecha_fin);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // En un sistema real, esto vendría del backend con multas y daños incluidos
    return diffDays * (rental.precio_flota || 0);
  };

  const statusConfig = getStatusConfig(rental.estado_desc);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Alquiler #{rental.id_alquiler}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {rental.modelo} - {rental.patente}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span className={`status-badge ${statusConfig.color} flex items-center`}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {rental.estado_desc}
            </span>
            {(rental.estado_desc === 'Reservado' || rental.estado_desc === 'Activo') && (
              <span className="text-xs text-gray-500 mt-1">
                {getDaysRemaining(rental.fecha_fin)}
              </span>
            )}
          </div>
        </div>

        {/* Información del alquiler */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Cliente:</span>
            <span className="font-medium text-right">
              {rental.nombre_cliente || 'Cliente'}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Período:</span>
            <span className="font-medium">
              {new Date(rental.fecha_inicio).toLocaleDateString()} - {new Date(rental.fecha_fin).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Duración:</span>
            <span className="font-medium">
              {Math.ceil((new Date(rental.fecha_fin) - new Date(rental.fecha_inicio)) / (1000 * 60 * 60 * 24))} días
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Precio Total:</span>
            <span className="font-medium text-green-600">
              ${calculateTotal(rental).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => onView(rental)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver Detalles
          </button>
          <div className="flex items-center space-x-2">
            {/* Acciones según estado */}
            {statusConfig.actions.includes('start') && (
              <button
                onClick={() => onStart(rental)}
                className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                title="Comenzar Alquiler"
              >
                <Play className="h-4 w-4" />
              </button>
            )}
            {statusConfig.actions.includes('complete') && (
              <button
                onClick={() => onComplete(rental)}
                className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                title="Finalizar Alquiler"
              >
                <CheckCircle className="h-4 w-4" />
              </button>
            )}
            {statusConfig.actions.includes('cancel') && (
              <button
                onClick={() => onCancel(rental)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Cancelar Alquiler"
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => onDelete(rental)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Eliminar"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const RentalManagement = () => {
  const { user, hasPermission } = useAuth();
  const { showNotification } = useNotification();
  const [rentals, setRentals] = useState([]);
  const [filteredRentals, setFilteredRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [view, setView] = useState('grid');

  const canEdit = hasPermission('empleado');
  const canDelete = hasPermission('admin');
  const isClient = user?.userRole?.toLowerCase() === 'cliente';

  useEffect(() => {
    fetchRentals();
  }, []);

  useEffect(() => {
    filterRentals();
  }, [rentals, searchTerm, statusFilter]);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const rentalsData = await rentalService.getAll();
      
      // Enriquecer datos para mejor visualización
      const enrichedRentals = rentalsData.map(rental => ({
        ...rental,
        nombre_cliente: `Cliente #${rental.id_cliente}`, // En sistema real vendría del backend
        precio_flota: 25000 // Valor por defecto, en sistema real vendría del vehículo
      }));
      
      setRentals(enrichedRentals);
    } catch (error) {
      console.error('Error fetching rentals:', error);
      showNotification('Error al cargar los alquileres', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterRentals = () => {
    let filtered = rentals;

    // Si es cliente, mostrar solo sus alquileres
    if (isClient) {
      filtered = filtered.filter(rental => 
        rental.id_cliente === user.userId // Asumiendo que el userId del cliente coincide
      );
    }

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(rental =>
        rental.patente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.id_alquiler.toString().includes(searchTerm)
      );
    }

    // Filtro por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(rental => 
        rental.estado_desc === statusFilter
      );
    }

    setFilteredRentals(filtered);
  };

  const handleCreateRental = async (rentalData) => {
    try {
      await rentalService.create(rentalData);
      showNotification('Alquiler creado exitosamente', 'success');
      fetchRentals();
    } catch (error) {
      console.error('Error creating rental:', error);
      if (error.response?.data?.error) {
        showNotification(error.response.data.error, 'error');
      } else {
        showNotification('Error al crear el alquiler', 'error');
      }
      throw error;
    }
  };

  const handleStartRental = async (rental) => {
    try {
      await rentalService.start(rental.id_alquiler);
      showNotification('Alquiler iniciado exitosamente', 'success');
      fetchRentals();
    } catch (error) {
      console.error('Error starting rental:', error);
      showNotification('Error al iniciar el alquiler', 'error');
    }
  };

  const handleCompleteRental = async (rental) => {
    try {
      await rentalService.complete(rental.id_alquiler);
      showNotification('Alquiler finalizado exitosamente', 'success');
      fetchRentals();
    } catch (error) {
      console.error('Error completing rental:', error);
      showNotification('Error al finalizar el alquiler', 'error');
    }
  };

  const handleCancelRental = async (rental) => {
    if (!window.confirm(`¿Estás seguro de que deseas cancelar el alquiler #${rental.id_alquiler}?`)) {
      return;
    }

    try {
      await rentalService.cancel(rental.id_alquiler);
      showNotification('Alquiler cancelado exitosamente', 'success');
      fetchRentals();
    } catch (error) {
      console.error('Error canceling rental:', error);
      showNotification('Error al cancelar el alquiler', 'error');
    }
  };

  const handleDeleteRental = async (rental) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el alquiler #${rental.id_alquiler}?`)) {
      return;
    }

    try {
      await rentalService.delete(rental.id_alquiler);
      showNotification('Alquiler eliminado exitosamente', 'success');
      fetchRentals();
    } catch (error) {
      console.error('Error deleting rental:', error);
      showNotification('Error al eliminar el alquiler', 'error');
    }
  };

  const handleSaveRental = async (rentalData) => {
    if (selectedRental) {
      // Lógica para actualizar (no implementada en el backend inicial)
      showNotification('Función de edición no disponible temporalmente', 'warning');
    } else {
      await handleCreateRental(rentalData);
    }
  };

  const openModal = (rental = null) => {
    setSelectedRental(rental);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRental(null);
    setModalOpen(false);
  };

  const getRentalStats = () => {
    const total = rentals.length;
    const active = rentals.filter(r => r.estado_desc === 'Activo').length;
    const reserved = rentals.filter(r => r.estado_desc === 'Reservado').length;
    const overdue = rentals.filter(r => r.estado_desc === 'Atrasado').length;

    return { total, active, reserved, overdue };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando alquileres...</p>
        </div>
      </div>
    );
  }

  const stats = getRentalStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isClient ? 'Mis Alquileres' : 'Gestión de Alquileres'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isClient 
              ? 'Consulta el estado de tus alquileres actuales e históricos' 
              : 'Administra los alquileres de la flota de vehículos'
            }
          </p>
        </div>
        {canEdit && !isClient && (
          <button
            onClick={() => openModal()}
            className="mt-4 sm:mt-0 btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Alquiler
          </button>
        )}
      </div>

      {/* Estadísticas (solo para empleados/admins) */}
      {!isClient && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.reserved}</div>
            <div className="text-sm text-gray-600">Reservados</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-gray-600">Activos</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <div className="text-sm text-gray-600">Atrasados</div>
          </div>
        </div>
      )}

      {/* Filtros y Búsqueda */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Búsqueda */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={isClient ? "Buscar mis alquileres..." : "Buscar por patente, modelo o ID..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-primary pl-10"
              />
            </div>
          </div>

          {/* Filtros y Vistas */}
          <div className="flex items-center space-x-4">
            {/* Filtro por Estado */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-primary"
            >
              <option value="all">Todos los estados</option>
              <option value="Reservado">Reservado</option>
              <option value="Activo">Activo</option>
              <option value="Atrasado">Atrasado</option>
              <option value="Finalizado">Finalizado</option>
              <option value="Cancelado">Cancelado</option>
            </select>

            {/* Botones de Vista */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setView('grid')}
                className={`p-2 ${view === 'grid' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600'}`}
              >
                <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                  <div className="bg-current rounded-sm"></div>
                </div>
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 ${view === 'list' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600'}`}
              >
                <div className="w-4 h-4 flex flex-col space-y-0.5">
                  <div className="bg-current h-1 rounded-sm"></div>
                  <div className="bg-current h-1 rounded-sm"></div>
                  <div className="bg-current h-1 rounded-sm"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Alquileres */}
      {filteredRentals.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isClient ? 'No tienes alquileres' : 'No se encontraron alquileres'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'Intenta ajustar los filtros de búsqueda' 
              : isClient 
                ? 'Comienza reservando tu primer vehículo' 
                : 'No hay alquileres registrados en el sistema'
            }
          </p>
          {canEdit && !searchTerm && statusFilter === 'all' && !isClient && (
            <button
              onClick={() => openModal()}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear Primer Alquiler
            </button>
          )}
        </div>
      ) : (
        <div className={
          view === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
        }>
          {filteredRentals.map(rental => (
            view === 'grid' ? (
              <RentalCard
                key={rental.id_alquiler}
                rental={rental}
                onStart={canEdit ? handleStartRental : null}
                onComplete={canEdit ? handleCompleteRental : null}
                onCancel={canEdit || isClient ? handleCancelRental : null}
                onDelete={canDelete ? handleDeleteRental : null}
                onView={() => openModal(rental)}
              />
            ) : (
              <div key={rental.id_alquiler} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Calendar className="h-10 w-10 text-orange-500" />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Alquiler #{rental.id_alquiler}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {rental.modelo} - {rental.patente} • {new Date(rental.fecha_inicio).toLocaleDateString()} - {new Date(rental.fecha_fin).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`status-badge ${getStatusConfig(rental.estado_desc).color}`}>
                      {rental.estado_desc}
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      ${calculateTotal(rental).toLocaleString()}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openModal(rental)}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {canEdit && (
                        <>
                          {getStatusConfig(rental.estado_desc).actions.includes('start') && (
                            <button
                              onClick={() => handleStartRental(rental)}
                              className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <Play className="h-4 w-4" />
                            </button>
                          )}
                          {getStatusConfig(rental.estado_desc).actions.includes('complete') && (
                            <button
                              onClick={() => handleCompleteRental(rental)}
                              className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                        </>
                      )}
                      {(canEdit || isClient) && getStatusConfig(rental.estado_desc).actions.includes('cancel') && (
                        <button
                          onClick={() => handleCancelRental(rental)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDeleteRental(rental)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {/* Modal */}
      <RentalModal
        isOpen={modalOpen}
        onClose={closeModal}
        rental={selectedRental}
        onSave={handleSaveRental}
      />
    </div>
  );
};

// Helper function para obtener configuración de estado
const getStatusConfig = (estado) => {
  const config = {
    'Reservado': { color: 'bg-blue-100 text-blue-800', actions: ['start', 'cancel'] },
    'Activo': { color: 'bg-green-100 text-green-800', actions: ['complete'] },
    'Atrasado': { color: 'bg-red-100 text-red-800', actions: ['complete'] },
    'Finalizado': { color: 'bg-gray-100 text-gray-800', actions: [] },
    'Cancelado': { color: 'bg-yellow-100 text-yellow-800', actions: [] }
  };
  return config[estado] || { color: 'bg-gray-100 text-gray-800', actions: [] };
};

// Helper function para calcular total
const calculateTotal = (rental) => {
  const start = new Date(rental.fecha_inicio);
  const end = new Date(rental.fecha_fin);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays * (rental.precio_flota || 25000);
};

export default RentalManagement;