import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, FileText } from 'lucide-react';

const EventoModal = ({ 
  isOpen, 
  onClose, 
  rental, 
  onSave, 
  tipo // 'multa' o 'danio'
}) => {
  const [formData, setFormData] = useState({
    detalle: '',
    costo: '',
    fecha: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && rental) {
      // Establecer fecha por defecto como la fecha actual
      const today = new Date().toISOString().split('T')[0];
      setFormData({
        detalle: '',
        costo: '',
        fecha: today
      });
      setErrors({});
    }
  }, [isOpen, rental]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.detalle.trim()) {
      newErrors.detalle = 'El detalle es requerido';
    }

    if (!formData.costo || parseFloat(formData.costo) <= 0) {
      newErrors.costo = 'El costo debe ser mayor a 0';
    }

    if (tipo === 'multa' && !formData.fecha) {
      newErrors.fecha = 'La fecha es requerida';
    }

    if (tipo === 'multa' && formData.fecha && rental) {
      const fechaMulta = new Date(formData.fecha);
      const fechaInicio = new Date(rental.fecha_inicio.split('T')[0]);
      const fechaFin = new Date(rental.fecha_fin.split('T')[0]);

      if (fechaMulta < fechaInicio || fechaMulta > fechaFin) {
        newErrors.fecha = `La fecha debe estar entre ${fechaInicio.toLocaleDateString()} y ${fechaFin.toLocaleDateString()}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const eventData = {
        id_alquiler: rental.id_alquiler,
        detalle: formData.detalle,
        costo: parseFloat(formData.costo)
      };

      // Solo agregar fecha para multas
      if (tipo === 'multa') {
        eventData.fecha = formData.fecha;
      }

      await onSave(eventData);
      onClose();
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  const titulo = tipo === 'multa' 
    ? `Multa al Alquiler #${rental?.id_alquiler}`
    : `Daño al Alquiler #${rental?.id_alquiler}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full transition-colors duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {titulo}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Información del alquiler */}
          <div className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Información del Alquiler</h3>
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <p><strong>Vehículo:</strong> {rental?.modelo} {rental?.marca}</p>
              <p><strong>Patente:</strong> {rental?.patente}</p>
              <p><strong>Cliente:</strong> {rental?.nombre_cliente}</p>
            </div>
          </div>

          {/* Detalle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FileText className="h-4 w-4 inline mr-1" />
              Detalle *
            </label>
            <textarea
              name="detalle"
              value={formData.detalle}
              onChange={handleChange}
              rows={3}
              className={`input-primary ${errors.detalle ? 'border-red-500' : ''}`}
              placeholder={`Describe la ${tipo === 'multa' ? 'multa' : 'daño'}...`}
              required
            />
            {errors.detalle && (
              <p className="text-red-500 text-sm mt-1">{errors.detalle}</p>
            )}
          </div>

          {/* Costo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <DollarSign className="h-4 w-4 inline mr-1" />
              Costo ($) *
            </label>
            <input
              type="number"
              name="costo"
              value={formData.costo}
              onChange={handleChange}
              className={`input-primary ${errors.costo ? 'border-red-500' : ''}`}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
            {errors.costo && (
              <p className="text-red-500 text-sm mt-1">{errors.costo}</p>
            )}
          </div>

          {/* Fecha (solo para multas) */}
          {tipo === 'multa' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Calendar className="h-4 w-4 inline mr-1" />
                Fecha de la Multa *
              </label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                className={`input-primary ${errors.fecha ? 'border-red-500' : ''}`}
                min={rental?.fecha_inicio?.split('T')[0]}
                max={rental?.fecha_fin?.split('T')[0]}
                required
              />
              {errors.fecha && (
                <p className="text-red-500 text-sm mt-1">{errors.fecha}</p>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Guardando...' : `Registrar ${tipo === 'multa' ? 'Multa' : 'Daño'}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventoModal;