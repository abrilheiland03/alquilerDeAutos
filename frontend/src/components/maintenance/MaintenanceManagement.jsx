import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import axios from 'axios';
import { 
  Wrench, 
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
  Calendar,
  User,
  Download,
  Upload,
  ArrowUpDown
} from 'lucide-react';

// URL base de la API
const API_BASE_URL = 'http://localhost:5000/api';

// Componente de Modal para Crear/Editar Mantenimiento
const MaintenanceModal = ({ isOpen, onClose, maintenance, onSave }) => {
  const [formData, setFormData] = useState({
    patente: '',
    fecha_inicio: '',
    fecha_fin: '',
    detalle: ''
  });
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAvailableVehicles();
      if (maintenance) {
        setFormData({
          patente: maintenance.patente || '',
          fecha_inicio: maintenance.fecha_inicio?.split('T')[0] || '',
          fecha_fin: maintenance.fecha_fin?.split('T')[0] || '',
          detalle: maintenance.detalle || ''
        });
      } else {
        const today = new Date().toISOString().split('T')[0];
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        const nextWeekFormatted = nextWeek.toISOString().split('T')[0];
        
        setFormData({
          patente: '',
          fecha_inicio: today,
          fecha_fin: nextWeekFormatted,
          detalle: ''
        });
      }
    }
  }, [isOpen, maintenance]);

  const fetchAvailableVehicles = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/vehiculos`);
      // Filtrar solo vehículos libres para mantenimiento
      const availableVehicles = response.data.filter(vehicle => 
        vehicle.estado === 'Libre' || vehicle.estado === 'En mantenimiento'
      );
      setVehicles(availableVehicles);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving maintenance:', error);
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

  const calculateDuration = () => {
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
            {maintenance ? 'Editar Mantenimiento' : 'Programar Mantenimiento'}
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
                disabled={!!maintenance} // No cambiar vehículo en edición
              >
                <option value="">Seleccionar vehículo</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle.patente} value={vehicle.patente}>
                    {vehicle.patente} - {vehicle.modelo} {vehicle.marca} ({vehicle.estado})
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
                Fecha de Fin Estimada *
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
              {formData.fecha_inicio && formData.fecha_fin && (
                <p className="text-sm text-gray-500 mt-1">
                  Duración estimada: {calculateDuration()}
                </p>
              )}
            </div>

            {/* Detalle */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detalle del Mantenimiento *
              </label>
              <textarea
                name="detalle"
                value={formData.detalle}
                onChange={handleChange}
                rows={4}
                className="input-primary"
                placeholder="Describa el tipo de mantenimiento, repuestos necesarios, observaciones..."
                required
              />
            </div>
          </div>

          {/* Información Adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              Información importante:
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• El vehículo quedará marcado como "En mantenimiento" durante este período</li>
              <li>• No podrá ser alquilado hasta que el mantenimiento finalice</li>
              <li>• Verifique que las fechas no se superpongan con alquileres existentes</li>
            </ul>
          </div>

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
              {loading ? 'Guardando...' : maintenance ? 'Actualizar' : 'Programar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente de Tarjeta de Mantenimiento
const MaintenanceCard = ({ maintenance, onStart, onComplete, onCancel, onDelete, onView }) => {
  const getStatusConfig = (estado) => {
    const config = {
      'Realizando': { 
        color: 'bg-orange-100 text-orange-800',
        icon: Play,
        actions: ['complete']
      },
      'Finalizado': { 
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle,
        actions: []
      },
      'Pendiente': { 
        color: 'bg-blue-100 text-blue-800',
        icon: Clock,
        actions: ['start', 'cancel']
      },
      'Cancelado': { 
        color: 'bg-red-100 text-red-800',
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

  const statusConfig = getStatusConfig(maintenance.estado_desc);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {maintenance.modelo} - {maintenance.patente}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Mantenimiento #{maintenance.id_mantenimiento}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span className={`status-badge ${statusConfig.color} flex items-center`}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {maintenance.estado_desc}
            </span>
            {maintenance.estado_desc === 'Pendiente' && (
              <span className="text-xs text-gray-500 mt-1">
                {getDaysRemaining(maintenance.fecha_fin)}
              </span>
            )}
          </div>
        </div>

        {/* Información del mantenimiento */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Período:</span>
            <span className="font-medium">
              {new Date(maintenance.fecha_inicio).toLocaleDateString()} - {new Date(maintenance.fecha_fin).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Duración:</span>
            <span className="font-medium">
              {Math.ceil((new Date(maintenance.fecha_fin) - new Date(maintenance.fecha_inicio)) / (1000 * 60 * 60 * 24))} días
            </span>
          </div>
          <div className="text-sm">
            <span className="text-gray-600 block mb-1">Detalle:</span>
            <p className="text-gray-900 line-clamp-2">{maintenance.detalle}</p>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => onView(maintenance)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver Detalles
          </button>
          <div className="flex items-center space-x-2">
            {/* Acciones según estado */}
            {statusConfig.actions.includes('start') && (
              <button
                onClick={() => onStart(maintenance)}
                className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                title="Iniciar Mantenimiento"
              >
                <Play className="h-4 w-4" />
              </button>
            )}
            {statusConfig.actions.includes('complete') && (
              <button
                onClick={() => onComplete(maintenance)}
                className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                title="Finalizar Mantenimiento"
              >
                <CheckCircle className="h-4 w-4" />
              </button>
            )}
            {statusConfig.actions.includes('cancel') && (
              <button
                onClick={() => onCancel(maintenance)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Cancelar Mantenimiento"
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => onDelete(maintenance)}
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

const MaintenanceManagement = () => {
  const { hasPermission } = useAuth();
  const { showNotification } = useNotification();
  const [maintenances, setMaintenances] = useState([]);
  const [filteredMaintenances, setFilteredMaintenances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [view, setView] = useState('grid');

  const canEdit = hasPermission('empleado');
  const canDelete = hasPermission('admin');

  useEffect(() => {
    fetchMaintenances();
  }, []);

  useEffect(() => {
    filterMaintenances();
  }, [maintenances, searchTerm, statusFilter]);

  const fetchMaintenances = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/mantenimientos`);
      setMaintenances(response.data);
    } catch (error) {
      console.error('Error fetching maintenances:', error);
      showNotification('Error al cargar los mantenimientos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterMaintenances = () => {
    let filtered = maintenances;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(maintenance =>
        maintenance.patente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        maintenance.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        maintenance.detalle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(maintenance => 
        maintenance.estado_desc === statusFilter
      );
    }

    setFilteredMaintenances(filtered);
  };

  const handleCreateMaintenance = async (maintenanceData) => {
    try {
      await axios.post(`${API_BASE_URL}/mantenimientos`, maintenanceData);
      showNotification('Mantenimiento programado exitosamente', 'success');
      fetchMaintenances();
    } catch (error) {
      console.error('Error creating maintenance:', error);
      if (error.response?.data?.error) {
        showNotification(error.response.data.error, 'error');
      } else {
        showNotification('Error al programar el mantenimiento', 'error');
      }
      throw error;
    }
  };

  const handleUpdateMaintenance = async (maintenanceData) => {
    try {
      await axios.put(`${API_BASE_URL}/mantenimientos/${selectedMaintenance.id_mantenimiento}`, maintenanceData);
      showNotification('Mantenimiento actualizado exitosamente', 'success');
      fetchMaintenances();
    } catch (error) {
      console.error('Error updating maintenance:', error);
      showNotification('Error al actualizar el mantenimiento', 'error');
      throw error;
    }
  };

  const handleStartMaintenance = async (maintenance) => {
    try {
      await axios.post(`${API_BASE_URL}/mantenimientos/${maintenance.id_mantenimiento}/iniciar`);
      showNotification('Mantenimiento iniciado exitosamente', 'success');
      fetchMaintenances();
    } catch (error) {
      console.error('Error starting maintenance:', error);
      showNotification('Error al iniciar el mantenimiento', 'error');
    }
  };

  const handleCompleteMaintenance = async (maintenance) => {
    try {
      await axios.post(`${API_BASE_URL}/mantenimientos/${maintenance.id_mantenimiento}/finalizar`);
      showNotification('Mantenimiento finalizado exitosamente', 'success');
      fetchMaintenances();
    } catch (error) {
      console.error('Error completing maintenance:', error);
      showNotification('Error al finalizar el mantenimiento', 'error');
    }
  };

  const handleCancelMaintenance = async (maintenance) => {
    if (!window.confirm(`¿Estás seguro de que deseas cancelar el mantenimiento de ${maintenance.patente}?`)) {
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/mantenimientos/${maintenance.id_mantenimiento}/cancelar`);
      showNotification('Mantenimiento cancelado exitosamente', 'success');
      fetchMaintenances();
    } catch (error) {
      console.error('Error canceling maintenance:', error);
      showNotification('Error al cancelar el mantenimiento', 'error');
    }
  };

  const handleDeleteMaintenance = async (maintenance) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el mantenimiento de ${maintenance.patente}?`)) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/mantenimientos/${maintenance.id_mantenimiento}`);
      showNotification('Mantenimiento eliminado exitosamente', 'success');
      fetchMaintenances();
    } catch (error) {
      console.error('Error deleting maintenance:', error);
      showNotification('Error al eliminar el mantenimiento', 'error');
    }
  };

  const handleSaveMaintenance = async (maintenanceData) => {
    if (selectedMaintenance) {
      await handleUpdateMaintenance(maintenanceData);
    } else {
      await handleCreateMaintenance(maintenanceData);
    }
  };

  const openModal = (maintenance = null) => {
    setSelectedMaintenance(maintenance);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMaintenance(null);
    setModalOpen(false);
  };

  const getMaintenanceStats = () => {
    const total = maintenances.length;
    const pending = maintenances.filter(m => m.estado_desc === 'Pendiente').length;
    const inProgress = maintenances.filter(m => m.estado_desc === 'Realizando').length;
    const completed = maintenances.filter(m => m.estado_desc === 'Finalizado').length;

    return { total, pending, inProgress, completed };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando mantenimientos...</p>
        </div>
      </div>
    );
  }

  const stats = getMaintenanceStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Mantenimientos</h1>
          <p className="text-gray-600 mt-1">
            Programa y gestiona el mantenimiento de la flota de vehículos
          </p>
        </div>
        {canEdit && (
          <button
            onClick={() => openModal()}
            className="mt-4 sm:mt-0 btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Programar Mantenimiento
          </button>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pendientes</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{stats.inProgress}</div>
          <div className="text-sm text-gray-600">En Curso</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-gray-600">Finalizados</div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Búsqueda */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por patente, modelo o detalle..."
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
              <option value="Pendiente">Pendiente</option>
              <option value="Realizando">En Curso</option>
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

      {/* Lista de Mantenimientos */}
      {filteredMaintenances.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Wrench className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron mantenimientos</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'Intenta ajustar los filtros de búsqueda' 
              : 'No hay mantenimientos programados en el sistema'
            }
          </p>
          {canEdit && !searchTerm && statusFilter === 'all' && (
            <button
              onClick={() => openModal()}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Programar Primer Mantenimiento
            </button>
          )}
        </div>
      ) : (
        <div className={
          view === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
        }>
          {filteredMaintenances.map(maintenance => (
            view === 'grid' ? (
              <MaintenanceCard
                key={maintenance.id_mantenimiento}
                maintenance={maintenance}
                onStart={canEdit ? handleStartMaintenance : null}
                onComplete={canEdit ? handleCompleteMaintenance : null}
                onCancel={canEdit ? handleCancelMaintenance : null}
                onDelete={canDelete ? handleDeleteMaintenance : null}
                onView={() => openModal(maintenance)}
              />
            ) : (
              <div key={maintenance.id_mantenimiento} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Wrench className="h-10 w-10 text-orange-500" />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {maintenance.modelo} - {maintenance.patente}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {maintenance.detalle} • {new Date(maintenance.fecha_inicio).toLocaleDateString()} - {new Date(maintenance.fecha_fin).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`status-badge ${getStatusConfig(maintenance.estado_desc).color}`}>
                      {maintenance.estado_desc}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openModal(maintenance)}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {canEdit && (
                        <>
                          {getStatusConfig(maintenance.estado_desc).actions.includes('start') && (
                            <button
                              onClick={() => handleStartMaintenance(maintenance)}
                              className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <Play className="h-4 w-4" />
                            </button>
                          )}
                          {getStatusConfig(maintenance.estado_desc).actions.includes('complete') && (
                            <button
                              onClick={() => handleCompleteMaintenance(maintenance)}
                              className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          {getStatusConfig(maintenance.estado_desc).actions.includes('cancel') && (
                            <button
                              onClick={() => handleCancelMaintenance(maintenance)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}
                        </>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDeleteMaintenance(maintenance)}
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
      <MaintenanceModal
        isOpen={modalOpen}
        onClose={closeModal}
        maintenance={selectedMaintenance}
        onSave={handleSaveMaintenance}
      />
    </div>
  );
};

// Helper function para obtener configuración de estado
const getStatusConfig = (estado) => {
  const config = {
    'Realizando': { color: 'bg-orange-100 text-orange-800' },
    'Finalizado': { color: 'bg-green-100 text-green-800' },
    'Pendiente': { color: 'bg-blue-100 text-blue-800' },
    'Cancelado': { color: 'bg-red-100 text-red-800' }
  };
  return config[estado] || { color: 'bg-gray-100 text-gray-800' };
};

export default MaintenanceManagement;