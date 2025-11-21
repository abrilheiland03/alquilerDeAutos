import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { clientService } from '../../services/clientService';
import { catalogService } from '../../services/catalogService';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  X,
  Mail,
  Phone,
  Calendar,
  FileText,
  Download,
  Upload,
  UserCheck,
  UserX,
  ArrowUpDown
} from 'lucide-react';

// Componente de Modal para Crear/Editar Cliente
const ClientModal = ({ isOpen, onClose, client, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    mail: '',
    telefono: '',
    fecha_nacimiento: '',
    tipo_documento_id: 1,
    nro_documento: '',
    fecha_alta: new Date().toISOString().split('T')[0]
  });
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTiposDocumento();
      if (client) {
        setFormData({
          nombre: client.nombre || '',
          apellido: client.apellido || '',
          mail: client.mail || '',
          telefono: client.telefono || '',
          fecha_nacimiento: client.fecha_nacimiento?.split('T')[0] || '',
          tipo_documento_id: client.id_tipo_documento || 1,
          nro_documento: client.nro_documento || '',
          fecha_alta: client.fecha_alta?.split('T')[0] || new Date().toISOString().split('T')[0]
        });
      } else {
        setFormData({
          nombre: '',
          apellido: '',
          mail: '',
          telefono: '',
          fecha_nacimiento: '',
          tipo_documento_id: 1,
          nro_documento: '',
          fecha_alta: new Date().toISOString().split('T')[0]
        });
      }
    }
  }, [isOpen, client]);

  const fetchTiposDocumento = async () => {
    try {
      const tiposDoc = await catalogService.getDocumentTypes();
      setTiposDocumento(tiposDoc);
    } catch (error) {
      console.error('Error fetching tipos documento:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving client:', error);
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

  const calculateAge = (fechaNacimiento) => {
    if (!fechaNacimiento) return '';
    const today = new Date();
    const birthDate = new Date(fechaNacimiento);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {client ? 'Editar Cliente' : 'Nuevo Cliente'}
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
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="input-primary"
                placeholder="Juan"
                required
              />
            </div>

            {/* Apellido */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Apellido *
              </label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="input-primary"
                placeholder="Pérez"
                required
              />
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="mail"
                value={formData.mail}
                onChange={handleChange}
                className="input-primary"
                placeholder="cliente@ejemplo.com"
                required
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono *
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="input-primary"
                placeholder="351 123-4567"
                required
              />
            </div>

            {/* Fecha de Nacimiento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Nacimiento *
              </label>
              <input
                type="date"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleChange}
                className="input-primary"
                required
              />
              {formData.fecha_nacimiento && (
                <p className="text-sm text-gray-500 mt-1">
                  Edad: {calculateAge(formData.fecha_nacimiento)} años
                </p>
              )}
            </div>

            {/* Tipo de Documento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Documento *
              </label>
              <select
                name="tipo_documento_id"
                value={formData.tipo_documento_id}
                onChange={handleChange}
                className="input-primary"
                required
              >
                {tiposDocumento.map(tipo => (
                  <option key={tipo.id_tipo} value={tipo.id_tipo}>
                    {tipo.descripcion}
                  </option>
                ))}
              </select>
            </div>

            {/* Número de Documento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Documento *
              </label>
              <input
                type="text"
                name="nro_documento"
                value={formData.nro_documento}
                onChange={handleChange}
                className="input-primary"
                placeholder="12345678"
                required
              />
            </div>

            {/* Fecha de Alta */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Alta *
              </label>
              <input
                type="date"
                name="fecha_alta"
                value={formData.fecha_alta}
                onChange={handleChange}
                className="input-primary"
                required
              />
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
              {loading ? 'Guardando...' : client ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente de Tarjeta de Cliente
const ClientCard = ({ client, onEdit, onDelete, onView }) => {
  const calculateAge = (fechaNacimiento) => {
    if (!fechaNacimiento) return '';
    const today = new Date();
    const birthDate = new Date(fechaNacimiento);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const getClientSince = (fechaAlta) => {
    if (!fechaAlta) return '';
    const today = new Date();
    const altaDate = new Date(fechaAlta);
    const diffTime = Math.abs(today - altaDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} días`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} mes${months > 1 ? 'es' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} año${years > 1 ? 's' : ''}`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {client.nombre} {client.apellido}
            </h3>
            <p className="text-sm text-gray-500 flex items-center mt-1">
              <FileText className="h-4 w-4 mr-1" />
              {client.tipo_documento}: {client.nro_documento}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span className="status-badge bg-blue-100 text-blue-800">
              Cliente #{client.id_cliente}
            </span>
            <span className="text-xs text-gray-500 mt-1">
              Desde {getClientSince(client.fecha_alta)}
            </span>
          </div>
        </div>

        {/* Información del cliente */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="h-4 w-4 mr-2" />
            <span className="truncate">{client.mail}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Phone className="h-4 w-4 mr-2" />
            <span>{client.telefono}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              {calculateAge(client.fecha_nacimiento)} años • {new Date(client.fecha_nacimiento).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Fecha de Alta */}
        <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-200 pt-3">
          <span>Fecha de alta:</span>
          <span className="font-medium">{new Date(client.fecha_alta).toLocaleDateString()}</span>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => onView(client)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Eye className="h-4 w-4 mr-1" />
            Ver Detalles
          </button>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onEdit(client)}
              className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
              title="Editar"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(client)}
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

const ClientManagement = () => {
  const { hasPermission } = useAuth();
  const { showNotification } = useNotification();
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [documentFilter, setDocumentFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [view, setView] = useState('grid'); // 'grid' or 'list'

  const canEdit = hasPermission('empleado');
  const canDelete = hasPermission('admin');

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    filterClients();
  }, [clients, searchTerm, documentFilter]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const clientsData = await clientService.getAll();
      setClients(clientsData);
    } catch (error) {
      console.error('Error fetching clients:', error);
      showNotification('Error al cargar los clientes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterClients = () => {
    let filtered = clients;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.nro_documento.includes(searchTerm) ||
        client.mail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por tipo de documento
    if (documentFilter !== 'all') {
      filtered = filtered.filter(client => 
        client.tipo_documento === documentFilter
      );
    }

    setFilteredClients(filtered);
  };

  const handleCreateClient = async (clientData) => {
    try {
      const newClient = await clientService.create(clientData);
      showNotification('Cliente creado exitosamente', 'success');
      fetchClients();
      return newClient.id_cliente;
    } catch (error) {
      console.error('Error creating client:', error);
      showNotification('Error al crear el cliente', 'error');
      throw error;
    }
  };

  const handleUpdateClient = async (clientData) => {
    try {
      await clientService.update(selectedClient.id_cliente, clientData);
      showNotification('Cliente actualizado exitosamente', 'success');
      fetchClients();
    } catch (error) {
      console.error('Error updating client:', error);
      showNotification('Error al actualizar el cliente', 'error');
      throw error;
    }
  };

  const handleDeleteClient = async (client) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar al cliente ${client.nombre} ${client.apellido}?`)) {
      return;
    }

    try {
      await clientService.delete(client.id_cliente);
      showNotification('Cliente eliminado exitosamente', 'success');
      fetchClients();
    } catch (error) {
      console.error('Error deleting client:', error);
      if (error.response?.status === 400) {
        showNotification('No se puede eliminar el cliente porque tiene alquileres asociados', 'error');
      } else {
        showNotification('Error al eliminar el cliente', 'error');
      }
    }
  };

  const handleSaveClient = async (clientData) => {
    if (selectedClient) {
      await handleUpdateClient(clientData);
    } else {
      await handleCreateClient(clientData);
    }
  };

  const openModal = (client = null) => {
    setSelectedClient(client);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedClient(null);
    setModalOpen(false);
  };

  const getDocumentTypes = () => {
    const types = [...new Set(clients.map(c => c.tipo_documento))];
    return ['all', ...types];
  };

  const getClientStats = () => {
    const total = clients.length;
    const newThisMonth = clients.filter(client => {
      const clientDate = new Date(client.fecha_alta);
      const today = new Date();
      return clientDate.getMonth() === today.getMonth() && 
             clientDate.getFullYear() === today.getFullYear();
    }).length;

    const withDNI = clients.filter(client => client.tipo_documento === 'DNI').length;
    const withPassport = clients.filter(client => client.tipo_documento === 'Pasaporte').length;

    return { total, newThisMonth, withDNI, withPassport };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando clientes...</p>
        </div>
      </div>
    );
  }

  const stats = getClientStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h1>
          <p className="text-gray-600 mt-1">
            Administra la base de clientes de IngRide
          </p>
        </div>
        {canEdit && (
          <button
            onClick={() => openModal()}
            className="mt-4 sm:mt-0 btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Cliente
          </button>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Clientes</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">+{stats.newThisMonth}</div>
          <div className="text-sm text-gray-600">Nuevos este mes</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.withDNI}</div>
          <div className="text-sm text-gray-600">Con DNI</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.withPassport}</div>
          <div className="text-sm text-gray-600">Con Pasaporte</div>
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
                placeholder="Buscar por nombre, apellido, documento o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-primary pl-10"
              />
            </div>
          </div>

          {/* Filtros y Vistas */}
          <div className="flex items-center space-x-4">
            {/* Filtro por Tipo de Documento */}
            <select
              value={documentFilter}
              onChange={(e) => setDocumentFilter(e.target.value)}
              className="input-primary"
            >
              <option value="all">Todos los documentos</option>
              <option value="DNI">DNI</option>
              <option value="Pasaporte">Pasaporte</option>
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

      {/* Lista de Clientes */}
      {filteredClients.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron clientes</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || documentFilter !== 'all' 
              ? 'Intenta ajustar los filtros de búsqueda' 
              : 'No hay clientes registrados en el sistema'
            }
          </p>
          {canEdit && !searchTerm && documentFilter === 'all' && (
            <button
              onClick={() => openModal()}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Registrar Primer Cliente
            </button>
          )}
        </div>
      ) : (
        <div className={
          view === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
        }>
          {filteredClients.map(client => (
            view === 'grid' ? (
              <ClientCard
                key={client.id_cliente}
                client={client}
                onEdit={canEdit ? openModal : null}
                onDelete={canDelete ? handleDeleteClient : null}
                onView={() => openModal(client)}
              />
            ) : (
              <div key={client.id_cliente} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {client.nombre} {client.apellido}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {client.tipo_documento}: {client.nro_documento} • {client.mail}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      Desde {new Date(client.fecha_alta).toLocaleDateString()}
                    </span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openModal(client)}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {canEdit && (
                        <button
                          onClick={() => openModal(client)}
                          className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDeleteClient(client)}
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
      <ClientModal
        isOpen={modalOpen}
        onClose={closeModal}
        client={selectedClient}
        onSave={handleSaveClient}
      />
    </div>
  );
};

export default ClientManagement;