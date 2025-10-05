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
    const response = await fetch(`${API_URL}/productos`);
    if (!response.ok) {
        throw new Error('Error fetching products');
    }
    return response.json() as Promise<ProductoResponseDTO[]>;
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
    
    // Categorías
    getAllCategories,
    getCategoriesPaginated,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    
    // Health
    healthCheck
};

export default productosService;