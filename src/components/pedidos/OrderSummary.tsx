import type { OrderSummaryProps } from '@interfaces/pedidosComponents';

export default function OrderSummary({ productos, total }: OrderSummaryProps) {
    const subtotal = productos.reduce((sum, producto) => sum + (producto.precio_unitario * producto.cantidad), 0);
    const iva = subtotal * 0.16; // 16% IVA
    const totalItems = productos.reduce((sum, producto) => sum + producto.cantidad, 0);

    return (
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <h4 className="text-lg font-semibold text-gray-900">Resumen del Pedido</h4>
            
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Items ({totalItems})</span>
                    <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">IVA (16%)</span>
                    <span className="text-gray-900">${iva.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                        <span className="text-gray-900">Total</span>
                        <span className="text-blue-600">${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {productos.length > 0 && (
                <div className="border-t pt-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Desglose de productos:</h5>
                    <div className="space-y-1">
                        {productos.map((producto, index) => (
                            <div key={index} className="flex justify-between text-xs text-gray-600">
                                <span>Producto #{producto.id_producto} × {producto.cantidad}</span>
                                <span>${(producto.precio_unitario * producto.cantidad).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}