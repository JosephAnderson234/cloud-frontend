import type { 
    Pedido, 
    HistorialPedido, 
    CrearPedidoRequest, 
    CrearHistorialRequest,
    ActualizarEstadoPedidoRequest,
    ActualizarPedidoRequest,
    PedidoResponse,
    HistorialResponse,
    FiltrosPedidos,
    FiltrosHistorial
} from "@interfaces/pedidos";

const API_URL = import.meta.env.VITE_API_URL + ":8003";

// ===== PEDIDOS =====

/**
 * Obtener todos los pedidos de un usuario con filtros opcionales
 */
export const getOrdersByUserId = async (id_usuario: number, filtros?: FiltrosPedidos): Promise<Pedido[]> => {
    const params = new URLSearchParams();
    if (filtros?.estado) {
        params.append('estado', filtros.estado);
    }
    
    const url = `${API_URL}/pedidos/user/${id_usuario}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Error al obtener los pedidos del usuario');
    }
    return response.json();
};

/**
 * Obtener un pedido específico por ID
 */
export const getOrderById = async (id_pedido: string): Promise<Pedido> => {
    const response = await fetch(`${API_URL}/pedidos/${id_pedido}`);
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Error al obtener el pedido');
    }
    return response.json();
};

/**
 * Crear un nuevo pedido
 */
export const createOrder = async (pedido: CrearPedidoRequest): Promise<PedidoResponse> => {
    const response = await fetch(`${API_URL}/pedidos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pedido)
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Error al crear el pedido');
    }
    return response.json();
};

/**
 * Actualizar solo el estado de un pedido
 */
export const updateOrderStatus = async (id_pedido: string, data: ActualizarEstadoPedidoRequest): Promise<PedidoResponse> => {
    const response = await fetch(`${API_URL}/pedidos/${id_pedido}/estado`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Error al actualizar el estado del pedido');
    }
    return response.json();
};

/**
 * Actualizar detalles del pedido (productos, total)
 */
export const updateOrder = async (id_pedido: string, pedido: ActualizarPedidoRequest): Promise<PedidoResponse> => {
    const response = await fetch(`${API_URL}/pedidos/${id_pedido}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pedido)
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Error al actualizar el pedido');
    }
    return response.json();
};

/**
 * Cancelar un pedido (cambiar estado a cancelado)
 */
export const deletePedido = async (id_pedido: string): Promise<PedidoResponse> => {
    const response = await fetch(`${API_URL}/pedidos/${id_pedido}`, {
        method: 'DELETE'
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Error al cancelar el pedido');
    }
    return response.json();
};

// ===== HISTORIAL DE PEDIDOS =====

/**
 * Obtener historial de pedidos de un usuario con filtros opcionales
 */
export const getOrderHistoryByUserId = async (id_usuario: number, filtros?: FiltrosHistorial): Promise<HistorialPedido[]> => {
    const params = new URLSearchParams();
    if (filtros?.estado) {
        params.append('estado', filtros.estado);
    }
    
    const url = `${API_URL}/historial/${id_usuario}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Error al obtener el historial de pedidos');
    }
    return response.json();
};

/**
 * Registrar una nueva entrada en el historial de un pedido
 */
export const createOrderHistory = async (id_pedido: string, historial: CrearHistorialRequest): Promise<HistorialResponse> => {
    const response = await fetch(`${API_URL}/pedidos/${id_pedido}/historial`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(historial)
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || 'Error al registrar el historial del pedido');
    }
    return response.json();
};

// ===== FUNCIONES DE UTILIDAD =====

/**
 * Obtener todos los pedidos sin filtros (función de conveniencia)
 */
export const getAllOrdersByUserId = async (id_usuario: number): Promise<Pedido[]> => {
    return getOrdersByUserId(id_usuario);
};

/**
 * Obtener pedidos pendientes de un usuario
 */
export const getPendingOrdersByUserId = async (id_usuario: number): Promise<Pedido[]> => {
    return getOrdersByUserId(id_usuario, { estado: 'pendiente' });
};

/**
 * Obtener pedidos entregados de un usuario
 */
export const getDeliveredOrdersByUserId = async (id_usuario: number): Promise<Pedido[]> => {
    return getOrdersByUserId(id_usuario, { estado: 'entregado' });
};

/**
 * Obtener pedidos cancelados de un usuario
 */
export const getCancelledOrdersByUserId = async (id_usuario: number): Promise<Pedido[]> => {
    return getOrdersByUserId(id_usuario, { estado: 'cancelado' });
};