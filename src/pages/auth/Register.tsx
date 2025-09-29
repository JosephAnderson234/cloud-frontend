import { useAuth } from '@hooks/useAuth';
import AuthLayout from '@components/auth/AuthLayout';
import RegisterForm from '@components/auth/RegisterForm';
import Notification from '@components/Notification';
import type { RegisterRequest } from '@interfaces/authTypes';
import { useState } from 'react';

export default function Register() {
    const { register, loading, error, clearError } = useAuth();
    const [notification, setNotification] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error' | 'info';
    }>({ show: false, message: '', type: 'info' });

    const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
        setNotification({ show: true, message, type });
    };

    const hideNotification = () => {
        setNotification(prev => ({ ...prev, show: false }));
        clearError();
    };

    const handleRegister = async (userData: RegisterRequest) => {
        try {
            await register(userData);
            showNotification('¡Cuenta creada exitosamente! Bienvenido', 'success');
        } catch (error) {
            showNotification(error instanceof Error ? error.message : 'Error al crear la cuenta', 'error');
        }
    };

    return (
        <>
            <AuthLayout
                title="Crear Cuenta"
                subtitle="Únete a nosotros y comienza tu experiencia"
                linkText="¿Ya tienes cuenta?"
                linkHref="/auth/login"
                linkLabel="Inicia sesión aquí"
            >
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-red-600">{error}</p>
                            <button
                                onClick={clearError}
                                className="text-red-400 hover:text-red-600"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}
                
                <RegisterForm onSubmit={handleRegister} loading={loading} />
            </AuthLayout>

            <Notification
                message={notification.message}
                visible={notification.show}
                onClose={hideNotification}
                status={notification.type}
            />
        </>
    );
}