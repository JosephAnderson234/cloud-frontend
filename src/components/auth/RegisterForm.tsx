import { useState } from 'react';
import type { RegisterRequest } from '@interfaces/authTypes';
import type { RegisterFormProps } from '@interfaces/authComponents';

export default function RegisterForm({ onSubmit, loading }: RegisterFormProps) {
    const [formData, setFormData] = useState<RegisterRequest>({
        nombre: '',
        correo: '',
        contraseña: '',
        telefono: ''
    });
    const [errors, setErrors] = useState<Partial<RegisterRequest>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<RegisterRequest> = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es requerido';
        } else if (formData.nombre.length < 2) {
            newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
        }

        if (!formData.correo.trim()) {
            newErrors.correo = 'El correo es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
            newErrors.correo = 'El correo no es válido';
        }

        if (!formData.contraseña.trim()) {
            newErrors.contraseña = 'La contraseña es requerida';
        } else if (formData.contraseña.length < 6) {
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
            onSubmit(formData);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Limpiar error del campo cuando se modifica
        if (errors[name as keyof RegisterRequest]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre */}
            <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre completo
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.nombre ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="Juan Pérez"
                        autoComplete="name"
                    />
                </div>
                {errors.nombre && (
                    <p className="mt-2 text-sm text-red-600">{errors.nombre}</p>
                )}
            </div>

            {/* Email */}
            <div>
                <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                    </div>
                    <input
                        type="email"
                        id="correo"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.correo ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="juan@ejemplo.com"
                        autoComplete="email"
                    />
                </div>
                {errors.correo && (
                    <p className="mt-2 text-sm text-red-600">{errors.correo}</p>
                )}
            </div>

            {/* Teléfono */}
            <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                    </div>
                    <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.telefono ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="+52 123 456 7890"
                        autoComplete="tel"
                    />
                </div>
                {errors.telefono && (
                    <p className="mt-2 text-sm text-red-600">{errors.telefono}</p>
                )}
            </div>

            {/* Password */}
            <div>
                <label htmlFor="contraseña" className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <input
                        type="password"
                        id="contraseña"
                        name="contraseña"
                        value={formData.contraseña}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.contraseña ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="••••••••"
                        autoComplete="new-password"
                    />
                </div>
                {errors.contraseña && (
                    <p className="mt-2 text-sm text-red-600">{errors.contraseña}</p>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
                {loading ? (
                    <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creando cuenta...
                    </div>
                ) : (
                    'Crear Cuenta'
                )}
            </button>
        </form>
    );
}