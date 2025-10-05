import { useState, useEffect } from 'react';
import type { PedidoFormProps, PedidoFormData } from '@interfaces/pedidosComponents';
import type { ProductoPedido } from '@interfaces/pedidos';
import ProductSelector from './ProductSelector';
import OrderSummary from './OrderSummary';
import useAuth from '@hooks/useAuthContext';

export default function PedidoForm({ pedido, onSubmit, onCancel, loading }: PedidoFormProps) {
    const user = useAuth();

    const [formData, setFormData] = useState<PedidoFormData>({
        id_usuario: user.session?.id_usuario || 0,
        total: 0,
        productos: []
    });

    const [errors, setErrors] = useState<{
        id_usuario?: string;
        productos?: string;
    }>({});

    useEffect(() => {
        if (pedido) {
            // Si estamos editando, solo permitimos actualizar productos y total
            setFormData({
                id_usuario: pedido.id_usuario,
                total: pedido.total,
                productos: pedido.productos
            });
        }
    }, [pedido]);

    useEffect(() => {
        // Calcular total automáticamente
        const subtotal = formData.productos.reduce((sum, producto) => 
            sum + (producto.precio_unitario * producto.cantidad), 0
        );
        const iva = subtotal * 0.16;
        const total = subtotal + iva;
        
        setFormData(prev => ({ ...prev, total }));
    }, [formData.productos]);

    const validateForm = (): boolean => {
        const newErrors: typeof errors = {};

        if (!formData.id_usuario || formData.id_usuario === 0) {
            newErrors.id_usuario = 'Debe seleccionar un usuario';
        }

        if (formData.productos.length === 0) {
            newErrors.productos = 'Debe agregar al menos un producto';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            if (pedido) {
                // Si estamos editando, solo enviamos productos y total
                onSubmit({
                    productos: formData.productos,
                    total: formData.total
                });
            } else {
                // Si estamos creando, enviamos todo
                onSubmit(formData);
            }
        }
    };

    const handleProductsChange = (productos: ProductoPedido[]) => {
        setFormData(prev => ({ ...prev, productos }));
        if (errors.productos && productos.length > 0) {
            setErrors(prev => ({ ...prev, productos: undefined }));
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                    {pedido ? 'Editar Pedido' : 'Crear Nuevo Pedido'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                    {pedido ? 'Actualiza los productos y cantidades del pedido' : 'Completa los datos del nuevo pedido'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Formulario Principal */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Información del Usuario */}
                        <div>
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            <span className="font-medium">Usuario:</span> {user.session?.nombre}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {user.session?.correo}
                                        </p>
                                    </div>
                                    {pedido && (
                                        <div className="text-right">
                                            <p className="text-sm text-gray-700">
                                                <span className="font-medium">ID del Pedido:</span>
                                            </p>
                                            <p className="text-sm text-gray-500 font-mono">
                                                {pedido._id}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {pedido && (
                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                        <p className="text-sm text-gray-700">
                                            <span className="font-medium">Fecha del Pedido:</span>{' '}
                                            {new Date(pedido.fecha_pedido).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                        <p className="text-sm text-gray-700 mt-1">
                                            <span className="font-medium">Estado Actual:</span>{' '}
                                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                pedido.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                                pedido.estado === 'entregado' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
                                            </span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Selector de Productos */}
                        <div>
                            <ProductSelector
                                selectedProducts={formData.productos}
                                onProductsChange={handleProductsChange}
                            />
                            {errors.productos && (
                                <p className="mt-2 text-sm text-red-600">{errors.productos}</p>
                            )}
                        </div>
                    </div>

                    {/* Resumen del Pedido */}
                    <div className="lg:col-span-1">
                        <OrderSummary 
                            productos={formData.productos} 
                            total={formData.total}
                            showCalculation={true}
                        />
                    </div>
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
                        disabled={loading || formData.productos.length === 0}
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
                            pedido ? 'Actualizar Pedido' : 'Crear Pedido'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}