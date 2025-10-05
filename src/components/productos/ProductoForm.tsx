import { useState, useEffect } from 'react';
import type { ProductoFormProps, ProductoFormData } from '@interfaces/productosComponents';
import CategoriaSelector from './CategoriaSelector';

export default function ProductoForm({ producto, onSubmit, onCancel, loading }: ProductoFormProps) {
    const [formData, setFormData] = useState<ProductoFormData>({
        nombre: '',
        descripcion: '',
        precio: 0,
        idCategoria: 0
    });

    const [errors, setErrors] = useState<{
        nombre?: string;
        descripcion?: string;
        precio?: string;
        categoria_id?: string;
    }>({});

    useEffect(() => {
        if (producto) {
            setFormData({
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                precio: producto.precio,
                idCategoria: producto.categoria.idCategoria || 0
            });
        }
    }, [producto]);

    const validateForm = (): boolean => {
        const newErrors: typeof errors = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        } else if (formData.nombre.length < 2) {
            newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
        }

        if (!formData.descripcion.trim()) {
            newErrors.descripcion = 'La descripción es requerida';
        } else if (formData.descripcion.length < 10) {
            newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
        }

        if (formData.precio <= 0) {
            newErrors.precio = 'El precio debe ser mayor a 0';
        }

        if (!formData.idCategoria || formData.idCategoria === 0) {
            newErrors.categoria_id = 'Debe seleccionar una categoría';
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
        setFormData((prev: ProductoFormData) => ({ 
            ...prev, 
            [name]: name === 'precio' ? parseFloat(value) || 0 : value 
        }));
        
        // Limpiar error del campo cuando se modifica
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleCategoriaChange = (categoriaId: number) => {
        setFormData((prev: ProductoFormData) => ({ ...prev, idCategoria: categoriaId }));
        if (errors.categoria_id) {
            setErrors(prev => ({ ...prev, categoria_id: undefined }));
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                    {producto ? 'Editar Producto' : 'Crear Nuevo Producto'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                    {producto ? 'Actualiza la información del producto' : 'Completa los datos del nuevo producto'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Nombre */}
                    <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre del Producto <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                errors.nombre ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="Nombre del producto"
                        />
                        {errors.nombre && (
                            <p className="mt-2 text-sm text-red-600">{errors.nombre}</p>
                        )}
                    </div>

                    {/* Precio */}
                    <div>
                        <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-2">
                            Precio <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                                type="number"
                                id="precio"
                                name="precio"
                                min="0"
                                step="0.01"
                                value={formData.precio}
                                onChange={handleChange}
                                className={`w-full pl-7 pr-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                    errors.precio ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                                placeholder="0.00"
                            />
                        </div>
                        {errors.precio && (
                            <p className="mt-2 text-sm text-red-600">{errors.precio}</p>
                        )}
                    </div>
                </div>

                {/* Categoría */}
                <div>
                    <CategoriaSelector
                        selectedCategoriaId={formData.idCategoria}
                        onCategoriaChange={handleCategoriaChange}
                        required={true}
                    />
                    {errors.categoria_id && (
                        <p className="mt-2 text-sm text-red-600">{errors.categoria_id}</p>
                    )}
                </div>

                {/* Descripción */}
                <div>
                    <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        id="descripcion"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        rows={4}
                        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.descripcion ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Descripción detallada del producto..."
                    />
                    {errors.descripcion && (
                        <p className="mt-2 text-sm text-red-600">{errors.descripcion}</p>
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
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                            producto ? 'Actualizar Producto' : 'Crear Producto'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}