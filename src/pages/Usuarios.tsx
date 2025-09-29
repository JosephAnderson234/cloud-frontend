import { useState } from 'react';
import type { Usuario } from '@interfaces/usuarios';
import type { UserFormData } from '@interfaces/usuariosComponents';
import { useUsuarios } from '@hooks/useUsuarios';
import Notification from '@components/Notification';
import UserTable from '@components/usuarios/UserTable';
import UserForm from '@components/usuarios/UserForm';
import DirectionModal from '@components/usuarios/DirectionModal';
import ConfirmModal from '@components/usuarios/ConfirmModal';

export default function Usuarios() {
    const { usuarios, loading, error, createUsuario, updateUsuario, deleteUsuario, clearError } = useUsuarios();
    
    // Estados para controlar la UI
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState<Usuario | undefined>();
    const [directionsModal, setDirectionsModal] = useState<{ show: boolean; userId: number; userName: string }>({
        show: false,
        userId: 0,
        userName: ''
    });
    const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; user: Usuario | null }>({
        show: false,
        user: null
    });
    
    // Estados para notificaciones
    const [notification, setNotification] = useState<{
        show: boolean;
        message: string;
        type: 'success' | 'error' | 'info';
    }>({ show: false, message: '', type: 'info' });

    const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
        setNotification({ show: true, message, type });
    };

    const hideNotification = () => {
        setNotification(prev => ({ ...prev, show: false }));
    };

    // Handlers para el formulario de usuario
    const handleCreateUser = async (data: UserFormData | Partial<UserFormData>) => {
        try {
            await createUsuario(data as UserFormData);
            setShowForm(false);
            showNotification('Usuario creado exitosamente', 'success');
        } catch (error) {
            console.error('Error creating user:', error);
            showNotification('Error al crear el usuario', 'error');
        }
    };

    const handleUpdateUser = async (data: UserFormData | Partial<UserFormData>) => {
        if (editingUser) {
            try {
                await updateUsuario(editingUser.id_usuario, data);
                setEditingUser(undefined);
                setShowForm(false);
                showNotification('Usuario actualizado exitosamente', 'success');
            } catch (error) {
                console.error('Error updating user:', error);
                showNotification('Error al actualizar el usuario', 'error');
            }
        }
    };

    const handleDeleteUser = async () => {
        if (deleteConfirm.user) {
            try {
                await deleteUsuario(deleteConfirm.user.id_usuario);
                setDeleteConfirm({ show: false, user: null });
                showNotification('Usuario eliminado exitosamente', 'success');
            } catch (error) {
                console.error('Error deleting user:', error);
                showNotification('Error al eliminar el usuario', 'error');
            }
        }
    };

    // Handlers para la tabla
    const startEdit = (user: Usuario) => {
        setEditingUser(user);
        setShowForm(true);
    };

    const startDelete = (userId: number) => {
        const user = usuarios.find(u => u.id_usuario === userId);
        if (user) {
            setDeleteConfirm({ show: true, user });
        }
    };

    const viewDirections = (userId: number) => {
        const user = usuarios.find(u => u.id_usuario === userId);
        if (user) {
            setDirectionsModal({ show: true, userId, userName: user.nombre });
        }
    };

    const cancelForm = () => {
        setShowForm(false);
        setEditingUser(undefined);
    };

    // Limpiar errores cuando se monta el componente
    const handleErrorClear = () => {
        clearError();
        hideNotification();
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="sm:flex sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
                            <p className="mt-2 text-gray-600">
                                Administra los usuarios del sistema y sus direcciones asociadas.
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            {!showForm && (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Nuevo Usuario
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Error General */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex justify-between items-center">
                            <p className="text-sm text-red-600">{error}</p>
                            <button
                                onClick={handleErrorClear}
                                className="text-red-400 hover:text-red-600"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    {/* Formulario de Usuario */}
                    {showForm && (
                        <UserForm
                            user={editingUser}
                            onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
                            onCancel={cancelForm}
                            loading={loading}
                        />
                    )}

                    {/* Tabla de Usuarios */}
                    <UserTable
                        usuarios={usuarios}
                        onEdit={startEdit}
                        onDelete={startDelete}
                        onViewDirections={viewDirections}
                        loading={loading}
                    />
                </div>
            </div>

            {/* Modal de Direcciones */}
            <DirectionModal
                isOpen={directionsModal.show}
                onClose={() => setDirectionsModal({ show: false, userId: 0, userName: '' })}
                userId={directionsModal.userId}
                userName={directionsModal.userName}
            />

            {/* Modal de Confirmación de Eliminación */}
            <ConfirmModal
                isOpen={deleteConfirm.show}
                onClose={() => setDeleteConfirm({ show: false, user: null })}
                onConfirm={handleDeleteUser}
                title="Eliminar Usuario"
                message={`¿Estás seguro de que deseas eliminar al usuario "${deleteConfirm.user?.nombre}"? Esta acción eliminará también todas sus direcciones asociadas y no se puede deshacer.`}
                loading={loading}
            />

            {/* Notificaciones */}
            <Notification
                message={notification.message}
                visible={notification.show}
                onClose={hideNotification}
                status={notification.type}
            />
        </div>
    );
}
