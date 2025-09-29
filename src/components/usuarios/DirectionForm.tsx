import { useState, useEffect } from 'react';
import type { DirectionFormProps, DirectionFormData } from '@interfaces/usuariosComponents';

export default function DirectionForm({ direction, userId, onSubmit, onCancel, loading }: DirectionFormProps) {
    const [formData, setFormData] = useState<DirectionFormData>({
        id_usuario: userId,
        direccion: '',
        ciudad: '',
        codigo_postal: ''
    });

    const [errors, setErrors] = useState<Partial<DirectionFormData>>({});

    useEffect(() => {
        if (direction) {
            setFormData({
                id_usuario: direction.id_usuario,
                direccion: direction.direccion,
                ciudad: direction.ciudad,
                codigo_postal: direction.codigo_postal
            });
        } else {
            setFormData({
                id_usuario: userId,
                direccion: '',
                ciudad: '',
                codigo_postal: ''
            });
        }
    }, [direction, userId]);

    const validateForm = (): boolean => {
        const newErrors: Partial<DirectionFormData> = {};

        if (!formData.direccion.trim()) {
            newErrors.direccion = 'La dirección es requerida';
        }

        if (!formData.ciudad.trim()) {
            newErrors.ciudad = 'La ciudad es requerida';
        }

        if (!formData.codigo_postal.trim()) {
            newErrors.codigo_postal = 'El código postal es requerido';
        } else if (!/^\d{5}$/.test(formData.codigo_postal.trim())) {
            newErrors.codigo_postal = 'El código postal debe tener 5 dígitos';
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Limpiar error del campo cuando se modifica
        if (errors[name as keyof DirectionFormData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
                <h4 className="text-md font-semibold text-gray-900">
                    {direction ? 'Editar Dirección' : 'Nueva Dirección'}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                    {direction ? 'Actualiza la información de la dirección' : 'Completa los datos de la nueva dirección'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Dirección */}
                <div>
                    <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-2">
                        Dirección <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="direccion"
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.direccion ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Calle, número, colonia..."
                    />
                    {errors.direccion && (
                        <p className="mt-1 text-sm text-red-600">{errors.direccion}</p>
                    )}
                </div>

                {/* Ciudad y Código Postal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="ciudad" className="block text-sm font-medium text-gray-700 mb-2">
                            Ciudad <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="ciudad"
                            name="ciudad"
                            value={formData.ciudad}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                errors.ciudad ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="Ciudad"
                        />
                        {errors.ciudad && (
                            <p className="mt-1 text-sm text-red-600">{errors.ciudad}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="codigo_postal" className="block text-sm font-medium text-gray-700 mb-2">
                            Código Postal <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="codigo_postal"
                            name="codigo_postal"
                            value={formData.codigo_postal}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                errors.codigo_postal ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="12345"
                            maxLength={5}
                        />
                        {errors.codigo_postal && (
                            <p className="mt-1 text-sm text-red-600">{errors.codigo_postal}</p>
                        )}
                    </div>
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
                            direction ? 'Actualizar Dirección' : 'Crear Dirección'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}