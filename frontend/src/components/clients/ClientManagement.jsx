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
  X,
  Mail,
  Phone,
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

// Componente de Modal para Crear/Editar Cliente
const ClientModal = ({ isOpen, onClose, client, onSave }) => {
  const { showNotification } = useNotification();

  const [formData, setFormData] = useState({
    id: null,
    nombre: '',
    apellido: '',
    tipo_documento: 1,
    nro_documento: '',
    fecha_nac: '',
    mail: '',
    telefono: '',
    fecha_alta: new Date().toISOString().split('T')[0]
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchTiposDocumento();
      if (client) {
        // CORRECCIÓN: Formatear correctamente las fechas para input type="date"
        const formatDateForInput = (dateString) => {
          if (!dateString) return '';

          // Si viene tipo "2025-01-10T03:00:00.000Z"
          if (dateString.includes('T')) {
            return dateString.split('T')[0];
          }

          // Si viene tipo "2025-01-10 00:00:00"
          if (dateString.includes(' ')) {
            return dateString.split(' ')[0];
          }

          // Si ya viene como YYYY-MM-DD
          if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            return dateString;
          }

          return dateString;
        };

        setFormData({
          nombre: client.nombre || '',
          apellido: client.apellido || '',
          mail: client.mail || '',
          telefono: client.telefono || '',
          fecha_nac: formatDateForInput(client.fecha_nac),
          tipo_documento_id: client.id_tipo_documento || 1,
          nro_documento: client.nro_documento?.toString() || '',
          // CORRECCIÓN: Usar la fecha de alta existente del cliente
          fecha_alta: formatDateForInput(client.fecha_alta) || new Date().toISOString().split('T')[0]
        });
      } else {
        setFormData({
          nombre: '',
          apellido: '',
          mail: '',
          telefono: '',
          fecha_nac: '',
          tipo_documento: 1,
          nro_documento: '',
          fecha_alta: new Date().toISOString().split('T')[0]
        });
      }
      setErrors({});
      setTouched({});
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

  // Validaciones
  const validateField = (name, value, currentFormData = formData) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'mail':
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(value)) {
          newErrors.mail = 'Formato de email inválido. Ejemplo: usuario@dominio.com';
        } else {
          delete newErrors.mail;
        }
        break;

      case 'telefono':
        const phoneNumber = value.replace(/\D/g, '');
        if (phoneNumber.length !== 10) {
          newErrors.telefono = 'El teléfono debe tener exactamente 10 dígitos';
        } else {
          delete newErrors.telefono;
        }
        break;

      case 'fecha_nac':
        if (value) {
          const birthDate = new Date(value);
          const today = new Date();
          const minDate = new Date();
          minDate.setFullYear(today.getFullYear() - 18);
          
          if (birthDate > minDate) {
            newErrors.fecha_nac = 'Debe ser mayor de 18 años';
          } else {
            delete newErrors.fecha_nac;
          }
        } else {
          newErrors.fecha_nac = 'Fecha de nacimiento requerida';
        }
        break;

      case 'nro_documento':
        const docValue = value.replace(/\D/g, '');
        // Usar el tipo de documento actual del formulario
        const tipoDoc = currentFormData.tipo_documento_id;
        
        // CORRECCIÓN: Validar siempre, no mantener estado anterior
        if (tipoDoc === 1) { // DNI
          if (docValue.length !== 7 && docValue.length !== 8) {
            newErrors.nro_documento = 'El DNI debe tener 7 u 8 dígitos';
          } else {
            delete newErrors.nro_documento;
          }
        } else if (tipoDoc === 2) { // Pasaporte
          // CORRECCIÓN: Pasaporte ahora también acepta 7 u 8 dígitos
          if (docValue.length !== 7 && docValue.length !== 8) {
            newErrors.nro_documento = 'El Pasaporte debe tener 7 u 8 dígitos';
          } else {
            delete newErrors.nro_documento;
          }
        } else {
          // Para otros tipos de documento
          const tipoSeleccionado = tiposDocumento.find(t => t.id_tipo === tipoDoc);
          const nombreTipo = tipoSeleccionado?.descripcion || 'documento';
          if (!docValue) {
            newErrors.nro_documento = `El número de ${nombreTipo} es requerido`;
          } else {
            delete newErrors.nro_documento;
          }
        }
        break;

      case 'fecha_alta':
        if (value) {
          const altaDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (altaDate > today) {
            newErrors.fecha_alta = 'No puede ser una fecha futura';
          } else {
            delete newErrors.fecha_alta;
          }
        }
        break;

      case 'nombre':
      case 'apellido':
        if (!value.trim()) {
          newErrors[name] = 'Este campo es requerido';
        } else {
          delete newErrors[name];
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Para teléfono, limitar a 10 dígitos
    if (name === 'telefono') {
      const phoneNumber = value.replace(/\D/g, '').slice(0, 10);
      const formattedPhone = formatPhoneForInput(phoneNumber);
      const newFormData = {
        ...formData,
        [name]: formattedPhone
      };
      
      setFormData(newFormData);
      
      if (touched[name]) {
        validateField(name, formattedPhone, newFormData);
      }
      return;
    }
    
    // Para documento, solo números
    if (name === 'nro_documento') {
      const docNumber = value.replace(/\D/g, '');
      // CORRECCIÓN: Mismo límite máximo para DNI y Pasaporte (8 dígitos)
      const maxLength = 8;
      const limitedDoc = docNumber.slice(0, maxLength);
      
      const newFormData = {
        ...formData,
        [name]: limitedDoc
      };
      
      setFormData(newFormData);
      
      if (touched[name]) {
        validateField(name, limitedDoc, newFormData);
      }
      return;
    }
    
    // Para tipo de documento, validar también el número de documento
    if (name === 'tipo_documento_id') {
      const newFormData = {
        ...formData,
        [name]: parseInt(value)
      };
      
      setFormData(newFormData);
      
      // Validar inmediatamente el número de documento con el nuevo tipo
      if (touched.nro_documento || formData.nro_documento) {
        setTimeout(() => {
          validateField('nro_documento', newFormData.nro_documento, newFormData);
        }, 0);
      }
      return;
    }
    
    const newFormData = {
      ...formData,
      [name]: value
    };
    
    setFormData(newFormData);

    // Validar inmediatamente si el campo ya fue tocado
    if (touched[name]) {
      validateField(name, value, newFormData);
    }
  };

// Guardar empleado
const handleSaveCliente = async (e) => {
  e.preventDefault();

  const payload = {
    persona: {
      nombre: formData.nombre,
      apellido: formData.apellido,
      mail: formData.mail,
      telefono: formData.telefono,
      fecha_nac: formData.fecha_nac,      // OBLIGATORIO
      tipo_documento: formData.tipo_documento, // OBLIGATORIO
      nro_documento: formData.nro_documento,   // OBLIGATORIO
    },
    usuario: {
      user_name: formData.mail,
      password: formData.nro_documento,
      id_permiso: 1,        // permiso cliente (o el que uses)
    },
    role: {
      fecha_alta: formData.fecha_alta,     // OBLIGATORIO
    }
  };

  try {
    await clientService.createOrUpdate(payload, formData.id);
    showNotification("Cliente creado exitosamente", "success");
    onClose();
    if (onSave) onSave();

  } catch (error) {
    console.error("Error guardando cliente:", error);
    showNotification("Hubo un error al guardar el cliente", "error");
  }
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

  // Formatear teléfono para mostrar en el input (351 123 4567)
  const formatPhoneForInput = (value) => {
    if (!value) return value;
    
    const phoneNumber = value.replace(/\D/g, '');
    const phoneNumberLength = phoneNumber.length;
    
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3)}`;
    }
    return `${phoneNumber.slice(0, 3)} ${phoneNumber.slice(3, 6)} ${phoneNumber.slice(6, 10)}`;
  };

  // Formatear teléfono para enviar a la base de datos (351-1234567)
  const formatPhoneForDatabase = (phoneValue) => {
    if (!phoneValue) return '';
    
    const phoneNumber = phoneValue.replace(/\D/g, '');
    if (phoneNumber.length !== 10) return phoneValue;
    
    // Formato: xxx-xxxxxxx
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
  };

  const getDocumentPlaceholder = () => {
    const tipoDoc = formData.tipo_documento_id;
    if (tipoDoc === 1) return "12345678"; // DNI
    if (tipoDoc === 2) return "12345678"; // Pasaporte (ahora también 7-8 dígitos)
    return "Número de documento";
  };

  const getDocumentValidationMessage = () => {
    const tipoDoc = formData.tipo_documento_id;
    if (tipoDoc === 1) return 'DNI válido';
    if (tipoDoc === 2) return 'Pasaporte válido';
    return 'Documento válido';
  };

  const getMaxBirthDate = () => {
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 18);
    return minDate.toISOString().split('T')[0];
  };

  const getMaxAltaDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {client ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSaveCliente} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input-primary ${errors.nombre && touched.nombre ? 'border-red-500' : ''}`}
                placeholder="Juan"
                required
              />
              {errors.nombre && touched.nombre && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.nombre}
                </p>
              )}
            </div>

            {/* Apellido */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Apellido *
              </label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input-primary ${errors.apellido && touched.apellido ? 'border-red-500' : ''}`}
                placeholder="Pérez"
                required
              />
              {errors.apellido && touched.apellido && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.apellido}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="mail"
                value={formData.mail}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input-primary ${errors.mail && touched.mail ? 'border-red-500' : ''}`}
                placeholder="cliente@ejemplo.com"
                required
              />
              {errors.mail && touched.mail ? (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.mail}
                </p>
              ) : (
                formData.mail && !errors.mail && (
                  <p className="text-green-500 text-xs mt-1 flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Formato de email válido
                  </p>
                )
              )}
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Teléfono *
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input-primary ${errors.telefono && touched.telefono ? 'border-red-500' : ''}`}
                placeholder="351 123 4567"
                maxLength={14}
                required
              />
              {errors.telefono && touched.telefono ? (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.telefono}
                </p>
              ) : (
                formData.telefono && !errors.telefono && (
                  <p className="text-green-500 text-xs mt-1 flex items-center">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Teléfono válido (10 dígitos)
                  </p>
                )
              )}
            </div>

            {/* Fecha de Nacimiento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha de Nacimiento *
              </label>
              <input
                type="date"
                name="fecha_nac"
                value={formData.fecha_nac}
                onChange={handleChange}
                onBlur={handleBlur}
                max={getMaxBirthDate()}
                className={`input-primary ${errors.fecha_nac && touched.fecha_nac ? 'border-red-500' : ''}`}
                required
              />
              {errors.fecha_nac && touched.fecha_nac && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.fecha_nac}
                </p>
              )}
              {formData.fecha_nac && !errors.fecha_nac && (
                <p className="text-green-500 text-xs mt-1 flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Edad: {calculateAge(formData.fecha_nac)} años
                </p>
              )}
            </div>

            {/* Tipo de Documento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Número de Documento *
              </label>
              <input
                type="text"
                name="nro_documento"
                value={formData.nro_documento}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`input-primary ${errors.nro_documento && touched.nro_documento ? 'border-red-500' : ''}`}
                placeholder={getDocumentPlaceholder()}
                required
              />
              {errors.nro_documento && touched.nro_documento && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.nro_documento}
                </p>
              )}
              {formData.nro_documento && !errors.nro_documento && (
                <p className="text-green-500 text-xs mt-1 flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {getDocumentValidationMessage()}
                </p>
              )}
            </div>

            {/* Fecha de Alta */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha de Alta *
              </label>
              <input
                type="date"
                name="fecha_alta"
                value={formData.fecha_alta}
                onChange={handleChange}
                onBlur={handleBlur}
                max={getMaxAltaDate()}
                className={`input-primary ${errors.fecha_alta && touched.fecha_alta ? 'border-red-500' : ''}`}
                required
              />
              {errors.fecha_alta && touched.fecha_alta && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.fecha_alta}
                </p>
              )}
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
              disabled={loading || Object.keys(errors).length > 0}
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
const ClientCard = ({ client, onEdit, onDelete }) => {
  const { hasPermission } = useAuth();
  const canEdit = hasPermission('empleado');
  const canDelete = hasPermission('admin');

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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {client.nombre} {client.apellido}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1">
              <FileText className="h-4 w-4 mr-1" />
              {client.tipo_documento}: {client.nro_documento}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span className="status-badge bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              Cliente #{client.id_cliente}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Desde {getClientSince(client.fecha_alta)}
            </span>
          </div>
        </div>

        {/* Información del cliente */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Mail className="h-4 w-4 mr-2" />
            <span className="truncate">{client.mail}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Phone className="h-4 w-4 mr-2" />
            <span>{client.telefono}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              {calculateAge(client.fecha_nac)} años • {client.fecha_nac?.split('-').reverse().join('/')}
            </span>
          </div>
        </div>

        {/* Fecha de Alta */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-3">
          <span>Fecha de alta:</span>
          <span className="font-medium">{new Date(client.fecha_alta).toLocaleDateString()}</span>
        </div>

        {/* Acciones - Iconos alineados a la derecha */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex-1"></div>
          <div className="flex items-center space-x-2">
            {canEdit && (
              <button
                onClick={() => onEdit(client)}
                className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900 rounded-lg transition-colors duration-200"
                title="Editar"
              >
                <Edit className="h-4 w-4" />
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => onDelete(client)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors duration-200"
                title="Eliminar"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal ClientManagement
const ClientManagement = () => {
  const { hasPermission, user } = useAuth();
  const { showNotification } = useNotification();
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [documentFilter, setDocumentFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [view, setView] = useState('grid');

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
      console.log('Fetching clients with user:', user);
      const clientsData = await clientService.getAll();
      console.log('Clients data received:', clientsData);
      
      // CORRECCIÓN: Asegurar que los datos vengan formateados correctamente
      const formattedClients = clientsData.map(client => ({
        ...client,
        // Asegurar que las fechas estén en formato correcto
        fecha_nac: client.fecha_nac,
        fecha_alta: client.fecha_alta,
        // Asegurar que el número de documento sea string para display
        nro_documento: client.nro_documento?.toString() || ''
      }));
      setClients(formattedClients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      showNotification('Error al cargar los clientes', 'error');
      // En caso de error, establecer array vacío para evitar bucles
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const filterClients = () => {
    let filtered = clients;

    if (searchTerm) {
      filtered = filtered.filter(client =>
        client.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.nro_documento?.toString().includes(searchTerm) ||
        client.mail?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (documentFilter !== 'all') {
      filtered = filtered.filter(client => 
        client.tipo_documento === documentFilter
      );
    }

    setFilteredClients(filtered);
  };

  const handleCreateClient = async (clientData) => {
    try {
      await clientService.create(clientData);
      showNotification('Cliente creado exitosamente', 'success');
      // Esperar un momento antes de recargar para dar tiempo al backend
      setTimeout(() => {
        fetchClients();
      }, 500);
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

  const getClientStats = () => {
    const total = clients.length;
    const newThisMonth = clients.filter(client => {
      if (!client.fecha_alta) return false;
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
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando clientes...</p>
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Clientes</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center transition-colors duration-200">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Clientes</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center transition-colors duration-200">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">+{stats.newThisMonth}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Nuevos este mes</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center transition-colors duration-200">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.withDNI}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Con DNI</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center transition-colors duration-200">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.withPassport}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Con Pasaporte</div>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-colors duration-200">
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
            <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
              <button
                onClick={() => setView('grid')}
                className={`p-2 ${view === 'grid' ? 'bg-orange-500 text-white' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
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
                className={`p-2 ${view === 'list' ? 'bg-orange-500 text-white' : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center transition-colors duration-200">
          <Users className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No se encontraron clientes</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
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
              />
            ) : (
              <div key={client.id_cliente} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                      <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {client.nombre} {client.apellido}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {client.tipo_documento}: {client.nro_documento} • {client.mail}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Desde {new Date(client.fecha_alta).toLocaleDateString()}
                    </span>
                    <div className="flex items-center space-x-2">
                      {canEdit && (
                        <button
                          onClick={() => openModal(client)}
                          className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900 rounded-lg transition-colors duration-200"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDeleteClient(client)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors duration-200"
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
        onClose={() => setModalOpen(false)}
        client={selectedClient}
        onSave={fetchClients}
      />
    </div>
  );
};

export default ClientManagement;