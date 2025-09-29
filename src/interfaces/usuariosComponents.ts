import type { Usuario, Direccion } from "./usuarios";

export type UserFormData = Omit<Usuario, 'id_usuario'>;

export type DirectionFormData = Omit<Direccion, 'id_direccion'>;

export interface UserTableProps {
    usuarios: Usuario[];
    onEdit: (usuario: Usuario) => void;
    onDelete: (id: number) => void;
    onViewDirections: (id: number) => void;
    loading: boolean;
}

export interface UserFormProps {
    user?: Usuario;
    onSubmit: (data: UserFormData | Partial<UserFormData>) => void;
    onCancel: () => void;
    loading: boolean;
}

export interface DirectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: number;
    userName: string;
}

export interface DirectionFormProps {
    direction?: Direccion;
    userId: number;
    onSubmit: (data: DirectionFormData) => void;
    onCancel: () => void;
    loading: boolean;
}

export interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    loading: boolean;
}