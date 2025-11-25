import React, { useState, useEffect } from 'react';
import { X, Edit, Trash2, Calendar, Car, User, DollarSign, ReceiptCent, Wrench, ArrowLeft } from 'lucide-react';
import multaService from '../../../services/multaService'; // Ajusta la ruta según tu estructura
import danioService from '../../../services/danioService'; // Ajusta la ruta según tu estructura
import { useAuth } from '../../../contexts/AuthContext';

const RentalInfo = ({ 
  isOpen, 
  onClose, 
  rental, 
  onDeleteMulta,
  onDeleteDanio
}) => {
  const [multas, setMultas] = useState([]);
  const [danios, setDanios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingMulta, setDeletingMulta] = useState(null);
  const [deletingDanio, setDeletingDanio] = useState(null);
  const { hasPermission, user } = useAuth();
  const isClient = hasPermission('cliente');
  const isEmployee = hasPermission('Empleado');
  const isAdmin = hasPermission('admin');

  useEffect(() => {
    if (isOpen && rental) {
      loadMultasYDanios();
    }
  }, [isOpen, rental]);

  const loadMultasYDanios = async () => {
    setLoading(true);
    try {
      // Cargar multas y daños reales desde los servicios
      if (rental?.id_alquiler) {
        const [multasData, daniosData] = await Promise.all([
          multaService.getByAlquiler(rental.id_alquiler),
          danioService.getByAlquiler(rental.id_alquiler)
        ]);
        
        setMultas(multasData);
        setDanios(daniosData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // En caso de error, mantener arrays vacíos
      setMultas([]);
      setDanios([]);
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar multa usando el servicio
  const handleDeleteMulta = async (multa) => {
    if (!multa?.id_multa) {
      console.error('ID de multa no válido');
      return;
    }

    setDeletingMulta(multa.id_multa);
    
    try {
      // Usar el servicio para eliminar la multa
      await multaService.delete(multa.id_multa);

      // Si la eliminación fue exitosa, actualizar el estado local
      setMultas(prevMultas => prevMultas.filter(m => m.id_multa !== multa.id_multa));
      
      // Opcional: llamar al callback si existe
      if (onDeleteMulta) {
        onDeleteMulta(multa);
      }

      console.log(`Multa ${multa.id_multa} eliminada correctamente`);

    } catch (error) {
      console.error('Error al eliminar la multa:', error);
      // Aquí puedes mostrar un mensaje de error al usuario
      alert(`Error al eliminar la multa: ${error.message}`);
    } finally {
      setDeletingMulta(null);
    }
  };

  // Función para eliminar daño usando el servicio
  const handleDeleteDanio = async (danio) => {
    if (!danio?.id_danio) {
      console.error('ID de daño no válido');
      return;
    }

    setDeletingDanio(danio.id_danio);
    
    try {
      // Usar el servicio para eliminar el daño
      await danioService.delete(danio.id_danio);

      // Si la eliminación fue exitosa, actualizar el estado local
      setDanios(prevDanios => prevDanios.filter(d => d.id_danio !== danio.id_danio));
      
      // Opcional: llamar al callback si existe
      if (onDeleteDanio) {
        onDeleteDanio(danio);
      }

      console.log(`Daño ${danio.id_danio} eliminado correctamente`);

    } catch (error) {
      console.error('Error al eliminar el daño:', error);
      // Aquí puedes mostrar un mensaje de error al usuario
      alert(`Error al eliminar el daño: ${error.message}`);
    } finally {
      setDeletingDanio(null);
    }
  };

  // Función para confirmar eliminación
  const confirmDeleteMulta = (multa) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la multa "${multa.detalle}"?`)) {
      handleDeleteMulta(multa);
    }
  };

  const confirmDeleteDanio = (danio) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el daño "${danio.detalle}"?`)) {
      handleDeleteDanio(danio);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        return '-';
      }
      
      return date.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return '-';
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        return '-';
      }
      
      return date.toLocaleString('es-AR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return '-';
    }
  };

  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '$0';
    return `$${amount.toLocaleString('es-AR')}`;
  };

  const calculateDaysAndTotal = () => {
    if (!rental || !rental.fecha_inicio || !rental.fecha_fin || !rental.precio_flota) {
      console.log('Datos faltantes para cálculo');
      return { days: 0, total: 0 };
    }
    
    try {
      const startStr = rental.fecha_inicio.split('T')[0];
      const endStr = rental.fecha_fin.split('T')[0];
      
      const start = new Date(startStr + 'T00:00:00');
      const end = new Date(endStr + 'T00:00:00');
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        console.log('Fechas inválidas');
        return { days: 0, total: 0 };
      }
      
      const diffTime = end - start;
      const days = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      const total = days * rental.precio_flota;
      
      return { days, total };
    } catch (error) {
      console.error('Error calculating days and total:', error);
      return { days: 0, total: 0 };
    }
  };

  const { days, total } = calculateDaysAndTotal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex items-center text-gray-600"
              title="Volver atrás"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              Información del Alquiler #{rental?.id_alquiler || 'N/A'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center text-sm"
          >
            <X className="h-4 w-4 mr-1" />
            Cerrar
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Información Principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información del Vehículo */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-3 flex items-center">
                <Car className="h-4 w-4 mr-2" />
                Información del Vehículo
              </h3>
              <div className="space-y-2 text-sm text-blue-600">
                <p><span className="font-medium">Vehículo:</span> {rental?.modelo} {rental?.marca}</p>
                <p><span className="font-medium">Patente:</span> {rental?.patente}</p>
                <p><span className="font-medium">Precio/día:</span> {formatCurrency(rental?.precio_flota)}</p>
              </div>
            </div>

            {/* Información del Cliente */}
            {isAdmin || isEmployee?
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-900 mb-3 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Información del Cliente
              </h3>
              <div className="space-y-2 text-sm text-green-600">
                <p><span className="font-medium">Cliente:</span> {rental?.nombre_cliente} {rental?.apellido_cliente}</p>
                <p><span className="font-medium">Documento:</span> {rental?.tipo_documento}: {rental?.nro_documento}</p>
                <p><span className="font-medium">Teléfono:</span> {rental?.telefono_cliente}</p>
                <p><span className="font-medium">Email:</span> {rental?.mail_cliente}</p>
              </div>
            </div>:<></>}

            {/* Fechas del Alquiler */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-purple-900 mb-3 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Fechas del Alquiler
              </h3>
              <div className="space-y-2 text-sm text-purple-600">
                <p><span className="font-medium">Inicio:</span> {formatDateTime(rental?.fecha_inicio)}</p>
                <p><span className="font-medium">Fin:</span> {formatDateTime(rental?.fecha_fin)}</p>
                <p><span className="font-medium">Duración:</span> {days} días</p>
                <p><span className="font-medium">Período:</span> {formatDate(rental?.fecha_inicio)} - {formatDate(rental?.fecha_fin)}</p>
              </div>
            </div>

            {/* Resumen Financiero */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-orange-900 mb-3 flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Resumen Financiero
              </h3>
              <div className="space-y-2 text-sm text-red-600">
                <p><span className="font-medium">Total alquiler:</span> {formatCurrency(total)}</p>
                <p><span className="font-medium">Precio por día:</span> {formatCurrency(rental?.precio_flota)}</p>
                <p><span className="font-medium">Estado:</span> {rental?.estado_desc}</p>
              </div>
            </div>
          </div>

          {/* Lista de Multas */}
          <div className="border border-gray-200 rounded-lg">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <ReceiptCent className="h-5 w-5 mr-2 text-orange-500" />
                Multas Registradas
                <span className="ml-2 bg-orange-100 text-orange-800 text-sm px-2 py-1 rounded-full">
                  {multas.length}
                </span>
              </h3>
            </div>
            <div className="p-4">
              {loading ? (
                <p className="text-gray-500 text-center py-4">Cargando multas...</p>
              ) : multas.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No hay multas registradas</p>
              ) : (
                <div className="space-y-3">
                  {multas.map(multa => (
                    <div key={multa.id_multa} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-100 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{multa.detalle}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>Costo: {formatCurrency(multa.costo)}</span>
                          <span>Fecha: {formatDate(multa.fecha_multa)}</span>
                        </div>
                      </div>
                      {isAdmin || isEmployee ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => confirmDeleteMulta(multa)}
                          className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Eliminar multa"
                          disabled={deletingMulta === multa.id_multa}
                        >
                          {deletingMulta === multa.id_multa ? (
                            <div className="h-4 w-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>):<></>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Lista de Daños */}
          <div className="border border-gray-200 rounded-lg">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Wrench className="h-5 w-5 mr-2 text-purple-500" />
                Daños Registrados
                <span className="ml-2 bg-purple-100 text-purple-800 text-sm px-2 py-1 rounded-full">
                  {danios.length}
                </span>
              </h3>
            </div>
            <div className="p-4">
              {loading ? (
                <p className="text-gray-500 text-center py-4">Cargando daños...</p>
              ) : danios.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No hay daños registrados</p>
              ) : (
                <div className="space-y-3">
                  {danios.map(danio => (
                    <div key={danio.id_danio} className="flex items-center justify-between p-3 bg-purple-50 border border-purple-100 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{danio.detalle}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Costo de reparación: {formatCurrency(danio.costo)}
                        </p>
                      </div>
                      {isAdmin || isEmployee ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => confirmDeleteDanio(danio)}
                          className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Eliminar daño"
                          disabled={deletingDanio === danio.id_danio}
                        >
                          {deletingDanio === danio.id_danio ? (
                            <div className="h-4 w-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>):<></>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Botón de cierre adicional */}
          <div className="flex justify-center pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
            >
              <X className="h-4 w-4 mr-2" />
              Cerrar Ventana
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalInfo;