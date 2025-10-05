import { useState, useMemo } from 'react';
import type { ProductoResponseDTO, CategoriaDTO } from '@interfaces/productos';
import type { ProductoFormData, CategoriaFormData } from '@interfaces/productosComponents';
import { useSimpleProductsPagination, useSimpleCategoriesPagination } from '@hooks/useSimplePagination';
import { useNotification } from '@hooks/useNotification';
import productosService from '@services/productos';
import ConfirmModal from '@components/ConfirmModal';
import SimplePagination from '@components/common/SimplePagination';
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
    const { showNotification } = useNotification();
    
    // Hooks de paginación simplificados
    const products = useSimpleProductsPagination(10);
    const categories = useSimpleCategoriesPagination(10);

    // Estados de UI
    const [viewMode, setViewMode] = useState<ViewMode>('productos');
    const [showProductoForm, setShowProductoForm] = useState(false);
    const [showCategoriaForm, setShowCategoriaForm] = useState(false);
    const [editingProducto, setEditingProducto] = useState<ProductoResponseDTO | undefined>();
    const [editingCategoria, setEditingCategoria] = useState<CategoriaDTO | undefined>();
    
    // Estados de filtros
    const [filters, setFilters] = useState({
        searchTerm: '',
        selectedCategoria: null as number | null,
        priceRange: { min: 0, max: 0 }
    });

    // Estados de modales de confirmación
    const [deleteProductoConfirm, setDeleteProductoConfirm] = useState<{
        show: boolean;
        producto: ProductoResponseDTO | null;
    }>({ show: false, producto: null });

    const [deleteCategoriaConfirm, setDeleteCategoriaConfirm] = useState<{
        show: boolean;
        categoria: CategoriaDTO | null;
    }>({ show: false, categoria: null });

    const [categoriaModal, setCategoriaModal] = useState<{
        show: boolean;
        categoriaId: number;
        categoriaNombre: string;
    }>({ show: false, categoriaId: 0, categoriaNombre: '' });

    // Productos filtrados
    const filteredProductos = useMemo(() => {
        if (!filters.searchTerm && !filters.selectedCategoria && !filters.priceRange.min && !filters.priceRange.max) {
            return products.products;
        }

        return products.products.filter((producto) => {
            const matchesSearch = !filters.searchTerm || 
                producto.nombre.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                producto.descripcion.toLowerCase().includes(filters.searchTerm.toLowerCase());
            
            const matchesCategoria = !filters.selectedCategoria || 
                producto.categoria.idCategoria === filters.selectedCategoria;
            
            const matchesPrice = (!filters.priceRange.min || producto.precio >= filters.priceRange.min) &&
                               (!filters.priceRange.max || producto.precio <= filters.priceRange.max);
            
            return matchesSearch && matchesCategoria && matchesPrice;
        });
    }, [products.products, filters]);

    // Stats calculadas
    const averagePrice = products.products.length > 0
        ? products.products.reduce((sum, p) => sum + p.precio, 0) / products.products.length
        : 0;

    // Handlers para productos
    const handleCreateProducto = async (data: ProductoFormData) => {
        try {
            await productosService.createProduct({
                nombre: data.nombre,
                descripcion: data.descripcion,
                precio: data.precio,
                idCategoria: data.idCategoria
            });
            await products.refresh();
            setShowProductoForm(false);
            showNotification({ message: 'Producto creado exitosamente', type: 'success' });
        } catch (error) {
            console.error('Error creating product:', error);
            showNotification({ message: 'Error al crear el producto', type: 'error' });
        }
    };

    const handleUpdateProducto = async (data: ProductoFormData) => {
        if (!editingProducto?.idProducto) return;
        
        try {
            await productosService.updateProduct(editingProducto.idProducto, {
                nombre: data.nombre,
                descripcion: data.descripcion,
                precio: data.precio,
                idCategoria: data.idCategoria
            });
            await products.refresh();
            setEditingProducto(undefined);
            setShowProductoForm(false);
            showNotification({ message: 'Producto actualizado exitosamente', type: 'success' });
        } catch (error) {
            console.error('Error updating product:', error);
            showNotification({ message: 'Error al actualizar el producto', type: 'error' });
        }
    };

    const handleDeleteProducto = async () => {
        if (!deleteProductoConfirm.producto?.idProducto) return;
        
        try {
            await productosService.deleteProduct(deleteProductoConfirm.producto.idProducto);
            await products.refresh();
            setDeleteProductoConfirm({ show: false, producto: null });
            showNotification({ message: 'Producto eliminado exitosamente', type: 'success' });
        } catch (error) {
            console.error('Error deleting product:', error);
            showNotification({ message: 'Error al eliminar el producto', type: 'error' });
        }
    };

    // Handlers para categorías
    const handleCreateCategoria = async (data: CategoriaFormData) => {
        try {
            await productosService.createCategory(data);
            await categories.refresh();
            setShowCategoriaForm(false);
            showNotification({ message: 'Categoría creada exitosamente', type: 'success' });
        } catch (error) {
            console.error('Error creating category:', error);
            showNotification({ message: 'Error al crear la categoría', type: 'error' });
        }
    };

    const handleUpdateCategoria = async (data: CategoriaFormData) => {
        if (!editingCategoria?.idCategoria) return;
        
        try {
            await productosService.updateCategory(editingCategoria.idCategoria, data);
            await categories.refresh();
            setEditingCategoria(undefined);
            setShowCategoriaForm(false);
            showNotification({ message: 'Categoría actualizada exitosamente', type: 'success' });
        } catch (error) {
            console.error('Error updating category:', error);
            showNotification({ message: 'Error al actualizar la categoría', type: 'error' });
        }
    };

    const handleDeleteCategoria = async () => {
        if (!deleteCategoriaConfirm.categoria?.idCategoria) return;
        
        try {
            await productosService.deleteCategory(deleteCategoriaConfirm.categoria.idCategoria);
            await categories.refresh();
            setDeleteCategoriaConfirm({ show: false, categoria: null });
            showNotification({ message: 'Categoría eliminada exitosamente', type: 'success' });
        } catch (error) {
            console.error('Error deleting category:', error);
            showNotification({ message: 'Error al eliminar la categoría', type: 'error' });
        }
    };

    const handleViewCategoria = (categoriaId: number) => {
        const categoria = categories.categories.find(c => c.idCategoria === categoriaId);
        if (categoria) {
            setCategoriaModal({
                show: true,
                categoriaId,
                categoriaNombre: categoria.nombreCategoria
            });
        }
    };

    return (
        <div className="container mx-auto px-4 py-6 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Gestión de {viewMode === 'productos' ? 'Productos' : 'Categorías'}
                        </h1>
                        <p className="mt-1 text-sm text-gray-600">
                            {viewMode === 'productos' 
                                ? `${products.totalElements} productos registrados`
                                : `${categories.totalElements} categorías registradas`
                            }
                        </p>
                    </div>
                    
                    <div className="mt-4 sm:mt-0 flex space-x-4">
                        <div className="flex rounded-lg border border-gray-200 p-1">
                            <button
                                onClick={() => setViewMode('productos')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                    viewMode === 'productos'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:text-gray-900'
                                }`}
                            >
                                Productos
                            </button>
                            <button
                                onClick={() => setViewMode('categorias')}
                                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                    viewMode === 'categorias'
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:text-gray-900'
                                }`}
                            >
                                Categorías
                            </button>
                        </div>
                        
                        <button
                            onClick={() => {
                                if (viewMode === 'productos') {
                                    setEditingProducto(undefined);
                                    setShowProductoForm(true);
                                } else {
                                    setEditingCategoria(undefined);
                                    setShowCategoriaForm(true);
                                }
                            }}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                            + Agregar {viewMode === 'productos' ? 'Producto' : 'Categoría'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            {viewMode === 'productos' ? (
                <div className="space-y-6">
                    {/* Stats */}
                    <ProductoStats
                        totalProductos={products.totalElements}
                        totalCategorias={categories.totalElements}
                        averagePrice={averagePrice}
                        loading={products.loading}
                    />

                    {/* Filtros */}
                    <ProductoFilters
                        searchTerm={filters.searchTerm}
                        onSearchChange={(term) => setFilters(prev => ({ ...prev, searchTerm: term }))}
                        onReset={() => setFilters({ searchTerm: '', selectedCategoria: null, priceRange: { min: 0, max: 0 } })}
                    />

                    {/* Tabla de productos */}
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="p-6">
                            <ProductoTable
                                productos={filteredProductos}
                                onEdit={(producto) => {
                                    setEditingProducto(producto);
                                    setShowProductoForm(true);
                                }}
                                onDelete={(id) => {
                                    const producto = products.products.find(p => p.idProducto === id);
                                    if (producto) {
                                        setDeleteProductoConfirm({ show: true, producto });
                                    }
                                }}
                                onViewCategory={handleViewCategoria}
                                loading={products.loading}
                            />
                            
                            {/* Paginación */}
                            {products.totalElements > 0 && filters.searchTerm === '' && (
                                <SimplePagination
                                    currentPage={products.currentPage}
                                    totalPages={products.totalPages}
                                    totalElements={products.totalElements}
                                    startItem={products.startItem}
                                    endItem={products.endItem}
                                    onPageChange={products.goToPage}
                                    loading={products.loading}
                                />
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Tabla de categorías */}
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="p-6">
                            <CategoriaTable
                                categorias={categories.categories}
                                onEdit={(categoria) => {
                                    setEditingCategoria(categoria);
                                    setShowCategoriaForm(true);
                                }}
                                onDelete={(id) => {
                                    const categoria = categories.categories.find(c => c.idCategoria === id);
                                    if (categoria) {
                                        setDeleteCategoriaConfirm({ show: true, categoria });
                                    }
                                }}
                                loading={categories.loading}
                            />
                            
                            {/* Paginación */}
                            {categories.totalElements > 0 && filters.searchTerm === '' && (
                                <SimplePagination
                                    currentPage={categories.currentPage}
                                    totalPages={categories.totalPages}
                                    totalElements={categories.totalElements}
                                    startItem={categories.startItem}
                                    endItem={categories.endItem}
                                    onPageChange={categories.goToPage}
                                    loading={categories.loading}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modales */}
            {showProductoForm && (
                <ProductoForm
                    producto={editingProducto}
                    onSubmit={editingProducto ? handleUpdateProducto : handleCreateProducto}
                    onCancel={() => {
                        setShowProductoForm(false);
                        setEditingProducto(undefined);
                    }}
                    loading={products.loading}
                />
            )}

            {showCategoriaForm && (
                <CategoriaForm
                    categoria={editingCategoria}
                    onSubmit={editingCategoria ? handleUpdateCategoria : handleCreateCategoria}
                    onCancel={() => {
                        setShowCategoriaForm(false);
                        setEditingCategoria(undefined);
                    }}
                    loading={categories.loading}
                />
            )}

            {categoriaModal.show && (
                <CategoriaModal
                    isOpen={categoriaModal.show}
                    categoriaId={categoriaModal.categoriaId}
                    categoriaNombre={categoriaModal.categoriaNombre}
                    onClose={() => setCategoriaModal({ show: false, categoriaId: 0, categoriaNombre: '' })}
                />
            )}

            {/* Confirmaciones */}
            <ConfirmModal
                isOpen={deleteProductoConfirm.show}
                onConfirm={handleDeleteProducto}
                onClose={() => setDeleteProductoConfirm({ show: false, producto: null })}
                title="Eliminar Producto"
                message={`¿Estás seguro de que deseas eliminar el producto "${deleteProductoConfirm.producto?.nombre}"?`}
                loading={products.loading}
                variant="danger"
            />

            <ConfirmModal
                isOpen={deleteCategoriaConfirm.show}
                onConfirm={handleDeleteCategoria}
                onClose={() => setDeleteCategoriaConfirm({ show: false, categoria: null })}
                title="Eliminar Categoría"
                message={`¿Estás seguro de que deseas eliminar la categoría "${deleteCategoriaConfirm.categoria?.nombreCategoria}"?`}
                loading={categories.loading}
                variant="danger"
            />
        </div>
    );
}