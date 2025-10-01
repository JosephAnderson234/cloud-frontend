import type { ProductoStatsProps } from '@interfaces/productosComponents';

export default function ProductoStats({ totalProductos, totalCategorias, averagePrice, loading }: ProductoStatsProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(price);
    };

    const stats = [
        {
            name: 'Total Productos',
            value: loading ? '...' : totalProductos.toString(),
            icon: (
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
            color: 'bg-blue-50 border-blue-200'
        },
        {
            name: 'Categorías',
            value: loading ? '...' : totalCategorias.toString(),
            icon: (
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            color: 'bg-green-50 border-green-200'
        },
        {
            name: 'Precio Promedio',
            value: loading ? '...' : formatPrice(averagePrice),
            icon: (
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
            ),
            color: 'bg-yellow-50 border-yellow-200'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat) => (
                <div
                    key={stat.name}
                    className={`${stat.color} border rounded-lg p-6 transition-all duration-200 hover:shadow-md`}
                >
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            {stat.icon}
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stat.value}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}