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
    // Lógica específica de empleado
  };

  const handleCompleteRental = async (rental) => {
    // Lógica específica de empleado
  };

  const handleCancelRental = async (rental) => {
    // Lógica específica de empleado
  };

  // ... resto de lógica similar pero sin opciones de eliminar

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