import { useState } from 'react';
import type { LoginRequest } from '@interfaces/authTypes';
import type { LoginFormProps } from '@interfaces/authComponents';

export default function LoginForm({ onSubmit, loading }: LoginFormProps) {
    const [formData, setFormData] = useState<LoginRequest>({
        correo: '',
        contraseña: ''
    });
    const [errors, setErrors] = useState<Partial<LoginRequest>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<LoginRequest> = {};

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
        if (errors[name as keyof LoginRequest]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
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
                        id="email"
                        name="correo"
                        value={formData.correo}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.correo ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="usuario@ejemplo.com"
                        autoComplete="correo"
                    />
                </div>
                {errors.correo && (
                    <p className="mt-2 text-sm text-red-600">{errors.correo}</p>
                )}
            </div>

            {/* Password */}
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
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
                        id="password"
                        name="contraseña"
                        value={formData.contraseña}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.contraseña ? 'border-red-300 bg-red-50' : 'border-gray-300'
                        }`}
                        placeholder="••••••••"
                        autoComplete="current-contraseña"
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
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
                {loading ? (
                    <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Iniciando sesión...
                    </div>
                ) : (
                    'Iniciar Sesión'
                )}
            </button>
        </form>
    );
}