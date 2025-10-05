import { useState, useEffect } from 'react';
import useAuth from '@hooks/useAuthContext';
import { useUserAddresses } from '@hooks/useUserAddresses';
import AddressSelector from './AddressSelector';
import CartProductSelector from './CartProductSelector';
import type { CartQuoteFormProps, CartQuoteFormData, CartItem } from '@interfaces/deliveryComponents';

const CartQuoteForm = ({ onQuoteGenerated, isLoading }: CartQuoteFormProps) => {
  const { session } = useAuth();
  const { addresses, isLoading: addressesLoading } = useUserAddresses(session?.id_usuario || null);
  
  const [formData, setFormData] = useState<CartQuoteFormData>({
    id_usuario: session?.id_usuario || 0,
    id_direccion: 0,
    items: []
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

  const handleItemsChange = (items: CartItem[]) => {
    setFormData(prev => ({
      ...prev,
      items
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
      newErrors.items = 'Debe agregar al menos un producto al carrito';
    }
    
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

        {/* Selector de productos */}
        <div>
          <CartProductSelector
            selectedItems={formData.items}
            onItemsChange={handleItemsChange}
            isLoading={isLoading}
          />
          {errors.items && (
            <p className="text-red-500 text-xs mt-1">{errors.items}</p>
          )}
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