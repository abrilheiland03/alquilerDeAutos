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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-colors duration-200">
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
              className="input-primary pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* Filtros y Vistas */}
        <div className="flex items-center space-x-4">
          {/* Filtro por Estado */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="all">Todos los estados</option>
            <option value="Reservado">Reservado</option>
            <option value="Activo">Activo</option>
            <option value="Atrasado">Atrasado</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Cancelado">Cancelado</option>
          </select>

          {/* Botones de Vista */}
          <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            <button
              onClick={() => setView('grid')}
              className={`p-2 transition-colors duration-200 ${
                view === 'grid' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
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
              className={`p-2 transition-colors duration-200 ${
                view === 'list' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
              }`}
              title="Vista de lista"
            >
              <div className="w-8 h-4 flex flex-col space-y-0.5">
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
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 transition-colors duration-200">
              Búsqueda: "{searchTerm}"
              <button
                onClick={() => setSearchTerm('')}
                className="ml-1 hover:text-blue-900 dark:hover:text-blue-100"
              >
                ×
              </button>
            </span>
          )}
          {statusFilter !== 'all' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 transition-colors duration-200">
              Estado: {statusFilter}
              <button
                onClick={() => setStatusFilter('all')}
                className="ml-1 hover:text-green-900 dark:hover:text-green-100"
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
              className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 underline transition-colors duration-200"
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