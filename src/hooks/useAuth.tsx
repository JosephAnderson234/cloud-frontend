import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LoginRequest, RegisterRequest } from '@interfaces/authTypes';
import useAuthContext from './useAuthContext';

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { login: contextLogin, register: contextRegister, logout: contextLogout, session } = useAuthContext();

    const login = async (credentials: LoginRequest) => {
        setLoading(true);
        setError(null);
        try {
            await contextLogin(credentials);
            navigate('/', { replace: true });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData: RegisterRequest) => {
        setLoading(true);
        setError(null);
        try {
            await contextRegister(userData);
            navigate('/', { replace: true });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al registrar usuario';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        contextLogout();
    };

    return {
        loading,
        error,
        session,
        login,
        register,
        logout,
        clearError: () => setError(null),
        isAuthenticated: !!session
    };
};