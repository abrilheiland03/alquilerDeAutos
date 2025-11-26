import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// URL base de la API
const API_BASE_URL = 'http://localhost:5000/api';

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay un usuario autenticado al cargar la aplicación
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const userName = localStorage.getItem('userName');
      const userRole = localStorage.getItem('userRole');

      if (userId && userName && userRole) {
        // Verificar con el backend si el usuario sigue siendo válido
        try {
          // Esta llamada verifica que el usuario exista y tenga permisos
          const response = await axios.get(`${API_BASE_URL}/usuarios/${userId}`, {
            headers: {
              'user-id': userId
            }
          });

          if (response.data) {
            setUser({
              userId: userId,
              userName: userName,
              userRole: userRole
            });
          } else {
            // Si el backend no reconoce al usuario, limpiar localStorage
            logout();
          }
        } catch (error) {
          console.error('Error verificando autenticación:', error);
          // Si hay error en la verificación, mantener la sesión local
          // pero podrías decidir hacer logout aquí también
          setUser({
            userId: userId,
            userName: userName,
            userRole: userRole
          });
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función de login
  const login = async (userData) => {
    try {
      // Guardar en localStorage
      localStorage.setItem('userId', userData.userId);
      localStorage.setItem('userName', userData.userName);
      localStorage.setItem('userRole', userData.userRole);

      // Configurar axios para enviar el user-id en todas las requests
      axios.defaults.headers.common['user-id'] = userData.userId;

      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Error during login:', error);
      return { success: false, error: 'Error durante el login' };
    }
  };

  // Función para actualizar los datos del usuario
  const updateUser = (updatedUser) => {
    setUser(prevUser => ({
      ...prevUser,
      ...updatedUser
    }));
  };

  // Función de logout
  const logout = async () => {
    try {
      // Limpiar localStorage
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userRole');

      // Remover header de axios
      delete axios.defaults.headers.common['user-id'];

      // Limpiar estado
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Verificar permisos
  const hasPermission = (requiredRole) => {
    if (!user) return false;

    const userRole = user.userRole?.toLowerCase();
    const required = requiredRole?.toLowerCase();

    // Jerarquía de permisos
    const roleHierarchy = {
      'admin': ['admin', 'empleado', 'cliente'],
      'empleado': ['empleado', 'cliente'],
      'cliente': ['cliente']
    };

    return roleHierarchy[userRole]?.includes(required) || false;
  };

  // Verificar si es admin
  const isAdmin = () => {
    return user?.userRole?.toLowerCase() === 'admin';
  };

  // Verificar si es empleado
  const isEmployee = () => {
    return user?.userRole?.toLowerCase() === 'empleado';
  };

  // Verificar si es cliente
  const isClient = () => {
    return user?.userRole?.toLowerCase() === 'cliente';
  };

  // Obtener información del usuario actual
  const getCurrentUser = () => {
    return user;
  };

  // Valor del contexto
  const value = {
    user,
    loading,
    login,
    logout,
    hasPermission,
    isAdmin,
    isEmployee,
    isClient,
    getCurrentUser,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;