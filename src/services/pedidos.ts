import type { Pedido, HistorialPedido } from "@interfaces/pedidos";

const API_URL = import.meta.env.VITE_API_URL;

export const getOrdersByUserId = async (id_usuario: number) => {
    const response = await fetch(`${API_URL}/pedidos/user/${id_usuario}`);
    if (!response.ok) {
        throw new Error('Error fetching user orders');
    }
    return response.json() as Promise<Pedido[]>;
}

export const getOrderById = async (id_pedido: string) => {
    const response = await fetch(`${API_URL}/pedidos/${id_pedido}`);
    if (!response.ok) {
        throw new Error('Error fetching order');
    }
    return response.json() as Promise<Pedido>;
}

export const createOrder = async (pedido: Omit<Pedido, '_id'>) => {
    const response = await fetch(`${API_URL}/pedidos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pedido)
    });
    if (!response.ok) {
        throw new Error('Error creating order');
    }
    return response.json() as Promise<Pedido>;
}

export const updateOrder = async (id_pedido: string, pedido: Partial<Omit<Pedido, '_id'>>) => {
    const response = await fetch(`${API_URL}/pedidos/${id_pedido}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pedido)
    });
    if (!response.ok) {
        throw new Error('Error updating order');
    }
    return response.json() as Promise<Pedido>;
}

export const deleteOrder = async (id_pedido: string) => {
    const response = await fetch(`${API_URL}/pedidos/${id_pedido}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Error deleting order');
    }
    return response.json();
}

// ===== HISTORIAL DE PEDIDOS =====

export const getOrderHistoryByUserId = async (id_usuario: number) => {
    const response = await fetch(`${API_URL}/historial/${id_usuario}`);
    if (!response.ok) {
        throw new Error('Error fetching order history');
    }
    return response.json() as Promise<HistorialPedido[]>;
}

export const createOrderHistory = async (historial: Omit<HistorialPedido, '_id'>) => {
    const response = await fetch(`${API_URL}/historial`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(historial)
    });
    if (!response.ok) {
        throw new Error('Error creating order history entry');
    }
    return response.json() as Promise<HistorialPedido>;
}