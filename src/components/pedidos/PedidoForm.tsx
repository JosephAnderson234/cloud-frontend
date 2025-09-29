import { useState, useEffect } from 'react';
import type { PedidoFormProps, PedidoFormData } from '@interfaces/pedidosComponents';
import type { ProductoPedido } from '@interfaces/pedidos';
import { useUsuarios } from '@hooks/useUsuarios';
import { getAllProducts } from '@services/productos';
import type { Producto } from '@interfaces/productos';
import UserSelector from './UserSelector';
import ProductSelector from './ProductSelector';
import OrderSummary from './OrderSummary';

export default function PedidoForm({ pedido, onSubmit, onCancel, loading }: PedidoFormProps) {
    const { usuarios, loading: usuariosLoading } = useUsuarios();
    const [productos, setProductos] = useState<Producto[]>([]);
    const [productosLoading, setProductosLoading] = useState(false);
    
    const [formData, setFormData] = useState<PedidoFormData>({
        id_usuario: 0,
        fecha_pedido: new Date().toISOString(),
        estado: 'pendiente',
        total: 0,
        productos: []
    });

    const [errors, setErrors] = useState<{
        id_usuario?: string;
        productos?: string;
    }>({});

    useEffect(() => {
        if (pedido) {
            setFormData({
                id_usuario: pedido.id_usuario,
                fecha_pedido: pedido.fecha_pedido,
                estado: pedido.estado,
                total: pedido.total,
                productos: pedido.productos
            });
        }
    }, [pedido]);

    useEffect(() => {
        const fetchProductos = async () => {
            setProductosLoading(true);
            try {
                const allProducts = await getAllProducts();
                setProductos(allProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setProductosLoading(false);
            }
        };

        fetchProductos();
    }, []);

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
            onSubmit(formData);
        }
    };

    const handleUserChange = (userId: number) => {
        setFormData(prev => ({ ...prev, id_usuario: userId }));
        if (errors.id_usuario) {
            setErrors(prev => ({ ...prev, id_usuario: undefined }));
        }
    };

    const handleProductsChange = (productos: ProductoPedido[]) => {
        setFormData(prev => ({ ...prev, productos }));
        if (errors.productos && productos.length > 0) {
            setErrors(prev => ({ ...prev, productos: undefined }));
        }
    };

    const handleStatusChange = (estado: 'pendiente' | 'entregado' | 'cancelado') => {
        setFormData(prev => ({ ...prev, estado }));
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                    {pedido ? 'Editar Pedido' : 'Crear Nuevo Pedido'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                    {pedido ? 'Actualiza la información del pedido' : 'Completa los datos del nuevo pedido'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Formulario Principal */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Selector de Usuario */}
                        <div>
                            <UserSelector
                                usuarios={usuarios}
                                selectedUserId={formData.id_usuario}
                                onUserChange={handleUserChange}
                                loading={usuariosLoading}
                            />
                            {errors.id_usuario && (
                                <p className="mt-2 text-sm text-red-600">{errors.id_usuario}</p>
                            )}
                        </div>

                        {/* Estado del Pedido (solo en edición) */}
                        {pedido && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Estado del Pedido
                                </label>
                                <div className="flex space-x-4">
                                    {(['pendiente', 'entregado', 'cancelado'] as const).map((estado) => (
                                        <label key={estado} className="flex items-center">
                                            <input
                                                type="radio"
                                                name="estado"
                                                value={estado}
                                                checked={formData.estado === estado}
                                                onChange={(e) => handleStatusChange(e.target.value as typeof estado)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            />
                                            <span className="ml-2 text-sm text-gray-700 capitalize">{estado}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Selector de Productos */}
                        <div>
                            <ProductSelector
                                productos={productos}
                                selectedProducts={formData.productos}
                                onProductsChange={handleProductsChange}
                                loading={productosLoading}
                            />
                            {errors.productos && (
                                <p className="mt-2 text-sm text-red-600">{errors.productos}</p>
                            )}
                        </div>
                    </div>

                    {/* Resumen del Pedido */}
                    <div className="lg:col-span-1">
                        <OrderSummary productos={formData.productos} total={formData.total} />
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
                            pedido ? 'Actualizar Pedido' : 'Crear Pedido'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}