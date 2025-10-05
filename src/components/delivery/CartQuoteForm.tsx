import { useState, useEffect } from 'react';
import useAuth from '@hooks/useAuthContext';
import { useUserAddresses } from '@hooks/useUserAddresses';
import AddressSelector from './AddressSelector';
import type { CartQuoteFormProps, CartQuoteFormData } from '@interfaces/deliveryComponents';

const CartQuoteForm = ({ onQuoteGenerated, isLoading }: CartQuoteFormProps) => {
  const { session } = useAuth();
  const { addresses, isLoading: addressesLoading } = useUserAddresses(session?.id_usuario || null);
  
  const [formData, setFormData] = useState<CartQuoteFormData>({
    id_usuario: session?.id_usuario || 0,
    id_direccion: 0,
    items: [{ id_producto: 1, cantidad: 1 }]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Actualizar el ID del usuario cuando cambie la sesión
  useEffect(() => {
    if (session?.id_usuario) {
      setFormData(prev => ({
        ...prev,
        id_usuario: session.id_usuario,
        id_direccion: 0 // Reset address selection when user changes
      }));
    }
  }, [session?.id_usuario]);

  // Auto-seleccionar la primera dirección si solo hay una
  useEffect(() => {
    if (addresses.length === 1 && formData.id_direccion === 0) {
      setFormData(prev => ({
        ...prev,
        id_direccion: addresses[0].id_direccion
      }));
    }
  }, [addresses, formData.id_direccion]);

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

  const handleAddressSelect = (addressId: number) => {
    setFormData(prev => ({
      ...prev,
      id_direccion: addressId
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!session) {
      newErrors.session = 'Debes estar loggeado para generar una cotización';
    }
    
    if (formData.id_usuario <= 0) {
      newErrors.id_usuario = 'Usuario no válido';
    }
    
    if (formData.id_direccion <= 0) {
      newErrors.id_direccion = 'Debes seleccionar una dirección de entrega';
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

  if (!session) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Cotización de Carrito
          </h3>
          <p className="text-gray-600 mb-4">
            Debes iniciar sesión para generar una cotización
          </p>
          <div className="text-4xl mb-4">🔒</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Cotización de Carrito
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Usuario loggeado (solo lectura) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Usuario
          </label>
          <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700">
            {session.nombre} (ID: {session.id_usuario})
          </div>
        </div>

        {/* Selector de dirección */}
        <div>
          <AddressSelector
            addresses={addresses}
            selectedAddressId={formData.id_direccion}
            onAddressSelect={handleAddressSelect}
            isLoading={addressesLoading || isLoading}
          />
          {errors.id_direccion && (
            <p className="text-red-500 text-xs mt-1">{errors.id_direccion}</p>
          )}
        </div>

        {/* Error de sesión */}
        {errors.session && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-500 text-sm">{errors.session}</p>
          </div>
        )}

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
          disabled={isLoading || addressesLoading || addresses.length === 0 || formData.id_direccion === 0}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Generando Cotización...' : 'Generar Cotización'}
        </button>
        
        {addresses.length === 0 && !addressesLoading && (
          <p className="text-sm text-amber-600 text-center">
            ⚠️ Necesitas al menos una dirección registrada para generar cotizaciones
          </p>
        )}
      </form>
    </div>
  );
};

export default CartQuoteForm;