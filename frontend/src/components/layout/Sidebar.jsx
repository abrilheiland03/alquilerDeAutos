import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Car, 
  Users, 
  Calendar, 
  Wrench, 
  BarChart3, 
  Home,
  X,
  Shield,
  UserCheck
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, hasPermission } = useAuth();
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      permission: null, // Todos los usuarios autenticados
    },
    {
      name: 'Vehículos',
      href: '/vehicles',
      icon: Car,
      permission: 'empleado', // Empleados y Admin
    },
    {
      name: 'Clientes',
      href: '/clients',
      icon: Users,
      permission: 'empleado', // Empleados y Admin
    },
    {
      name: 'Alquileres',
      href: '/rentals',
      icon: Calendar,
      permission: 'cliente', // Todos los usuarios autenticados
    },
    {
      name: 'Mantenimientos',
      href: '/maintenance',
      icon: Wrench,
      permission: 'empleado', // Empleados y Admin
    },
    {
      name: 'Reportes',
      href: '/reports',
      icon: BarChart3,
      permission: 'empleado', // Empleados y Admin
    },
  ];

  const adminItems = [
    {
      name: 'Administración',
      href: '/admin',
      icon: Shield,
      permission: 'admin', // Solo Admin
    },
  ];

  const isItemActive = (href) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const canShowItem = (permission) => {
    if (!permission) return true;
    return hasPermission(permission);
  };

  const filteredNavigationItems = navigationItems.filter(item => canShowItem(item.permission));
  const filteredAdminItems = adminItems.filter(item => canShowItem(item.permission));

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">MENU</span>
          </div>
          
          {/* Close Button for Mobile */}
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 lg:hidden transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto scrollbar-thin">
          
          {/* Main Navigation */}
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Navegación
            </p>
            
            {filteredNavigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = isItemActive(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onClose}
                  className={`
                    flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                    ${isActive 
                      ? 'bg-orange-50 dark:bg-orange-900 text-orange-700 dark:text-orange-300 border-r-2 border-orange-500' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                    }
                  `}
                >
                  <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-orange-500' : 'text-gray-400 dark:text-gray-500'}`} />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Admin Section */}
          {filteredAdminItems.length > 0 && (
            <div className="space-y-1 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Administración
              </p>
              
              {filteredAdminItems.map((item) => {
                const Icon = item.icon;
                const isActive = isItemActive(item.href);
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className={`
                      flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                      ${isActive 
                        ? 'bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 border-r-2 border-red-500' 
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                      }
                    `}
                  >
                    <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          )}

          {/* User Info Section */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="px-3 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                    <UserCheck className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.userName || 'Usuario'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {user?.userRole?.toLowerCase() || 'Rol no definido'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <span className="text-xs font-medium text-green-800 dark:text-green-200">v1.0</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white">IngRide</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Sistema de Gestión</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;