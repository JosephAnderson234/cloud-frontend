import React from 'react';
import useAuth from '@hooks/useAuthContext';

interface ProtectedComponentProps {
  children: React.ReactNode;
    alternative?: React.ReactNode;
}

export const ProtectedComponent: React.FC<ProtectedComponentProps> = ({ children, alternative }) => {
  const { session } = useAuth();

  // Solo mostrar el contenido si el usuario loggeado tiene ID 1
  if (session?.id_usuario === 1) {
    return <>{children}</>;
  }

  // No mostrar nada si no es el usuario con ID 1
  return <>{alternative}</>;
};

export default ProtectedComponent;