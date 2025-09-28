
export interface Usuario {
    id_usuario: number;
    nombre: string;
    correo: string;
    contraseña: string;
    telefono : string;
}


export interface Direccion {
    id_direccion: number;
    id_usuario: number;
    direccion: string;
    ciudad: string;
    codigo_postal: string;
}