import { useState } from 'react';
import type { HistoryFormProps } from '@interfaces/pedidosComponents';
import type { HistorialPedido } from '@interfaces/pedidos';

export default function HistoryForm({ pedidoId, onSubmit, onCancel, loading }: HistoryFormProps) {
    const [formData, setFormData] = useState<Omit<HistorialPedido, '_id'>>({
        id_pedido: pedidoId,
        fecha_entrega: new Date().toISOString().slice(0, 16), // Format for datetime-local input
        estado: '',
        comentarios: ''
    });

    const [errors, setErrors] = useState<{
        estado?: string;
        fecha_entrega?: string;
    }>({});

    const validateForm = (): boolean => {
        const newErrors: typeof errors = {};

        if (!formData.estado.trim()) {
            newErrors.estado = 'El estado es requerido';
        }

        if (!formData.fecha_entrega) {
            newErrors.fecha_entrega = 'La fecha es requerida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            // Convert datetime-local to ISO string
            const submitData = {
                ...formData,
                fecha_entrega: new Date(formData.fecha_entrega).toISOString()
            };
            onSubmit(submitData);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Limpiar error del campo cuando se modifica
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
                <h4 className="text-md font-semibold text-gray-900">
                    Nueva Entrada del Historial
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                    Registra un cambio de estado o evento del pedido
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Estado */}
                <div>
                    <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">
                        Estado <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="estado"
                        name="estado"
                        value={formData.estado}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.estado ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                    >
                        <option value="">Selecciona un estado</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="en proceso">En Proceso</option>
                        <option value="en camino">En Camino</option>
                        <option value="entregado">Entregado</option>
                        <option value="cancelado">Cancelado</option>
                        <option value="devuelto">Devuelto</option>
                    </select>
                    {errors.estado && (
                        <p className="mt-1 text-sm text-red-600">{errors.estado}</p>
                    )}
                </div>

                {/* Fecha de entrega */}
                <div>
                    <label htmlFor="fecha_entrega" className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha y Hora <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="datetime-local"
                        id="fecha_entrega"
                        name="fecha_entrega"
                        value={formData.fecha_entrega}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.fecha_entrega ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                    />
                    {errors.fecha_entrega && (
                        <p className="mt-1 text-sm text-red-600">{errors.fecha_entrega}</p>
                    )}
                </div>

                {/* Comentarios */}
                <div>
                    <label htmlFor="comentarios" className="block text-sm font-medium text-gray-700 mb-2">
                        Comentarios
                    </label>
                    <textarea
                        id="comentarios"
                        name="comentarios"
                        value={formData.comentarios}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Información adicional sobre este cambio de estado..."
                    />
                </div>

                {/* Botones */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? (
                            <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Guardando...
                            </div>
                        ) : (
                            'Agregar Entrada'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}