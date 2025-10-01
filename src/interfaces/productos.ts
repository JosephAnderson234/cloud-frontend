export interface Producto {
    id_producto: number;
    nombre: string;
    descripcion: string;
    precio: number;
    categoria_id: number;
    created_at?: string;
    updated_at?: string;
}

export interface Categoria {
    id_categoria: number;
    nombre_categoria: string;
    descripcion_categoria: string;
    created_at?: string;
    updated_at?: string;
}

// Extended interfaces with category details
export interface ProductoWithCategory extends Producto {
    categoria?: Categoria;
}

// Form data types
export type ProductoFormData = Omit<Producto, 'id_producto' | 'created_at' | 'updated_at'>;
export type CategoriaFormData = Omit<Categoria, 'id_categoria' | 'created_at' | 'updated_at'>;