import { useState, useCallback, useMemo } from 'react';
import type { PaginatedResponse } from '@interfaces/Pagination';

export interface UsePaginationProps {
    initialPage?: number;
    initialPageSize?: number;
}

export interface UsePaginationReturn<T> {
    // Pagination state
    currentPage: number;
    pageSize: number;
    
    // Pagination data
    data: T[];
    totalElements: number;
    totalPages: number;
    loading: boolean;
    error: string | null;
    
    // Pagination controls
    goToPage: (page: number) => void;
    changePageSize: (size: number) => void;
    nextPage: () => void;
    previousPage: () => void;
    refresh: () => void;
    
    // Pagination info
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startItem: number;
    endItem: number;
    
    // For manual data setting (when using external fetch)
    setData: (response: PaginatedResponse<T>) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export function usePagination<T>({
    initialPage = 1,
    initialPageSize = 10
}: UsePaginationProps = {}): UsePaginationReturn<T> {
    
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [pageSize, setPageSize] = useState(initialPageSize);
    const [data, setDataState] = useState<T[]>([]);
    const [totalElements, setTotalElements] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Calculate pagination info
    const paginationInfo = useMemo(() => {
        const startItem = totalElements === 0 ? 0 : (currentPage - 1) * pageSize + 1;
        const endItem = Math.min(currentPage * pageSize, totalElements);
        const hasNextPage = currentPage < totalPages;
        const hasPreviousPage = currentPage > 1;
        
        return {
            startItem,
            endItem,
            hasNextPage,
            hasPreviousPage
        };
    }, [currentPage, pageSize, totalElements, totalPages]);

    // Set data from PaginatedResponse
    const setData = useCallback((response: PaginatedResponse<T>) => {
        setDataState(response.contents);
        setCurrentPage(response.page);
        setPageSize(response.size);
        setTotalElements(response.totalElements);
        setTotalPages(response.totalPages);
    }, []);

    // Navigation functions
    const goToPage = useCallback((page: number) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            setCurrentPage(page);
        }
    }, [currentPage, totalPages]);

    const changePageSize = useCallback((newSize: number) => {
        if (newSize !== pageSize) {
            setPageSize(newSize);
            // Reset to first page when changing page size
            setCurrentPage(1);
        }
    }, [pageSize]);

    const nextPage = useCallback(() => {
        if (paginationInfo.hasNextPage) {
            setCurrentPage(prev => prev + 1);
        }
    }, [paginationInfo.hasNextPage]);

    const previousPage = useCallback(() => {
        if (paginationInfo.hasPreviousPage) {
            setCurrentPage(prev => prev - 1);
        }
    }, [paginationInfo.hasPreviousPage]);

    const refresh = useCallback(() => {
        // This would trigger a refetch in the consuming component
        setError(null);
    }, []);

    return {
        // Pagination state
        currentPage,
        pageSize,
        
        // Pagination data
        data,
        totalElements,
        totalPages,
        loading,
        error,
        
        // Pagination controls
        goToPage,
        changePageSize,
        nextPage,
        previousPage,
        refresh,
        
        // Pagination info
        hasNextPage: paginationInfo.hasNextPage,
        hasPreviousPage: paginationInfo.hasPreviousPage,
        startItem: paginationInfo.startItem,
        endItem: paginationInfo.endItem,
        
        // Manual setters
        setData,
        setLoading,
        setError
    };
}