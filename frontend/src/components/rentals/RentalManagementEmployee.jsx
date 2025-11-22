import React, { useState, useEffect } from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import { rentalService } from "../../services/rentalService";
import RentalModal from './shared/RentalModal';
import RentalCard from './shared/RentalCard';
import RentalFilters from './shared/RentalFilters';
import RentalStats from './shared/RentalStats';
import { Plus } from 'lucide-react';

const RentalManagementEmployee = () => {
  const { showNotification } = useNotification();
  const [rentals, setRentals] = useState([]);
  const [filteredRentals, setFilteredRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState(null);
  const [view, setView] = useState('grid');

  // AGREGAR ESTAS FUNCIONES QUE FALTAN:
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
      setRentals(rentalsData);
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
        rental.id_alquiler?.toString().includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(rental => rental.estado_desc === statusFilter);
    }

    setFilteredRentals(filtered);
  };

  // Lógica similar pero solo con permisos de empleado
  const handleCreateRental = async (rentalData) => {
    try {
      await rentalService.create(rentalData);
      showNotification('Alquiler creado exitosamente', 'success');
      fetchRentals();
    } catch (error) {
      console.error('Error creating rental:', error);
      showNotification('Error al crear el alquiler', 'error');
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
    if (!window.confirm(`¿Estás seguro de cancelar el alquiler #${rental.id_alquiler}?`)) {
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Alquileres</h1>
          <p className="text-gray-600 mt-1">Administra los alquileres de la flota</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="mt-4 sm:mt-0 btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Alquiler
        </button>
      </div>

      <RentalStats rentals={rentals} />

      <RentalFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        view={view}
        setView={setView}
      />

      {/* Lista de alquileres con acciones de empleado */}
      {filteredRentals.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-600">No hay alquileres que coincidan con los filtros</p>
        </div>
      ) : (
        <div className={view === 'grid' 
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
              onView={() => setSelectedRental(rental)}
              isEmployee={true}
            />
          ))}
        </div>
      )}

      <RentalModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        rental={selectedRental}
        onSave={handleCreateRental}
      />
    </div>
  );
};

export default RentalManagementEmployee;