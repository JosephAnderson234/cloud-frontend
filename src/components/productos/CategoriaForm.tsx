import { useState, useEffect } from 'react';
import type { CategoriaFormProps, CategoriaFormData } from '@interfaces/productosComponents';

export default function CategoriaForm({ categoria, onSubmit, onCancel, loading }: CategoriaFormProps) {
    const [formData, setFormData] = useState<CategoriaFormData>({
        nombreCategoria: '',
        descripcionCategoria: ''
    });

    const [errors, setErrors] = useState<{
        nombre_categoria?: string;
        descripcion_categoria?: string;
    }>({});

    useEffect(() => {
        if (categoria) {
            setFormData({
                nombreCategoria: categoria.nombreCategoria,
                descripcionCategoria: categoria.descripcionCategoria
            });
        }
    }, [categoria]);

    const validateForm = (): boolean => {
        const newErrors: typeof errors = {};

        if (!formData.nombreCategoria.trim()) {
            newErrors.nombre_categoria = 'El nombre es requerido';
        } else if (formData.nombreCategoria.length < 2) {
            newErrors.nombre_categoria = 'El nombre debe tener al menos 2 caracteres';
        }

        if (!formData.descripcionCategoria.trim()) {
            newErrors.descripcion_categoria = 'La descripción es requerida';
        } else if (formData.descripcionCategoria.length < 10) {
            newErrors.descripcion_categoria = 'La descripción debe tener al menos 10 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: CategoriaFormData) => ({ ...prev, [name]: value }));
        
        // Limpiar error del campo cuando se modifica
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                    {categoria ? 'Editar Categoría' : 'Crear Nueva Categoría'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                    {categoria ? 'Actualiza la información de la categoría' : 'Completa los datos de la nueva categoría'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nombre */}
                <div>
                    <label htmlFor="nombreCategoria" className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de la Categoría <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="nombreCategoria"
                        name="nombreCategoria"
                        value={formData.nombreCategoria}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.nombre_categoria ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Nombre de la categoría"
                    />
                    {errors.nombre_categoria && (
                        <p className="mt-2 text-sm text-red-600">{errors.nombre_categoria}</p>
                    )}
                </div>

                {/* Descripción */}
                <div>
                    <label htmlFor="descripcionCategoria" className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="descripcionCategoria"
                        name="descripcionCategoria"
                        value={formData.descripcionCategoria}
                        onChange={handleChange}
                        rows={4}
                        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.descripcion_categoria ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Descripción detallada de la categoría..."
                    />
                    {errors.descripcion_categoria && (
                        <p className="mt-2 text-sm text-red-600">{errors.descripcion_categoria}</p>
                    )}
                </div>

                {/* Botones */}
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? (
                            <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Guardando...
                            </div>
                        ) : (
                            categoria ? 'Actualizar Categoría' : 'Crear Categoría'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}