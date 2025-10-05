import type { QuoteResultsProps } from '@interfaces/deliveryComponents';

const QuoteResults = ({ quote }: QuoteResultsProps) => {
  if (!quote) {
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Resultado de Cotización
        </h3>
        <span className="text-sm text-gray-500">
          Generado: {formatDate(quote.generatedAt)}
        </span>
      </div>

      {/* Alertas/Issues */}
      {quote.issues.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">Alertas:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            {quote.issues.map((issue, index) => (
              <li key={index} className="flex items-center">
                <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                {issue}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Items del carrito */}
      <div className="mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-3">Productos en el Carrito</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-3 py-2 text-left">ID</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Producto</th>
                <th className="border border-gray-200 px-3 py-2 text-left">Categoría</th>
                <th className="border border-gray-200 px-3 py-2 text-center">Cantidad</th>
                <th className="border border-gray-200 px-3 py-2 text-right">Precio Unit.</th>
                <th className="border border-gray-200 px-3 py-2 text-right">Total Línea</th>
                <th className="border border-gray-200 px-3 py-2 text-center">Estado</th>
              </tr>
            </thead>
            <tbody>
              {quote.items.map((item, index) => (
                <tr key={index} className={item.price_changed ? 'bg-yellow-50' : ''}>
                  <td className="border border-gray-200 px-3 py-2 font-mono text-xs">
                    {item.id_producto}
                  </td>
                  <td className="border border-gray-200 px-3 py-2 font-medium">
                    {item.nombre}
                  </td>
                  <td className="border border-gray-200 px-3 py-2 text-gray-600">
                    {item.categoria_nombre || 'Sin categoría'}
                  </td>
                  <td className="border border-gray-200 px-3 py-2 text-center">
                    {item.cantidad}
                  </td>
                  <td className="border border-gray-200 px-3 py-2 text-right">
                    {formatCurrency(item.precio_unitario)}
                  </td>
                  <td className="border border-gray-200 px-3 py-2 text-right font-medium">
                    {formatCurrency(item.line_total)}
                  </td>
                  <td className="border border-gray-200 px-3 py-2 text-center">
                    {item.price_changed ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
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

      {/* Totales */}
      <div className="border-t pt-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-md font-medium text-gray-700 mb-3">Resumen de Totales</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">{formatCurrency(quote.totals.subtotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Impuestos:</span>
              <span className="font-medium">{formatCurrency(quote.totals.taxes)}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold text-gray-800">Total:</span>
                <span className="font-bold text-blue-600">{formatCurrency(quote.totals.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteResults;