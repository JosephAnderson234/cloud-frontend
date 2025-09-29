import type { Usuario } from "./usuarios";

export interface RegisterRequest {
    nombre: string;
    correo: string;
    contraseña: string;
    telefono: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    succes: boolean;
    message: string;
    usuario: Omit<Usuario, 'contraseña'>;
}