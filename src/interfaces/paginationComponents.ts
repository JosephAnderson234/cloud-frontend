// Pagination component interfaces
export interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (size: number) => void;
    loading?: boolean;
    showPageSizeSelector?: boolean;
    showInfo?: boolean;
    className?: string;
}

export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
    startItem: number;
    endItem: number;
}

// Page size options
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100] as const;
export type PageSize = typeof PAGE_SIZE_OPTIONS[number];