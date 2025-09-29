import { useAuth } from '@hooks/useAuth';
import AuthLayout from '@components/auth/AuthLayout';
import LoginForm from '@components/auth/LoginForm';
import Notification from '@components/Notification';
import type { LoginRequest } from '@interfaces/authTypes';
import { useState } from 'react';

export default function Login() {
    const { login, loading, error, clearError } = useAuth();
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

    const handleLogin = async (credentials: LoginRequest) => {
        try {
            await login(credentials);
            showNotification('¡Bienvenido! Sesión iniciada correctamente', 'success');
        } catch (error) {
            showNotification(error instanceof Error ? error.message : 'Error al iniciar sesión', 'error');
        }
    };

    return (
        <>
            <AuthLayout
                title="Iniciar Sesión"
                subtitle="Accede a tu cuenta para continuar"
                linkText="¿No tienes cuenta?"
                linkHref="/auth/register"
                linkLabel="Regístrate aquí"
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
                
                <LoginForm onSubmit={handleLogin} loading={loading} />
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