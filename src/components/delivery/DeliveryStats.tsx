import type { DeliveryStatsProps } from '@interfaces/deliveryComponents';

const DeliveryStats = ({ cartQuote, orderDetails }: DeliveryStatsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getQuoteStats = () => {
    if (!cartQuote) return null;
    
    const totalItems = cartQuote.items.reduce((sum, item) => sum + item.cantidad, 0);
    const priceChangedItems = cartQuote.items.filter(item => item.price_changed).length;
    
    return {
      totalItems,
      uniqueProducts: cartQuote.items.length,
      priceChangedItems,
      hasIssues: cartQuote.issues.length > 0
    };
  };

  const getOrderStats = () => {
    if (!orderDetails) return null;
    
    const totalItems = orderDetails.lines.reduce((sum, line) => sum + line.cantidad, 0);
    const priceChangedItems = orderDetails.lines.filter(line => line.price_changed_since_order).length;
    const priceDifference = orderDetails.totals.total_estimated - orderDetails.totals.total_ms3;
    
    return {
      totalItems,
      uniqueProducts: orderDetails.lines.length,
      priceChangedItems,
      hasIssues: orderDetails.issues.length > 0,
      priceDifference,
      issuesCount: orderDetails.issues.length
    };
  };

  const quoteStats = getQuoteStats();
  const orderStats = getOrderStats();

  if (!quoteStats && !orderStats) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Estadísticas del Orquestador
      </h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Estadísticas de Cotización */}
        {quoteStats && (
          <div className="space-y-4">
            <h4 className="text-md font-medium text-blue-700 border-b border-blue-200 pb-2">
              Cotización de Carrito
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{quoteStats.totalItems}</div>
                <div className="text-sm text-blue-700">Total Items</div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{quoteStats.uniqueProducts}</div>
                <div className="text-sm text-blue-700">Productos Únicos</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Precios Cambiados:</span>
                <span className={`text-sm font-medium ${
                  quoteStats.priceChangedItems > 0 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {quoteStats.priceChangedItems}/{quoteStats.uniqueProducts}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Estado General:</span>
                <span className={`text-sm font-medium ${
                  quoteStats.hasIssues ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {quoteStats.hasIssues ? 'Con Alertas' : 'Sin Problemas'}
                </span>
              </div>
              
              {cartQuote && (
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                  <span className="text-sm text-blue-700 font-medium">Total Cotización:</span>
                  <span className="text-sm font-bold text-blue-800">
                    {formatCurrency(cartQuote.totals.total)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Estadísticas de Pedido */}
        {orderStats && (
          <div className="space-y-4">
            <h4 className="text-md font-medium text-green-700 border-b border-green-200 pb-2">
              Detalles de Pedido
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{orderStats.totalItems}</div>
                <div className="text-sm text-green-700">Total Items</div>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{orderStats.uniqueProducts}</div>
                <div className="text-sm text-green-700">Productos Únicos</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Precios Cambiados:</span>
                <span className={`text-sm font-medium ${
                  orderStats.priceChangedItems > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {orderStats.priceChangedItems}/{orderStats.uniqueProducts}
                </span>
              </div>
              
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm text-gray-600">Issues Detectados:</span>
                <span className={`text-sm font-medium ${
                  orderStats.issuesCount > 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {orderStats.issuesCount}
                </span>
              </div>
              
              {Math.abs(orderStats.priceDifference) > 0 && (
                <div className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                  <span className="text-sm text-yellow-700">Diferencia de Precio:</span>
                  <span className={`text-sm font-medium ${
                    orderStats.priceDifference > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {orderStats.priceDifference > 0 ? '+' : ''}{formatCurrency(orderStats.priceDifference)}
                  </span>
                </div>
              )}
              
              {orderDetails && (
                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <span className="text-sm text-green-700 font-medium">Total Estimado:</span>
                  <span className="text-sm font-bold text-green-800">
                    {formatCurrency(orderDetails.totals.total_estimated)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default DeliveryStats;