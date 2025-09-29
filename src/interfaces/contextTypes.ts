import type { LoginRequest, RegisterRequest } from "./authTypes";
import type { Usuario } from "./usuarios";

export interface AuthContextType {
    register: (SignupRequest: RegisterRequest) => Promise<void>;
	login: (loginRequest: LoginRequest) => Promise<void>;
	logout: () => void;
	session?: Omit<Usuario, 'contraseña'> | null;
	isLoggingOut: boolean;
	setIsLoggingOut: (value: boolean) => void;
}

export interface NotificationData {
    message: string;
    type?: "success" | "error" | "info";
    duration?: number; 
}

export interface NotificationContextProps {
    showNotification: (data: NotificationData) => void;
    hideNotification: () => void;
}