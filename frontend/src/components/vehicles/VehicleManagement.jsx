import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { vehicleService } from '../../services/vehicleService';
import { catalogService } from '../../services/catalogService';
import RentalModal from '../rentals/shared/RentalModal';
import {rentalService} from '../../services/rentalService';
import RentalDateSelector from '../rentals/RentalDateSelector';
import { 
  Car, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  X,
  Calendar,
  Users,
  ArrowLeft
} from 'lucide-react';

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
  const [catalogosLoaded, setCatalogosLoaded] = useState(false);

  // Cargar catálogos solo una vez cuando se abre el modal
  useEffect(() => {
    if (isOpen && !catalogosLoaded) {
      fetchCatalogos();
    }
  }, [isOpen, catalogosLoaded]);

  // Actualizar formData cuando vehicle cambie Y los catálogos estén cargados
  useEffect(() => {
    if (isOpen && catalogosLoaded && vehicle) {
      const findMarcaId = (marcaDescripcion) => {
        const marca = marcas.find(m => m.descripcion === marcaDescripcion);
        return marca ? marca.id_marca : '';
      };

      const findColorId = (colorDescripcion) => {
        const color = colores.find(c => c.descripcion === colorDescripcion);
        return color ? color.id_color : '';
      };

      const findEstadoId = (estadoDescripcion) => {
        const estado = estados.find(e => e.descripcion === estadoDescripcion);
        return estado ? estado.id_estado : 1;
      };

      const updatedFormData = {
        patente: vehicle.patente || '',
        modelo: vehicle.modelo || '',
        anio: vehicle.anio || new Date().getFullYear(),
        precio_flota: vehicle.precio_flota || '',
        asientos: vehicle.asientos || 5,
        puertas: vehicle.puertas || 4,
        caja_manual: vehicle.caja_manual || false,
        id_marca: findMarcaId(vehicle.marca),
        id_estado: findEstadoId(vehicle.estado),
        id_color: findColorId(vehicle.color)
      };
      
      setFormData(updatedFormData);
    } else if (isOpen && !vehicle) {
      // Resetear a valores por defecto cuando es un nuevo vehículo
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
  }, [isOpen, vehicle, catalogosLoaded, marcas, colores, estados]);

  const fetchCatalogos = async () => {
    try {
      const [marcasData, coloresData, estadosData] = await Promise.all([
        catalogService.getBrands(),
        catalogService.getColors(),
        catalogService.getVehicleStates()
      ]);
      
      setMarcas(marcasData);
      setColores(coloresData);
      setEstados(estadosData);
      setCatalogosLoaded(true);
    } catch (error) {
      console.error('Error fetching catalogos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que todos los campos requeridos estén llenos
    if (!formData.patente || !formData.modelo || !formData.id_marca || 
        !formData.id_color || !formData.id_estado) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }

    setLoading(true);

    try {
      await onSave(formData);
      // Resetear estados al cerrar
      setCatalogosLoaded(false);
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

  // Resetear cuando se cierre el modal
  useEffect(() => {
    if (!isOpen) {
      setCatalogosLoaded(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-colors duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {vehicle ? 'Editar Vehículo' : 'Nuevo Vehículo'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <X className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Patente *
              </label>
              <input
                type="text"
                name="patente"
                value={formData.patente}
                onChange={handleChange}
                className="input-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="AA123BB"
                required
                disabled={!!vehicle}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Modelo *
              </label>
              <input
                type="text"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                className="input-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Corolla, Focus, etc."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Marca *
              </label>
              <select
                name="id_marca"
                value={formData.id_marca}
                onChange={handleChange}
                className="input-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color *
              </label>
              <select
                name="id_color"
                value={formData.id_color}
                onChange={handleChange}
                className="input-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Año *
              </label>
              <input
                type="number"
                name="anio"
                value={formData.anio}
                onChange={handleChange}
                className="input-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                min="2000"
                max={new Date().getFullYear() + 1}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Precio por Día ($) *
              </label>
              <input
                type="number"
                name="precio_flota"
                value={formData.precio_flota}
                onChange={handleChange}
                className="input-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="25000"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Número de Asientos *
              </label>
              <input
                type="number"
                name="asientos"
                value={formData.asientos}
                onChange={handleChange}
                className="input-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                min="2"
                max="9"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Número de Puertas *
              </label>
              <input
                type="number"
                name="puertas"
                value={formData.puertas}
                onChange={handleChange}
                className="input-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                min="2"
                max="5"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estado *
              </label>
              <select
                name="id_estado"
                value={formData.id_estado}
                onChange={handleChange}
                className="input-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              >
                {estados.map(estado => (
                  <option key={estado.id_estado} value={estado.id_estado}>
                    {estado.descripcion}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="caja_manual"
                checked={formData.caja_manual}
                onChange={handleChange}
                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
              />
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Caja Manual
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-200"
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

const VehicleCard = ({ vehicle, onEdit, onDelete, onView, onRent }) => {
  const { hasPermission } = useAuth();
  const canEdit = hasPermission('empleado');
  const canDelete = hasPermission('admin');

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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{vehicle.modelo}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{vehicle.marca}</p>
          </div>
          <span className={`status-badge ${getStatusBadge(vehicle.estado)}`}>
            {vehicle.estado}
          </span>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Patente:</span>
            <span className="font-medium text-gray-600 dark:text-gray-300">{vehicle.patente}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Año:</span>
            <span className="font-medium text-gray-600 dark:text-gray-300">{vehicle.anio}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Color:</span>
            <span className="font-medium text-gray-600 dark:text-gray-300">{vehicle.color}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Transmisión:</span>
            <span className="font-medium text-gray-600 dark:text-gray-300">{getTransmissionText(vehicle.caja_manual)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Precio/día:</span>
            <span className="font-medium text-green-600 dark:text-green-400">${vehicle.precio_flota}</span>
          </div>
        </div>

        {/* SECCIÓN DE ASIENTOS Y PUERTAS - MANTENIDA */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500 border-t border-gray-200 dark:border-gray-600 pt-3">
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

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
          {canEdit || canDelete ? (
            <>
              <div className="flex-1"></div> {/* Espacio para empujar a la derecha */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEdit(vehicle)}
                  className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors duration-200"
                  title="Editar"
                >
                  <Edit className="h-4 w-4" />
                </button>
                {canDelete && (
                  <button
                    onClick={() => onDelete(vehicle)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="flex-1"></div> {/* Mismo espacio para empujar a la derecha */}
              <button
                onClick={() => onRent(vehicle)}
                className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200"
              >
                <Calendar className="h-4 w-4 mr-1" />
                Alquilar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const VehicleManagement = () => {
  const { hasPermission, user } = useAuth();
  const { isAdmin, isEmployee, isClient } = useAuth();
  const { showNotification } = useNotification();
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [rentalModalOpen, setRentalModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedVehicleForRental, setSelectedVehicleForRental] = useState(null);
  const [view, setView] = useState('grid');
  const [rentalDates, setRentalDates] = useState(null);
  const [availableVehicles, setAvailableVehicles] = useState([]);
  const [searchingVehicles, setSearchingVehicles] = useState(false);

  const canEdit = hasPermission('empleado');
  const canCreate = hasPermission('admin'); // Solo admin puede crear vehículos
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
      const vehiclesData = await vehicleService.getAll();
      setVehicles(vehiclesData);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      showNotification('Error al cargar los vehículos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterVehicles = () => {
    let filtered = vehicles;

    if (searchTerm) {
      filtered = filtered.filter(vehicle =>
        vehicle.patente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vehicle.marca.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.estado === statusFilter);
    }

    setFilteredVehicles(filtered);
  };

  const handleCreateVehicle = async (vehicleData) => {
    try {
      await vehicleService.create(vehicleData);
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
      await vehicleService.update(selectedVehicle.patente, vehicleData);
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
      await vehicleService.delete(vehicle.patente);
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

  const openVehicleModal = (vehicle = null) => {
    setSelectedVehicle(vehicle);
    setVehicleModalOpen(true);
  };

  const closeVehicleModal = () => {
    setSelectedVehicle(null);
    setVehicleModalOpen(false);
  };

  const openRentalModal = (vehicle) => {
    if (!user || !user.userId) {
      showNotification('Debe iniciar sesión para alquilar un vehículo', 'error');
      return;
    }

    setSelectedVehicleForRental(vehicle);
    setRentalModalOpen(true);
  };

  const closeRentalModal = () => {
    setSelectedVehicleForRental(null);
    setRentalModalOpen(false);
  };

  const handleSaveRental = async (rentalData) => {
    try {
      await rentalService.create(rentalData);
      showNotification('Alquiler creado exitosamente', 'success');
      closeRentalModal();
      fetchVehicles();
    } catch (error) {
      console.error('Error creating rental:', error);
      showNotification('Error al crear el alquiler', 'error');
      throw error;
    }
  };
 
  const searchAvailableVehicles = async (fechaInicio, fechaFin) => {
  try {
    setSearchingVehicles(true);
    setRentalDates({ fecha_inicio: fechaInicio, fecha_fin: fechaFin });
    
    const available = await vehicleService.getAvailable(fechaInicio, fechaFin);
    setAvailableVehicles(available);
  } catch (error) {
    console.error('Error searching available vehicles:', error);
    showNotification('Error al buscar vehículos disponibles', 'error');
    setAvailableVehicles([]);
  } finally {
    setSearchingVehicles(false);
  }
};

const resetRentalFlow = () => {
  setRentalDates(null);
  setAvailableVehicles([]);
};

  const getStatusBadge = (estado) => {
    const statusMap = {
      'Libre': 'status-free',
      'Ocupado': 'status-occupied', 
      'En mantenimiento': 'status-maintenance'
    };
    return statusMap[estado] || 'status-free';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando vehículos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Vehículos</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Administra la flota de vehículos de IngRide
          </p>
        </div>
        {/* SOLO ADMIN PUEDE CREAR VEHÍCULOS */}
        {canCreate && (
          <button
            onClick={() => openVehicleModal()}
            className="mt-4 sm:mt-0 btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Vehículo
          </button>
        )}
      </div>
      
      {/* Filtros y busquedas */}
      {(isAdmin() || isEmployee()) && (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-colors duration-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por patente, modelo o marca..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-primary pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
            </div>
          </div>
        

          <div className="flex items-center space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Todos los estados</option>
              <option value="Libre">Libre</option>
              <option value="Ocupado">Ocupado</option>
              <option value="En mantenimiento">En mantenimiento</option>
            </select>

            <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <button
                onClick={() => setView('grid')}
                className={`p-2 transition-colors duration-200 ${
                  view === 'grid' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
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
                className={`p-2 transition-colors duration-200 ${
                  view === 'list' 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
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
      )}
 {/* Mostrar estadísticas solo para administradores y empleados */}
{(isAdmin() || isEmployee()) && (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center transition-colors duration-200">
      <div className="text-2xl font-bold text-gray-900 dark:text-white">{vehicles.length}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">Total</div>
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center transition-colors duration-200">
      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
        {vehicles.filter(v => v.estado === 'Libre').length}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">Disponibles</div>
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center transition-colors duration-200">
      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
        {vehicles.filter(v => v.estado === 'Ocupado').length}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">Ocupados</div>
    </div>
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center transition-colors duration-200">
      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
        {vehicles.filter(v => v.estado === 'En mantenimiento').length}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">Mantenimiento</div>
    </div>
  </div>
)}

      {/* Selector de fechas para clientes */}
      {isClient() && (
        <>
          {!rentalDates ? (
            <RentalDateSelector 
              onSearch={searchAvailableVehicles} 
              loading={searchingVehicles} 
            />
          ) : (
            <div className="mb-6">
              <button
                onClick={resetRentalFlow}
                className="flex items-center text-orange-500 hover:text-orange-600 mb-4 transition-colors duration-200"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Cambiar fechas
              </button>
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                Vehículos disponibles del {new Date(rentalDates.fecha_inicio).toLocaleDateString()} al {new Date(rentalDates.fecha_fin).toLocaleDateString()}
              </h2>
            </div>
          )}

          {availableVehicles.length > 0 && rentalDates && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableVehicles.map(vehicle => (
            <VehicleCard
              key={vehicle.patente}
              vehicle={vehicle}
              onRent={openRentalModal}
              showRentButton={true}
            />
          ))}
        </div>
      )}

      {availableVehicles.length === 0 && rentalDates && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center transition-colors duration-200">
          <Car className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No hay vehículos disponibles
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No encontramos vehículos disponibles para las fechas seleccionadas.
          </p>
          <button
            onClick={resetRentalFlow}
            className="btn-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Seleccionar otras fechas
          </button>
        </div>
      )}

      
        </>
      )}

      {!rentalDates && filteredVehicles.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center transition-colors duration-200">
          <Car className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No se encontraron vehículos</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'Intenta ajustar los filtros de búsqueda' 
              : 'No hay vehículos registrados en el sistema'
            }
          </p>
          {/* SOLO ADMIN PUEDE AGREGAR EL PRIMER VEHÍCULO */}
          {canCreate && !searchTerm && statusFilter === 'all' && (
            <button
              onClick={() => openVehicleModal()}
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

          {/* SOLO para admin y empleado*/}
          {(isAdmin() || isEmployee()) && (
            <>
          {filteredVehicles.map(vehicle => (
            view === 'grid' ? (
              <VehicleCard
                key={vehicle.patente}
                vehicle={vehicle}
                onEdit={canEdit ? openVehicleModal : null}
                onDelete={canDelete ? handleDeleteVehicle : null}
                onView={() => openVehicleModal(vehicle)}
                onRent={openRentalModal}
              />
            ) : (
              <div key={vehicle.patente} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Car className="h-10 w-10 text-orange-500" />
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{vehicle.modelo}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{vehicle.marca} • {vehicle.patente}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`status-badge ${getStatusBadge(vehicle.estado)}`}>
                      {vehicle.estado}
                    </span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      ${vehicle.precio_flota}/día
                    </span>
                    <div className="flex items-center space-x-2">
                      {!canEdit && !canDelete ? (
                        <button
                          onClick={() => openRentalModal(vehicle)}
                          className="btn-primary text-sm"
                        >
                          <Calendar className="h-4 w-4 mr-1" />
                          Alquilar
                        </button>
                      ) : (
                        <>
                          {canEdit && (
                            <button
                              onClick={() => openVehicleModal(vehicle)}
                              className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors duration-200"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteVehicle(vehicle)}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          ))}
          </>)}
        </div>
      )}

      <VehicleModal
        isOpen={vehicleModalOpen}
        onClose={closeVehicleModal}
        vehicle={selectedVehicle}
        onSave={handleSaveVehicle}
      />

      <RentalModal
        isOpen={rentalModalOpen}
        onClose={closeRentalModal}
        vehicle={selectedVehicleForRental}
        user={user}
        onSave={handleSaveRental}
      />
    </div>
  );
};

export default VehicleManagement;