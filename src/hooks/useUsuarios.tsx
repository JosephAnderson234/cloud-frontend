import { useState } from 'react';
import type { Usuario, Direccion } from '@interfaces/usuarios';
import type { UserFormData, DirectionFormData } from '@interfaces/usuariosComponents';
import * as usuariosService from '@services/usuarios';

export const useUsuarios = () => {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    

    const createUsuario = async (data: UserFormData): Promise<Usuario> => {
        setLoading(true);
        try {
            const newUser = await usuariosService.createUser(data);
            setUsuarios(prev => [...prev, newUser]);
            return newUser;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error creating user');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateUsuario = async (id: number, data: Partial<UserFormData>): Promise<Usuario> => {
        setLoading(true);
        try {
            const updatedUser = await usuariosService.updateUser(id, data);
            setUsuarios(prev => prev.map(user => user.id_usuario === id ? updatedUser : user));
            return updatedUser;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error updating user');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteUsuario = async (id: number): Promise<void> => {
        setLoading(true);
        try {
            await usuariosService.deleteUser(id);
            setUsuarios(prev => prev.filter(user => user.id_usuario !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error deleting user');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getUsuario = async (id: number): Promise<Usuario> => {
        setLoading(true);
        try {
            return await usuariosService.getUserById(id);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching user');
            throw err;
        } finally {
            setLoading(false);
        }
    };


    return {
        usuarios,
        loading,
        error,
        createUsuario,
        updateUsuario,
        deleteUsuario,
        getUsuario,
        clearError: () => setError(null)
    };
};

export const useDirecciones = () => {
    const [direcciones, setDirecciones] = useState<Direccion[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchDirecciones = async (userId: number) => {
        setLoading(true);
        try {
            const userDirections = await usuariosService.getUserDirections(userId);
            setDirecciones(userDirections);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error fetching directions');
        } finally {
            setLoading(false);
        }
    };

    const createDireccion = async (data: DirectionFormData): Promise<Direccion> => {
        setLoading(true);
        try {
            const newDirection = await usuariosService.addUserDirection(data);
            setDirecciones(prev => [...prev, newDirection]);
            return newDirection;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error creating direction');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateDireccion = async (id: number, data: Partial<DirectionFormData>): Promise<Direccion> => {
        setLoading(true);
        try {
            const updatedDirection = await usuariosService.updateSpecificDirection(id, data);
            setDirecciones(prev => prev.map(dir => dir.id_direccion === id ? updatedDirection : dir));
            return updatedDirection;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error updating direction');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteDireccion = async (id: number): Promise<void> => {
        setLoading(true);
        try {
            await usuariosService.deleteSpecificDirection(id);
            setDirecciones(prev => prev.filter(dir => dir.id_direccion !== id));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error deleting direction');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        direcciones,
        loading,
        error,
        fetchDirecciones,
        createDireccion,
        updateDireccion,
        deleteDireccion,
        clearError: () => setError(null)
    };
};