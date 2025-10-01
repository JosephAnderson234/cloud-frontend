import { useState, useMemo } from 'react';
import type { Producto, Categoria, ProductoWithCategory } from '@interfaces/productos';
import type { ProductoFormData, CategoriaFormData } from '@interfaces/productosComponents';
import { useProductosYCategorias } from '@hooks/useProductos';
import Notification from '@components/Notification';
import ConfirmModal from '@components/ConfirmModal';
import { 
    ProductoTable, 
    ProductoForm, 
    ProductoStats, 
    ProductoFilters, 
    CategoriaTable, 
    CategoriaForm, 
    CategoriaModal 
} from '@components/productos';

type ViewMode = 'productos' | 'categorias';

export default function Productos() {
    const {
        productos,
        categorias,
        loadingProductos,
        loadingCategorias,
        errorProductos,
        errorCategorias,
        createProducto,
        updateProducto,
        deleteProducto,
        createCategoria,
        updateCategoria,
        deleteCategoria,
        clearErrorProductos,
        clearErrorCategorias,
        totalProductos,
        totalCategorias,
        averagePrice
    } = useProductosYCategorias();

    // Estados de UI
    const [viewMode, setViewMode] = useState<ViewMode>('productos');
    const [showProductoForm, setShowProductoForm] = useState(false);
    const [showCategoriaForm, setShowCategoriaForm] = useState(false);
    const [editingProducto, setEditingProducto] = useState<Producto | undefined>();
    const [editingCategoria, setEditingCategoria] = useState<Categoria | undefined>();
    
    // Estados de modales
    const [deleteProductoConfirm, setDeleteProductoConfirm] = useState<{ show: boolean; producto: ProductoWithCategory | null }>({
        show: false,
        producto: null
    });
    const [deleteCategoriaConfirm, setDeleteCategoriaConfirm] = useState<{ show: boolean; categoria: Categoria | null }>({
        show: false,
        categoria: null
    });
    const [categoriaModal, setCategoriaModal] = useState<{ 
        show: boolean; 
        categoriaId: number; 
        categoriaNombre: string; 
    }>({
        show: false,
        categoriaId: 0,
        categoriaNombre: ''
    });

    // Estados de filtros
    const [filters, setFilters] = useState({
        searchTerm: '',
        selectedCategoria: null as number | null,
        priceRange: { min: 0, max: 0 }
    });

    // Estados de notificaciones
    const [notification, setNotification] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error' | 'info';
    }>({ show: false, message: '', type: 'info' });

    // Productos filtrados
    const filteredProductos = useMemo(() => {
        return productos.filter(producto => {
            const matchesSearch = producto.nombre.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                                producto.descripcion.toLowerCase().includes(filters.searchTerm.toLowerCase());
            const matchesCategoria = !filters.selectedCategoria || producto.categoria_id === filters.selectedCategoria;
            const matchesPrice = (!filters.priceRange.min || producto.precio >= filters.priceRange.min) &&
                               (!filters.priceRange.max || producto.precio <= filters.priceRange.max);
            
            return matchesSearch && matchesCategoria && matchesPrice;
        });
    }, [productos, filters]);

    const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
        setNotification({ show: true, message, type });
    };

    const hideNotification = () => {
        setNotification(prev => ({ ...prev, show: false }));
    };

    // Handlers para productos
    const handleCreateProducto = async (data: ProductoFormData | Partial<ProductoFormData>) => {
        try {
            await createProducto(data as ProductoFormData);
            setShowProductoForm(false);
            showNotification('Producto creado exitosamente', 'success');
        } catch (error) {
            console.error('Error creating product:', error);
            showNotification('Error al crear el producto', 'error');
        }
    };

    const handleUpdateProducto = async (data: ProductoFormData | Partial<ProductoFormData>) => {
        if (editingProducto) {
            try {
                await updateProducto(editingProducto.id_producto, data);
                setEditingProducto(undefined);
                setShowProductoForm(false);
                showNotification('Producto actualizado exitosamente', 'success');
            } catch (error) {
                console.error('Error updating product:', error);
                showNotification('Error al actualizar el producto', 'error');
            }
        }
    };

    const handleDeleteProducto = async () => {
        if (deleteProductoConfirm.producto) {
            try {
                await deleteProducto(deleteProductoConfirm.producto.id_producto);
                setDeleteProductoConfirm({ show: false, producto: null });
                showNotification('Producto eliminado exitosamente', 'success');
            } catch (error) {
                console.error('Error deleting product:', error);
                showNotification('Error al eliminar el producto', 'error');
            }
        }
    };

    // Handlers para categorías
    const handleCreateCategoria = async (data: CategoriaFormData | Partial<CategoriaFormData>) => {
        try {
            await createCategoria(data as CategoriaFormData);
            setShowCategoriaForm(false);
            showNotification('Categoría creada exitosamente', 'success');
        } catch (error) {
            console.error('Error creating category:', error);
            showNotification('Error al crear la categoría', 'error');
        }
    };

    const handleUpdateCategoria = async (data: CategoriaFormData | Partial<CategoriaFormData>) => {
        if (editingCategoria) {
            try {
                await updateCategoria(editingCategoria.id_categoria, data);
                setEditingCategoria(undefined);
                setShowCategoriaForm(false);
                showNotification('Categoría actualizada exitosamente', 'success');
            } catch (error) {
                console.error('Error updating category:', error);
                showNotification('Error al actualizar la categoría', 'error');
            }
        }
    };

    const handleDeleteCategoria = async () => {
        if (deleteCategoriaConfirm.categoria) {
            try {
                await deleteCategoria(deleteCategoriaConfirm.categoria.id_categoria);
                setDeleteCategoriaConfirm({ show: false, categoria: null });
                showNotification('Categoría eliminada exitosamente', 'success');
            } catch (error) {
                console.error('Error deleting category:', error);
                showNotification('Error al eliminar la categoría', 'error');
            }
        }
    };

    // Handlers de UI
    const startEditProducto = (producto: Producto) => {
        setEditingProducto(producto);
        setShowProductoForm(true);
    };

    const startDeleteProducto = (productoId: number) => {
        const producto = productos.find(p => p.id_producto === productoId);
        if (producto) {
            setDeleteProductoConfirm({ show: true, producto });
        }
    };

    const startEditCategoria = (categoria: Categoria) => {
        setEditingCategoria(categoria);
        setShowCategoriaForm(true);
    };

    const startDeleteCategoria = (categoriaId: number) => {
        const categoria = categorias.find(c => c.id_categoria === categoriaId);
        if (categoria) {
            setDeleteCategoriaConfirm({ show: true, categoria });
        }
    };

    const viewCategoriaDetails = (categoriaId: number) => {
        const categoria = categorias.find(c => c.id_categoria === categoriaId);
        if (categoria) {
            setCategoriaModal({ 
                show: true, 
                categoriaId, 
                categoriaNombre: categoria.nombre_categoria 
            });
        }
    };

    const cancelForms = () => {
        setShowProductoForm(false);
        setShowCategoriaForm(false);
        setEditingProducto(undefined);
        setEditingCategoria(undefined);
    };

    const resetFilters = () => {
        setFilters({
            searchTerm: '',
            selectedCategoria: null,
            priceRange: { min: 0, max: 0 }
        });
    };

    // Limpiar errores
    const handleErrorClear = () => {
        clearErrorProductos();
        clearErrorCategorias();
        hideNotification();
    };

    const currentError = errorProductos || errorCategorias;
    const currentLoading = loadingProductos || loadingCategorias;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
                            <p className="mt-2 text-gray-600">
                                Administra tu catálogo de productos y categorías.
                            </p>
                        </div>
                        
                        {/* View Mode Tabs */}
                        <div className="mt-4 sm:mt-0">
                            <div className="flex rounded-lg border border-gray-300 bg-white">
                                <button
                                    onClick={() => setViewMode('productos')}
                                    className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                                        viewMode === 'productos'
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    Productos
                                </button>
                                <button
                                    onClick={() => setViewMode('categorias')}
                                    className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                                        viewMode === 'categorias'
                                            ? 'bg-blue-600 text-white'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    Categorías
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="mb-8">
                    <ProductoStats
                        totalProductos={totalProductos}
                        totalCategorias={totalCategorias}
                        averagePrice={averagePrice}
                        loading={currentLoading}
                    />
                </div>

                {/* Error General */}
                {currentError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-red-600">{currentError}</p>
                            <button
                                onClick={handleErrorClear}
                                className="text-red-400 hover:text-red-600"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    {viewMode === 'productos' ? (
                        <>
                            {/* Filtros de Productos */}
                            {!showProductoForm && (
                                <ProductoFilters
                                    categorias={categorias}
                                    selectedCategoria={filters.selectedCategoria}
                                    onCategoriaChange={(categoriaId: number | null) => setFilters(prev => ({ ...prev, selectedCategoria: categoriaId }))}
                                    searchTerm={filters.searchTerm}
                                    onSearchChange={(term: string) => setFilters(prev => ({ ...prev, searchTerm: term }))}
                                    priceRange={filters.priceRange}
                                    onPriceRangeChange={(range: { min: number; max: number }) => setFilters(prev => ({ ...prev, priceRange: range }))}
                                    onReset={resetFilters}
                                />
                            )}

                            {/* Action Buttons */}
                            {!showProductoForm && (
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setShowProductoForm(true)}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Nuevo Producto
                                    </button>
                                </div>
                            )}

                            {/* Formulario o Tabla de Productos */}
                            {showProductoForm ? (
                                <ProductoForm
                                    producto={editingProducto}
                                    onSubmit={editingProducto ? handleUpdateProducto : handleCreateProducto}
                                    onCancel={cancelForms}
                                    loading={loadingProductos}
                                />
                            ) : (
                                <ProductoTable
                                    productos={filteredProductos}
                                    onEdit={startEditProducto}
                                    onDelete={startDeleteProducto}
                                    onViewCategory={viewCategoriaDetails}
                                    loading={loadingProductos}
                                />
                            )}
                        </>
                    ) : (
                        <>
                            {/* Action Buttons para Categorías */}
                            {!showCategoriaForm && (
                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setShowCategoriaForm(true)}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                                    >
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Nueva Categoría
                                    </button>
                                </div>
                            )}

                            {/* Formulario o Tabla de Categorías */}
                            {showCategoriaForm ? (
                                <CategoriaForm
                                    categoria={editingCategoria}
                                    onSubmit={editingCategoria ? handleUpdateCategoria : handleCreateCategoria}
                                    onCancel={cancelForms}
                                    loading={loadingCategorias}
                                />
                            ) : (
                                <CategoriaTable
                                    categorias={categorias}
                                    onEdit={startEditCategoria}
                                    onDelete={startDeleteCategoria}
                                    loading={loadingCategorias}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Modales */}
            <ConfirmModal
                isOpen={deleteProductoConfirm.show}
                onClose={() => setDeleteProductoConfirm({ show: false, producto: null })}
                onConfirm={handleDeleteProducto}
                title="Eliminar Producto"
                message={`¿Estás seguro de que deseas eliminar el producto "${deleteProductoConfirm.producto?.nombre}"? Esta acción no se puede deshacer.`}
                loading={loadingProductos}
                confirmText="Eliminar"
                variant="danger"
            />

            <ConfirmModal
                isOpen={deleteCategoriaConfirm.show}
                onClose={() => setDeleteCategoriaConfirm({ show: false, categoria: null })}
                onConfirm={handleDeleteCategoria}
                title="Eliminar Categoría"
                message={`¿Estás seguro de que deseas eliminar la categoría "${deleteCategoriaConfirm.categoria?.nombre_categoria}"? Esta acción puede afectar a los productos asociados.`}
                loading={loadingCategorias}
                confirmText="Eliminar"
                variant="warning"
            />

            <CategoriaModal
                isOpen={categoriaModal.show}
                onClose={() => setCategoriaModal({ show: false, categoriaId: 0, categoriaNombre: '' })}
                categoriaId={categoriaModal.categoriaId}
                categoriaNombre={categoriaModal.categoriaNombre}
            />

            {/* Notificaciones */}
            <Notification
                message={notification.message}
                visible={notification.show}
                onClose={hideNotification}
                status={notification.type}
            />
        </div>
    );
}
