import type { LoginRequest, RegisterRequest } from "./authTypes";

export interface LoginFormProps {
    onSubmit: (data: LoginRequest) => void;
    loading: boolean;
}

export interface RegisterFormProps {
    onSubmit: (data: RegisterRequest) => void;
    loading: boolean;
}

export interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    linkText: string;
    linkHref: string;
    linkLabel: string;
}

export interface NavBarProps {
    className?: string;
}

export interface NavigationItem {
    name: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
    requiresAuth?: boolean;
}