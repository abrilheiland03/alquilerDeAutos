import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import axios from 'axios';
import { 
  Car, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  X,
  CheckCircle,
  XCircle,
  Wrench,
  Calendar,
  Users,
  ArrowUpDown,
  Download,
  Upload
} from 'lucide-react';

// URL base de la API
const API_BASE_URL = 'http://localhost:5000/api';

// Componente de Modal para Crear/Editar Vehículo
const VehicleModal = ({ isOpen, onClose, vehicle, onSave }) => {
  const [formData, setFormData] = useState({
    patente: '',
    modelo: '',
    id_marca: '',
    anio: new Date().getFullYear(),
    precio_flota: '',
    asientos: 5,
    puertas: 4,
    caja_manual: false,
    id_estado: 1,
    id_color: ''
  });
  const [marcas, setMarcas] = useState([]);
  const [colores, setColores] = useState([]);
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCatalogos();
      if (vehicle) {
        setFormData({
          patente: vehicle.patente || '',
          modelo: vehicle.modelo || '',
          id_marca: vehicle.id_marca || '',
          anio: vehicle.anio || new Date().getFullYear(),
          precio_flota: vehicle.precio_flota || '',
          asientos: vehicle.asientos || 5,
          puertas: vehicle.puertas || 4,
          caja_manual: vehicle.caja_manual || false,
          id_estado: vehicle.id_estado || 1,
          id_color: vehicle.id_color || ''
        });
      } else {
        setFormData({
          patente: '',
          modelo: '',
          id_marca: '',
          anio: new Date().getFullYear(),
          precio_flota: '',
          asientos: 5,
          puertas: 4,
          caja_manual: false,
          id_estado: 1,
          id_color: ''
        });
      }
    }
  }, [isOpen, vehicle]);

  const fetchCatalogos = async () => {
    try {
      const [marcasRes, coloresRes, estadosRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/marcas`),
        axios.get(`${API_BASE_URL}/colores`),
        axios.get(`${API_BASE_URL}/estados-auto`)
      ]);
      
      setMarcas(marcasRes.data);
      setColores(coloresRes.data);
      setEstados(estadosRes.data);
    } catch (error) {
      console.error('Error fetching catalogos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving vehicle:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {vehicle ? 'Editar Vehículo' : 'Nuevo Vehículo'}
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
            {/* Patente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patente *
              </label>
              <input
                type="text"
                name="patente"
                value={formData.patente}
                onChange={handleChange}
                className="input-primary"
                placeholder="AA123BB"
                required
                disabled={!!vehicle} // No se puede editar patente en edición
              />
            </div>

            {/* Modelo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modelo *
              </label>
              <input
                type="text"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                className="input-primary"
                placeholder="Corolla, Focus, etc."
                required
              />
            </div>

            {/* Marca */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Marca *
              </label>
              <select
                name="id_marca"
                value={formData.id_marca}
                onChange={handleChange}
                className="input-primary"
                required
              >
                <option value="">Seleccionar marca</option>
                {marcas.map(marca => (
                  <option key={marca.id_marca} value={marca.id_marca}>
                    {marca.descripcion}
                  </option>
                ))}
              </select>
            </div>

            {/* Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color *
              </label>
              <select
                name="id_color"
                value={formData.id_color}
                onChange={handleChange}
                className="input-primary"
                required
              >
                <option value="">Seleccionar color</option>
                {colores.map(color => (
                  <option key={color.id_color} value={color.id_color}>
                    {color.descripcion}
                  </option>
                ))}
              </select>
            </div>

            {/* Año */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Año *
              </label>
              <input
                type="number"
                name="anio"
                value={formData.anio}
                onChange={handleChange}
                className="input-primary"
                min="2000"
                max={new Date().getFullYear() + 1}
                required
              />
            </div>

            {/* Precio Flota */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio por Día ($) *
              </label>
              <input
                type="number"
                name="precio_flota"
                value={formData.precio_flota}
                onChange={handleChange}
                className="input-primary"
                placeholder="25000"
                step="0.01"
                min="0"
                required
              />
            </div>

            {/* Asientos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Asientos *
              </label>
              <input
                type="number"
                name="asientos"
                value={formData.asientos}
                onChange={handleChange}
                className="input-primary"
                min="2"
                max="9"
                required
              />
            </div>

            {/* Puertas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Puertas *
              </label>
              <input
                type="number"
                name="puertas"
                value={formData.puertas}
                onChange={handleChange}
                className="input-primary"
                min="2"
                max="5"
                required
              />
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado *
              </label>
              <select
                name="id_estado"
                value={formData.id_estado}
                onChange={handleChange}
                className="input-primary"
                required
              >
                {estados.map(estado => (
                  <option key={estado.id_estado} value={estado.id_estado}>
                    {estado.descripcion}
                  </option>
                ))}
              </select>
            </div>

            {/* Caja Manual */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="caja_manual"
                checked={formData.caja_manual}
                onChange={handleChange}
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label className="text-sm font-medium text-gray-700">
                Caja Manual
              </label>
            </div>
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
              {loading ? 'Guardando...' : vehicle ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente de Tarjeta de Vehículo
const VehicleCard = ({ vehicle, onEdit, onDelete, onView }) => {
  const getStatusBadge = (estado) => {
    const statusMap = {
      'Libre': 'status-free',
      'Ocupado': 'status-occupied',
      'En mantenimiento': 'status-maintenance'
    };
    return statusMap[estado] || 'status-free';
  };

  const getTransmissionText = (cajaManual) => {
    return cajaManual ? 'Manual' : 'Automática';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{vehicle.modelo}</h3>
            <p className="text-sm text-gray-500">{vehicle.marca}</p>
          </div>
          <span className={`status-badge ${getStatusBadge(vehicle.estado)}`}>
            {vehicle.estado}
          </span>
        </div>

        {/* Información del vehículo */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Patente:</span>
            <span className="font-medium">{vehicle.patente}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Año:</span>
            <span className="font-medium">{vehicle.anio}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Color:</span>
            <span className="font-medium">{vehicle.color}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Transmisión:</span>
            <span className="font-medium">{getTransmissionText(vehicle.caja_manual)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Precio/día:</span>
            <span className="font-medium text-green-600">${vehicle.precio_flota}</span>
          </div>
        </div>

        {/* Especificaciones */}
        <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-200 pt-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>{vehicle.asientos} asientos</span>
            </div>
            <div className="flex items-center">
              <Car className="h-4 w-4 mr-1" />
              <span>{vehicle.puertas} puertas</span>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => onView(vehicle)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(vehicle)}
              className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
              title="Editar"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(vehicle)}
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

const VehicleManagement = () => {
  const { hasPermission } = useAuth();
  const { showNotification } = useNotification();
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [view, setView] = useState('grid'); // 'grid' or 'list'

  const canEdit = hasPermission('empleado');
  const canDelete = hasPermission('admin');

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    filterVehicles();
  }, [vehicles, searchTerm, statusFilter]);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/vehiculos`);
      setVehicles(response.data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      showNotification('Error al cargar los vehículos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterVehicles = () => {
    let filtered = vehicles;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.patente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.marca.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.estado === statusFilter);
    }

    setFilteredVehicles(filtered);
  };

  const handleCreateVehicle = async (vehicleData) => {
    try {
      await axios.post(`${API_BASE_URL}/vehiculos`, vehicleData);
      showNotification('Vehículo creado exitosamente', 'success');
      fetchVehicles();
    } catch (error) {
      console.error('Error creating vehicle:', error);
      showNotification('Error al crear el vehículo', 'error');
      throw error;
    }
  };

  const handleUpdateVehicle = async (vehicleData) => {
    try {
      await axios.put(`${API_BASE_URL}/vehiculos/${selectedVehicle.patente}`, vehicleData);
      showNotification('Vehículo actualizado exitosamente', 'success');
      fetchVehicles();
    } catch (error) {
      console.error('Error updating vehicle:', error);
      showNotification('Error al actualizar el vehículo', 'error');
      throw error;
    }
  };

  const handleDeleteVehicle = async (vehicle) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el vehículo ${vehicle.patente}?`)) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/vehiculos/${vehicle.patente}`);
      showNotification('Vehículo eliminado exitosamente', 'success');
      fetchVehicles();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      showNotification('Error al eliminar el vehículo', 'error');
    }
  };

  const handleSaveVehicle = async (vehicleData) => {
    if (selectedVehicle) {
      await handleUpdateVehicle(vehicleData);
    } else {
      await handleCreateVehicle(vehicleData);
    }
  };

  const openModal = (vehicle = null) => {
    setSelectedVehicle(vehicle);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedVehicle(null);
    setModalOpen(false);
  };

  const getStatusOptions = () => {
    const statuses = [...new Set(vehicles.map(v => v.estado))];
    return ['all', ...statuses];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando vehículos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Vehículos</h1>
          <p className="text-gray-600 mt-1">
            Administra la flota de vehículos de IngRide
          </p>
        </div>
        {canEdit && (
          <button
            onClick={() => openModal()}
            className="mt-4 sm:mt-0 btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Vehículo
          </button>
        )}
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
                placeholder="Buscar por patente, modelo o marca..."
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
              <option value="Libre">Libre</option>
              <option value="Ocupado">Ocupado</option>
              <option value="En mantenimiento">En mantenimiento</option>
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

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{vehicles.length}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {vehicles.filter(v => v.estado === 'Libre').length}
          </div>
          <div className="text-sm text-gray-600">Disponibles</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {vehicles.filter(v => v.estado === 'Ocupado').length}
          </div>
          <div className="text-sm text-gray-600">Ocupados</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {vehicles.filter(v => v.estado === 'En mantenimiento').length}
          </div>
          <div className="text-sm text-gray-600">Mantenimiento</div>
        </div>
      </div>

      {/* Lista de Vehículos */}
      {filteredVehicles.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron vehículos</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'Intenta ajustar los filtros de búsqueda' 
              : 'No hay vehículos registrados en el sistema'
            }
          </p>
          {canEdit && !searchTerm && statusFilter === 'all' && (
            <button
              onClick={() => openModal()}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Primer Vehículo
            </button>
          )}
        </div>
      ) : (
        <div className={
          view === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
        }>
          {filteredVehicles.map(vehicle => (
            view === 'grid' ? (
              <VehicleCard
                key={vehicle.patente}
                vehicle={vehicle}
                onEdit={canEdit ? openModal : null}
                onDelete={canDelete ? handleDeleteVehicle : null}
                onView={() => openModal(vehicle)}
              />
            ) : (
              <div key={vehicle.patente} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Car className="h-10 w-10 text-orange-500" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{vehicle.modelo}</h3>
                      <p className="text-sm text-gray-600">{vehicle.marca} • {vehicle.patente}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`status-badge ${getStatusBadge(vehicle.estado)}`}>
                      {vehicle.estado}
                    </span>
                    <span className="text-sm font-medium text-green-600">
                      ${vehicle.precio_flota}/día
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openModal(vehicle)}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {canEdit && (
                        <button
                          onClick={() => openModal(vehicle)}
                          className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDeleteVehicle(vehicle)}
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
      <VehicleModal
        isOpen={modalOpen}
        onClose={closeModal}
        vehicle={selectedVehicle}
        onSave={handleSaveVehicle}
      />
    </div>
  );
};

export default VehicleManagement;