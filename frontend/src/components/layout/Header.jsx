import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Car, LogOut, User, Menu, Bell, Settings } from 'lucide-react';

const Header = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
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
      'admin': 'bg-red-100 text-red-800',
      'empleado': 'bg-blue-100 text-blue-800',
      'cliente': 'bg-green-100 text-green-800'
    };
    return colors[role?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 z-30">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        
        {/* Left Section - Logo and Menu Button */}
        <div className="flex items-center">
          {/* Menu Button for Mobile */}
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <Link to="/dashboard" className="flex items-center ml-2 lg:ml-0">
            <Car className="h-8 w-8 text-orange-500" />
            <span className="ml-2 text-xl font-bold text-gray-900 hidden sm:block">
              IngRide
            </span>
          </Link>
        </div>

        {/* Center Section - Page Title (optional, can be dynamic) */}
        <div className="hidden md:block">
          <h1 className="text-lg font-semibold text-gray-700">
            Panel de Control
          </h1>
        </div>

        {/* Right Section - User Info and Actions */}
        <div className="flex items-center space-x-4">
          
          {/* Notifications */}
          <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Settings */}
          <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500">
            <Settings className="h-5 w-5" />
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            
            {/* User Info */}
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium text-gray-900">
                {user?.userName || 'Usuario'}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeColor(user?.userRole)}`}>
                {getUserRoleDisplay(user?.userRole)}
              </span>
            </div>

            {/* User Avatar */}
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-orange-100 text-orange-600 font-semibold text-sm">
              <User className="h-4 w-4" />
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
              title="Cerrar Sesión"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Page Title */}
      <div className="md:hidden bg-gray-50 border-t border-gray-200 px-4 py-2">
        <h1 className="text-sm font-medium text-gray-700 text-center">
          Panel de Control
        </h1>
      </div>
    </header>
  );
};

export default Header;