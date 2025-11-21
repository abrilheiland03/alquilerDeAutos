import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { vehicleService } from '../../services/vehicleService';
import { rentalService } from '../../services/rentalService';
import { maintenanceService } from '../../services/maintenanceService';
import { clientService } from '../../services/clientService';
import { 
  Car, 
  Users, 
  Calendar, 
  Wrench, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  ArrowRight
} from 'lucide-react';

// Componente de tarjeta de estadística
const StatCard = ({ title, value, icon: Icon, color, change, changeType }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {change && (
          <p className={`text-sm mt-1 ${
            changeType === 'positive' ? 'text-green-600' : 
            changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {change}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </div>
);

// Componente de tarjeta de acción rápida
const QuickActionCard = ({ title, description, icon: Icon, href, buttonText, color }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className={`inline-flex items-center p-2 rounded-lg ${color} mb-3`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <Link
          to={href}
          className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
        >
          {buttonText}
          <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </div>
  </div>
);

// Componente de lista de elementos recientes
const RecentItem = ({ title, subtitle, status, icon: Icon, time, statusColor }) => (
  <div className="flex items-center space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
    <div className={`p-2 rounded-full ${statusColor}`}>
      <Icon className="h-4 w-4 text-white" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-900 truncate">{title}</p>
      <p className="text-sm text-gray-500 truncate">{subtitle}</p>
    </div>
    <div className="flex flex-col items-end">
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
        {status}
      </span>
      <span className="text-xs text-gray-400 mt-1">{time}</span>
    </div>
  </div>
);

const Dashboard = () => {
  const { user, isAdmin, isEmployee, isClient } = useAuth();
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeRentals: 0,
    pendingMaintenance: 0,
    totalClients: 0
  });
  const [recentRentals, setRecentRentals] = useState([]);
  const [recentMaintenance, setRecentMaintenance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Obtener datos usando los services
      const [vehiclesData, rentalsData, maintenanceData, clientsData] = await Promise.all([
        vehicleService.getAll(),
        rentalService.getAll(),
        maintenanceService.getAll(),
        clientService.getAll()
      ]);

      const vehicles = vehiclesData || [];
      const rentals = rentalsData || [];
      const maintenance = maintenanceData || [];
      const clients = clientsData || [];

      // Calcular estadísticas
      const activeRentals = rentals.filter(rental => 
        rental.id_estado === 2 || rental.id_estado === 3 // Activo o Atrasado
      ).length;

      const pendingMaintenance = maintenance.filter(maint => 
        maint.id_estado === 3 // Pendiente
      ).length;

      setStats({
        totalVehicles: vehicles.length,
        activeRentals,
        pendingMaintenance,
        totalClients: clients.length
      });

      // Alquileres recientes (últimos 5)
      const sortedRentals = rentals
        .sort((a, b) => new Date(b.fecha_inicio) - new Date(a.fecha_inicio))
        .slice(0, 5);
      setRecentRentals(sortedRentals);

      // Mantenimientos recientes (últimos 5)
      const sortedMaintenance = maintenance
        .sort((a, b) => new Date(b.fecha_inicio) - new Date(a.fecha_inicio))
        .slice(0, 5);
      setRecentMaintenance(sortedMaintenance);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // En caso de error, mostrar datos de ejemplo
      setStats({
        totalVehicles: 12,
        activeRentals: 3,
        pendingMaintenance: 2,
        totalClients: 45
      });
    } finally {
      setLoading(false);
    }
  };

  const getRentalStatus = (estadoId) => {
    const statusMap = {
      1: { text: 'Reservado', color: 'bg-blue-100 text-blue-800' },
      2: { text: 'Activo', color: 'bg-green-100 text-green-800' },
      3: { text: 'Atrasado', color: 'bg-red-100 text-red-800' },
      4: { text: 'Finalizado', color: 'bg-gray-100 text-gray-800' },
      5: { text: 'Cancelado', color: 'bg-yellow-100 text-yellow-800' }
    };
    return statusMap[estadoId] || { text: 'Desconocido', color: 'bg-gray-100 text-gray-800' };
  };

  const getMaintenanceStatus = (estadoId) => {
    const statusMap = {
      1: { text: 'En Curso', color: 'bg-orange-100 text-orange-800' },
      2: { text: 'Finalizado', color: 'bg-green-100 text-green-800' },
      3: { text: 'Pendiente', color: 'bg-blue-100 text-blue-800' },
      4: { text: 'Cancelado', color: 'bg-red-100 text-red-800' }
    };
    return statusMap[estadoId] || { text: 'Desconocido', color: 'bg-gray-100 text-gray-800' };
  };

  const getStatusIcon = (estadoId, type) => {
    if (type === 'rental') {
      const iconMap = {
        1: Clock,      // Reservado
        2: CheckCircle, // Activo
        3: AlertTriangle, // Atrasado
        4: CheckCircle, // Finalizado
        5: XCircle     // Cancelado
      };
      return iconMap[estadoId] || Clock;
    } else {
      const iconMap = {
        1: Wrench,     // En Curso
        2: CheckCircle, // Finalizado
        3: Clock,      // Pendiente
        4: XCircle     // Cancelado
      };
      return iconMap[estadoId] || Clock;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header del Dashboard */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            ¡Bienvenido, {user?.userName}!
          </h1>
          <p className="text-gray-600 mt-1">
            {isAdmin() && 'Panel de administración completo del sistema.'}
            {isEmployee() && 'Gestión operativa de alquileres y vehículos.'}
            {isClient() && 'Seguimiento de tus alquileres y vehículos disponibles.'}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          {(isAdmin() || isEmployee()) && (
            <Link
              to="/rentals/new"
              className="inline-flex items-center px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Alquiler
            </Link>
          )}
        </div>
      </div>

      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Vehículos"
          value={stats.totalVehicles}
          icon={Car}
          color="bg-blue-500"
          change="+2 este mes"
          changeType="positive"
        />
        <StatCard
          title="Alquileres Activos"
          value={stats.activeRentals}
          icon={Calendar}
          color="bg-green-500"
          change={stats.activeRentals > 0 ? `${stats.activeRentals} en curso` : 'Sin alquileres activos'}
          changeType={stats.activeRentals > 0 ? 'positive' : 'neutral'}
        />
        <StatCard
          title="Mantenimientos Pendientes"
          value={stats.pendingMaintenance}
          icon={Wrench}
          color="bg-orange-500"
          change={stats.pendingMaintenance > 0 ? 'Requieren atención' : 'Al día'}
          changeType={stats.pendingMaintenance > 0 ? 'negative' : 'positive'}
        />
        <StatCard
          title="Clientes Registrados"
          value={stats.totalClients}
          icon={Users}
          color="bg-purple-500"
          change="+5 este mes"
          changeType="positive"
        />
      </div>

      {/* Acciones Rápidas y Contenido Dinámico */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Acciones Rápidas */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h2>
          
          {(isAdmin() || isEmployee()) && (
            <>
              <QuickActionCard
                title="Nuevo Vehículo"
                description="Agregar un nuevo vehículo a la flota"
                icon={Car}
                href="/vehicles/new"
                buttonText="Agregar vehículo"
                color="bg-blue-100"
              />
              <QuickActionCard
                title="Nuevo Cliente"
                description="Registrar un nuevo cliente en el sistema"
                icon={Users}
                href="/clients/new"
                buttonText="Registrar cliente"
                color="bg-purple-100"
              />
            </>
          )}
          
          <QuickActionCard
            title="Ver Reportes"
            description="Analizar estadísticas y reportes del sistema"
            icon={BarChart3}
            href="/reports"
            buttonText="Ver reportes"
            color="bg-green-100"
          />
          
          {(isAdmin() || isEmployee()) && (
            <QuickActionCard
              title="Programar Mantenimiento"
              description="Agendar mantenimiento para un vehículo"
              icon={Wrench}
              href="/maintenance/new"
              buttonText="Programar"
              color="bg-orange-100"
            />
          )}
        </div>

        {/* Contenido Principal */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Alquileres Recientes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Alquileres Recientes</h2>
                <Link
                  to="/rentals"
                  className="text-sm font-medium text-orange-600 hover:text-orange-700"
                >
                  Ver todos
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {recentRentals.length > 0 ? (
                recentRentals.map((rental, index) => {
                  const status = getRentalStatus(rental.id_estado);
                  const StatusIcon = getStatusIcon(rental.id_estado, 'rental');
                  return (
                    <RecentItem
                      key={index}
                      title={`Alquiler #${rental.id_alquiler}`}
                      subtitle={`${rental.modelo} - ${rental.patente}`}
                      status={status.text}
                      icon={StatusIcon}
                      time={new Date(rental.fecha_inicio).toLocaleDateString()}
                      statusColor={status.color}
                    />
                  );
                })
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                  <p>No hay alquileres recientes</p>
                </div>
              )}
            </div>
          </div>

          {/* Mantenimientos Recientes */}
          {(isAdmin() || isEmployee()) && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Mantenimientos Recientes</h2>
                  <Link
                    to="/maintenance"
                    className="text-sm font-medium text-orange-600 hover:text-orange-700"
                  >
                    Ver todos
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {recentMaintenance.length > 0 ? (
                  recentMaintenance.map((maint, index) => {
                    const status = getMaintenanceStatus(maint.id_estado);
                    const StatusIcon = getStatusIcon(maint.id_estado, 'maintenance');
                    return (
                      <RecentItem
                        key={index}
                        title={`Mantenimiento #${maint.id_mantenimiento}`}
                        subtitle={`${maint.modelo} - ${maint.patente}`}
                        status={status.text}
                        icon={StatusIcon}
                        time={new Date(maint.fecha_inicio).toLocaleDateString()}
                        statusColor={status.color}
                      />
                    );
                  })
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <Wrench className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p>No hay mantenimientos recientes</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mensaje para Clientes */}
      {isClient() && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center">
            <Car className="h-8 w-8 text-blue-500 mr-4" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900">
                ¿Listo para tu próximo viaje?
              </h3>
              <p className="text-blue-700 mt-1">
                Explora nuestra flota de vehículos y reserva el que mejor se adapte a tus necesidades.
              </p>
              <Link
                to="/vehicles"
                className="inline-flex items-center mt-3 px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
              >
                Ver Vehículos Disponibles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;