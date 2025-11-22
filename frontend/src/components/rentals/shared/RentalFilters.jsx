import React from 'react';
import { Search } from 'lucide-react';

const RentalFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  view,
  setView,
  isClient = false
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        {/* Búsqueda */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={isClient ? "Buscar en mis alquileres..." : "Buscar por patente, modelo, ID o cliente..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-primary pl-10"
            />
          </div>
        </div>

        {/* Filtros y Vistas */}
        <div className="flex items-center space-x-4">
          {/* Filtro por Estado */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-primary"
          >
            <option value="all">Todos los estados</option>
            <option value="Reservado">Reservado</option>
            <option value="Activo">Activo</option>
            <option value="Atrasado">Atrasado</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Cancelado">Cancelado</option>
          </select>

          {/* Botones de Vista */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setView('grid')}
              className={`p-2 ${view === 'grid' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600'}`}
              title="Vista de cuadrícula"
            >
              <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
              </div>
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 ${view === 'list' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600'}`}
              title="Vista de lista"
            >
              <div className="w-4 h-4 flex flex-col space-y-0.5">
                <div className="bg-current h-1 rounded-sm"></div>
                <div className="bg-current h-1 rounded-sm"></div>
                <div className="bg-current h-1 rounded-sm"></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Filtros activos */}
      {(searchTerm || statusFilter !== 'all') && (
        <div className="mt-4 flex flex-wrap gap-2">
          {searchTerm && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              Búsqueda: "{searchTerm}"
              <button
                onClick={() => setSearchTerm('')}
                className="ml-1 hover:text-blue-900"
              >
                ×
              </button>
            </span>
          )}
          {statusFilter !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
              Estado: {statusFilter}
              <button
                onClick={() => setStatusFilter('all')}
                className="ml-1 hover:text-green-900"
              >
                ×
              </button>
            </span>
          )}
          {(searchTerm || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="text-xs text-gray-600 hover:text-gray-800 underline"
            >
              Limpiar todos
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RentalFilters;