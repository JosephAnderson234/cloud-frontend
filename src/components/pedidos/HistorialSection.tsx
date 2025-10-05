import { useState, useEffect, useCallback } from 'react';
import { getOrdersByUserId, createOrderHistory } from '@services/pedidos';
import { usePedidos } from '@hooks/usePedidos';
import useAuth from '@hooks/useAuthContext';
import type { Pedido, FiltrosPedidos, CrearHistorialRequest } from '@interfaces/pedidos';

export default function HistorialSection() {
    const { session } = useAuth();
    const { pedidos } = usePedidos();
    const [historialPedidos, setHistorialPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(false);
    const [filtros, setFiltros] = useState<FiltrosPedidos>({});
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        id_pedido: '',
        estado: 'pendiente' as 'pendiente' | 'entregado' | 'cancelado',
        comentarios: ''
    });

    // Cargar historial de pedidos del usuario loggeado
    const fetchHistorial = useCallback(async () => {
        if (!session?.id_usuario) {
            setHistorialPedidos([]);
            return;
        }

        try {
            setLoading(true);
            const data = await getOrdersByUserId(session.id_usuario, filtros);
            setHistorialPedidos(data);
        } catch (error) {
            console.error('Error fetching order history:', error);
            setHistorialPedidos([]);
        } finally {
            setLoading(false);
        }
    }, [session?.id_usuario, filtros]);

    useEffect(() => {
        fetchHistorial();
    }, [fetchHistorial]);

    // Crear nueva entrada de historial
    const handleCreateHistorial = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.id_pedido) return;

        try {
            setLoading(true);
            const request: CrearHistorialRequest = {
                estado: formData.estado,
                comentarios: formData.comentarios || undefined
            };

            await createOrderHistory(formData.id_pedido, request);
            await fetchHistorial(); // Recargar historial
            setShowForm(false);
            setFormData({ id_pedido: '', estado: 'pendiente', comentarios: '' });
        } catch (error) {
            console.error('Error creating history entry:', error);
        } finally {
            setLoading(false);
        }
    };

    // Filtrar pedidos
    const pedidosFiltrados = historialPedidos.filter(pedido => {
        if (filtros.estado && pedido.estado !== filtros.estado) return false;
        return true;
    });

    // Formatear fecha
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Obtener badge color para estados
    const getEstadoBadgeColor = (estado: string) => {
        switch (estado) {
            case 'pendiente':
                return 'bg-yellow-100 text-yellow-800';
            case 'entregado':
                return 'bg-green-100 text-green-800';
            case 'cancelado':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const estadosCounts = pedidosFiltrados.reduce((acc, pedido) => {
        acc[pedido.estado] = (acc[pedido.estado] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Verificar si hay sesión activa
    if (!session) {
        return (
            <div className="bg-white rounded-lg shadow p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Acceso Restringido</h3>
                <p className="text-gray-500">Debes iniciar sesión para ver el historial de pedidos</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Estadísticas del historial */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 p-3 rounded-lg bg-blue-50 text-blue-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total Pedidos</p>
                            <p className="text-2xl font-semibold text-gray-900">{pedidosFiltrados.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 p-3 rounded-lg bg-yellow-50 text-yellow-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Pendientes</p>
                            <p className="text-2xl font-semibold text-gray-900">{estadosCounts.pendiente || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 p-3 rounded-lg bg-green-50 text-green-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Entregados</p>
                            <p className="text-2xl font-semibold text-gray-900">{estadosCounts.entregado || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 p-3 rounded-lg bg-red-50 text-red-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Cancelados</p>
                            <p className="text-2xl font-semibold text-gray-900">{estadosCounts.cancelado || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Controles y filtros */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-4 sm:mb-0">
                        Historial de Pedidos del Usuario
                    </h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Filtro por estado */}
                        <select
                            value={filtros.estado || ''}
                            onChange={(e) => {
                                const value = e.target.value;
                                setFiltros({ 
                                    ...filtros, 
                                    estado: value ? value as 'pendiente' | 'entregado' | 'cancelado' : undefined 
                                });
                            }}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Todos los estados</option>
                            <option value="pendiente">Pendiente</option>
                            <option value="entregado">Entregado</option>
                            <option value="cancelado">Cancelado</option>
                        </select>

                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Nueva Entrada
                        </button>
                    </div>
                </div>

                {/* Formulario para nueva entrada */}
                {showForm && (
                    <div className="border-t border-gray-200 pt-6 mb-6">
                        <h4 className="text-md font-medium text-gray-900 mb-4">Registrar Cambio de Estado</h4>
                        <form onSubmit={handleCreateHistorial} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Pedido
                                </label>
                                <select
                                    value={formData.id_pedido}
                                    onChange={(e) => setFormData({ ...formData, id_pedido: e.target.value })}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Seleccionar pedido</option>
                                    {pedidos.map((pedido) => (
                                        <option key={pedido._id} value={pedido._id}>
                                            #{pedido._id.slice(-8)} - ${pedido.total}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nuevo Estado
                                </label>
                                <select
                                    value={formData.estado}
                                    onChange={(e) => setFormData({ 
                                        ...formData, 
                                        estado: e.target.value as 'pendiente' | 'entregado' | 'cancelado' 
                                    })}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="pendiente">Pendiente</option>
                                    <option value="entregado">Entregado</option>
                                    <option value="cancelado">Cancelado</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Comentarios
                                </label>
                                <input
                                    type="text"
                                    value={formData.comentarios}
                                    onChange={(e) => setFormData({ ...formData, comentarios: e.target.value })}
                                    placeholder="Comentario opcional..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="md:col-span-3 flex gap-3">
                                <button
                                    type="submit"
                                    disabled={loading || !formData.id_pedido}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading ? 'Guardando...' : 'Registrar'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            {/* Tabla de historial */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-500">Cargando historial...</p>
                    </div>
                ) : pedidosFiltrados.length === 0 ? (
                    <div className="p-8 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Sin pedidos</h3>
                        <p className="text-gray-500">No hay pedidos para mostrar</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Pedido ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Productos
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha Pedido
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {pedidosFiltrados.map((pedido) => (
                                    <tr key={pedido._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            #{pedido._id.slice(-8)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            ${pedido.total.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoBadgeColor(pedido.estado)}`}>
                                                {pedido.estado}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {pedido.productos.length} productos
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(pedido.fecha_pedido)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}