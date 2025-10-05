// DTO interfaces to match backend

// CategoriaDTO
export interface CategoriaDTO {
    idCategoria?: number;
    nombreCategoria: string;
    descripcionCategoria: string;
}

// ProductoRequestDTO (for creation/update)
export interface ProductoRequestDTO {
    nombre: string;
    descripcion: string;
    precio: number;
    idCategoria: number;
}

// ProductoResponseDTO (for responses)
export interface ProductoResponseDTO {
    idProducto?: number;
    nombre: string;
    descripcion: string;
    precio: number;
    categoria: CategoriaDTO;
}


// Form data types (for UI forms)
export interface ProductoFormData {
    nombre: string;
    descripcion: string;
    precio: number;
    idCategoria: number;
}

export interface CategoriaFormData {
    nombreCategoria: string;
    descripcionCategoria: string;
}

// Legacy aliases for backward compatibility
export type Categoria = CategoriaDTO;
export type Producto = ProductoResponseDTO;
export type ProductoWithCategory = ProductoResponseDTO;