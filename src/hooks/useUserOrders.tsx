import { useState, useEffect } from 'react';
import { getOrdersByUserId } from '@services/pedidos';
import type { PedidoSimple } from '@interfaces/pedidos';
import { useNotification } from './useNotification';

export const useUserOrders = (userId: number | null) => {
  const [orders, setOrders] = useState<PedidoSimple[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    if (!userId) {
      setOrders([]);
      return;
    }

    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const userOrders = await getOrdersByUserId(userId);
        // Mapear a la interfaz simplificada y ordenar por fecha descendente
        const simplifiedOrders: PedidoSimple[] = userOrders
          .map(order => ({
            _id: order._id,
            fecha_pedido: order.fecha_pedido,
            estado: order.estado,
            total: order.total
          }))
          .sort((a, b) => new Date(b.fecha_pedido).getTime() - new Date(a.fecha_pedido).getTime());
        
        setOrders(simplifiedOrders);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar pedidos';
        setError(errorMessage);
        showNotification({ 
          message: errorMessage, 
          type: 'error',
          duration: 3000 
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [userId, showNotification]);

  return {
    orders,
    isLoading,
    error,
    refetch: () => {
      if (userId) {
        setError(null);
        setOrders([]);
        // Trigger useEffect
        setOrders(prev => [...prev]);
      }
    }
  };
};