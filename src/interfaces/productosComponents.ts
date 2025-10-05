import type { ProductoResponseDTO, CategoriaDTO, ProductoFormData, CategoriaFormData } from "./productos";

// Export form data types for external use
export type { ProductoFormData, CategoriaFormData } from "./productos";

// Table Props
export interface ProductoTableProps {
    productos: ProductoResponseDTO[];
    onEdit: (producto: ProductoResponseDTO) => void;
    onDelete: (id: number) => void;
    onViewCategory: (categoriaId: number) => void;
    loading: boolean;
}

export interface CategoriaTableProps {
    categorias: CategoriaDTO[];
    onEdit: (categoria: CategoriaDTO) => void;
    onDelete: (id: number) => void;
    loading: boolean;
}

// Form Props
export interface ProductoFormProps {
    producto?: ProductoResponseDTO;
    onSubmit: (data: ProductoFormData) => void;
    onCancel: () => void;
    loading: boolean;
}

export interface CategoriaFormProps {
    categoria?: CategoriaDTO;
    onSubmit: (data: CategoriaFormData) => void;
    onCancel: () => void;
    loading: boolean;
}

// Selector Props
export interface CategoriaSelectorProps {
    selectedCategoriaId: number | null;
    onCategoriaChange: (categoriaId: number) => void;
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
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onReset: () => void;
}

// Stats Props
export interface ProductoStatsProps {
    totalProductos: number;
    totalCategorias: number;
    averagePrice: number;
    loading: boolean;
}