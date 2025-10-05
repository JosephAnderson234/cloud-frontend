import { useState } from 'react';
import type { OrderDetailsFormProps, OrderDetailsFormData } from '@interfaces/deliveryComponents';

const OrderDetailsForm = ({ onDetailsLoaded, isLoading }: OrderDetailsFormProps) => {
  const [formData, setFormData] = useState<OrderDetailsFormData>({
    order_id: '',
    id_usuario: 1
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.order_id.trim()) {
      newErrors.order_id = 'El ID del pedido es requerido';
    }
    
    if (formData.id_usuario <= 0) {
      newErrors.id_usuario = 'El ID de usuario debe ser mayor a 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    await onDetailsLoaded(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Consultar Detalles de Pedido
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID del Pedido *
          </label>
          <input
            type="text"
            value={formData.order_id}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              order_id: e.target.value 
            }))}
            placeholder="Ej: 68dc67973081efedbf717c7d"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.order_id ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {errors.order_id && (
            <p className="text-red-500 text-xs mt-1">{errors.order_id}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID Usuario *
          </label>
          <input
            type="number"
            min="1"
            value={formData.id_usuario}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              id_usuario: parseInt(e.target.value) || 0 
            }))}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
              errors.id_usuario ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {errors.id_usuario && (
            <p className="text-red-500 text-xs mt-1">{errors.id_usuario}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Cargando Detalles...' : 'Consultar Detalles'}
        </button>
      </form>
    </div>
  );
};

export default OrderDetailsForm;