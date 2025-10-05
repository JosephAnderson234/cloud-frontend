// Cotización de carrito interfaces
export interface CartQuoteRequest {
  id_usuario: number;
  id_direccion?: number;
  items: CartItem[];
}

export interface CartItem {
  id_producto: number;
  cantidad: number;
}

export interface CartQuoteResponse {
  generatedAt: string;
  items: QuoteItem[];
  issues: string[];
  totals: QuoteTotals;
}

export interface QuoteItem {
  id_producto: number;
  nombre: string;
  precio_unitario: number;
  cantidad: number;
  line_total: number;
  categoria_id: number | null;
  categoria_nombre: string | null;
  price_changed: boolean;
}

export interface QuoteTotals {
  subtotal: number;
  taxes: number;
  total: number;
}

// Detalle enriquecido de pedido interfaces
export interface OrderDetailsRequest {
  order_id: string;
  id_usuario: number;
}

export interface OrderDetailsResponse {
  orderId: string;
  estado: string;
  fecha_pedido: string;
  user: OrderUser;
  lines: OrderLine[];
  issues: OrderIssue[];
  totals: OrderTotals;
}

export interface OrderUser {
  id_usuario: number;
  nombre: string;
  correo: string;
  telefono: string;
  direcciones_count: number;
}

export interface OrderLine {
  id_producto: number;
  nombre: string;
  cantidad: number;
  precio_unitario_ms3: number;
  line_total_ms3: number;
  current_price_ms2: number;
  price_changed_since_order: boolean;
  categoria_id: number;
  categoria_nombre: string;
}

export interface OrderIssue {
  id_producto?: number;
  reason: 'PRICE_CHANGED_SINCE_ORDER' | 'PRODUCT_NOT_FOUND' | 'TOTAL_MISMATCH';
}

export interface OrderTotals {
  total_ms3: number;
  recomputed_subtotal_ms3: number;
  taxes_estimated: number;
  total_estimated: number;
}

// Estados para la UI
export interface DeliveryState {
  isLoading: boolean;
  error: string | null;
  cartQuote: CartQuoteResponse | null;
  orderDetails: OrderDetailsResponse | null;
}