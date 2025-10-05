export interface ProductoPedido {
    id_producto: number;
    cantidad: number;
    precio_unitario: number;
}

export interface Pedido {
    _id: string;
    id_usuario: number;
    fecha_pedido: string;
    estado: 'pendiente' | 'entregado' | 'cancelado';
    total: number;
    productos: ProductoPedido[];
}

// Interfaz simplificada para el selector
export interface PedidoSimple {
    _id: string;
    fecha_pedido: string;
    estado: 'pendiente' | 'entregado' | 'cancelado';
    total: number;
}

export interface HistorialPedido {
    _id: string;
    id_pedido: string;
    id_usuario: number;
    fecha_evento: string;
    estado: 'pendiente' | 'entregado' | 'cancelado';
    comentarios?: string;
}

// Interfaces para crear pedidos e historial
export interface CrearPedidoRequest {
    id_usuario: number;
    productos: ProductoPedido[];
    total: number;
}

export interface CrearHistorialRequest {
    estado: 'pendiente' | 'entregado' | 'cancelado';
    comentarios?: string;
    fecha_evento?: string;
}

export interface ActualizarEstadoPedidoRequest {
    estado: 'pendiente' | 'entregado' | 'cancelado';
}

export interface ActualizarPedidoRequest {
    productos?: ProductoPedido[];
    total?: number;
}

// Respuestas de la API
export interface PedidoResponse {
    mensaje: string;
    pedido: Pedido;
}

export interface HistorialResponse {
    mensaje: string;
    historial: HistorialPedido;
}

// Filtros para consultas
export interface FiltrosPedidos {
    estado?: 'pendiente' | 'entregado' | 'cancelado';
}

export interface FiltrosHistorial {
    estado?: 'pendiente' | 'entregado' | 'cancelado';
}