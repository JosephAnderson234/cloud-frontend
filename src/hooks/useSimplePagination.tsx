import { useState, useEffect, useCallback } from 'react';
import productosService from '@services/productos';
import type { ProductoResponseDTO, CategoriaDTO } from '@interfaces/productos';
import type { PaginatedResponse } from '@interfaces/Pagination';

// Hook simplificado para productos con paginación
export const useSimpleProductsPagination = (pageSize: number = 10) => {
    const [data, setData] = useState<ProductoResponseDTO[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async (page: number) => {
        setLoading(true);
        setError(null);
        
        try {
            const response: PaginatedResponse<ProductoResponseDTO> = await productosService.getProductsPaginated(page, pageSize);
            setData(response.contents);
            setCurrentPage(response.page);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar productos');
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [pageSize]);

    const goToPage = useCallback((page: number) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            setCurrentPage(page);
            fetchData(page);
        }
    }, [totalPages, currentPage, fetchData]);

    const nextPage = useCallback(() => {
        if (currentPage < totalPages) {
            goToPage(currentPage + 1);
        }
    }, [currentPage, totalPages, goToPage]);

    const previousPage = useCallback(() => {
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    }, [currentPage, goToPage]);

    const changePageSize = useCallback(() => {
        setCurrentPage(1);
        // Note: pageSize is passed in constructor
        fetchData(1);
    }, [fetchData]);

    const refresh = useCallback(() => {
        // Usar una referencia al currentPage actual sin crear dependencia circular
        setCurrentPage(prevPage => {
            fetchData(prevPage);
            return prevPage;
        });
    }, [fetchData]);

    useEffect(() => {
        fetchData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        // Data
        products: data,
        
        // Pagination state
        currentPage,
        totalPages,
        totalElements,
        pageSize,
        
        // Loading & error state
        loading,
        error,
        
        // Actions
        goToPage,
        nextPage,
        previousPage,
        changePageSize,
        refresh,
        
        // Computed values
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
        startItem: totalElements === 0 ? 0 : (currentPage - 1) * pageSize + 1,
        endItem: Math.min(currentPage * pageSize, totalElements)
    };
};

// Hook simplificado para categorías con paginación
export const useSimpleCategoriesPagination = (pageSize: number = 10) => {
    const [data, setData] = useState<CategoriaDTO[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async (page: number) => {
        setLoading(true);
        setError(null);
        
        try {
            const response: PaginatedResponse<CategoriaDTO> = await productosService.getCategoriesPaginated(page, pageSize);
            setData(response.contents);
            setCurrentPage(response.page);
            setTotalPages(response.totalPages);
            setTotalElements(response.totalElements);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar categorías');
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [pageSize]);

    const goToPage = useCallback((page: number) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            setCurrentPage(page);
            fetchData(page);
        }
    }, [totalPages, currentPage, fetchData]);

    const nextPage = useCallback(() => {
        if (currentPage < totalPages) {
            goToPage(currentPage + 1);
        }
    }, [currentPage, totalPages, goToPage]);

    const previousPage = useCallback(() => {
        if (currentPage > 1) {
            goToPage(currentPage - 1);
        }
    }, [currentPage, goToPage]);

    const changePageSize = useCallback(() => {
        setCurrentPage(1);
        // Note: pageSize is passed in constructor
        fetchData(1);
    }, [fetchData]);

    const refresh = useCallback(() => {
        // Usar una referencia al currentPage actual sin crear dependencia circular
        setCurrentPage(prevPage => {
            fetchData(prevPage);
            return prevPage;
        });
    }, [fetchData]);

    useEffect(() => {
        fetchData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        // Data
        categories: data,
        
        // Pagination state
        currentPage,
        totalPages,
        totalElements,
        pageSize,
        
        // Loading & error state
        loading,
        error,
        
        // Actions
        goToPage,
        nextPage,
        previousPage,
        changePageSize,
        refresh,
        
        // Computed values
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
        startItem: totalElements === 0 ? 0 : (currentPage - 1) * pageSize + 1,
        endItem: Math.min(currentPage * pageSize, totalElements)
    };
};