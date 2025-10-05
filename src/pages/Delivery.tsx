import { useState } from 'react';
import { useDelivery } from '@hooks/useDelivery';
import { 
  CartQuoteForm, 
  OrderDetailsForm, 
  QuoteResults, 
  OrderDetailsResults, 
  DeliveryStats 
} from '@components/delivery';
import type { CartQuoteRequest, OrderDetailsRequest } from '@interfaces/delivery';

const Delivery = () => {
  const {
    isLoading,
    error,
    cartQuote,
    orderDetails,
    generateCartQuote,
    loadOrderDetails,
    clearCartQuote,
    clearOrderDetails,
    clearState
  } = useDelivery();

  const [activeTab, setActiveTab] = useState<'quote' | 'details'>('quote');

  const handleQuoteGenerated = async (request: CartQuoteRequest) => {
    await generateCartQuote(request);
  };

  const handleDetailsLoaded = async (request: OrderDetailsRequest) => {
    await loadOrderDetails(request);
  };

  const tabs = [
    { key: 'quote', label: 'Cotización de Carrito', icon: '🛒' },
    { key: 'details', label: 'Detalles de Pedido', icon: '📋' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Delivery
          </h1>
          <p className="text-gray-600">
            Gestión de cotizaciones y detalles enriquecidos de pedidos mediante orquestación de microservicios
          </p>
        </div>

        {/* Error Global */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex justify-between items-start">
              <div className="flex">
                <span className="text-red-400 mr-2">⚠️</span>
                <div>
                  <h4 className="text-sm font-medium text-red-800">Error</h4>
                  <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
              </div>
              <button
                onClick={clearState}
                className="text-red-400 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as 'quote' | 'details')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Estadísticas generales */}
        {(cartQuote || orderDetails) && (
          <div className="mb-6">
            <DeliveryStats cartQuote={cartQuote} orderDetails={orderDetails} />
          </div>
        )}

        {/* Content based on active tab */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left Column - Forms */}
          <div className="space-y-6">
            {activeTab === 'quote' && (
              <>
                <CartQuoteForm 
                  onQuoteGenerated={handleQuoteGenerated}
                  isLoading={isLoading}
                />
                {cartQuote && (
                  <div className="flex justify-end">
                    <button
                      onClick={clearCartQuote}
                      className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                      Limpiar Cotización
                    </button>
                  </div>
                )}
              </>
            )}

            {activeTab === 'details' && (
              <>
                <OrderDetailsForm 
                  onDetailsLoaded={handleDetailsLoaded}
                  isLoading={isLoading}
                />
                {orderDetails && (
                  <div className="flex justify-end">
                    <button
                      onClick={clearOrderDetails}
                      className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                    >
                      Limpiar Detalles
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Column - Results */}
          <div className="space-y-6">
            {activeTab === 'quote' && <QuoteResults quote={cartQuote} />}
            {activeTab === 'details' && <OrderDetailsResults orderDetails={orderDetails} />}
            
            {!cartQuote && !orderDetails && (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="text-6xl mb-4">
                  {activeTab === 'quote' ? '🛒' : '📋'}
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  {activeTab === 'quote' 
                    ? 'Generar Cotización' 
                    : 'Consultar Detalles'
                  }
                </h3>
                <p className="text-gray-500">
                  {activeTab === 'quote' 
                    ? 'Complete el formulario para generar una cotización del carrito'
                    : 'Ingrese los datos para consultar los detalles enriquecidos de un pedido'
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-gray-700 font-medium">
                {activeTab === 'quote' ? 'Generando cotización...' : 'Cargando detalles...'}
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="text-center text-sm text-gray-500">
            <p className="mb-2">
              <strong>Orquestador Delivery</strong> - Integración de Microservicios
            </p>
            <div className="flex justify-center space-x-6 text-xs">
              <span>🔹 MS1: Usuarios y Direcciones</span>
              <span>🔹 MS2: Productos y Categorías</span>
              <span>🔹 MS3: Pedidos y Órdenes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Delivery;