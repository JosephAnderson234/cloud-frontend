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

export interface HistorialPedido {
    _id: string;
    id_pedido: string;
    fecha_entrega: string;
    estado: string;
    comentarios: string;
}