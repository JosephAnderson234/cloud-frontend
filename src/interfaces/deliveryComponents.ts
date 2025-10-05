import type { CartQuoteResponse, OrderDetailsResponse, CartQuoteRequest, OrderDetailsRequest } from './delivery';

// Componentes para el delivery
export interface CartQuoteFormProps {
  onQuoteGenerated: (request: CartQuoteRequest) => void;
  isLoading: boolean;
}

export interface OrderDetailsFormProps {
  onDetailsLoaded: (request: OrderDetailsRequest) => void;
  isLoading: boolean;
}

export interface QuoteResultsProps {
  quote: CartQuoteResponse | null;
}

export interface OrderDetailsResultsProps {
  orderDetails: OrderDetailsResponse | null;
}

export interface DeliveryStatsProps {
  cartQuote: CartQuoteResponse | null;
  orderDetails: OrderDetailsResponse | null;
}

// Formularios
export interface CartQuoteFormData {
  id_usuario: number;
  id_direccion: number;
  items: Array<{
    id_producto: number;
    cantidad: number;
  }>;
}

export interface OrderDetailsFormData {
  order_id: string;
  id_usuario: number;
}