import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import axios from 'axios';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  Filter,
  Car,
  Users,
  DollarSign,
  TrendingUp,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  PieChart,
  LineChart,
  FileText
} from 'lucide-react';

// URL base de la API
const API_BASE_URL = 'http://localhost:5000/api';

// Componente de Tarjeta de Métrica
const MetricCard = ({ title, value, change, changeType, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {change && (
          <p className={`text-sm mt-1 flex items-center ${
            changeType === 'positive' ? 'text-green-600' : 
            changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
          }`}>
            <TrendingUp className={`h-4 w-4 mr-1 ${
              changeType === 'positive' ? 'text-green-500' : 
              changeType === 'negative' ? 'text-red-500' : 'text-gray-500'
            }`} />
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

// Componente de Gráfico de Barras Simple
const BarChart = ({ data, title, color = 'bg-blue-500' }) => {
  const maxValue = Math.max(...data.map(item => item.value), 1);
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600 w-20 truncate">{item.label}</span>
            <div className="flex-1 mx-4">
              <div className="bg-gray-200 rounded-full h-4">
                <div 
                  className={`h-4 rounded-full ${color} transition-all duration-500`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                ></div>
              </div>
            </div>
            <span className="text-sm font-medium text-gray-900 w-12 text-right">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente de Gráfico de Líneas Simple
const LineChartComponent = ({ data, title, color = 'text-blue-500' }) => {
  const maxValue = Math.max(...data.map(item => item.value), 1);
  const minValue = Math.min(...data.map(item => item.value), 0);
  const range = maxValue - minValue;
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="h-48 relative">
        <div className="absolute inset-0 flex items-end">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center mx-1"
              style={{ height: '100%' }}
            >
              <div
                className={`w-8 ${color.replace('text-', 'bg-')} rounded-t transition-all duration-500`}
                style={{ 
                  height: `${((item.value - minValue) / range) * 80}%`,
                  minHeight: '4px'
                }}
              ></div>
              <div className="text-xs text-gray-500 mt-2 text-center">
                {item.label}
              </div>
              <div className="text-xs font-medium text-gray-900 mt-1">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Reports = () => {
  const { hasPermission } = useAuth();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [reportData, setReportData] = useState({
    metrics: {},
    ranking: [],
    evolution: [],
    revenue: []
  });

  const canViewReports = hasPermission('empleado');

  useEffect(() => {
    if (canViewReports) {
      fetchReports();
    }
  }, [dateRange, canViewReports]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      
      // Fetch todos los reportes en paralelo
      const [rankingRes, evolutionRes, revenueRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/reportes/ranking-vehiculos`, {
          params: {
            fecha_desde: dateRange.start,
            fecha_hasta: dateRange.end
          }
        }),
        axios.get(`${API_BASE_URL}/reportes/evolucion-alquileres`, {
          params: {
            fecha_desde: dateRange.start,
            fecha_hasta: dateRange.end
          }
        }),
        axios.get(`${API_BASE_URL}/reportes/facturacion`, {
          params: {
            fecha_desde: dateRange.start,
            fecha_hasta: dateRange.end
          }
        })
      ]);

      // Calcular métricas basadas en los datos
      const metrics = calculateMetrics(rankingRes.data, evolutionRes.data, revenueRes.data);

      setReportData({
        metrics,
        ranking: rankingRes.data || [],
        evolution: evolutionRes.data || [],
        revenue: revenueRes.data || []
      });

    } catch (error) {
      console.error('Error fetching reports:', error);
      showNotification('Error al cargar los reportes', 'error');
      
      // Datos de ejemplo para desarrollo
      setReportData(getSampleData());
    } finally {
      setLoading(false);
    }
  };

  const calculateMetrics = (ranking, evolution, revenue) => {
    const totalRevenue = revenue.reduce((sum, item) => sum + item.total_facturado, 0);
    const totalRentals = evolution.reduce((sum, item) => sum + item.total_alquileres, 0);
    const avgRentalDuration = 3; // Esto vendría del backend en un sistema real
    const popularVehicle = ranking[0] || { modelo: 'N/A', cantidad_alquileres: 0 };

    return {
      totalRevenue,
      totalRentals,
      avgRentalDuration,
      popularVehicle: `${popularVehicle.modelo} (${popularVehicle.cantidad_alquileres})`,
      revenueGrowth: '+15%',
      rentalGrowth: '+8%'
    };
  };

  const getSampleData = () => {
    return {
      metrics: {
        totalRevenue: 1250000,
        totalRentals: 45,
        avgRentalDuration: 3.2,
        popularVehicle: 'Toyota Corolla (12)',
        revenueGrowth: '+15%',
        rentalGrowth: '+8%'
      },
      ranking: [
        { patente: 'AA111AA', modelo: 'Toyota Corolla', marca: 'Toyota', cantidad_alquileres: 12 },
        { patente: 'BB222BB', modelo: 'Ford Focus', marca: 'Ford', cantidad_alquileres: 8 },
        { patente: 'CC333CC', modelo: 'Chevrolet Cruze', marca: 'Chevrolet', cantidad_alquileres: 6 },
        { patente: 'DD444DD', modelo: 'Renault Clio', marca: 'Renault', cantidad_alquileres: 5 },
        { patente: 'EE555EE', modelo: 'Volkswagen Golf', marca: 'Volkswagen', cantidad_alquileres: 4 }
      ],
      evolution: [
        { periodo: '2024-01', total_alquileres: 8 },
        { periodo: '2024-02', total_alquileres: 12 },
        { periodo: '2024-03', total_alquileres: 15 },
        { periodo: '2024-04', total_alquileres: 10 },
        { periodo: '2024-05', total_alquileres: 18 },
        { periodo: '2024-06', total_alquileres: 22 }
      ],
      revenue: [
        { periodo: '2024-01', total_facturado: 185000 },
        { periodo: '2024-02', total_facturado: 265000 },
        { periodo: '2024-03', total_facturado: 320000 },
        { periodo: '2024-04', total_facturado: 240000 },
        { periodo: '2024-05', total_facturado: 410000 },
        { periodo: '2024-06', total_facturado: 485000 }
      ]
    };
  };

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExport = (type) => {
    // Simulación de exportación
    showNotification(`Exportando reporte ${type}...`, 'info');
    setTimeout(() => {
      showNotification(`Reporte ${type} exportado exitosamente`, 'success');
    }, 1500);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  if (!canViewReports) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Acceso Restringido</h3>
          <p className="text-gray-600">
            No tienes permisos para acceder a los reportes del sistema.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando reportes...</p>
        </div>
      </div>
    );
  }

  const { metrics, ranking, evolution, revenue } = reportData;

  // Preparar datos para gráficos
  const rankingChartData = ranking.slice(0, 5).map(item => ({
    label: item.modelo,
    value: item.cantidad_alquileres
  }));

  const evolutionChartData = evolution.map(item => ({
    label: item.periodo.split('-')[1], // Mes
    value: item.total_alquileres
  }));

  const revenueChartData = revenue.map(item => ({
    label: item.periodo.split('-')[1], // Mes
    value: item.total_facturado / 1000 // En miles para mejor visualización
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reportes y Análisis</h1>
          <p className="text-gray-600 mt-1">
            Métricas y estadísticas del sistema de alquileres
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => handleExport('PDF')}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FileText className="h-4 w-4 mr-2" />
            PDF
          </button>
          <button
            onClick={() => handleExport('Excel')}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Excel
          </button>
        </div>
      </div>

      {/* Filtros de Fecha */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <Calendar className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Período:</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <div>
              <label className="text-sm text-gray-600 mr-2">Desde:</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => handleDateChange('start', e.target.value)}
                className="input-primary"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mr-2">Hasta:</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => handleDateChange('end', e.target.value)}
                className="input-primary"
              />
            </div>
            <button
              onClick={fetchReports}
              className="btn-primary"
            >
              <Filter className="h-4 w-4 mr-2" />
              Aplicar
            </button>
          </div>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Facturación Total"
          value={formatCurrency(metrics.totalRevenue)}
          change={metrics.revenueGrowth}
          changeType="positive"
          icon={DollarSign}
          color="bg-green-500"
        />
        <MetricCard
          title="Total Alquileres"
          value={metrics.totalRentals}
          change={metrics.rentalGrowth}
          changeType="positive"
          icon={Calendar}
          color="bg-blue-500"
        />
        <MetricCard
          title="Duración Promedio"
          value={`${metrics.avgRentalDuration} días`}
          change="+0.2 días"
          changeType="positive"
          icon={Clock}
          color="bg-orange-500"
        />
        <MetricCard
          title="Vehículo Más Popular"
          value={metrics.popularVehicle}
          change="Este período"
          changeType="neutral"
          icon={Award}
          color="bg-purple-500"
        />
      </div>

      {/* Gráficos y Análisis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ranking de Vehículos */}
        <BarChart
          data={rankingChartData}
          title="Vehículos Más Alquilados"
          color="bg-blue-500"
        />

        {/* Evolución de Alquileres */}
        <LineChartComponent
          data={evolutionChartData}
          title="Evolución Mensual de Alquileres"
          color="text-green-500"
        />

        {/* Facturación Mensual */}
        <div className="lg:col-span-2">
          <LineChartComponent
            data={revenueChartData}
            title="Facturación Mensual (en miles de $)"
            color="text-purple-500"
          />
        </div>
      </div>

      {/* Tablas Detalladas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ranking Detallado */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Car className="h-5 w-5 mr-2 text-blue-500" />
              Ranking de Vehículos
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehículo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alquileres
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Posición
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ranking.map((vehicle, index) => (
                  <tr key={vehicle.patente} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {vehicle.modelo}
                        </div>
                        <div className="text-sm text-gray-500">
                          {vehicle.marca} • {vehicle.patente}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{vehicle.cantidad_alquileres}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        index === 0 ? 'bg-yellow-100 text-yellow-800' :
                        index === 1 ? 'bg-gray-100 text-gray-800' :
                        index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        #{index + 1}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Facturación Detallada */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-500" />
              Facturación por Período
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Período
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Facturación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Crecimiento
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {revenue.map((item, index) => {
                  const prevRevenue = index > 0 ? revenue[index - 1].total_facturado : item.total_facturado;
                  const growth = ((item.total_facturado - prevRevenue) / prevRevenue) * 100;
                  
                  return (
                    <tr key={item.periodo} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(item.periodo + '-01').toLocaleDateString('es-AR', { 
                            year: 'numeric', 
                            month: 'long' 
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">
                          {formatCurrency(item.total_facturado)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center text-sm font-medium ${
                          growth >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <TrendingUp className={`h-4 w-4 mr-1 ${
                            growth >= 0 ? 'text-green-500' : 'text-red-500'
                          }`} />
                          {growth >= 0 ? '+' : ''}{growth.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Resumen Ejecutivo */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Resumen Ejecutivo
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <p className="font-medium mb-2">Puntos Destacados:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Crecimiento sostenido en la facturación mensual</li>
              <li>Aumento del 8% en el número total de alquileres</li>
              <li>Toyota Corolla lidera como vehículo más popular</li>
              <li>Duración promedio de alquiler estable en 3.2 días</li>
            </ul>
          </div>
          <div>
            <p className="font-medium mb-2">Recomendaciones:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Considerar aumentar la flota de vehículos populares</li>
              <li>Promocionar vehículos menos alquilados con ofertas</li>
              <li>Optimizar períodos de mantenimiento preventivo</li>
              <li>Evaluar ajuste de tarifas según demanda estacional</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;