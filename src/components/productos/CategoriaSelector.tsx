import { useState, useCallback, useEffect } from 'react';
import type { CategoriaDTO } from '@interfaces/productos';
import { searchCategories } from '../../services/productos';

interface CategoriaSelectorProps {
    selectedCategoriaId: number | null;
    onCategoriaChange: (categoriaId: number) => void;
    required?: boolean;
}

export default function CategoriaSelector({ 
    selectedCategoriaId, 
    onCategoriaChange, 
    required = false 
}: CategoriaSelectorProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<CategoriaDTO[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoriaDTO | null>(null);

    // Debounced search function
    const debouncedSearch = useCallback(
        async (term: string) => {
            if (!term.trim()) {
                setSearchResults([]);
                setShowDropdown(false);
                return;
            }

            setIsSearching(true);
            setShowDropdown(true);

            try {
                const results = await searchCategories(term, 0, 10); // Limitamos a 10 resultados
                // searchCategories devuelve PaginatedResponse, necesitamos contents
                setSearchResults(Array.isArray(results.contents) ? results.contents : []);
            } catch (error) {
                console.error('Error searching categories:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        },
        []
    );

    // Effect for debouncing search
    useEffect(() => {
        const timer = setTimeout(() => {
            debouncedSearch(searchTerm);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, debouncedSearch]);

    // Effect para manejar categoría preseleccionada
    useEffect(() => {
        if (selectedCategoriaId && !selectedCategory) {
            // Si hay una categoría preseleccionada pero no tenemos los datos, 
            // podríamos hacer una búsqueda o simplemente mostrar el ID
            setSearchTerm(`Categoría ID: ${selectedCategoriaId}`);
        }
    }, [selectedCategoriaId, selectedCategory]);

    const selectCategory = (categoria: CategoriaDTO) => {
        setSelectedCategory(categoria);
        setSearchTerm(categoria.nombreCategoria || '');
        setShowDropdown(false);
        onCategoriaChange(categoria.idCategoria || 0);
    };

    const clearSelection = () => {
        setSelectedCategory(null);
        setSearchTerm('');
        setShowDropdown(false);
        onCategoriaChange(0);
    };

    return (
        <div>
            <label htmlFor="categoria-search" className="block text-sm font-medium text-gray-700 mb-2">
                Categoría {required && <span className="text-red-500">*</span>}
            </label>
            
            <div className="relative">
                <div className="relative">
                    <input
                        type="text"
                        id="categoria-search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Escribe para buscar categorías..."
                        className={`w-full px-3 py-2 pr-10 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            selectedCategory ? 'border-green-300 bg-green-50' : 'border-gray-300'
                        }`}
                    />
                    
                    {/* Loading spinner o clear button */}
                    <div className="absolute right-3 top-2.5">
                        {isSearching ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        ) : selectedCategory ? (
                            <button
                                type="button"
                                onClick={clearSelection}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        ) : (
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        )}
                    </div>
                </div>
                
                {/* Search Results Dropdown */}
                {showDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {searchResults.length > 0 ? (
                            searchResults.map((categoria) => (
                                <button
                                    key={categoria.idCategoria}
                                    type="button"
                                    onClick={() => selectCategory(categoria)}
                                    className="w-full px-3 py-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:bg-blue-50 focus:outline-none"
                                >
                                    <div className="font-medium text-gray-900">{categoria.nombreCategoria}</div>
                                    {categoria.descripcionCategoria && (
                                        <div className="text-sm text-gray-600 truncate">{categoria.descripcionCategoria}</div>
                                    )}
                                </button>
                            ))
                        ) : searchTerm.trim() && !isSearching ? (
                            <div className="px-3 py-2 text-gray-500 text-sm">
                                No se encontraron categorías
                            </div>
                        ) : null}
                    </div>
                )}
                
                {/* Selected category indicator */}
                {selectedCategory && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm font-medium text-green-800">
                                    ✓ {selectedCategory.nombreCategoria}
                                </div>
                                {selectedCategory.descripcionCategoria && (
                                    <div className="text-xs text-green-600">
                                        {selectedCategory.descripcionCategoria}
                                    </div>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={clearSelection}
                                className="text-green-600 hover:text-green-800 text-sm font-medium"
                            >
                                Cambiar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}