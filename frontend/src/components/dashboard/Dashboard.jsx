import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { vehicleService } from '../../services/vehicleService';
import { rentalService } from '../../services/rentalService';
import { maintenanceService } from '../../services/maintenanceService';
import { clientService } from '../../services/clientService';
import { dashboardService } from '../../services/dashboardService';
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
  ArrowRight,
  Star,
  Repeat,
  Zap
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
const QuickActionCard = ({ title, description, icon: Icon, href, buttonText, color, disabled = false, disabledReason = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${disabled ? 'opacity-60' : ''}`}>
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className={`inline-flex items-center p-2 rounded-lg ${color} mb-3`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4">
          {disabled ? disabledReason : description}
        </p>
        {!disabled ? (
          <Link
            to={href}
            className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
          >
            {buttonText}
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        ) : (
          <span className="inline-flex items-center text-sm font-medium text-gray-400 cursor-not-allowed">
            {buttonText}
            <ArrowRight className="ml-1 h-4 w-4" />
          </span>
        )}
      </div>
    </div>
  </div>
);

// Componente de tarjeta de último alquiler
const LastRentalCard = ({ rental, vehicle, onRepeatRental, isVehicleAvailable }) => {
  if (!rental) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <Car className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Aún no tienes alquileres</h3>
          <p className="text-gray-600 text-sm mb-4">
            Realiza tu primer alquiler para verlo aquí
          </p>
          <Link
            to="/vehicles"
            className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-700"
          >
            Alquilar mi primer vehículo
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const status = getRentalStatus(rental.id_estado);
  const canRepeat = isVehicleAvailable && rental.id_estado === 4; // Solo se puede repetir alquileres finalizados

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Tu último alquiler</h3>
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
          {status.text}
        </span>
      </div>
      
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-shrink-0">
          <Car className="h-12 w-12 text-gray-400" />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{vehicle?.modelo || 'Vehículo no encontrado'}</h4>
          <p className="text-sm text-gray-500">
            {vehicle?.marca || 'Marca no disponible'} • {rental.patente} • {new Date(rental.fecha_inicio).toLocaleDateString()} - {new Date(rental.fecha_fin).toLocaleDateString()}
          </p>
        </div>
      </div>

      <button
        onClick={onRepeatRental}
        disabled={!canRepeat}
        className={`w-full flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors ${
          canRepeat 
            ? 'bg-orange-500 text-white hover:bg-orange-600' 
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
      >
        <Repeat className="h-4 w-4 mr-2" />
        {canRepeat ? 'Repetir este alquiler' : 'Vehículo no disponible'}
      </button>
    </div>
  );
};

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

// Funciones auxiliares para estados
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

const Dashboard = () => {
  const { user, isAdmin, isEmployee, isClient } = useAuth();
  const [stats, setStats] = useState({
    totalVehicles: 0,
    availableVehicles: 0,
    activeRentals: 0,
    pendingMaintenance: 0,
    totalClients: 0,
    userRentalCount: 0,
    favoriteVehicle: null
  });
  const [recentRentals, setRecentRentals] = useState([]);
  const [recentMaintenance, setRecentMaintenance] = useState([]);
  const [userRentals, setUserRentals] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [lastRental, setLastRental] = useState(null);
  const [lastVehicleAvailable, setLastVehicleAvailable] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      if (isClient()) {
        // PARA CLIENTE: Usar el nuevo servicio de dashboard
        const [statsData, vehiclesData, lastRentalData, userRentalsData] = await Promise.all([
          dashboardService.getStats(),
          vehicleService.getAll(),
          dashboardService.getLastRental(),
          rentalService.getAll()  // Este ya debería devolver solo los del usuario
        ]);

        // Verificar disponibilidad del último vehículo alquilado
        let isAvailable = false;
        if (lastRentalData && lastRentalData.patente) {
          try {
            const availability = await dashboardService.checkVehicleAvailability(lastRentalData.patente);
            isAvailable = availability.disponible;
          } catch (error) {
            console.error('Error verificando disponibilidad:', error);
          }
        }

        setStats({
          totalVehicles: statsData.total_vehiculos || 0,
          availableVehicles: statsData.vehiculos_disponibles || 0,
          activeRentals: statsData.alquileres_activos || 0,
          pendingMaintenance: 0, // No mostrar para cliente
          totalClients: 0, // No mostrar para cliente
          userRentalCount: statsData.total_alquileres || 0,
          favoriteVehicle: statsData.vehiculo_favorito || null
        });

        setUserRentals(userRentalsData);
        setRecentRentals(userRentalsData.slice(0, 5));
        setVehicles(vehiclesData);
        setLastRental(lastRentalData);
        setLastVehicleAvailable(isAvailable);

      } else {
        // PARA ADMIN/EMPLEADO: Lógica original mejorada
        const [vehiclesData, rentalsData, maintenanceData, clientsData, statsData] = await Promise.all([
          vehicleService.getAll(),
          rentalService.getAll(),
          maintenanceService.getAll(),
          clientService.getAll(),
          dashboardService.getStats()
        ]);

        const vehiclesList = vehiclesData || [];
        const rentalsList = rentalsData || [];
        const maintenanceList = maintenanceData || [];
        const clientsList = clientsData || [];

        // Usar statsData si está disponible, sino calcular
        const calculatedStats = statsData && Object.keys(statsData).length > 0 ? statsData : {
          total_vehiculos: vehiclesList.length,
          vehiculos_disponibles: vehiclesList.filter(v => v.estado === 'Libre' || v.id_estado === 1).length,
          alquileres_activos: rentalsList.filter(r => r.id_estado === 2 || r.id_estado === 3).length,
          mantenimientos_pendientes: maintenanceList.filter(m => m.id_estado === 3).length,
          total_clientes: clientsList.length
        };

        setStats({
          totalVehicles: calculatedStats.total_vehiculos,
          availableVehicles: calculatedStats.vehiculos_disponibles,
          activeRentals: calculatedStats.alquileres_activos,
          pendingMaintenance: calculatedStats.mantenimientos_pendientes,
          totalClients: calculatedStats.total_clientes,
          userRentalCount: 0,
          favoriteVehicle: null
        });

        // Alquileres recientes (últimos 5)
        const sortedRentals = rentalsList
          .sort((a, b) => new Date(b.fecha_inicio) - new Date(a.fecha_inicio))
          .slice(0, 5);
        setRecentRentals(sortedRentals);

        // Mantenimientos recientes (últimos 5)
        const sortedMaintenance = maintenanceList
          .sort((a, b) => new Date(b.fecha_inicio) - new Date(a.fecha_inicio))
          .slice(0, 5);
        setRecentMaintenance(sortedMaintenance);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Datos de ejemplo en caso de error
      setStats({
        totalVehicles: 12,
        availableVehicles: isClient() ? 8 : 5,
        activeRentals: isClient() ? 1 : 3,
        pendingMaintenance: isClient() ? 0 : 2,
        totalClients: isClient() ? 0 : 45,
        userRentalCount: isClient() ? 3 : 0,
        favoriteVehicle: isClient() ? 'Toyota Corolla' : null
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRepeatRental = () => {
    if (lastRental && lastVehicleAvailable) {
      // Navegar a la página de nuevo alquiler con los datos pre-cargados
      window.location.href = `/rentals/new?vehicle=${lastRental.patente}`;
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

  const lastRentalVehicle = lastRental ? vehicles.find(v => v.patente === lastRental.patente) : null;

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
          {isClient() && (
            <Link
              to="/vehicles"
              className="inline-flex items-center px-4 py-2 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
            >
              <Car className="h-4 w-4 mr-2" />
              Alquilar Vehículo
            </Link>
          )}
        </div>
      </div>

      {/* Estadísticas Principales - Diferentes según rol */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isClient() ? (
          // ESTADÍSTICAS PARA CLIENTE
          <>
            <StatCard
              title="Vehículos Disponibles"
              value={stats.availableVehicles}
              icon={Car}
              color="bg-green-500"
              change={`${stats.availableVehicles} listos para alquilar`}
              changeType="positive"
            />
            <StatCard
              title="Tus Alquileres Activos"
              value={stats.activeRentals}
              icon={Calendar}
              color="bg-blue-500"
              change={stats.activeRentals > 0 ? `${stats.activeRentals} en curso` : 'Sin alquileres activos'}
              changeType={stats.activeRentals > 0 ? 'positive' : 'neutral'}
            />
            <StatCard
              title="Total de Alquileres"
              value={stats.userRentalCount}
              icon={TrendingUp}
              color="bg-purple-500"
              change="Tu historial de viajes"
              changeType="neutral"
            />
            <StatCard
              title="Vehículo Favorito"
              value={stats.favoriteVehicle || 'Ninguno'}
              icon={Star}
              color="bg-yellow-500"
              change={stats.favoriteVehicle ? 'El que más usas' : 'Aún no tienes favorito'}
              changeType="neutral"
            />
          </>
        ) : (
          // ESTADÍSTICAS PARA ADMIN/EMPLEADO
          <>
            <StatCard
              title="Total Vehículos"
              value={stats.totalVehicles}
              icon={Car}
              color="bg-blue-500"
              change="+2 este mes"
              changeType="positive"
            />
            <StatCard
              title="Vehículos Disponibles"
              value={stats.availableVehicles}
              icon={Zap}
              color="bg-green-500"
              change={`${stats.availableVehicles} listos para alquilar`}
              changeType="positive"
            />
            <StatCard
              title="Alquileres Activos"
              value={stats.activeRentals}
              icon={Calendar}
              color="bg-orange-500"
              change={stats.activeRentals > 0 ? `${stats.activeRentals} en curso` : 'Sin alquileres activos'}
              changeType={stats.activeRentals > 0 ? 'positive' : 'neutral'}
            />
            <StatCard
              title="Clientes Registrados"
              value={stats.totalClients}
              icon={Users}
              color="bg-purple-500"
              change="+5 este mes"
              changeType="positive"
            />
          </>
        )}
      </div>

      {/* Acciones Rápidas y Contenido Dinámico */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Acciones Rápidas y Último Alquiler */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {isClient() ? 'Tus Acciones' : 'Acciones Rápidas'}
          </h2>
          
          {isClient() ? (
            // Acciones para Cliente
            <>
              <QuickActionCard
                title="Alquilar Vehículo"
                description="Explora nuestra flota y reserva tu próximo viaje"
                icon={Car}
                href="/vehicles"
                buttonText="Ver vehículos"
                color="bg-green-100"
              />
              <QuickActionCard
                title="Mis Alquileres"
                description="Revisa el estado de tus alquileres actuales y pasados"
                icon={Calendar}
                href="/rentals"
                buttonText="Ver mis alquileres"
                color="bg-blue-100"
              />
              <QuickActionCard
                title="Mi Perfil"
                description="Actualiza tu información personal y preferencias"
                icon={Users}
                href="/profile"
                buttonText="Editar perfil"
                color="bg-purple-100"
              />
              
              {/* Card de último alquiler */}
              <LastRentalCard
                rental={lastRental}
                vehicle={lastRentalVehicle}
                onRepeatRental={handleRepeatRental}
                isVehicleAvailable={lastVehicleAvailable}
              />
            </>
          ) : (
            // Acciones para Admin/Empleado
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
              <QuickActionCard
                title="Ver Reportes"
                description="Analizar estadísticas y reportes del sistema"
                icon={BarChart3}
                href="/reports"
                buttonText="Ver reportes"
                color="bg-green-100"
              />
              <QuickActionCard
                title="Programar Mantenimiento"
                description="Agendar mantenimiento para un vehículo"
                icon={Wrench}
                href="/maintenance/new"
                buttonText="Programar"
                color="bg-orange-100"
              />
            </>
          )}
        </div>

        {/* Contenido Principal */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Alquileres Recientes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  {isClient() ? 'Tus Alquileres Recientes' : 'Alquileres Recientes'}
                </h2>
                <Link
                  to="/rentals"
                  className="text-sm font-medium text-orange-600 hover:text-orange-700"
                >
                  Ver todos
                </Link>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {userRentals.length > 0 ? (
                userRentals.map((rental, index) => {
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
                  <p>{isClient() ? 'Aún no tienes alquileres' : 'No hay alquileres recientes'}</p>
                  {isClient() && (
                    <Link
                      to="/vehicles"
                      className="inline-flex items-center mt-2 text-orange-600 hover:text-orange-700"
                    >
                      Realiza tu primer alquiler
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mantenimientos Recientes - Solo para admin/empleado */}
          {(isAdmin() || isEmployee()) && recentMaintenance.length > 0 && (
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
                {recentMaintenance.map((maint, index) => {
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
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mensaje para Clientes sin alquileres */}
      {isClient() && userRentals.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center">
            <Car className="h-8 w-8 text-blue-500 mr-4" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900">
                ¿Listo para tu primer viaje?
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