import type { Producto, Categoria, ProductoFormData, CategoriaFormData, ProductoWithCategory } from "./productos";

// Export form data types for external use
export type { ProductoFormData, CategoriaFormData } from "./productos";

// Table Props
export interface ProductoTableProps {
    productos: ProductoWithCategory[];
    onEdit: (producto: Producto) => void;
    onDelete: (id: number) => void;
    onViewCategory: (categoriaId: number) => void;
    loading: boolean;
}

export interface CategoriaTableProps {
    categorias: Categoria[];
    onEdit: (categoria: Categoria) => void;
    onDelete: (id: number) => void;
    loading: boolean;
}

// Form Props
export interface ProductoFormProps {
    producto?: Producto;
    onSubmit: (data: ProductoFormData | Partial<ProductoFormData>) => void;
    onCancel: () => void;
    loading: boolean;
}

export interface CategoriaFormProps {
    categoria?: Categoria;
    onSubmit: (data: CategoriaFormData | Partial<CategoriaFormData>) => void;
    onCancel: () => void;
    loading: boolean;
}

// Selector Props
export interface CategoriaSelectorProps {
    categorias: Categoria[];
    selectedCategoriaId: number | null;
    onCategoriaChange: (categoriaId: number) => void;
    loading: boolean;
    required?: boolean;
}

// Modal Props
export interface CategoriaModalProps {
    isOpen: boolean;
    onClose: () => void;
    categoriaId: number;
    categoriaNombre: string;
}

// Filter Props
export interface ProductoFiltersProps {
    categorias: Categoria[];
    selectedCategoria: number | null;
    onCategoriaChange: (categoriaId: number | null) => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    priceRange: { min: number; max: number };
    onPriceRangeChange: (range: { min: number; max: number }) => void;
    onReset: () => void;
}

// Stats Props
export interface ProductoStatsProps {
    totalProductos: number;
    totalCategorias: number;
    averagePrice: number;
    loading: boolean;
}