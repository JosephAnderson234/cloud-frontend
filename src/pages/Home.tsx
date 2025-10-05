import { useState } from 'react';
import useAuthContext from '@hooks/useAuthContext';
import { 
  useHealthStatus, 
  useUserHistoryState, 
  useUserTotalSpent, 
  useCategoryRanking 
} from '@hooks/useAnalytics';
import type { TotalSpentParams } from '@interfaces/analytics';

export default function Home() {
  const { session } = useAuthContext();
  
  // Date range state for total spent query
  const [dateRange, setDateRange] = useState<TotalSpentParams>({
    fecha_inicio: '2025-01-01',
    fecha_fin: '2025-12-31'
  });

  // Use analytics hooks
  const { healthStatus, loading: healthLoading, error: healthError } = useHealthStatus();
  const { 
    userHistoryState, 
    loading: historyLoading, 
    error: historyError 
  } = useUserHistoryState(session?.id_usuario || null);
  
  const { 
    userTotalSpent, 
    loading: spentLoading, 
    error: spentError
  } = useUserTotalSpent(session?.id_usuario || null, dateRange);
  
  const { 
    categoryRanking, 
    loading: rankingLoading, 
    error: rankingError,
    refetch: refetchRanking
  } = useCategoryRanking();

  // Handle date range change
  const handleDateRangeChange = (field: keyof TotalSpentParams, value: string) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Calculate progress bar width for history percentages
  const getProgressWidth = (percentage: number) => `${Math.min(percentage, 100)}%`;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard de Analytics</h1>
        
        {/* Health Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Estado del Sistema</h2>
          {healthLoading ? (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          ) : healthError ? (
            <div className="text-red-600">Error: {healthError}</div>
          ) : (
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              healthStatus?.status === 'ok' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${
                healthStatus?.status === 'ok' ? 'bg-green-400' : 'bg-red-400'
              }`}></span>
              {healthStatus?.message}
            </div>
          )}
        </div>

        {/* User History State */}
        {session && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Estado de mis Pedidos</h2>
            {historyLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ) : historyError ? (
              <div className="text-red-600">Error: {historyError}</div>
            ) : userHistoryState ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{userHistoryState.productos_completados}</div>
                    <div className="text-sm text-gray-600">Completados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{userHistoryState.productos_pendientes}</div>
                    <div className="text-sm text-gray-600">Pendientes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{userHistoryState.productos_cancelados}</div>
                    <div className="text-sm text-gray-600">Cancelados</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Completados</span>
                      <span>{userHistoryState.porcentaje_completados.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: getProgressWidth(userHistoryState.porcentaje_completados) }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Pendientes</span>
                      <span>{userHistoryState.porcentaje_pendientes.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: getProgressWidth(userHistoryState.porcentaje_pendientes) }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Cancelados</span>
                      <span>{userHistoryState.porcentaje_cancelados.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: getProgressWidth(userHistoryState.porcentaje_cancelados) }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* User Total Spent */}
        {session && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Total Gastado</h2>
            
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fecha_inicio" className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  id="fecha_inicio"
                  value={dateRange.fecha_inicio}
                  onChange={(e) => handleDateRangeChange('fecha_inicio', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="fecha_fin" className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha Fin
                </label>
                <input
                  type="date"
                  id="fecha_fin"
                  value={dateRange.fecha_fin}
                  onChange={(e) => handleDateRangeChange('fecha_fin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {spentLoading ? (
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : spentError ? (
              <div className="text-red-600">Error: {spentError}</div>
            ) : userTotalSpent ? (
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {formatCurrency(userTotalSpent.total_gastado)}
                </div>
                <div className="text-sm text-gray-600">
                  Del {dateRange.fecha_inicio} al {dateRange.fecha_fin}
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Category Ranking */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Ranking de Categorías Más Compradas</h2>
            <button
              onClick={refetchRanking}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Actualizar
            </button>
          </div>
          
          {rankingLoading ? (
            <div className="animate-pulse space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          ) : rankingError ? (
            <div className="text-red-600">Error: {rankingError}</div>
          ) : (
            <div className="space-y-3">
              {categoryRanking.map((category, index) => (
                <div 
                  key={category.id_categoria}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' : 
                      index === 1 ? 'bg-gray-400' : 
                      index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                    }`}>
                      {category.ranking}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{category.nombre_categoria}</div>
                      <div className="text-sm text-gray-600">ID: {category.id_categoria}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-gray-900">{category.total_compras}</div>
                    <div className="text-sm text-gray-600">compras</div>
                  </div>
                </div>
              ))}
              
              {categoryRanking.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No hay datos de categorías disponibles
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}