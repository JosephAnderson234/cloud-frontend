import { useState, useEffect } from 'react';
import { getUserDirections } from '@services/usuarios';
import type { DireccionResponse } from '@interfaces/usuarios';
import { useNotification } from './useNotification';

export const useUserAddresses = (userId: number | null) => {
  const [addresses, setAddresses] = useState<DireccionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    if (!userId) {
      setAddresses([]);
      return;
    }

    const fetchAddresses = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const userAddresses = await getUserDirections(userId);
        setAddresses(userAddresses);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar direcciones';
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

    fetchAddresses();
  }, [userId, showNotification]);

  return {
    addresses,
    isLoading,
    error,
    refetch: () => {
      if (userId) {
        setError(null);
        setAddresses([]);
        // Trigger useEffect
        setAddresses(prev => [...prev]);
      }
    }
  };
};