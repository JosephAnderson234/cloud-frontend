export interface Producto {
    id_producto: number;
    nombre: string;
    descripcion: string;
    precio: number;
    categoria_id: number;
}

export interface Categoria {
    id_categoria: number;
    nombre_categoria: string;
    descripcion_categoria: string;
}