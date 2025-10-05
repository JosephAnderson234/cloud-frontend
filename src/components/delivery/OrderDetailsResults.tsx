import type { OrderDetailsResultsProps } from '@interfaces/deliveryComponents';

const OrderDetailsResults = ({ orderDetails }: OrderDetailsResultsProps) => {
  if (!orderDetails) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (estado: string) => {
    const statusStyles = {
      pendiente: 'bg-yellow-100 text-yellow-800',
      confirmado: 'bg-blue-100 text-blue-800',
      enviado: 'bg-purple-100 text-purple-800',
      entregado: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        statusStyles[estado as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'
      }`}>
        {estado.charAt(0).toUpperCase() + estado.slice(1)}
      </span>
    );
  };

  const getIssueTypeLabel = (reason: string) => {
    const labels = {
      'PRICE_CHANGED_SINCE_ORDER': 'Precio cambió desde la orden',
      'PRODUCT_NOT_FOUND': 'Producto no encontrado',
      'TOTAL_MISMATCH': 'Discrepancia en totales'
    };
    return labels[reason as keyof typeof labels] || reason;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Detalles del Pedido
          </h3>
          <p className="text-sm text-gray-500 font-mono mt-1">
            ID: {orderDetails.orderId}
          </p>
        </div>
        <div className="text-right">
          {getStatusBadge(orderDetails.estado)}
          <p className="text-sm text-gray-500 mt-1">
            {formatDate(orderDetails.fecha_pedido)}
          </p>
        </div>
      </div>

      {/* Información del usuario */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-md font-medium text-blue-800 mb-2">Información del Cliente</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-blue-700 font-medium">Nombre:</span>
            <span className="text-blue-600 ml-2">{orderDetails.user.nombre}</span>
          </div>
          <div>
            <span className="text-blue-700 font-medium">Email:</span>
            <span className="text-blue-600 ml-2">{orderDetails.user.correo}</span>
          </div>
          <div>
            <span className="text-blue-700 font-medium">Teléfono:</span>
            <span className="text-blue-600 ml-2">{orderDetails.user.telefono}</span>
          </div>
          <div>
            <span className="text-blue-700 font-medium">Direcciones:</span>
            <span className="text-blue-600 ml-2">{orderDetails.user.direcciones_count}</span>
          </div>
        </div>
      </div>

      {/* Alertas/Issues */}
      {orderDetails.issues.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="text-md font-medium text-red-800 mb-3">Alertas del Pedido</h4>
          <div className="space-y-2">
            {orderDetails.issues.map((issue, index) => (
              <div key={index} className="flex items-start text-sm text-red-700">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                <div>
                  <p className="font-medium">{getIssueTypeLabel(issue.reason)}</p>
                  {issue.id_producto && (
                    <p className="text-red-600">Producto ID: {issue.id_producto}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Líneas del pedido */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-3">Productos del Pedido</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-3 py-2 text-left">ID</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Producto</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Categoría</th>
                <th className="border border-gray-200 px-3 py-2 text-center">Cant.</th>
                <th className="border border-gray-200 px-3 py-2 text-right">Precio Pedido</th>
                <th className="border border-gray-200 px-3 py-2 text-right">Precio Actual</th>
                <th className="border border-gray-200 px-3 py-2 text-right">Total Línea</th>
                <th className="border border-gray-200 px-3 py-2 text-center">Estado</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.lines.map((line, index) => (
                <tr key={index} className={line.price_changed_since_order ? 'bg-red-50' : ''}>
                  <td className="border border-gray-200 px-3 py-2 font-mono text-xs">
                    {line.id_producto}
                  </td>
                  <td className="border border-gray-200 px-3 py-2 font-medium">
                    {line.nombre}
                  </td>
                  <td className="border border-gray-200 px-3 py-2 text-gray-600">
                    {line.categoria_nombre}
                  </td>
                  <td className="border border-gray-200 px-3 py-2 text-center">
                    {line.cantidad}
                  </td>
                  <td className="border border-gray-200 px-3 py-2 text-right">
                    {formatCurrency(line.precio_unitario_ms3)}
                  </td>
                  <td className="border border-gray-200 px-3 py-2 text-right">
                    {formatCurrency(line.current_price_ms2)}
                    {line.price_changed_since_order && (
                      <span className="text-red-500 text-xs block">
                        {line.current_price_ms2 > line.precio_unitario_ms3 ? '↑' : '↓'}
                        {formatCurrency(Math.abs(line.current_price_ms2 - line.precio_unitario_ms3))}
                      </span>
                    )}
                  </td>
                  <td className="border border-gray-200 px-3 py-2 text-right font-medium">
                    {formatCurrency(line.line_total_ms3)}
                  </td>
                  <td className="border border-gray-200 px-3 py-2 text-center">
                    {line.price_changed_since_order ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                        Precio Cambió
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        OK
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Comparación de totales */}
      <div className="border-t pt-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-md font-medium text-gray-700 mb-3">Comparación de Totales</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-sm font-medium text-gray-600 mb-2">Totales del Pedido (MS3)</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Total Original:</span>
                  <span className="font-medium">{formatCurrency(orderDetails.totals.total_ms3)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal Recalculado:</span>
                  <span className="font-medium">{formatCurrency(orderDetails.totals.recomputed_subtotal_ms3)}</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="text-sm font-medium text-gray-600 mb-2">Totales Estimados (Actuales)</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Impuestos Estimados:</span>
                  <span className="font-medium">{formatCurrency(orderDetails.totals.taxes_estimated)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="font-semibold">Total Estimado:</span>
                  <span className="font-bold text-green-600">{formatCurrency(orderDetails.totals.total_estimated)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Diferencia en totales */}
          {orderDetails.totals.total_ms3 !== orderDetails.totals.total_estimated && (
            <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium text-yellow-800">Diferencia:</span>
                <span className="font-bold text-yellow-900">
                  {formatCurrency(orderDetails.totals.total_estimated - orderDetails.totals.total_ms3)}
                  {orderDetails.totals.total_estimated > orderDetails.totals.total_ms3 ? ' más' : ' menos'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsResults;