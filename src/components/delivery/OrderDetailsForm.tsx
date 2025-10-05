import { useState, useEffect } from 'react';
import useAuth from '@hooks/useAuthContext';
import { useUserOrders } from '@hooks/useUserOrders';
import OrderSelector from './OrderSelector';
import type { OrderDetailsFormProps, OrderDetailsFormData } from '@interfaces/deliveryComponents';

const OrderDetailsForm = ({ onDetailsLoaded, isLoading }: OrderDetailsFormProps) => {
  const { session } = useAuth();
  const { orders, isLoading: ordersLoading } = useUserOrders(session?.id_usuario || null);
  
  const [formData, setFormData] = useState<OrderDetailsFormData>({
    order_id: '',
    id_usuario: session?.id_usuario || 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Actualizar el ID del usuario cuando cambie la sesión
  useEffect(() => {
    if (session?.id_usuario) {
      setFormData(prev => ({
        ...prev,
        id_usuario: session.id_usuario,
        order_id: '' // Reset order selection when user changes
      }));
    }
  }, [session?.id_usuario]);

  // Auto-seleccionar el primer pedido si solo hay uno
  useEffect(() => {
    if (orders.length === 1 && formData.order_id === '') {
      setFormData(prev => ({
        ...prev,
        order_id: orders[0]._id
      }));
    }
  }, [orders, formData.order_id]);

  const handleOrderSelect = (orderId: string) => {
    setFormData(prev => ({
      ...prev,
      order_id: orderId
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!session) {
      newErrors.session = 'Debes estar loggeado para consultar detalles de pedidos';
    }
    
    if (!formData.order_id.trim()) {
      newErrors.order_id = 'Debes seleccionar un pedido';
    }
    
    if (formData.id_usuario <= 0) {
      newErrors.id_usuario = 'Usuario no válido';
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

  if (!session) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Consultar Detalles de Pedido
          </h3>
          <p className="text-gray-600 mb-4">
            Debes iniciar sesión para consultar detalles de pedidos
          </p>
          <div className="text-4xl mb-4">🔒</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Consultar Detalles de Pedido
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

        {/* Selector de pedido */}
        <div>
          <OrderSelector
            orders={orders}
            selectedOrderId={formData.order_id}
            onOrderSelect={handleOrderSelect}
            isLoading={ordersLoading || isLoading}
          />
          {errors.order_id && (
            <p className="text-red-500 text-xs mt-1">{errors.order_id}</p>
          )}
        </div>

        {/* Error de sesión */}
        {errors.session && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-500 text-sm">{errors.session}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || ordersLoading || orders.length === 0 || !formData.order_id}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Cargando Detalles...' : 'Consultar Detalles'}
        </button>
        
        {orders.length === 0 && !ordersLoading && (
          <p className="text-sm text-amber-600 text-center">
            ⚠️ No tienes pedidos registrados para consultar detalles
          </p>
        )}
      </form>
    </div>
  );
};

export default OrderDetailsForm;