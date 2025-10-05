import type { Usuario } from "./usuarios";

export interface RegisterRequest {
    nombre: string;
    correo: string;
    contraseña: string;
    telefono: string;
}

export interface LoginRequest {
    correo: string;
    contraseña: string;
}

export interface AuthResponse {
    succes: boolean;
    message: string;
    usuario: Omit<Usuario, 'contraseña'>;
}

export interface AuthResponseOficial {
    id_usuario: number;
    nombre: string;
    correo: string;
    telefono: string;
}