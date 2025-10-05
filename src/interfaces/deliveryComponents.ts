import type { CartQuoteResponse, OrderDetailsResponse, CartQuoteRequest, OrderDetailsRequest } from './delivery';
import type { DireccionResponse } from './usuarios';
import type { PedidoSimple } from './pedidos';

// Item simplificado para el carrito
export interface CartItem {
  id_producto: number;
  name?: string;
  cantidad: number;
}

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

// Selector de direcciones
export interface AddressSelectorProps {
  addresses: DireccionResponse[];
  selectedAddressId: number;
  onAddressSelect: (addressId: number) => void;
  isLoading?: boolean;
}

// Selector de pedidos
export interface OrderSelectorProps {
  orders: PedidoSimple[];
  selectedOrderId: string;
  onOrderSelect: (orderId: string) => void;
  isLoading?: boolean;
}

// Selector de productos para carrito
export interface CartProductSelectorProps {
  selectedItems: CartItem[];
  onItemsChange: (items: CartItem[]) => void;
  isLoading?: boolean;
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