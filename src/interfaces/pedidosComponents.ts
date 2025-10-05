import type { 
    Pedido, 
    HistorialPedido, 
    ProductoPedido, 
    CrearPedidoRequest,
    CrearHistorialRequest,
    ActualizarPedidoRequest
} from "./pedidos";
import type { Usuario } from "./usuarios";

export type PedidoFormData = CrearPedidoRequest;

export interface PedidoTableProps {
    pedidos: Pedido[];
    onEdit: (pedido: Pedido) => void;
    onDelete: (id: string) => void;
    onViewHistory: (id: string) => void;
    loading: boolean;
}

export interface PedidoFormProps {
    pedido?: Pedido;
    onSubmit: (data: PedidoFormData | ActualizarPedidoRequest) => void;
    onCancel: () => void;
    loading: boolean;
}

export interface ProductSelectorProps {
    selectedProducts: ProductoPedido[];
    onProductsChange: (productos: ProductoPedido[]) => void;
}

export interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    pedidoId: string;
    pedidoInfo: string;
    historial?: HistorialPedido[];
    onAddHistory?: (data: CrearHistorialRequest) => void;
    historyLoading?: boolean;
}

export interface OrderStatusBadgeProps {
    status: 'pendiente' | 'entregado' | 'cancelado';
    size?: 'sm' | 'md' | 'lg';
}

export interface UserSelectorProps {
    usuarios: Usuario[];
    selectedUserId: number | null;
    onUserChange: (userId: number) => void;
    loading: boolean;
    disabled?: boolean;
}

export interface OrderSummaryProps {
    productos: ProductoPedido[];
    total: number;
    showCalculation?: boolean;
}

export interface HistoryFormProps {
    pedidoId: string;
    onSubmit: (data: CrearHistorialRequest) => void;
    onCancel: () => void;
    loading: boolean;
}

export interface StatusUpdateProps {
    currentStatus: 'pendiente' | 'entregado' | 'cancelado';
    onUpdateStatus: (estado: 'pendiente' | 'entregado' | 'cancelado') => void;
    loading: boolean;
    disabled?: boolean;
}

export interface PedidoStatsProps {
    pedidos: Pedido[];
    loading?: boolean;
}

export interface PedidoFiltersProps {
    onFilterChange: (filtros: {
        estado?: 'pendiente' | 'entregado' | 'cancelado';
        fechaDesde?: string;
        fechaHasta?: string;
    }) => void;
    loading?: boolean;
}