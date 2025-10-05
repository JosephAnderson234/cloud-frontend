import { useMemo } from 'react';
import type { PaginationProps, PaginationInfo } from '@interfaces/paginationComponents';
import { PAGE_SIZE_OPTIONS } from '@interfaces/paginationComponents';

export default function Pagination({
    currentPage,
    totalPages,
    totalElements,
    pageSize,
    onPageChange,
    onPageSizeChange,
    loading = false,
    showPageSizeSelector = true,
    showInfo = true,
    className = ''
}: PaginationProps) {
    
    // Calculate pagination info
    const paginationInfo: PaginationInfo = useMemo(() => {
        const startItem = totalElements === 0 ? 0 : (currentPage - 1) * pageSize + 1;
        const endItem = Math.min(currentPage * pageSize, totalElements);
        
        return {
            currentPage,
            totalPages,
            totalElements,
            pageSize,
            startItem,
            endItem
        };
    }, [currentPage, totalPages, totalElements, pageSize]);

    // Generate page numbers to show
    const pageNumbers = useMemo(() => {
        const pages: (number | string)[] = [];
        const maxVisiblePages = 7;
        
        if (totalPages <= maxVisiblePages) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);
            
            if (currentPage > 4) {
                pages.push('...');
            }
            
            // Show pages around current page
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            
            for (let i = start; i <= end; i++) {
                if (i !== 1 && i !== totalPages) {
                    pages.push(i);
                }
            }
            
            if (currentPage < totalPages - 3) {
                pages.push('...');
            }
            
            // Always show last page
            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }
        
        return pages;
    }, [currentPage, totalPages]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages && page !== currentPage && !loading) {
            onPageChange(page);
        }
    };

    const handlePageSizeChange = (newSize: number) => {
        if (onPageSizeChange && newSize !== pageSize && !loading) {
            onPageSizeChange(newSize);
        }
    };

    if (totalElements === 0) {
        return null;
    }

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
            {/* Page size selector */}
            {showPageSizeSelector && onPageSizeChange && (
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700">Mostrar:</span>
                    <select
                        value={pageSize}
                        onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                        disabled={loading}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        {PAGE_SIZE_OPTIONS.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                    <span className="text-sm text-gray-700">por página</span>
                </div>
            )}

            {/* Pagination info */}
            {showInfo && (
                <div className="text-sm text-gray-700">
                    Mostrando {paginationInfo.startItem} a {paginationInfo.endItem} de {totalElements} resultados
                </div>
            )}

            {/* Pagination controls */}
            <div className="flex items-center space-x-1">
                {/* Previous button */}
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                    aria-label="Página anterior"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* Page numbers */}
                {pageNumbers.map((page, index) => (
                    <div key={index}>
                        {page === '...' ? (
                            <span className="px-3 py-2 text-sm text-gray-500">...</span>
                        ) : (
                            <button
                                onClick={() => handlePageChange(page as number)}
                                disabled={loading}
                                className={`px-3 py-2 text-sm font-medium border rounded-md transition-colors ${
                                    page === currentPage
                                        ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
                                        : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50 hover:text-gray-900'
                                } disabled:cursor-not-allowed`}
                            >
                                {page}
                            </button>
                        )}
                    </div>
                ))}

                {/* Next button */}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                    aria-label="Página siguiente"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}