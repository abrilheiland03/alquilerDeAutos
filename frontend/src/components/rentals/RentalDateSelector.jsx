import React, { useState, useEffect } from 'react';
import { Calendar, Search } from 'lucide-react';

const RentalDateSelector = ({ onSearch, loading }) => {
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [error, setError] = useState('');
  const [minDate, setMinDate] = useState('');

  // Formato YYYY-MM-DD
  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // CORRECCIÓN: Convertir string de fecha a fecha LOCAL
  const toLocalDate = (dateString) => {
    const [year, month, day] = dateString.split("-");
    return new Date(year, month - 1, day);
  };

  // Inicializar fecha mínima y fecha de inicio
  useEffect(() => {
    const today = formatDate(new Date());
    setMinDate(today);
    setFechaInicio(today);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setError('');

    if (!fechaInicio || !fechaFin) {
      setError('Debes seleccionar ambas fechas');
      return;
    }

    // CORRECCIÓN: crear fechas locales para evitar desfases UTC
    const inicio = toLocalDate(fechaInicio);
    const fin = toLocalDate(fechaFin);
    const hoy = new Date();

    // Comparar solo fechas
    inicio.setHours(0, 0, 0, 0);
    fin.setHours(0, 0, 0, 0);
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

  const handleFechaInicioChange = (e) => {
    const nuevaFecha = e.target.value;
    setFechaInicio(nuevaFecha);

    if (fechaFin && new Date(nuevaFecha) > new Date(fechaFin)) {
      setFechaFin(nuevaFecha);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Selecciona las fechas de alquiler
      </h2>
      
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Fecha de inicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fecha de Inicio *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={fechaInicio}
                onChange={handleFechaInicioChange}
                min={minDate}
                className="input-primary pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 w-full"
                required
              />
            </div>
          </div>

          {/* Fecha de fin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fecha de Fin *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                min={fechaInicio || minDate}
                className="input-primary pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 w-full"
                required
                disabled={!fechaInicio}
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 transition-colors duration-200">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !fechaInicio || !fechaFin}
          className="btn-primary w-full disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200"
        >
          <Search className="h-4 w-4 mr-2" />
          {loading ? 'Buscando...' : 'Buscar Vehículos Disponibles'}
        </button>
      </form>
    </div>
  );
};

export default RentalDateSelector;
