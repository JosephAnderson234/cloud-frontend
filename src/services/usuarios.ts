import type { Usuario, Direccion, DireccionResponse } from "@interfaces/usuarios";

const API_URL = import.meta.env.VITE_API_URL + "/ms2";


export const getUserById = async (id: number) => {
    const response = await fetch(`${API_URL}/usuarios/${id}`);
    if (!response.ok) {
        throw new Error('Error fetching user');
    }
    return response.json() as Promise<Usuario>;
}

export const createUser = async (user: Omit<Usuario, 'id_usuario'>) => {
    const response = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
    if (!response.ok) {
        throw new Error('Error creating user');
    }
    return response.json() as Promise<Usuario>;
}

export const updateUser = async (id: number, user: Partial<Omit<Usuario, 'id_usuario'>>) => {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });
    if (!response.ok) {
        throw new Error('Error updating user');
    }
    return response.json() as Promise<Usuario>;
}

export const deleteUser = async (id: number) => {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Error deleting user');
    }
    return response.json();
}

export const getUserDirections = async (id_usuario: number) => {
    const response = await fetch(`${API_URL}/direcciones/${id_usuario}`);
    if (!response.ok) {
        throw new Error('Error fetching user directions');
    }
    return response.json() as Promise<DireccionResponse[]>;
}


export const addUserDirection = async (direccion: Omit<Direccion, 'id_direccion'>) => {
    const response = await fetch(`${API_URL}/direcciones`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(direccion)
    });
    if (!response.ok) {
        throw new Error('Error adding user direction');
    }
    return response.json() as Promise<Direccion>;
}


export const updateSpecificDirection = async (id: number, direccion: Partial<Omit<Direccion, 'id_direccion'>>) => {
    const response = await fetch(`${API_URL}/direcciones/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(direccion)
    });
    if (!response.ok) {
        throw new Error('Error updating user direction');
    }
    return response.json() as Promise<Direccion>;
}


export const deleteSpecificDirection = async (id: number) => {
    const response = await fetch(`${API_URL}/direcciones/${id}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Error deleting user direction');
    }
    return response.json();
}