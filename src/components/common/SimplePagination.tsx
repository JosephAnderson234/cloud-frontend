interface SimplePaginationProps {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    startItem: number;
    endItem: number;
    onPageChange: (page: number) => void;
    loading?: boolean;
    className?: string;
}

export default function SimplePagination({
    currentPage,
    totalPages,
    totalElements,
    startItem,
    endItem,
    onPageChange,
    loading = false,
    className = ''
}: SimplePaginationProps) {
    
    if (totalElements === 0) {
        return null;
    }

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages && page !== currentPage && !loading) {
            onPageChange(page);
        }
    };

    // Generate visible page numbers
    const getVisiblePages = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                // Show first 3 pages
                for (let i = 1; i <= 3; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                // Show last 3 pages
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 2; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                // Show current page with neighbors
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        
        return pages;
    };

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 ${className}`}>
            {/* Info */}
            <div className="text-sm text-gray-600">
                Mostrando {startItem} a {endItem} de {totalElements} resultados
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-2">
                {/* Previous */}
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className="px-3 py-2 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                    Anterior
                </button>

                {/* Page numbers */}
                <div className="flex space-x-1">
                    {getVisiblePages().map((page, index) => (
                        <div key={index}>
                            {page === '...' ? (
                                <span className="px-3 py-2 text-sm text-gray-500">...</span>
                            ) : (
                                <button
                                    onClick={() => handlePageChange(page as number)}
                                    disabled={loading}
                                    className={`px-3 py-2 text-sm border rounded-md ${
                                        page === currentPage
                                            ? 'bg-blue-600 text-white border-blue-600'
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {page}
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Next */}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                    className="px-3 py-2 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}