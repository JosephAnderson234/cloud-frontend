import type { 
    ProductoResponseDTO, 
    ProductoRequestDTO, 
    CategoriaDTO, 
    CategoriaFormData
} from "@interfaces/productos";
import type { PaginatedResponse } from '@interfaces/Pagination';

// Base URL for products microservice (port 8082 as specified)
const API_URL = import.meta.env.VITE_API_URL + ":8002";

// ===== PRODUCTOS =====

export const getAllProducts = async (): Promise<ProductoResponseDTO[]> => {
    try {
        const response = await fetch(`${API_URL}/productos?page=0&size=50`);
        if (!response.ok) {
            throw new Error('Error fetching products');
        }
        const data = await response.json();
        
        // Si la respuesta es un objeto paginado, extraer el array contents
        if (data && typeof data === 'object' && Array.isArray(data.contents)) {
            return data.contents;
        }
        
        // Si es directamente un array, devolverlo tal como está
        if (Array.isArray(data)) {
            return data;
        }
        
        // Si no es ninguno de los casos anteriores, devolver array vacío
        console.warn('Respuesta inesperada del servicio de productos:', data);
        return [];
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

export const searchProducts = async (query: string = '', page: number = 0, size: number = 20): Promise<PaginatedResponse<ProductoResponseDTO>> => {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString()
        });
        
        if (query.trim()) {
            params.append('search', query.trim());
        }
        
        const response = await fetch(`${API_URL}/productos?${params.toString()}`);
        if (!response.ok) {
            throw new Error('Error searching products');
        }
        
        const data: PaginatedResponse<ProductoResponseDTO> = await response.json();
        return data;
    } catch (error) {
        console.error('Error searching products:', error);
        // Retornar respuesta vacía en caso de error
        return {
            contents: [],
            page: 0,
            size: size,
            totalElements: 0,
            totalPages: 0
        };
    }
}

export const getProductsForSelector = async (query: string = '', limit: number = 50): Promise<ProductoResponseDTO[]> => {
    try {
        const data = await searchProducts(query, 0, limit);
        return data.contents || [];
    } catch (error) {
        console.error('Error getting products for selector:', error);
        return [];
    }
}

export const getProductsPaginated = async (page: number = 1, size: number = 10): Promise<PaginatedResponse<ProductoResponseDTO>> => {
    const response = await fetch(`${API_URL}/productos?page=${page}&size=${size}`);
    if (!response.ok) {
        throw new Error('Error fetching paginated products');
    }
    return response.json() as Promise<PaginatedResponse<ProductoResponseDTO>>;
}

export const getAllProductsWithCategories = async (): Promise<ProductoResponseDTO[]> => {
    // Since ProductoResponseDTO already includes category, we just get all products
    return getAllProducts();
}

export const getProductById = async (id: number): Promise<ProductoResponseDTO> => {
    const response = await fetch(`${API_URL}/productos/${id}`);
    if (!response.ok) {
        throw new Error('Error fetching product');
    }
    return response.json() as Promise<ProductoResponseDTO>;
}

export const createProduct = async (producto: ProductoRequestDTO): Promise<ProductoResponseDTO> => {
    const response = await fetch(`${API_URL}/productos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(producto)
    });
    if (!response.ok) {
        throw new Error('Error creating product');
    }
    return response.json() as Promise<ProductoResponseDTO>;
}

export const updateProduct = async (id: number, producto: ProductoRequestDTO): Promise<ProductoResponseDTO> => {
    const response = await fetch(`${API_URL}/productos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(producto)
    });
    if (!response.ok) {
        throw new Error('Error updating product');
    }
    return response.json() as Promise<ProductoResponseDTO>;
}

export const deleteProduct = async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/productos/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Error deleting product');
    }
}

export const getProductsByCategory = async (categoriaId: number): Promise<ProductoResponseDTO[]> => {
    const response = await fetch(`${API_URL}/categorias/${categoriaId}/productos`);
    if (!response.ok) {
        throw new Error('Error fetching products by category');
    }
    return response.json() as Promise<ProductoResponseDTO[]>;
}

// ===== CATEGORÍAS =====

export const getAllCategories = async (): Promise<CategoriaDTO[]> => {
    const response = await fetch(`${API_URL}/categorias`);
    if (!response.ok) {
        throw new Error('Error fetching categories');
    }
    return response.json() as Promise<CategoriaDTO[]>;
}

export const searchCategories = async (query: string = '', page: number = 0, size: number = 20): Promise<PaginatedResponse<CategoriaDTO>> => {
    try {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString()
        });
        
        if (query.trim()) {
            params.append('search', query.trim());
        }
        
        const response = await fetch(`${API_URL}/categorias?${params.toString()}`);
        if (!response.ok) {
            throw new Error('Error searching categories');
        }
        
        const data: PaginatedResponse<CategoriaDTO> = await response.json();
        return data;
    } catch (error) {
        console.error('Error searching categories:', error);
        // Retornar respuesta vacía en caso de error
        return {
            contents: [],
            page: 0,
            size: size,
            totalElements: 0,
            totalPages: 0
        };
    }
}

export const getCategoriesForSelector = async (query: string = '', limit: number = 20): Promise<CategoriaDTO[]> => {
    try {
        const data = await searchCategories(query, 0, limit);
        return data.contents || [];
    } catch (error) {
        console.error('Error getting categories for selector:', error);
        return [];
    }
}

export const getCategoriesPaginated = async (page: number = 1, size: number = 10): Promise<PaginatedResponse<CategoriaDTO>> => {
    const response = await fetch(`${API_URL}/categorias?page=${page}&size=${size}`);
    if (!response.ok) {
        throw new Error('Error fetching paginated categories');
    }
    return response.json() as Promise<PaginatedResponse<CategoriaDTO>>;
}

export const getCategoryById = async (id: number): Promise<CategoriaDTO> => {
    const response = await fetch(`${API_URL}/categorias/${id}`);
    if (!response.ok) {
        throw new Error('Error fetching category');
    }
    return response.json() as Promise<CategoriaDTO>;
}

export const createCategory = async (categoria: CategoriaFormData): Promise<CategoriaDTO> => {
    const response = await fetch(`${API_URL}/categorias`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoria)
    });
    if (!response.ok) {
        throw new Error('Error creating category');
    }
    return response.json() as Promise<CategoriaDTO>;
}

export const updateCategory = async (id: number, categoria: CategoriaFormData): Promise<CategoriaDTO> => {
    const response = await fetch(`${API_URL}/categorias/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(categoria)
    });
    if (!response.ok) {
        throw new Error('Error updating category');
    }
    return response.json() as Promise<CategoriaDTO>;
}

export const deleteCategory = async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/categorias/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Error deleting category');
    }
}

// ===== HEALTH CHECK =====

export const healthCheck = async (): Promise<{ status: string }> => {
    const response = await fetch(`${API_URL}/health`);
    if (!response.ok) {
        throw new Error('Health check failed');
    }
    return response.json();
}

export const getAllProductsWithProgress = async (
    onProgress?: (loaded: number, total: number, currentPage: number, totalPages: number) => void
): Promise<ProductoResponseDTO[]> => {
    try {
        const allProducts: ProductoResponseDTO[] = [];
        let currentPage = 0;
        let totalPages = 1;
        let totalElements = 0;
        const pageSize = 100;
        
        do {
            const response = await fetch(`${API_URL}/productos?page=${currentPage}&size=${pageSize}`);
            if (!response.ok) {
                throw new Error(`Error fetching products page ${currentPage}`);
            }
            
            const data: PaginatedResponse<ProductoResponseDTO> = await response.json();
            
            if (data && Array.isArray(data.contents)) {
                allProducts.push(...data.contents);
                totalPages = data.totalPages || 1;
                totalElements = data.totalElements || allProducts.length;
                currentPage++;
                
                // Callback de progreso si se proporciona
                if (onProgress) {
                    onProgress(allProducts.length, totalElements, currentPage, totalPages);
                }
                
                console.log(`📦 Página ${currentPage}/${totalPages} - ${allProducts.length}/${totalElements} productos`);
            } else {
                console.error('Respuesta inesperada en página:', currentPage, data);
                break;
            }
            
            // Limite de seguridad
            if (currentPage > 100) {
                console.warn('⚠️ Deteniendo carga después de 100 páginas por seguridad');
                break;
            }
            
        } while (currentPage < totalPages);
        
        return allProducts;
        
    } catch (error) {
        console.error('Error fetching products with progress:', error);
        throw error;
    }
}

// ===== PRODUCTOS SERVICE OBJECT =====
const productosService = {
    // Productos
    getAllProducts,
    getProductsPaginated,
    getAllProductsWithCategories,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory,
    searchProducts,
    getProductsForSelector,
    
    // Categorías
    getAllCategories,
    getCategoriesPaginated,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    searchCategories,
    getCategoriesForSelector,
    
    // Health
    healthCheck
};

export default productosService;