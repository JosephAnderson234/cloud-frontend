import type { OrderStatusBadgeProps } from '@interfaces/pedidosComponents';

const statusConfig = {
    pendiente: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
        ),
        text: 'Pendiente'
    },
    entregado: {
        color: 'bg-green-100 text-green-800',
        icon: (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
        ),
        text: 'Entregado'
    },
    cancelado: {
        color: 'bg-red-100 text-red-800',
        icon: (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
        ),
        text: 'Cancelado'
    }
};

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
            {config.icon}
            <span className="ml-1">{config.text}</span>
        </span>
    );
}