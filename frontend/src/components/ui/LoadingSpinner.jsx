import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ message = 'Cargando...', size = 'medium' }) => {
  const getSizeClass = () => {
    switch (size) {
      case 'small':
        return 'w-4 h-4';
      case 'medium':
        return 'w-8 h-8';
      case 'large':
        return 'w-12 h-12';
      default:
        return 'w-8 h-8';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <Loader2 className={`${getSizeClass()} animate-spin text-orange-500 mb-2`} />
      {message && (
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center transition-colors duration-200">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;