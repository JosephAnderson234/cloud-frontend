import type { 
  CartQuoteRequest, 
  CartQuoteResponse, 
  OrderDetailsRequest, 
  OrderDetailsResponse 
} from "@interfaces/delivery";

const API_URL = import.meta.env.VITE_API_URL+ "/ms4"; // Base API URL

// Cotización de carrito
export const getCartQuote = async (request: CartQuoteRequest): Promise<CartQuoteResponse> => {
  const response = await fetch(`${API_URL}/orq/cart/price-quote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  });
  
  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to get cart quote: ${response.status} - ${errorData}`);
  }
  
  return response.json();
};

// Detalle enriquecido de pedido
export const getOrderDetails = async (request: OrderDetailsRequest): Promise<OrderDetailsResponse> => {
  const { order_id, id_usuario } = request;
  
  const response = await fetch(`${API_URL}/orq/orders/${order_id}/details?id_usuario=${id_usuario}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    const errorData = await response.text();
    if (response.status === 404) {
      throw new Error('Pedido no encontrado');
    }
    if (response.status === 403) {
      throw new Error('No tienes autorización para ver este pedido');
    }
    throw new Error(`Failed to get order details: ${response.status} - ${errorData}`);
  }
  
  return response.json();
};