import type { Producto, Categoria } from "@interfaces/productos";

const API_URL = import.meta.env.VITE_API_URL;


export const getAllProducts = async () => {
    const response = await fetch(`${API_URL}/productos`);
    if (!response.ok) {
        throw new Error('Error fetching products');
    }
    return response.json() as Promise<Producto[]>;
}

export const getProductById = async (id: number) => {
    const response = await fetch(`${API_URL}/productos/${id}`);
    if (!response.ok) {
        throw new Error('Error fetching product');
    }
    return response.json() as Promise<Producto>;
}

export const createProduct = async (producto: Omit<Producto, 'id_producto'>) => {
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
    return response.json() as Promise<Producto>;
}

export const updateProduct = async (id: number, producto: Partial<Omit<Producto, 'id_producto'>>) => {
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
    return response.json() as Promise<Producto>;
}

export const deleteProduct = async (id: number) => {
    const response = await fetch(`${API_URL}/productos/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Error deleting product');
    }
    return response.json();
}

// ===== CATEGORÍAS =====

export const getAllCategories = async () => {
    const response = await fetch(`${API_URL}/categorias`);
    if (!response.ok) {
        throw new Error('Error fetching categories');
    }
    return response.json() as Promise<Categoria[]>;
}

export const getCategoryById = async (id: number) => {
    const response = await fetch(`${API_URL}/categorias/${id}`);
    if (!response.ok) {
        throw new Error('Error fetching category');
    }
    return response.json() as Promise<Categoria>;
}

export const createCategory = async (categoria: Omit<Categoria, 'id_categoria'>) => {
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
    return response.json() as Promise<Categoria>;
}

export const updateCategory = async (id: number, categoria: Partial<Omit<Categoria, 'id_categoria'>>) => {
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
    return response.json() as Promise<Categoria>;
}

export const deleteCategory = async (id: number) => {
    const response = await fetch(`${API_URL}/categorias/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Error deleting category');
    }
    return response.json();
}