import type { LoginRequest, RegisterRequest, AuthResponse, AuthResponseOficial } from "@interfaces/authTypes";

const API_URL = import.meta.env.VITE_API_URL + ":8001";
//const API_URL = "http://localhost:5000";

export const login = async (credentials: LoginRequest) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    });
    if (!response.ok) {
        throw new Error('Error logging in');
    }
    return response.json() as Promise<AuthResponseOficial>;
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
