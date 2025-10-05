import { useState } from 'react';
import type { 
  CartQuoteRequest, 
  CartQuoteResponse, 
  OrderDetailsRequest, 
  OrderDetailsResponse,
  DeliveryState 
} from '@interfaces/delivery';
import { getCartQuote, getOrderDetails } from '@services/delivery';
import { useNotification } from './useNotification';

export const useDelivery = () => {
  const [state, setState] = useState<DeliveryState>({
    isLoading: false,
    error: null,
    cartQuote: null,
    orderDetails: null
  });

  const { showNotification } = useNotification();

  // Obtener cotización del carrito
  const generateCartQuote = async (request: CartQuoteRequest): Promise<CartQuoteResponse | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const quote = await getCartQuote(request);
      setState(prev => ({ 
        ...prev, 
        cartQuote: quote, 
        isLoading: false 
      }));
      
      showNotification({ 
        message: 'Cotización generada exitosamente', 
        type: 'success',
        duration: 3000 
      });
      return quote;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al generar cotización';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        isLoading: false 
      }));
      
      showNotification(errorMessage, 'error');
      return null;
    }
  };

  // Obtener detalles enriquecidos del pedido
  const loadOrderDetails = async (request: OrderDetailsRequest): Promise<OrderDetailsResponse | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const details = await getOrderDetails(request);
      setState(prev => ({ 
        ...prev, 
        orderDetails: details, 
        isLoading: false 
      }));
      
      showNotification({ 
        message: 'Detalles del pedido cargados exitosamente', 
        type: 'success',
        duration: 3000 
      });
      return details;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al cargar detalles del pedido';
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        isLoading: false 
      }));
      
      showNotification({ 
        message: errorMessage, 
        type: 'error',
        duration: 3000 
      });
      return null;
    }
  };

  // Limpiar estado
  const clearState = () => {
    setState({
      isLoading: false,
      error: null,
      cartQuote: null,
      orderDetails: null
    });
  };

  // Limpiar solo la cotización
  const clearCartQuote = () => {
    setState(prev => ({ ...prev, cartQuote: null, error: null }));
  };

  // Limpiar solo los detalles del pedido
  const clearOrderDetails = () => {
    setState(prev => ({ ...prev, orderDetails: null, error: null }));
  };

  return {
    // Estado
    ...state,
    
    // Acciones
    generateCartQuote,
    loadOrderDetails,
    clearState,
    clearCartQuote,
    clearOrderDetails
  };
};