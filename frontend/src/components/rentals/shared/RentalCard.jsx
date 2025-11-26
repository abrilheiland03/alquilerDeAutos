import React from 'react';
import { Play, CheckCircle, XCircle, Clock, AlertTriangle, Trash2, DollarSign, Shield, Wrench, Receipt, ReceiptCent, ReceiptCentIcon, Eye } from 'lucide-react';

const RentalCard = ({ 
  rental, 
  onStart, 
  onComplete, 
  onCancel, 
  onDelete, 
  onView, 
  onMulta,
  onDanio,
  isClient = false,
  isEmployee = false,
  isAdmin = false,
  onDetails
}) => {
  
  const getStatusConfig = (estado) => {
    const config = {
      'Reservado': { 
        color: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200', 
        icon: Clock 
      },
      'Activo': { 
        color: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200', 
        icon: Play 
      },
      'Atrasado': { 
        color: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200', 
        icon: AlertTriangle 
      },
      'Finalizado': { 
        color: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200', 
        icon: CheckCircle 
      },
      'Cancelado': { 
        color: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200', 
        icon: XCircle 
      }
    };
    return config[estado] || { 
      color: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200', 
      icon: Clock 
    };
  };

  const getActions = () => {
    const baseActions = [];

    baseActions.push({ action: 'view', handler: onDetails, icon: Eye, color: 'blue' });
    
    if (isEmployee || isAdmin) {
      if (rental.estado_desc === 'Reservado') {
        baseActions.push({ action: 'start', handler: onStart, icon: Play, color: 'green' });
      }
      if (['Activo', 'Atrasado'].includes(rental.estado_desc)) {
        baseActions.push({ action: 'complete', handler: onComplete, icon: CheckCircle, color: 'green' });
      }
    }
    
    // CORRECCIÓN 1: No mostrar cancelar para estados Activo o Finalizado
    if ((isClient && rental.estado_desc === 'Reservado') || 
        ((isEmployee || isAdmin) && !['Activo', 'Finalizado'].includes(rental.estado_desc))) {
      baseActions.push({ action: 'cancel', handler: onCancel, icon: XCircle, color: 'red' });
    }
    
    // Nuevas acciones para multas y daños (solo empleados y admin)
    if (isEmployee || isAdmin) {
      // Multas - disponible para alquileres activos, atrasados o finalizados
      if (['Activo', 'Atrasado', 'Finalizado'].includes(rental.estado_desc)) {
        baseActions.push({ action: 'multa', handler: onMulta, icon: ReceiptCent, color: 'orange' });
      }
      
      // Daños - disponible para alquileres activos, atrasados o finalizados
      if (['Activo', 'Atrasado', 'Finalizado'].includes(rental.estado_desc)) {
        baseActions.push({ action: 'danio', handler: onDanio, icon: Wrench, color: 'purple' });
      }
    }
    
    if (isAdmin) {
      baseActions.push({ action: 'delete', handler: onDelete, icon: Trash2, color: 'red' });
    }
    
    return baseActions;
  };

  const statusConfig = getStatusConfig(rental.estado_desc);
  const StatusIcon = statusConfig.icon;
  const actions = getActions();

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    const fechaPura = dateString.split('T')[0];
    
    const [year, month, day] = fechaPura.split('-');
    
    const date = new Date(year, month - 1, day);
    
    return date.toLocaleDateString('es-ES');
  };

  // Calcular días y total
  const calculateDaysAndTotal = () => {
    if (!rental.fecha_inicio || !rental.fecha_fin || !rental.precio_flota) {
      return { days: 0, total: 0 };
    }
    
    try {
      const start = new Date(rental.fecha_inicio.split('T')[0]);
      const end = new Date(rental.fecha_fin.split('T')[0]);
      const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
      const total = days * rental.precio_flota;
      
      return { days, total };
    } catch (error) {
      console.error('Error calculando días y total:', error);
      return { days: 0, total: 0 };
    }
  };

  const { days, total } = calculateDaysAndTotal();

  // CORRECCIÓN 4: Mostrar información completa del cliente para admin y empleado
  const renderClientInfo = () => {
    if (isClient) {
      return <p className="font-medium text-gray-900 dark:text-white">Tú</p>;
    }
    
    // Para empleados y administradores, mostrar información completa
    if (isEmployee || isAdmin) {
      return (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {rental.nombre_cliente || 'N/A'} {rental.apellido_cliente || ''}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {rental.tipo_documento || 'DNI'}: {rental.nro_documento || 'N/A'}
          </p>
          {rental.telefono_cliente && (
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Tel: {rental.telefono_cliente}
            </p>
          )}
          {rental.mail_cliente && (
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Mail: {rental.mail_cliente}
            </p>
          )}
        </div>
      );
    }
    
    return rental.nombre_cliente || `Cliente #${rental.id_cliente}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${statusConfig.color}`}>
            <StatusIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Alquiler #{rental.id_alquiler}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {rental.modelo} {rental.marca} - {rental.patente}
            </p>
          </div>
        </div>
        <span className={`status-badge ${statusConfig.color}`}>
          {rental.estado_desc}
        </span>
      </div>

      {/* Información del cliente */}
      <div className="mb-4">
        <div className={isEmployee || isAdmin ? 'mb-4' : ''}>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Cliente</p>
          {renderClientInfo()}
        </div>
      </div>

      {/* Grid reorganizado - Fechas y precios en la misma fila */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Fecha inicio */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Fecha inicio</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {formatDate(rental.fecha_inicio)}
          </p>
        </div>
        
        {/* Fecha fin */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Fecha fin</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {formatDate(rental.fecha_fin)}
          </p>
        </div>
        
        {/* Precio/día */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Precio/día</p>
          <p className="font-medium text-gray-900 dark:text-white">
            ${rental.precio_flota?.toLocaleString() || 'N/A'}
          </p>
        </div>
        
        {/* Días */}
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Días</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {days}
          </p>
        </div>
      </div>

      {/* Total - Ocupa toda la fila */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Total estimado</p>
          <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
            ${total.toLocaleString()}
          </p>
        </div>
      </div>

      {/* CORRECCIÓN 1: Acciones alineadas a la derecha */}
      <div className="flex items-center justify-end mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          {actions.map(({ action, handler, icon: Icon, color }) => (
            <button
              key={action}
              onClick={() => handler(rental)}
              className={`p-2 text-gray-400 hover:text-${color}-500 hover:bg-${color}-50 dark:hover:bg-${color}-900 rounded-lg transition-colors duration-200`}
              title={
                action === 'view' ? 'Ver información detallada' :
                action === 'start' ? 'Iniciar alquiler' : 
                action === 'complete' ? 'Finalizar alquiler' : 
                action === 'cancel' ? 'Cancelar alquiler' : 
                action === 'multa' ? 'Registrar multa' :
                action === 'danio' ? 'Registrar daño' :
                'Eliminar alquiler'
              }
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