import type { Usuario } from "@interfaces/usuarios";
import { AuthContext } from "./contexts";
import type { LoginRequest, RegisterRequest } from "@interfaces/authTypes";
import { login, register } from "@services/auth";
import { useUserStore } from "@utils/userStorage";
import { useState } from "react";
async function loginHandler(
    loginRequest: LoginRequest,
    setSession: (value: Omit<Usuario, 'contraseña'> | null) => void,
) {
    const response = await login(loginRequest);
    setSession(response.usuario); 
}

async function signupHandler(
    signupRequest: RegisterRequest,
    setSession: (value: Omit<Usuario, 'contraseña'> | null) => void,
) {
    const response = await register(signupRequest);
    setSession(response.usuario);
}

const AuthProvider = (props: { children: React.ReactNode }) => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const usuario = useUserStore((state) => state.usuario);
    const setUsuario = useUserStore((state) => state.setUsuario);
    
    return (
        <AuthContext.Provider
            value={{
                register: (signupRequest) => signupHandler(signupRequest, setUsuario),
                login: (loginRequest) => loginHandler(loginRequest, setUsuario),
                logout: () => {
                    setIsLoggingOut(true);
                    setUsuario(null);
                },
                session: usuario,
                isLoggingOut,
                setIsLoggingOut,
            }}
        >
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;