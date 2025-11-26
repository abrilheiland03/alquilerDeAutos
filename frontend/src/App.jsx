import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';

// Componentes de Autenticación
import {Home, Navbar} from './components/home/home.jsx';
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Componentes del Dashboard y Módulos
import Dashboard from './components/dashboard/Dashboard';
import VehicleManagement from './components/vehicles/VehicleManagement';
import RentalManagement from './components/rentals/RentalManagement';
import ClientManagement from './components/clients/ClientManagement';
import EmployeeManagement from './components/employees/EmployeeManagement';
import MaintenanceManagement from './components/maintenance/MaintenanceManagement';
import Reports from './components/reports/Reports';

// Componentes de UI
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import LoadingSpinner from './components/ui/LoadingSpinner';
import Notification from './components/ui/Notification';

// Styles
import './styles/globals.css';
import { ThemeProvider } from './contexts/ThemeContext.jsx';

const AppContent = () => {
  const { user, loading } = useAuth();
  const handleSaveEmployee = async (employeeData) => {
    try {
      console.log("Empleado guardado:", employeeData);
      // Aquí más adelante podrás hacer POST o PUT al backend
    } catch (error) {
      console.error("Error guardando empleado:", error);
    }
  };
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <LoadingSpinner message="Verificando autenticación..." />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 flex flex-col">
      {/* Header solo se muestra cuando hay usuario autenticado */}
      {user && (
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      )}
      
      <div className="flex flex-1">
        {/* Sidebar solo para usuarios autenticados */}
        {user && (
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
          />
        )}
        
        {/* Contenido principal */}
        <main className="flex-1 p-6 overflow-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          {!user ? <Navbar /> : null}
          <Routes>
            {!user ? (
              // Rutas para usuarios NO autenticados
              <>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Navigate to="/" replace />} />
                <Route path="/vehicles" element={<VehicleManagement />} />
              </>
            ) : (
              // Rutas para usuarios autenticados
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Gestión de Vehículos */}
                <Route path="/vehicles" element={<VehicleManagement />} />
                <Route path="/vehicles/new" element={<VehicleManagement />} />
                <Route path="/vehicles/edit/:id" element={<VehicleManagement />} />
                <Route path='vehicles/libres' element={<VehicleManagement />} />
                
                {/* Gestión de Alquileres */}
                <Route path="/rentals" element={<RentalManagement />} />
                <Route path="/rentals/new" element={<RentalManagement />} />
                <Route path="/rentals/:id" element={<RentalManagement />} />
                
                {/* Gestión de Clientes */}
                <Route path="/clients" element={<ClientManagement />} />
                <Route path="/clients/new" element={<ClientManagement />} />
                <Route path="/clients/edit/:id" element={<ClientManagement />} />

                {/* Gestión de Empleados */}
                <Route
                  path="/employees"
                  element={<EmployeeManagement onSave={handleSaveEmployee} />}
                />

                <Route
                  path="/employees/new"
                  element={<EmployeeManagement onSave={handleSaveEmployee} />}
                />

                <Route
                  path="/employees/edit/:id"
                  element={<EmployeeManagement onSave={handleSaveEmployee} />}
                />

                
                {/* Gestión de Mantenimientos */}
                <Route path="/maintenance" element={<MaintenanceManagement />} />
                <Route path="/maintenance/new" element={<MaintenanceManagement />} />
                <Route path="/maintenance/:id" element={<MaintenanceManagement />} />
                
                {/* Reportes - Solo Admin y Empleados */}
                <Route path="/reports" element={<Reports />} />
                
                {/* Redirección por defecto para usuarios autenticados */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </>
            )}
          </Routes>
        </main>
      </div>
      
      <Notification />
    </div>
  );
};

function App() {
  return (
    <div className="w-full min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <ThemeProvider>
        <Router>
          <NotificationProvider>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </NotificationProvider>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;