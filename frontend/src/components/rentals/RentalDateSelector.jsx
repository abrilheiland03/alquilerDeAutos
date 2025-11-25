import React, { useState } from 'react';
import { Calendar, Search } from 'lucide-react';


const RentalDateSelector = ({ onSearch, loading }) => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [error, setError] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setError('');

    if (!fechaInicio || !fechaFin) {
      setError('Debes seleccionar ambas fechas');
      return;
    }

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (inicio < hoy) {
      setError('La fecha de inicio no puede ser anterior a hoy');
      return;
    }

    if (fin <= inicio) {
      setError('La fecha de fin debe ser posterior a la fecha de inicio');
      return;
    }

    onSearch(fechaInicio, fechaFin);
  };

  const minDate = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        Selecciona las fechas de alquiler
      </h2>
      
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Inicio *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                min={minDate}
                className="input-primary pl-10"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Fin *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                min={fechaInicio || minDate}
                className="input-primary pl-10"
                required
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !fechaInicio || !fechaFin}
          className="btn-primary w-full disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <Search className="h-4 w-4 mr-2" />
          {loading ? 'Buscando...' : 'Buscar Vehículos Disponibles'}
        </button>
      </form>
    </div>
  );
};

export default RentalDateSelector;

