import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { rentalService } from '../../services/rentalService';
import RentalCard from './shared/RentalCard';
import RentalFilters from './shared/RentalFilters';
import RentalStats from './shared/RentalStats';
import { Calendar, Plus, Search, Car, XCircle } from 'lucide-react';

const RentalManagementClient = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [rentals, setRentals] = useState([]);
  const [filteredRentals, setFilteredRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [view, setView] = useState('grid');

  useEffect(() => {
    fetchRentals();
  }, []);

  useEffect(() => {
    filterRentals();
  }, [rentals, searchTerm, statusFilter]);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const rentalsData = await rentalService.getAll();
      console.log("DEBUG - Datos recibidos del backend:", rentalsData);
      console.log("DEBUG - Tipo de datos:", typeof rentalsData);
      console.log("DEBUG - Es array?:", Array.isArray(rentalsData));
      if (Array.isArray(rentalsData)) {
        console.log("DEBUG - Cantidad de alquileres:", rentalsData.length);
        if (rentalsData.length > 0) {
          console.log("DEBUG - Primer alquiler:", rentalsData[0]);
        }
      }
      setRentals(rentalsData);
    } catch (error) {
      console.error('Error fetching rentals:', error);
      showNotification('Error al cargar tus alquileres', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filterRentals = () => {
    let filtered = rentals;

    if (searchTerm) {
      filtered = filtered.filter(rental =>
        rental.patente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.id_alquiler?.toString().includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(rental => rental.estado_desc === statusFilter);
    }

    setFilteredRentals(filtered);
  };

  const handleCancelRental = async (rental) => {
    if (!window.confirm(`¿Estás seguro de que deseas cancelar el alquiler #${rental.id_alquiler}?`)) {
      return;
    }

    try {
      await rentalService.cancel(rental.id_alquiler);
      showNotification('Alquiler cancelado exitosamente', 'success');
      fetchRentals();
    } catch (error) {
      console.error('Error canceling rental:', error);
      showNotification('Error al cancelar el alquiler', 'error');
    }
  };

  const canClientCancel = (rental) => {
    return rental.estado_desc === 'Reservado';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tus alquileres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Alquileres</h1>
          <p className="text-gray-600 mt-1">
            Consulta el estado de tus alquileres actuales e históricos
          </p>
        </div>
        <Link
          to="/vehicles"
          className="mt-4 sm:mt-0 btn-primary"
        >
          <Car className="h-4 w-4 mr-2" />
          Alquilar Vehículo
        </Link>
      </div>

      {/* Filtros */}
      <RentalFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        view={view}
        setView={setView}
        isClient={true}
      />

      {/* Lista de Alquileres */}
      {filteredRentals.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tienes alquileres
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'Intenta ajustar los filtros de búsqueda' 
              : 'Comienza reservando tu primer vehículo'
            }
          </p>
          <Link
            to="/vehicles"
            className="btn-primary"
          >
            <Car className="h-4 w-4 mr-2" />
            Ver Vehículos Disponibles
          </Link>
        </div>
      ) : (
        <div className={
          view === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
        }>
          {filteredRentals.map(rental => (
            view === 'grid' ? (
              <RentalCard
                key={rental.id_alquiler}
                rental={rental}
                onCancel={canClientCancel(rental) ? handleCancelRental : null}
                onView={() => {/* Lógica para ver detalles */}}
                isClient={true}
              />
            ) : (
              <div key={rental.id_alquiler} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                {/* Vista de lista simplificada para cliente */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Calendar className="h-10 w-10 text-orange-500" />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Alquiler #{rental.id_alquiler}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {rental.modelo} - {rental.patente}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(rental.fecha_inicio).toLocaleDateString()} - {new Date(rental.fecha_fin).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`status-badge ${getStatusConfig(rental.estado_desc).color}`}>
                      {rental.estado_desc}
                    </span>
                    {canClientCancel(rental) && (
                      <button
                        onClick={() => handleCancelRental(rental)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

// Helper function (podría moverse a un archivo de utils)
const getStatusConfig = (estado) => {
  const config = {
    'Reservado': { color: 'bg-blue-100 text-blue-800' },
    'Activo': { color: 'bg-green-100 text-green-800' },
    'Atrasado': { color: 'bg-red-100 text-red-800' },
    'Finalizado': { color: 'bg-gray-100 text-gray-800' },
    'Cancelado': { color: 'bg-yellow-100 text-yellow-800' }
  };
  return config[estado] || { color: 'bg-gray-100 text-gray-800' };
};

export default RentalManagementClient;