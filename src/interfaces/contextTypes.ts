import type { LoginRequest, RegisterRequest } from "./authTypes";

export interface AuthContextType {
    register: (SignupRequest: RegisterRequest) => Promise<void>;
	login: (loginRequest: LoginRequest) => Promise<void>;
	logout: () => void;
	session?: string | null;
	isLoggingOut: boolean;
	setIsLoggingOut: (value: boolean) => void;
}