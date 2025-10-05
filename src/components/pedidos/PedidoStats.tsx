import type { PedidoStatsProps } from '@interfaces/pedidosComponents';

export default function PedidoStats({ pedidos, loading = false }: PedidoStatsProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {[...Array(4)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                        <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                    </div>
                ))}
            </div>
        );
    }

    // Calcular estadísticas
    const stats = {
        total: pedidos.length,
        pendientes: pedidos.filter(p => p.estado === 'pendiente').length,
        entregados: pedidos.filter(p => p.estado === 'entregado').length,
        cancelados: pedidos.filter(p => p.estado === 'cancelado').length,
        totalValue: pedidos.reduce((sum, p) => sum + p.total, 0),
        avgValue: pedidos.length > 0 ? pedidos.reduce((sum, p) => sum + p.total, 0) / pedidos.length : 0
    };

    const statCards = [
        {
            title: 'Total de Pedidos',
            value: stats.total,
            icon: '📦',
            color: 'blue',
            description: 'Pedidos en total'
        },
        {
            title: 'Pendientes',
            value: stats.pendientes,
            icon: '⏳',
            color: 'yellow',
            description: 'Esperando procesamiento'
        },
        {
            title: 'Entregados',
            value: stats.entregados,
            icon: '✅',
            color: 'green',
            description: 'Completados exitosamente'
        },
        {
            title: 'Cancelados',
            value: stats.cancelados,
            icon: '❌',
            color: 'red',
            description: 'Pedidos cancelados'
        }
    ];

    const getColorClasses = (color: string) => {
        switch (color) {
            case 'blue':
                return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'yellow':
                return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'green':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'red':
                return 'text-red-600 bg-red-50 border-red-200';
            default:
                return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    return (
        <div className="mb-6">
            {/* Estadísticas principales */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                {statCards.map((stat) => (
                    <div
                        key={stat.title}
                        className={`rounded-lg border p-6 ${getColorClasses(stat.color)}`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium opacity-75">
                                    {stat.title}
                                </p>
                                <p className="text-3xl font-bold">
                                    {stat.value.toLocaleString()}
                                </p>
                                <p className="text-xs opacity-60 mt-1">
                                    {stat.description}
                                </p>
                            </div>
                            <div className="text-2xl opacity-75">
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Estadísticas financieras */}
            {stats.total > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Valor Total de Pedidos
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ${stats.totalValue.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Suma de todos los pedidos
                                </p>
                            </div>
                            <div className="text-2xl text-gray-400">
                                💰
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    Valor Promedio
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    ${stats.avgValue.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Por pedido
                                </p>
                            </div>
                            <div className="text-2xl text-gray-400">
                                📊
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Barra de progreso de estados */}
            {stats.total > 0 && (
                <div className="mt-4 bg-white rounded-lg border border-gray-200 p-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                        Distribución de Estados
                    </p>
                    <div className="flex rounded-lg overflow-hidden h-2 bg-gray-200">
                        {stats.pendientes > 0 && (
                            <div
                                className="bg-yellow-500"
                                style={{ width: `${(stats.pendientes / stats.total) * 100}%` }}
                                title={`${stats.pendientes} pendientes (${Math.round((stats.pendientes / stats.total) * 100)}%)`}
                            />
                        )}
                        {stats.entregados > 0 && (
                            <div
                                className="bg-green-500"
                                style={{ width: `${(stats.entregados / stats.total) * 100}%` }}
                                title={`${stats.entregados} entregados (${Math.round((stats.entregados / stats.total) * 100)}%)`}
                            />
                        )}
                        {stats.cancelados > 0 && (
                            <div
                                className="bg-red-500"
                                style={{ width: `${(stats.cancelados / stats.total) * 100}%` }}
                                title={`${stats.cancelados} cancelados (${Math.round((stats.cancelados / stats.total) * 100)}%)`}
                            />
                        )}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{Math.round((stats.pendientes / stats.total) * 100)}% Pendientes</span>
                        <span>{Math.round((stats.entregados / stats.total) * 100)}% Entregados</span>
                        <span>{Math.round((stats.cancelados / stats.total) * 100)}% Cancelados</span>
                    </div>
                </div>
            )}

            {/* Mensaje cuando no hay pedidos */}
            {stats.total === 0 && !loading && (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                    <div className="text-4xl text-gray-300 mb-2">📦</div>
                    <p className="text-gray-500 font-medium">No hay pedidos para mostrar</p>
                    <p className="text-gray-400 text-sm mt-1">Los pedidos aparecerán aquí una vez que se creen</p>
                </div>
            )}
        </div>
    );
}