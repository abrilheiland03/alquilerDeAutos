import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import RentalManagementClient from './RentalManagementClient';
import RentalManagementEmployee from './RentalManagementEmployee';
import RentalManagementAdmin from './RentalManagementAdmin';

const RentalManagement = () => {
  const { isAdmin, isEmployee, isClient } = useAuth();

  if (isClient()) {
    return <RentalManagementClient />;
  }

  if (isEmployee()) {
    return <RentalManagementEmployee />;
  }

  if (isAdmin()) {
    return <RentalManagementAdmin />;
  }

  return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400">No tienes permisos para acceder a esta sección.</p>
      </div>
    </div>
  );
};

export default RentalManagement;