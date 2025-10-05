import { useState, useCallback, useEffect } from 'react';
import type { ProductSelectorProps } from '@interfaces/pedidosComponents';
import type { ProductoPedido } from '@interfaces/pedidos';
import type { ProductoResponseDTO } from '@interfaces/productos';
import { searchProducts } from '../../services/productos';

export default function ProductSelector({ selectedProducts, onProductsChange }: Omit<ProductSelectorProps, 'productos' | 'loading'>) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<ProductoResponseDTO[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [newProduct, setNewProduct] = useState({
        id_producto: 0,
        cantidad: 1,
        precio_unitario: 0
    });

    // Debounced search function
    const debouncedSearch = useCallback(
        async (term: string) => {
            if (!term.trim()) {
                setSearchResults([]);
                setShowDropdown(false);
                return;
            }

            setIsSearching(true);
            setShowDropdown(true);

            try {
                const results = await searchProducts(term, 0, 10); // Limitamos a 10 resultados
                // searchProducts devuelve PaginatedResponse, necesitamos contents
                setSearchResults(Array.isArray(results.contents) ? results.contents : []);
            } catch (error) {
                console.error('Error searching products:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        },
        []
    );

    // Effect for debouncing search
    useEffect(() => {
        const timer = setTimeout(() => {
            debouncedSearch(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, debouncedSearch]);

    const selectProduct = (producto: ProductoResponseDTO) => {
        setNewProduct({
            id_producto: producto.idProducto || 0,
            cantidad: 1,
            precio_unitario: producto.precio || 0
        });
        setSearchTerm(producto.nombre || '');
        setShowDropdown(false);
    };

    const addProduct = () => {
        if (newProduct.id_producto === 0) return;

        // Verificar si el producto ya está agregado
        const existingProduct = selectedProducts.find(p => p.id_producto === newProduct.id_producto);
        if (existingProduct) {
            // Actualizar cantidad del producto existente
            const updatedProducts = selectedProducts.map(p =>
                p.id_producto === newProduct.id_producto
                    ? { ...p, cantidad: p.cantidad + newProduct.cantidad }
                    : p
            );
            onProductsChange(updatedProducts);
        } else {
            // Agregar nuevo producto
            const newProducto: ProductoPedido = {
                id_producto: newProduct.id_producto,
                cantidad: newProduct.cantidad,
                precio_unitario: newProduct.precio_unitario
            };
            onProductsChange([...selectedProducts, newProducto]);
        }

        // Reset form
        setNewProduct({
            id_producto: 0,
            cantidad: 1,
            precio_unitario: 0
        });
        setSearchTerm('');
        setSearchResults([]);
    };

    const removeProduct = (id_producto: number) => {
        const updatedProducts = selectedProducts.filter(p => p.id_producto !== id_producto);
        onProductsChange(updatedProducts);
    };

    const updateProductQuantity = (id_producto: number, cantidad: number) => {
        if (cantidad <= 0) {
            removeProduct(id_producto);
            return;
        }

        const updatedProducts = selectedProducts.map(p =>
            p.id_producto === id_producto ? { ...p, cantidad } : p
        );
        onProductsChange(updatedProducts);
    };

    const getProductName = (id_producto: number) => {
        // Buscar en los resultados de búsqueda actuales o en productos ya seleccionados
        const foundProduct = searchResults.find(p => p.idProducto === id_producto);
        return foundProduct?.nombre || `Producto ID: ${id_producto}`;
    };

    return (
        <div className="space-y-4">
            <div className="border-b pb-4">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Productos del Pedido</h4>
                
                {/* Product Search */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-2 relative">
                        <label htmlFor="product-search" className="block text-sm font-medium text-gray-700 mb-2">
                            Buscar Producto
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="product-search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Escribe para buscar productos..."
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {isSearching && (
                                <div className="absolute right-3 top-2.5">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                </div>
                            )}
                        </div>
                        
                        {/* Search Results Dropdown */}
                        {showDropdown && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {searchResults.length > 0 ? (
                                    searchResults.map((producto) => (
                                        <button
                                            key={producto.idProducto}
                                            type="button"
                                            onClick={() => selectProduct(producto)}
                                            className="w-full px-3 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:bg-blue-50 focus:outline-none"
                                        >
                                            <div className="font-medium text-gray-900">{producto.nombre}</div>
                                            <div className="text-sm text-gray-600">${producto.precio.toFixed(2)}</div>
                                        </button>
                                    ))
                                ) : searchTerm.trim() && !isSearching ? (
                                    <div className="px-3 py-2 text-gray-500 text-sm">
                                        No se encontraron productos
                                    </div>
                                ) : null}
                            </div>
                        )}
                    </div>
                    
                    <div>
                        <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700 mb-2">
                            Cantidad
                        </label>
                        <input
                            type="number"
                            id="cantidad"
                            min="1"
                            value={newProduct.cantidad}
                            onChange={(e) => setNewProduct(prev => ({ ...prev, cantidad: Number(e.target.value) }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    
                    <button
                        type="button"
                        onClick={addProduct}
                        disabled={newProduct.id_producto === 0}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Selected Products List */}
            <div>
                <h5 className="text-md font-medium text-gray-900 mb-3">
                    Productos Seleccionados ({selectedProducts.length})
                </h5>
                
                {selectedProducts.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                        <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <p className="text-sm text-gray-500">No hay productos seleccionados</p>
                        <p className="text-xs text-gray-400 mt-1">Busca y selecciona productos arriba</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {selectedProducts.map((producto) => (
                            <div key={producto.id_producto} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{getProductName(producto.id_producto)}</p>
                                    <p className="text-sm text-gray-600">
                                        ${producto.precio_unitario.toFixed(2)} × {producto.cantidad} = ${(producto.precio_unitario * producto.cantidad).toFixed(2)}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="number"
                                        min="1"
                                        value={producto.cantidad}
                                        onChange={(e) => updateProductQuantity(producto.id_producto, Number(e.target.value))}
                                        className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeProduct(producto.id_producto)}
                                        className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                        
                        {/* Total */}
                        <div className="border-t pt-3 mt-3">
                            <div className="flex justify-between items-center text-lg font-semibold">
                                <span>Total:</span>
                                <span>${selectedProducts.reduce((total, p) => total + (p.precio_unitario * p.cantidad), 0).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}