import type { Producto, Categoria, ProductoFormData, CategoriaFormData, ProductoWithCategory } from "@interfaces/productos";

const API_URL = import.meta.env.VITE_API_URL;

// ===== PRODUCTOS =====

export const getAllProducts = async (): Promise<Producto[]> => {
    const response = await fetch(`${API_URL}/productos`);
    if (!response.ok) {
        throw new Error('Error fetching products');
    }
    return response.json() as Promise<Producto[]>;
}

export const getAllProductsWithCategories = async (): Promise<ProductoWithCategory[]> => {
    try {
        const [productos, categorias] = await Promise.all([
            getAllProducts(),
            getAllCategories()
        ]);
        
        return productos.map(producto => ({
            ...producto,
            categoria: categorias.find(cat => cat.id_categoria === producto.categoria_id)
        }));
    } catch {
        throw new Error('Error fetching products with categories');
    }
}

export const getProductById = async (id: number): Promise<Producto> => {
    const response = await fetch(`${API_URL}/productos/${id}`);
    if (!response.ok) {
        throw new Error('Error fetching product');
    }
    return response.json() as Promise<Producto>;
}

export const createProduct = async (producto: ProductoFormData): Promise<Producto> => {
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

export const updateProduct = async (id: number, producto: Partial<ProductoFormData>): Promise<Producto> => {
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

export const deleteProduct = async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/productos/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Error deleting product');
    }
    return response.json();
}

export const getProductsByCategory = async (categoriaId: number): Promise<Producto[]> => {
    const response = await fetch(`${API_URL}/productos?categoria_id=${categoriaId}`);
    if (!response.ok) {
        throw new Error('Error fetching products by category');
    }
    return response.json() as Promise<Producto[]>;
}

// ===== CATEGORÍAS =====

export const getAllCategories = async (): Promise<Categoria[]> => {
    const response = await fetch(`${API_URL}/categorias`);
    if (!response.ok) {
        throw new Error('Error fetching categories');
    }
    return response.json() as Promise<Categoria[]>;
}

export const getCategoryById = async (id: number): Promise<Categoria> => {
    const response = await fetch(`${API_URL}/categorias/${id}`);
    if (!response.ok) {
        throw new Error('Error fetching category');
    }
    return response.json() as Promise<Categoria>;
}

export const createCategory = async (categoria: CategoriaFormData): Promise<Categoria> => {
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

export const updateCategory = async (id: number, categoria: Partial<CategoriaFormData>): Promise<Categoria> => {
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

export const deleteCategory = async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/categorias/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Error deleting category');
    }
    return response.json();
}