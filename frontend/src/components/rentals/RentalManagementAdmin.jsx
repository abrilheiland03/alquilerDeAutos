import React, { useState, useEffect } from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import { rentalService } from "../../services/rentalService";
import RentalModal from './shared/RentalModal';
import RentalCard from './shared/RentalCard';
import RentalFilters from './shared/RentalFilters';
import RentalStats from './shared/RentalStats';
import { Plus, Calendar, Trash2 } from 'lucide-react';

const RentalManagementAdmin = () => {
  const { showNotification } = useNotification();
  const [rentals, setRentals] = useState([]);
  const [filteredRentals, setFilteredRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
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
      
      const enrichedRentals = rentalsData.map(rental => ({
        ...rental,
        nombre_cliente: rental.nombre_cliente || `Cliente #${rental.id_cliente}`,
        precio_flota: rental.precio_flota || 25000
      }));
      
      setRentals(enrichedRentals);
    } catch (error) {
      console.error('Error fetching rentals:', error);
      showNotification('Error al cargar los alquileres', 'error');
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
        rental.id_alquiler?.toString().includes(searchTerm) ||
        rental.nombre_cliente?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(rental => rental.estado_desc === statusFilter);
    }

    setFilteredRentals(filtered);
  };

  const handleCreateRental = async (rentalData) => {
    try {
      await rentalService.create(rentalData);
      showNotification('Alquiler creado exitosamente', 'success');
      fetchRentals();
    } catch (error) {
      console.error('Error creating rental:', error);
      if (error.response?.data?.error) {
        showNotification(error.response.data.error, 'error');
      } else {
        showNotification('Error al crear el alquiler', 'error');
      }
      throw error;
    }
  };

  const handleStartRental = async (rental) => {
    try {
      await rentalService.start(rental.id_alquiler);
      showNotification('Alquiler iniciado exitosamente', 'success');
      fetchRentals();
    } catch (error) {
      console.error('Error starting rental:', error);
      showNotification('Error al iniciar el alquiler', 'error');
    }
  };

  const handleCompleteRental = async (rental) => {
    try {
      await rentalService.complete(rental.id_alquiler);
      showNotification('Alquiler finalizado exitosamente', 'success');
      fetchRentals();
    } catch (error) {
      console.error('Error completing rental:', error);
      showNotification('Error al finalizar el alquiler', 'error');
    }
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

  const handleDeleteRental = async (rental) => {
    if (!window.confirm(`¿Estás seguro de que deseas ELIMINAR permanentemente el alquiler #${rental.id_alquiler}? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await rentalService.delete(rental.id_alquiler);
      showNotification('Alquiler eliminado exitosamente', 'success');
      fetchRentals();
    } catch (error) {
      console.error('Error deleting rental:', error);
      showNotification('Error al eliminar el alquiler', 'error');
    }
  };

  const handleSaveRental = async (rentalData) => {
    if (selectedRental) {
      showNotification('Función de edición no disponible temporalmente', 'warning');
    } else {
      await handleCreateRental(rentalData);
    }
  };

  const openModal = (rental = null) => {
    setSelectedRental(rental);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRental(null);
    setModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando alquileres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Administración de Alquileres</h1>
          <p className="text-gray-600 mt-1">
            Gestión completa de todos los alquileres del sistema
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="mt-4 sm:mt-0 btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Alquiler
        </button>
      </div>

      {/* Estadísticas */}
      <RentalStats rentals={rentals} />

      {/* Filtros */}
      <RentalFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        view={view}
        setView={setView}
      />

      {/* Lista de Alquileres */}
      {filteredRentals.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron alquileres
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'Intenta ajustar los filtros de búsqueda' 
              : 'No hay alquileres registrados en el sistema'
            }
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <button
              onClick={() => openModal()}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear Primer Alquiler
            </button>
          )}
        </div>
      ) : (
        <div className={
          view === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
        }>
          {filteredRentals.map(rental => (
            <RentalCard
              key={rental.id_alquiler}
              rental={rental}
              onStart={handleStartRental}
              onComplete={handleCompleteRental}
              onCancel={handleCancelRental}
              onDelete={handleDeleteRental}
              onView={() => openModal(rental)}
              isAdmin={true}
              view={view}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <RentalModal
        isOpen={modalOpen}
        onClose={closeModal}
        rental={selectedRental}
        onSave={handleSaveRental}
      />
    </div>
  );
};

export default RentalManagementAdmin;