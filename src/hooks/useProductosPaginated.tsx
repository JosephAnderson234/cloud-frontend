import { useEffect, useCallback } from 'react';
import { usePagination } from './usePagination';
import productosService from '@services/productos';
import type { ProductoResponseDTO, CategoriaDTO } from '@interfaces/productos';

// Hook for paginated products
export const useProductosPaginated = (initialPageSize: number = 10) => {
    const pagination = usePagination<ProductoResponseDTO>({
        initialPageSize
    });

    const fetchProducts = useCallback(async () => {
        pagination.setLoading(true);
        pagination.setError(null);
        
        try {
            const response = await productosService.getProductsPaginated(
                pagination.currentPage,
                pagination.pageSize
            );
            pagination.setData(response);
        } catch (error) {
            pagination.setError(error instanceof Error ? error.message : 'Error fetching products');
        } finally {
            pagination.setLoading(false);
        }
    }, [pagination]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return {
        ...pagination,
        refetch: fetchProducts
    };
};

// Hook for paginated categories
export const useCategoriasPaginated = (initialPageSize: number = 10) => {
    const pagination = usePagination<CategoriaDTO>({
        initialPageSize
    });

    const fetchCategories = useCallback(async () => {
        pagination.setLoading(true);
        pagination.setError(null);
        
        try {
            const response = await productosService.getCategoriesPaginated(
                pagination.currentPage,
                pagination.pageSize
            );
            pagination.setData(response);
        } catch (error) {
            pagination.setError(error instanceof Error ? error.message : 'Error fetching categories');
        } finally {
            pagination.setLoading(false);
        }
    }, [pagination]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return {
        ...pagination,
        refetch: fetchCategories
    };
};

// Hook for combined paginated data
export const useProductosYCategoriasPaginated = (
    productPageSize: number = 10,
    categoryPageSize: number = 10
) => {
    const productos = useProductosPaginated(productPageSize);
    const categorias = useCategoriasPaginated(categoryPageSize);

    return {
        productos: {
            data: productos.data,
            currentPage: productos.currentPage,
            totalPages: productos.totalPages,
            totalElements: productos.totalElements,
            pageSize: productos.pageSize,
            loading: productos.loading,
            error: productos.error,
            goToPage: productos.goToPage,
            changePageSize: productos.changePageSize,
            nextPage: productos.nextPage,
            previousPage: productos.previousPage,
            refetch: productos.refetch,
            hasNextPage: productos.hasNextPage,
            hasPreviousPage: productos.hasPreviousPage,
            startItem: productos.startItem,
            endItem: productos.endItem
        },
        categorias: {
            data: categorias.data,
            currentPage: categorias.currentPage,
            totalPages: categorias.totalPages,
            totalElements: categorias.totalElements,
            pageSize: categorias.pageSize,
            loading: categorias.loading,
            error: categorias.error,
            goToPage: categorias.goToPage,
            changePageSize: categorias.changePageSize,
            nextPage: categorias.nextPage,
            previousPage: categorias.previousPage,
            refetch: categorias.refetch,
            hasNextPage: categorias.hasNextPage,
            hasPreviousPage: categorias.hasPreviousPage,
            startItem: categorias.startItem,
            endItem: categorias.endItem
        }
    };
};