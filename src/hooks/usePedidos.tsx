import { useState, useEffect } from 'react';
import type { Pedido, HistorialPedido } from '@interfaces/pedidos';
import type { PedidoFormData } from '@interfaces/pedidosComponents';
import * as pedidosService from '@services/pedidos';
import useAuth from './useAuthContext';

export const usePedidos = () => {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const {session} = useAuth();

    const fetchPedidosByUser = async (userId: number) => {
        setLoading(true);
        try {
            const userOrders = await pedidosService.getOrdersByUserId(userId);
            setPedidos(userOrders);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching orders');
        } finally {
            setLoading(false);
        }
    };

    const createPedido = async (data: PedidoFormData): Promise<Pedido> => {
        setLoading(true);
        try {
            const newOrder = await pedidosService.createOrder(data);
            setPedidos(prev => [...prev, newOrder]);
            return newOrder;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error creating order');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updatePedido = async (id: string, data: Partial<PedidoFormData>): Promise<Pedido> => {
        setLoading(true);
        try {
            const updatedOrder = await pedidosService.updateOrder(id, data);
            setPedidos(prev => prev.map(pedido => pedido._id === id ? updatedOrder : pedido));
            return updatedOrder;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error updating order');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deletePedido = async (id: string): Promise<void> => {
        setLoading(true);
        try {
            await pedidosService.deleteOrder(id);
            setPedidos(prev => prev.filter(pedido => pedido._id !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error deleting order');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getPedido = async (id: string): Promise<Pedido> => {
        setLoading(true);
        try {
            return await pedidosService.getOrderById(id);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching order');
            throw err;
        } finally {
            setLoading(false);
        }
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
        createPedido,
        updatePedido,
        deletePedido,
        getPedido,
        clearError: () => setError(null)
    };
};

export const useHistorialPedidos = () => {
    const [historial, setHistorial] = useState<HistorialPedido[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchHistorialByUser = async (userId: number) => {
        setLoading(true);
        try {
            const userHistory = await pedidosService.getOrderHistoryByUserId(userId);
            setHistorial(userHistory);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching order history');
        } finally {
            setLoading(false);
        }
    };

    const createHistorialEntry = async (data: Omit<HistorialPedido, '_id'>): Promise<HistorialPedido> => {
        setLoading(true);
        try {
            const newEntry = await pedidosService.createOrderHistory(data);
            setHistorial(prev => [...prev, newEntry]);
            return newEntry;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error creating history entry');
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