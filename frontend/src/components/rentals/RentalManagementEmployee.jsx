import React, { useState, useEffect } from 'react';
import { useNotification } from '../../contexts/NotificationContext';
import { rentalService } from "../../services/rentalService";
import RentalModal from './shared/RentalModal';
import RentalCard from './shared/RentalCard';
import RentalFilters from './shared/RentalFilters';
import RentalStats from './shared/RentalStats';
import { Plus, Calendar } from 'lucide-react';
import EventoModal from './shared/EventoModal';
import multaService from '../../services/multaService';
import danioService from '../../services/danioService';
import RentalInfo from './shared/RentalInfo';

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
  const [eventoModalOpen, setEventoModalOpen] = useState(false);
  const [selectedRentalForEvent, setSelectedRentalForEvent] = useState(null);
  const [eventoTipo, setEventoTipo] = useState('multa');
  const [rentalInfoOpen, setRentalInfoOpen] = useState(false);
  const [selectedRentalForInfo, setSelectedRentalForInfo] = useState(null);

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
      
      console.log('DEBUG - Datos recibidos para empleado:', rentalsData);
      if (rentalsData.length > 0) {
        console.log('DEBUG - Primer alquiler empleado:', rentalsData[0]);
        console.log('DEBUG - precio_flota disponible?:', 'precio_flota' in rentalsData[0]);
      }
      
      // CORRECCIÓN: NO eliminar precio_flota para empleados
      const enrichedRentals = rentalsData.map(rental => ({
        ...rental,
        nombre_cliente: rental.nombre_cliente || `Cliente #${rental.id_cliente}`,
        apellido_cliente: rental.apellido_cliente || '',
        telefono_cliente: rental.telefono_cliente || '',
        mail_cliente: rental.mail_cliente || '',
        tipo_documento: rental.tipo_documento || 'DNI',
        nro_documento: rental.nro_documento || '',
        // CORRECCIÓN: Mantener precio_flota para empleados
        // precio_flota se mantiene como viene del backend
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
        rental.nombre_cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.apellido_cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.nro_documento?.toString().includes(searchTerm)
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

  const handleSaveRental = async (rentalData) => {
    await handleCreateRental(rentalData);
  };

  const handleMulta = (rental) => {
    setSelectedRentalForEvent(rental);
    setEventoTipo('multa');
    setEventoModalOpen(true);
  };

  const handleDanio = (rental) => {
    setSelectedRentalForEvent(rental);
    setEventoTipo('danio');
    setEventoModalOpen(true);
  };

  const handleSaveEvento = async (eventData) => {
    try {
      if (eventoTipo === 'multa') {
        await multaService.create(eventData);
        showNotification('Multa registrada exitosamente', 'success');
      } else {
        await danioService.create(eventData);
        showNotification('Daño registrado exitosamente', 'success');
      }
      fetchRentals(); // Recargar la lista
    } catch (error) {
      console.error('Error saving event:', error);
      showNotification('Error al registrar', 'error');
      throw error;
    }
  };

  const handleViewRental = (rental) => {
      setSelectedRentalForInfo(rental);
      setRentalInfoOpen(true);
    };

    const handleEditMulta = (multa) => {
      alert(`Editar multa #${multa.id_multa}\nDetalle: ${multa.detalle}\nCosto: $${multa.costo}`);
    };

    const handleDeleteMulta = (multa) => {
      alert(`Eliminar multa #${multa.id_multa}\nDetalle: ${multa.detalle}`);
    };

    const handleEditDanio = (danio) => {
      alert(`Editar daño #${danio.id_danio}\nDetalle: ${danio.detalle}\nCosto: $${danio.costo}`);
    };

    const handleDeleteDanio = (danio) => {
      alert(`Eliminar daño #${danio.id_danio}\nDetalle: ${danio.detalle}`);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Alquileres</h1>
          <p className="text-gray-600 mt-1">Administra los alquileres de la flota</p>
        </div>
        <button
          onClick={() => openModal()}
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
              onView={() => openModal(rental)}
              isEmployee={true}
              onMulta={handleMulta}
              onDanio={handleDanio}
              onDetails={() => handleViewRental(rental)}
            />
          ))}
        </div>
      )}

      <RentalModal
        isOpen={modalOpen}
        onClose={closeModal}
        rental={selectedRental}
        onSave={handleSaveRental}
      />

      <EventoModal
        isOpen={eventoModalOpen}
        onClose={() => setEventoModalOpen(false)}
        rental={selectedRentalForEvent}
        onSave={handleSaveEvento}
        tipo={eventoTipo}
        onDetails={handleViewRental}
      />

      <RentalInfo
        isOpen={rentalInfoOpen}
        onClose={() => setRentalInfoOpen(false)}
        rental={selectedRentalForInfo}
        onEditMulta={handleEditMulta}
        onDeleteMulta={handleDeleteMulta}
        onEditDanio={handleEditDanio}
        onDeleteDanio={handleDeleteDanio}
      />
    </div>
  );
};

export default RentalManagementEmployee;