import { useState, useEffect } from 'react';
import type { Producto, Categoria, ProductoWithCategory, ProductoFormData, CategoriaFormData } from '@interfaces/productos';
import * as productosService from '@services/productos';

// Hook para gestión de productos
export const useProductos = () => {
    const [productos, setProductos] = useState<ProductoWithCategory[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProductos = async () => {
        setLoading(true);
        try {
            const allProducts = await productosService.getAllProductsWithCategories();
            setProductos(allProducts);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching products');
        } finally {
            setLoading(false);
        }
    };

    const createProducto = async (data: ProductoFormData): Promise<Producto> => {
        setLoading(true);
        try {
            const newProduct = await productosService.createProduct(data);
            // Refetch to get updated data with category info
            await fetchProductos();
            return newProduct;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error creating product');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateProducto = async (id: number, data: Partial<ProductoFormData>): Promise<Producto> => {
        setLoading(true);
        try {
            const updatedProduct = await productosService.updateProduct(id, data);
            // Refetch to get updated data with category info
            await fetchProductos();
            return updatedProduct;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error updating product');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteProducto = async (id: number): Promise<void> => {
        setLoading(true);
        try {
            await productosService.deleteProduct(id);
            setProductos(prev => prev.filter(producto => producto.id_producto !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error deleting product');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getProducto = async (id: number): Promise<Producto> => {
        setLoading(true);
        try {
            return await productosService.getProductById(id);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching product');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getProductosByCategoria = async (categoriaId: number): Promise<Producto[]> => {
        setLoading(true);
        try {
            return await productosService.getProductsByCategory(categoriaId);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching products by category');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    return {
        productos,
        loading,
        error,
        createProducto,
        updateProducto,
        deleteProducto,
        getProducto,
        getProductosByCategoria,
        refetch: fetchProductos,
        clearError: () => setError(null)
    };
};

// Hook para gestión de categorías
export const useCategorias = () => {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCategorias = async () => {
        setLoading(true);
        try {
            const allCategories = await productosService.getAllCategories();
            setCategorias(allCategories);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching categories');
        } finally {
            setLoading(false);
        }
    };

    const createCategoria = async (data: CategoriaFormData): Promise<Categoria> => {
        setLoading(true);
        try {
            const newCategory = await productosService.createCategory(data);
            setCategorias(prev => [...prev, newCategory]);
            return newCategory;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error creating category');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateCategoria = async (id: number, data: Partial<CategoriaFormData>): Promise<Categoria> => {
        setLoading(true);
        try {
            const updatedCategory = await productosService.updateCategory(id, data);
            setCategorias(prev => prev.map(categoria => 
                categoria.id_categoria === id ? updatedCategory : categoria
            ));
            return updatedCategory;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error updating category');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteCategoria = async (id: number): Promise<void> => {
        setLoading(true);
        try {
            await productosService.deleteCategory(id);
            setCategorias(prev => prev.filter(categoria => categoria.id_categoria !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error deleting category');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getCategoria = async (id: number): Promise<Categoria> => {
        setLoading(true);
        try {
            return await productosService.getCategoryById(id);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching category');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategorias();
    }, []);

    return {
        categorias,
        loading,
        error,
        createCategoria,
        updateCategoria,
        deleteCategoria,
        getCategoria,
        refetch: fetchCategorias,
        clearError: () => setError(null)
    };
};

// Hook combinado para productos y categorías
export const useProductosYCategorias = () => {
    const productos = useProductos();
    const categorias = useCategorias();

    return {
        productos: productos.productos,
        categorias: categorias.categorias,
        loadingProductos: productos.loading,
        loadingCategorias: categorias.loading,
        errorProductos: productos.error,
        errorCategorias: categorias.error,
        
        // Productos
        createProducto: productos.createProducto,
        updateProducto: productos.updateProducto,
        deleteProducto: productos.deleteProducto,
        getProducto: productos.getProducto,
        getProductosByCategoria: productos.getProductosByCategoria,
        refetchProductos: productos.refetch,
        clearErrorProductos: productos.clearError,

        // Categorías
        createCategoria: categorias.createCategoria,
        updateCategoria: categorias.updateCategoria,
        deleteCategoria: categorias.deleteCategoria,
        getCategoria: categorias.getCategoria,
        refetchCategorias: categorias.refetch,
        clearErrorCategorias: categorias.clearError,

        // Stats
        totalProductos: productos.productos.length,
        totalCategorias: categorias.categorias.length,
        averagePrice: productos.productos.length > 0 
            ? productos.productos.reduce((sum, p) => sum + p.precio, 0) / productos.productos.length 
            : 0
    };
};