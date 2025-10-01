import type { CategoriaSelectorProps } from '@interfaces/productosComponents';

export default function CategoriaSelector({ 
    categorias, 
    selectedCategoriaId, 
    onCategoriaChange, 
    loading,
    required = false 
}: CategoriaSelectorProps) {
    return (
        <div>
            <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">
                Categoría {required && <span className="text-red-500">*</span>}
            </label>
            <select
                id="categoria"
                value={selectedCategoriaId || ''}
                onChange={(e) => onCategoriaChange(Number(e.target.value))}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
                <option value="">Selecciona una categoría</option>
                {categorias.map((categoria) => (
                    <option key={categoria.id_categoria} value={categoria.id_categoria}>
                        {categoria.nombre_categoria}
                    </option>
                ))}
            </select>
        </div>
    );
}