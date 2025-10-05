export interface PaginatedResponse<T> {
    contents: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}