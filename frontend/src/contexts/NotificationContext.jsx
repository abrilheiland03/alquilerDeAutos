import React, { createContext, useState, useContext } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification debe ser usado dentro de un NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'info', // 'info', 'success', 'warning', 'error'
    duration: 5000
  });

  const showNotification = (message, type = 'info', duration = 5000) => {
    setNotification({
      show: true,
      message,
      type,
      duration
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      show: false
    }));
  };

  const value = {
    notification,
    showNotification,
    hideNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};