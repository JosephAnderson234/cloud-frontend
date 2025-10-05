import { useState } from 'react';
import type { PedidoFiltersProps } from '@interfaces/pedidosComponents';

export default function PedidoFilters({ onFilterChange, loading = false }: PedidoFiltersProps) {
    const [filters, setFilters] = useState({
        estado: '' as '' | 'pendiente' | 'entregado' | 'cancelado',
        fechaDesde: '',
        fechaHasta: ''
    });

    const handleFilterChange = (key: keyof typeof filters, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        
        // Construir objeto de filtros para enviar
        const activeFilters: {
            estado?: 'pendiente' | 'entregado' | 'cancelado';
            fechaDesde?: string;
            fechaHasta?: string;
        } = {};

        if (newFilters.estado) {
            activeFilters.estado = newFilters.estado;
        }
        if (newFilters.fechaDesde) {
            activeFilters.fechaDesde = newFilters.fechaDesde;
        }
        if (newFilters.fechaHasta) {
            activeFilters.fechaHasta = newFilters.fechaHasta;
        }

        onFilterChange(activeFilters);
    };

    const clearFilters = () => {
        const clearedFilters = {
            estado: '' as const,
            fechaDesde: '',
            fechaHasta: ''
        };
        setFilters(clearedFilters);
        onFilterChange({});
    };

    const hasActiveFilters = filters.estado || filters.fechaDesde || filters.fechaHasta;

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Filtros</h3>
                {hasActiveFilters && (
                    <button
                        type="button"
                        onClick={clearFilters}
                        disabled={loading}
                        className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
                    >
                        Limpiar filtros
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Filtro por Estado */}
                <div>
                    <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">
                        Estado
                    </label>
                    <select
                        id="estado"
                        value={filters.estado}
                        onChange={(e) => handleFilterChange('estado', e.target.value)}
                        disabled={loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        <option value="">Todos los estados</option>
                        <option value="pendiente">Pendiente</option>
                        <option value="entregado">Entregado</option>
                        <option value="cancelado">Cancelado</option>
                    </select>
                </div>

                {/* Filtro por Fecha Desde */}
                <div>
                    <label htmlFor="fechaDesde" className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha desde
                    </label>
                    <input
                        type="date"
                        id="fechaDesde"
                        value={filters.fechaDesde}
                        onChange={(e) => handleFilterChange('fechaDesde', e.target.value)}
                        disabled={loading}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                </div>

                {/* Filtro por Fecha Hasta */}
                <div>
                    <label htmlFor="fechaHasta" className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha hasta
                    </label>
                    <input
                        type="date"
                        id="fechaHasta"
                        value={filters.fechaHasta}
                        onChange={(e) => handleFilterChange('fechaHasta', e.target.value)}
                        disabled={loading}
                        min={filters.fechaDesde || undefined}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                </div>
            </div>

            {/* Indicador de filtros activos */}
            {hasActiveFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Filtros activos:</span>
                        <div className="flex flex-wrap gap-2">
                            {filters.estado && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Estado: {filters.estado}
                                    <button
                                        type="button"
                                        onClick={() => handleFilterChange('estado', '')}
                                        className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:text-blue-600"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                            {filters.fechaDesde && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Desde: {new Date(filters.fechaDesde).toLocaleDateString('es-ES')}
                                    <button
                                        type="button"
                                        onClick={() => handleFilterChange('fechaDesde', '')}
                                        className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-green-400 hover:text-green-600"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                            {filters.fechaHasta && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    Hasta: {new Date(filters.fechaHasta).toLocaleDateString('es-ES')}
                                    <button
                                        type="button"
                                        onClick={() => handleFilterChange('fechaHasta', '')}
                                        className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-purple-400 hover:text-purple-600"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}