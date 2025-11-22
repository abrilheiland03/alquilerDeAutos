import React from 'react';
import { Play, CheckCircle, XCircle, Eye, Clock, AlertTriangle, Trash2 } from 'lucide-react';

const RentalCard = ({ 
  rental, 
  onStart, 
  onComplete, 
  onCancel, 
  onDelete, 
  onView, 
  isClient = false,
  isEmployee = false,
  isAdmin = false 
}) => {
  
  const getStatusConfig = (estado) => {
    const config = {
      'Reservado': { color: 'bg-blue-100 text-blue-800', icon: Clock },
      'Activo': { color: 'bg-green-100 text-green-800', icon: Play },
      'Atrasado': { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
      'Finalizado': { color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
      'Cancelado': { color: 'bg-yellow-100 text-yellow-800', icon: XCircle }
    };
    return config[estado] || { color: 'bg-gray-100 text-gray-800', icon: Clock };
  };

  const getActions = () => {
    const baseActions = [];
    
    if (isEmployee || isAdmin) {
      if (rental.estado_desc === 'Reservado') {
        baseActions.push({ action: 'start', handler: onStart, icon: Play, color: 'green' });
      }
      if (['Activo', 'Atrasado'].includes(rental.estado_desc)) {
        baseActions.push({ action: 'complete', handler: onComplete, icon: CheckCircle, color: 'green' });
      }
    }
    
    if ((isClient && rental.estado_desc === 'Reservado') || isEmployee || isAdmin) {
      baseActions.push({ action: 'cancel', handler: onCancel, icon: XCircle, color: 'red' });
    }
    
    if (isAdmin) {
      baseActions.push({ action: 'delete', handler: onDelete, icon: Trash2, color: 'red' });
    }
    
    return baseActions;
  };

  const statusConfig = getStatusConfig(rental.estado_desc);
  const StatusIcon = statusConfig.icon;
  const actions = getActions();

  // --- CORRECCIÓN AQUÍ ---
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    const fechaPura = dateString.split('T')[0];
    
    const [year, month, day] = fechaPura.split('-');
    
    const date = new Date(year, month - 1, day);
    
    return date.toLocaleDateString('es-ES');
  };
  // -----------------------

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${statusConfig.color}`}>
            <StatusIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              Alquiler #{rental.id_alquiler}
            </h3>
            <p className="text-sm text-gray-600">
              {rental.modelo} {rental.marca} - {rental.patente}
            </p>
          </div>
        </div>
        <span className={`status-badge ${statusConfig.color}`}>
          {rental.estado_desc}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Cliente</p>
          <p className="font-medium text-gray-900">
            {isClient ? 'Tú' : rental.nombre_cliente}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Precio/día</p>
          <p className="font-medium text-gray-900">
            ${rental.precio_flota?.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Fecha inicio</p>
          <p className="font-medium text-gray-900">
            {formatDate(rental.fecha_inicio)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Fecha fin</p>
          <p className="font-medium text-gray-900">
            {formatDate(rental.fecha_fin)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
        <button 
          onClick={() => onView(rental)} 
          className="flex items-center text-sm text-blue-600 hover:text-blue-700"
        >
          <Eye className="h-4 w-4 mr-1" />
          Ver Detalles
        </button>
        <div className="flex items-center space-x-2">
          {actions.map(({ action, handler, icon: Icon, color }) => (
            <button
              key={action}
              onClick={() => handler(rental)}
              className={`p-2 text-gray-400 hover:text-${color}-500 hover:bg-${color}-50 rounded-lg transition-colors`}
              title={action === 'start' ? 'Iniciar alquiler' : 
                     action === 'complete' ? 'Finalizar alquiler' : 
                     action === 'cancel' ? 'Cancelar alquiler' : 
                     'Eliminar alquiler'}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RentalCard;