import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { HistoryModalProps } from '@interfaces/pedidosComponents';
import type { CrearHistorialRequest } from '@interfaces/pedidos';
import { useOrderHistory } from '@hooks/useOrderHistory';
import useAuth from '@hooks/useAuthContext';
import HistoryForm from './HistoryForm';

export default function HistoryModal({ isOpen, onClose, pedidoId, pedidoInfo }: HistoryModalProps) {
    const { session } = useAuth();
    const { historial, loading, error, createHistorialEntry, refetchHistory, clearError } = useOrderHistory(
        pedidoId, 
        session?.id_usuario || null
    );
    const [showForm, setShowForm] = useState(false);

    const handleCreateHistory = async (data: CrearHistorialRequest) => {
        try {
            await createHistorialEntry(data);
            setShowForm(false);
        } catch (error) {
            console.error('Error creating history entry:', error);
        }
    };

    const handleRefresh = async () => {
        await refetchHistory();
    };

    const handleClose = () => {
        setShowForm(false);
        clearError();
        onClose();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0 relative">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            onClick={handleClose}
                        />

                        {/* Modal */}
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                            &#8203;
                        </span>
                        
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        >
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-lg leading-6 font-semibold text-gray-900">
                                            Historial del Pedido
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {pedidoInfo}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={handleRefresh}
                                            disabled={loading}
                                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                                        >
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Refrescar
                                        </button>
                                        {!showForm && (
                                            <button
                                                onClick={() => setShowForm(true)}
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                Agregar Entrada
                                            </button>
                                        )}
                                        <button
                                            onClick={handleClose}
                                            className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Error message */}
                                {error && (
                                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                                        <p className="text-sm text-red-600">{error}</p>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Form Column */}
                                    <div>
                                        {showForm && (
                                            <HistoryForm
                                                pedidoId={pedidoId}
                                                onSubmit={handleCreateHistory}
                                                onCancel={() => setShowForm(false)}
                                                loading={loading}
                                            />
                                        )}
                                    </div>

                                    {/* History List */}
                                    <div>
                                        <h4 className="text-md font-medium text-gray-900 mb-4">
                                            Entradas del historial ({historial.length})
                                        </h4>
                                        
                                        {loading && historial.length === 0 ? (
                                            <div className="space-y-3">
                                                {[...Array(3)].map((_, i) => (
                                                    <div key={i} className="animate-pulse bg-gray-200 h-20 rounded-lg"></div>
                                                ))}
                                            </div>
                                        ) : historial.length === 0 ? (
                                            <div className="text-center py-8">
                                                <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <p className="text-sm text-gray-500">No hay entradas en el historial</p>
                                                <p className="text-xs text-gray-400 mt-1">Agrega la primera entrada usando el formulario</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                                {historial.map((entrada, index) => (
                                                    <div key={entrada._id} className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className="flex items-center space-x-2">
                                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                    entrada.estado === 'entregado' ? 'bg-green-100 text-green-800' :
                                                                    entrada.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-red-100 text-red-800'
                                                                }`}>
                                                                    {entrada.estado === 'entregado' ? '✅' : 
                                                                     entrada.estado === 'pendiente' ? '⏳' : '❌'}
                                                                    {entrada.estado}
                                                                </span>
                                                                {index === 0 && (
                                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                                        Más reciente
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="text-xs text-gray-500">
                                                                {formatDate(entrada.fecha_evento)}
                                                            </span>
                                                        </div>
                                                        {entrada.comentarios && (
                                                            <p className="text-sm text-gray-600 mt-2 bg-white p-2 rounded border">
                                                                {entrada.comentarios}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
}