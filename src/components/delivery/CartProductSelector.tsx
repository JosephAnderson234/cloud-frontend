import { useState, useCallback, useEffect, useRef } from 'react';
import type { CartProductSelectorProps, CartItem } from '@interfaces/deliveryComponents';
import type { ProductoResponseDTO } from '@interfaces/productos';
import { searchProducts } from '@services/productos';

export default function CartProductSelector({ selectedItems, onItemsChange, isLoading = false }: CartProductSelectorProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<ProductoResponseDTO[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [newItem, setNewItem] = useState({
        id_producto: 0,
        cantidad: 1
    });
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Debounced search function
    const debouncedSearch = useCallback(
        async (term: string) => {
            if (!term.trim()) {
                setSearchResults([]);
                setShowDropdown(false);
                return;
            }

            // No buscar si ya hay un producto seleccionado y el término coincide
            if (newItem.id_producto > 0 && searchResults.length === 0) {
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
        [newItem.id_producto, searchResults.length]
    );

    // Effect for debouncing search
    useEffect(() => {
        const timer = setTimeout(() => {
            debouncedSearch(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, debouncedSearch]);

    const selectProduct = (producto: ProductoResponseDTO) => {
        setNewItem({
            id_producto: producto.idProducto || 0,
            cantidad: 1
        });
        setSearchTerm(producto.nombre || '');
        setShowDropdown(false);
        setSearchResults([]); // Limpiar resultados de búsqueda
    };

    const addItem = () => {
        if (newItem.id_producto === 0) return;

        // Obtener el nombre del producto seleccionado
        const selectedProduct = searchResults.find(p => p.idProducto === newItem.id_producto);
        const productName = selectedProduct?.nombre || searchTerm;

        // Verificar si el producto ya está agregado
        const existingItem = selectedItems.find(item => item.id_producto === newItem.id_producto);
        if (existingItem) {
            // Actualizar cantidad del item existente, manteniendo el nombre
            const updatedItems = selectedItems.map(item =>
                item.id_producto === newItem.id_producto
                    ? { ...item, cantidad: item.cantidad + newItem.cantidad, name: item.name || productName }
                    : item
            );
            onItemsChange(updatedItems);
        } else {
            // Agregar nuevo item con el nombre del producto
            const newCartItem: CartItem = {
                id_producto: newItem.id_producto,
                name: productName,
                cantidad: newItem.cantidad
            };
            onItemsChange([...selectedItems, newCartItem]);
        }

        // Reset form
        setNewItem({
            id_producto: 0,
            cantidad: 1
        });
        setSearchTerm('');
        setSearchResults([]);
        setShowDropdown(false);
    };

    const removeItem = (id_producto: number) => {
        const updatedItems = selectedItems.filter(item => item.id_producto !== id_producto);
        onItemsChange(updatedItems);
    };

    const updateItemQuantity = (id_producto: number, cantidad: number) => {
        if (cantidad <= 0) {
            removeItem(id_producto);
            return;
        }

        const updatedItems = selectedItems.map(item =>
            item.id_producto === id_producto ? { ...item, cantidad } : item
        );
        onItemsChange(updatedItems);
    };

    const getProductName = (id_producto: number) => {
        // Primero buscar en los items seleccionados (tienen el nombre guardado)
        const selectedItem = selectedItems.find(item => item.id_producto === id_producto);
        if (selectedItem?.name) {
            return selectedItem.name;
        }
        
        // Luego buscar en los resultados de búsqueda actuales
        const foundProduct = searchResults.find(p => p.idProducto === id_producto);
        return foundProduct?.nombre || `Producto ID: ${id_producto}`;
    };

    return (
        <div className="space-y-4">
            <div className="border-b pb-4">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Productos del Carrito</h4>
                
                {/* Product Search */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-2 relative" ref={dropdownRef}>
                        <label htmlFor="cart-product-search" className="block text-sm font-medium text-gray-700 mb-2">
                            Buscar Producto
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                id="cart-product-search"
                                value={searchTerm}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setSearchTerm(value);
                                    // Si el usuario está borrando o cambiando el texto, resetear selección
                                    if (newItem.id_producto > 0 && value !== searchTerm) {
                                        setNewItem({
                                            id_producto: 0,
                                            cantidad: 1
                                        });
                                    }
                                }}
                                onFocus={() => {
                                    // Solo mostrar dropdown si no hay producto seleccionado o si el campo está vacío
                                    if (newItem.id_producto === 0 || !searchTerm.trim()) {
                                        if (searchTerm.trim()) {
                                            debouncedSearch(searchTerm);
                                        }
                                    }
                                }}
                                placeholder="Escribe para buscar productos..."
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={isLoading}
                            />
                            {isSearching && (
                                <div className="absolute right-3 top-2.5">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                </div>
                            )}
                            {newItem.id_producto > 0 && !isSearching && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setNewItem({
                                            id_producto: 0,
                                            cantidad: 1
                                        });
                                        setSearchTerm('');
                                        setSearchResults([]);
                                        setShowDropdown(false);
                                    }}
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                                    disabled={isLoading}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>
                        
                        {/* Search Results Dropdown */}
                        {showDropdown && !isLoading && (
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
                                            <div className="text-sm text-gray-600">€{producto.precio.toFixed(2)}</div>
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
                        <label htmlFor="cart-cantidad" className="block text-sm font-medium text-gray-700 mb-2">
                            Cantidad
                        </label>
                        <input
                            type="number"
                            id="cart-cantidad"
                            min="1"
                            value={newItem.cantidad}
                            onChange={(e) => setNewItem(prev => ({ ...prev, cantidad: Number(e.target.value) }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={isLoading}
                        />
                    </div>
                    
                    <button
                        type="button"
                        onClick={addItem}
                        disabled={newItem.id_producto === 0 || isLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Selected Items List */}
            <div>
                <h5 className="text-md font-medium text-gray-900 mb-3">
                    Productos Seleccionados ({selectedItems.length})
                </h5>
                
                {selectedItems.length === 0 ? (
                    <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
                        <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <p className="text-sm text-gray-500">No hay productos en el carrito</p>
                        <p className="text-xs text-gray-400 mt-1">Busca y selecciona productos arriba</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {selectedItems.map((item) => (
                            <div key={item.id_producto} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">{getProductName(item.id_producto)}</p>
                                    <p className="text-sm text-gray-600">
                                        Cantidad: {item.cantidad}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.cantidad}
                                        onChange={(e) => updateItemQuantity(item.id_producto, Number(e.target.value))}
                                        className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeItem(item.id_producto)}
                                        className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                                        disabled={isLoading}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                        
                        {/* Summary */}
                        <div className="border-t pt-3 mt-3">
                            <div className="flex justify-between items-center text-lg font-semibold">
                                <span>Total de productos:</span>
                                <span>{selectedItems.reduce((total, item) => total + item.cantidad, 0)}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}