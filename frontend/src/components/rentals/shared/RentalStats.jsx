import React from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const RentalStats = ({ rentals, isClient = false }) => {
  const stats = calculateStats(rentals, isClient);

  const statConfigs = [
    {
      key: 'total',
      label: isClient ? 'Total' : 'Total Alquileres',
      value: stats.total,
      color: 'text-gray-900 dark:text-gray-100',
      bgColor: 'bg-gray-100 dark:bg-gray-700',
      iconColor: 'text-gray-600 dark:text-gray-400',
      icon: Calendar
    },
    {
      key: 'reserved',
      label: 'Reservados',
      value: stats.reserved,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      icon: Clock
    },
    {
      key: 'active',
      label: 'Activos',
      value: stats.active,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400',
      icon: CheckCircle
    },
    {
      key: 'overdue',
      label: 'Atrasados',
      value: stats.overdue,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-600 dark:text-red-400',
      icon: AlertTriangle
    },
    {
      key: 'completed',
      label: 'Finalizados',
      value: stats.completed,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
      icon: CheckCircle
    },
    {
      key: 'cancelled',
      label: 'Cancelados',
      value: stats.cancelled,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      icon: XCircle
    }
  ];

  // Para clientes, mostramos menos estadísticas
  const clientStats = ['total', 'reserved', 'active', 'completed'];
  const displayStats = isClient 
    ? statConfigs.filter(stat => clientStats.includes(stat.key))
    : statConfigs;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {displayStats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.key} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-colors duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{stat.label}</p>
              </div>
              <div className={`p-2 rounded-full ${stat.bgColor} transition-colors duration-200`}>
                <Icon className={`h-4 w-4 ${stat.iconColor}`} />
              </div>
            </div>
            
            {/* Porcentaje (solo para admin/empleado) */}
            {!isClient && stats.total > 0 && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 transition-colors duration-200">
                  <div 
                    className={`h-1 rounded-full transition-all duration-300 ${
                      stat.key === 'total' ? 'bg-gray-500 dark:bg-gray-400' :
                      stat.key === 'reserved' ? 'bg-blue-500 dark:bg-blue-400' :
                      stat.key === 'active' ? 'bg-green-500 dark:bg-green-400' :
                      stat.key === 'overdue' ? 'bg-red-500 dark:bg-red-400' :
                      stat.key === 'completed' ? 'bg-purple-500 dark:bg-purple-400' :
                      'bg-yellow-500 dark:bg-yellow-400'
                    }`}
                    style={{ width: `${(stat.value / stats.total) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                  {((stat.value / stats.total) * 100).toFixed(1)}%
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Función helper para calcular estadísticas
const calculateStats = (rentals, isClient = false) => {
  const total = rentals.length;
  const reserved = rentals.filter(r => r.estado_desc === 'Reservado').length;
  const active = rentals.filter(r => r.estado_desc === 'Activo').length;
  const overdue = rentals.filter(r => r.estado_desc === 'Atrasado').length;
  const completed = rentals.filter(r => r.estado_desc === 'Finalizado').length;
  const cancelled = rentals.filter(r => r.estado_desc === 'Cancelado').length;

  return {
    total,
    reserved,
    active,
    overdue,
    completed,
    cancelled
  };
};

export default RentalStats;