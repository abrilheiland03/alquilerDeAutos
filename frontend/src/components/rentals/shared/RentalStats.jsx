import React from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const RentalStats = ({ rentals, isClient = false }) => {
  const stats = calculateStats(rentals, isClient);

  const statConfigs = [
    {
      key: 'total',
      label: isClient ? 'Total' : 'Total Alquileres',
      value: stats.total,
      color: 'text-gray-900',
      bgColor: 'bg-gray-100',
      icon: Calendar
    },
    {
      key: 'reserved',
      label: 'Reservados',
      value: stats.reserved,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      icon: Clock
    },
    {
      key: 'active',
      label: 'Activos',
      value: stats.active,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      icon: CheckCircle
    },
    {
      key: 'overdue',
      label: 'Atrasados',
      value: stats.overdue,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      icon: AlertTriangle
    },
    {
      key: 'completed',
      label: 'Finalizados',
      value: stats.completed,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      icon: CheckCircle
    },
    {
      key: 'cancelled',
      label: 'Cancelados',
      value: stats.cancelled,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
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
          <div key={stat.key} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
              </div>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
            
            {/* Porcentaje (solo para admin/empleado) */}
            {!isClient && stats.total > 0 && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div 
                    className={`h-1 rounded-full ${stat.bgColor.replace('bg-', 'bg-').replace('-100', '-500')}`}
                    style={{ width: `${(stat.value / stats.total) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">
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