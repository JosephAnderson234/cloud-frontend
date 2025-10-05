import { useState } from 'react';
import type { StatusUpdateProps } from '@interfaces/pedidosComponents';

export default function StatusUpdate({ currentStatus, onUpdateStatus, loading, disabled = false }: StatusUpdateProps) {
    const [selectedStatus, setSelectedStatus] = useState(currentStatus);
    const [showConfirm, setShowConfirm] = useState(false);

    const statusOptions = [
        { value: 'pendiente', label: 'Pendiente', color: 'yellow' },
        { value: 'entregado', label: 'Entregado', color: 'green' },
        { value: 'cancelado', label: 'Cancelado', color: 'red' }
    ] as const;

    const getStatusColorClasses = (color: string) => {
        const baseClasses = "inline-flex px-2 py-1 text-xs font-medium rounded-full";
        switch (color) {
            case 'yellow':
                return `${baseClasses} bg-yellow-100 text-yellow-800`;
            case 'green':
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'red':
                return `${baseClasses} bg-red-100 text-red-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    const handleStatusChange = (newStatus: 'pendiente' | 'entregado' | 'cancelado') => {
        if (newStatus === currentStatus) return;
        setSelectedStatus(newStatus);
        setShowConfirm(true);
    };

    const handleConfirm = () => {
        onUpdateStatus(selectedStatus);
        setShowConfirm(false);
    };

    const handleCancel = () => {
        setSelectedStatus(currentStatus);
        setShowConfirm(false);
    };

    const getCurrentStatusOption = () => {
        return statusOptions.find(option => option.value === currentStatus);
    };

    const getSelectedStatusOption = () => {
        return statusOptions.find(option => option.value === selectedStatus);
    };

    if (disabled) {
        const currentOption = getCurrentStatusOption();
        return (
            <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Estado:</span>
                <span className={getStatusColorClasses(currentOption?.color || 'gray')}>
                    {currentOption?.label || currentStatus}
                </span>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Estado actual:</span>
                <span className={getStatusColorClasses(getCurrentStatusOption()?.color || 'gray')}>
                    {getCurrentStatusOption()?.label || currentStatus}
                </span>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cambiar estado:
                </label>
                <div className="flex flex-wrap gap-2">
                    {statusOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => handleStatusChange(option.value)}
                            disabled={loading || option.value === currentStatus}
                            className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                                option.value === currentStatus
                                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                            }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Modal de confirmación */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0">
                                <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 18.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Confirmar cambio de estado
                                </h3>
                            </div>
                        </div>
                        
                        <div className="mb-6">
                            <p className="text-sm text-gray-600">
                                ¿Estás seguro de que quieres cambiar el estado del pedido de{' '}
                                <span className={getStatusColorClasses(getCurrentStatusOption()?.color || 'gray')}>
                                    {getCurrentStatusOption()?.label}
                                </span>
                                {' '}a{' '}
                                <span className={getStatusColorClasses(getSelectedStatusOption()?.color || 'gray')}>
                                    {getSelectedStatusOption()?.label}
                                </span>
                                ?
                            </p>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Actualizando...
                                    </div>
                                ) : (
                                    'Confirmar'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}