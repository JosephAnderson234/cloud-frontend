import type { LoginRequest, RegisterRequest, AuthResponse } from "@interfaces/authTypes";

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (credentials: LoginRequest) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    });
    if (!response.ok) {
        throw new Error('Error logging in');
    }
    return response.json() as Promise<AuthResponse>;
}

export const register = async (userData: RegisterRequest) => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    });
    if (!response.ok) {
        throw new Error('Error registering user');
    }
    return response.json() as Promise<AuthResponse>;
}
