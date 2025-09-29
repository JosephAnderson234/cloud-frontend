import { useState, useEffect } from 'react';
import type { UserFormProps, UserFormData } from '@interfaces/usuariosComponents';

export default function UserForm({ user, onSubmit, onCancel, loading }: UserFormProps) {
    const [formData, setFormData] = useState<UserFormData>({
        nombre: '',
        correo: '',
        contraseña: '',
        telefono: ''
    });

    const [errors, setErrors] = useState<Partial<UserFormData>>({});

    useEffect(() => {
        if (user) {
            setFormData({
                nombre: user.nombre,
                correo: user.correo,
                contraseña: '', // No mostrar la contraseña actual por seguridad
                telefono: user.telefono
            });
        }
    }, [user]);

    const validateForm = (): boolean => {
        const newErrors: Partial<UserFormData> = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        }

        if (!formData.correo.trim()) {
            newErrors.correo = 'El correo es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
            newErrors.correo = 'El correo no es válido';
        }

        if (!user && !formData.contraseña.trim()) {
            newErrors.contraseña = 'La contraseña es requerida';
        } else if (formData.contraseña && formData.contraseña.length < 6) {
            newErrors.contraseña = 'La contraseña debe tener al menos 6 caracteres';
        }

        if (!formData.telefono.trim()) {
            newErrors.telefono = 'El teléfono es requerido';
        } else if (!/^\+?[\d\s-()]+$/.test(formData.telefono)) {
            newErrors.telefono = 'El teléfono no es válido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            // Si es edición y no se cambió la contraseña, no la incluir
            if (user && !formData.contraseña.trim()) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { contraseña, ...dataWithoutPassword } = formData;
                onSubmit(dataWithoutPassword);
            } else {
                onSubmit(formData);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Limpiar error del campo cuando se modifica
        if (errors[name as keyof UserFormData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="border-b border-gray-200 pb-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                    {user ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                    {user ? 'Actualiza la información del usuario' : 'Completa los datos del nuevo usuario'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre */}
                    <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre completo <span className="text-red-500">*</span>
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
                            placeholder="Ingresa el nombre completo"
                        />
                        {errors.nombre && (
                            <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
                        )}
                    </div>

                    {/* Teléfono */}
                    <div>
                        <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                            Teléfono <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            id="telefono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                errors.telefono ? 'border-red-300 bg-red-50' : 'border-gray-300'
                            }`}
                            placeholder="+52 123 456 7890"
                        />
                        {errors.telefono && (
                            <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
                        )}
                    </div>
                </div>

                {/* Correo */}
                <div>
                    <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-2">
                        Correo electrónico <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        id="correo"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.correo ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="usuario@ejemplo.com"
                    />
                    {errors.correo && (
                        <p className="mt-1 text-sm text-red-600">{errors.correo}</p>
                    )}
                </div>

                {/* Contraseña */}
                <div>
                    <label htmlFor="contraseña" className="block text-sm font-medium text-gray-700 mb-2">
                        {user ? 'Nueva contraseña (opcional)' : 'Contraseña'} 
                        {!user && <span className="text-red-500"> *</span>}
                    </label>
                    <input
                        type="password"
                        id="contraseña"
                        name="contraseña"
                        value={formData.contraseña}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.contraseña ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder={user ? 'Deja en blanco para mantener la actual' : 'Mínimo 6 caracteres'}
                    />
                    {errors.contraseña && (
                        <p className="mt-1 text-sm text-red-600">{errors.contraseña}</p>
                    )}
                    {user && (
                        <p className="mt-1 text-sm text-gray-500">
                            Deja este campo vacío si no deseas cambiar la contraseña
                        </p>
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
                            user ? 'Actualizar Usuario' : 'Crear Usuario'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}