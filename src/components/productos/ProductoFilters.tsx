import type { ProductoFiltersProps } from '@interfaces/productosComponents';

export default function ProductoFilters({
    categorias,
    selectedCategoria,
    onCategoriaChange,
    searchTerm,
    onSearchChange,
    priceRange,
    onPriceRangeChange,
    onReset
}: ProductoFiltersProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Filtros</h3>
                <button
                    onClick={onReset}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                    Limpiar filtros
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Búsqueda */}
                <div>
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                        Buscar producto
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            id="search"
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            placeholder="Nombre del producto..."
                        />
                    </div>
                </div>

                {/* Categoría */}
                <div>
                    <label htmlFor="categoria-filter" className="block text-sm font-medium text-gray-700 mb-2">
                        Categoría
                    </label>
                    <select
                        id="categoria-filter"
                        value={selectedCategoria || ''}
                        onChange={(e) => onCategoriaChange(e.target.value ? Number(e.target.value) : null)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                        <option value="">Todas las categorías</option>
                        {categorias.map((categoria) => (
                            <option key={categoria.id_categoria} value={categoria.id_categoria}>
                                {categoria.nombre_categoria}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Precio mínimo */}
                <div>
                    <label htmlFor="precio-min" className="block text-sm font-medium text-gray-700 mb-2">
                        Precio mínimo
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 text-sm">$</span>
                        </div>
                        <input
                            type="number"
                            id="precio-min"
                            min="0"
                            step="0.01"
                            value={priceRange.min}
                            onChange={(e) => onPriceRangeChange({ ...priceRange, min: Number(e.target.value) })}
                            className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                {/* Precio máximo */}
                <div>
                    <label htmlFor="precio-max" className="block text-sm font-medium text-gray-700 mb-2">
                        Precio máximo
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 text-sm">$</span>
                        </div>
                        <input
                            type="number"
                            id="precio-max"
                            min="0"
                            step="0.01"
                            value={priceRange.max}
                            onChange={(e) => onPriceRangeChange({ ...priceRange, max: Number(e.target.value) })}
                            className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            placeholder="Sin límite"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}