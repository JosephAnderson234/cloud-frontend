import type { Usuario } from '@interfaces/usuarios';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserStore = {
    usuario: Omit<Usuario, 'contraseña'> | null;
    setUsuario: (usuario: Omit<Usuario, 'contraseña'> | null) => void;
};

export const useUserStore = create<UserStore>()(
    persist(
        (set) => ({
            usuario: null,
            setUsuario: (usuario) => set({ usuario }),
        }),
        {
            name: 'user-auth',
        }
    )
);
