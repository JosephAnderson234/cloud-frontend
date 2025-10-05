import { useState, useEffect } from 'react';
import type { HistorialPedido, CrearHistorialRequest, HistorialResponse } from '@interfaces/pedidos';
import { getOrderHistoryByUserId, createOrderHistory } from '@services/pedidos';
import { useNotification } from './useNotification';

export const useOrderHistory = (pedidoId: string | null, userId: number | null) => {
  const [historial, setHistorial] = useState<HistorialPedido[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showNotification } = useNotification();

  // Obtener historial filtrado para un pedido específico
  useEffect(() => {
    if (!userId || !pedidoId) {
      setHistorial([]);
      return;
    }

    const fetchOrderHistory = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Obtener todo el historial del usuario y filtrar por pedido
        const userHistory = await getOrderHistoryByUserId(userId);
        const pedidoHistory = userHistory.filter(h => h.id_pedido === pedidoId);
        
        // Ordenar por fecha más reciente primero
        pedidoHistory.sort((a, b) => 
          new Date(b.fecha_evento).getTime() - new Date(a.fecha_evento).getTime()
        );
        
        setHistorial(pedidoHistory);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al obtener el historial del pedido';
        setError(errorMessage);
        console.error('Error fetching order history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, [userId, pedidoId]);

  // Crear nueva entrada de historial
  const createHistorialEntry = async (data: CrearHistorialRequest): Promise<HistorialResponse | null> => {
    if (!pedidoId) {
      throw new Error('ID del pedido requerido');
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await createOrderHistory(pedidoId, data);
      
      // Agregar la nueva entrada al estado local
      const newEntry = response.historial;
      setHistorial(prev => [newEntry, ...prev]); // Agregar al inicio (más reciente)
      
      showNotification({ 
        message: 'Entrada de historial agregada exitosamente', 
        type: 'success',
        duration: 3000 
      });
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la entrada del historial';
      setError(errorMessage);
      showNotification({ 
        message: errorMessage, 
        type: 'error',
        duration: 3000 
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Refrescar historial
  const refetchHistory = async () => {
    if (!userId || !pedidoId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const userHistory = await getOrderHistoryByUserId(userId);
      const pedidoHistory = userHistory.filter(h => h.id_pedido === pedidoId);
      pedidoHistory.sort((a, b) => 
        new Date(b.fecha_evento).getTime() - new Date(a.fecha_evento).getTime()
      );
      setHistorial(pedidoHistory);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al refrescar el historial';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Limpiar error
  const clearError = () => {
    setError(null);
  };

  return {
    historial,
    loading,
    error,
    createHistorialEntry,
    refetchHistory,
    clearError
  };
};