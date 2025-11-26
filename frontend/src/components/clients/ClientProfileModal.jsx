import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { clientService } from '../../services/clientService';
import { catalogService } from '../../services/catalogService';
import { 
  X, 
  Mail, 
  Phone, 
  Calendar, 
  FileText, 
  AlertCircle, 
  CheckCircle,
  User,
  Save,
  Loader
} from 'lucide-react';

const ClientProfileModal = ({ isOpen, onClose, onSave }) => {
  const { user, updateUser } = useAuth();
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    mail: '',
    telefono: '',
    fecha_nacimiento: '',
    tipo_documento_id: 1,
    nro_documento: ''
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    if (isOpen && user) {
      fetchProfileData();
      fetchTiposDocumento();
    }
  }, [isOpen, user]);

  const fetchProfileData = async () => {
    try {
      setFetchingData(true);
      
      console.log('Buscando perfil para usuario:', user.userId);
      
      // Usar el nuevo endpoint específico
      const profileData = await clientService.getMyProfile();
      console.log('Datos del perfil obtenidos:', profileData);

      if (!profileData) {
        throw new Error('No se encontraron los datos del perfil');
      }

      // Formatear datos para el formulario
      const formatDateForInput = (dateString) => {
        if (!dateString) return '';

        if (dateString.includes('T')) {
          return dateString.split('T')[0];
        }

        if (dateString.includes(' ')) {
          return dateString.split(' ')[0];
        }

        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
          return dateString;
        }

        return dateString;
      };

      const formattedData = {
        nombre: profileData.nombre || '',
        apellido: profileData.apellido || '',
        mail: profileData.mail || '',
        telefono: profileData.telefono || '',
        fecha_nacimiento: formatDateForInput(profileData.fecha_nacimiento),
        tipo_documento_id: profileData.id_tipo_documento || 1,
        nro_documento: profileData.nro_documento?.toString() || ''
      };

      console.log('Datos formateados para el formulario:', formattedData);
      
      setFormData(formattedData);
      setOriginalData(formattedData);
      setErrors({});
      setTouched({});
      
    } catch (error) {
      console.error('Error fetching profile data:', error);
      showNotification('Error al cargar los datos del perfil', 'error');
      
      // Datos de fallback
      const fallbackData = {
        nombre: user.userName?.split(' ')[0] || '',
        apellido: user.userName?.split(' ').slice(1).join(' ') || '',
        mail: user.userEmail || '',
        telefono: '',
        fecha_nacimiento: '',
        tipo_documento_id: 1,
        nro_documento: ''
      };
      
      setFormData(fallbackData);
      setOriginalData(fallbackData);
    } finally {
      setFetchingData(false);
    }
  };

  const fetchTiposDocumento = async () => {
    try {
      const tiposDoc = await catalogService.getDocumentTypes();
      setTiposDocumento(tiposDoc);
    } catch (error) {
      console.error('Error fetching tipos documento:', error);
    }
  };

  // ... (mantener todas las funciones de validación igual que antes)

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

      case 'fecha_nacimiento':
        if (value) {
          const birthDate = new Date(value);
          const today = new Date();
          const minDate = new Date();
          minDate.setFullYear(today.getFullYear() - 18);
          
          if (birthDate > minDate) {
            newErrors.fecha_nacimiento = 'Debe ser mayor de 18 años';
          } else {
            delete newErrors.fecha_nacimiento;
          }
        } else {
          newErrors.fecha_nacimiento = 'Fecha de nacimiento requerida';
        }
        break;

      case 'nro_documento':
        const docValue = value.replace(/\D/g, '');
        const tipoDoc = currentFormData.tipo_documento_id;
        
        if (tipoDoc === 1) { // DNI
          if (docValue.length !== 7 && docValue.length !== 8) {
            newErrors.nro_documento = 'El DNI debe tener 7 u 8 dígitos';
          } else {
            delete newErrors.nro_documento;
          }
        } else if (tipoDoc === 2) { // Pasaporte
          if (docValue.length !== 7 && docValue.length !== 8) {
            newErrors.nro_documento = 'El Pasaporte debe tener 7 u 8 dígitos';
          } else {
            delete newErrors.nro_documento;
          }
        } else {
          const tipoSeleccionado = tiposDocumento.find(t => t.id_tipo === tipoDoc);
          const nombreTipo = tipoSeleccionado?.descripcion || 'documento';
          if (!docValue) {
            newErrors.nro_documento = `El número de ${nombreTipo} es requerido`;
          } else {
            delete newErrors.nro_documento;
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
    
    if (name === 'nro_documento') {
      const docNumber = value.replace(/\D/g, '');
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
    
    if (name === 'tipo_documento_id') {
      const newFormData = {
        ...formData,
        [name]: parseInt(value)
      };
      
      setFormData(newFormData);
      
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

    if (touched[name]) {
      validateField(name, value, newFormData);
    }
  };

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

  const formatPhoneForDatabase = (phoneValue) => {
    if (!phoneValue) return '';
    
    const phoneNumber = phoneValue.replace(/\D/g, '');
    if (phoneNumber.length !== 10) return phoneValue;
    
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
  };

  const getDocumentPlaceholder = () => {
    const tipoDoc = formData.tipo_documento_id;
    if (tipoDoc === 1) return "12345678";
    if (tipoDoc === 2) return "12345678";
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

  const hasChanges = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Marcar todos los campos como tocados
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    // Validar todos los campos
    const allValid = Object.keys(formData).every(key => validateField(key, formData[key], formData));
    
    if (!allValid) {
      showNotification('Por favor corrige los errores en el formulario', 'error');
      return;
    }

    if (!hasChanges()) {
      showNotification('No hay cambios para guardar', 'info');
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        mail: formData.mail.trim(),
        telefono: formatPhoneForDatabase(formData.telefono),
        fecha_nacimiento: formData.fecha_nacimiento,
        tipo_documento_id: parseInt(formData.tipo_documento_id),
        nro_documento: parseInt(formData.nro_documento.replace(/\D/g, ''))
      };
      
      console.log('Enviando datos actualizados:', submitData);
      
      // Usar el nuevo endpoint para actualizar
      await clientService.updateMyProfile(submitData);
      
      // Actualizar el contexto de autenticación
      updateUser({
        ...user,
        userName: `${formData.nombre} ${formData.apellido}`,
        userEmail: formData.mail
      });
      
      showNotification('Perfil actualizado exitosamente', 'success');
      onSave && onSave();
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      showNotification('Error al actualizar el perfil', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <User className="h-6 w-6 text-orange-500" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Editar Mi Perfil
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {fetchingData ? (
            <div className="flex items-center justify-center py-8">
              <Loader className="h-6 w-6 text-orange-500 animate-spin mr-3" />
              <span className="text-gray-600 dark:text-gray-400">Cargando datos del perfil...</span>
            </div>
          ) : (
            <>
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
                    name="fecha_nacimiento"
                    value={formData.fecha_nacimiento}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    max={getMaxBirthDate()}
                    className={`input-primary ${errors.fecha_nacimiento && touched.fecha_nacimiento ? 'border-red-500' : ''}`}
                    required
                  />
                  {errors.fecha_nacimiento && touched.fecha_nacimiento && (
                    <p className="text-red-500 text-xs mt-1 flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.fecha_nacimiento}
                    </p>
                  )}
                  {formData.fecha_nacimiento && !errors.fecha_nacimiento && (
                    <p className="text-green-500 text-xs mt-1 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Edad: {calculateAge(formData.fecha_nacimiento)} años
                    </p>
                  )}
                </div>

                {/* Tipo de Documento (solo lectura) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de Documento
                  </label>
                  <select
                    name="tipo_documento_id"
                    value={formData.tipo_documento_id}
                    onChange={handleChange}
                    className="input-primary bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                    disabled
                  >
                    {tiposDocumento.map(tipo => (
                      <option key={tipo.id_tipo} value={tipo.id_tipo}>
                        {tipo.descripcion}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    El tipo de documento no se puede modificar
                  </p>
                </div>

                {/* Número de Documento (solo lectura) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Número de Documento
                  </label>
                  <input
                    type="text"
                    name="nro_documento"
                    value={formData.nro_documento}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="input-primary bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
                    placeholder={getDocumentPlaceholder()}
                    disabled
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    El número de documento no se puede modificar
                  </p>
                </div>
              </div>

              {/* Información adicional */}
              <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Información importante</span>
                </div>
                <p className="text-blue-700 dark:text-blue-300 text-sm mt-2">
                  Solo puedes modificar tu información personal. El tipo y número de documento son datos que no se pueden cambiar por seguridad.
                </p>
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
                  disabled={loading || Object.keys(errors).length > 0 || !hasChanges()}
                  className="btn-primary disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ClientProfileModal;