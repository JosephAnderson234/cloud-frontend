import { useState } from 'react';
import type { CartQuoteFormProps, CartQuoteFormData } from '@interfaces/deliveryComponents';

const CartQuoteForm = ({ onQuoteGenerated, isLoading }: CartQuoteFormProps) => {
  const [formData, setFormData] = useState<CartQuoteFormData>({
    id_usuario: 1,
    id_direccion: 1,
    items: [{ id_producto: 1, cantidad: 1 }]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { id_producto: 1, cantidad: 1 }]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: 'id_producto' | 'cantidad', value: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (formData.id_usuario <= 0) {
      newErrors.id_usuario = 'El ID de usuario debe ser mayor a 0';
    }
    
    if (formData.id_direccion <= 0) {
      newErrors.id_direccion = 'El ID de dirección debe ser mayor a 0';
    }
    
    if (formData.items.length === 0) {
      newErrors.items = 'Debe agregar al menos un producto';
    }
    
    formData.items.forEach((item, index) => {
      if (item.id_producto <= 0) {
        newErrors[`item_${index}_producto`] = 'El ID del producto debe ser mayor a 0';
      }
      if (item.cantidad <= 0) {
        newErrors[`item_${index}_cantidad`] = 'La cantidad debe ser mayor a 0';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    await onQuoteGenerated(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Cotización de Carrito
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.id_usuario ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {errors.id_usuario && (
              <p className="text-red-500 text-xs mt-1">{errors.id_usuario}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID Dirección
            </label>
            <input
              type="number"
              min="1"
              value={formData.id_direccion}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                id_direccion: parseInt(e.target.value) || 0 
              }))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.id_direccion ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
            {errors.id_direccion && (
              <p className="text-red-500 text-xs mt-1">{errors.id_direccion}</p>
            )}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Productos del Carrito *
            </label>
            <button
              type="button"
              onClick={addItem}
              disabled={isLoading}
              className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50"
            >
              + Agregar Producto
            </button>
          </div>
          
          {errors.items && (
            <p className="text-red-500 text-xs mb-2">{errors.items}</p>
          )}
          
          <div className="space-y-2">
            {formData.items.map((item, index) => (
              <div key={index} className="flex gap-3 items-start p-3 border rounded bg-gray-50">
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">
                    ID Producto
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={item.id_producto}
                    onChange={(e) => updateItem(index, 'id_producto', parseInt(e.target.value) || 0)}
                    className={`w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      errors[`item_${index}_producto`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isLoading}
                  />
                  {errors[`item_${index}_producto`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_producto`]}</p>
                  )}
                </div>
                
                <div className="flex-1">
                  <label className="block text-xs text-gray-600 mb-1">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={item.cantidad}
                    onChange={(e) => updateItem(index, 'cantidad', parseInt(e.target.value) || 0)}
                    className={`w-full px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      errors[`item_${index}_cantidad`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isLoading}
                  />
                  {errors[`item_${index}_cantidad`] && (
                    <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_cantidad`]}</p>
                  )}
                </div>
                
                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    disabled={isLoading}
                    className="mt-5 px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 disabled:opacity-50"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Generando Cotización...' : 'Generar Cotización'}
        </button>
      </form>
    </div>
  );
};

export default CartQuoteForm;