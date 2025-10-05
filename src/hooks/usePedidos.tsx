import { useState, useEffect } from 'react';
import type { 
    Pedido, 
    HistorialPedido, 
    CrearPedidoRequest,
    ActualizarPedidoRequest,
    CrearHistorialRequest,
    FiltrosPedidos,
    FiltrosHistorial
} from '@interfaces/pedidos';
import * as pedidosService from '@services/pedidos';
import useAuth from './useAuthContext';

export const usePedidos = () => {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { session } = useAuth();

    const fetchPedidosByUser = async (userId: number, filtros?: FiltrosPedidos) => {
        setLoading(true);
        setError(null);
        try {
            const userOrders = await pedidosService.getOrdersByUserId(userId, filtros);
            setPedidos(userOrders);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al obtener los pedidos');
        } finally {
            setLoading(false);
        }
    };

    const createPedido = async (data: CrearPedidoRequest) => {
        setLoading(true);
        setError(null);
        try {
            const response = await pedidosService.createOrder(data);
            const newOrder = response.pedido;
            setPedidos(prev => [...prev, newOrder]);
            return response;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear el pedido');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updatePedido = async (id: string, data: ActualizarPedidoRequest) => {
        setLoading(true);
        setError(null);
        try {
            const response = await pedidosService.updateOrder(id, data);
            const updatedOrder = response.pedido;
            setPedidos(prev => prev.map(pedido => pedido._id === id ? updatedOrder : pedido));
            return response;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al actualizar el pedido');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updatePedidoStatus = async (id: string, estado: 'pendiente' | 'entregado' | 'cancelado') => {
        setLoading(true);
        setError(null);
        try {
            const response = await pedidosService.updateOrderStatus(id, { estado });
            const updatedOrder = response.pedido;
            setPedidos(prev => prev.map(pedido => pedido._id === id ? updatedOrder : pedido));
            return response;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al actualizar el estado del pedido');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const cancelPedido = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await pedidosService.cancelOrder(id);
            const cancelledOrder = response.pedido;
            setPedidos(prev => prev.map(pedido => pedido._id === id ? cancelledOrder : pedido));
            return response;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cancelar el pedido');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getPedido = async (id: string): Promise<Pedido> => {
        setLoading(true);
        setError(null);
        try {
            return await pedidosService.getOrderById(id);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al obtener el pedido');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Funciones de conveniencia para filtros específicos
    const fetchPendingOrders = async (userId: number) => {
        return fetchPedidosByUser(userId, { estado: 'pendiente' });
    };

    const fetchDeliveredOrders = async (userId: number) => {
        return fetchPedidosByUser(userId, { estado: 'entregado' });
    };

    const fetchCancelledOrders = async (userId: number) => {
        return fetchPedidosByUser(userId, { estado: 'cancelado' });
    };

    useEffect(() => {
        if (session) {
            fetchPedidosByUser(session.id_usuario);
        }
    }, [session]);

    return {
        pedidos,
        loading,
        error,
        fetchPedidosByUser,
        fetchPendingOrders,
        fetchDeliveredOrders,
        fetchCancelledOrders,
        createPedido,
        updatePedido,
        updatePedidoStatus,
        cancelPedido,
        getPedido,
        clearError: () => setError(null)
    };
};

export const useHistorialPedidos = () => {
    const [historial, setHistorial] = useState<HistorialPedido[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchHistorialByUser = async (userId: number, filtros?: FiltrosHistorial) => {
        setLoading(true);
        setError(null);
        try {
            const userHistory = await pedidosService.getOrderHistoryByUserId(userId, filtros);
            setHistorial(userHistory);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al obtener el historial de pedidos');
        } finally {
            setLoading(false);
        }
    };

    const createHistorialEntry = async (pedidoId: string, data: CrearHistorialRequest) => {
        setLoading(true);
        setError(null);
        try {
            const response = await pedidosService.createOrderHistory(pedidoId, data);
            const newEntry = response.historial;
            setHistorial(prev => [...prev, newEntry]);
            return response;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al crear la entrada del historial');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        historial,
        loading,
        error,
        fetchHistorialByUser,
        createHistorialEntry,
        clearError: () => setError(null)
    };
};