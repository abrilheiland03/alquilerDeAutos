import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Car, LogOut, User, Menu, Bell, Settings, Sun, Moon } from 'lucide-react';
import logoNaranja from '../../assets/logo-sin-fondo.png';

const Header = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const getUserRoleDisplay = (role) => {
    const roles = {
      'admin': 'Administrador',
      'empleado': 'Empleado', 
      'cliente': 'Cliente'
    };
    return roles[role?.toLowerCase()] || role;
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      'admin': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'empleado': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'cliente': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    };
    return colors[role?.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 z-30 transition-colors duration-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        
        {/* Left Section - Logo and Menu Button */}
        <div className="flex items-center">
          {/* Menu Button for Mobile */}
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 lg:hidden transition-colors duration-200"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center ml-2 lg:ml-0">
            <img 
              src={logoNaranja} 
              alt="IngRide Logo" 
              className="max-h-20 w-auto mr-4 object-contain"
            />
          </Link>
        </div>

        {/* Center Section - Page Title (optional, can be dynamic) */}
        <div className="hidden md:block">
          <h1 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Panel de Control
          </h1>
        </div>

        {/* Right Section - User Info and Actions */}
        <div className="flex items-center space-x-3">
          
          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-200"
            title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Notifications */}
          <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 relative transition-colors duration-200">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Settings */}
          <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-200">
            <Settings className="h-5 w-5" />
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-3 border-l border-gray-200 dark:border-gray-600 pl-3">
            
            {/* User Info */}
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.userName || 'Usuario'}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeColor(user?.userRole)}`}>
                {getUserRoleDisplay(user?.userRole)}
              </span>
            </div>

            {/* User Avatar */}
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 font-semibold text-sm">
              <User className="h-4 w-4" />
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900 dark:hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
              title="Cerrar Sesión"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Page Title */}
      <div className="md:hidden bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 px-4 py-2">
        <h1 className="text-sm font-medium text-gray-700 dark:text-gray-200 text-center">
          Panel de Control
        </h1>
      </div>
    </header>
  );
};

export default Header;