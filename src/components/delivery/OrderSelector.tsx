import type { OrderSelectorProps } from '@interfaces/deliveryComponents';

const OrderSelector = ({ 
  orders, 
  selectedOrderId, 
  onOrderSelect, 
  isLoading = false 
}: OrderSelectorProps) => {
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'text-yellow-600';
      case 'entregado':
        return 'text-green-600';
      case 'cancelado':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusEmoji = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return '⏳';
      case 'entregado':
        return '✅';
      case 'cancelado':
        return '❌';
      default:
        return '📋';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Seleccionar Pedido *
      </label>
      
      {orders.length === 0 ? (
        <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
          No hay pedidos disponibles
        </div>
      ) : (
        <select
          value={selectedOrderId}
          onChange={(e) => onOrderSelect(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={isLoading}
        >
          <option value="">Selecciona un pedido</option>
          {orders.map((order) => (
            <option key={order._id} value={order._id}>
              {getStatusEmoji(order.estado)} {formatDate(order.fecha_pedido)} - {formatCurrency(order.total)} ({order.estado})
            </option>
          ))}
        </select>
      )}
      
      {orders.length === 0 && (
        <p className="text-xs text-gray-500 mt-1">
          No tienes pedidos registrados para consultar detalles
        </p>
      )}

      {selectedOrderId && orders.length > 0 && (
        <div className="mt-2 p-2 bg-gray-50 rounded border">
          {(() => {
            const selectedOrder = orders.find(order => order._id === selectedOrderId);
            if (!selectedOrder) return null;
            
            return (
              <div className="text-xs text-gray-600">
                <span className="font-medium">Pedido seleccionado:</span>{' '}
                <span className={`font-medium ${getStatusColor(selectedOrder.estado)}`}>
                  {selectedOrder.estado.toUpperCase()}
                </span>{' '}
                - {formatDate(selectedOrder.fecha_pedido)} - {formatCurrency(selectedOrder.total)}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default OrderSelector;