import type { Pedido, HistorialPedido, ProductoPedido } from "./pedidos";
import type { Producto } from "./productos";
import type { Usuario } from "./usuarios";

export type PedidoFormData = Omit<Pedido, '_id'>;

export interface PedidoTableProps {
    pedidos: Pedido[];
    onEdit: (pedido: Pedido) => void;
    onDelete: (id: string) => void;
    onViewHistory: (id: string) => void;
    loading: boolean;
}

export interface PedidoFormProps {
    pedido?: Pedido;
    onSubmit: (data: PedidoFormData | Partial<PedidoFormData>) => void;
    onCancel: () => void;
    loading: boolean;
}

export interface ProductSelectorProps {
    productos: Producto[];
    selectedProducts: ProductoPedido[];
    onProductsChange: (productos: ProductoPedido[]) => void;
    loading: boolean;
}

export interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    pedidoId: string;
    pedidoInfo: string;
}

export interface OrderStatusBadgeProps {
    status: 'pendiente' | 'entregado' | 'cancelado';
}

export interface UserSelectorProps {
    usuarios: Usuario[];
    selectedUserId: number | null;
    onUserChange: (userId: number) => void;
    loading: boolean;
}

export interface OrderSummaryProps {
    productos: ProductoPedido[];
    total: number;
}

export interface HistoryFormProps {
    pedidoId: string;
    onSubmit: (data: Omit<HistorialPedido, '_id'>) => void;
    onCancel: () => void;
    loading: boolean;
}